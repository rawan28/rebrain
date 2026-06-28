import React from "react";
import { GAME_TYPES } from "../quizData";
import { NEW_GAME_TYPES } from "../newQuizData";
import { AGENT_GAME_TYPES } from "../agentQuizData";
import RapidRecallGame from "./games/RapidRecallGame";
import LogicOddOneOutGame from "./games/LogicOddOneOutGame";
import SpotDiffGame from "./games/SpotDiffGame";
import PatternAdvGame from "./games/PatternAdvGame";
import ZipZapGame from "./games/ZipZapGame";
import SpeedMatchGame from "./games/SpeedMatchGame";
import VisualMemoryGame from "./games/VisualMemoryGame";
import AttentionScanGame from "./games/AttentionScanGame";

const BTN  = "w-full py-4 px-6 rounded-2xl text-xl font-bold cursor-pointer transition-all duration-150 active:scale-95";
const BASE = "w-full rounded-2xl p-6 text-center transition-all duration-200";

const LABELS = {
  he: { start: "בואו נתחיל!", memorize: "זכרו את המילים...", memorizeTimer: "המילים נעלמות עוד רגע...", pickWords: "סמנו את המילים שראיתם", submit: "שלחו תשובה", next: "הבא", correct: "כל הכבוד! ✓", wrong: "לא מדויק — נסו שוב מחר", missing: "המספר החסר:", game: "משחק", of: "מתוך", score: "ניקוד", outOf: "מתוך",
    gameNames: { word_recall: "זיכרון מילים", trivia: "שאלות ידע", pattern: "המשך הסדרה", rapid_recall: "זיכרון מהיר", logic_odd_one_out: "חשיבה לוגית", spot_difference: "קשב לפרטים", pattern_advanced: "זיהוי דפוסים", zipzap: "זיפ-זאפ", speedMatch: "מהירות התאמה", visualMemory: "זיכרון חזותי", attentionScan: "סריקת קשב" },
    gameDesc:  { word_recall: "זכרו את המילים — ואחר כך בחרו אותן", trivia: "בחרו את התשובה הנכונה", pattern: "מצאו את המספר החסר", rapid_recall: "זכרו את הפריטים — ובחרו אותם", logic_odd_one_out: "מצאו את השונה מהקבוצה", spot_difference: "מצאו את ההבדל בין שני המשפטים", pattern_advanced: "השלימו את הרצף", zipzap: "זכרו את הסדר והקישו אותו", speedMatch: "מצאו את כל הצורות התואמות", visualMemory: "זכרו פריטים ובחרו אותם מהזיכרון", attentionScan: "מצאו את האות הנכונה בשניות" } },
  ar: { start: "لنبدأ!", memorize: "احفظ الكلمات...", memorizeTimer: "ستختفي الكلمات بعد لحظة...", pickWords: "اختر الكلمات التي رأيتها", submit: "إرسال الإجابة", next: "التالي", correct: "أحسنت! ✓", wrong: "غير صحيح — حاول غداً", missing: "الرقم الناقص:", game: "لعبة", of: "من", score: "النتيجة", outOf: "من",
    gameNames: { word_recall: "تذكّر الكلمات", trivia: "أسئلة المعرفة", pattern: "أكمل المتسلسلة", rapid_recall: "الذاكرة السريعة", logic_odd_one_out: "التفكير المنطقي", spot_difference: "الانتباه للتفاصيل", pattern_advanced: "التعرف على الأنماط", zipzap: "زيب-زاب", speedMatch: "سرعة التطابق", visualMemory: "الذاكرة البصرية", attentionScan: "مسح الانتباه" },
    gameDesc:  { word_recall: "احفظ الكلمات — ثم اختَرها", trivia: "اختر الإجابة الصحيحة", pattern: "اعثر على الرقم الناقص", rapid_recall: "احفظ العناصر — ثم اختَرها", logic_odd_one_out: "جد العنصر المختلف", spot_difference: "جد الفرق بين الجملتين", pattern_advanced: "أكمل التسلسل", zipzap: "تذكّر الترتيب وانقره", speedMatch: "جد جميع الأشكال المتطابقة", visualMemory: "تذكّر العناصر واختَرها", attentionScan: "جد الحرف الصحيح بسرعة" } },
};
const ICONS = { word_recall: "🧠", trivia: "💡", pattern: "🔢", rapid_recall: "⚡", logic_odd_one_out: "🧩", spot_difference: "🔍", pattern_advanced: "🔢", zipzap: "⚡", speedMatch: "🎯", visualMemory: "🧠", attentionScan: "🔍" };

