const findOne = (params = {}) => {
  const campaign = {
    contract: params.contract,
    amount: 10,
    symbol: "DAI",
    tokenAddress: "0x0566c17c5e65d760243b9c57717031c708f13d26"
  };
  return Promise.resolve(campaign);
};

module.exports = {
  findOne
};
