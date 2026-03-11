'use client';

import React from 'react';
import Link from 'next/link';
import PrivacyAnalyzer from '@/components/PrivacyAnalyzer';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 border-b border-gray-200">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Understand How Your Data Is Used
          </h1>
          <p className="text-lg text-gray-500 mb-10">
            Paste any privacy policy URL. Our AI reads it in seconds and gives you a clear,
            scored report with actionable recommendations.
          </p>
          <div id="analyzer">
            <PrivacyAnalyzer />
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-10 text-center">
          <div>
            <div className="w-10 h-10 bg-gray-900 rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 3.104v5.714a2.25 2.25 0 0 1-.659 1.591L5 14.5M9.75 3.104c.251-.023.504-.035.75-.035s.499.012.75.035M9.75 3.104A25 25 0 0 1 12 3c.764 0 1.52.035 2.25.104M19 14.5l-4.091-4.091a2.25 2.25 0 0 1-.659-1.591V3.104" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">AI-Powered Analysis</h3>
            <p className="text-sm text-gray-500">
              Advanced language models parse dense legal text and surface the details that matter to you.
            </p>
          </div>
          <div>
            <div className="w-10 h-10 bg-gray-900 rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">DPDP Act Compliance</h3>
            <p className="text-sm text-gray-500">
              Every report checks alignment with India&apos;s Digital Personal Data Protection Act 2023.
            </p>
          </div>
          <div>
            <div className="w-10 h-10 bg-gray-900 rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 0 1 0 3.75H5.625a1.875 1.875 0 0 1 0-3.75Z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Clear Recommendations</h3>
            <p className="text-sm text-gray-500">
              Get a plain-language summary, a 1-10 privacy score, and concrete steps to protect yourself.
            </p>
          </div>
        </div>
      </section>

      {/* Privacy Tools */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 border-t border-gray-200 bg-gray-50">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Privacy Tools</h2>
          <div className="grid sm:grid-cols-2 gap-6">
            <Link
              href="/digital-fingerprint"
              className="block rounded-lg border border-gray-200 bg-white p-6 hover:shadow-md transition-shadow"
            >
              <h3 className="text-base font-semibold text-gray-900 mb-1">Digital Fingerprint</h3>
              <p className="text-sm text-gray-500">See what your browser reveals to every site you visit.</p>
            </Link>
            <Link
              href="/methodology"
              className="block rounded-lg border border-gray-200 bg-white p-6 hover:shadow-md transition-shadow"
            >
              <h3 className="text-base font-semibold text-gray-900 mb-1">Methodology</h3>
              <p className="text-sm text-gray-500">Learn how we score and evaluate privacy policies.</p>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
