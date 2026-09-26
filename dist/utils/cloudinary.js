"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cloudinary = void 0;
exports.uploadImage = uploadImage;
exports.deleteImage = deleteImage;
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
            if (!result?.secure_url || !result?.public_id) {
                reject(new Error('Cloudinary retornou uma resposta sem URL ou public_id.'));
                return;
            }
            resolve({ url: result.secure_url, publicId: result.public_id });
        })
            .end(buffer);
    });
}
async function deleteImage(url) {
    const publicId = getPublicIdFromUrl(url);
    try {
        await cloudinary_1.v2.uploader.destroy(publicId);
    }
    catch (error) {
        console.error(`Falha ao eliminar imagem do Cloudinary (${publicId}):`, error);
    }
}
function getPublicIdFromUrl(url) {
    const match = url.match(/\/upload\/(?:v\d+\/)?(.+?)(?:\.\w+)?$/);
    if (!match || !match[1])
        return url;
    return match[1];
}
//# sourceMappingURL=cloudinary.js.map