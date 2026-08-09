import { NextRequest, NextResponse } from 'next/server';
import { OpenRouter } from '@openrouter/sdk';
import FirecrawlApp from '@mendable/firecrawl-js';
import { validateUrl } from '@/lib/input-validation';
import { hasNodeJSRuntime } from '@/lib/platform-detector';

// Convert raw HTML to plain text
function htmlToText(html: string): string {
  let text = html;
  // Remove script, style, noscript, svg, iframe tags and their content
  text = text.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  text = text.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '');
  text = text.replace(/<noscript\b[^<]*(?:(?!<\/noscript>)<[^<]*)*<\/noscript>/gi, '');
  text = text.replace(/<svg\b[^<]*(?:(?!<\/svg>)<[^<]*)*<\/svg>/gi, '');
  text = text.replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '');
  // Add newlines after block elements
  text = text.replace(/<\/(?:p|div|h[1-6]|li|tr)>/gi, '\n');
  text = text.replace(/<br\s*\/?>/gi, '\n');
  // Strip remaining HTML tags
  text = text.replace(/<[^>]+>/g, ' ');
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
  // Collapse whitespace and newlines
  text = text.replace(/[ \t]+/g, ' ');
  text = text.replace(/\n{3,}/g, '\n\n');
  return text.trim();
}

// Truncate content at a natural boundary instead of hard cut
function smartTruncate(content: string, maxLength: number): string {
  if (content.length <= maxLength) return content;

  const searchStart = maxLength - 500;
  const region = content.substring(Math.max(0, searchStart), maxLength);

  // Try to find last sentence boundary
  const sentenceMatch = region.match(/.*[.?!][\s\n]/);
  if (sentenceMatch) {
    return content.substring(0, Math.max(0, searchStart) + sentenceMatch[0].length).trim();
  }

  // Try paragraph boundary
  const paraIndex = region.lastIndexOf('\n\n');
  if (paraIndex !== -1) {
    return content.substring(0, Math.max(0, searchStart) + paraIndex).trim();
  }

  // Try last space
  const spaceIndex = content.lastIndexOf(' ', maxLength);
  if (spaceIndex > maxLength - 500) {
    return content.substring(0, spaceIndex).trim();
  }

  // Hard fallback
  return content.substring(0, maxLength);
}

// Runtime configuration - Node.js for Playwright support and longer timeouts
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 60;

// OpenRouter models in fallback order: default (primary) first, then each fallback on failure.
// https://openrouter.ai/openrouter/free  (default — auto-routed free model)
// https://openrouter.ai/nvidia/nemotron-3-ultra-550b-a55b:free
// https://openrouter.ai/openai/gpt-oss-20b:free
const ANALYSIS_MODELS = [
  'openrouter/free',
  'nvidia/nemotron-3-ultra-550b-a55b:free',
  'openai/gpt-oss-20b:free',
] as const;

// Initialize OpenRouter client (OPENROUTER_API_0 is the default key)
function getOpenRouterClient() {
  return new OpenRouter({
    apiKey: process.env.OPENROUTER_API_0 || process.env.OPENROUTER_API,
    httpReferer: "https://privacyanalyzer.in",
    xTitle: "PrivacyAnalyzer - Privacy Policy Analyzer",
  });
}

// Initialize Firecrawl client
function getFirecrawlClient() {
  if (!process.env.FIRECRAWL_API_KEY) {
    throw new Error('FIRECRAWL_API_KEY environment variable is required');
  }
  return new FirecrawlApp({ apiKey: process.env.FIRECRAWL_API_KEY });
}

// Simple fetch fallback
async function scrapeWithFetch(url: string): Promise<string> {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
      },
      signal: AbortSignal.timeout(30000),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const html = await response.text();
    const textContent = htmlToText(html);

    return textContent;
  } catch (error) {
    console.error('Fetch scraping failed:', error);
    throw error;
  }
}

// Crawlee PlaywrightCrawler fallback
// Only available in Node.js runtime, not in Edge Runtime
async function scrapeWithCrawlee(url: string): Promise<string> {
  // Check if we're running in Node.js environment with Playwright support
  if (!hasNodeJSRuntime()) {
    throw new Error('Playwright is not available in Edge Runtime. Use Firecrawl or fetch fallback instead.');
  }

  let extractedContent = '';

  try {
    // Dynamic import of Playwright to avoid loading in Edge Runtime
    const { PlaywrightCrawler } = await import('@crawlee/playwright');

    const crawler = new PlaywrightCrawler({
      maxRequestsPerCrawl: 1,
      headless: true,
      navigationTimeoutSecs: 30,
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
      browserPoolOptions: {
        useFingerprints: true,
        fingerprintOptions: {
          fingerprintGeneratorOptions: {
            browsers: [{ name: 'chrome', minVersion: 120 }],
            devices: ['desktop'],
            operatingSystems: ['windows'],
          },
        },
      },
      async requestHandler({ page, request }) {
        console.log(`Crawling: ${request.url}`);
        await page.waitForLoadState('domcontentloaded');
        await page.waitForTimeout(2000);

        extractedContent = await page.evaluate(() => {
          const elementsToRemove = document.querySelectorAll('script, style, noscript, svg, iframe, nav, header, footer, aside, [role="navigation"], [role="banner"], [role="complementary"]');
          elementsToRemove.forEach(el => el.remove());

          const selectors = [
            'main', '[role="main"]', '.main-content', '#main-content',
            '.content', '#content', '.privacy-policy', '.policy-content',
            'article', '.article-content', '.post-content', '.entry-content',
            '.container', 'body'
          ];

          for (const selector of selectors) {
            const element = document.querySelector(selector);
            if (element && element.textContent && element.textContent.trim().length > 500) {
              return element.textContent.trim();
            }
          }

          return document.body.textContent?.trim() || '';
        });
      },
      failedRequestHandler({ request }) {
        console.error(`Request ${request.url} failed multiple times`);
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
    if (!process.env.OPENROUTER_API_0 && !process.env.OPENROUTER_API) {
      return NextResponse.json(
        {
          success: false,
          error: 'API configuration error',
          message: 'No OpenRouter API key configured (set OPENROUTER_API_0)'
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

    // Analyze with AI, trying the primary model first and falling back on failure.
    const openrouter = getOpenRouterClient();
    let analysisText: string | undefined;
    let lastModelError: Error | null = null;

    for (const model of ANALYSIS_MODELS) {
      try {
        console.log(`[API v1] Sending request to model: ${model}`);
        const completion = await openrouter.chat.send({
          chatGenerationParams: {
            model,
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

        analysisText = completion.choices[0]?.message?.content as string | undefined;
        if (analysisText) break;
      } catch (modelError) {
        lastModelError = modelError instanceof Error ? modelError : new Error(String(modelError));
        console.error(`[API v1] Model ${model} failed:`, lastModelError.message);
      }
    }

    if (!analysisText) {
      throw lastModelError || new Error('No analysis generated');
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

    console.log(`[API v1] [Scoring] Validated scores - overall: ${analysis.overall_score}, grade: ${analysis.privacy_grade}, risk: ${analysis.risk_level}`);
    // --- End scoring validation ---

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
