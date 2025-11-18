import express, { Request, Response } from 'express';
import UserModel from '@/models/User';
import { getNextSequence } from '@/config/database';
import { NotificationTemplates } from '@/types/notification';
import { createSuccessResponse, createErrorResponse } from '@/types/response';
import { IUserInput } from '@/types/database';

const router = express.Router();

/**
 * GET /users - Get all users (supports pagination via query params)
 */
router.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const shouldPaginate = typeof req.query.page !== 'undefined' || typeof req.query.limit !== 'undefined';

    if (!shouldPaginate) {
      const users = await UserModel.find({}).sort({ userId: -1 });
      res.json(users);
      return;
    }

    const page = Math.max(parseInt(req.query.page as string, 10) || 1, 1);
    const limitParam = parseInt(req.query.limit as string, 10);
    const limit = Math.min(Math.max(limitParam || 10, 1), 100);
    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      UserModel.find({}).sort({ userId: -1 }).skip(skip).limit(limit),
      UserModel.countDocuments(),
    ]);

    const totalPages = Math.max(Math.ceil(total / limit), 1);

    res.json({
      users,
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
    console.error('Error fetching users:', err);
    res.status(500).json(
      createErrorResponse('Failed to fetch users')
    );
  }
});

/**
 * POST /users - Add new user
 */
router.post('/', async (req: Request<{}, any, IUserInput>, res: Response): Promise<void> => {
  try {
    const { firstName, lastName, email, birthDate, gender } = req.body;
    
    // Validate required fields
    const validation = UserModel.validateUserData(req.body);
    if (!validation.isValid) {
      res.status(400).json(
        createErrorResponse(
          'All fields are required',
          NotificationTemplates.USER.VALIDATION_ERROR(),
          { missing: validation.missing }
        )
      );
      return;
    }

    // Check if user with email already exists
    const existingUser = await UserModel.findByEmail(email);
    if (existingUser) {
      res.status(400).json(
        createErrorResponse(
          'User with this email already exists',
          NotificationTemplates.USER.DUPLICATE_EMAIL(email.toLowerCase())
        )
      );
      return;
    }

    // Get next auto-increment ID
    const userId = await getNextSequence('user_id');

    // Create new user
    const newUser = new UserModel({
      userId,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.toLowerCase().trim(),
      birthDate,
      gender
    });

    const savedUser = await newUser.save();
    
    res.status(201).json(
      createSuccessResponse(
        'User created successfully',
        { user: savedUser },
        NotificationTemplates.USER.CREATED(savedUser)
      )
    );
  } catch (err: any) {
    console.error('Error creating user:', err);
    if (err.code === 11000) {
      res.status(400).json(
        createErrorResponse(
          'User with this email already exists',
          NotificationTemplates.USER.DUPLICATE_EMAIL('unknown')
        )
      );
    } else {
      res.status(500).json(
        createErrorResponse(
          'Failed to create user',
          NotificationTemplates.USER.SERVER_ERROR('Registration')
        )
      );
    }
  }
});

/**
 * PUT /users/:id - Update user
 */
router.put('/:id', async (req: Request<{ id: string }, any, IUserInput>, res: Response): Promise<void> => {
  try {
    const userId = req.params.id;
    const { firstName, lastName, email, birthDate, gender } = req.body;

    // Validate required fields
    const validation = UserModel.validateUserData(req.body);
    if (!validation.isValid) {
      res.status(400).json(
        createErrorResponse(
          'All fields are required',
          NotificationTemplates.USER.VALIDATION_ERROR(),
          { missing: validation.missing }
        )
      );
      return;
    }

    // Check if another user with the same email exists (excluding current user)
    const existingUser = await UserModel.findOne({ 
      email: email.toLowerCase(), 
      _id: { $ne: userId } 
    });
    if (existingUser) {
      res.status(400).json(
        createErrorResponse(
          'Another user with this email already exists',
          NotificationTemplates.USER.EMAIL_CONFLICT()
        )
      );
      return;
    }

    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.toLowerCase().trim(),
        birthDate,
        gender
      },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      res.status(404).json(
        createErrorResponse(
          'User not found',
          NotificationTemplates.USER.NOT_FOUND()
        )
      );
      return;
    }

    res.json(
      createSuccessResponse(
        'User updated successfully',
        { user: updatedUser },
        NotificationTemplates.USER.UPDATED(updatedUser)
      )
    );
  } catch (err: any) {
    console.error('Error updating user:', err);
    if (err.code === 11000) {
      res.status(400).json(
        createErrorResponse(
          'Another user with this email already exists',
          NotificationTemplates.USER.EMAIL_CONFLICT()
        )
      );
    } else {
      res.status(500).json(
        createErrorResponse(
          'Failed to update user',
          NotificationTemplates.USER.SERVER_ERROR('Update')
        )
      );
    }
  }
});

/**
 * DELETE /users/:id - Delete user
 */
router.delete('/:id', async (req: Request<{ id: string }>, res: Response): Promise<void> => {
  try {
    const userId = req.params.id;

    const deletedUser = await UserModel.findByIdAndDelete(userId);

    if (!deletedUser) {
      res.status(404).json(
        createErrorResponse(
          'User not found',
          NotificationTemplates.USER.NOT_FOUND()
        )
      );
      return;
    }

    res.json(
      createSuccessResponse(
        'User deleted successfully',
        { user: deletedUser },
        NotificationTemplates.USER.DELETED(deletedUser)
      )
    );
  } catch (err) {
    console.error('Error deleting user:', err);
    res.status(500).json(
      createErrorResponse(
        'Failed to delete user',
        NotificationTemplates.USER.SERVER_ERROR('Delete')
      )
    );
  }
});

export default router;