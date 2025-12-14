'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CheckCircle, XCircle, Globe, Shield, Mail, Loader2, Copy, ExternalLink } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface DNSRecord {
  type: string;
  name: string;
  content: string;
  ttl: string;
  priority?: string;
  description: string;
  status?: 'pending' | 'verified' | 'failed';
}

const dnsRecords: DNSRecord[] = [
  {
    type: 'TXT',
    name: 'resend._domainkey.codeex-ai',
    content: 'p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDoJBdCoOPTOpFe/6FOpmDHA1/A6W4lI/cpCDjPQixAAli5EnDjPub3weO1S0ExgyJcyNZdHdHIIje7fb+2jVbRFdoposi4QXwejeWGZzxZctNmsS0FI7CYsPR9PepU/+FpEccWOR4GZAGW12vGnWqrtWPhWlxhb3wueh3yXrI+eQIDAQAB',
    ttl: 'Auto',
    description: 'DKIM authentication for email signing'
  },
  {
    type: 'TXT',
    name: 'send.codeex-ai',
    content: 'v=spf1 include:amazonses.com ~all',
    ttl: 'Auto',
    description: 'SPF record for sender authentication'
  },
  {
    type: 'TXT',
    name: '_dmarc',
    content: 'v=DMARC1; p=none;',
    ttl: 'Auto',
    description: 'DMARC policy for email authentication'
  },
  {
    type: 'MX',
    name: 'send.codeex-ai',
    content: 'feedback-smtp.us-east-1.amazonses.com',
    ttl: 'Auto',
    priority: '10',
    description: 'MX record for email sending'
  },
  {
    type: 'MX',
    name: 'codeex-ai',
    content: 'inbound-smtp.us-east-1.amazonaws.com',
    ttl: 'Auto',
    priority: '10',
    description: 'MX record for email receiving (optional)'
  }
];

