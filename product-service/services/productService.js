

const Product = require('../models/productModel');
const eventPublisher = require('../events/eventPublisher');

exports.createProduct = async (productData) => {
  const newProduct = new Product(productData);
  await newProduct.save();

  // Emit "Product Created" event
  eventPublisher.publish('product.created', {
    productId: newProduct._id,
    name: newProduct.name,
    quantity: newProduct.quantity,
  });

  return newProduct;
};

exports.updateProduct = async (productId, updateData) => {
  const updatedProduct = await Product.findByIdAndUpdate(
    productId,
    updateData,
    { new: true }
  );

  if (!updatedProduct) {
    throw new Error('Product not found');
  }

  // Emit "Product Updated" event
  eventPublisher.publish('product.updated', {
    productId: updatedProduct._id,
    name: updatedProduct.name,
    quantity: updatedProduct.quantity,
  });

  return updatedProduct;
};

exports.deleteProduct = async (productId) => {
  const deletedProduct = await Product.findByIdAndDelete(productId);

  if (!deletedProduct) {
    throw new Error('Product not found');
  }

  // Emit "Product Deleted" event
  eventPublisher.publish('product.deleted', {
    productId: deletedProduct._id,
  });

  return deletedProduct;
};

exports.getProductById = async (productId) => {
  const product = await Product.findById(productId);
  if (!product) {
    throw new Error('Product not found');
  }
  return product;
};

exports.getAllProducts = async () => {
  return await Product.find();
};

exports.updateInventory = async (productId, quantityChange) => {
  console.log('Product ID:', productId);  // Add this line to check the productId
  const product = await Product.findById(productId);
  console.log('Found product:', product);  // Add this line to check if the product is found
  if (!product) {
    throw new Error('Product not found');
  }
  product.quantity += quantityChange;
  await product.save();

  // Emit "Inventory Updated" event
  eventPublisher.publish('inventory.updated', {
    productId: product._id,
    quantity: product.quantity,
  });

  return product;
};

