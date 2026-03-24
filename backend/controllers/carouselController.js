import Carousel from '../models/Carousel.js';

export const getCarousels = async (req, res) => {
  try {
    // Determine context: public route (only active) or admin route (all banners)
    const isAdmin = req.headers.authorization ? true : false; // basic heuristic, will be filtered in UI
    const query = isAdmin ? {} : { isActive: true };
    const carousels = await Carousel.find(query).sort({ orderIndex: 1 });
    res.json(carousels);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

export const createCarousel = async (req, res) => {
  try {
    const total = await Carousel.countDocuments();
    const carousel = new Carousel({
      image: "https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=2000&q=80",
      title: "NEW ARRIVALS",
      subtitle: "DISCOVER THE LATEST CURATION.",
      link: "/shop",
      orderIndex: total,
    });
    const created = await carousel.save();
    res.status(201).json(created);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

export const updateCarousel = async (req, res) => {
  try {
    const { image, title, subtitle, link, isActive } = req.body;
    const carousel = await Carousel.findById(req.params.id);
    
    if (carousel) {
      if (image !== undefined) carousel.image = image;
      if (title !== undefined) carousel.title = title;
      if (subtitle !== undefined) carousel.subtitle = subtitle;
      if (link !== undefined) carousel.link = link;
      if (isActive !== undefined) carousel.isActive = isActive;
      
      const updated = await carousel.save();
      res.json(updated);
    } else {
      res.status(404).json({ message: 'Carousel not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};

export const deleteCarousel = async (req, res) => {
  try {
    const carousel = await Carousel.findById(req.params.id);
    if (carousel) {
      await carousel.deleteOne();
      res.json({ message: 'Carousel removed' });
    } else {
      res.status(404).json({ message: 'Carousel not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

export const reorderCarousels = async (req, res) => {
  try {
    const { orderedIds } = req.body;
    if (!orderedIds || !Array.isArray(orderedIds)) return res.status(400).json({message: 'Invalid data array'});

    const bulkOps = orderedIds.map((id, index) => ({
      updateOne: {
        filter: { _id: id },
        update: { orderIndex: index }
      }
    }));

    await Carousel.bulkWrite(bulkOps);
    res.json({ message: 'Reordered successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};
