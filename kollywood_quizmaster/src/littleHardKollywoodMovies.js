//
// littleHardKollywoodMovies.js
//
// A curated list of "little hard" (moderately obscure, non-mainstream) Kollywood (Tamil) movies
// Used to add challenge to quiz question selection across all modes.
//

// List includes less popular, festival favorites, critically acclaimed, or cult favorites, not mass blockbusters.
// TMDB ids carefully included for API lookups.
const LITTLE_HARD_MOVIES = [
  // Format: { id, title, year, poster_path: "", sample_clue: "" }

  { id: 257273, title: "Onaayum Aattukkuttiyum", year: 2013, poster_path: "/jT5dlvlQCbheE2GqjSH08hWSs4W.jpg", sample_clue: "Myskin's tense night thriller." },
  { id: 49199, title: "Azhagar Samiyin Kuthirai", year: 2011, poster_path: "/w2fT4u3ZkHaCVAts4KAWYaBJQ8x.jpg", sample_clue: "A missing horse in a village causes chaos; Prabhu Solomon's rural film." },
  { id: 293870, title: "Vidiyum Munn", year: 2013, poster_path: "/AofDWLuOHdjTlil1UPTYilBzNI4.jpg", sample_clue: "A gritty female-led thriller, pre-dawn drama." },
  { id: 386083, title: "Super Deluxe", year: 2019, poster_path: "/dQ2jMzz3RoMUqGWTs9dwGHd0KBs.jpg", sample_clue: "Thiagarajan Kumararaja's genre-bending multi-story." },
  { id: 300666, title: "Kaaka Muttai", year: 2014, poster_path: "/xg7J8RVfJrjZZ9vFZRu1cNYsmOr.jpg", sample_clue: "Children yearn for a slice of pizza in Chennai's slums." },
  { id: 509652, title: "Aruvi", year: 2016, poster_path: "/yBPdZiZsaAJ2bXqVUuAv89xDSHL.jpg", sample_clue: "Powerful debut of Aditi Balan, social drama." },
  { id: 370243, title: "Pariyerum Perumal", year: 2018, poster_path: "/bgBWGNsq4CPGKcHBXHiY/VKwxLB.jpg", sample_clue: "Dalit youth vs. caste barriers; Pa. Ranjith production." },
  { id: 352819, title: "Kuttram Kadithal", year: 2015, poster_path: "/p6hDrBHeZyznxmIPGyRnrWlYx9v.jpg", sample_clue: "National Award winner: a teacher, a slap, consequences." },
  { id: 416586, title: "Kurangu Bommai", year: 2017, poster_path: "/2DKhQdmQzVuhRCdqwZArwIn2djN.jpg", sample_clue: "Hyperlinked crime drama with a wooden monkey bag." },
  { id: 855803, title: "Oththa Seruppu Size 7", year: 2019, poster_path: "/iLYDUS4z7YT1Do1B4ezgmO6ijLx.jpg", sample_clue: "Parthiban's one-man show, the only actor on screen." },
  { id: 454077, title: "Vetri Maaran's Visaranai", year: 2015, poster_path: "/cjtZQKfsn7kYMva9nqCuWHa3gw6.jpg", sample_clue: "A harrowing cop drama based on a true incident." },
  { id: 548812, title: "Merku Thodarchi Malai", year: 2018, poster_path: "/r8Aos75G9H1lOLRqeDyDRr1IkeN.jpg", sample_clue: "Poetic, slow mountain drama, farmer's daily struggle." },
  { id: 211320, title: "Moodar Koodam", year: 2013, poster_path: "/8jExwJlU4lWz0jn6OaFHDyRJcX6.jpg", sample_clue: "Dark crime-comedy; heist goes awry." },
  { id: 227401, title: "Pizza", year: 2012, poster_path: "/cdmJpD53BvxHlkRQAt2bQVWwtIg.jpg", sample_clue: "Low-budget horror that kickstarted a genre wave." },
  { id: 283779, title: "Soodhu Kavvum", year: 2013, poster_path: "/5NlF5HHOg79DbDeihdj5Z8SGvtQ.jpg", sample_clue: "Absurdist black comedy involving a fake kidnapping." },
  { id: 539210, title: "Orange Mittai", year: 2015, poster_path: "/ixP7eFEiY8ybSpHDcck3sMJJgZD.jpg", sample_clue: "Vijay Sethupathi as a cranky old man in an ambulance ride." },
  { id: 447552, title: "Jigarthanda", year: 2014, poster_path: "/2myQC2H2bFhdZr6rROr4EeL74RY.jpg", sample_clue: "Filmmaker meets gangster; 'Karthik Subbaraj' signature." },
  { id: 453679, title: "Sarvam Thaala Mayam", year: 2018, poster_path: "/qztGXrRWnjMFUSmmv0cJQUa6UnG.jpg", sample_clue: "A.P. Sridhar's musical journey, G.V.Prakash as a percussionist." },

  // ... (extend with more hand-picked harder Kollywood titles as needed)
];

// Shuffle and select n items
export function pickLittleHardMovies(n = 10) {
  const pool = LITTLE_HARD_MOVIES.slice();
  // Shuffle
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool.slice(0, n);
}

export default LITTLE_HARD_MOVIES;
