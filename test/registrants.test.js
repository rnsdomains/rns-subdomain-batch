const RNS = artifacts.require('RNS');
const PublicResolver = artifacts.require('PublicResolver');
const SubdomainBatchRegistrar = artifacts.require('SubdomainBatchRegistrar');

const namehash = require('eth-ens-namehash').hash;
const expect = require('chai').expect;
const helpers = require('@openzeppelin/test-helpers');

contract('Subdomain Batch Registrar - registrants', async (accounts) => {
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
  });

  it('should set claimer as registrant when claiming', async () => {
    expect(await registrar.isRegistrant(rootDomainNode, accounts[0])).to.be.true;
  });

  it('should allow owner to add registrant', async () => {
    await registrar.addRegistrant(rootDomainNode, accounts[1]);

    expect(await registrar.isRegistrant(rootDomainNode, accounts[1])).to.be.true;
  });

  it('should not allow not owner to add registrant', async () => {
    await helpers.expectRevert(
      registrar.addRegistrant(rootDomainNode, accounts[1], { from: accounts[1] }),
      'Only node owner'
    );
  });

  it('should allow owner to remove registrant', async () => {
    await registrar.addRegistrant(rootDomainNode, accounts[1]);

    await registrar.removeRegistrant(rootDomainNode, accounts[1]);

    expect(await registrar.isRegistrant(rootDomainNode, accounts[1])).to.be.false;
  });

  it('should not allow not owner to remove registrant', async () => {
    await helpers.expectRevert(
      registrar.removeRegistrant(rootDomainNode, accounts[0], { from: accounts[1] }),
      'Only node owner'
    );
  });

  it('should emit Approve event when adding approved to register', async () => {
    const approved = accounts[1];
    await registrar.claim(rootDomainNode);
    const { receipt } = await registrar.addRegistrant(rootDomainNode, approved);

    helpers.expectEvent(
      receipt,
      'Approve',
      {
        node: rootDomainNode,
        approved,
        approval: true,
      },
    );
  });

  it('should emit Approve event when removing approved to register', async () => {
    const approved = accounts[1];
    await registrar.claim(rootDomainNode);
    const { receipt } = await registrar.removeRegistrant(rootDomainNode, approved);

    helpers.expectEvent(
      receipt,
      'Approve',
      {
        node: rootDomainNode,
        approved,
        approval: false,
      },
    );
  });
});
