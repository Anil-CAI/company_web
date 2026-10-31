'use client';

import {
  AlertTriangle,
  ArrowUp,
  Check,
  ChevronsLeft,
  ChevronsRight,
  Crosshair,
  Eye,
  Loader2,
  Move,
  Pencil,
  Redo2,
  RotateCcw,
  Trash2,
  Type,
  Undo2,
  X,
} from 'lucide-react';
import { usePathname } from 'next/navigation';
import * as React from 'react';
import { createPortal } from 'react-dom';

import {
  cssColorToHex,
  describe,
  EDITOR_ATTR,
  editableTarget,
  hexToHslTriplet,
  hslTripletToHex,
  isEditorNode,
  isGlobalElement,
  isTextEditable,
  safeQuery,
  selectorFor,
} from '@/components/editor/editor-dom';
import {
  originalText,
  overridesStore,
  rememberOriginalText,
} from '@/components/editor/overrides-store';
import { useScrollTo } from '@/hooks/use-lenis';
import { cn } from '@/lib/utils';
import {
  EDITOR_API,
  emptyOverrides,
  isEmptyOverride,
  normalisePath,
  SCALE_MAX,
  SCALE_MIN,
  THEME_TOKENS,
} from '@/lib/site-overrides';
import type {
  EditableStyleProp,
  ElementOverride,
  SiteOverrides,
  ThemeToken,
} from '@/types/site-overrides';

/**
 * The in-browser visual editor — local tooling, loaded only by
 * `SiteEditorLoader` on localhost under `npm run edit`.
 *
 * Click selects, double-click rewrites text, the handles resize, the panel
 * sets type, colour and spacing, Delete hides. Every change is one entry in an
 * undo history and autosaves to `data/site-overrides.json`; nothing here edits
 * a component. Its own chrome uses fixed neutral colours on purpose, so
 * retheming the site from the Theme tab can never make the editor unreadable.
 */

type Tab = 'element' | 'theme' | 'changes';
type SaveState = 'saved' | 'saving' | 'error';
type StylePatch = Partial<Record<EditableStyleProp, string | null>>;

interface Target {
  el: Element;
  selector: string;
  global: boolean;
  label: string;
}

const HISTORY_LIMIT = 300;
/* Changes to the same control closer together than this are one undo step. */
const COALESCE_MS = 1000;
const SAVE_DELAY_MS = 500;

const px = (value: string) => parseFloat(value) || 0;

/** "12px -4px" → [12, -4]; a single value moves along x only. */
function parseTranslate(value: string | undefined): [number, number] {
  const [x = 0, y = 0] = (value ?? '').match(/-?[\d.]+/g)?.map(Number) ?? [];
  return [x, y];
}
const round = (n: number, places: number) => Number(n.toFixed(places));

function toTarget(el: Element): Target {
  return { el, selector: selectorFor(el), global: isGlobalElement(el), label: describe(el) };
}

/* ------------------------------------------------------------ controls -- */

interface NumSpec {
  prop: EditableStyleProp;
  label: string;
  min: number;
  max: number;
  step: number;
  unit: 'px' | 'em' | '';
  read: (el: Element, cs: CSSStyleDeclaration) => number;
}

const TEXT_NUMS: NumSpec[] = [
  {
    prop: 'font-size',
    label: 'Text size',
    min: 8,
    max: 200,
    step: 1,
    unit: 'px',
    read: (_, cs) => px(cs.fontSize),
  },
  {
    prop: 'line-height',
    label: 'Line height',
    min: 0.8,
    max: 3,
    step: 0.05,
    unit: '',
    read: (_, cs) =>
      cs.lineHeight === 'normal' ? 1.2 : round(px(cs.lineHeight) / px(cs.fontSize), 2),
  },
  {
    prop: 'letter-spacing',
    label: 'Letter spacing',
    min: -0.1,
    max: 0.5,
    step: 0.005,
    unit: 'em',
    read: (_, cs) =>
      cs.letterSpacing === 'normal' ? 0 : round(px(cs.letterSpacing) / px(cs.fontSize), 3),
  },
];

const BOX_NUMS: NumSpec[] = [
  {
    prop: 'width',
    label: 'Width',
    min: 16,
    max: 2000,
    step: 1,
    unit: 'px',
    read: (el) => Math.round(el.getBoundingClientRect().width),
  },
  {
    prop: 'min-height',
    label: 'Height',
    min: 0,
    max: 2400,
    step: 1,
    unit: 'px',
    read: (el) => Math.round(el.getBoundingClientRect().height),
  },
  {
    prop: 'padding-top',
    label: 'Padding top',
    min: 0,
    max: 400,
    step: 1,
    unit: 'px',
    read: (_, cs) => px(cs.paddingTop),
  },
  {
    prop: 'padding-bottom',
    label: 'Padding bottom',
    min: 0,
    max: 400,
    step: 1,
    unit: 'px',
    read: (_, cs) => px(cs.paddingBottom),
  },
  {
    prop: 'padding-left',
    label: 'Padding left',
    min: 0,
    max: 400,
    step: 1,
    unit: 'px',
    read: (_, cs) => px(cs.paddingLeft),
  },
  {
    prop: 'padding-right',
    label: 'Padding right',
    min: 0,
    max: 400,
    step: 1,
    unit: 'px',
    read: (_, cs) => px(cs.paddingRight),
  },
  {
    prop: 'margin-top',
    label: 'Space above',
    min: -200,
    max: 400,
    step: 1,
    unit: 'px',
    read: (_, cs) => px(cs.marginTop),
  },
  {
    prop: 'margin-bottom',
    label: 'Space below',
    min: -200,
    max: 400,
    step: 1,
    unit: 'px',
    read: (_, cs) => px(cs.marginBottom),
  },
  {
    prop: 'border-radius',
    label: 'Corner radius',
    min: 0,
    max: 200,
    step: 1,
    unit: 'px',
    read: (_, cs) => px(cs.borderTopLeftRadius),
  },
  {
    prop: 'opacity',
    label: 'Opacity',
    min: 0,
    max: 1,
    step: 0.01,
    unit: '',
    read: (_, cs) => round(px(cs.opacity), 2),
  },
];

