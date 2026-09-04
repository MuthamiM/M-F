"use client";

import { EndpointSpec } from "../docsData";

interface ProtocolSidebarProps {
  activeId: string;
  onSelect: (id: string) => void;
  onCloseMobile?: () => void;
}

export function ProtocolSidebar({ activeId, onSelect, onCloseMobile }: ProtocolSidebarProps) {
  const handleItemClick = (id: string) => {
    onSelect(id);
    if (onCloseMobile) onCloseMobile();
  };

  const guides = [
    {
      id: "introduction",
      title: "Introduction",
      subItems: [
        { id: "introduction", title: "Guides" },
        { id: "resources-overview", title: "Resources" },
      ],
    },
    { id: "quickstart", title: "Quickstart" },
    { id: "sdks", title: "SDKs" },
    { id: "authentication", title: "Authentication" },
    { id: "pagination", title: "Pagination" },
    { id: "errors", title: "Errors" },
    { id: "webhooks", title: "Webhooks" },
  ];

  const resources = [
    { id: "create-loan-application", title: "Lending Applications", method: "POST" },
    { id: "get-loan-application", title: "Application Status", method: "GET" },
    { id: "evaluate-credit-score", title: "Credit Scoring", method: "POST" },
    { id: "send-sms-message", title: "SMS Gateway (Send)", method: "POST" },
    { id: "get-sms-status", title: "SMS Message Status", method: "GET" },
    { id: "list-sms-messages", title: "SMS Message Log", method: "GET" },
    { id: "list-sms-devices", title: "SMS SIM Devices", method: "GET" },
    { id: "verify-sms-otp", title: "Verify Mobile OTP", method: "POST" },
    { id: "get-collections-queue", title: "CRM & Collections", method: "GET" },
    { id: "webhook-verification", title: "Webhook Events", method: "POST" },
    { id: "changelog-v2", title: "Changelog" },
  ];

  return (
    <nav className="w-full text-sm font-sans space-y-8">
      {/* Guides Group */}
      <div className="space-y-3">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-900 px-3">
          Guides
        </h2>
        <ul className="space-y-1">
          {guides.map((item) => {
            const isMainActive = activeId === item.id;
            return (
              <li key={item.id} className="space-y-1">
                <button
                  type="button"
                  onClick={() => handleItemClick(item.id)}
                  className={`w-full text-left px-3 py-1.5 rounded-lg text-xs transition-colors cursor-pointer flex items-center justify-between ${
                    isMainActive
                      ? "text-emerald-600 font-semibold bg-emerald-50/50"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                  }`}
                >
                  <span>{item.title}</span>
                </button>

                {/* Sub-items if Introduction is selected */}
                {item.subItems && isMainActive && (
                  <ul className="pl-6 space-y-1 border-l border-slate-200 ml-4 py-1">
                    {item.subItems.map((sub) => (
                      <li key={sub.id}>
                        <button
                          type="button"
                          onClick={() => handleItemClick(sub.id)}
                          className={`w-full text-left py-1 text-xs transition-colors cursor-pointer ${
                            activeId === sub.id
                              ? "text-emerald-600 font-semibold"
                              : "text-slate-500 hover:text-slate-900"
                          }`}
                        >
                          {sub.title}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>
      </div>

      {/* Resources Group */}
      <div className="space-y-3">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-900 px-3">
          Resources
        </h2>
        <ul className="space-y-1">
          {resources.map((res) => {
            const isActive = activeId === res.id;
            return (
              <li key={res.id}>
                <button
                  type="button"
                  onClick={() => handleItemClick(res.id)}
                  className={`w-full text-left px-3 py-1.5 rounded-lg text-xs transition-colors cursor-pointer flex items-center justify-between group ${
                    isActive
                      ? "text-emerald-600 font-semibold bg-emerald-50/50"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                  }`}
                >
                  <span className="truncate">{res.title}</span>
                  {res.method && (
                    <span
                      className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded ${
                        res.method === "POST"
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200/60"
                          : res.method === "GET"
                          ? "bg-sky-50 text-sky-700 border border-sky-200/60"
                          : "bg-slate-100 text-slate-700"
                      }`}
                    >
                      {res.method}
                    </span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
