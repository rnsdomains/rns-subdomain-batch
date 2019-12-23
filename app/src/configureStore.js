import { createBrowserHistory } from 'history';
import { applyMiddleware, compose, createStore } from 'redux';
import { routerMiddleware } from 'connected-react-router';
import thunk from 'redux-thunk';
import { createLogger } from 'redux-logger';
import createRootReducer from './reducer';

export const history = createBrowserHistory({ basename: '/rns-subdomain-batch' });

const middleware = [thunk, routerMiddleware(history)];

if (process.env.NODE_ENV !== 'production') {
  middleware.push(createLogger());
}

export default function configureStore(preloadedState) {
  const store = createStore(
    createRootReducer(history), // root reducer with router state
    preloadedState,
    compose(
      applyMiddleware(...middleware),
    ),
  );

  return store;
}
