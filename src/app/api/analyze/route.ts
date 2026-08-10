/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import { OpenRouter } from '@openrouter/sdk';
import FirecrawlApp from '@mendable/firecrawl-js';
import { validateUrl } from '@/lib/input-validation';
import { getBestAvailableKey, markKeyAsFailed } from '@/lib/openrouter-key-manager';
import {
  getCachedAnalysis,
  saveAnalysis,
  generateContentHash,
  extractDomain,
  initializeDatabase,
  isDatabaseConfigured,
  type AnalysisData,
} from '@/lib/db';

// Runtime configuration — Node.js runtime on Vercel for scraping support
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 300; // up to 300s (Vercel Fluid Compute) for scrape + AI analysis

// OpenRouter models in fallback order: default (primary) first, then each fallback on failure.
// https://openrouter.ai/openrouter/free  (default — auto-routed free model)
// https://openrouter.ai/nvidia/nemotron-3-ultra-550b-a55b:free
// https://openrouter.ai/openai/gpt-oss-20b:free
const ANALYSIS_MODELS = [
  'openrouter/free',
  'nvidia/nemotron-3-ultra-550b-a55b:free',
  'openai/gpt-oss-20b:free',
] as const;

// Initialize OpenRouter client with best available API key (keys read from process.env)
async function getOpenRouterClient() {
  const keyInfo = await getBestAvailableKey();

  if (!keyInfo) {
    throw new Error('No OpenRouter API keys available');
  }

  console.log(`[OpenRouter] Using ${keyInfo.name} API key (daily rotation active)`);

  return {
    client: new OpenRouter({
      apiKey: keyInfo.key,
      httpReferer: "https://privacyanalyzer.in",
      xTitle: "PrivacyAnalyzer - Privacy Policy Analyzer",
    }),
    keyName: keyInfo.name,
  };
}

// Initialize Firecrawl client
function getFirecrawlClient(apiKey: string) {
  if (!apiKey) {
    throw new Error('FIRECRAWL_API_KEY is required');
  }
  return new FirecrawlApp({ apiKey });
}

