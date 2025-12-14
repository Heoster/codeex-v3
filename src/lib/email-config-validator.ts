/**
 * Email Configuration Validator
 * Validates email service configuration and DNS setup
 */

export interface EmailConfigStatus {
  resendApiKey: boolean;
  dnsRecords: {
    dkim: boolean;
    spf: boolean;
    dmarc: boolean;
    mx: boolean;
  };
  domainVerified: boolean;
  overallStatus: 'ready' | 'partial' | 'not-configured';
}

export interface DNSCheckResult {
  record: string;
  type: string;
  found: boolean;
  value?: string;
  error?: string;
}

/**
 * Check if Resend API key is configured
 */
export function checkResendApiKey(): boolean {
  return !!process.env.RESEND_API_KEY;
}

/**
 * Validate email configuration status
 */
export function validateEmailConfig(): EmailConfigStatus {
  const resendApiKey = checkResendApiKey();
  
  // For now, we'll assume DNS records need to be checked externally
  // In a real implementation, you'd make DNS queries here
  const dnsRecords = {
    dkim: false, // Would check resend._domainkey.codeex-ai TXT record
    spf: false,  // Would check send.codeex-ai TXT record
    dmarc: false, // Would check _dmarc TXT record
    mx: false    // Would check send.codeex-ai MX record
  };

  const domainVerified = Object.values(dnsRecords).every(Boolean);
  
  let overallStatus: 'ready' | 'partial' | 'not-configured';
  if (resendApiKey && domainVerified) {
    overallStatus = 'ready';
  } else if (resendApiKey || Object.values(dnsRecords).some(Boolean)) {
    overallStatus = 'partial';
  } else {
    overallStatus = 'not-configured';
  }

  return {
    resendApiKey,
    dnsRecords,
    domainVerified,
    overallStatus
  };
}

/**
 * Get email configuration recommendations
 */
export function getEmailConfigRecommendations(): string[] {
  const config = validateEmailConfig();
  const recommendations: string[] = [];

  if (!config.resendApiKey) {
    recommendations.push('Configure RESEND_API_KEY in environment variables');
  }

  if (!config.dnsRecords.dkim) {
    recommendations.push('Add DKIM TXT record for email authentication');
  }

  if (!config.dnsRecords.spf) {
    recommendations.push('Add SPF TXT record for sender verification');
  }

  if (!config.dnsRecords.dmarc) {
    recommendations.push('Add DMARC TXT record for email policy');
  }

  if (!config.dnsRecords.mx) {
    recommendations.push('Add MX record for email routing');
  }

  if (recommendations.length === 0) {
    recommendations.push('Email configuration is complete! 🎉');
  }

  return recommendations;
}

/**
 * Generate DNS record configuration for copy-paste
 */
export function generateDNSRecordConfig() {
  return {
    dkim: {
      type: 'TXT',
      name: 'resend._domainkey.codeex-ai',
      value: 'p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDoJBdCoOPTOpFe/6FOpmDHA1/A6W4lI/cpCDjPQixAAli5EnDjPub3weO1S0ExgyJcyNZdHdHIIje7fb+2jVbRFdoposi4QXwejeWGZzxZctNmsS0FI7CYsPR9PepU/+FpEccWOR4GZAGW12vGnWqrtWPhWlxhb3wueh3yXrI+eQIDAQAB'
    },
    spf: {
      type: 'TXT',
      name: 'send.codeex-ai',
      value: 'v=spf1 include:amazonses.com ~all'
    },
    dmarc: {
      type: 'TXT',
      name: '_dmarc',
      value: 'v=DMARC1; p=none;'
    },
    mx_send: {
      type: 'MX',
      name: 'send.codeex-ai',
      value: 'feedback-smtp.us-east-1.amazonses.com',
      priority: 10
    },
    mx_receive: {
      type: 'MX',
      name: 'codeex-ai',
      value: 'inbound-smtp.us-east-1.amazonaws.com',
      priority: 10
    }
  };
}