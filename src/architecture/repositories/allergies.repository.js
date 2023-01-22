const { Materials, Allergies } = require('../../models');
const { Op } = require('sequelize');

class AllergyRepository {
  findAllMaterials = async (searchValue) => {
    return Materials.findAndCountAll({
      raw: true,
      where: {
        name: {
          [Op.like]: searchValue,
        },
      },
      attributes: ['materialId', 'name', 'content'],
    });
  };
}

module.exports = AllergyRepository;
