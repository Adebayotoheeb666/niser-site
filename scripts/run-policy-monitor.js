#!/usr/bin/env node
async function main() {
  const base = process.env.BASE_URL || process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const url = `${base.replace(/\/$/, '')}/api/policy-monitor`;
  console.log(`Calling policy monitor: ${url}`);

  try {
    const secret = process.env.INTERNAL_AI_SECRET;
    if (!secret) throw new Error('INTERNAL_AI_SECRET is required to run the policy monitor');
    const res = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json', 'x-internal-ai-secret': secret }, body: JSON.stringify({ sendAlerts: true }) });
    const text = await res.text();
    console.log('Status:', res.status);
    console.log('Response:', text);
    process.exit(res.ok ? 0 : 2);
  } catch (err) {
    console.error('Policy monitor runner failed:', err);
    process.exit(1);
  }
}

main();
