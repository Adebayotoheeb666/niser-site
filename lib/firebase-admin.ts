import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { initializeApp, getApps, getApp, cert } from 'firebase-admin/app';
import { getMessaging, type Messaging, type Message, type AndroidConfig, type ApnsConfig, type WebpushConfig } from 'firebase-admin/messaging';
import { getFirestore as _getFirestore } from 'firebase-admin/firestore';
import type { ServiceAccount } from 'firebase-admin';

const rawServiceAccount = process.env.FIREBASE_SERVICE_ACCOUNT;

function parseServiceAccount(raw: string | undefined): ServiceAccount {
  if (!raw) {
    throw new Error('FIREBASE_SERVICE_ACCOUNT environment variable is not set. Set it to the Firebase service account JSON string, base64-encoded JSON, or a path to the JSON file.');
  }

  const trimmed = raw.trim();
  let json = trimmed;

  if (!trimmed.startsWith('{')) {
    const candidatePath = resolve(trimmed);
    if (existsSync(candidatePath)) {
      json = readFileSync(candidatePath, 'utf8');
    } else {
      json = Buffer.from(trimmed, 'base64').toString('utf8');
    }
  }

  try {
    return JSON.parse(json) as ServiceAccount;
  } catch {
    throw new Error('FIREBASE_SERVICE_ACCOUNT must be valid JSON, base64-encoded JSON, or a readable JSON file path.');
  }
}

export function getFirebaseApp() {
  if (getApps().length > 0) {
    return getApp();
  }

  const serviceAccount = parseServiceAccount(rawServiceAccount);

  return initializeApp({
    credential: cert(serviceAccount),
  });
}

export function getFirebaseMessaging(): Messaging {
  return getMessaging(getFirebaseApp());
}

export function getFirebaseFirestore() {
  return _getFirestore(getFirebaseApp());
}

export interface PushNotificationPayload {
  token: string;
  title: string;
  body: string;
  data?: Record<string, string>;
  imageUrl?: string;
  androidConfig?: AndroidConfig;
  apnsConfig?: ApnsConfig;
  webpushConfig?: WebpushConfig;
}

export async function sendPushNotificationToToken(payload: PushNotificationPayload) {
  const messaging = getFirebaseMessaging();
  const message: Message = {
    token: payload.token,
    notification: {
      title: payload.title,
      body: payload.body,
      imageUrl: payload.imageUrl,
    },
    data: payload.data,
    android: payload.androidConfig,
    apns: payload.apnsConfig,
    webpush: payload.webpushConfig,
  };

  await messaging.send(message);
}

export async function sendPushNotificationToTopic(topic: string, payload: Omit<PushNotificationPayload, 'token'>) {
  const messaging = getFirebaseMessaging();
  const message: Message = {
    topic,
    notification: {
      title: payload.title,
      body: payload.body,
      imageUrl: payload.imageUrl,
    },
    data: payload.data,
    android: payload.androidConfig,
    apns: payload.apnsConfig,
    webpush: payload.webpushConfig,
  };

  await messaging.send(message);
}
