import express from 'express';
import * as adminController from '../controllers/adminController';
import { authMiddleware } from '../middleware/auth';

const router = express.Router();

// Get dashboard stats
router.get('/stats', authMiddleware, adminController.getDashboardStats);

// Get all orders
router.get('/orders', authMiddleware, adminController.getAllOrders);

// Get users
router.get('/users', authMiddleware, adminController.getUsers);

// Get products
router.get('/products', authMiddleware, adminController.getAdminProducts);

// Update order status
router.put('/orders/:orderId/status', authMiddleware, adminController.updateOrderStatus);

// Assign rider to order
router.post('/orders/:orderId/assign-rider', authMiddleware, adminController.assignRider);

export default router;