const SELECTS: {
  prop: EditableStyleProp;
  label: string;
  options: string[];
  read: (cs: CSSStyleDeclaration) => string;
}[] = [
  {
    prop: 'font-weight',
    label: 'Weight',
    options: ['300', '400', '500', '600', '700', '800', '900'],
    read: (cs) => cs.fontWeight,
  },
  { prop: 'font-style', label: 'Style', options: ['normal', 'italic'], read: (cs) => cs.fontStyle },
  {
    prop: 'text-transform',
    label: 'Case',
    options: ['none', 'uppercase', 'lowercase', 'capitalize'],
    read: (cs) => cs.textTransform,
  },
];

const ALIGNS = ['left', 'center', 'right', 'justify'] as const;

/* ------------------------------------------------------------- styling -- */

const ui = {
  panel:
    'fixed bottom-0 right-0 top-0 z-[2147483001] flex w-[340px] max-w-[92vw] flex-col border-l border-[#2a2a33] bg-[#121216] text-[13px] leading-snug text-[#e8e8ee] shadow-2xl',
  section: 'border-t border-[#24242c] px-4 py-4',
  heading: 'mb-3 block text-[11px] font-semibold uppercase tracking-[0.12em] text-[#8b8b99]',
  btn: 'inline-flex items-center gap-1.5 rounded-md border border-[#30303b] bg-[#1b1b22] px-2.5 py-1.5 text-[12px] text-[#e8e8ee] transition-colors hover:bg-[#262630] disabled:cursor-not-allowed disabled:opacity-40',
  danger: 'border-[#5a2a2e] text-[#ff9aa0] hover:bg-[#2a1517]',
  input: 'rounded border border-[#30303b] bg-[#0c0c10] px-1.5 py-1 text-[12px] text-[#e8e8ee]',
  muted: 'text-[#8b8b99]',
};

function Dot({ on }: { on: boolean }) {
  return (
    <span
      className={cn('inline-block size-1.5 rounded-full', on ? 'bg-[#4f8cff]' : 'bg-transparent')}
    />
  );
}

function ClearButton({
  show,
  onClick,
  title,
}: {
  show: boolean;
  onClick: () => void;
  title: string;
}) {
  if (!show) return <span className="w-5" />;
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className="grid size-5 place-items-center rounded text-[#8b8b99] hover:bg-[#262630] hover:text-white"
    >
      <X className="size-3.5" />
    </button>
  );
}

/* -------------------------------------------------------------- editor -- */

