var graph;
var simulation;
//var width = 960;
//var height = 600;
var clicked = false;

/*
var svg; = d3.select("#nodes").append("svg");
        width = +svg.attr("width"),
        height = +svg.attr("height");
*/
var color = d3.rgb(112,128,144);


d3.json("Meth.json").then(function(data) {
    graph =  data;
    console.log(data);
    gen_vis();
});

function gen_vis(){
    var svg = d3.select("#nodes")
            .append("svg");

    svg.append('text')
      .attr('class', 'title')
      .attr('x', width / 2 + 28)
      .attr('y', 20)
      .attr('text-anchor', 'middle')
      .text('Drugs association degree');

    simulation = d3.forceSimulation()
            .force("link", d3.forceLink().id(function (d) {
                return d.id;
            }))
            .force("charge", d3.forceManyBody().strength(-2000))
            .force("center", d3.forceCenter(960 / 2, 600 / 2))
;

    var link = svg.append("g")
            .attr("class", "links")
            .attr('transform', `translate(-300, -100)`)
            .selectAll("line")
            .data(graph.links)
            .enter().append("line")
            .attr("stroke-width", function (d) {
                return Math.sqrt(d.value);
            });

    var node = svg.append("g")
            .attr("class", "nodes")
            .attr('transform', `translate(-300, -100)`)
            .selectAll("g")
            .data(graph.nodes)
            .enter()
            .append("g")
            .attr("class", function(d,i){return "node" + i;})
            .call(d3.drag()
                    .on("start", dragstarted)
                    .on("drag", dragged)
                    .on("end", dragended));


    /*node[0].on("mouseover",function(){console.log("mouse over!")})
           .on("mouseout",function(){console.log("mouse out!")});
*/
    /* Draw the respective pie chart for each node */
    node.each(function (d) {
        console.log("1");

        var d3Object = d3.select(this);
        console.log(typeof d.s);

        var options = {
            scale: parseFloat(d.size),
            radius: 40 * parseFloat(d.size),
            parentNodeColor: color,
            outerStrokeWidth: 12,
            showLabelText: true,
            labelText: d.id,
            labelColor: color
        };

        drawParentCircle(d3Object, options);
        drawPieChartBorder(d3Object, options);
        drawTitleText(d3Object, options)

        if(d.main == "true"){
            console.log("aa")
            d3Object.on("click", function(){onclick();});
            drawPieChart(d3Object,d.pieChart,options);
            //d3Object.on("mouseover",function(){drawPieChart(d3Object,d.pieChart,options)});
            //d3Object.on("mouseout",function(){svg.selectAll('#slice').remove(); console.log("out")});
        }
    });

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
