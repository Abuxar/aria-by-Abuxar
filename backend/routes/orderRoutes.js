import express from 'express';
import { addOrderItems, getOrderById, getMyOrders, getOrders, updateOrderToDelivered, updateOrderToDispatched } from '../controllers/orderController.js';
import { protect, admin, optionalAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .post(optionalAuth, addOrderItems)
  .get(protect, admin, getOrders);

router.route('/myorders').get(protect, getMyOrders);
router.route('/:id').get(protect, getOrderById);
router.route('/:id/deliver').put(protect, admin, updateOrderToDelivered);
router.route('/:id/dispatch').put(protect, admin, updateOrderToDispatched);

export default router;
