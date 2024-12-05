export interface NavItem {
  title: string;
  href: string;
  public?: boolean;
  protected?: boolean;
  children?: NavItem[];
}
