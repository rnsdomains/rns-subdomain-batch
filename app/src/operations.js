import Web3 from 'web3';
import namehash from 'eth-ens-namehash';
import {
  requestValidateOwnership, receiveValidateOwnership, errorValidateOwnership,
  requestTransferToRegistrar, receiveTransferToRegistrar, errorTransferToRegistrar,
  requestClaim, receiveClaim, errorClaim,
  requestAuth, receiveAuth, errorAuth, requestRegister, receiveRegister, errorRegister,
} from './actions';
import { NODE_OWNER, REGISTRANT } from './types';

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

export const auth = (domain) => (dispatch) => {
  dispatch(requestAuth());

  const web3 = new Web3(process.env.REACT_APP_RSK_NODE);

  const registrar = new web3.eth.Contract([
    {
      "constant": true,
      "inputs": [
        {
          "internalType": "bytes32",
          "name": "node",
          "type": "bytes32"
        },
        {
          "internalType": "address",
          "name": "registrant",
          "type": "address"
        }
      ],
      "name": "isRegistrant",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "internalType": "bytes32",
          "name": "",
          "type": "bytes32"
        }
      ],
      "name": "nodeOwner",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
  ], process.env.REACT_APP_BATCH_REGISTRAR);

  const node = namehash.hash(domain);

  let account;
  let permissions = [];

  return window.ethereum.enable()
    .then((accounts) => {
      account = accounts[0].toLowerCase();
    })
    .then(() => registrar.methods.isRegistrant(node, account).call())
    .then(result => {
      if(result)
        permissions.push(REGISTRANT);
    })
    .then(() => registrar.methods.nodeOwner(node).call())
    .then(owner => {
      if(owner.toLowerCase() === account)
        permissions.push(NODE_OWNER);
    })
    .then(() => dispatch(receiveAuth(domain, account, permissions)))
    .catch(error => dispatch(errorAuth(error)));
}

export const register = (domain, labels, addresses, from, index) => (dispatch) => {
  dispatch(requestRegister(index));

  const web3 = new Web3(window.web3);

  const registrar = new web3.eth.Contract([
    {
      "constant": false,
      "inputs": [
        {
          "name": "rootNode",
          "type": "bytes32"
        },
        {
          "name": "labels",
          "type": "bytes32[]"
        },
        {
          "name": "addrs",
          "type": "address[]"
        }
      ],
      "name": "register",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ], process.env.REACT_APP_BATCH_REGISTRAR);

  const node = namehash.hash(domain);

  return registrar.methods.register(node, labels, addresses).send({ from })
  .then((tx) => dispatch(receiveRegister(tx, index)))
  .catch((error) => dispatch(errorRegister(error, index)));
}
