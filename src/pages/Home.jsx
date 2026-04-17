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
    if (!window.confirm("Delete this game?")) return;

    const updated = games.filter((g) => g.id !== id);
    setGames(updated);
    saveGames(updated);
  }

  const filteredGames = games.filter((g) =>
    g.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 max-w-6xl mx-auto">

      <h1 className="text-4xl font-bold text-center mb-8">
        🎮 Game Review Hub
      </h1>

      {/* Search */}
      <input
        placeholder="Search games..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full mb-6 p-3 rounded-xl bg-white/10 backdrop-blur border border-white/20 focus:outline-none"
      />

      {/* Add Game */}
      <div className="bg-white/10 backdrop-blur p-4 rounded-xl mb-6 flex gap-3 flex-wrap">

        <input
          placeholder="Game title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="flex-1 p-2 rounded bg-black/30 border border-white/20"
        />

        <input
          type="file"
          onChange={handleImageUpload}
          id="fileUpload"
          className="hidden"
        />

        <label
          htmlFor="fileUpload"
          className="bg-purple-500 hover:bg-purple-600 px-4 py-2 rounded-lg cursor-pointer"
        >
          Upload
        </label>

        <button
          onClick={addGame}
          className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg"
        >
          Add
        </button>
      </div>

      {/* Games */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {filteredGames.map((game) => (
          <div
            key={game.id}
            className="relative rounded-xl overflow-hidden group shadow-lg"
          >
            <button
              onClick={() => deleteGame(game.id)}
              className="absolute top-2 right-2 bg-red-600 px-2 py-1 text-xs rounded z-10"
            >
              🗑️
            </button>

            <div onClick={() => navigate(`/game/${game.id}`)}>

              <img
                src={game.image}
                className="w-full h-48 object-cover group-hover:scale-110 transition"
              />

              <div className="absolute bottom-0 w-full bg-gradient-to-t from-black/80 p-2">
                <h2 className="font-bold text-sm">{game.title}</h2>
              </div>

            </div>
          </div>
        ))}
      </div>
    </div>
  );
}