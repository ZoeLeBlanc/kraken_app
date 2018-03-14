import React from 'react';
import * as d3 from 'd3';
import PropTypes from 'prop-types';
import '../../../assets/styles/App.css';

export default class Nodes extends React.Component {
    constructor(props) {
        super(props);
    }
    componentDidMount() {
        this.svg = d3.selectAll('.nodes');
        this.node = this.svg.selectAll('.node')
            .data(this.props.nodes)
            .enter().append('g')
            .attr('class', 'node');

        this.node.append('circle')
            .attr('r', 18)
            .on('mouseover', (d) => this.props.fade(0.1, d))
            .on('mouseout', (d) => this.props.fade(1, d))
            .call(d3.drag()
                .on('start', d => this.props.onDragStart(d))
                .on('drag', d => this.props.onDrag(d))
                .on('end', d => this.props.onDragEnd(d)));
    }
    componentWillReceiveProps(nextProps) {
        this.setState({nodes: nextProps.nodes, fade: nextProps.fade});
    }
    componentDidUpdate() {
        this.svg = d3.selectAll('.nodes');
        this.node = this.svg.selectAll('.node')
            .data(this.props.nodes)
            .enter().append('g')
            .attr('class', 'node');

        this.node.append('circle')
            .attr('r', this.props.radius - 0.75)
            .on('mouseover', (d) => this.props.fade(0.1, d))
            .on('mouseout', (d) => this.props.fade(1, d))
            .call(d3.drag()
                .on('start', d => this.props.onDragStart(d))
                .on('drag', d => this.props.onDrag(d))
                .on('end', d => this.props.onDragEnd(d)));
    }
    render() {
        return (
            <g className="nodes" />
        );
    }
}
Nodes.propTypes = {
    nodes: PropTypes.array,
    onDragStart: PropTypes.func,
    onDrag: PropTypes.func,
    onDragEnd: PropTypes.func,
    fade: PropTypes.func,
    radius: PropTypes.number,
};
