import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import { fetchGraphIfNeeded } from '../actions/graphActions';
import {Sigma, EdgeShapes, RelativeSize, RandomizeNodePositions} from 'react-sigma';
import ForceLink from 'react-sigma/lib/ForceLink';

export class GraphTest extends React.Component {
    constructor(props) {
        super(props);
    }
    componentDidMount() {
        this.props.getGraph();
    }
    renderGraph() {
        const {graph} = this.props;
        const g = graph === undefined ? {} : graph;
        return (
            <Sigma renderer="canvas" graph={g} style={{
                maxWidth: 'inherit',
                height: '50vh'
            }} settings={{
                drawEdges: true,
                drawEdgeLabels: true,
                enableEdgeHovering: true,
                edgeHoverExtremities: true,
                minEdgeSize: 0.5,
            }}>
                <EdgeShapes default="arrow"/>
                <RandomizeNodePositions>
                    <ForceLink
                        iterationsPerRender={1}
                        background
                        easing="cubicInOut"
                        timeout={1000}
                    />
                    <RelativeSize initialSize={15} />
                </RandomizeNodePositions>
            </Sigma>
        );
    }
    render() {
        const { isFetching } = this.props;
        return (
            <div>
                {isFetching ?
                    <h2>Loading</h2> : this.renderGraph()
                }
            </div>
        );
    }
}
GraphTest.propTypes = {
    graph: PropTypes.object,
    getGraph: PropTypes.func,
    isFetching: PropTypes.bool
};

const mapStateToProps = (state) => {
    const { graphReducer } = state;
    const {
        isFetching,
        graph
    } = graphReducer || {
        isFetching: false,
        graph: {}
    };

    return {
        graph,
        isFetching,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        getGraph: () => {
            dispatch(fetchGraphIfNeeded());
        }
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(GraphTest);