export function SiteEditor() {
  const path = normalisePath(usePathname() ?? '/');
  const scrollTo = useScrollTo();
  const state = React.useSyncExternalStore(
    overridesStore.subscribe,
    overridesStore.get,
    overridesStore.get,
  );

  const [active, setActive] = React.useState(false);
  const [panelOpen, setPanelOpen] = React.useState(true);
  const [tab, setTab] = React.useState<Tab>('element');
  const [target, setTarget] = React.useState<Target | null>(null);
  const [save, setSave] = React.useState<SaveState>('saved');
  const [, rerender] = React.useReducer((n: number) => n + 1, 0);
  const [portal, setPortal] = React.useState<HTMLElement | null>(null);

  const past = React.useRef<SiteOverrides[]>([]);
  const future = React.useRef<SiteOverrides[]>([]);
  const lastChange = React.useRef<{ key: string; at: number } | null>(null);
  const saveTimer = React.useRef(0);
  const unsaved = React.useRef(false);

  const targetRef = React.useRef<Target | null>(null);
  targetRef.current = target;
  const hoverEl = React.useRef<Element | null>(null);
  const editingRef = React.useRef<HTMLElement | null>(null);
  const hoverBox = React.useRef<HTMLDivElement>(null);
  const selBox = React.useRef<HTMLDivElement>(null);
  const selLabel = React.useRef<HTMLSpanElement>(null);

  /* The editor renders into its own node at the end of <body>, so it never
     shifts the position of anything a saved selector counts. */
  React.useEffect(() => {
    const node = document.createElement('div');
    node.setAttribute(EDITOR_ATTR, '');
    document.body.appendChild(node);
    setPortal(node);
    return () => node.remove();
  }, []);

  /* ---------------------------------------------------------- saving -- */

  const flush = React.useCallback(async (keepalive = false) => {
    window.clearTimeout(saveTimer.current);
    try {
      const res = await fetch(EDITOR_API, {
        method: 'PUT',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(overridesStore.get()),
        keepalive,
      });
      if (!res.ok) throw new Error(String(res.status));
      unsaved.current = false;
      setSave('saved');
    } catch {
      setSave('error');
    }
  }, []);

  const persist = React.useCallback(() => {
    unsaved.current = true;
    setSave('saving');
    window.clearTimeout(saveTimer.current);
    saveTimer.current = window.setTimeout(() => void flush(), SAVE_DELAY_MS);
  }, [flush]);

  React.useEffect(() => {
    const onLeave = () => {
      if (unsaved.current) void flush(true);
    };
    window.addEventListener('beforeunload', onLeave);
    return () => window.removeEventListener('beforeunload', onLeave);
  }, [flush]);

  /* --------------------------------------------------------- history -- */

  const commit = React.useCallback(
    (next: SiteOverrides, key?: string) => {
      const now = Date.now();
      const last = lastChange.current;
      if (!(key && last && last.key === key && now - last.at < COALESCE_MS)) {
        past.current.push(overridesStore.get());
        if (past.current.length > HISTORY_LIMIT) past.current.shift();
        future.current = [];
      }
      lastChange.current = key ? { key, at: now } : null;
      overridesStore.set(next);
      persist();
    },
    [persist],
  );

  const undo = React.useCallback(() => {
    const previous = past.current.pop();
    if (!previous) return;
    future.current.push(overridesStore.get());
    lastChange.current = null;
    overridesStore.set(previous);
    persist();
  }, [persist]);

  const redo = React.useCallback(() => {
    const next = future.current.pop();
    if (!next) return;
    past.current.push(overridesStore.get());
    lastChange.current = null;
    overridesStore.set(next);
    persist();
  }, [persist]);

  /* ------------------------------------------------------- mutations -- */

  const overrideOf = React.useCallback(
    (t: Target): ElementOverride =>
      (t.global ? state.global : (state.pages[path] ?? {}))[t.selector] ?? {},
    [state, path],
  );

  const updateEl = React.useCallback(
    (t: Target, fn: (o: ElementOverride) => ElementOverride, key?: string) => {
      const next = structuredClone(overridesStore.get());
      const bucket = t.global ? next.global : (next.pages[path] ??= {});
      const current = bucket[t.selector] ?? {};
      const result = fn({ ...current, style: { ...current.style } });
      if (result.style && Object.keys(result.style).length === 0) delete result.style;

      if (isEmptyOverride(result)) delete bucket[t.selector];
      else bucket[t.selector] = { ...result, label: result.label ?? t.label };
      if (!t.global && Object.keys(bucket).length === 0) delete next.pages[path];

      commit(next, key);
    },
    [commit, path],
  );

  const setStyles = React.useCallback(
    (t: Target, patch: StylePatch, key?: string) =>
      updateEl(
        t,
        (o) => {
          const style = { ...o.style };
          for (const [prop, value] of Object.entries(patch) as [
            EditableStyleProp,
            string | null,
          ][]) {
            if (value === null) delete style[prop];
            else style[prop] = value;
          }
          return { ...o, style };
        },
        key,
      ),
    [updateEl],
  );

  const select = React.useCallback((el: Element | null) => {
    setTarget(el ? toTarget(el) : null);
    if (el) {
      setTab('element');
      setPanelOpen(true);
    }
  }, []);

  const hide = React.useCallback(
    (t: Target) => {
      updateEl(t, (o) => ({ ...o, hidden: true }));
      setTarget(null);
    },
    [updateEl],
  );

  const revokeEl = React.useCallback((t: Target) => updateEl(t, () => ({})), [updateEl]);

  const moveTo = React.useCallback(
    (t: Target, x: number, y: number, key?: string) =>
      setStyles(
        t,
        { translate: x === 0 && y === 0 ? null : `${Math.round(x)}px ${Math.round(y)}px` },
        key,
      ),
    [setStyles],
  );

  const nudge = React.useCallback(
    (t: Target, arrow: string, step: number) => {
      const own = (
        t.global ? overridesStore.get().global : (overridesStore.get().pages[path] ?? {})
      )[t.selector];
      const [x, y] = parseTranslate(own?.style?.translate);
      const dx = arrow === 'arrowleft' ? -step : arrow === 'arrowright' ? step : 0;
      const dy = arrow === 'arrowup' ? -step : arrow === 'arrowdown' ? step : 0;
      moveTo(t, x + dx, y + dy, `${t.selector}|nudge`);
    },
    [moveTo, path],
  );

  /* ------------------------------------------------------- text edit -- */

  const beginTextEdit = React.useCallback(
    (el: Element) => {
      if (!(el instanceof HTMLElement) || !isTextEditable(el) || editingRef.current) return;
      const t = toTarget(el);
      rememberOriginalText(el);
      const before = el.textContent ?? '';
      let done = false;

      const finish = (keep: boolean) => {
        if (done) return;
        done = true;
        el.removeEventListener('keydown', onKey);
        el.removeEventListener('blur', onBlur);
        el.removeAttribute('contenteditable');
        editingRef.current = null;
        rerender();

        const after = el.textContent ?? '';
        if (!keep) {
          if (after !== before) el.textContent = before;
          return;
        }
        if (after === before) return;
        const original = originalText.get(el);
        updateEl(t, (o) => {
          const next = { ...o };
          if (after === original) delete next.text;
          else next.text = after;
          return next;
        });
      };
      const onKey = (e: KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          el.blur();
        } else if (e.key === 'Escape') {
          e.preventDefault();
          e.stopPropagation();
          finish(false);
          el.blur();
        }
      };
      const onBlur = () => finish(true);

      editingRef.current = el;
      try {
        el.contentEditable = 'plaintext-only';
      } catch {
        el.contentEditable = 'true';
      }
      el.addEventListener('keydown', onKey);
      el.addEventListener('blur', onBlur);
      el.focus();
      const range = document.createRange();
      range.selectNodeContents(el);
      window.getSelection()?.removeAllRanges();
      window.getSelection()?.addRange(range);
      setTarget(t);
      rerender();
    },
    [updateEl],
  );

  /* ------------------------------------------------ page interaction -- */

  React.useEffect(() => {
    if (!active) return;

    const insideEditing = (node: EventTarget | null) =>
      Boolean(editingRef.current && node instanceof Node && editingRef.current.contains(node));

    const onMove = (e: PointerEvent) => {
      hoverEl.current = editableTarget(e.target);
    };

    /* Swallow the press so links, buttons and drags on the page stay still. */
    const onDown = (e: Event) => {
      if (isEditorNode(e.target as Node) || insideEditing(e.target)) return;
      editingRef.current?.blur();
      e.preventDefault();
      e.stopPropagation();
    };

    const onClick = (e: MouseEvent) => {
      if (isEditorNode(e.target as Node) || insideEditing(e.target)) return;
      e.preventDefault();
      e.stopPropagation();
      select(editableTarget(e.target));
    };

    const onDoubleClick = (e: MouseEvent) => {
      if (isEditorNode(e.target as Node) || insideEditing(e.target)) return;
      const el = editableTarget(e.target);
      if (!el || !isTextEditable(el)) return;
      e.preventDefault();
      e.stopPropagation();
      beginTextEdit(el);
    };

    const block = (e: Event) => {
      if (isEditorNode(e.target as Node)) return;
      e.preventDefault();
      e.stopPropagation();
    };

    const opts = { capture: true };
    window.addEventListener('pointermove', onMove, opts);
    window.addEventListener('pointerdown', onDown, opts);
    window.addEventListener('mousedown', onDown, opts);
    window.addEventListener('click', onClick, opts);
    window.addEventListener('dblclick', onDoubleClick, opts);
    window.addEventListener('submit', block, opts);
    window.addEventListener('auxclick', block, opts);
    document.documentElement.style.cursor = 'crosshair';
    document.documentElement.setAttribute('data-site-editing', '');

    return () => {
      window.removeEventListener('pointermove', onMove, opts);
      window.removeEventListener('pointerdown', onDown, opts);
      window.removeEventListener('mousedown', onDown, opts);
      window.removeEventListener('click', onClick, opts);
      window.removeEventListener('dblclick', onDoubleClick, opts);
      window.removeEventListener('submit', block, opts);
      window.removeEventListener('auxclick', block, opts);
      document.documentElement.style.cursor = '';
      document.documentElement.removeAttribute('data-site-editing');
      hoverEl.current = null;
    };
  }, [active, select, beginTextEdit]);

  React.useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement | null;
      const typing = Boolean(
        el &&
        (el.isContentEditable ||
          el.tagName === 'TEXTAREA' ||
          el.tagName === 'SELECT' ||
          (el.tagName === 'INPUT' &&
            !['range', 'color', 'button'].includes((el as HTMLInputElement).type))),
      );
      if (typing) return;
      const mod = e.ctrlKey || e.metaKey;
      const key = e.key.toLowerCase();

      if (mod && key === 'z') {
        e.preventDefault();
        if (e.shiftKey) redo();
        else undo();
      } else if (mod && key === 'y') {
        e.preventDefault();
        redo();
      } else if (key.startsWith('arrow') && targetRef.current) {
        e.preventDefault();
        nudge(targetRef.current, key, e.shiftKey ? 10 : 1);
      } else if (key === 'escape') {
        setTarget(null);
      } else if ((key === 'delete' || key === 'backspace') && targetRef.current) {
        e.preventDefault();
        hide(targetRef.current);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [active, undo, redo, hide, nudge]);

  /* A new page means the selected element is gone. */
  React.useEffect(() => {
    setTarget(null);
  }, [path]);

  /* Re-read computed styles once the live stylesheet has caught up. */
  React.useEffect(() => {
    const id = requestAnimationFrame(rerender);
    return () => cancelAnimationFrame(id);
  }, [state, target]);

  /* --------------------------------------------------------- overlay -- */

  React.useEffect(() => {
    if (!active) return;
    let raf = 0;

    const place = (box: HTMLDivElement | null, el: Element | null) => {
      if (!box) return;
      const rect = el?.isConnected ? el.getBoundingClientRect() : null;
      if (!rect || (rect.width === 0 && rect.height === 0)) {
        box.style.display = 'none';
        return;
      }
      box.style.display = 'block';
      box.style.transform = `translate(${rect.left}px, ${rect.top}px)`;
      box.style.width = `${rect.width}px`;
      box.style.height = `${rect.height}px`;
    };

    const tick = () => {
      const t = targetRef.current;
      /* React may have replaced the node; find it again by its address. */
      if (t && !t.el.isConnected) {
        const again = safeQuery(t.selector);
        if (again) t.el = again;
      }
      const selected = t?.el ?? null;
      place(hoverBox.current, hoverEl.current === selected ? null : hoverEl.current);
      place(selBox.current, selected);
      if (selected && selLabel.current) {
        const rect = selected.getBoundingClientRect();
        const text = `${selected.localName}  ${Math.round(rect.width)} × ${Math.round(rect.height)}`;
        if (selLabel.current.textContent !== text) selLabel.current.textContent = text;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active]);

  const startMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const t = targetRef.current;
    if (!t) return;
    e.preventDefault();
    e.stopPropagation();
    const handle = e.currentTarget;
    handle.setPointerCapture(e.pointerId);
    const own = (t.global ? overridesStore.get().global : (overridesStore.get().pages[path] ?? {}))[
      t.selector
    ];
    const [x0, y0] = parseTranslate(own?.style?.translate);
    const startX = e.clientX;
    const startY = e.clientY;
    const key = `${t.selector}|move|${Date.now()}`;
    const move = (ev: PointerEvent) =>
      moveTo(t, x0 + ev.clientX - startX, y0 + ev.clientY - startY, key);
    const up = () => {
      handle.removeEventListener('pointermove', move);
      handle.removeEventListener('pointerup', up);
      handle.removeEventListener('pointercancel', up);
    };
    handle.addEventListener('pointermove', move);
    handle.addEventListener('pointerup', up);
    handle.addEventListener('pointercancel', up);
  };

  const startResize = (mode: 'x' | 'y' | 'xy') => (e: React.PointerEvent<HTMLDivElement>) => {
    const t = targetRef.current;
    if (!t) return;
    e.preventDefault();
    e.stopPropagation();

    const handle = e.currentTarget;
    handle.setPointerCapture(e.pointerId);
    const rect = t.el.getBoundingClientRect();
    const startX = e.clientX;
    const startY = e.clientY;
    const inline = getComputedStyle(t.el).display === 'inline';
    const key = `${t.selector}|resize|${Date.now()}`;

    const move = (ev: PointerEvent) => {
      const patch: StylePatch = {};
      if (mode !== 'y') {
        patch.width = `${Math.max(16, Math.round(rect.width + ev.clientX - startX))}px`;
        patch['max-width'] = 'none';
      }
      if (mode !== 'x') {
        patch['min-height'] = `${Math.max(0, Math.round(rect.height + ev.clientY - startY))}px`;
      }
      if (inline) patch.display = 'inline-block';
      setStyles(t, patch, key);
    };
    const up = () => {
      handle.removeEventListener('pointermove', move);
      handle.removeEventListener('pointerup', up);
      handle.removeEventListener('pointercancel', up);
    };
    handle.addEventListener('pointermove', move);
    handle.addEventListener('pointerup', up);
    handle.addEventListener('pointercancel', up);
  };

  /* --------------------------------------------------------- changes -- */

  const changes = React.useMemo(() => {
    const rows: { selector: string; global: boolean; o: ElementOverride }[] = [];
    for (const [selector, o] of Object.entries(state.global))
      rows.push({ selector, global: true, o });
    for (const [selector, o] of Object.entries(state.pages[path] ?? {}))
      rows.push({ selector, global: false, o });
    return rows;
  }, [state, path]);

  const otherPages = Object.entries(state.pages).filter(
    ([p, bucket]) => p !== path && Object.keys(bucket).length > 0,
  );
  const themeCount = Object.keys(state.theme).length + (state.scale ? 1 : 0);
  const changeCount = changes.length + themeCount;

  const rowTarget = (selector: string, global: boolean, o: ElementOverride): Target => ({
    el: safeQuery(selector) ?? document.body,
    selector,
    global,
    label: o.label ?? selector,
  });

  const revokePage = (p: string) => {
    const next = structuredClone(overridesStore.get());
    delete next.pages[p];
    commit(next);
  };

  const resetAll = () => {
    if (
      !window.confirm(
        'Remove every edit on every page, including the theme? You can still undo this until you reload.',
      )
    )
      return;
    setTarget(null);
    commit(emptyOverrides());
  };

  /* ----------------------------------------------------------- theme -- */

  const setTheme = (token: ThemeToken, hex: string | null) => {
    const next = structuredClone(overridesStore.get());
    if (hex === null) delete next.theme[token];
    else next.theme[token] = hexToHslTriplet(hex);
    commit(next, `theme|${token}`);
  };

  const setScale = (value: number | null) => {
    const next = structuredClone(overridesStore.get());
    if (value === null || value === 100) delete next.scale;
    else next.scale = value;
    commit(next, 'scale');
  };

  const tokenHex = (token: ThemeToken) => {
    const own = state.theme[token];
    const raw =
      own ?? getComputedStyle(document.documentElement).getPropertyValue(`--${token}`).trim();
    return raw ? hslTripletToHex(raw) : '#000000';
  };

  if (!portal) return null;

  /* ---------------------------------------------------------- render -- */

  const canUndo = past.current.length > 0;
  const canRedo = future.current.length > 0;
  const editing = editingRef.current !== null;

  const toolbar = (
    <div className="fixed bottom-4 left-4 z-[2147483002] flex items-center gap-1.5 rounded-xl border border-[#30303b] bg-[#121216]/95 p-1.5 text-[12px] text-[#e8e8ee] shadow-2xl backdrop-blur">
      {active ? (
        <>
          <button
            type="button"
            className={cn(ui.btn, 'border-[#3a5ea8] bg-[#1d2c4d]')}
            onClick={() => {
              setActive(false);
              setTarget(null);
            }}
          >
            <Check className="size-3.5" /> Done
          </button>
          <button
            type="button"
            className={ui.btn}
            onClick={undo}
            disabled={!canUndo}
            title="Undo (Ctrl+Z)"
          >
            <Undo2 className="size-3.5" /> Undo
          </button>
          <button
            type="button"
            className={ui.btn}
            onClick={redo}
            disabled={!canRedo}
            title="Redo (Ctrl+Shift+Z)"
          >
            <Redo2 className="size-3.5" /> Redo
          </button>
          {!panelOpen ? (
            <button type="button" className={ui.btn} onClick={() => setPanelOpen(true)}>
              <ChevronsLeft className="size-3.5" /> Panel
            </button>
          ) : null}
        </>
      ) : (
        <button
          type="button"
          className={cn(ui.btn, 'border-[#3a5ea8] bg-[#1d2c4d]')}
          onClick={() => setActive(true)}
        >
          <Pencil className="size-3.5" /> Edit site
        </button>
      )}
      <span className="flex items-center gap-1 px-1.5" aria-live="polite">
        {save === 'saving' ? (
          <>
            <Loader2 className="size-3.5 animate-spin text-[#8b8b99]" />
            <span className={ui.muted}>Saving</span>
          </>
        ) : save === 'error' ? (
          <button
            type="button"
            className="flex items-center gap-1 text-[#ff9aa0]"
            onClick={() => void flush()}
          >
            <AlertTriangle className="size-3.5" /> Not saved — retry
          </button>
        ) : (
          <>
            <Check className="size-3.5 text-[#5fd08a]" />
            <span className={ui.muted}>Saved</span>
          </>
        )}
      </span>
    </div>
  );

  const overlay = active ? (
    <div className="pointer-events-none fixed inset-0 z-[2147483000]">
      <div
        ref={hoverBox}
        className="absolute left-0 top-0 hidden rounded-[2px] outline outline-1 outline-dashed outline-[#4f8cff]"
      />
      <div
        ref={selBox}
        className="absolute left-0 top-0 hidden outline outline-2 outline-[#4f8cff]"
      >
        <span
          ref={selLabel}
          className="absolute -top-6 left-4 whitespace-nowrap rounded bg-[#4f8cff] px-1.5 py-0.5 font-mono text-[11px] text-white"
        />
        {!editing && target ? (
          <>
            <div
              onPointerDown={startMove}
              title="Drag to move (arrow keys nudge, Shift for 10px)"
              className="pointer-events-auto absolute -left-3 -top-3 grid size-6 cursor-move place-items-center rounded-full border border-white bg-[#4f8cff] text-white shadow"
            >
              <Move className="size-3.5" />
            </div>
            <div
              onPointerDown={startResize('x')}
              title="Drag to resize width"
              className="pointer-events-auto absolute -right-1.5 top-1/2 h-8 w-3 -translate-y-1/2 cursor-ew-resize rounded-sm border border-white bg-[#4f8cff]"
            />
            <div
              onPointerDown={startResize('y')}
              title="Drag to resize height"
              className="pointer-events-auto absolute -bottom-1.5 left-1/2 h-3 w-8 -translate-x-1/2 cursor-ns-resize rounded-sm border border-white bg-[#4f8cff]"
            />
            <div
              onPointerDown={startResize('xy')}
              title="Drag to resize"
              className="pointer-events-auto absolute -bottom-2 -right-2 size-4 cursor-nwse-resize rounded-sm border border-white bg-[#4f8cff]"
            />
          </>
        ) : null}
      </div>
    </div>
  ) : null;

  const elementTab = (() => {
    if (!target) {
      return (
        <div className="px-4 py-6 text-[#b4b4c2]">
          <span className="block">Click anything on the page to select it.</span>
          <span className="mt-2 block">
            Double-click text to rewrite it. Drag the blue handles to resize. Press Delete to remove
            the selection, Ctrl+Z to undo.
          </span>
        </div>
      );
    }

    const t = target;
    const o = overrideOf(t);
    const style = o.style ?? {};
    const cs = getComputedStyle(t.el);
    const textual = isTextEditable(t.el);
    const parent = t.el.parentElement;
    const canParent = Boolean(
      parent && parent !== document.body && parent !== document.documentElement,
    );

    const numRow = (spec: NumSpec) => {
      const own = style[spec.prop];
      const value = own !== undefined ? px(own) : spec.read(t.el, cs);
      const max = Math.max(spec.max, Math.ceil(value * 1.5));
      const apply = (v: number) => {
        if (!Number.isFinite(v)) return;
        const patch: StylePatch = { [spec.prop]: `${v}${spec.unit}` };
        if (spec.prop === 'width') patch['max-width'] = 'none';
        if ((spec.prop === 'width' || spec.prop === 'min-height') && cs.display === 'inline')
          patch.display = 'inline-block';
        setStyles(t, patch, `${t.selector}|${spec.prop}`);
      };
      const clear = () => {
        const patch: StylePatch = { [spec.prop]: null };
        if (spec.prop === 'width') patch['max-width'] = null;
        setStyles(t, patch);
      };
      return (
        <div
          key={spec.prop}
          className="grid grid-cols-[92px_1fr_76px_20px] items-center gap-2 py-1"
        >
          <span className="flex items-center gap-1.5 text-[#b4b4c2]">
            <Dot on={own !== undefined} />
            {spec.label}
          </span>
          <input
            type="range"
            min={spec.min}
            max={max}
            step={spec.step}
            value={value}
            onChange={(e) => apply(Number(e.target.value))}
            className="accent-[#4f8cff]"
          />
          <input
            type="number"
            min={spec.min}
            max={max}
            step={spec.step}
            value={value}
            onChange={(e) => apply(Number(e.target.value))}
            className={ui.input}
          />
          <ClearButton show={own !== undefined} onClick={clear} title="Revoke this change" />
        </div>
      );
    };

    const colorRow = (prop: 'color' | 'background-color', label: string) => {
      const own = style[prop];
      const current =
        own ?? cssColorToHex(prop === 'color' ? cs.color : cs.backgroundColor) ?? '#000000';
      return (
        <div key={prop} className="grid grid-cols-[96px_1fr_20px] items-center gap-2 py-1">
          <span className="flex items-center gap-1.5 text-[#b4b4c2]">
            <Dot on={own !== undefined} />
            {label}
          </span>
          <span className="flex items-center gap-2">
            <input
              type="color"
              value={current}
              onChange={(e) => setStyles(t, { [prop]: e.target.value }, `${t.selector}|${prop}`)}
              className="h-7 w-12 cursor-pointer rounded border border-[#30303b] bg-transparent"
            />
            <span className="font-mono text-[11px] text-[#8b8b99]">{current}</span>
          </span>
          <ClearButton
            show={own !== undefined}
            onClick={() => setStyles(t, { [prop]: null })}
            title="Revoke this change"
          />
        </div>
      );
    };

    const ownAlign = style['text-align'];
    const align =
      ownAlign ??
      (cs.textAlign === 'start' ? 'left' : cs.textAlign === 'end' ? 'right' : cs.textAlign);

    return (
      <>
        <div className="px-4 py-4">
          <span className="block truncate text-[14px] font-medium text-white" title={t.label}>
            {t.label}
          </span>
          <span className="mt-1 flex items-center gap-2">
            <span className="rounded bg-[#24242c] px-1.5 py-0.5 text-[11px] text-[#b4b4c2]">
              {t.global ? 'Every page' : 'This page'}
            </span>
            <span className="truncate font-mono text-[10px] text-[#6c6c7a]" title={t.selector}>
              {t.selector}
            </span>
          </span>
          <div className="mt-3 flex flex-wrap gap-1.5">
            <button
              type="button"
              className={ui.btn}
              disabled={!canParent}
              onClick={() => parent && select(parent)}
              title="Select the element that contains this one"
            >
              <ArrowUp className="size-3.5" /> Parent
            </button>
            <button
              type="button"
              className={ui.btn}
              disabled={!textual}
              onClick={() => beginTextEdit(t.el)}
              title={
                textual
                  ? 'Rewrite this text'
                  : 'This element holds more than plain text — select the text itself'
              }
            >
              <Type className="size-3.5" /> Edit text
            </button>
            <button
              type="button"
              className={cn(ui.btn, ui.danger)}
              onClick={() => hide(t)}
              title="Remove from the page — restore it any time from Changes"
            >
              <Trash2 className="size-3.5" /> Delete
            </button>
            <button
              type="button"
              className={ui.btn}
              disabled={isEmptyOverride(o)}
              onClick={() => revokeEl(t)}
              title="Undo every edit made to this element"
            >
              <RotateCcw className="size-3.5" /> Revoke all
            </button>
          </div>
          {o.text !== undefined ? (
            <div className="mt-3 flex items-center justify-between rounded-md bg-[#1b1b22] px-2.5 py-2 text-[12px]">
              <span className="text-[#b4b4c2]">Text rewritten</span>
              <button
                type="button"
                className="text-[#7fa8ff] hover:underline"
                onClick={() =>
                  updateEl(t, (cur) => {
                    const next = { ...cur };
                    delete next.text;
                    return next;
                  })
                }
              >
                Restore original
              </button>
            </div>
          ) : null}
        </div>

        <div className={ui.section}>
          <span className={ui.heading}>Text</span>
          {TEXT_NUMS.map(numRow)}
          {SELECTS.map((s) => {
            const own = style[s.prop];
            const value = own ?? s.read(cs);
            return (
              <div key={s.prop} className="grid grid-cols-[96px_1fr_20px] items-center gap-2 py-1">
                <span className="flex items-center gap-1.5 text-[#b4b4c2]">
                  <Dot on={own !== undefined} />
                  {s.label}
                </span>
                <select
                  value={s.options.includes(value) ? value : ''}
                  onChange={(e) => setStyles(t, { [s.prop]: e.target.value })}
                  className={ui.input}
                >
                  {!s.options.includes(value) ? <option value="">{value}</option> : null}
                  {s.options.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
                <ClearButton
                  show={own !== undefined}
                  onClick={() => setStyles(t, { [s.prop]: null })}
                  title="Revoke this change"
                />
              </div>
            );
          })}
          <div className="grid grid-cols-[96px_1fr_20px] items-center gap-2 py-1">
            <span className="flex items-center gap-1.5 text-[#b4b4c2]">
              <Dot on={ownAlign !== undefined} />
              Align
            </span>
            <span className="flex gap-1">
              {ALIGNS.map((a) => (
                <button
                  key={a}
                  type="button"
                  onClick={() => setStyles(t, { 'text-align': a })}
                  className={cn(
                    'flex-1 rounded border px-1 py-1 text-[11px] capitalize',
                    align === a
                      ? 'border-[#4f8cff] bg-[#1d2c4d] text-white'
                      : 'border-[#30303b] bg-[#1b1b22] text-[#b4b4c2]',
                  )}
                >
                  {a}
                </button>
              ))}
            </span>
            <ClearButton
              show={ownAlign !== undefined}
              onClick={() => setStyles(t, { 'text-align': null })}
              title="Revoke this change"
            />
          </div>
          {colorRow('color', 'Text colour')}
        </div>

        <div className={ui.section}>
          <span className={ui.heading}>Size &amp; spacing</span>
          {BOX_NUMS.map(numRow)}
          {(['x', 'y'] as const).map((axis) => {
            const [x, y] = parseTranslate(style.translate);
            const value = axis === 'x' ? x : y;
            const set = (v: number) => {
              if (Number.isFinite(v))
                moveTo(t, axis === 'x' ? v : x, axis === 'y' ? v : y, `${t.selector}|move-${axis}`);
            };
            return (
              <div
                key={axis}
                className="grid grid-cols-[92px_1fr_76px_20px] items-center gap-2 py-1"
              >
                <span className="flex items-center gap-1.5 text-[#b4b4c2]">
                  <Dot on={value !== 0} />
                  {axis === 'x' ? 'Move left/right' : 'Move up/down'}
                </span>
                <input
                  type="range"
                  min={-800}
                  max={800}
                  step={1}
                  value={value}
                  onChange={(e) => set(Number(e.target.value))}
                  className="accent-[#4f8cff]"
                />
                <input
                  type="number"
                  step={1}
                  value={value}
                  onChange={(e) => set(Number(e.target.value))}
                  className={ui.input}
                />
                <ClearButton
                  show={value !== 0}
                  onClick={() => set(0)}
                  title="Back to its original place"
                />
              </div>
            );
          })}
          {colorRow('background-color', 'Background')}
        </div>
      </>
    );
  })();

  const themeTab = (
    <>
      <div className="px-4 py-4">
        <span className={ui.heading}>Overall size</span>
        <div className="grid grid-cols-[92px_1fr_76px_20px] items-center gap-2">
          <span className="flex items-center gap-1.5 text-[#b4b4c2]">
            <Dot on={Boolean(state.scale)} />
            Site scale %
          </span>
          <input
            type="range"
            min={SCALE_MIN}
            max={SCALE_MAX}
            step={1}
            value={state.scale ?? 100}
            onChange={(e) => setScale(Number(e.target.value))}
            className="accent-[#4f8cff]"
          />
          <input
            type="number"
            min={SCALE_MIN}
            max={SCALE_MAX}
            value={state.scale ?? 100}
            onChange={(e) => {
              const v = Number(e.target.value);
              if (v >= SCALE_MIN && v <= SCALE_MAX) setScale(v);
            }}
            className={ui.input}
          />
          <ClearButton
            show={Boolean(state.scale)}
            onClick={() => setScale(null)}
            title="Back to 100%"
          />
        </div>
        <span className="mt-2 block text-[11px] text-[#6c6c7a]">
          Scales every text size, gap and padding on every page together.
        </span>
      </div>
      <div className={ui.section}>
        <span className={ui.heading}>Colours — every page</span>
        {THEME_TOKENS.map(({ token, label }) => {
          const own = state.theme[token] !== undefined;
          const hex = tokenHex(token);
          return (
            <div key={token} className="grid grid-cols-[1fr_auto_20px] items-center gap-2 py-1">
              <span className="flex items-center gap-1.5 text-[#b4b4c2]">
                <Dot on={own} />
                {label}
              </span>
              <span className="flex items-center gap-2">
                <span className="font-mono text-[11px] text-[#8b8b99]">{hex}</span>
                <input
                  type="color"
                  value={hex}
                  onChange={(e) => setTheme(token, e.target.value)}
                  className="h-7 w-12 cursor-pointer rounded border border-[#30303b] bg-transparent"
                />
              </span>
              <ClearButton
                show={own}
                onClick={() => setTheme(token, null)}
                title="Back to the original colour"
              />
            </div>
          );
        })}
      </div>
    </>
  );

  const changesTab = (
    <>
      <div className="px-4 py-4">
        <span className={ui.heading}>This page and every page</span>
        {changes.length === 0 && themeCount === 0 ? (
          <span className="block text-[#8b8b99]">No edits here yet.</span>
        ) : null}
        {themeCount > 0 ? (
          <div className="mb-2 flex items-center justify-between gap-2 rounded-md bg-[#1b1b22] px-2.5 py-2">
            <span className="text-[#e8e8ee]">
              Theme{' '}
              <span className={ui.muted}>
                · {themeCount} change{themeCount === 1 ? '' : 's'}
              </span>
            </span>
            <button
              type="button"
              className={ui.btn}
              onClick={() => {
                const next = structuredClone(overridesStore.get());
                next.theme = {};
                delete next.scale;
                commit(next);
              }}
            >
              <RotateCcw className="size-3.5" /> Revoke
            </button>
          </div>
        ) : null}
        <div className="flex flex-col gap-1.5">
          {changes.map(({ selector, global, o }) => {
            const found = safeQuery(selector);
            const t = rowTarget(selector, global, o);
            const kinds = [
              o.hidden ? 'Deleted' : null,
              o.text !== undefined ? 'Text' : null,
              o.style ? `Style ×${Object.keys(o.style).length}` : null,
            ].filter(Boolean);
            return (
              <div key={`${global}-${selector}`} className="rounded-md bg-[#1b1b22] px-2.5 py-2">
                <span className="block truncate text-[#e8e8ee]" title={selector}>
                  {o.label ?? selector}
                </span>
                <span className="mt-1 flex flex-wrap gap-1">
                  {kinds.map((k) => (
                    <span
                      key={k}
                      className={cn(
                        'rounded px-1.5 py-0.5 text-[10px]',
                        k === 'Deleted'
                          ? 'bg-[#3a1c1f] text-[#ff9aa0]'
                          : 'bg-[#24242c] text-[#b4b4c2]',
                      )}
                    >
                      {k}
                    </span>
                  ))}
                  <span className="rounded bg-[#24242c] px-1.5 py-0.5 text-[10px] text-[#8b8b99]">
                    {global ? 'Every page' : 'This page'}
                  </span>
                  {!found ? (
                    <span className="rounded bg-[#24242c] px-1.5 py-0.5 text-[10px] text-[#d9a84a]">
                      Not found on page
                    </span>
                  ) : null}
                </span>
                <span className="mt-2 flex gap-1.5">
                  {o.hidden ? (
                    <button
                      type="button"
                      className={ui.btn}
                      onClick={() =>
                        updateEl(t, (cur) => {
                          const next = { ...cur };
                          delete next.hidden;
                          return next;
                        })
                      }
                    >
                      <Eye className="size-3.5" /> Restore
                    </button>
                  ) : found ? (
                    <button
                      type="button"
                      className={ui.btn}
                      onClick={() => {
                        setActive(true);
                        select(found);
                        scrollTo(found as HTMLElement, -160);
                      }}
                    >
                      <Crosshair className="size-3.5" /> Select
                    </button>
                  ) : null}
                  <button type="button" className={ui.btn} onClick={() => updateEl(t, () => ({}))}>
                    <RotateCcw className="size-3.5" /> Revoke
                  </button>
                </span>
              </div>
            );
          })}
        </div>
      </div>
      {otherPages.length > 0 ? (
        <div className={ui.section}>
          <span className={ui.heading}>Other pages</span>
          {otherPages.map(([p, bucket]) => (
            <div key={p} className="flex items-center justify-between gap-2 py-1">
              <span className="text-[#e8e8ee]">
                {p}{' '}
                <span className={ui.muted}>
                  · {Object.keys(bucket).length} edit{Object.keys(bucket).length === 1 ? '' : 's'}
                </span>
              </span>
              <button type="button" className={ui.btn} onClick={() => revokePage(p)}>
                <RotateCcw className="size-3.5" /> Revoke page
              </button>
            </div>
          ))}
        </div>
      ) : null}
      <div className={ui.section}>
        <button
          type="button"
          className={cn(ui.btn, ui.danger, 'w-full justify-center')}
          onClick={resetAll}
        >
          <Trash2 className="size-3.5" /> Reset everything
        </button>
        <span className="mt-3 block text-[11px] leading-relaxed text-[#6c6c7a]">
          Edits save to data/site-overrides.json. The file as it was when this editing session began
          is kept in data/site-overrides.backup.json.
        </span>
      </div>
    </>
  );

  const panel =
    active && panelOpen ? (
      <div className={ui.panel}>
        <div className="flex items-center justify-between px-4 pb-2 pt-4">
          <span className="text-[14px] font-semibold text-white">Site editor</span>
          <button
            type="button"
            className="grid size-7 place-items-center rounded text-[#8b8b99] hover:bg-[#262630] hover:text-white"
            onClick={() => setPanelOpen(false)}
            title="Hide panel"
          >
            <ChevronsRight className="size-4" />
          </button>
        </div>
        <div className="flex gap-1 px-4 pb-3">
          {(['element', 'theme', 'changes'] as const).map((id) => (
            <button
              key={id}
              type="button"
              onClick={() => setTab(id)}
              className={cn(
                'flex-1 rounded-md px-2 py-1.5 text-[12px] capitalize',
                tab === id ? 'bg-[#262630] text-white' : 'text-[#8b8b99] hover:text-white',
              )}
            >
              {id === 'changes' ? `Changes${changeCount ? ` (${changeCount})` : ''}` : id}
            </button>
          ))}
        </div>
        <div className="flex-1 overflow-y-auto overscroll-contain" data-lenis-prevent="">
          {tab === 'element' ? elementTab : tab === 'theme' ? themeTab : changesTab}
        </div>
      </div>
    ) : null;

  return createPortal(
    <>
      {overlay}
      {panel}
      {toolbar}
    </>,
    portal,
  );
}
