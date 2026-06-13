// const KEY = "games_data";
const API_URL = "http://localhost:5000/api/games"; // Change to your backend URL

export async function getGames() {
  const response = await fetch(API_URL);

  if (!response.ok) {
    throw new Error("Failed to fetch games");
  }

  return await response.json();
}

export async function saveGames(game) {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(game),
  });

  if (!response.ok) {
    throw new Error("Failed to save game");
  }

  return await response.json();
}

export async function getGame(id) {
  const res = await fetch(`${API_URL}/${id}`);
  return await res.json();
}

export async function addReview(gameId, review) {
  const res = await fetch(`${API_URL}/${gameId}/reviews`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(review),
  });

  return await res.json();
}

export async function deleteReview(gameId, reviewIndex) {
  const res = await fetch(
    `${API_URL}/${gameId}/reviews/${reviewIndex}`,
    {
      method: "DELETE",
    }
  );

  return await res.json();
}

// export function getGames() {
//   const data = localStorage.getItem(KEY);
//   return data ? JSON.parse(data) : [];
// }

// export function saveGames(games) {
//   localStorage.setItem(KEY, JSON.stringify(games));
// }