import * as React from 'react';
import * as d3 from 'd3';
import Links from './links';
import Nodes from './nodes';
import NodeLabels from './NodeLabels';
import LinkLabels from './LinkLabels';
import PropTypes from 'prop-types';
import { FormGroup, FormControlLabel } from 'material-ui/Form';
import Switch from 'material-ui/Switch';
// import Typography from 'material-ui/Typography';
import Paper from 'material-ui/Paper';
import '../../../assets/styles/App.css';

export default class D3ForceGraph extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.sim(this.props);
        this.runSim(this.props);
    }
    componentWillReceiveProps(nextProps) {
        this.setState({links: nextProps.links, nodes: nextProps.nodes, zoom: nextProps.zoom});
    }
    shouldComponentUpdate(nextProps) {
        return (nextProps.zoom !== this.props.zoom);
    }

    componentDidUpdate(nextProps) {
        d3.selectAll('defs').remove();
        this.simulation.stop();
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
            .on('tick', () => this.ticked(data));

        this.simulation
            .force('link')
            .links(data.links);

        this.linkedByIndex = {};
        data.links.forEach(d => {
            this.linkedByIndex[`${d.source.index},${d.target.index}`] = 1;
        });
        d3.selectAll('svg')
            .append('svg:defs').selectAll('marker')
            .data([{ id: 'end-arrow', opacity: 1 }, { id: 'end-arrow-fade', opacity: 0.1 }])
            .enter().append('marker')
            .attr('id', d => d.id)
            .attr('viewBox', '0 0 10 10')
            .attr('refX', 2 + 18)
            .attr('refY', 5)
            .attr('markerWidth', 4)
            .attr('markerHeight', 4)
            .attr('orient', 'auto')
            .append('svg:path')
            .attr('d', 'M0,0 L0,10 L10,5 z')
            .style('opacity', d => d.opacity);

        this.props.zoom === true ?
            d3.selectAll('svg')
                .append('rect')
                .attr('width', this.props.width)
                .attr('height', this.props.height)
                .style('fill', 'none')
                .style('pointer-events', 'all')
                .call(d3.zoom()
                    .scaleExtent([1 / 2, 4])
                    .on('zoom', () => this.zoomActions())) : d3.selectAll('rect').remove();
    }
    ticked(data) {
        const link = d3.selectAll('line');
        link.attr('x1', d => d.source.x)
            .attr('y1', d => d.source.y)
            .attr('x2', d => d.target.x)
            .attr('y2', d => d.target.y);

        link.exit().remove();

        const linkLabel = d3.selectAll('.linkLabel');
        linkLabel
            .attr('x', d => (d.source.x + d.target.x) / 2 )
            .attr('y', d => (d.source.y + d.target.y) / 2 );

        const node = d3.selectAll('.node');
        node
            .attr('transform', d => {
                d.x = Math.max(data.radius, Math.min(data.width - data.radius, d.x));
                d.y = Math.max(data.radius, Math.min(data.height - data.radius, d.y));
                return `translate(${d.x},${d.y})`;
            });

        const nodeLabel = d3.selectAll('.nodeLabel');
        nodeLabel
            .attr('x', d => d.x)
            .attr('y', d => d.y);
    }
    fade(opacity, d) {
        const node = d3.selectAll('.node');
        node.style('stroke-opacity', (o) => this.isConnected(d, o) ? 1 : opacity);
        node.attr('fill-opacity', (o) => this.isConnected(d, o) ? 1 : opacity);
        const nodeLabel = d3.selectAll('.nodeLabel');
        nodeLabel.style('opacity', (o) => this.isConnected(d, o) ? 1 : opacity);
        const link = d3.selectAll('.link');
        link.style('stroke-opacity', o => (o.source === d || o.target === d ? 1 : opacity));
        link.attr('marker-end', o => (opacity === 1 || o.source === d || o.target === d ? 'url(#end-arrow)' : 'url(#end-arrow-fade)'));
        const linkLabel = d3.selectAll('.linkLabel');
        linkLabel.style('opacity', o => (o.source === d || o.target === d ? 1 : opacity));
    }
    isConnected(a, b) {
        return this.linkedByIndex[`${a.index},${b.index}`] || this.linkedByIndex[`${b.index},${a.index}`] || a.index === b.index;
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
    zoomActions() {
        d3.selectAll('svg')
            .attr('transform', d3.event.transform);
    }
    render() {
        const { width, height, nodes, links, classes, switchChange, zoom, radius } = this.props;
        return (
            <Paper className={classes.paper}>
                <FormGroup row>
                    <FormControlLabel
                        label="Hover Graph"
                        control={
                            <Switch
                                checked={zoom}
                                onChange={(e) => switchChange('zoom', e)}
                                value="zoom"
                                color="primary"
                            />
                        }
                        label="Zoom Graph"
                    />
                </FormGroup>
                <svg className="container" width={width} height={height}>
                    <g className="everything">
                        <Links links={links} fade={(o, d) => this.fade(o, d)} />
                        <LinkLabels links={links} fade={(o, d) => this.fade(o, d)} />
                        <Nodes radius={radius} nodes={nodes} onDragStart={(d)=>this.onDragStart(d)} onDrag={(d) =>this.onDrag(d)} onDragEnd={(d)=>this.onDragEnd(d)} fade={(o, d) => this.fade(o, d)} />
                        <NodeLabels nodes={nodes} />
                    </g>
                </svg>
            </Paper>
        );
    }
}
D3ForceGraph.defaultProps = {
    width: 1500,
    height: 700,
    forceStrength: -1000,
    linkDistance: 200,
};
D3ForceGraph.propTypes = {
    nodes: PropTypes.array,
    links: PropTypes.array,
    width: PropTypes.number,
    height: PropTypes.number,
    forceStrength: PropTypes.number,
    zoom: PropTypes.bool,
    linkDistance: PropTypes.number,
    radius: PropTypes.number,
    classes: PropTypes.object,
    switchChange: PropTypes.func,
};
