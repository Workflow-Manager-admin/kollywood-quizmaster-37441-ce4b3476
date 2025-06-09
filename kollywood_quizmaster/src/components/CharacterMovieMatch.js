import React, { useEffect, useState } from "react";
import { getMovieDetails } from "../tmdbService";

/**
 * CharacterMovieMatch Component
 * Players match Kollywood characters (or main actors) to the correct movies by drag and drop.
 */
// PUBLIC_INTERFACE
function CharacterMovieMatch({ numItems = 7, onEnd }) {
  const [quizzes, setQuizzes] = useState([]);
  const [choices, setChoices] = useState([]); // characters
  const [movies, setMovies] = useState([]);   // [{id, answer, title}]
  const [userMatches, setUserMatches] = useState({});
  const [done, setDone] = useState(false);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);

  async function fetchQuizItems() {
    // fetch Kollywood movies with casts
    let tmdbMovies = [];
    let tries = 0;
    for (let page = 1; tmdbMovies.length < numItems && tries < 10; page++, tries++) {
      const url = `https://api.themoviedb.org/3/discover/movie?api_key=5bc67d3b06aecbd18121a3cbbc16eb59&language=en-US&sort_by=popularity.desc&with_original_language=ta&page=${page}`;
      const resp = await fetch(url);
      const data = await resp.json();
      tmdbMovies.push(...data.results.filter((m) => m.poster_path && m.title && m.id));
    }
    // Remove duplicates
    tmdbMovies = tmdbMovies.filter(
      (m, i, arr) => arr.findIndex(x => x.id === m.id) === i
    ).slice(0, numItems);

    // For each, get a character (usually actor's name, else role)
    const full = await Promise.all(
      tmdbMovies.map(async (m) => {
        const url = `https://api.themoviedb.org/3/movie/${m.id}/credits?api_key=5bc67d3b06aecbd18121a3cbbc16eb59`;
        const resp = await fetch(url);
        const data = await resp.json();
        if (data && data.cast && data.cast.length) {
          // Pick a random cast
          const idx = Math.floor(Math.random() * Math.min(4, data.cast.length));
          const cast = data.cast[idx];
          return {
            movieId: m.id,
            poster: m.poster_path,
            title: m.title,
            character: cast.character || cast.name,
            actor: cast.name
          };
        }
        return null;
      })
    );
    const validQuiz = full.filter(Boolean);
    // Build structure for the game
    setQuizzes(validQuiz);
    setChoices(validQuiz.map(q => q.character).sort(() => 0.5 - Math.random()));
    setMovies(validQuiz.map(q => ({ id: q.movieId, answer: q.character, title: q.title, poster: q.poster })));
    setLoading(false);
  }

  useEffect(() => {
    fetchQuizItems();
  }, []);

  function handleDrop(e, movieId) {
    e.preventDefault();
    const char = e.dataTransfer.getData("text");
    setUserMatches(um => ({ ...um, [movieId]: char }));
  }
  function handleDragStart(e, char) {
    e.dataTransfer.setData("text", char);
  }

  function allowDrop(e) { e.preventDefault(); }

  function handleSubmit() {
    // Check results
    let correct = 0;
    quizzes.forEach(q => {
      if (userMatches[q.movieId] === q.character) correct++;
    });
    setResults({ correct, total: quizzes.length });
    setDone(true);
    if (onEnd) onEnd({ correct, total: quizzes.length, quizzes, userMatches });
  }

  function getCharDisplay(char) {
    if (!char) return "—";
    if (char.length > 21) return char.slice(0, 17) + "...";
    return char;
  }

  if (loading) return <div>Loading Character-Movie Match...</div>;
  if (!quizzes.length) return <div>No data for quiz.</div>;
  return (
    <div style={{
      background: "#252742",
      padding: 22,
      borderRadius: 18,
      color: "#fff",
      boxShadow: "0 2px 10px #233",
      maxWidth: 630,
      margin: "auto"
    }}>
      <div style={{ marginBottom: 15, fontWeight: 500 }}>
        Drag the character to its movie.
      </div>
      <div style={{
        display: "flex", flexWrap: "wrap", gap: 16, marginBottom: 28
      }}>
        {choices.map(char => (
          <div
            key={char}
            draggable={!done}
            onDragStart={e => handleDragStart(e, char)}
            style={{
              padding: "10px 18px", 
              minWidth: 80,
              background: "#ddf2ff",
              color: "#234",
              borderRadius: 14,
              cursor: done ? "not-allowed" : "grab",
              opacity: done ? 0.7 : 1,
              userSelect: "none",
              marginBottom: 3,
              boxShadow: "0 2px 8px #ccc8"
            }}>
            {getCharDisplay(char)}
          </div>
        ))}
      </div>
      {/* Movie drop zones */}
      <div>
        {movies.map((m, i) => (
          <div
            key={m.id}
            onDrop={e => !done && handleDrop(e, m.id)}
            onDragOver={allowDrop}
            style={{
              display: "flex",
              alignItems: "center",
              border: "1px solid #ff05ffa9",
              borderRadius: 10,
              padding: "9px 13px",
              marginBottom: 13,
              background: "#36205a77",
              minHeight: 60
            }}>
            <img src={`https://image.tmdb.org/t/p/w92${m.poster}`} alt={m.title} style={{ width: 43, borderRadius: 8, marginRight: 10 }} />
            <div style={{ minWidth: 98, fontWeight: 500 }}>{m.title}</div>
            <div style={{
              marginLeft: "auto",
              fontWeight: 600,
              color: userMatches[m.id] ? "#22ebb0" : "#fff"
            }}>
              {(userMatches[m.id] && getCharDisplay(userMatches[m.id])) || <span style={{ color: "#bbb" }}>Drop here</span>}
            </div>
          </div>
        ))}
      </div>
      {!done ? (
        <button
          className="btn btn-large"
          style={{ marginTop: 16, background: "#ff05ff", color: "#fff" }}
          onClick={handleSubmit}
        >
          Submit Answers
        </button>
      ) : (
        <div style={{ marginTop: 17, color: "#fa0", fontWeight: 700 }}>
          You matched {results.correct} / {results.total} correctly!
          <div style={{ marginTop: 10, fontSize: "0.96em", color: "#44ebb2" }}>
            {quizzes.map(q => (
              <div key={q.movieId}>
                <span style={{ color: "#ffa6ff" }}>{q.title}:</span>
                &nbsp;
                {(userMatches[q.movieId] === q.character)
                  ? "✅"
                  : <span style={{ color: "#f76" }}>❌ (Correct: {q.character})</span>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default CharacterMovieMatch;
