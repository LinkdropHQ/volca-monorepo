require("dotenv").config();
const ethers = require("ethers");

const VolcaSDK = require("../src/index");
const host = process.env.HOST;
const networkId = process.env.NETWORK_ID;

(async function() {
  let claimAmount = 13;
  let referralReward = 0;
  let claimAmountEth = 0;
  let linksNumber = 5;

  const ropstenProvider = ethers.getDefaultProvider("ropsten");

  // 1. Deploy
  let linkdropParams = {
    tokenAddress: process.env.ERC20_TOKEN_ADDRESS,
    claimAmount,
    referralReward,
    claimAmountEth,
    linksNumber,
    provider: ropstenProvider, //provider
    privateKey: process.env.LINKDROPPER_PRIVATE_KEY
  };

  let {
    linkdropContractAddress,
    linkdropContract,
    linkdropVerificationKey,
    linkdropVerificationAddress
  } = await VolcaSDK.deployTokensLinkdropContract(linkdropParams);

  // Need to wait before deployment tx is mined
  await linkdropContract.deployed();

  // 2. Approve
  let amount = 1000;
  await VolcaSDK.approveTokens(
    {
      tokenAddress: process.env.ERC20_TOKEN_ADDRESS,
      to: linkdropContractAddress, //to
      amount,
      provider: ropstenProvider,
      privateKey: process.env.LINKDROPPER_PRIVATE_KEY
    } //approver (from)
  );
  console.log(`\n➡️ Approved ${amount} tokens to ${linkdropContractAddress}`);

  // 3. Generate link

  let link = await VolcaSDK.generateTokensClaimLink(host, networkId, {
    linkdropVerificationKey,
    linkdropContractAddress
  });

  // 4. Claim tokens by link
  let receiverAddress = ethers.Wallet.createRandom().address;
  let contractAddress = linkdropContractAddress;
  let referralAddress = ethers.constants.AddressZero;
  let linkKey = link.linkKey;
  let linkdropperSignature = link.linkdropperSignature;

  await VolcaSDK.claimTokens(host, {
    receiverAddress,
    contractAddress,
    referralAddress,
    linkKey,
    linkdropperSignature
  });

  // 5. Get linkdrop params and log to console
  let params = await VolcaSDK.getTokensLinkdropParams(
    linkdropContractAddress,
    ropstenProvider
  );
  console.log("\n☑️ Linkdrop params: ", params);
})();
