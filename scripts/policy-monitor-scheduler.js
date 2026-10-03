#!/usr/bin/env node
const { getFirebaseFirestore } = require('../lib/firebase-admin');

// Lightweight scheduler: create a pending job document for the worker to pick up.
async function main() {
  try {
    const db = getFirebaseFirestore();
    const now = new Date();
    const doc = await db.collection('policy_jobs').add({
      status: 'pending',
      createdAt: now.toISOString(),
      runAt: now.toISOString(),
      attempts: 0,
      lastError: null,
    });
    console.log('Enqueued job', doc.id);
  } catch (err) {
    console.error('Failed to enqueue policy-monitor job', err);
    process.exit(1);
  }
}

main();
