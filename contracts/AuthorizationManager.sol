// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/utils/cryptography/MessageHashUtils.sol";

contract AuthorizationManager {
    using ECDSA for bytes32;
    using MessageHashUtils for bytes32;

    mapping(bytes32 => bool) public usedAuthorization;

    address public signer;
    uint256 public immutable chainId;
    bool private initialized;

    event AuthorizationConsumed(bytes32 authId);

    constructor() {
        chainId = block.chainid;
    }

    function initialize(address _signer) external {
        require(!initialized, "Already initialized");
        signer = _signer;
        initialized = true;
    }

    function verifyAuthorization(
        address vault,
        address recipient,
        uint256 amount,
        bytes32 nonce,
        bytes calldata signature
    ) external returns (bool) {
        bytes32 authId = keccak256(
            abi.encodePacked(vault, recipient, amount, nonce, chainId)
        );

        require(!usedAuthorization[authId], "Authorization already used");

        bytes32 message = authId.toEthSignedMessageHash();
        address recoveredSigner = ECDSA.recover(message, signature);

        require(recoveredSigner == signer, "Invalid signature");

        usedAuthorization[authId] = true;
        emit AuthorizationConsumed(authId);

        return true;
    }
}
