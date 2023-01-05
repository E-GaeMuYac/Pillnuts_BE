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
      { where: { itemSeq } },
      {
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
      }
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
  dibsProduct = async (medicineId, userId) => {
    return SavedMedicines.create({
      medicineId,
      userId,
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
          as: 'Medicine',
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

  deleteDibsProduct = async (medicineId, userId) => {
    return SavedMedicines.destroy({
      where: { medicineId, userId },
    });
  };
}

module.exports = ProductRepository;
