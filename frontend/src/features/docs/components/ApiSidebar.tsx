"use client";

import { Search, ChevronDown, ChevronRight, Layers, Shield, Cpu, CreditCard, RefreshCw, FileCode, CheckCircle2, MessageSquare, Lock } from "lucide-react";
import { DocCategory, EndpointSpec } from "../docsData";

interface ApiSidebarProps {
  categories: DocCategory[];
  activeEndpointId: string;
  onSelectEndpoint: (endpointId: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  openCategories: Record<string, boolean>;
  onToggleCategory: (catId: string) => void;
}

export function ApiSidebar({
  categories,
  activeEndpointId,
  onSelectEndpoint,
  searchQuery,
  onSearchChange,
  openCategories,
  onToggleCategory,
}: ApiSidebarProps) {
  const getCategoryIcon = (id: string) => {
    switch (id) {
      case "getting-started":
        return <Layers className="h-4 w-4 text-[#3E4C59]" />;
      case "lending":
        return <CreditCard className="h-4 w-4 text-[#1B222C]" />;
      case "scoring":
        return <Cpu className="h-4 w-4 text-[#3E4C59]" />;
      case "crm":
        return <RefreshCw className="h-4 w-4 text-[#3E4C59]" />;
      case "sms":
        return <MessageSquare className="h-4 w-4 text-[#1B222C]" />;
      case "webhooks":
        return <Shield className="h-4 w-4 text-[#3E4C59]" />;
      default:
        return <FileCode className="h-4 w-4 text-[#6B7684]" />;
    }
  };

  const getMethodBadgeClass = (method?: string) => {
    switch (method) {
      case "GET":
        return "bg-[#E4E7EB] text-[#1B222C] border-[#9AA5B1]/30";
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
    <aside className="w-full lg:w-72 shrink-0 border-r border-[#9AA5B1]/20 bg-[#F4F6F8] flex flex-col h-full">
      {/* Search Box */}
      <div className="p-4 border-b border-[#9AA5B1]/20 bg-white">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#9AA5B1]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search API endpoints..."
            className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-[#9AA5B1]/30 text-xs bg-[#F4F6F8] text-[#1B222C] placeholder-[#9AA5B1] focus:outline-none focus:border-[#1B222C] focus:bg-white transition-all font-body"
          />
        </div>
      </div>

      {/* Navigation List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-4 scrollbar-thin">
        {categories.map((cat) => {
          const isOpen = openCategories[cat.id] ?? true;
          return (
            <div key={cat.id} className="space-y-1">
              {/* Category Header Toggle */}
              <button
                type="button"
                onClick={() => onToggleCategory(cat.id)}
                className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs font-bold text-[#1B222C] hover:bg-[#E4E7EB] transition-colors cursor-pointer group font-display"
              >
                <div className="flex items-center gap-2 truncate">
                  {getCategoryIcon(cat.id)}
                  <span className="truncate">{cat.title}</span>
                </div>
                <div className="text-[#9AA5B1] group-hover:text-[#1B222C] transition-colors">
                  {isOpen ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
                </div>
              </button>

              {/* Endpoints in this category */}
              {isOpen && (
                <div className="pl-4 space-y-0.5 border-l border-[#9AA5B1]/20 ml-3">
                  {cat.items.map((item) => {
                    const isActive = activeEndpointId === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => onSelectEndpoint(item.id)}
                        className={`w-full flex items-center justify-between gap-2 px-2.5 py-1.5 rounded-md text-left text-xs transition-all cursor-pointer ${
                          isActive
                            ? "bg-[#1B222C] text-white font-semibold shadow-sm"
                            : "text-[#3E4C59] hover:bg-[#E4E7EB] hover:text-[#1B222C]"
                        }`}
                      >
                        <span className="truncate text-[11px] leading-tight flex-1">{item.title}</span>
                        <div className="flex items-center gap-1.5 shrink-0">
                          {item.authRequired ? (
                            <span title="Account Required">
                              <Lock
                                className={`h-2.5 w-2.5 ${isActive ? "text-[#F59E0B]" : "text-[#D97706]"}`}
                              />
                            </span>
                          ) : item.authRequired === false ? (
                            <span
                              className="w-1.5 h-1.5 rounded-full bg-[#10B981]"
                              title="Public Access"
                            />
                          ) : null}
                          {item.method ? (
                            <span
                              className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border shrink-0 ${
                                isActive ? "bg-white/20 text-white border-white/30" : getMethodBadgeClass(item.method)
                              }`}
                            >
                              {item.method}
                            </span>
                          ) : item.badge ? (
                            <span
                              className={`text-[9px] font-mono px-1.5 py-0.5 rounded shrink-0 ${
                                isActive
                                  ? "bg-white/20 text-white"
                                  : "bg-[#E4E7EB] text-[#3E4C59]"
                              }`}
                            >
                              {item.badge}
                            </span>
                          ) : null}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer Info */}
      <div className="p-3 border-t border-[#9AA5B1]/20 bg-white text-[11px] text-[#6B7684] flex items-center justify-between">
        <span className="flex items-center gap-1.5 font-medium">
          <CheckCircle2 className="h-3.5 w-3.5 text-[#1B222C]" />
          <span>v2.4.0 Institutional</span>
        </span>
        <span className="font-mono text-[10px] text-[#9AA5B1]">REST &bull; HTTPS</span>
      </div>
    </aside>
  );
}
