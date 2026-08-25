import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { CheckCircle2, XCircle, Loader2, ChevronDown, ChevronUp, Wrench } from 'lucide-react';

const STATUS_MAP = {
  pending: { icon: Loader2, className: 'animate-spin text-muted-foreground', text: 'מתכונן…' },
  running: { icon: Loader2, className: 'animate-spin text-primary', text: 'פועל…' },
  in_progress: { icon: Loader2, className: 'animate-spin text-primary', text: 'פועל…' },
  completed: { icon: CheckCircle2, className: 'text-emerald-600', text: 'הושלם' },
  success: { icon: CheckCircle2, className: 'text-emerald-600', text: 'הצליח' },
  failed: { icon: XCircle, className: 'text-destructive', text: 'נכשל' },
  error: { icon: XCircle, className: 'text-destructive', text: 'שגיאה' },
};

function FunctionDisplay({ toolCall }) {
  const [expanded, setExpanded] = useState(false);
  const status = STATUS_MAP[toolCall.status] || STATUS_MAP.pending;
  const StatusIcon = status.icon;
  const failed = toolCall.status === 'failed' || toolCall.status === 'error';
  const proj = toolCall.display_projection || {};
  const hideDetails = proj.hide_details && proj.details_redacted;

  let parsedResults = toolCall.results;
  if (typeof parsedResults === 'string') {
    try { parsedResults = JSON.parse(parsedResults); } catch { /* keep raw */ }
  }
  const resultFailed = failed || /error|failed/i.test(JSON.stringify(parsedResults ?? '')) || parsedResults?.success === false;

  const label = failed ? (proj.error_label || status.text) : (proj.label || status.text);
  const activeLabel = proj.active_label || status.text;

  return (
    <div className="mt-2 text-xs">
      <button
        onClick={() => setExpanded(v => !v)}
        className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors"
      >
        <Wrench className="w-3.5 h-3.5" />
        <span className="font-medium">{toolCall.name}</span>
        <StatusIcon className={`w-3.5 h-3.5 ${resultFailed ? 'text-destructive' : status.className}`} />
        <span className={resultFailed ? 'text-destructive' : 'text-muted-foreground'}>
          {toolCall.status === 'pending' || toolCall.status === 'running' || toolCall.status === 'in_progress' ? activeLabel : label}
        </span>
        {!hideDetails && (expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />)}
      </button>
      {expanded && !hideDetails && (
        <div className="mt-1.5 space-y-1 bg-muted/50 rounded-lg p-2 font-mono text-[11px] leading-relaxed">
          {toolCall.arguments_string && (
            <div>
              <span className="text-muted-foreground">פרמטרים:</span>
              <pre className="whitespace-pre-wrap break-words">{(() => { try { return JSON.stringify(JSON.parse(toolCall.arguments_string), null, 2); } catch { return toolCall.arguments_string; } })()}</pre>
            </div>
          )}
          {parsedResults != null && (
            <div>
              <span className="text-muted-foreground">תוצאה:</span>
              <pre className="whitespace-pre-wrap break-words">{JSON.stringify(parsedResults, null, 2)}</pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function MessageBubble({ message }) {
  const isUser = message.role === 'user';
  return (
    <div className={`flex ${isUser ? 'justify-start' : 'justify-end'}`}>
      <div className={`max-w-[85%] rounded-2xl px-4 py-3 ${
        isUser
          ? 'bg-primary text-primary-foreground'
          : 'bg-card border border-border text-card-foreground'
      }`}>
        {message.content && (
          isUser
            ? <p className="text-base leading-relaxed whitespace-pre-wrap">{message.content}</p>
            : <ReactMarkdown className="text-base leading-relaxed prose prose-sm max-w-none [&>*]:my-1">{message.content}</ReactMarkdown>
        )}
        {message.tool_calls?.map((tc, i) => <FunctionDisplay key={i} toolCall={tc} />)}
      </div>
    </div>
  );
}