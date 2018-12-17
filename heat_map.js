var margin_hm = { top: 15, right: 10, bottom: 50, left: 100 },
  cellSize=35;
  col_number=4;
  row_number=4;
  width_hm = cellSize*col_number*8, // - margin_hm.left - margin_hm.right,
  height_hm = cellSize*row_number*3 , // - margin_hm.top - margin_hm.bottom,
  //gridSize = Math.floor(width_hm / 24),
  hcrow = [0,1,2,3], // change to gene name or probe id
  hccol = [1,2,3,4,5,6,7,8], // change to gene name or probe id
  legendElementwidth_hm = 50,
  colorBuckets = 11,
  colors = ['#ffffd9','#edf8b1','#c7e9b4','#7fcdbb','#41b6c4','#1d91c0','#225ea8','#253494','#081d58','#020817'];
  colLabel3 = ["Less than high school","High school graduate","Some college credit","College graduate"],
  colLabel2 = ["<$10k", "$10k-$20k", "$20k-$30k", "$30k-$40k", "$40k-$50k", "$50k-$75k", ">$75k"],
  colLabel1 = ["0 days","1 day", "2 days", "3 days", "4 days","5 days","6 days","7 days"],
  colLabel4 = ["Full time","Part time","Unemployed"],
  demoInfo = ["Skipped days at work","Personal income","Education","Employment status"],
  rowLabel = ['Non user', 'Light user', 'Regular user', 'Heavy user'],
  demo_info_values = {0: colLabel1,
                      1: colLabel2,
                      2: colLabel3,
                      3: colLabel4},
  initialDemoInfoPositions = {0: 0.1, 1: 7.8, 2: 15, 3: 19.2};

var svg_hm = d3.select(".svgHeatMap")
    .append("g")
    .attr("transform", "translate(10,150)");

svg_hm.append('text')
  .attr('class', 'title')
  .attr('x', width_hm/2)
  .attr('y', -130)
  .attr('text-anchor', 'middle')
  .text('Demographic information by user type');

var colorScale = d3.scaleOrdinal()
    .domain([1,2,3,4,5,6,7,8,9,10])
    .range(colors);

svg_hm.selectAll(".rowLabel")
    .data(rowLabel)
    .enter()
    .append("text")
    .text(function (d) { return d; })
    .attr("x", 166)
    .attr("y", function (d, i) { return hcrow.indexOf(i) * cellSize + 35; })
    .style("text-anchor", "end")
    .attr("transform", "translate(-6," + cellSize / 1.5 + ") ")
    .attr("class", function (d,i) { return "rowLabel mono r"+i;} );

var delta_y = Math.abs(Math.sin(22.5) * 31);
var delta_x = Math.abs(Math.sin(22.5) * 31);

svg_hm.selectAll(".colLabel1")
    .data(colLabel1)
    .enter()
    .append("text")
    .text(function (d) { return d; })
    .attr("y", function (d, i) { return i * 1.65 * delta_y + 150; })
    .attr("x",  function (d, i) { return i * 1.65 * delta_x + 90; })
    .style("text-anchor", "left")
    .attr("transform", "translate("+cellSize/2 + ",-12) rotate (-45)")
    .attr("class",  function (d,i) { return "colLabel mono c"+i;} );

svg_hm.selectAll(".colLabel2")
    .data(colLabel2)
    .enter()
    .append("text")
    .text(function (d) { return d; })
    .attr("y", function (d, i) { return i * 1.65 * delta_y + 150; })
    .attr("x", function (d, i) { return i * 1.65 * delta_x + 90; })
    .style("text-anchor", "left")
    .attr("transform", "translate(316,-12) rotate (-45)")
    .attr("class",  function (d,i) { return "colLabel mono c"+(i+7);} );

svg_hm.selectAll(".colLabel3")
    .data(colLabel3)
    .enter()
    .append("text")
    .text(function (d) { return d; })
    .attr("y", function (d, i) { return i * 1.65 * delta_y + 150; })
    .attr("x", function (d, i) { return i * 1.65 * delta_x + 90; })
    .style("text-anchor", "left")
    .attr("transform", "translate(595,-12) rotate (-45)")
    .attr("class",  function (d,i) { return "colLabel mono c"+(i+14);} );

svg_hm.selectAll(".colLabel4")
    .data(colLabel4)
    .enter()
    .append("text")
    .text(function (d) { return d; })
    .attr("y", function (d, i) { return i * 1.65 * delta_y + 150; })
    .attr("x", function (d, i) { return i * 1.65 * delta_x + 90; })
    .style("text-anchor", "left")
    .attr("transform", "translate(770,-12) rotate (-45)")
    .attr("class",  function (d,i) { return "colLabel mono c"+(i+15);} );

svg_hm.selectAll(".colLabel5")
    .data(demoInfo)
    .enter()
    .append("text")
    .text(function (d) { return d; })
    .attr("x",  function (d, i) { return i * (cellSize-8) + 170 + (cellSize * initialDemoInfoPositions[i]) + (cellSize * (demo_info_values[i].length)/2); })
    .attr("y", 200)
    .style("text-anchor", "middle")
    .attr("class",  function (d,i) { return "colDemoInfoLabel mono cd"+i;} );

var legend = svg_hm.selectAll(".legend")
    .data(["<10%",'10-19%','20-29%','30-39%','40-49%','50-59%','60-69%','70-79%','80-89%','90-100%'])
    .enter().append("g")
    .attr("class", "legend")
    .attr("transform", "translate(1172,7)");

legend.append("text")
  .attr("class", "mono")
  .text(function(d) { return d; })
  .attr("width_hm", legendElementwidth_hm)
  .attr("x", 0)
  .attr("y", function (d, i) { return 20*i-7; })
  .style("text-anchor", "end");

legend.append("rect")
  .attr("x",8)
  .attr("y", function (d, i) { return 20*i -20; })
  .attr('width',20)
  .attr('height', 20)
  .style("fill", function(d, i) { return colors[i]; });
