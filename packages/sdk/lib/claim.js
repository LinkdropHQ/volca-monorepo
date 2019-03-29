const ethers = require("ethers");
const fetch = require("isomorphic-fetch");

import { signAddress, getAddressFromPrivateKey } from "./utils";

// =================================================================================================================
//                                         ERC20
// =================================================================================================================

const callServerToClaimTokens = async (host, claimParams) => {
  // const host = process.env.HOST;

  try {
    const response = await fetch(`${host}/api/v1/linkdrops/claim-tokens`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(claimParams)
    });

    if (response.status !== 200) {
      console.error(`❌ Invalid response status ${response.status}`);
      throw await response.json();
    } else {
      console.log("✅ Successfully claimed tokens");
      return await response.json();
    }
  } catch (err) {
    console.error(err);
  }
};

export const claimTokens = async (
  host,
  {
    receiverAddress,
    contractAddress,
    referralAddress = ethers.constants.AddressZero,
    linkKey, //from link url
    linkdropperSignature
  }
) => {
  // sign receiver's address with link private key
  const receiverSignature = await signAddress({
    address: receiverAddress,
    privateKey: linkKey
  });

  const linkKeyAddress = getAddressFromPrivateKey(linkKey);

  const claimParams = {
    linkKeyAddress,
    receiverAddress,
    referralAddress,
    contractAddress,
    linkdropperSignature,
    receiverSignature
  };

  return callServerToClaimTokens(host, claimParams);
};

// =================================================================================================================
//                                         ERC721
// =================================================================================================================

const callServerToClaimNFT = async (host, claimParams) => {
  //const host = process.env.HOST;
  try {
    const response = await fetch(`${host}/api/v1/linkdrops/claim-nft`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(claimParams)
    });

    if (response.status !== 200) {
      console.error(`❌ Invalid response status ${response.status}`);
      throw await response.json();
    } else {
      console.log("✅ Successfully claimed NFT");
      return await response.json();
    }
    // return await response.json();
  } catch (err) {
    console.error(err);
  }
};

export const claimNFT = async (
  host,
  { receiverAddress, contractAddress, tokenId, linkKey, linkdropperSignature }
) => {
  const receiverSignature = await signAddress({
    address: receiverAddress,
    privateKey: linkKey
  });

  const linkKeyAddress = getAddressFromPrivateKey(linkKey);

  const claimParams = {
    linkKeyAddress,
    receiverAddress,
    tokenId,
    contractAddress,
    linkdropperSignature,
    receiverSignature
  };

  return await callServerToClaimNFT(host, claimParams);
};
