import { NextRequest, NextResponse } from 'next/server';
import { OpenRouter } from '@openrouter/sdk';
import FirecrawlApp from '@mendable/firecrawl-js';
import { validateUrl } from '@/lib/input-validation';
import { hasNodeJSRuntime } from '@/lib/platform-detector';

// Runtime configuration for Cloudflare Workers via OpenNext
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 60;

// Initialize OpenRouter client
function getOpenRouterClient() {
  return new OpenRouter({
    apiKey: process.env.OPENROUTER_API,
  });
}

// Initialize Firecrawl client
function getFirecrawlClient() {
  if (!process.env.FIRECRAWL_API_KEY) {
    throw new Error('FIRECRAWL_API_KEY environment variable is required');
  }
  return new FirecrawlApp({ apiKey: process.env.FIRECRAWL_API_KEY });
}

// Clean raw HTML into readable text
function htmlToText(html: string): string {
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
    .replace(/<noscript\b[^<]*(?:(?!<\/noscript>)<[^<]*)*<\/noscript>/gi, '')
    .replace(/<svg\b[^<]*(?:(?!<\/svg>)<[^<]*)*<\/svg>/gi, '')
    .replace(/<\/(p|div|h[1-6]|li|tr|br|blockquote|section|article)>/gi, '\n')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/&#\d+;/g, '')
    .replace(/[ \t]+/g, ' ')
    .replace(/\n\s*\n/g, '\n')
    .trim();
}

// Truncate content at a sentence boundary near the limit
function smartTruncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  const truncated = text.substring(0, maxLength);
  const lastPeriod = truncated.lastIndexOf('. ');
  const lastNewline = truncated.lastIndexOf('\n');
  const cutPoint = Math.max(lastPeriod, lastNewline);
  if (cutPoint > maxLength * 0.7) {
    return truncated.substring(0, cutPoint + 1);
  }
  return truncated;
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
        'Upgrade-Insecure-Requests': '1',
        'Sec-Fetch-Dest': 'document',
        'Sec-Fetch-Mode': 'navigate',
        'Sec-Fetch-Site': 'none',
        'Sec-Fetch-User': '?1',
      },
      signal: AbortSignal.timeout(30000),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const html = await response.text();
    return htmlToText(html);
  } catch (error) {
    console.error('Fetch scraping failed:', error);
    throw error;
  }
}

// Crawlee PlaywrightCrawler fallback
// Only available in Node.js runtime, not in Edge Runtime
async function scrapeWithCrawlee(url: string): Promise<string> {
  if (!hasNodeJSRuntime()) {
    throw new Error('Playwright is not available in Edge Runtime. Use Firecrawl or fetch fallback instead.');
  }

  let extractedContent = '';

  try {
    const { PlaywrightCrawler } = await import('@crawlee/playwright');

    const crawler = new PlaywrightCrawler({
      maxRequestsPerCrawl: 1,
      headless: true,
      navigationTimeoutSecs: 30,
      maxRequestRetries: 2,
      requestHandlerTimeoutSecs: 60,

      browserPoolOptions: {
        useFingerprints: true,
        fingerprintOptions: {
          fingerprintGeneratorOptions: {
            browsers: [{ name: 'chrome' as const, minVersion: 120 }],
            devices: ['desktop' as const],
            operatingSystems: ['windows' as const],
            locales: ['en-US', 'en'],
          },
        },
      },

      launchContext: {
        launchOptions: {
          args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-gpu',
          ],
        },
      },

      sessionPoolOptions: {
        maxPoolSize: 1,
        sessionOptions: { maxUsageCount: 1 },
      },

      postNavigationHooks: [
        async ({ page, log }) => {
          try {
            await page.waitForLoadState('domcontentloaded', { timeout: 10000 });
            await page.waitForTimeout(2000);
          } catch {
            log.warning('Timeout waiting for page load state, proceeding anyway');
          }
        },
      ],

      async requestHandler({ page, log }) {
        log.info(`Extracting content from: ${url}`);

        extractedContent = await page.evaluate(() => {
          const elementsToRemove = document.querySelectorAll(
            'script, style, noscript, svg, nav, header, footer, aside, [role="navigation"], [role="banner"], [role="complementary"], .advertisement, .ads'
          );
          elementsToRemove.forEach(el => el.remove());

          const selectors = [
            'main', '[role="main"]', '.main-content', '#main-content',
            '.content', '#content', '.privacy-policy', '.policy-content',
            'article', '.article-content', '.post-content', '.entry-content',
            '.page-content', '.container', 'body'
          ];

          for (const selector of selectors) {
            const element = document.querySelector(selector);
            if (element && element.textContent && element.textContent.trim().length > 500) {
              return element.textContent.trim();
            }
          }

          return document.body.textContent?.trim() || '';
        });

        log.info(`Content extracted, length: ${extractedContent.length}`);
      },

      failedRequestHandler({ request, log }, error) {
        const errorMsg = error instanceof Error ? error.message : String(error);
        log.error(`Request ${request.url} failed: ${errorMsg}`);
      },
    });

    await crawler.run([url]);
    await crawler.teardown();

    return extractedContent;
  } catch (error) {
    console.error('Crawlee scraping failed:', error);
    throw error;
  }
}

