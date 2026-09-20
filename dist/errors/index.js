"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Barrel export: permite importar qualquer erro da aplicação a partir
 * de um único caminho (`from '../errors'`), em vez de precisar saber
 * em qual arquivo específico cada classe foi definida.
 *
 * Exemplo de uso em um service futuro:
 *   import { NotFoundError, ConflictError } from '../errors';
 */
__exportStar(require("./AppError"), exports);
__exportStar(require("./HttpErrors"), exports);
//# sourceMappingURL=index.js.map