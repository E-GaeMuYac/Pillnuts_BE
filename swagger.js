const swaggerAutogen = require('swagger-autogen')();

const options = {
  swaggerDefinition: {
    openapi: '3.0.0', 
    info: {
      
      title: 'pillnuts', 
      version: '1.0.0', 
      description: 'a REST API using swagger and express.', 
    },
    servers: [
      {
        url: 'https://localhost:3000', 
      },
    ],
  },
  apis: [],
};
const outputFile = './swagger-output.json' 
const endpointsFiles = ['./src/app.js'] 

swaggerAutogen(outputFile, endpointsFiles, options);
