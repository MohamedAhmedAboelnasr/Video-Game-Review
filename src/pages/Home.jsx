import { useState, useEffect } from "react";
import { getGames, saveGames } from "../utils/storage";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const [games, setGames] = useState([]);
  const [title, setTitle] = useState("");
  const [image, setImage] = useState("");
  const [search, setSearch] = useState("");

  const navigate = useNavigate();

  // Load games
  useEffect(() => {
    setGames(getGames());
  }, []);

  // 📁 Upload image from PC
  function handleImageUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => setImage(reader.result);
    reader.readAsDataURL(file);
  }

  // ➕ Add game
  function addGame() {
    if (!title || !image) return;

    const newGame = {
      id: Date.now(),
      title,
      image,
      reviews: [],
    };

    const updated = [...games, newGame];
    setGames(updated);
    saveGames(updated);

    setTitle("");
    setImage("");
  }

  // 🗑️ Delete game
  function deleteGame(id) {
    const confirmDelete = window.confirm("Are you sure you want to delete this game?");
    if (!confirmDelete) return;

    const updated = games.filter((g) => g.id !== id);
    setGames(updated);
    saveGames(updated);
  }

  // 🔍 Real-time search
  const filteredGames = games.filter((g) =>
    g.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 max-w-6xl mx-auto text-white">

      {/* Title */}
      <h1 className="text-3xl font-bold mb-6 text-center">
        🎮 Game Review Hub
      </h1>

      {/* 🔍 Search Bar */}
      <input
        type="text"
        placeholder="Search games..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full mb-5 p-3 rounded bg-gray-800 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
      />

      {/* ➕ Add Game Section */}
      <div className="bg-gray-800 p-4 rounded-xl mb-6 flex flex-col md:flex-row gap-3 items-center">

        {/* Title Input */}
        <input
          placeholder="Game title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="flex-1 p-2 rounded bg-gray-700 border border-gray-600 focus:outline-none"
        />

        {/* Hidden File Input */}
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          id="fileUpload"
          className="hidden"
        />

        {/* Upload Button */}
        <label
          htmlFor="fileUpload"
          className="cursor-pointer bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded font-semibold transition"
        >
          📁 Upload Image
        </label>

        {/* Add Button */}
        <button
          onClick={addGame}
          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded font-semibold transition"
        >
          Add Game
        </button>
      </div>

      {/* Image Preview */}
      {image && (
        <div className="mb-6">
          <p className="text-sm text-gray-400 mb-2">Preview:</p>
          <img
            src={image}
            alt="preview"
            className="w-40 rounded-lg border border-gray-700"
          />
        </div>
      )}

      {/* 🎮 Games Grid */}
      {filteredGames.length === 0 ? (
        <p className="text-center text-gray-400">No games found</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {filteredGames.map((game) => (
            <div
              key={game.id}
              className="relative bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:scale-105 transition"
            >
              {/* 🗑️ Delete Button */}
              <button
                onClick={() => deleteGame(game.id)}
                className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 px-2 py-1 text-xs rounded z-10"
              >
                🗑️
              </button>

              {/* Game Card */}
              <div onClick={() => navigate(`/game/${game.id}`)} className="cursor-pointer">
                <img
                  src={game.image}
                  alt={game.title}
                  className="w-full h-44 object-cover"
                />

                <div className="p-3">
                  <h2 className="text-lg font-bold">{game.title}</h2>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}