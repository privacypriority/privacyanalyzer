import { NextRequest, NextResponse } from 'next/server';
import { getAnalysisByDomain, initializeDatabase, isDatabaseConfigured } from '@/lib/db';
import { sanitizeDomain } from '@/lib/input-validation';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * GET /api/analysis/domain/[domain]
 * Returns the most recent stored analysis for a domain from the Postgres cache.
 * Returns 503 when no database is configured.
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ domain: string }> }
) {
  try {
    const { domain: rawDomain } = await params;
    const domain = sanitizeDomain(decodeURIComponent(rawDomain));

    if (!domain) {
      return NextResponse.json({ error: 'Invalid domain' }, { status: 400 });
    }

    if (!isDatabaseConfigured()) {
      return NextResponse.json(
        {
          error: 'Database not available',
          message: 'Stored analyses require a DATABASE_URL (Postgres) connection, which is not configured on this deployment.',
        },
        { status: 503 }
      );
    }

    try {
      await initializeDatabase();
    } catch (initError) {
      console.error('[Analysis/Domain] Database initialization failed:', initError);
    }

    const record = await getAnalysisByDomain(domain);

    if (!record) {
      return NextResponse.json(
        { error: 'No analysis found for this domain' },
        { status: 404 }
      );
    }

    let analysisData: unknown = null;
    try {
      analysisData = JSON.parse(record.analysis_data);
    } catch {
      analysisData = null;
    }

    return NextResponse.json({
      ...record,
      analysis_data: analysisData,
    });
  } catch (error) {
    console.error('[Analysis/Domain] API error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve analysis' },
      { status: 500 }
    );
  }
}
