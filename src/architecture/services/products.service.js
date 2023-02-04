const ProductRepository = require('../repositories/products.repository');
require('dotenv').config();
const axios = require('axios');
const {
  ValidationError,
} = require('../../middlewares/exceptions/error.class.js');
const { Op } = require('sequelize');

class ProductService {
  productsRepository = new ProductRepository();

  // api 등록하기
  updateProductsMain = async (start) => {
    let {
      data: { body: body },
    } = await axios.get(process.env.MEDI_A_API_END_POINT, {
      params: {
        serviceKey: process.env.MEDI_API_KEY_DEC,
        numOfRows: 1,
        pageNo: 1,
        type: 'json',
      },
    });
    for (let p = start; p <= (body.totalCount / 100).toFixed(); p++) {
      let {
        data: { body: mainBody },
      } = await axios.get(process.env.MEDI_A_API_END_POINT, {
        params: {
          serviceKey: process.env.MEDI_API_KEY_DEC,
          numOfRows: 100,
          pageNo: p,
          type: 'json',
        },
      });
      for (let rowCount = 0; rowCount < mainBody.numOfRows; rowCount++) {
        let {
          ITEM_SEQ: itemSeq,
          ITEM_NAME: itemName,
          ENTP_NAME: entpName,
          ETC_OTC_CODE: etcOtcCode,
          MATERIAL_NAME: materials,
          VALID_TERM: validTerm,
          EE_DOC_DATA: eeDoc,
          UD_DOC_DATA: udDoc,
          NB_DOC_DATA: nbDoc,
          INGR_NAME: ingredients,
          ITEM_ENG_NAME: itemEngName,
        } = mainBody.items[rowCount];

        // 총량
        let totalAmount = materials.split('|')[0].split(':')[1];
        if (totalAmount == null) totalAmount = '';

        // 첨가물
        let ingrName = '';
        if (ingredients === null) {
          ingrName = ingredients;
        } else if (ingredients.includes('|')) {
          for (let x = 0; x < ingredients.split('|').length; x++) {
            if (x === ingredients.split('|').length - 1) {
              ingrName += ingredients.split('|')[x].split(']')[1];
            } else {
              ingrName += ingredients.split('|')[x].split(']')[1] + ', ';
            }
          }
        } else {
          ingrName += ingredients.split(']')[1];
        }

        const check = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/;

        // 효능효과
        let eeDocData = '';
        if (eeDoc === null) {
          eeDocData = eeDoc;
        } else {
          for (let i = 0; i < eeDoc.split('>').length; i++) {
            if (check.test(eeDoc.split('>')[i])) {
              eeDocData +=
                eeDoc
                  .split('>')
                  [i].replace('-', '~')
                  .replace(
                    /type="EE"|title|ARTICLE|PARAGRAPH|tagName="p"|marginLeft|CDATA|DOC|type="NB"|SECTION|sub|amp|nbsp|x2024>/g,
                    ''
                  )
                  .replace(
                    /[^(|)|,|.|mgclL|●|:|%| |~|a-z|A-Z|0-9|가-힣|/]/g,
                    ''
                  )
                  .trim() + '\n';
            }
          }
          eeDocData = eeDocData.substring(5);
        }

        // 용법용량;
        let udDocData = '';
        if (udDoc !== null) {
          for (let i = 0; i < udDoc.split('>').length; i++) {
            if (check.test(udDoc.split('>')[i])) {
              udDocData +=
                udDoc
                  .split('>')
                  [i].replace('-', '~')
                  .replace(
                    /type="EE"|title|ARTICLE|PARAGRAPH|tagName="p"|marginLeft|CDATA|DOC|type="NB"|SECTION|sub|amp|nbsp|x2024>/g,
                    ''
                  )
                  .replace(
                    /[^(|)|,|.|mgclL|●|:|%| |~|a-z|A-Z|0-9|가-힣|/]/g,
                    ''
                  )
                  .trim() + '\n';
            }
          }
          udDocData = udDocData.substring(5);
        }

        // 주의사항
        let nbDocData = '';
        if (nbDoc === null) {
          nbDocData = nbDoc;
        } else {
          for (let i = 0; i < nbDoc.split('<').length; i++) {
            if (check.test(nbDoc.split('<')[i])) {
              nbDocData +=
                nbDoc
                  .split('<')
                  [i].replace('-', '~')
                  .replace(
                    /type="EE"|title|ARTICLE|PARAGRAPH|tagName="p"|marginLeft|CDATA|DOC|type="NB"|SECTION|sub|amp|nbsp|x2024|p>/g,
                    ''
                  )
                  .replace(
                    /[^(|)|,|.|mgclL|●|:|%| |~|a-z|A-Z|0-9|가-힣|/]/g,
                    ''
                  )
                  .trim() + '\n';
            }
          }
          nbDocData = nbDocData.substring(8).trim();
        }
        // DB에 저장되어 있는 지 확인
        let medicine = await this.productsRepository.findOneProduct(itemSeq);
        // 없으면 create. 있으면 update
        if (!medicine) {
          medicine = await this.productsRepository.createProductsMain(
            itemSeq, //등록 번호
            itemName, //등록 명
            itemEngName, //영문명
            entpName, //제조사
            etcOtcCode, //약국 구매 가능 여부
            ingrName, //첨가물
            validTerm, //유통기한
            eeDocData, //효능효과
            udDocData, //용법용량
            nbDocData, //주의사항
            totalAmount // 총량
          );
        } else {
          await this.productsRepository.updateProductsMain(
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
          );
        }

        // 성분
        for (let j = 0; j < materials.split('|').length; j++) {
          if (materials.split('|')[j].includes('성분명')) {
            let name = materials.split('|')[j].split(':')[1].trim();
            let material = await this.productsRepository.findOneMaterial(name);
            if (!material) {
              let unit = materials.split('|')[j + 2].split(':')[1].trim();
              material = await this.productsRepository.createMaterial(
                name,
                unit
              );
            }

            let volume = materials
              .split('|')
              [j + 1].split(':')[1]
              .trim()
              .split('(')[0]
              .split(' ')[0]
              .replace(/[^.|0-9]/g, '');

            let ingredient = await this.productsRepository.findOneIngredient(
              medicine.medicineId,
              material.materialId
            );

            if (!ingredient) {
              ingredient = await this.productsRepository.createIngredients(
                medicine.medicineId,
                material.materialId,
                volume
              );
            } else {
              if (ingredient.volume !== volume)
                await this.productsRepository.updateIngredients(
                  ingredient.ingredientId,
                  volume
                );
            }
          }
        }
      }
    }
    return;
  };
  // 효과 분류
  updateProductsType = async (start) => {
    let {
      data: { body: body },
    } = await axios.get(process.env.MEDI_B_API_END_POINT, {
      params: {
        // 공공데이터포탈에서 발급 받은 인증키
        serviceKey: process.env.MEDI_API_KEY_DEC,
        // 한 페이지 결과 수. 100개까지만 가능
        numOfRows: 1,
        // 페이지 번호.
        pageNo: 1,
        type: 'json',
      },
    });
    for (let p = start; p <= (body.totalCount / 100).toFixed(); p++) {
      let {
        data: { body: typeBody },
      } = await axios.get(process.env.MEDI_B_API_END_POINT, {
        params: {
          serviceKey: process.env.MEDI_API_KEY_DEC,
          numOfRows: 100,
          pageNo: p,
          type: 'json',
        },
      });

      for (let rowCount = 0; rowCount < typeBody.numOfRows; rowCount++) {
        // 효과 분류
        let productType = '';
        if (typeBody.items[rowCount].PRDUCT_TYPE !== null) {
          productType = typeBody.items[rowCount].PRDUCT_TYPE.split(']')[1];
          if (productType.split('.').length) {
            productType = productType.split('.');
            for (let i = 0; i < productType.length; i++) {
              if (i !== productType.length - 1) {
                productType[i] = productType[i] + '제';
              }
            }
          }
        }
        if (productType)
          await this.productsRepository.updateProductsType(
            typeBody.items[rowCount].ITEM_SEQ,
            productType.join('.')
          );
      }
    }
    return;
  };
  //알약 이미지 저장
  updateProductsImage = async (start) => {
    let {
      data: { body: body },
    } = await axios.get(process.env.MEDI_C_API_END_POINT, {
      params: {
        serviceKey: process.env.MEDI_API_KEY_DEC,
        numOfRows: 1,
        pageNo: 1,
        type: 'json',
      },
    });
    for (let p = start; p <= (body.totalCount / 100).toFixed(); p++) {
      let {
        data: { body: imageBody },
      } = await axios.get(process.env.MEDI_C_API_END_POINT, {
        params: {
          serviceKey: process.env.MEDI_API_KEY_DEC,
          numOfRows: 100,
          pageNo: p,
          type: 'json',
        },
      });

      for (let rowCount = 0; rowCount < imageBody.numOfRows; rowCount++) {
        let itemImage = '';
        if (imageBody.items[rowCount].ITEM_IMAGE !== null) {
          itemImage = imageBody.items[rowCount].ITEM_IMAGE;
          await this.productsRepository.updateProductsImage(
            imageBody.items[rowCount].ITEM_SEQ,
            itemImage
          );
        }
      }
    }
    return;
  };

