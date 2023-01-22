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

  findOneMaterial = async (materialId) => {
    return Materials.findOne({
      raw: true,
      where: { materialId },
      attributes: ['name', 'content'],
    });
  };

  findOneAllergy = async (userId, materialId) => {
    return Allergies.findOne({
      raw: true,
      where: { userId, materialId },
    });
  };

  createAllergy = async (userId, materialId) => {
    return Allergies.create({
      userId,
      materialId,
    });
  };

  deleteAllergy = async (userId, materialId) => {
    return Allergies.destroy({
      where: { userId, materialId },
    });
  };
}

module.exports = AllergyRepository;
