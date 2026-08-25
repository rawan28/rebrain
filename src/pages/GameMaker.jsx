import { Sparkles } from 'lucide-react';
import AgentChat from '@/components/companion/AgentChat';
import { useLang } from '@/lib/LanguageContext';

const GREETING = {
  he: 'שלום! 👋 רוצה לשחק משחק חדש שאני אכין במיוחד בשבילך? ספר לי איזה נושא אתה אוהב.',
  ar: 'مرحباً! 👋 هل تريد لعبة جديدة أعدّها خصيصاً لك؟ أخبرني بأي موضوع تحبه.',
};

export default function GameMaker() {
  const { lang } = useLang();
  const title = lang === 'ar' ? 'صانع الألعاب' : 'יוצר המשחקים';
  const subtitle = lang === 'ar' ? 'ألعاب مخصصة لك' : 'משחקים מותאמים בשבילך';
  return (
    <AgentChat
      agentName="game_maker"
      title={title}
      subtitle={subtitle}
      greeting={GREETING}
      icon={Sparkles}
    />
  );
}