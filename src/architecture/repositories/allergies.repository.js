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

  userAllergy = async (userId) => {
    return Allergies.findAll({
      raw: true,
      where: { userId },
      attributes: ['allergyId', 'materialId'],
      include: [
        {
          model: Materials,
          attributes: ['name', 'content'],
        },
      ],
    });
  };
}

module.exports = AllergyRepository;
