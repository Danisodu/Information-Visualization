var margin_hm = { top: 150, right: 10, bottom: 50, left: 100 },
  cellSize=40;
  col_number=4;
  row_number=4;
  width_hm = cellSize*col_number*3, // - margin_hm.left - margin_hm.right,
  height_hm = cellSize*row_number*3 , // - margin_hm.top - margin_hm.bottom,
  //gridSize = Math.floor(width_hm / 24),
  hcrow = [0,1,2,3], // change to gene name or probe id
  hccol = [1,2,3,4], // change to gene name or probe id
  legendElementwidth_hm = 50,
  colorBuckets = 11,
  colors = ['#ffffe0', '#ffc58a',' #ffa474',' #fa8266',' #ed645c',' #db4551',' #c52940',' #aa0e27',' #8b0000','#660000'];
  colLabel = ["Less than high school","High school Graduate","Some college credit","College Graduate"],
  rowLabel = ['Non-user', 'Light-User', 'User', 'Heavy-User']; // change to contrast name


  var svg_hm = d3.select("#chart").append("svg")
      .attr("width_hm", width_hm + margin_hm.left + margin_hm.right)
      .attr("height_hm", height_hm + margin_hm.top + margin_hm.bottom)
      .append("g")
      .attr("transform", "translate(" + margin_hm.left + "," + margin_hm.top + ")")
      ;

  var colorScale = d3.scaleOrdinal()
      .domain([1, 10])
      .range(colors);

  var rowLabels = svg_hm.selectAll(".rowLabel")
      .data(rowLabel)
      .enter()
      .append("text")
      .text(function (d) { return d; })
      .attr("x", 0)
      .attr("y", function (d, i) { return hcrow.indexOf(i) * cellSize; })
      .style("text-anchor", "end")
      .attr("transform", "translate(-6," + cellSize / 1.5 + ") ")
      .attr("class", function (d,i) { return "rowLabel mono r"+i;} )
      .on("mouseover", function(d) {d3.select(this).classed("text-hover",true);})
      .on("mouseout" , function(d) {d3.select(this).classed("text-hover",false);})
      ;

    var colLabels = svg_hm.selectAll(".colLabel")
        .data(colLabel)
        .enter()
        .append("text")
        .text(function (d) { return d; })
        .attr("y", function (d, i) { return i * cellSize; })
        .attr("x", 0)
        .style("text-anchor", "left")
        .attr("transform", "translate("+cellSize/2 + ",-12) rotate (-90)")
        .attr("class",  function (d,i) { return "colLabel mono c"+i;} )
        .on("mouseover", function(d) {d3.select(this).classed("text-hover",true);})
        .on("mouseout" , function(d) {d3.select(this).classed("text-hover",false);})
        ;

  var legend = svg_hm.selectAll(".legend")
      .data(["<10%",'10-19%','20-29%','30-39%','40-49%','50-59%','60-69%','70-79%','80-89%','90%-100%'])
      .enter().append("g")
      .attr("class", "legend");

  legend.append("text")
    .attr("class", "mono")
    .text(function(d) { return d; })
    .attr("width_hm", legendElementwidth_hm)
    .attr("x", function(d, i) { return legendElementwidth_hm * i-70; })
    .attr("y", 160 + (cellSize*2));

    legend.append("rect")
    .attr("x", function(d, i) { return legendElementwidth_hm * i -70; })
    .attr("y", 130+(cellSize*2))
    .attr('width', 50)
    .attr('height', 14)
    .style("fill", function(d, i) { return colors[i]; });
