import type { IconName } from '@/lib/icons';

/** Channel kinds — drives how the href is built. */
export type ContactChannelType =
  | 'email'
  | 'phone'
  | 'whatsapp'
  | 'location'
  | 'instagram'
  | 'linkedin';

/**
 * A single contact route.
 *
 * `value` is deliberately empty. When empty the card shows `placeholder` in a
 * muted tone and renders as static text; fill `value` in and it becomes a live
 * link built from `href`.
 */
export interface ContactChannel {
  id: string;
  type: ContactChannelType;
  /** Row label, e.g. "Email". */
  label: string;
  /** Real value. Empty string keeps the row in placeholder mode. */
  value: string;
  /** Muted hint shown while `value` is empty. */
  placeholder: string;
  /** Target URL. Empty string keeps the row non-interactive. */
  href: string;
  icon: IconName;
}

/** Field kinds supported by the contact form. */
export type ContactFieldType = 'text' | 'email' | 'tel' | 'textarea';

/** Declarative contact-form field definition. */
export interface ContactField {
  id: string;
  name: string;
  label: string;
  type: ContactFieldType;
  placeholder: string;
  required: boolean;
  /** Full-width row in the two-column grid. */
  fullWidth?: boolean;
  /** `textarea` only. */
  rows?: number;
  autoComplete?: string;
}

/** Office / studio location used by the map section. */
export interface OfficeLocation {
  id: string;
  label: string;
  address: string;
  /** Empty string renders the map placeholder. */
  mapEmbedUrl: string;
  /** Empty string hides the "Open in Maps" action. */
  directionsUrl: string;
}
