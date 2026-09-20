"use client";

import { useState, useEffect } from "react";
import { EndpointSpec, HttpMethod } from "../docsData";
import {
  Play,
  Copy,
  Check,
  Terminal,
  Code2,
  RotateCcw,
  ShieldCheck,
  Lock,
  Unlock,
  Key,
  Globe,
  Radio,
  AlertCircle,
  Sparkles,
} from "lucide-react";

interface ApiPlaygroundProps {
  endpoint: EndpointSpec;
}

type LangTab = "curl" | "typescript" | "python" | "csharp";

const DEMO_API_KEY = "mf_test_live_4f9a82b1";

export function ApiPlayground({ endpoint }: ApiPlaygroundProps) {
  const [activeLang, setActiveLang] = useState<LangTab>("curl");
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedResponse, setCopiedResponse] = useState(false);
  const [apiKey, setApiKey] = useState<string>("");
  const [requestBodyText, setRequestBodyText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [jsonError, setJsonError] = useState<string | null>(null);

  const [responseState, setResponseState] = useState<{
    status: number;
    latencyMs: number;
    data: any;
    isLive: boolean;
    headers?: Record<string, string>;
  } | null>(null);

  // Sync body and reset response when endpoint changes
  useEffect(() => {
    if (endpoint.sampleRequestBody) {
      setRequestBodyText(JSON.stringify(endpoint.sampleRequestBody, null, 2));
    } else {
      setRequestBodyText("");
    }
    setJsonError(null);
    setResponseState(null);
  }, [endpoint.id]);

  const handleCopyCode = () => {
    let snippet = "";
    if (endpoint.codeExamples) {
      snippet = endpoint.codeExamples[activeLang] || "";
      if (apiKey && activeLang === "curl") {
        snippet = snippet.replace(/mf_live_sec_[a-zA-Z0-9.]+/, apiKey);
      }
    } else {
      snippet = JSON.stringify(endpoint.sampleResponseSuccess, null, 2);
    }
    navigator.clipboard.writeText(snippet);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleCopyResponse = () => {
    if (!responseState) return;
    navigator.clipboard.writeText(JSON.stringify(responseState.data, null, 2));
    setCopiedResponse(true);
    setTimeout(() => setCopiedResponse(false), 2000);
  };

  const handleResetBody = () => {
    if (endpoint.sampleRequestBody) {
      setRequestBodyText(JSON.stringify(endpoint.sampleRequestBody, null, 2));
      setJsonError(null);
    }
  };

  const handleFillDemoKey = () => {
    setApiKey(DEMO_API_KEY);
  };

  const handleClearKey = () => {
    setApiKey("");
  };

  const handleRunRequest = async () => {
    setIsLoading(true);
    setJsonError(null);
    const start = Date.now();

    // Determine target URL and method
    const targetPath = endpoint.liveEndpoint || endpoint.path;
    const method: HttpMethod = endpoint.liveMethod || endpoint.method || "GET";

    if (!targetPath) {
      // Documentation or static guide page
      const duration = Date.now() - start;
      setResponseState({
        status: endpoint.sampleResponseSuccess.status,
        latencyMs: Math.max(12, duration),
        data: endpoint.sampleResponseSuccess.body,
        isLive: false,
      });
      setIsLoading(false);
      return;
    }

    // Validate JSON body for write requests
    let bodyPayload: any = undefined;
    if (["POST", "PUT", "PATCH"].includes(method) && requestBodyText.trim().length > 0) {
      try {
        bodyPayload = JSON.parse(requestBodyText);
      } catch (err: any) {
        setJsonError(err.message || "Invalid JSON syntax");
        setIsLoading(false);
        return;
      }
    }

    try {
      const headers: Record<string, string> = {
        "Accept": "application/json",
      };

      if (["POST", "PUT", "PATCH"].includes(method)) {
        headers["Content-Type"] = "application/json";
      }

      if (apiKey && apiKey.trim().length > 0) {
        headers["X-API-Key"] = apiKey.trim();
      }

      // Execute REAL live call to backend (proxied through Next.js rewrite or direct backend)
      const fetchUrl = targetPath.startsWith("/") ? targetPath : `/${targetPath}`;
      const response = await fetch(fetchUrl, {
        method,
        headers,
        body: bodyPayload !== undefined ? JSON.stringify(bodyPayload) : undefined,
      });

      const duration = Date.now() - start;
      const contentType = response.headers.get("content-type") || "";

      let data: any = null;
      if (contentType.includes("application/json")) {
        data = await response.json();
      } else {
        const text = await response.text();
        data = { raw: text };
      }

      setResponseState({
        status: response.status,
        latencyMs: duration,
        data,
        isLive: true,
      });
    } catch (fetchErr: any) {
      const duration = Date.now() - start;
      setResponseState({
        status: 503,
        latencyMs: duration,
        isLive: true,
        data: {
          success: false,
          error: {
            code: "NETWORK_ERROR",
            message: fetchErr.message || "Failed to establish HTTP connection with M&F API Gateway.",
            host: window.location.origin,
            targetEndpoint: targetPath,
          },
        },
      });
    } finally {
      setIsLoading(false);
    }
  };

  const currentCodeSnippet = endpoint.codeExamples?.[activeLang] || "";

  return (
    <div className="rounded-xl border border-[#3E4C59]/50 bg-[#1B222C] text-[#E4E7EB] shadow-2xl overflow-hidden font-mono text-xs flex flex-col h-full">
      {/* Top Console Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-2.5 bg-[#141A23] border-b border-[#3E4C59]/50">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#EF4444]/70 inline-block" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]/70 inline-block" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#10B981]/70 inline-block" />
          <span className="text-[11px] font-bold text-[#E4E7EB] ml-2 font-sans flex items-center gap-1.5">
            <Terminal className="h-3.5 w-3.5 text-[#10B981]" />
            M&amp;F Interactive API Console
          </span>
          <span className="inline-flex items-center gap-1 text-[9px] font-sans px-1.5 py-0.5 rounded bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/30 font-medium">
            <Radio className="h-2.5 w-2.5 animate-pulse" />
            Live Gateway
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
                className={`px-2 py-1 text-[10px] font-sans font-medium rounded transition-all cursor-pointer ${
                  activeLang === lang
                    ? "bg-[#3E4C59] text-white shadow-sm font-semibold"
                    : "text-[#9AA5B1] hover:text-[#E4E7EB]"
                }`}
              >
                {lang === "csharp" ? "C#" : lang === "typescript" ? "Node.js" : lang.toUpperCase()}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Access Permission & Auth Requirement Strip */}
      <div
        className={`px-4 py-2.5 border-b font-sans text-[11px] flex flex-wrap items-center justify-between gap-3 ${
          endpoint.authRequired
            ? "bg-[#2A2318] border-[#F59E0B]/30 text-[#FDE68A]"
            : "bg-[#14261E] border-[#10B981]/30 text-[#A7F3D0]"
        }`}
      >
        <div className="flex items-center gap-2">
          {endpoint.authRequired ? (
            <>
              <span className="inline-flex items-center gap-1 font-bold px-2 py-0.5 rounded bg-[#F59E0B]/20 text-[#F59E0B] border border-[#F59E0B]/40 text-[10px]">
                <Lock className="h-3 w-3" />
                Requires M&amp;F Account
              </span>
              <span className="text-[11px] text-[#FDE68A]/90 hidden sm:inline">
                Authentication required via <code className="bg-black/30 px-1 py-0.5 rounded font-mono text-[10px]">X-API-Key</code>
              </span>
            </>
          ) : (
            <>
              <span className="inline-flex items-center gap-1 font-bold px-2 py-0.5 rounded bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/40 text-[10px]">
                <Unlock className="h-3 w-3" />
                Public Endpoint
              </span>
              <span className="text-[11px] text-[#A7F3D0]/90 hidden sm:inline">
                Open to all developers — no account or API key needed to try!
              </span>
            </>
          )}
        </div>

        {/* Account Key Actions for Protected Endpoints */}
        {endpoint.authRequired && (
          <div className="flex items-center gap-2">
            {!apiKey ? (
              <button
                type="button"
                onClick={handleFillDemoKey}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-[#F59E0B] hover:bg-[#D97706] text-[#1B222C] font-bold text-[10px] transition-all cursor-pointer shadow-xs active:scale-95"
              >
                <Key className="h-2.5 w-2.5" />
                Use Sandbox Key
              </button>
            ) : (
              <button
                type="button"
                onClick={handleClearKey}
                className="inline-flex items-center gap-1 px-2 py-1 rounded bg-black/40 hover:bg-black/60 text-[#FDE68A] text-[10px] transition-colors cursor-pointer"
              >
                Clear Key (Test 401)
              </button>
            )}
          </div>
        )}
      </div>

      {/* API Key Input Field (When endpoint requires auth or user wants to pass custom key) */}
      {endpoint.authRequired && (
        <div className="p-3 bg-[#181F2A] border-b border-[#3E4C59]/40 flex flex-wrap items-center gap-2 text-[11px] font-sans">
          <div className="flex items-center gap-1.5 text-[#9AA5B1] shrink-0 font-medium">
            <Key className="h-3.5 w-3.5 text-[#F59E0B]" />
            <span>X-API-Key:</span>
          </div>
          <input
            type="text"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="Enter institutional API key (e.g. mf_test_live_4f9a82b1) or leave empty to test 401"
            className="flex-1 min-w-[240px] bg-[#141A23] border border-[#3E4C59]/70 rounded-md px-2.5 py-1 text-xs text-[#E4E7EB] placeholder-[#6B7684] font-mono focus:outline-none focus:border-[#F59E0B] transition-all"
          />
          {apiKey === DEMO_API_KEY && (
            <span className="text-[10px] text-[#10B981] font-semibold flex items-center gap-1">
              <Check className="h-3 w-3" />
              Demo Sandbox Active
            </span>
          )}
        </div>
      )}

      {/* Target Path Strip */}
      <div className="px-4 py-2 bg-[#141A23] border-b border-[#3E4C59]/30 flex items-center justify-between text-[11px] font-mono">
        <div className="flex items-center gap-2">
          <span
            className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
              (endpoint.liveMethod || endpoint.method) === "POST"
                ? "bg-[#3B82F6]/20 text-[#60A5FA] border border-[#3B82F6]/30"
                : (endpoint.liveMethod || endpoint.method) === "GET"
                ? "bg-[#10B981]/20 text-[#34D399] border border-[#10B981]/30"
                : "bg-[#3E4C59] text-white"
            }`}
          >
            {endpoint.liveMethod || endpoint.method || "GET"}
          </span>
          <span className="text-[#E4E7EB] font-semibold">{endpoint.liveEndpoint || endpoint.path}</span>
        </div>
        <span className="text-[#9AA5B1] text-[10px] font-sans flex items-center gap-1">
          <Globe className="h-3 w-3 text-[#6B7684]" />
          Direct Server Dispatch
        </span>
      </div>

      {/* Code Snippet Area */}
      {currentCodeSnippet && (
        <div className="relative p-3.5 bg-[#141A23] border-b border-[#3E4C59]/30">
          <div className="flex items-center justify-between text-[11px] text-[#9AA5B1] mb-2 font-sans">
            <span className="flex items-center gap-1.5 text-[#C4CDD5]">
              <Code2 className="h-3.5 w-3.5 text-[#9AA5B1]" />
              Executable Example ({activeLang.toUpperCase()})
            </span>
            <button
              type="button"
              onClick={handleCopyCode}
              className="inline-flex items-center gap-1 text-[11px] hover:text-white transition-colors cursor-pointer text-[#9AA5B1]"
            >
              {copiedCode ? (
                <>
                  <Check className="h-3 w-3 text-[#10B981]" />
                  <span className="text-[#10B981] font-semibold">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="h-3 w-3" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
          <pre className="text-[11px] text-[#F4F6F8] overflow-x-auto leading-relaxed max-h-48 scrollbar-thin">
            <code>{currentCodeSnippet}</code>
          </pre>
        </div>
      )}

      {/* Interactive Payload Editor for POST / PUT */}
      {endpoint.sampleRequestBody && (
        <div className="p-3.5 border-b border-[#3E4C59]/30 bg-[#171E28]">
          <div className="flex items-center justify-between text-[11px] text-[#9AA5B1] mb-2 font-sans">
            <span className="font-semibold text-[#E4E7EB] flex items-center gap-1.5">
              <span>Request Body (Live Editable JSON)</span>
              {jsonError && (
                <span className="text-[#EF4444] text-[10px] font-normal flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {jsonError}
                </span>
              )}
            </span>
            <button
              type="button"
              onClick={handleResetBody}
              className="inline-flex items-center gap-1 text-[10px] text-[#9AA5B1] hover:text-white transition-colors cursor-pointer"
            >
              <RotateCcw className="h-2.5 w-2.5" />
              Reset Default
            </button>
          </div>
          <textarea
            value={requestBodyText}
            onChange={(e) => {
              setRequestBodyText(e.target.value);
              setJsonError(null);
            }}
            rows={5}
            className={`w-full bg-[#1B222C] text-[#F4F6F8] p-2.5 rounded-lg border font-mono text-[11px] focus:outline-none transition-all leading-relaxed resize-y ${
              jsonError
                ? "border-[#EF4444] focus:ring-1 focus:ring-[#EF4444]"
                : "border-[#3E4C59]/70 focus:border-[#10B981] focus:ring-1 focus:ring-[#10B981]/30"
            }`}
          />
        </div>
      )}

      {/* Execution Trigger Bar */}
      <div className="p-3 bg-[#141A23] flex items-center justify-between gap-3 border-b border-[#3E4C59]/40 font-sans">
        <div className="flex items-center gap-2 text-[11px] text-[#9AA5B1]">
          {endpoint.authRequired && !apiKey && (
            <span className="text-[#F59E0B] text-[10px] flex items-center gap-1">
              <Lock className="h-3 w-3" />
              No API key set: expect HTTP 401
            </span>
          )}
          {endpoint.authRequired && apiKey && (
            <span className="text-[#10B981] text-[10px] flex items-center gap-1">
              <ShieldCheck className="h-3 w-3" />
              Key provided: authenticating request
            </span>
          )}
          {!endpoint.authRequired && (
            <span className="text-[#10B981] text-[10px] flex items-center gap-1">
              <Sparkles className="h-3 w-3" />
              Public call: ready to dispatch
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={handleRunRequest}
          disabled={isLoading}
          className="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-[#10B981] hover:bg-[#059669] text-[#141A23] font-bold text-xs transition-all shadow-md active:scale-95 disabled:opacity-50 cursor-pointer"
        >
          {isLoading ? (
            <>
              <div className="w-3.5 h-3.5 border-2 border-[#141A23]/40 border-t-[#141A23] rounded-full animate-spin" />
              <span>Sending Live Call...</span>
            </>
          ) : (
            <>
              <Play className="h-3.5 w-3.5 fill-current" />
              <span>Send Live Request</span>
            </>
          )}
        </button>
      </div>

      {/* Response Display Box */}
      <div className="p-4 bg-[#141A23] flex-1 min-h-[190px] flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between text-[11px] text-[#9AA5B1] mb-2.5 font-sans">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-[#E4E7EB]">
                {responseState ? "Live Gateway Response" : "Expected Schema (Reference)"}
              </span>
              {responseState?.isLive && (
                <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/30">
                  REAL LIVE CALL
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              {responseState && (
                <>
                  <span className="inline-flex items-center gap-1 text-[10px] text-[#E4E7EB] bg-[#3E4C59]/60 border border-[#3E4C59] px-2 py-0.5 rounded">
                    <ShieldCheck className="h-3 w-3 text-[#10B981]" />
                    {responseState.latencyMs}ms
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                      responseState.status >= 200 && responseState.status < 300
                        ? "bg-[#10B981]/20 text-[#10B981] border-[#10B981]/40"
                        : responseState.status === 401
                        ? "bg-[#F59E0B]/20 text-[#F59E0B] border-[#F59E0B]/40"
                        : "bg-[#EF4444]/20 text-[#EF4444] border-[#EF4444]/40"
                    }`}
                  >
                    HTTP {responseState.status}
                  </span>
                </>
              )}
              <button
                type="button"
                onClick={handleCopyResponse}
                title="Copy response body"
                className="text-[#9AA5B1] hover:text-white transition-colors cursor-pointer p-1"
              >
                {copiedResponse ? <Check className="h-3.5 w-3.5 text-[#10B981]" /> : <Copy className="h-3.5 w-3.5" />}
              </button>
            </div>
          </div>

          <pre className="text-[11px] text-[#E4E7EB] overflow-x-auto leading-relaxed max-h-72 scrollbar-thin p-3 rounded-lg bg-[#0F141C] border border-[#3E4C59]/40">
            <code>
              {responseState
                ? JSON.stringify(responseState.data, null, 2)
                : JSON.stringify(endpoint.sampleResponseSuccess.body, null, 2)}
            </code>
          </pre>
        </div>

        <div className="pt-3 mt-3 border-t border-[#3E4C59]/30 flex flex-wrap items-center justify-between gap-2 text-[10px] text-[#9AA5B1] font-sans">
          <span>Host: api.mftechnologies.org &bull; TLS 1.3</span>
          <span className="font-mono text-[9px] text-[#6B7684]">
            {responseState ? `Executed in ${responseState.latencyMs}ms` : "Ready for live execution"}
          </span>
        </div>
      </div>
    </div>
  );
}
