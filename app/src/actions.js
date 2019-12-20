import {
  REQUEST_VALIDATE_OWNERSHIP, RECEIVE_VALIDATE_OWNERSHIP, ERROR_VALIDATE_OWNERSHIP, CLEAN_VALIDATE_OWNERSHIP,
} from './types';

export const requestValidateOwnership = () => ({
  type: REQUEST_VALIDATE_OWNERSHIP,
});

export const receiveValidateOwnership = (domain) => ({
  type: RECEIVE_VALIDATE_OWNERSHIP,
  domain,
});

export const errorValidateOwnership = (error) => ({
  type: ERROR_VALIDATE_OWNERSHIP,
  error,
});

export const cleanValidateOwnership = () => ({
  type: CLEAN_VALIDATE_OWNERSHIP,
});
