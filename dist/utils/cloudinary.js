"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cloudinary = void 0;
exports.uploadImage = uploadImage;
const cloudinary_1 = require("cloudinary");
Object.defineProperty(exports, "cloudinary", { enumerable: true, get: function () { return cloudinary_1.v2; } });
const env_1 = require("../config/env");
cloudinary_1.v2.config({
    cloud_name: env_1.env.CLOUDINARY_CLOUD_NAME,
    api_key: env_1.env.CLOUDINARY_API_KEY,
    api_secret: env_1.env.CLOUDINARY_API_SECRET,
});
async function uploadImage(file) {
    const buffer = file.buffer;
    return new Promise((resolve, reject) => {
        cloudinary_1.v2.uploader
            .upload_stream({
            folder: 'bravo-business/products',
            resource_type: 'image',
            transformation: [
                { width: 1200, height: 800, crop: 'limit', quality: 'auto' },
                { fetch_format: 'auto' },
            ],
        }, (error, result) => {
            if (error) {
                console.error('Cloudinary upload error:', error);
                reject(new Error(`Falha ao enviar imagem para o Cloudinary: ${error.message}`));
                return;
            }
            if (!result?.secure_url) {
                reject(new Error('Cloudinary retornou uma resposta sem URL.'));
                return;
            }
            resolve(result.secure_url);
        })
            .end(buffer);
    });
}
//# sourceMappingURL=cloudinary.js.map