'use client';

import React, { useState, useMemo } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AlertCircle, CheckCircle, Search, ExternalLink, Shield, Lock, Eye, Users, FileText, Scale, RotateCcw } from 'lucide-react';
import {
  Chart as ChartJS,
  RadialLinearScale,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';
import { Doughnut, Radar, Bar } from 'react-chartjs-2';

ChartJS.register(
  RadialLinearScale,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
);

interface AnalysisResult {
  url: string;
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

const CATEGORY_META: Record<string, { label: string; shortLabel: string; icon: React.ReactNode; weight: number }> = {
  data_collection: { label: 'Data Collection', shortLabel: 'Collection', icon: <Shield className="h-4 w-4" />, weight: 30 },
  data_sharing: { label: 'Data Sharing', shortLabel: 'Sharing', icon: <Users className="h-4 w-4" />, weight: 25 },
  user_rights: { label: 'User Rights', shortLabel: 'Rights', icon: <Scale className="h-4 w-4" />, weight: 20 },
  security_measures: { label: 'Security', shortLabel: 'Security', icon: <Lock className="h-4 w-4" />, weight: 15 },
  compliance_framework: { label: 'Compliance', shortLabel: 'Compliance', icon: <FileText className="h-4 w-4" />, weight: 7 },
  transparency: { label: 'Transparency', shortLabel: 'Transparency', icon: <Eye className="h-4 w-4" />, weight: 3 },
};

const CATEGORY_ORDER = ['data_collection', 'data_sharing', 'user_rights', 'security_measures', 'compliance_framework', 'transparency'];

function getScoreColor(score: number) {
  if (score >= 8) return '#16a34a';
  if (score >= 6) return '#ca8a04';
  if (score >= 4) return '#ea580c';
  return '#dc2626';
}

// --- Score Doughnut Gauge ---
function ScoreGauge({ score }: { score: number }) {
  const color = getScoreColor(score);
  const data = {
    datasets: [{
      data: [score, 10 - score],
      backgroundColor: [color, '#f3f4f6'],
      borderWidth: 0,
      cutout: '78%',
    }],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      tooltip: { enabled: false },
      legend: { display: false },
    },
    rotation: -90,
    circumference: 360,
    animation: { animateRotate: true, duration: 1000 },
  } as const;

  return (
    <div className="relative w-36 h-36 sm:w-40 sm:h-40">
      <Doughnut data={data} options={options} />
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-bold" style={{ color }}>{score.toFixed(1)}</span>
        <span className="text-xs text-gray-400">/10</span>
      </div>
    </div>
  );
}

// --- Radar Chart ---
function CategoryRadar({ categories }: { categories: Record<string, { score: number }> }) {
  const labels = CATEGORY_ORDER.filter(k => categories[k]).map(k => CATEGORY_META[k]?.shortLabel || k);
  const scores = CATEGORY_ORDER.filter(k => categories[k]).map(k => categories[k].score);

  if (labels.length < 3) return null;

  const data = {
    labels,
    datasets: [{
      label: 'Score',
      data: scores,
      backgroundColor: 'rgba(31, 41, 55, 0.1)',
      borderColor: '#1f2937',
      borderWidth: 2,
      pointBackgroundColor: '#1f2937',
      pointBorderColor: '#fff',
      pointBorderWidth: 2,
      pointRadius: 4,
      pointHoverRadius: 6,
      fill: true,
    }],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    scales: {
      r: {
        beginAtZero: true,
        max: 10,
        min: 0,
        ticks: {
          stepSize: 2,
          display: true,
          font: { size: 9 },
          color: '#9ca3af',
          backdropColor: 'transparent',
        },
        grid: { color: '#e5e7eb' },
        angleLines: { color: '#e5e7eb' },
        pointLabels: {
          font: { size: 11, weight: 500 as const },
          color: '#4b5563',
        },
      },
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#1f2937',
        titleFont: { size: 12 },
        bodyFont: { size: 12 },
        padding: 8,
        cornerRadius: 6,
        callbacks: {
          label: (ctx: { parsed: { r: number } }) => ` ${ctx.parsed.r.toFixed(1)} / 10`,
        },
      },
    },
    animation: { duration: 800 },
  } as const;

  return (
    <div className="w-full max-w-xs mx-auto">
      <Radar data={data} options={options} />
    </div>
  );
}

