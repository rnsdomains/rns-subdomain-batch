import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import {
  REQUEST_VALIDATE_OWNERSHIP, RECEIVE_VALIDATE_OWNERSHIP, ERROR_VALIDATE_OWNERSHIP, CLEAN_VALIDATE_OWNERSHIP,
} from './types';

const initialState = {
  domain: null,
  validateOwnership: {
    enabled: false,
    loading: false,
    error: null,
  },
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case REQUEST_VALIDATE_OWNERSHIP: return {
      ...state,
      domain: null,
      validateOwnership: {
        loading: true,
        error: null,
      },
    };
    case RECEIVE_VALIDATE_OWNERSHIP: return {
      ...state,
      domain: action.domain,
      validateOwnership: {
        loading: false,
        error: null,
      },
    };
    case ERROR_VALIDATE_OWNERSHIP: return {
      ...state,
      domain: null,
      validateOwnership: {
        loading: false,
        error: action.error,
      },
    };
    case CLEAN_VALIDATE_OWNERSHIP: return {
      ...state,
      domain: null,
      validateOwnership: {
        loading: false,
        error: null,
      }
    }
    default: return state;
  }
};

export default (history) => combineReducers({
  router: connectRouter(history),
  app: reducer,
});
