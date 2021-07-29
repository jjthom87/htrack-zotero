var router = require('express').Router();
var fs = require('fs');
var path = require('path');
const props = require('./../../../resources/application.json');

var zoteroGoogleSheetsIntegrationService = require('./../../controller/nonprod/zoteroGoogleSheetsIntegration.js');

router.put('/api/records', (req,res) => {
  zoteroGoogleSheetsIntegrationService.addZoteroDataToGoogleSheets(function(response){
    res.json(response);
  });
});

router.get('/api/records/:page', (req,res) => {
  const page = req.params.page == "main" ? props.sheets.mainPageRangeToGet : req.params.page == "creators" ? props.sheets.creatorsPageRangeToGet : props.sheets.tagsPageRangeToGet;
  zoteroGoogleSheetsIntegrationService.getHumanitrackZoteroSheetValues(page, function(response){
    res.json(response);
  });
});

module.exports = router;
