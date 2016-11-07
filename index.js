import * as d3 from "d3";

const cWidth = 1000,
      cHeight = 1000;

var svg = d3.select("#playground")
            .append("svg")
            .attr("width", cWidth)
            .attr("height", cHeight)
            .style('border', '1px solid black');

// Init data
var dots = Array();
console.log('Width' + cWidth);
console.log('Height' + cHeight);
for (let x = 0; x < cWidth; x = x + 50) {
    for( let y = 0; y < cHeight; y = y + 50 ) {
        dots.push({x, y, radius: 36});
    }
}

var circle = svg.selectAll("circle")
    .data(dots, function(d) { return d; });

circle.enter().append("circle")
    .attr("cy", function(d, i) { return d.y + 15; })
    .attr("cx", function(d, i) { return d.x + 15; })
    .attr("r", function(d) { return Math.sqrt(d.radius); });

circle.exit().remove();