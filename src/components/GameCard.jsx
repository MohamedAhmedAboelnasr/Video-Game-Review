import { useNavigate } from "react-router-dom";

export default function GameCard({ game }) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/game/${game.id}`)}
      className="bg-gray-800 rounded-2xl overflow-hidden shadow-lg cursor-pointer transform hover:scale-105 hover:shadow-xl transition"
    >
      <img
        src={game.image}
        alt={game.title}
        className="w-full h-44 object-cover"
      />

      <div className="p-3">
        <h2 className="text-lg font-bold">{game.title}</h2>
      </div>
    </div>
  );
}