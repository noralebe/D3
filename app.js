// @TODO: YOUR CODE HERE!
 
var svgWidth = 960;
var svgHeight = 500;

var margin = {
 top: 20,
 right: 40,
 bottom: 60,
 left: 100
};
var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

var svg = d3
 .select("#scatter")
 .append("svg")
 .attr("width", svgWidth)
 .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);


d3.csv("assets/data/data.csv")
  .then(function(d3data) {
     // parse data
    d3data.forEach(function(data) {
        data.poverty = +data.poverty;
        data.healthcare = +data.healthcare;
     });
    
    var chosenXAxis = "poverty";
    var xLinearScale = d3.scaleLinear()
        .domain([d3.min(d3data, d => d[chosenXAxis])*.9,
          d3.max(d3data, d => d[chosenXAxis])*1.2
        ])
        .range([0, width]);
   
      var yLinearScale = d3.scaleLinear()
          .domain([0, d3.max(d3data, d => d.healthcare)]) 
          .range([height, 0]);

      var bottomAxis = d3.axisBottom(xLinearScale);
      var leftAxis = d3.axisLeft(yLinearScale);

      chartGroup.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);

      chartGroup.append("g")
        .call(leftAxis);

    var circlesGroup = chartGroup.selectAll("circle")
    .data(d3data)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d[chosenXAxis]))
    .attr("cy", d => yLinearScale(d.healthcare))
    .attr("r", 15)
    .attr("fill", "skyblue")
    .attr("opacity", ".5");

    var circleLabels = chartGroup.selectAll("null")
    .data(d3data)
    .enter()
    .append("text");

    circleLabels
    .attr("x", function(d) { 
      return xLinearScale (d.poverty); 
    })
    .attr("y", function(d) { 
      return  yLinearScale (d.healthcare); 
    })
    .text(function(d) { 
      return d.abbr; 
    })
    .attr("font-family", "sans-serif")
    .attr("font-size", "10px")
    .attr("text-anchor", "middle")
    .attr("fill", "white");

    var toolTip = d3.tip()
    .attr("class", "tooltip")
    .offset([80, -60])
    .html(function(d) {
      return (`${d.state}<br>Healthcare: ${d.healthcare}<br>Poverty: ${d.poverty}`);
    })

    chartGroup.call(toolTip);


    circlesGroup.on("mouseover", function(data) {
      toolTip.show(data,this);
      })
      // onmouseout event
      .on("mouseout", function(data, index) {
          toolTip.hide(data);
      });
      chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left + 40)
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .attr("class", "axisText")
      .text("Lacks Healthcare (%)");

    chartGroup.append("text")
      .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
      .attr("class", "axisText")
      .text("In Poverty (%)");

  });

