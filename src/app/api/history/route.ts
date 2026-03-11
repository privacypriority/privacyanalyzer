/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import {
  getRecentAnalyses,
  initializeDatabase,
  type D1Database
} from '@/lib/d1-database';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Helper function to get D1 database from Cloudflare Workers environment
function getD1Database(): D1Database | undefined {
  if (typeof globalThis !== 'undefined' && (globalThis as any).DB) {
    return (globalThis as any).DB as D1Database;
  }

  if (typeof process !== 'undefined' && process.env && (process.env as any).DB) {
    return (process.env as any).DB as D1Database;
  }

  const cloudflareEnv = (globalThis as any).env || (globalThis as any).__env;
  if (cloudflareEnv && cloudflareEnv.DB) {
    return cloudflareEnv.DB as D1Database;
  }

  return undefined;
}

export async function GET(request: NextRequest) {
  try {
    const db = getD1Database();

    if (!db) {
      console.log('[History] D1 database not available - returning empty result');
      return NextResponse.json({
        analyses: [],
        total: 0,
        message: 'Database not available. History requires a Cloudflare D1 database binding.'
      });
    }

    // Initialize database schema (idempotent)
    try {
      await initializeDatabase(db);
    } catch (initError) {
      console.error('[History] Database initialization failed:', initError);
    }

    // Parse query parameters for pagination
    const { searchParams } = new URL(request.url);
    const limit = Math.min(Math.max(parseInt(searchParams.get('limit') || '24', 10), 1), 100);
    const offset = Math.max(parseInt(searchParams.get('offset') || '0', 10), 0);

    // Query recent analyses from D1
    const analyses = await getRecentAnalyses(db, limit, offset);

    // Get total count for pagination
    let total = 0;
    try {
      const countResult = await db.prepare('SELECT COUNT(*) as count FROM analyses').first<{ count: number }>();
      total = countResult?.count || 0;
    } catch (countError) {
      console.error('[History] Failed to get total count:', countError);
      total = analyses.length;
    }

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
