"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = void 0;
exports.validateImageMagicBytes = validateImageMagicBytes;
exports.uploadProductImages = uploadProductImages;
const multer_1 = __importDefault(require("multer"));
const errors_1 = require("../errors");
const storage = multer_1.default.memoryStorage();
const fileFilter = (_req, file, next) => {
    if (!file.mimetype.startsWith('image/')) {
        next(new errors_1.BadRequestError('Apenas arquivos de imagem são permitidos.'));
        return;
    }
    next(null, true);
};
exports.upload = (0, multer_1.default)({
    storage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024,
    },
});
async function detectMimeType(buffer) {
    const { fileTypeFromBuffer } = await import('file-type');
    const detected = await fileTypeFromBuffer(buffer);
    return detected?.mime;
}
async function validateImageMagicBytes(file) {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    const detectedMime = await detectMimeType(file.buffer);
    if (!detectedMime || !allowedTypes.includes(detectedMime)) {
        throw new errors_1.BadRequestError('O arquivo enviado não é uma imagem válida (JPEG, PNG ou WebP).');
    }
}
function uploadProductImages() {
    return exports.upload.fields([
        { name: 'img', maxCount: 1 },
        { name: 'gallery[]', maxCount: 20 },
    ]);
}
//# sourceMappingURL=upload.js.map