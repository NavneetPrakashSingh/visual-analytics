/* 
Filename: Spatialbar.js
Author: Gurjot Singh
Version: 1.2
Created on: 10-July-2019
Description: Provides the code for the Spatial Bar Dashboard
*/


/* Loading Final Dataset CSV file in D3. Referred from https://gist.github.com/dnprock/bb5a48a004949c7c8c60*/
d3.csv("static/data/Final_Dataset.csv", function(err, data) {

  /* Declaring the config file */
  var config = {
   "data0": "Country",
   "data1": "expectancy ",
   "label0": "label 0",
   "label1": "label 1",
   "color0": "#99ccff",
   "color1": "#0050A1",
   "width": 760,
   "height": 600
  }
 
  /* Creating the set for years and countries */
  var set_years = [];
  var set_country = [];
  data.forEach(function(d) {

   d.Country = d.Country;
   d.Year = +d.Year;
   set_years.push(d.Year);
   set_country.push(d.Country);
   return d;
 
  });
  var years = new Set(set_years)
  var country_set = new Set(set_country);
 
  /* Creating the min max for the slider */
  var min_year = d3.min(data, function(d) {
   return d.Year;
  })
  var max_year = d3.max(data, function(d) {
   return d.Year;
  })

  /* Code for the slider implementation */
  var svg_slider = d3.select("#year_slider_child")
  var svg_line = d3.select("#details-svg").append("svg")
   .attr("width", 200)
   .attr("height", 100);
  
  svg_slider.append("input")
   .attr("type", "range")
   .attr("min", min_year)
   .attr("max", max_year)
   .attr("step", "1")
   .attr("value", '[2000,2008]')
   .attr("id", "year")
   .on("input", function input() {
    update();
   });
 
 
 
  var width = config.width,
   height = config.height;
 
  var COLOR_COUNTS = 9;
 
  /* Code for Spatial Visualization */
  function Interpolate(start, end, steps, count) {
   var s = start,
    e = end,
    final = s + (((e - s) / steps) * count);
   return Math.floor(final);
  }
 
  function Color(_r, _g, _b) {
   var r, g, b;
   var setColors = function(_r, _g, _b) {
    r = _r;
    g = _g;
    b = _b;
   };
 
   setColors(_r, _g, _b);
   this.getColors = function() {
    var colors = {
     r: r,
     g: g,
     b: b
    };
    return colors;
   };
  }
 
  function hexToRgb(hex) {
   var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
   return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
   } : null;
  }
 
  function valueFormat(d) {
   if (d > 1000000000) {
    return Math.round(d / 1000000000 * 10) / 10 + "B";
   } else if (d > 1000000) {
    return Math.round(d / 1000000 * 10) / 10 + "M";
   } else if (d > 1000) {
    return Math.round(d / 1000 * 10) / 10 + "K";
   } else {
    return d;
   }
  }
 
  var COLOR_FIRST = config.color0,
   COLOR_LAST = config.color1;
 
  var rgb = hexToRgb(COLOR_FIRST);
 
  var COLOR_START = new Color(rgb.r, rgb.g, rgb.b);
 
  rgb = hexToRgb(COLOR_LAST);
  var COLOR_END = new Color(rgb.r, rgb.g, rgb.b);
 
  var startColors = COLOR_START.getColors(),
   endColors = COLOR_END.getColors();
 
  var colors = [];
 
  for (var i = 0; i < COLOR_COUNTS; i++) {
   var r = Interpolate(startColors.r, endColors.r, COLOR_COUNTS, i);
   var g = Interpolate(startColors.g, endColors.g, COLOR_COUNTS, i);
   var b = Interpolate(startColors.b, endColors.b, COLOR_COUNTS, i);
   colors.push(new Color(r, g, b));
  }
  
  var MAP_KEY = config.data0;
  var MAP_VALUE = config.data1;
 
  /* Creating the Geo projections */
  var projection = d3.geoMercator()
   .scale((width + 1) / 2 / Math.PI)
   .translate([width / 2, height / 2])
   .precision(.1);
 
  var path = d3.geoPath()
   .projection(projection);
 
  var graticule = d3.geoGraticule();
 
  var svg = d3.select("#canvas-svg").append("svg")
   .attr("width", width)
   .attr("height", height);
 
  svg.append("path")
   .datum(graticule)
   .attr("class", "graticule")
   .attr("d", path);
 
  var slider_year = 2008;
  update()
 
 /* Update function to update the spatial map on changing the year */
  function update() {
   slider_year = document.getElementById("year").value;
   
   document.getElementById("range").innerHTML = slider_year;
   var valueHash = {};
 
   function log10(val) {
    return Math.log(val);
   }
   var input_year = 2001;
   data.forEach(function(d) {
 
    if (d.Year == slider_year) {
     valueHash[d[MAP_KEY]] = +d[MAP_VALUE];
    }
   });
 
   var quantize = d3.scaleQuantize()
    .domain([0, 1.0])
    .range(d3.range(COLOR_COUNTS).map(function(i) {
     return i
    }));
 
   quantize.domain([d3.min(data, function(d) {
     return (+d[MAP_VALUE])
    }),
    d3.max(data, function(d) {
     return (+d[MAP_VALUE])
    })
   ]);
 
 
   /* Creating the spatial map */
   d3.json("https://s3-us-west-2.amazonaws.com/vida-public/geo/world-topo-min.json", function(error, world) {
    var countries = topojson.feature(world, world.objects.countries).features;
 
    svg.append("path")
     .datum(graticule)
     .attr("class", "choropleth")
     .attr("d", path);
 
    var g = svg.append("g");
 
    g.append("path")
     .datum({
      type: "LineString",
      coordinates: [
       [-180, 0],
       [-90, 0],
       [0, 0],
       [90, 0],
       [180, 0]
      ]
     })
     .attr("class", "equator")
     .attr("d", path);
 
    var country = g.selectAll(".country").data(countries);
 
    country.enter().insert("path")
     .attr("class", "country")
     .attr("d", path)
     .attr("id", function(d, i) {
      return d.id;
     })
     .attr("title", function(d) {
      return d.properties.name;
     })
     .style("fill", function(d) {
      if (valueHash[d.properties.name]) {
       var c = quantize((valueHash[d.properties.name]));
       var color = colors[c].getColors();
       return "rgb(" + color.r + "," + color.g +
        "," + color.b + ")";
      } else {
       return "#ccc";
      }
     })
     .on("mousemove", function(d) {
      /* Code for on selecting a country */
      display(d.properties.name);
      var html = "";
 
      html += "<div class=\"tooltip_kv\">";
      html += "<span class=\"tooltip_key\">";
      html += d.properties.name;
      html += "</span>";
      html += "<span class=\"tooltip_value\">";
      html += (valueHash[d.properties.name] ? valueFormat(valueHash[d.properties.name]) : "");
      html += "";
      html += "</span>";
      html += "</div>";
 
      $("#tooltip-container").html(html);
      $(this).attr("fill-opacity", "0.8");
      $("#tooltip-container").show();
 
      var coordinates = d3.mouse(this);
 
      var map_width = $('.choropleth')[0].getBoundingClientRect().width;
 
      if (d3.event.pageX < map_width / 2) {
       d3.select("#tooltip-container")
        .style("top", (d3.event.layerY + 15) + "px")
        .style("left", (d3.event.layerX + 15) + "px");
      } else {
       var tooltip_width = $("#tooltip-container").width();
       d3.select("#tooltip-container")
        .style("top", (d3.event.layerY + 15) + "px")
        .style("left", (d3.event.layerX - tooltip_width - 30) + "px");
      }
     })
     .on("mouseout", function() {
      $(this).attr("fill-opacity", "1.0");
      $("#tooltip-container").hide();
     });
 
    g.append("path")
     .datum(topojson.mesh(world, world.objects.countries, function(a, b) {
      return a !== b;
     }))
     .attr("class", "boundary")
     .attr("d", path);
 
    svg.attr("height", config.height * 2.2 / 3);
   });
 
   /* Code to display bar chart */
   function display(country_name) {

 
    if (country_set.has(country_name) == true) {
     var svg_bar = d3.select("#bar"),
      margin = {
       top: 200,
       bottom: 200,
       left: 20,
       right: 80
      },
      width = +svg_bar.attr("width") - margin.left - margin.right,
      height = +svg_bar.attr("height") - margin.top - margin.bottom;
     d3.select("#svg_bar").remove();
     var bar = svg_bar.selectAll(".bar")
      .data(data)
 

     var x1 = d3.scaleBand()
      .range([0, width / 16])
      .padding(0.6);
     var y1 = d3.scaleLinear()
      .range([height, 10]);
 
     var y2 = d3.scaleLinear()
      .range([height, 10]);
 
     var y3 = d3.scaleLinear()
      .range([height, 10]);
 
     var y4 = d3.scaleLinear()
      .range([height, 10]);
 
     var y5 = d3.scaleLinear()
      .range([height, 10]);
 
     var data1 = data.filter(function(d) {
 
      if (d.Country == country_name && d.Year == slider_year) {
       return d;
      }
     })

     x1.domain(data1.map(function(d) {
      return d.Country;
     }));
     y1.domain([0, d3.max(data1, function(d) {
      return d["expectancy "];
     })]);
     y2.domain([0, d3.max(data1, function(d) {
      return d["infant deaths"];
     })]);
     y3.domain([0, d3.max(data1, function(d) {
      return d["Adult Mortality"];
     })]);
     y4.domain([0, d3.max(data1, function(d) {
      return d["cumulative_co2_emissions_tonnes"];
     })]);
     y5.domain([0, d3.max(data1, function(d) {
      return d[" BMI "];
     })]);
     
     d3.select("#container1").remove();
     d3.select("#container2").remove();
     d3.select("#container3").remove();
     d3.select("#container4").remove();
     d3.select("#container5").remove();
     /* Creating containers for multiple bar charts. Referred from https://stackoverflow.com/questions/33628552/two-bar-charts-from-same-data-object-using-d3-js */
     var container1 = svg_bar.append('g')
      .attr('id', 'container1');
 
     var container2 = svg_bar.append('g')
      .attr('id', 'container2');
 
     var container3 = svg_bar.append('g')
      .attr('id', 'container3');
 
     var container4 = svg_bar.append('g')
      .attr('id', 'container4');
 
     var container5 = svg_bar.append('g')
      .attr('id', 'container5');
 
     container1.selectAll(".bar")
      .data(data1)
      .enter().append("rect")
      .attr("class", "bar")
      .merge(bar)
      .attr("x", function(d) {
       return x1(d.Country);
      })
      .attr("width", x1.bandwidth())
      .attr("y", function(d) {
       return y1(d["expectancy "]);
      })
      .attr("height", function(d) {
       return height - y1(d["expectancy "]);
      })
      .attr("fill", "steelblue");
 
     container2.selectAll(".bar")
      .data(data1)
      .enter().append("rect")
      .attr("class", "bar")
      .merge(bar)
      .attr("x", function(d) {
       return x1(d.Country);
      })
      .attr("width", x1.bandwidth()) 
      .attr("y", function(d) {
       return y2(d["infant deaths"]);
      })
      .attr("height", function(d) {
       return height - y2(d["infant deaths"]);
      })
      .attr("fill", "brown");
 
     container3.selectAll(".bar")
      .data(data1)
      .enter().append("rect")
      .attr("class", "bar")
      .attr("x", function(d) {
       return x1(d.Country);
      })
      .attr("width", x1.bandwidth()) 
      .attr("y", function(d) {
       return y3(d["Adult Mortality"]);
      })
      .attr("height", function(d) {
       return height - y3(d["Adult Mortality"]);
      })
      .attr("fill", "orange");
 
     container4.selectAll(".bar")
      .data(data1)
      .enter().append("rect")
      .attr("class", "bar")
      .merge(bar)
      .attr("x", function(d) {
       return x1(d.Country);
      })
      .attr("width", x1.bandwidth()) 
      .attr("y", function(d) {
        
       return y4(d["cumulative_co2_emissions_tonnes"]);
      })
      .attr("height", function(d) {
       return height - y4(d["cumulative_co2_emissions_tonnes"]);
      })
      .attr("fill", "green");
 
     container5.selectAll(".bar")
      .data(data1)
      .enter().append("rect")
      .attr("class", "bar")
      .merge(bar)
      .attr("x", function(d) {
       return x1(d.Country);
      })
      .attr("width", x1.bandwidth()) 
      .attr("y", function(d) {
       return y5(d[" BMI "]);
      })
      .attr("height", function(d) {
       return height - y5(d[" BMI "]);
      })
      .attr("fill", "red");
 
    /* Creating Legends for Bar Chart */
     container1.selectAll("bar")
      .data(data1)
      .enter().append("rect")
      .attr("class", "bar")
      .attr("width", 15)
      .attr("height", 15)
      .style("fill", 'steelblue')
      .attr("x", 520)
      .attr("y", 30);
 
     container1.selectAll("bar")
      .data(data1)
      .enter().append("rect")
      .attr("class", "bar")
      .attr("width", 15)
      .attr("height", 15)
      .style("fill", 'brown')
      .attr("x", 520)
      .attr("y", 60);
 
     container1.selectAll("bar")
      .data(data1)
      .enter().append("rect")
      .attr("class", "bar")
      .attr("width", 15)
      .attr("height", 15)
      .style("fill", 'orange')
      .attr("x", 520)
      .attr("y", 90);
 
     container1.selectAll("bar")
      .data(data1)
      .enter().append("rect")
      .attr("class", "bar")
      .attr("width", 15)
      .attr("height", 15)
      .style("fill", 'green')
      .attr("x", 520)
      .attr("y", 120);
 
     container1.selectAll("bar")
      .data(data1)
      .enter().append("rect")
      .attr("class", "bar")
      .attr("width", 15)
      .attr("height", 15)
      .style("fill", 'red')
      .attr("x", 520)
      .attr("y", 150);
 
     container1.append('g')
      .attr('class', 'legend')
      .selectAll('text')
      .data(data1)
      .enter()
      .append('text')
      .text("Life Expectency")
      .attr('fill', "black")
      .attr('font-family', 'Calibri')
      .attr("x", 540)
      .attr('y', 43)
      .style("font-size", "15px")
      .attr('font-family', 'Calibri')
      .style("font-weight", "bold")
      .style("text-decoration", "bold");
 
     container1.append('g')
      .attr('class', 'legend')
      .selectAll('text')
      .data(data1)
      .enter()
      .append('text')
      .text("Infant Deaths")
      .attr('fill', "black")
      .attr('font-family', 'Calibri')
      .attr("x", 540)
      .attr('y', 73)
      .style("font-size", "15px")
      .attr('font-family', 'Calibri')
      .style("font-weight", "bold")
      .style("text-decoration", "bold");

      container1.append('g')
      .attr('class', 'legend')
      .selectAll('text')
      .data(data1)
      .enter()
      .append('text')
      .text("Status: ")
      .attr('fill', "black")
      .attr('font-family', 'Calibri')
      .attr("x", 510)
      .attr('y', 13)
      .style("font-size", "17px")
      .attr('font-family', 'Calibri')
      .style("font-weight", "bold")
      .style("text-decoration", "bold");

      container1.append('g')
      .attr('class', 'legend')
      .selectAll('text')
      .data(data1)
      .enter()
      .append('text')
      .text(function(d) { return d['Status']; })
      .attr('fill', "black")
      .attr('font-family', 'Calibri')
      .attr("x", 560)
      .attr('y', 13)
      .style("font-size", "17px")
      .attr('font-family', 'Calibri')
      .style("font-weight", "bold")
      .style("text-decoration", "bold");
 
     container1.append('g')
      .attr('class', 'legend')
      .selectAll('text')
      .data(data1)
      .enter()
      .append('text')
      .text("Adult Mortality")
      .attr('fill', "black")
      .attr('font-family', 'Calibri')
      .attr("x", 540)
      .attr('y', 103)
      .style("font-size", "15px")
      .attr('font-family', 'Calibri')
      .style("font-weight", "bold")
      .style("text-decoration", "bold");
 
     container1.append('g')
      .attr('class', 'legend')
      .selectAll('text')
      .data(data1)
      .enter()
      .append('text')
      .text("Co2 Emission")
      .attr('fill', "black")
      .attr('font-family', 'Calibri')
      .attr("x", 540)
      .attr('y', 133)
      .style("font-size", "15px")
      .attr('font-family', 'Calibri')
      .style("font-weight", "bold")
      .style("text-decoration", "bold");
 
     container1.append('g')
      .attr('class', 'legend')
      .selectAll('text')
      .data(data1)
      .enter()
      .append('text')
      .text("BMI")
      .attr('fill', "black")
      .attr('font-family', 'Calibri')
      .attr("x", 540)
      .attr('y', 163)
      .style("font-size", "15px")
      .attr('font-family', 'Calibri')
      .style("font-weight", "bold")
      .style("text-decoration", "bold");
 
 
     /* displaying result values */
     container1.append('g')
      .attr('class', 'legend')
      .selectAll('text')
      .data(data1)
      .enter()
      .append('text')
      .text(function(d) {
       return d["expectancy "]
      })
      .attr('fill', "black")
      .attr('font-family', 'Calibri')
      .attr("x", 37)
      .attr('y', 9)
      .style("font-size", "14px")
      .attr('font-family', 'Calibri')
      .style("font-weight", "bold")
      .attr("text-anchor", "middle")
      .style("text-decoration", "bold");
 
     container3.append('g')
      .attr('class', 'legend')
      .selectAll('text')
      .data(data1)
      .enter()
      .append('text')
      .text(function(d) {
       return d["Adult Mortality"]
      })
      .attr('fill', "black")
      .attr('font-family', 'Calibri')
      .attr("x", 37)
      .attr('y', 9)
      .style("font-size", "14px")
      .attr('font-family', 'Calibri')
      .style("font-weight", "bold")
      .attr("text-anchor", "middle")
      .style("text-decoration", "bold");
 
     container4.append('g')
      .attr('class', 'legend')
      .selectAll('text')
      .data(data1)
      .enter()
      .append('text')
      .text(function(d) {
       return d3.formatPrefix(".1", 1e6)(d["cumulative_co2_emissions_tonnes"])
      })
      .attr('fill', "black")
      .attr('font-family', 'Calibri')
      .attr("x", 37)
      .attr('y', 9)
      .style("font-size", "14px")
      .attr('font-family', 'Calibri')
      .style("font-weight", "bold")
      .attr("text-anchor", "middle")
      .style("text-decoration", "bold");
 
     container2.append('g')
      .attr('class', 'legend')
      .selectAll('text')
      .data(data1)
      .enter()
      .append('text')
      .text(function(d) {
       return d["infant deaths"]
      })
      .attr('fill', "black")
      .attr('font-family', 'Calibri')
      .attr("x", 37)
      .attr('y', 9)
      .style("font-size", "14px")
      .attr('font-family', 'Calibri')
      .style("font-weight", "bold")
      .attr("text-anchor", "middle")
      .style("text-decoration", "bold");
 
     container5.append('g')
      .attr('class', 'legend')
      .selectAll('text')
      .data(data1)
      .enter()
      .append('text')
      .text(function(d) {
       return d[" BMI "]
      })
      .attr('fill', "black")
      .attr('font-family', 'Calibri')
      .attr("x", 37)
      .attr('y', 9)
      .style("font-size", "14px")
      .attr('font-family', 'Calibri')
      .style("font-weight", "bold")
      .attr("text-anchor", "middle")
      .style("text-decoration", "bold");
 
    /* Positioning the containers */
     container1.attr('transform', 'translate(' + width / 49 + ',0)'); 
     container2.attr('transform', 'translate(' + width / 10 + ',0)'); 
     container3.attr('transform', 'translate(' + width / 5 + ',0)'); 
     container4.attr('transform', 'translate(' + width / 3.2 + ',0)'); 
     container5.attr('transform', 'translate(' + width / 2.5 + ',0)'); 
 
     container2.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x1));
 
     container2.append("g")
      .call(d3.axisLeft(y2));
 
     container1.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x1));
 
     container1.append("g")
      .call(d3.axisLeft(y1));
 
     container3.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x1));
 
     container3.append("g")
      .call(d3.axisLeft(y3));
 
     container4.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x1));
 
     container4.append("g")
      .call(d3.axisLeft(y4).tickFormat(d3.formatPrefix(".1", 1e6)));
 
     container5.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x1));
 
     container5.append("g")
      .call(d3.axisLeft(y5));
    } 
    else 
    {
     d3.select("#container1").remove();
     d3.select("#container2").remove();
     d3.select("#container3").remove();
     d3.select("#container4").remove();
     d3.select("#container5").remove();
    }
 
    d3.select(self.frameElement).style("height", (height * 2.3 / 3) + "px");
 
   }
  }
 
 
 
 });