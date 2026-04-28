export enum SearchResultType {
  LOCATION = "LOCATION",
  PROJECT = "PROJECT",
  PROPERTY = "PROPERTY",
  DEVELOPER = "DEVELOPER",
}

export interface SearchResult {
  id: string | number;
  type: SearchResultType;
  title: string;
  subtitle?: string;
  image?: string;
  link: string;
  badge?: string;
}

export type SearchPurpose = "buy" | "rent" | "off_plan" | "all";

export interface GlobalSearchQuery {
  query: string;
  purpose?: SearchPurpose;
}