const PRIVACY_ANALYSIS_PROMPT = `
You are a certified privacy policy expert with expertise in GDPR, CCPA, DPDP Act 2023 (India), PIPEDA, and international data protection frameworks. Conduct a comprehensive privacy impact assessment using evidence-based evaluation criteria.

SCORING METHODOLOGY: Rate each category 1-10 (10 = exemplary privacy protection, 1 = significant privacy risk)

**DATA MINIMIZATION & COLLECTION PRACTICES (Weight: 30%)**
Evaluate against GDPR Art. 5(1)(c), DPDP Act 2023 Sec. 5, and privacy-by-design principles:
- Collection scope: Only necessary data for stated purposes (10), excessive collection without justification (1-3)
- Legal basis clarity: Explicit lawful basis identification (Art. 6 GDPR, Sec. 6 DPDP Act)
- Purpose specification: Clear, specific purposes vs. vague "business operations"
- Sensitive data handling: Special category data protections (Art. 9 GDPR, Sec. 9 DPDP Act)
- Children's data: COPPA/GDPR-K/DPDP Act Sec. 9 compliance for minors
- Notice and consent: Clear, informed consent mechanisms per DPDP Act requirements

**THIRD-PARTY DATA SHARING & TRANSFERS (Weight: 25%)**
Assess data controller/processor relationships and transfer mechanisms:
- Sharing scope: No sharing (10), limited with consent (7-8), extensive commercial sharing (1-4)
- International transfers: Adequate country/SCCs/BCRs compliance (GDPR Ch. V, DPDP Act Sec. 16)
- Processor agreements: Evidence of Art. 28 GDPR/DPDP Act Sec. 8 compliant contracts
- Consent mechanisms: Granular, withdrawable consent vs. bundled/forced consent
- Cross-border transfers: DPDP Act restricted country compliance
- Commercial exploitation: Data monetization practices and user awareness

**INDIVIDUAL RIGHTS & DATA SUBJECT CONTROLS (Weight: 20%)**
Evaluate GDPR Chapter III and DPDP Act Chapter IV rights implementation:
- Access rights (Art. 15 GDPR, Sec. 11 DPDP Act): Comprehensive data access mechanisms
- Rectification (Art. 16 GDPR, Sec. 12 DPDP Act): Error correction processes
- Erasure (Art. 17 GDPR, Sec. 12 DPDP Act): Right to be forgotten/deletion implementation
- Portability (Art. 20 GDPR): Structured data export capabilities
- Objection (Art. 21 GDPR): Opt-out mechanisms for processing
- Withdrawal of consent (DPDP Act Sec. 7): Easy withdrawal mechanisms
- Grievance redressal (DPDP Act Sec. 32): Complaint handling procedures
- Response timeframes: Compliance with regulatory requirements (30 days GDPR, reasonable time DPDP)

**SECURITY & RISK MANAGEMENT (Weight: 15%)**
Technical and organizational measures assessment (GDPR Art. 32, DPDP Act Sec. 8):
- Encryption standards: End-to-end, in-transit, at-rest protections
- Access controls: Role-based access, multi-factor authentication
- Incident response: Breach notification procedures (72-hour GDPR, 72-hour DPDP Act requirements)
- Risk assessment: Regular privacy impact assessments
- Data retention: Defined, justified retention periods with deletion schedules
- Data localization: DPDP Act compliance for sensitive personal data storage

**REGULATORY COMPLIANCE & LEGAL FRAMEWORK (Weight: 7%)**
Multi-jurisdictional compliance evaluation:
- GDPR compliance indicators (EU users)
- CCPA compliance markers (California residents)
- DPDP Act 2023 compliance (Indian users): Registration requirements, Data Protection Officer
- Sectoral compliance (HIPAA, FERPA, GLBA where applicable)
- Privacy officer designation and contact information
- Legal basis documentation and consent records management
- Data Protection Board registration (DPDP Act Sec. 25) where required

**TRANSPARENCY & COMMUNICATION (Weight: 3%)**
Information quality and accessibility assessment:
- Language clarity: Plain language vs. legal jargon (Flesch-Kincaid readability)
- Policy accessibility: Layered notices, mobile optimization, vernacular language support
- Change notification: Proactive user notification mechanisms
- Contact mechanisms: Dedicated privacy contact/DPO information
- Grievance officer details (DPDP Act requirement)

RISK CATEGORIZATION:
- HIGH RISK (1-3): Significant privacy violations likely, regulatory action probable
- MODERATE-HIGH RISK (4-5): Multiple compliance gaps, user privacy compromised
- MODERATE RISK (6-7): Some privacy protections present, areas for improvement
- LOW RISK (8-9): Strong privacy framework with minor gaps
- EXEMPLARY (10): Privacy-by-design implementation, exceeds regulatory minimums

Provide your response in this JSON format:
{
  "overall_score": number (1-10, weighted average),
  "risk_level": "string (HIGH/MODERATE-HIGH/MODERATE/LOW/EXEMPLARY)",
  "regulatory_compliance": {
    "gdpr_compliance": "string (COMPLIANT/PARTIALLY_COMPLIANT/NON_COMPLIANT)",
    "ccpa_compliance": "string (COMPLIANT/PARTIALLY_COMPLIANT/NON_COMPLIANT/NOT_APPLICABLE)",
    "dpdp_act_compliance": "string (COMPLIANT/PARTIALLY_COMPLIANT/NON_COMPLIANT/NOT_APPLICABLE)",
    "major_violations": ["string array of specific regulatory violations"]
  },
  "categories": {
    "data_collection": {"score": number, "reasoning": "string with specific evidence", "regulatory_notes": "string"},
    "data_sharing": {"score": number, "reasoning": "string with specific evidence", "regulatory_notes": "string"},
    "user_rights": {"score": number, "reasoning": "string with specific evidence", "regulatory_notes": "string"},
    "security_measures": {"score": number, "reasoning": "string with specific evidence", "regulatory_notes": "string"},
    "compliance_framework": {"score": number, "reasoning": "string with specific evidence", "regulatory_notes": "string"},
    "transparency": {"score": number, "reasoning": "string with specific evidence", "regulatory_notes": "string"}
  },
  "critical_findings": {
    "high_risk_practices": ["specific practices that pose significant privacy risks"],
    "regulatory_gaps": ["compliance requirements not met"],
    "data_subject_impacts": ["potential harms to individuals"]
  },
  "positive_practices": ["privacy-protective practices that exceed minimum requirements"],
  "actionable_recommendations": {
    "immediate_actions": ["urgent compliance actions required"],
    "medium_term_improvements": ["privacy enhancements to implement"],
    "best_practice_adoption": ["industry leading practices to consider"]
  },
  "privacy_grade": "string (A+ to F based on risk level)",
  "executive_summary": "Professional 2-3 sentence assessment suitable for stakeholders"
}
`;

