import { NextRequest, NextResponse } from 'next/server';
import { getAuthToken } from '@/lib/auth';
import { LPCCSv2Request, LPCCSv2ResponseMock } from '@/types/lpccsv2';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const tenantId = searchParams.get('tenantId');
    const documentKey = searchParams.get('documentKey');

    if (!tenantId || !documentKey) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    const token = await getAuthToken();
    
    if (!token) {
      return NextResponse.json(
        { error: 'Failed to authenticate' },
        { status: 401 }
      );
    }

    const response = await fetch(
      `${process.env.LP_CCS_GET_URL}${tenantId}/${documentKey}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch data from LP CCS' },
        { status: response.status }
      );
    }

    const data: LPCCSv2ResponseMock = await response.json();
    return NextResponse.json(data);

  } catch (error) {
    console.error('Error in LP CCS GET route:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}