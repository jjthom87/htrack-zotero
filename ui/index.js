const getRecords = async function(api) {
  return new Promise(function(resolve, reject) {
    fetch(`/v1/api/records/${api}`).then(function (response) { return response.json(); }).then(function (data) {
      return resolve({success: true, data: data});
    }).catch(function (err) {
      return reject({success: false, message: err});
    });
  });
}

function closeModal(e, buttonId){
  if(e.target && !e.target.className.includes("view")){
    document.getElementById("modal").style.display = "none";
  }
  document.getElementById("close-modal").addEventListener('click', function(e){
    document.getElementById("modal").style.display = "none";
  });
}

function populateTableRecords(){
  getRecords("main").then(function(res){
    let mainData = res.data;
    let tableBody = document.querySelector("tbody");

    mainData.forEach((record) => {
      let tableBodyString = "<tr>";
      tableBodyString += "<td>" + record.title + "</td>";
      tableBodyString += "<td>" + record.publicationTitle + "</td>";
      tableBodyString += "<td>" + record.DOI + "</td>";
      tableBodyString += "<td>" + record.ISSN + "</td>";
      tableBodyString += "<td><button class='view-abstract-note' key="+record.key+">click to view</button></td>";
      tableBodyString += "<td>" + record.date + "</td>";
      tableBodyString += "<td>" + record.issue + "</td>";
      tableBodyString += "<td>" + record.itemType + "</td>";
      tableBodyString += "<td>" + record.pages + "</td>";
      tableBodyString += "<td>" + record.version + "</td>";
      tableBodyString += "<td>" + record.volume + "</td>";
      tableBodyString += "<td><button class='view-creators' key="+record.key+">click to view</button></td>"
      tableBodyString += "<td><button class='view-tags' key="+record.key+">click to view</button></td>"
      tableBodyString += "</tr>"

      tableBody.innerHTML = tableBody.innerHTML + tableBodyString;
    });
  }).catch(function(err){
    console.error(err)
  });
}

function abstractNoteModalEvents(res){
  document.body.addEventListener('click',function(e){
    if(e.target && e.target.className == 'view-abstract-note'){
      const key = e.target.getAttribute("key");

      res.then(function(main){
        const abstractNote = main.data.filter((data) => data.key == key)[0].abstractNote;

        document.getElementById("modal-title").textContent = "Abstract Note";
        document.getElementById("modal-body").innerHTML = "<p>" + abstractNote + "</p>";
        document.getElementById("modal").style.display = "block";
      })
    }
    closeModal(e, 'view-abstract-note')
  });
}

function creatorsModalEvents(res){
  document.body.addEventListener('click',function(e){
    if(e.target && e.target.className == 'view-creators'){
      const key = e.target.getAttribute("key");

      res.then(function(creators){
        const recordCreators = creators.data.filter((data) => data.key == key);

        let tableString = "<ol>";
        recordCreators.forEach((creator) => {
          tableString += "<li>" + creator.name + "</li>"
        });

        document.getElementById("modal-body").innerHTML = tableString + "</ol>";
        document.getElementById("modal-title").textContent = "Creators";
        document.getElementById("modal").style.display = "block";

      });
    }
    closeModal(e, 'view-creators')
  });
}

function runAll(){
  populateTableRecords();
  abstractNoteModalEvents(getRecords("main"));
  creatorsModalEvents(getRecords("creators"));
}

runAll();
