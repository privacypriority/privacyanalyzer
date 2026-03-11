'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Shield, Github, Menu, X as XIcon } from 'lucide-react';
import { useState } from 'react';

// Custom X (Twitter) Icon Component
const XTwitterIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    className={className}
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Digital Fingerprint', href: '/digital-fingerprint' },
    { name: 'Methodology', href: '/methodology' },
    { name: 'For Website Owners', href: '/for-website-owners' },
    { name: 'Support', href: '/support' },
    { name: 'About', href: '/about' },
  ];

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div className="text-2xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent font-[family-name:var(--font-poppins)]">
                PrivacyHub.in
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-gray-700 hover:text-blue-600 transition-colors duration-200 font-medium"
              >
                {item.name}
              </a>
            ))}

            {/* Social Links */}
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" asChild>
                <a
                  href="https://x.com/privacyhubin"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2"
                >
                  <XTwitterIcon className="h-4 w-4" />
                  <span>Follow</span>
                </a>
              </Button>

              <Button size="sm" asChild className="bg-gray-900 hover:bg-gray-800 text-white border-0">
                <a
                  href="https://github.com/privacypriority/privacyhub"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2"
                >
                  <Github className="h-4 w-4" />
                  <span>GitHub</span>
                </a>
              </Button>
            </div>
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <XIcon className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <nav className="flex flex-col space-y-3">
              {navigation.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-gray-700 hover:text-blue-600 transition-colors duration-200 font-medium py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </a>
              ))}

              <a
                href="https://x.com/privacyhubin"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-colors duration-200 font-medium py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                <XTwitterIcon className="h-4 w-4" />
                <span>Follow on X</span>
              </a>

              <a
                href="https://github.com/privacypriority/privacyhub"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 bg-gray-900 text-white hover:bg-gray-800 transition-colors duration-200 font-medium py-2 px-3 rounded-md"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Github className="h-4 w-4" />
                <span>GitHub</span>
              </a>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}