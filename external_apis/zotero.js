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

  const mainColumns = ["key", "version", "itemType", "title", "abstractNote", "publicationTitle", "volume", "issue", "pages", "date", "DOI", "ISSN"];
  const creatorColumns = ["key", "type", "name"]

  const allResults = [mainColumns];
  const creators = [creatorColumns];


  for(var i = 0; i < result.raw.length; i++){
    var data = result.raw[i].data;
    if(data["abstractNote"]){
      allResults.push([data["key"], data["version"], data["itemType"], data["title"], data["abstractNote"], data["publicationTitle"], data["volume"], data["issue"], data["pages"], data["date"], data["DOI"], data["ISSN"]])

      const creatorsData = data["creators"];

      for(var j = 0; j < creatorsData.length; j++){
        let creator = [];
        creator.push(data["key"]);
        creator.push(creatorsData[j].creatorType);
        creator.push(creatorsData[j].firstName + " " + creatorsData[j].lastName);

        creators.push(creator);
      }

    }

  }
  callback({allResults: allResults, creators: creators});
}
