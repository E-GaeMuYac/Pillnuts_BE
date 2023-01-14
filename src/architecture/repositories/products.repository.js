const {
  Medicines,
  SavedMedicines,
  Materials,
  Ingredients,
} = require('../../models');

class ProductRepository {
  //api 저장하기
  createProductsMain = async (
    itemSeq, //등록 번호
    itemName, //등록 명
    entpName, //제조사
    etcOtcCode, //약국 구매 가능 여부
    ingrName, //첨가물
    validTerm, //유통기한
    eeDocData, //효능효과
    udDocData, //용법용량
    nbDocData, //주의사항
    totalAmount // 총량
  ) => {
    return Medicines.create({
      itemSeq,
      itemName,
      entpName,
      etcOtcCode,
      ingrName,
      validTerm,
      eeDocData,
      udDocData,
      nbDocData,
      totalAmount,
    });
  };
  updateProductsMain = async (
    itemSeq, //등록 번호
    itemName, //등록 명
    entpName, //제조사
    etcOtcCode, //약국 구매 가능 여부
    ingrName, //첨가물
    validTerm, //유통기한
    eeDocData, //효능효과
    udDocData, //용법용량
    nbDocData, //주의사항
    totalAmount // 총량
  ) => {
    await Medicines.update(
      {
        itemName, //등록 명
        entpName, //제조사
        etcOtcCode, //약국 구매 가능 여부
        ingrName, //첨가물
        validTerm, //유통기한
        eeDocData, //효능효과
        udDocData, //용법용량
        nbDocData, //주의사항
        totalAmount, // 총량
      },
      { where: { itemSeq } }
    );
  };
  createIngredients = async (medicineId, materialId, volume) => {
    await Ingredients.create({
      medicineId,
      materialId,
      volume,
    });
  };
  updateIngredients = async (ingredientId, volume) => {
    return Ingredients.update({ volume }, { where: { ingredientId } });
  };
  findOneIngredient = async (medicineId, materialId) => {
    return Ingredients.findOne({
      raw: true,
      where: { medicineId, materialId },
    });
  };
  updateProductsType = async (itemSeq, productType) => {
    return Medicines.update({ productType }, { where: { itemSeq } });
  };
  updateProductsImage = async (itemSeq, itemImage) => {
    return Medicines.update({ itemImage }, { where: { itemSeq } });
  };
  createMaterial = async (name, unit) => {
    return Materials.create({ name, unit });
  };
  findOneMaterial = async (name) => {
    return Materials.findOne({
      raw: true,
      where: { name },
    });
  };
  updateMaterials = async (materialId, content) => {
    return Materials.update({ content }, { where: { materialId } });
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

  // 검색
  findSearchProduct = async (data, page, pageSize) => {
    console.log(data);
    //itemName : 제품명, productType : 타입, eeDocData: 효능효과
    return Medicines.findAndCountAll({
      raw: true,
      where: data,
      include: [
        {
          model: SavedMedicines,
          as: 'SavedMedicines',
          attributes: [],
          duplicating: false,
          required: false,
        },
      ],
      attributes: [
        'medicineId',
        'itemName',
        'entpName',
        'etcOtcCode',
        'productType',
        'itemImage',
        [
          SavedMedicines.sequelize.fn(
            'count',
            SavedMedicines.sequelize.col('SavedMedicines.medicineId')
          ),
          'savedCount',
        ],
      ],
      group: ['medicineId'],
      order: [['savedCount', 'DESC']],
      offset: (page - 1) * pageSize,
      limit: Number(pageSize),
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
  findAllIngredients = async (medicineId) => {
    return Ingredients.findAll({
      raw: true,
      where: { medicineId },
      attributes: ['volume'],
      include: [
        {
          model: Materials,
          attributes: ['name', 'unit', 'content'],
        },
      ],
    });
  };
}

module.exports = ProductRepository;
