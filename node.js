var pie;
var graph;
var simulation;
//var width = 960;
//var height = 600;
var clicked = false;
var currentDrug = "Heroin";
var pieColors = ['#7fcdbb','#1d91c0','#253494','#020817'];

/*
var svg; = d3.select("#nodes").append("svg");
        width = +svg.attr("width"),
        height = +svg.attr("height");
*/
var color = "#c7e9b4";

d3.json("Heroin.json").then(function(data) {
    graph =  data;
    pie = data.pieChart;
    gen_vis();
});


function gen_vis(){

    var svg = d3.select("#nodes")
            .append("svg")
            .attr("class", "node_svg");

    simulation = d3.forceSimulation()
            .force("link", d3.forceLink().id(function (d) {
                return d.id;
            }))
            .force("charge", d3.forceManyBody().strength(-3750))
            .force("center", d3.forceCenter(960 / 2, 600 / 2));

    var link = svg.append("g")
            .attr("class", "links")
            .attr('transform', `translate(-100, -110)`)
            .selectAll("line")
            .data(graph.links)
            .enter().append("line")
            .attr("stroke-width", function (d) {
                return Math.sqrt(d.value);
            });

    var node = svg.append("g")
            .attr("class", "nodes")
            .attr('transform', `translate(-100, -110)`)
            .selectAll("g")
            .data(graph.nodes)
            .enter()
            .append("g")
            .attr("class", function(d,i){return "node" + i;})
            .call(d3.drag()
                    .on("start", dragstarted)
                    .on("drag", dragged)
                    .on("end", dragended))
            .on("mousemove", function(d, i) {
                d3.select(this).select(".node_label").classed("text-highlight",true);

                if(d.main == "false") {
                    d3.select(this).select("#parent-pie").classed("cell-hover",true);

                    d3.select(this).select(".node_label").classed("text-highlight",true);

                    d3.select("#tooltip")
                       .style("left", (d3.event.pageX+30) + "px")
                       .style("top", (d3.event.pageY-20) + "px")
                       .text(Math.round(d.size*100) + "% of users that consume \n" + actualDrug.toLowerCase() + " also consume " + d.id.toLowerCase());
                    //Show the tooltip
                    d3.select("#tooltip").classed("hidden", false);


                } else {
                  return null;
                }
              })
            .on("mouseout", function() {
               d3.select("#tooltip").classed("hidden", true);
               d3.select(this).classed("cell-hover",false);
               d3.select(this).select("#parent-pie").classed("cell-hover",false);
               d3.select(this).select(".node_label").classed("text-highlight",false);
            });

    /* Draw the respective pie chart for each node */
    node.each(function (d) {

        var d3Object = d3.select(this);

        var options = {
            scale: parseFloat(d.size),
            radius: 50 * parseFloat(d.size),
            parentNodeColor: color,
            outerStrokeWidth: 12,
            showLabelText: true,
            labelText: d.id,
            labelColor: color
        };

        drawTitleText(d3Object, options)
        drawParentCircle(d3Object, options);
        if(d.main == "false")
          drawPieChartBorder(d3Object, options);

        if(d.main == "true"){
            d3Object.on("click", function(){onclick();});
            drawPieChart(d3Object,d.pieChart,options);

            //d3Object.on("mouseover",function(){drawPieChart(d3Object,d.pieChart,options)});
            //d3Object.on("mouseout",function(){svg.selectAll('#slice').remove(); console.log("out")});
        }
    });

  var typesOfUsers = ["Non users: ","Light users: ", "Regular users: ", "Heavy users: "]

	var legend = svg.selectAll(".legend")
		    		.data(pie)
		    		.enter().append("g")
		    		.attr("class", "legend")
		    		.attr("transform", "translate(60,350)");

		legend.append("text")
  				.attr("class", "mono")
  				.text(function(d,i) {return typesOfUsers[i] + " " + Math.round(d.percent) + "%"; })
  				.attr("width_hm", 50)
  				.attr("x", 7)
  				.attr("y", function (d, i) { return 20*i+1; })
  				.style("text-anchor", "left");

		legend.append("rect")
  				.attr("x",-20)
  				.attr("y", function (d, i) { return 20*i -12; })
  				.attr('width',20)
  				.attr('height', 20)
  				.style("fill", function(d, i) { return pieColors[i]; });

    simulation
            .nodes(graph.nodes)
            .on("tick", ticked);

    simulation.force("link")
            .links(graph.links);

    function ticked() {
        link
                .attr("x1", function (d) {
                    return d.source.x;
                })
                .attr("y1", function (d) {
                    return d.source.y;
                })
                .attr("x2", function (d) {
                    return d.target.x;
                })
                .attr("y2", function (d) {
                    return d.target.y;
                });

        d3.selectAll("circle").attr("cx", function (d) {
                    return d.x;
                })
                .attr("cy", function (d) {
                    return d.y;
                });

        d3.selectAll(".node_label").attr("x", function (d) {
                    return d.x;
                })
                .attr("y", function (d) {
                    return d.y;
                });
    }
}

function onclick(o){
    clicked = (clicked)?false:true;

    if(clicked){
        //increase radius
    }

    if(!clicked){

    }
    console.log(clicked);

}


function dragstarted(d) {
    if (!d3.event.active) simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
}

function dragged(d) {
    d.fx = d3.event.x;
    d.fy = d3.event.y;
}

function dragended(d) {
    if (!d3.event.active) simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
}

function update_node_pie(drug){
	d3.select(".node_svg").remove();
	d3.json(drug + ".json").then(function(data) {
    graph =  data;
    pie = data.pieChart;
    gen_vis();
})}
