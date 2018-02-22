export const LOAD_GRAPH = 'LOAD_GRAPH';
export const REQUEST_GRAPH = 'REQUEST_GRAPH';

export const loadGraph = (json) => ({
    type: 'LOAD_GRAPH',
    graph: json
});

export const requestGraph = () => ({
    type: 'REQUEST_GRAPH'
});

// const shouldFetchGraph = (state) => {
//     const { graphReducer } = state;
//     const graph = graphReducer.graph;
//     const isFetching = graphReducer.isFetching;
//     console.log(graph.length);
//     if (graph.length === undefined) {
//         return true;
//     }
//     if (isFetching) {
//         return false;
//     }
//     return (null);
// };

const getGraph = (dispatch) => {
    dispatch(requestGraph());
    return fetch('http://localhost:7082/api/get_graph')
        .then(response => response.json()
            .catch(err => {
                return err;
            })
            .then(json => {
                console.log(json);
                dispatch(loadGraph(json));
            })
        );
};
export const fetchGraphIfNeeded = () => {
    return (dispatch) => {
        return getGraph(dispatch);
    };
};
