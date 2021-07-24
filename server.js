require('dotenv').config();

var express = require('express');
var path = require('path');

var app = express();

const apiConfig = require('./config/swagger_api/config.js');
const resourcesConfig = require('./config/s3_resource_files.js');

var PORT = process.env.PORT || 7000;

apiConfig.setSwagger(app);
resourcesConfig.setResourceFiles();

app.use(express.static('./ui'));
app.get('/', (req,res) => {
  res.sendFile(path.join(__dirname, `/ui/index.html`));
});

setTimeout(() => {
  app.use('/v1', require(path.join(__dirname, `/services/router/nonprod/zoteroGoogleSheetsIntegration.js`)));
  resourcesConfig.checkForResourceFileUpdates();
  app.listen(PORT, () => {
    console.log(`Humanitrack Zotero App Running`)
  })
}, 10000)
