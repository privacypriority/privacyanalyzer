# PrivacyHub - Vercel to Cloudflare Workers Migration Guide

**Complete step-by-step guide to migrate PrivacyHub from Vercel to Cloudflare Workers using OpenNext.js adapter.**

This guide ensures all business features remain intact and fully functional while leveraging Cloudflare's infrastructure for improved performance and cost optimization.

---

## 📋 Overview

### Existing Cloudflare Infrastructure (Already Configured)

✅ **D1 Database**: `privacyhub` (ID: `b64e7663-7a31-4e38-a210-4c570dabd118`)
- Binding name: `an-db`
- Already created and ready to use

✅ **Environment Variables** (Already configured in Cloudflare Worker):
- `OPENROUTER_API_1` - Primary OpenRouter API key
- `OPENROUTER_API_2` - Secondary OpenRouter API key (fallback)
- `OPENROUTER_API_3` - Tertiary OpenRouter API key (fallback)
- `FIRECRAWL_API_KEY` - Firecrawl web scraping API key

✅ **Custom Domain**: `demo.privacyhub.in` (Already configured)

✅ **Browser Rendering Binding**: `crawl-browser` (For screenshots and web scraping)

### What This Migration Will Achieve

1. **Database Caching**: Enable D1 database for caching analysis results (currently disabled on Vercel)
2. **Cost Optimization**: Reduce OpenRouter and Firecrawl API calls by 90%+ through intelligent caching
3. **Permalink Structure**: Every analysis gets a permanent shareable URL: `/analysis/yyyymmdd/domainname`
4. **Smart Re-analysis**: Only re-analyze if content changed or analysis is older than 30 days
5. **Homepage Analysis Grid**: Display all analyzed results as interactive cards on homepage
6. **Browser Rendering**: Native Cloudflare Browser Rendering API support
7. **Better Performance**: Edge deployment closer to users worldwide
8. **Scalability**: Cloudflare Workers can handle massive scale

---

## Phase 1: Prerequisites & Environment Setup

### 1.1 Install Required Tools

