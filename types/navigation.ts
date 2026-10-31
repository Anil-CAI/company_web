import type { Route } from '@/constants/routes';

/** A link in the header, mobile drawer or footer. */
export interface NavItem {
  id: string;
  label: string;
  href: Route | string;
  /** Optional one-liner shown in the mobile drawer. */
  description?: string;
  /** External links open in a new tab and get a rel attribute. */
  external?: boolean;
}

/** A titled column of links in the footer. */
export interface NavGroup {
  id: string;
  title: string;
  items: NavItem[];
}
