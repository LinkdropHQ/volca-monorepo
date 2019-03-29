import { approveTokens, approveNFT } from "./approve";
import { claimTokens, claimNFT } from "./claim";
import {
  deployTokensLinkdropContract,
  deployNFTLinkdropContract
} from "./deploy";
import { generateTokensClaimLink, generateNFTClaimLink } from "./generateLinks";

const VolcaSDK = {
  approveTokens,
  approveNFT,
  claimTokens,
  claimNFT,
  deployTokensLinkdropContract,
  deployNFTLinkdropContract,
  generateTokensClaimLink,
  generateNFTClaimLink
};

module.exports = VolcaSDK;
