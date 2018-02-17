import { LOAD_PEOPLE, REQUEST_PEOPLE } from '../actions/peopleActions';

const peopleReducer = (state = {
    isFetching: false,
    people: []
}, action) => {
    switch (action.type) {
        case REQUEST_PEOPLE:
            return {
                ...state,
                isFetching: true
            };
        case LOAD_PEOPLE:
            return {
                ...state,
                isFetching: false,
                people: action.people,
            };
        default:
            return state;
    }
};
export default peopleReducer;
