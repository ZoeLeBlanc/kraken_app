import React from 'react';
import * as d3 from 'd3';
import * as d3Drag from 'd3-drag';
import * as d3Force from 'd3-force';
// import * as d3Scale from 'd3-scale';
import * as d3Selection from 'd3-selection';
import PropTypes from 'prop-types';
import _ from 'lodash';
// *****************************************************
// ** d3 functions to manipulate attributes
// *****************************************************

// const colors = d3Scale.scaleOrdinal(d3Scale.schemeCategory10);
const simulation = d3Force.forceSimulation();
class UpdatedD3Graph extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        simulation
            .force('collide', d3Force.forceCollide(d => 2 * d.size))
            .force('charge', d3Force.forceManyBody(-100))
            .force('center', d3Force.forceCenter(this.props.width / 2, this.props.height / 2));
        this.container = d3Selection.select(this.refs.container)
            .attr('height', this.props.height)
            .attr('width', this.props.width);

        this.container.append('defs').append('markers')
    		    .attr('id', 'arrowhead')
    		    .attr('viewbox', '-0 -5 10 10')
        		.attr('refX', 13)
        		.attr('refY', 0)
        		.attr('orient', 'auto')
        		.attr('markerWidth', 13)
        		.attr('markerHeight', 13)
        		.attr('xoverflow', 'visible')
      			.append('svg:path')
        		.attr('d', 'M 0,-5 L 10 ,0 L 0,5')
            .attr('fill', '#999')
            .style('stroke', 'none');
        this.calculateData();
        this.renderLinks();
        this.renderNodes();
    }

    calculateData() {
        const {nodes, links} = this.props;
        simulation.nodes(nodes)
            .force('link', d3Force.forceLink(links).id(d => d.id).distance(this.props.linkDistance));
        _.times(2000, () => simulation.tick());
        this.nodes = nodes;
        this.links = links;
    }

    dragstarted(d) {
        console.log(!d3.event.active);
        if (!d3.event.active) {
            simulation.alphaTarget(0.3).restart();
        }
        d.fx = d.x;
        d.fy = d.y;
    }

    dragged(d) {
        console.log(d3.event);
        d.fx = d3.event.x;
        d.fy = d3.event.y;
    }
    dragend(d) {
        if (!d3.event.active) {
            simulation.alphaTarget(0);
        }
        d.fx = null;
        d.fy = null;
    }
    renderNodes() {
        this.circles = this.container.selectAll('.node')
            .data(this.props.nodes);
        this.circles = this.circles.enter()
            .append('g')
            .classed('node', true)
            .merge(this.circles)
            .attr('transform', (d) => {return 'translate(' + d.x + ', ' + d.y + ')';});

        this.circles
            .call(d3Drag.drag()
                .on('start', (d) => this.dragstarted(d))
                .on('drag', (d) => this.dragged(d))
                .on('end', (d) => this.dragend(d))
            );

        this.circles.append('circle')
        	  .attr('r', 5)
        	  .attr('fill', '#000')
            .attr('opacity', '1');

        this.circles.append('title')
            .text(d =>d.id);

        this.circles.append('text')
            .attr('dy', -3)
         		.attr('fill', '#000')
         		.attr('font-size', '2em')
            .text( d =>  d.name + ':' + d.label);
    }

    renderLinks() {
        this.lines = this.container.selectAll('.link')
            .data(this.props.links, d => d.key);

        this.lines.exit().remove();
        this.lines = this.lines.enter().append('line')
            .classed('link', true);
        this.lines
            .merge(this.lines)
    	      .attr('marker-end', 'url(#arrowhead)');

        this.lines
            .attr('x1', (d) => {
                console.log(d);
                return d.source.x;
            })
            .attr('y1', d => d.source.y)
            .attr('x2', d => d.target.x)
            .attr('y2', d => d.target.y)
            .attr('stroke', '#999')
            .attr('stroke-opacity', '.6')
            .attr('stroke-width', '1px');

        this.lines.append('title')
            .text(d => d.type);

        this.edgepaths = this.container.selectAll('.edgepath')
            .data(this.links, d => d.key);

        this.edgepaths = this.edgepaths.enter().append('path')
            .classed('edgepath', true)
            .merge(this.edgepaths)
            .attr('d', d => {
                return 'M ' + d.source.x + ' ' + d.source.y + ' L ' + d.target.x + ' ' + d.target.y;
            });
        this.edgepaths
            .attr('fill-opacity', 0)
            .attr('stroke-opacity', 0)
            .attr('id', (d, i) => 'edgepath' + i)
            .style('pointer-events', 'none');

        this.edgelabels = this.container.selectAll('.edgelabel')
            .data(this.links, d => d.key);

        this.edgelabels = this.edgelabels.enter().append('text')
        		.classed('edgelabel', true)
        		.merge(this.edgelabels);

        this.edgelabels.enter()
        		.style('pointer-events', 'none')
        		.attr('id', (d, i) => 'edgelabel' + i)
        		.attr('font-size', 10)
        		.attr('fill', '#aaa')
        		.attr('transform', (d) => {
                if (d.target.x < d.source.x) {
                  	console.log(d, this);
                    const bbox = this.getBBox();
    								console.log(bbox);
                    const rx = bbox.x + bbox.width / 2;
                    const ry = bbox.y + bbox.height / 2;
                    return 'rotate(180 ' + rx + ' ' + ry + ')';
                }
                return 'rotate(0)';
            });

        this.edgelabels.append('textPath')
            .attr('xlink:href', (d, i) => '#edgepath' + i)
            .style('text-anchor', 'middle')
            .style('pointer-events', 'none')
            .attr('startOffset', '50%')
            .text(d => d.type);
    }

    render() {
        return (
            <svg ref="container" />
        );
    }
}

UpdatedD3Graph.defaultProps = {
    width: 900,
    height: 400,
    linkDistance: 100,
    forceStrength: -20
};
UpdatedD3Graph.propTypes = {
    nodes: PropTypes.array,
    links: PropTypes.array,
    forceStrength: PropTypes.number,
    linkDistance: PropTypes.number,
    width: PropTypes.number,
    height: PropTypes.number,
    version: PropTypes.number,
};

export default UpdatedD3Graph;
