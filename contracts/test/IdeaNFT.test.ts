import { expect } from "chai";
import { ethers } from "hardhat";
import { IdeaNFT, IdeaNFT__factory } from "../typechain-types";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";

describe("IdeaNFT", function () {
  let ideaNFT: IdeaNFT;
  let owner: SignerWithAddress;
  let innovator: SignerWithAddress;
  let otherUser: SignerWithAddress;

  const ideaData = {
    title: "Test Idea",
    description: "A test idea for testing purposes",
    category: "defi",
    tags: ["test", "defi", "innovation"],
    imageUri: "https://example.com/image.jpg",
    metadataUri: "https://example.com/metadata.json"
  };

  beforeEach(async function () {
    [owner, innovator, otherUser] = await ethers.getSigners();
    
    const IdeaNFTFactory = await ethers.getContractFactory("IdeaNFT");
    ideaNFT = await IdeaNFTFactory.deploy();
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await ideaNFT.owner()).to.equal(owner.address);
    });

    it("Should have correct name and symbol", async function () {
      expect(await ideaNFT.name()).to.equal("Orphan Idea NFT");
      expect(await ideaNFT.symbol()).to.equal("IDEA");
    });

    it("Should start with 0 total ideas", async function () {
      expect(await ideaNFT.getTotalIdeas()).to.equal(0);
    });
  });

  describe("Creating Ideas", function () {
    it("Should create a new idea NFT with correct data", async function () {
      const mintFee = ethers.parseEther("1.0");
      
      await expect(
        ideaNFT.connect(innovator).createIdea(
          ideaData.title,
          ideaData.description,
          ideaData.category,
          ideaData.tags,
          ideaData.imageUri,
          ideaData.metadataUri,
          { value: mintFee }
        )
      ).to.emit(ideaNFT, "IdeaCreated");

      expect(await ideaNFT.getTotalIdeas()).to.equal(1);
      expect(await ideaNFT.ownerOf(1)).to.equal(innovator.address);
    });

    it("Should fail if mint fee is insufficient", async function () {
      const insufficientFee = ethers.parseEther("0.5");
      
      await expect(
        ideaNFT.connect(innovator).createIdea(
          ideaData.title,
          ideaData.description,
          ideaData.category,
          ideaData.tags,
          ideaData.imageUri,
          ideaData.metadataUri,
          { value: insufficientFee }
        )
      ).to.be.revertedWith("Insufficient mint fee");
    });

    it("Should fail if title is empty", async function () {
      const mintFee = ethers.parseEther("1.0");
      
      await expect(
        ideaNFT.connect(innovator).createIdea(
          "",
          ideaData.description,
          ideaData.category,
          ideaData.tags,
          ideaData.imageUri,
          ideaData.metadataUri,
          { value: mintFee }
        )
      ).to.be.revertedWith("Title cannot be empty");
    });

    it("Should fail if description is empty", async function () {
      const mintFee = ethers.parseEther("1.0");
      
      await expect(
        ideaNFT.connect(innovator).createIdea(
          ideaData.title,
          "",
          ideaData.category,
          ideaData.tags,
          ideaData.imageUri,
          ideaData.metadataUri,
          { value: mintFee }
        )
      ).to.be.revertedWith("Description cannot be empty");
    });

    it("Should fail if category is empty", async function () {
      const mintFee = ethers.parseEther("1.0");
      
      await expect(
        ideaNFT.connect(innovator).createIdea(
          ideaData.title,
          ideaData.description,
          "",
          ideaData.tags,
          ideaData.imageUri,
          ideaData.metadataUri,
          { value: mintFee }
        )
      ).to.be.revertedWith("Category cannot be empty");
    });

    it("Should fail if no tags provided", async function () {
      const mintFee = ethers.parseEther("1.0");
      
      await expect(
        ideaNFT.connect(innovator).createIdea(
          ideaData.title,
          ideaData.description,
          ideaData.category,
          [],
          ideaData.imageUri,
          ideaData.metadataUri,
          { value: mintFee }
        )
      ).to.be.revertedWith("At least one tag is required");
    });

    it("Should refund excess payment", async function () {
      const excessFee = ethers.parseEther("2.0");
      const initialBalance = await ethers.provider.getBalance(innovator.address);
      
      const tx = await ideaNFT.connect(innovator).createIdea(
        ideaData.title,
        ideaData.description,
        ideaData.category,
        ideaData.tags,
        ideaData.imageUri,
        ideaData.metadataUri,
        { value: excessFee }
      );
      
      const receipt = await tx.wait();
      const gasUsed = receipt?.gasUsed || 0n;
      const gasPrice = tx.gasPrice || 0n;
      const gasCost = gasUsed * gasPrice;
      
      const finalBalance = await ethers.provider.getBalance(innovator.address);
      const expectedBalance = initialBalance - ethers.parseEther("1.0") - gasCost;
      
      expect(finalBalance).to.be.closeTo(expectedBalance, ethers.parseEther("0.001"));
    });
  });

  describe("Getting Ideas", function () {
    beforeEach(async function () {
      const mintFee = ethers.parseEther("1.0");
      await ideaNFT.connect(innovator).createIdea(
        ideaData.title,
        ideaData.description,
        ideaData.category,
        ideaData.tags,
        ideaData.imageUri,
        ideaData.metadataUri,
        { value: mintFee }
      );
    });

    it("Should get idea by token ID", async function () {
      const idea = await ideaNFT.getIdea(1);
      
      expect(idea.title).to.equal(ideaData.title);
      expect(idea.description).to.equal(ideaData.description);
      expect(idea.category).to.equal(ideaData.category);
      expect(idea.innovator).to.equal(innovator.address);
      expect(idea.isActive).to.be.true;
    });

    it("Should get ideas by innovator", async function () {
      const innovatorIdeas = await ideaNFT.getIdeasByInnovator(innovator.address);
      
      expect(innovatorIdeas).to.have.length(1);
      expect(innovatorIdeas[0]).to.equal(1);
    });

    it("Should get ideas by category", async function () {
      const categoryIdeas = await ideaNFT.getIdeasByCategory(ideaData.category);
      
      expect(categoryIdeas).to.have.length(1);
      expect(categoryIdeas[0]).to.equal(1);
    });

    it("Should fail to get non-existent idea", async function () {
      await expect(ideaNFT.getIdea(999)).to.be.revertedWith("Idea does not exist");
    });
  });

  describe("Updating Ideas", function () {
    beforeEach(async function () {
      const mintFee = ethers.parseEther("1.0");
      await ideaNFT.connect(innovator).createIdea(
        ideaData.title,
        ideaData.description,
        ideaData.category,
        ideaData.tags,
        ideaData.imageUri,
        ideaData.metadataUri,
        { value: mintFee }
      );
    });

    it("Should allow innovator to update idea", async function () {
      const newTitle = "Updated Title";
      const newDescription = "Updated description";
      
      await expect(
        ideaNFT.connect(innovator).updateIdea(
          1,
          newTitle,
          newDescription,
          "",
          [],
          "",
          ""
        )
      ).to.emit(ideaNFT, "IdeaUpdated");

      const updatedIdea = await ideaNFT.getIdea(1);
      expect(updatedIdea.title).to.equal(newTitle);
      expect(updatedIdea.description).to.equal(newDescription);
    });

    it("Should not allow non-innovator to update idea", async function () {
      await expect(
        ideaNFT.connect(otherUser).updateIdea(
          1,
          "New Title",
          "",
          "",
          [],
          "",
          ""
        )
      ).to.be.revertedWith("Only innovator can modify");
    });

    it("Should update category mappings correctly", async function () {
      const newCategory = "gaming";
      
      await ideaNFT.connect(innovator).updateIdea(
        1,
        "",
        "",
        newCategory,
        [],
        "",
        ""
      );

      const oldCategoryIdeas = await ideaNFT.getIdeasByCategory(ideaData.category);
      const newCategoryIdeas = await ideaNFT.getIdeasByCategory(newCategory);
      
      expect(oldCategoryIdeas).to.have.length(0);
      expect(newCategoryIdeas).to.have.length(1);
      expect(newCategoryIdeas[0]).to.equal(1);
    });
  });

  describe("Idea Status", function () {
    beforeEach(async function () {
      const mintFee = ethers.parseEther("1.0");
      await ideaNFT.connect(innovator).createIdea(
        ideaData.title,
        ideaData.description,
        ideaData.category,
        ideaData.tags,
        ideaData.imageUri,
        ideaData.metadataUri,
        { value: mintFee }
      );
    });

    it("Should allow innovator to deactivate idea", async function () {
      await expect(
        ideaNFT.connect(innovator).deactivateIdea(1)
      ).to.emit(ideaNFT, "IdeaUpdated");

      const idea = await ideaNFT.getIdea(1);
      expect(idea.isActive).to.be.false;
    });

    it("Should allow innovator to reactivate idea", async function () {
      await ideaNFT.connect(innovator).deactivateIdea(1);
      
      await expect(
        ideaNFT.connect(innovator).reactivateIdea(1)
      ).to.emit(ideaNFT, "IdeaUpdated");

      const idea = await ideaNFT.getIdea(1);
      expect(idea.isActive).to.be.true;
    });

    it("Should not allow non-innovator to change idea status", async function () {
      await expect(
        ideaNFT.connect(otherUser).deactivateIdea(1)
      ).to.be.revertedWith("Only innovator can modify");
    });
  });

  describe("Royalties", function () {
    beforeEach(async function () {
      const mintFee = ethers.parseEther("1.0");
      await ideaNFT.connect(innovator).createIdea(
        ideaData.title,
        ideaData.description,
        ideaData.category,
        ideaData.tags,
        ideaData.imageUri,
        ideaData.metadataUri,
        { value: mintFee }
      );
    });

    it("Should return correct royalty info", async function () {
      const salePrice = ethers.parseEther("10.0");
      const [receiver, royaltyAmount] = await ideaNFT.royaltyInfo(1, salePrice);
      
      expect(receiver).to.equal(innovator.address);
      expect(royaltyAmount).to.equal(ethers.parseEther("0.5")); // 5% of 10 ETH
    });

    it("Should return correct royalty receiver", async function () {
      const receiver = await ideaNFT.royaltyReceiver(1);
      expect(receiver).to.equal(innovator.address);
    });
  });

  describe("Access Control", function () {
    it("Should allow owner to withdraw fees", async function () {
      const mintFee = ethers.parseEther("1.0");
      await ideaNFT.connect(innovator).createIdea(
        ideaData.title,
        ideaData.description,
        ideaData.category,
        ideaData.tags,
        ideaData.imageUri,
        ideaData.metadataUri,
        { value: mintFee }
      );

      const initialBalance = await ethers.provider.getBalance(owner.address);
      await ideaNFT.connect(owner).withdrawFees();
      const finalBalance = await ethers.provider.getBalance(owner.address);
      
      expect(finalBalance).to.be.gt(initialBalance);
    });

    it("Should not allow non-owner to withdraw fees", async function () {
      await expect(
        ideaNFT.connect(innovator).withdrawFees()
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });

    it("Should allow owner to pause contract", async function () {
      await ideaNFT.connect(owner).pause();
      expect(await ideaNFT.paused()).to.be.true;
    });

    it("Should allow owner to unpause contract", async function () {
      await ideaNFT.connect(owner).pause();
      await ideaNFT.connect(owner).unpause();
      expect(await ideaNFT.paused()).to.be.false;
    });
  });
});
