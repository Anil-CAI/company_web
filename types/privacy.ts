/** Shape of the privacy policy page. */

export interface PrivacySection {
  id: string;
  heading: string;
  /** One paragraph per entry. Kept as an array so a section can run long. */
  body: readonly string[];
}

export interface PrivacyPolicy {
  title: string;
  /** Plain-English summary shown above the sections. */
  summary: string;
  /**
   * When the policy last changed, as an ISO date.
   *
   * Stored as a date rather than display text so the page can format it and
   * the sitemap can use the same value.
   */
  updated: string;
  sections: readonly PrivacySection[];
}
