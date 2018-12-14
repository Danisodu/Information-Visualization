var dataset;
var demo_info_values = {'Education': ["Less than High School",
                                      "High School Graduate",
                                      "Some College Credit",
                                      "College Graduate"],
                        "PersonalIncome": ["<$10k",
                                            "$10k-$20k",
                                            "$20k-$30k",
                                            "$30k-$40k",
                                            "$40k-$50k",
                                            "$50k-$75k",
                                            ">$75k"],
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

var sets = d3.parsets()
                    .dimensions(["Sex", "Race", "Education","Employment Status"]);

var parallel_sets = d3.select("#vis").append("svg")
    .attr("width", sets.width())
    .attr("height", sets.height());

parallel_sets.append('text')
  .attr('class', 'title')
  .attr('x', width + 40)
  .attr('y',10)
  .attr('text-anchor', 'middle')
  .text('Demographic Info by Drug');

d3.csv("CocaineDemoInfo.csv").then(function(csv) {
  parallel_sets.datum(csv).call(sets);
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
  var t = parallel_sets.transition().duration(500);

  t.call(sets.tension(this.checked ? .5 : 1));
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
        .attr("x", function(d) { return hccol.indexOf(d.col) * cellSize + 170; })
        .attr("y", function(d) { return hcrow.indexOf(d.row) * cellSize + 40; })
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
                  .style("left", (d3.event.pageX+30) + "px")
                  .style("top", (d3.event.pageY-20) + "px")
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
      .attr("y", function (d, i) { return i * (cellSize-8) + 150; })
      .attr("x",  function (d, i) { return i * (cellSize-8) + 90; })
      .style("text-anchor", "left")
      .attr("transform", "translate("+cellSize/2 + ",-12) rotate (-45)")
      .attr("class",  function (d,i) { return "colLabel mono c"+i;} )
      .on("mouseover", function(d) {d3.select(this).classed("text-hover",true);})
      .on("mouseout" , function(d) {d3.select(this).classed("text-hover",false);})
      ;

      init();

    d3.csv(actualDrug+"DemoInfo.csv").then(function(csv) {
      parallel_sets.datum(csv).call(sets);
    });
}
