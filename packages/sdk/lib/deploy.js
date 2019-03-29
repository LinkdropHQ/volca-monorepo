const ethers = require("ethers");
import {
  LINKDROP_ERC20_FULL_BYTECODE,
  LINKDROP_ERC20_FULL_ABI,
  LINKDROP_ERC721_BYTECODE,
  LINKDROP_ERC721_ABI
} from "./metadata";
import { generateAccount } from "./utils";

// =================================================================================================================
//                                         ERC20
// =================================================================================================================

export const deployTokensLinkdropContract = async (
  tokenAddress,
  claimAmount,
  referralAmount = 0,
  claimAmountEth = 0,
  linksNumber,
  provider,
  privateKey //privKey of deployer (linkdropper) for testing purposes only
) => {
  let wallet = new ethers.Wallet(privateKey, provider);

  let factory = new ethers.ContractFactory(
    LINKDROP_ERC20_FULL_ABI,
    LINKDROP_ERC20_FULL_BYTECODE,
    wallet
  );

  const {
    privateKey: linkdropVerificationKey,
    address: linkdropVerificationAddress
  } = generateAccount();
  console.log(
    "\n🔑 Linkdrop verification private key:",
    linkdropVerificationKey
  );

  let claimAmountEthInWei = ethers.utils.parseUnits(claimAmountEth.toString());
  let txValue = ethers.utils.bigNumberify(claimAmountEthInWei).mul(linksNumber);

  let contract = await factory.deploy(
    tokenAddress,
    claimAmount,
    referralAmount,
    claimAmountEthInWei,
    linkdropVerificationAddress,
    { value: txValue }
  );
  console.log("\n⚠️ Deploying ERC20 linkdrop contract...");
  await contract.deployed();
  let linkdropContractAddress = contract.address;
  console.log("\n✅ Contract deployed at:", linkdropContractAddress);

  let txHash = contract.deployTransaction.hash;
  console.log("\n📤 TXHash: ", txHash);
  return {
    txHash,
    linkdropContractAddress,
    linkdropVerificationKey,
    linkdropVerificationAddress
  };
};

// =================================================================================================================
//                                         ERC721
// =================================================================================================================

export const deployNFTLinkdropContract = async (
  nftAddress,
  provider,
  privateKey //privKey of deployer (linkdropper)
) => {
  let wallet = new ethers.Wallet(privateKey, provider);

  let factory = new ethers.ContractFactory(
    LINKDROP_ERC721_ABI,
    LINKDROP_ERC721_BYTECODE,
    wallet
  );

  const {
    privateKey: linkdropVerificationKey,
    address: linkdropVerificationAddress
  } = generateAccount();
  console.log(
    "\n🔑 Linkdrop verification private key:",
    linkdropVerificationKey
  );

  let contract = await factory.deploy(nftAddress, linkdropVerificationAddress);
  console.log("\n⚠️ Deploying ERC721 linkdrop contract...");
  await contract.deployed();
  let contractAddress = contract.address;
  console.log("\n✅ Contract deployed at:", contractAddress);

  let txHash = contract.deployTransaction.hash;
  console.log("\n📤 TXHash: ", txHash);
  return {
    txHash,
    contractAddress,
    linkdropVerificationKey,
    linkdropVerificationAddress
  };
};
