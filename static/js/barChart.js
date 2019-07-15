/*
var group = "All";

function datasetBarChosen(group, datasetBarChart) {
    var ds = [];
    for (x in datasetBarChart) {
        if (datasetBarChart[x].group == group) {
            ds.push(datasetBarChart[x]);
        }
    }
    return ds;
}
*/
function d3BarChartBase() {

    var margin = { top: 30, right: 5, bottom: 30, left: 50 },
        width = 600 - margin.left - margin.right,
        height = 350 - margin.top - margin.bottom,
        colorBar = d3.scale.ordinal(d3.schemeCategory10),
        barPadding = 0.5,
        misc = { ylabel: 7, xlabelH: 5, title: 11 };

    return {
        margin: margin,
        width: width,
        height: height,
        colorBar: colorBar,
        barPadding: barPadding,
        misc: misc
    };
}

function d3BarChart(datasetBarChart) {


    var basics = d3BarChartBase();

    var margin = basics.margin,
        width = basics.width,
        height = basics.height,
        colorBar = basics.colorBar,
        barPadding = basics.barPadding,
        misc = basics.misc;
    var colors = d3.scale.ordinal().domain(["Developed", "Developing"]).range(["#79abbd", "#6784b4"]);

    var xScale = d3.scale.ordinal()
        .domain(datasetBarChart.map(function(d) { return d.category; }))
        .range([0, width - 20]);
    var yScale = d3.scale.linear()
        .domain([0, d3.max(datasetBarChart, function(d) { return d.measure; })])
        .range([height, 0]);

    var xAxis = d3.svg.axis()
        .scale(xScale)
        .orient("bottom")
        .ticks(2);

    var yAxis = d3.svg.axis()
        .scale(yScale)
        .orient("left")
        .ticks(6);

    var svg = d3.select("#barChart")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .attr("id", "barChartPlot");

    // Title



    var plot = svg
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + (margin.top + misc.ylabel) + ")");

    plot.selectAll("rect")
        .data(datasetBarChart)
        .enter()
        .append("rect")
        .attr("x", function(d, i) {
            return (i * (width / datasetBarChart.length)) + ((width / datasetBarChart.length - barPadding) / 3.5);
        })
        .attr("width", width / 4 - barPadding)
        .attr("y", function(d) {
            return yScale(d.measure);
        })
        .attr("height", function(d) {
            return height - yScale(d.measure);
        })
        .attr("fill", function(d, i) {
            console.log(colors(d.Status))
            return colors(d.Status);
        });


    // Add y labels to plot	

    plot.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .selectAll("text")
        .data(datasetBarChart)
        .enter()
        .append("text")
        .text(function(d) {
            return formatAsInteger(d.measure);
        })
        .attr("text-anchor", "middle")

    .attr("x", function(d, i) {
            return (i * (width / datasetBarChart.length)) + ((width / datasetBarChart.length - barPadding) / 2);
        })
        .attr("y", function(d) {
            return (yScale(d.measure) - misc.ylabel);
        })
        .attr("class", "yAxis");

    // Add x labels to chart	


    var xLabels = plot
        .append("g")
        .attr("transform", "translate(" + (margin.left) + "," + (margin.top + height + misc.xlabelH) + ")")
        .call(xAxis);

    xLabels.selectAll("text.xAxis")
        .data(datasetBarChart)
        .enter()
        .append("text")
        .text(function(d) { return d.category; })
        .attr("text-anchor", "middle")
        .attr("x", function(d, i) {
            return i * ((width / datasetBarChart.length)) + ((width / datasetBarChart.length - barPadding) / 4);
        })
        .attr("y", 15)
        .attr("class", "xAxis");


    plot.append("g")
        .attr("class", "x-y")
        .selectAll("text")
        .data(datasetBarChart)
        .enter()
        .append("text")
        .text(function(d) { return d.Status; })
        .attr("text-anchor", "middle")
        .attr("x", function(d, i) {
            return i * ((width / datasetBarChart.length)) + ((width / datasetBarChart.length - barPadding) / 2);
        })
        .attr("y", function(d) {
            return yScale(d.measure) - 10;
        });

}