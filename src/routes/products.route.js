const express = require('express');
const router = express.Router();

const ProductController = require('../architecture/controllers/products.controller');
const productController = new ProductController();

// api 저장하기
router.get('/saved', productController.createProducts);
// 저장(찜)한 제품 목록 가져오기
router.get('/dibs', productController.getDibsProducts);
// 제품 저장하기 (찜하기)
router.post('/:medicineId', productController.dibsProduct);
// 저장(찜)한 제품 삭제하기
router.delete('/:medicineId', productController.deleteDibsProduct);
// 제품 목록 조회 (검색)
router.get('/medicine', productController.findMedicines);

module.exports = router;
