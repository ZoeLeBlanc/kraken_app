import * as React from 'react';
import * as d3 from 'd3';
import Links from './links';
import Nodes from './nodes';
import NodeLabels from './NodeLabels';
import LinkLabels from './LinkLabels';
import PropTypes from 'prop-types';

export default class D3ForceGraph extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.sim(this.props);
        this.runSim(this.props);
    }
    componentWillReceiveProps(nextProps) {
        this.setState({nodes: nextProps.nodes, links: nextProps.links});
    }
    shouldComponentUpdate(nextProps) {
        return (nextProps.nodes.length !== this.props.nodes.length || nextProps.links.length !== this.props.links.length);
    }

    componentWillUpdate(nextProps) {
        this.simulation.stop();
        d3.selectAll('g').remove();
        this.sim(nextProps);
        this.runSim(nextProps);
    }

    componentWillUnmount() {
        this.simulation.stop();
    }
    sim(data) {
        this.simulation = d3.forceSimulation(data.nodes)
            .force('charge',
                d3.forceManyBody()
                    .strength(data.forceStrength)
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
    }
    ticked() {
        const link = d3.selectAll('line');
        link.attr('x1', d => d.source.x)
            .attr('y1', d => d.source.y)
            .attr('x2', d => d.target.x)
            .attr('y2', d => d.target.y);

        link.exit().remove();

        const linkT = d3.selectAll('.linkLabel');
        linkT
            .attr('x', d => (d.source.x + d.target.x) / 2 )
            .attr('y', d => (d.source.y + d.target.y) / 2 );

        const node = d3.selectAll('circle');
        node
            .attr('cx', d => d.x)
            .attr('cy', d => d.y);

        const nodeT = d3.selectAll('.label');
        nodeT
            .attr('x', d => d.x)
            .attr('y', d => d.y);
    }
    onDragStart(d: any) {
        if (!d3.event.active) {
            this.simulation.alphaTarget(0.3).restart();
        }
        d.fx = d.x;
        d.fy = d.y;
    }
    onDrag(d: any) {
        d.fx = d3.event.x;
        d.fy = d3.event.y;
    }
    onDragEnd(d: any) {
        if (!d3.event.active) {
            this.simulation.alphaTarget(0);
        }
        d.fx = d.x;
        d.fy = d.y;
    }
    render() {
        const { width, height, nodes, links } = this.props;
        return (
            <svg className="container"
                width={width} height={height}>
                <Links links={links} />
                <LinkLabels links={links} />
                <Nodes nodes={nodes} onDragStart={(d)=>this.onDragStart(d)} onDrag={(d) =>this.onDrag(d)} onDragEnd={(d)=>this.onDragEnd(d)} />
                <NodeLabels nodes={nodes} />
            </svg>
        );
    }
}

D3ForceGraph.propTypes = {
    nodes: PropTypes.array,
    links: PropTypes.array,
    width: PropTypes.number,
    height: PropTypes.number,
    forceStrength: PropTypes.number,
};
