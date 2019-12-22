import Web3 from 'web3';
import namehash from 'eth-ens-namehash';
import {
  requestValidateOwnership, receiveValidateOwnership, errorValidateOwnership,
  requestTransferToRegistrar, receiveTransferToRegistrar, errorTransferToRegistrar,
  requestClaim, receiveClaim, errorClaim,
} from './actions';

// This method will validate ownrship of the domain with
// the account unlocked in Nifty Wallet.
export const validateOwnership = (domain) => (dispatch) => {
  dispatch(requestValidateOwnership());

  const web3 = new Web3(process.env.REACT_APP_RSK_NODE);

  const rns = new web3.eth.Contract([
    {
      constant: true,
      inputs: [
        { name: 'node', type: 'bytes32' },
      ],
      name: 'owner',
      outputs: [
        { name: '', type: 'address' },
      ],
      payable: false,
      stateMutability: 'view',
      type: 'function',
    },
  ], process.env.REACT_APP_RNS_REGISTRY);

  const node = namehash.hash(domain);

  let account;

  return window.ethereum.enable()
    .then((accounts) => {
      account = accounts[0].toLowerCase();
    })
    .then(() => rns.methods.owner(node).call())
    .then((_owner) => {
      const owner = _owner.toLowerCase();

      if (owner === account) dispatch(receiveValidateOwnership(domain, owner));
      else dispatch(errorValidateOwnership('Not domain\'s owner'));
    })
    .catch(errorValidateOwnership);
};

export const bathRegistrarClaim = (domain, from) => (dispatch) => {
  dispatch(requestClaim());

  const web3 = new Web3(window.web3);

  const registrar = new web3.eth.Contract([
    {
      constant: false,
      inputs: [
        { name: 'node', type: 'bytes32' },
      ],
      name: 'claim',
      outputs: [],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function',
    },
  ], process.env.REACT_APP_BATCH_REGISTRAR);

  const node = namehash.hash(domain);


  return registrar.methods.claim(node).send({ from })
    .then((tx) => dispatch(receiveClaim(tx)))
    .catch((error) => dispatch(errorClaim(error)));
};

export const transferToRegistrar = (domain, from) => (dispatch) => {
  dispatch(requestTransferToRegistrar());

  const web3 = new Web3(window.web3);

  const rns = new web3.eth.Contract([
    {
      constant: false,
      inputs: [
        { name: 'node', type: 'bytes32' },
        { name: 'ownerAddress', type: 'address' },
      ],
      name: 'setOwner',
      outputs: [],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function',
    },
  ], process.env.REACT_APP_RNS_REGISTRY);

  const node = namehash.hash(domain);

  return rns.methods.setOwner(node, process.env.REACT_APP_BATCH_REGISTRAR).send({ from })
    .then((tx) => dispatch(receiveTransferToRegistrar(tx)))
    .catch((error) => dispatch(errorTransferToRegistrar(error)));
};
