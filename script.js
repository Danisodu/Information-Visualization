var translations = {0: -3, 1: cellSize*4.8, 2: cellSize*12.7, 3: cellSize*17.6};
var actualDrug = "Cocaine";
var phrase = {'Education': " have ",
              "PersonalIncome": " earn ",
              "SelectiveLeave": " misssed work for ",
              "EmploymentStatus": " are "};

var sets = d3.parsets()
            .dimensions(["Sex", "Education","Employment Status"]);

var parallel_sets = d3.select("#parallel_sets").append("svg")
        .attr("transform", "translate(0,-50)");

d3.csv("CocaineDemoInfo.csv").then(function(csv) {
  parallel_sets.datum(csv).call(sets);

  plotHeatMap();
});

function read_csv(fname,i){
  d3.csv(fname).then(function(data) {
    data.forEach(function (d){
      d.row = +d.UserType;
      d.col = +d.DemoInfo;
      d.value = +d.Distribution;
    });

    delete data.columns;
    console.log(data);
    init(data,i);
  });
}

function updateDrug(name){
  actualDrug = name;

  update();
}

function plotHeatMap(){
  for (i in demoInfo){
    read_csv(actualDrug + demoInfo[i] + '.csv', i);
  }
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
        .on("mouseover", function(d){
               //highlight text
               d3.select(this).classed("cell-hover",true);
               d3.selectAll(".rowLabel").classed("text-highlight",function(r,ri){ return ri==(d.row);});
               d3.selectAll(".colLabel").classed("text-highlight",function(c,ci){ return ci==(hccol.indexOf(d.col) + initialPositions[i]) ;});
               d3.selectAll(".colDemoInfoLabel").classed("text-highlight",function(c,ci){ return ci==i;});

               //Update the tooltip position and value
               d3.select("#tooltip")
                  .style("left", (d3.event.pageX+30) + "px")
                  .style("top", (d3.event.pageY-20) + "px")
                  .text(d.value + "% of " + actualDrug.toLowerCase() + " " + rowLabel[d.row].toLowerCase() + "s" + phrase[demoInfo[i]] + demo_info_values[demoInfo[i]][hccol.indexOf(d.col)].toLowerCase());
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

    d3.csv(actualDrug+"DemoInfo.csv").then(function(csv) {
      parallel_sets.datum(csv).call(sets);
    });
}
