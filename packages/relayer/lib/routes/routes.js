"use strict";
module.exports = {
  "/linkdrops/claim-tokens": {
    post: {
      controller: "ReceiverController",
      method: "claimTokens"
    }
  },
  "/linkdrops/claim-nft": {
    post: {
      controller: "ReceiverController",
      method: "claimNFT"
    }
  },

  "/linkdrops/authenticate": {
    post: {
      controller: "ReceiverController",
      method: "authenticate"
    }
  },
  "/receiver/referrals": {
    get: {
      controller: "ReceiverController",
      method: "getReferrals"
    }
  },
  "/campaigns/by-contract/:contract": {
    get: {
      controller: "CampaignController",
      method: "getByContractAddress"
    }
  },
  "/campaigns/by-referral-code/:referralCode": {
    get: {
      controller: "CampaignController",
      method: "getByReferralCode"
    }
  }
};
