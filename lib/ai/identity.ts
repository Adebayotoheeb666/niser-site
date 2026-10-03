import { NextRequest } from 'next/server';
import { newSessionId, newVisitorId } from './memory';

export const SESSION_COOKIE = 'niser_chat_session';
export const VISITOR_COOKIE = 'niser_chat_visitor';
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365; // 1 year

export interface ChatIdentity {
  sessionId: string;
  visitorId: string;
}

/** Read the current session/visitor ids from request cookies. */
export function readChatIdentity(req: NextRequest): Partial<ChatIdentity> {
  return {
    sessionId: req.cookies.get(SESSION_COOKIE)?.value,
    visitorId: req.cookies.get(VISITOR_COOKIE)?.value,
  };
}

export function createChatIdentity(): ChatIdentity {
  return { sessionId: newSessionId(), visitorId: newVisitorId() };
}

/**
 * Build `Set-Cookie` header values for the identity cookies.
 * Return as an array of [name, value] pairs so `Response` keeps each header.
 */
export function identityCookiePairs(sessionId: string, visitorId: string): Array<[string, string]> {
  const secure = process.env.NODE_ENV === 'production' ? '; Secure' : '';
  const base = `Path=/; HttpOnly; SameSite=Lax; Max-Age=${COOKIE_MAX_AGE}${secure}`;
  return [
    [`Set-Cookie`, `${SESSION_COOKIE}=${sessionId}; ${base}`],
    [`Set-Cookie`, `${VISITOR_COOKIE}=${visitorId}; ${base}`],
  ];
}
