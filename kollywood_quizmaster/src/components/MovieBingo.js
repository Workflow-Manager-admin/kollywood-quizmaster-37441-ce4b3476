import React, { useEffect, useState } from "react";
import { getPosterUrl } from "../tmdbService";
import { pickLittleHardMovies } from "../littleHardKollywoodMovies";

// Sample Bingo categories (customize as needed)
const CATEGORIES = [
  { label: "National Award Winner", field: "national_award" },
  { label: "Romantic Genre", field: "romance" },
  { label: "Comedy Genre", field: "comedy" },
  { label: "Released after 2018", field: "after2018" },
  { label: "Superstar Rajinikanth Movie", field: "rajinikanth" }
];

const TMDB_API_KEY = "5bc67d3b06aecbd18121a3cbbc16eb59";

// PUBLIC_INTERFACE
function MovieBingo({ numQuestions = 5, onEnd }) {
  const [categories, setCategories] = useState(CATEGORIES);
  const [movies, setMovies] = useState([]); // One movie per category, shuffle
  const [selections, setSelections] = useState({}); // categoryIdx: movieId
  const [done, setDone] = useState(false);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);

  // Use hand-picked "little hard" Kollywood movies for each category
  async function fetchSampleMoviesByCategories() {
    // Instead of genre filtering, just pick 5 challenging movies.
    const catMovies = pickLittleHardMovies(categories.length);
    setMovies(catMovies);
    setLoading(false);
  }

  async function fetchTMDBSearch(name) {
    const url = `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&language=en-US&query=${encodeURIComponent(
      name
    )}&with_original_language=ta`;
    const resp = await fetch(url);
    const data = await resp.json();
    return data.results.filter((m) => m.poster_path && m.title);
  }

  async function fetchGenreMovie(genreId) {
    // Only Tamil
    const url = `https://api.themoviedb.org/3/discover/movie?api_key=${TMDB_API_KEY}&language=en-US&sort_by=popularity.desc&with_original_language=ta&with_genres=${genreId}`;
    const resp = await fetch(url);
    const data = await resp.json();
    return data.results.filter((m) => m.poster_path && m.title);
  }

  async function fetchYearMovie(yearString) {
    // 'release_date.gte=2019-01-01'
    const url = `https://api.themoviedb.org/3/discover/movie?api_key=${TMDB_API_KEY}&language=en-US&with_original_language=ta&sort_by=popularity.desc&release_date.gte=${yearString}`;
    const resp = await fetch(url);
    const data = await resp.json();
    return data.results.filter((m) => m.poster_path && m.title);
  }

  function pickOne(arr) {
    if (!arr.length) return {};
    return arr[Math.floor(Math.random() * arr.length)];
  }

  useEffect(() => {
    fetchSampleMoviesByCategories();
    // eslint-disable-next-line
  }, []);

  function handleSelect(catIdx, movie) {
    setSelections((prev) => ({ ...prev, [catIdx]: movie.id }));
  }

  function handleSubmit() {
    // For now count if they picked the "intended" movie for that category
    let correct = 0;
    movies.forEach((m, i) => {
      if (selections[i] === m.id) correct++;
    });
    setResults({ correct, total: movies.length });
    setDone(true);
    if (onEnd) onEnd({ correct, total: movies.length, selections, movies });
  }

  if (loading) return <div>Loading Movie Bingo...</div>;
  return (
    <div style={{
      background: "#1f2837",
      color: "#fff",
      padding: 22,
      borderRadius: 20,
      boxShadow: "0 2px 13px #212a",
      maxWidth: 650,
      margin: "auto"
    }}>
      <div style={{ marginBottom: 12, fontWeight: 600 }}>Movie Bingo</div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        {categories.map((cat, idx) => (
          <div key={cat.field} style={{
            border: "1px solid #ff05ff",
            borderRadius: 12,
            background: "#2c2245",
            padding: 12,
            marginBottom: 10
          }}>
            <div style={{ fontWeight: 600, color: "#f6eaff", marginBottom: 7 }}>
              {cat.label}
            </div>
            {movies[idx] && (
              <div style={{
                display: "flex",
                alignItems: "center",
                background: "#fff2",
                borderRadius: 8,
                padding: "8px 0"
              }}>
                <img src={getPosterUrl(movies[idx].poster_path, "w92")} alt={movies[idx].title}
                  style={{ width: 48, borderRadius: 7, marginRight: 12 }} />
                <div>
                  <div style={{ fontWeight: 500, fontSize: "1.05em" }}>{movies[idx].title}</div>
                  <div style={{ fontSize: "0.98em", color: "#aaf", marginBottom: 4 }}>
                    {movies[idx].release_date ? movies[idx].release_date.slice(0, 4) : ""}
                  </div>
                  <button
                    className="btn"
                    style={{
                      background: selections[idx] === movies[idx].id ? "#0ff48c" : "#ff05ff",
                      color: "#fff"
                    }}
                    onClick={() => handleSelect(idx, movies[idx])}
                    disabled={done}
                  >
                    {selections[idx] === movies[idx].id ? "Selected" : "Pick"}
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      {!done ? (
        <button
          className="btn btn-large"
          style={{ marginTop: 20, background: "#ff05ff" }}
          onClick={handleSubmit}
        >
          Submit Bingo
        </button>
      ) : (
        <div style={{ marginTop: 17, color: "#0ff48c", fontWeight: 700 }}>
          You picked {results.correct} / {results.total} correct Kollywood movies!
        </div>
      )}
    </div>
  );
}

export default MovieBingo;
