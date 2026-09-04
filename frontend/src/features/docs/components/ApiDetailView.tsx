"use client";

import { EndpointSpec } from "../docsData";
import { ApiPlayground } from "./ApiPlayground";
import { Copy, Check, Terminal, ExternalLink, ShieldAlert, FileText } from "lucide-react";
import { useState } from "react";

interface ApiDetailViewProps {
  endpoint: EndpointSpec;
}

export function ApiDetailView({ endpoint }: ApiDetailViewProps) {
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
        return "bg-[#E4E7EB] text-[#1B222C] border-[#9AA5B1]/40";
      case "POST":
        return "bg-[#1B222C] text-white border-[#1B222C]";
      case "PUT":
      case "PATCH":
        return "bg-[#3E4C59] text-white border-[#3E4C59]";
      case "DELETE":
        return "bg-[#E4E7EB] text-red-700 border-red-300";
      default:
        return "bg-[#E4E7EB] text-[#3E4C59] border-[#9AA5B1]/30";
    }
  };

  return (
    <div className="w-full h-full overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-8 scrollbar-thin">
      {/* Endpoint Header */}
      <div className="space-y-3 pb-6 border-b border-[#9AA5B1]/20">
        <div className="flex flex-wrap items-center gap-2">
          {endpoint.badge && (
            <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded bg-[#E4E7EB] text-[#1B222C] border border-[#9AA5B1]/30">
              {endpoint.badge}
            </span>
          )}
          <span className="text-xs text-[#6B7684]">
            Module: <span className="capitalize font-semibold text-[#1B222C]">{endpoint.category.replace("-", " ")}</span>
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold text-[#1B222C] tracking-tight font-display">
          {endpoint.title}
        </h1>

        {endpoint.path && (
          <div className="inline-flex items-center gap-2.5 p-2 rounded-lg bg-[#F4F6F8] border border-[#9AA5B1]/30 font-mono text-xs text-[#1B222C]">
            <span className={`px-2 py-0.5 rounded text-[11px] font-bold border ${getMethodBadge(endpoint.method)}`}>
              {endpoint.method}
            </span>
            <span className="font-semibold">{endpoint.path}</span>
            <button
              type="button"
              onClick={handleCopyPath}
              title="Copy endpoint path"
              className="p-1 hover:bg-[#E4E7EB] rounded text-[#6B7684] hover:text-[#1B222C] transition-colors cursor-pointer"
            >
              {copiedPath ? <Check className="h-3.5 w-3.5 text-[#1B222C]" /> : <Copy className="h-3.5 w-3.5" />}
            </button>
          </div>
        )}

        <p className="text-sm text-[#3E4C59] leading-relaxed max-w-3xl pt-1 font-body">
          {endpoint.description}
        </p>
      </div>

      {/* Two Column Section: Left = Specs / Parameters, Right = Interactive Playground */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
        {/* Left Column: Parameter Tables */}
        <div className="xl:col-span-6 space-y-8 font-body">
          {/* Headers Table */}
          {endpoint.headers && endpoint.headers.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#1B222C] flex items-center gap-2 font-display">
                <Terminal className="h-3.5 w-3.5 text-[#3E4C59]" />
                Headers
              </h3>
              <div className="border border-[#9AA5B1]/20 rounded-xl overflow-hidden bg-white shadow-xs">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-[#F4F6F8] border-b border-[#9AA5B1]/20 text-[#1B222C] font-bold">
                      <th className="p-3">Field</th>
                      <th className="p-3">Type</th>
                      <th className="p-3">Requirement</th>
                      <th className="p-3">Description</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#9AA5B1]/15 text-[#3E4C59]">
                    {endpoint.headers.map((h) => (
                      <tr key={h.name} className="hover:bg-[#F4F6F8]/50 transition-colors">
                        <td className="p-3 font-mono font-bold text-[#1B222C]">{h.name}</td>
                        <td className="p-3 font-mono text-[11px] text-[#6B7684]">{h.type}</td>
                        <td className="p-3">
                          {h.required ? (
                            <span className="text-[10px] font-bold text-[#1B222C] bg-[#E4E7EB] border border-[#9AA5B1]/40 px-1.5 py-0.5 rounded">
                              required
                            </span>
                          ) : (
                            <span className="text-[10px] text-[#6B7684] bg-[#F4F6F8] px-1.5 py-0.5 rounded">
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
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#1B222C] flex items-center gap-2 font-display">
                <FileText className="h-3.5 w-3.5 text-[#3E4C59]" />
                Query Parameters
              </h3>
              <div className="border border-[#9AA5B1]/20 rounded-xl overflow-hidden bg-white shadow-xs">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-[#F4F6F8] border-b border-[#9AA5B1]/20 text-[#1B222C] font-bold">
                      <th className="p-3">Parameter</th>
                      <th className="p-3">Type</th>
                      <th className="p-3">Requirement</th>
                      <th className="p-3">Description</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#9AA5B1]/15 text-[#3E4C59]">
                    {endpoint.queryParams.map((q) => (
                      <tr key={q.name} className="hover:bg-[#F4F6F8]/50 transition-colors">
                        <td className="p-3 font-mono font-bold text-[#1B222C]">{q.name}</td>
                        <td className="p-3 font-mono text-[11px] text-[#6B7684]">{q.type}</td>
                        <td className="p-3">
                          {q.required ? (
                            <span className="text-[10px] font-bold text-[#1B222C] bg-[#E4E7EB] border border-[#9AA5B1]/40 px-1.5 py-0.5 rounded">
                              required
                            </span>
                          ) : (
                            <span className="text-[10px] text-[#6B7684] bg-[#F4F6F8] px-1.5 py-0.5 rounded">
                              optional
                            </span>
                          )}
                        </td>
                        <td className="p-3 leading-relaxed text-[11px]">
                          {q.description}
                          {q.example && (
                            <div className="mt-1 font-mono text-[10px] text-[#1B222C]">
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
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#1B222C] flex items-center gap-2 font-display">
                <Terminal className="h-3.5 w-3.5 text-[#3E4C59]" />
                Request Body Attributes
              </h3>
              <div className="border border-[#9AA5B1]/20 rounded-xl overflow-hidden bg-white shadow-xs">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-[#F4F6F8] border-b border-[#9AA5B1]/20 text-[#1B222C] font-bold">
                      <th className="p-3">Field</th>
                      <th className="p-3">Type</th>
                      <th className="p-3">Requirement</th>
                      <th className="p-3">Description</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#9AA5B1]/15 text-[#3E4C59]">
                    {endpoint.bodyParams.map((b) => (
                      <tr key={b.name} className="hover:bg-[#F4F6F8]/50 transition-colors">
                        <td className="p-3 font-mono font-bold text-[#1B222C]">{b.name}</td>
                        <td className="p-3 font-mono text-[11px] text-[#6B7684]">{b.type}</td>
                        <td className="p-3">
                          {b.required ? (
                            <span className="text-[10px] font-bold text-[#1B222C] bg-[#E4E7EB] border border-[#9AA5B1]/40 px-1.5 py-0.5 rounded">
                              required
                            </span>
                          ) : (
                            <span className="text-[10px] text-[#6B7684] bg-[#F4F6F8] px-1.5 py-0.5 rounded">
                              optional
                            </span>
                          )}
                        </td>
                        <td className="p-3 leading-relaxed text-[11px]">
                          {b.description}
                          {b.example !== undefined && (
                            <div className="mt-1 font-mono text-[10px] text-[#1B222C]">
                              e.g., {JSON.stringify(b.example)}
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

          {/* Integration & Compliance Note */}
          <div className="p-4 rounded-xl bg-[#F4F6F8] border border-[#9AA5B1]/30 flex items-start gap-3 text-xs text-[#3E4C59]">
            <ShieldAlert className="h-5 w-5 text-[#3E4C59] shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-bold text-[#1B222C]">Enterprise Audit &amp; Data Residency</p>
              <p className="leading-relaxed">
                All requests, algorithmic scoring executions, SMS dispatches, and automated disbursements are recorded in an append-only cryptographic ledger with 7-year immutable audit retention for Central Bank regulatory compliance.
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Code Console & Sandbox */}
        <div className="xl:col-span-6 xl:sticky xl:top-6">
          <ApiPlayground endpoint={endpoint} />
        </div>
      </div>
    </div>
  );
}
