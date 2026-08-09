'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

// Helper function to get grade color
function getGradeColor(grade: string): string {
  const firstChar = grade.charAt(0).toUpperCase();
  if (firstChar === 'A') return 'text-green-600 bg-green-50 border-green-200';
  if (firstChar === 'B') return 'text-blue-600 bg-blue-50 border-blue-200';
  if (firstChar === 'C') return 'text-yellow-600 bg-yellow-50 border-yellow-200';
  if (firstChar === 'D') return 'text-orange-600 bg-orange-50 border-orange-200';
  return 'text-red-600 bg-red-50 border-red-200';
}

// Helper function to get risk level color
function getRiskLevelColor(riskLevel: string): string {
  const level = riskLevel.toUpperCase();
  if (level === 'LOW' || level === 'EXEMPLARY') return 'bg-green-100 text-green-800 border-green-300';
  if (level === 'MODERATE') return 'bg-yellow-100 text-yellow-800 border-yellow-300';
  if (level === 'MODERATE-HIGH') return 'bg-orange-100 text-orange-800 border-orange-300';
  return 'bg-red-100 text-red-800 border-red-300';
}

interface AnalysisResponse {
  id: number;
  url: string;
  domain: string;
  content_hash: string;
  overall_score: number;
  privacy_grade: string;
  risk_level: string;
  analysis_data: any;
  homepage_screenshot: string | null;
  scraper_used: string;
  content_length: number;
  created_at: string;
  updated_at: string;
  last_checked_at: string;
}

