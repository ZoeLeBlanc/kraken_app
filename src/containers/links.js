import React from 'react';
import PropTypes from 'prop-types';
// import Link from './link';
import * as d3 from 'd3';

export default class Links extends React.Component {
    componentDidMount() {
        this.svg = d3.selectAll('.links');
        this.svg
            .selectAll('line')
            .data(this.props.links)
            .enter().append('line')
            .attr('stroke-width', '2px')
            .attr('stroke', 'black');
    }

    render() {
        return (
            <g className="links" />
        );
    }
}
Links.propTypes = {
    links: PropTypes.array,
};
