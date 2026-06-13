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
    async function loadGames() {
      try {
        const data = await getGames();
        setGames(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to load games:", err);
      }
    }

    loadGames();
  }, []);

  function handleImageUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onloadend = () => {
      setImage(reader.result);
    };

    reader.readAsDataURL(file);
  }

  async function addGame() {
    if (!title || !image) return;

    try {
      const newGame = {
        title,
        image,
        reviews: [],
      };

      const savedGame = await saveGames(newGame);

      setGames((prev) => [...prev, savedGame]);

      setTitle("");
      setImage("");
    } catch (err) {
      console.error("Failed to save game:", err);
    }
  }

  async function deleteGame(id) {
    if (!window.confirm("Delete this game?")) return;

    try {
      await deleteGameApi(id);

      setGames((prev) => prev.filter((g) => g._id !== id));
    } catch (err) {
      console.error("Failed to delete game:", err);
    }
  }

  const filteredGames = games.filter((g) =>
    g.title?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-4xl font-bold text-center mb-8">
        🎮 Game Review Hub
      </h1>

      <input
        placeholder="Search games..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full mb-6 p-3 rounded-xl bg-white/10 backdrop-blur border border-white/20 focus:outline-none"
      />

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

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {filteredGames.map((game) => (
          <div
            key={game._id}
            className="relative rounded-xl overflow-hidden group shadow-lg"
          >
            <button
              onClick={() => deleteGame(game._id)}
              className="absolute top-2 right-2 bg-red-600 px-2 py-1 text-xs rounded z-10"
            >
              🗑️
            </button>

            <div onClick={() => navigate(`/game/${game._id}`)}>
              <img
                src={game.image}
                alt={game.title}
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