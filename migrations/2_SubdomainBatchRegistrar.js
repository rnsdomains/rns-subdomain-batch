const RNS = artifacts.require('RNS');
const PublicResolver = artifacts.require('PublicResolver');
const SubdomainBatchRegistrar = artifacts.require('SubdomainBatchRegistrar');

const namehash = require('eth-ens-namehash').hash;

const indexOfRootDomain = process.argv.indexOf('--rootNode');

module.exports = (deployer, network, accounts) => {
  return deployer.then(async () => {
    let rns, resolver, registrar;

    if (network === 'develop' || network === 'ganache') {
      rns = await deployer.deploy(RNS);
      resolver = await deployer.deploy(PublicResolver, rns.address);
      registrar = await deployer.deploy(SubdomainBatchRegistrar, rns.address);

      await rns.setDefaultResolver(resolver.address);

      await rns.setSubnodeOwner('0x00', web3.utils.sha3('rsk'), accounts[0]);
      await rns.setSubnodeOwner(namehash('rsk'), web3.utils.sha3('javi'), accounts[0]);
    } else if (network === 'testnet') {
      await deployer.deploy(SubdomainBatchRegistrar, '0x7d284aaac6e925aad802a53c0c69efe3764597b8');
    } else if (network === 'mainnet') {
      await deployer.deploy(SubdomainBatchRegistrar, '0xcb868aeabd31e2b66f74e9a55cf064abb31a4ad5');
    }
  });
}