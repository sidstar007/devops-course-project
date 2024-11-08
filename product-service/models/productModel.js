// product-service/src/models/productModel.js

const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: { 
      type: String, 
      required: true 
    },
    description: { 
      type: String 
    },
    price: { 
      type: Number, 
      required: true 
    },
    quantity: { 
      type: Number, 
      required: true 
    },
    category: { 
      type: String 
    },
    // Additional fields as needed
  },
  { timestamps: true }
);

module.exports = mongoose.model('Product', productSchema);
