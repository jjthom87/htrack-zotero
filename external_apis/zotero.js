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

  const allResults = [];
  const creators = [];
  const tags = [];

  for(var i = 0; i < result.raw.length; i++){
    var data = result.raw[i].data;
    if(data["abstractNote"]){
      allResults.push([data["key"], data["version"], data["itemType"], data["title"], data["abstractNote"], data["publicationTitle"], data["volume"], data["issue"], data["pages"], data["date"], data["DOI"], data["ISSN"]])

      const creatorsData = data["creators"];
      const tagsData = data["tags"];

      for(var j = 0; j < creatorsData.length; j++){
        let creator = [];
        creator.push(data["key"]);
        creator.push(creatorsData[j].creatorType);
        creator.push(creatorsData[j].firstName + " " + creatorsData[j].lastName);

        creators.push(creator);
      }

      for(var j = 0; j < tagsData.length; j++){
        let tag = [];
        tag.push(data["key"]);
        tag.push(tagsData[j].tag);

        tags.push(tag);
      }

    }

  }
  callback({allResults: allResults, creators: creators, tags: tags});
}
