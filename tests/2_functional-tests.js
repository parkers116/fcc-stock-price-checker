/*
 *
 *
 *       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
 *       -----[Keep the tests in the same order!]-----
 *       (if additional are added, keep them at the very end!)
 */

var chaiHttp = require("chai-http");
var chai = require("chai");
var assert = chai.assert;
var server = require("../server");

chai.use(chaiHttp);

suite("Functional Tests", function () {
  suite("GET /api/stock-prices => stockData object", function () {
    test("1 stock", function (done) {
      this.timeout(10000);
      chai
        .request(server)
        .get("/api/stock-prices")
        .query({ stock: "goog" })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.property(res.body, "stockData");
          assert.property(res.body.stockData, "stock");
          assert.isNumber(res.body.stockData.likes);
          done();
        });
    });

    test("1 stock with like", function (done) {
      this.timeout(10000);
      chai
        .request(server)
        .get("/api/stock-prices")
        .query({ stock: "goog", like: false })
        .end(function (err, res) {
          let prevLikes = res.body.stockData.likes;
          chai
            .request(server)
            .get("/api/stock-prices")
            .query({ stock: "goog", like: true })
            .end(function (err, res) {
              assert.equal(res.status, 200);
              assert.property(res.body, "stockData");
              assert.property(res.body.stockData, "stock");
              assert.equal(res.body.stockData.likes, prevLikes + 1);
              done();
            });
        });
    });

    test("1 stock with like again (ensure likes arent double counted)", function (done) {
      this.timeout(10000);
      chai
        .request(server)
        .get("/api/stock-prices")
        .query({ stock: "goog", like: true })
        .end(function (err, res) {
          let prevLikes = res.body.stockData.likes;
          chai
            .request(server)
            .get("/api/stock-prices")
            .query({ stock: "goog", like: true })
            .end(function (err, res) {
              assert.equal(res.status, 200);
              assert.property(res.body, "stockData");
              assert.property(res.body.stockData, "stock");
              assert.equal(res.body.stockData.likes, prevLikes);
              done();
            });
        });
    });

    test("2 stocks", function (done) {
      this.timeout(10000);
      chai
        .request(server)
        .get("/api/stock-prices?stock=goog&stock=msft")
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.isArray(res.body.stockData);
          assert.property(res.body.stockData[0], "stock");
          assert.property(res.body.stockData[0], "price");
          assert.isNumber(res.body.stockData[0].rel_likes);
          assert.property(res.body.stockData[1], "stock");
          assert.property(res.body.stockData[1], "price");
          assert.isNumber(res.body.stockData[1].rel_likes);
          assert.oneOf(res.body.stockData[0].stock, ["GOOG", "MSFT"]);
          assert.oneOf(res.body.stockData[1].stock, ["GOOG", "MSFT"]);
          assert.equal(
            res.body.stockData[0].rel_likes + res.body.stockData[1].rel_likes,
            0
          );
          done();
        });
    });

    test("2 stocks with like", function (done) {
      this.timeout(10000);
      chai
        .request(server)
        .get("/api/stock-prices?stock=goog&stock=msft&like=false")
        .end(function (err, res) {
          let prevLikes1 = res.body.stockData[0].rel_likes;
          let prevLikes2 = res.body.stockData[1].rel_likes;
          chai
            .request(server)
            .get("/api/stock-prices?stock=goog&stock=msft&like=true")
            .end(function (err, res) {
              assert.equal(res.status, 200);
              assert.isArray(res.body.stockData);
              assert.property(res.body.stockData[0], "stock");
              assert.property(res.body.stockData[0], "price");
              assert.isNumber(res.body.stockData[0].rel_likes);
              assert.equal(res.body.stockData[0].rel_likes, prevLikes1);
              assert.property(res.body.stockData[1], "stock");
              assert.property(res.body.stockData[1], "price");
              assert.isNumber(res.body.stockData[1].rel_likes);
              assert.equal(res.body.stockData[1].rel_likes, prevLikes2);
              assert.oneOf(res.body.stockData[0].stock, ["GOOG", "MSFT"]);
              assert.oneOf(res.body.stockData[1].stock, ["GOOG", "MSFT"]);
              assert.equal(
                res.body.stockData[0].rel_likes +
                  res.body.stockData[1].rel_likes,
                0
              );
              done();
            });
        });
    });
  });
});
