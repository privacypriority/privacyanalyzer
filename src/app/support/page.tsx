'use client';

import { SupportSection } from '@/components/SupportSection';
import { ShareButtons } from '@/components/ShareButtons';

export default function SupportPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-6">
            Help Us Keep This Free for Everyone
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed mb-4">
            PrivacyAnalyzer will always be 100% free. No ads, no tracking, no premium plans.
          </p>
          <p className="text-lg md:text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed mb-10">
            But running this service costs money—servers, AI analysis, and maintenance. If PrivacyAnalyzer helped you,
            <strong className="text-purple-700"> consider helping us help others.</strong>
          </p>

          {/* Impact Stats */}
          <div className="flex flex-wrap justify-center gap-6 text-sm">
            <div className="bg-white/80 backdrop-blur rounded-lg px-6 py-3 border-2 border-blue-300">
              <div className="text-2xl font-bold text-blue-600">1000+</div>
              <div className="text-blue-700 font-medium">Privacy Policies Analyzed</div>
              <div className="text-xs text-blue-600 mt-1">And counting!</div>
            </div>
            <div className="bg-white/80 backdrop-blur rounded-lg px-6 py-3 border-2 border-purple-300">
              <div className="text-2xl font-bold text-purple-600">100%</div>
              <div className="text-purple-700 font-medium">Free Forever</div>
              <div className="text-xs text-purple-600 mt-1">No paywalls</div>
            </div>
            <div className="bg-white/80 backdrop-blur rounded-lg px-6 py-3 border-2 border-pink-300">
              <div className="text-2xl font-bold text-pink-600">Zero</div>
              <div className="text-pink-700 font-medium">Ads or Tracking</div>
              <div className="text-xs text-pink-600 mt-1">Privacy first!</div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Support Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <SupportSection />
        </div>
      </section>

      {/* Why Support Matters */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Why This Matters
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Privacy protection shouldn&apos;t be a luxury only for tech experts. <strong className="text-gray-900">Everyone deserves to understand
              how their data is being used.</strong> Your support makes that possible.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Our Mission</h3>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <span className="text-3xl">🌍</span>
                  <div>
                    <h4 className="text-lg font-bold text-gray-900 mb-2">Universal Access</h4>
                    <p className="text-gray-700 leading-relaxed">
                      Privacy protection tools should be available to everyone, regardless of technical knowledge
                      or resources. We provide free access to privacy policy analysis for all users.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <span className="text-3xl">🎓</span>
                  <div>
                    <h4 className="text-lg font-bold text-gray-900 mb-2">Privacy Education</h4>
                    <p className="text-gray-700 leading-relaxed">
                      We make complex privacy policies easier to understand. By simplifying legal language,
                      we help users make informed decisions about their data.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <span className="text-3xl">⚖️</span>
                  <div>
                    <h4 className="text-lg font-bold text-gray-900 mb-2">DPDP Act Awareness</h4>
                    <p className="text-gray-700 leading-relaxed">
                      We help users understand India&apos;s Digital Personal Data Protection Act 2023
                      and how it affects their privacy rights.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">What Your Support Enables</h3>
              <div className="space-y-6">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 border-2 border-blue-300">
                  <h4 className="text-xl font-bold text-blue-900 mb-3 flex items-center gap-2">
                    <span>⚡</span> Right Now
                  </h4>
                  <ul className="space-y-2 text-blue-800">
                    <li className="flex items-center gap-2">
                      <span className="text-blue-600">✓</span>
                      <span>Keep PrivacyAnalyzer running 24/7 for everyone</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-blue-600">✓</span>
                      <span>Analyze more websites faster</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-blue-600">✓</span>
                      <span>Cover AI and server costs</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6 border-2 border-green-300">
                  <h4 className="text-xl font-bold text-green-900 mb-3 flex items-center gap-2">
                    <span>🚀</span> Coming Soon
                  </h4>
                  <ul className="space-y-2 text-green-800">
                    <li className="flex items-center gap-2">
                      <span className="text-green-600">→</span>
                      <span>Browser extension for instant privacy checks</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-green-600">→</span>
                      <span>Support for Hindi and other Indian languages</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-green-600">→</span>
                      <span>Mobile app for privacy on-the-go</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Community Support */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            More Ways to Help
          </h2>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed mb-4">
            Can&apos;t donate? No problem! There are other ways you can support our mission.
          </p>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto leading-relaxed mb-12">
            Every action—big or small—helps us reach more Indians and spread privacy awareness.
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-8 shadow-lg border-2 border-blue-200 hover:shadow-xl transition-shadow">
              <div className="text-5xl mb-4">💻</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Contribute Code</h3>
              <p className="text-gray-700 mb-6 leading-relaxed">
                Know how to code? Help us improve PrivacyAnalyzer on GitHub. Fix bugs, add features,
                or suggest improvements. Every contribution makes a difference!
              </p>
              <a
                href="https://github.com/privacypriority/privacyanalyzer/issues"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-700 font-bold inline-flex items-center gap-2"
              >
                View Open Issues →
              </a>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-lg border-2 border-green-200 hover:shadow-xl transition-shadow">
              <div className="text-5xl mb-4">📢</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Spread the Word</h3>
              <p className="text-gray-700 mb-6 leading-relaxed">
                Share PrivacyAnalyzer with your friends, family, and colleagues. Post on social media.
                The more people know about their privacy rights, the better!
              </p>
              <a
                href="#share"
                className="text-green-600 hover:text-green-700 font-bold inline-flex items-center gap-2"
              >
                Share Now →
              </a>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-lg border-2 border-purple-200 hover:shadow-xl transition-shadow">
              <div className="text-5xl mb-4">💡</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Give Feedback</h3>
              <p className="text-gray-700 mb-6 leading-relaxed">
                Found a bug? Have an idea? Tell us! Your feedback helps us make PrivacyAnalyzer
                better for everyone. We read and value every suggestion.
              </p>
              <a
                href="https://github.com/privacypriority/privacyanalyzer/issues"
                target="_blank"
                rel="noopener noreferrer"
                className="text-purple-600 hover:text-purple-700 font-bold inline-flex items-center gap-2"
              >
                Give Feedback →
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Spread Privacy Awareness */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-4xl mx-auto">
          <ShareButtons />
        </div>
      </section>
    </div>
  );
}