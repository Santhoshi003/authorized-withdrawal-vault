# Authorization-Governed Secure Vault System

## Overview
This project implements a **secure Ethereum vault** where withdrawals are allowed **only after explicit on-chain authorization validation**.  
The design separates **fund custody** from **permission verification**, reflecting real-world decentralized security architectures.

---

## System Design
The system is composed of **two smart contracts**:

### SecureVault
- Holds ETH securely
- Accepts deposits from any address
- Executes withdrawals only after authorization approval
- Does **not** verify signatures directly

### AuthorizationManager
- Validates off-chain generated withdrawal permissions
- Enforces **one-time authorization usage**
- Prevents replay attacks

The vault relies exclusively on the AuthorizationManager for permission validation.

---

## Authorization Rules
Each withdrawal authorization is cryptographically bound to:
- Vault contract address
- Blockchain network (chain ID)
- Recipient address
- Withdrawal amount
- Unique nonce

Once an authorization is successfully used, it is permanently invalidated on-chain.

---

## Security Guarantees
- Unauthorized withdrawals always revert
- Replay attacks are blocked
- State updates occur before ETH transfers
- Initialization functions execute only once
- Cross-contract interactions cannot produce duplicate effects

---

## Deployment & Execution
The entire system is Dockerized for reproducible evaluation.

``bash
- docker-compose up --build
- Running this command automatically:
- Starts a local blockchain
- Compiles the contracts
- Deploys and initializes AuthorizationManager
- Deploys and initializes SecureVault
- Prints deployed contract addresses to logs