export async function POST(request: NextRequest) {
  try {
    console.log('[API v1] Privacy analysis request received');

    const body = await request.json();
    const { url: privacyUrl } = body;

    if (!privacyUrl) {
      return NextResponse.json(
        {
          success: false,
          error: 'Privacy policy URL is required',
          message: 'Please provide a privacy policy URL in the request body as "url"'
        },
        { status: 400 }
      );
    }

    // Validate URL
    const urlValidation = validateUrl(privacyUrl);
    if (!urlValidation.valid) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid URL',
          message: urlValidation.error || 'The provided URL is not valid'
        },
        { status: 400 }
      );
    }

    const sanitizedUrl = urlValidation.sanitized!;

    // Check API configuration
    if (!process.env.OPENROUTER_API) {
      return NextResponse.json(
        {
          success: false,
          error: 'API configuration error',
          message: 'OPENROUTER_API key not configured'
        },
        { status: 500 }
      );
    }

    console.log('[API v1] Scraping URL:', sanitizedUrl);

    let content = '';
    let scraperUsed = 'unknown';

    // Try Firecrawl first
    if (process.env.FIRECRAWL_API_KEY) {
      console.log('[API v1] Attempting Firecrawl...');
      try {
        const firecrawl = getFirecrawlClient();

        let scrapeResult: unknown;
        try {
          scrapeResult = await (firecrawl as unknown as { scrape: (params: { url: string; formats: string[]; onlyMainContent: boolean; waitFor: number; timeout?: number }) => Promise<unknown> }).scrape({
            url: sanitizedUrl,
            formats: ['markdown'],
            onlyMainContent: true,
            waitFor: 2000,
            timeout: 30000,
          });
        } catch {
          scrapeResult = await (firecrawl as unknown as { scrape: (url: string, params: { formats: string[]; onlyMainContent: boolean }) => Promise<unknown> }).scrape(sanitizedUrl, {
            formats: ['markdown'],
            onlyMainContent: true,
          });
        }

        if (scrapeResult) {
          const response = scrapeResult as Record<string, unknown>;

          if (response.data && typeof response.data === 'object') {
            const data = response.data as Record<string, unknown>;
            if (typeof data.markdown === 'string') {
              content = data.markdown;
            }
          } else if (response.success && response.data && typeof response.data === 'object') {
            const data = response.data as Record<string, unknown>;
            content = (typeof data.markdown === 'string' ? data.markdown : '') ||
                      (typeof data.content === 'string' ? data.content : '') || '';
          } else if (typeof response.markdown === 'string') {
            content = response.markdown;
          }
        }

        if (content && content.length >= 100) {
          scraperUsed = 'firecrawl';
          console.log('[API v1] Firecrawl success, length:', content.length);
        } else {
          throw new Error('Insufficient content');
        }

      } catch (firecrawlError) {
        console.error('[API v1] Firecrawl failed:', firecrawlError);
        content = '';
      }
    }

    // Fallback to Crawlee
    if (!content || content.length < 100) {
      console.log('[API v1] Falling back to Crawlee...');
      try {
        content = await scrapeWithCrawlee(sanitizedUrl);
        scraperUsed = 'crawlee';

        if (!content || content.length < 100) {
          throw new Error('Insufficient content');
        }

        console.log('[API v1] Crawlee success, length:', content.length);

      } catch (crawleeError) {
        console.error('[API v1] Crawlee failed:', crawleeError);

        // Final fallback: fetch
        console.log('[API v1] Falling back to fetch...');
        try {
          content = await scrapeWithFetch(sanitizedUrl);
          scraperUsed = 'fetch';

          if (!content || content.length < 100) {
            return NextResponse.json({
              success: false,
              error: 'Content extraction failed',
              message: 'Could not extract sufficient content from the URL. The page may be protected or use JavaScript rendering.'
            }, { status: 400 });
          }

          console.log('[API v1] Fetch success, length:', content.length);
        } catch (fetchError) {
          console.error('[API v1] All scraping methods failed:', fetchError);

          return NextResponse.json({
            success: false,
            error: 'Scraping failed',
            message: 'Failed to extract content from the URL. Please verify the URL is accessible.'
          }, { status: 400 });
        }
      }
    }

    // Validate privacy policy content
    const privacyKeywords = ['privacy', 'personal information', 'data collection', 'cookies', 'third party'];
    const hasPrivacyContent = privacyKeywords.some(keyword =>
      content.toLowerCase().includes(keyword.toLowerCase())
    );

    if (!hasPrivacyContent) {
      return NextResponse.json({
        success: false,
        error: 'Invalid content',
        message: 'The extracted content does not appear to be a privacy policy. Please provide a direct link to a privacy policy page.'
      }, { status: 400 });
    }

    console.log('[API v1] Analyzing with AI...');

    // Analyze with AI
    const openrouter = getOpenRouterClient();
    const completion = await openrouter.chat.send({
      chatGenerationParams: {
        model: "openrouter/free",
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
        temperature: 0.3,
        maxTokens: 2000,
        stream: false,
      },
    });

    const analysisText = completion.choices[0]?.message?.content;

    if (!analysisText) {
      throw new Error('No analysis generated');
    }

    // Parse JSON response
    let analysis;
    try {
      const jsonMatch = analysisText.match(/\{[\s\S]*\}/);
      const jsonText = jsonMatch ? jsonMatch[0] : analysisText;
      analysis = JSON.parse(jsonText);
    } catch (parseError) {
      console.error('[API v1] Failed to parse AI response:', parseError);
      throw new Error('Failed to parse analysis results');
    }

    // --- Server-side scoring validation ---
    // Define category weights (must match the prompt)
    const CATEGORY_WEIGHTS: Record<string, number> = {
      data_collection: 30,
      data_sharing: 25,
      user_rights: 20,
      security_measures: 15,
      compliance_framework: 7,
      transparency: 3,
    };

    // Clamp each category score to 1-10 range
    if (analysis.categories && typeof analysis.categories === 'object') {
      for (const key of Object.keys(analysis.categories)) {
        const cat = analysis.categories[key];
        if (cat && typeof cat.score === 'number') {
          cat.score = Math.round(Math.min(10, Math.max(1, cat.score)) * 10) / 10;
        }
      }
    }

    // Recalculate overall_score as the true weighted average
    let weightedSum = 0;
    let totalWeight = 0;
    for (const [key, weight] of Object.entries(CATEGORY_WEIGHTS)) {
      const cat = analysis.categories?.[key];
      if (cat && typeof cat.score === 'number') {
        weightedSum += cat.score * weight;
        totalWeight += weight;
      }
    }
    if (totalWeight > 0) {
      analysis.overall_score = Math.round((weightedSum / totalWeight) * 10) / 10;
    }

    // Derive risk_level deterministically from overall_score
    if (analysis.overall_score >= 9) {
      analysis.risk_level = 'EXEMPLARY';
    } else if (analysis.overall_score >= 7) {
      analysis.risk_level = 'LOW';
    } else if (analysis.overall_score >= 5) {
      analysis.risk_level = 'MODERATE';
    } else if (analysis.overall_score >= 3) {
      analysis.risk_level = 'MODERATE-HIGH';
    } else {
      analysis.risk_level = 'HIGH';
    }

    // Derive privacy_grade deterministically from overall_score
    if (analysis.overall_score >= 9.5) analysis.privacy_grade = 'A+';
    else if (analysis.overall_score >= 9) analysis.privacy_grade = 'A';
    else if (analysis.overall_score >= 8.5) analysis.privacy_grade = 'A-';
    else if (analysis.overall_score >= 8) analysis.privacy_grade = 'B+';
    else if (analysis.overall_score >= 7.5) analysis.privacy_grade = 'B';
    else if (analysis.overall_score >= 7) analysis.privacy_grade = 'B-';
    else if (analysis.overall_score >= 6.5) analysis.privacy_grade = 'C+';
    else if (analysis.overall_score >= 6) analysis.privacy_grade = 'C';
    else if (analysis.overall_score >= 5.5) analysis.privacy_grade = 'C-';
    else if (analysis.overall_score >= 5) analysis.privacy_grade = 'D+';
    else if (analysis.overall_score >= 4.5) analysis.privacy_grade = 'D';
    else if (analysis.overall_score >= 4) analysis.privacy_grade = 'D-';
    else analysis.privacy_grade = 'F';

    console.log('[API v1] Analysis complete');

    // Return clean JSON response
    return NextResponse.json({
      success: true,
      data: {
        url: sanitizedUrl,
        timestamp: new Date().toISOString(),
        scraper_used: scraperUsed,
        content_length: content.length,
        analysis: {
          overall_score: analysis.overall_score,
          privacy_grade: analysis.privacy_grade,
          risk_level: analysis.risk_level,
          executive_summary: analysis.executive_summary,
          regulatory_compliance: analysis.regulatory_compliance,
          categories: analysis.categories,
          critical_findings: analysis.critical_findings,
          positive_practices: analysis.positive_practices,
          actionable_recommendations: analysis.actionable_recommendations
        }
      }
    });

  } catch (error: unknown) {
    console.error('[API v1] Error:', error);

    const errorMessage = error instanceof Error ? error.message : String(error);

    // Specific error handling
    if (errorMessage?.includes('rate limit') || errorMessage?.includes('429')) {
      return NextResponse.json({
        success: false,
        error: 'Rate limit exceeded',
        message: 'Please try again in a moment.'
      }, { status: 429 });
    }

    if (errorMessage?.includes('timeout') || errorMessage?.includes('ETIMEDOUT')) {
      return NextResponse.json({
        success: false,
        error: 'Timeout',
        message: 'Request timed out. The website may be slow or unresponsive.'
      }, { status: 504 });
    }

    if (errorMessage?.includes('ENOTFOUND') || errorMessage?.includes('ECONNREFUSED')) {
      return NextResponse.json({
        success: false,
        error: 'Connection failed',
        message: 'Could not connect to the website. Please check the URL.'
      }, { status: 400 });
    }

    console.error('[API v1] Unhandled error:', {
      message: errorMessage,
      stack: error instanceof Error ? error.stack : undefined
    });

    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      message: 'Analysis failed. Please try again or contact support.',
      details: process.env.NODE_ENV === 'development' ? errorMessage : undefined
    }, { status: 500 });
  }
}
