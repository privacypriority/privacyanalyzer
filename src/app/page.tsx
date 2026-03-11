'use client';

import React from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import PrivacyAnalyzer from '@/components/PrivacyAnalyzer';
import { AnalysisHistoryCards } from '@/components/AnalysisHistoryCards';
import { ShareButtons } from '@/components/ShareButtons';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Privacy Awareness Hero Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 border-b border-slate-200">
        <div className="max-w-7xl mx-auto">
          <div className="space-y-12">
            {/* Content */}
            <div>
              <div className="inline-flex items-center gap-2 bg-red-50 text-red-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
                <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                Your Privacy is Your Right
              </div>

              <h1 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6 leading-tight">
                Understand How Apps & Websites Use Your Personal Data
              </h1>
              <p className="text-lg md:text-xl text-slate-600 mb-8 leading-relaxed">
                Every app you download, every website you visit collects your personal information. But do you know what they do with it?
                Privacy policies are written in complex legal language that nobody reads. <strong>We make them simple.</strong>
              </p>

              <div className="bg-blue-50 border-l-4 border-blue-500 p-5 mb-8 rounded-r-lg">
                <p className="text-blue-900 font-medium">
                  <span className="text-2xl mr-2">💡</span>
                  Get instant privacy scores, understand your rights under India&apos;s DPDP Act 2023, and make safer choices
                  about the apps and websites you trust with your personal information.
                </p>
              </div>

              {/* Privacy Policy Analyser - Moved to top */}
              <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-6 mb-8">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-slate-900 mb-3">🔍 Free Privacy Policy Analyzer</h3>
                  <p className="text-base text-slate-600 max-w-2xl mx-auto">
                    Paste any privacy policy link below. Our AI reads the entire policy in seconds and gives you a simple,
                    easy-to-understand report with a privacy score from 1 to 10.
                  </p>
                </div>
                <div id="analyzer">
                  <PrivacyAnalyzer />
                </div>
                <div className="mt-4 text-center">
                  <p className="text-xs text-slate-500">
                    ✓ Free Forever &nbsp; • &nbsp; ✓ No Account Required &nbsp; • &nbsp; ✓ Results in 30 Seconds
                  </p>
                </div>
              </div>

              {/* Privacy Concerns - India Specific */}
              <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-xl p-6 mb-8 border-2 border-orange-200">
                <h3 className="text-2xl font-bold text-orange-900 mb-2 flex items-center gap-2">
                  <span>⚠️</span> What You Should Know About Your Privacy in India
                </h3>
                <p className="text-sm text-orange-700 mb-5">These are real issues affecting millions of Indian users every day:</p>
                <div className="grid grid-cols-1 gap-4">
                  <div className="bg-white/60 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <div className="text-2xl">💰</div>
                      <div>
                        <h4 className="font-bold text-orange-900 mb-1">Your Data is Being Sold</h4>
                        <p className="text-sm text-orange-800">
                          Payment apps, shopping sites, and food delivery apps collect your purchase history, location, and habits—then sell this information to advertisers and data brokers without clearly telling you.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white/60 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <div className="text-2xl">🪪</div>
                      <div>
                        <h4 className="font-bold text-orange-900 mb-1">Aadhaar & Banking Data at Risk</h4>
                        <p className="text-sm text-orange-800">
                          Apps ask for your Aadhaar, PAN, and UPI details. But do they really need it? How long do they keep it? Where is it stored? Most privacy policies don&apos;t clearly explain this.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white/60 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <div className="text-2xl">🌍</div>
                      <div>
                        <h4 className="font-bold text-orange-900 mb-1">Your Data Leaving India</h4>
                        <p className="text-sm text-orange-800">
                          Many foreign apps store Indian user data in servers abroad. Under India&apos;s DPDP Act 2023, you have the right to know where your data goes and demand it stays protected.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white/60 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <div className="text-2xl">🔒</div>
                      <div>
                        <h4 className="font-bold text-orange-900 mb-1">Hidden in Legal Jargon</h4>
                        <p className="text-sm text-orange-800">
                          Companies bury important information deep in 50-page legal documents. They hope you won&apos;t read it. That&apos;s why we created this tool—to expose what they hide.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* Privacy Education Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Why Should You Care About Privacy?
            </h2>
            <p className="text-lg text-slate-600 max-w-4xl mx-auto leading-relaxed">
              Your personal data is more valuable than you think. Every photo you upload, every purchase you make, every website you visit—it all gets collected, analyzed, and sold.
              <strong className="text-slate-800"> India&apos;s new DPDP Act 2023 finally gives you the power to fight back.</strong>
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow border-t-4 border-red-500">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-3xl">💰</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-4 text-center">Your Data is Big Business</h3>
                <p className="text-slate-700 text-sm leading-relaxed mb-4">
                  Think your data isn&apos;t worth much? Think again. Companies make ₹10,000+ per year from EACH user by selling:
                </p>
                <ul className="text-sm text-slate-600 space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-red-500">•</span>
                    <span>Your shopping habits to advertisers</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500">•</span>
                    <span>Your location data to marketers</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500">•</span>
                    <span>Your personal preferences to data brokers</span>
                  </li>
                </ul>
                <p className="text-xs text-slate-500 mt-4 italic">The DPDP Act 2023 now requires companies to tell you how they profit from your data.</p>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow border-t-4 border-orange-500">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-3xl">👁️</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-4 text-center">You&apos;re Being Watched</h3>
                <p className="text-slate-700 text-sm leading-relaxed mb-4">
                  Every app on your phone is tracking you. Most people don&apos;t realize how much:
                </p>
                <ul className="text-sm text-slate-600 space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-orange-500">•</span>
                    <span>Your exact location 24/7</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-500">•</span>
                    <span>Who you call, text, and email</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-500">•</span>
                    <span>Every website you visit</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-500">•</span>
                    <span>What you buy, when, and where</span>
                  </li>
                </ul>
                <p className="text-xs text-slate-500 mt-4 italic">This data is stored permanently and never fully deleted.</p>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow border-t-4 border-green-500">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-3xl">🇮🇳</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-4 text-center">You Have Rights Now</h3>
                <p className="text-slate-700 text-sm leading-relaxed mb-4">
                  India&apos;s DPDP Act 2023 is a game-changer. For the first time, YOU have legal rights to:
                </p>
                <ul className="text-sm text-slate-600 space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-green-500">✓</span>
                    <span>See ALL data companies have on you</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500">✓</span>
                    <span>Delete your data permanently</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500">✓</span>
                    <span>Stop companies from selling your info</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500">✓</span>
                    <span>File complaints to Data Protection Board</span>
                  </li>
                </ul>
                <p className="text-xs text-green-700 mt-4 font-medium">It&apos;s time to take control of your digital life.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Community Analysis Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              See How Your Favorite Apps Score
            </h2>
            <p className="text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed">
              We&apos;ve already analyzed hundreds of popular Indian apps and websites. See which ones respect your privacy
              and which ones are selling your data. <strong className="text-slate-800">The results might shock you.</strong>
            </p>
          </div>
          
          <AnalysisHistoryCards />
        </div>
      </section>
      
      {/* Privacy Protection Tips Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
              Start Protecting Your Privacy Today
            </h2>
            <p className="text-lg text-slate-200 max-w-3xl mx-auto mb-6 leading-relaxed">
              You don&apos;t need to be a tech expert. These simple, free tools help you understand
              and protect your digital privacy right now.
            </p>
            <p className="text-base text-blue-300 font-medium">
              💪 Takes less than 5 minutes • No technical knowledge required
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-slate-800 border-slate-700 hover:bg-slate-750 transition-colors">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-red-500/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🔍</span>
                </div>
                <h3 className="text-lg font-bold text-white mb-3">Digital Footprint Check</h3>
                <p className="text-slate-400 mb-4 text-sm">
                  See exactly what information your browser reveals to every website you visit.
                </p>
                <Button variant="outline" size="sm" className="border-slate-600 text-white hover:bg-slate-700" asChild>
                  <Link href="/digital-fingerprint">Check Now →</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700 hover:bg-slate-750 transition-colors">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">📚</span>
                </div>
                <h3 className="text-lg font-bold text-white mb-3">Privacy Education</h3>
                <p className="text-slate-400 mb-4 text-sm">
                  Learn how privacy policies work and what to look for when reading them.
                </p>
                <Button variant="outline" size="sm" className="border-slate-600 text-white hover:bg-slate-700" asChild>
                  <Link href="/methodology">Learn More →</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700 hover:bg-slate-750 transition-colors">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-emerald-500/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">❤️</span>
                </div>
                <h3 className="text-lg font-bold text-white mb-3">Support Privacy Rights</h3>
                <p className="text-slate-400 mb-4 text-sm">
                  Help us build better privacy tools and spread awareness about digital rights.
                </p>
                <Button variant="outline" size="sm" className="border-slate-600 text-white hover:bg-slate-700" asChild>
                  <Link href="/support">Get Involved →</Link>
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Quick Privacy Tips - India Specific */}
          <div className="mt-16 bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 border-2 border-slate-700">
            <div className="text-center mb-8">
              <h3 className="text-3xl font-bold text-white mb-3">
                5-Minute Privacy Checklist for Indians
              </h3>
              <p className="text-slate-300 text-base">
                Simple actions you can take right now to protect yourself online
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-slate-700/50 rounded-xl p-6 hover:bg-slate-700 transition-colors">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-lg font-bold">1</span>
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-white mb-2">Check App Permissions Today</h4>
                    <p className="text-slate-200 text-sm mb-3">
                      Your payment apps DON&apos;T need access to your:
                    </p>
                    <ul className="text-sm text-slate-300 space-y-1">
                      <li>❌ Location (unless you&apos;re ordering food)</li>
                      <li>❌ Contacts (they already have your number)</li>
                      <li>❌ SMS (for reading OTPs only, not all messages)</li>
                      <li>❌ Camera/Microphone (unless actively using)</li>
                    </ul>
                    <p className="text-xs text-green-300 mt-3 font-medium">→ Go to Settings → Apps → Permissions and turn them OFF</p>
                  </div>
                </div>
              </div>

              <div className="bg-slate-700/50 rounded-xl p-6 hover:bg-slate-700 transition-colors">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-lg font-bold">2</span>
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-white mb-2">Stop Giving Your Aadhaar to Everyone</h4>
                    <p className="text-slate-200 text-sm mb-3">
                      Only these services legally need your Aadhaar:
                    </p>
                    <ul className="text-sm text-slate-300 space-y-1">
                      <li>✓ Opening a bank account</li>
                      <li>✓ Filing income tax returns</li>
                      <li>✓ Getting a mobile SIM card</li>
                    </ul>
                    <p className="text-red-300 text-sm mt-3">
                      Shopping apps, food delivery, ride-hailing apps <strong>DO NOT</strong> need your Aadhaar. Don&apos;t share it.
                    </p>
                    <p className="text-xs text-green-300 mt-2 font-medium">→ Say NO when apps ask for your Aadhaar unnecessarily</p>
                  </div>
                </div>
              </div>

              <div className="bg-slate-700/50 rounded-xl p-6 hover:bg-slate-700 transition-colors">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-lg font-bold">3</span>
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-white mb-2">Find Out Where Your Data is Stored</h4>
                    <p className="text-slate-200 text-sm mb-3">
                      Under DPDP Act 2023, companies MUST tell you:
                    </p>
                    <ul className="text-sm text-slate-300 space-y-1">
                      <li>📍 Where your data is physically stored</li>
                      <li>🌍 If it&apos;s being sent outside India</li>
                      <li>🔒 How long they keep it</li>
                    </ul>
                    <p className="text-xs text-blue-300 mt-3 font-medium">
                      → Use our analyzer above to check if apps disclose this information
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-slate-700/50 rounded-xl p-6 hover:bg-slate-700 transition-colors">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-lg font-bold">4</span>
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-white mb-2">Delete Your Data from Old Apps</h4>
                    <p className="text-slate-200 text-sm mb-3">
                      Apps you don&apos;t use anymore still have your data. The DPDP Act gives you the power to:
                    </p>
                    <ul className="text-sm text-slate-300 space-y-1">
                      <li>🗑️ Request permanent deletion</li>
                      <li>📧 Contact their Grievance Officer</li>
                      <li>⚖️ File complaint if they refuse</li>
                    </ul>
                    <p className="text-xs text-green-300 mt-3 font-medium">
                      → Look for &quot;Delete My Account&quot; or &quot;Data Deletion&quot; in app settings
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 bg-blue-900/30 border border-blue-500/50 rounded-lg p-6 text-center">
              <p className="text-white font-medium text-lg mb-2">
                💡 Remember: Your privacy is a legal right in India now
              </p>
              <p className="text-blue-200 text-sm">
                Companies that violate the DPDP Act 2023 can be fined up to ₹250 crores. Use your rights!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Spread Privacy Awareness */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <ShareButtons />
        </div>
      </section>
    </div>
  );
}
