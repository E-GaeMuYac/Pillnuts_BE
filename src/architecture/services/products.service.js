const ProductRepository = require('../repositories/products.repository');
require('dotenv').config();
const axios = require('axios');
const {
  InvalidParamsError,
  ValidationError,
  AuthenticationError,
  ExistError,
} = require('../../middlewares/exceptions/error.class.js');

class ProductService {
  productsRepository = new ProductRepository();

  // api 등록하기
  createProducts = async () => {
    for (let p = 1264; p <= 2000; p++) {
      //==================================기본 데이터들==========================================
      let {
        data: {
          body: {
            items: [
              {
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
              },
            ],
          },
        },
      } = await axios.get(process.env.MEDI_A_API_END_POINT, {
        params: {
          // 공공데이터포탈에서 발급 받은 인증키
          serviceKey: process.env.MEDI_API_KEY_DEC,
          // 한 페이지 결과 수. 100개까지만 가능
          numOfRows: 1,
          // 페이지 번호.
          pageNo: p,
          type: 'json',
          // item_name: '게보린',
        },
      });
      // 성분 분표 작업
      let materialName = [];
      for (let j = 0; j < materials.split('|').length; j++) {
        if (j === 0) {
          let material = {};
          material.총량 = materials.split('|')[j].split(':')[1];
          materialName.push(material);
        } else if (materials.split('|')[j].includes('성분명')) {
          let material = {};
          material.성분명 = materials.split('|')[j].split(':')[1];
          material.분량 = materials.split('|')[j + 1].split(':')[1];
          material.단위 = materials.split('|')[j + 2].split(':')[1];
          materialName.push(material);
        }
      }

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

      // 효능효과
      const check = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/;
      let eeDocData = '';
      for (let i = 0; i < eeDoc.split('<').length; i++) {
        if (check.test(eeDoc.split('<')[i])) {
          eeDocData +=
            eeDoc
              .split('<')
              [i].replace(/[^(|)|,|.| |0-9|가-힣]/g, '')
              .trim() + '\n';
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
      let nbDocData = [];
      for (let i = 0; i < nbDoc.split('<').length; i++) {
        if (check.test(nbDoc.split('<')[i])) {
          nbDocData +=
            nbDoc
              .split('<')
              [i].replace(/[^(|)|,|.| |0-9|가-힣]/g, '')
              .trim() + '\n';
        }
      }
      //==================================효과 분류==========================================
      let {
        data: { body: productTypeBody },
      } = await axios.get(process.env.MEDI_B_API_END_POINT, {
        params: {
          // 공공데이터포탈에서 발급 받은 인증키
          serviceKey: process.env.MEDI_API_KEY_DEC,
          // 한 페이지 결과 수. 100개까지만 가능
          numOfRows: 1,
          // 페이지 번호.
          pageNo: 1,
          type: 'json',
          prdlst_Stdr_code: itemSeq,
        },
      });
      // 효과 분류
      let productType = '';
      if (productTypeBody.totalCount === 0) {
        productType = null;
      } else {
        productType = productTypeBody.items[0].PRDUCT_TYPE.split(']')[1];
      }
      //==================================알약 이미지==========================================
      let {
        data: {
          body: itemImageBody,
          //   {
          //     items: [{ ITEM_IMAGE: itemImage }],
          //   },
        },
      } = await axios.get(process.env.MEDI_C_API_END_POINT, {
        params: {
          // 공공데이터포탈에서 발급 받은 인증키
          serviceKey: process.env.MEDI_API_KEY_DEC,
          // 한 페이지 결과 수. 100개까지만 가능
          numOfRows: 1,
          // 페이지 번호.
          pageNo: 1,
          type: 'json',
          item_seq: itemSeq,
        },
      });
      let itemImage = '';
      if (itemImageBody.totalCount === 0) {
        itemImage = null;
      } else {
        itemImage = itemImageBody.items[0].ITEM_IMAGE;
      }

      let product = await this.productsRepository.findOneProduct(itemSeq);
      console.log('몇번 째 저장중인지 : ', p);
      console.log('새로운 것(false), 기존 것(true) : ', Boolean(product));
      if (!product) {
        await this.productsRepository.createProducts(
          itemSeq, //등록 번호 > 깔끔하게 빼버리기
          itemName, //등록 명
          entpName, //제조사
          itemImage, //알약 이미지
          etcOtcCode, //약국 구매 가능 여부
          productType, //효과 분류
          materialName, //성분
          ingrName, //첨가물
          validTerm, //유통기한
          eeDocData, //효능효과
          udDocData, //용법용량
          nbDocData //주의사항
        );
      } else {
        await this.productsRepository.updateProducts(
          itemSeq, //등록 번호 > 깔끔하게 빼버리기
          itemName, //등록 명
          entpName, //제조사
          itemImage, //알약 이미지
          etcOtcCode, //약국 구매 가능 여부
          productType, //효과 분류
          materialName, //성분
          ingrName, //첨가물
          validTerm, //유통기한
          eeDocData, //효능효과
          udDocData, //용법용량
          nbDocData //주의사항
        );
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

  // 제품 목록 조회 (검색) - 더 많이 수정 해야함 아직 미완성
  findMedicines = async (type, value) => {
    let medicines = [];
    if (type === '') {
      medicines = await this.productsRepository.findMedicines(value);
    } else if (type === '') {
      medicines = await this.productsRepository.findMedicines(value);
    }
    return medicines || [];
  };

  // 제품 상세 조회
  findOneMedicine = async (medicineId) => {
    const product = await this.productsRepository.findOneMedicine(medicineId);
    if (!product)
      throw new ValidationError('약품 정보를 찾을 수 없습니다.', 412);
    return product;
  };
}

module.exports = ProductService;
