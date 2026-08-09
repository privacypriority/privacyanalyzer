import { NextRequest, NextResponse } from 'next/server';
import {
  getRecentAnalyses,
  getAnalysesCount,
  initializeDatabase,
  isDatabaseConfigured,
} from '@/lib/db';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    if (!isDatabaseConfigured()) {
      console.log('[History] Database not configured - returning empty result');
      return NextResponse.json({
        analyses: [],
        total: 0,
        message: 'Database not available. History requires a DATABASE_URL (Postgres) connection.',
      });
    }

    // Initialize database schema (idempotent)
    try {
      await initializeDatabase();
    } catch (initError) {
      console.error('[History] Database initialization failed:', initError);
    }

    // Parse query parameters for pagination
    const { searchParams } = new URL(request.url);
    const limit = Math.min(Math.max(parseInt(searchParams.get('limit') || '24', 10), 1), 100);
    const offset = Math.max(parseInt(searchParams.get('offset') || '0', 10), 0);

    // Query recent analyses and total count
    const analyses = await getRecentAnalyses(limit, offset);
    const total = await getAnalysesCount();

    // Transform stored analyses for the response
    const formattedAnalyses = analyses.map((item) => {
      let parsedAnalysis = null;
      try {
        parsedAnalysis = JSON.parse(item.analysis_data);
      } catch {
        parsedAnalysis = null;
      }

      return {
        id: item.id,
        url: item.url,
        domain: item.domain,
        overall_score: item.overall_score,
        privacy_grade: item.privacy_grade,
        risk_level: item.risk_level,
        homepage_screenshot: item.homepage_screenshot,
        scraper_used: item.scraper_used,
        content_length: item.content_length,
        created_at: item.created_at,
        updated_at: item.updated_at,
        last_checked_at: item.last_checked_at,
        analysis: parsedAnalysis,
      };
    });

    return NextResponse.json({
      analyses: formattedAnalyses,
      total,
      limit,
      offset,
      has_more: offset + limit < total,
    });
  } catch (error) {
    console.error('[History] API error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve analysis history' },
      { status: 500 }
    );
  }
}
