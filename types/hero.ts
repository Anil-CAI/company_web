/** The landing hero: the KRL light wordmark and the copy beside it. */
export interface HeroLight {
  /** The wordmark photograph the shader lights up. */
  image: string;
  /** Accessible name for the interactive canvas. */
  canvasLabel: string;
  title: string;
  /** One line on what KRL does, between the title and the interaction hint. */
  tagline: string;
  description: string;
  cta: { label: string; href: string };
}