// --- Horizontal Bar Chart ---
function CategoryBarChart({ categories }: { categories: Record<string, { score: number }> }) {
  const orderedKeys = CATEGORY_ORDER.filter(k => categories[k]);
  const labels = orderedKeys.map(k => CATEGORY_META[k]?.label || k);
  const scores = orderedKeys.map(k => categories[k].score);
  const barColors = scores.map(s => getScoreColor(s));

  const data = {
    labels,
    datasets: [{
      label: 'Score',
      data: scores,
      backgroundColor: barColors.map(c => c + '33'),
      borderColor: barColors,
      borderWidth: 2,
      borderRadius: 4,
      barThickness: 24,
    }],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: 'y' as const,
    scales: {
      x: {
        beginAtZero: true,
        max: 10,
        ticks: { stepSize: 2, font: { size: 10 }, color: '#9ca3af' },
        grid: { color: '#f3f4f6' },
      },
      y: {
        ticks: { font: { size: 11 }, color: '#4b5563' },
        grid: { display: false },
      },
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#1f2937',
        padding: 10,
        cornerRadius: 6,
        callbacks: {
          label: (ctx: { parsed: { x: number | null } }) => {
            const val = ctx.parsed.x ?? 0;
            return ` Score: ${val.toFixed(1)} / 10`;
          },
        },
      },
    },
    animation: { duration: 800 },
  } as const;

  return (
    <div style={{ height: `${orderedKeys.length * 48 + 40}px` }}>
      <Bar data={data} options={options} />
    </div>
  );
}

