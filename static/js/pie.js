function pie(dataset, datasetPieChart){
    

    truePositive(dataset);
    trueNegative(dataset);


}

function trueNegative(dataset){
    console.log();
    var data = [dataset['fp'],dataset['fn']];
    //console.log("dataset",dataset['accuracy'])
    var width = 300,
    height = 300,
    radius = Math.min(width, height) / 2;

    var color = d3.scaleOrdinal()
    .range(["#21908dff", "#440154ff"]);

var arc = d3.arc()
    .outerRadius(radius - 10)
    .innerRadius(0);

var labelArc = d3.arc()
    .outerRadius(radius - 40)
    .innerRadius(radius - 40);

var pie = d3.pie()
    .sort(null)
    .value(function(d) { return d; });

var svg = d3.select("#training-data-false-positive").append("svg")
    .attr("width", width)
    .attr("height", height)
  .append("g")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

  var g = svg.selectAll(".arc")
      .data(pie(data))
    .enter().append("g")
      .attr("class", "arc");

  g.append("path")
      .attr("d", arc)
      .style("fill", function(d) { return color(d.data); });

  g.append("text")
      .attr("transform", function(d) { return "translate(" + labelArc.centroid(d) + ")"; })
      .attr("dy", ".35em")
      .text(function(d) { return d.data; });
}

function truePositive(dataset){
    console.log("Inside true positive");
    var data = [dataset['tp'],dataset['tn']];
    var width = 300,
    height = 300,
    radius = Math.min(width, height) / 2;

var color = d3.scaleOrdinal()
    .range(["#21908dff", "#440154ff"]);

var arc = d3.arc()
    .outerRadius(radius - 10)
    .innerRadius(0);

var labelArc = d3.arc()
    .outerRadius(radius - 40)
    .innerRadius(radius - 40);

var pie = d3.pie()
    .sort(null)
    .value(function(d) { return d; });

var svg = d3.select("#training-data-true-positive").append("svg")
    .attr("width", width)
    .attr("height", height)
  .append("g")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

  var g = svg.selectAll(".arc")
      .data(pie(data))
    .enter().append("g")
      .attr("class", "arc");

  g.append("path")
      .attr("d", arc)
      .style("fill", function(d) { return color(d.data); });

  g.append("text")
      .attr("transform", function(d) { return "translate(" + labelArc.centroid(d) + ")"; })
      .attr("dy", ".35em")
      .text(function(d) { return d.data; });


      var svg_accuracy = d3.select("#training-data-true-positive").append("svg")
    .attr("width", 150)
    .attr("height", 50)
  .append("g")
   // .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");
     
   svg_accuracy.append('g')
   .attr('class', 'legend')
   .selectAll('text')
   .data(data)
   .enter()
   .append('text')
   .text((dataset['accuracy']*100)%10000)
   .attr('fill', "black")
   .attr('font-family', 'Calibri')
   .attr("x", 1)
   .attr('y', 34)
   .style("font-size", "16px")
   .attr('font-family', 'Calibri')
   .style("font-weight", "bold")
 //  .attr("text-anchor", "middle")
   .style("text-decoration", "bold");

   svg_accuracy.append('g')
   .attr('class', 'legend')
   .selectAll('text')
   .data(data)
   .enter()
   .append('text')
   .text("Accuracy:")
   .attr('fill', "black")
   .attr('font-family', 'Calibri')
   .attr("x", 1)
   .attr('y', 14)
   .style("font-size", "18px")
   .attr('font-family', 'Calibri')
   .style("font-weight", "bold")
 //  .attr("text-anchor", "middle")
   .style("text-decoration", "bold");


  
}