import React, { useState, useEffect } from "react";
import { getPosterUrl } from "../tmdbService";
import { pickLittleHardMovies } from "../littleHardKollywoodMovies";

/**
 * SpinTheWheel Component
 * Players spin for an actor, actress, and year, then must guess a Kollywood movie (title input).
 * Spinner UI provided.
 */
// PUBLIC_INTERFACE
function SpinTheWheel({ numRounds = 7, onEnd }) {
  const ACTORS = [
    "Rajinikanth",
    "Kamal Haasan",
    "Vijay",
    "Ajith Kumar",
    "Suriya",
    "Vikram",
    "Dhanush",
    "Sivakarthikeyan",
    "Samantha Ruth Prabhu",
    "Nayanthara",
    "Trisha",
    "Keerthy Suresh",
    "Jyothika",
    "Sneha",
    "Vijay Sethupathi"
  ];
  const YEARS = [
    1997, 2000, 2005, 2010, 2013, 2016, 2019, 2021, 2023
  ];

  const [spun, setSpun] = useState(false);
  const [spinning, setSpinning] = useState(false);
  const [actor, setActor] = useState("");
  const [actress, setActress] = useState("");
  const [year, setYear] = useState("");
  const [currRound, setCurrRound] = useState(0);
  const [guess, setGuess] = useState("");
  const [result, setResult] = useState("");
  const [quizData, setQuizData] = useState([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [loading, setLoading] = useState(false);
  const [realAnswer, setRealAnswer] = useState(null);

  useEffect(() => {
    // Reset per "round"
    setActor("");
    setActress("");
    setYear("");
    setGuess("");
    setResult("");
    setRealAnswer(null);
    setSpun(false);
    setSpinning(false);
  }, [currRound]);

  async function handleSpin() {
    setSpinning(true);
    setTimeout(async () => {
      // Randomly pick actor, actress, and year
      // Ensure actress different from actor if both are in ACTORS
      let actorPick = ACTORS[Math.floor(Math.random() * ACTORS.length)];
      let actressPool = ACTORS.filter(a => a !== actorPick);
      let actressPick = actressPool[Math.floor(Math.random() * actressPool.length)];
      let yearPick = YEARS[Math.floor(Math.random() * YEARS.length)];
      setActor(actorPick);
      setActress(actressPick);
      setYear(yearPick.toString());
      setSpinning(false);
      setSpun(true);
      // Pre-fetch a real answer (to reveal if needed)
      setLoading(true);
      // Only select movies from little hard Kollywood set
      const hardMovies = pickLittleHardMovies(8); // small pool for spin
      // Try to find a movie within the list that matches all criteria
      let real = null;
      for (let m of hardMovies) {
        try {
          const url = `https://api.themoviedb.org/3/movie/${m.id}/credits?api_key=5bc67d3b06aecbd18121a3cbbc16eb59`;
          const resp = await fetch(url);
          const data = await resp.json();
          const castNames = (data.cast || []).map(c => c.name.trim().toLowerCase());
          if (
            castNames.includes(actorPick.trim().toLowerCase()) &&
            castNames.includes(actressPick.trim().toLowerCase()) &&
            (m.year === yearPick || m.year === parseInt(yearPick))
          ) {
            real = m;
            break;
          }
        } catch (e) { /* skip */ }
      }
      setRealAnswer(real);
      setLoading(false);
    }, 1300 + Math.random() * 1200);
  }

  async function handleGuess() {
    setResult(""); // reset
    if (!guess.trim()) return;
    // Validate against little hard Kollywood movies only
    setLoading(true);
    const hardMovies = pickLittleHardMovies(10);
    let found = false;
    let matchedMovie = null;
    for (let m of hardMovies) {
      if (
        m.title.trim().toLowerCase() === guess.trim().toLowerCase() &&
        ((m.year && m.year.toString() === year) || (m.year && m.year === parseInt(year))) &&
        realAnswer // ensure it matches the precomputed real answer or allow actor/actress to also fit
      ) {
        // double-check cast for strictness
        try {
          const crUrl = `https://api.themoviedb.org/3/movie/${m.id}/credits?api_key=5bc67d3b06aecbd18121a3cbbc16eb59`;
          const crResp = await fetch(crUrl);
          const crData = await crResp.json();
          const castNames = (crData.cast || []).map(c => c.name.trim().toLowerCase());
          if (
            castNames.includes(actor.trim().toLowerCase()) &&
            castNames.includes(actress.trim().toLowerCase())
          ) {
            found = true;
            matchedMovie = m;
            break;
          }
        } catch (e) {}
      }
    }
    if (found) {
      setResult("Correct!");
      setScore((s) => s+1);
    } else {
      setResult("Incorrect! Try again or reveal.");
    }
    setLoading(false);
    setQuizData(arr => [
      ...arr,
      {
        actor, actress, year, guess, correct: found,
        answer: matchedMovie ? matchedMovie.title : (realAnswer ? realAnswer.title : "")
      }
    ]);
  }

  function handleNext() {
    if (currRound+1 < numRounds) {
      setCurrRound(r => r+1);
    } else {
      setGameOver(true);
      if (onEnd) onEnd({ score, quizData });
    }
  }

  return (
    <div style={{
      background: "#201739",
      color: "#fff",
      padding: 25,
      borderRadius: 18,
      boxShadow: "0 3px 13px #540a77a1",
      margin: "auto",
      maxWidth: 430
    }}>
      <div style={{ fontWeight: 600, marginBottom: 10 }}>
        Spin The Wheel! &mdash; Round {currRound+1}/{numRounds}
      </div>
      {/* Spinner */}
      {!spun && (
        <div style={{ textAlign: "center", margin: "25px 0" }}>
          <button className="btn btn-large" style={{
            background: "#ff05ff",
            fontWeight: 700
          }} onClick={handleSpin} disabled={spinning}>
            {spinning ? "Spinning..." : "Spin!"}
          </button>
          <div style={{ marginTop:12, marginBottom:4 }}>
            <SpinnerVisual spinning={spinning} />
          </div>
        </div>
      )}
      {/* Wheel Result */}
      {spun && (
        <div style={{
          background: "#3a104b",
          borderRadius: 10,
          padding: "12px 8px",
          marginBottom: 12,
          display: "flex",
          flexDirection: "column",
          alignItems: "center"
        }}>
          <div><b>Actor:</b> <span style={{ color: "#0ff48c" }}>{actor}</span></div>
          <div><b>Actress:</b> <span style={{ color: "#fd8ae6" }}>{actress}</span></div>
          <div><b>Year:</b> <span style={{ color: "#ffe91c" }}>{year}</span></div>
        </div>
      )}
      {/* Input */}
      {!gameOver && spun && (
        <div style={{ marginBottom: 16 }}>
          <input
            type="text"
            value={guess}
            onChange={e => setGuess(e.target.value)}
            placeholder="Enter Kollywood movie title"
            style={{
              padding: "8px 10px",
              borderRadius: 5,
              border: "1px solid #eee8",
              fontSize: "1rem",
              width: "77%",
              marginRight: 8
            }}
            disabled={loading || !!result}
            onKeyDown={(e) => e.key === "Enter" && handleGuess()}
          />
          <button
            className="btn"
            style={{ background: "#ff05ff", color: "#fff" }}
            onClick={handleGuess}
            disabled={loading || !!result}
          >
            Guess
          </button>
        </div>
      )}
      {/* Feedback */}
      {result && (
        <div style={{
          color: result === "Correct!" ? "#0ff48c" : "#ffa76a",
          fontWeight: 500,
          margin: "7px 0 11px"
        }}>{result}</div>
      )}
      {/* Reveal and Next */}
      {!gameOver && spun && (
        <div>
          <button
            className="btn btn-large"
            style={{ marginRight: 12, marginBottom: 7, background: "#9997" }}
            onClick={handleNext}
            disabled={loading}
          >
            {currRound+1 < numRounds ? "Next Round" : "Finish"}
          </button>
          <button
            className="btn"
            style={{ background: "#555", fontSize: "0.98em" }}
            onClick={() => setResult(
              realAnswer ? `Reveal: ${realAnswer.title}` : "No TMDB result!"
            )}
          >
            Reveal
          </button>
        </div>
      )}
      {/* Results */}
      {gameOver && (
        <div style={{ marginTop: 12, color: "#ffe91c", fontWeight: 700 }}>
          Game Over!<br />Score: {score} / {numRounds}
        </div>
      )}
      {/* Progress Bar */}
      <div style={{
        marginTop: 19,
        height: 7,
        borderRadius: 7,
        background: "#46397544"
      }}>
        <div style={{
          height: "100%",
          width: `${((currRound+1)/numRounds)*100}%`,
          background: "#ff05ff"
        }} />
      </div>
    </div>
  );
}

// Spin Visual UI subcomponent
function SpinnerVisual({ spinning }) {
  return (
    <div style={{
      width: 60,
      height: 60,
      borderRadius: "50%",
      border: "8px solid #ff05ff",
      borderTop: "8px solid #0ff48c",
      animation: spinning ? "spinAnim 1.1s linear infinite" : "none",
      margin: "auto"
    }}>
      <style>
        {`@keyframes spinAnim {
          0% { transform: rotate(0deg);}
          100% { transform: rotate(360deg);}
        }`}
      </style>
    </div>
  );
}

export default SpinTheWheel;
