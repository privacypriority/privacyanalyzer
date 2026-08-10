'use client';

import { DigitalFingerprintProfessional } from '@/components/DigitalFingerprintProfessional';
import { ShareButtons } from '@/components/ShareButtons';

export default function DigitalFingerprintPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-red-600 via-orange-600 to-red-800 bg-clip-text text-transparent mb-6">
            What Websites Know About You
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed mb-4">
            Even without clicking &quot;I Accept,&quot; websites are already collecting information about you.
          </p>
          <p className="text-lg md:text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed mb-10">
            Your browser is <strong>leaking data</strong> right now—your device type, location, screen size, and much more.
            This tool shows you exactly what they can see. <strong className="text-red-700">Knowledge is power.</strong>
          </p>

          {/* Privacy Guarantee */}
          <div className="max-w-2xl mx-auto bg-white/90 backdrop-blur rounded-xl p-6 border-2 border-green-300 shadow-lg">
            <div className="flex items-center justify-center gap-3 mb-3">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-xl font-bold text-green-800">🔒 Your Privacy is Protected Here</span>
            </div>
            <p className="text-green-800 font-medium">
              <strong>Nothing is stored, saved, or sent anywhere.</strong> All analysis happens right in your browser
              and disappears when you close this tab. We&apos;re showing you what websites CAN collect—but we don&apos;t collect it ourselves.
            </p>
          </div>
        </div>
      </section>
      
      {/* Browser Data Exposure Tool */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <DigitalFingerprintProfessional />
        </div>
      </section>

      {/* Educational Context */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Understanding Browser Fingerprinting
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Browser fingerprinting is a tracking technique that websites use to identify and track users
              across the web without cookies or other traditional tracking methods.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 mb-16">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">How It Works</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <div className="w-2 h-2 bg-red-600 rounded-full"></div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Data Collection</h4>
                    <p className="text-gray-600">Websites automatically collect information about your browser, device, and settings without asking permission.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <div className="w-2 h-2 bg-red-600 rounded-full"></div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Unique Fingerprint</h4>
                    <p className="text-gray-600">The combination of all collected data points creates a unique &quot;fingerprint&quot; that can identify you across different websites.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <div className="w-2 h-2 bg-red-600 rounded-full"></div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Cross-Site Tracking</h4>
                    <p className="text-gray-600">Your fingerprint can be used to track your browsing behavior across different websites and build detailed profiles.</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Why It Matters</h3>
              <div className="space-y-4">
                <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                  <h4 className="font-semibold text-orange-900 mb-2">Privacy Invasion</h4>
                  <p className="text-orange-800 text-sm">Your browsing habits, interests, and behavior patterns can be monitored without your knowledge or consent.</p>
                </div>

                <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                  <h4 className="font-semibold text-red-900 mb-2">Persistent Tracking</h4>
                  <p className="text-red-800 text-sm">Unlike cookies, browser fingerprints are much harder to block or delete, making tracking more persistent.</p>
                </div>

                <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <h4 className="font-semibold text-purple-900 mb-2">Data Monetization</h4>
                  <p className="text-purple-800 text-sm">Your personal data and browsing patterns become valuable commodities sold to advertisers and data brokers.</p>
                </div>

                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <h4 className="font-semibold text-blue-900 mb-2">Discrimination Risk</h4>
                  <p className="text-blue-800 text-sm">Detailed profiles can lead to price discrimination, content filtering, and unfair treatment based on your digital identity.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Advanced Fingerprinting Techniques */}
          <div className="mb-16">
            <h3 className="text-3xl font-bold text-gray-900 mb-8 text-center">Advanced Fingerprinting Techniques</h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-red-50 to-orange-50 p-6 rounded-xl border border-red-200">
                <h4 className="text-lg font-bold text-red-900 mb-3">Canvas Fingerprinting</h4>
                <p className="text-sm text-red-800 leading-relaxed">
                  Uses HTML5 canvas to render text and shapes. Tiny differences in how your device renders graphics create a unique identifier. Nearly impossible to detect or block.
                </p>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-xl border border-purple-200">
                <h4 className="text-lg font-bold text-purple-900 mb-3">WebGL Fingerprinting</h4>
                <p className="text-sm text-purple-800 leading-relaxed">
                  Exploits your GPU and graphics drivers to create unique identifiers. Reveals your graphics card model, driver version, and rendering capabilities.
                </p>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-6 rounded-xl border border-blue-200">
                <h4 className="text-lg font-bold text-blue-900 mb-3">Audio Fingerprinting</h4>
                <p className="text-sm text-blue-800 leading-relaxed">
                  Analyzes how your device processes audio signals. Different hardware and software combinations produce unique audio signatures.
                </p>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-xl border border-green-200">
                <h4 className="text-lg font-bold text-green-900 mb-3">Font Detection</h4>
                <p className="text-sm text-green-800 leading-relaxed">
                  Detects which fonts are installed on your system. Your unique combination of fonts reveals your operating system, language, and software setup.
                </p>
              </div>

              <div className="bg-gradient-to-br from-yellow-50 to-amber-50 p-6 rounded-xl border border-yellow-200">
                <h4 className="text-lg font-bold text-yellow-900 mb-3">Client Hints &amp; Audio</h4>
                <p className="text-sm text-yellow-800 leading-relaxed">
                  User-Agent Client Hints expose your exact OS, CPU architecture and browser build, while the audio stack renders a stable per-device hash — both hard to hide.
                </p>
              </div>

              <div className="bg-gradient-to-br from-indigo-50 to-violet-50 p-6 rounded-xl border border-indigo-200">
                <h4 className="text-lg font-bold text-indigo-900 mb-3">Sensor Access</h4>
                <p className="text-sm text-indigo-800 leading-relaxed">
                  Mobile devices expose accelerometer, gyroscope, and other sensor data. Even tiny variations in sensor readings can identify your specific device.
                </p>
              </div>
            </div>
          </div>

          {/* Real-World Impact */}
          <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-2xl p-8 md:p-12 text-white mb-16">
            <h3 className="text-3xl font-bold mb-6 text-center">Real-World Impact</h3>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h4 className="text-xl font-bold text-blue-300 mb-4">Who Uses Fingerprinting?</h4>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-400 mt-1">•</span>
                    <span className="text-gray-300"><strong className="text-white">Advertisers:</strong> Track you across sites to build detailed profiles for targeted ads</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-400 mt-1">•</span>
                    <span className="text-gray-300"><strong className="text-white">Analytics Companies:</strong> Monitor user behavior and create detailed tracking reports</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-400 mt-1">•</span>
                    <span className="text-gray-300"><strong className="text-white">Social Networks:</strong> Track you even when you&apos;re not logged in or on their platform</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-400 mt-1">•</span>
                    <span className="text-gray-300"><strong className="text-white">E-commerce Sites:</strong> Adjust prices based on your device, location, and browsing history</span>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="text-xl font-bold text-red-300 mb-4">The Hidden Costs</h4>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <span className="text-red-400 mt-1">•</span>
                    <span className="text-gray-300"><strong className="text-white">Price Discrimination:</strong> Same product, different prices based on your profile</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-400 mt-1">•</span>
                    <span className="text-gray-300"><strong className="text-white">Filter Bubbles:</strong> You only see content algorithms think you want to see</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-400 mt-1">•</span>
                    <span className="text-gray-300"><strong className="text-white">Data Breaches:</strong> Your fingerprint data can be stolen and misused</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-400 mt-1">•</span>
                    <span className="text-gray-300"><strong className="text-white">Identity Theft:</strong> Detailed profiles make you vulnerable to sophisticated attacks</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="mt-8 p-6 bg-white/10 rounded-xl border border-white/20">
              <p className="text-sm text-gray-300 leading-relaxed">
                <strong className="text-white">Research shows:</strong> Browser fingerprinting can identify individual users with 99% accuracy.
                A 2020 study found that 83% of top websites use some form of fingerprinting technology. Even &quot;privacy-focused&quot; browsers
                can be fingerprinted with surprising accuracy.
              </p>
            </div>
          </div>

          {/* Statistics */}
          <div>
            <h3 className="text-3xl font-bold text-gray-900 mb-8 text-center">Fingerprinting By The Numbers</h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center p-6 bg-gradient-to-br from-red-50 to-red-100 rounded-xl border border-red-200">
                <div className="text-4xl font-black text-red-600 mb-2">99%</div>
                <div className="text-sm font-semibold text-red-800">Identification Accuracy</div>
                <div className="text-xs text-red-700 mt-2">Can uniquely identify users</div>
              </div>

              <div className="text-center p-6 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl border border-orange-200">
                <div className="text-4xl font-black text-orange-600 mb-2">83%</div>
                <div className="text-sm font-semibold text-orange-800">Top Sites Use It</div>
                <div className="text-xs text-orange-700 mt-2">Actively fingerprinting</div>
              </div>

              <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border border-purple-200">
                <div className="text-4xl font-black text-purple-600 mb-2">~33 bits</div>
                <div className="text-sm font-semibold text-purple-800">Uniquely Identifies You</div>
                <div className="text-xs text-purple-700 mt-2">Enough to single out 1 person on Earth</div>
              </div>

              <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200">
                <div className="text-4xl font-black text-blue-600 mb-2">94%</div>
                <div className="text-sm font-semibold text-blue-800">Persistent After Deletion</div>
                <div className="text-xs text-blue-700 mt-2">Survives cookie clearing</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Spread Privacy Awareness */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <ShareButtons />
        </div>
      </section>
    </div>
  );
}