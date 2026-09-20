"use strict";
/**
 * Tipos de paginação reutilizáveis por QUALQUER domínio da API que
 * precise listar muitos registos (PRODUCT é o primeiro, mas ORDER,
 * WISHLIST, etc. vão reaproveitar exatamente isto).
 *
 * Por que um ficheiro próprio, e não dentro de product.types.ts?
 *
 * Porque paginação não é uma regra do domínio PRODUCT — é uma
 * preocupação transversal (cross-cutting concern), como validate.ts
 * já é para validação. Definir aqui evita que cada domínio futuro
 * reimplemente a mesma forma com nomes ligeiramente diferentes.
 */
Object.defineProperty(exports, "__esModule", { value: true });
//# sourceMappingURL=pagination.types.js.map