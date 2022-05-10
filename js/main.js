// Creates a bootstrap-slider element

$("#yearSlider").slider({
  tooltip: "always",
  tooltip_position: "bottom",
});
// Listens to the on "change" event for the slider
$("#yearSlider").on("change", function (event) {
  // Update the chart on the new value
  updateChart(event.value.newValue);
});

// Color mapping based on continents
var contintentColors = {
  Asia: "#fc5a74",
  Europe: "#fee633",
  Africa: "#24d5e8",
  Americas: "#82e92d",
  Oceania: "#fc5a74",
};

var tmzColors = {
  CTZ: "#fc5a74",
  ADTZ: "#fee633",
  MTZ: "#24d5e8",
  PTZ: "#82e92d",
  ETZ: "#477ce0",
  HSTZ: "#b5654f",
};

var svg = d3.select("svg");

var svgWidth = +svg.attr("width");
var svgHeight = +svg.attr("height");

var padding = { t: 60, r: 40, b: 30, l: 40 };

var chartWidth = svgWidth - padding.l - padding.r;
var chartHeight = svgHeight - padding.t - padding.b;

var chartG = svg
  .append("g")
  .attr("transform", "translate(" + [padding.l, padding.t] + ")")
  .style("fill", "#000");

var gridG = svg.append("g");

d3.csv(
  "./data/viz_data.csv",
  function (d) {
    // This callback formats each row of the data
    return {
      state: d.State,
      year: +d.Year,
      illness: +d.Illnesses_log,
      tmz: d["time zone"],
      hospitalization: +d.Hospitalizations,
      fatality: +d.Fatalities,
    };
  },
  function (error, dataset) {
    if (error) {
      //console.error('Error while loading ./viz_data.csv dataset.');
      //console.error(error);
      return;
    }

    // **** Set up your global variables and initialize the chart here ****
    bubbles = d3
      .nest()
      .key(function (d) {
        return d.year;
      })
      .object(dataset);
    //console.log(bubbles);

    var xExtent = d3.extent(dataset, function (d) {
      return +d["hospitalization"] + 1;
    });

    var yExtent = d3.extent(dataset, function (d) {
      return +d["fatality"] - 1;
    });

    rExtent = d3.extent(dataset, function (d) {
      return +d["illness"] * 5;
    });

    rScale = d3.scaleSqrt().domain(rExtent).range([0, 50]);

    xScale = d3.scaleLog().domain(xExtent).range([0, 900]);

    yScale = d3.scaleLinear().domain(yExtent).range([620, 20]);

    var xAxis = d3
      .axisBottom(xScale)
      .tickValues([500, 1000, 2000, 4000, 8000, 16000, 32000, 64000])
      .tickFormat(d3.format(",.0f"));

    var yAxis = d3.axisLeft(yScale).tickValues([30, 40, 50, 60, 70, 80]);

    d3.selection.prototype.moveToBack = function () {
      return this.each(function () {
        var firstChild = this.parentNode.firstChild;
        if (firstChild) {
          this.parentNode.insertBefore(this, firstChild);
        }
      });
    };

    svg
      .append("g")
      .attr("class", "xAxis")
      .attr("transform", "translate(40, 640)")
      .call(xAxis);

    svg
      .append("g")
      .attr("class", "yaxis")
      .attr("transform", "translate(40, 20)")
      .call(yAxis);

    svg
      .append("text")
      .attr("class", "xLabel")
      .attr("transform", "translate(40, 680)")
      .text("Hospitalization");

    svg
      .append("text")
      .attr("class", "yLabel")
      .attr("transform", "translate(20, 30)")
      .text("Fatality");

    yearLabel = svg
      .append("text")
      .attr("class", "year")
      .attr("x", 60)
      .attr("y", 620)
      .attr("font-family", "Helvetica Neue, Arial")
      .attr("font-weight", 500)
      .attr("font-size", 80)
      .text(1998)
      .attr("fill", function (d) {
        return d3.select(this).moveToBack();
      })
      .attr("fill", "#ccc");

    //yearLabel.text(year);
    updateChart(1998);
  }
);

// d3.csv('./data/gapminder.csv',
//     function(d){
//         // This callback formats each row of the data
//         return {
//             country: d.country,
//             year: +d.year,
//             population: +d.population,
//             continent: d.continent,
//             lifeExp: +d.lifeExp,
//             gdpPercap: +d.gdpPercap
//         }
//     },
//     function(error, dataset){
//         if(error) {
//             console.error('Error while loading ./gapminder.csv dataset.');
//             console.error(error);
//             return;
//         }

