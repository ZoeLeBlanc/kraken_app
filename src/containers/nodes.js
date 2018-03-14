import React from 'react';
import * as d3 from 'd3';
import PropTypes from 'prop-types';
// import Node from './node';

export default class Nodes extends React.Component {
    componentDidMount() {
        this.svg = d3.selectAll('.nodes');
        this.svg.selectAll('circle')
            .data(this.props.nodes)
            .enter().append('circle')
            .attr('r', 5)
            .attr('fill', '#000')
            .call(d3.drag()
                .on('start', d => this.props.onDragStart(d))
                .on('drag', d => this.props.onDrag(d))
                .on('end', d => this.props.onDragEnd(d)));
    }

    render() {
        return (
            <g className="nodes"/>
        );
    }
}
Nodes.propTypes = {
    nodes: PropTypes.array,
    onDragStart: PropTypes.func,
    onDrag: PropTypes.func,
    onDragEnd: PropTypes.func,
};
