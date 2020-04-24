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

  app.route("/api/stock-prices").get(async (req, res) => {
    let prices = null;
    let likes = null;
    let returnJSON = {}; // for 1 stock
    let returnArray = []; // for 2 stocks
    let returnObject0 = {}; // for 2 stocks
    let returnObject1 = {}; // for 2 stocks

    if (Array.isArray(req.query.stock)) {
      prices = {};
      likes = {};
      returnObject0 = {};
      returnObject1 = {};

      // stock name uppercase
      req.query.stock = req.query.stock.map((item) => item.toUpperCase());

      req.query.stock.map((item) => {
        prices[item] = StockController.getData(item);
        likes[item] = StockController.getLikes(
          item,
          req.query.like,
          req.connection.remoteAddress
        );
      });

      await Promise.all([
        prices[req.query.stock[0]],
        likes[req.query.stock[0]],
        prices[req.query.stock[1]],
        likes[req.query.stock[1]],
      ]).then((arr) => {
        prices[req.query.stock[0]] = arr[0];
        likes[req.query.stock[0]] = arr[1];
        prices[req.query.stock[1]] = arr[2];
        likes[req.query.stock[1]] = arr[3];
      });

      if (prices[req.query.stock[0]] === "invalid") {
        returnObject0 = { error: "external source error", rel_likes: 0 };
      } else {
        returnObject0 = {
          stock: req.query.stock[0],
          price: prices[req.query.stock[0]],
          rel_likes: likes[req.query.stock[0]] - likes[req.query.stock[1]],
        };
      }
      if (prices[req.query.stock[1]] === "invalid") {
        returnObject1 = { error: "external source error", rel_likes: 0 };
      } else {
        returnObject1 = {
          stock: req.query.stock[1],
          price: prices[req.query.stock[1]],
          rel_likes: likes[req.query.stock[1]] - likes[req.query.stock[0]],
        };
      }
      returnArray.push(returnObject0);
      returnArray.push(returnObject1);

      res.json({ stockData: returnArray });
    } else {
      // stock name uppercase
      req.query.stock = req.query.stock.toUpperCase();

      prices = await StockController.getData(req.query.stock);
      likes = await StockController.getLikes(
        req.query.stock,
        req.query.like,
        req.connection.remoteAddress
      );

      if (prices === "invalid") {
        returnJSON = {
          stockData: {
            error: "external source error",
            likes: likes,
          },
        };
      } else {
        returnJSON = {
          stockData: {
            stock: req.query.stock,
            price: prices,
            likes: likes,
          },
        };
      }

      res.json(returnJSON);
    }
  });
};
