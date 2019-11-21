const RNS = artifacts.require('RNS');
const Token = artifacts.require('ERC677TokenContract');
const TokenRegistrar = artifacts.require('TokenRegistrar');
const RSKOwner = artifacts.require('RSKOwner');
const PublicResolver = artifacts.require('PublicResolver');
const BatchSubdomainRegistration = artifacts.require('BatchSubdomainRegistration');

const namehash = require('eth-ens-namehash').hash;
const expect = require('chai').expect;
const helpers = require('@openzeppelin/test-helpers');

contract('BatchSubdomainRegistration', async (accounts) => {
  let rns, token, tokenRegistrar, rskOwner, resolver, batchSubdomainRegistration;
  const rootDomain = 'javi.rsk';
  const rootDomainNode = namehash('javi.rsk');

  beforeEach(async () => {
    const rootNode = namehash('rsk');

    rns = await RNS.new();
    resolver = await PublicResolver.new(rns.address);

    rns.setDefaultResolver(resolver.address);
    token = await Token.new(accounts[0], web3.utils.toBN('1000000000000000000000'));
    tokenRegistrar = await TokenRegistrar.new(rns.address, rootNode, token.address);

    rskOwner = await RSKOwner.new(
      tokenRegistrar.address,
      rns.address,
      rootNode,
    );

    await rns.setSubnodeOwner('0x00', web3.utils.sha3('rsk'), rskOwner.address);

    await rskOwner.addRegistrar(accounts[0]);

    await rskOwner.register(web3.utils.sha3('javi'), accounts[0], 1);

    batchSubdomainRegistration = await BatchSubdomainRegistration.new(rns.address, rootDomainNode);
    
    rns.setOwner(rootDomainNode, batchSubdomainRegistration.address);
  });

  it('should register one domain and its resolution', async () => {
    const name = 'test';
    const owner = accounts[4];

    await batchSubdomainRegistration.register([owner], [web3.utils.sha3(name)])
  
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

    await batchSubdomainRegistration.register([owner1, owner2], [web3.utils.sha3(name1), web3.utils.sha3(name2)])
  
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
      batchSubdomainRegistration.register([owner], [web3.utils.sha3(name), web3.utils.sha3(name)]),
      'Owners and labels arrays should contain same amount of elements'
    );
  });

  it('should fail when sending more owners than names', async () => {
    const name = 'test';
    const owner = accounts[4];

    await helpers.expectRevert(
      batchSubdomainRegistration.register([owner, owner], [web3.utils.sha3(name)]),
      'Owners and labels arrays should contain same amount of elements'
    );
  });

  it('should allow only owner of the contract to register names', async () => {
    const name = 'test';
    const owner = accounts[4];
    const noOwner = accounts[5];

    await helpers.expectRevert(
      batchSubdomainRegistration.register([owner], [web3.utils.sha3(name)], { from: noOwner }),
      'Ownable: caller is not the owner'
    );
  });

});