import { useState, useEffect, useRef } from 'react';
import { base44 } from '@/api/base44Client';
import { useLang } from '@/lib/LanguageContext';
import { Send, Heart } from 'lucide-react';
import MessageBubble from '@/components/companion/MessageBubble';

const AGENT_NAME = 'companion';

const GREETING = {
  he: 'שלום ידידי! 👋 אני כאן בשבילך. איך אתה מרגיש היום?',
  ar: 'مرحباً صديقي! 👋 أنا هنا من أجلك. كيف تشعر اليوم؟',
};

export default function Companion() {
  const { lang } = useLang();
  const [conversation, setConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const scrollRef = useRef(null);

  // Create or load conversation on mount
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const existing = base44.agents.listConversations({ agent_name: AGENT_NAME });
        const list = Array.isArray(existing) ? existing : [];
        let conv = list[0];
        if (!conv) {
          conv = base44.agents.createConversation({
            agent_name: AGENT_NAME,
            metadata: { name: 'Companion', description: 'Friendly cognitive companion' },
          });
        }
        if (cancelled) return;
        setConversation(conv);
        setMessages(conv.messages || []);
        // Seed a greeting if empty
        if (!conv.messages || conv.messages.length === 0) {
          const seeded = base44.agents.addMessage(conv, { role: 'assistant', content: GREETING[lang] || GREETING.he });
          setMessages(seeded.messages);
        }
      } catch (e) {
        if (!cancelled) setError(e.message || 'Something went wrong');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [lang]);

  // Subscribe to conversation updates
  useEffect(() => {
    if (!conversation) return;
    const unsubscribe = base44.agents.subscribeToConversation(conversation.id, (data) => {
      setMessages(data.messages);
      setSending(false);
    });
    return () => unsubscribe();
  }, [conversation]);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    const text = input.trim();
    if (!text || !conversation || sending) return;
    setInput('');
    setSending(true);
    try {
      const updated = base44.agents.addMessage(conversation, { role: 'user', content: text });
      setConversation(updated);
      setMessages(updated.messages);
    } catch (e) {
      setSending(false);
      setError(e.message || 'Could not send message');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3 text-center px-4">
        <p className="text-destructive font-semibold text-lg">{error}</p>
        <p className="text-muted-foreground">{lang === 'ar' ? 'حاول مرة أخرى لاحقاً' : 'נסה שוב מאוחר יותר'}</p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto flex flex-col h-[calc(100vh-9rem)]">
      {/* Header */}
      <div className="flex items-center gap-3 pb-3 border-b border-border">
        <div className="w-11 h-11 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-md">
          <Heart className="w-6 h-6 text-primary-foreground" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-foreground">
            {lang === 'ar' ? 'الرفيق' : 'הידיד'}
          </h2>
          <p className="text-sm text-muted-foreground">
            {lang === 'ar' ? 'مرافقك اللطيف' : 'המלווה החם שלך'}
          </p>
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto py-4 space-y-3">
        {messages.map((m, i) => (
          <MessageBubble key={i} message={m} />
        ))}
        {sending && (
          <div className="flex justify-end">
            <div className="bg-card border border-border rounded-2xl px-4 py-3 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0ms' }} />
              <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '150ms' }} />
              <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="pt-3 border-t border-border">
        <div className="flex items-end gap-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            rows={1}
            placeholder={lang === 'ar' ? 'اكتب رسالتك...' : 'כתוב הודעה...'}
            className="flex-1 resize-none rounded-2xl border border-input bg-card px-4 py-3 text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring min-h-[52px] max-h-32"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || sending}
            className="rounded-2xl bg-primary text-primary-foreground p-3.5 disabled:opacity-40 active:scale-95 transition-transform min-h-[52px] min-w-[52px] flex items-center justify-center"
            aria-label={lang === 'ar' ? 'إرسال' : 'שלח'}
          >
            <Send className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
}