const TokensLinkdropContractService = require("../services/TokensLinkdropContractService");
const NFTLinkdropContractService = require("../services/NFTLinkdropContractService");
const VerificationService = require("../services/VerificationService");
const ClaimLinkService = require("../services/ClaimLinkService");
const ClaimTxService = require("../services/ClaimTxService");

const claimNFT = async (req, res) => {
  let {
    linkKeyAddress,
    receiverAddress,
    tokenId,
    contractAddress,
    linkdropperSignature,
    receiverSignature
  } = req.body;

  const params = {
    linkKeyAddress,
    receiverAddress,
    tokenId,
    contractAddress,
    linkdropperSignature,
    receiverSignature
  };

  if (!linkKeyAddress) {
    throw new Error("Please provide linkKeyAddress");
  }

  if (!tokenId) {
    throw new Error("Please provide tokenId");
  }

  if (!receiverAddress) {
    throw new Error("Please provide receiver address");
  }

  if (!contractAddress) {
    throw new Error("Please provide contract address");
  }

  if (!linkdropperSignature) {
    throw new Error("Please provide linkdropper verification signature");
  }

  if (!receiverSignature) {
    throw new Error("Please provide receiver signature");
  }

  // check that link is not claimed yet
  const oldClaimTx = await ClaimTxService.findOne({
    contract: contractAddress,
    linkPubKey: linkKeyAddress
  });

  if (oldClaimTx && oldClaimTx.txHash) {
    return res.json({
      success: true,
      txHash: oldClaimTx.txHash
    });
  }

  // Check that link params are valid and can be used to claim tokens
  const result = await NFTLinkdropContractService.checkClaimParams(params);

  if (!result) {
    throw new Error("Link is not valid.");
  }

  // send tx to claim tokens
  const { hash: txHash } = await NFTLinkdropContractService.claim(params);

  // save to db
  const claimTx = await ClaimTxService.saveToDb({
    linkPubKey: linkKeyAddress,
    receiverAddress,
    contract: contractAddress,
    txHash
  });

  res.json({
    success: true,
    txHash
  });
};

const claimTokens = async (req, res) => {
  let {
    linkKeyAddress,
    receiverAddress,
    referralAddress,
    contractAddress,
    linkdropperSignature,
    receiverSignature
  } = req.body;

  const params = {
    linkKeyAddress,
    receiverAddress,
    referralAddress,
    contractAddress,
    linkdropperSignature,
    receiverSignature
  };

  if (!linkKeyAddress) {
    throw new Error("Please provide linkKeyAddress");
  }

  if (!referralAddress) {
    throw new Error("Please provide referralAddress");
  }

  if (!receiverAddress) {
    throw new Error("Please provide receiver address");
  }

  if (!contractAddress) {
    throw new Error("Please provide contract address");
  }

  if (!linkdropperSignature) {
    throw new Error("Please provide linkdropper verification signature");
  }

  if (!receiverSignature) {
    throw new Error("Please provide receiver signature");
  }

  // #TODO check that link is not claimed yet
  const oldClaimTx = await ClaimTxService.findOne({
    contract: contractAddress,
    linkPubKey: linkKeyAddress
  });

  if (oldClaimTx && oldClaimTx.txHash) {
    return res.json({
      success: true,
      txHash: oldClaimTx.txHash
    });
  }

  // Check that link params are valid and can be used to claim tokens
  console.log(params);
  const result = await TokensLinkdropContractService.checkClaimParams(params);

  if (!result) {
    throw new Error("Link is not valid.");
  }

  // send tx to claim tokens
  const { hash: txHash } = await TokensLinkdropContractService.claim(params);

  // save to db
  const claimTx = await ClaimTxService.saveToDb({
    linkPubKey: linkKeyAddress,
    receiverAddress,
    referralAddress,
    contract: contractAddress,
    txHash
  });

  res.json({
    success: true,
    txHash
  });
};

const authenticate = async (req, res) => {
  let { contractAddress, referralAddress, googleTokenId } = req.body;

  var origin = req.get("origin");

  console.log({ origin });

  if (!contractAddress) {
    throw new Error("Please provide contract address");
  }

  if (!googleTokenId) {
    throw new Error("Please provide Google token id");
  }

  const userDetails = await VerificationService.verifyGoogleId(googleTokenId);

  const { link } = await ClaimLinkService.findOrCreate({
    userDetails,
    contractAddress,
    host: origin,
    referralAddress
  });

  res.json({
    success: true,
    link
  });
};

const getReferrals = async (req, res) => {
  let { address, contract } = req.query;

  if (!address) {
    throw new Error("Please provide address");
  }

  if (!contract) {
    throw new Error("Please provide contract address");
  }

  const referrals = await ClaimTxService.getReferrals({
    contract,
    address
  });

  res.json({
    success: true,
    referrals
  });
};

module.exports = {
  claimTokens,
  claimNFT,
  authenticate,
  getReferrals
};
