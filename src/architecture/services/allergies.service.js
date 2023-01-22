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

    return data.map((d) => {
      return {
        allergyId: d.allergyId,
        materialId: d.materialId,
        name: d['Material.name'],
        content: d['Material.content'],
      };
    });
  };

  updateAllergy = async (userId, materialId) => {
    const material = await this.allergyRepository.findOneMaterial(materialId);
    if (!material) throw new ValidationError('성분 정보가 없습니다.', 412);
    const userAllergy = await this.allergyRepository.findOneAllergy(
      userId,
      materialId
    );
    if (!userAllergy) {
      await this.allergyRepository.createAllergy(userId, materialId);
      return '알러지 등록';
    } else {
      await this.allergyRepository.deleteAllergy(userId, materialId);
      return '알러지 삭제';
    }
  };
}

module.exports = AllergyService;
