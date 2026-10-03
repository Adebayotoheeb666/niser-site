Policy Monitor: Scheduler, Worker & Review Workflow

Firestore setup
- Ensure `FIREBASE_SERVICE_ACCOUNT` is set (path, JSON, or base64) and Firestore is enabled for the project.
- The following collections are used and will be created automatically: `policy_jobs`, `policy_alerts`, `policy_subscriptions`, `translation_cache`, `translation_review`.

Run scheduler (enqueue jobs)
```bash
# Enqueue a single policy-monitor job (intended for cron)
npm run policy-monitor-schedule
```

Cron example (run daily at 06:00 UTC = 07:00 WAT, the plan's delivery SLA):
```cron
0 6 * * * cd /home/niser && npm run policy-monitor-schedule >> /var/log/policy-monitor-schedule.log 2>&1
```

Run worker (polls Firestore and executes jobs)
```bash
# Keep a worker running that claims and runs pending jobs
npm run policy-monitor-worker

# Run in background (example)
nohup npm run policy-monitor-worker >> policy-monitor-worker.log 2>&1 &
```

Manual run (legacy)
```bash
# The original script still works and is useful for quick manual runs
npm run policy-monitor
```

Review workflow & admin APIs
- Alerts persisted to Firestore in `policy_alerts`. Use the admin API to list recent alerts:
```bash
curl -H "x-internal-ai-secret: $INTERNAL_AI_SECRET" http://localhost:3000/api/policy-alerts
```
- Subscribers are stored in `policy_subscriptions` with an unsubscribe token; the confirmation email contains an unsubscribe URL handled by the `GET /api/subscribe` route.
- Translations that score below threshold and failed translation calls are recorded in `translation_review`. Use your admin console or a small admin UI to review and re-run or correct translations.

Notes & Troubleshooting
- Ensure `INTERNAL_AI_SECRET` is configured for worker-to-API calls.
- Worker implements exponential backoff by updating `nextRunAt` and `attempts` on job failures; inspect `policy_jobs` for failed jobs.
- If Firestore access fails, verify `FIREBASE_SERVICE_ACCOUNT` and IAM roles.

## 🚀 Deployment & Migration Notes
- The scheduler and worker are intentionally decoupled: the scheduler enqueues jobs while the worker executes them.
- For production, run `npm run policy-monitor-schedule` from cron or a job scheduler and keep `npm run policy-monitor-worker` running under a process manager.
- If Firestore collections do not exist, they are created automatically on first use.
- To migrate from the old single-script setup, keep `npm run policy-monitor` as a fallback and move automation to `policy-monitor-schedule` plus worker supervision.
- Recommended production setup:
  - Cron job: `0 5 * * * cd /home/niser && npm run policy-monitor-schedule >> /var/log/policy-monitor-schedule.log 2>&1`
  - Worker service: `pm2 start npm --name policy-monitor-worker -- run policy-monitor-worker` or equivalent system service.
