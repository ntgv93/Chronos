import * as d3 from 'd3';
class RouteTrace {
  containerEl;
  props;
  svg;
  
  // creating D3 container for the nodes
  constructor(containerEl, props) {
    this.containerEl = containerEl;
    this.props = props;
    const { width, height } = props;
    this.svg = d3.select(containerEl)
      .append('svg')
      .style('background-color', 'white')
      .attr('width', width)
      .attr('height', height);
    this.updateDatapoints();
  }

  updateDatapoints = () => {
    const { svg, props: { data, width, height } } = this;
    console.log('data: ', data)
    console.log('nodes: ', data[0])
    console.log('links: ', data[1])
      
    var simulation = d3.forceSimulation(data[0])
      .force('link', d3.forceLink())
      // .force("link", d3.forceLink()                               // This force provides links between nodes
      //   .id(function(d) { return d.id; })                     // This provide  the id of a node
      //   .links(data[1])                                    // and this the list of links
      // )
      .force('charge', d3.forceManyBody())
      .force('center', d3.forceCenter(width / 2, height / 2))

    const link = svg.append("g")
      .attr("class", "links")
      .selectAll("line")
      .data(data[1])
      .enter()
      .append("line")
      .style('stroke', 'black')

    const node = svg.append("g")
      .attr("class", "nodes")
      .selectAll("g")
      .data(data[0])
      .enter()
      .append("g")

    const circles = node.append("circle")
      .attr("r", 20)
      .attr("fill", '#00eda0')
      .on('mouseover', () => d3.select(this).text(d.id))
      .on('mouseup', (d, i, nodes) => this.setActiveDatapoint(d, nodes[i]))

    const lables = node.append("text")
      .text(d => d.id)
      .attr('x', d => d.x)
      .attr('y', d => d.y)

    node.append("title")
      .text(d => d.id)

    simulation
      .nodes(data[0])
      .on('tick', ticked);

    simulation.force('link')
      // .links(data[1]); // error: cannot create property vx on books

    function ticked() {
      link
        .attr('x1', function(d) { return d.source.x; })
        .attr('y1', function(d) { return d.source.y; })
        .attr('x2', function(d) { return d.target.x; })
        .attr('y2', function(d) { return d.target.y; });

      node
        .attr("transform", function(d) {
          return "translate(" + d.x + "," + d.y + ")";
        })
    }
  }

  setActiveDatapoint = (d, node) => {
    d3.select(node).style('fill', 'yellow');
    this.props.onDatapointClick(d);
  }

}

export default RouteTrace;
