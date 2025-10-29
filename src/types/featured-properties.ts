export interface Property {
  id: number;
  image: string;
  alt: string;
  featured: boolean;
  type: string;
  title: string;
  location: string;
  price: string;
  bedrooms: number;
  bathrooms: number;
  area: string;
}

export interface PropertyCardProps {
  property: Property;
}
