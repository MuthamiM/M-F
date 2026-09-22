"use client";

import { useState } from "react";
import { EndpointSpec } from "../docsData";
import { Play, Copy, Check, Terminal, Code2, RotateCcw, ShieldCheck, Activity } from "lucide-react";

interface ProtocolCodeConsoleProps {
  endpoint: EndpointSpec;
}

type LangTab = "curl" | "typescript" | "python" | "csharp";

export function ProtocolCodeConsole({ endpoint }: ProtocolCodeConsoleProps) {
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
  } | null>(null);

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

    let parsedBody: any = undefined;
    if (endpoint.method && endpoint.method !== "GET" && requestBodyText.trim()) {
      try {
        parsedBody = JSON.parse(requestBodyText);
      } catch {
        const duration = Date.now() - start;
        setResponseState({
          status: 400,
          latencyMs: duration,
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
    }

    // Determine target URL for real live API call
    let targetPath = endpoint.path || "/api/v1/health";
    // Replace path parameters if needed
    targetPath = targetPath
      .replace("{id}", "loan_app_98234")
      .replace(":id", "loan_app_98234");

    if (!targetPath.startsWith("/")) {
      targetPath = "/" + targetPath;
    }

    try {
      const res = await fetch(targetPath, {
        method: endpoint.method || "GET",
        headers: {
          "Content-Type": "application/json",
          "X-API-Key": apiKey,
        },
        body:
          endpoint.method && endpoint.method !== "GET" && parsedBody
            ? JSON.stringify(parsedBody)
            : undefined,
      });

      const duration = Date.now() - start;
      let responseData: any;
      try {
        responseData = await res.json();
      } catch {
        const text = await res.text();
        responseData = { rawResponse: text };
      }

      setResponseState({
        status: res.status,
        latencyMs: duration,
        data: responseData,
      });
    } catch (err: any) {
      const duration = Date.now() - start;
      setResponseState({
        status: 500,
        latencyMs: duration,
        data: {
          success: false,
          error: {
            code: "NETWORK_ERROR",
            message: err.message || "Failed to communicate with live M&F backend gateway",
          },
        },
      });
    } finally {
      setIsLoading(false);
    }
  };

  const currentCodeSnippet = endpoint.codeExamples?.[activeLang] || "";

  return (
    <div className="rounded-2xl border border-[#3E4C59]/40 bg-[#1B222C] text-[#E4E7EB] shadow-2xl overflow-hidden font-mono text-xs flex flex-col">
      {/* Top Console Bar */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#13181F] border-b border-[#3E4C59]/50">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#3E4C59] inline-block" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#3E4C59] inline-block" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#3E4C59] inline-block" />
          <span className="text-[11px] font-medium text-[#9AA5B1] ml-2 font-sans flex items-center gap-1.5">
            <Terminal className="h-3 w-3 text-[#E4E7EB]" />
            Live API Console
          </span>
        </div>

        {/* Language Tabs */}
        {endpoint.codeExamples && (
          <div className="flex items-center bg-[#1B222C] rounded-lg p-0.5 border border-[#3E4C59]/60">
            {(["curl", "typescript", "python", "csharp"] as LangTab[]).map((lang) => (
              <button
                key={lang}
                type="button"
                onClick={() => setActiveLang(lang)}
                className={`px-2.5 py-1 text-[11px] font-sans font-medium rounded-md transition-all capitalize cursor-pointer ${
                  activeLang === lang
                    ? "bg-[#3E4C59] text-white shadow-xs font-semibold"
                    : "text-[#9AA5B1] hover:text-[#F4F6F8]"
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
        <div className="relative p-4 bg-[#1B222C] border-b border-[#3E4C59]/50">
          <div className="flex items-center justify-between text-[11px] text-[#9AA5B1] mb-2.5 font-sans">
            <span className="flex items-center gap-1.5 text-[#C4CDD5]">
              <Code2 className="h-3.5 w-3.5 text-white" />
              Request Snippet ({activeLang.toUpperCase()})
            </span>
            <button
              type="button"
              onClick={handleCopyCode}
              className="inline-flex items-center gap-1.5 text-[11px] hover:text-white transition-colors cursor-pointer text-[#9AA5B1]"
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5 text-white" />
                  <span className="text-white font-semibold">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" />
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
        <div className="p-4 border-b border-[#3E4C59]/50 bg-[#13181F]/60">
          <div className="flex items-center justify-between text-[11px] text-[#9AA5B1] mb-2 font-sans">
            <span className="font-semibold text-[#F4F6F8]">Request Body (JSON)</span>
            <button
              type="button"
              onClick={handleResetBody}
              className="inline-flex items-center gap-1 text-[10px] text-[#9AA5B1] hover:text-[#F4F6F8] transition-colors cursor-pointer"
            >
              <RotateCcw className="h-2.5 w-2.5" />
              Reset Payload
            </button>
          </div>
          <textarea
            value={requestBodyText}
            onChange={(e) => setRequestBodyText(e.target.value)}
            rows={5}
            className="w-full bg-[#13181F] text-[#F4F6F8] p-3 rounded-lg border border-[#3E4C59]/60 font-mono text-[11px] focus:outline-none focus:border-[#9AA5B1] focus:ring-1 focus:ring-[#9AA5B1]/30 transition-all leading-relaxed resize-y"
          />
        </div>
      )}

      {/* Action Buttons */}
      <div className="p-3.5 bg-[#13181F] flex items-center justify-between gap-3 border-b border-[#3E4C59]/50 font-sans">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 text-[11px] text-[#9AA5B1]">
            <Activity className="h-3 w-3 text-[#E4E7EB]" />
            Live Gateway Active
          </span>
        </div>

        <button
          type="button"
          onClick={handleRunRequest}
          disabled={isLoading}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white hover:bg-[#F4F6F8] text-[#1B222C] font-bold text-xs transition-all shadow-md active:scale-95 disabled:opacity-50 cursor-pointer"
        >
          {isLoading ? (
            <>
              <div className="w-3.5 h-3.5 border-2 border-[#1B222C]/40 border-t-[#1B222C] rounded-full animate-spin" />
              <span>Executing Live Call...</span>
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
      <div className="p-4 bg-[#13181F] flex-1 min-h-[160px] flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between text-[11px] text-[#9AA5B1] mb-2.5 font-sans">
            <span className="font-semibold text-[#F4F6F8]">Response Output</span>
            {responseState && (
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 text-[10px] text-[#E4E7EB] bg-[#1B222C] border border-[#3E4C59]/60 px-2 py-0.5 rounded">
                  <ShieldCheck className="h-3 w-3 text-white" />
                  {responseState.latencyMs}ms
                </span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    responseState.status < 300
                      ? "bg-white text-[#1B222C]"
                      : "bg-red-500/20 text-red-300 border border-red-500/40"
                  }`}
                >
                  HTTP {responseState.status}
                </span>
              </div>
            )}
          </div>

          <pre className="text-[11px] text-[#F4F6F8] overflow-x-auto leading-relaxed max-h-64 scrollbar-thin">
            <code>
              {responseState
                ? JSON.stringify(responseState.data, null, 2)
                : JSON.stringify(endpoint.sampleResponseSuccess.body, null, 2)}
            </code>
          </pre>
        </div>

        <div className="pt-3 mt-3 border-t border-[#3E4C59]/50 flex items-center justify-between text-[10px] text-[#9AA5B1] font-sans">
          <span>Host: api.mftechnologies.org</span>
          <span>M&amp;F Gateway v2.4 Live</span>
        </div>
      </div>
    </div>
  );
}
