#!/usr/bin/env node
// Worker: polls Firestore for pending jobs and executes the monitor
const { getFirebaseFirestore } = require('../lib/firebase-admin');

async function main() {
  try {
    const db = getFirebaseFirestore();

    console.log('Policy monitor worker started. Polling for jobs...');
    while (true) {
      const now = new Date().toISOString();
      const q = await db.collection('policy_jobs').where('status', '==', 'pending').orderBy('createdAt', 'asc').limit(1).get();
      if (q.empty) {
        // sleep a bit
        await new Promise((r) => setTimeout(r, 5000));
        continue;
      }

      const doc = q.docs[0];
      const data = doc.data();
      const jobId = doc.id;
      // claim job
      try {
        await doc.ref.update({ status: 'running', attempts: (data.attempts || 0) + 1, startedAt: new Date().toISOString() });
      } catch (err) {
        console.warn('Failed to claim job', jobId, err);
        continue;
      }

      try {
        // call internal API
        const base = process.env.BASE_URL || process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
        const url = `${base.replace(/\/$/, '')}/api/policy-monitor`;
        const res = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json', 'x-internal-ai-secret': process.env.INTERNAL_AI_SECRET ?? '' }, body: JSON.stringify({ sendAlerts: true }) });
        const text = await res.text();
        if (!res.ok) {
          throw new Error(`Monitor API failed ${res.status}: ${text}`);
        }
        await doc.ref.update({ status: 'completed', completedAt: new Date().toISOString(), result: text });
        console.log('Job completed', jobId);
      } catch (err) {
        console.error('Job failed', jobId, err);
        const attempts = (data.attempts || 0) + 1;
        const nextRun = new Date(Date.now() + Math.pow(2, attempts) * 1000).toISOString();
        await doc.ref.update({ status: 'error', lastError: String(err), attempts, nextRunAt: nextRun });
      }
    }
  } catch (err) {
    console.error('Worker failed', err);
    process.exit(1);
  }
}

main();
