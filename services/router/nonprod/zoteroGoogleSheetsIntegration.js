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

router.get('/api/records/main', (req,res) => {
  zoteroGoogleSheetsIntegrationService.getHumanitrackZoteroSheetValues(props.sheets.mainPageSpreadsheetId, props.sheets.mainPageRangeToGet, function(response){
    res.json(response);
  });
});

module.exports = router;
