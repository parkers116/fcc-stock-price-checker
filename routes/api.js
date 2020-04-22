/*
 *
 *
 *       Complete the API routing below
 *
 *
 */

"use strict";

const expect = require("chai").expect;

const StockHandler = require("../controllers/stockHandler.js");

module.exports = function (app) {
  var StockController = new StockHandler();

  app.route("/api/stock-prices").get(function (req, res) {
    let prices = null;
    let likes = null;
    let returnArray = [];
    let returnObject0 = {};
    let returnObject1 = {};

    if (Array.isArray(res.query.stock)) {
      prices = [];
      likes = [];
      returnObject0 = {};
      returnObject1 = {};

      req.query.stock.map((item) => {
        prices.push(stockStockController.getData(item.toUpperCase()));
        likes.push(stockStockController.getLikes(item.toUpperCase()));
      });

      if (prices[0] === "invalid") {
        returnObject0 = { error: "external source error", rel_likes: 0 };
      } else {
        returnObject0 = {
          stock: res.query.stock[0].toUpperCase(),
          price: prices[0],
          rel_likes: prices[0] - prices[1],
        };
      }
      if (prices[1] === "invalid") {
        returnObject1 = { error: "external source error", rel_likes: 0 };
      } else {
        returnObject1 = {
          stock: res.query.stock[1].toUpperCase(),
          price: prices[1],
          rel_likes: prices[1] - prices[0],
        };
      }
      returnArray.push(returnObject0);
      returnArray.push(returnObject1);

      //check whether the data is valid or not
      if (prices[0] === "invalid") {
      }

      res.json({ stockData: returnArray });
    } else {
      prices = StockController.getData(res.query.stock.toUpperCase());
      likes = StockController.getLikes(res.query.stock.toUpperCase());

      res.json({
        stockData: {
          stock: res.query.stock.toUpperCase(),
          price: prices,
          likes: likes,
        },
      });
    }
  });
};
