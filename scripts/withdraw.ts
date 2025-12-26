import { ethers } from "ethers";
import { readFileSync } from "fs";

// Addresses from your deployment
const VAULT_ADDRESS = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";

function loadVaultArtifact() {
  return JSON.parse(
    readFileSync(
      "./artifacts/contracts/SecureVault.sol/SecureVault.json",
      "utf-8"
    )
  );
}

async function main() {
  const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");
  const signer = await provider.getSigner(0);
  const recipient = await signer.getAddress();

  const amount = ethers.parseEther("1");
  const nonce = ethers.randomBytes(32);
  const chainId = (await provider.getNetwork()).chainId;

  // Build authorization hash (off-chain)
  const messageHash = ethers.keccak256(
    ethers.solidityPacked(
      ["address","address","uint256","bytes32","uint256"],
      [VAULT_ADDRESS, recipient, amount, nonce, chainId]
    )
  );

  const signature = await signer.signMessage(ethers.getBytes(messageHash));
  console.log("Authorization created");

  // Call withdraw
  const vaultArtifact = loadVaultArtifact();
  const vault = new ethers.Contract(VAULT_ADDRESS, vaultArtifact.abi, signer);

  const tx = await vault.withdraw(recipient, amount, nonce, signature);
  await tx.wait();
  console.log("✅ Withdrawal successful");

  // Try replay (must fail)
  try {
    await vault.withdraw(recipient, amount, nonce, signature);
    console.log("❌ ERROR: replay unexpectedly succeeded");
  } catch {
    console.log("❌ Replay blocked (as expected)");
  }
}

main().catch(console.error);
