'use client';

import React from 'react';
import Link from 'next/link';
import PrivacyAnalyzer from '@/components/PrivacyAnalyzer';
import { Shield, ArrowRight } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero + Analyzer */}
      <section className="py-12 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4 tracking-tight">
              Know what apps do with your data
            </h1>
            <p className="text-base sm:text-lg text-gray-500 max-w-xl mx-auto">
              Paste any privacy policy URL. Get an instant score, compliance check against India&apos;s DPDP Act 2023, and clear recommendations.
            </p>
          </div>

          <PrivacyAnalyzer />

          <p className="text-center text-xs text-gray-400 mt-4">
            Free &middot; No account required &middot; Results in 30 seconds
          </p>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 border-t border-gray-100">
        <div className="max-w-5xl mx-auto">
          <div className="grid sm:grid-cols-3 gap-8">
            <div>
              <div className="w-10 h-10 bg-gray-900 rounded-lg flex items-center justify-center mb-4">
                <Shield className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-base font-semibold text-gray-900 mb-2">AI-Powered Analysis</h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                Reads the full privacy policy and scores it across 6 weighted categories covering data collection, sharing, rights, and security.
              </p>
            </div>
            <div>
              <div className="w-10 h-10 bg-gray-900 rounded-lg flex items-center justify-center mb-4">
                <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-base font-semibold text-gray-900 mb-2">DPDP Act Compliance</h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                Checks against India&apos;s Digital Personal Data Protection Act 2023 and Rules 2025 with specific section citations.
              </p>
            </div>
            <div>
              <div className="w-10 h-10 bg-gray-900 rounded-lg flex items-center justify-center mb-4">
                <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-base font-semibold text-gray-900 mb-2">Clear Recommendations</h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                Get actionable findings — critical risks, positive practices, and prioritized steps for improvement.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Tools */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-xl font-semibold text-gray-900 mb-8 text-center">Privacy Tools</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <Link
              href="/digital-fingerprint"
              className="flex items-center justify-between p-5 bg-white rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all group"
            >
              <div>
                <h3 className="font-medium text-gray-900 mb-1">Digital Fingerprint Check</h3>
                <p className="text-sm text-gray-500">See what your browser reveals to every website.</p>
              </div>
              <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-gray-600 transition-colors flex-shrink-0" />
            </Link>
            <Link
              href="/methodology"
              className="flex items-center justify-between p-5 bg-white rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all group"
            >
              <div>
                <h3 className="font-medium text-gray-900 mb-1">Scoring Methodology</h3>
                <p className="text-sm text-gray-500">Learn how we score privacy policies.</p>
              </div>
              <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-gray-600 transition-colors flex-shrink-0" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
