'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, AlertCircle, Mail, Settings, ExternalLink } from 'lucide-react';
import { validateEmailConfig, getEmailConfigRecommendations } from '@/lib/email-config-validator';
import type { EmailConfigStatus } from '@/lib/email-config-validator';

export default function EmailStatusWidget() {
  const [config, setConfig] = useState<EmailConfigStatus | null>(null);
  const [recommendations, setRecommendations] = useState<string[]>([]);

  useEffect(() => {
    const emailConfig = validateEmailConfig();
    const recs = getEmailConfigRecommendations();
    setConfig(emailConfig);
    setRecommendations(recs);
  }, []);

  if (!config) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ready':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'partial':
        return <AlertCircle className="h-5 w-5 text-yellow-600" />;
      default:
        return <XCircle className="h-5 w-5 text-red-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ready':
        return <Badge className="bg-green-100 text-green-800 border-green-300">Ready</Badge>;
      case 'partial':
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300">Partial</Badge>;
      default:
        return <Badge className="bg-red-100 text-red-800 border-red-300">Not Configured</Badge>;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ready':
        return 'border-green-500';
      case 'partial':
        return 'border-yellow-500';
      default:
        return 'border-red-500';
    }
  };

  return (
    <Card className={`${getStatusColor(config.overallStatus)} border-l-4`}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Email Service Status
          </div>
          {getStatusBadge(config.overallStatus)}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Overall Status */}
        <div className="flex items-center gap-2">
          {getStatusIcon(config.overallStatus)}
          <span className="font-medium">
            {config.overallStatus === 'ready' && 'Email service is fully configured'}
            {config.overallStatus === 'partial' && 'Email service is partially configured'}
            {config.overallStatus === 'not-configured' && 'Email service needs configuration'}
          </span>
        </div>

        {/* Configuration Details */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span>Resend API Key</span>
              {config.resendApiKey ? (
                <CheckCircle className="h-4 w-4 text-green-600" />
              ) : (
                <XCircle className="h-4 w-4 text-red-600" />
              )}
            </div>
            <div className="flex items-center justify-between">
              <span>Domain Verified</span>
              {config.domainVerified ? (
                <CheckCircle className="h-4 w-4 text-green-600" />
              ) : (
                <XCircle className="h-4 w-4 text-red-600" />
              )}
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span>DKIM Record</span>
              {config.dnsRecords.dkim ? (
                <CheckCircle className="h-4 w-4 text-green-600" />
              ) : (
                <XCircle className="h-4 w-4 text-red-600" />
              )}
            </div>
            <div className="flex items-center justify-between">
              <span>SPF Record</span>
              {config.dnsRecords.spf ? (
                <CheckCircle className="h-4 w-4 text-green-600" />
              ) : (
                <XCircle className="h-4 w-4 text-red-600" />
              )}
            </div>
          </div>
        </div>

        {/* Recommendations */}
        {recommendations.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-medium text-sm">Recommendations:</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              {recommendations.slice(0, 3).map((rec, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">•</span>
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          <Button variant="outline" size="sm" asChild>
            <a href="/email-management">
              <Settings className="h-3 w-3 mr-1" />
              Configure
            </a>
          </Button>
          <Button variant="outline" size="sm" asChild>
            <a href="/test-resend">
              <Mail className="h-3 w-3 mr-1" />
              Test
            </a>
          </Button>
          <Button variant="outline" size="sm" asChild>
            <a href="https://resend.com/domains" target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-3 w-3 mr-1" />
              Resend
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}