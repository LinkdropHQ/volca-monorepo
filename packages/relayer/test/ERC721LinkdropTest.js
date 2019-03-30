const etherUtils = require("../lib/utils/ether-utils");
const HOST = "http://localhost:3000";
const config = require("../lib/config/app-config");
const ethers = require("ethers");
const ClaimLinkService = require("../lib/services/ClaimLinkService");
const NFTLinkdropContractService = require("../lib/services/NFTLinkdropContractService");

/**
 * 1. Connect to Ropsten contract
 * 2. Approve ERC721 tokens from linkdrop deployer to linkdrop contract
 * 3. Generate links (create linkdropper signature)
 * 4. Get link and create receiver signature
 * 5. Check claim params
 * 6. Claim
 */

const abi = require("../lib/contracts/NFTLinkdrop").abi;
const provider = ethers.getDefaultProvider(config.get("ETHEREUM_NETWORK"));
const wallet = new ethers.Wallet(config.get("ETHEREUM_ACCOUNT_PK"), provider);
const contractAddress = config.get("ERC721_LINKDROP_CONTRACT_ADDRESS");

let linkdropVerificationKey = config.get("LINKDROP_PRIVATE_KEY");
let referralAddress = ethers.constants.AddressZero;
let link;
let linkKeyAddress;
let linkdropperSignature;

let genLink = async genLinkParams => {
  link = await ClaimLinkService.generateLink(genLinkParams);
  linkKeyAddress = link.address;
  linkdropperSignature = link.linkdropperSignature;
  return link;
};

(async () => {
  // 1. Connect to Ropsten contract contract
  let contract = new ethers.Contract(contractAddress, abi, wallet);
  // 2. Approve ERC20 tokens from Linkdrop deployer to linkdrop contract
  //
  // 3. Generate link
  let genLinkParams = {
    linkdropVerificationKey: linkdropVerificationKey,
    contractAddress: contractAddress,
    tokenId: 0,
    host: HOST
  };

  link = await genLink(genLinkParams);
  console.log("🚨 link:", link);

  // 4. Get link and create receiver signature
  let receiverWallet = ethers.Wallet.createRandom(provider);
  let receiverAddress = receiverWallet.address;
  let receiverMsg = ethers.utils.solidityKeccak256(
    ["address"],
    [receiverAddress]
  );
  let receiverSignature = await etherUtils.signWithPK(
    link.privateKey,
    receiverMsg
  );
  console.log("🔑 receiverSignature: ", receiverSignature);

  // 5. Check claim params
  let claimParams = {
    linkKeyAddress: linkKeyAddress,
    tokenId: 0,
    receiverAddress: receiverAddress,
    contractAddress: contractAddress,
    linkdropperSignature: linkdropperSignature,
    receiverSignature: receiverSignature
  };

  console.log("🔵 claimParams: ", claimParams);

  NFTLinkdropContractService.checkClaimParams(claimParams);

  //   6. Claim tokens
  // TokensLinkdropContractService.claim(claimParams);
})();
