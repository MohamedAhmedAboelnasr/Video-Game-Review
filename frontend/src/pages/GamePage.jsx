import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { getGame, addReview, deleteReview } from "../utils/storage";
import { useAuth } from "../context/AuthContext";

export default function GamePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [game, setGame] = useState(null);
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(5);
  const [reviewSearch, setReviewSearch] = useState("");

  useEffect(() => {
    loadGame();
  }, [id]);

  async function loadGame() {
    try {
      const data = await getGame(id);
      setGame(data);
    } catch (err) {
      console.error(err);
    }
  }

  const avgRating =
    game?.reviews?.length > 0
      ? (
          game.reviews.reduce((sum, r) => sum + r.rating, 0) /
          game.reviews.length
        ).toFixed(1)
      : null;

  async function handleAddReview() {
    if (!comment.trim()) return;

    try {
      const updatedGame = await addReview(id, {
        user: user?.username || "Guest",
        rating,
        comment,
      });

      setGame(updatedGame);
      setComment("");
      setRating(5);
    } catch (err) {
      console.error(err);
    }
  }

  async function handleDeleteReview(index) {
    if (!window.confirm("Delete this review?")) return;

    try {
      const updatedGame = await deleteReview(id, index);
      setGame(updatedGame);
    } catch (err) {
      console.error(err);
    }
  }

  if (!game) {
    return (
      <div className="p-6 text-white text-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto text-white">

      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 px-4 py-2 mb-6 rounded-xl bg-white/10 backdrop-blur border border-white/20 hover:bg-white/20"
      >
        ← Back
      </button>

      <h1 className="text-3xl font-bold mb-2">
        {game.title}
      </h1>

      {avgRating && (
        <p className="mb-4 text-yellow-400 font-semibold">
          ⭐ {avgRating} / 5 ({game.reviews.length} reviews)
        </p>
      )}

      <img
        src={game.image}
        alt={game.title}
        className="w-full max-h-[500px] object-contain bg-black rounded-xl mb-6"
      />

      <div className="bg-white/10 backdrop-blur p-4 rounded-xl mb-6">
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Write review..."
          className="w-full p-2 rounded bg-black/30 mb-3"
        />

        <div className="flex gap-1 text-2xl cursor-pointer mb-3">
          {[1, 2, 3, 4, 5].map((n) => (
            <span
              key={n}
              onClick={() => setRating(n)}
              className={
                n <= rating
                  ? "text-yellow-400"
                  : "text-gray-500"
              }
            >
              ★
            </span>
          ))}
        </div>

        <button
          onClick={handleAddReview}
          className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded"
        >
          Submit Review
        </button>

        <p className="text-sm text-gray-400 mt-2">
          Posting as: {user?.username || "Guest"}
        </p>
      </div>

      <input
        placeholder="Search reviews..."
        value={reviewSearch}
        onChange={(e) => setReviewSearch(e.target.value)}
        className="w-full mb-4 p-2 rounded bg-black/30"
      />

      <div className="space-y-4">
        {game.reviews?.length === 0 ? (
          <p className="text-gray-400">
            No reviews yet
          </p>
        ) : (
          game.reviews
            ?.filter((r) =>
              r.comment
                .toLowerCase()
                .includes(reviewSearch.toLowerCase())
            )
            .map((r, i) => (
              <div
                key={i}
                className="relative bg-white/10 p-3 rounded-xl group"
              >
                {user?.username === r.user && (
                  <button
                    onClick={() => handleDeleteReview(i)}
                    className="absolute top-2 right-2 bg-red-600 px-2 py-1 text-xs rounded opacity-0 group-hover:opacity-100 transition"
                  >
                    🗑️
                  </button>
                )}

                <p className="text-sm text-purple-400">
                  {r.user}
                </p>
                <p>⭐ {r.rating}</p>
                <p>{r.comment}</p>
              </div>
            ))
        )}
      </div>
    </div>
  );
}