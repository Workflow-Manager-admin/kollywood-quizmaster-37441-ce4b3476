//
// tmdbService.js
//
// Service utility for interacting with The Movie Database (TMDB) API
// Uses API Key: 5bc67d3b06aecbd18121a3cbbc16eb59
//

const TMDB_API_KEY = "5bc67d3b06aecbd18121a3cbbc16eb59";
const TMDB_API_BASE_URL = "https://api.themoviedb.org/3";

// PUBLIC_INTERFACE
/**
 * Fetches movies matching the given search query from TMDB.
 * @param {string} query - The search term (e.g., movie title).
 * @param {number} [page=1] - Pagination page number.
 * @returns {Promise<Object>} TMDB movie search results (paginated).
 */
export async function searchMovies(query, page = 1) {
  const url = `${TMDB_API_BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&language=en-US&query=${encodeURIComponent(
    query
  )}&page=${page}&include_adult=false`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Failed to fetch movies from TMDB");
  }
  return await response.json();
}

// PUBLIC_INTERFACE
/**
 * Fetches movie details by ID from TMDB.
 * @param {number|string} movieId - The TMDB movie ID.
 * @returns {Promise<Object>} Movie details object.
 */
export async function getMovieDetails(movieId) {
  const url = `${TMDB_API_BASE_URL}/movie/${movieId}?api_key=${TMDB_API_KEY}&language=en-US`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Failed to fetch movie details from TMDB");
  }
  return await response.json();
}

// PUBLIC_INTERFACE
/**
 * Fetches image full URL from TMDB poster path.
 * @param {string} posterPath - The 'poster_path' string from TMDB movie.
 * @param {string} [size="w500"] - Size (e.g., "w200", "w500", "original").
 * @returns {string} The full URL to the poster image.
 */
export function getPosterUrl(posterPath, size = "w500") {
  if (!posterPath) return "";
  return `https://image.tmdb.org/t/p/${size}${posterPath}`;
}
