const RNS = artifacts.require('RNS');
const PublicResolver = artifacts.require('PublicResolver');
const SubdomainBatchRegistrar = artifacts.require('SubdomainBatchRegistrar');

const namehash = require('eth-ens-namehash').hash;
const expect = require('chai').expect;
const helpers = require('@openzeppelin/test-helpers');

contract('Subdomain Batch Registrar - register', async (accounts) => {
  let rns, resolver, registrar;

  const rootDomain = 'javi.rsk';
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

  it('should not allow not registrant to register', async () => {
    const name = 'attack';
    const owner = accounts[4];

    await helpers.expectRevert(
      registrar.register(rootDomainNode, [web3.utils.sha3(name)], [owner], { from: owner }),
      'Only approved to register',
    );
  })

  it('should register one domain and its resolution', async () => {
    const name = 'test';
    const owner = accounts[4];

    await registrar.register(rootDomainNode, [web3.utils.sha3(name)], [owner]);

    const actualOwner = await rns.owner(namehash(`${name}.${rootDomain}`));
    expect(actualOwner).to.eq(owner);

    const actualResolution = await resolver.addr(namehash(`${name}.${rootDomain}`));
    expect(actualResolution).to.eq(owner);
  });

  it('should register two domains and its resolutions', async () => {
    const name1 = 'test1';
    const name2 = 'test2';
    const owner1 = accounts[4];
    const owner2 = accounts[5];

    await registrar.register(rootDomainNode, [web3.utils.sha3(name1), web3.utils.sha3(name2)], [owner1, owner2]);

    const actualOwner1 = await rns.owner(namehash(`${name1}.${rootDomain}`));
    expect(actualOwner1).to.eq(owner1);
    const actualOwner2 = await rns.owner(namehash(`${name2}.${rootDomain}`));
    expect(actualOwner2).to.eq(owner2);

    const actualResolution1 = await resolver.addr(namehash(`${name1}.${rootDomain}`));
    expect(actualResolution1).to.eq(owner1);
    const actualResolution2 = await resolver.addr(namehash(`${name2}.${rootDomain}`));
    expect(actualResolution2).to.eq(owner2);
  });

  it('should fail when sending more names than owners', async () => {
    const name = 'test';
    const owner = accounts[4];

    await helpers.expectRevert(
      registrar.register(rootDomainNode, [web3.utils.sha3(name), web3.utils.sha3(name)], [owner]),
      'Labels and addrs should contain same amount of elements'
    );
  });

  it('should fail when sending more owners than names', async () => {
    const name = 'test';
    const owner = accounts[4];

    await helpers.expectRevert(
      registrar.register(rootDomainNode, [web3.utils.sha3(name)], [owner, owner]),
      'Labels and addrs should contain same amount of elements'
    );
  });

  it('should allow not allow not registrant to register subdomains', async () => {
    await helpers.expectRevert(
      registrar.register(rootDomainNode, [web3.utils.sha3('test')], [accounts[5]], { from: accounts[5] }),
      'Only approved to register'
    );
  });
});
