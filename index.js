import * as d3 from "d3";

var svg;
var playground = {
    width: 0,
    height: 0
};

var data = {
  "nodes": [
    {"id": 1},
    {"id": 2},
    {"id": 3},
  ],
  "links": [
    {"source": 1, "target": 2},
    {"source": 3, "target": 2},
  ]
};

window.onload = function initialization() {
    const bodyRect = document.querySelector('body').getBoundingClientRect();
    playground.width = bodyRect.width;
    playground.height = bodyRect.height;

    svg = d3.select("#playground").append("svg");

    playground.sim = d3.forceSimulation()
                       .force('link', d3.forceLink().id(function(item){ return item.id; }))
                       .force('charge', d3.forceManyBody())
                       .force('center', d3.forceCenter(playground.width / 2, playground.height / 2));

    var link = svg.append("g")
                             .attr("class", "links")
                             .selectAll("line")
                             .data(data.links)
                             .enter().append("line");

    var node = svg.append("g")
                             .attr("class", "nodes")
                             .selectAll("circle")
                             .data(data.nodes)
                             .enter().append("circle")
                             .attr("r", 2.5)
                             .call(d3.drag()
                                     .on('start', dragstarted)
                                     .on('drag', dragged)
                                     .on('end', dragended));

    playground.sim.nodes(data.nodes)
                  .on('tick', ticked);

    playground.sim.force('link').links(data.links);

    function ticked() {
        link
            .attr("x1", function(d) { return d.source.x; })
            .attr("y1", function(d) { return d.source.y; })
            .attr("x2", function(d) { return d.target.x; })
            .attr("y2", function(d) { return d.target.y; });

        node
            .attr("cx", function(d) { return d.x; })
            .attr("cy", function(d) { return d.y; });
    }

    function dragstarted(d) {
      if (!d3.event.active) playground.sim.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(d) {
      d.fx = d3.event.x;
      d.fy = d3.event.y;
    }

    function dragended(d) {
      if (!d3.event.active) playground.sim.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }
};


window.onresize = function resize() {
    const bodyRect = document.querySelector('body').getBoundingClientRect();

    playground.width = bodyRect.width;
    playground.height = bodyRect.height;

    playground.sim.force('center', d3.forceCenter(playground.width / 2, playground.height / 2));
    playground.sim.alphaTarget(0.3).restart();
};