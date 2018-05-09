export const REQUEST_NETWORK = 'REQUEST_NETWORK';
export const LOAD_FILES = 'LOAD_FILES';
export const SELECTED_EDGES = 'SELECTED_EDGES';
export const SELECTED_NODES = 'SELECTED_NODES';
export const GETTING_ITEMS = 'GETTING_ITEMS';
export const CREATE_NETWORK = 'CREATE_NETWORK';
export const LOAD_COLUMNS = 'LOAD_COLUMNS';
export const SET_COLUMN = 'SET_COLUMN';
export const HAS_EDGES = 'HAS_EDGES';

// Loading Files
export const loadFiles = (uploadedFiles) => ({
    type: 'LOAD_FILES',
    uploadedFiles
});
// Selecting Files
export const selectedEdges = (edges) => ({
    type: 'SELECTED_EDGES',
    edges
});

export const selectedNodes = (nodes) => ({
    type: 'SELECTED_NODES',
    nodes
});

// Get Node Columns
export const gettingItems = () => ({
    type: 'GETTING_ITEMS'
});

export const loadCols = (json) => ({
    type: 'LOAD_COLUMNS',
    cols: json
});

export const setColumn = (col) => ({
    type: 'SET_COLUMN',
    col
});

const urltoFile = (url, filename, properties) =>{
    return (fetch(url)
        .then((res) => {return res.arrayBuffer();})
        .then((buf) => {return new File([buf], filename, properties);})
    );
};

export const getCols = (f) => {
    return (dispatch) => {
        const properties = {'type': f[0].filetype, 'selectedNodes': f[0].selectedNodes};
        urltoFile(f[0].file_url, f[0].filename, properties).then((file) => {
            console.log(file);
            dispatch(gettingItems());
            const formData = new FormData();
            formData.append('file', file);
            formData.forEach((value, key) => {
                console.log(key + ' ' + value);
            });
            return fetch('http://localhost:7082/api/network/get_csv_headers', {
                method: 'POST',
                body: formData
            }).then((response) => {
                response.json()
                    .catch(err => {
                        return err;
                    })
                    .then(json => {
                        console.log(Object.values(json), typeof(json.cols));
                        dispatch(gettingItems()); return dispatch(loadCols(json.cols));
                    });
            });
        });
    };
};

// Neo4j Graph
// export const loadGraph = (json) => ({
//     type: 'LOAD_GRAPH',
//     graph: json
// });

export const requestNetwork = () => ({
    type: 'REQUEST_Network'
});
// export const getGraph = () => {
//     return (dispatch) => {
//         dispatch(requestGraph());
//         return fetch('http://localhost:7082/api/graph/get_graph')
//             .then(response => response.json()
//                 .catch(err => {
//                     return err;
//                 })
//                 .then(json => {
//                     console.log(json);
//                     dispatch(loadGraph(json));
//                 })
//             );
//     };
// };
// Create Network from Nodes and Edges File

export const createNetwork = (json) => ({
    type: 'CREATE_NETWORK',
    network: json
});

export const hasEdges = () => ({
    type: 'HAS_EDGES'
});

export const createNetworkEdges = (nodes, edges) => {
    return (dispatch) => {
        dispatch(gettingItems());
        dispatch(requestNetwork());
        const formData = new FormData();
        const propertiesNodes = { 'type': nodes[0].filetype, 'selectedNodes': nodes[0].selectedNodes };
        urltoFile(nodes[0].file_url, nodes[0].filename, propertiesNodes).then((file) => {
            formData.append('nodes', file);
            const propertiesEdges = { 'type': edges[0].filetype, 'selectedEdges': edges[0].selectedEdges };
            urltoFile(edges[0].file_url, edges[0].filename, propertiesEdges).then((f) => {
                formData.append('edges', f);
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
                            dispatch(gettingItems());
                            dispatch(requestNetwork());
                            console.log(json);
                            dispatch(createNetwork(json));
                        });
                });
            });
        });
    };
};
// Create Network from Nodes
export const createNetworkNodes = (nodes, cols) => {
    return (dispatch) => {
        dispatch(gettingItems());
        const formData = new FormData();
        const propertiesNodes = { 'type': nodes[0].filetype, 'selectedNodes': nodes[0].selectedNodes };
        urltoFile(nodes[0].file_url, nodes[0].filename, propertiesNodes).then((f) => {
            formData.append('file', f);
            formData.append('cols', cols);
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
                        dispatch(gettingItems());
                        console.log(json);
                    });
            });
        });
    };
};
