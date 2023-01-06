const { Medicines, SavedMedicines } = require('../../models');

class ProductRepository {
  //api 저장하기
  createProducts = async (
    itemSeq,
    itemName,
    entpName,
    itemImage,
    etcOtcCode,
    productType,
    materialName,
    ingrName,
    validTerm,
    eeDocData,
    udDocData,
    nbDocData
  ) => {
    await Medicines.create({
      itemSeq,
      itemName,
      entpName,
      itemImage,
      etcOtcCode,
      productType,
      materialName,
      ingrName,
      validTerm,
      eeDocData,
      udDocData,
      nbDocData,
    });
  };
  updateProducts = async (
    itemSeq,
    itemName,
    entpName,
    itemImage,
    etcOtcCode,
    productType,
    materialName,
    ingrName,
    validTerm,
    eeDocData,
    udDocData,
    nbDocData
  ) => {
    await Medicines.update(
      {
        itemName,
        entpName,
        itemImage,
        etcOtcCode,
        productType,
        materialName,
        ingrName,
        validTerm,
        eeDocData,
        udDocData,
        nbDocData,
      },
      { where: { itemSeq } }
    );
  };

  // 하나 찾기
  findOneProduct = async (itemSeq) => {
    return Medicines.findOne({
      raw: true,
      where: { itemSeq },
    });
  };

  // 저장하기 (찜하기)
  createDibs = async (medicineId, userId) => {
    return SavedMedicines.create({
      medicineId,
      userId,
    });
  };

  // 저장하기 취소 (찜취소)
  deleteDibs = async (medicineId, userId) => {
    return SavedMedicines.destroy({
      where: { medicineId, userId },
    });
  };

  // 이미 저장(찜)한 것인 지 확인
  findOneDibs = async (medicineId, userId) => {
    return SavedMedicines.findOne({
      raw: true,
      where: { medicineId, userId },
    });
  };

  // 저장(찜)한 제품 목록 가져오기
  getDibsProducts = async (userId) => {
    return SavedMedicines.findAll({
      raw: true,
      where: { userId },
      order: [['createdAt', 'DESC']],
      include: [
        {
          model: Medicines,
          attributes: [
            'medicineId',
            'itemName',
            'entpName',
            'etcOtcCode',
            'productType',
            'itemImage',
          ],
        },
      ],
    });
  };

  // 제품 상세 조회
  findOneMedicine = async (medicineId) => {
    return Medicines.findOne({
      raw: true,
      where: { medicineId },
    });
  };
}

module.exports = ProductRepository;
