'use client';

import { Mail, Github, MessageSquare, Handshake, Target, Users, CheckCircle, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ShareButtons } from '@/components/ShareButtons';

export default function ForWebsiteOwnersPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl mb-6 shadow-lg">
            <Handshake className="w-10 h-10 text-white" />
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-6">
            Let&apos;s Work Together
          </h1>

          <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-8">
            We believe in collaboration over criticism. If your website or organization was analyzed by PrivacyAnalyzer,
            we welcome your feedback, corrections, and partnership in building better privacy practices.
          </p>
        </div>
      </section>

      {/* Our Mission */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <Target className="w-12 h-12 text-blue-600 mx-auto mb-4" />
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Mission
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              PrivacyAnalyzer.in exists to <strong>educate users</strong> about privacy policies and help them make
              informed decisions. We are <strong>not here to shame or attack</strong> any business. Our goal is to
              create transparency and encourage improvement across the web.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <Card className="border-blue-200 bg-blue-50">
              <CardContent className="p-6 text-center">
                <div className="bg-blue-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Users className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-lg font-bold text-blue-900 mb-2">Educate Users</h3>
                <p className="text-sm text-blue-800">
                  Help people understand what data is collected and how it&apos;s used
                </p>
              </CardContent>
            </Card>

            <Card className="border-purple-200 bg-purple-50">
              <CardContent className="p-6 text-center">
                <div className="bg-purple-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Handshake className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-lg font-bold text-purple-900 mb-2">Foster Collaboration</h3>
                <p className="text-sm text-purple-800">
                  Work with businesses to improve privacy practices together
                </p>
              </CardContent>
            </Card>

            <Card className="border-pink-200 bg-pink-50">
              <CardContent className="p-6 text-center">
                <div className="bg-pink-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-pink-600" />
                </div>
                <h3 className="text-lg font-bold text-pink-900 mb-2">Drive Improvement</h3>
                <p className="text-sm text-pink-800">
                  Encourage adoption of privacy-friendly practices industry-wide
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Why Contact Us */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 text-center">
            Why You Should Reach Out
          </h2>

          <div className="space-y-6">
            <Card className="border-l-4 border-green-500 shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <CheckCircle className="w-6 h-6 text-green-500" />
                  Analysis Contains Errors or Misinterpretations
                </h3>
                <p className="text-gray-700 leading-relaxed ml-8">
                  AI-powered analysis isn&apos;t perfect. If our analysis misunderstood your privacy policy,
                  contained factual errors, or missed important context, we want to know. We&apos;ll review
                  and update our analysis accordingly.
                </p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-blue-500 shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <CheckCircle className="w-6 h-6 text-blue-500" />
                  You&apos;ve Updated Your Privacy Policy
                </h3>
                <p className="text-gray-700 leading-relaxed ml-8">
                  Privacy policies evolve. If you&apos;ve made changes to improve privacy protection or fix
                  issues we identified, let us know! We&apos;ll re-analyze and showcase the improvements.
                </p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-purple-500 shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <CheckCircle className="w-6 h-6 text-purple-500" />
                  You Want to Collaborate on Privacy Education
                </h3>
                <p className="text-gray-700 leading-relaxed ml-8">
                  We&apos;re open to partnerships with organizations that want to promote privacy awareness.
                  If you&apos;re working on privacy initiatives, transparency projects, or user education,
                  let&apos;s explore how we can work together.
                </p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-orange-500 shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <CheckCircle className="w-6 h-6 text-orange-500" />
                  You Need Privacy Policy Guidance
                </h3>
                <p className="text-gray-700 leading-relaxed ml-8">
                  While we don&apos;t provide legal advice, we can point you toward resources, best practices,
                  and community recommendations for improving your privacy policies.
                </p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-pink-500 shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <CheckCircle className="w-6 h-6 text-pink-500" />
                  General Feedback or Questions
                </h3>
                <p className="text-gray-700 leading-relaxed ml-8">
                  Have thoughts on how we can improve PrivacyAnalyzer? Want to understand our methodology better?
                  Curious about how your privacy policy was scored? We&apos;re here to listen.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-900 via-purple-900 to-pink-900 text-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <MessageSquare className="w-16 h-16 mx-auto mb-6 text-blue-200" />
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Get In Touch
            </h2>
            <p className="text-xl text-blue-100 leading-relaxed">
              Choose the communication method that works best for you
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* Email Contact */}
            <Card className="bg-white/10 backdrop-blur border-white/20 hover:bg-white/20 transition-all">
              <CardContent className="p-8 text-center">
                <div className="bg-white/20 rounded-full p-4 w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                  <Mail className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-3">Email Us</h3>
                <p className="text-blue-100 mb-6">
                  For detailed feedback, corrections, or collaboration inquiries
                </p>
                <Button
                  size="lg"
                  className="bg-white text-blue-900 hover:bg-blue-50 font-bold w-full"
                  asChild
                >
                  <a href="mailto:privacypriority.org@gmail.com">
                    privacypriority.org@gmail.com
                  </a>
                </Button>
              </CardContent>
            </Card>

            {/* GitHub Issues */}
            <Card className="bg-white/10 backdrop-blur border-white/20 hover:bg-white/20 transition-all">
              <CardContent className="p-8 text-center">
                <div className="bg-white/20 rounded-full p-4 w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                  <Github className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-3">GitHub Issues</h3>
                <p className="text-blue-100 mb-6">
                  For technical feedback, bug reports, or public discussions
                </p>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-white text-white hover:bg-white hover:text-blue-900 font-bold w-full"
                  asChild
                >
                  <a
                    href="https://github.com/privacypriority/privacyanalyzer/issues"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2"
                  >
                    Open an Issue
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* What to Include */}
          <Card className="bg-white/10 backdrop-blur border-white/20">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold mb-6 text-center">What to Include in Your Message</h3>
              <ul className="space-y-3 text-blue-100">
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-300 rounded-full mt-2 flex-shrink-0"></div>
                  <span><strong className="text-white">Website/Organization Name:</strong> Help us identify your analysis quickly</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-300 rounded-full mt-2 flex-shrink-0"></div>
                  <span><strong className="text-white">Privacy Policy URL:</strong> The specific page that was analyzed</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-300 rounded-full mt-2 flex-shrink-0"></div>
                  <span><strong className="text-white">Specific Concerns:</strong> What part of the analysis needs correction or clarification?</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-300 rounded-full mt-2 flex-shrink-0"></div>
                  <span><strong className="text-white">Supporting Context:</strong> Any additional information that helps us understand your perspective</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-300 rounded-full mt-2 flex-shrink-0"></div>
                  <span><strong className="text-white">Collaboration Ideas:</strong> If relevant, how you&apos;d like to work together</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Our Commitment */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Our Commitment to You
          </h2>

          <div className="grid md:grid-cols-2 gap-8 text-left">
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
              <h3 className="text-xl font-bold text-green-900 mb-3">✅ We Will Listen</h3>
              <p className="text-green-800">
                Every message is read and considered carefully. We take website owner feedback seriously
                and prioritize accuracy over sensationalism.
              </p>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6 border border-blue-200">
              <h3 className="text-xl font-bold text-blue-900 mb-3">✅ We Will Update</h3>
              <p className="text-blue-800">
                If our analysis contains errors or your policy has improved, we&apos;ll update our content
                and showcase the corrections transparently.
              </p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-xl p-6 border border-purple-200">
              <h3 className="text-xl font-bold text-purple-900 mb-3">✅ We Will Collaborate</h3>
              <p className="text-purple-800">
                We&apos;re open to partnerships, joint educational content, and working together to
                improve privacy practices across the industry.
              </p>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-6 border border-orange-200">
              <h3 className="text-xl font-bold text-orange-900 mb-3">✅ We Will Respect</h3>
              <p className="text-orange-800">
                All communication is kept professional and confidential unless you explicitly want
                something shared publicly. We respect your business and brand.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Let&apos;s Build a More Privacy-Conscious Web Together
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Whether you need corrections, want to collaborate, or just have questions—we&apos;re here to help.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-white text-blue-600 hover:bg-blue-50 font-bold text-lg px-8 py-6"
              asChild
            >
              <a href="mailto:privacypriority.org@gmail.com">
                <Mail className="w-5 h-5 mr-2" />
                Email Us Now
              </a>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-2 border-white text-white hover:bg-white hover:text-blue-600 font-bold text-lg px-8 py-6"
              asChild
            >
              <a
                href="https://github.com/privacypriority/privacyanalyzer/issues"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2"
              >
                <Github className="w-5 h-5" />
                GitHub Issues
              </a>
            </Button>
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
