import Category from '../models/Category.js';
import Product from '../models/Product.js';

export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find({});
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

export const createCategory = async (req, res) => {
  try {
    const { name } = req.body;
    const slug = name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const category = await Category.create({ name: name.trim(), slug });
    res.status(201).json(category);
  } catch (error) {
    res.status(400).json({ message: 'Category already exists or invalid' });
  }
};

export const updateCategory = async (req, res) => {
  try {
    const { name } = req.body;
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ message: 'Not found' });
    
    const oldSlug = category.slug;
    const newSlug = name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-');
    
    category.name = name.trim();
    category.slug = newSlug;
    await category.save();

    // Cascading update to automatically rename the tag in all bound Products
    await Product.updateMany(
      { categories: oldSlug },
      { $set: { "categories.$": newSlug } }
    );

    res.json(category);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ message: 'Not found' });
    
    const slug = category.slug;
    await category.deleteOne();

    // Pull entirely out of product tagging arrays natively
    await Product.updateMany(
      { categories: slug },
      { $pull: { categories: slug } }
    );

    res.json({ message: 'Category removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

export const addSubcategory = async (req, res) => {
  try {
    const { name } = req.body;
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ message: 'Not found' });
    
    const slug = name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-');
    category.subcategories.push({ name: name.trim(), slug });
    await category.save();
    
    res.json(category);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

export const deleteSubcategory = async (req, res) => {
  try {
    const { id, subId } = req.params;
    const category = await Category.findById(id);
    if (!category) return res.status(404).json({ message: 'Not found' });
    
    const sub = category.subcategories.id(subId);
    if (sub) {
       const slug = sub.slug;
       category.subcategories.pull(subId);
       await category.save();

       // Sever bindings softly across products
       await Product.updateMany(
         { categories: slug },
         { $pull: { categories: slug } }
       );
    }
    res.json(category);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};
