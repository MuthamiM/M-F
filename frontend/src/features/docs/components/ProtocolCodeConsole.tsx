"use client";

import { useState } from "react";
import { EndpointSpec } from "../docsData";
import { Play, Copy, Check, Terminal, Code2, RotateCcw, ShieldCheck } from "lucide-react";

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

    await new Promise((r) => setTimeout(r, 180 + Math.floor(Math.random() * 90)));

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
        data: endpoint.sampleResponseError.body,
      });
    } else {
      setResponseState({
        status: endpoint.sampleResponseSuccess.status,
        latencyMs: duration,
        data: endpoint.sampleResponseSuccess.body,
      });
    }
    setIsLoading(false);
  };

  const currentCodeSnippet = endpoint.codeExamples?.[activeLang] || "";

  return (
    <div className="rounded-2xl border border-slate-800/80 bg-slate-950 text-slate-200 shadow-xl overflow-hidden font-mono text-xs flex flex-col">
      {/* Top Console Bar */}
      <div className="flex items-center justify-between px-4 py-3 bg-slate-900/90 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-slate-700 inline-block" />
          <span className="w-2.5 h-2.5 rounded-full bg-slate-700 inline-block" />
          <span className="w-2.5 h-2.5 rounded-full bg-slate-700 inline-block" />
          <span className="text-[11px] font-medium text-slate-400 ml-2 font-sans flex items-center gap-1.5">
            <Terminal className="h-3 w-3 text-emerald-400" />
            Sandbox Console
          </span>
        </div>

        {/* Language Tabs */}
        {endpoint.codeExamples && (
          <div className="flex items-center bg-slate-950/80 rounded-lg p-0.5 border border-slate-800">
            {(["curl", "typescript", "python", "csharp"] as LangTab[]).map((lang) => (
              <button
                key={lang}
                type="button"
                onClick={() => setActiveLang(lang)}
                className={`px-2.5 py-1 text-[11px] font-sans font-medium rounded-md transition-all capitalize cursor-pointer ${
                  activeLang === lang
                    ? "bg-slate-800 text-white shadow-xs font-semibold"
                    : "text-slate-400 hover:text-slate-200"
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
        <div className="relative p-4 bg-slate-950 border-b border-slate-800/60">
          <div className="flex items-center justify-between text-[11px] text-slate-400 mb-2.5 font-sans">
            <span className="flex items-center gap-1.5 text-slate-300">
              <Code2 className="h-3.5 w-3.5 text-emerald-400" />
              Request Snippet ({activeLang.toUpperCase()})
            </span>
            <button
              type="button"
              onClick={handleCopyCode}
              className="inline-flex items-center gap-1.5 text-[11px] hover:text-white transition-colors cursor-pointer text-slate-400"
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-400" />
                  <span className="text-emerald-400 font-semibold">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
          <pre className="text-[11px] text-slate-100 overflow-x-auto leading-relaxed max-h-56 scrollbar-thin">
            <code>{currentCodeSnippet}</code>
          </pre>
        </div>
      )}

      {/* Interactive Payload Editor */}
      {endpoint.sampleRequestBody && (
        <div className="p-4 border-b border-slate-800/60 bg-slate-900/40">
          <div className="flex items-center justify-between text-[11px] text-slate-400 mb-2 font-sans">
            <span className="font-semibold text-slate-200">Request Body (JSON)</span>
            <button
              type="button"
              onClick={handleResetBody}
              className="inline-flex items-center gap-1 text-[10px] text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
            >
              <RotateCcw className="h-2.5 w-2.5" />
              Reset Payload
            </button>
          </div>
          <textarea
            value={requestBodyText}
            onChange={(e) => setRequestBodyText(e.target.value)}
            rows={5}
            className="w-full bg-slate-950 text-slate-100 p-3 rounded-lg border border-slate-800 font-mono text-[11px] focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/30 transition-all leading-relaxed resize-y"
          />
        </div>
      )}

      {/* Action Buttons */}
      <div className="p-3.5 bg-slate-900/70 flex items-center justify-between gap-3 border-b border-slate-800 font-sans">
        <div className="flex items-center gap-2">
          {endpoint.sampleResponseError && (
            <label className="inline-flex items-center gap-2 text-[11px] text-slate-400 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={showErrorExample}
                onChange={(e) => setShowErrorExample(e.target.checked)}
                className="rounded border-slate-700 bg-slate-950 text-emerald-500 focus:ring-0 cursor-pointer"
              />
              <span>Simulate Error ({endpoint.sampleResponseError.status})</span>
            </label>
          )}
        </div>

        <button
          type="button"
          onClick={handleRunRequest}
          disabled={isLoading}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-all shadow-md active:scale-95 disabled:opacity-50 cursor-pointer"
        >
          {isLoading ? (
            <>
              <div className="w-3.5 h-3.5 border-2 border-slate-950/40 border-t-slate-950 rounded-full animate-spin" />
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
      <div className="p-4 bg-slate-950 flex-1 min-h-[160px] flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between text-[11px] text-slate-400 mb-2.5 font-sans">
            <span className="font-semibold text-slate-200">Response</span>
            {responseState && (
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 text-[10px] text-slate-300 bg-slate-800/70 border border-slate-700 px-2 py-0.5 rounded">
                  <ShieldCheck className="h-3 w-3 text-emerald-400" />
                  {responseState.latencyMs}ms
                </span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    responseState.status < 300
                      ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                      : "bg-red-500/10 text-red-400 border border-red-500/20"
                  }`}
                >
                  HTTP {responseState.status}
                </span>
              </div>
            )}
          </div>

          <pre className="text-[11px] text-slate-200 overflow-x-auto leading-relaxed max-h-64 scrollbar-thin">
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

        <div className="pt-3 mt-3 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-500 font-sans">
          <span>Host: api.mftechnologies.org</span>
          <span>Zero-Trust Protocol Active</span>
        </div>
      </div>
    </div>
  );
}
