"use client";

import { useEffect, useState } from "react";
import { Search, X, ChevronRight, Terminal, FileText, ArrowRight } from "lucide-react";
import { DOCS_DATA, EndpointSpec } from "../docsData";

interface ProtocolSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (endpointId: string) => void;
}

export function ProtocolSearchModal({ isOpen, onClose, onSelect }: ProtocolSearchModalProps) {
  const [query, setQuery] = useState("");

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
      }
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Flatten all items
  const allItems = DOCS_DATA.flatMap((category) =>
    category.items.map((item) => ({
      ...item,
      categoryTitle: category.title,
    }))
  );

  const filtered = query.trim()
    ? allItems.filter(
        (item) =>
          item.title.toLowerCase().includes(query.toLowerCase()) ||
          item.description.toLowerCase().includes(query.toLowerCase()) ||
          item.path?.toLowerCase().includes(query.toLowerCase()) ||
          item.categoryTitle.toLowerCase().includes(query.toLowerCase())
      )
    : allItems.slice(0, 8);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 sm:pt-28 px-4 bg-[#1B222C]/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-[#9AA5B1]/30 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-[#E4E7EB] bg-[#F4F6F8]/60">
          <Search className="h-5 w-5 text-[#9AA5B1] mr-3 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search M&F documentation, guides, and API endpoints..."
            autoFocus
            className="w-full bg-transparent text-sm text-[#1B222C] placeholder-[#9AA5B1] focus:outline-none"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="p-1 text-[#6B7684] hover:text-[#1B222C] rounded-md"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-block ml-3 px-2 py-0.5 text-[10px] font-mono font-medium text-[#6B7684] bg-white border border-[#9AA5B1]/40 rounded shadow-2xs">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-2 divide-y divide-[#E4E7EB]">
          {filtered.length === 0 ? (
            <div className="p-8 text-center text-sm text-[#6B7684]">
              No documentation or API specifications matching &ldquo;{query}&rdquo;
            </div>
          ) : (
            filtered.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  onSelect(item.id);
                  onClose();
                }}
                className="w-full p-3 text-left rounded-xl hover:bg-[#F4F6F8] flex items-center justify-between group transition-colors cursor-pointer"
              >
                <div className="flex items-start gap-3 truncate">
                  <div className="p-2 rounded-lg bg-[#E4E7EB] group-hover:bg-[#1B222C] text-[#1B222C] group-hover:text-white transition-colors mt-0.5 shrink-0">
                    {item.method ? (
                      <Terminal className="h-4 w-4" />
                    ) : (
                      <FileText className="h-4 w-4" />
                    )}
                  </div>
                  <div className="truncate">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm text-[#1B222C] group-hover:text-[#1B222C] transition-colors">
                        {item.title}
                      </span>
                      {item.method && (
                        <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded bg-[#E4E7EB] text-[#1B222C] border border-[#9AA5B1]/40">
                          {item.method}
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-[#6B7684] truncate flex items-center gap-1.5 mt-0.5">
                      <span>{item.categoryTitle}</span>
                      {item.path && (
                        <>
                          <span>•</span>
                          <span className="font-mono text-[11px] text-[#3E4C59]">{item.path}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-[#9AA5B1] group-hover:text-[#1B222C] transition-colors shrink-0 ml-3" />
              </button>
            ))
          )}
        </div>

        {/* Search Footer */}
        <div className="px-4 py-2.5 bg-[#F4F6F8] border-t border-[#E4E7EB] flex items-center justify-between text-xs text-[#6B7684]">
          <span className="text-[11px]">M&amp;F Technologies API Reference Search</span>
          <div className="flex items-center gap-3 text-[11px]">
            <span>Navigation: Select or Enter</span>
          </div>
        </div>
      </div>
    </div>
  );
}
