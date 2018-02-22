import React from 'react';
import * as d3 from 'd3';
// import * as d3Drag from 'd3-drag';
// import * as d3Force from 'd3-force';
// import * as d3Scale from 'd3-scale';
// import * as d3Selection from 'd3-selection';
import PropTypes from 'prop-types';

import '../assets/styles/App.css';
// *****************************************************
// ** d3 functions to manipulate attributes
// *****************************************************

// const colors = d3Scale.scaleOrdinal(d3Scale.schemeCategory10);
class UpdatedD3Graph extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.sim(this.props);
        this.setup(this.props);
        this.runSim(this.props);
    }

    shouldComponentUpdate(nextProps) {
    // clearly you'd want a differnet conditional, but this works for now
        return nextProps.nodes.length !== this.props.nodes.length;
    }

    componentWillUpdate(nextProps) {
        this.simulation.stop();
        d3.selectAll('g').remove();
        this.sim(nextProps);
        this.setup(nextProps);
        this.runSim(nextProps);
    }

    componentWillUnmount() {
        this.simulation.stop();
    }
    dragstarted(d) {
        if (!d3.event.active) {
            this.simulation.alphaTarget(0.3).restart();
        }
        d.fx = d.x;
        d.fy = d.y;
    }

    dragged(d) {
        d.fx = d3.event.x;
        d.fy = d3.event.y;
    }
    dragend(d) {
        if (!d3.event.active) {
            this.simulation.alphaTarget(0);
        }
        d.fx = d.x;
        d.fy = d.y;
    }

    sim(data) {
        this.simulation = d3.forceSimulation(data.nodes)
            .force('charge',
                d3.forceManyBody().strength(-2000)
            )
            .force('link', d3.forceLink().id(d => d.id))
            .force('collide', d3.forceCollide(18).iterations(16) )
            .force('center', d3.forceCenter(data.width / 2, data.height / 2))
            .force('y', d3.forceY(0))
            .force('x', d3.forceX(0));
    }
    runSim(data) {
        console.log(this.simulation);
        this.simulation
            .nodes(data.nodes)
            .on('tick', this.ticked);

        this.simulation
            .force('link')
            .links(data.links);

        const svg = d3.selectAll('svg');
        d3.zoom()
            .on('zoom', () => this.zoomActions(svg));
    }
    setup(data) {
        const svg = d3.selectAll('svg');
        this.link = svg.append('g')
            .attr('class', 'links')
            .selectAll('line')
            .data(data.links)
            .enter()
            .append('line')
            .attr('stroke', 'black');

        this.linkT = svg.append('g')
            .selectAll('text')
            .data(data.links)
            .enter()
            .append('text')
            .attr('class', 'linkLabels')
            .attr('fill', 'red')
            .text(d => d.type);

        this.node = svg.append('g')
            .attr('class', 'nodes')
            .selectAll('circle')
            .data(data.nodes)
            .enter()
            .append('circle')
            .attr('r', 5)
            .call(d3.drag()
                .on('start', d=>this.dragstarted(d))
                .on('drag', d=>this.dragged(d))
                .on('end', d=>this.dragend(d)));

        this.nodeT = svg.append('g')
            .selectAll('text')
            .data(data.nodes)
            .enter().append('text')
            .attr('class', 'labels')
            .attr('dx', d=> d.r)
            .attr('dy', '.35em')
            .text(d => d.label + ' ' + d.name);
    }

    ticked() {
        const link = d3.selectAll('line');
        link.attr('x1', d => d.source.x)
            .attr('y1', d => d.source.y)
            .attr('x2', d => d.target.x)
            .attr('y2', d => d.target.y);

        link.exit().remove();

        const linkT = d3.selectAll('.linkLabels');
        linkT
            .attr('x', d => (d.source.x + d.target.x) / 2 )
            .attr('y', d => (d.source.y + d.target.y) / 2 );

        const node = d3.selectAll('circle');
        node
            .attr('cx', d => d.x)
            .attr('cy', d => d.y);

        const nodeT = d3.selectAll('.labels');
        nodeT
            .attr('x', d => d.x)
            .attr('y', d => d.y);
    }
    zoomActions(g) {
        g.attr('transform', d3.event.transform);
    }
    render() {
        return (
            <svg width={this.props.width} height={this.props.height}  />
        );
    }
}

UpdatedD3Graph.defaultProps = {
    width: 1500,
    height: 700,
    forceStrength: -100,
    linkDistance: 100,
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