**Wrangler CLI** (Cloudflare's command-line tool):
```bash
npm install -g wrangler@latest
```

**Why**: Wrangler is required for deploying, managing, and testing Cloudflare Workers. Version 3.99.0+ is required for OpenNext.js compatibility.

- [ ] Install Wrangler CLI globally: `npm install -g wrangler@latest` (>= 3.99.0)
- [ ] Verify Wrangler version: `wrangler --version`
- [ ] Login to Cloudflare: `wrangler login` (opens browser for authentication)
- [ ] Verify authentication: `wrangler whoami`
- [ ] Verify Cloudflare account has Workers enabled

### 1.2 Verify Existing Infrastructure

Before starting, verify all existing resources are accessible:

**Check D1 Database**:
```bash
wrangler d1 list
```
- [ ] Run `wrangler d1 list` and verify `privacyhub` database appears
- [ ] Note the database ID matches: `b64e7663-7a31-4e38-a210-4c570dabd118`

**Check Environment Variables**:
```bash
wrangler secret list
```
- [ ] Run `wrangler secret list` and verify these secrets exist:
  - OPENROUTER_API_1
  - OPENROUTER_API_2
  - OPENROUTER_API_3
  - FIRECRAWL_API_KEY
- [ ] If any are missing, they need to be added (see Phase 7)

**Check Custom Domain**:
- [ ] Visit https://demo.privacyhub.in in browser
- [ ] Note the current response (may be error or placeholder)
- [ ] Verify HTTPS certificate is active

### 1.3 Install Project Dependencies

**Install OpenNext.js Cloudflare Adapter**:
```bash
npm install @opennextjs/cloudflare@latest
```

**Why**: This adapter enables Next.js applications to run on Cloudflare Workers runtime (workerd) instead of Node.js.

- [ ] Install OpenNext adapter: `npm install @opennextjs/cloudflare@latest`
- [ ] Verify installation in package.json under dependencies
- [ ] Check version is latest (should be 0.x.x or higher)

---

## Phase 2: Database Setup (D1)

**Note**: The D1 database already exists. This phase verifies the schema and prepares it for use.

### 2.1 Verify Existing D1 Database

The database `privacyhub` (ID: `b64e7663-7a31-4e38-a210-4c570dabd118`) is already created and bound as `an-db`.

**Verify database accessibility**:
```bash
wrangler d1 info privacyhub --database-id=b64e7663-7a31-4e38-a210-4c570dabd118
```

- [ ] Run `wrangler d1 info privacyhub --database-id=b64e7663-7a31-4e38-a210-4c570dabd118`
- [ ] Verify database information displays correctly
- [ ] Note the database size and current state

### 2.2 Verify Database Schema

**Check if tables already exist**:
```bash
wrangler d1 execute privacyhub --database-id=b64e7663-7a31-4e38-a210-4c570dabd118 --command="SELECT name FROM sqlite_master WHERE type='table';" --remote
```

**Why**: The database may already have tables from previous setup attempts. We need to verify the schema is correct.

- [ ] Run the command above to list existing tables
- [ ] Expected tables:
  - `analyses` - Main table storing privacy policy analysis results
  - `analysis_stats` - Aggregate statistics
  - `grade_distribution` - Privacy grade distribution
  - `risk_distribution` - Risk level distribution

### 2.3 Create Fresh Database Schema

**IMPORTANT**: The database might have existing tables or schema from previous attempts. We'll create a fresh schema to ensure compatibility.

#### 2.3.1 Drop Existing Tables (Clean Slate)

**Why**: Old schema might be incompatible or have wrong structure. Starting fresh ensures consistency.

**Drop tables if they exist**:
```bash
wrangler d1 execute privacyhub --database-id=b64e7663-7a31-4e38-a210-4c570dabd118 --command="DROP TABLE IF EXISTS analyses; DROP TABLE IF EXISTS analysis_stats; DROP TABLE IF EXISTS grade_distribution; DROP TABLE IF EXISTS risk_distribution;" --remote
```

**WARNING**: This will delete all existing data in the database. Only do this if:
- You're doing initial setup, OR
- You're okay losing existing data, OR
- You've backed up the data

**Checklist**:
- [ ] **OPTIONAL BUT RECOMMENDED**: Backup existing data first (if any)
  - Run: `wrangler d1 execute privacyhub --database-id=b64e7663-7a31-4e38-a210-4c570dabd118 --command="SELECT * FROM analyses;" --remote > backup.json`
- [ ] Drop all existing tables using the command above
- [ ] Verify tables are dropped: `wrangler d1 execute privacyhub --database-id=b64e7663-7a31-4e38-a210-4c570dabd118 --command="SELECT name FROM sqlite_master WHERE type='table';" --remote`
- [ ] Should return empty result (no tables)

#### 2.3.2 Create Fresh Schema File

**Extract schema from code**:

The complete schema is defined in `src/lib/d1-database.ts` in the `initializeDatabase()` function. We need to extract this to a standalone SQL file for easier management.

Create `schema.sql` in project root with:

```sql
-- Analyses table - stores privacy policy analysis results
CREATE TABLE analyses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    url TEXT NOT NULL,
    domain TEXT NOT NULL,
    hostname TEXT NOT NULL,
    content_hash TEXT NOT NULL,
    overall_score REAL NOT NULL,
    privacy_grade TEXT NOT NULL,
    risk_level TEXT NOT NULL,
    dpdp_act_compliance TEXT,
    analysis_data TEXT NOT NULL,
    homepage_screenshot TEXT,
    scraper_used TEXT,
    content_length INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    last_checked_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(domain, content_hash)
);

CREATE INDEX idx_analyses_domain ON analyses(domain);
CREATE INDEX idx_analyses_created_at ON analyses(created_at DESC);
CREATE INDEX idx_analyses_last_checked ON analyses(last_checked_at DESC);
CREATE INDEX idx_analyses_content_hash ON analyses(content_hash);
CREATE INDEX idx_analyses_domain_checked ON analyses(domain, last_checked_at DESC);

-- Statistics table
CREATE TABLE analysis_stats (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    total_analyses INTEGER DEFAULT 0,
    unique_domains INTEGER DEFAULT 0,
    avg_score REAL DEFAULT 0,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Grade distribution
CREATE TABLE grade_distribution (
    grade TEXT PRIMARY KEY,
    count INTEGER DEFAULT 0
);

-- Risk distribution
CREATE TABLE risk_distribution (
    risk_level TEXT PRIMARY KEY,
    count INTEGER DEFAULT 0
);

-- Initialize stats
INSERT INTO analysis_stats (id, total_analyses, unique_domains, avg_score)
VALUES (1, 0, 0, 0.0);

-- Initialize grade distribution
INSERT INTO grade_distribution (grade, count) VALUES
('A+', 0), ('A', 0), ('A-', 0),
('B+', 0), ('B', 0), ('B-', 0),
('C+', 0), ('C', 0), ('C-', 0),
('D+', 0), ('D', 0), ('D-', 0),
('F', 0);

-- Initialize risk distribution
INSERT INTO risk_distribution (risk_level, count) VALUES
('EXEMPLARY', 0),
('LOW', 0),
('MODERATE', 0),
('MODERATE-HIGH', 0),
('HIGH', 0);
```

**Checklist**:
- [ ] Create file `schema.sql` in project root
- [ ] Copy the SQL above exactly as shown
- [ ] Verify all tables are defined
- [ ] Verify indexes are defined
- [ ] Verify initial data inserts are included
- [ ] Save file

#### 2.3.3 Execute Fresh Schema

**Execute schema on production database**:
```bash
wrangler d1 execute privacyhub --database-id=b64e7663-7a31-4e38-a210-4c570dabd118 --file=./schema.sql --remote
```

**Checklist**:
- [ ] Execute: `wrangler d1 execute privacyhub --database-id=b64e7663-7a31-4e38-a210-4c570dabd118 --file=./schema.sql --remote`
- [ ] Verify no errors in output
- [ ] Confirm all tables and indexes created successfully
- [ ] Should see success message for each CREATE and INSERT statement

### 2.4 Verify Schema Integrity

**Check table structure**:
```bash
# Check analyses table
wrangler d1 execute privacyhub --database-id=b64e7663-7a31-4e38-a210-4c570dabd118 --command="PRAGMA table_info(analyses);" --remote

# Count existing records
wrangler d1 execute privacyhub --database-id=b64e7663-7a31-4e38-a210-4c570dabd118 --command="SELECT COUNT(*) as count FROM analyses;" --remote
```

- [ ] Verify `analyses` table has all required columns:
  - id, url, domain, hostname, content_hash
  - overall_score, privacy_grade, risk_level, dpdp_act_compliance
  - analysis_data, homepage_screenshot, scraper_used, content_length
  - created_at, updated_at, last_checked_at
- [ ] Note the current record count (may be 0 if fresh database)
- [ ] Verify indexes exist on domain, created_at, last_checked_at, content_hash

### 2.5 Setup Local Database for Development (Optional but Recommended)

**Why**: Local database allows testing without hitting production database during development.

```bash
# Create local schema
wrangler d1 execute privacyhub --database-id=b64e7663-7a31-4e38-a210-4c570dabd118 --file=./schema.sql --local

# Verify local database
wrangler d1 execute privacyhub --database-id=b64e7663-7a31-4e38-a210-4c570dabd118 --command="SELECT name FROM sqlite_master WHERE type='table';" --local
```

- [ ] Execute schema on local database: `wrangler d1 execute privacyhub --database-id=b64e7663-7a31-4e38-a210-4c570dabd118 --file=./schema.sql --local`
- [ ] Verify tables created locally
- [ ] Note: Local database is separate from production - data won't sync

---

## Phase 2.6: Permalink Structure & URL Routing

**IMPORTANT**: This section documents the permalink structure for analysis results and smart caching logic.

### 2.6.1 Understanding the Permalink System

**URL Format**: `/analysis/yyyymmdd/domainname`

**Examples**:
- `/analysis/20251020/google.com` - Google analysis from October 20, 2025
- `/analysis/20251015/facebook.com` - Facebook analysis from October 15, 2025
- `/analysis/20251018/twitter.com` - Twitter analysis from October 18, 2025

**Benefits**:
- ✅ **Shareable**: Users can share direct links to analysis results
- ✅ **SEO-friendly**: Each analysis is a unique, indexable page
- ✅ **Historical tracking**: Date in URL shows when analysis was performed
- ✅ **Permanent**: URLs never change, results persist in database

### 2.6.2 Database Schema Enhancement

The existing `analyses` table already supports this structure. Key columns:

```sql
CREATE TABLE analyses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    url TEXT NOT NULL,              -- Original privacy policy URL
    domain TEXT NOT NULL,            -- Extracted domain (e.g., "google.com")
    hostname TEXT NOT NULL,          -- Full hostname (e.g., "www.google.com")
    content_hash TEXT NOT NULL,      -- SHA-256 hash of privacy policy content
    -- ... analysis results ...
    created_at DATETIME,             -- Used for YYYYMMDD in permalink
    last_checked_at DATETIME,        -- Used for 30-day expiry check
    UNIQUE(domain, content_hash)     -- Prevents duplicate analyses
);
```

**Permalink Generation**:
```
Date from created_at: 2025-10-20 → 20251020
Domain: google.com
Permalink: /analysis/20251020/google.com
```

### 2.6.3 Smart Caching & Re-analysis Logic

**When a user analyzes a domain, the system should**:

1. **Check if analysis exists in database for this domain**:
   ```sql
   SELECT * FROM analyses
   WHERE domain = 'example.com'
   ORDER BY last_checked_at DESC
   LIMIT 1
   ```

2. **If analysis exists, check two conditions**:

   **Condition A**: Is analysis older than 30 days?
   ```sql
   SELECT * FROM analyses
   WHERE domain = 'example.com'
   AND last_checked_at > datetime('now', '-30 days')
   ```

   **Condition B**: Has privacy policy content changed?
   - Fetch current privacy policy content
   - Generate SHA-256 hash
   - Compare with `content_hash` in database
   - If hash differs → content changed

3. **Decision tree**:

   ```
   Analysis exists in DB?
   ├── NO → Perform fresh analysis, save to DB, redirect to permalink
   └── YES → Check conditions
       ├── Last check < 30 days ago AND content_hash matches
       │   └── ✅ RETURN cached results (NO API calls)
       │       └── Redirect to existing permalink
       │
       └── Last check > 30 days ago OR content_hash changed
           └── ⚠️ PERFORM fresh analysis, save to DB, create new permalink
               └── Redirect to new permalink
   ```

4. **Cost Savings**:
   - ✅ Cached result: 0 API calls (instant response)
   - ⚠️ Fresh analysis: 1-2 API calls (Firecrawl + OpenRouter)
   - 💰 Potential 90%+ reduction in API costs

### 2.6.4 Implementation Requirements

**File: `src/app/api/analyze/route.ts`**

Current flow needs enhancement:

```typescript
export async function POST(request: Request) {
  const { env } = getCloudflareContext();
  const db = env["an-db"] as D1Database;

  // 1. Extract domain from URL
  const domain = extractDomain(url);

  // 2. Check for existing analysis
  const existingAnalysis = await getLatestAnalysisByDomain(db, domain);

  if (existingAnalysis) {
    // 3. Check if analysis is still valid
    const isRecent = checkIfRecent(existingAnalysis.last_checked_at); // < 30 days

    // 4. Fetch current content and check if changed
    const currentContent = await fetchPrivacyPolicy(url);
    const currentHash = generateContentHash(currentContent);
    const contentChanged = currentHash !== existingAnalysis.content_hash;

    // 5. Return cached if still valid
    if (isRecent && !contentChanged) {
      const permalink = generatePermalink(existingAnalysis);
      return NextResponse.json({
        success: true,
        cached: true,
        permalink: permalink, // e.g., "/analysis/20251020/google.com"
        data: JSON.parse(existingAnalysis.analysis_data)
      });
    }
  }

  // 6. Perform fresh analysis if not cached or outdated
  // ... existing scraping + LLM analysis logic ...

  // 7. Save to database
  const analysisId = await saveAnalysis(db, url, content, analysisData);

  // 8. Generate permalink
  const savedAnalysis = await getAnalysisById(db, analysisId);
  const permalink = generatePermalink(savedAnalysis);

  // 9. Return with permalink
  return NextResponse.json({
    success: true,
    cached: false,
    permalink: permalink,
    data: analysisData
  });
}

// Helper function
function generatePermalink(analysis: StoredAnalysis): string {
  const date = new Date(analysis.created_at);
  const yyyymmdd = date.toISOString().slice(0, 10).replace(/-/g, '');
  return `/analysis/${yyyymmdd}/${analysis.domain}`;
}
```

**Checklist**:
- [ ] Understand the permalink URL structure
- [ ] Review database schema (already supports permalinks)
- [ ] Plan smart caching implementation in analyze route
- [ ] Plan permalink generation logic
- [ ] Verify content hash comparison logic exists

---

## Phase 2.7: Homepage Analysis Grid Feature

**IMPORTANT**: Display all analyzed results as an interactive grid of cards on homepage.

### 2.7.1 Design Reference

**Screenshot**: `/Users/alokemajumder/Desktop/Screenshot 2025-10-16 at 16.24.26.png`

**Card Content** (from screenshot):
- **Domain name**: e.g., "imagekit.io" (clickable link)
- **Overall Score**: Large circular indicator (7.0 / 10)
- **Privacy Grade**: Large letter grade (A, B, C, etc.)
- **Risk Level**: Colored badge (EXEMPLARY, LOW, MODERATE, HIGH)
- **Category Scores**: Mini progress bars showing:
  - Data Collection
  - Data Sharing
  - User Rights
  - Security
  - Compliance
  - Transparency

### 2.7.2 Homepage Layout

**Location**: First fold after hero section

**Layout**:
```
┌─────────────────────────────────────────────────────────────┐
│                     HOMEPAGE                                 │
├─────────────────────────────────────────────────────────────┤
│  Hero Section                                                │
│  - Main headline                                             │
│  - Analysis input form                                       │
│  - CTA button                                                │
├─────────────────────────────────────────────────────────────┤
│  Recent Privacy Analysis Results                             │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐        │
│  │ Card 1  │  │ Card 2  │  │ Card 3  │  │ Card 4  │        │
│  │ Score:8 │  │ Score:7 │  │ Score:6 │  │ Score:5 │        │
│  │ Grade:A │  │ Grade:B │  │ Grade:C │  │ Grade:D │        │
│  │ RISK:LOW│  │ RISK:MOD│  │ RISK:MOD│  │ RISK:HI │        │
│  └─────────┘  └─────────┘  └─────────┘  └─────────┘        │
│                                                               │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐        │
│  │ Card 5  │  │ Card 6  │  │ Card 7  │  │ Card 8  │        │
│  └─────────┘  └─────────┘  └─────────┘  └─────────┘        │
│                                                               │
│  [View All Analyses →]                                       │
└─────────────────────────────────────────────────────────────┘
```

**Grid Properties**:
- **Columns**: 4 cards per row on desktop, 2 on tablet, 1 on mobile
- **Initial display**: Show 8 most recent analyses
- **Sorting**: Order by `created_at DESC` (newest first)
- **Lazy loading**: Load more on scroll (infinite scroll) OR "Load More" button
- **Click behavior**: Navigate to permalink `/analysis/yyyymmdd/domainname`

### 2.7.3 Card Component Design

**Visual Design** (based on screenshot):

```tsx
// Card Structure
<Card onClick={() => navigate(`/analysis/${yyyymmdd}/${domain}`)}>
  <CardHeader>
    <DomainName>{domain}</DomainName>
    <AnalysisDate>{formattedDate}</AnalysisDate>
  </CardHeader>

  <CardBody>
    <LeftSection>
      <CircularScore value={7.0} max={10} />
      <ScoreLabel>Overall Score</ScoreLabel>
    </LeftSection>

    <MiddleSection>
      <SectionTitle>Category Scores</SectionTitle>
      <CategoryBar label="Data Collection" value={8.0} color="green" />
      <CategoryBar label="Data Sharing" value={7.0} color="blue" />
      <CategoryBar label="User Rights" value={8.0} color="green" />
      <CategoryBar label="Security" value={8.0} color="green" />
      <CategoryBar label="Compliance" value={6.0} color="blue" />
      <CategoryBar label="Transparency" value={7.0} color="blue" />
    </MiddleSection>

    <RightSection>
      <GradeLetter>{grade}</GradeLetter>
      <GradeLabel>Privacy Grade</GradeLabel>
      <RiskBadge level={riskLevel}>{riskLevel}</RiskBadge>
    </RightSection>
  </CardBody>
</Card>
```

**Color Scheme**:
- **Score >= 8.0**: Green (#10b981)
- **Score 6.0-7.9**: Blue (#3b82f6)
- **Score 4.0-5.9**: Yellow (#f59e0b)
- **Score < 4.0**: Red (#ef4444)

**Risk Badge Colors**:
- **EXEMPLARY**: Green (#10b981)
- **LOW**: Blue (#3b82f6)
- **MODERATE**: Yellow (#f59e0b)
- **MODERATE-HIGH**: Orange (#f97316)
- **HIGH**: Red (#ef4444)

### 2.7.4 API Endpoint for Grid Data

**New endpoint**: `GET /api/analyses/recent`

**Purpose**: Fetch recent analyses for homepage grid

**Response format**:
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "domain": "google.com",
      "permalink": "/analysis/20251020/google.com",
      "overall_score": 7.0,
      "privacy_grade": "B",
      "risk_level": "MODERATE",
      "category_scores": {
        "data_collection": 8.0,
        "data_sharing": 7.0,
        "user_rights": 8.0,
        "security": 8.0,
        "compliance": 6.0,
        "transparency": 7.0
      },
      "created_at": "2025-10-20T10:30:00Z",
      "homepage_screenshot": "data:image/png;base64,..."
    }
  ],
  "total": 42,
  "page": 1,
  "limit": 8
}
```

**Implementation**:

Create `src/app/api/analyses/recent/route.ts`:

```typescript
import { NextResponse } from 'next/server';
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { getRecentAnalyses, D1Database } from '@/lib/d1-database';

export async function GET(request: Request) {
  try {
    const { env } = getCloudflareContext();
    const db = env["an-db"] as D1Database;

    if (!db) {
      return NextResponse.json(
        { error: 'Database not available' },
        { status: 503 }
      );
    }

    // Get query params for pagination
    const url = new URL(request.url);
    const limit = parseInt(url.searchParams.get('limit') || '8');
    const offset = parseInt(url.searchParams.get('offset') || '0');

    // Fetch recent analyses
    const analyses = await getRecentAnalyses(db, limit, offset);

    // Transform data for frontend
    const transformedData = analyses.map(analysis => {
      const analysisData = JSON.parse(analysis.analysis_data);
      const date = new Date(analysis.created_at);
      const yyyymmdd = date.toISOString().slice(0, 10).replace(/-/g, '');

      return {
        id: analysis.id,
        domain: analysis.domain,
        permalink: `/analysis/${yyyymmdd}/${analysis.domain}`,
        overall_score: analysis.overall_score,
        privacy_grade: analysis.privacy_grade,
        risk_level: analysis.risk_level,
        category_scores: analysisData.categories,
        created_at: analysis.created_at,
        homepage_screenshot: analysis.homepage_screenshot
      };
    });

    return NextResponse.json({
      success: true,
      data: transformedData,
      total: transformedData.length,
      limit: limit,
      offset: offset
    });

  } catch (error) {
    console.error('Error fetching recent analyses:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

**Checklist**:
- [ ] Understand homepage grid layout requirements
- [ ] Review card design from screenshot reference
- [ ] Plan API endpoint for fetching recent analyses
- [ ] Plan card component structure
- [ ] Plan responsive grid layout (4/2/1 columns)

---

## Phase 2.8: Permalink Page Implementation

**IMPORTANT**: Create dynamic route for analysis permalink pages.

### 2.8.1 Dynamic Route Structure

**File to create**: `src/app/analysis/[date]/[domain]/page.tsx`

**Why**: Next.js dynamic routes automatically handle `/analysis/yyyymmdd/domainname` URLs

**URL Examples**:
- `/analysis/20251020/google.com` → `[date]='20251020'`, `[domain]='google.com'`
- `/analysis/20251015/facebook.com` → `[date]='20251015'`, `[domain]='facebook.com'`

### 2.8.2 Page Implementation

**Structure**:
```typescript
// src/app/analysis/[date]/[domain]/page.tsx

import { notFound } from 'next/navigation';
import AnalysisResultsPage from '@/components/AnalysisResultsPage';

export default async function PermalinkPage({
  params
}: {
  params: Promise<{ date: string; domain: string }>
}) {
  const { date, domain } = await params;

  // Validate date format (YYYYMMDD)
  if (!/^\d{8}$/.test(date)) {
    notFound();
  }

  // Fetch analysis from database
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/analyses/permalink?date=${date}&domain=${domain}`,
    { cache: 'force-cache' } // Cache permalink pages
  );

  if (!response.ok) {
    notFound();
  }

  const { data } = await response.json();

  // Render the full analysis results page
  return <AnalysisResultsPage analysis={data} />;
}

// Generate metadata for SEO
export async function generateMetadata({
  params
}: {
  params: Promise<{ date: string; domain: string }>
}) {
  const { date, domain } = await params;

  return {
    title: `Privacy Analysis: ${domain} - PrivacyHub`,
    description: `Comprehensive privacy policy analysis for ${domain}`,
    openGraph: {
      title: `Privacy Analysis: ${domain}`,
      description: `View detailed privacy analysis results`,
      type: 'website'
    }
  };
}
```

### 2.8.3 API Endpoint for Permalink Data

**File to create**: `src/app/api/analyses/permalink/route.ts`

**Purpose**: Fetch specific analysis by date + domain

```typescript
import { NextResponse } from 'next/server';
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { D1Database } from '@/lib/d1-database';

export async function GET(request: Request) {
  try {
    const { env } = getCloudflareContext();
    const db = env["an-db"] as D1Database;

    if (!db) {
      return NextResponse.json(
        { error: 'Database not available' },
        { status: 503 }
      );
    }

    const url = new URL(request.url);
    const date = url.searchParams.get('date'); // YYYYMMDD
    const domain = url.searchParams.get('domain');

    if (!date || !domain) {
      return NextResponse.json(
        { error: 'Missing date or domain parameter' },
        { status: 400 }
      );
    }

    // Convert YYYYMMDD to YYYY-MM-DD for SQL query
    const dateFormatted = `${date.slice(0,4)}-${date.slice(4,6)}-${date.slice(6,8)}`;

    // Query database for specific analysis
    const stmt = db.prepare(`
      SELECT * FROM analyses
      WHERE domain = ?
      AND DATE(created_at) = DATE(?)
      ORDER BY created_at DESC
      LIMIT 1
    `).bind(domain, dateFormatted);

    const analysis = await stmt.first<StoredAnalysis>();

    if (!analysis) {
      return NextResponse.json(
        { error: 'Analysis not found' },
        { status: 404 }
      );
    }

    // Parse and return full analysis data
    const analysisData = JSON.parse(analysis.analysis_data);

    return NextResponse.json({
      success: true,
      data: {
        ...analysis,
        analysis_data: analysisData
      }
    });

  } catch (error) {
    console.error('Error fetching permalink analysis:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

**Checklist**:
- [ ] Understand dynamic route structure in Next.js
- [ ] Plan permalink page layout (reuse existing results page)
- [ ] Plan API endpoint for permalink data fetch
- [ ] Plan SEO metadata for permalink pages
- [ ] Consider 404 handling for non-existent permalinks

---

## Phase 3: Configuration Files

### 3.1 Create wrangler.jsonc

**Why**: This file configures the Cloudflare Worker, including bindings to D1 database, Browser Rendering, and other resources.

Create `wrangler.jsonc` in project root with the following content:

```jsonc
{
  "name": "privacyhub",
  "compatibility_date": "2024-09-23",
  "compatibility_flags": ["nodejs_compat"],
  "main": ".open-next/worker.js",

  // D1 Database binding (IMPORTANT: Use exact binding name "an-db")
  "d1_databases": [
    {
      "binding": "an-db",
      "database_name": "privacyhub",
      "database_id": "b64e7663-7a31-4e38-a210-4c570dabd118"
    }
  ],

  // Browser Rendering API binding
  // Note: User mentioned "crawl-browser" binding exists
  // You can only have ONE browser binding per Worker
  // Use the binding name that matches your Cloudflare Dashboard configuration
  "browser": {
    "binding": "crawl-browser"
  },

  // Environment variables (non-secret)
  "vars": {
    "NODE_ENV": "production"
  }
}
```

**Important Notes**:
- Binding name MUST be `"an-db"` (not "DB") - this matches existing code
- Database ID is the actual production database
- `compatibility_date` must be >= 2024-09-23 for Next.js support
- `nodejs_compat` flag is required for Node.js APIs
- **Browser binding**: Using `"crawl-browser"` as specified by user
  - Cloudflare Workers only support ONE browser binding per Worker
  - If your dashboard shows "crawl-browser", use that name
  - Access in code via: `env["crawl-browser"]` (note: hyphen requires bracket notation)
- Secrets (API keys) are NOT added here - they're managed separately

**Checklist**:
- [ ] Create `wrangler.jsonc` in project root
- [ ] Copy the exact configuration above
- [ ] Verify binding name is `"an-db"`
- [ ] Verify database_id matches: `b64e7663-7a31-4e38-a210-4c570dabd118`
- [ ] Verify browser binding name matches your Cloudflare Dashboard (should be `"crawl-browser"`)
- [ ] Verify compatibility_date is "2024-09-23" or later
- [ ] Save file

### 3.2 Create .dev.vars (Local Development)

**Why**: This file contains API keys for local development. Production uses Cloudflare secrets (already configured).

Create `.dev.vars` in project root:

```bash
# OpenRouter API Keys (for round-robin rotation)
OPENROUTER_API_1=your_openrouter_key_1_here
OPENROUTER_API_2=your_openrouter_key_2_here
OPENROUTER_API_3=your_openrouter_key_3_here

# Firecrawl API Key
FIRECRAWL_API_KEY=your_firecrawl_key_here
```

**How to get the keys**:
- These keys are already configured in production Cloudflare Worker
- You can use the same keys for local development
- If you don't have access to the keys, ask the project owner
- For testing, you can temporarily use free trial keys from:
  - OpenRouter: https://openrouter.ai/
  - Firecrawl: https://firecrawl.dev/

**Checklist**:
- [ ] Create `.dev.vars` in project root
- [ ] Add all 4 API keys with actual values (replace placeholders)
- [ ] Verify `.dev.vars` is in `.gitignore` (CRITICAL - prevents secret leaks)
- [ ] Test keys work by running `npm run dev` later

**Security Warning**: NEVER commit `.dev.vars` to git. This file contains secrets.

### 3.3 Create open-next.config.ts (Optional but Recommended)

**Why**: This file configures OpenNext.js behavior. The default wrapper works fine, but explicit configuration is better for maintainability.

Create `open-next.config.ts` in project root:

```typescript
import type { OpenNextConfig } from '@opennextjs/cloudflare';

const config: OpenNextConfig = {
  default: {
    override: {
      wrapper: 'cloudflare-node',
    },
  },
};

export default config;
```

**What this does**:
- Uses `cloudflare-node` wrapper for better Node.js compatibility
- Ensures consistent behavior across deployments
- Makes configuration explicit and maintainable

**Checklist**:
- [ ] Create `open-next.config.ts` in project root
- [ ] Copy the configuration above
- [ ] Save file
- [ ] This file SHOULD be committed to git

### 3.4 Update .gitignore

**Critical**: Ensure sensitive files are never committed to git.

Add these lines to `.gitignore`:

```
# Cloudflare Workers
.dev.vars
.wrangler/
.open-next/

# Local database
.mf/
```

**Why**:
- `.dev.vars` - Contains API keys (MUST NOT be committed)
- `.wrangler/` - Wrangler build cache (not needed in repo)
- `.open-next/` - OpenNext build output (not needed in repo)
- `.mf/` - Miniflare local storage (not needed in repo)

**Checklist**:
- [ ] Open `.gitignore` file
- [ ] Add the lines above (if not already present)
- [ ] Verify `.dev.vars` is listed
- [ ] Verify `wrangler.jsonc` is NOT in `.gitignore` (it should be committed)
- [ ] Save file
- [ ] Run `git status` and verify `.dev.vars` is not listed as untracked

---

## Phase 4: Code Modifications

**This is the core migration phase where we update the code to use Cloudflare bindings instead of Vercel environment.**

### 4.1 Update next.config.ts

**Why**: Initialize Cloudflare dev bindings for local development.

**Changes needed**:

Add this at the top of `next.config.ts`:

```typescript
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

// Initialize Cloudflare dev bindings for local development
if (process.env.NODE_ENV !== 'production') {
  initOpenNextCloudflareForDev();
}
```

**Full example** (your file will have more config):
```typescript
import type { NextConfig } from "next";
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

// Initialize Cloudflare dev bindings for local development
if (process.env.NODE_ENV !== 'production') {
  initOpenNextCloudflareForDev();
}

const nextConfig: NextConfig = {
  // ... your existing config
};

export default nextConfig;
```

**Checklist**:
- [ ] Open `next.config.ts`
- [ ] Import `initOpenNextCloudflareForDev` from "@opennextjs/cloudflare"
- [ ] Add conditional call before config export
- [ ] Ensure existing config remains unchanged
- [ ] Save file

### 4.2 Update src/app/api/analyze/route.ts (Main Analysis Endpoint)

**Why**: This is the core API that needs database caching and Cloudflare bindings.

**Key changes**:
1. Replace `process.env` with Cloudflare `env` object
2. Enable D1 database (currently `undefined`)
3. Pass `env` to helper functions

**Changes to make**:

```typescript
// ADD this import at the top
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { D1Database, initializeDatabase, getCachedAnalysis, saveAnalysis, generateContentHash, extractDomain } from '@/lib/d1-database';

// INSIDE the POST function, at the very top:
export async function POST(request: Request) {
  try {
    // Get Cloudflare context (env, ctx, cf)
    const { env } = getCloudflareContext();

    // Access D1 database (IMPORTANT: Use "an-db" binding name)
    const db = env["an-db"] as D1Database;

    // Initialize database schema (idempotent - safe to call every time)
    if (db) {
      await initializeDatabase(db);
    }

    // Get API keys from env instead of process.env
    const FIRECRAWL_API_KEY = env.FIRECRAWL_API_KEY;

    // ... rest of your code
```

**IMPORTANT**: Notice we use `env["an-db"]` (with brackets and quotes) because the binding name contains a hyphen.

**Detailed checklist**:
- [ ] Open `src/app/api/analyze/route.ts`
- [ ] Add import: `import { getCloudflareContext } from "@opennextjs/cloudflare"`
- [ ] Add import for D1 types and functions if not already present
- [ ] REMOVE: `export const maxDuration = 60;` (not needed for Workers)
- [ ] At top of POST function, add: `const { env } = getCloudflareContext();`
- [ ] Change: `const db = undefined` → `const db = env["an-db"] as D1Database;`
- [ ] Add database initialization: `if (db) { await initializeDatabase(db); }`
- [ ] Change: `process.env.FIRECRAWL_API_KEY` → `env.FIRECRAWL_API_KEY`
- [ ] Update `getOpenAIClient()` call to pass `env`: `const openaiResult = await getOpenAIClient(env);`
- [ ] Add browser binding access:
  - `const browser = env["crawl-browser"];` (for screenshots and crawling)
  - Note: Use bracket notation because binding name has hyphen
- [ ] Implement scraping logic: Use Firecrawl first, fallback to browser binding if needed
- [ ] Save file

### 4.3 Update src/app/api/analysis/domain/[domain]/route.ts

**Why**: Enable database lookup by domain (currently returns 503 error).

**Current code** (disabled):
```typescript
export async function GET() {
  return NextResponse.json(
    {
      error: 'Database caching not available',
      message: 'This endpoint requires Cloudflare D1 database which is not available on Vercel deployment'
    },
    { status: 503 }
  );
}
```

**New code** (enabled with D1):
```typescript
import { NextResponse } from 'next/server';
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { getAnalysisByDomain, D1Database } from '@/lib/d1-database';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ domain: string }> }
) {
  try {
    const { domain } = await params;
    const { env } = getCloudflareContext();
    const db = env["an-db"] as D1Database;

    if (!db) {
      return NextResponse.json(
        { error: 'Database not available' },
        { status: 503 }
      );
    }

    const analysis = await getAnalysisByDomain(db, domain);

    if (!analysis) {
      return NextResponse.json(
        { error: 'Analysis not found for this domain' },
        { status: 404 }
      );
    }

    // Parse analysis_data from JSON string
    const analysisData = JSON.parse(analysis.analysis_data);

    return NextResponse.json({
      success: true,
      data: {
        ...analysis,
        analysis_data: analysisData,
      },
    });
  } catch (error) {
    console.error('Error fetching analysis by domain:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

**Checklist**:
- [ ] Open `src/app/api/analysis/domain/[domain]/route.ts`
- [ ] Replace entire file content with code above
- [ ] Verify import paths are correct
- [ ] Verify binding name is `env["an-db"]`
- [ ] Save file

### 4.4 Update src/lib/openai-client.ts

**Why**: API key rotation needs to access Cloudflare env instead of process.env.

**Changes needed**:

```typescript
// Change function signature to accept env
export async function getOpenAIClient(env: any) {
  // Get API keys from env instead of process.env
  const keys = [
    env.OPENROUTER_API_1,
    env.OPENROUTER_API_2,
    env.OPENROUTER_API_3,
  ].filter(Boolean);

  // ... rest of your rotation logic

  // Add HTTP-Referer header for OpenRouter tracking
  const client = new OpenAI({
    apiKey: selectedKey,
    baseURL: 'https://openrouter.ai/api/v1',
    defaultHeaders: {
      'HTTP-Referer': 'https://privacyhub.in',
      'X-Title': 'PrivacyHub',
    },
  });

  return { client, keyIndex };
}
```

**Checklist**:
- [ ] Open `src/lib/openai-client.ts`
- [ ] Add `env` parameter to `getOpenAIClient(env: any)` function
- [ ] Change all `process.env.OPENROUTER_API_X` to `env.OPENROUTER_API_X`
- [ ] Add HTTP-Referer header: `'HTTP-Referer': 'https://privacyhub.in'`
- [ ] Add X-Title header: `'X-Title': 'PrivacyHub'`
- [ ] Update all call sites to pass `env` parameter
- [ ] Save file

### 4.5 Generate TypeScript Types

**Why**: Get proper TypeScript types for Cloudflare bindings.

```bash
wrangler types --env-interface CloudflareEnv
```

**What this does**:
- Reads your `wrangler.jsonc` configuration
- Generates TypeScript types for all bindings
- Creates `worker-configuration.d.ts` file
- Provides autocomplete for `env.` properties

**Checklist**:
- [ ] Run: `wrangler types --env-interface CloudflareEnv`
- [ ] Verify `worker-configuration.d.ts` is created
- [ ] Open the file and verify types include:
  - `"an-db": D1Database`
  - `"crawl-browser": Fetcher` (browser rendering for crawling/screenshots)
  - `OPENROUTER_API_1: string`
  - `OPENROUTER_API_2: string`
  - `OPENROUTER_API_3: string`
  - `FIRECRAWL_API_KEY: string`
- [ ] This file should be committed to git
- [ ] Re-run this command after any wrangler.jsonc changes
- [ ] Note: Both `"an-db"` and `"crawl-browser"` require bracket notation in code due to hyphens

### 4.6 Update package.json Scripts

**Why**: Add scripts for Workers development and deployment.

**Update scripts section**:
```json
{
  "scripts": {
    "dev": "next dev --turbopack",
    "build": "next build",
    "start": "next start",
    "lint": "eslint",
    "typecheck": "tsc --noEmit",
    "preview": "opennextjs-cloudflare build && opennextjs-cloudflare preview",
    "deploy": "opennextjs-cloudflare build && opennextjs-cloudflare deploy"
  }
}
```

**What each script does**:
- `dev` - Next.js dev server with simulated Cloudflare bindings
- `build` - Standard Next.js build (for Vercel compatibility)
- `preview` - Build and run in local Workers runtime
- `deploy` - Build and deploy to Cloudflare Workers production

**Checklist**:
- [ ] Open `package.json`
- [ ] Update "build" to: `"next build"` (remove --turbopack for production)
- [ ] Add "preview": `"opennextjs-cloudflare build && opennextjs-cloudflare preview"`
- [ ] Add "deploy": `"opennextjs-cloudflare build && opennextjs-cloudflare deploy"`
- [ ] Keep existing "dev", "start", "lint", "typecheck" scripts
- [ ] Save file

---

## Phase 5: Testing - Local Development

### 5.1 Test Next.js Dev Server
- [ ] Run: `npm run dev`
- [ ] Verify application loads at http://localhost:3000
- [ ] Check console for errors
- [ ] Verify bindings are simulated (check logs)
- [ ] Test privacy policy analysis with a sample URL
- [ ] Verify analysis completes without errors
- [ ] Check if database operations work (simulated)

### 5.2 Test TypeScript Compilation
- [ ] Run: `npm run typecheck`
- [ ] Fix any TypeScript errors
- [ ] Verify no errors in API routes
- [ ] Verify CloudflareEnv types are recognized

### 5.3 Test Build Process
- [ ] Run: `npm run build`
- [ ] Verify Next.js build completes successfully
- [ ] Check for any build warnings
- [ ] Verify output directory structure

---

## Phase 6: Testing - Workers Preview (Local Runtime)

### 6.1 Build and Preview
- [ ] Run: `npm run preview`
- [ ] Wait for build to complete
- [ ] Verify Workers runtime starts
- [ ] Note the local preview URL (usually http://localhost:8788)
- [ ] Open preview URL in browser

### 6.2 Test Application Features
- [ ] Test homepage loads correctly
- [ ] Test privacy policy analysis with test URL
- [ ] Verify scraping works (Firecrawl or Crawlee fallback)
- [ ] Verify OpenRouter LLM analysis completes
- [ ] Check if screenshot generation works
- [ ] Verify analysis results display correctly
- [ ] Test database caching:
  - Analyze same URL twice
  - Verify second request uses cache
  - Check console logs for "Using cached analysis"

### 6.3 Test Database Operations
- [ ] Verify analysis is saved to D1 database
- [ ] Check database: `wrangler d1 execute privacyhub-db --command="SELECT COUNT(*) FROM analyses;" --local`
- [ ] Test domain-based retrieval endpoint
- [ ] Verify 30-day expiry logic
- [ ] Test content hash change detection

### 6.4 Test API Key Rotation
- [ ] Verify round-robin rotation works across requests
- [ ] Check logs for key rotation messages
- [ ] Test fallback when one key hits rate limit

---

## Phase 7: Production Secrets Verification

**Note**: Secrets are already configured in Cloudflare Workers. This phase verifies they exist and are accessible.

### 7.1 Verify Existing Production Secrets

**Why**: Confirm all required API keys are configured in production.

```bash
wrangler secret list
```

**Expected output**:
```
OPENROUTER_API_1
OPENROUTER_API_2
OPENROUTER_API_3
FIRECRAWL_API_KEY
```

**Checklist**:
- [ ] Run: `wrangler secret list`
- [ ] Verify all 4 secrets appear in the list
- [ ] Secrets should show as encrypted (you won't see the actual values)
- [ ] If any are missing, proceed to 7.2

### 7.2 Add Missing Secrets (If Any)

**Only if secrets are missing from the list above**:

```bash
# Add each missing secret
wrangler secret put OPENROUTER_API_1
wrangler secret put OPENROUTER_API_2
wrangler secret put OPENROUTER_API_3
wrangler secret put FIRECRAWL_API_KEY
```

**What happens**:
- Wrangler will prompt you to enter the secret value
- Type or paste the API key
- Press Enter
- Secret is encrypted and stored

**Alternative - Cloudflare Dashboard**:
- [ ] Navigate to: Cloudflare Dashboard → Workers & Pages → privacyhub
- [ ] Click "Settings" tab
- [ ] Click "Variables and Secrets"
- [ ] Click "Add variable" → Select "Encrypt"
- [ ] Enter variable name (e.g., OPENROUTER_API_1)
- [ ] Enter value (the API key)
- [ ] Click "Save"
- [ ] Repeat for all missing secrets

**Checklist**:
- [ ] If any secrets were missing, add them using one of the methods above
- [ ] Re-run `wrangler secret list` to verify all are present
- [ ] Proceed to deployment phase

---

## Phase 8: Production Deployment

### 8.1 Deploy to Cloudflare Workers
- [ ] Run: `npm run deploy`
- [ ] Verify build completes without errors
- [ ] Verify deployment succeeds
- [ ] Note the deployed Workers URL (e.g., privacyhub.workers.dev)
- [ ] Save deployment URL

### 8.2 Verify Production Deployment
- [ ] Open Workers URL in browser
- [ ] Test homepage loads
- [ ] Test privacy policy analysis (use different test URLs)
- [ ] Verify analysis completes end-to-end
- [ ] Check if results are saved to production D1 database
- [ ] Test cached analysis retrieval
- [ ] Verify screenshot generation works

### 8.3 Check Production Database
- [ ] Query database: `wrangler d1 execute privacyhub-db --command="SELECT COUNT(*) FROM analyses;" --remote`
- [ ] Verify data is being saved
- [ ] Check statistics tables

---

## Phase 9: Custom Domain Verification

**Note**: Custom domain `demo.privacyhub.in` is already configured. This phase verifies it's working correctly.

### 9.1 Verify Custom Route Configuration

**Why**: Confirm the route is properly configured to point to your Worker.

**Check via Dashboard**:
- [ ] Go to: Cloudflare Dashboard → Workers & Pages → privacyhub
- [ ] Click "Triggers" tab
- [ ] Verify route exists: `demo.privacyhub.in/*` or `*demo.privacyhub.in/*`
- [ ] Verify zone is set to: `privacyhub.in`
- [ ] If route is missing, add it:
  - Click "Add Route"
  - Route: `demo.privacyhub.in/*`
  - Zone: Select `privacyhub.in`
  - Click "Add Route"

### 9.2 Verify DNS Configuration

**Why**: Ensure DNS is pointing to Cloudflare Workers.

**Check DNS records**:
- [ ] Go to: Cloudflare Dashboard → DNS → Records
- [ ] Look for `demo.privacyhub.in` record
- [ ] Should be one of these types:
  - **AAAA** record with value `100::` (proxied - orange cloud)
  - **CNAME** record pointing to `privacyhub.in` (proxied)
- [ ] Verify "Proxy status" is "Proxied" (orange cloud icon)
- [ ] If DNS record is missing:
  - Click "Add Record"
  - Type: AAAA
  - Name: demo
  - IPv6 address: 100::
  - Proxy status: Proxied (orange cloud)
  - Click "Save"

### 9.3 Test Custom Domain After Deployment

**IMPORTANT**: Test this AFTER deploying your Worker (Phase 8).

**Initial test** (before deployment):
- [ ] Visit: https://demo.privacyhub.in
- [ ] Note current behavior (may show error or old content)
- [ ] This is expected before deployment

**After deployment** (Phase 8 complete):
- [ ] Wait 30-60 seconds for Workers deployment to propagate
- [ ] Visit: https://demo.privacyhub.in
- [ ] Verify site loads correctly (homepage should display)
- [ ] Check HTTPS certificate is valid (padlock icon in browser)
- [ ] Test privacy policy analysis with a sample URL
- [ ] Verify analysis completes successfully
- [ ] Check if results are saved to database
- [ ] Verify cached results work on second analysis of same URL
- [ ] Test different pages (/, /privacy, etc.)

**If domain doesn't work**:
- [ ] Check Worker deployment status: `wrangler deployments list`
- [ ] Check route configuration (Step 9.1)
- [ ] Check DNS configuration (Step 9.2)
- [ ] Try accessing via Workers URL first: `privacyhub.workers.dev`
- [ ] Check Cloudflare Workers logs: `wrangler tail`
- [ ] Wait 5 minutes and try again (DNS/CDN propagation)

---

## Phase 10: Monitoring & Optimization

### 10.1 Setup Monitoring
- [ ] Go to Workers & Pages → privacyhub → Metrics
- [ ] Monitor requests, errors, and CPU time
- [ ] Check error rate
- [ ] Monitor D1 database queries

### 10.2 View Logs (Real-time)
- [ ] Run: `wrangler tail`
- [ ] Make test requests
- [ ] Watch logs for errors or issues
- [ ] Verify console.log statements appear

### 10.3 Performance Checks
- [ ] Test response times for analysis
- [ ] Verify caching reduces response time on repeat requests
- [ ] Check if Browser Rendering is faster than Vercel
- [ ] Monitor OpenRouter API usage

### 10.4 Cost Optimization Verification
- [ ] Verify cached requests don't call OpenRouter
- [ ] Verify cached requests don't call Firecrawl
- [ ] Check D1 database reads vs writes
- [ ] Monitor Browser Rendering usage

---

## Phase 11: Final Verification & Testing

### 11.1 Complete Feature Checklist
- [ ] Privacy policy analysis works end-to-end
- [ ] Web scraping works (Firecrawl + Crawlee fallback)
- [ ] OpenRouter LLM analysis returns accurate results
- [ ] Privacy grade calculation is correct
- [ ] Risk level assessment works
- [ ] DPDP Act compliance detection works
- [ ] Screenshot generation via Browser Rendering works
- [ ] Screenshots are saved and displayed
- [ ] Analysis results have unique URLs
- [ ] Database caching works (content hash-based)
- [ ] 30-day expiry logic works
- [ ] Content change detection works
- [ ] API key rotation works (3 keys)
- [ ] Rate limiting protection works
- [ ] Error handling works gracefully
- [ ] User-friendly error messages display

### 11.2 Edge Cases Testing
- [ ] Test with invalid URL
- [ ] Test with URL that has no privacy policy
- [ ] Test with very long privacy policy
- [ ] Test with same URL analyzed multiple times
- [ ] Test with URL whose content changed
- [ ] Test with all API keys rate-limited (should show proper error)
- [ ] Test with network timeout scenarios

### 11.3 Browser Testing
- [ ] Test on Chrome
- [ ] Test on Firefox
- [ ] Test on Safari
- [ ] Test on mobile browsers
- [ ] Test responsive design

---

## Phase 12: Documentation & Cleanup

### 12.1 Update Documentation
- [ ] Update README.md with Cloudflare deployment instructions
- [ ] Document environment variables required
- [ ] Document wrangler.jsonc configuration
- [ ] Add troubleshooting section
- [ ] Document D1 database schema

### 12.2 Code Cleanup
- [ ] Remove any debugging console.logs
- [ ] Remove commented-out code
- [ ] Ensure consistent code formatting
- [ ] Verify no hardcoded secrets

### 12.3 Git Hygiene
- [ ] Verify .dev.vars is not committed
- [ ] Verify wrangler.jsonc is committed (without secrets)
- [ ] Review all changes in worker branch
- [ ] Ensure no sensitive data in commits

---

## Phase 13: Deployment Strategy

### 13.1 Gradual Rollout Option
- [ ] Consider keeping Vercel deployment running
- [ ] Use Cloudflare Workers as demo.privacyhub.in
- [ ] Use Vercel as www.privacyhub.in or privacyhub.in
- [ ] Test both in parallel
- [ ] Monitor Cloudflare performance for 24-48 hours
- [ ] Decide on full migration vs dual deployment

### 13.2 Full Migration (If Chosen)
- [ ] Update main domain DNS to point to Workers
- [ ] Remove Vercel deployment (optional)
- [ ] Archive Vercel project
- [ ] Cancel Vercel subscription (if no longer needed)

---

## Phase 14: Post-Deployment

### 14.1 Monitor for 48 Hours
- [ ] Check error rates every 6 hours
- [ ] Monitor response times
- [ ] Check D1 database growth
- [ ] Monitor API costs (OpenRouter, Firecrawl)
- [ ] Collect user feedback (if any issues)

### 14.2 Performance Optimization (If Needed)
- [ ] Analyze slow endpoints
- [ ] Optimize database queries
- [ ] Add additional caching if needed
- [ ] Consider using KV for frequently accessed data

### 14.3 Backup Strategy
- [ ] Document D1 database backup process
- [ ] Consider exporting D1 data periodically
- [ ] Test database restore procedure

---

## Rollback Plan (If Issues Occur)

### Emergency Rollback to Vercel
- [ ] Switch DNS back to Vercel (if main domain affected)
- [ ] Revert worker branch changes
- [ ] Switch to main branch: `git checkout main`
- [ ] Verify Vercel deployment still works
- [ ] Investigate Cloudflare issues offline
- [ ] Fix issues in worker branch
- [ ] Re-test before re-deploying

---

## Success Criteria

✅ All business features working identically to Vercel version
✅ Database caching operational (saving OpenRouter/Firecrawl costs)
✅ Screenshot generation working via Browser Rendering
✅ API key rotation functioning correctly
✅ Custom domain (demo.privacyhub.in) accessible
✅ Analysis results have unique URLs and are retrievable
✅ 30-day cache expiry working
✅ Content change detection working
✅ No errors in production logs
✅ Response times acceptable (< 30s for new analysis, < 1s for cached)
✅ TypeScript compilation clean (no errors)

---

## Useful Commands Reference

### Development Commands

```bash
# Next.js dev server (with simulated Cloudflare bindings)
npm run dev

# Build for production
npm run build

# Type checking
npm run typecheck

# Local Workers runtime (test exactly as production)
npm run preview

# Deploy to Cloudflare Workers production
npm run deploy
```

### Wrangler Commands

```bash
# Authentication
wrangler login                    # Login to Cloudflare (opens browser)
wrangler whoami                   # Check current authentication status
wrangler logout                   # Logout from Cloudflare

# Workers Management
wrangler deploy                   # Deploy Worker to production
wrangler deployments list         # List recent deployments
wrangler tail                     # Stream real-time logs from production
wrangler tail --format=pretty     # Logs with better formatting
wrangler dev                      # Run Worker in local dev mode

# D1 Database Commands (Use your database ID)
DB_ID="b64e7663-7a31-4e38-a210-4c570dabd118"

# List all databases
wrangler d1 list

# Get database info
wrangler d1 info privacyhub --database-id=$DB_ID

# Execute SQL commands
wrangler d1 execute privacyhub --database-id=$DB_ID --command="SELECT COUNT(*) FROM analyses;" --remote
wrangler d1 execute privacyhub --database-id=$DB_ID --command="SELECT * FROM analyses LIMIT 10;" --remote
wrangler d1 execute privacyhub --database-id=$DB_ID --command="SELECT * FROM analyses ORDER BY created_at DESC LIMIT 5;" --remote

# Execute SQL file
wrangler d1 execute privacyhub --database-id=$DB_ID --file=./schema.sql --remote

# Local database commands (for development)
wrangler d1 execute privacyhub --database-id=$DB_ID --command="SELECT COUNT(*) FROM analyses;" --local
wrangler d1 execute privacyhub --database-id=$DB_ID --file=./schema.sql --local

# Backup database
wrangler d1 export privacyhub --database-id=$DB_ID --output=backup.sql

# Secrets Management
wrangler secret list              # List all secrets (won't show values)
wrangler secret put SECRET_NAME   # Add or update a secret
wrangler secret delete SECRET_NAME # Delete a secret

# TypeScript Types
wrangler types --env-interface CloudflareEnv  # Generate types for bindings
```

### Git Commands

```bash
# Branch management
git checkout worker           # Switch to worker branch
git checkout main             # Switch to main branch
git branch                    # List all branches
git status                    # Check current status

# View changes
git diff                      # See unstaged changes
git diff --staged             # See staged changes
git log --oneline -10         # View last 10 commits

# Commit and push
git add .                     # Stage all changes
git commit -m "message"       # Commit changes
git push origin worker        # Push to worker branch

# Merge worker into main (after testing)
git checkout main
git merge worker
git push origin main
```

### Database Queries (Common Use Cases)

```bash
DB_ID="b64e7663-7a31-4e38-a210-4c570dabd118"

# Count total analyses
wrangler d1 execute privacyhub --database-id=$DB_ID --command="SELECT COUNT(*) as total FROM analyses;" --remote

# View recent analyses
wrangler d1 execute privacyhub --database-id=$DB_ID --command="SELECT domain, privacy_grade, risk_level, created_at FROM analyses ORDER BY created_at DESC LIMIT 10;" --remote

# Check a specific domain
wrangler d1 execute privacyhub --database-id=$DB_ID --command="SELECT * FROM analyses WHERE domain='example.com' ORDER BY last_checked_at DESC LIMIT 1;" --remote

# Get statistics
wrangler d1 execute privacyhub --database-id=$DB_ID --command="SELECT * FROM analysis_stats;" --remote

# Grade distribution
wrangler d1 execute privacyhub --database-id=$DB_ID --command="SELECT grade, count FROM grade_distribution WHERE count > 0 ORDER BY grade;" --remote

# Risk distribution
wrangler d1 execute privacyhub --database-id=$DB_ID --command="SELECT risk_level, count FROM risk_distribution WHERE count > 0;" --remote

# Find analyses older than 30 days
wrangler d1 execute privacyhub --database-id=$DB_ID --command="SELECT COUNT(*) FROM analyses WHERE last_checked_at < datetime('now', '-30 days');" --remote

# Delete old analyses (USE CAREFULLY!)
wrangler d1 execute privacyhub --database-id=$DB_ID --command="DELETE FROM analyses WHERE created_at < datetime('now', '-90 days');" --remote
```

---

## Important Notes & Best Practices

### Security
- ⚠️ **CRITICAL**: NEVER commit `.dev.vars` file (contains API keys)
- ✅ **DO** commit `wrangler.jsonc` (configuration is safe to share)
- ✅ **DO** commit `worker-configuration.d.ts` (TypeScript types)
- ⚠️ API keys should be rotated periodically for security
- ⚠️ Always verify `.dev.vars` is in `.gitignore` before committing

### Development Workflow
- 🧪 Always test with `npm run dev` first (Next.js dev server)
- 🧪 Then test with `npm run preview` (local Workers runtime)
- 🚀 Only deploy with `npm run deploy` after both work
- 📊 Use `wrangler tail` to debug production issues in real-time
- ✅ Run `npm run typecheck` before deploying to catch TypeScript errors

### Database
- 📦 D1 database is region-specific - local and remote databases are separate
- 📦 Local database (--local) is for development only
- 📦 Production database (--remote) is the actual data
- ⚠️ Backup production data before running DROP TABLE commands
- ✅ Use `IF NOT EXISTS` in schema for idempotent operations
- 📊 Monitor database size in Cloudflare Dashboard

### Bindings
- ⚠️ **CRITICAL**: Use `env["an-db"]` (with brackets and quotes) for database binding
- ⚠️ **CRITICAL**: Use `env["crawl-browser"]` (with brackets and quotes) for browser rendering
  - Bracket notation required because binding name contains hyphen
  - Used for screenshots and web scraping fallback
- ✅ Use `env.OPENROUTER_API_1/2/3` for API keys
- ✅ Use `env.FIRECRAWL_API_KEY` for Firecrawl
- 💡 **Scraping Strategy**: Firecrawl (primary) → Browser Rendering API (fallback)

### API Usage & Costs
- 💰 Database caching will reduce OpenRouter API calls by 90%+
- 💰 Cached requests won't call Firecrawl (saves $$$)
- 📊 Monitor API usage in OpenRouter dashboard (shows privacyhub.in as referer)
- 📊 Monitor Browser Rendering usage in Cloudflare Dashboard
- ✅ Round-robin key rotation helps distribute load across 3 keys

### Performance
- ⚡ Cloudflare Workers run at the edge (faster than centralized Vercel)
- ⚡ D1 database queries are fast (< 10ms typically)
- ⚡ First analysis: ~10-30s (scraping + LLM)
- ⚡ Cached analysis: < 1s (database lookup only)
- 📊 Monitor response times in Cloudflare Analytics

### Debugging
- 🐛 Use `wrangler tail` for real-time production logs
- 🐛 Use `wrangler tail --format=pretty` for better formatting
- 🐛 Check browser console for client-side errors
- 🐛 Use `console.log()` statements (will appear in wrangler tail)
- 🐛 If Worker won't start, check syntax errors in code

### Deployment
- 🚀 Deployment takes ~30 seconds to propagate globally
- 🚀 Custom domain may take 1-2 minutes to update
- 🚀 Old deployment remains active during new deployment (zero downtime)
- ✅ Test on `privacyhub.workers.dev` before testing custom domain

---

## Troubleshooting Guide

### Problem: "getCloudflareContext is not a function"

**Cause**: `@opennextjs/cloudflare` not installed or not initialized in next.config.ts

**Solution**:
```bash
npm install @opennextjs/cloudflare@latest
```
Add to next.config.ts:
```typescript
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";
if (process.env.NODE_ENV !== 'production') {
  initOpenNextCloudflareForDev();
}
```

---

### Problem: "env["an-db"] is undefined"

**Cause**: Database binding not configured in wrangler.jsonc

**Solution**: Verify wrangler.jsonc has:
```jsonc
{
  "d1_databases": [
    {
      "binding": "an-db",
      "database_name": "privacyhub",
      "database_id": "b64e7663-7a31-4e38-a210-4c570dabd118"
    }
  ]
}
```

Run `wrangler types` to regenerate types.

---

### Problem: "OPENROUTER_API_1 is undefined"

**Cause**: Environment variables not loaded

**Solution**:

**For local dev**:
- Ensure `.dev.vars` file exists with the API keys
- Restart `npm run dev` after creating `.dev.vars`

**For production**:
- Run `wrangler secret list` to verify secrets exist
- If missing, run `wrangler secret put OPENROUTER_API_1`

---

### Problem: Database schema errors

**Cause**: Old schema or missing tables

**Solution**:
```bash
# Drop and recreate tables
DB_ID="b64e7663-7a31-4e38-a210-4c570dabd118"

# Drop existing tables
wrangler d1 execute privacyhub --database-id=$DB_ID --command="DROP TABLE IF EXISTS analyses; DROP TABLE IF EXISTS analysis_stats; DROP TABLE IF EXISTS grade_distribution; DROP TABLE IF EXISTS risk_distribution;" --remote

# Recreate schema
wrangler d1 execute privacyhub --database-id=$DB_ID --file=./schema.sql --remote
```

---

### Problem: Build fails with TypeScript errors

**Cause**: Missing types or incorrect binding names

**Solution**:
```bash
# Regenerate types
wrangler types --env-interface CloudflareEnv

# Run typecheck to see errors
npm run typecheck

# Fix errors based on output
# Common issue: Using env.DB instead of env["an-db"]
```

---

### Problem: "npm run preview" fails

**Cause**: Build errors or missing dependencies

**Solution**:
```bash
# Clean build
rm -rf .next .open-next

# Reinstall dependencies
npm install

# Try building first
npm run build

# If build succeeds, try preview again
npm run preview
```

---

### Problem: Custom domain shows old content or error

**Cause**: DNS not updated or deployment not propagated

**Solution**:
1. Wait 5 minutes for propagation
2. Clear browser cache (Ctrl+Shift+R or Cmd+Shift+R)
3. Check deployment: `wrangler deployments list`
4. Check route configuration in Dashboard
5. Try accessing via Workers URL first: `privacyhub.workers.dev`
6. Use `wrangler tail` to see if requests are reaching the Worker

---

### Problem: Analysis works but doesn't save to database

**Cause**: Database initialization failing silently

**Solution**:

Check logs: `wrangler tail`

Look for database errors. Common issues:
- Schema not created (run schema.sql)
- Binding name wrong (should be "an-db" not "DB")
- Database ID incorrect in wrangler.jsonc

Verify database works:
```bash
DB_ID="b64e7663-7a31-4e38-a210-4c570dabd118"
wrangler d1 execute privacyhub --database-id=$DB_ID --command="SELECT COUNT(*) FROM analyses;" --remote
```

---

### Problem: "Browser Rendering API not available"

**Cause**: Browser binding not configured or incorrect binding name

**Solution**: Verify browser binding in wrangler.jsonc:
```jsonc
{
  "browser": {
    "binding": "crawl-browser"
  }
}
```

**Access in code**:
```typescript
const { env } = getCloudflareContext();
const browser = env["crawl-browser"]; // Use bracket notation due to hyphen
```

Run `wrangler types` to regenerate types and verify binding is accessible.

---

### Problem: Scraping not working on Cloudflare Workers

**Cause**: Playwright/Crawlee may not work due to Workers runtime limitations

**Solution**: Use Firecrawl as primary scraper, Browser Rendering API as fallback

**Recommended Implementation**:
```typescript
const { env } = getCloudflareContext();
let content = '';

// Strategy 1: Try Firecrawl first (primary)
try {
  if (env.FIRECRAWL_API_KEY) {
    const firecrawl = new FirecrawlApp({ apiKey: env.FIRECRAWL_API_KEY });
    const result = await firecrawl.scrapeUrl(url);
    content = result.markdown || result.html;
  }
} catch (error) {
  console.log('Firecrawl failed, trying browser binding...');

  // Strategy 2: Fallback to Browser Rendering API
  try {
    const browser = env["crawl-browser"];
    const response = await browser.fetch(url);
    content = await response.text();
  } catch (browserError) {
    console.error('All scraping methods failed');
    throw new Error('Unable to scrape content');
  }
}
```

**Note**: Crawlee/Playwright should generally be avoided on Cloudflare Workers due to binary dependencies.

---

### Problem: High API costs

**Cause**: Database caching not working

**Solution**:

Verify caching works:
1. Analyze a URL twice
2. Second request should be instant (< 1s)
3. Check logs for "Using cached analysis"

If not caching:
- Verify `db` is not `undefined`
- Check `initializeDatabase(db)` is called
- Verify cache logic is enabled (not commented out)

---

## Migration Success Checklist

After completing all phases, verify everything works:

- [ ] ✅ Homepage loads at https://demo.privacyhub.in
- [ ] ✅ Privacy policy analysis completes successfully
- [ ] ✅ Results are saved to D1 database
- [ ] ✅ Cached results load in < 1 second
- [ ] ✅ Content change detection works (different hash = new analysis)
- [ ] ✅ 30-day expiry works (old cache triggers new analysis)
- [ ] ✅ API key rotation works (visible in OpenRouter dashboard)
- [ ] ✅ Screenshots generate successfully
- [ ] ✅ No TypeScript errors (`npm run typecheck` passes)
- [ ] ✅ No errors in production logs (`wrangler tail`)
- [ ] ✅ Database growing as expected (check analysis count)
- [ ] ✅ Cost reduction visible (fewer OpenRouter/Firecrawl calls)
- [ ] ✅ Response times acceptable (< 30s new, < 1s cached)

---

## Additional Resources

### Documentation
- [OpenNext.js Cloudflare Docs](https://opennext.js.org/cloudflare)
- [Cloudflare Workers Docs](https://developers.cloudflare.com/workers/)
- [Cloudflare D1 Docs](https://developers.cloudflare.com/d1/)
- [Wrangler CLI Docs](https://developers.cloudflare.com/workers/wrangler/)
- [Next.js on Workers Guide](https://developers.cloudflare.com/workers/framework-guides/web-apps/nextjs/)

### Support Channels
- OpenNext.js GitHub: https://github.com/opennextjs/opennextjs-cloudflare
- Cloudflare Discord: https://discord.gg/cloudflaredev
- Cloudflare Community: https://community.cloudflare.com/

---

**This comprehensive guide ensures a smooth, error-free migration from Vercel to Cloudflare Workers while maintaining all business functionality and enabling powerful new features like database caching and cost optimization.**

---

## Feature Summary: Permalink & Homepage Grid

### ✅ Requirements Understood

**1. Permalink Structure**:
- ✅ Every analysis saved to database
- ✅ URL format: `/analysis/yyyymmdd/domainname`
- ✅ Permanent, shareable links
- ✅ Example: `/analysis/20251020/google.com`

**2. Smart Caching Logic**:
- ✅ Check if analysis exists in database for domain
- ✅ If exists and < 30 days old AND content unchanged → return cached (0 API calls)
- ✅ If > 30 days old OR content changed → perform fresh analysis
- ✅ Content change detection via SHA-256 hash comparison
- ✅ Reduces API calls by 90%+

**3. Homepage Analysis Grid**:
- ✅ Location: First fold after hero section
- ✅ Grid layout: 4 columns (desktop), 2 (tablet), 1 (mobile)
- ✅ Show 8 most recent analyses initially
- ✅ Each card shows:
  - Domain name
  - Overall score (circular indicator)
  - Privacy grade (letter grade A-F)
  - Risk level badge (EXEMPLARY/LOW/MODERATE/HIGH)
  - Category scores (mini progress bars)
  - Analysis date
- ✅ Click behavior: Navigate to permalink page
- ✅ Design reference: `/Users/alokemajumder/Desktop/Screenshot 2025-10-16 at 16.24.26.png`

**4. Database Schema**:
- ✅ Already supports permalinks via `analyses` table
- ✅ Columns: domain, content_hash, created_at, last_checked_at
- ✅ UNIQUE constraint on (domain, content_hash) prevents duplicates
- ✅ Automatic timestamp tracking

**5. Implementation Files**:
- ✅ `src/app/api/analyze/route.ts` - Enhanced with smart caching
- ✅ `src/app/api/analyses/recent/route.ts` - NEW: Fetch grid data
- ✅ `src/app/api/analyses/permalink/route.ts` - NEW: Fetch specific analysis
- ✅ `src/app/analysis/[date]/[domain]/page.tsx` - NEW: Permalink page
- ✅ `src/components/AnalysisGrid.tsx` - NEW: Homepage grid component
- ✅ `src/components/AnalysisCard.tsx` - NEW: Individual card component

### 📊 Cost Optimization Impact

**Without Smart Caching**:
- Every analysis: 1 Firecrawl call + 1 OpenRouter call
- 100 analyses/day = 200 API calls
- Cost: ~$20-50/day (depending on usage)

**With Smart Caching** (90% hit rate):
- Cached: 0 API calls (90 analyses)
- Fresh: 2 API calls (10 analyses)
- 100 analyses/day = 20 API calls
- Cost: ~$2-5/day
- **Savings: 90% reduction**

### 🎯 User Experience Flow

**Scenario 1: First-time Analysis**
1. User enters `https://google.com/privacy`
2. System checks database → no existing analysis
3. Scrapes policy, analyzes with LLM, saves to DB
4. Generates permalink: `/analysis/20251020/google.com`
5. Redirects user to permalink page
6. Analysis appears in homepage grid

**Scenario 2: Re-analysis (Content Unchanged, < 30 days)**
1. User enters same URL again
2. System finds existing analysis (created 5 days ago)
3. Checks content hash → unchanged
4. Returns cached results instantly (< 1 second)
5. Redirects to existing permalink
6. **0 API calls made**

**Scenario 3: Re-analysis (Content Changed)**
1. User enters URL (policy updated since last analysis)
2. System finds existing analysis
3. Fetches current policy, generates hash
4. Hash differs from database → content changed
5. Performs fresh analysis, saves with new hash
6. Creates NEW permalink with today's date
7. User sees updated analysis

**Scenario 4: Re-analysis (> 30 days old)**
1. User enters URL (last analyzed 40 days ago)
2. System finds old analysis
3. Determines stale (> 30 days)
4. Performs fresh analysis regardless of content
5. Creates NEW permalink with today's date

### 📱 Homepage Grid User Experience

**User visits homepage**:
1. Sees hero section with analysis input
2. Scrolls down → sees grid of 8 recent analyses
3. Each card shows summary: score, grade, risk, categories
4. Clicks on any card
5. Navigates to full analysis report at permalink URL
6. Can share permalink with others
7. Permalink always shows same historical analysis

### 🔧 Technical Implementation Checklist

**Phase 4 Additions** (to be done during code modification phase):

- [ ] **Enhance `src/app/api/analyze/route.ts`**:
  - [ ] Add smart caching logic (check DB first)
  - [ ] Implement content hash comparison
  - [ ] Add 30-day expiry check
  - [ ] Generate permalink after saving
  - [ ] Return permalink in API response

- [ ] **Create `src/app/api/analyses/recent/route.ts`**:
  - [ ] Fetch recent analyses from D1
  - [ ] Support pagination (limit/offset)
  - [ ] Transform data for frontend
  - [ ] Generate permalinks for each result
  - [ ] Return category scores from analysis_data JSON

- [ ] **Create `src/app/api/analyses/permalink/route.ts`**:
  - [ ] Accept date (YYYYMMDD) and domain params
  - [ ] Query D1 by date and domain
  - [ ] Return full analysis data
  - [ ] Handle 404 for non-existent permalinks

- [ ] **Create `src/app/analysis/[date]/[domain]/page.tsx`**:
  - [ ] Next.js dynamic route
  - [ ] Validate date format
  - [ ] Fetch analysis via API
  - [ ] Render full analysis results
  - [ ] Add SEO metadata
  - [ ] Handle 404 gracefully

- [ ] **Create `src/components/AnalysisGrid.tsx`**:
  - [ ] Fetch recent analyses on mount
  - [ ] Render responsive grid (4/2/1 columns)
  - [ ] Map data to AnalysisCard components
  - [ ] Handle loading state
  - [ ] Handle empty state

- [ ] **Create `src/components/AnalysisCard.tsx`**:
  - [ ] Circular score indicator
  - [ ] Category score progress bars
  - [ ] Privacy grade letter
  - [ ] Risk badge with color coding
  - [ ] Click handler → navigate to permalink
  - [ ] Responsive design
  - [ ] Match screenshot design

- [ ] **Update Homepage** (`src/app/page.tsx`):
  - [ ] Add AnalysisGrid component after hero
  - [ ] Add section heading: "Recent Privacy Analyses"
  - [ ] Add spacing/padding

### ✅ Confirmation

**I have understood all requirements**:

1. ✅ **Permalink Structure**: `/analysis/yyyymmdd/domainname` format
2. ✅ **Smart Caching**: Check DB first, only re-analyze if content changed or > 30 days old
3. ✅ **Content Change Detection**: SHA-256 hash comparison
4. ✅ **30-Day Expiry**: Automatic fresh analysis after 30 days
5. ✅ **Homepage Grid**: Cards displaying analysis summaries
6. ✅ **Card Design**: Matches screenshot with score, grade, risk, categories
7. ✅ **Click Behavior**: Navigate to permalink page
8. ✅ **Cost Reduction**: 90%+ savings by reducing redundant API calls
9. ✅ **Database Schema**: Already supports all requirements
10. ✅ **Implementation Plan**: Documented in guide above

**Note**: This guide has been updated with **3 new phases** (2.6, 2.7, 2.8) documenting:
- Permalink structure and smart caching logic
- Homepage analysis grid requirements
- Permalink page implementation
- All required API endpoints
- Card component design specifications
- Complete implementation code examples
- Browser binding configuration (crawl-browser)
- Scraping fallback strategy for Workers environment

**Additional Configurations**:
- ✅ Browser binding configured: `crawl-browser`
  - Used for screenshots and web scraping fallback
  - Cloudflare Workers support only ONE browser binding per Worker
  - Access via: `env["crawl-browser"]` (bracket notation required)
- ✅ Scraping strategy: Firecrawl (primary) → Browser Rendering API (fallback)
- ✅ Troubleshooting guide for browser binding issues
- ✅ Implementation examples for scraping fallback logic

**Ready to proceed with migration when approved!**
