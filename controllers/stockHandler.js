const axios = require("axios").default;
const mongoose = require("mongoose");

require("../models/stockLikes.js");

function StockHandler() {
  this.getData = async (stock) => {
    let url = `https://repeated-alpaca.glitch.me/v1/stock/${stock}/quote`;
    let resopnse = await axios.get(url);
    if (resopnse.status === 200) {
      if (typeof resopnse.data === "string") {
        // reponse "Unknown symbol"
        return "invalid";
      } else {
        // reponse object
        return resopnse.data.latestPrice;
      }
    } else {
      return "invalid";
    }
  };

  this.getLikes = async (stock, isLike, ip) => {
    let StockLikes = mongoose.model("StockLikes");
    let updateQuery = {};

    switch (isLike) {
      case "true":
        updateQuery.$addToSet = { likes: ip };
        break;
      case "false":
        updateQuery.$pull = { likes: ip };
        break;
      default:
      // do nothing on undefined/null
    }

    return StockLikes.findOneAndUpdate({ stock: stock }, updateQuery, {
      new: true,
    })
      .exec()
      .then((data) => {
        if (!data) {
          console.log("no data");
          if (isLike) {
            return StockLikes.create({ stock: stock, likes: [ip] })
              .then((data) => {
                return 1;
              })
              .catch((err) => {
                if (err) {
                  return 0;
                }
              });
          } else {
            return 0;
          }
        } else {
          return data.likes.length;
        }
      })
      .catch((err) => {
        if (err) {
          return 0;
        }
      });
  };
}

module.exports = StockHandler;
