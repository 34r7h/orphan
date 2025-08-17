import { ethers } from 'ethers';
import { getContractAddresses, getNetworkConfig, getPlatformConfig } from '../config/contracts';

// Get contract addresses and network config
const CONTRACT_ADDRESSES = getContractAddresses('baseSepolia');
const NETWORK_CONFIG = getNetworkConfig('baseSepolia');
const PLATFORM_CONFIG = getPlatformConfig();

// Simple ABI for basic contract interactions
const IDEA_NFT_ABI = [
  'function createIdea(string title, string description, string category, string[] tags, string imageUri, string metadataUri) external returns (uint256)',
  'function getIdea(uint256 tokenId) external view returns (tuple(uint256,address,string,string,string,string[],string,string,uint256,uint256,bool))',
  'function getIdeasByInnovator(address innovator) external view returns (uint256[])',
  'function getTotalIdeas() external view returns (uint256)'
];

const ORPHAN_PLATFORM_ABI = [
  'function registerUser(string name, string email, string role, string profileImage) external',
  'function getUser(address userAddress) external view returns (tuple(string,string,string,string,uint256,uint256))',
  'function submitExecutorProposal(uint256 ideaNFTId, string proposalTitle, string proposalDescription, string[] milestoneTitles, string[] milestoneDescriptions, uint256[] milestoneTargetDates, uint256[] milestoneRewards, uint256 estimatedTimeline, uint256 requestedEquity, string additionalTerms) external'
];

export class BlockchainService {
  private provider: ethers.BrowserProvider | null = null;
  private signer: ethers.JsonRpcSigner | null = null;

  constructor() {
    this.initializeProvider();
  }

  private initializeProvider() {
    if (typeof window !== 'undefined' && (window as any).ethereum) {
      this.provider = new ethers.BrowserProvider((window as any).ethereum);
    }
  }

  /**
   * Connects to the user's wallet
   */
  async connectWallet(): Promise<string> {
    if (!this.provider) {
      throw new Error('No provider available');
    }

    try {
      // Request account access
      const accounts = await this.provider.send('eth_requestAccounts', []);
      const account = accounts[0];
      
      // Get signer
      this.signer = await this.provider.getSigner();
      
      // Switch to Base Sepolia if not already on it
      await this.switchToBaseSepolia();
      
      return account;
    } catch (error) {
      console.error('Error connecting wallet:', error);
      throw new Error('Failed to connect wallet');
    }
  }

  /**
   * Switches to Base Sepolia testnet
   */
  private async switchToBaseSepolia() {
    if (!this.provider) return;

    try {
      const chainId = await this.provider.send('eth_chainId', []);
      
      if (chainId !== NETWORK_CONFIG.chainId) {
        await this.provider.send('wallet_switchEthereumChain', [
          { chainId: NETWORK_CONFIG.chainId }
        ]);
      }
    } catch (error: any) {
      // If the chain doesn't exist, add it
      if (error.code === 4902) {
        await this.provider.send('wallet_addEthereumChain', [
          NETWORK_CONFIG
        ]);
      } else {
        console.error('Error switching to Base Sepolia:', error);
      }
    }
  }

  /**
   * Creates a new idea NFT
   */
  async createIdeaNFT(ideaData: {
    title: string;
    description: string;
    category: string;
    tags: string[];
    imageUri: string;
    metadataUri: string;
  }): Promise<{ tokenId: number; txHash: string }> {
    if (!this.signer) {
      throw new Error('Wallet not connected');
    }

    try {
      const contract = new ethers.Contract(CONTRACT_ADDRESSES.ideaNFT, IDEA_NFT_ABI, this.signer);
      
      // For now, we'll use a placeholder fee since USDC isn't configured yet
      // This will be updated once USDC is properly integrated
      const mintFee = ethers.parseEther('0.001'); // Small ETH fee for testing
      
      // Create the transaction
      const tx = await contract.createIdea(
        ideaData.title,
        ideaData.description,
        ideaData.category,
        ideaData.tags,
        ideaData.imageUri,
        ideaData.metadataUri,
        { value: mintFee }
      );
      
      console.log('Transaction sent:', tx.hash);
      
      // Wait for transaction to be mined
      const receipt = await tx.wait();
      console.log('Transaction confirmed:', receipt);
      
      // For now, return a placeholder token ID since the contract might not emit events yet
      // This will be updated once the contract is fully tested
      const tokenId = 1; // Placeholder
      
      return {
        tokenId,
        txHash: tx.hash
      };
    } catch (error) {
      console.error('Error creating idea NFT:', error);
      throw new Error('Failed to create idea NFT');
    }
  }

