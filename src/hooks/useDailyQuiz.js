import { useState, useEffect, useCallback, useRef } from "react";
import { base44 } from "@/api/base44Client";
import { getDailyGames, GAME_TYPES } from "../quizData";

export function useDailyQuiz({ lang = "he" } = {}) {
  const today = new Date().toISOString().split("T")[0];
  const [games]                         = useState(() => getDailyGames(today));
  const [gameIndex,  setGameIndex]       = useState(0);
  const [phase,      setPhase]           = useState("intro");
  const [score,      setScore]           = useState(0);
  const [attempts,   setAttempts]        = useState(0);
  const [feedback,   setFeedback]        = useState(null);
  const [selectedIdx,setSelectedIdx]     = useState(null);
  const [results,    setResults]         = useState([]);
  const [alreadyDone,setAlreadyDone]     = useState(false);
  const [recallPhase,   setRecallPhase]  = useState("memorize");
  const [selectedWords, setSelectedWords]= useState([]);
  const [recallAnswers, setRecallAnswers]= useState([]);
  const startTimeRef = useRef(null);
  const currentGame  = games[gameIndex];

  useEffect(() => {
    (async () => {
      try {
        const existing = await base44.entities.UserProgress.filter({ game: "daily_quiz", date: today });
        if (existing && existing.length > 0) setAlreadyDone(true);
      } catch (e) {
        console.error("Failed to check progress:", e);
      }
    })();
  }, [today]);

  const t       = (obj) => (obj ? (obj[lang] ?? obj["he"] ?? "") : "");
  const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);

  const startCurrentGame = useCallback(() => {
    setFeedback(null); setSelectedIdx(null); setScore(0); setAttempts(0);
    startTimeRef.current = Date.now();
    if (currentGame.type === GAME_TYPES.WORD_RECALL) {
      setRecallPhase("memorize"); setSelectedWords([]);
      const pool = shuffle([
        ...currentGame.data.words.map(w => ({ text: t(w), isTarget: true })),
        ...currentGame.data.distractors.map(w => ({ text: t(w), isTarget: false })),
      ]);
      setRecallAnswers(pool);
      setTimeout(() => setRecallPhase("test"), currentGame.showMs ?? 5000);
    }
    setPhase("playing");
  }, [currentGame, lang]);

  const submitAnswer = useCallback((idx) => {
    if (feedback !== null) return;
    setSelectedIdx(idx);
    const isCorrect = currentGame.type === GAME_TYPES.TRIVIA
      ? idx === currentGame.data.correctIndex
      : currentGame.data.options[idx] === currentGame.data.answer;
    setFeedback(isCorrect ? "correct" : "wrong");
    setAttempts(1); setScore(isCorrect ? 1 : 0);
  }, [feedback, currentGame]);

  const toggleWord = useCallback((wordText) => {
    setSelectedWords(prev => prev.includes(wordText) ? prev.filter(w => w !== wordText) : [...prev, wordText]);
  }, []);

  const submitWordRecall = useCallback(() => {
    const targetWords = currentGame.data.words.map(w => t(w));
    let correct = 0;
    selectedWords.forEach(w => { if (targetWords.includes(w)) correct++; });
    const falsePositives = selectedWords.filter(w => !targetWords.includes(w)).length;
    const net = Math.max(0, correct - falsePositives);
    setScore(net); setAttempts(targetWords.length);
    setFeedback(net > 0 ? "correct" : "wrong");
  }, [currentGame, selectedWords, lang]);

  const finishGame = useCallback(async () => {
    const elapsed = Date.now() - (startTimeRef.current ?? Date.now());
    const result = { type: currentGame.type, score, attempts, accuracy: attempts > 0 ? Math.round((score / attempts) * 100) : 0, responseTime: elapsed };
    const updated = [...results, result];
    setResults(updated);
    try {
      await base44.entities.UserProgress.create({ game: "daily_quiz_" + currentGame.type, date: today, level: gameIndex + 1, totalCorrect: score, totalAttempts: attempts, accuracy: result.accuracy, responseTimeMs: elapsed, streak: 1 });
    } catch (e) { console.error("Failed to save progress:", e); }
    if (gameIndex < games.length - 1) {
      setGameIndex(g => g + 1); setPhase("intro"); setFeedback(null); setSelectedIdx(null); setScore(0); setAttempts(0); setRecallPhase("memorize"); setSelectedWords([]);
    } else {
      try {
        const tc = updated.reduce((s,r)=>s+r.score,0), ta = updated.reduce((s,r)=>s+r.attempts,0);
        await base44.entities.UserProgress.create({ game: "daily_quiz", date: today, level: 3, totalCorrect: tc, totalAttempts: ta, accuracy: ta > 0 ? Math.round((tc/ta)*100) : 0, responseTimeMs: updated.reduce((s,r)=>s+r.responseTime,0), streak: 1 });
      } catch(e) { console.error(e); }
      setPhase("done");
    }
  }, [currentGame, score, attempts, results, gameIndex, games.length, today]);

  return { today, games, gameIndex, currentGame, phase, score, attempts, feedback, selectedIdx, results, alreadyDone, recallPhase, recallAnswers, selectedWords, t, startCurrentGame, submitAnswer, toggleWord, submitWordRecall, finishGame, totalGames: games.length, isLastGame: gameIndex === games.length - 1 };
}