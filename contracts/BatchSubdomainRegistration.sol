pragma solidity ^0.5.3;

import "@openzeppelin/contracts/ownership/Ownable.sol";
import "./testing/AbstractRNS.sol";
import "./testing/AbstractAddrResolver.sol";

contract BatchSubdomainRegistration is Ownable {

    AbstractRNS private rns;
    bytes32 private rootNode;
    AbstractAddrResolver private resolver;


    constructor (
        AbstractRNS _rns,
        bytes32 _rootNode
    ) public {
        rns = _rns;
        rootNode = _rootNode;
        resolver = AbstractAddrResolver(rns.resolver(rootNode));
    }

    function register(address[] calldata owners, bytes32[] calldata labels) external onlyOwner {
        require(owners.length == labels.length, "Owners and labels arrays should contain same amount of elements");

        address owner;
        bytes32 label;
        bytes32 node;

        for (uint i = 0; i < owners.length; i++) {
            owner = owners[i];
            label = labels[i];

            rns.setSubnodeOwner(rootNode, label, address(this));

            node = keccak256(abi.encodePacked(rootNode, label));
            resolver.setAddr(node, owner);

            rns.setOwner(node, owner);
        }
    }

}
