'use client';

import React, { useState } from 'react';
import {
  FacebookShareButton,
  TwitterShareButton,
  LinkedinShareButton,
  WhatsappShareButton,
  EmailShareButton,
  FacebookIcon,
  TwitterIcon,
  LinkedinIcon,
  WhatsappIcon,
  EmailIcon,
} from 'react-share';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Share2, Check, Copy } from 'lucide-react';

interface ShareButtonsProps {
  url?: string;
  title?: string;
  description?: string;
  privacyGrade?: string;
  overallScore?: number;
  pageType?: 'analysis' | 'general';
}

export function ShareButtons({
  url,
  title,
  description,
  privacyGrade,
  overallScore,
  pageType = 'general'
}: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  // Build share content
  const shareUrl = typeof window !== 'undefined' ? window.location.href : (url || 'https://privacyanalyzer.in');

  // For analysis pages
  const isAnalysisPage = pageType === 'analysis' || (privacyGrade && overallScore);

  let defaultTitle = "PrivacyAnalyzer - Privacy Policy Analyzer for India";
  let defaultDescription = "Analyze privacy policies for DPDP Act 2023 compliance. AI-powered privacy analysis helping Indians make informed choices about their data.";
  let emailBodyContent = `I found this helpful resource for understanding privacy policies and DPDP Act 2023 compliance.

PrivacyAnalyzer.in is India's first AI-powered privacy policy analyzer. It helps you:
• Understand complex privacy policies in simple language
• Check DPDP Act 2023 compliance
• Make informed decisions about your data
• Know your rights as a Data Principal

Check it out: ${shareUrl}`;

  if (isAnalysisPage && url) {
    const domain = new URL(url).hostname;
    defaultTitle = privacyGrade && overallScore
      ? `${domain} Privacy Score: ${overallScore}/10 (Grade ${privacyGrade}) - DPDP Act Analysis`
      : `Privacy Policy Analysis for ${domain} - PrivacyAnalyzer.in`;

    defaultDescription = `I analyzed ${domain}'s privacy policy using PrivacyAnalyzer.in - India's DPDP Act 2023 compliance checker. Check your app's privacy score!`;

    emailBodyContent = `I just analyzed ${domain}'s privacy policy for DPDP Act 2023 compliance using PrivacyAnalyzer.in.

${privacyGrade && overallScore ? `Privacy Grade: ${privacyGrade}
Overall Score: ${overallScore}/10

` : ''}Check it out and analyze your favorite apps too: ${shareUrl}

PrivacyAnalyzer helps you understand what apps do with your data and how they comply with India's Digital Personal Data Protection Act 2023.`;
  }

  const shareTitle = title || defaultTitle;
  const shareDescription = description || defaultDescription;
  const emailBody = emailBodyContent;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <Card className="border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50 shadow-lg">
      <CardContent className="p-6">
        <div className="flex items-start gap-3">
          <div className="bg-purple-100 rounded-full p-3">
            <Share2 className="h-6 w-6 text-purple-600" />
          </div>
          <div className="flex-1">
            <h4 className="text-xl font-black text-purple-900 mb-2">
              Spread Privacy Awareness
            </h4>
            <p className="text-sm text-purple-800 mb-4">
              {isAnalysisPage
                ? "Share this analysis to help others understand privacy policies and make informed choices about their data."
                : "Help others discover their privacy rights and learn about DPDP Act 2023 compliance."}
            </p>

            {/* Social Share Buttons */}
            <div className="flex flex-wrap gap-3 mb-4">
              <WhatsappShareButton
                url={shareUrl}
                title={shareTitle}
                separator=" - "
              >
                <div className="flex items-center gap-2 hover:scale-105 transition-transform">
                  <WhatsappIcon size={40} round />
                  <span className="text-sm font-medium text-gray-700">WhatsApp</span>
                </div>
              </WhatsappShareButton>

              <TwitterShareButton
                url={shareUrl}
                title={shareTitle}
                hashtags={['PrivacyMatters', 'DPDPAct', 'DataPrivacy']}
              >
                <div className="flex items-center gap-2 hover:scale-105 transition-transform">
                  <TwitterIcon size={40} round />
                  <span className="text-sm font-medium text-gray-700">Twitter</span>
                </div>
              </TwitterShareButton>

              <FacebookShareButton
                url={shareUrl}
                hashtag="#PrivacyMatters"
              >
                <div className="flex items-center gap-2 hover:scale-105 transition-transform">
                  <FacebookIcon size={40} round />
                  <span className="text-sm font-medium text-gray-700">Facebook</span>
                </div>
              </FacebookShareButton>

              <LinkedinShareButton
                url={shareUrl}
                title={shareTitle}
                summary={defaultDescription}
                source="PrivacyAnalyzer.in"
              >
                <div className="flex items-center gap-2 hover:scale-105 transition-transform">
                  <LinkedinIcon size={40} round />
                  <span className="text-sm font-medium text-gray-700">LinkedIn</span>
                </div>
              </LinkedinShareButton>

              <EmailShareButton
                url={shareUrl}
                subject={shareTitle}
                body={emailBody}
              >
                <div className="flex items-center gap-2 hover:scale-105 transition-transform">
                  <EmailIcon size={40} round />
                  <span className="text-sm font-medium text-gray-700">Email</span>
                </div>
              </EmailShareButton>
            </div>

            {/* Copy Link Button */}
            <Button
              onClick={handleCopyLink}
              variant="outline"
              className="w-full sm:w-auto border-2 border-purple-300 hover:bg-purple-100 text-purple-700 font-semibold"
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  Link Copied!
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4 mr-2" />
                  Copy Link
                </>
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
