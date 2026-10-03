export function ChatTypingIndicator() {
  return (
    <div className="chat-row chat-row--assistant">
      <div className="chat-typing" role="status" aria-label="NISER Assistant is typing">
        <span className="chat-typing__dot" aria-hidden="true" />
        <span className="chat-typing__dot" aria-hidden="true" />
        <span className="chat-typing__dot" aria-hidden="true" />
      </div>
    </div>
  );
}
