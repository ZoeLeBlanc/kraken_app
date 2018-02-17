import { combineReducers } from 'redux';
import { routerReducer as routing } from 'react-router-redux';
import { reducer as formReducer } from 'redux-form';
import peopleReducer from './peopleReducer';

export default combineReducers({
    form: formReducer,
    peopleReducer,
    routing,
});
