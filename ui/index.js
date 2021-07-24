let retrieveData = (api, callback) => {
  fetch(`/v1/api/records/${api}`).then(function (response) { return response.json(); }).then(function (data) {
    callback({success: true, data: data});
  }).catch(function (err) {
    reject({success: false, message: err});
  });
}

retrieveData("main", function(mainRes){
  if(mainRes.success){
    retrieveData("creators", function(creatorsRes){
      if(creatorsRes.success){
        const mainData = mainRes.data;
        const creatorsData = creatorsRes.data;

        let tableBody = document.querySelector("tbody");

        mainData.forEach((record) => {
          let tableBodyString = "<tr>";
          tableBodyString += "<td>" + record.key + "</td>";
          tableBodyString += "<td>" + record.DOI + "</td>";
          tableBodyString += "<td>" + record.ISSN + "</td>";
          // tableBodyString += "<td>" + record.abstractNote + "</td>";
          tableBodyString += "<td>" + record.date + "</td>";
          tableBodyString += "<td>" + record.issue + "</td>";
          tableBodyString += "<td>" + record.itemType + "</td>";
          tableBodyString += "<td>" + record.pages + "</td>";
          tableBodyString += "<td>" + record.publicationTitle + "</td>";
          tableBodyString += "<td>" + record.title + "</td>";
          tableBodyString += "<td>" + record.version + "</td>";
          tableBodyString += "<td>" + record.volume + "</td>";
          tableBodyString += "</tr>"

          tableBody.innerHTML = tableBody.innerHTML + tableBodyString;
        })
      } else {
        console.log(creatorsRes.message);
      }
    })
  } else {
    console.log(mainRes.message);
  }
})
