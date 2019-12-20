pragma solidity ^0.5.3;

import "./testing/AbstractAddrResolver.sol";
import "@rsksmart/rns-registry/contracts/AbstractRNS.sol";

contract SubdomainBatchRegistrar {
    AbstractRNS private rns;

    mapping (bytes32 => address) public nodeOwner;
    mapping (bytes32 => mapping (address => bool)) public approvedToRegister;

    event Claim(bytes32 node, address owner);
    event Approve(bytes32 node, address approved, bool approval);

    modifier onlyNodeOwner (bytes32 node) {
        require(msg.sender == nodeOwner[node], "Only node owner");
        _;
    }

    modifier onlyApprovedToRegister (bytes32 node) {
        require(approvedToRegister[node][msg.sender], "Only approved to register");
        _;
    }

    constructor (AbstractRNS _rns) public {
        rns = _rns;
    }

    /// @notice Claim a domain to use for batch registration.
    /// @dev Claim must be executed before transfering the rns domain.
    /// @dev Use recover to revert the ownership transfer.
    /// @dev This will also set owner as allowed registrant.
    /// @param node The root node to execute batch registrations for.
    function claim (bytes32 node) external {
        require(rns.owner(node) == msg.sender, "Only RNS owner");

        nodeOwner[node] = msg.sender;
        approvedToRegister[node][msg.sender] = true;

        emit Claim(node, msg.sender);
    }

    /***************/
    /* Registrants */
    /***************/

    // Registrants can execute subdomain batch registration
    // for the root node. After claming the node, the owner
    // can manager registrants.

    /// @notice Add registrant.
    /// @dev Only node owner.
    /// @param node Node that the new registant can register subdomains for.
    /// @param registrant The registrant to be added.
    function addRegistrant(bytes32 node, address registrant) external onlyNodeOwner(node) {
        setApproval(node, registrant, true);
    }

    /// @notice Remove registrant.
    /// @dev Only node owner.
    /// @param node Node that the registant cannot register subdomains for.
    /// @param registrant The registrant to be removed.
    function removeRegistrant(bytes32 node, address registrant) external onlyNodeOwner(node) {
        setApproval(node, registrant, false);
    }

    function setApproval(bytes32 node, address registrant, bool approval) internal onlyNodeOwner(node) {
        approvedToRegister[node][registrant] = approval;
        emit Approve(node, registrant, approval);
    }

    /// @notice Return if a given account can registers subdomains for a given node.
    /// @param node Node to query the approval for.
    /// @param registrant The registrant to query for.
    /// @return True if the registrant can register subnodes for node.
    function isRegistrant(bytes32 node, address registrant) public view returns (bool) {
        return approvedToRegister[node][registrant];
    }

    /// @notice Recover rns node ownership.
    /// @dev Only node owner.
    /// @param node Node to recover ownership of.
    function recover(bytes32 node) external onlyNodeOwner(node) {
        rns.setOwner(node, nodeOwner[node]);
    }

    /****************/
    /* Registration */
    /****************/

    /// @notice Sets subdomains owners and addr resolutions for given names.
    /// @dev Only approved to register.
    /// @dev rootNode must be owned by this contract.
    /// @dev Sets same address for addr and owner for each subnode.
    /// @param rootNode Parent of all subdomains.
    /// @param labels The array of labels to register.
    /// @param addrs The owner and addr resolution for matching index labels.
    function register
        (bytes32 rootNode, bytes32[] calldata labels, address[] calldata addrs)
        external
        onlyApprovedToRegister(rootNode)
    {
        require(labels.length == addrs.length, "Labels and addrs should contain same amount of elements");

        bytes32 node;
        bytes32 label;
        address addr;

        AbstractAddrResolver resolver;
        resolver = AbstractAddrResolver(rns.resolver(rootNode));

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
