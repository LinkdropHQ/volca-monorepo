// const EscrowContractService = require('../services/EscrowContractService');
// const VerificationService = require('../services/VerificationService');
const ClaimTxService = require("../services/ClaimTxService");
const CampaignService = require("../services/CampaignService");
// const log = require('../libs/log')(module);

const getByContractAddress = async (req, res) => {
  let { contract } = req.params;

  if (!contract) {
    throw new Error("Please provide contract address");
  }

  const campaign = await CampaignService.findOne({ contract });

  res.json({
    success: true,
    campaign,
    isReferred: false,
    referree: null,
    contract
  });
};

const getByReferralCode = async (req, res) => {
  let { referralCode } = req.params;

  if (!referralCode) {
    throw new Error("Please provide contract address");
  }

  const refTx = await ClaimTxService.findOne({ referralCode }); // claim tx of refferral
  const campaign = await CampaignService.findOne({ contract: refTx.contract });

  res.json({
    success: true,
    campaign,
    isReferred: true,
    referree: refTx.user,
    referralAddress: refTx.receiverAddress,
    contract: refTx.contract
  });
};

module.exports = {
  getByContractAddress,
  getByReferralCode
};
