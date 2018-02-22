import React from 'react';
import PropTypes from 'prop-types';
import * as d3 from 'd3';

export default class NodeLabels extends React.Component {
    componentDidMount() {
        this.svg = d3.selectAll('.labels');
        this.svg.selectAll('text')
            .data(this.props.nodes)
            .enter().append('text')
            .attr('class', 'label')
            .attr('dx', d=> d.r)
            .attr('dy', '.35em')
            .text(d => d.label + ' ' + d.name);
    }

    render() {
        return (
            <g className="labels"/>
        );
    }
}

NodeLabels.propTypes = {
    nodes: PropTypes.array,
};
