'use client';

import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { CircularProgress } from '@/components/ui/circular-progress';
import { Heatmap } from '@/components/ui/heatmap';
import { ScoreCard } from '@/components/ui/score-card';
import { MethodologySection } from '@/components/MethodologySection';
import { ShareButtons } from '@/components/ShareButtons';
import { WebsiteScreenshot } from '@/components/WebsiteScreenshot';
import { AlertCircle, CheckCircle, Search, ExternalLink, Shield, Lock, Eye, Users, FileText, Scale, Home, RotateCcw, MessageSquare } from 'lucide-react';
import Link from 'next/link';

interface AnalysisResult {
  url: string;
  homepage_url?: string;
  homepage_screenshot?: string | null;
  timestamp: string;
  analysis: {
    overall_score: number;
    risk_level: string;
    regulatory_compliance: {
      dpdp_act_compliance: string;
      major_violations: string[];
    };
    categories: {
      [key: string]: {
        score: number;
        reasoning: string;
        dpdp_notes?: string;
      };
    };
    critical_findings: {
      high_risk_practices: string[];
      regulatory_gaps: string[];
      data_subject_impacts: string[];
    };
    positive_practices: string[];
    actionable_recommendations: {
      immediate_actions: string[];
      medium_term_improvements: string[];
      best_practice_adoption: string[];
    };
    privacy_grade: string;
    executive_summary: string;
  };
}

type AnalysisStep = 'idle' | 'fetching' | 'reading' | 'analyzing' | 'preparing' | 'complete';

