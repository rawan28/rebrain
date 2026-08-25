import { Heart } from 'lucide-react';
import AgentChat from '@/components/companion/AgentChat';
import { useLang } from '@/lib/LanguageContext';

const GREETING = {
  he: 'שלום ידידי! 👋 אני כאן בשבילך. איך אתה מרגיש היום?',
  ar: 'مرحباً صديقي! 👋 أنا هنا من أجلك. كيف تشعر اليوم؟',
};

export default function Companion() {
  const { lang } = useLang();
  const title = lang === 'ar' ? 'الرفيق' : 'הידיד';
  const subtitle = lang === 'ar' ? 'مرافقك اللطيف' : 'המלווה החם שלך';
  return (
    <AgentChat
      agentName="companion"
      title={title}
      subtitle={subtitle}
      greeting={GREETING}
      icon={Heart}
    />
  );
}