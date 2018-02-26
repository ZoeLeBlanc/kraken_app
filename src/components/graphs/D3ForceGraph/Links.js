import React from 'react';
import PropTypes from 'prop-types';
import * as d3 from 'd3';
import '../../../assets/styles/App.css';
export default class Links extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.svg = d3.selectAll('.links');
        this.svg
            .selectAll('line')
            .data(this.props.links)
            .enter().append('line')
            .attr('class', 'link')
            .attr('marker-end', 'url(#end-arrow)')
            .on('mouseout', (d) => this.props.fade(1, d));
    }
    render() {
        return (
            <g className="links" />
        );
    }
}
Links.propTypes = {
    links: PropTypes.array,
    fade: PropTypes.func,
};
