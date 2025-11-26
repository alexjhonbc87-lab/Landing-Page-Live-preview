export interface Tool {
  id: string;
  name: string;
  icon?: string;
  active: boolean;
}

export interface SidebarItem {
  id: string;
  label: string;
  icon: any; 
  category?: string;
}

export interface LandingPageFormData {
  pageName: string;
  pageType: string;
  offerDescription: string;
  targetAudience: string;
  metaDescription?: string;
  keywords?: string;
  subdomain?: string;
}

export enum ViewMode {
  DESKTOP = 'desktop',
  TABLET = 'tablet',
  MOBILE = 'mobile'
}