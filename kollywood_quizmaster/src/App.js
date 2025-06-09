import React, { useState } from 'react';
import './App.css';
import { searchMovies, getPosterUrl } from './tmdbService';

function App() {
  // Demo: fetch movies by title using TMDB
  const [movieQuery, setMovieQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);

  // PUBLIC_INTERFACE
  /**
   * Handles TMDB search form submission.
   * @param {Event} e
   */
  async function handleSearch(e) {
    e.preventDefault();
    if (!movieQuery.trim()) return;
    setLoading(true);
    try {
      const results = await searchMovies(movieQuery);
      setSearchResults(results.results || []);
    } catch (err) {
      setSearchResults([]);
    }
    setLoading(false);
  }

  return (
    <div className="app">
      <nav className="navbar">
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
            <div className="logo">
              <span className="logo-symbol">*</span> KAVIA AI
            </div>
            <button className="btn">Template Button</button>
          </div>
        </div>
      </nav>

      <main>
        <div className="container">
          <div className="hero">
            <div className="subtitle">AI Workflow Manager Template</div>
            <h1 className="title">kollywood_quizmaster</h1>
            <div className="description">
              Start building your application.
            </div>

            {/* TMDB Movie Search Example */}
            <form onSubmit={handleSearch} style={{ margin: '20px 0', display: 'flex', gap: 12, justifyContent: 'center' }}>
              <input
                type="text"
                placeholder="Search Kollywood movies (TMDB demo)"
                value={movieQuery}
                onChange={e => setMovieQuery(e.target.value)}
                style={{
                  padding: '8px 12px',
                  fontSize: '1rem',
                  border: '1px solid #bbb',
                  borderRadius: 4,
                  minWidth: 260,
                }}
              />
              <button className="btn btn-large" type="submit" disabled={loading}>
                {loading ? "Searching..." : "Search"}
              </button>
            </form>

            {searchResults.length > 0 && (
              <div style={{
                border: '1px solid #2227',
                borderRadius: 8,
                background: '#2226',
                maxWidth: 420,
                margin: 'auto',
                padding: '18px'
              }}>
                <strong>Results from TMDB:</strong>
                <ul style={{ padding: 0, marginTop: 12 }}>
                  {searchResults.map(movie =>
                    <li key={movie.id} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12, listStyle: 'none' }}>
                      {movie.poster_path &&
                        <img src={getPosterUrl(movie.poster_path, "w92")} alt={movie.title} style={{ width: 44, borderRadius: 4 }} />}
                      <span>{movie.title} {movie.release_date ? `(${movie.release_date.substring(0, 4)})` : ''}</span>
                    </li>
                  )}
                </ul>
              </div>
            )}

            <button className="btn btn-large">Button</button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;