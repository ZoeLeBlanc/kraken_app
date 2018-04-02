import React from 'react';
import * as d3 from 'd3';
// import * as d3Drag from 'd3-drag';
// import * as d3Force from 'd3-force';
// import * as d3Scale from 'd3-scale';
// import * as d3Selection from 'd3-selection';
import PropTypes from 'prop-types';

import '../assets/styles/App.css';
//

class MatrixD3 extends React.Component {
    constructor(props) {
        super(props);
    }
    componentWillReceiveProps(nextProps) {
        this.setState({nodes: nextProps.nodes, links: nextProps.links});
    }
    shouldComponentUpdate(nextProps) {
    // clearly you'd want a differnet conditional, but this works for now
        return (nextProps.nodes.length !== this.props.nodes.length );
    }
}
MatrixD3.defaultProps = {
    width: 1500,
    height: 700,
    forceStrength: -100,
    linkDistance: 100,
};
MatrixD3.propTypes = {
    nodes: PropTypes.array,
    links: PropTypes.array,
    forceStrength: PropTypes.number,
    linkDistance: PropTypes.number,
    width: PropTypes.number,
    height: PropTypes.number,
    zoom: PropTypes.bool,
};

export default MatrixD3;