const SKILL_LABELS = {
  he: { rapid_recall: "⚡ זיכרון מהיר", logic_odd_one_out: "🧩 חשיבה לוגית", spot_difference: "🔍 קשב לפרטים", pattern_advanced: "🔢 זיהוי דפוסים", zipzap: "⚡ עיבוד מהיר", speedMatch: "🎯 מהירות ודיוק", visualMemory: "🧠 זיכרון חזותי", attentionScan: "🔍 קשב וריכוז" },
  ar: { rapid_recall: "⚡ الذاكرة السريعة", logic_odd_one_out: "🧩 التفكير المنطقي", spot_difference: "🔍 الانتباه للتفاصيل", pattern_advanced: "🔢 التعرف على الأنماط", zipzap: "⚡ المعالجة السريعة", speedMatch: "🎯 السرعة والدقة", visualMemory: "🧠 الذاكرة البصرية", attentionScan: "🔍 الانتباه والتركيز" },
};

export default function DailyQuizGame({ game, lang, t, phase, onStart, onFinish, selectedIdx, feedback, onAnswerSelect, recallPhase, recallAnswers, selectedWords, onToggleWord, onSubmitRecall, score, attempts, gameIndex, totalGames, onNewGameComplete }) {
  const dir = "rtl";
  const L   = LABELS[lang] || LABELS["he"];

  const skillLabel = (SKILL_LABELS[lang] || SKILL_LABELS.he)[game.type];

  if (phase === "intro") return (
    <div dir={dir} className={`${BASE} bg-card text-card-foreground`}>
      <div className="text-6xl mb-4">{ICONS[game.type]}</div>
      <p className="text-sm font-medium text-muted-foreground mb-1">{L.game} {gameIndex + 1} {L.of} {totalGames}</p>
      <h2 className="text-3xl font-bold mb-3">{L.gameNames[game.type]}</h2>
      {skillLabel && <p className="text-base font-semibold text-primary mb-2">{skillLabel}</p>}
      <p className="text-lg text-muted-foreground mb-8">{L.gameDesc[game.type]}</p>
      <button onClick={onStart} className={`${BTN} bg-primary text-primary-foreground text-2xl py-5`}>{L.start}</button>
    </div>
  );

  if (game.type === GAME_TYPES.WORD_RECALL) {
    if (recallPhase === "memorize") return (
      <div dir={dir} className={`${BASE} bg-card text-card-foreground`}>
        <p className="text-muted-foreground text-base mb-2">{L.memorizeTimer}</p>
        <h3 className="text-xl font-semibold mb-6">{L.memorize}</h3>
        <div className="flex flex-wrap justify-center gap-4 mb-6">
          {game.data.words.map((w, i) => <span key={i} className="bg-primary text-primary-foreground text-2xl font-bold px-6 py-4 rounded-2xl shadow">{t(w)}</span>)}
        </div>
      </div>
    );
    return (
      <div dir={dir} className={`${BASE} bg-card text-card-foreground`}>
        <h3 className="text-xl font-semibold mb-6">{L.pickWords}</h3>
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {recallAnswers.map((item, i) => {
            const picked = selectedWords.includes(item.text);
            const showResult = feedback !== null;
            let s = "border-2 border-input bg-muted text-foreground";
            if (picked && !showResult) s = "border-2 border-primary bg-primary text-primary-foreground";
            if (showResult && picked && item.isTarget)  s = "border-2 bg-emerald-600 text-white";
            if (showResult && picked && !item.isTarget) s = "border-2 bg-destructive text-destructive-foreground";
            if (showResult && !picked && item.isTarget) s = "border-2 border-dashed border-emerald-600 text-foreground opacity-70";
            return <button key={i} disabled={feedback !== null} onClick={() => onToggleWord(item.text)} className={`${s} text-xl font-bold px-5 py-3 rounded-2xl transition-all cursor-pointer active:scale-95`}>{item.text}</button>;
          })}
        </div>
        {feedback === null
          ? <button onClick={onSubmitRecall} disabled={selectedWords.length === 0} className={`${BTN} bg-primary text-primary-foreground disabled:opacity-40`}>{L.submit}</button>
          : <button onClick={onFinish} className={`${BTN} bg-primary text-primary-foreground`}>{L.next}</button>}
        {feedback !== null && <p className={`mt-4 text-xl font-bold ${feedback === "correct" ? "text-emerald-600" : "text-destructive"}`}>{feedback === "correct" ? L.correct : L.wrong}</p>}
      </div>
    );
  }

  if (game.type === GAME_TYPES.TRIVIA) return (
    <div dir={dir} className={`${BASE} bg-card text-card-foreground`}>
      <p className="text-muted-foreground text-sm mb-4">{L.game} {gameIndex + 1} {L.of} {totalGames}</p>
      <h3 className="text-2xl font-bold mb-8 leading-snug">{t(game.data.question)}</h3>
      <div className="flex flex-col gap-4">
        {game.data.options.map((opt, idx) => {
          let s = "bg-secondary text-secondary-foreground hover:bg-accent";
          if (feedback !== null) {
            if (idx === game.data.correctIndex) s = "bg-emerald-600 text-white";
            else if (idx === selectedIdx) s = "bg-destructive text-destructive-foreground";
            else s = "bg-muted text-muted-foreground opacity-60";
          }
          return <button key={idx} onClick={() => onAnswerSelect(idx)} disabled={feedback !== null} className={`${BTN} ${s} text-xl`}>{t(opt)}</button>;
        })}
      </div>
      {feedback !== null && <div className="mt-6"><p className={`text-xl font-bold mb-4 ${feedback === "correct" ? "text-emerald-600" : "text-destructive"}`}>{feedback === "correct" ? L.correct : L.wrong}</p><button onClick={onFinish} className={`${BTN} bg-primary text-primary-foreground`}>{L.next}</button></div>}
    </div>
  );

  if (game.type === GAME_TYPES.PATTERN) return (
    <div dir={dir} className={`${BASE} bg-card text-card-foreground`}>
      <p className="text-muted-foreground text-sm mb-4">{L.game} {gameIndex + 1} {L.of} {totalGames}</p>
      <div className="flex justify-center items-center gap-3 flex-wrap mb-8">
        {game.data.sequence.map((item, i) => <div key={i} className={`w-16 h-16 flex items-center justify-center rounded-xl text-2xl font-bold shadow ${item === "?" ? "bg-primary text-primary-foreground ring-4 ring-primary/40" : "bg-muted text-foreground"}`}>{item}</div>)}
      </div>
      <p className="text-lg text-muted-foreground mb-6">{L.missing}</p>
      <div className="grid grid-cols-2 gap-4 mb-2">
        {game.data.options.map((opt, idx) => {
          let s = "bg-secondary text-secondary-foreground hover:bg-accent";
          if (feedback !== null) {
            if (opt === game.data.answer) s = "bg-emerald-600 text-white";
            else if (idx === selectedIdx) s = "bg-destructive text-destructive-foreground";
            else s = "bg-muted text-muted-foreground opacity-60";
          }
          return <button key={idx} onClick={() => onAnswerSelect(idx)} disabled={feedback !== null} className={`${BTN} ${s} text-2xl`}>{opt}</button>;
        })}
      </div>
      {feedback !== null && <div className="mt-6"><p className={`text-xl font-bold mb-4 ${feedback === "correct" ? "text-emerald-600" : "text-destructive"}`}>{feedback === "correct" ? L.correct : L.wrong}</p><button onClick={onFinish} className={`${BTN} bg-primary text-primary-foreground`}>{L.next}</button></div>}
    </div>
  );

  // New game types — they manage their own internal state (feedback, answers)
  // and call onComplete(score, maxScore) when done. We set score/attempts then immediately finish.
  const handleNewComplete = (s, m) => {
    onNewGameComplete(s, m);
  };

  const AGENT_TYPE_VALUES = Object.values(AGENT_GAME_TYPES);
  const isNewType = [NEW_GAME_TYPES.RAPID_RECALL, NEW_GAME_TYPES.LOGIC, NEW_GAME_TYPES.SPOT_DIFF, NEW_GAME_TYPES.PATTERN_ADV, ...AGENT_TYPE_VALUES].includes(game.type);

  if (isNewType && feedback !== null) {
    return (
      <div dir={dir} className={`${BASE} bg-card text-card-foreground text-center`}>
        <p className={`text-xl font-bold mb-4 ${feedback === "correct" ? "text-emerald-600" : "text-destructive"}`}>
          {feedback === "correct" ? L.correct : L.wrong} {attempts > 1 ? `(${score}/${attempts})` : ""}
        </p>
        <button onClick={onFinish} className={`${BTN} bg-primary text-primary-foreground`}>{L.next}</button>
      </div>
    );
  }

  if (game.type === NEW_GAME_TYPES.RAPID_RECALL)
    return <RapidRecallGame data={game.data} lang={lang} onComplete={handleNewComplete} />;
  if (game.type === NEW_GAME_TYPES.LOGIC)
    return <LogicOddOneOutGame data={game.data} lang={lang} onComplete={handleNewComplete} />;
  if (game.type === NEW_GAME_TYPES.SPOT_DIFF)
    return <SpotDiffGame data={game.data} lang={lang} onComplete={handleNewComplete} />;
  if (game.type === NEW_GAME_TYPES.PATTERN_ADV)
    return <PatternAdvGame data={game.data} lang={lang} onComplete={handleNewComplete} />;
  if (game.type === AGENT_GAME_TYPES.ZIPZAP)
    return <ZipZapGame data={game.data} lang={lang} onComplete={handleNewComplete} />;
  if (game.type === AGENT_GAME_TYPES.SPEED_MATCH)
    return <SpeedMatchGame data={game.data} lang={lang} onComplete={handleNewComplete} />;
  if (game.type === AGENT_GAME_TYPES.VISUAL_MEMORY)
    return <VisualMemoryGame data={game.data} lang={lang} onComplete={handleNewComplete} />;
  if (game.type === AGENT_GAME_TYPES.ATTENTION_SCAN)
    return <AttentionScanGame data={game.data} lang={lang} onComplete={handleNewComplete} />;

  return null;
}