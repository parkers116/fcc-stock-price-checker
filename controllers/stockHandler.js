const axios = require('axios').default;
const mongoose = require('mongoose');

require('../models/stockLikes.js');

function StockHandler() {
  this.getData = async (stock) => {
    let url = `https://repeated-alpaca.glitch.me/v1/stock/${stock}/quote`;
    let resopnse = await axios.get(url);
    if (resopnse.status === 200) {
      return resopnse.data.latestPrice;
    } else {
      return 'invalid';
    }
  };

  this.getLikes = (stock, isLike, ip) => {
    //return 0 when not find
    let StockLikes = mongoose.model('StockLikes');
    let updateQuery = {};

    if (isLike) {
      updateQuery.$addToSet = { likes: ip };
    } else {
      updateQuery.$pull = { likes: ip };
    }

    StockLikes.findOneAndUpdate({ stock: stock }, updateQuery, { new: true }, (err, data) => {
      if (err) {
        console.log('error');
      }
      if (!data) {
        let newQuery = {};

        if (isLike) {
          newQuery = { stock: stock, likes: [ip] };
        } else {
          //...
        }
        let newStockLikes = new StockLikes({ stock: stock, likes });
      }
      console.log(data);
    });
  };
}

module.exports = StockHandler;
