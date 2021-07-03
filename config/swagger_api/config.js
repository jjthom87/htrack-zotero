var fs = require('fs');
var path = require('path');
const swaggerUi = require('swagger-ui-express');

const swaggerDocument = require(`./dev-swagger.json`);

exports.setSwagger = (app) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
}
