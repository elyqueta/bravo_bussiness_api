-- Seed direto para Neon/Postgres
-- Admin: admin@bravo.co.ao / Bravo@2024
-- Categorias: Roupas, Calçados, Acessórios
-- Produtos: BB-R001, BB-C001, BB-A001

-- Admin (usa UUID automático do Postgres)
INSERT INTO users (full_name, email, password_hash, phone, role, status, created_at, updated_at)
VALUES (
  'Admin Bravo',
  'admin@bravo.co.ao',
  '$2b$12$1p3no5Bt52jtg37cWkQS/OdDYYOs6V73AH4ME7GPbknIoJNAGR37i',
  '923000000',
  'admin',
  'active',
  NOW(),
  NOW()
) ON CONFLICT (email) DO UPDATE SET
  password_hash = EXCLUDED.password_hash,
  updated_at = NOW();

-- Categorias
INSERT INTO category (id, slug, label, icon, prefix, anchor, created_at, updated_at)
VALUES
  ('roupas', 'roupas', 'Roupas', 'fa-shirt', 'R', 's-roupas', NOW(), NOW()),
  ('calcados', 'calcados', 'Calçados', 'fa-shoe-prints', 'C', 's-calcados', NOW(), NOW()),
  ('acessorios', 'acessorios', 'Acessórios', 'fa-gem', 'A', 's-acessorios', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Produtos
INSERT INTO product (id, category_slug, name, description, price, old_price, img, badge, features, gallery, created_at, updated_at)
VALUES
  (
    'BB-R001',
    'roupas',
    'Camiseta Básica Premium',
    'Camiseta 100% algodão, corte moderno e acabamento premium. Disponível em várias cores.',
    14500,
    18000,
    'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab',
    'Sale',
    '["100% algodão", "Manga curta", "Corte regular"]'::jsonb,
    '["https://images.unsplash.com/photo-1521572163474-6864f9cf17ab", "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a"]'::jsonb,
    NOW(),
    NOW()
  ),
  (
    'BB-C001',
    'calcados',
    'Tênis Esportivo Pro',
    'Tênis com amortecimento de última geração, ideal para corridas e caminhadas.',
    28500,
    NULL,
    'https://images.unsplash.com/photo-1542291026-7eec264c27ff',
    NULL,
    '["Amortecimento Air", "Malha respirável", "Solado antiderrapante"]'::jsonb,
    '["https://images.unsplash.com/photo-1542291026-7eec264c27ff"]'::jsonb,
    NOW(),
    NOW()
  ),
  (
    'BB-A001',
    'acessorios',
    'Relógio Smart Elegance',
    'Smartwatch com monitor cardíaco, GPS e bateria de longa duração.',
    45000,
    52000,
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30',
    'Novo',
    '["Monitor cardíaco", "GPS integrado", "Bateria 7 dias"]'::jsonb,
    '["https://images.unsplash.com/photo-1523275335684-37898b6baf30", "https://images.unsplash.com/photo-1546868871-af0de0ae72be"]'::jsonb,
    NOW(),
    NOW()
  )
ON CONFLICT (id) DO NOTHING;