  // 성분 설명 추가
  updateMaterials = async (contents) => {
    for (let i = 0; i < contents.length; i++) {
      let { materialId, content } = contents[i];
      await this.productsRepository.updateMaterials(materialId, content);
    }
    return;
  };

  // 저장하기 (찜하기)
  dibsProduct = async (medicineId, userId) => {
    const product = await this.productsRepository.findOneMedicine(medicineId);
    if (!product) throw new ValidationError('제품 정보가 없습니다.', 412);
    const dibsProduct = await this.productsRepository.findOneDibs(
      medicineId,
      userId
    );
    if (!dibsProduct) {
      await this.productsRepository.createDibs(medicineId, userId);
      return '저장';
    } else {
      await this.productsRepository.deleteDibs(medicineId, userId);
      return '삭제';
    }
  };

  // 저장(찜)한 제품 목록 가져오기
  getDibsProducts = async (userId) => {
    const dibsProducts = await this.productsRepository.getDibsProducts(userId);
    if (!dibsProducts) return [];
    return dibsProducts.map((dibs) => {
      return {
        medicineId: dibs['Medicine.medicineId'],
        itemName: dibs['Medicine.itemName'].split('(')[0],
        entpName: dibs['Medicine.entpName'],
        etcOtcCode: dibs['Medicine.etcOtcCode'],
        productType: dibs['Medicine.productType'].split('.'),
        itemImage: dibs['Medicine.itemImage'],
      };
    });
  };

