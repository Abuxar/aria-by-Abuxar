import mongoose from 'mongoose';
import { nanoid } from 'nanoid';

const orderSchema = new mongoose.Schema(
  {
    trackingId: { type: String, default: () => `ARIA-${nanoid(8).toUpperCase()}`, unique: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
    guestEmail: { type: String },
    guestPhone: { type: String },
    items: [
      {
        productRef: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
        name: { type: String, required: true }
      }
    ],
    shippingAddress: {
      addressString: { type: String, required: true },
      city: { type: String, required: true },
      postalCode: { type: String, required: true },
      country: { type: String, required: true },
    },
    totalAmount: { type: Number, required: true },
    status: { type: String, enum: ['pending', 'shipped', 'delivered'], default: 'pending' },
  },
  { timestamps: true }
);

const Order = mongoose.model('Order', orderSchema);
export default Order;
