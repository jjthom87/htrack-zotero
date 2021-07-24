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
            googleSheetsApi.appendToGoogleSheet(auth, res.allResults, props.sheets.mainPageRangeToAppendTo, props.sheets.mainPageRangeToGet, function(mainRes){
              if(mainRes.statusCode == 200){
                googleSheetsApi.appendToGoogleSheet(auth, res.creators, props.sheets.creatorsPageRangeToAppendTo, props.sheets.creatorsPageRangeToGet, function(creatorsRes){
                  if(creatorsRes.statusCode == 200){
                    googleSheetsApi.appendToGoogleSheet(auth, res.tags, props.sheets.tagsPageRangeToAppendTo, props.sheets.tagsPageRangeToGet, function(tagsRes){
                      if(tagsRes.statusCode == 200){
                        const totalAdded = mainRes.recordsAdded + creatorsRes.recordsAdded + tagsRes.recordsAdded;
                        const statusMessage = totalAdded > 0 ? `records successfully added to google sheets. Main Records Added: ${mainRes.recordsAdded}, Creator Records Added: ${creatorsRes.recordsAdded}, Tags Records Added: ${tagsRes.recordsAdded}` : "No records added to google sheets"
                        callback({statusCode: 200, statusMessage: statusMessage})
                      } else {
                        callback({statusCode: 422, statusMessage: "Add to google sheets unsuccessful."})
                      }
                    });
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

exports.getHumanitrackZoteroSheetValues = function(range, callback){
  fs.readFile(path.join(__dirname, './../../../resources/credentials.json'), (err, content) => {
    if (err){
      console.log("Error retrieving google sheets api credentials file: " + err);
    }

    try {
      googleSheetsApi.authorize(JSON.parse(content), (auth) => {
          googleSheetsApi.getAllSpreadsheetValues(auth, range, function(res){
            callback(res)
          })
      });
    } catch (err){
      callback(err)
    }
  });
}
