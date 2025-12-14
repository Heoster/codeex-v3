import { NextRequest, NextResponse } from 'next/server';
import { promises as dns } from 'dns';

export async function POST(request: NextRequest) {
  try {
    const { domain, recordType, expectedContent } = await request.json();

    if (!domain || !recordType) {
      return NextResponse.json(
        { success: false, error: 'Domain and record type are required' },
        { status: 400 }
      );
    }

    let result;
    let isVerified = false;

    try {
      switch (recordType.toLowerCase()) {
        case 'txt':
          const txtRecords = await dns.resolveTxt(domain);
          const flatTxtRecords = txtRecords.flat();
          if (expectedContent) {
            isVerified = flatTxtRecords.some(record => 
              record.includes(expectedContent) || expectedContent.includes(record)
            );
          } else {
            isVerified = txtRecords.length > 0;
          }
          result = { records: flatTxtRecords, verified: isVerified };
          break;

        case 'mx':
          const mxRecords = await dns.resolveMx(domain);
          if (expectedContent) {
            isVerified = mxRecords.some(record => 
              record.exchange.includes(expectedContent) || expectedContent.includes(record.exchange)
            );
          } else {
            isVerified = mxRecords.length > 0;
          }
          result = { records: mxRecords, verified: isVerified };
          break;

        case 'cname':
          const cnameRecords = await dns.resolveCname(domain);
          if (expectedContent) {
            isVerified = cnameRecords.some(record => 
              record.includes(expectedContent) || expectedContent.includes(record)
            );
          } else {
            isVerified = cnameRecords.length > 0;
          }
          result = { records: cnameRecords, verified: isVerified };
          break;

        default:
          return NextResponse.json(
            { success: false, error: 'Unsupported record type' },
            { status: 400 }
          );
      }

      return NextResponse.json({
        success: true,
        domain,
        recordType,
        verified: isVerified,
        ...result
      });

    } catch (dnsError: any) {
      // DNS resolution failed - record doesn't exist or domain issues
      return NextResponse.json({
        success: true,
        domain,
        recordType,
        verified: false,
        error: dnsError.code || 'DNS_RESOLUTION_FAILED',
        message: 'Record not found or DNS resolution failed'
      });
    }

  } catch (error) {
    console.error('DNS verification error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}