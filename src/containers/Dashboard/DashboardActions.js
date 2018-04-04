export const LOAD_CSV_OPTIONS = 'LOAD_CSV_OPTIONS';
export const SAVING_CSV = 'SAVING_CSV';

export const LOAD_GRAPH = 'LOAD_GRAPH';
export const REQUEST_GRAPH = 'REQUEST_GRAPH';

export const LOAD_FILES = 'LOAD_FILES';

export const SELECTED_EDGES = 'SELECTED_EDGES';

export const SELECTED_NODES = 'SELECTED_NODES';

export const selectedEdges = (edges) => ({
   type: 'SELECTED_EDGES',
   edges
});

export const selectedNodes = (nodes) => ({
   type: 'SELECTED_NODES',
   nodes
});

export const loadFiles = (uploaded_files) => ({
   type: 'LOAD_FILES',
   uploaded_files
});

export const loadCSVOptions = (json) => ({
    type: 'LOAD_CSV_OPTIONS',
    graph: json
});

export const savingCSV = () => ({
    type: 'SAVING_CSV'
});
export const saveCSV = (file) => {
    return (dispatch) => {
        dispatch(savingCSV());
        const formData = new FormData();

        formData.append('file', file);
        formData.forEach((value, key) => {
            console.log(key + ' ' + value);
        });
        return fetch('http://localhost:7082/api/load_csv', {
            method: 'POST',
            body: formData
        }).then((response) => {
            response.json()
                .catch(err => {
                    return err;
                })
                .then(json => {
                    dispatch(loadCSVOptions(json));
                });
        });
    };
};


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

export const getCols = (file) => {
    return (dispatch) => {
        dispatch(gettingCold());
        const formData = new FormData();

        formData.append('file', file);
        formData.forEach((value, key) => {
            console.log(key + ' ' + value);
        });
        return fetch('http://localhost:7082/api/network/get_columns', {
            method: 'POST',
            body: formData
        }).then((response) => {
            response.json()
                .catch(err => {
                    return err;
                })
                .then(json => {
                    dispatch(loadCols(json));
                });
        });
    };
};

export const createNetworkEdges = (nodes, edges, index) => {
    return (dispatch) => {
        dispatch(creatingNetwork());
        const formData = new FormData();

        formData.append('file', nodes);
        formData.append('file', edges);
        formData.append('index', index);
        formData.forEach((value, key) => {
            console.log(key + ' ' + value);
        });
        return fetch('http://localhost:7082/api/network/create_network_nodes_edges', {
            method: 'POST',
            body: formData
        }).then((response) => {
            response.json()
                .catch(err => {
                    return err;
                })
                .then(json => {
                    dispatch(createNetwork(json));
                });
        });
    };
};


export const createNetworkNodes = (nodes, cols, index) => {
    return (dispatch) => {
        dispatch(creatingNetwork());
        const formData = new FormData();

        formData.append('file', nodes);
        formData.append('cols', cols);
        formData.append('index', index);
        formData.forEach((value, key) => {
            console.log(key + ' ' + value);
        });
        return fetch('http://localhost:7082/api/network/create_network_nodes', {
            method: 'POST',
            body: formData
        }).then((response) => {
            response.json()
                .catch(err => {
                    return err;
                })
                .then(json => {
                    dispatch(createNetwork(json));
                });
        });
    };
};