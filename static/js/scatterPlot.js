function d3ScatterPlot(dataset,datasetBarChart){

  xAxisData = []
  yAxisData = []
  legendData = []
    for(values in dataset){
      xAxisData.push(dataset[values]['carbondioxide']);
      yAxisData.push(dataset[values]['life']);
      if(!legendData.includes(dataset[values]['status'])){
        legendData.push(dataset[values]['status']);
      }
    }
    var margin = {top: 10, right: 30, bottom: 40, left: 50},
    width = 1020 - margin.left - margin.right,
    height = 1020 - margin.top - margin.bottom;

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
    .domain([d3.min(xAxisData), 15000000000])
    .range([ 0, width ])

  svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x).tickSize(-height*1.3).ticks(10))
    .select(".domain").remove()

  // Add Y axis
  var y = d3.scaleLinear()
    .domain([d3.min(yAxisData),d3.max(yAxisData)])
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
      .text("Carbondioxide Emission");

  // Y axis label:
  svg.append("text")
      .attr("text-anchor", "end")
      .attr("transform", "rotate(-90)")
      .attr("y", -margin.left + 20)
      .attr("x", -margin.top - height/2 + 20)
      .text("Life Expectancy");

  
    // Color scale: give me a specie name, I return a color
    var color = d3.scaleOrdinal()
    .domain(["Developing", "Developed"])
    .range(["#21908dff", "#440154ff"]);

  // Highlight the specie that is hovered
  var highlight = function(d){

    selected_specie = d.status

    d3.selectAll(".dot")
      .transition()
      .duration(200)
      .style("fill", "lightgrey")
      .attr("r", 3)

    d3.selectAll("." + selected_specie)
      .transition()
      .duration(200)
      .style("fill", color(selected_specie))
      .attr("r", 7)
  }

  // Highlight the specie that is hovered
  var doNotHighlight = function(d){
    for(var values in legendData){
      d3.selectAll("." + legendData[values])
      .transition()
      .duration(200)
      .style("fill", color(legendData[values]))
      .attr("r", 5)
    }    
  }

  // Add dots
  svg.append('g')
    .selectAll("dot")
    .data(dataset)
    .enter()
    .append("circle")
      .attr("class", function (d) { return "dot " + d.status } )
      .attr("cx", d => x(d.carbondioxide))
      .attr("cy", d => y(d.life))
      .attr("r", 5)
      .style("fill",function(d){return color(d.status)})
      // .style("fill", d => d.status === "Developing"?'#F8766D':"#00BA38")
      .on("mouseover", highlight)
      .on("mouseleave", doNotHighlight )


      //legend starts here
      var legend = svg.selectAll('legend')
			.data(color.domain())
			.enter().append('g')
			.attr('class', 'legend')
			.attr('transform', function(d,i){ return 'translate(0,' + i * 20 + ')'; });

		// give x value equal to the legend elements. 
		// no need to define a function for fill, this is automatically fill by color.
		legend.append('rect')
			.attr('x', width)
			.attr('width', 18)
			.attr('height', 18)
			.style('fill', color);

		// add text to the legend elements.
		// rects are defined at x value equal to width, we define text at width - 6, this will print name of the legends before the rects.
		legend.append('text')
			.attr('x', width - 6)
			.attr('y', 9)
			.attr('dy', '.35em')
			.style('text-anchor', 'end')
			.text(function(d){ return d; });


		// d3 has a filter fnction similar to filter function in JS. Here it is used to filter d3 components.
		legend.on('click', function(type){
			d3.selectAll('.dot')
				.style('opacity', 0.15)
				.filter(function(d){
					return d.status == type;
				})
				.style('opacity', 1);
		})
      console.log("done");
}