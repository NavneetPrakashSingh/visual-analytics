function d3ScatterPlot(dataset,datasetBarChart){
    console.log("inside d3 scatter plot");
    console.log(dataset);
    var margin = {top: 10, right: 30, bottom: 40, left: 50},
    width = 520 - margin.left - margin.right,
    height = 520 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#scatterPlot")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")")

// Add the grey background that makes ggplot2 famous
svg
  .append("rect")
    .attr("x",0)
    .attr("y",0)
    .attr("height", height)
    .attr("width", height)
    .style("fill", "EBEBEB")

  // Add X axis
  var x = d3.scaleLinear()
    .domain([4*0.95, 8*1.001])
    .range([ 0, width ])
  svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x).tickSize(-height*1.3).ticks(10))
    .select(".domain").remove()

  // Add Y axis
  var y = d3.scaleLinear()
    .domain([-0.001, 9*1.01])
    .range([ height, 0])
    .nice()
  svg.append("g")
    .call(d3.axisLeft(y).tickSize(-width*1.3).ticks(7))
    .select(".domain").remove()

  // Customization
  svg.selectAll(".tick line").attr("stroke", "white")

  // Add X axis label:
  svg.append("text")
      .attr("text-anchor", "end")
      .attr("x", width/2 + margin.left)
      .attr("y", height + margin.top + 20)
      .text("CO2 Emission");

  // Y axis label:
  svg.append("text")
      .attr("text-anchor", "end")
      .attr("transform", "rotate(-90)")
      .attr("y", -margin.left + 20)
      .attr("x", -margin.top - height/2 + 20)
      .text("Life Expectancy")

  // Color scale: give me a specie name, I return a color
  var color = d3.scaleOrdinal()
    .domain(["Developing", "Developed" ])
    .range([ "#F8766D", "#00BA38"])

  // Add dots
  svg.append('g')
    .selectAll("dot")
    .data([dataset])
    .enter()
    .append("circle")
      .attr("cx", function (d) { return x(d.carbondioxide); } )
      .attr("cy", function (d) { return y(d.life); } )
      .attr("r", 5)
      .style("fill", function (d) { return color(d.status) } )

      console.log("done");
}