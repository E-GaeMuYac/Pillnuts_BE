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

  createProducts = async () => {
    // {
    //     "itemName" : "약 이름",
    //     "entpName" : "제조사",
    //     "etcOtcCode" : "일반의약품, 전문의약품",
    //     "materialName" : [{"총량":"1정 중 203밀리그램"},{"material":"아스테어쩌구", "분량":"300", "단위":"밀리그램"}, … }],
    //     "ingrName" : "첨가물",
    //     "validTerm" : "유통기한",
    //     "eeDocData" : "효능효과 블라블라",
    //     "udDocData" : "용법용량 블라블라",
    //     "nbDocData" : ["사용상의주의사항" = {"1.경고" : "경고내용"},{"2. 어쩌구저쩌구" : "어쩌구저쩌구내용"}, …],
    //     "itemImage" : "약 이미지 url",
    //}
    // for (let i = 1; i <= 51240; i++) {
    let {
      data: {
        body: {
          items: [
            {
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
        pageNo: 1,
        type: 'json',
        item_name: '게보린',
      },
    });
    // 성분 분표 작업
    let materialName = [];
    let ingrName = '';
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
    for (let x = 0; x < ingredients.split('|').length; x++) {
      if (x === ingredients.split('|').length - 1) {
        ingrName += ingredients.split('|')[x].split(']')[1];
      } else {
        ingrName += ingredients.split('|')[x].split(']')[1] + ',';
      }
    }
    // 효능효과
    const check = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/;
    let eeDocData = [];
    for (let i = 0; i < eeDoc.split('<').length; i++) {
      if (check.test(eeDoc.split('<')[i])) {
        eeDocData.push(
          eeDoc
            .split('<')
            [i].replace(/[^(|)|,|.| |0-9|가-힣]/g, '')
            .trim()
        );
      }
    }
    // 용법용량
    let udDocData = [];
    for (let i = 0; i < udDoc.split('<').length; i++) {
      if (check.test(udDoc.split('<')[i])) {
        udDocData.push(
          udDoc
            .split('<')
            [i].replace(/[^(|)|,|.| |0-9|가-힣]/g, '')
            .trim()
        );
      }
    }
    // 주의사항
    let nbDocData = [];
    for (let i = 0; i < nbDoc.split('<').length; i++) {
      if (check.test(nbDoc.split('<')[i])) {
        nbDocData.push(
          nbDoc
            .split('<')
            [i].replace(/[^(|)|,|.| |0-9|가-힣]/g, '')
            .trim()
        );
      }
    }
  };
  //   };
}

module.exports = ProductService;
