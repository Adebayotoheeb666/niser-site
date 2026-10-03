'use client';

import Link from 'next/link';
import './floatingchatbot.css';

export default function FloatingChatbotButton() {
  return (
    <Link href="/chatbot" className="floating-chatbot" aria-label="Open the NISER chatbot">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M8 9h8" />
        <path d="M8 13h5" />
        <path d="M18 4a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2l-4 4v-4H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h12Z" />
      </svg>
      <span>Ask NISER AI</span>
    </Link>
  );
}
