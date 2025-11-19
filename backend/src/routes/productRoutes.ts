import express, { Request, Response } from 'express';
import ProductModel from '@/models/Product';
import { createErrorResponse } from '@/types/response';

const router = express.Router();

/**
 * GET /products - Get all products with pagination (View Only)
 * Query parameters:
 *   - page: page number (default: 1)
 *   - limit: items per page (default: 10)
 *   - sortBy: field to sort by (default: createdAt)
 *   - sortOrder: asc or desc (default: desc)
 *   - category: filter by category (optional)
 */
router.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const sortBy = (req.query.sortBy as string) || 'createdAt';
    const sortOrder = (req.query.sortOrder as string) || 'desc';
    const category = req.query.category as string;

    // Calculate skip value for pagination
    const skip = (page - 1) * limit;

    // Create sort object
    const sort: { [key: string]: 1 | -1 } = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    // Create filter object
    const filter: { [key: string]: any } = {};
    if (category) {
      filter.category = new RegExp(category, 'i'); // Case-insensitive search
    }

    // Get total count for pagination metadata
    const totalItems = await ProductModel.countDocuments(filter);
    const totalPages = Math.ceil(totalItems / limit);

    // Fetch products with pagination
    const products = await ProductModel.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limit);

    // Create pagination metadata
    const pagination = {
      page,
      limit,
      totalItems,
      totalPages,
      hasNext: page < totalPages,
      hasPrevious: page > 1
    };

    res.json({
      products,
      pagination
    });
  } catch (err) {
    console.error('Error fetching products:', err);
    res.status(500).json(
      createErrorResponse('Failed to fetch products')
    );
  }
});

export default router;