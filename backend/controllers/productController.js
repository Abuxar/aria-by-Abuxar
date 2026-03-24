import Product from '../models/Product.js';

export const getProducts = async (req, res) => {
  try {
    const { category, subcategory } = req.query;
    let query = {};
    if (category && subcategory) {
       query.categories = { $all: [category, subcategory] };
    } else if (category) {
       query.categories = category;
    }
    
    // For extreme retro-compatibility, if a product has legacy 'category' string but no 'categories' array,
    // we can fallback matching it natively. But arrays are preferred now!
    if (category && !subcategory) {
        query = { 
           $or: [
              { categories: category },
              { category: category }
           ]
        };
    }

    const products = await Product.find(query);
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createProduct = async (req, res) => {
  try {
    const product = new Product({
      title: 'Sample Product',
      price: 0,
      description: 'Sample description',
      images: ['https://images.unsplash.com/photo-1594911772125-07fc7a2d8d9f?auto=format&fit=crop&w=600&q=80'],
      category: 'Sample category',
      stock: 0,
    });
    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { title, price, description, images, category, categories, stock, discountPercent, isActive } = req.body;
    const product = await Product.findById(req.params.id);
    
    if (product) {
      product.title = title || product.title;
      product.price = price !== undefined ? price : product.price;
      product.description = description || product.description;
      product.images = images || product.images;
      product.category = category || product.category;
      if (categories !== undefined) product.categories = categories;
      product.stock = stock !== undefined ? stock : product.stock;
      if (discountPercent !== undefined) product.discountPercent = discountPercent;
      if (isActive !== undefined) product.isActive = isActive;
      
      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      await product.deleteOne(); // updated from remove()
      res.json({ message: 'Product removed' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

export const bulkAssignCategory = async (req, res) => {
  try {
    const { categoryName, productIds } = req.body;
    if (!categoryName || !productIds || !productIds.length) {
       return res.status(400).json({ message: 'Invalid data provided' });
    }
    
    // $addToSet ensures no duplicates inside the array!
    await Product.updateMany(
      { _id: { $in: productIds } },
      { $addToSet: { categories: categoryName } }
    );
    res.json({ message: 'Categories bulk assigned successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};
