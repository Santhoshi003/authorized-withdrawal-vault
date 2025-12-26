// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

/*
 * SecureVault
 * -------------
 * This contract holds ETH and allows withdrawals
 * ONLY after authorization is validated by
 * AuthorizationManager.
 *
 * IMPORTANT:
 * - This contract NEVER verifies signatures itself
 * - All permission checks are delegated
 */

interface IAuthorizationManager {
    function verifyAuthorization(
        address vault,
        address recipient,
        uint256 amount,
        bytes32 nonce,
        bytes calldata signature
    ) external returns (bool);
}

contract SecureVault {
    IAuthorizationManager public authorizationManager;
    bool private initialized;

    event Deposit(address indexed from, uint256 amount);
    event Withdrawal(address indexed to, uint256 amount);

    /**
     * @notice One-time initialization
     * @param _authorizationManager Address of AuthorizationManager
     */
    function initialize(address _authorizationManager) external {
        require(!initialized, "Already initialized");
        authorizationManager = IAuthorizationManager(_authorizationManager);
        initialized = true;
    }

    /**
     * @notice Accept ETH deposits from anyone
     */
    receive() external payable {
        emit Deposit(msg.sender, msg.value);
    }

    /**
     * @notice Withdraw ETH using off-chain authorization
     */
    function withdraw(
        address recipient,
        uint256 amount,
        bytes32 nonce,
        bytes calldata signature
    ) external {
        require(address(this).balance >= amount, "Insufficient vault balance");

        // Ask AuthorizationManager if this withdrawal is allowed
        bool ok = authorizationManager.verifyAuthorization(
            address(this),
            recipient,
            amount,
            nonce,
            signature
        );
        require(ok, "Authorization failed");

        // Transfer ETH AFTER authorization succeeds
        (bool sent, ) = recipient.call{value: amount}("");
        require(sent, "ETH transfer failed");

        emit Withdrawal(recipient, amount);
    }
}
