import React, { useState } from "react";

export default function WordAssociationGame({ data, lang, onComplete }) {
  const [selected, setSelected] = useState(null);
  const isRTL = lang === "ar";
  const labels = {
    he: { title: "🔗 אסוציאציה", instruction: "בחר את המילה הכי קשורה:", correct: "נכון! ✅", wrong: "לא מדויק ❌" },
    ar: { title: "🔗 الترابط", instruction: "اختر الكلمة الأكثر ارتباطاً:", correct: "صحيح! ✅", wrong: "غير دقيق ❌" },
  };
  const t = labels[lang] || labels.he;

  const handleSelect = (i) => {
    if (selected !== null) return;
    setSelected(i);
    setTimeout(() => onComplete(i === data.correctIndex ? 1 : 0, 1), 900);
  };

  return (
    <div dir={isRTL ? "rtl" : "ltr"} className="flex flex-col items-center gap-6 p-4 w-full">
      <h2 className="text-2xl font-bold text-foreground">{t.title}</h2>
      <p className="text-base text-muted-foreground">{t.instruction}</p>
      <div className="rounded-2xl bg-primary text-primary-foreground px-10 py-5 text-4xl font-bold shadow-lg">
        {data.anchor[lang]}
      </div>
      <div className="grid grid-cols-2 gap-3 w-full max-w-xs">
        {data.options.map((opt, i) => {
          let style = "bg-card border-2 border-border text-foreground";
          if (selected !== null) {
            if (i === data.correctIndex) style = "bg-emerald-500 text-white border-emerald-500";
            else if (i === selected) style = "bg-destructive text-destructive-foreground border-destructive";
            else style = "bg-card border-border text-muted-foreground opacity-50";
          }
          return (
            <button key={i} onClick={() => handleSelect(i)}
              className={`h-14 rounded-2xl text-lg font-semibold transition-all duration-200 ${style}`}>
              {opt[lang]}
            </button>
          );
        })}
      </div>
      {selected !== null && (
        <p className="text-base text-muted-foreground text-center mt-1 italic">{data.explanation[lang]}</p>
      )}
    </div>
  );
}