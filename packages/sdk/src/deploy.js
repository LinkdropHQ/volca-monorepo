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

export const deployTokensLinkdropContract = async linkdropParams => {
  let {
    tokenAddress,
    claimAmount,
    referralAmount = 0,
    claimAmountEth = 0,
    linksNumber,
    provider,
    privateKey
  } = linkdropParams;

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

  let linkdropContract = await factory.deploy(
    tokenAddress,
    claimAmount,
    referralAmount,
    claimAmountEthInWei,
    linkdropVerificationAddress,
    { value: txValue }
  );
  console.log("\n⚠️ Deploying ERC20 linkdrop contract...");

  let linkdropContractAddress = linkdropContract.address;
  console.log("\n📃 Contract address:", linkdropContractAddress);

  let txHash = linkdropContract.deployTransaction.hash;
  console.log("\n📤 TXHash: ", txHash);

  //await contract.deployed();

  return {
    txHash,
    linkdropContractAddress,
    linkdropContract,
    linkdropVerificationKey,
    linkdropVerificationAddress
  };
};

// =================================================================================================================
//                                         ERC721
// =================================================================================================================

export const deployNFTLinkdropContract = async linkdropParams => {
  //privateKey of deployer (linkdropper)
  let { nftAddress, provider, privateKey } = linkdropParams;

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

  let linkdropContract = await factory.deploy(
    nftAddress,
    linkdropVerificationAddress
  );
  console.log("\n⚠️ Deploying ERC721 linkdrop contract...");

  let linkdropContractAddress = linkdropContract.address;
  console.log("\n📄 Contract address:", linkdropContractAddress);

  let txHash = linkdropContract.deployTransaction.hash;
  console.log("\n📤 TXHash: ", txHash);

  //await linkdropContract.deployed();

  return {
    txHash,
    linkdropContractAddress,
    linkdropContract,
    linkdropVerificationKey,
    linkdropVerificationAddress
  };
};
