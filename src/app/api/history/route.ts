/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import {
  getRecentAnalyses,
  type D1Database,
  type StoredAnalysis,
} from '@/lib/d1-database';

// Helper function to get D1 database from Cloudflare Workers environment
function getD1Database(): D1Database | undefined {
  // Method 1: Check global DB binding (most common)
  if (typeof globalThis !== 'undefined' && (globalThis as any).DB) {
    return (globalThis as any).DB as D1Database;
  }

  // Method 2: Check process.env for database binding
  if (typeof process !== 'undefined' && process.env && (process.env as any).DB) {
    return (process.env as any).DB as D1Database;
  }

  // Method 3: Check if running in Cloudflare Workers with different binding name
  const cloudflareEnv = (globalThis as any).env || (globalThis as any).__env;
  if (cloudflareEnv && cloudflareEnv.DB) {
    return cloudflareEnv.DB as D1Database;
  }

  return undefined;
}

/**
 * Transform a StoredAnalysis row into the shape the AnalysisHistoryCards
 * component expects.
 */
function transformAnalysis(row: StoredAnalysis) {
  let parsedData: any = {};
  try {
    parsedData = typeof row.analysis_data === 'string'
      ? JSON.parse(row.analysis_data)
      : row.analysis_data;
  } catch {
    // If parsing fails, fall back to top-level columns
  }

  const regulatoryCompliance = parsedData?.regulatory_compliance ?? {};

  return {
    id: row.id,
    url: row.url,
    hostname: row.hostname,
    domain: row.domain,
    overall_score: row.overall_score,
    privacy_grade: row.privacy_grade,
    risk_level: row.risk_level,
    gdpr_compliance: regulatoryCompliance.gdpr_compliance ?? 'UNKNOWN',
    ccpa_compliance: regulatoryCompliance.ccpa_compliance ?? 'UNKNOWN',
    dpdp_act_compliance: row.dpdp_act_compliance ?? regulatoryCompliance.dpdp_act_compliance ?? null,
    created_at: row.created_at,
    analysis_data: {
      overall_score: row.overall_score,
      privacy_grade: row.privacy_grade,
      risk_level: row.risk_level,
      regulatory_compliance: {
        gdpr_compliance: regulatoryCompliance.gdpr_compliance ?? 'UNKNOWN',
        ccpa_compliance: regulatoryCompliance.ccpa_compliance ?? 'UNKNOWN',
        dpdp_act_compliance: row.dpdp_act_compliance ?? regulatoryCompliance.dpdp_act_compliance ?? null,
      },
    },
  };
}

export async function GET(request: NextRequest) {
  try {
    const db = getD1Database();

    if (!db) {
      // No D1 database available – return empty result gracefully
      return NextResponse.json({
        analyses: [],
        total: 0,
        message: 'Analysis history is unavailable (no database connection)',
      });
    }

    const { searchParams } = new URL(request.url);
    const limit = Math.min(parseInt(searchParams.get('limit') || '24', 10), 100);
    const offset = Math.max(parseInt(searchParams.get('offset') || '0', 10), 0);

    const rows = await getRecentAnalyses(db, limit, offset);

    const analyses = rows.map(transformAnalysis);

    return NextResponse.json({
      analyses,
      total: analyses.length,
    });
  } catch (error) {
    console.error('History API error:', error);
    // Return empty array as fallback so the UI does not break
    return NextResponse.json({
      analyses: [],
      total: 0,
      message: 'Failed to retrieve analysis history',
    });
  }
}
