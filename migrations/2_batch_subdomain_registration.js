const RNS = artifacts.require('RNS');
const RIF = artifacts.require('ERC677TokenContract');
const TokenRegistrar = artifacts.require('TokenRegistrar');
const RSKOwner = artifacts.require('RSKOwner');
const BatchSubdomainRegistration = artifacts.require('BatchSubdomainRegistration');

const namehash = require('eth-ens-namehash').hash;

module.exports = (deployer, network, accounts) => {
  let rns, rif, tokenRegistrar, rskOwner, batchSubdomainRegistration;

  const label = web3.utils.sha3('javi');

  return deployer.deploy(RNS).then(_rns => {
    rns = _rns;
  })
  .then(() => {
    return deployer.deploy(RIF, accounts[0], web3.utils.toBN('1000000000000000000000'));
  })
  .then(_rif => {
    rif = _rif;
  })
  .then(() => {
    return deployer.deploy(TokenRegistrar, rns.address, namehash('rsk'), rif.address);
  })
  .then(_tokenRegistrar => {
    tokenRegistrar = _tokenRegistrar;
  })
  .then(() => {
    return deployer.deploy(RSKOwner, tokenRegistrar.address, rns.address, namehash('rsk'));
  })
  .then(_rskOwner => {
    rskOwner = _rskOwner;
  })
  .then(() => {
    return rns.setSubnodeOwner('0x00', web3.utils.sha3('rsk'), rskOwner.address)
  })
  .then(() => {
    return rskOwner.addRegistrar(accounts[0]);   
  })
  .then(() => {
    return rskOwner.register(label, accounts[0], 1);
  })
  .then(() => {
    return deployer.deploy(BatchSubdomainRegistration, rns.address, namehash('javi.rsk'));
  })
  .then((_batchSubdomainRegistration) => {
    batchSubdomainRegistration = _batchSubdomainRegistration;
    rns.setOwner(namehash('javi.rsk'), batchSubdomainRegistration.address);
  })
}