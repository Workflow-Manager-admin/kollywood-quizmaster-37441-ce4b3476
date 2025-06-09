import React, { useEffect, useState } from "react";
import { getPosterUrl } from "../tmdbService";

/**
 * MovieTimelineChallenge Component
 * Players are given several Kollywood movies per round; must sort in correct release order.
 * 3 rounds, feedback on each.
 */
// PUBLIC_INTERFACE
function MovieTimelineChallenge({ rounds = 3, moviesPerRound = 5, onEnd }) {
  const [quizRounds, setQuizRounds] = useState([]);
  const [currentRound, setCurrentRound] = useState(0);
  const [userOrder, setUserOrder] = useState([]);
  const [checking, setChecking] = useState(false);
  const [result, setResult] = useState([]);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [loading, setLoading] = useState(true);

  async function fetchRandomKollywoodMovies(num) {
    let movies = [];
    for (let page = 1; movies.length < num; page++) {
      const url = `https://api.themoviedb.org/3/discover/movie?api_key=5bc67d3b06aecbd18121a3cbbc16eb59&language=en-US&sort_by=popularity.desc&with_original_language=ta&page=${page}`;
      const resp = await fetch(url);
      const data = await resp.json();
      movies.push(
        ...data.results.filter((m) => m.poster_path && m.title && m.release_date)
      );
    }
    // Remove duplicates and pick num
    movies = movies.filter(
      (m, i, arr) => arr.findIndex(x => x.id === m.id) === i
    ).sort(() => 0.5 - Math.random());
    return movies.slice(0, num);
  }

  async function buildRounds() {
    let roundsArr = [];
    for (let r = 0; r < rounds; r++) {
      const arr = await fetchRandomKollywoodMovies(moviesPerRound + 2); // +2 to reduce risk of missing dates
      // Remove ones without year, keep first moviesPerRound
      const arr2 = arr
        .filter((m) => m.release_date && m.release_date.length >= 4)
        .slice(0, moviesPerRound)
        .map((m) => ({
          id: m.id,
          title: m.title,
          poster: m.poster_path,
          year: parseInt(m.release_date.slice(0, 4)),
        }));
      roundsArr.push(arr2);
    }
    setQuizRounds(roundsArr);
    setUserOrder([...(quizRounds[0] || [])]);
    setLoading(false);
  }

  useEffect(() => {
    buildRounds();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    // Reset userOrder for new round
    if (quizRounds[currentRound]) setUserOrder([...(quizRounds[currentRound] || [])]);
  }, [currentRound, quizRounds]);

  function moveItem(idx, direction) {
    const arr = [...userOrder];
    const newIdx = idx + direction;
    if (newIdx < 0 || newIdx >= arr.length) return;
    [arr[idx], arr[newIdx]] = [arr[newIdx], arr[idx]];
    setUserOrder(arr);
  }

  function checkOrder() {
    setChecking(true);
    const correct = [...userOrder].every((m, i, arr) => {
      if (!i) return true;
      return arr[i-1].year <= m.year;
    });
    setResult(correct ? userOrder.map(() => true) : getOrderFeedback());
    if (correct) setScore((s) => s + 1);
    setTimeout(nextRound, 1800);
  }

  function getOrderFeedback() {
    // Return bool array, true if correct relative to previous
    const correctOrder = [...quizRounds[currentRound]].sort((a, b) => a.year - b.year);
    return userOrder.map((m, i) => m.id === correctOrder[i].id);
  }

  function nextRound() {
    setChecking(false);
    setResult([]);
    if (currentRound + 1 < quizRounds.length) {
      setCurrentRound(r => r + 1);
    } else {
      setFinished(true);
      if (onEnd) onEnd({ score, rounds, quizRounds });
    }
  }

  if (loading || !quizRounds.length) return <div>Loading Movie Timeline Challenge...</div>;

  return (
    <div style={{
      background: "#20295c",
      borderRadius: 16,
      padding: 22,
      maxWidth: 510,
      margin: "auto",
      color: "#fff"
    }}>
      <div style={{ marginBottom: 15 }}>
        <strong>Round {currentRound + 1} / {rounds}</strong>
      </div>
      <div style={{ margin: "12px 0", color: "#a922ff" }}>
        Drag the movies or use arrows to arrange movies chronologically (oldest&nbsp;➔&nbsp;latest)
      </div>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {userOrder.map((m, i) => (
          <li key={m.id} style={{
            background: "#fff1",
            margin: "7px 0",
            padding: "9px 9px",
            borderRadius: 8,
            display: "flex",
            alignItems: "center"
          }}>
            <img src={getPosterUrl(m.poster, "w92")} alt={m.title} style={{ width: 38, borderRadius: 8, marginRight: 12 }} />
            <span style={{ fontWeight: 500, flex: 1 }}>{m.title} ({m.year})</span>
            <button onClick={() => moveItem(i, -1)} disabled={checking || i === 0}>↑</button>
            <button onClick={() => moveItem(i, 1)} disabled={checking || i === userOrder.length - 1}>↓</button>
            {checking && (
              <span style={{
                marginLeft: 10,
                fontWeight: 600,
                color: (result[i]) ? "#09ff89" : "#ff4d59"
              }}>
                {result[i] ? "✔️" : "✖️"}
              </span>
            )}
          </li>
        ))}
      </ul>
      {!checking && !finished && (
        <button className="btn btn-large" style={{ marginTop: 19, background: "#ff05ff" }} onClick={checkOrder}>
          Submit Order
        </button>
      )}
      {finished && (
        <div style={{ marginTop: 19, color: "#ffeb5c", fontWeight: 700 }}>
          Challenge Complete! <br/>
          Score: {score} / {rounds}
        </div>
      )}
      {/* Progress Bar */}
      <div style={{
        marginTop: 16,
        height: 7,
        borderRadius: 7,
        background: "#34204e77"
      }}>
        <div style={{
          height: "100%",
          background: "#ff05ff",
          width: `${((currentRound+1) / rounds) * 100}%`
        }} />
      </div>
    </div>
  );
}

export default MovieTimelineChallenge;
