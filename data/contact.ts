import type { ContactChannel, ContactField, OfficeLocation } from '@/types/contact';

/**
 * Contact details.
 *
 * Every `value` and `href` is empty on purpose: rows render in placeholder mode
 * — muted hint text, no link. Fill both fields in and the row becomes a live
 * link automatically. Nothing else needs to change.
 *
 * href formats:
 *   email     -> mailto:hello@example.com
 *   phone     -> tel:+10000000000
 *   whatsapp  -> https://wa.me/10000000000
 *   location  -> https://maps.google.com/?q=...
 */
export const contactChannels: ContactChannel[] = [
  {
    id: 'contact-whatsapp',
    type: 'whatsapp',
    label: 'WhatsApp',
    /* Number not published yet — the row shows a mark, not a dead link. */
    value: '\u2715',
    placeholder: 'Add WhatsApp number',
    href: '',
    icon: 'message',
  },
  {
    id: 'contact-instagram',
    type: 'instagram',
    label: 'Instagram',
    value: '@kinematicsroboticslabs',
    placeholder: 'Add Instagram handle',
    href: 'https://instagram.com/kinematicsroboticslabs',
    icon: 'instagram',
  },
  {
    id: 'contact-email',
    type: 'email',
    label: 'Email',
    value: 'kinematicroboticslabs@gmail.com',
    placeholder: 'Add email address',
    href: 'mailto:kinematicroboticslabs@gmail.com',
    icon: 'mail',
  },
  {
    id: 'contact-phone',
    type: 'phone',
    label: 'Phone',
    /* Number not published yet — the row shows a mark, not a dead link. */
    value: '\u2715',
    placeholder: 'Add phone number',
    href: '',
    icon: 'phone',
  },
  {
    id: 'contact-linkedin',
    type: 'linkedin',
    label: 'LinkedIn',
    /* Profile URL not supplied yet — mark, not a dead link. */
    value: '\u2715',
    placeholder: 'Add LinkedIn profile',
    href: '',
    icon: 'linkedin',
  },
  {
    id: 'contact-location',
    type: 'location',
    label: 'Location',
    value: 'Kakinada',
    placeholder: 'Add office address',
    href: '',
    icon: 'map-pin',
  },
];

/** Contact-form schema. The form is client-only — no backend, no submission. */
export const contactFields: ContactField[] = [
  {
    id: 'field-name',
    name: 'name',
    label: 'Name',
    type: 'text',
    placeholder: 'Your full name',
    required: true,
    autoComplete: 'name',
  },
  {
    id: 'field-email',
    name: 'email',
    label: 'Email',
    type: 'email',
    placeholder: 'you@company.com',
    required: true,
    autoComplete: 'email',
  },
  {
    id: 'field-company',
    name: 'company',
    label: 'Company',
    type: 'text',
    placeholder: 'Organisation name',
    required: false,
    autoComplete: 'organization',
  },
  {
    id: 'field-subject',
    name: 'subject',
    label: 'Subject',
    type: 'text',
    placeholder: 'What is this about?',
    required: true,
  },
  {
    id: 'field-message',
    name: 'message',
    label: 'Message',
    type: 'textarea',
    placeholder: 'Tell us about the system you want to build.',
    required: true,
    fullWidth: true,
    rows: 6,
  },
];

/**
 * Office location.
 *
 * `mapEmbedUrl` is empty, so the map section renders a bordered placeholder.
 * Paste a Google Maps embed URL (the `src` of the iframe Maps gives you under
 * Share → Embed a map) to activate the live map.
 */
export const officeLocation: OfficeLocation = {
  id: 'office-hq',
  label: 'Headquarters',
  address: 'Kakinada, Andhra Pradesh, India',
  mapEmbedUrl: '',
  directionsUrl: '',
};

/** Response-time note shown beside the form. Empty renders a placeholder. */
export const contactResponseNote = '';
