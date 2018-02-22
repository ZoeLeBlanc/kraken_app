import React from 'react';
import PropTypes from 'prop-types';
import * as d3 from 'd3';

export default class LinkLabels extends React.Component {
    componentDidMount() {
        this.svg = d3.selectAll('.linkLabels');
        this.svg.selectAll('text')
            .data(this.props.links)
            .enter().append('text')
            .attr('class', 'linkLabel')
            .attr('fill', 'red')
            .text(d => d.type);
    }

    render() {
        return (
            <g className="linkLabels"/>
        );
    }
}

LinkLabels.propTypes = {
    links: PropTypes.array,
};
