const RNS = artifacts.require('RNS');
const PublicResolver = artifacts.require('PublicResolver');
const SubdomainBatchRegistrar = artifacts.require('SubdomainBatchRegistrar');

const namehash = require('eth-ens-namehash').hash;
const expect = require('chai').expect;
const helpers = require('@openzeppelin/test-helpers');

contract('Subdomain Batch Registrar - claim', async (accounts) => {
  let rns, resolver, registrar;

  const rootDomainNode = namehash('javi.rsk');

  beforeEach(async () => {
    rns = await RNS.new();
    resolver = await PublicResolver.new(rns.address);
    registrar = await SubdomainBatchRegistrar.new(rns.address);

    await rns.setDefaultResolver(resolver.address);

    await rns.setSubnodeOwner('0x00', web3.utils.sha3('rsk'), accounts[0]);
    await rns.setSubnodeOwner(namehash('rsk'), web3.utils.sha3('javi'), accounts[0]);
  });

  it('should fail if sender does not own rns node', async () => {
    await rns.setOwner(rootDomainNode, accounts[1]);

    await helpers.expectRevert(
      registrar.claim(rootDomainNode),
      'Only RNS owner',
    );
  });

  it('should claim the owner of the node when owned in rns', async () => {
    await registrar.claim(rootDomainNode);

    expect(await registrar.nodeOwner(rootDomainNode)).to.eq(accounts[0]);
  });

  it('should enable to reclaim when rns owner changes', async () => {
    await rns.setSubnodeOwner(namehash('rsk'), web3.utils.sha3('javi'), accounts[1]);

    await registrar.claim(rootDomainNode, { from: accounts[1] });
    await rns.setOwner(rootDomainNode, registrar.address, { from: accounts[1] });

    expect(await registrar.nodeOwner(rootDomainNode)).to.eq(accounts[1]);
    expect(await rns.owner(rootDomainNode)).to.eq(registrar.address);
  });

  it('should emit Claim event', async () => {
    const { receipt } = await registrar.claim(rootDomainNode);

    helpers.expectEvent(
      receipt,
      'Claim',
      {
        node: rootDomainNode,
        owner: accounts[0],
      },
    );
  });
});
