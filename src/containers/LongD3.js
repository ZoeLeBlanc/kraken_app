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
    componentWillReceiveProps(nextProps) {
        this.setState({nodes: nextProps.nodes, links: nextProps.links, zoom: nextProps.zoom});
    }
    shouldComponentUpdate(nextProps) {
    // clearly you'd want a differnet conditional, but this works for now
        return (nextProps.nodes.length !== this.props.nodes.length || nextProps.zoom !== this.props.zoom);
    }

    componentDidUpdate(nextProps) {
        console.log(nextProps);
        this.simulation.stop();
        d3.selectAll('defs').remove();
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
        this.simulation
            .nodes(data.nodes)
            .on('tick', this.ticked);

        this.simulation
            .force('link')
            .links(data.links);

        this.linkedByIndex = {};
        data.links.forEach(d => {
            this.linkedByIndex[`${d.source.index},${d.target.index}`] = 1;
        });
    }

    setup(data) {
        d3.selectAll('svg')
            .append('svg:defs').selectAll('marker')
            .data([{ id: 'end-arrow', opacity: 1 }, { id: 'end-arrow-fade', opacity: 0.1 }])
            .enter().append('marker')
            .attr('id', d => d.id)
            .attr('viewBox', '0 0 10 10')
            .attr('refX', 2 + 18)
            .attr('refY', 5)
            .attr('markerWidth', 4)
            .attr('markerHeight', 4)
            .attr('orient', 'auto')
            .append('svg:path')
            .attr('d', 'M0,0 L0,10 L10,5 z')
            .style('opacity', d => d.opacity);

        this.svg = d3.selectAll('svg')
            .append('g')
            .attr('class', 'everything');
        this.link = this.svg.append('g')
            .attr('class', 'links')
            .selectAll('line')
            .data(data.links)
            .enter()
            .append('line')
            .attr('class', 'link')
            .attr('marker-end', 'url(#end-arrow)')
            .on('mouseout', (d) => this.fade(1, d));

        this.linkT = this.svg.append('g')
            .selectAll('text')
            .data(data.links)
            .enter()
            .append('text')
            .attr('class', 'linkLabels')
            .attr('fill', 'red')
            .text(d => d.type);

        this.node = this.svg.append('g')
            .attr('class', 'nodes')
            .selectAll('.node')
            .data(data.nodes)
            .enter()
            .append('g')
            .attr('class', 'node');

        this.node.append('circle')
            .attr('r', 18)
            .on('mouseover', (d) => this.fade(0.1, d))
            .on('mouseout', (d) => this.fade(1, d))
            .call(d3.drag()
                .on('start', d=>this.dragstarted(d))
                .on('drag', d=>this.dragged(d))
                .on('end', d=>this.dragend(d)));

        this.nodeT = this.svg.append('g')
            .selectAll('text')
            .data(data.nodes)
            .enter().append('text')
            .attr('class', 'labels')
            .attr('dx', d=> d.r)
            .attr('dy', '.35em')
            .text(d => d.label + ' ' + d.name);
        this.props.zoom === true ?
            d3.selectAll('svg')
                .append('rect')
                .attr('width', this.props.width)
                .attr('height', this.props.height)
                .style('fill', 'none')
                .style('pointer-events', 'all')
                .call(d3.zoom()
                    .scaleExtent([1 / 2, 4])
                    .on('zoom', () => {
                        console.log('zoom');
                        return this.zoomActions();
                    })) : d3.selectAll('rect').remove();
    }
    fade(opacity, d) {
        const node = d3.selectAll('.node');
        node.style('stroke-opacity', (o) => this.isConnected(d, o) ? 1 : opacity);
        node.attr('fill-opacity', (o) => this.isConnected(d, o) ? 1 : opacity);
        const link = d3.selectAll('.link');
        link.style('stroke-opacity', o => (o.source === d || o.target === d ? 1 : opacity));
        link.attr('marker-end', o => (opacity === 1 || o.source === d || o.target === d ? 'url(#end-arrow)' : 'url(#end-arrow-fade)'));
    }
    isConnected(a, b) {
        return this.linkedByIndex[`${a.index},${b.index}`] || this.linkedByIndex[`${b.index},${a.index}`] || a.index === b.index;
    }
    ticked() {
        const link = d3.selectAll('.link');
        link.attr('x1', d => d.source.x)
            .attr('y1', d => d.source.y)
            .attr('x2', d => d.target.x)
            .attr('y2', d => d.target.y);

        link.exit().remove();

        const linkT = d3.selectAll('.linkLabels');
        linkT
            .attr('x', d => (d.source.x + d.target.x) / 2 )
            .attr('y', d => (d.source.y + d.target.y) / 2 );

        const node = d3.selectAll('.node');
        node
            // .attr('cx', d => d.x)
            // .attr('cy', d => d.y);
            .attr('transform', d => `translate(${d.x},${d.y})`);

        const nodeT = d3.selectAll('.labels');
        nodeT
            .attr('x', d => d.x)
            .attr('y', d => d.y);
    }
    zoomActions() {
        console.log(this.svg);
        this.svg.attr('transform', d3.event.transform);
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
    zoom: PropTypes.bool,
};

export default UpdatedD3Graph;
