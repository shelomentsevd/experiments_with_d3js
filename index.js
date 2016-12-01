import * as d3 from "d3";

var svg, simulation;
var playground = {
    width: 0,
    height: 0
};

window.onload = function initialization() {
    const bodyRect = document.querySelector('body').getBoundingClientRect();
    playground.width = bodyRect.width;
    playground.height = bodyRect.height;

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

    svg = d3.select("#playground")
            .append("svg")
            .on("dblclick", function() {
                console.log(d3.event);
                data.nodes.push({ id: 4, x: d3.event.clientX, y: d3.event.clientY });
                restart();
            });

    simulation = d3.forceSimulation()
                        .force('link', d3.forceLink().id(function(item){ return item.id; }))
                        .force('charge', d3.forceManyBody())
                        .force('center', d3.forceCenter(playground.width / 2, playground.height / 2))
                        .on("tick", ticked);

    var link = svg.append("g")
                    .attr("class", "links")
                    .selectAll("line");

    var node = svg.append("g")
                    .attr("class", "nodes")
                    .selectAll("circle");

    restart();

    function restart() {

        // Update for links
        link = link.data(data.links, function(d) { return d.source.id + "-" + d.target.id; });
        link.exit().remove();
        link = link.enter().append("line").merge(link);

        // Update for nodes
        node = node.data(data.nodes, function(d) { return d.id;});
        node.exit().remove();
        node = node.enter()
                    .append("circle").attr("r", 2.5).call(d3.drag()
                    .on('start', dragstarted)
                    .on('drag', dragged)
                    .on('end', dragended))
                    .on("click", function(d) {
                        console.log(d);
                    }).merge(node);

        // Update and restart simulation
        simulation.nodes(data.nodes);
        simulation.force("link").links(data.links);
        simulation.alpha(1).restart();
    }

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
      if (!d3.event.active) simulation.alphaTarget(1).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(d) {
      d.fx = d3.event.x;
      d.fy = d3.event.y;
    }

    function dragended(d) {
      if (!d3.event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }
};


window.onresize = function resize() {
    const bodyRect = document.querySelector('body').getBoundingClientRect();

    playground.width = bodyRect.width;
    playground.height = bodyRect.height;

    simulation.force('center', d3.forceCenter(playground.width / 2, playground.height / 2));
    simulation.alphaTarget(1).restart();
};