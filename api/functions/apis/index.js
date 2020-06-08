const bestBuyAPI = require('./bestBuy');

const getSwitchStockStatuses = () => {
  return Promise.all([bestBuyAPI.getSwitchStockStatus()]);
}

module.exports = {
  getSwitchStockStatuses,
}