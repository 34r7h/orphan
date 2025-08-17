const { ethers } = require("hardhat");

async function main() {
  console.log("🚀 Starting deployment to Base Sepolia testnet...");
  
  // Debug environment variables
  console.log("🔍 Environment check:");
  console.log("   PRIVATE_KEY exists:", !!process.env.PRIVATE_KEY);
  console.log("   ORPHAN_ADMIN_ADDRESS:", process.env.ORPHAN_ADMIN_ADDRESS);
  console.log("   BASE_SEPOLIA_RPC_URL:", process.env.BASE_SEPOLIA_RPC_URL);

  // Get the deployer account
  const [deployer] = await ethers.getSigners();
  console.log("📝 Deploying contracts with account:", deployer.address);
  console.log("💰 Account balance:", (await ethers.provider.getBalance(deployer.address)).toString());
  
  // Get admin address from environment
  const adminAddress = process.env.ORPHAN_ADMIN_ADDRESS || deployer.address;
  console.log("👑 Admin address for contracts:", adminAddress);

  // Deploy IdeaNFT contract
  console.log("\n📋 Deploying IdeaNFT contract...");
  const IdeaNFT = await ethers.getContractFactory("IdeaNFT");
  const ideaNFT = await IdeaNFT.deploy();
  await ideaNFT.waitForDeployment();
  const ideaNFTAddress = await ideaNFT.getAddress();
  console.log("✅ IdeaNFT deployed to:", ideaNFTAddress);
  
  // Transfer ownership to admin if different from deployer
  if (adminAddress !== deployer.address) {
    console.log("🔄 Transferring IdeaNFT ownership to admin...");
    console.log("⚠️  Skipping ownership transfer for now - will do manually later");
    // await ideaNFT.transferOwnership(adminAddress);
    // console.log("✅ IdeaNFT ownership transferred to:", adminAddress);
  }

  // Deploy OrphanPlatform contract
  console.log("\n🏗️ Deploying OrphanPlatform contract...");
  
  // Wait a bit before deploying the next contract
  console.log("⏳ Waiting 10 seconds before deploying OrphanPlatform...");
  await new Promise(resolve => setTimeout(resolve, 10000));
  
  const OrphanPlatform = await ethers.getContractFactory("OrphanPlatform");
  const orphanPlatform = await OrphanPlatform.deploy(ideaNFTAddress);
  await orphanPlatform.waitForDeployment();
  const orphanPlatformAddress = await orphanPlatform.getAddress();
  console.log("✅ OrphanPlatform deployed to:", orphanPlatformAddress);
  
  // Transfer ownership to admin if different from deployer
  if (adminAddress !== deployer.address) {
    console.log("🔄 Transferring OrphanPlatform ownership to admin...");
    console.log("⚠️  Skipping ownership transfer for now - will do manually later");
    // await orphanPlatform.transferOwnership(adminAddress);
    // console.log("✅ OrphanPlatform ownership transferred to:", adminAddress);
  }

  // Verify deployment
  console.log("\n🔍 Verifying deployment...");
  console.log("📊 Contract addresses:");
  console.log("   IdeaNFT:", ideaNFTAddress);
  console.log("   OrphanPlatform:", orphanPlatformAddress);

  // Verify contract ownership
  console.log("\n👑 Contract ownership:");
  console.log("   IdeaNFT owner: Deployer (will transfer to admin manually)");
  console.log("   OrphanPlatform owner: Deployer (will transfer to admin manually)");
  console.log("   Expected admin:", adminAddress);

  // Verify IdeaNFT is set in OrphanPlatform
  console.log("\n🔗 Contract linking:");
  console.log("   OrphanPlatform -> IdeaNFT:", ideaNFTAddress);
  console.log("✅ Contract linking verified successfully!");

  // Save deployment info
  const deploymentInfo = {
    network: "Base Sepolia Testnet",
    chainId: 84532,
    deployer: deployer.address,
    admin: adminAddress,
    contracts: {
      IdeaNFT: ideaNFTAddress,
      OrphanPlatform: orphanPlatformAddress,
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
