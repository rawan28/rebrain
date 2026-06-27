import React from "react";
import { useNavigate } from "react-router-dom";
import { useDailyQuiz } from "../hooks/useDailyQuiz";
import DailyQuizGame   from "../components/DailyQuizGame";
import { useLang } from "@/lib/LanguageContext";
import { getDifficultyLevel, getWeekPack } from "../quizData";

const PAGE_LABELS = {
  he: { title: "משחק יומי", subtitle: "שלושה אתגרים קצרים לחיזוק הזיכרון", alreadyDone: "כבר שיחקתם היום — חזרו מחר! 🌟", doneTitle: "כל הכבוד! סיימתם את המשחק היומי 🎉", doneSubtitle: "נתראה מחר עם אתגרים חדשים", totalScore: "ניקוד כולל", accuracy: "דיוק", backHome: "חזרה לדף הבית", levelLabel: "רמת קושי", levels: ["","קל 🟢","קל-בינוני 🟡","בינוני 🟠","קשה 🔴","מאתגר מאוד 🔥"] },
  ar: { title: "لعبة اليوم", subtitle: "ثلاثة تحديات قصيرة لتقوية الذاكرة", alreadyDone: "لقد لعبت اليوم — عد غداً! 🌟", doneTitle: "أحسنت! أتممت لعبة اليوم 🎉", doneSubtitle: "إلى اللقاء غداً مع تحديات جديدة", totalScore: "النتيجة الإجمالية", accuracy: "الدقة", backHome: "العودة للرئيسية", levelLabel: "مستوى الصعوبة", levels: ["","سهل 🟢","متوسط-سهل 🟡","متوسط 🟠","صعب 🔴","صعب جداً 🔥"] },
};
const GAME_ICONS = { word_recall: "🧠", trivia: "💡", pattern: "🔢", rapid_recall: "⚡", logic_odd_one_out: "🧩", spot_difference: "🔍", pattern_advanced: "🔢" };

function ProgressDots({ total, current }) {
  return (
    <div className="flex justify-center gap-3 mb-6">
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} className={`w-4 h-4 rounded-full transition-all duration-300 ${i < current ? "bg-emerald-500 scale-110" : i === current ? "bg-primary scale-125 ring-2 ring-primary/40" : "bg-muted"}`} />
      ))}
    </div>
  );
}

function DoneScreen({ results, lang, onBack }) {
  const L = PAGE_LABELS[lang] || PAGE_LABELS["he"];
  const tc = results.reduce((s,r)=>s+r.score,0), ta = results.reduce((s,r)=>s+r.attempts,0);
  const acc = ta > 0 ? Math.round((tc/ta)*100) : 0;
  return (
    <div dir="rtl" className="flex flex-col items-center gap-6 py-6">
      <div className="text-7xl">🎉</div>
      <h2 className="text-3xl font-bold text-center">{L.doneTitle}</h2>
      <p className="text-muted-foreground text-center">{L.doneSubtitle}</p>
      <div className="w-full grid grid-cols-2 gap-4 mt-2">
        <div className="rounded-2xl border bg-card text-card-foreground p-5 text-center shadow-sm"><p className="text-sm text-muted-foreground mb-1">{L.totalScore}</p><p className="text-4xl font-bold">{tc}<span className="text-xl text-muted-foreground"> / {ta}</span></p></div>
        <div className="rounded-2xl border bg-card text-card-foreground p-5 text-center shadow-sm"><p className="text-sm text-muted-foreground mb-1">{L.accuracy}</p><p className="text-4xl font-bold">{acc}<span className="text-xl text-muted-foreground">%</span></p></div>
      </div>
      <div className="w-full flex flex-col gap-3">
        {results.map((r,i) => (
          <div key={i} className="flex items-center gap-3 rounded-2xl border bg-card p-4">
            <span className="text-3xl">{GAME_ICONS[r.type]}</span>
            <div className="flex-1"><div className="h-3 rounded-full bg-muted overflow-hidden"><div className="h-3 rounded-full bg-primary transition-all duration-700" style={{ width: `${r.attempts > 0 ? (r.score/r.attempts)*100 : 0}%` }} /></div></div>
            <span className="text-lg font-bold text-muted-foreground">{r.score}/{r.attempts}</span>
          </div>
        ))}
      </div>
      {onBack && <button onClick={onBack} className="w-full py-4 px-6 rounded-2xl text-xl font-bold bg-secondary text-secondary-foreground mt-2">{L.backHome}</button>}
    </div>
  );
}

export default function DailyQuizPage() {
  const { lang } = useLang();
  const navigate = useNavigate();
  const L    = PAGE_LABELS[lang] || PAGE_LABELS["he"];
  const quiz = useDailyQuiz({ lang });
  const onBack = () => navigate("/");

  if (quiz.alreadyDone && quiz.phase !== "done") return (
    <div dir="rtl" className="flex flex-col items-center justify-center min-h-64 gap-6 py-8 px-4">
      <div className="text-6xl">🌟</div>
      <p className="text-2xl font-bold text-center">{L.alreadyDone}</p>
      <button onClick={onBack} className="w-full max-w-sm py-4 rounded-2xl bg-secondary text-secondary-foreground text-xl font-bold">{L.backHome}</button>
    </div>
  );

  if (quiz.phase === "done") return <div className="max-w-md mx-auto px-4 py-6"><DoneScreen results={quiz.results} lang={lang} onBack={onBack} /></div>;

  return (
    <div dir="rtl" className="max-w-md mx-auto px-4 py-6">
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold">{L.title}</h1>
        <p className="text-muted-foreground mt-1">{L.subtitle}</p>
        <p className="text-sm font-medium text-muted-foreground mt-0 mb-1">{quiz.games?.[0]?.packName?.[lang] || quiz.games?.[0]?.packName?.he}</p>
        {(() => { const level = getDifficultyLevel(quiz.today); const levelNames = { he: ["","קל 🟢","קל-בינוני 🟡","בינוני 🟠","קשה 🔴","מאתגר מאוד 🔥"], ar: ["","سهل 🟢","متوسط-سهل 🟡","متوسط 🟠","صعب 🔴","صعب جداً 🔥"] }; return <p className="text-sm font-semibold mb-2">{lang === "ar" ? "مستوى الصعوبة" : "רמת קושי"}: {(levelNames[lang] || levelNames.he)[level]}</p>; })()}
      </div>
      <ProgressDots total={quiz.totalGames} current={quiz.gameIndex} />
      <DailyQuizGame game={quiz.currentGame} lang={lang} t={quiz.t} phase={quiz.phase} onStart={quiz.startCurrentGame} onFinish={quiz.finishGame} selectedIdx={quiz.selectedIdx} feedback={quiz.feedback} onAnswerSelect={quiz.submitAnswer} recallPhase={quiz.recallPhase} recallAnswers={quiz.recallAnswers} selectedWords={quiz.selectedWords} onToggleWord={quiz.toggleWord} onSubmitRecall={quiz.submitWordRecall} score={quiz.score} attempts={quiz.attempts} gameIndex={quiz.gameIndex} totalGames={quiz.totalGames} onNewGameComplete={quiz.handleNewGameComplete} />
    </div>
  );
}