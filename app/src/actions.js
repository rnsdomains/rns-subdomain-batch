import {
  REQUEST_VALIDATE_OWNERSHIP, RECEIVE_VALIDATE_OWNERSHIP,
  ERROR_VALIDATE_OWNERSHIP, CLEAN_VALIDATE_OWNERSHIP,
  REQUEST_TRANSFER_TO_REGISTRAR, ERROR_TRANSFER_TO_REGISTRAR, RECEIVE_TRANSFER_TO_REGISTRAR,
  REQUEST_CLAIM, RECEIVE_CLAIM, ERROR_CLAIM,
  REQUEST_AUTH, RECEIVE_AUTH, ERROR_AUTH,
} from './types';

export const requestValidateOwnership = () => ({
  type: REQUEST_VALIDATE_OWNERSHIP,
});

export const receiveValidateOwnership = (domain, owner) => ({
  type: RECEIVE_VALIDATE_OWNERSHIP,
  domain,
  owner,
});

export const errorValidateOwnership = (error) => ({
  type: ERROR_VALIDATE_OWNERSHIP,
  error,
});

export const cleanValidateOwnership = () => ({
  type: CLEAN_VALIDATE_OWNERSHIP,
});

export const requestClaim = () => ({
  type: REQUEST_CLAIM,
});

export const receiveClaim = (tx) => ({
  type: RECEIVE_CLAIM,
  tx,
});

export const errorClaim = (error) => ({
  type: ERROR_CLAIM,
  error,
});

export const requestTransferToRegistrar = () => ({
  type: REQUEST_TRANSFER_TO_REGISTRAR,
});

export const receiveTransferToRegistrar = (tx) => ({
  type: RECEIVE_TRANSFER_TO_REGISTRAR,
  tx,
});

export const errorTransferToRegistrar = (error) => ({
  type: ERROR_TRANSFER_TO_REGISTRAR,
  error,
});

export const requestAuth = () => ({
  type: REQUEST_AUTH,
});

export const receiveAuth = (domain, permissions) => ({
  type: RECEIVE_AUTH,
  domain,
  permissions,
});

export const errorAuth = (error) => ({
  type: ERROR_AUTH,
  error,
});
