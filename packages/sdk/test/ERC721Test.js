require("dotenv").config();
const ethers = require("ethers");
import { ABI } from "../src/metadata/erc721";

const VolcaSDK = require("../lib/index");

let ropstenProvider = ethers.getDefaultProvider("ropsten");
const host = process.env.HOST;
const networkId = process.env.NETWORK_ID;

(async function() {
  let wallet = new ethers.Wallet(
    process.env.LINKDROPPER_PRIVATE_KEY,
    ropstenProvider
  );

  let nftContract = new ethers.Contract(
    process.env.ERC721_TOKEN_ADDRESS,
    ABI,
    wallet
  );

  const tokenId = 17;
  console.log(
    "\n====================================================================================="
  );
  let owner = await nftContract.ownerOf(tokenId);
  console.log(`Owner of token with tokenId = ${tokenId} is ${owner} `);

  // 1. Deploy
  let {
    contractAddress: linkdropContractAddress,
    linkdropVerificationKey,
    linkdropVerificationAddress
  } = await VolcaSDK.deployNFTLinkdropContract(
    process.env.ERC721_TOKEN_ADDRESS,
    ropstenProvider, //provider
    process.env.LINKDROPPER_PRIVATE_KEY //linkdropper's privateKey
  );

  // 2. Approve

  await VolcaSDK.approveNFT(
    {
      nftAddress: process.env.ERC721_TOKEN_ADDRESS,
      to: linkdropContractAddress, //to
      provider: ropstenProvider,
      privateKey: process.env.LINKDROPPER_PRIVATE_KEY
    } //approver (from)
  );
  console.log(`\n➡️ Approved all nfts to ${linkdropContractAddress}`);

  // 3. Generate links

  let link = await VolcaSDK.generateNFTClaimLink(host, networkId, {
    tokenId,
    linkdropVerificationKey,
    contractAddress: linkdropContractAddress
  });

  // 4. Claim tokens by link

  let receiverAddress = ethers.Wallet.createRandom().address;
  let contractAddress = linkdropContractAddress;
  let linkKey = link.linkKey;
  let linkdropperSignature = link.linkdropperSignature;

  await VolcaSDK.claimNFT(host, {
    receiverAddress,
    contractAddress,
    tokenId,
    linkKey,
    linkdropperSignature
  });

  owner = await nftContract.ownerOf(tokenId);
  console.log(`Owner of token with tokenId = ${tokenId} is ${owner} `);

  console.log(
    "=====================================================================================\n"
  );
})();