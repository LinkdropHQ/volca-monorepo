const ethers = require("ethers");

export const generateAccount = () => {
  const wallet = ethers.Wallet.createRandom();
  const address = wallet.address;
  const privateKey = wallet.privateKey;
  return { address, privateKey };
};

export const getAddressFromPrivateKey = privateKey => {
  const wallet = new ethers.Wallet(privateKey);
  const address = wallet.address;
  return address;
};

const signWithPrivKey = async (privateKey, msg) => {
  let wallet = new ethers.Wallet(privateKey);
  let msgToSign = ethers.utils.arrayify(msg);
  let signature = await wallet.signMessage(msgToSign);
  return signature;
};

export const signAddress = async ({ address, privateKey }) => {
  const msg = ethers.utils.solidityKeccak256(["address"], [address]);

  const signature = await signWithPrivKey(privateKey, msg);
  return signature;
};

export const signLinkForTokens = async ({
  linkAddress,
  referralAddress,
  linkdropVerificationKey
}) => {
  const verificationHash = ethers.utils.solidityKeccak256(
    ["address", "address"],
    [linkAddress, referralAddress]
  );
  const signature = await signWithPrivKey(
    linkdropVerificationKey,
    verificationHash
  );
  return signature;
};

export const signLinkForNFT = async ({
  linkAddress,
  tokenId,
  linkdropVerificationKey
}) => {
  const verificationHash = ethers.utils.solidityKeccak256(
    ["address", "uint"],
    [linkAddress, tokenId]
  );

  const signature = await signWithPrivKey(
    linkdropVerificationKey,
    verificationHash
  );
  return signature;
};
