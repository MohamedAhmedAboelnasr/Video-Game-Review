const KEY = "games_data";

export function getGames() {
  const data = localStorage.getItem(KEY);
  return data ? JSON.parse(data) : [];
}

export function saveGames(games) {
  localStorage.setItem(KEY, JSON.stringify(games));
}