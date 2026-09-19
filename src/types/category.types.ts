export interface CategoryRow {
  id: string;
  slug: string;
  label: string;
  icon: string | null;
  prefix: string;
  anchor: string;
  created_at: Date;
  updated_at: Date;
}

export interface Category {
  id: string;
  slug: string;
  label: string;
  icon: string | null;
  prefix: string;
  anchor: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateCategoryData {
  slug: string;
  label: string;
  icon?: string | null;
  prefix: string;
  anchor: string;
}
