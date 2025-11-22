export interface SearchSource {
  title: string;
  uri: string;
}

export interface SearchResult {
  text: string;
  sources?: SearchSource[];
}

export interface QuickLink {
  id: string;
  name: string;
  url: string;
  icon: React.ReactNode;
  color?: string;
}

export interface WeatherData {
  temp: number;
  condition: string;
  location: string;
}