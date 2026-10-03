import { SendIcon, StopIcon, TrashIcon } from './icons';

interface ChatComposerProps {
  input: string;
  loading: boolean;
  showPrompts: boolean;
  suggestedPrompts: string[];
  onInputChange: (value: string) => void;
  onPromptSelect: (prompt: string) => void;
  onSend: () => void;
  onClear: () => void;
  onStop: () => void;
}

export function ChatComposer({
  input,
  loading,
  showPrompts,
  suggestedPrompts,
  onInputChange,
  onPromptSelect,
  onSend,
  onClear,
  onStop,
}: ChatComposerProps) {
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onSend();
  };

  return (
    <div className="chat-composer">
      {!showPrompts && (
        <div className="chat-composer__tools">
          <button
            type="button"
            className="chat-composer__clear"
            onClick={onClear}
            disabled={loading}
          >
            <TrashIcon /> Clear conversation memory
          </button>
        </div>
      )}

      {showPrompts && suggestedPrompts.length > 0 && (
        <div className="chat-prompts" aria-label="Suggested questions">
          {suggestedPrompts.map((prompt, idx) => (
            <button
              key={idx}
              type="button"
              className="chat-prompt"
              onClick={() => onPromptSelect(prompt)}
              disabled={loading}
            >
              {prompt}
            </button>
          ))}
        </div>
      )}

      <form className="chat-form" onSubmit={handleSubmit}>
        <input
          className="input input--lg chat-form__input"
          type="text"
          value={input}
          onChange={(event) => onInputChange(event.target.value)}
          placeholder="Ask NISER Assistant..."
          disabled={loading}
          aria-label="Chat query input"
        />
        <button
          type="submit"
          className="btn btn--primary chat-form__send"
          disabled={loading || !input.trim()}
        >
          <SendIcon />
          <span>Send</span>
        </button>
        {loading && (
          <button
            type="button"
            className="btn btn--outline chat-form__stop"
            onClick={onStop}
          >
            <StopIcon />
            <span>Stop</span>
          </button>
        )}
      </form>
    </div>
  );
}
