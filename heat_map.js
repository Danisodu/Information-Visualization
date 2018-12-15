var margin_hm = { top: 15, right: 10, bottom: 50, left: 100 },
  cellSize=35;
  col_number=4;
  row_number=4;
  width_hm = cellSize*col_number*3, // - margin_hm.left - margin_hm.right,
  height_hm = cellSize*row_number*3 , // - margin_hm.top - margin_hm.bottom,
  //gridSize = Math.floor(width_hm / 24),
  hcrow = [0,1,2,3], // change to gene name or probe id
  hccol = [1,2,3,4], // change to gene name or probe id
  legendElementwidth_hm = 50,
  colorBuckets = 11,
  colors = ['#ffffd9','#edf8b1','#c7e9b4','#7fcdbb','#41b6c4','#1d91c0','#225ea8','#253494','#081d58','#020817'];
  colLabel = ["Less than High School","High School Graduate","Some College Credit","College Graduate"],
  rowLabel = ['Non-user', 'Light-User', 'User', 'Heavy-User']; // change to contrast name

  var svg_hm = d3.select(".svgHeatMap")
      .append("g")
      .attr("transform", "translate(50,150)");

  svg_hm.append('text')
    .attr('class', 'title')
    .attr('x', width / 2)
    .attr('y', -130)
    .attr('text-anchor', 'middle')
    .text('Demographic Info by User Type');

  var colorScale = d3.scaleOrdinal()
      .domain([1,2,3,4,5,6,7,8,9,10])
      .range(colors);

  var rowLabels = svg_hm.selectAll(".rowLabel")
      .data(rowLabel)
      .enter()
      .append("text")
      .text(function (d) { return d; })
      .attr("x", 160)
      .attr("y", function (d, i) { return hcrow.indexOf(i) * cellSize + 35; })
      .style("text-anchor", "end")
      .attr("transform", "translate(-6," + cellSize / 1.5 + ") ")
      .attr("class", function (d,i) { return "rowLabel mono r"+i;} )
      .on("mouseover", function(d) {d3.select(this).classed("text-hover",true); })
      .on("mouseout" , function(d) {d3.select(this).classed("text-hover",false); });

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

  var legend = svg_hm.selectAll(".legend")
      .data(["<10%",'10-19%','20-29%','30-39%','40-49%','50-59%','60-69%','70-79%','80-89%','90-100%'])
      .enter().append("g")
      .attr("class", "legend");

  legend.append("text")
    .attr("class", "mono")
    .text(function(d) { return d; })
    .attr("width_hm", legendElementwidth_hm)
    .attr("x", -5)
    .attr("y", function (d, i) { return 20*i-7; })

  legend.append("rect")
    .attr("x",-32)
    .attr("y", function (d, i) { return 20*i -20; })
    .attr('width',20)
    .attr('height', 20)
    .style("fill", function(d, i) { return colors[i]; });
