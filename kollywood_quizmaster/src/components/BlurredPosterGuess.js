import React, { useEffect, useState } from "react";
import { getPosterUrl } from "../tmdbService";
import { pickLittleHardMovies } from "../littleHardKollywoodMovies";
/**
 * BlurredPosterGuess Component
 * 
 * Players see a blurred Kollywood movie poster, two clues, input to guess, and can reveal answer or skip.
 * Uses TMDB API data.
 */
// PUBLIC_INTERFACE
function BlurredPosterGuess({ numQuestions = 10, onEnd }) {
  const [questions, setQuestions] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [feedback, setFeedback] = useState("");
  const [revealed, setRevealed] = useState(false);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);

  // Use hand-picked challenging Kollywood movies instead of TMDB random API
  async function buildQuestions() {
    const arr = pickLittleHardMovies(numQuestions);
    // Optionally fetch top actor name as clue if available on TMDB
    const qArr = await Promise.all(
      arr.map(async (movie) => {
        let topActor = "";
        try {
          const url = `https://api.themoviedb.org/3/movie/${movie.id}/credits?api_key=5bc67d3b06aecbd18121a3cbbc16eb59`;
          const resp = await fetch(url);
          const data = await resp.json();
          if (data && data.cast && data.cast.length)
            topActor = data.cast[0].name;
        } catch (e) { topActor = ""; }
        return {
          id: movie.id,
          answer: movie.title,
          poster: movie.poster_path,
          clues: [
            movie.sample_clue
              ? `Clue: ${movie.sample_clue}`
              : undefined,
            movie.year ? `Year: ${movie.year}` : undefined,
            topActor ? `Top Actor: ${topActor}` : "",
          ].filter(Boolean)
        };
      })
    );
    setQuestions(qArr);
    setLoading(false);
  }

  useEffect(() => {
    buildQuestions();
    // eslint-disable-next-line
  }, []);

  function handleInput(e) {
    setUserAnswer(e.target.value);
    setFeedback("");
  }

  function checkAnswer() {
    if (!userAnswer.trim()) return;
    if (
      userAnswer.trim().toLowerCase() ===
      questions[currentIdx].answer.trim().toLowerCase()
    ) {
      setFeedback("Correct!");
      setScore((s) => s + 1);
      setTimeout(handleNext, 1200);
    } else {
      setFeedback("Incorrect, try again.");
    }
  }

  function handleReveal() {
    setRevealed(true);
  }

  function handleNext() {
    setRevealed(false);
    setUserAnswer("");
    setFeedback("");
    if (currentIdx + 1 < questions.length) {
      setCurrentIdx(i => i + 1);
    } else {
      if (onEnd) onEnd(score, questions);
    }
  }

  if (loading) return <div>Loading Blurred Poster Guess...</div>;
  if (!questions.length) return <div>No quiz data found.</div>;

  const quiz = questions[currentIdx];

  return (
    <div style={{
        background: "#23273f",
        borderRadius: 16,
        padding: 24,
        maxWidth: 420,
        margin: "auto",
        color: "#fff",
        boxShadow: "0 2px 10px #222b"
      }}>
      <div style={{ marginBottom: 18 }}>
        <strong>Question {currentIdx + 1} / {questions.length}</strong>
      </div>
      {/* Blurred Poster */}
      <div style={{ margin: "0 0 18px", textAlign: "center" }}>
        <img
          src={getPosterUrl(quiz.poster, "w342")}
          alt="Blurred poster"
          style={{
            width: 210,
            height: 310,
            objectFit: "cover",
            borderRadius: 12,
            filter: !revealed ? "blur(14px) brightness(0.82)" : "none",
            transition: "0.6s filter"
          }}
        />
      </div>
      {/* Clues */}
      <div style={{ marginBottom: 13, fontSize: "1.07rem" }}>
        <ul style={{ margin: 0, paddingLeft: 22, color: "#dfb6ff" }}>
          {quiz.clues.slice(0,2).map((c,i) => <li key={i}>{c}</li>)}
        </ul>
      </div>
      {/* Input Area */}
      {!revealed ? (
        <div style={{ marginBottom: 16 }}>
          <input
            type="text"
            value={userAnswer}
            placeholder="Guess Kollywood movie"
            onChange={handleInput}
            onKeyDown={(e) => e.key === "Enter" && checkAnswer()}
            style={{
              padding: "8px 10px",
              borderRadius: 5,
              border: "1px solid #eee8",
              fontSize: "1rem",
              width: "76%",
              marginRight: 8
            }}
          />
          <button
            className="btn"
            style={{ background: "#ff05ff", color: "#fff" }}
            onClick={checkAnswer}
          >
            Guess
          </button>
        </div>
      ) : null}
      {feedback && (
        <div style={{
          color: feedback === "Correct!" ? "#0ff48c" : "#ffa76a",
          fontWeight: 500,
          marginBottom: 10
        }}>{feedback}</div>
      )}
      {/* Reveal or Next */}
      <div>
        {!revealed && (
          <button className="btn btn-large" style={{ marginTop: 4 }} onClick={handleReveal}>
            Reveal Answer
          </button>
        )}
        {revealed && (
          <div>
            <div style={{
              margin: "12px 0",
              background: "#34204e",
              borderRadius: 8,
              padding: 10,
              fontWeight: 500
            }}>
              Answer: <span style={{ color: "#ffe91c" }}>{quiz.answer}</span>
            </div>
            <button className="btn btn-large" style={{ marginTop: 2 }} onClick={handleNext}>
              {currentIdx + 1 === questions.length ? "Finish" : "Next"}
            </button>
          </div>
        )}
      </div>
      {/* Progress Bar */}
      <div style={{
        marginTop: 16,
        height: 7,
        borderRadius: 6,
        width: "100%",
        background: "#45347555",
        overflow: "hidden"
      }}>
        <div style={{
          width: `${((currentIdx+1) / questions.length) * 100}%`,
          height: "100%",
          background: "#ff05ff"
        }} />
      </div>
      {/* Score */}
      <div style={{ marginTop: 9, fontSize: "0.99rem", color: "#aafffcad" }}>
        Score: {score}
      </div>
    </div>
  );
}

export default BlurredPosterGuess;
