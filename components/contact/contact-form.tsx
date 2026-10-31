'use client';

import { CheckCircle2, Send } from 'lucide-react';
import * as React from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { contactFields } from '@/data/contact';
import { contactContent } from '@/data/content';
import { cn } from '@/lib/utils';
import type { ContactField } from '@/types/contact';

/** Minimal RFC-shaped check — enough to catch typos without rejecting valid addresses. */
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/**
 * Where submissions go.
 *
 * Read from the environment rather than hardcoded so the endpoint can change
 * without a code edit, and so this repo carries no account id. Set
 * `NEXT_PUBLIC_CONTACT_ENDPOINT` in `.env.local` (see `.env.example`).
 */
const CONTACT_ENDPOINT = process.env.NEXT_PUBLIC_CONTACT_ENDPOINT ?? '';

type FormValues = Record<string, string>;
type FormErrors = Record<string, string | undefined>;
type FormStatus = 'idle' | 'submitting' | 'success' | 'error';

/** Every field starts as an empty string, so inputs are controlled from render one. */
function createInitialValues(fields: ContactField[]): FormValues {
  return Object.fromEntries(fields.map((field) => [field.name, '']));
}

/** Client-side validation. Returns a map of field name to error message. */
function validate(fields: ContactField[], values: FormValues): FormErrors {
  const errors: FormErrors = {};

  for (const field of fields) {
    const value = (values[field.name] ?? '').trim();

    if (field.required && value.length === 0) {
      errors[field.name] = `${field.label} is required.`;
      continue;
    }

    if (field.type === 'email' && value.length > 0 && !EMAIL_PATTERN.test(value)) {
      errors[field.name] = 'Enter a valid email address.';
    }
  }

  return errors;
}

/**
 * Contact form.
 *
 * Fields are declared in `data/contact.ts`, so adding one is a data edit rather
 * than a component change. Validation runs entirely in the browser — there is
 * no backend and nothing is transmitted. Wire `handleSubmit` to an endpoint or
 * a form service when you are ready to receive messages.
 */
export function ContactForm() {
  const content = contactContent.form;

  const [values, setValues] = React.useState<FormValues>(() => createInitialValues(contactFields));
  const [errors, setErrors] = React.useState<FormErrors>({});
  const [status, setStatus] = React.useState<FormStatus>('idle');

  const handleChange = React.useCallback(
    (name: string) => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { value } = event.target;
      setValues((previous) => ({ ...previous, [name]: value }));
      // Clear the error as soon as the field is touched again.
      setErrors((previous) => (previous[name] ? { ...previous, [name]: undefined } : previous));
    },
    [],
  );

  const handleSubmit = React.useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      const nextErrors = validate(contactFields, values);
      setErrors(nextErrors);

      const firstInvalid = contactFields.find((field) => nextErrors[field.name]);
      if (firstInvalid) {
        document.getElementById(firstInvalid.id)?.focus();
        return;
      }

      /*
       * Posts to the form endpoint in `NEXT_PUBLIC_CONTACT_ENDPOINT`.
       *
       * Without it configured the submission would silently vanish, which is
       * the worst outcome of the three — the sender believes they have been
       * heard. So a missing endpoint is surfaced as an error rather than a
       * fake success.
       */
      if (!CONTACT_ENDPOINT) {
        setStatus('error');
        return;
      }

      setStatus('submitting');

      try {
        const response = await fetch(CONTACT_ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify(values),
        });

        if (!response.ok) {
          setStatus('error');
          return;
        }

        setStatus('success');
        setValues(createInitialValues(contactFields));
      } catch {
        /* Offline, DNS failure, blocked request — all land here. */
        setStatus('error');
      }
    },
    [values],
  );

  if (status === 'success') {
    return (
      <div
        role="status"
        className="flex flex-col items-start gap-6 rounded-2xl border border-border bg-card p-10 shadow-soft"
      >
        <CheckCircle2 aria-hidden="true" className="size-8 text-foreground" strokeWidth={1.25} />
        <div>
          <h3 className="text-2xl font-medium tracking-tight">{content.successTitle}</h3>
          <p className="mt-3 max-w-prose text-sm leading-relaxed text-muted-foreground text-pretty">
            {content.successBody}
          </p>
        </div>
        <Button variant="outline" onClick={() => setStatus('idle')}>
          Write another message
        </Button>
      </div>
    );
  }

  return (
    <form noValidate onSubmit={handleSubmit} className="flex flex-col gap-8">
      <div className="grid gap-6 sm:grid-cols-2">
        {contactFields.map((field) => {
          const error = errors[field.name];
          const errorId = `${field.id}-error`;
          const isTextarea = field.type === 'textarea';

          const sharedProps = {
            id: field.id,
            name: field.name,
            placeholder: field.placeholder,
            required: field.required,
            value: values[field.name] ?? '',
            onChange: handleChange(field.name),
            'aria-invalid': Boolean(error),
            'aria-describedby': error ? errorId : undefined,
            className: error ? 'border-destructive focus-visible:border-destructive' : undefined,
          };

          return (
            <div
              key={field.id}
              className={cn('flex flex-col gap-3', (field.fullWidth || isTextarea) && 'sm:col-span-2')}
            >
              <Label htmlFor={field.id}>
                {field.label}
                {!field.required ? (
                  <span className="ml-2 normal-case tracking-normal text-ink-400">optional</span>
                ) : null}
              </Label>

              {isTextarea ? (
                <Textarea {...sharedProps} rows={field.rows ?? 6} />
              ) : (
                <Input {...sharedProps} type={field.type} autoComplete={field.autoComplete} />
              )}

              {error ? (
                <p id={errorId} role="alert" className="text-xs text-destructive">
                  {error}
                </p>
              ) : null}
            </div>
          );
        })}
      </div>

      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="max-w-sm space-y-3">
          <p className="text-xs leading-relaxed text-muted-foreground">{content.disclaimer}</p>

          {/*
            Failures are announced, never swallowed. The fallback address is
            spelled out because a visitor who hit an error still needs a way to
            reach us — telling them "something went wrong" and nothing else just
            loses the enquiry a second time.
          */}
          {status === 'error' ? (
            <p role="alert" className="text-xs leading-relaxed text-destructive">
              {content.errorBody}
            </p>
          ) : null}
        </div>

        <Button type="submit" size="lg" disabled={status === 'submitting'} className="sm:shrink-0">
          {status === 'submitting' ? content.submittingLabel : content.submitLabel}
          <Send className="size-4" />
        </Button>
      </div>
    </form>
  );
}