//         // **** Set up your global variables and initialize the chart here ****
//         bubbles = d3.nest()
//             .key(function(d) {return d.year})
//             .object(dataset);
//         console.log(bubbles);

//         var xExtent = d3.extent(dataset, function(d){
//             return +d['gdpPercap'];
//         });

//         var yExtent = d3.extent(dataset, function(d) {
//             return +d['lifeExp'];
//         })

//         rExtent = d3.extent(dataset, function(d) {
//             return +d['population'];
//         });

//         rScale = d3.scaleSqrt()
//             .domain(rExtent)
//             .range([0, 50]);

//         xScale = d3.scaleLog()
//             .domain(xExtent)
//             .range([0, 900]);

//         yScale = d3.scaleLinear()
//             .domain(yExtent)
//             .range([620, 20])

//         var xAxis = d3.axisBottom(xScale)
//             .tickValues([500, 1000, 2000, 4000, 8000, 16000, 32000, 64000])
//             .tickFormat(d3.format(",.0f"));

//         var yAxis = d3.axisLeft(yScale)
//             .tickValues([30, 40, 50, 60, 70, 80]);

//         svg.append('g')
//             .attr('class', 'xAxis')
//             .attr('transform', 'translate(40, 640)')
//             .call(xAxis);

//         svg.append('g')
//             .attr('class', 'yaxis')
//             .attr('transform', 'translate(40, 20)')
//             .call(yAxis);

//         svg.append('text')
//             .attr('class', 'xLabel')
//             .attr('transform', 'translate(40, 680)')
//             .text('Income per person, GDO/capita in $/year adjusted for infation');

//         svg.append('text')
//             .attr('class', 'yLabel')
//             .attr('transform', 'translate(20, 30)')
//             .text('Life Expectancy, years');

//         updateChart(1952);
//     });

function setYear(year) {
  yearLabel.text(year);
}

function updateChart(year) {
  // **** Update the chart based on the year here ****
  // svg
  //   .append("text")
  //   .attr("x", 70)
  //   .attr("font-family", "Helvetica Neue, Arial")
  //   .attr("font-weight", 500)
  //   .attr("font-size", 80)
  //   .attr("y", 600)
  //   .text(year)
  //   .attr("alignment-baseline", "middle")
  //   .attr("fill", function (d) {
  //     return d3.select(this).moveToBack();
  //   })
  //   .attr("fill", function (d) {
  //     d3.select(this).transition().duration(2000).style("opacity", 0);
  //   })
  //   .attr("fill", "#ccc");

  // d3.selectAll("text").on("mouseover", function (d) {
  //   d3.select(this).moveToBack();
  // });

  setYear(year);

  var tooltip = d3
    .select("#main")
    .append("div")
    .style("opacity", 0)
    .attr("class", "tooltip")
    .style("background-color", "black")
    .style("border-radius", "5px")
    .style("padding", "10px")
    .style("color", "white");

  var showTooltip = function (d) {
    tooltip.transition().duration(200);
    tooltip
      .style("opacity", 1)
      .html("State: " + d.state + "<br /> Year:" + d.year)
      .style("left", d3.mouse(this)[0] + 30 + "px")
      .style("top", d3.mouse(this)[1] + 30 + "px");
  };
  var moveTooltip = function (d) {
    tooltip
      .style("left", d3.mouse(this)[0] + 60 + "px")
      .style("top", d3.mouse(this)[1] + 60 + "px");
  };
  var hideTooltip = function (d) {
    tooltip.transition().duration(200).style("opacity", 0);
  };

  // Create an update selection
  var filteredbubbles = bubbles[year];

  var bubble = chartG.selectAll(".bubbles").data(filteredbubbles, function (d) {
    return d.state;
  });

  var bubbleEnter = bubble.enter().append("circle").attr("class", "bubbles");

  bubble
    .merge(bubbleEnter)
    .attr("cx", function (d) {
      return xScale(d.hospitalization);
    })
    .attr("cy", function (d) {
      return yScale(d.fatality);
    })
    .attr("r", function (d) {
      return rScale(d.illness);
    })
    .style("fill", function (d) {
      return tmzColors[d.tmz];
    })
    .style("stroke", "#000")
    .on("mouseover", showTooltip)
    .on("mousemove", moveTooltip)
    .on("mouseleave", hideTooltip);

  bubble.exit().remove();
}
