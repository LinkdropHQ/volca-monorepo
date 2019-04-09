import { approveTokens, approveNFT } from "./approve";
import { claimTokens, claimNFT } from "./claim";
import {
  deployTokensLinkdropContract,
  deployNFTLinkdropContract
} from "./deploy";
import { generateTokensClaimLink, generateNFTClaimLink } from "./generateLinks";
import {
  isLinkClaimed,
  getTokensLinkdropParams,
  getNFTLinkdropParams,
  getNFTMetadata
} from "./getLinkdropParams";

const VolcaSDK = {
  approveTokens,
  approveNFT,
  claimTokens,
  claimNFT,
  deployTokensLinkdropContract,
  deployNFTLinkdropContract,
  generateTokensClaimLink,
  generateNFTClaimLink,
  isLinkClaimed,
  getTokensLinkdropParams,
  getNFTLinkdropParams,
  getNFTMetadata
};

module.exports = VolcaSDK;
