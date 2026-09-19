export type ProductBadge = 'Sale' | 'Premium' | 'Novo';

export type ProductId = string;

export interface ProductRow {
  id: string;
  category_slug: string;
  name: string;
  description: string | null;
  price: string;
  old_price: string | null;
  img: string;
  badge: string | null;
  features: string[] | null;
  gallery: string[] | null;
  created_at: Date;
  updated_at: Date;
}

export interface Product {
  id: ProductId;
  categorySlug: string;
  name: string;
  description: string | null;
  price: number;
  oldPrice: number | null;
  img: string;
  badge: ProductBadge | null;
  features: string[];
  gallery: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateProductData {
  id: string;
  categorySlug: string;
  name: string;
  description?: string | null;
  price: number;
  oldPrice?: number | null;
  img: string;
  badge?: ProductBadge | null;
  features?: string[];
  gallery?: string[];
}

export interface ProductFilters {
  categorySlug?: string;
  badge?: ProductBadge;
  search?: string;
}
