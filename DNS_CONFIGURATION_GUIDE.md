# DNS Configuration Guide for CODEEX AI Email Service

## Overview
This guide helps you configure DNS records for your custom domain `codeex-ai` to enable email sending and receiving through Resend and AWS SES.

## DNS Records to Add

### 1. DKIM (Domain Keys Identified Mail) - Email Authentication
**Purpose**: Verifies that emails are actually sent by your domain and haven't been tampered with.

```
Type: TXT
Name: resend._domainkey.codeex-ai
Content: p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDoJBdCoOPTOpFe/6FOpmDHA1/A6W4lI/cpCDjPQixAAli5EnDjPub3weO1S0ExgyJcyNZdHdHIIje7fb+2jVbRFdoposi4QXwejeWGZzxZctNmsS0FI7CYsPR9PepU/+FpEccWOR4GZAGW12vGnWqrtWPhWlxhb3wueh3yXrI+eQIDAQAB
TTL: Auto
Priority: N/A
```

### 2. SPF (Sender Policy Framework) - Anti-Spam Protection
**Purpose**: Specifies which mail servers are authorized to send emails on behalf of your domain.

```
Type: TXT
Name: send.codeex-ai
Content: v=spf1 include:amazonses.com ~all
TTL: Auto
Priority: N/A
```

### 3. DMARC (Domain-based Message Authentication) - Optional but Recommended
**Purpose**: Provides policy instructions for handling emails that fail SPF or DKIM checks.

```
Type: TXT
Name: _dmarc
Content: v=DMARC1; p=none;
TTL: Auto
Priority: N/A
```

### 4. MX Records for Sending
**Purpose**: Directs email sending through AWS SES servers.

```
Type: MX
Name: send.codeex-ai
Content: feedback-smtp.us-east-1.amazonses.com
TTL: Auto
Priority: 10
```

### 5. MX Records for Receiving (Optional)
**Purpose**: Enables receiving emails at your domain.

```
Type: MX
Name: codeex-ai
Content: inbound-smtp.us-east-1.amazonaws.com
TTL: Auto
Priority: 10
```

## How to Add These Records

### For Popular Domain Providers:

#### Cloudflare:
1. Log into Cloudflare dashboard
2. Select your domain `codeex-ai`
3. Go to DNS > Records
4. Click "Add record"
5. Enter the Type, Name, and Content for each record above
6. Save each record

#### Namecheap:
1. Log into Namecheap account
2. Go to Domain List > Manage
3. Click "Advanced DNS"
4. Add each record using the "Add New Record" button

#### GoDaddy:
1. Log into GoDaddy account
2. Go to My Products > DNS
3. Select your domain
4. Add each record in the DNS Management section

#### Google Domains:
1. Log into Google Domains
2. Select your domain
3. Go to DNS settings
4. Add each record in the Custom records section

## Verification Steps

### 1. Check DNS Propagation
After adding records, use these tools to verify:
- https://dnschecker.org/
- https://mxtoolbox.com/
- `nslookup` command in terminal

### 2. Test Email Authentication
Use these tools to verify DKIM, SPF, and DMARC:
- https://mxtoolbox.com/dmarc.aspx
- https://dmarcian.com/dmarc-inspector/
- https://www.mail-tester.com/

### 3. Resend Domain Verification
1. Log into your Resend dashboard
2. Go to Domains section
3. Add your domain `codeex-ai`
4. Verify that all DNS records are detected

## Important Notes

1. **DNS Propagation**: Changes can take 24-48 hours to fully propagate worldwide
2. **TTL Values**: Use "Auto" or 3600 (1 hour) for faster updates during setup
3. **Testing**: Always test with a small email first before bulk sending
4. **Subdomain**: The `send.codeex-ai` subdomain is specifically for email sending
5. **Security**: DMARC policy `p=none` is recommended initially for monitoring

## Troubleshooting

### Common Issues:
1. **Records not found**: Check spelling and wait for DNS propagation
2. **DKIM verification fails**: Ensure the DKIM record content is exactly as provided
3. **SPF too many lookups**: Keep SPF record simple with just `include:amazonses.com`
4. **Email delivery issues**: Check spam folders and email authentication status

### Verification Commands:
```bash
# Check DKIM record
nslookup -type=TXT resend._domainkey.codeex-ai

# Check SPF record
nslookup -type=TXT send.codeex-ai

# Check MX record
nslookup -type=MX send.codeex-ai
```

## Next Steps
After DNS configuration:
1. Update your application's email configuration
2. Test email sending functionality
3. Monitor email delivery and authentication status
4. Set up email receiving if needed