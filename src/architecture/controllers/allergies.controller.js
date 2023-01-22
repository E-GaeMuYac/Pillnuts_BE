const AllergyService = require('../services/allergies.service');

const {
  InvalidParamsError,
} = require('../../middlewares/exceptions/error.class.js');

class AllergyController {
  constructor() {
    this.allergyService = new AllergyService();
  }

  findAllMaterials = async (req, res, next) => {
    try {
      const { value } = req.query;

      if (value === '' || !value)
        throw new InvalidParamsError('검색어를 확인해주세요.', 412);

      const data = await this.allergyService.findAllMaterials(value);

      res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  };

  userAllergy = async (req, res, next) => {
    try {
      const { userId } = res.locals;

      const data = await this.allergyService.userAllergy(userId);

      console.log('data : ', data);
      res.status(200).json({ userId, data });
    } catch (error) {
      next(error);
    }
  };

  updateAllergy = async (req, res, next) => {
    try {
      const { userId } = res.locals;
      const { materialId } = req.params;

      if (!materialId)
        throw new InvalidParamsError('제품 정보가 없습니다.', 412);

      const result = await this.allergyService.updateAllergy(
        userId,
        materialId
      );
      return res.status(200).json({ msg: `${result}에 성공하였습니다.` });
    } catch (error) {
      next(error);
    }
  };
}
module.exports = AllergyController;
