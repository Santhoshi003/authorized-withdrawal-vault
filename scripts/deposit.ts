import { ethers } from "ethers";

// Vault address from your successful deployment
const VAULT_ADDRESS = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";

async function main() {
  // Connect to the local Hardhat node (Window 1)
  const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");

  // Use Account #0 (has 10000 ETH)
  const signer = await provider.getSigner(0);

  console.log("Depositing from:", await signer.getAddress());

  // Send 5 ETH to the vault
  const tx = await signer.sendTransaction({
    to: VAULT_ADDRESS,
    value: ethers.parseEther("5")
  });

  await tx.wait();
  console.log("✅ Deposit successful");
}

main().catch(console.error);
