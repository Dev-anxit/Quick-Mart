import express from 'express';
import * as userController from '../controllers/userController';
import { authMiddleware } from '../middleware/auth';

const router = express.Router();

// Saved addresses endpoints
router.get('/addresses', authMiddleware, userController.getSavedAddresses);
router.post('/addresses', authMiddleware, userController.addAddress);
router.put('/addresses/:id', authMiddleware, userController.updateAddress);
router.delete('/addresses/:id', authMiddleware, userController.deleteAddress);

export default router;
