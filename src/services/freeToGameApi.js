const BASE_URL = "https://www.freetogame.com/api";
const REQUEST_TIMEOUT = 10000;

const requestJson = async (url, signal) => {
  let timeoutId;
  try {
    const request = fetch(url, { signal });
    const timeoutRequest = new Promise((_, reject) => {
      timeoutId = setTimeout(
        () => reject(new Error("Tempo limite da requisição excedido")),
        REQUEST_TIMEOUT,
      );
    });
    const response = await Promise.race([request, timeoutRequest]);
    if (!response.ok) throw new Error(`Resposta HTTP ${response.status}`);
    const json = await response.json();
    if (!json || (Array.isArray(json) === false && typeof json !== "object")) {
      throw new Error("Resposta JSON inválida");
    }
    return json;
  } finally {
    clearTimeout(timeoutId);
  }
};

export const fetchGames = async (signal) => {
  const data = await requestJson(`${BASE_URL}/games`, signal);
  if (!Array.isArray(data)) throw new Error("Catálogo remoto inválido");
  return data;
};

export const fetchGameDetails = async (id, signal) => {
  const data = await requestJson(
    `${BASE_URL}/game?id=${encodeURIComponent(id)}`,
    signal,
  );
  if (!data || typeof data !== "object" || Array.isArray(data))
    throw new Error("Detalhe remoto inválido");
  return data;
};
