/** Shape of the per-platform navigation capability matrix. */

/**
 * Where a capability actually stands on a given platform.
 *
 * `planned` is a first-class state rather than an omission: the roadmap is part
 * of what the section communicates (person following ships on Go2 today and is
 * being brought to G1), and a capability that is merely absent from an array
 * cannot say that.
 */
export type CapabilityStatus = 'deployed' | 'planned';

export interface NavCapability {
  id: string;
  /** Single-letter index shown in the card gutter. */
  marker: string;
  name: string;
  /** One line on what the capability does on this platform. */
  description: string;
  status: CapabilityStatus;
}

export interface NavPlatform {
  id: string;
  slug: string;
  /** Model designation, e.g. "Go2". */
  name: string;
  /** Form factor, e.g. "Quadruped". */
  form: string;
  summary: string;
  capabilities: readonly NavCapability[];
}
