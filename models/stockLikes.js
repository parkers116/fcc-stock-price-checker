const mongoose = require("mongoose");
const Schema = mongoose.Schema();

let stockLikesSchema = new Schema(
  {
    stock: { type: String, required: true },
    likes: { type: [String], default: [] },
  },
  { collection: "StockLikes" }
);

mongoose.model("StockLikes", stockLikesSchema);
