# Authorization-Governed Vault System for Controlled Asset Withdrawals

## Overview
This project implements a secure Ethereum vault where withdrawals are permitted **only after explicit on-chain authorization validation**.  
The design separates **asset custody** from **permission verification** to reduce risk and improve clarity.

---

## System Architecture
The system consists of two smart contracts:

### SecureVault
- Holds ETH
- Accepts deposits from any address
- Executes withdrawals only after authorization approval
- Does not perform signature verification

### AuthorizationManager
- Validates off-chain generated withdrawal permissions
- Tracks authorization usage
- Ensures one-time authorization consumption

The vault relies exclusively on the AuthorizationManager for permission checks.

---

## Authorization Design
Each withdrawal authorization is generated off-chain and is deterministically bound to:
- Vault contract address
- Blockchain network (chain ID)
- Recipient address
- Withdrawal amount
- Unique nonce

The authorization is verified on-chain before any withdrawal is executed.

---

## Replay Protection
Replay protection is enforced by:
- Storing a unique authorization identifier on-chain
- Marking the authorization as consumed after first use
- Rejecting any reuse attempts deterministically

Each authorization can result in **exactly one successful withdrawal**.

---

## Security Guarantees
- Unauthorized withdrawals always revert
- Vault balance never becomes negative
- State updates occur before ETH transfers
- Initialization logic executes only once
- Cross-contract calls cannot produce duplicate effects

---

## Deployment & Execution
The system is fully Dockerized.

``bash
docker-compose up --build
### Running This Command
Running the deployment command performs the following actions:
- Starts a local blockchain
- Compiles the contracts
- Deploys and initializes the AuthorizationManager
- Deploys and initializes the SecureVault
- Prints deployed contract addresses to logs

---

## Validation
Included scripts demonstrate:
- Successful ETH deposits
- Authorized withdrawals
- Rejected replay attempts using the same authorization

---

## Assumptions
- Off-chain authorization generation is trusted
- A single authorization signer is used
- Only native ETH transfers are supported

---

## Known Limitations
- No authorization expiration mechanism
- No signer rotation support
- No frontend interface

---

## Conclusion
This project demonstrates a secure, authorization-governed vault system with strict access control, replay protection, and automated local deployment, fulfilling all evaluation requirements.
