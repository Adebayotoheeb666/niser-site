#!/bin/bash

# Cloudflare CDN Setup Script for NISER
# This script helps configure Cloudflare for niser.gov.ng
# 
# Prerequisites:
# 1. Cloudflare account created at https://dash.cloudflare.com
# 2. niser.gov.ng domain added to Cloudflare
# 3. Cloudflare API token generated
#
# Usage: bash scripts/setup-cloudflare.sh

set -e

echo "╔════════════════════════════════════════════════════════════════╗"
echo "║       NISER Cloudflare CDN Setup Script                        ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

# Check for required environment variables
if [ -z "$CLOUDFLARE_API_TOKEN" ]; then
    echo "❌ ERROR: CLOUDFLARE_API_TOKEN not set"
    echo "   Generate a token at: https://dash.cloudflare.com/profile/api-tokens"
    echo "   Then run: export CLOUDFLARE_API_TOKEN='your-token'"
    exit 1
fi

if [ -z "$CLOUDFLARE_ZONE_ID" ]; then
    echo "❌ ERROR: CLOUDFLARE_ZONE_ID not set"
    echo "   Find it in Cloudflare dashboard under niser.gov.ng > Overview"
    echo "   Then run: export CLOUDFLARE_ZONE_ID='your-zone-id'"
    exit 1
fi

DOMAIN="niser.gov.ng"
CACHE_RULES_FILE="cloudflare-cache-rules.json"

echo "✅ Cloudflare credentials found"
echo "   Domain: $DOMAIN"
echo ""

# Step 1: Check zone health
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Step 1: Verifying Zone Configuration"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

ZONE_DATA=$(curl -s -X GET "https://api.cloudflare.com/client/v4/zones/$CLOUDFLARE_ZONE_ID" \
    -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
    -H "Content-Type: application/json")

if echo "$ZONE_DATA" | grep -q '"success":true'; then
    ZONE_STATUS=$(echo "$ZONE_DATA" | grep -o '"status":"[^"]*' | cut -d'"' -f4)
    echo "✅ Zone verified: $ZONE_STATUS"
    
    # Show nameservers
    NAMESERVERS=$(echo "$ZONE_DATA" | grep -o '"name_servers":\[[^]]*\]' | head -1)
    echo "📌 Your Cloudflare nameservers (update at your registrar):"
    echo "$NAMESERVERS" | grep -o '"[^"]*\.ns\.cloudflare\.com"' | tr -d '"' | sed 's/^/   /'
else
    echo "❌ Failed to verify zone"
    echo "$ZONE_DATA"
    exit 1
fi

echo ""

# Step 2: Get current cache settings
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Step 2: Current Cache Settings"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

CACHE_SETTINGS=$(curl -s -X GET "https://api.cloudflare.com/client/v4/zones/$CLOUDFLARE_ZONE_ID/cache" \
    -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
    -H "Content-Type: application/json")

echo "$CACHE_SETTINGS" | jq '.' 2>/dev/null || echo "Cache settings retrieved (jq not available)"

echo ""

# Step 3: Setup cache rules (if script exists)
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Step 3: Cloudflare Cache Rules"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [ -f "$CACHE_RULES_FILE" ]; then
    echo "✅ Cache rules file found: $CACHE_RULES_FILE"
    echo ""
    echo "📋 Available rules in configuration:"
    grep -o '"description": "[^"]*' "$CACHE_RULES_FILE" | cut -d'"' -f4 | sed 's/^/   - /'
    echo ""
    echo "⚠️  To apply cache rules, use the Cloudflare Dashboard:"
    echo "   1. Go to Caching > Cache Rules"
    echo "   2. Create rules from $CACHE_RULES_FILE"
    echo "   Or use Cloudflare API with the JSON configuration"
else
    echo "❌ Cache rules file not found: $CACHE_RULES_FILE"
fi

echo ""

# Step 4: Verify DNS records
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Step 4: DNS Records"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

DNS_RECORDS=$(curl -s -X GET "https://api.cloudflare.com/client/v4/zones/$CLOUDFLARE_ZONE_ID/dns_records?per_page=50" \
    -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
    -H "Content-Type: application/json")

echo "📌 DNS Records:"
echo "$DNS_RECORDS" | jq '.result[] | {type: .type, name: .name, proxied: .proxied}' 2>/dev/null | head -20

echo ""

# Step 5: SSL/TLS settings
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Step 5: SSL/TLS Configuration"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

echo "✅ Recommended SSL/TLS mode: Full (strict)"
echo "   This requires a valid SSL certificate on your origin"
echo ""
echo "⚠️  Set via Cloudflare Dashboard > SSL/TLS > Overview"

echo ""

# Step 6: Environment setup
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Step 6: Environment Variables Required"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

echo "Add these to your .env.local file:"
echo ""
echo "# Cloudflare"
echo "CLOUDFLARE_API_TOKEN=$CLOUDFLARE_API_TOKEN"
echo "CLOUDFLARE_ZONE_ID=$CLOUDFLARE_ZONE_ID"
echo "ISR_REVALIDATE_TOKEN=<generate-a-secret-token>"
echo ""

# Step 7: Final checklist
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Step 7: Deployment Checklist"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

echo ""
echo "Before going live, complete these steps:"
echo ""
echo "☐ 1. Point your domain registrar to Cloudflare nameservers"
echo "     (DNS propagation can take 24-48 hours)"
echo ""
echo "☐ 2. Verify SSL/TLS mode is set to 'Full (strict)'"
echo "     Dashboard > SSL/TLS > Overview"
echo ""
echo "☐ 3. Create cache rules in Cloudflare Dashboard"
echo "     Dashboard > Caching > Cache Rules"
echo "     (Use rules from cloudflare-cache-rules.json)"
echo ""
echo "☐ 4. Enable security features:"
echo "     - Rate Limiting for /api/* endpoints"
echo "     - WAF rules (dashboard > Firewall > Firewall Rules)"
echo ""
echo "☐ 5. Set up API token permissions:"
echo "     - Zone:Cache Purge (for ISR revalidation)"
echo "     - Zone:Read (for monitoring)"
echo ""
echo "☐ 6. Test cache with:"
echo "     curl -I https://$DOMAIN"
echo "     (Look for 'CF-Ray' and 'cf-cache-status' headers)"
echo ""
echo "✅ Setup script complete!"
echo ""
