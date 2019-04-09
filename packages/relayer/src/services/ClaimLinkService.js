const etherUtils = require("../utils/ether-utils");
const ClaimLink = require("../models/ClaimLink");
const HOST = "http://localhost:3000";
const config = require("../config/app-config");
const ethers = require("ethers");

/**
 * @desc Construct a claim link.
 * @param  {String}  [contractAddress] - Linkdrop Contract address
 * @param  {String}  [linkdropVerificationKey] - Link Private key from the URL params
 * @param  {String}  [host] - Claim Link's server host, e.g. 'https://eth2air.io'
 * @return {String}
 */
const generateLink = async ({
  linkdropVerificationKey,
  contractAddress,
  referralAddress,
  host
}) => {
  // generate random key pair
  const { address, privateKey } = etherUtils.generateAccount();

  // sign private key with the Linkdrop Transit Private Key

  const linkdropperSignature = await etherUtils.sign2Addresses({
    address,
    referralAddress,
    privateKey: linkdropVerificationKey
  });

  // construct link
  let link = `${host}/#/receive?pk=${privateKey.toString(
    "hex"
  )}&sig=${linkdropperSignature}&c=${contractAddress}`;
  if (referralAddress !== ethers.constants.AddressZero) {
    link = `${link}&ref=${referralAddress}`;
  }

  // add network param to url if not mainnet
  const networkId = config.get("NETWORK_ID");
  if (String(networkId) !== "1") {
    link = `${link}&n=${networkId}`;
  }
  // console.log("🚨 link: ", link);

  return { link, address, privateKey, linkdropperSignature };
};

const findOne = async (params = {}) => {
  return await ClaimLink.findOne(params);
};

const create = async values => {
  const claimLink = new ClaimLink(values);
  await claimLink.save();
  return claimLink;
};

const findOrCreate = async ({
  userDetails,
  contractAddress,
  host = HOST,
  referralAddress = ethers.constants.AddressZero
}) => {
  const userId = `GOOGLE-${userDetails.sub}`; // google id

  let claimLink = await findOne({ contract: contractAddress, userId });

  if (!(claimLink && claimLink.link)) {
    // #todo lookup in db
    const linkdropVerificationKey = config.get("LINKDROP_PRIVATE_KEY");

    let { link, address: linkPubKey } = generateLink({
      linkdropVerificationKey,
      contractAddress,
      referralAddress,
      host
    });

    linkPubKey = linkPubKey.toLowerCase();

    const {
      email,
      email_verified,
      name,
      given_name,
      family_name,
      locale,
      picture
    } = userDetails;

    claimLink = await create({
      link,
      linkPubKey,
      userId,
      contract: contractAddress,
      user: {
        email,
        email_verified,
        name,
        given_name,
        family_name,
        locale,
        picture
      }
    });
  }

  return claimLink;
};

module.exports = {
  findOrCreate,
  findOne,
  generateLink
};
