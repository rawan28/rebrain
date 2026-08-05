export const ATTENTION_ARENA = "attention_arena";

export const STROOP_COLORS = [
  { key: "red",    he: "אדום",  ar: "أحمر",    css: "#dc2626" },
  { key: "blue",   he: "כחול",  ar: "أزرق",    css: "#2563eb" },
  { key: "green",  he: "ירוק",  ar: "أخضر",    css: "#16a34a" },
  { key: "yellow", he: "צהוב",  ar: "أصفر",    css: "#ca8a04" },
  { key: "purple", he: "סגול",  ar: "بنفسجي",  css: "#9333ea" },
  { key: "orange", he: "כתום",  ar: "برتقالي", css: "#ea580c" },
];

export const stroopBank = {
  1: [
    { wordKey:"red",   inkKey:"blue",   options:["blue","red","green","yellow"] },
    { wordKey:"green", inkKey:"red",    options:["red","green","blue","yellow"] },
    { wordKey:"blue",  inkKey:"yellow", options:["yellow","blue","red","green"] },
    { wordKey:"yellow",inkKey:"green",  options:["green","yellow","blue","red"] },
  ],
  2: [
    { wordKey:"red",    inkKey:"green",  options:["green","red","blue","purple"] },
    { wordKey:"blue",   inkKey:"purple", options:["purple","blue","red","green"] },
    { wordKey:"yellow", inkKey:"red",    options:["red","yellow","blue","green"] },
    { wordKey:"green",  inkKey:"purple", options:["purple","green","yellow","red"] },
    { wordKey:"purple", inkKey:"blue",   options:["blue","purple","green","red"] },
  ],
  3: [
    { wordKey:"red",    inkKey:"orange",  options:["orange","red","blue","green"] },
    { wordKey:"blue",   inkKey:"purple",  options:["purple","blue","red","yellow"] },
    { wordKey:"green",  inkKey:"red",     options:["red","green","blue","orange"] },
    { wordKey:"yellow", inkKey:"blue",    options:["blue","yellow","green","purple"] },
    { wordKey:"purple", inkKey:"green",   options:["green","purple","red","orange"] },
    { wordKey:"orange", inkKey:"yellow",  options:["yellow","orange","blue","red"] },
  ],
  4: [
    { wordKey:"red",    inkKey:"green",   options:["green","red","blue","purple"] },
    { wordKey:"blue",   inkKey:"orange",  options:["orange","blue","red","green"] },
    { wordKey:"green",  inkKey:"purple",  options:["purple","green","yellow","red"] },
    { wordKey:"yellow", inkKey:"red",     options:["red","yellow","green","blue"] },
    { wordKey:"purple", inkKey:"orange",  options:["orange","purple","blue","green"] },
    { wordKey:"orange", inkKey:"blue",    options:["blue","orange","red","purple"] },
    { wordKey:"red",    inkKey:"yellow",  options:["yellow","red","green","blue"] },
    { wordKey:"blue",   inkKey:"purple",  options:["purple","blue","orange","red"] },
  ],
  5: [
    { wordKey:"red",    inkKey:"purple",  options:["purple","red","blue","green"] },
    { wordKey:"blue",   inkKey:"green",   options:["green","blue","red","orange"] },
    { wordKey:"green",  inkKey:"orange",  options:["orange","green","purple","blue"] },
    { wordKey:"yellow", inkKey:"purple",  options:["purple","yellow","red","blue"] },
    { wordKey:"purple", inkKey:"red",     options:["red","purple","green","yellow"] },
    { wordKey:"orange", inkKey:"green",   options:["green","orange","blue","purple"] },
    { wordKey:"red",    inkKey:"blue",    options:["blue","red","orange","green"] },
    { wordKey:"blue",   inkKey:"yellow",  options:["yellow","blue","purple","red"] },
    { wordKey:"green",  inkKey:"red",     options:["red","green","orange","blue"] },
    { wordKey:"purple", inkKey:"orange",  options:["orange","purple","red","green"] },
  ],
};

export const countTargetsConfig = {
  1: { sequenceLen: 8,  flashMs: 1800, target:"🍎", distractors:["🔑","🐟"] },
  2: { sequenceLen: 10, flashMs: 1500, target:"🔑", distractors:["🍎","🐟","🌙"] },
  3: { sequenceLen: 14, flashMs: 1200, target:"🌙", distractors:["🍎","🔑","🐟","⭐"] },
  4: { sequenceLen: 18, flashMs: 1000, target:"⭐", distractors:["🍎","🔑","🐟","🌙","🧩"] },
  5: { sequenceLen: 22, flashMs: 800,  target:"🧩", distractors:["🍎","🔑","🐟","🌙","⭐","🎵"] },
};

export const goNoGoConfig = {
  1: { totalItems: 10, goRatio: 0.5,  flashMs: 2000, goStimulus:"🟢", noGoStimuli:["🔴"] },
  2: { totalItems: 12, goRatio: 0.45, flashMs: 1700, goStimulus:"🟢", noGoStimuli:["🔴","🟡"] },
  3: { totalItems: 15, goRatio: 0.4,  flashMs: 1400, goStimulus:"🟢", noGoStimuli:["🔴","🟡","🔵"] },
  4: { totalItems: 18, goRatio: 0.35, flashMs: 1100, goStimulus:"⭐", noGoStimuli:["🔴","🟡","🔵","🟠"] },
  5: { totalItems: 22, goRatio: 0.3,  flashMs: 900,  goStimulus:"✅", noGoStimuli:["🔴","🟡","🔵","🟠","🟣"] },
};

