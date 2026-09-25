"use client";

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
    { id: "errors", title: "Errors & Limits" },
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
    <nav className="w-full text-sm font-sans space-y-7">
      {/* Guides Group */}
      <div className="space-y-2.5">
        <h2 className="text-[11px] font-bold uppercase tracking-wider text-[#1B222C] px-3 font-display">
          Guides
        </h2>
        <ul className="space-y-0.5">
          {guides.map((item) => {
            const isMainActive = activeId === item.id;
            return (
              <li key={item.id} className="space-y-0.5">
                <button
                  type="button"
                  onClick={() => handleItemClick(item.id)}
                  className={`w-full text-left px-3 py-1.5 rounded-md text-xs transition-all cursor-pointer flex items-center justify-between ${
                    isMainActive
                      ? "text-[#1B222C] font-bold bg-[#F4F6F8] shadow-2xs border-l-2 border-[#1B222C]"
                      : "text-[#3E4C59] hover:text-[#1B222C] hover:bg-[#F4F6F8]/70"
                  }`}
                >
                  <span>{item.title}</span>
                </button>

                {/* Sub-items if Introduction is selected */}
                {item.subItems && isMainActive && (
                  <ul className="pl-5 space-y-0.5 border-l border-[#E4E7EB] ml-4 py-1">
                    {item.subItems.map((sub) => (
                      <li key={sub.id}>
                        <button
                          type="button"
                          onClick={() => handleItemClick(sub.id)}
                          className={`w-full text-left py-1 text-xs transition-colors cursor-pointer ${
                            activeId === sub.id
                              ? "text-[#1B222C] font-bold"
                              : "text-[#6B7684] hover:text-[#1B222C]"
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
      <div className="space-y-2.5">
        <h2 className="text-[11px] font-bold uppercase tracking-wider text-[#1B222C] px-3 font-display">
          Resources
        </h2>
        <ul className="space-y-0.5">
          {resources.map((res) => {
            const isActive = activeId === res.id;
            return (
              <li key={res.id}>
                <button
                  type="button"
                  onClick={() => handleItemClick(res.id)}
                  className={`w-full text-left px-3 py-1.5 rounded-md text-xs transition-all cursor-pointer flex items-center justify-between group ${
                    isActive
                      ? "text-[#1B222C] font-bold bg-[#F4F6F8] shadow-2xs border-l-2 border-[#1B222C]"
                      : "text-[#3E4C59] hover:text-[#1B222C] hover:bg-[#F4F6F8]/70"
                  }`}
                >
                  <span className="truncate">{res.title}</span>
                  {res.method && (
                    <span
                      className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded ${
                        res.method === "POST"
                          ? "bg-[#E4E7EB] text-[#1B222C] border border-[#9AA5B1]/40"
                          : res.method === "GET"
                          ? "bg-[#F4F6F8] text-[#3E4C59] border border-[#9AA5B1]/30"
                          : "bg-[#F4F6F8] text-[#6B7684]"
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
