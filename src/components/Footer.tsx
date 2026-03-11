'use client';

import React from 'react';
import Link from 'next/link';
import { Shield, Github, Heart } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Shield className="h-5 w-5 text-white" />
              </div>
              <div className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                PrivacyHub.in
              </div>
            </Link>
            <p className="text-gray-600 max-w-md">
              Professional privacy policy analyser powered by AI. Understand how websites handle your personal data with comprehensive scoring and regulatory compliance checks.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-600 hover:text-blue-600 transition-colors">
                  Privacy Policy Analyser
                </Link>
              </li>
              <li>
                <Link href="/" className="text-gray-600 hover:text-blue-600 transition-colors">
                  Analysis History
                </Link>
              </li>
              <li>
                <Link href="/methodology" className="text-gray-600 hover:text-blue-600 transition-colors">
                  Methodology
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-600 hover:text-blue-600 transition-colors">
                  About Privacy
                </Link>
              </li>
            </ul>
          </div>

          {/* Infrastructure */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Infrastructure</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://www.cloudflare.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-blue-600 transition-colors"
                >
                  Cloudflare (DNS & Security)
                </a>
              </li>
              <li>
                <a
                  href="https://vercel.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-blue-600 transition-colors"
                >
                  Hosted on Vercel
                </a>
              </li>
              <li>
                <a
                  href="https://firecrawl.dev"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-blue-600 transition-colors"
                >
                  Powered by Firecrawl
                </a>
              </li>
              <li>
                <a
                  href="https://openrouter.ai"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-blue-600 transition-colors"
                >
                  AI via OpenRouter
                </a>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Support</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/support"
                  className="text-gray-600 hover:text-blue-600 transition-colors flex items-center gap-1"
                >
                  <Heart className="h-4 w-4" />
                  Support Us
                </Link>
              </li>
              <li>
                <a
                  href="https://github.com/privacypriority/privacyhub"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-blue-600 transition-colors flex items-center gap-1"
                >
                  <Github className="h-4 w-4" />
                  Source Code
                </a>
              </li>
              <li>
                <Link
                  href="/for-website-owners"
                  className="text-gray-600 hover:text-blue-600 transition-colors"
                >
                  For Website Owners
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-8 border-t border-gray-200 flex flex-col md:flex-row items-center justify-between">
          <div className="text-sm text-gray-500">
            © {new Date().getFullYear()} PrivacyHub.in. Open source privacy analysis platform.
          </div>
          <div className="flex items-center text-sm text-gray-500 mt-4 md:mt-0">
            <span>Made with</span>
            <Heart className="h-4 w-4 text-red-500 mx-1" />
            <span>for privacy awareness</span>
          </div>
        </div>
      </div>
    </footer>
  );
}