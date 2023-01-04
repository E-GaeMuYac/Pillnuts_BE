const ProductService = require('../services/products.service');

class ProductController {
  constructor() {
    this.productService = new ProductService();
  }
  // api 불러와서 DB에 저장하기
  // DB는 마리아DB를 사용할 지 MySQL 그대로 사용할 지 생각해보기
  createProducts = async (req, res, next) => {
    try {
      await this.productService.createProducts();
    } catch (error) {
      next(error);
    }
  };
}
module.exports = ProductController;
