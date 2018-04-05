import { LOAD_CSV_OPTIONS, SAVING_CSV, SELECTED_NODES, SELECTED_EDGES, LOAD_FILES } from './DashboardActions';

const dashboardReducer = (state = {
    isSaving: false,
    headers: {},
    nodes: [],
    edges: [],
    nodeColumns: [],
    uploadedFiles: []
}, action) => {
    switch (action.type) {
        case SAVING_CSV:
            return {
                ...state,
                isSaving: true
            };
        case LOAD_CSV_OPTIONS:
            return {
                ...state,
                isSaving: true,
                headers: action.headers,
            };
        case SELECTED_NODES:
            return {
                ...state,
                nodes: action.nodes
            };
        case SELECTED_EDGES:
            return {
                ...state,
                edges: action.edges
            };
        case LOAD_FILES:
            return {
                ...state,
                uploadedFiles: [...state.uploadedFiles, ...action.uploadedFiles]
            };
        default:
            return state;
    }
};
export default dashboardReducer;
