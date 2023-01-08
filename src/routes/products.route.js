const express = require('express');
const router = express.Router();

const authMiddleware = require('../middlewares/authUser.middleware');

const ProductController = require('../architecture/controllers/products.controller');
const productController = new ProductController();

// api 저장하기
router.get('/apiUpdateMain', productController.updateProductsMain);
router.get('/apiUpdateType', productController.updateProductsType);
router.get('/apiUpdateImage', productController.updateProductsImage);

// 저장(찜)한 제품 목록 가져오기
router.get('/dibs', authMiddleware, productController.getDibsProducts);
// 제품 비교하기
router.get('/compare', productController.compareProducts);
// 제품 목록 조회 (검색)
router.get('/medicines', productController.findMedicines);
// 제품 저장, 삭제하기 (찜하기)
router.put('/:medicineId/dibs', authMiddleware, productController.dibsProduct);
// 제품 상세 조회
router.get('/:medicineId', productController.findOneMedicine);

module.exports = router;
