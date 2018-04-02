import { LOAD_CSV_OPTIONS, SAVING_CSV} from './DashboardActions';

const dashboardReducer = (state = {
    isSaving: false,
    csv: {}
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
                csv: action.csv,
            };
        default:
            return state;
    }
};
export default dashboardReducer;
