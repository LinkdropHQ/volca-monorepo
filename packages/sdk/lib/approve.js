const ethers = require("ethers");
import { ERC20_ABI } from "./metadata";
import { ERC721_ABI } from "./metadata";

// =================================================================================================================
//                                         ERC20
// =================================================================================================================

export const approveTokens = async (
  { tokenAddress, to, amount, provider, privateKey } //of the approver
) => {
  let wallet = new ethers.Wallet(privateKey, provider);
  let tokenContract = new ethers.Contract(tokenAddress, ERC20_ABI, wallet);
  await tokenContract.approve(to, amount, { gasLimit: 75000 });
};

// =================================================================================================================
//                                         ERC721
// =================================================================================================================

export const approveNFT = async ({ nftAddress, to, provider, privateKey }) => {
  let wallet = new ethers.Wallet(privateKey, provider);
  let nftContract = new ethers.Contract(nftAddress, ERC721_ABI, wallet);
  await nftContract.setApprovalForAll(to, true, { gasLimit: 200000 });
};
