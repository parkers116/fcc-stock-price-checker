const axios = require("axios");
const mongoose = require("mongoose");

require("../models/stockLikes.js");

function StockHandler() {
  this.getData = async (stock) => {
    let url = `https://repeated-alpaca.glitch.me/v1/stock/${stock}/quote`;
    let resopnse = await axios.get(url);
    if (resopnse.status === 200) {
      return resopnse.data.latestPrice;
    } else {
      return "invalid";
    }
  };

  this.getLikes = () => {
    //return 0 when not find
  };
}

module.exports = StockHandler;