function dateSeed(dateStr) {
  return dateStr.replace(/-/g,"").split("").reduce((a,c,i)=>a+c.charCodeAt(0)*(i+7),0);
}
function seededRand(seed) {
  let s = Math.abs(seed)||1;
  return ()=>{ s=(s*1664525+1013904223)&0xffffffff; return (s>>>0)/0xffffffff; };
}

const clamp = (level) => Math.min(5, Math.max(1, level || 1));

export function getDailyStroop(dateStr, level) {
  return stroopBank[clamp(level)];
}

export function getDailyCountTargets(dateStr, level) {
  const cfg = countTargetsConfig[clamp(level)];
  const rand = seededRand(dateSeed(dateStr) + 1);
  const sequence = [];
  let targetCount = 0;
  const minTargets = Math.floor(cfg.sequenceLen * 0.3);
  const maxTargets = Math.floor(cfg.sequenceLen * 0.5);
  for (let i = 0; i < cfg.sequenceLen; i++) {
    const remaining = cfg.sequenceLen - i;
    const needMore = targetCount < minTargets && remaining <= minTargets - targetCount;
    if (needMore || (rand() < 0.4 && targetCount < maxTargets)) {
      sequence.push(cfg.target);
      targetCount++;
    } else {
      sequence.push(cfg.distractors[Math.floor(rand() * cfg.distractors.length)]);
    }
  }
  return { ...cfg, sequence, correctCount: targetCount };
}

export function getDailyGoNoGo(dateStr, level) {
  const cfg = goNoGoConfig[clamp(level)];
  const rand = seededRand(dateSeed(dateStr) + 2);
  const sequence = [];
  let goCount = 0;
  const targetGoCount = Math.floor(cfg.totalItems * cfg.goRatio);
  for (let i = 0; i < cfg.totalItems; i++) {
    const remaining = cfg.totalItems - i;
    const needMore = goCount < targetGoCount && remaining <= targetGoCount - goCount;
    if (needMore || (rand() < cfg.goRatio && goCount < targetGoCount)) {
      sequence.push(cfg.goStimulus);
      goCount++;
    } else {
      sequence.push(cfg.noGoStimuli[Math.floor(rand() * cfg.noGoStimuli.length)]);
    }
  }
  return { ...cfg, sequence, goCount };
}

export function getAttentionArenaDaily(dateStr, level) {
  return {
    stroop: getDailyStroop(dateStr, level),
    countTargets: getDailyCountTargets(dateStr, level),
    goNoGo: getDailyGoNoGo(dateStr, level),
  };
}

export const ATTENTION_LABELS = {
  he: {
    title: "🏟️ זירת קשב",
    subtitle: "שלושה אתגרי ריכוז במשחק אחד",
    start: "התחילו",
    round1: "סבב 1: סטרופ",
    round1Desc: "בחרו את צבע הדיו — לא את המילה!",
    round2: "סבב 2: ספרו מטרות",
    round2Desc: "ספרו כמה פעמים מופיע הפריט",
    round3: "סבב 3: הקישו / אל תקישו",
    round3Desc: "הקישו רק על המטרה — התעלמו מכל השאר",
    inkColor: "מהו צבע הדיו?",
    countPrompt: "ספרו כמה פעמים מופיע:",
    countAnswer: "כמה פעמים ראיתם אותו?",
    goPrompt: "הקישו רק על:",
    doNotTap: "אל תקישו על:",
    tapNow: "👆 הקישו!",
    correct: "נכון! ✅",
    wrong: "לא מדויק ❌",
    roundComplete: "סבב הושלם!",
    yourAnswer: "התשובה שלכם",
    correctAnswer: "התשובה הנכונה",
  },
  ar: {
    title: "🏟️ ساحة الانتباه",
    subtitle: "ثلاثة تحديات للتركيز في لعبة واحدة",
    start: "ابدأ",
    round1: "الجولة 1: ستروب",
    round1Desc: "اختر لون الحبر — وليس الكلمة!",
    round2: "الجولة 2: عد الأهداف",
    round2Desc: "احسب كم مرة ظهر العنصر",
    round3: "الجولة 3: اضغط / لا تضغط",
    round3Desc: "انقر فقط على الهدف — تجاهل الباقي",
    inkColor: "ما لون الحبر؟",
    countPrompt: "احسب كم مرة يظهر:",
    countAnswer: "كم مرة رأيته؟",
    goPrompt: "انقر فقط على:",
    doNotTap: "لا تنقر على:",
    tapNow: "👆 اضغط!",
    correct: "صحيح! ✅",
    wrong: "غير دقيق ❌",
    roundComplete: "اكتملت الجولة!",
    yourAnswer: "إجابتك",
    correctAnswer: "الإجابة الصحيحة",
  },
};