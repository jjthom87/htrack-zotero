const fs = require('fs');
const path = require('path');
const googleSheetsApi = require("./../../../external_apis/google_sheets.js");
const zoteroApi = require("./../../../external_apis/zotero.js");
const props = require('./../../../resources/application.json');

exports.addZoteroDataToGoogleSheets = function(callback){
  fs.readFile(path.join(__dirname, './../../../resources/credentials.json'), (err, content) => {
    if (err){
      console.log("Error retrieving google sheets api credentials file: " + err);
    }

    try {
      zoteroApi.getAndFormatZoteroData(function(res){
        googleSheetsApi.authorize(JSON.parse(content), (auth) => {
            googleSheetsApi.appendToGoogleSheet(auth, res.allResults, props.sheets.mainPageSpreadsheetId, props.sheets.mainPageRangeToAppendTo, function(mainRes){
              if(mainRes.statusCode == 200){
                googleSheetsApi.appendToGoogleSheet(auth, res.creators, props.sheets.creatorsPageSpreadsheetId, props.sheets.creatorsPageRangeToAppendTo, function(creatorsRes){
                  if(creatorsRes.statusCode == 200){
                    callback({statusCode: 200, statusMessage: "records successfully added to google sheets"})
                  } else {
                    callback({statusCode: 422, statusMessage: "Add to google sheets unsuccessful."})
                  }
                })
              } else {
                callback({statusCode: 422, statusMessage: "Add to google sheets unsuccessful."})
              }
            })
        });
      });
    } catch (err) {
      callback(err)
    }

  });
}

exports.getHumanitrackZoteroSheetValues = function(spreadsheetId, range, callback){
  fs.readFile(path.join(__dirname, './../../../resources/credentials.json'), (err, content) => {
    if (err){
      console.log("Error retrieving google sheets api credentials file: " + err);
    }

    try {
      googleSheetsApi.authorize(JSON.parse(content), (auth) => {
          googleSheetsApi.getSheetValues(auth, spreadsheetId, range, function(res){
            callback(res)
          })
      });
    } catch (err){
      callback(err)
    }
  });
}
