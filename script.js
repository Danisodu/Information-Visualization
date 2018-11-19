var drugs = ["Marijuana", "Heroin", "Cocaine", "Crack", "Stimulants", "Inhalant", "Hallucinogen", "Meth", "Pain Reliever", "Tranquilizer", "Sedative"];
var selectedDrug = {"Main": "Marijuana"};
var dateset;
var chart = RadarChart();
populateDropDown("drug_list1");
populateDropDown("drug_list2");

d3.csv("./user_type_count.csv", function (data) {
  dataset = data;
  init_vis();
});

function populateDropDown(id) {
  var dropDown = document.getElementById(id);

  for(var i=0; i < drugs.length; i++) {
    var drug = drugs[i]
    var elm = document.createElement("option");
    elm.textContent = drug;
    elm.value = drug;
    dropDown.appendChild(elm);
  }
}

function updateSelectedDrug(elm){
  var drug = elm.value;

  if(elm.id == "drug_list1") {
    selectedDrug["Main"] = drug;
  } else if(drug != ""){
    selectedDrug["Sec"] = drug;
  } else {
    delete selectedDrug.Sec;
  }

  gen_vis();
}

function getRowByIdentifier(pk,id){
  var line = {};

  for(i= 0; i < dataset.length; i ++){
    line = Object.assign({},dataset[i]);

    if(line[pk] == id) break;
  }

  delete line.Drug;

  return line;
}

function createData(drug){
  var axis = []
  var line = getRowByIdentifier("Drug",drug);
  var keys = Object.keys(line);

  for(i in keys) {
    obj_axis = {};
    key = keys[i];
    obj_axis["axis"] = key;
    obj_axis["value"] = line[key];
    axis.push(obj_axis);
  }

  return {"key": drug,
          "values": axis};
}

function init_vis(){
  var operation = d3.select('body').append('div').append('h2');

  d3.select('#radar_chart')
          .call(chart);

  gen_vis();
}

function gen_vis(){
  var data = []

  for(i in selectedDrug)
      data.push(createData(selectedDrug[i]));

  chart.data(data).update();
}
