const RNS = artifacts.require('RNS');
const PublicResolver = artifacts.require('PublicResolver');
const SubdomainBatchRegistrar = artifacts.require('SubdomainBatchRegistrar');

const namehash = require('eth-ens-namehash').hash;
const expect = require('chai').expect;
const helpers = require('@openzeppelin/test-helpers');

contract('Subdomain Batch Registrar - recover', async (accounts) => {
  let rns, resolver, registrar;

  const rootDomainNode = namehash('javi.rsk');

  beforeEach(async () => {
    rns = await RNS.new();
    resolver = await PublicResolver.new(rns.address);
    registrar = await SubdomainBatchRegistrar.new(rns.address);

    await rns.setDefaultResolver(resolver.address);

    await rns.setSubnodeOwner('0x00', web3.utils.sha3('rsk'), accounts[0]);
    await rns.setSubnodeOwner(namehash('rsk'), web3.utils.sha3('javi'), accounts[0]);
    await registrar.claim(rootDomainNode);
    await rns.setOwner(rootDomainNode, registrar.address);
  });

  it('should allow node owner to recover node ownership of rns node', async () => {
    await registrar.recover(rootDomainNode);

    expect(await rns.owner(rootDomainNode)).to.eq(accounts[0]);
  });

  it('should not allow not owner to recover ownership of rns node', async () => {
    await helpers.expectRevert(
      registrar.recover(rootDomainNode, { from: accounts[1] }),
      'Only node owner'
    );

    expect(await rns.owner(rootDomainNode)).to.eq(registrar.address);
  })
});
