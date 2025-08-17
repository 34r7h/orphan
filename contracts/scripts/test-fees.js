const { ethers } = require("hardhat");

async function main() {
  console.log("🧪 Testing configurable fee system...\n");
  
  // Get the deployed contracts
  const IdeaNFT = await ethers.getContractFactory("IdeaNFT");
  const OrphanPlatform = await ethers.getContractFactory("OrphanPlatform");
  
  const ideaNFT = IdeaNFT.attach("0x01a0Be61d5678422473Ec489EF5Ef8eA1e7375e1");
  const orphanPlatform = OrphanPlatform.attach("0x11BCbCa2967E2EEfCf12820d6f0BE14d46eEbAD4");
  
  console.log("📊 Current fee configuration:");
  
  // Check IdeaNFT fees
  const mintFee = await ideaNFT.mintFee();
  const feesEnabled = await ideaNFT.feesEnabled();
  const usdcToken = await ideaNFT.usdcToken();
  
  console.log(`   IdeaNFT Mint Fee: ${ethers.formatUnits(mintFee, 6)} USDC`);
  console.log(`   Fees Enabled: ${feesEnabled}`);
  console.log(`   USDC Token: ${usdcToken}`);
  
  // Check OrphanPlatform fees
  const executorFee = await orphanPlatform.executorProposalFee();
  const investorFee = await orphanPlatform.investorProposalFee();
  const platformFeePercentage = await orphanPlatform.platformFeePercentage();
  const innovatorRewardPercentage = await orphanPlatform.innovatorRewardPercentage();
  const executorRewardPercentage = await orphanPlatform.executorRewardPercentage();
  const orphanFeesEnabled = await orphanPlatform.feesEnabled();
  const orphanUsdcToken = await orphanPlatform.usdcToken();
  
  console.log(`   Executor Proposal Fee: ${ethers.formatUnits(executorFee, 6)} USDC`);
  console.log(`   Investor Proposal Fee: ${ethers.formatUnits(investorFee, 6)} USDC`);
  console.log(`   Platform Fee %: ${Number(platformFeePercentage) / 100}%`);
  console.log(`   Innovator Reward %: ${Number(innovatorRewardPercentage) / 100}%`);
  console.log(`   Executor Reward %: ${Number(executorRewardPercentage) / 100}%`);
  console.log(`   Fees Enabled: ${orphanFeesEnabled}`);
  console.log(`   USDC Token: ${orphanUsdcToken}`);
  
  console.log("\n✅ Fee configuration test completed!");
  console.log("\n📝 Next steps:");
  console.log("   1. Set USDC token address on both contracts");
  console.log("   2. Test fee collection with actual USDC transfers");
  console.log("   3. Verify fee distribution works correctly");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Test failed:", error);
    process.exit(1);
  });
