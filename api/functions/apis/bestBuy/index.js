const axios = require('axios');

const getSwitchStockStatus = async () => {
  const basePath = 'https://api.bestbuy.com/v1/';
  const queryQualifiers = 'format=json&show=sku,name,onlineAvailability';
  const SKUs = Object.keys(SKU_TO_NAME).reduce((string, cur) => {
    if (string.length) {
      return `${string},${cur}`;
    } else {
      return string;
    }
  }, '');

  // Make request and adapt response
  const response = await axios.get(`${basePath}/products(sku in(${SKUs})&onlineAvailability=true)?apiKey=${process.env.bestBuyAPIKey}&${queryQualifiers}`);
  const adaptedResponse = _fromAdapters(response, 'switchStockStatus');
  return { store: 'bestBuy', inStockRedBlue: !!adaptedResponse.redBlue, inStockGrey: !!adaptedResponse.grey };
}

module.exports ={
  getSwitchStockStatus,
}

// private helpers
const SKU_TO_NAME = {
  '123': 'redBlue',
  '456': 'grey',
};

const _fromAdapters = (response, type) => {
  const adaptedResponse = {};
  switch(type) {
    case 'switchStockStatus':
      response.products.forEach((product) => {
        const type = SKU_TO_NAME[product.sku];
        if (type) adaptedResponse[type] = product.onlineAvailability;
      });
      break;
    default:
      break;
  }

  return adaptedResponse;
}