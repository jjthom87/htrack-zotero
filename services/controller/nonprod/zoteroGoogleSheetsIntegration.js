const fs = require('fs');
const path = require('path');
const googleSheetsApi = require("./../../../external_apis/google_sheets.js");
const zoteroApi = require("./../../../external_apis/zotero.js");

exports.addZoteroDataToGoogleSheets = function(callback){
  fs.readFile(path.join(__dirname, './../../../resources/credentials.json'), (err, content) => {
    if (err){
      console.log("Error retrieving google sheets api credentials file: " + err);
    }

    try {
      zoteroApi.getAndFormatZoteroData(function(res){
        googleSheetsApi.authorize(JSON.parse(content), (auth) => {
            googleSheetsApi.appendToGoogleSheet(auth, res, function(response){
              callback(response);
            });
        });
      });
    } catch (err) {
      callback(err)
    }

  });
}
