var router = require('express').Router();
var fs = require('fs');
var path = require('path');

var zoteroGoogleSheetsIntegrationService = require('./../../controller/nonprod/zoteroGoogleSheetsIntegration.js');

router.put('/api/records', (req,res) => {
  zoteroGoogleSheetsIntegrationService.addZoteroDataToGoogleSheets(function(response){
    res.json(response);
  });
});

module.exports = router;
