"use client";

import { useState } from "react";
import { EndpointSpec } from "../docsData";
import { Play, Copy, Check, Terminal, Code2, RotateCcw, ShieldCheck } from "lucide-react";

interface ApiPlaygroundProps {
  endpoint: EndpointSpec;
}

type LangTab = "curl" | "typescript" | "python" | "csharp";

export function ApiPlayground({ endpoint }: ApiPlaygroundProps) {
  const [activeLang, setActiveLang] = useState<LangTab>("curl");
  const [copied, setCopied] = useState(false);
  const [requestBodyText, setRequestBodyText] = useState(() =>
    endpoint.sampleRequestBody ? JSON.stringify(endpoint.sampleRequestBody, null, 2) : ""
  );
  const [isLoading, setIsLoading] = useState(false);
  const [responseState, setResponseState] = useState<{
    status: number;
    latencyMs: number;
    data: any;
    mode: "sandbox" | "live";
  } | null>(null);
  const [showErrorExample, setShowErrorExample] = useState(false);

  const handleCopyCode = () => {
    let snippet = "";
    if (endpoint.codeExamples) {
      snippet = endpoint.codeExamples[activeLang] || "";
    } else {
      snippet = JSON.stringify(endpoint.sampleResponseSuccess, null, 2);
    }
    navigator.clipboard.writeText(snippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleResetBody = () => {
    if (endpoint.sampleRequestBody) {
      setRequestBodyText(JSON.stringify(endpoint.sampleRequestBody, null, 2));
    }
  };

  const handleRunRequest = async () => {
    setIsLoading(true);
    const start = Date.now();

    await new Promise((r) => setTimeout(r, 220 + Math.floor(Math.random() * 80)));

    let parsedBody = null;
    try {
      if (requestBodyText) {
        parsedBody = JSON.parse(requestBodyText);
      }
    } catch {
      const duration = Date.now() - start;
      setResponseState({
        status: 400,
        latencyMs: duration,
        mode: "sandbox",
        data: {
          success: false,
          error: {
            code: "INVALID_JSON",
            message: "Request body could not be parsed as valid JSON.",
          },
        },
      });
      setIsLoading(false);
      return;
    }

    const duration = Date.now() - start;
    if (showErrorExample && endpoint.sampleResponseError) {
      setResponseState({
        status: endpoint.sampleResponseError.status,
        latencyMs: duration,
        mode: "sandbox",
        data: endpoint.sampleResponseError.body,
      });
    } else {
      setResponseState({
        status: endpoint.sampleResponseSuccess.status,
        latencyMs: duration,
        mode: "sandbox",
        data: endpoint.sampleResponseSuccess.body,
      });
    }
    setIsLoading(false);
  };

  const currentCodeSnippet = endpoint.codeExamples?.[activeLang] || "";

  return (
    <div className="rounded-xl border border-[#3E4C59]/40 bg-[#1B222C] text-[#E4E7EB] shadow-2xl overflow-hidden font-mono text-xs flex flex-col h-full">
      {/* Top Console Bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-[#141A23] border-b border-[#3E4C59]/40">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#6B7684]/50 inline-block" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#6B7684]/50 inline-block" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#6B7684]/50 inline-block" />
          <span className="text-[11px] font-semibold text-[#9AA5B1] ml-2 font-sans flex items-center gap-1.5">
            <Terminal className="h-3 w-3 text-[#E4E7EB]" />
            Sandbox Console
          </span>
        </div>

        {/* Language Tabs */}
        {endpoint.codeExamples && (
          <div className="flex items-center bg-[#1B222C] rounded-lg p-0.5 border border-[#3E4C59]/50">
            {(["curl", "typescript", "python", "csharp"] as LangTab[]).map((lang) => (
              <button
                key={lang}
                type="button"
                onClick={() => setActiveLang(lang)}
                className={`px-2 py-1 text-[10px] font-sans font-medium rounded transition-all capitalize cursor-pointer ${
                  activeLang === lang
                    ? "bg-[#3E4C59] text-white shadow-sm font-semibold"
                    : "text-[#9AA5B1] hover:text-[#E4E7EB]"
                }`}
              >
                {lang === "csharp" ? "C#" : lang === "typescript" ? "Node.js" : lang}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Code Snippet Area */}
      {currentCodeSnippet && (
        <div className="relative p-4 bg-[#141A23] border-b border-[#3E4C59]/30">
          <div className="flex items-center justify-between text-[11px] text-[#9AA5B1] mb-2 font-sans">
            <span className="flex items-center gap-1.5 text-[#C4CDD5]">
              <Code2 className="h-3.5 w-3.5 text-[#9AA5B1]" />
              Request Snippet ({activeLang.toUpperCase()})
            </span>
            <button
              type="button"
              onClick={handleCopyCode}
              className="inline-flex items-center gap-1 text-[11px] hover:text-white transition-colors cursor-pointer text-[#9AA5B1]"
            >
              {copied ? (
                <>
                  <Check className="h-3 w-3 text-white" />
                  <span className="text-white font-semibold">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="h-3 w-3" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
          <pre className="text-[11px] text-[#F4F6F8] overflow-x-auto leading-relaxed max-h-56 scrollbar-thin">
            <code>{currentCodeSnippet}</code>
          </pre>
        </div>
      )}

      {/* Interactive Payload Editor */}
      {endpoint.sampleRequestBody && (
        <div className="p-4 border-b border-[#3E4C59]/30 bg-[#171E28]">
          <div className="flex items-center justify-between text-[11px] text-[#9AA5B1] mb-2 font-sans">
            <span className="font-semibold text-[#E4E7EB]">Request Body (Editable JSON)</span>
            <button
              type="button"
              onClick={handleResetBody}
              className="inline-flex items-center gap-1 text-[10px] text-[#9AA5B1] hover:text-white transition-colors cursor-pointer"
            >
              <RotateCcw className="h-2.5 w-2.5" />
              Reset Payload
            </button>
          </div>
          <textarea
            value={requestBodyText}
            onChange={(e) => setRequestBodyText(e.target.value)}
            rows={5}
            className="w-full bg-[#1B222C] text-[#F4F6F8] p-2.5 rounded-lg border border-[#3E4C59]/60 font-mono text-[11px] focus:outline-none focus:border-[#9AA5B1] focus:ring-1 focus:ring-[#9AA5B1]/30 transition-all leading-relaxed resize-y"
          />
        </div>
      )}

      {/* Action Buttons to Send Sandbox Request */}
      <div className="p-3 bg-[#141A23] flex items-center justify-between gap-3 border-b border-[#3E4C59]/40 font-sans">
        <div className="flex items-center gap-2">
          {endpoint.sampleResponseError && (
            <label className="inline-flex items-center gap-1.5 text-[11px] text-[#9AA5B1] cursor-pointer select-none">
              <input
                type="checkbox"
                checked={showErrorExample}
                onChange={(e) => setShowErrorExample(e.target.checked)}
                className="rounded border-[#3E4C59] bg-[#1B222C] text-[#3E4C59] focus:ring-0 cursor-pointer"
              />
              <span>Simulate Error ({endpoint.sampleResponseError.status})</span>
            </label>
          )}
        </div>

        <button
          type="button"
          onClick={handleRunRequest}
          disabled={isLoading}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-white hover:bg-[#F4F6F8] text-[#1B222C] font-bold text-xs transition-all shadow-md active:scale-95 disabled:opacity-50 cursor-pointer"
        >
          {isLoading ? (
            <>
              <div className="w-3 h-3 border-2 border-[#1B222C]/40 border-t-[#1B222C] rounded-full animate-spin" />
              <span>Executing...</span>
            </>
          ) : (
            <>
              <Play className="h-3 w-3 fill-current" />
              <span>Send Request</span>
            </>
          )}
        </button>
      </div>

      {/* Response Display Box */}
      <div className="p-4 bg-[#141A23] flex-1 min-h-[160px] flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between text-[11px] text-[#9AA5B1] mb-2 font-sans">
            <span className="font-semibold text-[#E4E7EB]">Response Payload</span>
            {responseState && (
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 text-[10px] text-[#E4E7EB] bg-[#3E4C59]/50 border border-[#3E4C59] px-1.5 py-0.5 rounded">
                  <ShieldCheck className="h-3 w-3 text-[#9AA5B1]" />
                  {responseState.latencyMs}ms
                </span>
                <span
                  className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                    responseState.status < 300
                      ? "bg-white/10 text-white border border-white/20"
                      : "bg-red-500/20 text-red-300 border border-red-500/30"
                  }`}
                >
                  HTTP {responseState.status}
                </span>
              </div>
            )}
          </div>

          <pre className="text-[11px] text-[#E4E7EB] overflow-x-auto leading-relaxed max-h-64 scrollbar-thin">
            <code>
              {responseState
                ? JSON.stringify(responseState.data, null, 2)
                : JSON.stringify(
                    showErrorExample && endpoint.sampleResponseError
                      ? endpoint.sampleResponseError.body
                      : endpoint.sampleResponseSuccess.body,
                    null,
                    2
                  )}
            </code>
          </pre>
        </div>

        <div className="pt-3 mt-3 border-t border-[#3E4C59]/30 flex items-center justify-between text-[10px] text-[#9AA5B1] font-sans">
          <span>Host: api.mftechnologies.org</span>
          <span>Zero-Trust Protocol Active</span>
        </div>
      </div>
    </div>
  );
}
