const ethers = require("ethers");
import {
  LINKDROP_ERC20_FULL_ABI,
  LINKDROP_ERC721_ABI,
  ERC20_ABI,
  ERC721_ABI
} from "./metadata";
import { getAddressFromPrivateKey } from "./utils";

export const isLinkClaimed = async (
  linkdropContractAddress,
  linkKey,
  provider
) => {
  //get contract object at linkdropContractAddress
  const linkdropContract = new ethers.Contract(
    linkdropContractAddress,
    LINKDROP_ERC20_FULL_ABI,
    provider
  );

  // generate address from the transit private key
  const linkAddress = getAddressFromPrivateKey(linkKey);

  // is the link was already claimed (boolean)
  const linkClaimed = await linkdropContract.isClaimedLink(linkAddress);

  return linkClaimed;
};

export const getTokensLinkdropParams = async (
  linkdropContractAddress,
  provider
) => {
  let linkdropContract = new ethers.Contract(
    linkdropContractAddress,
    LINKDROP_ERC20_FULL_ABI,
    provider
  );

  const tokenAddress = await linkdropContract.TOKEN_ADDRESS();

  let tokenSymbol, tokenDecimals, claimAmount, referralReward, isPaused;

  if (tokenAddress !== ethers.constants.AddressZero) {
    const tokenContract = new ethers.Contract(
      tokenAddress,
      ERC20_ABI,
      provider
    );

    tokenSymbol = await tokenContract.symbol();
    tokenDecimals = await tokenContract.decimals();
    claimAmount = await linkdropContract.CLAIM_AMOUNT();
    referralReward = await linkdropContract.REFERRAL_REWARD();
    isPaused = await linkdropContract.paused();

    // Converting to atomic values
    claimAmount /= Math.pow(10, tokenDecimals);
    referralReward /= Math.pow(10, tokenDecimals);
  } else {
    // If only ether is sent
    tokenSymbol = "ETH";
    tokenDecimals = 18;
    claimAmount = await linkdropContract.CLAIM_AMOUNT_ETH();
    referralReward = 0;
    isPaused = await linkdropContract.paused();
    claimAmount /= Math.pow(10, tokenDecimals);
  }

  return {
    tokenSymbol,
    claimAmount,
    tokenAddress,
    referralReward,
    isPaused
  };
};

export const getNFTLinkdropParams = async (
  linkdropContractAddress,
  provider
) => {
  let linkdropContract = new ethers.Contract(
    linkdropContractAddress,
    LINKDROP_ERC721_ABI,
    provider
  );

  const nftAddress = await linkdropContract.NFT_ADDRESS();
  const nftContract = new ethers.Contract(nftAddress, ERC721_ABI, provider);
  let nftSymbol = await nftContract.symbol();
  let isPaused = await linkdropContract.paused();

  return {
    nftAddress,
    nftSymbol,
    isPaused
  };
};

export const getNFTMetadata = async (nftAddress, tokenId, provider) => {
  //Default metadata
  let metadata;
  let defaultMetadata = {
    description: "",
    name: `NFT #${tokenId}`,
    externalUrl: "",
    image:
      "https://raw.githubusercontent.com/VolcaTech/eth2-assets/master/images/default_token.png"
  };

  //Fetch token URI if it wasn't fetched
  const nftContract = new ethers.Contract(nftAddress, ERC721_ABI, provider);
  const tokenURI = await nftContract.tokenURI(tokenId);

  //If there is tokenURI, get metadata from URI
  if (tokenURI) {
    try {
      metadata = await fetch(tokenURI).then(res => res.json());
    } catch (err) {
      console.log(err);
    }
  }

  return metadata || defaultMetadata;
};
