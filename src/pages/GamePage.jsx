import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { getGames, saveGames } from "../utils/storage";
import ReviewCard from "../components/ReviewCard";
import { useAuth } from "../context/AuthContext";

export default function GamePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [game, setGame] = useState(null);
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(5);

  // Load game
  useEffect(() => {
    const games = getGames();
    const found = games.find((g) => g.id === Number(id));
    setGame(found);
  }, [id]);

  // ➕ Add Review
  function addReview() {
    if (!comment) return;

    const games = getGames();

    const updated = games.map((g) => {
      if (g.id === Number(id)) {
        return {
          ...g,
          reviews: [
            ...g.reviews,
            {
              user: user?.email || "Guest",
              rating,
              comment,
            },
          ],
        };
      }
      return g;
    });

    saveGames(updated);
    setGame(updated.find((g) => g.id === Number(id)));
    setComment("");
  }

  // 🗑️ Delete Review
  function deleteReview(index) {
    const confirmDelete = window.confirm("Delete this review?");
    if (!confirmDelete) return;

    const games = getGames();

    const updated = games.map((g) => {
      if (g.id === Number(id)) {
        const newReviews = g.reviews.filter((_, i) => i !== index);
        return { ...g, reviews: newReviews };
      }
      return g;
    });

    saveGames(updated);
    setGame(updated.find((g) => g.id === Number(id)));
  }

  if (!game) return <p className="p-5 text-white">Game not found</p>;

  return (
    <div className="p-6 max-w-4xl mx-auto text-white">

      <button
        onClick={() => navigate("/")}
        className="mb-4 text-blue-400 hover:underline"
      >
        ← Back
      </button>

      <h1 className="text-3xl font-bold mb-3">{game.title}</h1>

      <img
        src={game.image}
        alt={game.title}
        className="w-full max-h-[500px] object-contain bg-black rounded-xl mb-5"
      />

      {/* ✍️ Add Review */}
      <div className="bg-gray-800 p-4 rounded-xl mb-6">
        <textarea
          placeholder="Write your review..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="w-full p-2 rounded bg-gray-700 border border-gray-600 mb-2 focus:outline-none"
        />

        <div className="flex gap-2 items-center">
          <select
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
            className="p-2 bg-gray-700 rounded border border-gray-600"
          >
            {[1, 2, 3, 4, 5].map((n) => (
              <option key={n}>{n}</option>
            ))}
          </select>

          <button
            onClick={addReview}
            className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded"
          >
            Submit Review
          </button>
        </div>

        {/* 👤 Current User */}
        <p className="text-sm text-gray-400 mt-2">
          Posting as: {user ? user.email : "Guest"}
        </p>
      </div>

      {/* 🧾 Reviews */}
      <div className="space-y-4">
        {game.reviews.length === 0 ? (
          <p className="text-gray-400">No reviews yet</p>
        ) : (
          game.reviews.map((r, i) => (
            <div key={i} className="relative">
              
              {/* Delete Button */}
              <button
                onClick={() => deleteReview(i)}
                className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 px-2 py-1 text-xs rounded"
              >
                🗑️
              </button>

              <ReviewCard review={r} />
            </div>
          ))
        )}
      </div>
    </div>
  );
}