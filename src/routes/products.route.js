const express = require('express');
const router = express.Router();

const authMiddleware = require('../middlewares/authUser.middleware');
const authCheck = require('../middlewares/authCheck.middleware');

const ProductController = require('../architecture/controllers/products.controller');
const productController = new ProductController();

const cron = require('node-cron');
const dbAutoUpdate = require('../util/autoupdate');

//시간 조정 필요 (UTC기준으로)
cron.schedule('0 2 * * TUE', function () {
  console.log('화요일 오전 2시가 되어 자동으로 api가 등록 됩니다.');
  dbAutoUpdate();
});

// api 저장하기
router.get('/apiUpdateMain', productController.updateProductsMain);
router.get('/apiUpdateType', productController.updateProductsType);
router.get('/apiUpdateImage', productController.updateProductsImage);

// 성분 설명 등록
router.put('/materials', productController.updateMaterials);

// 저장(찜)한 제품 목록 가져오기
router.get('/dibs', authMiddleware, productController.getDibsProducts);
// 제품 비교하기
router.get('/compare', authCheck, productController.compareProducts);
// 제품 목록 조회 (검색)
router.get('/medicines', authCheck, productController.findMedicines);
// 제품 저장, 삭제하기 (찜하기)
router.put('/:medicineId/dibs', authMiddleware, productController.dibsProduct);
// 제품 상세 조회
router.get('/:medicineId', authCheck, productController.findOneMedicine);

module.exports = router;
