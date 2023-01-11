const ProductRepository = require('../repositories/products.repository');
require('dotenv').config();
const axios = require('axios');
const {
  ValidationError,
} = require('../../middlewares/exceptions/error.class.js');

class ProductService {
  productsRepository = new ProductRepository();

  // api 등록하기
  updateProductsMain = async (start) => {
    let {
      data: { body: body },
    } = await axios.get(process.env.MEDI_A_API_END_POINT, {
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
        data: { body: mainBody },
      } = await axios.get(process.env.MEDI_A_API_END_POINT, {
        params: {
          serviceKey: process.env.MEDI_API_KEY_DEC, // 공공데이터포탈에서 발급 받은 인증키
          numOfRows: 100, // 한 페이지 결과 수. 100개까지만 가능
          pageNo: p, // 페이지 번호.
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
              ingrName += ingredients.split('|')[x].split(']')[1] + ',';
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
          for (let i = 0; i < eeDoc.split('<').length; i++) {
            if (check.test(eeDoc.split('<')[i])) {
              eeDocData +=
                eeDoc
                  .split('<')
                  [i].replace(/[^(|)|,|.| |0-9|가-힣]/g, '')
                  .trim() + '\n';
            }
          }
        }

        // 용법용량
        let udDocData = '';
        if (udDoc !== null) {
          for (let i = 0; i < udDoc.split('<').length; i++) {
            if (check.test(udDoc.split('<')[i])) {
              udDocData +=
                udDoc
                  .split('<')
                  [i].replace(/[^(|)|,|.| |0-9|가-힣]/g, '')
                  .trim() + '\n';
            }
          }
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
                  [i].replace(/[^(|)|,|.| |0-9|가-힣]/g, '')
                  .trim() + '\n';
            }
          }
        }

        // DB에 저장되어 있는 지 확인
        let medicine = await this.productsRepository.findOneProduct(itemSeq);

        // 없으면 create. 있으면 update
        if (!medicine) {
          medicine = await this.productsRepository.createProductsMain(
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

            let volume = materials.split('|')[j + 1].split(':')[1].trim();

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
        console.log(`main update ${p}페이지의 ${rowCount}번쨰 저장중`);
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
        }
        await this.productsRepository.updateProductsType(
          typeBody.items[rowCount].ITEM_SEQ,
          productType
        );

        console.log(`type update ${p}페이지의 ${rowCount}번쨰 저장중`);
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
        console.log(`image update ${p}페이지의 ${rowCount}번쨰 저장중`);
      }
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
    console.log(dibsProducts);
    if (!dibsProducts) return [];
    return dibsProducts.map((dibs) => {
      return {
        medicineId: dibs['Medicine.medicineId'],
        itemName: dibs['Medicine.itemName'],
        entpName: dibs['Medicine.entpName'],
        etcOtcCode: dibs['Medicine.etcOtcCode'],
        productType: dibs['Medicine.productType'],
        itemImage: dibs['Medicine.itemImage'],
      };
    });
  };

  // 제품 목록 조회 (검색)
  findMedicines = async (value) => {
    const searchValue = '%' + value.replace(/\s/gi, '') + '%';
    const products = await this.productsRepository.findSearchProduct(
      searchValue
    );
    return products || [];
  };

  // 제품 상세 조회
  findOneMedicine = async (medicineId) => {
    const product = await this.productsRepository.findOneMedicine(medicineId);
    const ingredients = await this.productsRepository.findAllIngredients(
      medicineId
    );
    product.materialName = ingredients.map((i) => {
      return {
        material: i['Material.name'],
        분량: i.volume,
        단위: i['Material.unit'],
        설명: i['Material.content'],
      };
    });

    if (!product)
      throw new ValidationError('약품 정보를 찾을 수 없습니다.', 412);

    return product;
  };
}

module.exports = ProductService;
