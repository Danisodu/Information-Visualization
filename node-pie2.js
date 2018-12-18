var DEFAULT_OPTIONS = {
    radius: 20,
    outerStrokeWidth: 10,
    parentNodeColor: 'blue',
    showPieChartBorder: true,
    pieChartBorderColor: 'black',
    pieChartBorderWidth: '5',
    showLabelText: false,
    labelText: 'text',
    labelColor: 'blue'
};
var pieColors =  ['#7fcdbb','#1d91c0','#253494','#020817'];

function getOptionOrDefault(key, options, defaultOptions) {
    defaultOptions = defaultOptions || DEFAULT_OPTIONS;
    if (options && key in options) {
        return options[key];
    }
    return defaultOptions[key];
}

function drawParentCircle(nodeElement, options) {
    var outerStrokeWidth = getOptionOrDefault('outerStrokeWidth', options);
    var radius = getOptionOrDefault('radius', options);
    var scale = getOptionOrDefault('scale', options);
    var parentNodeColor = getOptionOrDefault('parentNodeColor', options);

    nodeElement.insert("circle")
        .attr("id", "parent-pie")
        .attr("r", radius)
        .attr("fill", function (d) {
            return parentNodeColor;
        })
        .attr("stroke", function (d) {
             if(d.main == "true")
               return "#c7e9b4";
             else
               return parentNodeColor;
        })
        .attr("stroke-width", outerStrokeWidth * scale);
}

function drawPieChartBorder(nodeElement, options) {
    var radius = getOptionOrDefault('radius', options);
    var scale = getOptionOrDefault('scale', options);
    var pieChartBorderColor = getOptionOrDefault('pieChartBorderColor', options);
    var pieChartBorderWidth = getOptionOrDefault('pieChartBorderWidth', options);

    nodeElement.insert("circle")
        .attr("r", radius)
        .attr("fill", 'transparent')
        .attr("stroke", pieChartBorderColor)
        .attr("stroke-width", pieChartBorderWidth * scale);
}

function drawPieChart(nodeElement, percentages, options) {
    var radius = getOptionOrDefault('radius', options);
    var halfRadius = radius / 2;
    var halfCircumference = 2 * Math.PI * halfRadius;
    var user = 0;
    var percentToDraw = 0;
    var userTypeLabels = ['non users', 'light users','regular users','heavy users'];

    for (var p in percentages) {
        percentToDraw += percentages[p].percent;
        var percent =  Math.round(percentages[p].percent);
        var userType = percentages[p].user;

                //dont draw ammounts too close to 0
                if(percent == 0) {
                    user = user + 1;
                    continue;
                };

        nodeElement.insert('circle', '#parent-pie + *')
            .attr("class","pie pie"+user)
            .attr("r", halfRadius)
            .attr("fill", 'transparent')
            .style('stroke', pieColors[user])
            .style('stroke-width', radius)
            .style('stroke-dasharray',
                    halfCircumference * percentToDraw / 100
                    + ' '
                    + halfCircumference);

        user = user + 1;
    }

    d3.selectAll(".pie")
        .on("mousemove", function(d,i){

          var text = d3.select(this).attr("class");
          //var index = text.substr(text.lenght - 1);
          var index = text[7]

          d3.select("#tooltip")
             .style("left", (d3.event.pageX+30) + "px")
             .style("top", (d3.event.pageY-20) + "px")
            .text(d.id + " has " + Math.round(d.pieChart[index]["percent"]) + "% of " + userTypeLabels[index]);

            //Show the tooltip
            d3.select("#tooltip").classed("hidden", false);

          })
        .on("mouseout", function(){
           d3.select("#tooltip").classed("hidden", true);
        });
}

function drawTitleText(nodeElement, options) {
    var radius = getOptionOrDefault('radius', options);
    var text = getOptionOrDefault('labelText', options);
    var color = getOptionOrDefault('labelColor', options);

    nodeElement.append("text")
        .text(String(text))
        .attr("class", "node_label")
        .attr("text-anchor","middle")
        .attr("alignment-baseline","central")
        .attr("fill", color)
        .attr("dy", radius + 20);

    /*d3.selectAll(".node_label")
      .on("mouseover", function(){
      //  d3.select(this).classed("text-highlight",true);
      })
      .on("mouseout", function(){
        //  d3.select(this).classed("text-highlight",false);
      });*/
}

var NodePieBuilder = {
    drawNodePie: function (nodeElement, percentages, options) {
        drawParentCircle(nodeElement, options);

        if (!percentages) return;
        drawPieChart(nodeElement, percentages, options);

        var showPieChartBorder = getOptionOrDefault('showPieChartBorder', options);
        if (showPieChartBorder) {
            drawPieChartBorder(nodeElement, options);
        }

        var showLabelText = getOptionOrDefault('showLabelText', options);
        if (showLabelText) {
            drawTitleText(nodeElement, options);
        }
    }
};
