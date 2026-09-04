"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { DOCS_DATA, DocCategory, EndpointSpec } from "../docsData";
import { ApiSidebar } from "./ApiSidebar";
import { ApiDetailView } from "./ApiDetailView";
import { ArrowLeft, Menu, X, Key } from "lucide-react";

export function DocsPortal() {
  const [activeEndpointId, setActiveEndpointId] = useState<string>("create-loan-application");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [environment, setEnvironment] = useState<"sandbox" | "production">("sandbox");
  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>({
    "getting-started": true,
    lending: true,
    scoring: true,
    crm: true,
    sms: true,
    webhooks: true,
    changelog: true,
  });

  const toggleCategory = (catId: string) => {
    setOpenCategories((prev) => ({
      ...prev,
      [catId]: !prev[catId],
    }));
  };

  // Filter categories and endpoints by search query
  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) return DOCS_DATA;
    const query = searchQuery.toLowerCase();

    return DOCS_DATA.map((cat) => {
      const filteredItems = cat.items.filter(
        (item) =>
          item.title.toLowerCase().includes(query) ||
          item.description.toLowerCase().includes(query) ||
          item.path?.toLowerCase().includes(query) ||
          item.method?.toLowerCase().includes(query) ||
          item.bodyParams?.some((p) => p.name.toLowerCase().includes(query))
      );
      return {
        ...cat,
        items: filteredItems,
      };
    }).filter((cat) => cat.items.length > 0);
  }, [searchQuery]);

  // Find currently active endpoint object
  const activeEndpoint = useMemo(() => {
    for (const cat of DOCS_DATA) {
      const match = cat.items.find((item) => item.id === activeEndpointId);
      if (match) return match;
    }
    return DOCS_DATA[1].items[0]; // fallback to Create Loan Application
  }, [activeEndpointId]);

  return (
    <div className="flex flex-col h-screen w-full bg-white overflow-hidden text-[#1B222C] font-body">
      {/* Top Header Bar */}
      <header className="h-14 border-b border-[#9AA5B1]/20 bg-white px-4 sm:px-6 flex items-center justify-between shrink-0 z-20">
        <div className="flex items-center gap-4">
          {/* Mobile Sidebar Toggle */}
          <button
            type="button"
            onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            className="lg:hidden p-1.5 rounded-lg border border-[#9AA5B1]/30 hover:bg-[#F4F6F8] text-[#1B222C] cursor-pointer"
            aria-label="Toggle navigation"
          >
            {mobileSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>

          <Link href="/" className="inline-flex items-center gap-2 text-xs font-semibold text-[#3E4C59] hover:text-[#1B222C] transition-colors">
            <ArrowLeft className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Back to Home</span>
          </Link>

          <div className="h-4 w-px bg-[#9AA5B1]/30 hidden sm:block" />

          <div className="flex items-center gap-2">
            <span className="font-bold text-sm sm:text-base text-[#1B222C] tracking-tight font-display">
              M&amp;F <span className="font-normal text-[#6B7684]">Developer API</span>
            </span>
            <span className="hidden md:inline-block text-[10px] uppercase font-bold tracking-widest bg-[#F4F6F8] text-[#1B222C] border border-[#9AA5B1]/30 px-2 py-0.5 rounded">
              v2.4 Active
            </span>
          </div>
        </div>

        {/* Right Header Actions: Environment Switcher & Key CTA */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Environment Switcher */}
          <div className="hidden sm:flex items-center bg-[#F4F6F8] p-0.5 rounded-lg border border-[#9AA5B1]/30 text-xs">
            <button
              type="button"
              onClick={() => setEnvironment("sandbox")}
              className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all cursor-pointer ${
                environment === "sandbox"
                  ? "bg-[#1B222C] text-white shadow-xs"
                  : "text-[#6B7684] hover:text-[#1B222C]"
              }`}
            >
              Sandbox
            </button>
            <button
              type="button"
              onClick={() => setEnvironment("production")}
              className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all cursor-pointer ${
                environment === "production"
                  ? "bg-[#1B222C] text-white shadow-xs"
                  : "text-[#6B7684] hover:text-[#1B222C]"
              }`}
            >
              Production
            </button>
          </div>

          <Link
            href="/request-demo"
            className="inline-flex items-center gap-1.5 rounded-lg bg-[#1B222C] hover:bg-[#3E4C59] text-white px-3.5 py-1.5 text-xs font-semibold transition-all shadow-sm cursor-pointer active:scale-95"
          >
            <Key className="h-3.5 w-3.5 text-[#C4CDD5]" />
            <span className="hidden sm:inline">Get Production Key</span>
            <span className="sm:hidden">Keys</span>
          </Link>
        </div>
      </header>

      {/* Main App Body */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block h-full">
          <ApiSidebar
            categories={filteredCategories}
            activeEndpointId={activeEndpointId}
            onSelectEndpoint={(id) => setActiveEndpointId(id)}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            openCategories={openCategories}
            onToggleCategory={toggleCategory}
          />
        </div>

        {/* Mobile Drawer Sidebar */}
        {mobileSidebarOpen && (
          <div className="lg:hidden absolute inset-0 z-30 bg-black/40 backdrop-blur-xs flex">
            <div className="w-80 max-w-[85vw] bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-left duration-200">
              <div className="p-3 border-b border-[#9AA5B1]/20 flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-[#3E4C59]">API Explorer</span>
                <button
                  type="button"
                  onClick={() => setMobileSidebarOpen(false)}
                  className="p-1 rounded text-[#6B7684] hover:text-[#1B222C]"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto">
                <ApiSidebar
                  categories={filteredCategories}
                  activeEndpointId={activeEndpointId}
                  onSelectEndpoint={(id) => {
                    setActiveEndpointId(id);
                    setMobileSidebarOpen(false);
                  }}
                  searchQuery={searchQuery}
                  onSearchChange={setSearchQuery}
                  openCategories={openCategories}
                  onToggleCategory={toggleCategory}
                />
              </div>
            </div>
            <div className="flex-1" onClick={() => setMobileSidebarOpen(false)} />
          </div>
        )}

        {/* Detail Content Area */}
        <main className="flex-1 h-full bg-white overflow-hidden">
          <ApiDetailView endpoint={activeEndpoint} />
        </main>
      </div>
    </div>
  );
}
