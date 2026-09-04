"use client";

import { EndpointSpec } from "../docsData";
import { ProtocolCodeConsole } from "./ProtocolCodeConsole";
import { Copy, Check, Terminal, FileText, ShieldAlert } from "lucide-react";
import { useState } from "react";

interface ProtocolEndpointViewProps {
  endpoint: EndpointSpec;
}

export function ProtocolEndpointView({ endpoint }: ProtocolEndpointViewProps) {
  const [copiedPath, setCopiedPath] = useState(false);

  const handleCopyPath = () => {
    if (endpoint.path) {
      navigator.clipboard.writeText(endpoint.path);
      setCopiedPath(true);
      setTimeout(() => setCopiedPath(false), 2000);
    }
  };

  const getMethodBadge = (method?: string) => {
    switch (method) {
      case "GET":
        return "bg-sky-50 text-sky-700 border-sky-200";
      case "POST":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "PUT":
      case "PATCH":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "DELETE":
        return "bg-rose-50 text-rose-700 border-rose-200";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  return (
    <div className="w-full space-y-10">
      {/* Endpoint Header */}
      <div className="space-y-4 pb-6 border-b border-slate-100">
        <div className="flex flex-wrap items-center gap-2">
          {endpoint.badge && (
            <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              {endpoint.badge}
            </span>
          )}
          <span className="text-xs text-slate-400">
            Resource: <span className="capitalize font-semibold text-slate-700">{endpoint.category.replace("-", " ")}</span>
          </span>
        </div>

        <h1 className="text-3xl font-bold text-slate-900 tracking-tight font-display">
          {endpoint.title}
        </h1>

        {endpoint.path && (
          <div className="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 font-mono text-xs text-slate-800">
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getMethodBadge(endpoint.method)}`}>
              {endpoint.method}
            </span>
            <span className="font-semibold">{endpoint.path}</span>
            <button
              type="button"
              onClick={handleCopyPath}
              title="Copy endpoint path"
              className="p-1 hover:bg-slate-200/60 rounded text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
            >
              {copiedPath ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
            </button>
          </div>
        )}

        <p className="text-sm text-slate-600 leading-relaxed max-w-3xl pt-1">
          {endpoint.description}
        </p>
      </div>

      {/* Protocol Two Column Layout: Documentation on Left, Code Console on Right */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-10 items-start">
        {/* Left Column: Parameter Tables */}
        <div className="xl:col-span-6 space-y-8">
          {/* Headers Table */}
          {endpoint.headers && endpoint.headers.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-900 flex items-center gap-2 font-display">
                <Terminal className="h-3.5 w-3.5 text-slate-500" />
                Headers
              </h3>
              <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-xs">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-900 font-semibold">
                      <th className="p-3">Field</th>
                      <th className="p-3">Type</th>
                      <th className="p-3">Requirement</th>
                      <th className="p-3">Description</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-600">
                    {endpoint.headers.map((h) => (
                      <tr key={h.name} className="hover:bg-slate-50/60 transition-colors">
                        <td className="p-3 font-mono font-semibold text-slate-900">{h.name}</td>
                        <td className="p-3 font-mono text-[11px] text-slate-500">{h.type}</td>
                        <td className="p-3">
                          {h.required ? (
                            <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded">
                              required
                            </span>
                          ) : (
                            <span className="text-[10px] text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                              optional
                            </span>
                          )}
                        </td>
                        <td className="p-3 leading-relaxed text-[11px]">{h.description}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Query Params Table */}
          {endpoint.queryParams && endpoint.queryParams.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-900 flex items-center gap-2 font-display">
                <FileText className="h-3.5 w-3.5 text-slate-500" />
                Query Parameters
              </h3>
              <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-xs">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-900 font-semibold">
                      <th className="p-3">Parameter</th>
                      <th className="p-3">Type</th>
                      <th className="p-3">Requirement</th>
                      <th className="p-3">Description</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-600">
                    {endpoint.queryParams.map((q) => (
                      <tr key={q.name} className="hover:bg-slate-50/60 transition-colors">
                        <td className="p-3 font-mono font-semibold text-slate-900">{q.name}</td>
                        <td className="p-3 font-mono text-[11px] text-slate-500">{q.type}</td>
                        <td className="p-3">
                          {q.required ? (
                            <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded">
                              required
                            </span>
                          ) : (
                            <span className="text-[10px] text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                              optional
                            </span>
                          )}
                        </td>
                        <td className="p-3 leading-relaxed text-[11px]">
                          {q.description}
                          {q.example && (
                            <div className="mt-1 font-mono text-[10px] text-slate-700">
                              Example: {String(q.example)}
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Request Body Attributes Table */}
          {endpoint.bodyParams && endpoint.bodyParams.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-900 flex items-center gap-2 font-display">
                <Terminal className="h-3.5 w-3.5 text-slate-500" />
                Request Body Attributes
              </h3>
              <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-xs">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-900 font-semibold">
                      <th className="p-3">Field</th>
                      <th className="p-3">Type</th>
                      <th className="p-3">Requirement</th>
                      <th className="p-3">Description</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-600">
                    {endpoint.bodyParams.map((b) => (
                      <tr key={b.name} className="hover:bg-slate-50/60 transition-colors">
                        <td className="p-3 font-mono font-semibold text-slate-900">{b.name}</td>
                        <td className="p-3 font-mono text-[11px] text-slate-500">{b.type}</td>
                        <td className="p-3">
                          {b.required ? (
                            <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded">
                              required
                            </span>
                          ) : (
                            <span className="text-[10px] text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                              optional
                            </span>
                          )}
                        </td>
                        <td className="p-3 leading-relaxed text-[11px]">
                          {b.description}
                          {b.example !== undefined && (
                            <div className="mt-1 font-mono text-[10px] text-slate-700">
                              e.g. {JSON.stringify(b.example)}
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Institutional Compliance Notice */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-start gap-3.5 text-xs text-slate-600">
            <ShieldAlert className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-semibold text-slate-900">Institutional Audit &amp; Data Residency</p>
              <p className="leading-relaxed text-[11px]">
                All requests, credit risk weight evaluations, SMS gateway dispatches, and disbursements are recorded in an append-only cryptographic ledger with 7-year immutable audit retention for Central Bank compliance.
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Sticky Protocol Code Console */}
        <div className="xl:col-span-6 xl:sticky xl:top-20">
          <ProtocolCodeConsole endpoint={endpoint} />
        </div>
      </div>
    </div>
  );
}
