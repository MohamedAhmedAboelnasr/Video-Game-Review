import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { getGames, saveGames } from "../utils/storage";
import ReviewCard from "../components/ReviewCard";

export default function GamePage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [game, setGame] = useState(null);
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(5);

  useEffect(() => {
    const games = getGames();
    const found = games.find((g) => g.id === Number(id));
    setGame(found);
  }, [id]);

  function addReview() {
    if (!comment) return;

    const games = getGames();

    const updated = games.map((g) => {
      if (g.id === Number(id)) {
        return {
          ...g,
          reviews: [
            ...g.reviews,
            { user: "Guest", rating, comment },
          ],
        };
      }
      return g;
    });

    saveGames(updated);
    setGame(updated.find((g) => g.id === Number(id)));
    setComment("");
  }

  function deleteReview(index) {
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

  if (!game) return <p className="p-5">Game not found</p>;

  return (
    <div className="p-6 max-w-4xl mx-auto">

      <button
        onClick={() => navigate("/")}
        className="mb-4 text-blue-400 hover:underline"
      >
        ← Back
      </button>

      <h1 className="text-3xl font-bold mb-3">{game.title}</h1>

      {/* ✅ FIXED IMAGE (NO CROPPING) */}
      <img
        src={game.image}
        alt={game.title}
        className="w-full max-h-[500px] object-contain bg-black rounded-xl mb-5"
      />

      {/* Add Review */}
      <div className="bg-gray-800 p-4 rounded-xl mb-6">
        <textarea
          placeholder="Write your review..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="w-full p-2 rounded bg-gray-700 border border-gray-600 mb-2"
        />

        <div className="flex gap-2">
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
      </div>

      {/* Reviews */}
      <div className="space-y-4">
        {game.reviews.length === 0 ? (
          <p className="text-gray-400">No reviews yet</p>
        ) : (
          game.reviews.map((r, i) => (
            <div key={i} className="relative group">
              <button
                onClick={() => deleteReview(i)}
                className="absolute top-2 right-2 bg-red-600 px-2 py-1 text-xs rounded"
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