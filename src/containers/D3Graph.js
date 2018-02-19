import React from 'react';
import * as d3Force from 'd3-force';
import PropTypes from 'prop-types';

// *****************************************************
// ** d3 functions to manipulate attributes
// *****************************************************

class D3Graph extends React.Component {
    constructor(props) {
  	    super(props);
        this.state = {
    	      nodes: props.nodes,
            links: props.links
        };
    }

    componentDidMount() {
        console.log(d3Force);
        this.force = d3Force.forceSimulation(this.state.nodes)
            .force('charge',
                d3Force.forceManyBody()
                    .strength(this.props.forceStrength)
            )
            .force('link',
                d3Force.forceLink().distance(this.props.linkDistance).links(this.state.links)
            )
            .force('x', d3Force.forceX(this.props.width / 2))
            .force('y', d3Force.forceY(this.props.height / 2));

        this.force.on('tick', () => this.setState({
    	       links: this.state.links,
    	       nodes: this.state.nodes
        }));
    }

    componentWillUnmount() {
        this.force.stop();
    }

	   render() {
        return (
    	       <svg width={this.props.width} height={this.props.height}>
      	     {this.state.links.map((link, index) =>(
                    <line
                        x1={link.source.x}
                        y1={link.source.y}
                        x2={link.target.x}
                        y2={link.target.y}
                        key={`line-${index}`}
                        stroke="black" />
                ))}
      	      {this.state.nodes.map((node, index) =>(
        	         <circle r={node.r} cx={node.x} cy={node.y} fill="red" key={index}/>
                ))}
            </svg>
        );
    }
}

D3Graph.defaultProps = {
    width: 300,
    height: 300,
    linkDistance: 30,
    forceStrength: -20
};
D3Graph.propTypes = {
    nodes: PropTypes.array,
    links: PropTypes.array,
    forceStrength: PropTypes.number,
    linkDistance: PropTypes.number,
    width: PropTypes.number,
    height: PropTypes.number,
};

export default D3Graph;
