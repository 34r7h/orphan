import { ethers } from "hardhat";

async function main() {
  console.log("🚀 Starting deployment to Base Sepolia testnet...");

  // Get the deployer account
  const [deployer] = await ethers.getSigners();
  console.log("📝 Deploying contracts with account:", deployer.address);
  console.log("💰 Account balance:", (await deployer.getBalance()).toString());
  
  // Get admin address from environment
  const adminAddress = process.env.ORPHAN_ADMIN_ADDRESS || deployer.address;
  console.log("👑 Admin address for contracts:", adminAddress);

  // Deploy IdeaNFT contract
  console.log("\n📋 Deploying IdeaNFT contract...");
  const IdeaNFT = await ethers.getContractFactory("IdeaNFT");
  const ideaNFT = await IdeaNFT.deploy();
  await ideaNFT.deployed();
  console.log("✅ IdeaNFT deployed to:", ideaNFT.address);
  
  // Transfer ownership to admin if different from deployer
  if (adminAddress !== deployer.address) {
    console.log("🔄 Transferring IdeaNFT ownership to admin...");
    await ideaNFT.transferOwnership(adminAddress);
    console.log("✅ IdeaNFT ownership transferred to:", adminAddress);
  }

  // Deploy OrphanPlatform contract
  console.log("\n🏗️ Deploying OrphanPlatform contract...");
  const OrphanPlatform = await ethers.getContractFactory("OrphanPlatform");
  const orphanPlatform = await OrphanPlatform.deploy(ideaNFT.address);
  await orphanPlatform.deployed();
  console.log("✅ OrphanPlatform deployed to:", orphanPlatform.address);
  
  // Transfer ownership to admin if different from deployer
  if (adminAddress !== deployer.address) {
    console.log("🔄 Transferring OrphanPlatform ownership to admin...");
    await orphanPlatform.transferOwnership(adminAddress);
    console.log("✅ OrphanPlatform ownership transferred to:", adminAddress);
  }

  // Verify deployment
  console.log("\n🔍 Verifying deployment...");
  console.log("📊 Contract addresses:");
  console.log("   IdeaNFT:", ideaNFT.address);
  console.log("   OrphanPlatform:", orphanPlatform.address);

  // Verify contract ownership
  const ideaNFTOwner = await ideaNFT.owner();
  const platformOwner = await orphanPlatform.owner();
  
  console.log("\n👑 Contract ownership:");
  console.log("   IdeaNFT owner:", ideaNFTOwner);
  console.log("   OrphanPlatform owner:", platformOwner);
  console.log("   Expected admin:", adminAddress);

  // Verify IdeaNFT is set in OrphanPlatform
  const platformIdeaNFT = await orphanPlatform.ideaNFT();
  console.log("\n🔗 Contract linking:");
  console.log("   OrphanPlatform -> IdeaNFT:", platformIdeaNFT);

  if (platformIdeaNFT === ideaNFT.address) {
    console.log("✅ Contract linking verified successfully!");
  } else {
    console.log("❌ Contract linking verification failed!");
  }

  // Save deployment info
  const deploymentInfo = {
    network: "Base Sepolia Testnet",
    chainId: 84532,
    deployer: deployer.address,
    admin: adminAddress,
    contracts: {
      IdeaNFT: ideaNFT.address,
      OrphanPlatform: orphanPlatform.address,
    },
    deploymentTime: new Date().toISOString(),
  };

  console.log("\n📄 Deployment Summary:");
  console.log(JSON.stringify(deploymentInfo, null, 2));

  console.log("\n🎉 Deployment completed successfully!");
  console.log("\n📝 Next steps:");
  console.log("   1. Fund your wallet with Base Sepolia ETH");
  console.log("   2. Test the contracts with the test script");
  console.log("   3. Update frontend configuration with new addresses");
  console.log("   4. Verify contracts on Base Sepolia explorer");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });
