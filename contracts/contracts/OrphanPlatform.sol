// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./IdeaNFT.sol";

/**
 * @title OrphanPlatform
 * @dev Main platform contract that orchestrates all operations
 */
contract OrphanPlatform is Ownable, ReentrancyGuard, Pausable {
    using Counters for Counters.Counter;
    
    // Contract references
    IdeaNFT public ideaNFT;
    
    // Configurable fees (in USDC, 6 decimals)
    uint256 public executorProposalFee = 10 * 10**6; // $10 USDC default
    uint256 public investorProposalFee = 20 * 10**6; // $20 USDC default
    uint256 public platformFeePercentage = 200; // 2% (200 basis points)
    
    // Fee distribution
    uint256 public innovatorRewardPercentage = 5000; // 50% of executor fee goes to innovator
    uint256 public executorRewardPercentage = 5000; // 50% of investor fee goes to executor
    
    address public usdcToken; // USDC token address
    bool public feesEnabled = true;
    
    // Structs
    struct User {
        address walletAddress;
        string name;
        string bio;
        string avatar;
        string location;
        string website;
        string twitter;
        string linkedin;
        string github;
        UserRole role;
        bool isOnboarded;
        uint256 createdAt;
        uint256 updatedAt;
    }
    
    struct ExecutorProposal {
        uint256 id;
        uint256 ideaNFTId;
        address executor;
        address innovator;
        string proposalTitle;
        string proposalDescription;
        Milestone[] milestones;
        uint256 estimatedTimeline;
        uint256 requestedEquity;
        string additionalTerms;
        ProposalStatus status;
        uint256 fee;
        uint256 createdAt;
        uint256 updatedAt;
    }
    
    struct InvestorProposal {
        uint256 id;
        uint256 projectNFTId;
        address investor;
        address executor;
        string proposalTitle;
        uint256 investmentAmount;
        uint256 requestedEquity;
        InvestmentTerms terms;
        ProposalStatus status;
        uint256 fee;
        uint256 createdAt;
        uint256 updatedAt;
    }
    
    struct Milestone {
        string title;
        string description;
        uint256 targetDate;
        uint256 reward;
        string[] verificationCriteria;
        MilestoneStatus status;
    }
    
    struct InvestmentTerms {
        PayoutSchedule[] payoutSchedule;
        string[] milestoneRequirements;
        string exitStrategy;
        string additionalTerms;
    }
    
    struct PayoutSchedule {
        uint256 milestoneId;
        uint256 amount;
        uint256 percentage;
        string[] conditions;
    }
    
    // Enums
    enum UserRole { INNOVATOR, EXECUTOR, INVESTOR }
    enum ProposalStatus { PENDING, ACCEPTED, REJECTED, WITHDRAWN }
    enum MilestoneStatus { PENDING, IN_PROGRESS, COMPLETED, FAILED }
    
    // State variables
    Counters.Counter private _proposalIds;
    Counters.Counter private _milestoneIds;
    
    mapping(address => User) public users;
    mapping(uint256 => ExecutorProposal) public executorProposals;
    mapping(uint256 => InvestorProposal) public investorProposals;
    mapping(uint256 => Milestone) public milestones;
    mapping(address => uint256[]) public userProposals;
    mapping(uint256 => uint256[]) public ideaProposals;
    
    // Events
    event UserRegistered(address indexed walletAddress, UserRole role, uint256 timestamp);
    event UserUpdated(address indexed walletAddress, uint256 timestamp);
    event ExecutorProposalSubmitted(
        uint256 indexed proposalId,
        uint256 indexed ideaNFTId,
        address indexed executor,
        uint256 timestamp
    );
    event ExecutorProposalUpdated(
        uint256 indexed proposalId,
        ProposalStatus status,
        uint256 timestamp
    );
    event InvestorProposalSubmitted(
        uint256 indexed proposalId,
        uint256 indexed projectNFTId,
        address indexed investor,
        uint256 timestamp
    );
    event InvestorProposalUpdated(
        uint256 indexed proposalId,
        ProposalStatus status,
        uint256 timestamp
    );
    event MilestoneCreated(uint256 indexed milestoneId, uint256 indexed proposalId, uint256 timestamp);
    event MilestoneUpdated(uint256 indexed milestoneId, MilestoneStatus status, uint256 timestamp);
    event FeeCollected(address indexed from, uint256 amount, string feeType, uint256 timestamp);
    
    // Modifiers
    modifier onlyRegisteredUser() {
        require(users[msg.sender].isOnboarded, "User not registered");
        _;
    }
    
    modifier onlyRole(UserRole role) {
        require(users[msg.sender].role == role, "Incorrect user role");
        _;
    }
    
    modifier proposalExists(uint256 proposalId) {
        require(executorProposals[proposalId].id != 0 || investorProposals[proposalId].id != 0, "Proposal does not exist");
        _;
    }
    
    modifier onlyProposalOwner(uint256 proposalId) {
        require(
            executorProposals[proposalId].executor == msg.sender || 
            investorProposals[proposalId].investor == msg.sender,
            "Not proposal owner"
        );
        _;
    }
    
    constructor(address _ideaNFT) Ownable() {
        ideaNFT = IdeaNFT(_ideaNFT);
    }
    
    /**
     * @dev Registers a new user
     * @param name User's name
     * @param bio User's bio
     * @param avatar User's avatar URI
     * @param location User's location
     * @param website User's website
     * @param twitter User's Twitter handle
     * @param linkedin User's LinkedIn profile
     * @param github User's GitHub profile
     * @param role User's role
     */
    function registerUser(
        string memory name,
        string memory bio,
        string memory avatar,
        string memory location,
        string memory website,
        string memory twitter,
        string memory linkedin,
        string memory github,
        UserRole role
    ) external {
        require(bytes(name).length > 0, "Name cannot be empty");
        require(role <= UserRole.INVESTOR, "Invalid role");
        require(!users[msg.sender].isOnboarded, "User already registered");
        
        users[msg.sender] = User({
            walletAddress: msg.sender,
            name: name,
            bio: bio,
            avatar: avatar,
            location: location,
            website: website,
            twitter: twitter,
            linkedin: linkedin,
            github: github,
            role: role,
            isOnboarded: true,
            createdAt: block.timestamp,
            updatedAt: block.timestamp
        });
        
        emit UserRegistered(msg.sender, role, block.timestamp);
    }
    
    /**
     * @dev Updates user profile
     * @param name New name
     * @param bio New bio
     * @param avatar New avatar URI
     * @param location New location
     * @param website New website
     * @param twitter New Twitter handle
     * @param linkedin New LinkedIn profile
     * @param github New GitHub profile
     */
    function updateUser(
        string memory name,
        string memory bio,
        string memory avatar,
        string memory location,
        string memory website,
        string memory twitter,
        string memory linkedin,
        string memory github
    ) external onlyRegisteredUser {
        User storage user = users[msg.sender];
        
        if (bytes(name).length > 0) user.name = name;
        if (bytes(bio).length > 0) user.bio = bio;
        if (bytes(avatar).length > 0) user.avatar = avatar;
        if (bytes(location).length > 0) user.location = location;
        if (bytes(website).length > 0) user.website = website;
        if (bytes(twitter).length > 0) user.twitter = twitter;
        if (bytes(linkedin).length > 0) user.linkedin = linkedin;
        if (bytes(github).length > 0) user.github = github;
        
        user.updatedAt = block.timestamp;
        
        emit UserUpdated(msg.sender, block.timestamp);
    }
    
    /**
     * @dev Submits an executor proposal
     * @param ideaNFTId The ID of the idea NFT
     * @param proposalTitle Title of the proposal
     * @param proposalDescription Description of the proposal
     * @param milestoneTitles Array of milestone titles
     * @param milestoneDescriptions Array of milestone descriptions
     * @param milestoneTargetDates Array of milestone target dates
     * @param milestoneRewards Array of milestone rewards
     * @param estimatedTimeline Estimated timeline in days
     * @param requestedEquity Requested equity percentage
     * @param additionalTerms Additional terms
     */
    function submitExecutorProposal(
        uint256 ideaNFTId,
        string memory proposalTitle,
        string memory proposalDescription,
        string[] memory milestoneTitles,
        string[] memory milestoneDescriptions,
        uint256[] memory milestoneTargetDates,
        uint256[] memory milestoneRewards,
        uint256 estimatedTimeline,
        uint256 requestedEquity,
        string memory additionalTerms
    ) external onlyRegisteredUser onlyRole(UserRole.EXECUTOR) nonReentrant {
        require(feesEnabled, "Fees are currently disabled");
        require(usdcToken != address(0), "USDC token not set");
        require(ideaNFT.ownerOf(ideaNFTId) != address(0), "Idea NFT does not exist");
        require(milestoneTitles.length > 0, "At least one milestone required");
        require(requestedEquity <= 95, "Equity cannot exceed 95%");
        
        _proposalIds.increment();
        uint256 proposalId = _proposalIds.current();
        
        // Create milestones
        Milestone[] memory proposalMilestones = new Milestone[](milestoneTitles.length);
        for (uint256 i = 0; i < milestoneTitles.length; i++) {
            _milestoneIds.increment();
            uint256 milestoneId = _milestoneIds.current();
            
            milestones[milestoneId] = Milestone({
                title: milestoneTitles[i],
                description: milestoneDescriptions[i],
                targetDate: milestoneTargetDates[i],
                reward: milestoneRewards[i],
                verificationCriteria: new string[](0),
                status: MilestoneStatus.PENDING
            });
            
            proposalMilestones[i] = milestones[milestoneId];
        }
        
        executorProposals[proposalId] = ExecutorProposal({
            id: proposalId,
            ideaNFTId: ideaNFTId,
            executor: msg.sender,
            innovator: ideaNFT.ownerOf(ideaNFTId),
            proposalTitle: proposalTitle,
            proposalDescription: proposalDescription,
            milestones: proposalMilestones,
            estimatedTimeline: estimatedTimeline,
            requestedEquity: requestedEquity,
            additionalTerms: additionalTerms,
            status: ProposalStatus.PENDING,
            fee: executorProposalFee,
            createdAt: block.timestamp,
            updatedAt: block.timestamp
        });
        
        // Update mappings
        userProposals[msg.sender].push(proposalId);
        ideaProposals[ideaNFTId].push(proposalId);
        
        // Collect USDC fee and distribute
        _collectAndDistributeFee(msg.sender, executorProposalFee, "executor_proposal");
        
        emit ExecutorProposalSubmitted(proposalId, ideaNFTId, msg.sender, block.timestamp);
    }
    
    /**
     * @dev Updates executor proposal status
     * @param proposalId The ID of the proposal
     * @param status New status
     */
    function updateExecutorProposalStatus(uint256 proposalId, ProposalStatus status) 
        external 
        proposalExists(proposalId) 
    {
        ExecutorProposal storage proposal = executorProposals[proposalId];
        require(
            msg.sender == proposal.innovator || msg.sender == proposal.executor,
            "Not authorized"
        );
        
        // Only innovator can accept/reject, executor can withdraw
        if (status == ProposalStatus.ACCEPTED || status == ProposalStatus.REJECTED) {
            require(msg.sender == proposal.innovator, "Only innovator can accept/reject");
        } else if (status == ProposalStatus.WITHDRAWN) {
            require(msg.sender == proposal.executor, "Only executor can withdraw");
        }
        
        proposal.status = status;
        proposal.updatedAt = block.timestamp;
        
        emit ExecutorProposalUpdated(proposalId, status, block.timestamp);
    }
    
    /**
     * @dev Gets all proposals for an idea
     * @param ideaNFTId The ID of the idea NFT
     * @return Array of proposal IDs
     */
    function getProposalsForIdea(uint256 ideaNFTId) external view returns (uint256[] memory) {
        return ideaProposals[ideaNFTId];
    }
    
    /**
     * @dev Gets user profile
     * @param userAddress The user's wallet address
     * @return User struct
     */
    function getUser(address userAddress) external view returns (User memory) {
        return users[userAddress];
    }
    
    /**
     * @dev Gets executor proposal
     * @param proposalId The ID of the proposal
     * @return ExecutorProposal struct
     */
    function getExecutorProposal(uint256 proposalId) external view returns (ExecutorProposal memory) {
        return executorProposals[proposalId];
    }
    
    /**
     * @dev Gets user proposals
     * @param userAddress The user's wallet address
     * @return Array of proposal IDs
     */
    function getUserProposals(address userAddress) external view returns (uint256[] memory) {
        return userProposals[userAddress];
    }
    
    /**
     * @dev Withdraws accumulated USDC fees (only owner)
     */
    function withdrawFees() external onlyOwner {
        require(usdcToken != address(0), "USDC token not set");
        uint256 balance = IERC20(usdcToken).balanceOf(address(this));
        require(balance > 0, "No fees to withdraw");
        
        IERC20(usdcToken).transfer(owner(), balance);
    }
    
    /**
     * @dev Emergency pause function (only owner)
     */
    function pause() external onlyOwner {
        _pause();
    }
    
    /**
     * @dev Unpause function (only owner)
     */
    function unpause() external onlyOwner {
        _unpause();
    }
    
    /**
     * @dev Set USDC token address (only owner)
     */
    function setUsdcToken(address _usdcToken) external onlyOwner {
        require(_usdcToken != address(0), "Invalid USDC address");
        usdcToken = _usdcToken;
    }
    
    /**
     * @dev Set executor proposal fee (only owner)
     */
    function setExecutorProposalFee(uint256 _fee) external onlyOwner {
        executorProposalFee = _fee;
    }
    
    /**
     * @dev Set investor proposal fee (only owner)
     */
    function setInvestorProposalFee(uint256 _fee) external onlyOwner {
        investorProposalFee = _fee;
    }
    
    /**
     * @dev Set fee distribution percentages (only owner)
     */
    function setFeeDistribution(uint256 _innovatorReward, uint256 _executorReward) external onlyOwner {
        require(_innovatorReward + _executorReward <= 10000, "Total percentage cannot exceed 100%");
        innovatorRewardPercentage = _innovatorReward;
        executorRewardPercentage = _executorReward;
    }
    
    /**
     * @dev Toggle fees on/off (only owner)
     */
    function toggleFees() external onlyOwner {
        feesEnabled = !feesEnabled;
    }
    
    /**
     * @dev Updates the IdeaNFT contract address (only owner)
     * @param _ideaNFT New IdeaNFT contract address
     */
    function updateIdeaNFT(address _ideaNFT) external onlyOwner {
        require(_ideaNFT != address(0), "Invalid address");
        ideaNFT = IdeaNFT(_ideaNFT);
    }
    
    /**
     * @dev Gets the total number of proposals
     * @return Total count
     */
    function getTotalProposals() external view returns (uint256) {
        return _proposalIds.current();
    }
    
    /**
     * @dev Gets the total number of milestones
     * @return Total count
     */
    function getTotalMilestones() external view returns (uint256) {
        return _milestoneIds.current();
    }
    
    /**
     * @dev Collects USDC fee and distributes according to percentages
     */
    function _collectAndDistributeFee(address from, uint256 feeAmount, string memory feeType) internal {
        // Transfer USDC from user to contract
        IERC20(usdcToken).transferFrom(from, address(this), feeAmount);
        
        // Calculate distributions
        uint256 platformFee = (feeAmount * platformFeePercentage) / 10000;
        uint256 remainingAmount = feeAmount - platformFee;
        
        if (keccak256(abi.encodePacked(feeType)) == keccak256(abi.encodePacked("executor_proposal"))) {
            // 50% goes to innovator, rest stays in contract
            // uint256 innovatorReward = (remainingAmount * innovatorRewardPercentage) / 10000;
            // TODO: Transfer to innovator when proposal is accepted
        } else if (keccak256(abi.encodePacked(feeType)) == keccak256(abi.encodePacked("investor_proposal"))) {
            // 50% goes to executor, rest stays in contract
            // uint256 executorReward = (remainingAmount * executorRewardPercentage) / 10000;
            // TODO: Transfer to executor when proposal is accepted
        }
        
        emit FeeCollected(from, feeAmount, feeType, block.timestamp);
    }
}
