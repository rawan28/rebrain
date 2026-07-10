import React, { useState } from "react";

export default function MentalMathGame({ data, lang, onComplete }) {
  const [selected, setSelected] = useState(null);
  const isRTL = lang === "ar";
  const labels = {
    he: { title: "🔢 חשבון מנטלי", instruction: "מה התשובה?", correct: "מצוין! ✅", wrong: "לא מדויק ❌" },
    ar: { title: "🔢 الحساب الذهني", instruction: "ما هي الإجابة؟", correct: "ممتاز! ✅", wrong: "غير دقيق ❌" },
  };
  const t = labels[lang] || labels.he;

  const handleSelect = (opt) => {
    if (selected !== null) return;
    setSelected(opt);
    setTimeout(() => onComplete(opt === data.answer ? 1 : 0, 1), 900);
  };

  return (
    <div dir={isRTL ? "rtl" : "ltr"} className="flex flex-col items-center gap-6 p-4 w-full">
      <h2 className="text-2xl font-bold text-foreground">{t.title}</h2>
      <p className="text-base text-muted-foreground">{t.instruction}</p>
      <div className="rounded-2xl bg-muted px-10 py-6 text-5xl font-bold text-foreground shadow-inner tracking-wide">
        {data.expression} = ?
      </div>
      <div className="grid grid-cols-2 gap-3 w-full max-w-xs">
        {data.options.map((opt, i) => {
          let style = "bg-card border-2 border-border text-foreground";
          if (selected !== null) {
            if (opt === data.answer) style = "bg-emerald-500 text-white border-emerald-500";
            else if (opt === selected) style = "bg-destructive text-destructive-foreground border-destructive";
            else style = "bg-card border-border text-muted-foreground opacity-50";
          }
          return (
            <button key={i} onClick={() => handleSelect(opt)}
              className={`h-16 rounded-2xl text-2xl font-bold transition-all duration-200 ${style}`}>
              {opt}
            </button>
          );
        })}
      </div>
      {selected !== null && (
        <p className="text-base text-muted-foreground italic">{data.explanation[lang]}</p>
      )}
    </div>
  );
}