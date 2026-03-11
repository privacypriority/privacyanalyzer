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
              <div className="text-xl font-bold text-gray-900">
                PrivacyHub.in
              </div>
            </Link>
            <p className="text-sm text-gray-600">
              AI-powered privacy policy analysis with DPDP Act 2023 compliance checks.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-600 hover:text-gray-900 transition-colors text-sm">
                  Privacy Analyser
                </Link>
              </li>
              <li>
                <Link href="/digital-fingerprint" className="text-gray-600 hover:text-gray-900 transition-colors text-sm">
                  Digital Fingerprint
                </Link>
              </li>
              <li>
                <Link href="/methodology" className="text-gray-600 hover:text-gray-900 transition-colors text-sm">
                  Methodology
                </Link>
              </li>
              <li>
                <Link href="/for-website-owners" className="text-gray-600 hover:text-gray-900 transition-colors text-sm">
                  For Website Owners
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-600 hover:text-gray-900 transition-colors text-sm">
                  About
                </Link>
              </li>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Connect</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://github.com/privacypriority/privacyhub"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-gray-900 transition-colors flex items-center gap-1 text-sm"
                >
                  <Github className="h-4 w-4" />
                  Source Code
                </a>
              </li>
              <li>
                <Link
                  href="/support"
                  className="text-gray-600 hover:text-gray-900 transition-colors flex items-center gap-1 text-sm"
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
                  className="text-gray-600 hover:text-gray-900 transition-colors text-sm"
                >
                  Hosted on Cloudflare
                </a>
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