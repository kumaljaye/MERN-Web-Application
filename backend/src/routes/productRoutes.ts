import express, { Request, Response } from 'express';
import ProductModel from '@/models/Product';
import { createErrorResponse } from '@/types/response';

const router = express.Router();

/**
 * GET /products - Get all products (View Only) with optional pagination
 */
router.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const shouldPaginate = typeof req.query.page !== 'undefined' || typeof req.query.limit !== 'undefined';

    if (!shouldPaginate) {
      const products = await ProductModel.find({}).sort({ createdAt: -1 });
      res.json(products);
      return;
    }

    const page = Math.max(parseInt(req.query.page as string, 10) || 1, 1);
    const limitParam = parseInt(req.query.limit as string, 10);
    const limit = Math.min(Math.max(limitParam || 10, 1), 100);
    const skip = (page - 1) * limit;

    const [products, total] = await Promise.all([
      ProductModel.find({}).sort({ createdAt: -1 }).skip(skip).limit(limit),
      ProductModel.countDocuments(),
    ]);

    const totalPages = Math.max(Math.ceil(total / limit), 1);

    res.json({
      products,
      pagination: {
        page,
        limit,
        totalItems: total,
        totalPages,
        hasNext: page < totalPages,
        hasPrevious: page > 1,
      },
    });
  } catch (err) {
    console.error('Error fetching products:', err);
    res.status(500).json(
      createErrorResponse('Failed to fetch products')
    );
  }
});

export default router;