  // 제품 목록 조회 (검색)
  findMedicines = async (type, value, page, pageSize, userId) => {
    const searchValue = ('%' + value + '%')
      .replace(' ', '%')
      .replace(/\s|\b/gi, '');
    let data;
    let dibs = [];

    if (type === 'itemName') {
      data = {
        [Op.or]: {
          itemName: {
            [Op.like]: searchValue,
          },
          itemEngName: {
            [Op.like]: searchValue,
          },
        },
      };
    } else if (type === 'productType') {
      data = {
        productType: {
          [Op.like]: searchValue,
        },
      };
    }
    const searchData = await this.productsRepository.findSearchProduct(
      data,
      page,
      pageSize
    );
    if (userId) {
      dibs = await this.productsRepository.getDibsProducts(userId);
    }

    const processingData = searchData.rows.map((d) => {
      return {
        medicineId: d.medicineId,
        itemName: d.itemName.split('(')[0],
        itemEngName: d.itemEngName.split('(')[0],
        entpName: d.entpName,
        etcOtcCode: d.etcOtcCode,
        productType: d.productType.split('.'),
        itemImage: d.itemImage,
        dibs: Boolean(dibs.find((v) => v.medicineId === d.medicineId)),
      };
    });
    return (
      { searchLength: searchData.count.length, data: processingData } || []
    );
  };

  // 제품 상세 조회
  findOneMedicine = async (medicineId, userId) => {
    const product = await this.productsRepository.findOneMedicine(medicineId);

    if (!product)
      throw new ValidationError('약품 정보를 찾을 수 없습니다.', 412);

    const ingredients = await this.productsRepository.findAllIngredients(
      medicineId
    );

    product.itemName = product.itemName.split('(')[0];
    product.productType = product.productType.split('.');

    for (let i = 0; i < ingredients.length; i++) {
      let allergy = await this.productsRepository.findOneAllergy(
        userId,
        ingredients[i]['Material.materialId']
      );
      if (allergy) {
        ingredients[i].allergy = true;
      } else {
        ingredients[i].allergy = false;
      }
    }

    product.materialName = ingredients.map((i) => {
      if (i['Material.unit'] === '그램') {
        i.volume = i.volume * 1000;
      }
      return {
        material: i['Material.name'],
        분량: i.volume,
        설명: i['Material.content'],
        allergy: i.allergy,
      };
    });

    if (userId) {
      const dibs = await this.productsRepository.findOneDibs(
        medicineId,
        userId
      );
      product.dibs = Boolean(dibs);
    } else {
      product.dibs = false;
    }

    return product;
  };
}

module.exports = ProductService;
