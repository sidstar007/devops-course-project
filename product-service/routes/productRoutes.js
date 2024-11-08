const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const authMiddleware = require('../middleware/authMiddleware');


router.get('/',authMiddleware(false) ,productController.getAllProducts);
router.get('/:id',authMiddleware(false) ,productController.getProductById);

// Protected routes (Admin only)
router.post('/', authMiddleware(true), productController.createProduct);
router.put('/:id', authMiddleware(true), productController.updateProduct);
router.delete('/:id', authMiddleware(true), productController.deleteProduct);

module.exports = router;
