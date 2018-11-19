var chart = RadarChart.chart();
var drugs = ["Marijuana", "Heroin", "Cocaine", "Crack", "Stimulants", "Inhalant", "Hallucinogen", "Meth", "Pain Reliever", "Tranquilizer", "Sedative"];
var selectedDrug = {"Main": "Marijuana"};
var dateset;
populateDropDown("drug_list1");
populateDropDown("drug_list2");

d3.csv("./user_type_count.csv", function (data) {
  dataset = data;
  gen_vis();
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

  //update_vis();
  //TODO: when selecting in one deleting option in another
}

function getRowByIdentifier(pk,id){
  line = {};

  for(i= 0; i < dataset.length; i ++){
    line = dataset[i];

    if(line[pk] == id) break;
  }

  delete line.Drug;

  return line;
}

function createData(drug){
  axis = []
  line = getRowByIdentifier("Drug",drug);
  keys = Object.keys(line);

  for(i in keys) {
    obj_axis = {};
    key = keys[i];
    obj_axis["axis"] = key;
    obj_axis["value"] = line[key];
    axis.push(obj_axis);
  }

  return {className: drug,
          axes: axis};
}

function gen_vis(){
  var data = [createData(selectedDrug["Main"])];

  var cfg = chart.config();
  var svg = d3.select('body').append('svg')
    .attr('width', cfg.w)
    .attr('height', cfg.h);
  svg.append('g').classed('single', 1).datum(data).call(chart);
}

function update_vis(){
  new_data = []

  for(i in selectedDrug){
      new_data.push(createData(selectedDrug[i]));
  }

  return new_data;
}
