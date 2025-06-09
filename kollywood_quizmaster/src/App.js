import React, { useState } from 'react';
import './App.css';
// Game components:
import BlurredPosterGuess from './components/BlurredPosterGuess';
import CharacterMovieMatch from './components/CharacterMovieMatch';
import MovieBingo from './components/MovieBingo';
import MovieTimelineChallenge from './components/MovieTimelineChallenge';
import SpinTheWheel from './components/SpinTheWheel';

const GAME_MODES = [
  {
    name: "Blurred Poster Guess",
    desc: "Guess the Kollywood movie from a blurred poster and 2 clues.",
    component: BlurredPosterGuess,
    color: "#a82aff"
  },
  {
    name: "Character-Movie Match",
    desc: "Drag character names to their Kollywood movies.",
    component: CharacterMovieMatch,
    color: "#52ebac"
  },
  {
    name: "Movie Bingo",
    desc: "Select movies that match fun Kollywood categories.",
    component: MovieBingo,
    color: "#ff7a3c"
  },
  {
    name: "Movie Timeline Challenge",
    desc: "Arrange Kollywood movies in chronological order.",
    component: MovieTimelineChallenge,
    color: "#0fddd6"
  },
  {
    name: "Spin the Wheel",
    desc: "Spin for actor, actress, and year, then guess the movie.",
    component: SpinTheWheel,
    color: "#feeb2c"
  }
];


function App() {
  const [modeIdx, setModeIdx] = useState(null); // Show null for dashboard
  const [gameResult, setGameResult] = useState(null);

  function startGame(idx) {
    setModeIdx(idx);
    setGameResult(null);
  }

  function exitGame() {
    setModeIdx(null);
    setGameResult(null);
  }

  function handleGameEnd(result) {
    setGameResult(result);
  }

  const CurrentGame = modeIdx !== null ? GAME_MODES[modeIdx].component : null;

  return (
    <div className="app">
      <nav className="navbar">
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
            <div className="logo" style={{ letterSpacing: 1.2 }}>
              <span className="logo-symbol" style={{color: "#ff05ff"}}>🎬</span> Kollywood QuizMaster
            </div>
            {modeIdx !== null && (
              <button className="btn" onClick={exitGame} style={{ background: "#232", color: "#ff05ff" }}>Back to Games</button>
            )}
          </div>
        </div>
      </nav>
      <main>
        <div className="container">
          <div className="hero" style={{ minHeight: "70vh" }}>
            {!CurrentGame && (
              <>
                <div className="subtitle" style={{ color: "#ff05ff" }}>Challenge Yourself: Kollywood Edition</div>
                <h1 className="title">QuizMaster: Choose&nbsp;Your&nbsp;Game</h1>
                <div className="description" style={{ maxWidth: 540 }}>
                  Welcome! Select a Kollywood movie quiz game below. Enjoy the color, clues, and Kollywood magic!
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 26, justifyContent: "center", marginTop: 30 }}>
                  {GAME_MODES.map((g, i) => (
                    <div
                      key={g.name}
                      style={{
                        background: "#1e0930",
                        borderLeft: `8px solid ${g.color}`,
                        borderRadius: 14,
                        boxShadow: "0 2px 10px #392957b6",
                        marginBottom: 5,
                        width: 255,
                        minHeight: 170,
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        padding: "20px 18px",
                        transition: "box-shadow 0.19s",
                        cursor: "pointer"
                      }}
                      onClick={() => startGame(i)}
                    >
                      <div style={{ fontWeight: 700, fontSize: 1.27 + "em", color: g.color }}>
                        {g.name}
                      </div>
                      <div style={{ fontSize: "1.025em", color: "#fff", marginTop: 15, minHeight: 50 }}>
                        {g.desc}
                      </div>
                      <button className="btn btn-large" style={{ width: "96%", background: g.color, marginTop: 16, color: "#271052", fontWeight:600 }}>
                        Play
                      </button>
                    </div>
                  ))}
                </div>
              </>
            )}
            {/* Render picked game */}
            {!!CurrentGame && (
              <div style={{ width: "100%", paddingTop: 32, margin: "auto", maxWidth: 760 }}>
                <CurrentGame onEnd={handleGameEnd} />
                {gameResult && (
                  <div style={{
                    background: "#ff05ff44",
                    borderRadius: 11,
                    padding: 16,
                    marginTop: 24
                  }}>
                    <div style={{ fontWeight: 600, color: "#0ff48c", marginBottom: 5 }}>
                      Game Summary:
                    </div>
                    <pre style={{
                      fontSize: "0.98em",
                      maxHeight: 180,
                      overflowY: "auto",
                      background: "#160c17",
                      borderRadius: 9,
                      color: "#fff9",
                      padding: 10
                    }}>
                      {JSON.stringify(gameResult, null, 2)}
                    </pre>
                    <button className="btn btn-large" style={{ background: "#ff05ff", marginTop: 8, color: "#fff" }} onClick={exitGame}>Return to Games</button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;