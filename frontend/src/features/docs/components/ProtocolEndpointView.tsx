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
        return "bg-[#F4F6F8] text-[#3E4C59] border-[#9AA5B1]/30";
      case "POST":
        return "bg-[#E4E7EB] text-[#1B222C] border-[#1B222C]/30";
      case "PUT":
      case "PATCH":
        return "bg-[#F4F6F8] text-[#6B7684] border-[#9AA5B1]/30";
      case "DELETE":
        return "bg-[#FEE2E2] text-[#991B1B] border-[#FCA5A5]";
      default:
        return "bg-[#F4F6F8] text-[#6B7684] border-[#E4E7EB]";
    }
  };

  return (
    <div className="w-full space-y-9">
      {/* Endpoint Header */}
      <div className="space-y-4 pb-6 border-b border-[#E4E7EB]">
        <div className="flex flex-wrap items-center gap-2">
          {endpoint.badge && (
            <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-[#F4F6F8] text-[#1B222C] border border-[#9AA5B1]/30">
              {endpoint.badge}
            </span>
          )}
          <span className="text-xs text-[#6B7684]">
            Module: <span className="capitalize font-semibold text-[#1B222C]">{endpoint.category.replace("-", " ")}</span>
          </span>
        </div>

        <h1 className="text-3xl font-bold text-[#1B222C] tracking-tight font-display">
          {endpoint.title}
        </h1>

        {endpoint.path && (
          <div className="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-lg bg-[#F4F6F8] border border-[#9AA5B1]/30 font-mono text-xs text-[#1B222C]">
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getMethodBadge(endpoint.method)}`}>
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

        <p className="text-sm text-[#3E4C59] leading-relaxed max-w-3xl pt-1">
          {endpoint.description}
        </p>
      </div>

      {/* Protocol Layout: Documentation on Left, Code Console on Right */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-10 items-start">
        {/* Left Column: Parameter Tables */}
        <div className="xl:col-span-6 space-y-8">
          {/* Headers Table */}
          {endpoint.headers && endpoint.headers.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#1B222C] flex items-center gap-2 font-display">
                <Terminal className="h-3.5 w-3.5 text-[#6B7684]" />
                Request Headers
              </h3>
              <div className="border border-[#E4E7EB] rounded-xl overflow-hidden bg-white shadow-2xs">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-[#F4F6F8] border-b border-[#E4E7EB] text-[#1B222C] font-semibold">
                      <th className="p-3 font-display">Header</th>
                      <th className="p-3 font-display">Type</th>
                      <th className="p-3 font-display">Required</th>
                      <th className="p-3 font-display">Description</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E4E7EB] text-[#3E4C59]">
                    {endpoint.headers.map((h) => (
                      <tr key={h.name} className="hover:bg-[#F4F6F8]/50 transition-colors">
                        <td className="p-3 font-mono font-semibold text-[#1B222C]">{h.name}</td>
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

          {/* Query Parameters Table */}
          {endpoint.queryParams && endpoint.queryParams.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#1B222C] flex items-center gap-2 font-display">
                <FileText className="h-3.5 w-3.5 text-[#6B7684]" />
                Query Parameters
              </h3>
              <div className="border border-[#E4E7EB] rounded-xl overflow-hidden bg-white shadow-2xs">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-[#F4F6F8] border-b border-[#E4E7EB] text-[#1B222C] font-semibold">
                      <th className="p-3 font-display">Parameter</th>
                      <th className="p-3 font-display">Type</th>
                      <th className="p-3 font-display">Required</th>
                      <th className="p-3 font-display">Description</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E4E7EB] text-[#3E4C59]">
                    {endpoint.queryParams.map((q) => (
                      <tr key={q.name} className="hover:bg-[#F4F6F8]/50 transition-colors">
                        <td className="p-3 font-mono font-semibold text-[#1B222C]">{q.name}</td>
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
                          {q.example !== undefined && (
                            <div className="mt-1 font-mono text-[10px] text-[#6B7684]">
                              Example: <span className="text-[#1B222C]">{String(q.example)}</span>
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

          {/* Request Body Parameters Table */}
          {endpoint.bodyParams && endpoint.bodyParams.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#1B222C] flex items-center gap-2 font-display">
                <FileText className="h-3.5 w-3.5 text-[#6B7684]" />
                Request Body Fields
              </h3>
              <div className="border border-[#E4E7EB] rounded-xl overflow-hidden bg-white shadow-2xs">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-[#F4F6F8] border-b border-[#E4E7EB] text-[#1B222C] font-semibold">
                      <th className="p-3 font-display">Field</th>
                      <th className="p-3 font-display">Type</th>
                      <th className="p-3 font-display">Required</th>
                      <th className="p-3 font-display">Description</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E4E7EB] text-[#3E4C59]">
                    {endpoint.bodyParams.map((b) => (
                      <tr key={b.name} className="hover:bg-[#F4F6F8]/50 transition-colors">
                        <td className="p-3 font-mono font-semibold text-[#1B222C]">{b.name}</td>
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
                            <div className="mt-1 font-mono text-[10px] text-[#6B7684]">
                              Example: <span className="text-[#1B222C]">{String(b.example)}</span>
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

          {/* Security & Audit Notice */}
          <div className="p-4 rounded-xl bg-[#F4F6F8] border border-[#9AA5B1]/30 flex items-start gap-3 text-xs text-[#3E4C59]">
            <ShieldAlert className="h-4 w-4 text-[#1B222C] shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-bold text-[#1B222C]">Enterprise Security &amp; Compliance</p>
              <p className="leading-relaxed text-[#6B7684]">
                All calls to this endpoint are logged for financial audit compliance, TLS 1.3 encrypted, and rate-limited.
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Sticky Interactive Console */}
        <div className="xl:col-span-6 xl:sticky xl:top-20">
          <ProtocolCodeConsole endpoint={endpoint} />
        </div>
      </div>
    </div>
  );
}