export default function ResultsPage() {
  const params = useParams();
  const router = useRouter();
  const domain = decodeURIComponent(params.domain as string);

  const [analysis, setAnalysis] = useState<AnalysisResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAnalysis() {
      try {
        const response = await fetch(`/api/analysis/domain/${encodeURIComponent(domain)}`);

        if (!response.ok) {
          if (response.status === 404) {
            setError('No analysis found for this domain');
          } else if (response.status === 503) {
            setError('Database not available');
          } else {
            setError('Failed to fetch analysis');
          }
          setLoading(false);
          return;
        }

        const data = await response.json();
        setAnalysis(data);

        // Update page metadata dynamically
        document.title = `${domain} - Privacy Grade ${data.analysis_data.privacy_grade} | PrivacyAnalyzer`;

        const metaDescription = document.querySelector('meta[name="description"]');
        if (metaDescription) {
          metaDescription.setAttribute('content',
            `${domain} scored ${data.analysis_data.overall_score}/10 for privacy. Risk Level: ${data.analysis_data.risk_level}. ${data.analysis_data.executive_summary}`
          );
        }

        // Add OG tags
        const ogTags = [
          { property: 'og:title', content: `${domain} - Privacy Grade ${data.analysis_data.privacy_grade} | PrivacyAnalyzer` },
          { property: 'og:description', content: `${domain} scored ${data.analysis_data.overall_score}/10 for privacy. ${data.analysis_data.executive_summary}` },
          { property: 'og:type', content: 'website' },
          { property: 'og:url', content: `https://privacyanalyzer.in/results/${encodeURIComponent(domain)}` },
          { property: 'og:image', content: data.homepage_screenshot || 'https://privacyanalyzer.in/og-image.png' },
          { name: 'twitter:card', content: 'summary_large_image' },
          { name: 'twitter:title', content: `${domain} - Privacy Grade ${data.analysis_data.privacy_grade}` },
          { name: 'twitter:description', content: `Privacy score: ${data.analysis_data.overall_score}/10` },
          { name: 'twitter:image', content: data.homepage_screenshot || 'https://privacyanalyzer.in/og-image.png' },
        ];

        ogTags.forEach(tag => {
          let meta = document.querySelector(`meta[${tag.property ? 'property' : 'name'}="${tag.property || tag.name}"]`);
          if (!meta) {
            meta = document.createElement('meta');
            if (tag.property) {
              meta.setAttribute('property', tag.property);
            } else {
              meta.setAttribute('name', tag.name!);
            }
            document.head.appendChild(meta);
          }
          meta.setAttribute('content', tag.content);
        });

        setLoading(false);
      } catch (err) {
        console.error('Error fetching analysis:', err);
        setError('Failed to load analysis');
        setLoading(false);
      }
    }

    fetchAnalysis();
  }, [domain]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading analysis...</p>
        </div>
      </div>
    );
  }

  if (error || !analysis) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl font-bold text-slate-900 mb-4">Analysis Not Found</h1>
          <p className="text-slate-600 mb-8">
            {error || `No privacy policy analysis found for ${domain}. Try analyzing it first!`}
          </p>
          <Button asChild>
            <Link href="/">Analyze a Privacy Policy</Link>
          </Button>
        </div>
      </div>
    );
  }

  const analysisData = analysis.analysis_data;
  const cacheAgeDays = Math.floor(
    (Date.now() - new Date(analysis.last_checked_at).getTime()) / (1000 * 60 * 60 * 24)
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Header */}
      <div className="border-b border-slate-200 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold text-blue-600">
              PrivacyAnalyzer
            </Link>
            <Button asChild variant="outline">
              <Link href="/">Analyze Another</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Domain Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-sm text-slate-500 mb-2">
            <Link href="/" className="hover:text-blue-600">Home</Link>
            <span>/</span>
            <span>Results</span>
          </div>
          <h1 className="text-4xl font-bold text-slate-900 mb-2">{domain}</h1>
          <p className="text-slate-600">
            Last analyzed {cacheAgeDays === 0 ? 'today' : `${cacheAgeDays} days ago`} •
            {' '}<a href={analysis.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
              View Privacy Policy ↗
            </a>
          </p>
        </div>

        {/* Score Overview */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className={`border-2 ${getGradeColor(analysisData.privacy_grade)}`}>
            <CardContent className="p-6 text-center">
              <div className="text-sm font-medium mb-2">Privacy Grade</div>
              <div className="text-5xl font-bold mb-2">{analysisData.privacy_grade}</div>
              <div className="text-sm opacity-80">Based on DPDP Act 2023</div>
            </CardContent>
          </Card>

          <Card className="border-2">
            <CardContent className="p-6 text-center">
              <div className="text-sm font-medium text-slate-600 mb-2">Overall Score</div>
              <div className="text-5xl font-bold text-slate-900 mb-2">
                {analysisData.overall_score}<span className="text-3xl text-slate-400">/10</span>
              </div>
              <div className="text-sm text-slate-500">Privacy Protection</div>
            </CardContent>
          </Card>

          <Card className={`border-2 ${getRiskLevelColor(analysisData.risk_level)}`}>
            <CardContent className="p-6 text-center">
              <div className="text-sm font-medium mb-2">Risk Level</div>
              <div className="text-3xl font-bold mb-2">{analysisData.risk_level}</div>
              <div className="text-sm opacity-80">For Indian Users</div>
            </CardContent>
          </Card>
        </div>

        {/* Executive Summary */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Executive Summary</h2>
            <p className="text-slate-700 leading-relaxed">{analysisData.executive_summary}</p>
          </CardContent>
        </Card>

        {/* Category Scores */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Detailed Analysis</h2>
            <div className="space-y-6">
              {Object.entries(analysisData.categories).map(([key, category]: [string, any]) => (
                <div key={key} className="border-b border-slate-200 last:border-0 pb-6 last:pb-0">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-semibold text-slate-900 capitalize">
                      {key.replace(/_/g, ' ')}
                    </h3>
                    <div className={`px-4 py-2 rounded-full font-bold ${
                      category.score >= 8 ? 'bg-green-100 text-green-700' :
                      category.score >= 6 ? 'bg-yellow-100 text-yellow-700' :
                      category.score >= 4 ? 'bg-orange-100 text-orange-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {category.score}/10
                    </div>
                  </div>
                  <p className="text-slate-700 mb-2">{category.reasoning}</p>
                  {category.dpdp_notes && (
                    <p className="text-sm text-blue-700 bg-blue-50 p-3 rounded-lg">
                      <strong>DPDP Act Notes:</strong> {category.dpdp_notes}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Critical Findings */}
        {analysisData.critical_findings && (
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <Card className="border-l-4 border-red-500">
              <CardContent className="p-6">
                <h2 className="text-xl font-bold text-red-900 mb-4">⚠️ High Risk Practices</h2>
                <ul className="space-y-2">
                  {analysisData.critical_findings.high_risk_practices?.map((practice: string, idx: number) => (
                    <li key={idx} className="text-sm text-slate-700 flex items-start gap-2">
                      <span className="text-red-500 mt-1">•</span>
                      <span>{practice}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-orange-500">
              <CardContent className="p-6">
                <h2 className="text-xl font-bold text-orange-900 mb-4">📋 Regulatory Gaps</h2>
                <ul className="space-y-2">
                  {analysisData.critical_findings.regulatory_gaps?.map((gap: string, idx: number) => (
                    <li key={idx} className="text-sm text-slate-700 flex items-start gap-2">
                      <span className="text-orange-500 mt-1">•</span>
                      <span>{gap}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Recommendations */}
        {analysisData.actionable_recommendations && (
          <Card className="mb-8">
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Recommendations</h2>
              <div className="space-y-4">
                {analysisData.actionable_recommendations.immediate_actions?.length > 0 && (
                  <div>
                    <h3 className="font-bold text-red-700 mb-2">🚨 Immediate Actions Required</h3>
                    <ul className="space-y-1">
                      {analysisData.actionable_recommendations.immediate_actions.map((action: string, idx: number) => (
                        <li key={idx} className="text-sm text-slate-700 ml-4">• {action}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {analysisData.actionable_recommendations.medium_term_improvements?.length > 0 && (
                  <div>
                    <h3 className="font-bold text-orange-700 mb-2">📅 Medium-term Improvements</h3>
                    <ul className="space-y-1">
                      {analysisData.actionable_recommendations.medium_term_improvements.map((action: string, idx: number) => (
                        <li key={idx} className="text-sm text-slate-700 ml-4">• {action}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Share Section */}
        <Card className="mb-8 border-2 border-blue-200 bg-blue-50">
          <CardContent className="p-6 text-center">
            <h3 className="text-xl font-bold text-slate-900 mb-2">Share This Analysis</h3>
            <p className="text-slate-600 mb-4">
              Help others understand how {domain} handles their privacy
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const url = window.location.href;
                  navigator.clipboard.writeText(url);
                  alert('Link copied to clipboard!');
                }}
              >
                📋 Copy Link
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const text = `${domain} Privacy Analysis - Grade: ${analysisData.privacy_grade}, Score: ${analysisData.overall_score}/10`;
                  const url = window.location.href;
                  window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
                }}
              >
                🐦 Share on Twitter
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const url = window.location.href;
                  window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
                }}
              >
                📘 Share on Facebook
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Call to Action */}
        <div className="text-center py-8">
          <h3 className="text-2xl font-bold text-slate-900 mb-4">Analyze Your Favorite Website</h3>
          <p className="text-slate-600 mb-6">
            Check how any app or website handles your personal data
          </p>
          <Button asChild size="lg">
            <Link href="/">Analyze Another Privacy Policy</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
