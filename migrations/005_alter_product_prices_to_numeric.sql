-- Alterar preços para NUMERIC(12,2)
ALTER TABLE product
  ALTER COLUMN price TYPE NUMERIC(12,2) USING price::NUMERIC(12,2),
  ALTER COLUMN old_price TYPE NUMERIC(12,2) USING old_price::NUMERIC(12,2);

-- Manter validações não negativas
ALTER TABLE product
  DROP CONSTRAINT IF EXISTS product_price_check,
  DROP CONSTRAINT IF EXISTS product_old_price_check;

ALTER TABLE product
  ADD CONSTRAINT product_price_check CHECK (price >= 0),
  ADD CONSTRAINT product_old_price_check CHECK (old_price IS NULL OR old_price >= 0);
