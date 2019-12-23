import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import {
  REQUEST_VALIDATE_OWNERSHIP, RECEIVE_VALIDATE_OWNERSHIP,
  ERROR_VALIDATE_OWNERSHIP, CLEAN_VALIDATE_OWNERSHIP,
  REQUEST_TRANSFER_TO_REGISTRAR, RECEIVE_TRANSFER_TO_REGISTRAR, ERROR_TRANSFER_TO_REGISTRAR,
  REQUEST_CLAIM, RECEIVE_CLAIM, ERROR_CLAIM,
  REQUEST_AUTH, RECEIVE_AUTH, ERROR_AUTH,
  NODE_OWNER, REGISTRANT, CONFIRM_PARSED,
  REQUEST_REGISTER, RECEIVE_REGISTER, ERROR_REGISTER,
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
  auth: {
    permissions: [],
    authenticating: false,
    error: null,
  },
  parsed: null,
  register: [],
};

const createRegistration = (index) => ({
  index,
  tx: null,
  error: null,
  registering: false,
});

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
      auth: {
        permissions: [NODE_OWNER, REGISTRANT]
      }
    };
    case ERROR_TRANSFER_TO_REGISTRAR: return {
      ...state,
      transferToRegistrar: {
        transferring: false,
        tx: null,
        error: action.error,
      },
    };
    case REQUEST_AUTH: return {
      ...state,
      domain: null,
      auth: {
        authenticating: true,
        permissions: [],
        error: null,
      },
    };
    case RECEIVE_AUTH: return {
      ...state,
      domain: action.domain,
      owner: action.owner,
      auth: {
        authenticating: false,
        permissions: action.permissions,
        error: null,
      },
    };
    case ERROR_AUTH: return {
      ...state,
      domain: null,
      auth: {
        authenticating: false,
        permissions: [],
        error: action.error,
      },
    };
    case CONFIRM_PARSED: {
      let register = [];
      for(let i = 0; i < action.parsed.length; i += 1)
        register.push(createRegistration(i));

      return {
        ...state,
        parsed: action.parsed,
        register,
      }
    }
    case REQUEST_REGISTER: return {
      ...state,
      register: state.register.map(r => r.index === action.index ? {
        index: r.index,
        tx: null,
        error: null,
        registering: true,
      } : r),
    };
    case RECEIVE_REGISTER: return {
      ...state,
      register: state.register.map(r => r.index === action.index ? {
        index: r.index,
        tx: action.tx,
        error: null,
        registering: false,
      } : r),
    };
    case ERROR_REGISTER: return {
      ...state,
      register: state.register.map(r => r.index === action.index ? {
        index: r.index,
        tx: null,
        error: action.error,
        registering: false,
      } : r ),
    };
    default: return state;
  }
};

export default (history) => combineReducers({
  router: connectRouter(history),
  app: reducer,
});
