import { useState, useEffect, useRef } from 'react';
import { base44 } from '@/api/base44Client';
import { useLang } from '@/lib/LanguageContext';
import { Send, Heart } from 'lucide-react';
import MessageBubble from '@/components/companion/MessageBubble';

/**
 * Reusable in-app agent conversation UI.
 * props: agentName, title, subtitle, greeting { he, ar }, icon
 */
export default function AgentChat({ agentName, title, subtitle, greeting, icon: Icon = Heart }) {
  const { lang } = useLang();
  const greetingMsg = greeting[lang] || greeting.he;
  const [conversationId, setConversationId] = useState(null);
  const [messages, setMessages] = useState([{ role: 'assistant', content: greetingMsg }]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const scrollRef = useRef(null);

  // Load (or create) the conversation for this agent
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const list = await base44.agents.listConversations({ agent_name: agentName });
        const arr = Array.isArray(list) ? list : (list?.items || []);
        let conv = arr[0];
        if (!conv) {
          conv = await base44.agents.createConversation({
            agent_name: agentName,
            metadata: { name: title, description: subtitle },
          });
        } else {
          conv = await base44.agents.getConversation(conv.id);
        }
        if (cancelled) return;
        setConversationId(conv.id);
        const msgs = conv.messages || [];
        if (cancelled) return;
        // Keep the local greeting until the agent has real messages
        if (msgs.length > 0) setMessages(msgs);
      } catch (e) {
        if (!cancelled) setError(typeof e?.message === 'string' && e.message ? e.message : 'Something went wrong');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [agentName, lang]);

  // Subscribe to live updates
  useEffect(() => {
    if (!conversationId) return;
    const unsubscribe = base44.agents.subscribeToConversation(conversationId, (data) => {
      setMessages(data.messages || []);
      setSending(false);
    });
    return () => unsubscribe();
  }, [conversationId]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    const text = input.trim();
    if (!text || !conversationId || sending) return;
    setInput('');
    setSending(true);
    try {
      const conv = await base44.agents.getConversation(conversationId);
      const updated = await base44.agents.addMessage(conv, { role: 'user', content: text });
      setMessages(updated.messages || []);
    } catch (e) {
      setSending(false);
      setError(typeof e?.message === 'string' && e.message ? e.message : 'Could not send message');
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
      <div className="flex items-center gap-3 pb-3 border-b border-border">
        <div className="w-11 h-11 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-md">
          <Icon className="w-6 h-6 text-primary-foreground" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-foreground">{title}</h2>
          <p className="text-sm text-muted-foreground">{subtitle}</p>
        </div>
      </div>

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