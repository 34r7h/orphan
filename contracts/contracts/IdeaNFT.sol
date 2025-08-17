// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/interfaces/IERC2981.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/**
 * @title IdeaNFT
 * @dev ERC-721 NFT contract for representing innovative ideas
 * @dev Implements royalty mechanism and metadata storage
 */
contract IdeaNFT is ERC721, ERC721URIStorage, Ownable, IERC2981, ReentrancyGuard, Pausable {
    using Counters for Counters.Counter;
    
    Counters.Counter private _tokenIds;
    
    // Constants
    uint256 public constant ROYALTY_PERCENTAGE = 500; // 5% (500 basis points)
    
    // Configurable fees (in USDC, 6 decimals)
    uint256 public mintFee = 5 * 10**6; // $5 USDC default
    address public usdcToken; // USDC token address
    bool public feesEnabled = true;
    
    // Structs
    struct Idea {
        uint256 tokenId;
        address innovator;
        string title;
        string description;
        string category;
        string[] tags;
        string imageUri;
        string metadataUri;
        uint256 createdAt;
        uint256 updatedAt;
        bool isActive;
    }
    
    // State variables
    mapping(uint256 => Idea) public ideas;
    mapping(address => uint256[]) public innovatorIdeas;
    mapping(string => uint256[]) public categoryIdeas;
    
    // Events
    event IdeaCreated(
        uint256 indexed tokenId,
        address indexed innovator,
        string title,
        string category,
        uint256 timestamp
    );
    
    event IdeaUpdated(
        uint256 indexed tokenId,
        address indexed innovator,
        uint256 timestamp
    );
    
    event RoyaltyPaid(
        uint256 indexed tokenId,
        address indexed innovator,
        uint256 amount,
        uint256 timestamp
    );
    
    // Modifiers
    modifier onlyInnovator(uint256 tokenId) {
        require(_exists(tokenId), "Idea does not exist");
        require(ideas[tokenId].innovator == msg.sender, "Only innovator can modify");
        _;
    }
    
    modifier ideaExists(uint256 tokenId) {
        require(_exists(tokenId), "Idea does not exist");
        _;
    }
    
    constructor() ERC721("Orphan Idea NFT", "IDEA") Ownable() {}
    
    /**
     * @dev Creates a new idea NFT
     * @param title The title of the idea
     * @param description The description of the idea
     * @param category The category of the idea
     * @param tags Array of tags for the idea
     * @param imageUri URI to the idea's image
     * @param metadataUri URI to the idea's metadata
     */
    function createIdea(
        string memory title,
        string memory description,
        string memory category,
        string[] memory tags,
        string memory imageUri,
        string memory metadataUri
    ) external nonReentrant returns (uint256) {
        require(feesEnabled, "Fees are currently disabled");
        require(usdcToken != address(0), "USDC token not set");
        require(bytes(title).length > 0, "Title cannot be empty");
        require(bytes(description).length > 0, "Description cannot be empty");
        require(bytes(category).length > 0, "Category cannot be empty");
        require(tags.length > 0, "At least one tag is required");
        
        _tokenIds.increment();
        uint256 newTokenId = _tokenIds.current();
        
        // Create the idea
        ideas[newTokenId] = Idea({
            tokenId: newTokenId,
            innovator: msg.sender,
            title: title,
            description: description,
            category: category,
            tags: tags,
            imageUri: imageUri,
            metadataUri: metadataUri,
            createdAt: block.timestamp,
            updatedAt: block.timestamp,
            isActive: true
        });
        
        // Update mappings
        innovatorIdeas[msg.sender].push(newTokenId);
        categoryIdeas[category].push(newTokenId);
        
        // Collect USDC fee
        IERC20(usdcToken).transferFrom(msg.sender, address(this), mintFee);
        
        // Mint the NFT
        _safeMint(msg.sender, newTokenId);
        _setTokenURI(newTokenId, metadataUri);
        
        emit IdeaCreated(newTokenId, msg.sender, title, category, block.timestamp);
        
        return newTokenId;
    }
    
    /**
     * @dev Updates an existing idea
     * @param tokenId The ID of the idea to update
     * @param title New title (optional)
     * @param description New description (optional)
     * @param category New category (optional)
     * @param tags New tags (optional)
     * @param imageUri New image URI (optional)
     * @param metadataUri New metadata URI (optional)
     */
    function updateIdea(
        uint256 tokenId,
        string memory title,
        string memory description,
        string memory category,
        string[] memory tags,
        string memory imageUri,
        string memory metadataUri
    ) external onlyInnovator(tokenId) {
        Idea storage idea = ideas[tokenId];
        
        if (bytes(title).length > 0) {
            idea.title = title;
        }
        if (bytes(description).length > 0) {
            idea.description = description;
        }
        if (bytes(category).length > 0) {
            // Remove from old category
            _removeFromCategory(idea.category, tokenId);
            idea.category = category;
            categoryIdeas[category].push(tokenId);
        }
        if (tags.length > 0) {
            idea.tags = tags;
        }
        if (bytes(imageUri).length > 0) {
            idea.imageUri = imageUri;
        }
        if (bytes(metadataUri).length > 0) {
            idea.metadataUri = metadataUri;
            _setTokenURI(tokenId, metadataUri);
        }
        
        idea.updatedAt = block.timestamp;
        
        emit IdeaUpdated(tokenId, msg.sender, block.timestamp);
    }
    
    /**
     * @dev Deactivates an idea (only innovator can do this)
     * @param tokenId The ID of the idea to deactivate
     */
    function deactivateIdea(uint256 tokenId) external onlyInnovator(tokenId) {
        ideas[tokenId].isActive = false;
        ideas[tokenId].updatedAt = block.timestamp;
        
        emit IdeaUpdated(tokenId, msg.sender, block.timestamp);
    }
    
    /**
     * @dev Reactivates a deactivated idea
     * @param tokenId The ID of the idea to reactivate
     */
    function reactivateIdea(uint256 tokenId) external onlyInnovator(tokenId) {
        ideas[tokenId].isActive = true;
        ideas[tokenId].updatedAt = block.timestamp;
        
        emit IdeaUpdated(tokenId, msg.sender, block.timestamp);
    }
    
    /**
     * @dev Gets all ideas by an innovator
     * @param innovator The address of the innovator
     * @return Array of token IDs
     */
    function getIdeasByInnovator(address innovator) external view returns (uint256[] memory) {
        return innovatorIdeas[innovator];
    }
    
    /**
     * @dev Gets all ideas by category
     * @param category The category to filter by
     * @return Array of token IDs
     */
    function getIdeasByCategory(string memory category) external view returns (uint256[] memory) {
        return categoryIdeas[category];
    }
    
    /**
     * @dev Gets idea details by token ID
     * @param tokenId The ID of the idea
     * @return Idea struct
     */
    function getIdea(uint256 tokenId) external view ideaExists(tokenId) returns (Idea memory) {
        return ideas[tokenId];
    }
    
    /**
     * @dev Gets the total number of ideas
     * @return Total count
     */
    function getTotalIdeas() external view returns (uint256) {
        return _tokenIds.current();
    }
    
    /**
     * @dev Implements ERC-2981 royalty standard
     * @param tokenId The token ID
     * @param salePrice The sale price
     * @return receiver The royalty receiver (innovator)
     * @return royaltyAmount The royalty amount (5% of sale price)
     */
    function royaltyInfo(uint256 tokenId, uint256 salePrice) 
        external 
        view 
        override 
        returns (address receiver, uint256 royaltyAmount) 
    {
        require(_exists(tokenId), "Idea does not exist");
        receiver = ideas[tokenId].innovator;
        royaltyAmount = (salePrice * ROYALTY_PERCENTAGE) / 10000; // 5% of sale price
    }
    
    /**
     * @dev Returns the royalty receiver for a token
     * @param tokenId The token ID
     * @return The royalty receiver address
     */
    function royaltyReceiver(uint256 tokenId) external view ideaExists(tokenId) returns (address) {
        return ideas[tokenId].innovator;
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
     * @dev Set USDC token address (only owner)
     */
    function setUsdcToken(address _usdcToken) external onlyOwner {
        require(_usdcToken != address(0), "Invalid USDC address");
        usdcToken = _usdcToken;
    }
    
    /**
     * @dev Set mint fee (only owner)
     */
    function setMintFee(uint256 _mintFee) external onlyOwner {
        mintFee = _mintFee;
    }
    
    /**
     * @dev Toggle fees on/off (only owner)
     */
    function toggleFees() external onlyOwner {
        feesEnabled = !feesEnabled;
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
    
    // Internal functions
    
    function _removeFromCategory(string memory category, uint256 tokenId) internal {
        uint256[] storage categoryList = categoryIdeas[category];
        for (uint256 i = 0; i < categoryList.length; i++) {
            if (categoryList[i] == tokenId) {
                categoryList[i] = categoryList[categoryList.length - 1];
                categoryList.pop();
                break;
            }
        }
    }
    
    // Override functions
    
    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }
    
    function tokenURI(uint256 tokenId) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }
    
    function supportsInterface(bytes4 interfaceId) public view override(ERC721, ERC721URIStorage, IERC165) returns (bool) {
        return interfaceId == type(IERC2981).interfaceId || super.supportsInterface(interfaceId);
    }
    
    function _beforeTokenTransfer(address from, address to, uint256 tokenId, uint256 batchSize) internal override {
        super._beforeTokenTransfer(from, to, tokenId, batchSize);
    }
    
    function _afterTokenTransfer(address from, address to, uint256 tokenId, uint256 batchSize) internal override {
        super._afterTokenTransfer(from, to, tokenId, batchSize);
    }
}
