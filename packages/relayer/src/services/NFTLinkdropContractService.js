const config = require("../config/app-config");
const log = require("./../libs/log")(module);
const CONTRACT_ABI = require("../contracts/NFTLinkdrop").abi;

const ethers = require("ethers");
const provider = ethers.getDefaultProvider(config.get("ETHEREUM_NETWORK"));
const wallet = new ethers.Wallet(config.get("ETHEREUM_ACCOUNT_PK"), provider);

// get contract object at contract's address
const getContract = contractAddress => {
  const contract = new ethers.Contract(contractAddress, CONTRACT_ABI, wallet);
  return contract;
};

const checkClaimParams = async ({
  linkKeyAddress,
  tokenId,
  receiverAddress,
  contractAddress,
  linkdropperSignature,
  receiverSignature
}) => {
  try {
    // const {
    //   linkKeyAddress,
    //   tokenId,
    //   receiverAddress,
    //   contractAddress,
    //   linkdropperSignature,
    //   receiverSignature
    // } = params;
    // log.debug(params);
    const contract = getContract(contractAddress);

    let result = await contract.checkClaimParams(
      receiverAddress,
      tokenId,
      linkKeyAddress,
      linkdropperSignature,
      receiverSignature
    );
    log.debug("🔎 Checking claim params resulted: ", result);
    return result;
  } catch (err) {
    log.error(err);
    throw new Error("❌ Error occured while checking transfer!");
  }
};

const claim = async ({
  linkKeyAddress,
  tokenId,
  receiverAddress,
  contractAddress,
  linkdropperSignature,
  receiverSignature
}) => {
  try {
    const contract = getContract(contractAddress);

    let tx = await contract.claim(
      receiverAddress,
      tokenId,
      linkKeyAddress,
      linkdropperSignature,
      receiverSignature,
      { gasLimit: 500000 }
    );
    //await tx.wait(2); //waiting for 2 confirmations
    log.debug(`✅ Successfully claimed nft with tokenId = ${tokenId}`);
    log.debug("#️⃣ Tx:", tx);
    return tx;
  } catch (err) {
    log.error(err);
    throw new Error("❌ Error occured while claiming tx!");
  }
};

module.exports = {
  checkClaimParams,
  claim
};
