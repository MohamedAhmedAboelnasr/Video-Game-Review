const router = require("express").Router();
const Game = require("../models/Game");

// Get all games
router.get("/", async (req, res) => {
  const games = await Game.find();
  res.json(games);
});

// Get one game
router.get("/:id", async (req, res) => {
  const game = await Game.findById(req.params.id);

  if (!game) {
    return res.status(404).json({ message: "Game not found" });
  }

  res.json(game);
});

// Add game
router.post("/", async (req, res) => {
  const game = new Game(req.body);
  await game.save();

  res.json(game);
});

// Delete game
router.delete("/:id", async (req, res) => {
  await Game.findByIdAndDelete(req.params.id);

  res.json({ message: "Game deleted" });
});

// Add review
router.post("/:id/review", async (req, res) => {
  const game = await Game.findById(req.params.id);

  if (!game) {
    return res.status(404).json({ message: "Game not found" });
  }

  game.reviews.push(req.body);

  await game.save();

  res.json(game);
});

// Delete review by array index
router.delete("/:id/review/:index", async (req, res) => {
  const game = await Game.findById(req.params.id);

  if (!game) {
    return res.status(404).json({ message: "Game not found" });
  }

  const index = Number(req.params.index);

  game.reviews.splice(index, 1);

  await game.save();

  res.json(game);
});

module.exports = router;