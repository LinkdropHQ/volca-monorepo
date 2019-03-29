require("dotenv").config();
const ethers = require("ethers");
import { generateAccount, signLinkForTokens, signLinkForNFT } from "./utils";

// =================================================================================================================
//                                         ERC20
// =================================================================================================================

export const generateTokensClaimLink = async (
  host,
  networkId,
  {
    linkdropVerificationKey,
    linkdropContractAddress,
    referralAddress = ethers.constants.AddressZero
  }
) => {
  // const host = process.env.HOST;
  // const networkId = process.env.NETWORK_ID;

  // generate random key pair for link
  const { address: linkAddress, privateKey: linkKey } = generateAccount();

  const linkdropperSignature = await signLinkForTokens({
    linkAddress,
    referralAddress,
    linkdropVerificationKey
  });

  // construct link
  let link = `${host}/#/receive?pk=${linkKey.toString(
    "hex"
  )}&sig=${linkdropperSignature}&c=${linkdropContractAddress}`;
  if (referralAddress !== ethers.constants.AddressZero) {
    link = `${link}&ref=${referralAddress}`;
  }

  // add network param to url if not mainnet
  if (String(networkId) !== "1") {
    link = `${link}&n=${networkId}`;
  }
  // console.log("🚨 link: ", link);

  return { link, linkAddress, linkKey, linkdropperSignature };
};

// =================================================================================================================
//                                         ERC721
// =================================================================================================================

export const generateNFTClaimLink = async (
  host,
  networkId,
  {
    tokenId,
    linkdropVerificationKey, //verification key generated on linkdrop contract deployment
    linkdropContractAddress //linkdrop contract address
  }
) => {
  // const host = process.env.HOST;
  // const networkId = process.env.NETWORK_ID;

  // generate random key pair
  const { address: linkAddress, privateKey: linkKey } = generateAccount();

  // sign private key with the Airdrop Transit Private Key
  const linkdropperSignature = await signLinkForNFT({
    linkAddress,
    tokenId,
    linkdropVerificationKey
  });

  // construct link
  let link = `${host}/#/receive-nft?pk=${linkKey.toString(
    "hex"
  )}&sig=${linkdropperSignature}&&c=${linkdropContractAddress}&t=${tokenId}`;

  if (String(networkId) !== "1") {
    link = `${link}&n=${networkId}`;
  }
  // console.log("🚨 link: ", link);

  return { link, linkAddress, linkKey, linkdropperSignature };
};
