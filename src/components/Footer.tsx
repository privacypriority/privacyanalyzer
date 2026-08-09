'use client';

import React from 'react';
import Link from 'next/link';
import { Shield, Github, Heart } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center">
                <Shield className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">PrivacyAnalyzer.in</span>
            </Link>
            <p className="text-gray-500 text-sm max-w-xs">
              Open-source privacy policy analyser powered by AI. Understand how websites handle your personal data.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-gray-500 hover:text-gray-900 transition-colors">
                  Privacy Analyser
                </Link>
              </li>
              <li>
                <Link href="/digital-fingerprint" className="text-gray-500 hover:text-gray-900 transition-colors">
                  Digital Fingerprint
                </Link>
              </li>
              <li>
                <Link href="/methodology" className="text-gray-500 hover:text-gray-900 transition-colors">
                  Methodology
                </Link>
              </li>
              <li>
                <Link href="/for-website-owners" className="text-gray-500 hover:text-gray-900 transition-colors">
                  For Website Owners
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-500 hover:text-gray-900 transition-colors">
                  About
                </Link>
              </li>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Connect</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="https://github.com/privacypriority/privacyanalyzer"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-500 hover:text-gray-900 transition-colors inline-flex items-center gap-1.5"
                >
                  <Github className="h-4 w-4" />
                  GitHub
                </a>
              </li>
              <li>
                <Link
                  href="/support"
                  className="text-gray-500 hover:text-gray-900 transition-colors inline-flex items-center gap-1.5"
                >
                  <Heart className="h-4 w-4" />
                  Support Us
                </Link>
              </li>
              <li>
                <a
                  href="https://www.cloudflare.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-500 hover:text-gray-900 transition-colors"
                >
                  Hosted on Cloudflare
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-10 pt-6 border-t border-gray-200 text-center text-sm text-gray-400">
          &copy; {new Date().getFullYear()} PrivacyAnalyzer.in. Open source privacy analysis platform.
        </div>
      </div>
    </footer>
  );
}
