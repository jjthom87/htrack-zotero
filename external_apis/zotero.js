const props = require('./../resources/application.json');
const zoteroClient = require('zotero-api-client')(props.zotero.apiKey);

function callZoteroApi(){
  const myapi = zoteroClient.library(props.zotero.entityType, props.zotero.humanitrackGroupId);
  const itemsResponse = myapi.items().get();

  return new Promise(resolve => {
    resolve(itemsResponse);
  });
}

exports.getAndFormatZoteroData = async function(callback) {
  const result = await callZoteroApi();

  var allResultsArray = [["key", "version", "itemType", "title", "abstractNote", "publicationTitle", "volume", "issue", "pages", "date", "DOI", "ISSN"]];

  for(var i = 0; i < result.raw.length; i++){
    var data = result.raw[i].data;
    if(data["abstractNote"]){
      allResultsArray.push([data["key"], data["version"], data["itemType"], data["title"], data["abstractNote"], data["publicationTitle"], data["volume"], data["issue"], data["pages"], data["date"], data["DOI"], data["ISSN"]])
    }
  }

  callback(allResultsArray);
}
