export const SEED_PASSWORD = 'Bravo@2024';

export interface SeedCategory {
  label: string;
  icon: string;
  prefix: string;
  anchor: string;
}

export interface SeedProduct {
  categoryLabel: string;
  name: string;
  description: string;
  price: number;
  oldPrice?: number;
  badge?: 'Sale' | 'Premium' | 'Novo';
  img: string;
  features: string[];
  gallery: string[];
}

export const SEED_CATEGORIES: SeedCategory[] = [
  { label: 'Roupas', icon: 'fa-shirt', prefix: 'R', anchor: 's-roupas' },
  { label: 'Calçados', icon: 'fa-shoe-prints', prefix: 'C', anchor: 's-calcados' },
  { label: 'Acessórios', icon: 'fa-gem', prefix: 'A', anchor: 's-acessorios' },
];

export const SEED_PRODUCTS: SeedProduct[] = [
  {
    categoryLabel: 'Roupas',
    name: 'Camiseta Básica Premium',
    description: 'Camiseta 100% algodão, corte moderno e acabamento premium. Disponível em várias cores.',
    price: 14500.00,
    oldPrice: 18000.00,
    badge: 'Sale',
    img: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab',
    features: ['100% algodão', 'Manga curta', 'Corte regular'],
    gallery: [
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab',
      'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a',
    ],
  },
  {
    categoryLabel: 'Calçados',
    name: 'Tênis Esportivo Pro',
    description: 'Tênis com amortecimento de última geração, ideal para corridas e caminhadas.',
    price: 28500.00,
    img: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff',
    features: ['Amortecimento Air', 'Malha respirável', 'Solado antiderrapante'],
    gallery: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff'],
  },
  {
    categoryLabel: 'Acessórios',
    name: 'Relógio Smart Elegance',
    description: 'Smartwatch com monitor cardíaco, GPS e bateria de longa duração.',
    price: 45000.00,
    oldPrice: 52000.00,
    badge: 'Novo',
    img: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30',
    features: ['Monitor cardíaco', 'GPS integrado', 'Bateria 7 dias'],
    gallery: [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30',
      'https://images.unsplash.com/photo-1546868871-af0de0ae72be',
    ],
  },
];
