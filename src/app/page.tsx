'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Sparkles, ShieldCheck, ScrollText, FileSearch, ArrowRight, Fingerprint, BookOpen } from 'lucide-react';
import PrivacyAnalyzer from '@/components/PrivacyAnalyzer';
import RecentAnalyses from '@/components/RecentAnalyses';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

const features = [
  {
    icon: FileSearch,
    title: 'AI-Powered Analysis',
    body: 'Advanced language models parse dense legal text and surface the details that actually affect you.',
  },
  {
    icon: ShieldCheck,
    title: 'DPDP Act 2023 Compliance',
    body: "Every report checks alignment with India's Digital Personal Data Protection Act and 2025 Rules.",
  },
  {
    icon: ScrollText,
    title: 'Clear Recommendations',
    body: 'Get a plain-language summary, a 1–10 privacy score, and concrete steps to protect yourself.',
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="relative overflow-hidden px-4 pt-20 pb-16 sm:px-6 lg:px-8">
        {/* Ambient gradient backdrop */}
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute left-1/2 top-[-6rem] h-[28rem] w-[52rem] -translate-x-1/2 rounded-full bg-gradient-to-br from-indigo-200/50 via-sky-200/40 to-emerald-100/40 blur-3xl" />
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
        </div>

        <div className="mx-auto max-w-3xl text-center">
          <motion.div variants={fadeUp} initial="hidden" animate="show" custom={0}>
            <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/70 px-4 py-1.5 text-sm font-medium text-slate-600 shadow-sm backdrop-blur">
              <Sparkles className="h-4 w-4 text-indigo-500" />
              AI-powered privacy analysis · DPDP Act 2023
            </span>
          </motion.div>

          <motion.h1
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={1}
            className="mt-6 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl md:text-6xl"
          >
            Understand how your{' '}
            <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-sky-600 bg-clip-text text-transparent">
              data is used
            </span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={2}
            className="mx-auto mt-5 max-w-2xl text-lg text-slate-500"
          >
            Paste any privacy policy URL. Our AI reads it in seconds and gives you a clear, scored
            report with actionable recommendations — or browse reports others have already run.
          </motion.p>

          <motion.div
            id="analyzer"
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={3}
            className="mt-10"
          >
            <PrivacyAnalyzer />
          </motion.div>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={4}
            className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-slate-400"
          >
            <span className="flex items-center gap-1.5"><ShieldCheck className="h-4 w-4 text-emerald-500" /> No signup required</span>
            <span className="flex items-center gap-1.5"><Sparkles className="h-4 w-4 text-indigo-400" /> Free to use</span>
            <span className="flex items-center gap-1.5"><ScrollText className="h-4 w-4 text-sky-400" /> Reports cached for 60 days</span>
          </motion.div>
        </div>
      </section>

      {/* Recently analyzed — browse existing reports instead of re-running */}
      <div className="border-y border-slate-100 bg-gradient-to-b from-slate-50/60 to-white">
        <RecentAnalyses />
      </div>

      {/* Features */}
      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.5 }}
            className="mb-14 text-center"
          >
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">Why PrivacyAnalyzer</h2>
            <p className="mt-2 text-slate-500">Enterprise-grade analysis, built for everyday users.</p>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-3">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                whileHover={{ y: -4 }}
                className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm transition-shadow hover:shadow-lg"
              >
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-slate-900 to-slate-700 text-white">
                  <f.icon className="h-6 w-6" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-slate-900">{f.title}</h3>
                <p className="text-sm leading-relaxed text-slate-500">{f.body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Privacy Tools */}
      <section className="border-t border-slate-200 bg-slate-50 px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-8 text-2xl font-bold tracking-tight text-slate-900">Privacy tools</h2>
          <div className="grid gap-6 sm:grid-cols-2">
            {[
              { href: '/digital-fingerprint', icon: Fingerprint, title: 'Digital Fingerprint', body: 'See what your browser reveals to every site you visit.' },
              { href: '/methodology', icon: BookOpen, title: 'Methodology', body: 'Learn how we score and evaluate privacy policies.' },
            ].map((t, i) => (
              <motion.div
                key={t.href}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <Link
                  href={t.href}
                  className="group flex h-full items-start gap-4 rounded-2xl border border-slate-200 bg-white p-6 text-left transition-all hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-700 transition-colors group-hover:bg-slate-900 group-hover:text-white">
                    <t.icon className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="flex items-center gap-1 text-base font-semibold text-slate-900">
                      {t.title}
                      <ArrowRight className="h-4 w-4 text-slate-300 transition-all group-hover:translate-x-0.5 group-hover:text-slate-900" />
                    </h3>
                    <p className="mt-1 text-sm text-slate-500">{t.body}</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
