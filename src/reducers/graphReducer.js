import { LOAD_GRAPH, REQUEST_GRAPH } from '../actions/graphActions';

const graphReducer = (state = {
    isFetching: false,
    graph: {}
}, action) => {
    switch (action.type) {
        case REQUEST_GRAPH:
            return {
                ...state,
                isFetching: true
            };
        case LOAD_GRAPH:
            return {
                ...state,
                isFetching: true,
                graph: action.graph,
            };
        default:
            return state;
    }
};
export default graphReducer;
