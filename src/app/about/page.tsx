import type { Metadata } from "next";
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertCircle, Github, Heart } from 'lucide-react';

export const metadata: Metadata = {
  title: "About Privacy Analysis | PrivacyAnalyzer.in",
  description: "Learn why privacy policy analysis matters in today's digital age. Understand privacy concerns, user impact, and how PrivacyAnalyzer helps protect your digital rights.",
  keywords: "privacy policy analysis, digital privacy, data protection, user privacy rights, online privacy awareness",
  openGraph: {
    title: "About Privacy Analysis | PrivacyAnalyzer.in",
    description: "Learn why privacy policy analysis matters in today's digital age",
    type: "website",
    url: "https://privacyanalyzer.in/about",
  },
  twitter: {
    card: "summary_large_image",
    title: "About Privacy Analysis | PrivacyAnalyzer.in",
    description: "Learn why privacy policy analysis matters in today's digital age",
  },
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent mb-6">
            Why Your Privacy Matters
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed mb-6">
            Every app and website you use has a privacy policy. But let&apos;s be honest—<strong>nobody reads them.</strong>
          </p>
          <p className="text-lg md:text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed mb-10">
            They&apos;re written in confusing legal language on purpose. Companies hope you&apos;ll just click &quot;I Agree&quot;
            without knowing what you&apos;re agreeing to. <strong className="text-blue-700">That ends now.</strong>
          </p>

          {/* Key Stats */}
          <div className="flex flex-wrap justify-center gap-6 text-sm">
            <div className="bg-white/80 backdrop-blur rounded-lg px-6 py-3 border-2 border-red-200">
              <div className="text-2xl font-bold text-red-600">Very Long</div>
              <div className="text-red-700 font-medium">Privacy Policies</div>
              <div className="text-xs text-red-600 mt-1">Hard to read</div>
            </div>
            <div className="bg-white/80 backdrop-blur rounded-lg px-6 py-3 border-2 border-orange-200">
              <div className="text-2xl font-bold text-orange-600">Complex</div>
              <div className="text-orange-700 font-medium">Legal Language</div>
              <div className="text-xs text-orange-600 mt-1">Difficult to understand</div>
            </div>
            <div className="bg-white/80 backdrop-blur rounded-lg px-6 py-3 border-2 border-blue-200">
              <div className="text-2xl font-bold text-blue-600">Time Consuming</div>
              <div className="text-blue-700 font-medium">To Read Fully</div>
              <div className="text-xs text-blue-600 mt-1">Takes hours</div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Privacy Concerns and Impact */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-6">
              Common Privacy Policy Topics
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              When you accept a privacy policy, here are some common things companies may do with your data:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            <Card className="border-l-4 border-blue-500 bg-blue-50/50">
              <CardContent className="p-6">
                <div className="text-4xl mb-3">📊</div>
                <h3 className="text-xl font-bold text-blue-900 mb-3">Data Collection</h3>
                <p className="text-blue-800 text-sm leading-relaxed">
                  Apps and websites collect information about how you use their services.
                  This may include your activity, preferences, and device information.
                </p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-green-500 bg-green-50/50">
              <CardContent className="p-6">
                <div className="text-4xl mb-3">🔄</div>
                <h3 className="text-xl font-bold text-green-900 mb-3">Data Sharing</h3>
                <p className="text-green-800 text-sm leading-relaxed">
                  Some companies share your information with third parties like advertisers or partners.
                  Privacy policies explain who they share with and why.
                </p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-purple-500 bg-purple-50/50">
              <CardContent className="p-6">
                <div className="text-4xl mb-3">📍</div>
                <h3 className="text-xl font-bold text-purple-900 mb-3">Location Tracking</h3>
                <p className="text-purple-800 text-sm leading-relaxed">
                  Many apps track your location to provide services.
                  Policies explain when and how location data is collected and used.
                </p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-orange-500 bg-orange-50/50">
              <CardContent className="p-6">
                <div className="text-4xl mb-3">🌐</div>
                <h3 className="text-xl font-bold text-orange-900 mb-3">International Transfers</h3>
                <p className="text-orange-800 text-sm leading-relaxed">
                  Your data may be stored on servers in other countries.
                  This affects which laws protect your information.
                </p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-red-500 bg-red-50/50">
              <CardContent className="p-6">
                <div className="text-4xl mb-3">🔒</div>
                <h3 className="text-xl font-bold text-red-900 mb-3">Security Measures</h3>
                <p className="text-red-800 text-sm leading-relaxed">
                  Companies describe how they protect your data from unauthorized access.
                  Security practices vary between different services.
                </p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-indigo-500 bg-indigo-50/50">
              <CardContent className="p-6">
                <div className="text-4xl mb-3">⏳</div>
                <h3 className="text-xl font-bold text-indigo-900 mb-3">Data Retention</h3>
                <p className="text-indigo-800 text-sm leading-relaxed">
                  Policies explain how long your data is kept.
                  Some information may be retained even after you delete your account.
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl p-8 text-white text-center">
            <p className="text-2xl font-bold mb-4">Understanding Your Rights</p>
            <p className="text-lg text-blue-100 max-w-4xl mx-auto leading-relaxed">
              India&apos;s <strong className="text-white">DPDP Act 2023</strong> gives you rights over your personal data.
              Companies must follow these rules when handling your information. <strong className="text-white">PrivacyAnalyzer helps you understand</strong> what
              companies are doing with your data and whether they&apos;re following the law.
            </p>
          </div>
        </div>
      </section>

      {/* How PrivacyAnalyzer Helps */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              How PrivacyAnalyzer Protects You
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed mb-4">
              We read the boring legal stuff so you don&apos;t have to.
            </p>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto">
              Instead of spending hours trying to understand confusing privacy policies,
              get instant answers in simple language anyone can understand.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-8 border-2 border-blue-300 shadow-lg hover:shadow-xl transition-shadow">
              <div className="text-5xl mb-4 text-center">⚡</div>
              <h3 className="text-2xl font-bold text-blue-900 mb-4 text-center">Instant Analysis</h3>
              <p className="text-blue-800 text-center text-lg leading-relaxed">
                Just paste a website URL. We find and analyze their privacy policy in seconds—
                no reading 50 pages of legal jargon required!
              </p>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-8 border-2 border-green-300 shadow-lg hover:shadow-xl transition-shadow">
              <div className="text-5xl mb-4 text-center">🎯</div>
              <h3 className="text-2xl font-bold text-green-900 mb-4 text-center">Simple Grades</h3>
              <p className="text-green-800 text-center text-lg leading-relaxed">
                We grade every policy from A+ to F—like a school report card. Higher grade = Better privacy
                protection for YOU. It&apos;s that simple.
              </p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-8 border-2 border-purple-300 shadow-lg hover:shadow-xl transition-shadow">
              <div className="text-5xl mb-4 text-center">🛡️</div>
              <h3 className="text-2xl font-bold text-purple-900 mb-4 text-center">Know Your Rights</h3>
              <p className="text-purple-800 text-center text-lg leading-relaxed">
                We tell you exactly what rights you have under India&apos;s DPDP Act 2023
                and whether the company is respecting them.
              </p>
            </div>
          </div>

          <div className="mt-12 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-8 border-2 border-green-300">
            <h3 className="text-2xl font-bold text-green-900 mb-4 text-center">
              ✅ 100% Free. Zero Ads. No Tracking.
            </h3>
            <p className="text-green-800 text-center text-lg max-w-3xl mx-auto leading-relaxed">
              We don&apos;t collect your personal data. We don&apos;t sell your information.
              We don&apos;t track you across websites. <strong className="text-green-900">We actually practice what we preach.</strong>
            </p>
          </div>
        </div>
      </section>

      {/* Open Source Mission */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Built By the Community, For the Community</h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed mb-4">
              PrivacyAnalyzer is 100% open source. Anyone can see how we work, suggest improvements, or help make it better.
            </p>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto">
              No corporate agenda. No hidden motives. Just people helping people protect their privacy.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 mb-12">
            <Card className="border-2 border-blue-300 shadow-lg">
              <CardContent className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <Github className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">Why Open Source?</h3>
                </div>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <span className="text-2xl">🔍</span>
                    <div>
                      <h4 className="font-bold text-gray-900 mb-1">Transparency</h4>
                      <p className="text-gray-700 text-sm">You can see exactly how we analyze privacy policies. No secret algorithms or hidden bias.</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-2xl">🛡️</span>
                    <div>
                      <h4 className="font-bold text-gray-900 mb-1">Trust</h4>
                      <p className="text-gray-700 text-sm">Security experts can verify we&apos;re not collecting your data or doing anything shady.</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-2xl">🚀</span>
                    <div>
                      <h4 className="font-bold text-gray-900 mb-1">Continuous Improvement</h4>
                      <p className="text-gray-700 text-sm">Developers worldwide can suggest fixes and features to make PrivacyAnalyzer better every day.</p>
                    </div>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-2 border-purple-300 shadow-lg">
              <CardContent className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-purple-100 rounded-lg">
                    <Heart className="h-8 w-8 text-purple-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">How You Can Help</h3>
                </div>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <span className="text-2xl">👨‍💻</span>
                    <div>
                      <h4 className="font-bold text-gray-900 mb-1">For Developers</h4>
                      <p className="text-gray-700 text-sm">Improve our AI, fix bugs, or add new features on GitHub.</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-2xl">📢</span>
                    <div>
                      <h4 className="font-bold text-gray-900 mb-1">For Everyone Else</h4>
                      <p className="text-gray-700 text-sm">Share PrivacyAnalyzer with friends and family. Help spread privacy awareness!</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-2xl">💡</span>
                    <div>
                      <h4 className="font-bold text-gray-900 mb-1">Have Ideas?</h4>
                      <p className="text-gray-700 text-sm">Report bugs, suggest features, or tell us how we can improve.</p>
                    </div>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <div className="text-center">
            <Button size="lg" asChild className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-lg px-8 py-6">
              <a
                href="https://github.com/privacypriority/privacyanalyzer"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3"
              >
                <Github className="h-6 w-6" />
                <span>View on GitHub</span>
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* Privacy Principles */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              We Actually Practice What We Preach
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Unlike the companies we analyze, we put YOUR privacy first. Here&apos;s our promise to you:
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-8 border-2 border-green-300 shadow-lg">
              <h3 className="text-2xl font-bold text-green-900 mb-6 flex items-center gap-2">
                <span className="text-3xl">✅</span> What We Do
              </h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <span className="text-xl mt-1">📊</span>
                  <div>
                    <h4 className="font-bold text-green-900">Analyze Privacy Policies</h4>
                    <p className="text-green-800 text-sm">Read and score privacy policies so you don&apos;t have to struggle through legal jargon.</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-xl mt-1">🔓</span>
                  <div>
                    <h4 className="font-bold text-green-900">Share Analysis Results</h4>
                    <p className="text-green-800 text-sm">Keep results public so everyone benefits from the analysis, not just one person.</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-xl mt-1">🎓</span>
                  <div>
                    <h4 className="font-bold text-green-900">Educate You About Your Rights</h4>
                    <p className="text-green-800 text-sm">Explain what the DPDP Act 2023 means for you in simple language.</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-xl mt-1">👀</span>
                  <div>
                    <h4 className="font-bold text-green-900">Stay 100% Transparent</h4>
                    <p className="text-green-800 text-sm">All our code is open source. Anyone can see exactly how we work.</p>
                  </div>
                </li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-xl p-8 border-2 border-red-300 shadow-lg">
              <h3 className="text-2xl font-bold text-red-900 mb-6 flex items-center gap-2">
                <span className="text-3xl">❌</span> What We NEVER Do
              </h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <span className="text-xl mt-1">🕵️</span>
                  <div>
                    <h4 className="font-bold text-red-900">Track You Across Websites</h4>
                    <p className="text-red-800 text-sm">No cookies, no fingerprinting, no creepy following you around the internet.</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-xl mt-1">💸</span>
                  <div>
                    <h4 className="font-bold text-red-900">Sell Your Personal Data</h4>
                    <p className="text-red-800 text-sm">We don&apos;t collect it in the first place. Can&apos;t sell what we don&apos;t have!</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-xl mt-1">📢</span>
                  <div>
                    <h4 className="font-bold text-red-900">Show Ads or Annoying Pop-ups</h4>
                    <p className="text-red-800 text-sm">100% ad-free. Forever. We&apos;re here to help, not to distract you with ads.</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-xl mt-1">🗃️</span>
                  <div>
                    <h4 className="font-bold text-red-900">Store Your Personal Information</h4>
                    <p className="text-red-800 text-sm">You don&apos;t need to create an account or give us your email. Just use the tool.</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Heart className="h-8 w-8" />
              <span className="text-2xl font-bold">Our Privacy Philosophy</span>
            </div>
            <p className="text-lg text-blue-100 max-w-3xl mx-auto leading-relaxed">
              We believe privacy is a fundamental human right, not a luxury. It shouldn&apos;t cost money to protect yourself online.
              That&apos;s why PrivacyAnalyzer will always be free, open source, and built for people—not profits.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}