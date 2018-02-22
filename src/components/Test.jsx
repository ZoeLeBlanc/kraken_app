import React from 'react';

import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import { fetchGraphIfNeeded } from '../actions/graphActions';
import FinalD3Graph from '../containers/FinalD3Graph';


export class Test extends React.Component {
    constructor(props) {
        super(props);
    }
    componentDidMount() {
        this.props.getGraph();
    }
    renderGraph() {
        const {graph} = this.props;
        console.log(graph);
        const g = graph === undefined ? {} : graph;
        console.log(g.nodes, g.edges);
        return (
            <div>
                <FinalD3Graph nodes={g.nodes} links= {g.edges} height={400} width={900} />
            </div>
        );
    }
    render() {
        const { graph } = this.props;
        console.log(graph.length);
        return (
            <div>
                { Object.keys(graph).length === 0 ?
                    <h2>Loading</h2> :
                    this.renderGraph()
                }
            </div>
        );
    }
}
Test.propTypes = {
    graph: PropTypes.object,
    getGraph: PropTypes.func,
    isFetching: PropTypes.bool
};

const mapStateToProps = (state) => {
    const { graphReducer } = state;
    const {
        isFetching,
        graph
    } = graphReducer;

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
)(Test);
