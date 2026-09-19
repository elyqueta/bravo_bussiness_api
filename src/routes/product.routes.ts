import { Router } from 'express';
import { productController } from '../controllers/product.controller';
import { validate } from '../middlewares/validate';
import { authenticate } from '../middlewares/authenticate';
import { requireAdmin } from '../middlewares/requireAdmin';
import { uploadProductImages } from '../middlewares/upload';
import {
  createProductSchema,
  listProductsQuerySchema,
  productIdParamSchema,
  updateProductSchema,
} from '../validators/product.validator';

const router = Router();

router.post(
  '/',
  authenticate,
  requireAdmin,
  uploadProductImages(),
  validate({ body: createProductSchema }),
  productController.create
);

router.get('/', validate({ query: listProductsQuerySchema }), productController.findAll);

router.get('/:id', validate({ params: productIdParamSchema }), productController.findById);

router.patch(
  '/:id',
  authenticate,
  requireAdmin,
  uploadProductImages(),
  validate({ params: productIdParamSchema, body: updateProductSchema }),
  productController.update
);

router.delete(
  '/:id',
  authenticate,
  requireAdmin,
  validate({ params: productIdParamSchema }),
  productController.remove
);

export default router;


