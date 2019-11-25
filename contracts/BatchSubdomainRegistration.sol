pragma solidity ^0.5.3;

import "@openzeppelin/contracts/ownership/Ownable.sol";
import "./testing/AbstractRNS.sol";
import "./testing/AbstractAddrResolver.sol";

contract BatchSubdomainRegistrar is Ownable {
    AbstractRNS private rns;
    bytes32 private rootNode;

    constructor (AbstractRNS _rns, bytes32 _rootNode) public {
        rns = _rns;
        rootNode = _rootNode;
    }

    /// @notice Sets subdomains owners and addr resolutions for given names.
    /// @dev Only owner.
    /// @param labels The array of labels to register.
    /// @param addrs The owner and addr resolution for matching index labels.
    function register(bytes32[] calldata labels, address[] calldata addrs) external onlyOwner {
        require(labels.length == addrs.length, "Labels and addrs should contain same amount of elements");

        AbstractAddrResolver resolver;
        resolver = AbstractAddrResolver(rns.resolver(rootNode));

        bytes32 label;
        address addr;
        bytes32 node;

        for (uint i = 0; i < labels.length; i++) {
            label = labels[i];
            addr = addrs[i];
            node = keccak256(abi.encodePacked(rootNode, label));

            rns.setSubnodeOwner(rootNode, label, address(this));
            resolver.setAddr(node, addr);
            rns.setOwner(node, addr);
        }
    }
}
