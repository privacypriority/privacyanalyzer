'use client';

import { MethodologySection } from '@/components/MethodologySection';
import { ShareButtons } from '@/components/ShareButtons';

export default function MethodologyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-800 bg-clip-text text-transparent mb-6">
            How We Score Privacy Policies
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed mb-6">
            We read every privacy policy word by word and grade it like a report card—from A+ (excellent privacy protection) to F (serious privacy risks).
            Our analysis is based on India&apos;s DPDP Act 2023 and international privacy standards.
          </p>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto font-medium">
            Simple, transparent, and designed to help YOU make informed decisions.
          </p>
          
          {/* Key Stats */}
          <div className="flex flex-wrap justify-center gap-6 text-sm mt-10">
            <div className="bg-white/80 backdrop-blur rounded-lg px-6 py-4 border-2 border-blue-200">
              <div className="text-3xl font-bold text-blue-600">6</div>
              <div className="text-blue-700 font-medium">Key Categories</div>
              <div className="text-xs text-blue-600 mt-1">We check</div>
            </div>
            <div className="bg-white/80 backdrop-blur rounded-lg px-6 py-4 border-2 border-indigo-200">
              <div className="text-3xl font-bold text-indigo-600">90+</div>
              <div className="text-indigo-700 font-medium">Privacy Points</div>
              <div className="text-xs text-indigo-600 mt-1">Analyzed</div>
            </div>
            <div className="bg-white/80 backdrop-blur rounded-lg px-6 py-4 border-2 border-purple-200">
              <div className="text-3xl font-bold text-purple-600">1-10</div>
              <div className="text-purple-700 font-medium">Privacy Score</div>
              <div className="text-xs text-purple-600 mt-1">Easy to understand</div>
            </div>
            <div className="bg-white/80 backdrop-blur rounded-lg px-6 py-4 border-2 border-green-200">
              <div className="text-3xl font-bold text-green-600">A-F</div>
              <div className="text-green-700 font-medium">Letter Grade</div>
              <div className="text-xs text-green-600 mt-1">Like school!</div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Methodology Details */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <MethodologySection />
        </div>
      </section>

      {/* Scientific Approach */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Why Trust Our Analysis?
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Our scoring isn&apos;t random. It&apos;s based on real laws, expert research, and years of privacy protection work.
              <strong className="text-gray-800"> We don&apos;t make things up—we follow the rules set by India&apos;s government and international privacy experts.</strong>
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">What We Base Our Analysis On</h3>
              <div className="space-y-6">
                <div className="border-l-4 border-blue-500 pl-6 bg-blue-50/50 py-4 rounded-r-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">🇮🇳</span>
                    <h4 className="text-lg font-bold text-blue-900">India&apos;s DPDP Act 2023</h4>
                  </div>
                  <p className="text-gray-700">
                    This is India&apos;s NEW privacy law. Every privacy policy MUST follow these rules.
                    We check if companies are doing what the law requires them to do to protect YOUR data.
                  </p>
                </div>

                <div className="border-l-4 border-green-500 pl-6 bg-green-50/50 py-4 rounded-r-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">📚</span>
                    <h4 className="text-lg font-bold text-green-900">Privacy Expert Research</h4>
                  </div>
                  <p className="text-gray-700">
                    Top privacy researchers and legal experts around the world have studied what makes a good privacy policy.
                    We use their findings to judge which practices protect users and which don&apos;t.
                  </p>
                </div>

                <div className="border-l-4 border-purple-500 pl-6 bg-purple-50/50 py-4 rounded-r-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">🌍</span>
                    <h4 className="text-lg font-bold text-purple-900">International Standards</h4>
                  </div>
                  <p className="text-gray-700">
                    We also follow global privacy standards like Europe&apos;s GDPR (considered the gold standard)
                    and recommendations from organizations that protect consumer rights worldwide.
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">How the Scoring Works</h3>
              <div className="space-y-6">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border-2 border-blue-200">
                  <h4 className="text-xl font-bold text-blue-900 mb-3">6 Things We Check</h4>
                  <p className="text-blue-800 mb-4">
                    Not all privacy issues are equally important. We give more weight to things that matter most:
                  </p>
                  <ul className="space-y-3 text-sm text-blue-900">
                    <li className="flex items-start gap-2">
                      <span className="font-bold text-lg">30%</span>
                      <span><strong>How much data they collect</strong> - Less is better!</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="font-bold text-lg">25%</span>
                      <span><strong>Who they share it with</strong> - Are they selling your info?</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="font-bold text-lg">20%</span>
                      <span><strong>Your control rights</strong> - Can you delete your data?</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="font-bold text-lg">15%</span>
                      <span><strong>Security protection</strong> - Is your data safe from hackers?</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="font-bold text-lg">7%</span>
                      <span><strong>Legal compliance</strong> - Do they follow DPDP Act?</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="font-bold text-lg">3%</span>
                      <span><strong>Clear communication</strong> - Can you understand their policy?</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-gray-100 rounded-xl p-6 border border-gray-300">
                  <h4 className="text-lg font-bold text-gray-900 mb-3">🧮 The Final Score</h4>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    We score each of these 6 categories from 1 to 10. Then we combine them using the percentages above.
                    The result is your final privacy score (1-10) and a letter grade (A+ to F)—just like in school!
                    <strong className="text-gray-900"> Higher score = Better privacy protection for YOU.</strong>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Continuous Improvement */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              We Keep Getting Better
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Privacy laws change. New research comes out. Technology evolves. We update our analysis methods
              regularly to make sure we&apos;re always giving you the most accurate, helpful information.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-8 shadow-md border-t-4 border-blue-500 text-center hover:shadow-lg transition-shadow">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-4xl">🔄</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Regular Updates</h3>
              <p className="text-gray-700 leading-relaxed">
                We update our scoring system every 3 months to match new privacy laws, court rulings,
                and the latest research on data protection.
              </p>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-md border-t-4 border-green-500 text-center hover:shadow-lg transition-shadow">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-4xl">👨‍⚖️</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Expert Review</h3>
              <p className="text-gray-700 leading-relaxed">
                Privacy lawyers and security researchers check our work before we release updates.
                This keeps our analysis accurate and trustworthy.
              </p>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-md border-t-4 border-purple-500 text-center hover:shadow-lg transition-shadow">
              <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-4xl">💬</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">You Help Us Improve</h3>
              <p className="text-gray-700 leading-relaxed">
                When you use our tool and give feedback, it helps us understand what matters most to real users.
                Your voice shapes how we improve!
              </p>
            </div>
          </div>

          <div className="mt-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-center text-white">
            <h3 className="text-2xl font-bold mb-3">📢 Have Questions or Suggestions?</h3>
            <p className="text-blue-100 text-lg max-w-2xl mx-auto mb-6">
              If you think we got something wrong or have ideas to make our analysis better,
              we want to hear from you! Your feedback makes PrivacyAnalyzer better for everyone.
            </p>
            <a
              href="https://github.com/privacypriority/privacyanalyzer/issues"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg font-bold hover:bg-blue-50 transition-colors"
            >
              Share Your Feedback →
            </a>
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