export default function DomainVerification() {
  const [verifying, setVerifying] = useState(false);
  const [verificationResults, setVerificationResults] = useState<Record<string, boolean>>({});
  const [testDomain, setTestDomain] = useState('send.codeex-ai');

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const verifyDNSRecord = async (record: DNSRecord) => {
    setVerifying(true);
    
    try {
      const response = await fetch('/api/verify-dns', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          domain: record.name,
          recordType: record.type,
          expectedContent: record.content
        }),
      });

      const result = await response.json();
      
      setVerificationResults(prev => ({
        ...prev,
        [record.name]: result.verified || false
      }));
    } catch (error) {
      console.error('DNS verification failed:', error);
      setVerificationResults(prev => ({
        ...prev,
        [record.name]: false
      }));
    } finally {
      setVerifying(false);
    }
  };

  const verifyAllRecords = async () => {
    setVerifying(true);
    const results: Record<string, boolean> = {};
    
    for (const record of dnsRecords) {
      try {
        const response = await fetch('/api/verify-dns', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            domain: record.name,
            recordType: record.type,
            expectedContent: record.content
          }),
        });

        const result = await response.json();
        results[record.name] = result.verified || false;
      } catch (error) {
        console.error(`DNS verification failed for ${record.name}:`, error);
        results[record.name] = false;
      }
      
      // Small delay between requests to avoid overwhelming DNS servers
      await new Promise(resolve => setTimeout(resolve, 200));
    }
    
    setVerificationResults(results);
    setVerifying(false);
  };

  const getRecordStatus = (recordName: string) => {
    if (verificationResults[recordName] === undefined) return 'pending';
    return verificationResults[recordName] ? 'verified' : 'failed';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return <div className="h-4 w-4 rounded-full bg-gray-300" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'verified':
        return <Badge className="bg-green-100 text-green-800 border-green-300">Verified</Badge>;
      case 'failed':
        return <Badge className="bg-red-100 text-red-800 border-red-300">Failed</Badge>;
      default:
        return <Badge variant="outline">Pending</Badge>;
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold flex items-center justify-center gap-2">
          <Globe className="h-8 w-8 text-blue-600" />
          Domain Verification & DNS Configuration
        </h1>
        <p className="text-muted-foreground">
          Configure and verify DNS records for CODEEX AI email service
        </p>
      </div>

      <Tabs defaultValue="records" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="records">DNS Records</TabsTrigger>
          <TabsTrigger value="verification">Verification</TabsTrigger>
          <TabsTrigger value="guides">Setup Guides</TabsTrigger>
        </TabsList>

        {/* DNS Records Tab */}
        <TabsContent value="records">
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Required DNS Records
                </CardTitle>
                <CardDescription>
                  Add these DNS records to your domain provider to enable email functionality
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {dnsRecords.map((record, index) => (
                    <Card key={index} className="border-l-4 border-l-blue-500">
                      <CardContent className="pt-4">
                        <div className="flex items-start justify-between">
                          <div className="space-y-2 flex-1">
                            <div className="flex items-center gap-2">
                              <Badge variant="outline">{record.type}</Badge>
                              {getStatusBadge(getRecordStatus(record.name))}
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                              <div>
                                <Label className="text-xs text-muted-foreground">NAME</Label>
                                <div className="font-mono bg-muted p-2 rounded flex items-center justify-between">
                                  <span className="truncate">{record.name}</span>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => copyToClipboard(record.name)}
                                  >
                                    <Copy className="h-3 w-3" />
                                  </Button>
                                </div>
                              </div>
                              <div className="md:col-span-2">
                                <Label className="text-xs text-muted-foreground">CONTENT</Label>
                                <div className="font-mono bg-muted p-2 rounded flex items-center justify-between">
                                  <span className="truncate">{record.content}</span>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => copyToClipboard(record.content)}
                                  >
                                    <Copy className="h-3 w-3" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                            <div className="flex gap-4 text-xs text-muted-foreground">
                              <span>TTL: {record.ttl}</span>
                              {record.priority && <span>Priority: {record.priority}</span>}
                            </div>
                            <p className="text-sm text-muted-foreground">{record.description}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Verification Tab */}
        <TabsContent value="verification">
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  DNS Record Verification
                </CardTitle>
                <CardDescription>
                  Verify that your DNS records are properly configured and propagated
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex-1">
                    <Label htmlFor="test-domain">Domain to Test</Label>
                    <Input
                      id="test-domain"
                      value={testDomain}
                      onChange={(e) => setTestDomain(e.target.value)}
                      placeholder="send.codeex-ai"
                    />
                  </div>
                  <div className="flex items-end">
                    <Button 
                      onClick={verifyAllRecords}
                      disabled={verifying}
                      className="flex items-center gap-2"
                    >
                      {verifying ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Verifying...
                        </>
                      ) : (
                        <>
                          <Shield className="h-4 w-4" />
                          Verify All Records
                        </>
                      )}
                    </Button>
                  </div>
                </div>

                <div className="grid gap-3">
                  {dnsRecords.map((record, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        {getStatusIcon(getRecordStatus(record.name))}
                        <div>
                          <div className="font-medium">{record.type} - {record.name}</div>
                          <div className="text-sm text-muted-foreground">{record.description}</div>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => verifyDNSRecord(record)}
                        disabled={verifying}
                      >
                        {verifying ? (
                          <Loader2 className="h-3 w-3 animate-spin" />
                        ) : (
                          'Verify'
                        )}
                      </Button>
                    </div>
                  ))}
                </div>

                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    DNS propagation can take up to 24-48 hours. If verification fails, wait and try again later.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Setup Guides Tab */}
        <TabsContent value="guides">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Popular Domain Providers</CardTitle>
                <CardDescription>Quick setup guides for common providers</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { name: 'Cloudflare', url: 'https://developers.cloudflare.com/dns/manage-dns-records/how-to/create-dns-records/' },
                  { name: 'Namecheap', url: 'https://www.namecheap.com/support/knowledgebase/article.aspx/319/2237/how-can-i-set-up-an-a-address-record-for-my-domain/' },
                  { name: 'GoDaddy', url: 'https://www.godaddy.com/help/add-an-a-record-19238' },
                  { name: 'Google Domains', url: 'https://support.google.com/domains/answer/3290350' }
                ].map((provider) => (
                  <div key={provider.name} className="flex items-center justify-between p-2 border rounded">
                    <span className="font-medium">{provider.name}</span>
                    <Button variant="outline" size="sm" asChild>
                      <a href={provider.url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-3 w-3 mr-1" />
                        Guide
                      </a>
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Verification Tools</CardTitle>
                <CardDescription>External tools to verify DNS configuration</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { name: 'DNS Checker', url: 'https://dnschecker.org/' },
                  { name: 'MX Toolbox', url: 'https://mxtoolbox.com/' },
                  { name: 'DMARC Analyzer', url: 'https://dmarcian.com/dmarc-inspector/' },
                  { name: 'Mail Tester', url: 'https://www.mail-tester.com/' }
                ].map((tool) => (
                  <div key={tool.name} className="flex items-center justify-between p-2 border rounded">
                    <span className="font-medium">{tool.name}</span>
                    <Button variant="outline" size="sm" asChild>
                      <a href={tool.url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-3 w-3 mr-1" />
                        Check
                      </a>
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Status Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Email Service Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-blue-600">5</div>
              <div className="text-sm text-muted-foreground">DNS Records Required</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {Object.values(verificationResults).filter(Boolean).length}
              </div>
              <div className="text-sm text-muted-foreground">Records Verified</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-orange-600">
                {Object.keys(verificationResults).length - Object.values(verificationResults).filter(Boolean).length}
              </div>
              <div className="text-sm text-muted-foreground">Pending Verification</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}