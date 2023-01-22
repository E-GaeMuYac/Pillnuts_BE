const AllergyRepository = require('../repositories/allergies.repository');
const {
  ValidationError,
} = require('../../middlewares/exceptions/error.class.js');
const { Op } = require('sequelize');

class AllergyService {
  allergyRepository = new AllergyRepository();

  findAllMaterials = async (value) => {
    const searchValue = ('%' + value + '%').replace(/\s|\b/gi, '');
    const data = await this.allergyRepository.findAllMaterials(searchValue);
    return data || [];
  };
}

module.exports = AllergyService;