export default function PrivacyAnalyzer() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState('');
  const [currentStep, setCurrentStep] = useState<AnalysisStep>('idle');

  const analyzePolicy = async () => {
    if (!url.trim()) {
      setError('Please enter a URL');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);
    setCurrentStep('fetching');

    try {
      // Simulate step progression for better UX
      setTimeout(() => setCurrentStep('reading'), 1000);
      setTimeout(() => setCurrentStep('analyzing'), 3000);
      setTimeout(() => setCurrentStep('preparing'), 25000);

      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url: url.trim()
        }),
      });

      if (!response.ok) {
        let errorMsg = 'Analysis failed. Please try again.';

        try {
          const contentType = response.headers.get('content-type');

          if (contentType?.includes('application/json')) {
            const errorData = await response.json();
            errorMsg = errorData.error || 'Analysis failed';

            // Include debug details if available
            if (errorData.details) {
              errorMsg += `\n\nDetails: ${errorData.details}`;
            }
            if (errorData.debugInfo) {
              errorMsg += `\n\nDebug: ${JSON.stringify(errorData.debugInfo)}`;
            }
          } else {
            // HTML error page or other non-JSON response
            const text = await response.text();

            // Check if it's a Vercel error page or similar
            if (text.includes('<!DOCTYPE') || text.includes('<html')) {
              if (response.status === 504 || text.includes('504') || text.includes('timeout')) {
                errorMsg = 'The website took too long to respond. This might be due to bot protection or the site being temporarily unavailable. Please try again later.';
              } else if (response.status === 502 || text.includes('502') || text.includes('Bad Gateway')) {
                errorMsg = 'Unable to process this website. The site may have bot protection or be temporarily unavailable.';
              } else if (response.status === 500) {
                errorMsg = 'Server error occurred while analyzing this website. Please try a different URL or try again later.';
              } else {
                errorMsg = 'Unable to analyze this website. The site may have anti-bot protection preventing automated access. Please try a different privacy policy URL.';
              }
            } else {
              errorMsg = text.substring(0, 200); // Show first 200 chars of error
            }
          }
        } catch (parseError) {
          // If we can't parse the error at all
          errorMsg = `Request failed with status ${response.status}. The website may be blocking automated access or experiencing issues. Please try again later.`;
        }

        throw new Error(errorMsg);
      }

      const data = await response.json();
      setCurrentStep('complete');

      // Small delay to show completion state
      setTimeout(() => {
        setResult(data);
        setLoading(false);
        setCurrentStep('idle');
      }, 500);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred during analysis';
      console.error('[Analysis Error]', errorMessage);
      setError(errorMessage);
      setLoading(false);
      setCurrentStep('idle');
    }
  };

  const resetAnalysis = () => {
    setUrl('');
    setResult(null);
    setError('');
    setLoading(false);
    setCurrentStep('idle');
  };

  const getGradeColor = (grade: string) => {
    if (['A+', 'A', 'A-'].includes(grade)) return 'text-green-600 bg-green-50';
    if (['B+', 'B', 'B-'].includes(grade)) return 'text-blue-600 bg-blue-50';
    if (['C+', 'C', 'C-'].includes(grade)) return 'text-yellow-600 bg-yellow-50';
    if (['D+', 'D', 'D-'].includes(grade)) return 'text-orange-600 bg-orange-50';
    return 'text-red-600 bg-red-50';
  };

  const getRiskLevelColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'EXEMPLARY': return 'text-green-700 bg-green-100 border-green-200';
      case 'LOW': return 'text-green-600 bg-green-50 border-green-200';
      case 'MODERATE': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'MODERATE-HIGH': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'HIGH': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getComplianceColor = (status: string) => {
    switch (status) {
      case 'COMPLIANT': return 'text-green-600 bg-green-50';
      case 'PARTIALLY_COMPLIANT': return 'text-yellow-600 bg-yellow-50';
      case 'NON_COMPLIANT': return 'text-red-600 bg-red-50';
      case 'NOT_APPLICABLE': return 'text-gray-600 bg-gray-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-green-600';
    if (score >= 6) return 'text-blue-600';
    if (score >= 4) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-2 sm:px-4">
      {/* Search Interface */}
      <Card className="mb-6 sm:mb-8">
        <CardContent className="p-4 sm:p-6">
          <div className="space-y-4">
            {/* URL Input */}
            <div>
              <label htmlFor="privacy-url" className="block text-sm font-semibold text-gray-700 mb-2">
                Privacy Policy URL
              </label>
              <Input
                id="privacy-url"
                type="url"
                placeholder="https://example.com/privacy-policy"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && !loading && analyzePolicy()}
                disabled={loading}
                className="text-base h-12 focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Button
                onClick={analyzePolicy}
                disabled={loading || !url.trim()}
                className="flex-1 h-12 text-base font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white border-0 shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2" />
                    <span>Analyzing...</span>
                  </>
                ) : (
                  <>
                    <Search className="h-5 w-5 mr-2" />
                    <span>Analyze Privacy Policy</span>
                  </>
                )}
              </Button>
              {(url || result) && (
                <Button
                  onClick={resetAnalysis}
                  disabled={loading}
                  variant="outline"
                  className="sm:w-auto h-12 text-base font-semibold border-2 hover:bg-gray-50 disabled:opacity-50"
                >
                  <RotateCcw className="h-5 w-5 mr-2" />
                  <span>Reset</span>
                </Button>
              )}
            </div>

            {error && (
              <div className="flex items-start gap-2 text-red-600 bg-red-50 p-3 rounded-lg text-sm">
                <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                <div className="text-xs sm:text-sm whitespace-pre-wrap break-words flex-1">{error}</div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Loading State with Step-by-Step Progress */}
      {loading && (
        <Card className="bg-gradient-to-br from-blue-50 via-white to-purple-50 border-2 border-blue-100 shadow-xl">
          <CardContent className="p-4 sm:p-6 md:p-8">
            <div className="space-y-6">
              {/* Header */}
              <div className="text-center">
                <h3 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                  Analyzing Privacy Policy
                </h3>
                <p className="text-xs sm:text-sm text-gray-600">
                  This typically takes 30-60 seconds
                </p>
              </div>

              {/* Horizontal Steps and Progress */}
              <div className="space-y-4">
                {/* Steps Timeline - Horizontal */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {/* Step 1 */}
                  <div className="flex flex-col items-center text-center">
                    <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center mb-2 transition-all ${
                      currentStep === 'fetching' ? 'bg-blue-500 animate-pulse ring-4 ring-blue-200' :
                      ['reading', 'analyzing', 'preparing', 'complete'].includes(currentStep) ? 'bg-green-500' :
                      'bg-gray-300'
                    }`}>
                      {['reading', 'analyzing', 'preparing', 'complete'].includes(currentStep) ? (
                        <CheckCircle className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                      ) : currentStep === 'fetching' ? (
                        <div className="animate-spin rounded-full h-5 w-5 sm:h-6 sm:w-6 border-2 border-white border-t-transparent" />
                      ) : (
                        <span className="text-white font-bold text-sm">1</span>
                      )}
                    </div>
                    <p className="text-xs sm:text-sm font-semibold text-gray-800">Fetching</p>
                    <p className="text-xs text-gray-600 hidden sm:block">Policy URL</p>
                  </div>

                  {/* Step 2 */}
                  <div className="flex flex-col items-center text-center">
                    <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center mb-2 transition-all ${
                      currentStep === 'reading' ? 'bg-blue-500 animate-pulse ring-4 ring-blue-200' :
                      ['analyzing', 'preparing', 'complete'].includes(currentStep) ? 'bg-green-500' :
                      'bg-gray-300'
                    }`}>
                      {['analyzing', 'preparing', 'complete'].includes(currentStep) ? (
                        <CheckCircle className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                      ) : currentStep === 'reading' ? (
                        <div className="animate-spin rounded-full h-5 w-5 sm:h-6 sm:w-6 border-2 border-white border-t-transparent" />
                      ) : (
                        <span className="text-white font-bold text-sm">2</span>
                      )}
                    </div>
                    <p className="text-xs sm:text-sm font-semibold text-gray-800">Reading</p>
                    <p className="text-xs text-gray-600 hidden sm:block">Parsing</p>
                  </div>

                  {/* Step 3 */}
                  <div className="flex flex-col items-center text-center">
                    <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center mb-2 transition-all ${
                      currentStep === 'analyzing' ? 'bg-blue-500 animate-pulse ring-4 ring-blue-200' :
                      ['preparing', 'complete'].includes(currentStep) ? 'bg-green-500' :
                      'bg-gray-300'
                    }`}>
                      {['preparing', 'complete'].includes(currentStep) ? (
                        <CheckCircle className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                      ) : currentStep === 'analyzing' ? (
                        <div className="animate-spin rounded-full h-5 w-5 sm:h-6 sm:w-6 border-2 border-white border-t-transparent" />
                      ) : (
                        <span className="text-white font-bold text-sm">3</span>
                      )}
                    </div>
                    <p className="text-xs sm:text-sm font-semibold text-gray-800">Analyzing</p>
                    <p className="text-xs text-gray-600 hidden sm:block">AI Review</p>
                  </div>

                  {/* Step 4 */}
                  <div className="flex flex-col items-center text-center">
                    <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center mb-2 transition-all ${
                      currentStep === 'preparing' ? 'bg-blue-500 animate-pulse ring-4 ring-blue-200' :
                      currentStep === 'complete' ? 'bg-green-500' :
                      'bg-gray-300'
                    }`}>
                      {currentStep === 'complete' ? (
                        <CheckCircle className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                      ) : currentStep === 'preparing' ? (
                        <div className="animate-spin rounded-full h-5 w-5 sm:h-6 sm:w-6 border-2 border-white border-t-transparent" />
                      ) : (
                        <span className="text-white font-bold text-sm">4</span>
                      )}
                    </div>
                    <p className="text-xs sm:text-sm font-semibold text-gray-800">Preparing</p>
                    <p className="text-xs text-gray-600 hidden sm:block">Results</p>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs sm:text-sm font-medium text-gray-700">
                    <span>
                      {currentStep === 'fetching' ? 'Fetching privacy policy...' :
                       currentStep === 'reading' ? 'Reading and parsing content...' :
                       currentStep === 'analyzing' ? 'AI analyzing privacy practices...' :
                       currentStep === 'preparing' ? 'Preparing results...' :
                       currentStep === 'complete' ? 'Analysis complete!' : 'Starting...'}
                    </span>
                    <span className="font-bold">
                      {currentStep === 'fetching' ? '25%' :
                       currentStep === 'reading' ? '50%' :
                       currentStep === 'analyzing' ? '75%' :
                       currentStep === 'preparing' ? '90%' :
                       currentStep === 'complete' ? '100%' : '0%'}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transition-all duration-500 ease-out"
                      style={{
                        width: currentStep === 'fetching' ? '25%' :
                               currentStep === 'reading' ? '50%' :
                               currentStep === 'analyzing' ? '75%' :
                               currentStep === 'preparing' ? '90%' :
                               currentStep === 'complete' ? '100%' : '0%'
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Results */}
      {result && (
        <div className="space-y-6">
          {/* Overall Score Dashboard */}
          <Card className="bg-gradient-to-br from-blue-50 via-white to-purple-50 border-2 border-blue-100 shadow-lg">
            <CardContent className="p-4 sm:p-6">
              {/* Header */}
              <div className="mb-6">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-1">Privacy Analysis Results</h3>
                    <div className="flex items-center gap-2 text-xs sm:text-sm">
                      <span className="text-gray-600">Analysis for</span>
                      <a
                        href={result.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline flex items-center gap-1 font-semibold truncate"
                      >
                        <span className="truncate">{new URL(result.url).hostname}</span>
                        <ExternalLink className="h-3 w-3 sm:h-3.5 sm:w-3.5 flex-shrink-0" />
                      </a>
                    </div>
                  </div>

                  {/* Home button */}
                  <Button
                    onClick={() => window.location.href = '/'}
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-1.5 text-sm hover:bg-blue-50 border-blue-200 flex-shrink-0"
                  >
                    <Home className="h-3.5 w-3.5" />
                    <span className="hidden lg:inline">Home</span>
                  </Button>
                </div>
              </div>

              {/* Main Score Visualization */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-4">
                {/* Circular Progress */}
                <div className="flex flex-col items-center justify-center py-2">
                  <div className="relative w-[140px] h-[140px]">
                    <CircularProgress
                      value={result.analysis.overall_score * 10}
                      size={140}
                      strokeWidth={10}
                      showValue={false}
                    />
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <div className={`text-4xl font-extrabold ${getScoreColor(result.analysis.overall_score)}`}>
                        {result.analysis.overall_score.toFixed(1)}
                      </div>
                      <div className="text-xs text-gray-500 font-medium">/ 10</div>
                    </div>
                  </div>
                  <div className="text-sm text-gray-700 mt-2 font-semibold">Overall Score</div>
                </div>

                {/* Category Breakdown Mini Chart */}
                <div className="flex flex-col items-center justify-center py-2 px-2">
                  <div className="w-full">
                    <div className="text-xs text-gray-700 font-bold mb-2 text-center">Category Scores</div>
                    <div className="space-y-1.5">
                      {Object.entries(result.analysis.categories).slice(0, 6).map(([key, category]) => {
                        const categoryNames: Record<string, string> = {
                          'data_collection': 'Data Minimization & Collection',
                          'data_sharing': 'Third-Party Data Sharing',
                          'user_rights': 'Individual Rights & Controls',
                          'security_measures': 'Security & Risk Management',
                          'compliance_framework': 'Regulatory Compliance',
                          'transparency': 'Transparency & Communication'
                        };

                        return (
                          <div key={key} className="flex items-center gap-1.5">
                            <div className="text-xs text-gray-600 w-24 truncate text-right font-medium">
                              {categoryNames[key] || key}
                            </div>
                            <div className="flex-1 bg-gray-200 rounded-full h-1.5 overflow-hidden">
                              <div
                                className={`h-full rounded-full transition-all ${
                                  category.score >= 8 ? 'bg-gradient-to-r from-green-500 to-green-600' :
                                  category.score >= 6 ? 'bg-gradient-to-r from-blue-500 to-blue-600' :
                                  category.score >= 4 ? 'bg-gradient-to-r from-yellow-500 to-yellow-600' :
                                  'bg-gradient-to-r from-red-500 to-red-600'
                                }`}
                                style={{ width: `${category.score * 10}%` }}
                              />
                            </div>
                            <div className={`text-xs font-bold w-7 text-right ${getScoreColor(category.score)}`}>
                              {category.score.toFixed(1)}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Grade and Risk Level */}
                <div className="flex flex-col items-center justify-center space-y-3 py-2">
                  <div className="text-center">
                    <Badge className={`text-4xl px-8 py-4 font-black rounded-xl shadow-md ${getGradeColor(result.analysis.privacy_grade)}`}>
                      {result.analysis.privacy_grade}
                    </Badge>
                    <div className="text-xs text-gray-600 mt-2 font-semibold">Privacy Grade</div>
                  </div>

                  <div className="text-center">
                    <Badge className={`px-4 py-1.5 text-sm font-bold border-2 rounded-lg shadow-sm ${getRiskLevelColor(result.analysis.risk_level)}`}>
                      {result.analysis.risk_level.replace('-', ' ')} RISK
                    </Badge>
                  </div>
                </div>

                {/* Website Screenshot Thumbnail */}
                <div className="flex flex-col items-center justify-center py-2 col-span-2 lg:col-span-1">
                  <WebsiteScreenshot
                    screenshotUrl={result.homepage_screenshot || ''}
                    homepageUrl={result.homepage_url || `https://${new URL(result.url).hostname}`}
                    domain={new URL(result.url).hostname}
                    compact={true}
                  />
                </div>
              </div>
              
              {/* Executive Summary */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-5 mb-4 border border-blue-100 shadow-sm">
                <h4 className="text-base font-bold mb-2 flex items-center gap-2 text-gray-800">
                  <FileText className="h-4 w-4 text-blue-600" />
                  Executive Summary
                </h4>
                <p className="text-sm text-gray-700 leading-relaxed">
                  {result.analysis.executive_summary}
                </p>
              </div>

              {/* Compliance Status - DPDP Act 2023 */}
              <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl p-4 border-2 border-orange-200 shadow-md">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-orange-100 rounded-full p-2">
                      <FileText className="h-5 w-5 text-orange-600" />
                    </div>
                    <div>
                      <span className="font-bold text-sm text-gray-600">India DPDP Act 2023 Compliance</span>
                      <p className="text-xs text-gray-500">Digital Personal Data Protection Act</p>
                    </div>
                  </div>
                  <Badge className={`px-4 py-2 text-sm font-bold ${getComplianceColor(result.analysis.regulatory_compliance.dpdp_act_compliance || 'NOT_APPLICABLE')}`}>
                    {(result.analysis.regulatory_compliance.dpdp_act_compliance || 'N/A').replace('_', ' ')}
                  </Badge>
                </div>
                <p className="text-xs text-gray-500 mt-2 italic">
                  Note: Compliance assessment is indicative. Act not yet fully enforced.
                </p>
                {result.analysis.regulatory_compliance.major_violations && result.analysis.regulatory_compliance.major_violations.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-orange-200">
                    <p className="text-xs font-semibold text-orange-800 mb-1">Major Violations:</p>
                    <ul className="space-y-1">
                      {result.analysis.regulatory_compliance.major_violations.slice(0, 3).map((violation, index) => (
                        <li key={index} className="text-xs text-orange-700 flex items-start gap-2">
                          <span className="text-orange-500 mt-0.5">•</span>
                          <span>{violation}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Important Disclaimer - Prominent Position */}
          <Card className="border-2 border-amber-300 bg-gradient-to-br from-amber-50 to-orange-50 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-start gap-3">
                <div className="bg-amber-100 rounded-full p-3">
                  <AlertCircle className="h-6 w-6 text-amber-600" />
                </div>
                <div className="flex-1">
                  <h4 className="text-xl font-black text-amber-900 mb-3 flex items-center gap-2">
                    ⚠️ Important Disclaimer
                  </h4>
                  <div className="space-y-2 text-amber-900">
                    <p className="text-base leading-relaxed">
                      This analysis is provided for <strong className="font-bold">educational and awareness purposes only</strong>.
                    </p>
                    <p className="text-base leading-relaxed">
                      The information presented should <strong className="font-bold">not be used as legal advice</strong> or for making legal decisions. Privacy laws and regulations are complex and vary by jurisdiction.
                    </p>
                    <p className="text-base leading-relaxed">
                      For legal compliance matters, please consult with <strong className="font-bold">qualified legal professionals</strong> or privacy attorneys who can provide guidance specific to your situation and jurisdiction.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Category Scores Dashboard */}
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Score Cards Grid */}
            <Card>
              <CardContent className="p-6">
                <h4 className="text-xl font-semibold mb-6 flex items-center gap-2">
                  <Eye className="h-6 w-6" />
                  Category Analysis
                </h4>
                
                <div className="grid gap-4">
                  {Object.entries(result.analysis.categories).map(([key, category]) => {
                    const categoryNames: Record<string, string> = {
                      'data_collection': 'Data Minimization & Collection',
                      'data_sharing': 'Third-Party Data Sharing',
                      'user_rights': 'Individual Rights & Controls',
                      'security_measures': 'Security & Risk Management',
                      'compliance_framework': 'Regulatory Compliance',
                      'transparency': 'Transparency & Communication'
                    };

                    const getIcon = (categoryKey: string) => {
                      switch (categoryKey) {
                        case 'data_collection': return <Shield className="h-5 w-5" />;
                        case 'data_sharing': return <Users className="h-5 w-5" />;
                        case 'user_rights': return <Scale className="h-5 w-5" />;
                        case 'security_measures': return <Lock className="h-5 w-5" />;
                        case 'compliance_framework': return <FileText className="h-5 w-5" />;
                        case 'transparency': return <Eye className="h-5 w-5" />;
                        default: return <Shield className="h-5 w-5" />;
                      }
                    };

                    return (
                      <ScoreCard
                        key={key}
                        title={categoryNames[key] || key.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        score={category.score}
                        description={category.reasoning}
                        icon={getIcon(key)}
                        className="hover:shadow-md transition-all duration-200"
                      />
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Heatmap Visualization */}
            <Card>
              <CardContent className="p-6">
                <div className="space-y-6">
                  <Heatmap
                    data={Object.entries(result.analysis.categories).map(([key, category]) => {
                      const categoryNames: Record<string, string> = {
                        'data_collection': 'Data Minimization & Collection',
                        'data_sharing': 'Third-Party Data Sharing',
                        'user_rights': 'Individual Rights & Controls',
                        'security_measures': 'Security & Risk Management',
                        'compliance_framework': 'Regulatory Compliance',
                        'transparency': 'Transparency & Communication'
                      };

                      const weights: Record<string, number> = {
                        'data_collection': 30,
                        'data_sharing': 25,
                        'user_rights': 20,
                        'security_measures': 15,
                        'compliance_framework': 7,
                        'transparency': 3
                      };

                      return {
                        label: categoryNames[key] || key.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()),
                        value: category.score,
                        weight: weights[key] || 10
                      };
                    })}
                  />
                  
                  {/* DPDP Act Compliance Notes */}
                  <div className="space-y-3">
                    <h5 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                      <FileText className="h-4 w-4 text-orange-600" />
                      DPDP Act 2023 Compliance Notes
                    </h5>
                    {Object.entries(result.analysis.categories).map(([key, category]) => {
                      const categoryNames: Record<string, string> = {
                        'data_collection': 'Data Minimization & Collection',
                        'data_sharing': 'Third-Party Data Sharing',
                        'user_rights': 'Individual Rights & Controls',
                        'security_measures': 'Security & Risk Management',
                        'compliance_framework': 'Regulatory Compliance',
                        'transparency': 'Transparency & Communication'
                      };

                      return (
                        category.dpdp_notes && (
                          <div key={key} className="bg-orange-50 border-l-4 border-orange-200 p-3 rounded">
                            <p className="text-sm text-orange-800">
                              <strong>{categoryNames[key] || key.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}:</strong> {category.dpdp_notes}
                            </p>
                          </div>
                        )
                      );
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Critical Findings */}
          {result.analysis.critical_findings && (
            <Card className="border-red-200 bg-red-50">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <AlertCircle className="h-6 w-6 text-red-600" />
                  <h4 className="text-lg font-semibold text-red-800">Critical Findings</h4>
                </div>
                
                <div className="grid md:grid-cols-3 gap-6">
                  {/* High Risk Practices */}
                  {result.analysis.critical_findings.high_risk_practices?.length > 0 && (
                    <div>
                      <h5 className="font-medium text-red-700 mb-2">High Risk Practices</h5>
                      <ul className="space-y-2">
                        {result.analysis.critical_findings.high_risk_practices.map((practice, index) => (
                          <li key={index} className="text-sm text-red-600 flex items-start gap-2">
                            <div className="w-2 h-2 bg-red-500 rounded-full mt-1.5 flex-shrink-0" />
                            {practice}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {/* Regulatory Gaps */}
                  {result.analysis.critical_findings.regulatory_gaps?.length > 0 && (
                    <div>
                      <h5 className="font-medium text-red-700 mb-2">Regulatory Gaps</h5>
                      <ul className="space-y-2">
                        {result.analysis.critical_findings.regulatory_gaps.map((gap, index) => (
                          <li key={index} className="text-sm text-red-600 flex items-start gap-2">
                            <div className="w-2 h-2 bg-red-500 rounded-full mt-1.5 flex-shrink-0" />
                            {gap}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {/* Data Subject Impacts */}
                  {result.analysis.critical_findings.data_subject_impacts?.length > 0 && (
                    <div>
                      <h5 className="font-medium text-red-700 mb-2">User Impact</h5>
                      <ul className="space-y-2">
                        {result.analysis.critical_findings.data_subject_impacts.map((impact, index) => (
                          <li key={index} className="text-sm text-red-600 flex items-start gap-2">
                            <div className="w-2 h-2 bg-red-500 rounded-full mt-1.5 flex-shrink-0" />
                            {impact}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Positive Practices */}
          {result.analysis.positive_practices?.length > 0 && (
            <Card className="border-green-200 bg-green-50">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                  <h4 className="text-lg font-semibold text-green-800">Privacy-Protective Practices</h4>
                </div>
                <ul className="space-y-2">
                  {result.analysis.positive_practices.map((practice, index) => (
                    <li key={index} className="text-sm text-green-700 flex items-start gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-1.5 flex-shrink-0" />
                      {practice}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Actionable Recommendations */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-6">
                <Search className="h-6 w-6 text-blue-600" />
                <h4 className="text-lg font-semibold">Actionable Recommendations</h4>
              </div>
              
              <div className="grid md:grid-cols-3 gap-6">
                {/* Immediate Actions */}
                {result.analysis.actionable_recommendations?.immediate_actions?.length > 0 && (
                  <div className="border-l-4 border-red-400 pl-4">
                    <h5 className="font-medium text-red-700 mb-3">🚨 Immediate Actions</h5>
                    <ul className="space-y-2">
                      {result.analysis.actionable_recommendations.immediate_actions.map((action, index) => (
                        <li key={index} className="text-sm text-gray-700 flex items-start gap-2">
                          <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2 flex-shrink-0" />
                          {action}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {/* Medium Term */}
                {result.analysis.actionable_recommendations?.medium_term_improvements?.length > 0 && (
                  <div className="border-l-4 border-yellow-400 pl-4">
                    <h5 className="font-medium text-yellow-700 mb-3">⏳ Medium Term</h5>
                    <ul className="space-y-2">
                      {result.analysis.actionable_recommendations.medium_term_improvements.map((improvement, index) => (
                        <li key={index} className="text-sm text-gray-700 flex items-start gap-2">
                          <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full mt-2 flex-shrink-0" />
                          {improvement}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {/* Best Practices */}
                {result.analysis.actionable_recommendations?.best_practice_adoption?.length > 0 && (
                  <div className="border-l-4 border-blue-400 pl-4">
                    <h5 className="font-medium text-blue-700 mb-3">✨ Best Practices</h5>
                    <ul className="space-y-2">
                      {result.analysis.actionable_recommendations.best_practice_adoption.map((practice, index) => (
                        <li key={index} className="text-sm text-gray-700 flex items-start gap-2">
                          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                          {practice}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Share Results */}
          <ShareButtons
            url={result.url}
            privacyGrade={result.analysis.privacy_grade}
            overallScore={result.analysis.overall_score}
            pageType="analysis"
          />

          {/* Methodology Section */}
          <MethodologySection />

          {/* For Website Owners - Link to Dedicated Page */}
          <Card className="border-2 border-blue-300 bg-gradient-to-br from-blue-50 to-indigo-50 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-start gap-3">
                <div className="bg-blue-100 rounded-full p-3">
                  <MessageSquare className="h-6 w-6 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h4 className="text-xl font-black text-blue-900 mb-3">
                    For Website Owners & Organizations
                  </h4>
                  <p className="text-base text-blue-800 leading-relaxed mb-4">
                    If you are the owner, webmaster, or part of the team behind <strong>{new URL(result.url).hostname}</strong>, we welcome collaboration, feedback, and corrections.
                  </p>
                  <Button
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold"
                    asChild
                  >
                    <Link href="/for-website-owners">
                      Learn More & Contact Us →
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Analysis Metadata */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>
                  Analysis completed on {new Date(result.timestamp).toLocaleString()}
                </span>
                <Badge variant="outline">
                  AI-Powered Analysis
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}