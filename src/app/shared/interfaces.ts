export interface NavLink {
  icon: string;
  label: string;
  route: string;
  hoverClass?: string;
}

export interface NavSection {
  title: string;
  links: NavLink[];
}

export interface NavMenu {
  label: string;
  width: string;
  cols: string;
  align?: 'center' | 'right';
  sections: NavSection[];
}
