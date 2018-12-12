var dataset;
var demo_info_values = {'Education': ["Less than High School",
                                      "High School Graduate",
                                      "Some College Credit",
                                      "College Graduate"],
                        "PersonalIncome": ["<$10,000",
                                            "$10,000-$19,999",
                                            "$20,000-$29,999",
                                            "$30,000-$39,999",
                                            "$40,000-$49,999",
                                            "$50,000-$74,999",
                                            ">$75,000"],
                        "SelectiveLeave": ["0-6",
                                            "7-13",
                                            "14-20",
                                            "21-31"],
                        "EmploymentStatus": ["Full-Time","Part-Time","Unemployed"]};
var positions = {"Education": [1,2,3,4],
                 "PersonalIncome": [1,2,3,4,5,6,7],
                 "SelectiveLeave": [1,2,3,4,],
                 "EmploymentStatus": [1,2,3]};
var actualDrug = "Cocaine";
var demoInfo = "Education";
var parallel_sets = d3.parsets()
                    .dimensions(["Sex", "Race", "Education","Employment Status"]);

var vis = d3.select("#vis").append("svg")
    .attr("width", parallel_sets.width())
    .attr("height", parallel_sets.height());

d3.csv("DemoInfoForDrugs.csv").then(function(csv) {
  vis.datum(csv).call(parallel_sets);
});

d3.csv("CocaineEducation.csv").then(function(data) {
  data.forEach(function (d){
    d.row = +d.UserType;
    d.col = +d.DemoInfo;
    d.value = +d.Distribution;
  });

    delete data.columns;
    dataset = data;
    init();

  });

function curves() {
  var t = vis.transition().duration(500);
  t.call(chart.tension(this.checked ? .5 : 1));
}

function read_csv(fname){
    d3.csv(fname).then(function(data) {
      data.forEach(function (d){
        d.row = +d.UserType;
        d.col = +d.DemoInfo;
        d.value = +d.Distribution;
      });

        delete data.columns;
        dataset = data;
        update();
      });

      console.log(dataset);
}

function updateDrug(name){
  var filename = "";
  actualDrug = name;
  fname = filename.concat(actualDrug, demoInfo, '.csv');
  read_csv(fname);
}

function updateSelectedDemo(elm){
  var filename = "";
  demoInfo = elm.value;
  fname = filename.concat(actualDrug, demoInfo, '.csv');

  read_csv(fname);
}

function init() {
  var drawHeatMap = svg_hm.selectAll(".heat")
        .data(dataset)
        .enter()
        .append("rect")
        .attr("x", function(d) { return hccol.indexOf(d.col) * cellSize + 160; })
        .attr("y", function(d) { return hcrow.indexOf(d.row) * cellSize ; })
        .attr("class", function(d){return "cell cell-border cr"+(0)+" cc"+(0);})
        .attr("width", cellSize)
        .attr("height", cellSize)
        .style("fill", function(d) { return colors[Math.floor(d.value/10)]; })
        .on("mouseover", function(d){
               //highlight text
               d3.select(this).classed("cell-hover",true);
               d3.selectAll(".rowLabel").classed("text-highlight",function(r,ri){ return ri==(d.row);});
               d3.selectAll(".colLabel").classed("text-highlight",function(c,ci){ return ci==(positions[demoInfo].indexOf(d.col));});

               //Update the tooltip position and value
               d3.select("#tooltip")
                  .style("left", (d3.event.pageX+10) + "px")
                  .style("top", (d3.event.pageY-10) + "px")
                 .select("#value")
                 .attr("data-html", "true")
                 .text("User Type: " + rowLabel[d.row] + "\n" +demoInfo+": "+demo_info_values[demoInfo][positions[demoInfo].indexOf(d.col)] +"\n Distribution: "+d.value+"%");
               //Show the tooltip
               d3.select("#tooltip").classed("hidden", false);
        })
        .on("mouseout", function(){
               d3.select(this).classed("cell-hover",false);
               d3.selectAll(".rowLabel").classed("text-highlight",false);
               d3.selectAll(".colLabel").classed("text-highlight",false);
               d3.select("#tooltip").classed("hidden", true);
        })
        ;
}

function update(){
  colLabel = demo_info_values[demoInfo];
  hccol = positions[demoInfo];

  svg_hm.selectAll('.colLabel')
        .remove();

  svg_hm.selectAll('.cell')
        .remove();

  var colLabels = svg_hm.selectAll(".colLabel")
      .data(colLabel)
      .enter()
      .append("text")
      .text(function (d) { return d; })
      .attr("y", function (d, i) { return i * 26 + 120; })
      .attr("x",  function (d, i) { return i * 26 + 115; })
      .style("text-anchor", "left")
      .attr("transform", "translate("+cellSize/2 + ",-12) rotate (-45)")
      .attr("class",  function (d,i) { return "colLabel mono c"+i;} )
      .on("mouseover", function(d) {d3.select(this).classed("text-hover",true);})
      .on("mouseout" , function(d) {d3.select(this).classed("text-hover",false);})
      ;

      init();
}
