const etherUtils = require("../utils/ether-utils");
const ClaimTx = require("../models/ClaimTx");
const config = require("../config/app-config");
const ClaimLinkService = require("./ClaimLinkService");
const ethers = require("ethers");

const find = async (params = {}) => {
  return await ClaimTx.find(params);
};

const findOne = async (params = {}) => {
  return await ClaimTx.findOne(params);
};

const create = async values => {
  const claimTx = new ClaimTx(values);
  await claimTx.save();
  return claimTx;
};

const saveToDb = async ({
  linkPubKey,
  receiverAddress,
  referralAddress,
  contract,
  txHash
}) => {
  let userData = {};

  // get user info for caching purposes

  const claimLink = await ClaimLinkService.findOne({ contract, linkPubKey });
  if (claimLink && claimLink.user) {
    console.log(claimLink);
    console.log({ linkPubKey, contract });
    userData = claimLink.user;
  }

  // save referral code
  const referralCode = ethers.utils.solidityKeccak256(
    ["address", "address"],
    [contract, receiverAddress]
  );

  return await create({
    linkPubKey,
    receiverAddress,
    referralAddress,
    contract,
    txHash,
    user: userData,
    referralCode
  });
};

const getReferrals = async ({ contract, address }) => {
  const txs = await find({ contract, referralAddress: address });
  return txs.map(tx => ({
    name: tx.user.name,
    picture: tx.user.picture,
    given_name: tx.user.given_name,
    email: tx.user.email
  }));
};

module.exports = {
  findOne,
  saveToDb,
  getReferrals
};
