const { Medicines, Materials, Ingredients } = require('../models');
require('dotenv').config();
const axios = require('axios');

module.exports = async (req, res, next) => {
  try {
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
    for (let p = 1; p <= (body.totalCount / 100).toFixed(); p++) {
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
          eeDocData = eeDocData.substring(5);
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
                  [i].replace(/[^(|)|,|.| |0-9|가-힣]/g, '')
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
              .replace(/[^0-9]/g, '');

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
  } catch (error) {
    if (
      error.message.includes('Axios') ||
      error.message.includes('ECONNRESET') ||
      error.message.includes('ECONNREFUSED') ||
      error.message.includes('ETIMEDOUT')
    ) {
      res.redirect(
        `/api/products/apiUpdateMain?start=${error.config.params.pageNo}`
      );
    } else {
      next(error);
    }
  }
  try {
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
        await Medicines.update(
          { productType },
          { where: { itemSeq: typeBody.items[rowCount].ITEM_SEQ } }
        );
      }
    }
  } catch (error) {
    if (
      error.message.includes('Axios') ||
      error.message.includes('ECONNRESET') ||
      error.message.includes('ECONNREFUSED') ||
      error.message.includes('ETIMEDOUT')
    ) {
      res.redirect(
        `/api/products/apiUpdateType?start=${error.config.params.pageNo}`
      );
    } else {
      next(error);
    }
  }
  try {
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
          await Medicines.update(
            { itemImage },
            { where: { itemSeq: imageBody.items[rowCount].ITEM_SEQ } }
          );
        }
      }
    }
  } catch (error) {
    if (
      error.message.includes('Axios') ||
      error.message.includes('ECONNRESET') ||
      error.message.includes('ECONNREFUSED') ||
      error.message.includes('ETIMEDOUT')
    ) {
      res.redirect(
        `/api/products/apiUpdateImage?start=${error.config.params.pageNo}`
      );
    } else {
      next(error);
    }
  }
};
