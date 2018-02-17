import createHistory from 'history/createBrowserHistory';
import { applyMiddleware, createStore, compose } from 'redux';
import { routerMiddleware } from 'react-router-redux';
import thunkMiddleware from 'redux-thunk';
import reducers from '../reducers/index';

export const history = createHistory();
const middlewares = [
    routerMiddleware(history),
    thunkMiddleware
];

// fetch compose enhancer
const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;


export function configureStore(initialState) {
    return createStore(
        reducers,
        initialState,
        composeEnhancer(
            applyMiddleware(...middlewares)
        )
    );
}
