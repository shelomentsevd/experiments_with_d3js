import * as d3 from "d3";

var svg;
var playground = {
    width: 0,
    height: 0
};

var data = {
    nodes: [
        { id: 1 },
        { id: 2 },
        { id: 3 },
        { id: 4 },
        { id: 5 }
    ],

    links: [
        { from: 1, to: 2 },
        { from: 3, to: 5 },
        { from: 1, to: 5 }
    ]
};

$(window).ready( function() {
    playground.width = $(this).width();
    playground.height = $(this).height();
    console.log(playground);
    svg = d3.select("#playground").append("svg");
} );


$(window).resize( function() {
    playground.width = $(this).width();
    playground.height = $(this).height();
    console.log(playground);

    // Init data
    var dots = Array();

    for (let x = 0; x < playground.width; x = x + 50) {
        for( let y = 0; y < playground.height; y = y + 50 ) {
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
});