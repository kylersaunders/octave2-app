interface ExternalUrls {
  spotify: string;
}

interface Image {
  url: string;
  height: number;
  width: number;
}

interface Restrictions {
  reason: string;
}

interface Artist {
  external_urls: ExternalUrls;
  href: string;
  id: string;
  name: string;
  type: string;
  uri: string;
  followers?: {
    href: string | null;
    total: number;
  };
  genres?: string[];
  images?: Image[];
  popularity?: number;
}

interface Album {
  album_type: string;
  total_tracks: number;
  available_markets: string[];
  external_urls: ExternalUrls;
  href: string;
  id: string;
  images: Image[];
  name: string;
  release_date: string;
  release_date_precision: string;
  restrictions?: Restrictions;
  type: string;
  uri: string;
  artists: Artist[];
}

export interface Track {
  album: Album;
  artists: Artist[];
  available_markets: string[];
  disc_number: number;
  duration_ms: number;
  explicit: boolean;
  external_ids: {
    isrc?: string;
    ean?: string;
    upc?: string;
  };
  external_urls: ExternalUrls;
  href: string;
  id: string;
  is_playable?: boolean;
  linked_from?: any; // Specify further if needed
  restrictions?: Restrictions;
  name: string;
  popularity: number;
  preview_url: string;
  track_number: number;
  type: string;
  uri: string;
  is_local: boolean;
}

interface Seed {
  afterFilteringSize: number;
  afterRelinkingSize: number;
  href: string;
  id: string;
  initialPoolSize: number;
  type: string;
}

export interface RecommendationResponse {
  seeds: Seed[];
  tracks: Track[];
}

export interface RecommendationsData {
  id: string;
  name: string;
  album: string;
  artist: string;
  popularity: number;
  preview_url: string;
  duration_ms: number;
  explicit: boolean;
  external_urls: string;
  release_date: string;
  total_tracks: number;
  album_type: string;
  available_markets: string[];
  genres: string[];
  followers: number;
  images: Image[];
  is_playable: boolean;
  restrictions: string;
  track_number: number;
  is_local: boolean;
  uri: string;
  type: string;
  href: string;
  external_ids: {
    isrc?: string;
    ean?: string;
    upc?: string;
  };
  linked_from?: any; // Specify further if needed
  afterFilteringSize: number;
  afterRelinkingSize: number;
  initialPoolSize: number;
  href: string;
  type: string;
  tempo?: number;
}
