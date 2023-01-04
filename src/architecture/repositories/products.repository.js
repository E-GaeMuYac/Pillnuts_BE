const { Medicines } = require('../../models');

class ProductRepository {
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
  findOneProduct = async (itemSeq) => {
    return Users.findOne({
      raw: true,
      where: { itemSeq },
    });
  };
}

module.exports = ProductRepository;
