# 🔒 PrivacyAnalyzer.in - Privacy Policy Analyser

<div align="center">

[![Next.js](https://img.shields.io/badge/Next.js-15.5.2-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)

**India's first AI-powered privacy policy analyzer helping users understand how websites handle their personal data with comprehensive DPDP Act 2023 and DPDP Rules 2025 compliance analysis.**

[🌐 Live Demo](https://privacyanalyzer.in) · [📖 Methodology](https://privacyanalyzer.in/methodology) · [🐛 Report Bug](https://github.com/privacypriority/privacyanalyzer/issues) · [✨ Request Feature](https://github.com/privacypriority/privacyanalyzer/issues)

</div>

---

## 📋 Table of Contents

- [About](#-about)
- [Features](#-features)
- [Analysis Methodology](#-analysis-methodology)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
- [Architecture](#-architecture)
- [API Documentation](#-api-documentation)
- [Contributing](#-contributing)
- [Deployment](#-deployment)
- [Roadmap](#-roadmap)
- [License](#-license)

---

## 🎯 About

PrivacyAnalyzer is a production-ready, AI-powered privacy policy analyzer that empowers users to make informed decisions about their personal data. Using advanced AI models and comprehensive regulatory frameworks, we provide detailed privacy assessments with actionable recommendations.

### Why PrivacyAnalyzer?

- 🇮🇳 **India-Focused**: First privacy analyzer built specifically for India's DPDP Act 2023 and Rules 2025
- 📊 **Dual Scoring System**:
  - **Overall Privacy Score** - User-centric evaluation of data protection practices
  - **DPDP Compliance Score** - Regulatory compliance assessment for business owners
- 🔍 **Evidence-Based Analysis**: Scientific methodology based on DPDP Act 2023, Rules 2025, and international best practices
- 🤖 **AI-Powered**: OpenRouter models (default `openrouter/free`, with NVIDIA Nemotron and GPT-OSS fallbacks) for sophisticated policy analysis
- 📈 **Comprehensive Assessment**: 6-category weighted evaluation with 120+ privacy and compliance criteria
- 🎯 **Complete DPDP Coverage**: Analysis against all 23 Rules and 7 Schedules of DPDP Rules 2025
- 🎨 **Modern UX**: Intuitive dashboard with visual analytics and category breakdowns
- 🚀 **Production-Ready**: Enterprise-grade error handling, fallback systems, and security measures

---

## ✨ Features

### Core Analysis Features

- **🔐 Advanced Privacy Analysis with Dual Scoring**
  - AI-powered comprehensive privacy policy evaluation
  - **Dual Scoring System**:
    - **Overall Privacy Score (1-10)**: User-focused assessment of data protection and privacy practices
    - **DPDP Compliance Score (1-10)**: Regulatory compliance evaluation against DPDP Act 2023 and Rules 2025
  - India DPDP Act 2023 and Rules 2025 compliance assessment
  - 6 weighted categories: Data Minimization & Collection (30%), Third-Party Data Sharing (25%), Individual Rights & Controls (20%), Security & Risk Management (15%), Regulatory Compliance (7%), Transparency & Communication (3%)
  - Evaluation against all 23 Rules and 7 Schedules including:
    - Rule 6: Security safeguards
    - Rule 7: 72-hour breach notification
    - Rule 8: Data retention periods (Class A/B/C Data Fiduciaries)
    - Rule 12: Children's data processing exemptions
    - Rule 13: Significant Data Fiduciary obligations (DPIA, DPO, audits)
    - Rule 14: Data Principal rights implementation
    - Rule 15: Cross-border transfer requirements
  - 5-tier risk classification (HIGH RISK, MODERATE-HIGH RISK, MODERATE RISK, LOW RISK, EXEMPLARY)
  - Letter grades (A+ to F) for quick assessment
  - Evidence-based findings with specific DPDP Act sections and Rules references

- **📊 Interactive Results Dashboard**
  - Dual score display:
    - Overall Privacy Score (1-10) with circular progress visualization
    - DPDP Compliance Score (1-10) with regulatory compliance summary
  - Real-time category breakdown with color-coded mini charts
  - Privacy grade and risk level badges
  - Executive summary for stakeholders
  - Compliance summary specifically for business owners and legal teams
  - Critical findings highlighting high-risk practices
  - Regulatory gaps with specific DPDP Act and Rules violations
  - Positive practices recognition
  - Actionable recommendations (immediate, medium-term, best practices)
  - Detailed regulatory compliance notes with Act sections and Rules references

- **🎨 Enhanced User Experience**
  - Web3-style gradient buttons (blue-purple-pink for Analyze, emerald-teal-cyan for Reset)
  - One-click Reset button to start new analysis
  - Home button for easy navigation back from results
  - Mobile-responsive design with optimized layouts
  - Collapsible methodology section for transparency
  - PWA-ready with custom icons and theme colors

### Technical Features

- **⚡ 3-Tier Scraping System**
  - Primary: Firecrawl API (markdown extraction)
  - Fallback 1: Crawlee PlaywrightCrawler (JavaScript rendering)
  - Fallback 2: Simple fetch (basic HTML parsing)
  - Automatic retry with graceful degradation

- **🔒 Production-Grade Reliability**
  - 60-second API timeout for complex analyses
  - Comprehensive error handling with specific timeout/network messages
  - Global error boundaries (error.tsx, not-found.tsx, loading.tsx)
  - Input validation and URL sanitization
  - Security headers middleware (HSTS, CSP, X-Frame-Options)

- **📱 SEO & Discoverability**
  - Dynamic sitemap.xml generation
  - Robots.txt for search engine indexing
  - Open Graph and Twitter Card metadata
  - Optimized meta descriptions and keywords

### Additional Features

- Comprehensive methodology page with detailed framework explanation
- Privacy education resources
- Category-specific icons and visual indicators
- Color-coded score bars for quick assessment
- Regulatory framework references (90+ compliance criteria)
- Real-time analysis progress indicators

---

## 📐 Analysis Methodology

PrivacyAnalyzer uses a scientifically-grounded, evidence-based framework for privacy assessment focused on India's DPDP Act 2023 and DPDP Rules 2025:

### Dual Scoring System

We provide two distinct scores to serve different audiences:

**1. Overall Privacy Score (User Perspective)**
- **Range**: 1-10
- **Focus**: How well the policy protects user privacy and data rights
- **Audience**: General users wanting to understand privacy risks
- **Factors**: User data protection, transparency, control, privacy-friendly practices

**2. DPDP Compliance Score (Business/Regulatory Perspective)**
- **Range**: 1-10
- **Focus**: Compliance with DPDP Act 2023 and Rules 2025 statutory requirements
- **Audience**: Business owners, compliance officers, legal teams
- **Evaluation Criteria**:
  - Notice requirements (Sec. 5, Rule 3)
  - Consent mechanisms (Sec. 6, Rule 3)
  - Data Principal rights (Sec. 11-13, Rule 14)
  - Security safeguards (Sec. 8, Rule 6)
  - 72-hour breach notification (Rule 7)
  - Retention periods (Rule 8, Third Schedule)
  - Children's data processing (Sec. 9, Rule 12, Fourth Schedule)
  - Consent Manager obligations (Rule 4, First Schedule)
  - Significant Data Fiduciary requirements (Rule 13)
  - Cross-border transfers (Sec. 16, Rule 15)
  - Grievance redressal (Sec. 32)
  - DPO appointment where required (Rule 13)

**Why Two Scores?**

A privacy policy could score high on regulatory compliance (meets all legal requirements) but still have user-unfriendly practices like extensive data sharing. Conversely, a policy might be very user-friendly but missing some regulatory formalities. The dual scoring helps both users and businesses understand the complete picture.

### Assessment Categories (Weighted)

1. **Data Minimization & Collection (30%)**
   - Collection scope, legal basis, purpose specification
   - Sensitive personal data protections (DPDP Act Sec. 9)
   - Children's data compliance (DPDP Act Sec. 9, Rule 12, Fourth Schedule)
   - Data fiduciary obligations and transparency
   - Retention period compliance (Rule 8, Third Schedule - Class A/B/C Data Fiduciaries)
   - Automatic deletion mechanisms post-purpose completion

2. **Third-Party Data Sharing (25%)**
   - Sharing scope and commercial exploitation
   - International transfers to approved countries (DPDP Act Sec. 16, Rule 15)
   - Data processor agreements (DPDP Act Sec. 8)
   - Consent Manager compliance (Rule 4, First Schedule)
   - State data processing exemptions (Rule 5, Second Schedule)

3. **Individual Rights & Controls (20%)**
   - Data Principal rights implementation (DPDP Act Sec. 11-13, Rule 14)
   - Rights: access, correction, erasure, grievance redressal, nomination
   - Data portability and objection mechanisms
   - Grievance redressal mechanisms (DPDP Act Sec. 32)
   - Consent withdrawal procedures (DPDP Act Sec. 7, Rule 14)

4. **Security & Risk Management (15%)**
   - Security safeguards commensurate with data sensitivity (Rule 6)
   - Encryption standards (end-to-end, in-transit, at-rest)
   - 72-hour breach notification to Data Protection Board (Rule 7)
   - Breach disclosure to affected Data Principals (Rule 7)
   - Data Protection Impact Assessments for Significant Data Fiduciaries (Rule 13)
   - Data localization compliance for India

5. **Regulatory Compliance (7%)**
   - DPDP Act 2023 and Rules 2025 compliance indicators
   - Data Protection Board registration (Rules 16-22)
   - Significant Data Fiduciary obligations: DPO, DPIA, audits, logging (Rule 13)
   - Consent Manager registration and technical standards (Rule 4, First Schedule)
   - Legal basis documentation and consent records management (Rule 3)

6. **Transparency & Communication (3%)**
   - Plain language usage and readability
   - Notice content completeness (Rule 3 requirements)
   - Grievance officer details (DPDP Act requirement)
   - Vernacular language support for Indian languages
   - Consent clarity without dark patterns (Rule 4, First Schedule)
   - Proactive change notifications

### Risk Classification

- **EXEMPLARY (10)**: Privacy-by-design implementation, exceeds DPDP Act minimums
- **LOW RISK (8-9)**: Strong privacy framework with minor gaps
- **MODERATE RISK (6-7)**: Some privacy protections present, improvement areas identified
- **MODERATE-HIGH RISK (4-5)**: Multiple compliance gaps, Data Principal rights compromised
- **HIGH RISK (1-3)**: Significant DPDP Act violations likely, Data Protection Board action probable

[View Full Methodology](https://privacyanalyzer.in/methodology)

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 15.5.2 (App Router with Turbopack)
- **Language**: TypeScript 5.0
- **Styling**: Tailwind CSS 3.4
- **UI Components**: shadcn/ui (Radix UI primitives)
- **Icons**: Lucide React
- **Fonts**: Inter (sans-serif), JetBrains Mono (monospace)

### Backend & AI
- **API Routes**: Next.js API Routes (serverless functions)
- **AI Model**: DeepSeek Chat via OpenRouter
- **Web Scraping**:
  - Firecrawl API (primary)
  - Crawlee PlaywrightCrawler (fallback)
  - Native fetch API (final fallback)

### Infrastructure
- **Hosting**: Vercel (Node.js runtime)
- **Database**: Neon Postgres (serverless SQL for caching + history, via Vercel Marketplace)
- **CDN**: Vercel Edge Network
- **Analytics**: Vercel Analytics (optional)
- **Deployment**: CI/CD via Vercel Git integration

### Security & Performance
- Input validation and URL sanitization
- SSRF protection (blocks private IPs, localhost)
- Security headers middleware
- Error boundaries and fallback UI
- PWA-ready with service worker support
- Optimized images (AVIF/WebP)

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- OpenRouter API key (required)
- Firecrawl API key (optional, recommended)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/privacypriority/privacyanalyzer.git
   cd privacyanalyzer
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```

   Edit `.env.local` and add your API keys:
   ```env
   # Required - OpenRouter API for AI analysis
   OPENROUTER_API=your_openrouter_api_key_here

   # Optional - Firecrawl API for better web scraping
   FIRECRAWL_API_KEY=your_firecrawl_api_key_here
   ```

4. **Run development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Building for Production

```bash
# Build the application
npm run build

# Start production server
npm start
```

### Environment Variables

See `.env.example` for a comprehensive list of available environment variables with detailed explanations.

**Required:**
- `OPENROUTER_API`: OpenRouter API key for AI analysis

**Optional:**
- `FIRECRAWL_API_KEY`: Firecrawl API key for enhanced scraping

---

## 🏗️ Architecture

### Project Structure

```
privacyanalyzer/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── api/
│   │   │   └── analyze/
│   │   │       └── route.ts         # Privacy analysis API endpoint with DPDP Rules 2025
│   │   ├── methodology/
│   │   │   └── page.tsx             # Methodology explanation page
│   │   ├── error.tsx                # Global error boundary
│   │   ├── not-found.tsx            # Custom 404 page
│   │   ├── loading.tsx              # Loading state
│   │   ├── layout.tsx               # Root layout with metadata
│   │   ├── sitemap.ts               # Dynamic sitemap generation
│   │   └── page.tsx                 # Homepage
│   ├── components/
│   │   ├── ui/                      # shadcn/ui components
│   │   │   ├── circular-progress.tsx
│   │   │   ├── heatmap.tsx
│   │   │   ├── score-card.tsx
│   │   │   └── ...
│   │   ├── Header.tsx               # Navigation header
│   │   ├── Footer.tsx               # Footer with links
│   │   ├── PrivacyAnalyzer.tsx      # Main analyzer component
│   │   └── MethodologySection.tsx   # Methodology display
│   ├── lib/
│   │   ├── input-validation.ts      # URL validation and sanitization
│   │   ├── db.ts                    # Neon Postgres integration (cache + history)
│   │   └── openrouter-key-manager.ts # API key rotation
│   └── middleware.ts                # Security headers
├── docs/
│   └── regulations/
│       ├── DPDP_Rules_2025.pdf      # DPDP Rules 2025 full text (2.5 MB)
│       └── DPDP_RULES_2025_INTEGRATION.md  # Integration guide
├── public/
│   ├── favicon.ico                  # Favicon (all sizes)
│   ├── robots.txt                   # Search engine directives
│   └── site.webmanifest             # PWA manifest
├── .env.local                       # Environment variables (gitignored)
├── next.config.ts                   # Next.js configuration
├── vercel.json                      # Vercel deployment config
├── DEPLOYMENT.md                    # Deployment guide (Vercel + Neon)
└── package.json                     # Dependencies and scripts
```

### Data Flow

1. **User Input** → URL validation → SSRF protection
2. **Scraping**:
   - Try Firecrawl API (markdown extraction)
   - Fallback to Crawlee (JavaScript rendering)
   - Final fallback to fetch (basic HTML)
3. **AI Analysis**:
   - Send content to DeepSeek Chat via OpenRouter
   - Structured JSON response with scores and findings
4. **Results Display**:
   - Parse and validate AI response
   - Render interactive dashboard
   - Show category breakdowns, compliance status, recommendations

### API Endpoint

**POST `/api/analyze`**
- **Input**: `{ "url": "https://example.com/privacy" }`
- **Output**: Comprehensive privacy analysis JSON
- **Timeout**: 60 seconds (Vercel Pro)
- **Error Handling**: Specific error messages for timeouts, network issues, invalid URLs

---

## 📚 API Documentation

### Analyze Privacy Policy

**Endpoint**: `POST /api/analyze`

**Request Body**:
```json
{
  "url": "https://example.com/privacy"
}
```

**Response**:
```json
{
  "url": "https://example.com/privacy",
  "timestamp": "2025-10-16T10:00:00.000Z",
  "content_length": 15420,
  "scraper_used": "firecrawl",
  "analysis": {
    "overall_score": 8.0,
    "dpdp_compliance_score": 8.5,
    "risk_level": "LOW",
    "privacy_grade": "A-",
    "regulatory_compliance": {
      "dpdp_act_compliance": "COMPLIANT",
      "dpdp_rules_compliance": "COMPLIANT",
      "major_violations": [],
      "compliance_summary": "Policy demonstrates strong DPDP Act 2023 and Rules 2025 compliance with comprehensive notice provisions, clear consent mechanisms, and proper Data Principal rights implementation."
    },
    "categories": {
      "data_collection": {
        "score": 8.5,
        "reasoning": "...",
        "dpdp_notes": "..."
      },
      // ... 5 more categories
    },
    "critical_findings": {
      "high_risk_practices": [],
      "regulatory_gaps": [],
      "data_subject_impacts": []
    },
    "positive_practices": ["..."],
    "actionable_recommendations": {
      "immediate_actions": [],
      "medium_term_improvements": ["..."],
      "best_practice_adoption": ["..."]
    },
    "executive_summary": "..."
  }
}
```

**Error Responses**:
- `400 Bad Request`: Invalid URL, insufficient content
- `408 Request Timeout`: Request cancelled
- `429 Too Many Requests`: Rate limit exceeded (if enabled)
- `504 Gateway Timeout`: Website slow/unresponsive

---

## 🤝 Contributing

We welcome contributions from the community! Here's how you can help:

### Ways to Contribute

- 🐛 **Report Bugs**: [Open an issue](https://github.com/privacypriority/privacyanalyzer/issues/new)
- ✨ **Request Features**: [Submit a feature request](https://github.com/privacypriority/privacyanalyzer/issues/new)
- 📝 **Improve Documentation**: Fix typos, add examples, clarify instructions
- 💻 **Submit Code**: Fix bugs, add features, improve performance
- 🎨 **Design**: Improve UI/UX, create graphics, enhance accessibility
- 🌍 **Translate**: Help make PrivacyAnalyzer multilingual

### Development Workflow

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes with clear, documented code
4. Commit: `git commit -m "feat: add amazing feature"`
5. Push: `git push origin feature/amazing-feature`
6. Open a Pull Request

### Commit Convention

We follow [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `refactor:` Code refactoring
- `perf:` Performance improvements
- `test:` Test additions or changes

---

## 🚢 Deployment

### Vercel (Recommended)

1. **Import Repository**
   - Connect to GitHub in Vercel Dashboard
   - Import the privacyanalyzer repository

2. **Add a Database**
   - Provision **Neon Postgres** from the Vercel Marketplace (**Storage → Create → Neon**)
   - `DATABASE_URL` / `POSTGRES_URL` are injected automatically

3. **Configure Environment Variables**
   - Add `OPENROUTER_API_0` (required — default AI key)
   - Add `FIRECRAWL_API_KEY` (optional)
   - Mark as "Sensitive" in Vercel settings

4. **Deploy**
   ```bash
   vercel --prod
   ```

**Vercel Configuration** (`vercel.json`):
- API route timeout: 60 seconds
- CORS headers configured
- Automatic HTTPS

The database schema is created automatically on first use — no migration step required.

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed instructions.

### Self-Hosting

Requirements:
- Node.js 22+ server
- Process manager (PM2 recommended)
- Reverse proxy (nginx/Apache)
- SSL certificate

```bash
# Install PM2
npm install -g pm2

# Build application
npm run build

# Start with PM2
pm2 start npm --name "privacyanalyzer" -- start

# Configure nginx reverse proxy
# Point to localhost:3000
```

---

## 🗺️ Roadmap

### Version 1.2 (Current - Q4 2025)
- [x] DPDP Rules 2025 integration (all 23 Rules and 7 Schedules)
- [x] Dual scoring system (User Privacy Score + DPDP Compliance Score)
- [x] Cloudflare Workers deployment support
- [x] D1 database caching for analysis results
- [x] Enhanced regulatory compliance assessment
- [x] Comprehensive documentation updates

### Version 1.1 (Completed - Q4 2024)
- [x] Category breakdown visualization
- [x] Web3-style gradient UI enhancements
- [x] Navigation improvements (Home, Reset buttons)
- [x] DPDP Act 2023 integration
- [x] Enhanced error handling
- [x] Stateless architecture (no database dependency)

### Version 1.3 (Q1 2026)
- [ ] Multi-language support (Hindi, Spanish, French)
- [ ] Privacy policy comparison tool
- [ ] Export analysis as PDF with compliance report
- [ ] Browser extension
- [ ] Historical policy tracking with change detection

### Version 2.0 (Q2 2025)
- [ ] Mobile app (React Native)
- [ ] Advanced filtering and search
- [ ] API for third-party integration
- [ ] Custom compliance frameworks
- [ ] Enterprise features (teams, SSO)

See [Issues](https://github.com/privacypriority/privacyanalyzer/issues) for detailed feature requests.

---

## 📄 License

This project is licensed under the Apache License 2.0 - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

### Built With

- [Next.js](https://nextjs.org/) - React framework
- [OpenRouter](https://openrouter.ai/) - AI API gateway
- [DeepSeek](https://www.deepseek.com/) - AI model
- [Firecrawl](https://firecrawl.dev/) - Web scraping
- [Crawlee](https://crawlee.dev/) - Web crawling framework
- [shadcn/ui](https://ui.shadcn.com/) - UI components
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [Lucide](https://lucide.dev/) - Icon library
- [Vercel](https://vercel.com/) - Hosting platform

### Regulatory Framework

- [DPDP Act 2023](https://www.meity.gov.in/static/uploads/2024/06/2bf1f0e9f04e6fb4f8fef35e82c42aa5.pdf) - Digital Personal Data Protection Act (India)
- **DPDP Rules 2025** - Digital Personal Data Protection Rules, 2025 (Notified Nov 13, 2025) - Full text included in `/docs/regulations/`
  - 23 Rules covering notice, consent, rights, security, breach notification, retention, and more
  - 7 Schedules detailing Consent Manager requirements, retention periods, children's data exemptions, etc.
- [IT Act 2000](https://www.meity.gov.in/content/information-technology-act) - Information Technology Act (India)
- [IT Rules 2011](https://www.meity.gov.in/content/information-technology-rules-2011) - Reasonable Security Practices and Procedures

### Inspired By

- [ToS;DR](https://tosdr.org/) - Terms of Service; Didn't Read
- [Privacy Guides](https://www.privacyguides.org/) - Privacy tools and services
- Privacy research and academic publications

---

## 📬 Contact & Support

- **Website**: [privacyanalyzer.in](https://privacyanalyzer.in)
- **GitHub**: [Issues](https://github.com/privacypriority/privacyanalyzer/issues) | [Discussions](https://github.com/privacypriority/privacyanalyzer/discussions)
- **Methodology**: [View Analysis Framework](https://privacyanalyzer.in/methodology)

---

## ⭐ Star History

If you find this project useful, please consider giving it a star! It helps the project grow and reach more users who care about privacy.

[![Star History Chart](https://api.star-history.com/svg?repos=privacypriority/privacyanalyzer&type=Date)](https://star-history.com/#privacypriority/privacyanalyzer&Date)

---

<div align="center">

**Made with ❤️ for privacy awareness**

[⬆ Back to Top](#-privacyanalyzerin---privacy-policy-analyser)

</div>