  /**
   * Gets ideas by innovator address
   */
  async getIdeasByInnovator(innovatorAddress: string): Promise<number[]> {
    if (!this.provider) {
      throw new Error('No provider available');
    }

    try {
      const contract = new ethers.Contract(CONTRACT_ADDRESSES.ideaNFT, IDEA_NFT_ABI, this.provider);
      const tokenIds = await contract.getIdeasByInnovator(innovatorAddress);
      return tokenIds.map((id: any) => Number(id));
    } catch (error) {
      console.error('Error getting ideas by innovator:', error);
      return [];
    }
  }

  /**
   * Gets idea details by token ID
   */
  async getIdea(tokenId: number): Promise<any> {
    if (!this.provider) {
      throw new Error('No provider available');
    }

    try {
      const contract = new ethers.Contract(CONTRACT_ADDRESSES.ideaNFT, IDEA_NFT_ABI, this.provider);
      const idea = await contract.getIdea(tokenId);
      return idea;
    } catch (error) {
      console.error('Error getting idea:', error);
      throw new Error('Failed to get idea');
    }
  }

  /**
   * Gets total number of ideas
   */
  async getTotalIdeas(): Promise<number> {
    if (!this.provider) {
      throw new Error('No provider available');
    }

    try {
      const contract = new ethers.Contract(CONTRACT_ADDRESSES.ideaNFT, IDEA_NFT_ABI, this.provider);
      const total = await contract.getTotalIdeas();
      return Number(total);
    } catch (error) {
      console.error('Error getting total ideas:', error);
      return 0;
    }
  }

  /**
   * Registers a new user
   */
  async registerUser(userData: {
    name: string;
    email: string;
    role: string;
    profileImage: string;
  }): Promise<string> {
    if (!this.signer) {
      throw new Error('Wallet not connected');
    }

    try {
      const contract = new ethers.Contract(CONTRACT_ADDRESSES.orphanPlatform, ORPHAN_PLATFORM_ABI, this.signer);
      
      const tx = await contract.registerUser(
        userData.name,
        userData.email,
        userData.role,
        userData.profileImage
      );
      
      console.log('User registration transaction sent:', tx.hash);
      
      // Wait for transaction to be mined
      const receipt = await tx.wait();
      console.log('User registration confirmed:', receipt);
      
      return tx.hash;
    } catch (error) {
      console.error('Error registering user:', error);
      throw new Error('Failed to register user');
    }
  }

  /**
   * Gets user profile
   */
  async getUser(userAddress: string): Promise<any> {
    if (!this.provider) {
      throw new Error('No provider available');
    }

    try {
      const contract = new ethers.Contract(CONTRACT_ADDRESSES.orphanPlatform, ORPHAN_PLATFORM_ABI, this.provider);
      const user = await contract.getUser(userAddress);
      return user;
    } catch (error) {
      console.error('Error getting user:', error);
      throw new Error('Failed to get user');
    }
  }

  /**
   * Submits an executor proposal
   */
  async submitExecutorProposal(proposalData: {
    ideaNFTId: number;
    proposalTitle: string;
    proposalDescription: string;
    milestoneTitles: string[];
    milestoneDescriptions: string[];
    milestoneTargetDates: number[];
    milestoneRewards: number[];
    estimatedTimeline: number;
    requestedEquity: number;
    additionalTerms: string;
  }): Promise<string> {
    if (!this.signer) {
      throw new Error('Wallet not connected');
    }

    try {
      const contract = new ethers.Contract(CONTRACT_ADDRESSES.orphanPlatform, ORPHAN_PLATFORM_ABI, this.signer);
      
      const tx = await contract.submitExecutorProposal(
        proposalData.ideaNFTId,
        proposalData.proposalTitle,
        proposalData.proposalDescription,
        proposalData.milestoneTitles,
        proposalData.milestoneDescriptions,
        proposalData.milestoneTargetDates,
        proposalData.milestoneRewards,
        proposalData.estimatedTimeline,
        proposalData.requestedEquity,
        proposalData.additionalTerms
      );
      
      console.log('Executor proposal transaction sent:', tx.hash);
      
      // Wait for transaction to be mined
      const receipt = await tx.wait();
      console.log('Executor proposal confirmed:', receipt);
      
      return tx.hash;
    } catch (error) {
      console.error('Error submitting executor proposal:', error);
      throw new Error('Failed to submit executor proposal');
    }
  }
}
