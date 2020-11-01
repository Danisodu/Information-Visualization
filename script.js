var translations = {0: -22, 1: cellSize*8.4, 2: cellSize*16.4, 3: cellSize*21.4};
var actualDrug = "Heroin";
var phrase = {2: " have ",
              1: " earn ",
              0: " missed work for ",
              3: " are "};
var phrase2 = {2: "",
              1: " (USD) per year",
              0: "",
              3: ""};
var initialPositions = {0: 0, 1: 8, 2: 15, 3: 19};
var demographicInfo = ["SelectiveLeave","PersonalIncome","Education","EmploymentStatus"];
var sets = d3.parsets()
            .dimensions(["Sex", "Education","Employment Status"]);

var parallel_sets = d3.select("#parallel_sets").append("svg")
        .attr("transform", "translate(0,-20)");

d3.csv("datasets/HeroinDemoInfo.csv").then(function(csv) {
  parallel_sets.datum(csv).call(sets);

  plotHeatMap();
});

function read_csv(fname,i){
  d3.csv('datasets/'+fname).then(function(data) {
    data.forEach(function (d){
      d.row = +d.UserType;
      d.col = +d.DemoInfo;
      d.value = +d.Distribution;
    });

    delete data.columns;
    init(data,i);
  });
}

function updateDrug(name){
  if(name == "Pain reliever")
      name = "painreliever";

  actualDrug = name;
  updateDrugPS(name);
  update();
}

function plotHeatMap(){
  for (i in demographicInfo){
    read_csv('datasets/' + actualDrug + demographicInfo[i] + '.csv', i);
  }
}

function verifyDrug(name) {
  if(name == "painreliever")
    return "pain reliver";
  return name;
}

function init(dataset,i) {
  svg_hm.selectAll(".svgHeatMap" + i)
        .data(dataset)
        .enter()
        .append("rect")
        .attr("x", function(d,i) { return hccol.indexOf(d.col) * cellSize + 175; })
        .attr("y", function(d) { return hcrow.indexOf(d.row) * cellSize + 40; })
        .attr("class", function(d){return "cell cell-border cr"+(0)+" cc"+(0);})
        .attr("width", cellSize)
        .attr("height", cellSize)
        .attr("transform", "translate("+ translations[i] + ", 0)")
        .style("fill", function(d) { return colors[Math.floor(d.value/10)]; })
        .on("mousemove", function(d){
               //highlight text
               d3.select(this).classed("cell-hover",true);
               d3.selectAll(".rowLabel").classed("text-highlight",function(r,ri){ return ri==(d.row);});
               d3.selectAll(".colLabel").classed("text-highlight",function(c,ci){ return ci==(hccol.indexOf(d.col) + initialPositions[i]) ;});
               d3.selectAll(".colDemoInfoLabel").classed("text-highlight",function(c,ci){ return ci==i;});

               //Update the tooltip position and value
               d3.select("#tooltip")
                  .style("left", (event.clientX+30) + "px")
                  .style("top", (event.clientY-20) + "px")
                  .text(d.value + "% of " + verifyDrug(actualDrug.toLowerCase()) + " " + rowLabel[d.row].toLowerCase() + "s \n" + phrase[i] + demo_info_values[i][hccol.indexOf(d.col)].toLowerCase() + phrase2[i]);
               //Show the tooltip
               d3.select("#tooltip").classed("hidden", false);
        })
        .on("mouseout", function(){
               d3.select(this).classed("cell-hover",false);
               d3.selectAll(".rowLabel").classed("text-highlight",false);
               d3.selectAll(".colLabel").classed("text-highlight",false);
               d3.selectAll(".colDemoInfoLabel").classed("text-highlight",false);
               d3.select("#tooltip").classed("hidden", true);
        });
}

function update(){
    svg_hm.selectAll('.cell')
        .remove();

    plotHeatMap();

    update_node_pie(actualDrug);

    d3.csv('datasets/' + actualDrug+"DemoInfo.csv").then(function(csv) {
      parallel_sets.datum(csv).call(sets);
    });
}
