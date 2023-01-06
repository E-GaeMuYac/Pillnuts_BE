const express = require('express');
const router = express.Router();

const loginMiddleware = require('../middlewares/login.middleware');

const ProductController = require('../architecture/controllers/products.controller');
const productController = new ProductController();

// api 저장하기
router.get('/saved', productController.createProducts);
// 저장(찜)한 제품 목록 가져오기
router.get('/dibs', loginMiddleware, productController.getDibsProducts);
// 제품 비교하기
router.get('/compare', productController.compareProducts);
// 제품 목록 조회 (검색)
router.get('/medicines', productController.findMedicines);
// 제품 저장, 삭제하기 (찜하기)
router.put('/:medicineId/dibs', loginMiddleware, productController.dibsProduct);
// 제품 상세 조회
router.get('/:medicineId', productController.findOneMedicine);

module.exports = router;