// Convert raw HTML to clean plain text
function htmlToText(html: string): string {
  let text = html;
  // Remove script, style, noscript, svg, iframe tags and their content
  text = text.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  text = text.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '');
  text = text.replace(/<noscript\b[^<]*(?:(?!<\/noscript>)<[^<]*)*<\/noscript>/gi, '');
  text = text.replace(/<svg\b[^<]*(?:(?!<\/svg>)<[^<]*)*<\/svg>/gi, '');
  text = text.replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '');
  // Decode HTML entities
  text = text.replace(/&amp;/g, '&');
  text = text.replace(/&lt;/g, '<');
  text = text.replace(/&gt;/g, '>');
  text = text.replace(/&quot;/g, '"');
  text = text.replace(/&#39;/g, "'");
  text = text.replace(/&nbsp;/g, ' ');
  text = text.replace(/&#x27;/g, "'");
  text = text.replace(/&#x2F;/g, '/');
  text = text.replace(/&#(\d+);/g, (_match, dec) => String.fromCharCode(Number(dec)));
  // Add newlines after block elements before stripping tags
  text = text.replace(/<\/(?:p|div|h[1-6]|li|tr)>/gi, '\n');
  text = text.replace(/<br\s*\/?>/gi, '\n');
  // Strip remaining HTML tags
  text = text.replace(/<[^>]+>/g, ' ');
  // Collapse multiple whitespace and newlines
  text = text.replace(/[ \t]+/g, ' ');
  text = text.replace(/\n\s*\n/g, '\n\n');
  return text.trim();
}

// Smart truncation that respects sentence and paragraph boundaries
function smartTruncate(content: string, maxLength: number): string {
  if (content.length <= maxLength) {
    return content;
  }
  const searchRegion = content.substring(0, maxLength);
  // Try to find the last sentence boundary within the last 500 chars
  const sentencePattern = /[.?!]\s|\.\n/g;
  let lastSentenceEnd = -1;
  let match;
  while ((match = sentencePattern.exec(searchRegion)) !== null) {
    if (match.index >= maxLength - 500) {
      lastSentenceEnd = match.index + 1;
    }
  }
  if (lastSentenceEnd > 0) {
    return content.substring(0, lastSentenceEnd).trim();
  }
  // Try paragraph boundary
  const lastParagraph = searchRegion.lastIndexOf('\n\n');
  if (lastParagraph > maxLength - 500) {
    return content.substring(0, lastParagraph).trim();
  }
  // Try last space
  const lastSpace = searchRegion.lastIndexOf(' ');
  if (lastSpace > 0) {
    return content.substring(0, lastSpace).trim();
  }
  // Hard cut
  return content.substring(0, maxLength);
}

// Simple fetch fallback
async function scrapeWithFetch(url: string): Promise<string> {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept-Encoding': 'gzip, deflate, br',
        'DNT': '1',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
        'Sec-Fetch-Dest': 'document',
        'Sec-Fetch-Mode': 'navigate',
        'Sec-Fetch-Site': 'none',
        'Sec-Fetch-User': '?1',
        'Cache-Control': 'max-age=0',
      },
      signal: AbortSignal.timeout(30000), // 30 second timeout
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const html = await response.text();

    // Convert HTML to clean text using the shared helper
    return htmlToText(html);
  } catch (error) {
    console.error('Fetch scraping failed:', error);
    throw error;
  }
}


const PRIVACY_ANALYSIS_PROMPT = `
You are a certified privacy policy expert specializing in India's Digital Personal Data Protection Act (DPDP Act) 2023 and the Digital Personal Data Protection Rules 2025. Conduct a comprehensive privacy impact assessment focused on Indian data protection requirements and user rights under both the Act and the Rules.

DUAL SCORING METHODOLOGY:

1. **OVERALL PRIVACY SCORE (User Perspective)**: Rate 1-10 based on how well the policy protects user privacy and data rights
   - Focus: User data protection, transparency, control, and privacy-friendly practices
   - Audience: General users wanting to understand privacy risks
   - 10 = Exemplary user privacy protection, 1 = Significant privacy risk to users

2. **DPDP COMPLIANCE SCORE (Business/Regulatory Perspective)**: Rate 1-10 based on compliance with DPDP Act 2023 and Rules 2025
   - Focus: Statutory requirements, legal obligations, regulatory compliance
   - Audience: Business owners, compliance officers, legal teams
   - 10 = Full DPDP Act and Rules compliance, 1 = Major regulatory violations
   - Evaluate against specific requirements:
     * Notice requirements (Sec. 5, Rule 3)
     * Consent mechanisms (Sec. 6, Rule 3)
     * Data Principal rights implementation (Sec. 11-13, Rule 14)
     * Security safeguards (Sec. 8, Rule 6)
     * Breach notification (Rule 7 - 72 hour timeline)
     * Retention periods (Rule 8, Third Schedule)
     * Children's data (Sec. 9, Rule 12, Fourth Schedule)
     * Consent Manager obligations (Rule 4, First Schedule) if applicable
     * Significant Data Fiduciary requirements (Rule 13) if applicable
     * Cross-border transfers (Sec. 16, Rule 15)
     * Grievance redressal (Sec. 13 right; Sec. 8(10) fiduciary obligation)
     * DPO appointment where required (Rule 13)

CATEGORY SCORING: Rate each category 1-10 using the anchored rubric below.

SCORING RUBRIC (apply the same anchored scale to every category so scores are consistent and defensible):
- 9-10 (Exemplary): The policy EXPLICITLY provides privacy-by-design protections that meet AND exceed the DPDP obligations for this category, with specific, verifiable mechanisms (named tools, contacts, timelines, safeguards).
- 7-8 (Strong): The policy explicitly meets the core DPDP obligations for this category with clear, specific commitments; only minor gaps.
- 5-6 (Adequate): Basic protections are present but vague, partial, or with notable gaps; several obligations are only implied rather than stated.
- 3-4 (Weak): Minimal protection; the policy is largely silent on, or contradicts, key DPDP obligations; user-unfavourable defaults.
- 1-2 (Poor): No meaningful protection; likely DPDP non-compliance; the policy permits broad collection/sharing with little user control.

MANDATORY EVIDENCE RULES (these keep scoring objective and reproducible):
1. Score ONLY on what the policy text EXPLICITLY states. Do not assume, infer good faith, or credit practices the policy does not describe.
2. Silence = not met. If the policy does not address an obligation, treat that obligation as ABSENT and score it low — do not give benefit of the doubt.
3. Ground every category score in the criteria listed for that category: the score reflects the PROPORTION of that category's criteria that are explicitly and verifiably satisfied.
4. In each category's "reasoning", cite specific evidence (quote or paraphrase the relevant policy statement) or explicitly note its absence. Vague reasoning is not acceptable.
5. Be consistent: the same policy text must map to the same score band every time.


**DATA MINIMIZATION & COLLECTION PRACTICES (Weight: 30%)**
Evaluate against DPDP Act 2023 Sec. 5 and DPDP Rules 2025 privacy-by-design principles:
- Collection scope: Only necessary data for stated purposes (10), excessive collection without justification (1-3)
- Legal basis clarity: Explicit lawful basis identification per Sec. 6 DPDP Act
- Purpose specification: Clear, specific purposes vs. vague "business operations"
- Sensitive personal data handling: Special protections per Sec. 9 DPDP Act
- Children's data: DPDP Act Sec. 9 compliance with Rule 12 (Fourth Schedule exemptions for education/health services requiring verifiable parental consent)
- Notice and consent: Clear, informed, free, specific and unambiguous consent mechanisms (Sec. 6, Rule 3)
- Retention periods: Compliance with Rule 8 - erase when purpose served or consent withdrawn; large e-commerce (2 cr+ users), online gaming (50 lakh+) and social-media (2 cr+) fiduciaries must erase 3 years after last user interaction (Third Schedule); 1-year minimum log retention
- Data minimization enforcement: Automatic deletion mechanisms post-purpose completion (Rule 8)

**THIRD-PARTY DATA SHARING & TRANSFERS (Weight: 25%)**
Assess Data Fiduciary/Data Processor relationships and transfer mechanisms:
- Sharing scope: No sharing (10), limited with consent (7-8), extensive commercial sharing (1-4)
- International transfers: Cross-border compliance (DPDP Act Sec. 16, Rule 15) to approved countries/jurisdictions notified by Central Government
- Processor agreements: Evidence of Sec. 8 DPDP Act compliant contracts with Data Processors
- Consent mechanisms: Granular, withdrawable consent vs. bundled/forced consent (Sec. 6, Rule 3)
- Consent Manager registration: For organizations acting as Consent Managers, compliance with Rule 4 and First Schedule (registration, record-keeping, withdrawal mechanisms, transparency)
- Data localization: Compliance for specified personal data categories
- Commercial exploitation: Data monetization practices and user awareness
- Third-party audit rights and oversight mechanisms
- State processing exemptions: If applicable, adherence to Rule 5 (Second Schedule) for government data processing

**INDIVIDUAL RIGHTS & DATA PRINCIPAL CONTROLS (Weight: 20%)**
Evaluate DPDP Act Chapter IV and Rule 14 rights implementation for Data Principals:
- Right to access (Sec. 11, Rule 14): Summary and comprehensive data access mechanisms within reasonable timeframes
- Right to correction (Sec. 12, Rule 14): Error rectification and data updation processes
- Right to erasure (Sec. 12, Rule 14): Data deletion implementation and statutory exceptions
- Right to grievance redressal (Sec. 13): Grievance Officer designation, contact details, and complaint handling
- Right to nominate (Sec. 14, Rule 14): Nomination facility to exercise rights on death or incapacity
- Withdrawal of consent (Sec. 7, Rule 14): Easy, accessible, and prompt withdrawal mechanisms
- Response timeframes: Reasonable time compliance as required by DPDP Act and Rules
- Consent Manager facilitation: If using Consent Managers, seamless rights exercise through platform (Rule 4)

**SECURITY & RISK MANAGEMENT (Weight: 15%)**
Technical and organizational measures assessment per DPDP Act Sec. 8 and Rule 6:
- Security safeguards (Rule 6): Reasonable security measures commensurate with nature, volume, and sensitivity of data
- Encryption standards: End-to-end, in-transit, at-rest protections
- Access controls: Role-based access, multi-factor authentication, need-to-know principle
- Incident response: Breach notification procedures within 72 hours to Data Protection Board (Rule 7) and users
- Breach disclosure: Information to affected Data Principals about nature of breach and remedial actions (Rule 7)
- Risk assessment: Regular privacy and security impact assessments, especially for Significant Data Fiduciaries (Rule 13)
- Data retention: Defined, justified retention periods with automatic deletion schedules (Rule 8, Third Schedule)
- Data localization: Storage and processing location compliance
- Third-party processor security: Contractual safeguards and audit provisions
- DPIA requirements: For Significant Data Fiduciaries, documented Data Protection Impact Assessments (Rule 13)

**REGULATORY COMPLIANCE & LEGAL FRAMEWORK (Weight: 7%)**
DPDP Act 2023 and Rules 2025 compliance evaluation for Indian users:
- Data Fiduciary registration and Data Protection Officer (DPO) designation where required
- Grievance Officer appointment and contact information (Sec. 8(10))
- Data Protection Board registration requirements (Sec. 25, Rules 16-22) where applicable
- Significant Data Fiduciary obligations: DPO appointment, DPIA, periodic audits, logging (Rule 13)
- Consent Manager obligations: If applicable, registration, technical standards, withdrawal mechanisms (Rule 4, First Schedule)
- Legal basis documentation and consent records management (Rule 3)
- Privacy policy availability in English and vernacular Indian languages
- Compliance with sectoral regulations (IT Act, RBI guidelines, TRAI regulations)
- Board composition awareness: Understanding of Data Protection Board structure (Rule 16, Fifth Schedule) for appeals

**TRANSPARENCY & COMMUNICATION (Weight: 3%)**
Information quality and accessibility assessment:
- Language clarity: Plain language in English and Hindi/regional languages vs. legal jargon
- Policy accessibility: Mobile optimization, vernacular language support for Indian users
- Notice timing: Clear notice at or before collection of personal data (Sec. 5, Rule 3)
- Notice content: All elements per Rule 3 (purpose, nature of data, rights, grievance mechanism, contact details)
- Change notification: Proactive notification mechanisms for policy updates
- Contact mechanisms: Dedicated Grievance Officer and Data Protection Officer information (if applicable)
- Indian grievance redressal timeline: Compliance with specified resolution timeframes
- Consent clarity: For Consent Managers, clear presentation of consent requests without dark patterns (Rule 4, First Schedule)

RISK CATEGORIZATION:
- HIGH RISK (1-3): Significant DPDP Act/Rules violations likely, Data Protection Board action probable
- MODERATE-HIGH RISK (4-5): Multiple compliance gaps, Data Principal rights compromised
- MODERATE RISK (6-7): Some privacy protections present, improvement areas identified
- LOW RISK (8-9): Strong privacy framework with minor gaps
- EXEMPLARY (10): Privacy-by-design implementation, exceeds DPDP Act and Rules minimums

Provide your response in this JSON format:
{
  "overall_score": number (1-10, weighted average - USER PRIVACY PROTECTION FOCUS),
  "dpdp_compliance_score": number (1-10 - REGULATORY COMPLIANCE FOCUS: how well policy meets DPDP Act 2023 and Rules 2025 statutory requirements),
  "risk_level": "string (HIGH/MODERATE-HIGH/MODERATE/LOW/EXEMPLARY)",
  "regulatory_compliance": {
    "dpdp_act_compliance": "string (COMPLIANT/PARTIALLY_COMPLIANT/NON_COMPLIANT)",
    "dpdp_rules_compliance": "string (COMPLIANT/PARTIALLY_COMPLIANT/NON_COMPLIANT/NOT_APPLICABLE)",
    "major_violations": ["string array of specific DPDP Act and Rules violations"],
    "compliance_summary": "string - 2-3 sentence summary explaining the dpdp_compliance_score for business owners"
  },
  "categories": {
    "data_collection": {"score": number, "reasoning": "string with specific evidence from policy", "dpdp_notes": "string - relevant DPDP Act sections and Rules"},
    "data_sharing": {"score": number, "reasoning": "string with specific evidence from policy", "dpdp_notes": "string - relevant DPDP Act sections and Rules"},
    "user_rights": {"score": number, "reasoning": "string with specific evidence from policy", "dpdp_notes": "string - relevant DPDP Act sections and Rules"},
    "security_measures": {"score": number, "reasoning": "string with specific evidence from policy", "dpdp_notes": "string - relevant DPDP Act sections and Rules"},
    "compliance_framework": {"score": number, "reasoning": "string with specific evidence from policy", "dpdp_notes": "string - relevant DPDP Act sections and Rules"},
    "transparency": {"score": number, "reasoning": "string with specific evidence from policy", "dpdp_notes": "string - relevant DPDP Act sections and Rules"}
  },
  "critical_findings": {
    "high_risk_practices": ["specific practices that pose significant privacy risks for Indian users"],
    "regulatory_gaps": ["DPDP Act and Rules compliance requirements not met"],
    "data_subject_impacts": ["potential harms to Indian Data Principals"]
  },
  "positive_practices": ["privacy-protective practices that exceed DPDP Act and Rules minimum requirements"],
  "actionable_recommendations": {
    "immediate_actions": ["urgent DPDP Act and Rules compliance actions required"],
    "medium_term_improvements": ["privacy enhancements for Indian users"],
    "best_practice_adoption": ["industry leading practices to consider for Indian market"]
  },
  "user_action_plan": {
    "summary": "1-2 plain-language sentences telling a regular, non-technical Indian user what this policy means for THEIR personal data and privacy — no jargon",
    "top_actions": [
      {"action": "concrete, specific step this user should take (e.g. 'Turn off ad personalization in Settings > Privacy')", "why": "plain-language reason it matters to them", "priority": "HIGH/MEDIUM/LOW"}
    ],
    "your_rights": [
      {"right": "Right to Access", "dpdp_reference": "Sec 11", "available": "YES/PARTIAL/UNCLEAR/NO", "how_to_use": "how THIS user can exercise it with this specific service based on the policy (mention the contact/grievance channel if stated)"},
      {"right": "Right to Correction & Erasure", "dpdp_reference": "Sec 12", "available": "YES/PARTIAL/UNCLEAR/NO", "how_to_use": "..."},
      {"right": "Right to Grievance Redressal", "dpdp_reference": "Sec 13", "available": "YES/PARTIAL/UNCLEAR/NO", "how_to_use": "..."},
      {"right": "Right to Nominate", "dpdp_reference": "Sec 14", "available": "YES/PARTIAL/UNCLEAR/NO", "how_to_use": "..."},
      {"right": "Right to Withdraw Consent", "dpdp_reference": "Sec 6/7", "available": "YES/PARTIAL/UNCLEAR/NO", "how_to_use": "..."}
    ],
    "watch_outs": ["specific things IN THIS policy the user should be cautious about, in plain language (max 4)"]
  },
  "compliance_scorecard": {
    "overall_health": "1-2 sentence verdict on the organisation's PII-handling health under DPDP for a compliance/legal owner",
    "pii_handling_health_score": number (1-10, how healthy their overall data handling is vs DPDP Act 2023 + Rules 2025),
    "obligations": [
      {"area": "Notice", "dpdp_reference": "Sec 5, Rule 3", "status": "MET/PARTIAL/GAP/NOT_ADDRESSED", "finding": "what the policy does/omits", "action_required": "specific fix to close the gap"},
      {"area": "Consent (free, specific, informed, withdrawable)", "dpdp_reference": "Sec 6", "status": "MET/PARTIAL/GAP/NOT_ADDRESSED", "finding": "...", "action_required": "..."},
      {"area": "Data Principal Rights", "dpdp_reference": "Sec 11-14, Rule 14", "status": "MET/PARTIAL/GAP/NOT_ADDRESSED", "finding": "...", "action_required": "..."},
      {"area": "Security Safeguards", "dpdp_reference": "Sec 8(5), Rule 6", "status": "MET/PARTIAL/GAP/NOT_ADDRESSED", "finding": "...", "action_required": "..."},
      {"area": "Breach Notification (Board within 72h)", "dpdp_reference": "Sec 8(6), Rule 7", "status": "MET/PARTIAL/GAP/NOT_ADDRESSED", "finding": "...", "action_required": "..."},
      {"area": "Retention & Erasure", "dpdp_reference": "Sec 8(7), Rule 8, Third Schedule", "status": "MET/PARTIAL/GAP/NOT_ADDRESSED", "finding": "...", "action_required": "..."},
      {"area": "Children's Data (verifiable parental consent, no targeting <18)", "dpdp_reference": "Sec 9, Rule 10", "status": "MET/PARTIAL/GAP/NOT_ADDRESSED/NOT_APPLICABLE", "finding": "...", "action_required": "..."},
      {"area": "Grievance Officer / Contact", "dpdp_reference": "Sec 8(10)", "status": "MET/PARTIAL/GAP/NOT_ADDRESSED", "finding": "...", "action_required": "..."},
      {"area": "Cross-Border Transfers", "dpdp_reference": "Sec 16, Rule 15", "status": "MET/PARTIAL/GAP/NOT_ADDRESSED/NOT_APPLICABLE", "finding": "...", "action_required": "..."},
      {"area": "Significant Data Fiduciary (DPO, DPIA, audit)", "dpdp_reference": "Sec 10, Rule 13", "status": "MET/PARTIAL/GAP/NOT_ADDRESSED/NOT_APPLICABLE", "finding": "...", "action_required": "..."},
      {"area": "Processor Contracts", "dpdp_reference": "Sec 8(2)", "status": "MET/PARTIAL/GAP/NOT_ADDRESSED", "finding": "...", "action_required": "..."}
    ],
    "priority_gaps": ["the most urgent gaps to fix first, ordered by importance (max 5)"]
  },
  "privacy_grade": "string (A+ to F based on risk level)",
  "executive_summary": "Professional 2-3 sentence assessment for Indian stakeholders focusing on DPDP Act 2023 and Rules 2025 compliance"
}

IMPORTANT DPDP GROUNDING (be accurate — DPDP Rules 2025 were notified 13 Nov 2025):
- Data Principal rights: Access (Sec 11), Correction & Erasure (Sec 12), Grievance Redressal (Sec 13), Nominate (Sec 14), Withdraw Consent (Sec 6/7). Exercising rights is free unless excessive/repetitive. A "child" is anyone under 18.
- Breach notification: notify affected Data Principals without delay AND report to the Data Protection Board within 72 hours (Rule 7); non-compliance penalty up to Rs 200 crore.
- Retention (Rule 8, Third Schedule): erase when purpose served or consent withdrawn; large e-commerce (2 cr+ users), online gaming (50 lakh+), and social-media (2 cr+) fiduciaries must erase 3 years after last user interaction; 1-year minimum log retention.
- Only Significant Data Fiduciaries (designated by Government) must appoint a DPO (India-based), run DPIAs, and get audited.
For 'user_action_plan' write for a non-technical common person and prioritise THEIR privacy and rights. For 'compliance_scorecard' write for the policy owner/compliance team with specific, actionable DPDP gaps. Base every finding ONLY on evidence in the provided policy; if the policy is silent on an obligation, mark it GAP or NOT_ADDRESSED (not MET).
`;

export async function POST(request: NextRequest) {
  try {
    console.log('Privacy analysis request received');

    // Rate limiting disabled for MVP
    // const clientIp = getClientIp(request);
    // const rateLimitCheck = analysisRateLimiter.check(clientIp);
    //
    // if (!rateLimitCheck.allowed) {
    //   const headers = createRateLimitHeaders(
    //     rateLimitCheck.remaining,
    //     rateLimitCheck.resetTime,
    //     5
    //   );
    //
    //   return NextResponse.json(
    //     {
    //       error: 'Rate limit exceeded. You can analyze up to 5 privacy policies every 15 minutes. Please try again later.',
    //       resetTime: new Date(rateLimitCheck.resetTime).toISOString()
    //     },
    //     { status: 429, headers }
    //   );
    // }

    const { url } = await request.json();

    if (!url) {
      console.error('No URL provided in request');
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    // Validate and sanitize URL
    const urlValidation = validateUrl(url);
    if (!urlValidation.valid) {
      console.error('URL validation failed:', urlValidation.error);
      return NextResponse.json({ error: urlValidation.error || 'Invalid URL' }, { status: 400 });
    }

    const sanitizedUrl = urlValidation.sanitized!;

    // Firecrawl API key from environment
    const FIRECRAWL_API_KEY = process.env.FIRECRAWL_API_KEY;

    // Diagnostic logging for environment variable availability (without exposing actual keys)
    console.log('[Env Check] Available OpenRouter keys:', {
      OPENROUTER_API_0: !!process.env.OPENROUTER_API_0,
      OPENROUTER_API: !!process.env.OPENROUTER_API,
      OPENROUTER_API_1: !!process.env.OPENROUTER_API_1,
      OPENROUTER_API_2: !!process.env.OPENROUTER_API_2,
    });

    // Initialize Postgres (Neon) database if configured; degrade gracefully otherwise.
    let db = false;
    if (isDatabaseConfigured()) {
      console.log('[DB] Database configured, initializing schema...');
      try {
        await initializeDatabase();
        db = true;
        console.log('[DB] ✓ Database initialized successfully');
      } catch (dbError) {
        console.error('[DB] ✗ Database initialization failed:', dbError);
        // Continue without database functionality
        db = false;
      }
    } else {
      console.log('[DB] DATABASE_URL not set - running without caching/history');
    }

    console.log('Scraping URL:', sanitizedUrl);

    let content = '';
    let scraperUsed = 'unknown';
    let homepageScreenshot: string | null = null;

    // Extract homepage URL from the privacy policy URL
    const urlObj = new URL(sanitizedUrl);
    const homepageUrl = `${urlObj.protocol}//${urlObj.hostname}`;
    console.log('Homepage URL for screenshot:', homepageUrl);

    // Try Firecrawl first (if API key is available)
    if (FIRECRAWL_API_KEY) {
      console.log('Attempting to scrape with Firecrawl...');
      try {
        const firecrawl = getFirecrawlClient(FIRECRAWL_API_KEY);

        // Try different API call formats for compatibility with enhanced anti-blocking
        let scrapeResult: unknown;
        try {
          // V4 API format with optimized anti-blocking settings
          scrapeResult = await (firecrawl as unknown as {
            scrape: (params: {
              url: string;
              formats: string[];
              onlyMainContent: boolean;
              waitFor: number;
              timeout?: number;
              headers?: Record<string, string>;
              mobile?: boolean;
            }) => Promise<unknown>
          }).scrape({
            url: sanitizedUrl,
            formats: ['markdown'],
            onlyMainContent: true,
            waitFor: 2000, // wait for JavaScript-heavy sites
            timeout: 25000, // scrape timeout
            // Custom headers to mimic real browser
            headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
              'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
              'Accept-Language': 'en-US,en;q=0.9',
              'Accept-Encoding': 'gzip, deflate, br',
              'DNT': '1',
              'Upgrade-Insecure-Requests': '1',
              'Sec-Fetch-Dest': 'document',
              'Sec-Fetch-Mode': 'navigate',
              'Sec-Fetch-Site': 'none',
              'Sec-Fetch-User': '?1',
            },
            // Enable mobile emulation for sites that serve different content to mobile
            mobile: false,
          });
        } catch {
          console.log('V4 format failed, trying V3 format');

          // Fallback to V3 API format
          scrapeResult = await (firecrawl as unknown as { scrape: (url: string, params: { formats: string[]; onlyMainContent: boolean }) => Promise<unknown> }).scrape(sanitizedUrl, {
            formats: ['markdown'],
            onlyMainContent: true,
          });
        }

        console.log('Firecrawl response received');

        // Handle different response formats
        if (scrapeResult) {
          const response = scrapeResult as Record<string, unknown>;

          // V4 format check
          if (response.data && typeof response.data === 'object') {
            const data = response.data as Record<string, unknown>;
            if (typeof data.markdown === 'string') {
              content = data.markdown;
            }
          }
          // V3 format check
          else if (response.success && response.data && typeof response.data === 'object') {
            const data = response.data as Record<string, unknown>;
            content = (typeof data.markdown === 'string' ? data.markdown : '') ||
                      (typeof data.content === 'string' ? data.content : '') || '';
          }
          // Direct response format
          else if (typeof response.markdown === 'string') {
            content = response.markdown;
          }
        }

        if (content && content.length >= 100) {
          scraperUsed = 'firecrawl';
          console.log('Content extracted successfully with Firecrawl, length:', content.length);
        } else {
          throw new Error('Firecrawl returned insufficient content');
        }

      } catch (firecrawlError) {
        const errorMsg = firecrawlError instanceof Error ? firecrawlError.message : String(firecrawlError);
        console.error('[Firecrawl] Failed:', errorMsg);
        console.error('[Firecrawl] Full error:', firecrawlError);
        content = ''; // Reset content to trigger fetch fallback
      }
    } else {
      console.log('FIRECRAWL_API_KEY not found, will use direct fetch fallback');
    }

    // Fallback to a simple fetch if Firecrawl failed or no API key is configured
    if (!content || content.length < 100) {
      {
        console.log('Falling back to simple fetch...');
        try {
          content = await scrapeWithFetch(sanitizedUrl);
          scraperUsed = 'fetch';

          if (!content || content.length < 100) {
            return NextResponse.json({
              error: 'Unable to extract content from this website. The site may have anti-bot protection or require JavaScript rendering that prevents automated access. Please try a different privacy policy URL or contact the website owner for access.',
              details: 'Both scraping methods (Firecrawl and direct fetch) failed to extract sufficient content.',
              url: sanitizedUrl
            }, { status: 400 });
          }

          console.log('Content extracted successfully with fetch, length:', content.length);
        } catch (fetchError) {
          const fetchErrorMsg = fetchError instanceof Error ? fetchError.message : String(fetchError);
          console.error('All scraping methods failed:', fetchErrorMsg);

          // Provide specific error messages based on error type
          let userMessage = 'Unable to access this website. ';
          if (fetchErrorMsg.includes('ENOTFOUND') || fetchErrorMsg.includes('ECONNREFUSED')) {
            userMessage += 'The website could not be reached. Please verify the URL is correct and the site is online.';
          } else if (fetchErrorMsg.includes('timeout') || fetchErrorMsg.includes('ETIMEDOUT')) {
            userMessage += 'The website took too long to respond. It may be experiencing issues or has aggressive bot protection.';
          } else if (fetchErrorMsg.includes('403') || fetchErrorMsg.includes('Forbidden')) {
            userMessage += 'Access was denied by the website. This site has anti-bot protection that prevents automated access.';
          } else if (fetchErrorMsg.includes('401')) {
            userMessage += 'The website requires authentication. Please try a publicly accessible privacy policy URL.';
          } else {
            userMessage += 'The site may have strong bot protection or be temporarily unavailable. Please try again later or use a different privacy policy URL.';
          }

          return NextResponse.json({
            error: userMessage,
            details: 'Failed to extract content using all available methods (Firecrawl and direct fetch).',
            url: sanitizedUrl
          }, { status: 400 });
        }
      }
    }
    
    // Check if content looks like a privacy policy
    const privacyKeywords = ['privacy', 'personal information', 'data collection', 'cookies', 'third party'];
    const hasPrivacyContent = privacyKeywords.some(keyword => 
      content.toLowerCase().includes(keyword.toLowerCase())
    );

    if (!hasPrivacyContent) {
      return NextResponse.json({
        error: 'The extracted content does not appear to be a privacy policy. Please provide a direct link to a privacy policy page.'
      }, { status: 400 });
    }

    // Check D1 cache for existing analysis with content change detection
    const domain = extractDomain(sanitizedUrl);
    const contentHash = await generateContentHash(content);

    if (db) {
      console.log('[D1 Cache] Checking for cached analysis...');
      console.log('[D1 Cache] Domain:', domain, 'Content Hash:', contentHash.substring(0, 16) + '...');

      const cachedAnalysis = await getCachedAnalysis(domain, contentHash);

      if (cachedAnalysis) {
        const cacheAgeDays = Math.floor(
          (Date.now() - new Date(cachedAnalysis.last_checked_at).getTime()) / (1000 * 60 * 60 * 24)
        );

        console.log(`[D1 Cache] ✓ Found cached analysis (${cacheAgeDays} days old)`);
        console.log('[D1 Cache] Content unchanged - returning cached result (saves OpenRouter API call)');

        const parsedAnalysis = JSON.parse(cachedAnalysis.analysis_data);

        return NextResponse.json({
          url: sanitizedUrl,
          domain,
          cached: true,
          cache_age_days: cacheAgeDays,
          timestamp: cachedAnalysis.last_checked_at,
          homepage_url: homepageUrl,
          homepage_screenshot: cachedAnalysis.homepage_screenshot,
          content_length: cachedAnalysis.content_length,
          scraper_used: cachedAnalysis.scraper_used,
          analysis: parsedAnalysis,
          message: 'Policy content unchanged since last scan - using cached analysis'
        });
      }

      console.log('[D1 Cache] ✗ No cached analysis found or content has changed');
      console.log('[D1 Cache] Proceeding with new AI analysis...');
    } else {
      console.log('[D1] Database not available - proceeding without caching');
    }

    // Capture homepage screenshot using Firecrawl V1 API (non-blocking, best effort)
    if (FIRECRAWL_API_KEY) {
      try {
        console.log('[Screenshot] Attempting to capture homepage screenshot with Firecrawl V1...');
        console.log('[Screenshot] Homepage URL:', homepageUrl);
        const firecrawl = getFirecrawlClient(FIRECRAWL_API_KEY);

        let screenshotResult: unknown;

        // Try full page screenshot first
        try {
          console.log('[Screenshot] Trying screenshot@fullPage format...');
          screenshotResult = await (firecrawl as unknown as {
            scrape: (params: {
              url: string;
              formats: string[];
              onlyMainContent?: boolean;
              waitFor?: number;
              timeout?: number;
              mobile?: boolean;
            }) => Promise<unknown>
          }).scrape({
            url: homepageUrl,
            formats: ['screenshot@fullPage'], // V1 API: Full page screenshot
            onlyMainContent: false,
            waitFor: 2000,
            timeout: 20000, // 20 seconds for screenshot
            mobile: false, // Desktop screenshot
          });
          console.log('[Screenshot] Full page screenshot request completed');
        } catch {
          // Fallback to regular screenshot if fullPage fails
          console.log('[Screenshot] Full page failed, trying regular screenshot...');
          screenshotResult = await (firecrawl as unknown as {
            scrape: (params: {
              url: string;
              formats: string[];
              onlyMainContent?: boolean;
              waitFor?: number;
              timeout?: number;
              mobile?: boolean;
            }) => Promise<unknown>
          }).scrape({
            url: homepageUrl,
            formats: ['screenshot'], // V1 API: Regular screenshot (above fold)
            onlyMainContent: false,
            waitFor: 2000,
            timeout: 15000,
            mobile: false,
          });
          console.log('[Screenshot] Regular screenshot request completed');
        }

        // Extract screenshot URL from Firecrawl V1 response
        if (screenshotResult) {
          const response = screenshotResult as Record<string, unknown>;
          console.log('[Screenshot] Firecrawl V1 response received');
          console.log('[Screenshot] Response structure:', JSON.stringify(Object.keys(response)));

          // V1 API: Check for screenshot in data object
          if (response.data && typeof response.data === 'object') {
            const data = response.data as Record<string, unknown>;
            if (typeof data.screenshot === 'string') {
              homepageScreenshot = data.screenshot;
              console.log('[Screenshot] ✓ Captured successfully with Firecrawl V1 (data.screenshot)');
              console.log('[Screenshot] Screenshot URL:', homepageScreenshot.substring(0, 100) + '...');
            } else {
              console.log('[Screenshot] ✗ No screenshot field in data. Available fields:', Object.keys(data));
            }
          }
          // Fallback: Direct screenshot field
          else if (typeof response.screenshot === 'string') {
            homepageScreenshot = response.screenshot;
            console.log('[Screenshot] ✓ Captured successfully with Firecrawl V1 (direct screenshot)');
            console.log('[Screenshot] Screenshot URL:', homepageScreenshot.substring(0, 100) + '...');
          }
          // V0/legacy format check
          else if (response.success && response.data && typeof response.data === 'object') {
            const data = response.data as Record<string, unknown>;
            if (typeof data.screenshot === 'string') {
              homepageScreenshot = data.screenshot;
              console.log('[Screenshot] ✓ Captured successfully with Firecrawl (legacy format)');
            } else {
              console.log('[Screenshot] ✗ Legacy format but no screenshot. Available fields:', Object.keys(data));
            }
          } else {
            console.log('[Screenshot] ✗ Unexpected response structure. Top-level keys:', Object.keys(response));
          }
        }
      } catch (screenshotError) {
        // Non-blocking: Log error but continue with analysis
        const errorMsg = screenshotError instanceof Error ? screenshotError.message : String(screenshotError);
        console.error('[Screenshot] ✗ Firecrawl screenshot failed:', {
          error: errorMsg,
          url: homepageUrl,
          hasApiKey: !!FIRECRAWL_API_KEY
        });
      }
    } else {
      console.log('[Screenshot] FIRECRAWL_API_KEY not available, skipping screenshot capture');
    }

    // Final screenshot status
    if (homepageScreenshot) {
      console.log('[Screenshot] ✓ Screenshot ready for response (length:', homepageScreenshot.length, ')');
    } else {
      console.warn('[Screenshot] ⚠️  No screenshot available - analysis will proceed without homepage preview');
      console.log('[Screenshot] Possible reasons: Firecrawl API limit or site blocking screenshots');
    }

    console.log('Analyzing privacy policy with AI...');
    console.log('[Analysis] Starting analysis with automatic key rotation and fallback');

    // Analyze with OpenRouter AI using openrouter/free model with fallback support
    let analysisText: string | null | undefined = null;
    let parsedAnalysis: any = null;
    let lastError: Error | null = null;
    const maxRetries = 3; // Try all available keys (up to 3) if needed

    for (let attempt = 0; attempt < maxRetries; attempt++) {
      let currentKeyName = '';
      // Use the primary model first, then fall back to the secondary model on retries.
      const currentModel = ANALYSIS_MODELS[Math.min(attempt, ANALYSIS_MODELS.length - 1)];
      try {
        const openRouterResult = await getOpenRouterClient();
        if (!openRouterResult) {
          throw new Error('No OpenRouter API keys available. Please configure OPENROUTER_API, OPENROUTER_API_1, or OPENROUTER_API_2 environment variables.');
        }
        const { client: openrouter, keyName } = openRouterResult;
        currentKeyName = keyName;

        console.log(`[Analysis] Using ${keyName} for AI analysis (attempt ${attempt + 1}/${maxRetries})`);
        console.log(`[OpenRouter] Sending request to model: ${currentModel}`);
        console.log(`[OpenRouter] Request params: temperature=0.1, maxTokens=6000, content_length=${content.length}`);

        const completion = await openrouter.chat.send({
          chatGenerationParams: {
            model: currentModel,
            messages: [
              {
                role: "system",
                content: PRIVACY_ANALYSIS_PROMPT
              },
              {
                role: "user",
                content: `Analyze this privacy policy:\n\n${smartTruncate(content, 16000)}`
              }
            ],
            temperature: 0.1, // low temperature for consistent, reproducible scoring
            maxTokens: 6000,
            stream: false,
          },
        }).catch((apiError: any) => {
          // Log raw API error for debugging
          console.error('[OpenRouter] API call failed with error:', {
            message: apiError?.message,
            status: apiError?.status,
            statusText: apiError?.statusText,
            type: apiError?.constructor?.name,
          });
          throw apiError;
        });

        console.log('[OpenRouter] Raw completion response:', JSON.stringify({
          id: completion.id,
          model: completion.model,
          choices_length: completion.choices?.length,
          has_choices: !!completion.choices,
          first_choice_exists: !!completion.choices?.[0]
        }));

        if (!completion.choices || completion.choices.length === 0) {
          throw new Error('OpenRouter returned empty choices array. Response: ' + JSON.stringify(completion));
        }

        analysisText = completion.choices?.[0]?.message?.content as string | undefined;
        console.log(`[OpenRouter] Response received, length: ${analysisText?.length || 0}, finishReason: ${completion.choices?.[0]?.finishReason}`);

        if (analysisText) {
          // Parse here so an unparseable response falls through to the next model.
          try {
            const jsonMatch = analysisText.match(/\{[\s\S]*\}/);
            parsedAnalysis = JSON.parse(jsonMatch ? jsonMatch[0] : analysisText);
            console.log(`[Analysis] ✓ Successfully completed and parsed using ${keyName} (${currentModel})`);
            break; // Success, exit retry loop
          } catch (parseErr) {
            const msg = parseErr instanceof Error ? parseErr.message : String(parseErr);
            console.warn(`[Analysis] ${currentModel} returned unparseable JSON, trying next model...`, msg);
            lastError = new Error('Model returned unparseable analysis JSON');
            analysisText = null;
            // do not break — continue to the next attempt/model
          }
        }
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));
        const errorMessage = lastError.message;

        console.error(`[Analysis] ✗ ${currentKeyName} failed:`, errorMessage);

        // Check for HTML response (indicates OpenRouter API error)
        if (errorMessage.includes('<!DOCTYPE') || errorMessage.includes('<html') || errorMessage.includes('Unexpected token')) {
          console.error('[OpenRouter] Received HTML instead of JSON - likely API configuration issue');
          throw new Error('OpenRouter API returned an error page. Please check API key and data policy settings at https://openrouter.ai/settings/privacy');
        }

        // Check if it's a rate limit error
        if (errorMessage.includes('rate limit') || errorMessage.includes('429') || errorMessage.includes('Rate limit') || errorMessage.toLowerCase().includes('quota')) {
          // Mark current key as failed and try fallback
          markKeyAsFailed(currentKeyName, 'Rate limit exceeded');
          console.log(`[Analysis] ⚠️  ${currentKeyName} is rate limited, switching to fallback key...`);

          // If this is the last retry, throw a user-friendly error
          if (attempt >= maxRetries - 1) {
            throw new Error('All API keys have reached their rate limit. Free tier allows 20 requests/minute and 50-1000 requests/day. Please try again later or upgrade your OpenRouter plan.');
          }
          continue;
        }

        // Check for data policy errors
        if (errorMessage.includes('404') || errorMessage.includes('No endpoints found') || errorMessage.includes('data policy')) {
          console.error('[OpenRouter] Data policy error detected');
          throw new Error('Free model requires data sharing to be enabled. Administrator: enable at https://openrouter.ai/settings/privacy');
        }

        // For other errors, try fallback if available
        if (attempt < maxRetries - 1) {
          console.log(`[Analysis] Error with ${currentKeyName}, trying fallback key...`);
          continue;
        } else {
          // Last attempt failed
          throw error;
        }
      }
    }

    if (!parsedAnalysis) {
      const errorDetails = lastError ? lastError.message : 'Unknown error';
      console.error('[Analysis] All retry attempts failed. Last error:', errorDetails);
      throw lastError || new Error('No analysis generated after all retry attempts');
    }

    const analysis = parsedAnalysis;

    // --- Server-side scoring validation ---
    // 1. Clamp every category score to 1-10 range
    const categoryKeys = ['data_collection', 'data_sharing', 'user_rights', 'security_measures', 'compliance_framework', 'transparency'] as const;
    for (const key of categoryKeys) {
      if (analysis.categories?.[key]?.score != null) {
        analysis.categories[key].score = Math.max(1, Math.min(10, Math.round(analysis.categories[key].score * 10) / 10));
      }
    }

    // 2. Recalculate overall_score as a proper weighted average
    const weights: Record<string, number> = {
      data_collection: 0.30,
      data_sharing: 0.25,
      user_rights: 0.20,
      security_measures: 0.15,
      compliance_framework: 0.07,
      transparency: 0.03,
    };
    let weightedSum = 0;
    let totalWeight = 0;
    for (const key of categoryKeys) {
      const score = analysis.categories?.[key]?.score;
      if (score != null) {
        weightedSum += score * weights[key];
        totalWeight += weights[key];
      }
    }
    if (totalWeight > 0) {
      analysis.overall_score = Math.round((weightedSum / totalWeight) * 100) / 100;
    }

    // 3. Derive risk_level deterministically from recalculated score
    const overallScore = analysis.overall_score;
    if (overallScore >= 9) {
      analysis.risk_level = 'EXEMPLARY';
    } else if (overallScore >= 7) {
      analysis.risk_level = 'LOW';
    } else if (overallScore >= 5) {
      analysis.risk_level = 'MODERATE';
    } else if (overallScore >= 3) {
      analysis.risk_level = 'MODERATE-HIGH';
    } else {
      analysis.risk_level = 'HIGH';
    }

    // 4. Derive privacy_grade deterministically from recalculated score
    if (overallScore >= 9.5) {
      analysis.privacy_grade = 'A+';
    } else if (overallScore >= 9) {
      analysis.privacy_grade = 'A';
    } else if (overallScore >= 8.5) {
      analysis.privacy_grade = 'A-';
    } else if (overallScore >= 8) {
      analysis.privacy_grade = 'B+';
    } else if (overallScore >= 7.5) {
      analysis.privacy_grade = 'B';
    } else if (overallScore >= 7) {
      analysis.privacy_grade = 'B-';
    } else if (overallScore >= 6.5) {
      analysis.privacy_grade = 'C+';
    } else if (overallScore >= 6) {
      analysis.privacy_grade = 'C';
    } else if (overallScore >= 5.5) {
      analysis.privacy_grade = 'C-';
    } else if (overallScore >= 5) {
      analysis.privacy_grade = 'D+';
    } else if (overallScore >= 4.5) {
      analysis.privacy_grade = 'D';
    } else if (overallScore >= 4) {
      analysis.privacy_grade = 'D-';
    } else {
      analysis.privacy_grade = 'F';
    }

    console.log(`[Scoring] Validated scores - overall: ${analysis.overall_score}, grade: ${analysis.privacy_grade}, risk: ${analysis.risk_level}`);
    // --- End scoring validation ---

    // Save analysis to the database if available
    if (db) {
      try {
        console.log('[DB] Saving analysis to database...');
        const analysisId = await saveAnalysis(
          sanitizedUrl,
          content,
          analysis as AnalysisData,
          {
            scraperUsed,
            homepageScreenshot
          }
        );
        console.log(`[DB] ✓ Analysis saved with ID: ${analysisId}`);
      } catch (dbError) {
        console.error('[DB] ✗ Failed to save analysis:', dbError);
        // Non-blocking - continue even if save fails
      }
    }

    // Add metadata
    const result = {
      url: sanitizedUrl,
      homepage_url: homepageUrl,
      homepage_screenshot: homepageScreenshot,
      timestamp: new Date().toISOString(),
      content_length: content.length,
      scraper_used: scraperUsed,
      analysis,
      raw_content: content.substring(0, 2000) // First 2000 chars for reference
    };

    return NextResponse.json(result);

  } catch (error: unknown) {
    console.error('Analysis error:', error);

    const errorMessage = error instanceof Error ? error.message : String(error);

    // Specific error handling
    if (errorMessage?.includes('rate limit') || errorMessage?.includes('429')) {
      return NextResponse.json({
        error: 'Rate limit exceeded. Please try again in a moment.'
      }, { status: 429 });
    }

    if (errorMessage?.includes('404') && errorMessage?.includes('data policy')) {
      return NextResponse.json({
        error: 'API configuration error. The free model requires data policy configuration. Please contact the administrator.',
        details: 'The free AI model requires enabling data sharing on OpenRouter. Administrator: configure at https://openrouter.ai/settings/privacy'
      }, { status: 500 });
    }

    if (errorMessage?.includes('data sharing') || errorMessage?.includes('data policy settings')) {
      return NextResponse.json({
        error: 'API configuration required. The free AI model needs to be enabled.',
        details: 'Administrator: Please enable data sharing for free models at https://openrouter.ai/settings/privacy'
      }, { status: 500 });
    }

    if (errorMessage?.includes('OpenRouter API returned an error page')) {
      return NextResponse.json({
        error: 'AI service configuration error. Please contact the administrator.',
        details: errorMessage
      }, { status: 500 });
    }

    if (errorMessage?.includes('API key') || errorMessage?.includes('401') || errorMessage?.includes('403')) {
      return NextResponse.json({
        error: 'API configuration error. Please contact support.'
      }, { status: 500 });
    }

    if (errorMessage?.includes('timeout') || errorMessage?.includes('ETIMEDOUT')) {
      return NextResponse.json({
        error: 'Request timed out. The website may be slow or unresponsive. Please try again.'
      }, { status: 504 });
    }

    if (errorMessage?.includes('ENOTFOUND') || errorMessage?.includes('ECONNREFUSED')) {
      return NextResponse.json({
        error: 'Could not connect to the website. Please check the URL and try again.'
      }, { status: 400 });
    }

    if (errorMessage?.includes('AbortError')) {
      return NextResponse.json({
        error: 'Request was cancelled due to timeout. Please try again.'
      }, { status: 408 });
    }

    // Log the full error for debugging
    console.error('Unhandled error details:', {
      message: errorMessage,
      stack: error instanceof Error ? error.stack : undefined,
      type: error instanceof Error ? error.constructor.name : typeof error
    });

    // Always return error details for better debugging
    return NextResponse.json({
      error: 'Analysis failed. Please try again or contact us or raise an issue on GitHub if the issue persists.',
      details: errorMessage,
      debugInfo: {
        errorType: error instanceof Error ? error.constructor.name : typeof error,
        timestamp: new Date().toISOString()
      }
    }, { status: 500 });
  }
}