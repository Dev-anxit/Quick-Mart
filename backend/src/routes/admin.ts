import express from 'express';
import * as adminController from '../controllers/adminController';
import { authMiddleware } from '../middleware/auth';
import { upload } from '../middleware/upload';

const router = express.Router();

// Get dashboard stats
router.get('/dashboard', authMiddleware, adminController.getDashboardStats);

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

// Upload product image
router.post('/upload', authMiddleware, upload.single('image'), adminController.handleLocalUpload);

// Create category
router.post('/categories', authMiddleware, adminController.createCategory);

// Promo management
router.get('/promos', authMiddleware, adminController.getAdminPromos);
router.post('/promos', authMiddleware, adminController.createPromo);
router.delete('/promos/:id', authMiddleware, adminController.deletePromo);

export default router;
