const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  user: String,
  rating: Number,
  comment: String,
});

const gameSchema = new mongoose.Schema({
  title: String,
  image: String,
  reviews: [reviewSchema],
});

module.exports = mongoose.model("Game", gameSchema);