interface ChatStatusBadgeProps {
  /** true = ready, false = unavailable, null = still checking. */
  status: boolean | null;
}

export function ChatStatusBadge({ status }: ChatStatusBadgeProps) {
  const ready = status === true;
  const offline = status === false;
  const label = ready ? 'Online' : offline ? 'Service unavailable' : 'Checking service';
  const state = ready ? 'online' : offline ? 'offline' : 'checking';

  return (
    <span className={`chat-status chat-status--${state}`}>
      <span className="chat-status__dot" aria-hidden="true" />
      <span className="chat-status__label">{label}</span>
    </span>
  );
}
