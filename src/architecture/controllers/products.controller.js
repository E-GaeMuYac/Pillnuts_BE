const ProductService = require('../services/products.service');

const {
  InvalidParamsError,
} = require('../../middlewares/exceptions/error.class.js');

class ProductController {
  constructor() {
    this.productService = new ProductService();
  }

  // api 저장하기
  updateProductsMain = async (req, res, next) => {
    try {
      const { start } = req.query;
      await this.productService.updateProductsMain(start);
      res.redirect('/api/products/apiUpdateType?start=1');
    } catch (error) {
      if (
        error.message.includes(
          'Axios' || 'ECONNRESET' || 'ECONNREFUSED' || 'ETIMEDOUT'
        )
      ) {
        res.redirect(
          `/api/products/apiUpdateMain?start=${error.config.params.pageNo}`
        );
      }
      next(error);
    }
  };
  updateProductsType = async (req, res, next) => {
    try {
      const { start } = req.query;
      await this.productService.updateProductsType(start);
      res.redirect('/api/products/apiUpdateImage?start=1');
    } catch (error) {
      if (
        error.message.includes(
          'Axios' || 'ECONNRESET' || 'ECONNREFUSED' || 'ETIMEDOUT'
        )
      ) {
        res.redirect(
          `/api/products/apiUpdateType?start=${error.config.params.pageNo}`
        );
      }
      next(error);
    }
  };
  updateProductsImage = async (req, res, next) => {
    try {
      const { start } = req.query;
      await this.productService.updateProductsImage(start);
      return res.status(200).json({ msg: 'api 정보가 업데이트 되었습니다.' });
    } catch (error) {
      if (
        error.message.includes(
          'Axios' || 'ECONNRESET' || 'ECONNREFUSED' || 'ETIMEDOUT'
        )
      ) {
        res.redirect(
          `/api/products/apiUpdateImage?start=${error.config.params.pageNo}`
        );
      }
      next(error);
    }
  };

  // 성분 설명 추가
  updateMaterials = async (req, res, next) => {
    try {
      const { contents } = req.body;

      await this.productService.updateMaterials(contents);

      res.status(200).json({ msg: '성분 설명 저장을 완료하였습니다.' });
    } catch (error) {
      next(error);
    }
  };

  // 저장하기(찜하기)
  dibsProduct = async (req, res, next) => {
    try {
      const { medicineId } = req.params;
      const { userId } = res.locals;

      if (!medicineId)
        throw new InvalidParamsError('제품 정보가 없습니다.', 412);

      const result = await this.productService.dibsProduct(medicineId, userId);
      return res.status(200).json({ msg: `${result}에 성공하였습니다.` });
    } catch (error) {
      next(error);
    }
  };

  // 저장(찜)한 제품 목록 가져오기
  getDibsProducts = async (req, res, next) => {
    try {
      const { userId } = res.locals;

      const dibs = await this.productService.getDibsProducts(userId);

      return res.status(200).json(dibs);
    } catch (error) {
      next(error);
    }
  };

  // 제품 목록 조회 (검색)
  findMedicines = async (req, res, next) => {
    try {
      let { type, value, page, pageSize } = req.query;

      if (!type || (type !== 'itemName' && type !== 'productType'))
        throw new InvalidParamsError('검색분류를 확인해주세요.', 412);
      if (!value) throw new InvalidParamsError('검색어를 확인해주세요.', 412);
      if (!page || page <= 0) page = 1;
      if (!pageSize || pageSize <= 0) pageSize = 20;

      const products = await this.productService.findMedicines(
        type,
        value,
        page,
        pageSize
      );

      res.status(200).json(products);
    } catch (error) {
      next(error);
    }
  };

  // 제품 상세 조회
  findOneMedicine = async (req, res, next) => {
    try {
      const { medicineId } = req.params;

      if (!medicineId)
        throw new InvalidParamsError('제품 정보가 없습니다.', 412);

      const product = await this.productService.findOneMedicine(medicineId);

      res.status(200).json({ product });
    } catch (error) {
      next(error);
    }
  };

  // 제품 비교하기
  compareProducts = async (req, res, next) => {
    try {
      if (!req.params)
        throw new InvalidParamsError('비교 할 약품을 다시 확인해주세요.', 412);
      const { compareA, compareB } = req.query;
      if (!compareA || !compareB)
        throw new InvalidParamsError('비교 할 약품을 다시 확인해주세요.', 412);

      const productA = await this.productService.findOneMedicine(compareA);
      const productB = await this.productService.findOneMedicine(compareB);

      res.status(200).json({ compareA: productA, compareB: productB });
    } catch (error) {}
  };
}
module.exports = ProductController;
