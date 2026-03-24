import mongoose from 'mongoose';

const carouselSchema = new mongoose.Schema({
  image: { type: String, required: true },
  title: { type: String },
  subtitle: { type: String },
  link: { type: String },
  orderIndex: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

const Carousel = mongoose.model('Carousel', carouselSchema);
export default Carousel;
