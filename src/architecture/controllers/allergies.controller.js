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
}
module.exports = AllergyController;
