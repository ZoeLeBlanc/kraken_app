import { LOAD_CSV_OPTIONS, SAVING_CSV, SELECTED_NODES, SELECTED_EDGES, LOAD_FILES, LOAD_COLUMNS, GETTING_ITEMS, SET_COLUMN, HAS_EDGES } from './DashboardActions';

const dashboardReducer = (state = {
    isSaving: false,
    headers: {},
    nodes: '',
    edges: '',
    columns: [],
    uploadedFiles: [],
    isGetting: false,
    selectedCols: [],
    networkHasEdges: false,
}, action) => {
    switch (action.type) {
        case LOAD_COLUMNS:
            return {
                ...state,
                columns: action.cols
            };
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
        case GETTING_ITEMS:
            return {
                ...state,
                isGetting: !state.isGetting
            };
        case HAS_EDGES:
            return {
                ...state,
                networkHasEdges: !state.networkHasEdges
            };
        case LOAD_FILES:
            return {
                ...state,
                uploadedFiles: [ ...state.uploadedFiles, action.uploadedFiles]
            };
        case SET_COLUMN:
            return {
                ...state,
                columns: state.columns.filter(col => col !== action.col),
                selectedCols: [...state.selectedCols, action.col]
            };
        default:
            return state;
    }
};
export default dashboardReducer;
