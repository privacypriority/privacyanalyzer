'use client';

import React from 'react';
import { AlertCircle, CheckCircle, XCircle, MinusCircle, ArrowRight, UserCheck, Building2, ShieldCheck } from 'lucide-react';

export interface UserActionPlanData {
  summary?: string;
  top_actions?: { action: string; why?: string; priority?: string }[];
  your_rights?: { right: string; dpdp_reference?: string; available?: string; how_to_use?: string }[];
  watch_outs?: string[];
}

export interface ComplianceScorecardData {
  overall_health?: string;
  pii_handling_health_score?: number;
  obligations?: { area: string; dpdp_reference?: string; status?: string; finding?: string; action_required?: string }[];
  priority_gaps?: string[];
}

function priorityStyle(p?: string) {
  const v = (p || '').toUpperCase();
  if (v === 'HIGH') return 'bg-rose-50 text-rose-700 ring-rose-200';
  if (v === 'MEDIUM') return 'bg-amber-50 text-amber-700 ring-amber-200';
  return 'bg-slate-100 text-slate-600 ring-slate-200';
}

function rightAvailability(a?: string) {
  const v = (a || '').toUpperCase();
  if (v === 'YES') return { icon: <CheckCircle className="h-4 w-4 text-emerald-600" />, label: 'Available' };
  if (v === 'PARTIAL') return { icon: <AlertCircle className="h-4 w-4 text-amber-600" />, label: 'Partial' };
  if (v === 'NO') return { icon: <XCircle className="h-4 w-4 text-rose-600" />, label: 'Not offered' };
  return { icon: <MinusCircle className="h-4 w-4 text-slate-400" />, label: 'Unclear' };
}

export function UserActionPlan({ plan }: { plan: UserActionPlanData }) {
  const actions = plan.top_actions?.filter((a) => a?.action) || [];
  const rights = plan.your_rights?.filter((r) => r?.right) || [];
  const watchOuts = plan.watch_outs?.filter(Boolean) || [];
  return (
    <div className="rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-50/60 to-white p-6">
      <div className="mb-4 flex items-center gap-2">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-600 px-3 py-1 text-xs font-semibold text-white">
          <UserCheck className="h-3.5 w-3.5" /> For You
        </span>
        <h3 className="text-base font-bold text-slate-900">Your privacy — what to do</h3>
      </div>
      {plan.summary && <p className="mb-5 text-sm leading-relaxed text-slate-600">{plan.summary}</p>}

      {actions.length > 0 && (
        <div className="mb-6">
          <h4 className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500">Recommended actions</h4>
          <ul className="space-y-2.5">
            {actions.map((a, i) => (
              <li key={i} className="flex items-start gap-3 rounded-xl border border-slate-100 bg-white p-3">
                <span className={`mt-0.5 shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ring-1 ${priorityStyle(a.priority)}`}>{a.priority || 'TIP'}</span>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-slate-800">{a.action}</p>
                  {a.why && <p className="mt-0.5 text-xs text-slate-500">{a.why}</p>}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {rights.length > 0 && (
        <div className="mb-6">
          <h4 className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500">Your rights under India&apos;s DPDP Act</h4>
          <div className="grid gap-2.5 sm:grid-cols-2">
            {rights.map((r, i) => {
              const av = rightAvailability(r.available);
              return (
                <div key={i} className="rounded-xl border border-slate-100 bg-white p-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="flex items-center gap-1.5 text-sm font-semibold text-slate-800">{av.icon}{r.right}</span>
                    {r.dpdp_reference && <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-slate-500">{r.dpdp_reference}</span>}
                  </div>
                  {r.how_to_use && <p className="mt-1.5 text-xs leading-relaxed text-slate-500">{r.how_to_use}</p>}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {watchOuts.length > 0 && (
        <div>
          <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Watch out for</h4>
          <ul className="space-y-1.5">
            {watchOuts.map((w, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-500" />{w}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function statusStyle(s?: string) {
  const v = (s || '').toUpperCase();
  if (v === 'MET') return { cls: 'bg-emerald-50 text-emerald-700 ring-emerald-200', label: 'Met' };
  if (v === 'PARTIAL') return { cls: 'bg-amber-50 text-amber-700 ring-amber-200', label: 'Partial' };
  if (v === 'GAP') return { cls: 'bg-rose-50 text-rose-700 ring-rose-200', label: 'Gap' };
  if (v === 'NOT_APPLICABLE') return { cls: 'bg-slate-100 text-slate-500 ring-slate-200', label: 'N/A' };
  return { cls: 'bg-slate-100 text-slate-600 ring-slate-200', label: 'Not addressed' };
}

export function ComplianceScorecard({ card }: { card: ComplianceScorecardData }) {
  const obligations = card.obligations?.filter((o) => o?.area) || [];
  const gaps = card.priority_gaps?.filter(Boolean) || [];
  const health = typeof card.pii_handling_health_score === 'number' ? card.pii_handling_health_score : null;
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6">
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold text-white">
          <Building2 className="h-3.5 w-3.5" /> For Policy Owners
        </span>
        <h3 className="text-base font-bold text-slate-900">DPDP compliance health</h3>
        {health !== null && (
          <span className="ml-auto flex items-center gap-1.5 text-sm">
            <ShieldCheck className="h-4 w-4 text-slate-400" />
            <span className="font-bold text-slate-900">{health.toFixed(1)}</span>
            <span className="text-slate-400">/10 handling health</span>
          </span>
        )}
      </div>
      {card.overall_health && <p className="mb-5 text-sm leading-relaxed text-slate-600">{card.overall_health}</p>}

      {obligations.length > 0 && (
        <div className="mb-6 overflow-hidden rounded-xl border border-slate-100">
          {obligations.map((o, i) => {
            const st = statusStyle(o.status);
            const upper = (o.status || '').toUpperCase();
            return (
              <div key={i} className={`p-4 ${i > 0 ? 'border-t border-slate-100' : ''}`}>
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-800">{o.area}</p>
                    {o.dpdp_reference && <p className="text-[11px] text-slate-400">{o.dpdp_reference}</p>}
                  </div>
                  <span className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase ring-1 ${st.cls}`}>{st.label}</span>
                </div>
                {o.finding && <p className="mt-2 text-xs text-slate-500">{o.finding}</p>}
                {o.action_required && upper !== 'MET' && upper !== 'NOT_APPLICABLE' && (
                  <p className="mt-1.5 flex items-start gap-1.5 text-xs font-medium text-slate-700">
                    <ArrowRight className="mt-0.5 h-3 w-3 shrink-0 text-slate-400" />{o.action_required}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}

      {gaps.length > 0 && (
        <div className="rounded-xl border border-rose-100 bg-rose-50/50 p-4">
          <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-rose-700">Fix these first</h4>
          <ol className="space-y-1.5">
            {gaps.map((g, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-rose-600 text-[10px] font-bold text-white">{i + 1}</span>{g}
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
}
