require('dotenv').config();

var express = require('express');
var path = require('path');

var app = express();

const apiConfig = require('./config/swagger_api/config.js');
const resourcesConfig = require('./config/s3_resource_files.js');

var PORT = process.env.PORT || 7000;

apiConfig.setSwagger(app);
resourcesConfig.setResourceFiles();

app.get('/', (req,res) => {
  res.send("<h2><a href='/api-docs'>To Api</a></h2>")
});

setTimeout(() => {
  app.use('/v1', require(path.join(__dirname, `/services/router/nonprod/zoteroGoogleSheetsIntegration.js`)));
  app.listen(PORT, () => {
    console.log(`Humanitrack Zotero App Running`)
  })
}, 10000)
