const ProductService = require('../services/products.service');

const {
  InvalidParamsError,
  ValidationError,
  AuthenticationError,
  ExistError,
} = require('../../middlewares/exceptions/error.class.js');

class ProductController {
  constructor() {
    this.productService = new ProductService();
  }
  // api 저장하기
  // DB는 마리아DB를 사용할 지 MySQL 그대로 사용할 지 noSQL 사용도 생각해보기.
  createProducts = async (req, res, next) => {
    try {
      await this.productService.createProducts();
      return res.status(200).json({ msg: '저장이 완료되었습니다.' });
    } catch (error) {
      next(error);
    }
  };

  // 저장하기(찜하기)
  dibsProduct = async (req, res, next) => {
    try {
      if (!req.params.medicineId)
        throw new InvalidParamsError('제품 정보가 없습니다.', 412);
      if (!res.locals.user)
        throw new AuthenticationError('로그인이 필요한 서비스 입니다.', 401);

      const { medicineId } = req.params;
      const userId = res.locals.user;

      await this.productService.dibsProduct(medicineId, userId);
      return res.status(200).json({ msg: '저장에 성공하였습니다.' });
    } catch (error) {
      next(error);
    }
  };

  // 저장(찜)한 제품 목록 가져오기
  getDibsProducts = async (req, res, next) => {
    try {
      if (!res.locals.user)
        throw new AuthenticationError('로그인이 필요한 서비스 입니다.', 401);

      const userId = res.locals.user;

      const dibs = await this.productService.getDibsProducts(userId);

      return res.status(200).json(dibs);
    } catch (error) {
      next(error);
    }
  };

  // 저장(찜)한 제품 삭제하기
  deleteDibsProduct = async (req, res, next) => {
    try {
      if (!req.params.medicineId)
        throw new InvalidParamsError('제품 정보가 없습니다.', 412);
      if (!res.locals.user)
        throw new AuthenticationError('로그인이 필요한 서비스 입니다.', 401);

      const { medicineId } = req.params;
      const userId = res.locals.user;

      await this.productService.deleteDibsProduct(medicineId, userId);
      return res.status(200).json({ msg: '삭제에 성공하였습니다.' });
    } catch (error) {
      next(error);
    }
  };

  // 제품 목록 조회 (검색)
  findMedicines = async (req, res, next) => {
    try {
      if (!eq.query.type || !req.query.value)
        throw InvalidParamsError('검색어를 확인해주세요.', 412);
      const { type, value } = req.query;

      return this.productService.findMedicines(type, value);
    } catch (error) {
      next(error);
    }
  };
}
module.exports = ProductController;
