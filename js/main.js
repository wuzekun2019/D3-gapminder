// Creates a bootstrap-slider element

$("#yearSlider").slider({
    tooltip: 'always',
    tooltip_position:'bottom'
});
// Listens to the on "change" event for the slider
$("#yearSlider").on('change', function(event){
    // Update the chart on the new value
    updateChart(event.value.newValue);
});

// Color mapping based on continents
var contintentColors = {Asia: '#fc5a74', Europe: '#fee633',
    Africa: '#24d5e8', Americas: '#82e92d', Oceania: '#fc5a74'};

var tmzColors = {CTZ: '#fc5a74', ADTZ: '#fee633',
    MTZ: '#24d5e8', PTZ: '#82e92d', ETZ: '#477ce0',HSTZ:"#b5654f"};

var svg = d3.select('svg');

var svgWidth = +svg.attr('width');
var svgHeight = +svg.attr('height');

var padding = {t: 60, r: 40, b: 30, l: 40};

var chartWidth = svgWidth - padding.l - padding.r;
var chartHeight = svgHeight - padding.t - padding.b;

var chartG = svg.append('g')
    .attr('transform', 'translate(' +[padding.l, padding.t]+')')
    .style('fill', '#000');

var gridG = svg.append('g');

d3.csv('./data/viz_data.csv',
    function(d){
        // This callback formats each row of the data
        return {
            state: d.State,
            year: +d.Year,
            illness: +d.Illnesses_log,
            tmz: d['time zone'],
            hospitalization: +d.Hospitalizations,
            fatality: +d.Fatalities
        }
    },
    function(error, dataset){
        if(error) {
            console.error('Error while loading ./viz_data.csv dataset.');
            console.error(error);
            return;
        }
        
        // **** Set up your global variables and initialize the chart here ****
        bubbles = d3.nest()
            .key(function(d) {return d.year})
            .object(dataset);
        console.log(bubbles);


        var xExtent = d3.extent(dataset, function(d){
            return +d['hospitalization']+1;
        });

        var yExtent = d3.extent(dataset, function(d) {
            return +d['fatality']-1;
        })

        rExtent = d3.extent(dataset, function(d) {
            return +d['illness']*5;
        });

        rScale = d3.scaleSqrt()
            .domain(rExtent)
            .range([0, 50]);

        xScale = d3.scaleLog()
            .domain(xExtent)
            .range([0, 900]);

        yScale = d3.scaleLinear()
            .domain(yExtent)
            .range([620, 20])

        var xAxis = d3.axisBottom(xScale)
            .tickValues([500, 1000, 2000, 4000, 8000, 16000, 32000, 64000])
            .tickFormat(d3.format(",.0f"));

        var yAxis = d3.axisLeft(yScale)
            .tickValues([30, 40, 50, 60, 70, 80]);
        
        svg.append('g')
            .attr('class', 'xAxis')
            .attr('transform', 'translate(40, 640)')
            .call(xAxis);

        svg.append('g')
            .attr('class', 'yaxis')
            .attr('transform', 'translate(40, 20)')
            .call(yAxis);

        svg.append('text')
            .attr('class', 'xLabel')
            .attr('transform', 'translate(40, 680)')
            .text('Hospitalization');

        svg.append('text')
            .attr('class', 'yLabel')
            .attr('transform', 'translate(20, 30)')
            .text('Fatality');

        updateChart(1998);
    });

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

function updateChart(year) {
    // **** Update the chart based on the year here ****

    // Create an update selection
    var filteredbubbles = bubbles[year];

    var bubble = chartG.selectAll('.bubbles')
        .data(filteredbubbles, function(d) {return d.state;});
        
    var bubbleEnter = bubble.enter()
        .append('circle')
        .attr('class', 'bubbles');

    bubble.merge(bubbleEnter)
        .attr('cx', function(d) {
            console.log(xScale(d.hospitalization))
            return xScale(d.hospitalization);
        })
        .attr('cy', function(d) {
            return yScale(d.fatality);
        })
        .attr('r', function(d) {
            return rScale(d.illness);
        })
        .style('fill', function(d) {
            return tmzColors[d.tmz];
        })
        .style('stroke', '#000');

    bubble.exit().remove();
}
