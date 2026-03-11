'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Heart, 
  Server, 
  Zap, 
  ExternalLink,
  Gift,
  Users
} from 'lucide-react';

export function SupportSection() {
  const apiCosts = [
    { service: 'Firecrawl API', cost: '$0.002/page', description: 'Web scraping and privacy policy extraction' },
    { service: 'OpenRouter AI', cost: '$0.001/1K tokens', description: 'DeepSeek AI model for privacy analysis' },
    { service: 'Vercel Hosting', cost: '$20/month', description: 'Serverless deployment and bandwidth' },
    { service: 'Database Storage', cost: '$5/month', description: 'Analysis history and user data' },
  ];

  const supportOptions = [
    {
      name: 'Generic Donation',
      icon: <Heart className="h-6 w-6" />,
      color: 'bg-pink-100 text-pink-800',
      description: 'Support infrastructure costs and keep PrivacyHub free for everyone',
      url: 'https://github.com/sponsors/privacypriority'
    },
    {
      name: 'Open Source Contribution',
      icon: <Gift className="h-6 w-6" />,
      color: 'bg-purple-100 text-purple-800',
      description: 'Contribute code, report bugs, or improve documentation on GitHub',
      url: 'https://github.com/privacypriority/privacyhub'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Main Support Card */}
      <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50">
        <CardContent className="p-8">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <div className="p-3 bg-blue-100 rounded-full">
                <Heart className="h-8 w-8 text-blue-600" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-blue-900 mb-4">Support PrivacyHub</h3>
            <p className="text-lg text-blue-800 max-w-3xl mx-auto leading-relaxed">
              PrivacyHub is a free, open-source project that helps protect your digital privacy. 
              Your support helps us cover API costs and maintain this valuable service for everyone.
            </p>
          </div>

          {/* Cost Breakdown */}
          <div className="mb-8">
            <h4 className="text-lg font-semibold text-blue-900 mb-4 flex items-center gap-2">
              <Server className="h-5 w-5" />
              Infrastructure Costs
            </h4>
            <div className="grid md:grid-cols-2 gap-4">
              {apiCosts.map((cost, index) => (
                <div key={index} className="bg-white rounded-lg p-4 border border-blue-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-blue-900">{cost.service}</span>
                    <Badge variant="outline" className="text-blue-700 border-blue-300">
                      {cost.cost}
                    </Badge>
                  </div>
                  <p className="text-sm text-blue-700">{cost.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Support Options */}
          <div className="grid md:grid-cols-2 gap-6">
            {supportOptions.map((option, index) => (
              <Card key={index} className="border-2 border-blue-200 hover:border-blue-300 transition-colors">
                <CardContent className="p-8 text-center">
                  <div className="flex items-center justify-center mb-4">
                    <div className={`p-4 rounded-full ${option.color.replace('text-', 'bg-').replace('-800', '-100')}`}>
                      {option.icon}
                    </div>
                  </div>
                  <h4 className="text-xl font-bold text-gray-900 mb-4">{option.name}</h4>
                  <p className="text-gray-600 mb-6 leading-relaxed">{option.description}</p>
                  <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700" asChild>
                    <a
                      href={option.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2"
                    >
                      {option.name === 'Generic Donation' ? 'Donate Now' : 'Contribute'}
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Impact Statement */}
          <div className="mt-8 bg-white rounded-lg p-6 border border-blue-200">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-green-100 rounded-lg">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Your Impact</h4>
                <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-700">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    <span>Keep the service free for everyone</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    <span>Support privacy awareness education</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    <span>Fund new privacy analysis features</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    <span>Maintain high-quality AI analysis</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Alternative Support */}
          <div className="mt-6 text-center">
            <p className="text-sm text-blue-700 mb-3">Can&apos;t donate? You can still help:</p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button variant="outline" size="sm" asChild>
                <a
                  href="https://github.com/privacypriority/privacyhub"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2"
                >
                  ⭐ Star on GitHub
                </a>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <a
                  href="https://twitter.com/intent/tweet?text=Check%20out%20PrivacyHub%20-%20a%20free%20tool%20to%20analyze%20privacy%20policies%20https://privacyhub.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2"
                >
                  📢 Share with friends
                </a>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <a
                  href="https://github.com/privacypriority/privacyhub/issues"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2"
                >
                  🐛 Report bugs
                </a>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Transparency Note */}
      <Card className="border-gray-200 bg-gray-50">
        <CardContent className="p-6">
          <div className="flex items-start gap-3">
            <Zap className="h-6 w-6 text-gray-600 flex-shrink-0 mt-1" />
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Full Transparency</h4>
              <p className="text-sm text-gray-700 mb-3">
                All donations go directly to covering infrastructure costs. We maintain full financial 
                transparency and will publish regular cost breakdowns. Any excess funds will be used 
                to expand features and improve the service.
              </p>
              <p className="text-xs text-gray-600">
                PrivacyHub is committed to remaining free and open-source. Your privacy is never for sale.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}