let mainData;
let creatorsData;

let retrieveData = (api, callback) => {
  fetch(`/v1/api/records/${api}`).then(function (response) { return response.json(); }).then(function (data) {
    callback({success: true, data: data});
  }).catch(function (err) {
    callback({success: false, message: err});
  });
}

retrieveData("main", function(mainRes){
  console.log(mainRes)
  if(mainRes.success){
    retrieveData("creators", function(creatorsRes){
      if(creatorsRes.success){
        mainData = mainRes.data;
        creatorsData = creatorsRes.data;

        let tableBody = document.querySelector("tbody");

        mainData.forEach((record) => {
          let tableBodyString = "<tr>";
          tableBodyString += "<td>" + record.key + "</td>";
          tableBodyString += "<td>" + record.DOI + "</td>";
          tableBodyString += "<td>" + record.ISSN + "</td>";
          tableBodyString += "<td class='abstract-note-td'><button id='view-abstract-note' key="+record.key+">click to view</button></td>";
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
});

document.body.addEventListener('click',function(e){
  if(e.target && e.target.id == 'view-abstract-note'){
    const key = e.target.getAttribute("key");
    const abstractNote = mainData.filter((data) => data.key == key)[0].abstractNote;

    document.getElementById("abstract-note-text").textContent = abstractNote;
    document.getElementById("abstract-note-modal").style.display = "block";
  }
  if(e.target && e.target.id != 'view-abstract-note'){
    document.getElementById("abstract-note-modal").style.display = "none";
  }
});

document.getElementById("close-abstract-modal").addEventListener('click', function(e){
  document.getElementById("abstract-note-modal").style.display = "none";
});
