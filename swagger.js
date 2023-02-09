const swaggerAutogen = require('swagger-autogen')();

const options = {
  swaggerDefinition: {
    openapi: '3.0.0', // 우리가 사용하고 있는 Open Api version
    info: {
      // API에 필요한 정보를 다루며 선택 필드
      title: 'pillnuts', // API 제목
      version: '1.0.0', // API version
      description: 'a REST API using swagger and express.', // API 상세 정보
    },
    servers: [
      {
        url: 'https://localhost:3000', // API에 대한 기본 URL을 정의하며, 배열로 여러 URL을 정의할 수 있음
      },
    ],
  },
  apis: [],
};
const outputFile = './swagger-output.json' // swagger-autogen이 실행 후 생성될 파일 위치와 이름
const endpointsFiles = ['./src/app.js'] // 읽어올 Router가 정의되어 있는  js파일들

swaggerAutogen(outputFile, endpointsFiles, options);
