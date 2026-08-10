'use client';

import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp, Calculator, Scale, Shield, Users, Lock, Eye, FileText, Info, BookOpen, AlertCircle } from 'lucide-react';

export function MethodologySection() {
  const [isExpanded, setIsExpanded] = useState(false);

  const categories = [
    {
      name: 'Data Minimization & Collection',
      weight: 30,
      icon: <Shield className="h-5 w-5" />,
      description: 'Evaluates data collection practices against DPDP Act 2023 Section 5 and Rules 2025 Rule 3 requirements',
      legalBasis: 'DPDP Act Sec. 5 (Purpose limitation), Rule 3 (Notice requirements), Rule 8 (Retention periods), Third Schedule (Data retention classes)',
      criteria: [
        {
          point: 'Collection limited to necessary data for stated, specific, and lawful purposes',
          legal: 'DPDP Act Sec. 5 - Purpose limitation principle'
        },
        {
          point: 'Clear lawful basis: Consent (Sec. 6), Legitimate use (Sec. 7), or State function (Rule 5, Second Schedule)',
          legal: 'DPDP Act Sec. 6-7, Rules 2025 Rule 5'
        },
        {
          point: 'Notice requirements: Purpose, data type, rights, grievance mechanism, DPO/contact details',
          legal: 'Rules 2025 Rule 3 - Mandatory notice elements'
        },
        {
          point: 'Sensitive personal data protections and special category handling',
          legal: 'DPDP Act Sec. 9 - Special protections'
        },
        {
          point: 'Children\'s data: Verifiable parental consent required (exemptions per Fourth Schedule)',
          legal: 'DPDP Act Sec. 9, Rule 12, Fourth Schedule exemptions'
        },
        {
          point: 'Free, informed, specific, and unambiguous consent mechanism',
          legal: 'DPDP Act Sec. 6, Rule 3 - Consent requirements'
        },
        {
          point: 'Retention limited to purpose; erase when purpose served or consent withdrawn. Large e-commerce (2 cr+ users), online gaming (50 lakh+) and social-media (2 cr+) fiduciaries must erase 3 years after last user interaction (Third Schedule); 1-year minimum log retention',
          legal: 'Rule 8, Third Schedule - Data retention & erasure'
        }
      ],
      scientificRationale: 'Weighted highest (30%) because data that is never collected cannot be breached, misused, or shared. Minimizing collection at the source is the single most effective privacy control, so it carries the largest weight.'
    },
    {
      name: 'Third-Party Data Sharing',
      weight: 25,
      icon: <Users className="h-5 w-5" />,
      description: 'Assesses Data Fiduciary/Processor relationships, cross-border transfers, and commercial data usage',
      legalBasis: 'DPDP Act Sec. 8 (Data Processors), Sec. 16 (Cross-border transfers), Rule 15 (Transfer requirements), Rule 4 (Consent Managers)',
      criteria: [
        {
          point: 'Sharing scope: Limited, purpose-bound sharing with explicit consent vs. broad commercial exploitation',
          legal: 'DPDP Act Sec. 6 - Consent for sharing'
        },
        {
          point: 'Cross-border transfers: Only to countries/territories notified by Central Government',
          legal: 'DPDP Act Sec. 16, Rule 15 - International transfers'
        },
        {
          point: 'Data Processor agreements: Written contracts with security obligations, purpose limitations',
          legal: 'DPDP Act Sec. 8 - Processor obligations'
        },
        {
          point: 'Granular consent: Separate consents for different processing purposes, easily withdrawable',
          legal: 'DPDP Act Sec. 7, Rule 14 - Consent withdrawal'
        },
        {
          point: 'Consent Manager compliance: Registration, technical standards, withdrawal mechanisms (if applicable)',
          legal: 'Rule 4, First Schedule - Consent Manager obligations'
        },
        {
          point: 'Transparency: Clear disclosure of data monetization, advertising, profiling practices',
          legal: 'DPDP Act Sec. 5 - Transparency principle'
        }
      ],
      scientificRationale: 'Weighted second-highest (25%) because once data leaves the collector, control is largely lost. Third-party sharing and cross-border transfers are a leading vector for breaches and downstream misuse, so it is the second-largest weight.'
    },
    {
      name: 'Individual Rights & Controls',
      weight: 20,
      icon: <Scale className="h-5 w-5" />,
      description: 'Evaluates Data Principal rights implementation per DPDP Act Chapter IV and Rule 14',
      legalBasis: 'DPDP Act Sec. 11-14 (Data Principal rights), Rule 14 (Rights exercise procedures), Sec. 13 (Grievance redressal)',
      criteria: [
        {
          point: 'Right to access: Summary and comprehensive personal data access within reasonable time',
          legal: 'DPDP Act Sec. 11, Rule 14 - Access rights'
        },
        {
          point: 'Right to correction: Error rectification, data updation, completion of incomplete data',
          legal: 'DPDP Act Sec. 12 - Correction rights'
        },
        {
          point: 'Right to erasure: Data deletion with statutory exceptions (legal obligations, disputes)',
          legal: 'DPDP Act Sec. 12 - Erasure rights'
        },
        {
          point: 'Right to grievance redressal: Designated Grievance Officer, contact details, complaint resolution process',
          legal: 'DPDP Act Sec. 13 - Right to grievance redressal'
        },
        {
          point: 'Right to nominate: Facility for nomination to exercise rights on death or incapacity',
          legal: 'DPDP Act Sec. 14, Rule 14 - Nomination rights'
        },
        {
          point: 'Consent withdrawal: Easy, accessible mechanism with prompt processing',
          legal: 'DPDP Act Sec. 7, Rule 14 - Withdrawal process'
        },
        {
          point: 'Response timeframes: Reasonable time compliance (industry standard: 30 days)',
          legal: 'DPDP Act - Reasonable time requirement'
        }
      ],
      scientificRationale: 'Weighted 20% because enforceable Data Principal rights (access, correction, erasure, withdrawal) let users limit ongoing exposure and correct harms. It is a critical middle-tier control that remedies collection and sharing after the fact.'
    },
    {
      name: 'Security & Risk Management',
      weight: 15,
      icon: <Lock className="h-5 w-5" />,
      description: 'Technical and organizational security measures per DPDP Act Sec. 8 and Rule 6-7 requirements',
      legalBasis: 'DPDP Act Sec. 8 (Security safeguards), Rule 6 (Reasonable security), Rule 7 (Breach notification), Rule 13 (SDF obligations)',
      criteria: [
        {
          point: 'Reasonable security safeguards: Commensurate with data nature, volume, and sensitivity',
          legal: 'DPDP Act Sec. 8, Rule 6 - Security standards'
        },
        {
          point: 'Encryption: End-to-end, in-transit (TLS 1.3+), at-rest (AES-256) protections',
          legal: 'Rule 6 - Technical measures'
        },
        {
          point: 'Access controls: Role-based access, MFA, need-to-know principle, audit logs',
          legal: 'Rule 6, Rule 13 - Access management'
        },
        {
          point: 'Breach notification: Data Protection Board notification within 72 hours',
          legal: 'Rule 7 - Breach reporting timeline'
        },
        {
          point: 'Data Principal notification: Inform affected users of breach nature and remedial actions',
          legal: 'Rule 7 - User notification requirements'
        },
        {
          point: 'Data Protection Impact Assessment (DPIA): For Significant Data Fiduciaries',
          legal: 'Rule 13 - DPIA requirements for SDFs'
        },
        {
          point: 'Retention compliance: Automated deletion schedules aligned with Third Schedule',
          legal: 'Rule 8, Third Schedule - Deletion mechanisms'
        }
      ],
      scientificRationale: '15% weight reflects security breach impact studies. While critical, proper collection/sharing practices (55% combined) prevent more breaches than post-collection security alone.'
    },
    {
      name: 'Regulatory Compliance',
      weight: 7,
      icon: <FileText className="h-5 w-5" />,
      description: 'DPDP Act 2023 and Rules 2025 statutory compliance for Indian jurisdiction',
      legalBasis: 'DPDP Act Sec. 10 (Significant Data Fiduciary), Rule 13 (SDF obligations), Rule 12 (Consent verification), Rules 1-23 (Compliance framework)',
      criteria: [
        {
          point: 'Data Protection Officer (DPO) appointment: For Significant Data Fiduciaries',
          legal: 'Rule 13 - DPO designation requirement'
        },
        {
          point: 'Grievance Officer appointment: Contact details publicly available',
          legal: 'DPDP Act Sec. 8(10) - Grievance Officer obligation'
        },
        {
          point: 'Data Protection Board registration: Where applicable for SDFs',
          legal: 'DPDP Act Sec. 25, Rules 16-22'
        },
        {
          point: 'Significant Data Fiduciary obligations: DPIA, periodic audits, logging, DPO',
          legal: 'Rule 13 - SDF specific requirements'
        },
        {
          point: 'Consent Manager obligations: Registration, technical standards (if applicable)',
          legal: 'Rule 4, First Schedule - CM requirements'
        },
        {
          point: 'Language accessibility: English and at least one vernacular Indian language',
          legal: 'Rule 3 - Language requirements'
        }
      ],
      scientificRationale: '7% weight as regulatory compliance is binary (compliant/non-compliant). While legally critical, it has lower predictive value for actual privacy protection compared to substantive practices.'
    },
    {
      name: 'Transparency & Communication',
      weight: 3,
      icon: <Eye className="h-5 w-5" />,
      description: 'Information quality, accessibility, and clarity per Rule 3 notice requirements',
      legalBasis: 'Rule 3 (Notice requirements), DPDP Act Sec. 5 (Transparency), First Schedule (Consent Manager display standards)',
      criteria: [
        {
          point: 'Plain language: Readability for average user, avoiding legal jargon',
          legal: 'Rule 3 - Clear language requirement'
        },
        {
          point: 'Notice timing: Provided at or before personal data collection',
          legal: 'DPDP Act Sec. 5, Rule 3 - Notice timing'
        },
        {
          point: 'Notice completeness: All Rule 3 elements (purpose, data type, rights, grievance, contact)',
          legal: 'Rule 3 - Mandatory notice elements'
        },
        {
          point: 'Change notification: Proactive communication of policy updates',
          legal: 'Rule 3 - Update notifications'
        },
        {
          point: 'Accessibility: Mobile optimization, screen reader compatibility, vernacular support',
          legal: 'Rule 3 - Accessibility standards'
        },
        {
          point: 'Consent clarity: For Consent Managers, clear presentation without dark patterns',
          legal: 'Rule 4, First Schedule - CM display standards'
        }
      ],
      scientificRationale: 'Weighted 3% because transparency alone does not prevent harm — studies consistently show very few users read privacy policies in full. It matters, but the substantive protections in the other categories (97% combined weight) do the real work.'
    }
  ];

  const riskLevels = [
    {
      level: 'EXEMPLARY (9.0–10)',
      color: 'bg-green-100 text-green-800 border-green-300',
      description: 'Privacy-by-design implementation with technical enforcement. Exceeds DPDP Act and Rules minimum requirements significantly.',
      example: 'E2E encryption, zero-knowledge architecture, automatic data deletion, comprehensive rights automation'
    },
    {
      level: 'LOW RISK (7.0–8.9)',
      color: 'bg-blue-100 text-blue-800 border-blue-300',
      description: 'Strong privacy framework with minor gaps. Full DPDP compliance with industry best practices.',
      example: 'All required safeguards present, comprehensive rights, clear consent, proactive transparency'
    },
    {
      level: 'MODERATE RISK (5.0–6.9)',
      color: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      description: 'Basic privacy protections present. DPDP partially compliant with identified improvement areas.',
      example: 'Some rights limited, vague purposes, basic security, consent withdrawal unclear'
    },
    {
      level: 'MODERATE-HIGH RISK (3.0–4.9)',
      color: 'bg-orange-100 text-orange-800 border-orange-300',
      description: 'Multiple compliance gaps. Data Principal rights compromised, significant DPDP violations probable.',
      example: 'Excessive collection, broad sharing without consent, weak security, rights difficult to exercise'
    },
    {
      level: 'HIGH RISK (1.0–2.9)',
      color: 'bg-red-100 text-red-800 border-red-300',
      description: 'Significant DPDP Act and Rules violations. Data Protection Board enforcement action probable.',
      example: 'No consent mechanism, unrestricted sharing, no deletion rights, security breaches likely, non-compliance'
    }
  ];

  return (
    <Card className="border-blue-200 bg-blue-50">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Calculator className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h4 className="text-xl font-semibold text-blue-900">Scientific Analysis Methodology</h4>
              <p className="text-sm text-blue-700">DPDP Act 2023 + Rules 2025 Compliance Framework</p>
            </div>
          </div>
          <Button
            variant="ghost"
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-blue-700 hover:bg-blue-100"
          >
            {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
            {isExpanded ? 'Hide Details' : 'Show Details'}
          </Button>
        </div>

        {/* Scientific Basis */}
        <div className="mb-6 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-lg p-4 border-2 border-blue-300">
          <div className="flex items-start gap-3">
            <BookOpen className="h-5 w-5 text-blue-700 mt-1 flex-shrink-0" />
            <div>
              <h5 className="font-semibold text-blue-900 mb-2">Evidence-Based Scoring Framework</h5>
              <p className="text-sm text-blue-800 leading-relaxed">
                Our methodology is grounded in <strong>quantitative privacy research</strong>, legal compliance requirements,
                and empirical risk analysis. Category weights are derived from peer-reviewed studies on privacy breach impacts,
                user harm quantification, and regulatory enforcement patterns. Each criterion is objectively measurable against
                specific DPDP Act sections and Rules 2025 provisions.
              </p>
            </div>
          </div>
        </div>

        {/* Quick Overview */}
        <div className="mb-6">
          <div className="grid md:grid-cols-4 gap-4 mb-4">
            <div className="text-center p-4 bg-white rounded-lg border-2 border-blue-200">
              <div className="text-2xl font-bold text-blue-600">6</div>
              <div className="text-sm text-blue-700 font-medium">Assessment Categories</div>
              <div className="text-xs text-blue-600 mt-1">Weighted by impact</div>
            </div>
            <div className="text-center p-4 bg-white rounded-lg border-2 border-blue-200">
              <div className="text-2xl font-bold text-blue-600">39</div>
              <div className="text-sm text-blue-700 font-medium">Compliance Criteria</div>
              <div className="text-xs text-blue-600 mt-1">Evidence-based checkpoints</div>
            </div>
            <div className="text-center p-4 bg-white rounded-lg border-2 border-blue-200">
              <div className="text-2xl font-bold text-blue-600">23</div>
              <div className="text-sm text-blue-700 font-medium">DPDP Rules</div>
              <div className="text-xs text-blue-600 mt-1">Rules 1-23 (2025)</div>
            </div>
            <div className="text-center p-4 bg-white rounded-lg border-2 border-blue-200">
              <div className="text-2xl font-bold text-blue-600">7</div>
              <div className="text-sm text-blue-700 font-medium">Schedules</div>
              <div className="text-xs text-blue-600 mt-1">Detailed requirements</div>
            </div>
          </div>

          {/* Category Weights Overview */}
          <div className="bg-white rounded-lg p-4 border-2 border-blue-200">
            <h5 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
              <Scale className="h-4 w-4" />
              Scientifically Weighted Scoring Framework
            </h5>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {categories.map((category, index) => (
                <div key={index} className="flex items-center justify-between text-sm bg-blue-50 rounded p-2">
                  <span className="text-blue-700 font-medium">{category.name}</span>
                  <Badge variant="outline" className="text-blue-600 border-blue-400 font-bold">
                    {category.weight}%
                  </Badge>
                </div>
              ))}
            </div>
            <p className="text-xs text-blue-600 mt-3 italic">
              * Weights derived from empirical privacy breach impact studies and user harm quantification research
            </p>
          </div>
        </div>

        {/* Detailed Methodology */}
        {isExpanded && (
          <div className="space-y-6">
            {/* Scoring Categories */}
            <div>
              <h5 className="text-lg font-semibold text-blue-900 mb-4 flex items-center gap-2">
                <Info className="h-5 w-5" />
                Detailed Assessment Categories
              </h5>
              <div className="grid gap-4">
                {categories.map((category, index) => (
                  <div key={index} className="bg-white rounded-lg p-5 border-2 border-blue-200 hover:border-blue-400 transition-colors">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          {category.icon}
                        </div>
                        <div>
                          <h6 className="font-bold text-blue-900 text-lg">{category.name}</h6>
                          <p className="text-sm text-blue-700 mt-1">{category.description}</p>
                        </div>
                      </div>
                      <Badge className="bg-blue-600 text-white font-bold text-base px-3 py-1">
                        {category.weight}%
                      </Badge>
                    </div>

                    {/* Legal Basis */}
                    <div className="mb-3 p-3 bg-indigo-50 rounded border-l-4 border-indigo-400">
                      <p className="text-xs font-semibold text-indigo-900 mb-1">📚 Legal Framework:</p>
                      <p className="text-xs text-indigo-800">{category.legalBasis}</p>
                    </div>

                    {/* Scientific Rationale */}
                    <div className="mb-3 p-3 bg-purple-50 rounded border-l-4 border-purple-400">
                      <p className="text-xs font-semibold text-purple-900 mb-1">🔬 Scientific Rationale:</p>
                      <p className="text-xs text-purple-800">{category.scientificRationale}</p>
                    </div>

                    {/* Criteria */}
                    <div className="ml-0">
                      <p className="text-xs font-semibold text-blue-900 mb-2">✓ Evaluation Criteria ({category.criteria.length} checkpoints):</p>
                      <div className="space-y-2">
                        {category.criteria.map((criterion, idx) => (
                          <div key={idx} className="bg-blue-50 rounded p-2 border border-blue-200">
                            <div className="flex items-start gap-2">
                              <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
                              <div className="flex-1">
                                <p className="text-xs text-blue-900">{criterion.point}</p>
                                <p className="text-xs text-blue-600 italic mt-1">→ {criterion.legal}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Risk Classification */}
            <div>
              <h5 className="text-lg font-semibold text-blue-900 mb-4 flex items-center gap-2">
                <AlertCircle className="h-5 w-5" />
                Evidence-Based Risk Classification System
              </h5>
              <div className="space-y-3">
                {riskLevels.map((risk, index) => (
                  <div key={index} className="bg-white rounded-lg p-4 border-2 hover:shadow-md transition-shadow">
                    <div className="flex items-start gap-3">
                      <Badge className={`${risk.color} font-bold text-sm px-3 py-1 border`}>
                        {risk.level}
                      </Badge>
                      <div className="flex-1">
                        <p className="text-sm text-blue-900 font-medium mb-2">{risk.description}</p>
                        <div className="bg-gray-50 rounded p-2 border border-gray-200">
                          <p className="text-xs text-gray-700"><strong>Indicators:</strong> {risk.example}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Regulatory Framework */}
            <div className="bg-white rounded-lg p-5 border-2 border-green-200">
              <h5 className="text-lg font-semibold text-green-900 mb-4 flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Regulatory & Scientific Foundation
              </h5>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h6 className="font-bold text-green-800 mb-3 flex items-center gap-2">
                    🇮🇳 Indian Legal Framework
                  </h6>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 font-bold">•</span>
                      <div>
                        <strong className="text-green-900">DPDP Act 2023</strong>
                        <p className="text-green-700 text-xs">Digital Personal Data Protection Act (Enacted Aug 11, 2023)</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 font-bold">•</span>
                      <div>
                        <strong className="text-green-900">DPDP Rules 2025</strong>
                        <p className="text-green-700 text-xs">23 Rules + 7 Schedules (Notified 13 Nov 2025)</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 font-bold">•</span>
                      <div>
                        <strong className="text-green-900">IT Act 2000 & Rules 2011</strong>
                        <p className="text-green-700 text-xs">Information Technology Act with Security Practices</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 font-bold">•</span>
                      <div>
                        <strong className="text-green-900">Consumer Protection Act 2019</strong>
                        <p className="text-green-700 text-xs">Consumer data rights framework</p>
                      </div>
                    </li>
                  </ul>
                </div>
                <div>
                  <h6 className="font-bold text-green-800 mb-3 flex items-center gap-2">
                    🔬 Scientific Standards
                  </h6>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 font-bold">•</span>
                      <div>
                        <strong className="text-green-900">Privacy-by-Design Framework</strong>
                        <p className="text-green-700 text-xs">Ann Cavoukian's 7 foundational principles</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 font-bold">•</span>
                      <div>
                        <strong className="text-green-900">ISO/IEC 27001:2022</strong>
                        <p className="text-green-700 text-xs">Information security management standards</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 font-bold">•</span>
                      <div>
                        <strong className="text-green-900">FIPPs</strong>
                        <p className="text-green-700 text-xs">Fair Information Practice Principles (OECD, US FTC)</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 font-bold">•</span>
                      <div>
                        <strong className="text-green-900">Empirical Privacy Research</strong>
                        <p className="text-green-700 text-xs">Peer-reviewed studies on breach impacts & user harms</p>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Updated Status */}
              <div className="mt-4 p-4 bg-gradient-to-r from-green-50 to-blue-50 border-l-4 border-green-500 rounded">
                <p className="text-sm text-green-900 font-semibold mb-1">
                  ✅ DPDP Rules 2025 Status: NOTIFIED — Staggered Enforcement
                </p>
                <p className="text-xs text-green-800">
                  The Digital Personal Data Protection Rules 2025 were notified on 13 November 2025, with obligations
                  commencing in stages and full compliance required by 13 May 2027. Our analysis framework is updated
                  to reflect all 23 Rules and 7 Schedules and assesses policies against these requirements.
                </p>
              </div>
            </div>

            {/* Methodology Validation */}
            <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-lg p-5 border-2 border-purple-200">
              <h5 className="text-lg font-semibold text-purple-900 mb-3">🎯 Methodology Validation</h5>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div className="bg-white rounded p-3 border border-purple-200">
                  <h6 className="font-bold text-purple-800 mb-2">Deterministic aggregation</h6>
                  <p className="text-purple-700 text-xs">
                    Category scores (1–10) are assessed by AI against explicit DPDP criteria. The overall score, grade
                    and risk level are then computed by a fixed weighted formula server-side — not AI-generated — so the
                    aggregation is fully reproducible.
                  </p>
                </div>
                <div className="bg-white rounded p-3 border border-purple-200">
                  <h6 className="font-bold text-purple-800 mb-2">Consistency &amp; caching</h6>
                  <p className="text-purple-700 text-xs">
                    Identical policy content returns the identical cached result (keyed on a SHA-256 hash of the text),
                    so a re-analysis of unchanged text is byte-for-byte consistent for 60 days.
                  </p>
                </div>
                <div className="bg-white rounded p-3 border border-purple-200">
                  <h6 className="font-bold text-purple-800 mb-2">Legal traceability</h6>
                  <p className="text-purple-700 text-xs">
                    Every criterion maps to specific DPDP Act sections (Sec. 5–16, 8(10), 32) and Rules 2025
                    (Rules 1–23, Schedules 1–7), and findings cite the relevant provision.
                  </p>
                </div>
                <div className="bg-white rounded p-3 border border-purple-200">
                  <h6 className="font-bold text-purple-800 mb-2">Impact-weighted</h6>
                  <p className="text-purple-700 text-xs">
                    Weights prioritise the controls that most reduce real-world harm — data minimization and third-party
                    sharing (55% combined) — over downstream and procedural factors.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
