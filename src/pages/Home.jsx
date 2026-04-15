import { useState, useEffect } from "react";
import { getGames, saveGames } from "../utils/storage";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const [games, setGames] = useState([]);
  const [title, setTitle] = useState("");
  const [image, setImage] = useState("");
  const [search, setSearch] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    setGames(getGames());
  }, []);

  function handleImageUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => setImage(reader.result);
    reader.readAsDataURL(file);
  }

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

  function deleteGame(id) {
    const confirmDelete = window.confirm("Delete this game?");
    if (!confirmDelete) return;

    const updated = games.filter((g) => g.id !== id);
    setGames(updated);
    saveGames(updated);
  }

  const filteredGames = games.filter((g) =>
    g.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 max-w-6xl mx-auto text-white">

      <h1 className="text-3xl font-bold mb-6 text-center">
        🎮 Game Review Hub
      </h1>

      {/* Search */}
      <input
        type="text"
        placeholder="Search games..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full mb-5 p-3 rounded bg-gray-800 border border-gray-600 focus:outline-none"
      />

      {/* Add Game */}
      <div className="bg-gray-800 p-4 rounded-xl mb-6 flex flex-col md:flex-row gap-3 items-center">

        <input
          placeholder="Game title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="flex-1 p-2 rounded bg-gray-700 border border-gray-600"
        />

        {/* Hidden Input */}
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

        <button
          onClick={addGame}
          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded font-semibold"
        >
          Add Game
        </button>
      </div>

      {/* Preview */}
      {image && (
        <div className="mb-6">
          <img
            src={image}
            className="w-40 rounded border border-gray-700"
          />
        </div>
      )}

      {/* Games */}
      {filteredGames.length === 0 ? (
        <p className="text-center text-gray-400">No games found</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {filteredGames.map((game) => (
            <div
              key={game.id}
              className="relative bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:scale-105 transition"
            >
              {/* Delete */}
              <button
                onClick={() => deleteGame(game.id)}
                className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 px-2 py-1 text-xs rounded z-10"
              >
                🗑️
              </button>

              {/* Image + Overlay */}
              <div
                onClick={() => navigate(`/game/${game.id}`)}
                className="cursor-pointer relative"
              >
                <img
                  src={game.image}
                  alt={game.title}
                  className="w-full h-44 object-cover"
                />

                {/* Title Overlay */}
                <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/80 to-transparent p-2">
                  <h2 className="text-sm font-bold text-white">
                    {game.title}
                  </h2>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}