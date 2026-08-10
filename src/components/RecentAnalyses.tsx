'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, ShieldCheck, Clock } from 'lucide-react';

interface RecentAnalysis {
  id: number;
  url: string;
  domain: string;
  overall_score: number;
  privacy_grade: string;
  risk_level: string;
  homepage_screenshot: string | null;
  created_at: string;
  last_checked_at: string;
  analysis?: { executive_summary?: string } | null;
}

function gradeTheme(grade: string) {
  const g = (grade || '').charAt(0).toUpperCase();
  switch (g) {
    case 'A': return { text: 'text-emerald-700', bg: 'bg-emerald-50', ring: 'ring-emerald-200', bar: 'bg-emerald-500', glow: 'from-emerald-400/20' };
    case 'B': return { text: 'text-sky-700', bg: 'bg-sky-50', ring: 'ring-sky-200', bar: 'bg-sky-500', glow: 'from-sky-400/20' };
    case 'C': return { text: 'text-amber-700', bg: 'bg-amber-50', ring: 'ring-amber-200', bar: 'bg-amber-500', glow: 'from-amber-400/20' };
    case 'D': return { text: 'text-orange-700', bg: 'bg-orange-50', ring: 'ring-orange-200', bar: 'bg-orange-500', glow: 'from-orange-400/20' };
    default: return { text: 'text-rose-700', bg: 'bg-rose-50', ring: 'ring-rose-200', bar: 'bg-rose-500', glow: 'from-rose-400/20' };
  }
}

function riskTheme(risk: string) {
  const r = (risk || '').toUpperCase();
  if (r === 'LOW' || r === 'EXEMPLARY') return 'bg-emerald-50 text-emerald-700';
  if (r === 'MODERATE') return 'bg-amber-50 text-amber-700';
  if (r === 'MODERATE-HIGH') return 'bg-orange-50 text-orange-700';
  return 'bg-rose-50 text-rose-700';
}

function timeAgo(dateString: string): string {
  const d = new Date(dateString).getTime();
  if (Number.isNaN(d)) return '';
  const s = Math.floor((Date.now() - d) / 1000);
  if (s < 60) return 'just now';
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  const days = Math.floor(s / 86400);
  if (days < 30) return `${days}d ago`;
  return `${Math.floor(days / 30)}mo ago`;
}

function Favicon({ domain }: { domain: string }) {
  const [failed, setFailed] = useState(false);
  const letter = (domain || '?').replace(/^www\./, '').charAt(0).toUpperCase();
  if (failed) {
    return (
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-slate-700 to-slate-900 text-sm font-bold text-white">
        {letter}
      </div>
    );
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`https://www.google.com/s2/favicons?domain=${encodeURIComponent(domain)}&sz=64`}
      alt=""
      width={40}
      height={40}
      loading="lazy"
      onError={() => setFailed(true)}
      className="h-10 w-10 rounded-xl border border-slate-100 bg-white object-contain p-1.5"
    />
  );
}

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};
const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] as const } },
};

export default function RecentAnalyses() {
  const [analyses, setAnalyses] = useState<RecentAnalysis[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await fetch('/api/history?limit=9');
        if (!res.ok) throw new Error('history unavailable');
        const data = await res.json();
        if (alive) setAnalyses(Array.isArray(data.analyses) ? data.analyses : []);
      } catch {
        if (alive) setAnalyses([]);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, []);

  // Hide the whole section when there's nothing to show (e.g. no DB / empty).
  if (!loading && analyses.length === 0) return null;

  return (
    <section className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5 }}
          className="mb-10 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end"
        >
          <div>
            <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
              <ShieldCheck className="h-3.5 w-3.5" />
              Community insights
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Recently analyzed
            </h2>
            <p className="mt-1 text-slate-500">
              Fresh privacy assessments from the last 60 days. Tap a card to view the full report.
            </p>
          </div>
        </motion.div>

        {loading ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-40 animate-pulse rounded-2xl border border-slate-200 bg-slate-50" />
            ))}
          </div>
        ) : (
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-60px' }}
            className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
          >
            {analyses.map((a) => {
              const theme = gradeTheme(a.privacy_grade);
              const score = Math.max(0, Math.min(10, Number(a.overall_score) || 0));
              const domain = (a.domain || '').replace(/^www\./, '');
              return (
                <motion.div key={a.id} variants={item} whileHover={{ y: -6 }} transition={{ type: 'spring', stiffness: 300, damping: 22 }}>
                  <Link
                    href={`/results/${encodeURIComponent(domain)}`}
                    className="group relative block overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-xl"
                  >
                    <div className={`pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-gradient-to-br ${theme.glow} to-transparent blur-2xl`} />
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex min-w-0 items-center gap-3">
                        <Favicon domain={domain} />
                        <div className="min-w-0">
                          <p className="truncate font-semibold text-slate-900">{domain}</p>
                          <p className="flex items-center gap-1 text-xs text-slate-400">
                            <Clock className="h-3 w-3" />
                            {timeAgo(a.last_checked_at || a.created_at)}
                          </p>
                        </div>
                      </div>
                      <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-lg font-bold ring-1 ${theme.bg} ${theme.text} ${theme.ring}`}>
                        {a.privacy_grade}
                      </div>
                    </div>

                    {a.analysis?.executive_summary && (
                      <p className="mt-4 line-clamp-2 text-sm leading-relaxed text-slate-500">
                        {a.analysis.executive_summary}
                      </p>
                    )}

                    <div className="mt-5">
                      <div className="mb-1.5 flex items-baseline justify-between">
                        <span className="text-xs font-medium uppercase tracking-wide text-slate-400">Privacy score</span>
                        <span className="text-sm font-bold text-slate-900">{score.toFixed(1)}<span className="text-slate-400">/10</span></span>
                      </div>
                      <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                        <motion.div
                          className={`h-full rounded-full ${theme.bar}`}
                          initial={{ width: 0 }}
                          whileInView={{ width: `${score * 10}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.8, ease: 'easeOut', delay: 0.1 }}
                        />
                      </div>
                    </div>

                    <div className="mt-4 flex items-center justify-between">
                      <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${riskTheme(a.risk_level)}`}>
                        {(a.risk_level || '').replace('-', ' ')} RISK
                      </span>
                      <span className="flex items-center gap-1 text-xs font-medium text-slate-400 transition-colors group-hover:text-slate-900">
                        View report
                        <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                      </span>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </div>
    </section>
  );
}
