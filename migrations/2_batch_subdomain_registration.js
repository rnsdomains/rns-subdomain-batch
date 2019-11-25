const RNS = artifacts.require('RNS');
const PublicResolver = artifacts.require('PublicResolver');
const BatchSubdomainRegistrar = artifacts.require('BatchSubdomainRegistrar');

const namehash = require('eth-ens-namehash').hash;

const indexOfRootDomain = process.argv.indexOf('--rootNode');
let rootDomain = 'javi.rsk';
if (indexOfRootDomain !== -1)
  rootDomain = process.argv[indexOfRootDomain + 1];

module.exports = (deployer, network, accounts) => {
  return deployer.then(async () => {
    let rns, resolver, registrar;

    if (network === 'develop' || network === 'ganache') {
      rns = await deployer.deploy(RNS);
      resolver = await deployer.deploy(PublicResolver, rns.address);
      registrar = await deployer.deploy(BatchSubdomainRegistrar, rns.address, namehash(rootDomain));

      await rns.setDefaultResolver(resolver.address);

      const labels = rootDomain.split('.');
      if (labels.length > 2)
        process.exit('Use only 2 labels for dev.');

      await rns.setSubnodeOwner('0x00', web3.utils.sha3(rootDomain[1]), accounts[0]);
      await rns.setSubnodeOwner(namehash(rootDomain[1]), web3.utils.sha3(rootDomain[2]), registrar.address);
    } else if (network === 'testnet') {
      await deployer.deploy(BatchSubdomainRegistrar, '0x7d284aaac6e925aad802a53c0c69efe3764597b8', namehash(rootDomain));
    } else if (network === 'mainnet') {
      await deployer.deploy(BatchSubdomainRegistrar, '0xcb868aeabd31e2b66f74e9a55cf064abb31a4ad5', namehash(rootDomain));
    }
  });
}