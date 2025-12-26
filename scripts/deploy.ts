import { readFileSync } from "fs";
import { ethers } from "ethers";

// helper to load compiled artifacts
function loadArtifact(name: string) {
  const artifactPath = `./artifacts/contracts/${name}.sol/${name}.json`;
  return JSON.parse(readFileSync(artifactPath, "utf-8"));
}

async function main() {
  // 1️⃣ connect to local hardhat node (WINDOW 1)
  const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");

  // 2️⃣ use Account #0 from hardhat node
  const signer = await provider.getSigner(0);
  console.log("Deploying with:", await signer.getAddress());

  // 3️⃣ load AuthorizationManager artifact
  const authArtifact = loadArtifact("AuthorizationManager");
  const AuthFactory = new ethers.ContractFactory(
    authArtifact.abi,
    authArtifact.bytecode,
    signer
  );

  const authManager = await AuthFactory.deploy();
  await authManager.waitForDeployment();
  const authAddress = await authManager.getAddress();
  console.log("AuthorizationManager deployed at:", authAddress);

  await (await authManager.initialize(await signer.getAddress())).wait();
  console.log("AuthorizationManager initialized");

  // 4️⃣ load SecureVault artifact
  const vaultArtifact = loadArtifact("SecureVault");
  const VaultFactory = new ethers.ContractFactory(
    vaultArtifact.abi,
    vaultArtifact.bytecode,
    signer
  );

  const vault = await VaultFactory.deploy();
  await vault.waitForDeployment();
  const vaultAddress = await vault.getAddress();
  console.log("SecureVault deployed at:", vaultAddress);

  await (await vault.initialize(authAddress)).wait();
  console.log("SecureVault initialized");

  console.log("✅ DEPLOYMENT SUCCESSFUL");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
