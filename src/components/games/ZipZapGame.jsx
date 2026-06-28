import React, { useState, useEffect, useRef } from "react";

const LABELS = {
  he: { title: "⚡ זיפ-זאפ", sub: "זכור את הסדר!", hint: "הקש על המספרים בסדר שהופיעו", correct: "מעולה! ✅", wrong: "לא מדויק ❌" },
  ar: { title: "⚡ زيب-زاب", sub: "تذكّر الترتيب!", hint: "انقر على الأرقام بالترتيب الذي ظهرت", correct: "ممتاز! ✅", wrong: "غير دقيق ❌" },
};

export default function ZipZapGame({ data, lang, onComplete }) {
  const [phase, setPhase] = useState("show");
  const [userSeq, setUserSeq] = useState([]);
  const [timeLeft, setTimeLeft] = useState(data.showMs / 1000);
  const startTime = useRef(Date.now());
  const t = LABELS[lang] || LABELS.he;

  useEffect(() => {
    if (phase !== "show") return;
    if (timeLeft <= 0) { setPhase("input"); return; }
    const id = setTimeout(() => setTimeLeft(s => s - 1), 1000);
    return () => clearTimeout(id);
  }, [phase, timeLeft]);

  const shuffled = React.useMemo(() => {
    if (phase !== "input") return [];
    return [...new Set(data.sequence.map(String))].sort(() => Math.random() - 0.5);
  }, [phase, data.sequence]);

  const handleTap = (item) => {
    if (phase !== "input") return;
    const next = [...userSeq, item];
    setUserSeq(next);
    if (next.length === data.sequence.length) {
      const correct = next.every((v, i) => String(v) === String(data.sequence[i]));
      const score = correct ? data.sequence.length : next.filter((v, i) => String(v) === String(data.sequence[i])).length;
      setPhase(correct ? "correct" : "wrong");
      setTimeout(() => onComplete(Math.max(0, score), data.sequence.length), 600);
    }
  };

  return (
    <div dir={lang === "ar" ? "rtl" : "ltr"} className="flex flex-col items-center gap-6 p-4 w-full">
      <h2 className="text-2xl font-bold text-foreground">{t.title}</h2>
      {data.instructions && (
        <p className="text-base text-muted-foreground text-center">{data.instructions[lang] || data.instructions.he}</p>
      )}

      {phase === "show" && (
        <>
          <p className="text-lg text-muted-foreground">{t.sub}</p>
          <div className="w-full bg-muted rounded-full h-3 mb-2">
            <div className="bg-primary h-3 rounded-full transition-all duration-1000"
              style={{ width: `${(timeLeft / (data.showMs / 1000)) * 100}%` }} />
          </div>
          <div className="flex flex-wrap gap-4 justify-center mt-2">
            {data.sequence.map((item, i) => (
              <div key={i} className="w-16 h-16 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center text-3xl font-bold shadow-lg">
                {item}
              </div>
            ))}
          </div>
        </>
      )}

      {phase === "input" && (
        <>
          <p className="text-base text-muted-foreground text-center">{t.hint}</p>
          <div className="flex gap-2 flex-wrap justify-center min-h-[60px]">
            {userSeq.map((v, i) => (
              <div key={i} className="w-12 h-12 rounded-xl bg-secondary text-secondary-foreground flex items-center justify-center text-xl font-bold">{v}</div>
            ))}
            {Array.from({ length: data.sequence.length - userSeq.length }).map((_, i) => (
              <div key={`e${i}`} className="w-12 h-12 rounded-xl border-2 border-dashed border-muted-foreground/30" />
            ))}
          </div>
          <div className="grid grid-cols-4 gap-3 w-full max-w-xs">
            {shuffled.map((item, i) => (
              <button key={i} onClick={() => handleTap(item)}
                className="h-14 rounded-2xl bg-card border-2 border-primary text-foreground text-2xl font-bold active:scale-95 transition-transform shadow">
                {item}
              </button>
            ))}
          </div>
        </>
      )}

      {(phase === "correct" || phase === "wrong") && (
        <div className={`text-2xl font-bold ${phase === "correct" ? "text-emerald-500" : "text-destructive"}`}>
          {phase === "correct" ? t.correct : t.wrong}
        </div>
      )}
    </div>
  );
}