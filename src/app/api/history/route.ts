import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // History storage disabled - no database backend
    // Return empty result for now
    return NextResponse.json({
      analyses: [],
      total: 0,
      message: 'Analysis history feature is currently disabled'
    });

  } catch (error) {
    console.error('History API error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve analysis history' },
      { status: 500 }
    );
  }
}