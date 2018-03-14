import React from 'react';
import PropTypes from 'prop-types';
import * as d3 from 'd3';
import '../../../assets/styles/App.css';

export default class LinkLabels extends React.Component {
    constructor(props) {
        super(props);
    }
    componentDidMount() {
        this.svg = d3.selectAll('.linkLabels');
        this.svg.selectAll('text')
            .data(this.props.links)
            .enter().append('text')
            .attr('class', 'linkLabel')
            .attr('fill', 'grey')
            .text(d => d.type.split('_').join(' ').toLowerCase());
    }

    render() {
        return (
            <g className="linkLabels"/>
        );
    }
}

LinkLabels.propTypes = {
    links: PropTypes.array,
    fade: PropTypes.func,
};
