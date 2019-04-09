const ethers = require("ethers");

// CONSTANTS
const ADDRESS_ZERO = ethers.constants.AddressZero;

/**
 * @desc Generate Ethereum Account
 * @return {'address': String, 'privateKey': String}
 */
const generateAccount = () => {
  const wallet = ethers.Wallet.createRandom();
  const address = wallet.address;
  // console.log("address: ", address);
  const privateKey = wallet.privateKey;
  // console.log("privateKey: ", privateKey);
  return { address, privateKey };
};

/**
 * @desc Sign message hash with private key.
 * @param  {String}  [privateKey]
 * @param  {String}  [msg] - message hash
 * @return {'signature': String}
 */
const signWithPK = async (privateKey, msg) => {
  let wallet = new ethers.Wallet(privateKey);
  let msgToSign = ethers.utils.arrayify(msg);
  let signature = await wallet.signMessage(msgToSign);
  // console.log("signature: ", signature);
  return signature;
};

/**
 * @desc Sign Ethereum address with private key.
 * @param  {String}  [privateKey]
 * @param  {String}  [address] - Ethereum address
 * @return {'signature' : String}
 */
const sign2Addresses = async ({
  address,
  privateKey,
  referralAddress = ADDRESS_ZERO
}) => {
  let verificationHash = ethers.utils.solidityKeccak256(
    ["address", "address"],
    [address, referralAddress]
  );

  const signature = await signWithPK(privateKey, verificationHash);

  return signature;
};

module.exports = {
  generateAccount,
  signWithPK,
  sign2Addresses
};
