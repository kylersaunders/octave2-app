interface ExternalUrls {
  spotify: string;
}

interface Image {
  url: string;
  height: number;
  width: number;
}

interface Followers {
  href: null;
  total: number;
}

interface ExplicitContent {
  filter_enabled: boolean;
  filter_locked: boolean;
}

export interface User {
  display_name: string;
  external_urls: ExternalUrls;
  href: string;
  id: string;
  images: Image[];
  type: 'user';
  uri: string;
  followers: Followers;
  country: string;
  product: 'premium' | 'free' | 'unlimited';
  explicit_content: ExplicitContent;
  email: string;
}