// --- Findings Donut ---
function FindingsDonut({ findings }: { findings: { high: number; regulatory: number; impact: number } }) {
  const total = findings.high + findings.regulatory + findings.impact;
  if (total === 0) return null;

  const segments = [
    { count: findings.high, color: '#dc2626', label: 'High Risk' },
    { count: findings.regulatory, color: '#ea580c', label: 'Regulatory Gaps' },
    { count: findings.impact, color: '#ca8a04', label: 'Data Impact' },
  ].filter(s => s.count > 0);

  const data = {
    labels: segments.map(s => s.label),
    datasets: [{
      data: segments.map(s => s.count),
      backgroundColor: segments.map(s => s.color),
      borderWidth: 0,
      cutout: '60%',
    }],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: { display: false },
      tooltip: { backgroundColor: '#1f2937', padding: 8, cornerRadius: 6 },
    },
    animation: { duration: 600 },
  } as const;

  return (
    <div className="flex items-center gap-4">
      <div className="w-20 h-20 flex-shrink-0 relative">
        <Doughnut data={data} options={options} />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-sm font-bold text-gray-700">{total}</span>
        </div>
      </div>
      <div className="flex flex-col gap-1">
        {segments.map((seg, i) => (
          <div key={i} className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ backgroundColor: seg.color }} />
            <span className="text-xs text-gray-600">{seg.label} ({seg.count})</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// --- Compliance Gauge ---
function ComplianceGauge({ status }: { status: string }) {
  const levels = ['NON_COMPLIANT', 'PARTIALLY_COMPLIANT', 'COMPLIANT'];
  const currentIdx = levels.indexOf(status);
  const labels = ['Non-Compliant', 'Partial', 'Compliant'];
  const colors = ['#dc2626', '#ca8a04', '#16a34a'];

  return (
    <div className="flex items-center gap-1">
      {levels.map((_, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-1">
          <div
            className="w-full h-2 rounded-full transition-all duration-500"
            style={{ backgroundColor: i <= currentIdx ? colors[i] : '#e5e7eb' }}
          />
          <span className={`text-[10px] ${i <= currentIdx ? 'text-gray-700 font-medium' : 'text-gray-400'}`}>
            {labels[i]}
          </span>
        </div>
      ))}
    </div>
  );
}

// --- Main Component ---

export default function PrivacyAnalyzer() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState('');
  const [progress, setProgress] = useState(0);

  const analyzePolicy = async () => {
    if (!url.trim()) {
      setError('Please enter a URL');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);
    setProgress(10);

    let progressInterval: ReturnType<typeof setInterval> | undefined;
    try {
      progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + Math.random() * 8, 90));
      }, 2000);

      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: url.trim() }),
      });

      clearInterval(progressInterval);

      if (!response.ok) {
        let errorMsg = 'Analysis failed. Please try again.';
        try {
          const contentType = response.headers.get('content-type');
          if (contentType?.includes('application/json')) {
            const errorData = await response.json();
            errorMsg = errorData.error || errorMsg;
          } else {
            const text = await response.text();
            if (text.includes('<!DOCTYPE') || text.includes('<html')) {
              if (response.status === 504) errorMsg = 'Request timed out. The website may have bot protection.';
              else if (response.status === 502) errorMsg = 'Unable to process this website.';
              else errorMsg = 'Unable to analyze this website. Try a different URL.';
            }
          }
        } catch {
          errorMsg = `Request failed (${response.status}). Try again later.`;
        }
        throw new Error(errorMsg);
      }

      setProgress(100);
      const data = await response.json();
      setTimeout(() => {
        setResult(data);
        setLoading(false);
        setProgress(0);
      }, 300);
    } catch (err: unknown) {
      if (progressInterval) clearInterval(progressInterval);
      setError(err instanceof Error ? err.message : 'An error occurred');
      setLoading(false);
      setProgress(0);
    }
  };

  const resetAnalysis = () => {
    setUrl('');
    setResult(null);
    setError('');
    setLoading(false);
    setProgress(0);
  };

  const getGradeColor = (grade: string) => {
    if (grade.startsWith('A')) return 'bg-green-100 text-green-800';
    if (grade.startsWith('B')) return 'bg-blue-100 text-blue-800';
    if (grade.startsWith('C')) return 'bg-yellow-100 text-yellow-800';
    if (grade.startsWith('D')) return 'bg-orange-100 text-orange-800';
    return 'bg-red-100 text-red-800';
  };

  const getRiskColor = (risk: string) => {
    if (risk === 'EXEMPLARY' || risk === 'LOW') return 'bg-green-50 text-green-700 border-green-200';
    if (risk === 'MODERATE') return 'bg-yellow-50 text-yellow-700 border-yellow-200';
    return 'bg-red-50 text-red-700 border-red-200';
  };

  const findingsCounts = useMemo(() => {
    if (!result?.analysis?.critical_findings) return { high: 0, regulatory: 0, impact: 0 };
    return {
      high: result.analysis.critical_findings.high_risk_practices?.length || 0,
      regulatory: result.analysis.critical_findings.regulatory_gaps?.length || 0,
      impact: result.analysis.critical_findings.data_subject_impacts?.length || 0,
    };
  }, [result]);

  const allFindings = useMemo(() => {
    if (!result?.analysis?.critical_findings) return [];
    return [
      ...(result.analysis.critical_findings.high_risk_practices || []),
      ...(result.analysis.critical_findings.regulatory_gaps || []),
      ...(result.analysis.critical_findings.data_subject_impacts || []),
    ];
  }, [result]);

  return (
    <div className="w-full max-w-3xl mx-auto">
      {/* Search */}
      <div className="mb-8">
        <div className="flex gap-2">
          <Input
            type="url"
            placeholder="https://example.com/privacy-policy"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !loading && analyzePolicy()}
            disabled={loading}
            className="h-12 text-base"
          />
          <Button
            onClick={analyzePolicy}
            disabled={loading || !url.trim()}
            className="h-12 px-6 bg-gray-900 hover:bg-gray-800 text-white font-medium"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
            ) : (
              <Search className="h-4 w-4" />
            )}
          </Button>
          {(url || result) && !loading && (
            <Button onClick={resetAnalysis} variant="outline" className="h-12 px-3">
              <RotateCcw className="h-4 w-4" />
            </Button>
          )}
        </div>
        {error && (
          <div className="flex items-start gap-2 text-red-600 bg-red-50 p-3 rounded-lg text-sm mt-3">
            <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
            <span className="text-sm">{error}</span>
          </div>
        )}
      </div>

      {/* Loading */}
      {loading && (
        <div className="py-12">
          <div className="w-full bg-gray-100 rounded-full h-1.5 mb-4">
            <div
              className="h-full bg-gray-900 rounded-full transition-all duration-700"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-sm text-gray-500 text-center">Analyzing privacy policy...</p>
        </div>
      )}

      {/* Results */}
      {result && (
        <div className="space-y-8">
          {/* Score Header: Doughnut Gauge + Grade + Risk */}
          <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-gray-100">
            <ScoreGauge score={result.analysis.overall_score} />
            <div className="flex-1 text-center sm:text-left">
              <a
                href={result.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-gray-500 hover:text-gray-700 inline-flex items-center gap-1 mb-3"
              >
                {new URL(result.url).hostname}
                <ExternalLink className="h-3 w-3" />
              </a>
              <div className="flex items-center gap-3 justify-center sm:justify-start">
                <Badge className={`text-2xl px-4 py-2 font-bold ${getGradeColor(result.analysis.privacy_grade)}`}>
                  {result.analysis.privacy_grade}
                </Badge>
                <Badge variant="outline" className={`text-xs border ${getRiskColor(result.analysis.risk_level)}`}>
                  {result.analysis.risk_level.replace('-', ' ')} RISK
                </Badge>
              </div>
            </div>
          </div>

          {/* DPDP Compliance Gauge */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-semibold text-gray-900">DPDP Act 2023 Compliance</span>
            </div>
            <ComplianceGauge status={result.analysis.regulatory_compliance?.dpdp_act_compliance ?? ''} />
          </div>

          {/* Executive Summary */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-2">Summary</h3>
            <p className="text-sm text-gray-600 leading-relaxed">{result.analysis.executive_summary}</p>
          </div>

          {/* Charts Row: Radar + Bar */}
          <div className="grid sm:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Category Overview</h3>
              <CategoryRadar categories={result.analysis.categories ?? {}} />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Score Breakdown</h3>
              <CategoryBarChart categories={result.analysis.categories ?? {}} />
            </div>
          </div>

          {/* Category Details */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Category Details</h3>
            <div className="space-y-3">
              {CATEGORY_ORDER.map(key => {
                const category = result.analysis.categories?.[key];
                const meta = CATEGORY_META[key];
                if (!category || !meta) return null;
                const color = getScoreColor(category.score);
                return (
                  <div key={key} className="flex gap-3 p-3 rounded-lg bg-gray-50">
                    <div className="flex-shrink-0 mt-0.5 text-gray-400">{meta.icon}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-gray-700">{meta.label}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-gray-400">{meta.weight}% weight</span>
                          <span className="text-sm font-bold" style={{ color }}>{category.score.toFixed(1)}</span>
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 leading-relaxed">{category.reasoning}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Critical Findings with Donut */}
          {allFindings.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-red-700 mb-4">Critical Findings</h3>
              <div className="flex flex-col sm:flex-row gap-6">
                <FindingsDonut findings={findingsCounts} />
                <ul className="flex-1 space-y-2">
                  {allFindings.map((finding, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-red-600">
                      <div className="w-1.5 h-1.5 bg-red-400 rounded-full mt-1.5 flex-shrink-0" />
                      {finding}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Positive Practices */}
          {result.analysis.positive_practices?.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-green-700 mb-3">Positive Practices</h3>
              <ul className="space-y-2">
                {result.analysis.positive_practices.map((practice, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-green-600">
                    <CheckCircle className="h-3.5 w-3.5 mt-0.5 flex-shrink-0" />
                    {practice}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Recommendations */}
          {result.analysis.actionable_recommendations && (
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-4">Recommendations</h3>
              <div className="grid sm:grid-cols-3 gap-4">
                {result.analysis.actionable_recommendations.immediate_actions?.length > 0 && (
                  <div className="p-4 bg-red-50 rounded-lg border border-red-100">
                    <h4 className="text-xs font-semibold text-red-600 uppercase tracking-wide mb-2">Immediate</h4>
                    <ul className="space-y-1.5">
                      {result.analysis.actionable_recommendations.immediate_actions.map((a, i) => (
                        <li key={i} className="text-xs text-gray-700">&bull; {a}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {result.analysis.actionable_recommendations.medium_term_improvements?.length > 0 && (
                  <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-100">
                    <h4 className="text-xs font-semibold text-yellow-600 uppercase tracking-wide mb-2">Medium Term</h4>
                    <ul className="space-y-1.5">
                      {result.analysis.actionable_recommendations.medium_term_improvements.map((a, i) => (
                        <li key={i} className="text-xs text-gray-700">&bull; {a}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {result.analysis.actionable_recommendations.best_practice_adoption?.length > 0 && (
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                    <h4 className="text-xs font-semibold text-blue-600 uppercase tracking-wide mb-2">Best Practices</h4>
                    <ul className="space-y-1.5">
                      {result.analysis.actionable_recommendations.best_practice_adoption.map((a, i) => (
                        <li key={i} className="text-xs text-gray-700">&bull; {a}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Disclaimer */}
          <p className="text-xs text-gray-400 pt-4 border-t border-gray-100">
            This analysis is for educational purposes only and should not be used as legal advice. Consult qualified legal professionals for compliance matters.
          </p>
        </div>
      )}
    </div>
  );
}
