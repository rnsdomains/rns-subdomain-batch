import Web3 from 'web3';
import { requestValidateOwnership, receiveValidateOwnership, errorValidateOwnership } from './actions';
import namehash from 'eth-ens-namehash';

// This method will validate ownrship of the domain with
// the account unlocked in Nifty Wallet.
export const validateOwnership = (domain) => dispatch => {
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
  .then((accounts) => (account = accounts[0].toLowerCase()))
  .then(() => rns.methods.owner(node).call())
  .then(_owner => {
    const owner = _owner.toLowerCase();

    if(owner === account)
      dispatch(receiveValidateOwnership(domain));
    else
      dispatch(errorValidateOwnership('Not owner'));
  })
  .catch(errorValidateOwnership);
};
