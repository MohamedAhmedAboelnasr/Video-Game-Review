import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { getGames, saveGames } from "../utils/storage";
import { useAuth } from "../context/AuthContext";

export default function GamePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [game, setGame] = useState(null);
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(5);
  const [reviewSearch, setReviewSearch] = useState("");

  // Load game
  useEffect(() => {
    const games = getGames();
    setGame(games.find((g) => g.id === Number(id)));
  }, [id]);

  // ⭐ Average rating
  const avgRating =
    game && game.reviews.length > 0
      ? (
          game.reviews.reduce((sum, r) => sum + r.rating, 0) /
          game.reviews.length
        ).toFixed(1)
      : null;

  // ➕ Add review
  function addReview() {
    if (!comment) return;

    const games = getGames();

    const updated = games.map((g) =>
      g.id === Number(id)
        ? {
            ...g,
            reviews: [
              ...g.reviews,
              {
                user: user?.username || "Guest", // ✅ username used
                rating,
                comment,
              },
            ],
          }
        : g
    );

    saveGames(updated);
    setGame(updated.find((g) => g.id === Number(id)));
    setComment("");
    setRating(5);
  }

  // 🗑️ Delete review (ONLY OWNER)
  function deleteReview(index) {
    const confirmDelete = window.confirm("Delete this review?");
    if (!confirmDelete) return;

    const games = getGames();

    const updated = games.map((g) =>
      g.id === Number(id)
        ? {
            ...g,
            reviews: g.reviews.filter((_, i) => i !== index),
          }
        : g
    );

    saveGames(updated);
    setGame(updated.find((g) => g.id === Number(id)));
  }

  if (!game) {
    return (
      <div className="p-6 text-white text-center">
        Game not found
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto text-white">

      {/* 🔙 Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 px-4 py-2 mb-6 rounded-xl 
                   bg-white/10 backdrop-blur border border-white/20 
                   hover:bg-white/20 hover:scale-105 
                   transition-all duration-200 shadow-md"
      >
        <span className="text-lg">←</span>
        <span className="font-medium">Back</span>
      </button>

      {/* 🎮 Title */}
      <h1 className="text-3xl font-bold mb-2">{game.title}</h1>

      {/* ⭐ Average Rating */}
      {avgRating && (
        <p className="mb-4 text-yellow-400 font-semibold">
          ⭐ {avgRating} / 5 ({game.reviews.length} reviews)
        </p>
      )}

      {/* 🖼️ Image (NO CROPPING) */}
      <img
        src={game.image}
        alt={game.title}
        className="w-full max-h-[500px] object-contain bg-black rounded-xl mb-6"
      />

      {/* ✍️ Add Review */}
      <div className="bg-white/10 backdrop-blur p-4 rounded-xl mb-6">
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Write review..."
          className="w-full p-2 rounded bg-black/30 mb-3 focus:outline-none"
        />

        {/* ⭐ Star Rating */}
        <div className="flex gap-1 text-2xl cursor-pointer mb-3">
          {[1, 2, 3, 4, 5].map((n) => (
            <span
              key={n}
              onClick={() => setRating(n)}
              className={
                n <= rating ? "text-yellow-400" : "text-gray-500"
              }
            >
              ★
            </span>
          ))}
        </div>

        <button
          onClick={addReview}
          className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded"
        >
          Submit Review
        </button>

        <p className="text-sm text-gray-400 mt-2">
          Posting as: {user ? user.username : "Guest"}
        </p>
      </div>

      {/* 🔍 Search Reviews */}
      <input
        placeholder="Search reviews..."
        value={reviewSearch}
        onChange={(e) => setReviewSearch(e.target.value)}
        className="w-full mb-4 p-2 rounded bg-black/30 focus:outline-none"
      />

      {/* 🧾 Reviews */}
      <div className="space-y-4">
        {game.reviews.length === 0 ? (
          <p className="text-gray-400">No reviews yet</p>
        ) : (
          game.reviews
            .filter((r) =>
              r.comment.toLowerCase().includes(reviewSearch.toLowerCase())
            )
            .map((r, i) => (
              <div
                key={i}
                className="relative bg-white/10 p-3 rounded-xl group"
              >
                {/* 🗑️ Only owner can delete */}
                {user?.username === r.user && (
                  <button
                    onClick={() => deleteReview(i)}
                    className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 px-2 py-1 text-xs rounded opacity-0 group-hover:opacity-100 transition"
                  >
                    🗑️
                  </button>
                )}

                <p className="text-sm text-purple-400">{r.user}</p>
                <p>⭐ {r.rating}</p>
                <p>{r.comment}</p>
              </div>
            ))
        )}
      </div>
    </div>
  );
}