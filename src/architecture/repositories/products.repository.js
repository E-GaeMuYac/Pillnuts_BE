const { Medicines, SavedMedicines } = require('../../models');
const { Op } = require('sequelize');

class ProductRepository {
  //api 저장하기
  createProductsMain = async (
    itemSeq,
    itemName,
    entpName,
    etcOtcCode,
    materialName,
    ingrName,
    validTerm,
    eeDocData,
    udDocData,
    nbDocData,
    productType
  ) => {
    await Medicines.create({
      itemSeq,
      itemName,
      entpName,
      etcOtcCode,
      materialName,
      ingrName,
      validTerm,
      eeDocData,
      udDocData,
      nbDocData,
      productType,
    });
  };
  updateProductsMain = async (
    itemSeq,
    itemName,
    entpName,
    etcOtcCode,
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
        etcOtcCode,
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

  updateProductsType = async (itemSeq, productType) => {
    return Medicines.update({ productType }, { where: { itemSeq } });
  };

  updateProductsImage = async (itemSeq, itemImage) => {
    return Medicines.update({ itemImage }, { where: { itemSeq } });
  };

  // 전체 데이터 조회, 데이터는 itemSeq만
  findAllProducts = async () => {
    return Medicines.findAll({
      raw: true,
      attributes: ['itemSeq'],
    });
  };

  // 하나 찾기
  findOneProduct = async (itemSeq) => {
    return Medicines.findOne({
      raw: true,
      where: { itemSeq },
    });
  };

  findSearchProduct = async (searchValue) => {
    //itemName : 제품명, productType : 타입, eeDocData: 효능효과
    return Medicines.findAll({
      raw: true,
      where: {
        [Op.or]: [
          {
            itemName: {
              [Op.like]: searchValue,
            },
          },
          {
            productType: {
              [Op.like]: searchValue,
            },
          },
          {
            eeDocData: {
              [Op.like]: searchValue,
            },
          },
        ],
      },
      attributes: [
        'medicineId',
        'itemName',
        'entpName',
        'etcOtcCode',
        'productType',
        'itemImage',
      ],
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
