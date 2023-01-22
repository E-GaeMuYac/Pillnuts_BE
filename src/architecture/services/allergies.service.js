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

  userAllergy = async (userId) => {
    const data = await this.allergyRepository.userAllergy(userId);

    return data.map(async (d) => {
      const material = await this.allergyRepository.findOneMaterials(
        d.materialId
      );
      return {
        allergyId: d.allergyId,
        materialId: d.materialId,
        name: material.name,
        content: material.content,
      };
    });
  };
}

module.exports = AllergyService;
