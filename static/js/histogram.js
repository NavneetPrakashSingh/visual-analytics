function d3HistogramData(dataset,datasetBarChart){
var margin = {top: 20, right: 20, bottom: 30, left: 80},
    width = 1020 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

    xAxisData = []
    yAxisData = []
    legendData = []
      for(values in dataset){
        xAxisData.push(dataset[values]['country']);
        yAxisData.push(dataset[values]['carbondioxide']);
        if(!legendData.includes(dataset[values]['status'])){
          legendData.push(dataset[values]['status']);
        }
      }

var x = d3.scaleBand()
    .rangeRound([0, width], .1)
		.paddingInner(0.1);

var y = d3.scaleLinear()
    .range([height, 0]);

var xAxis = d3.axisBottom()
    .scale(x)
;

var yAxis = d3.axisLeft()
    .scale(y);

      // Color scale: give me a specie name, I return a color
var color = d3.scaleOrdinal()
      .domain(["Developing", "Developed"])
      .range(["#21908dff", "#440154ff"]);


var svg = d3.select("#histogram").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    x.domain(xAxisData);
    y.domain([d3.min(yAxisData), 15000000000]);
    
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
        .selectAll("text")  
        .style("text-anchor", "end")
        .attr("dx", "-1em")
        .attr("dy", "-0.5em")
        .attr("transform", "rotate(-90)");
  
    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
      .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Frequency");

        var tooltip = svg.append("g")
        .style("display", "none");
          
          tooltip.append("rect")
          .attr("width", 30)
          .attr("height", 20)
          .attr("fill", "white")
          .style("background","white")
          .style("opacity", 0.5);
      
          tooltip.append("text")
          .attr("x", 15)
          .attr("dy", "1.2em")
          .style("background","white")
          .style("text-anchor", "middle")
          .attr("font-size", "12px")
          .attr("font-weight", "bold");
  
  
    svg.selectAll(".bar")
        .data(dataset)
      .enter().append("rect")
      .style("fill", function(d){return color(d.status)})
        .attr("class", "bar")
        .attr("x", function(d) { return x(d.country); })
        .attr("width", x.bandwidth())
        .on("mouseover", function() { tooltip.style("display", null); })
        .on("mouseout", function() { tooltip.style("display", "none"); })
        .on("mousemove", function(d) {
            var xPosition = d3.mouse(this)[0] - 15;
            var yPosition = d3.mouse(this)[1] - 25;
            tooltip.attr("transform", "translate(" + xPosition + "," + yPosition + ")");
            tooltip.select("text").text("Country: "+d.country+" , "+"Status: "+d.status);
          })
        .attr("y", function(d) { return y(d.carbondioxide); })
        .attr("height", function(d) { return height - y(d.carbondioxide); });


 

}