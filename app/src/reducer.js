import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import {
  REQUEST_VALIDATE_OWNERSHIP, RECEIVE_VALIDATE_OWNERSHIP,
  ERROR_VALIDATE_OWNERSHIP, CLEAN_VALIDATE_OWNERSHIP,
  REQUEST_TRANSFER_TO_REGISTRAR, RECEIVE_TRANSFER_TO_REGISTRAR, ERROR_TRANSFER_TO_REGISTRAR,
  REQUEST_CLAIM, RECEIVE_CLAIM, ERROR_CLAIM,
} from './types';

const initialState = {
  domain: null,
  owner: null,
  validateOwnership: {
    enabled: false,
    loading: false,
    error: null,
  },
  claim: {
    claiming: false,
    tx: null,
    error: null,
  },
  transferToRegistrar: {
    transferring: false,
    tx: null,
    error: null,
  },
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case REQUEST_VALIDATE_OWNERSHIP: return {
      ...state,
      domain: null,
      owner: null,
      validateOwnership: {
        loading: true,
        error: null,
      },
    };
    case RECEIVE_VALIDATE_OWNERSHIP: return {
      ...state,
      domain: action.domain,
      owner: action.owner,
      validateOwnership: {
        loading: false,
        error: null,
      },
    };
    case ERROR_VALIDATE_OWNERSHIP: return {
      ...state,
      domain: null,
      owner: null,
      validateOwnership: {
        loading: false,
        error: action.error,
      },
    };
    case CLEAN_VALIDATE_OWNERSHIP: return {
      ...state,
      domain: null,
      owner: null,
      validateOwnership: {
        loading: false,
        error: null,
      },
    };
    case REQUEST_CLAIM: return {
      ...state,
      claim: {
        claiming: true,
        tx: null,
        error: null,
      },
    };
    case RECEIVE_CLAIM: return {
      ...state,
      claim: {
        claiming: false,
        tx: action.tx,
        error: null,
      },
    };
    case ERROR_CLAIM: return {
      ...state,
      claim: {
        claiming: false,
        tx: null,
        error: action.error,
      },
    };
    case REQUEST_TRANSFER_TO_REGISTRAR: return {
      ...state,
      transferToRegistrar: {
        transferring: true,
        tx: null,
        error: null,
      },
    };
    case RECEIVE_TRANSFER_TO_REGISTRAR: return {
      ...state,
      transferToRegistrar: {
        transferring: false,
        tx: action.tx,
        error: null,
      },
    };
    case ERROR_TRANSFER_TO_REGISTRAR: return {
      ...state,
      transferToRegistrar: {
        transferring: false,
        tx: null,
        error: action.error,
      },
    };
    default: return state;
  }
};

export default (history) => combineReducers({
  router: connectRouter(history),
  app: reducer,
});
