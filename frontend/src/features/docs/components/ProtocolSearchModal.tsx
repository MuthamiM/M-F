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
        // toggle is handled by parent, but ensure ESC closes
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
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 sm:pt-28 px-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200/80 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-100 bg-slate-50/50">
          <Search className="h-5 w-5 text-slate-400 mr-3 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search documentation, guides, and API endpoints..."
            autoFocus
            className="w-full bg-transparent text-sm text-slate-900 placeholder-slate-400 focus:outline-none"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="p-1 text-slate-400 hover:text-slate-600 rounded-md"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-block ml-3 px-2 py-0.5 text-[10px] font-mono font-medium text-slate-400 bg-white border border-slate-200 rounded shadow-2xs">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-2 divide-y divide-slate-50">
          {filtered.length === 0 ? (
            <div className="p-8 text-center text-sm text-slate-500">
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
                className="w-full p-3 text-left rounded-xl hover:bg-slate-50 flex items-center justify-between group transition-colors cursor-pointer"
              >
                <div className="flex items-start gap-3 truncate">
                  <div className="p-2 rounded-lg bg-slate-100 group-hover:bg-emerald-50 text-slate-600 group-hover:text-emerald-600 transition-colors mt-0.5 shrink-0">
                    {item.method ? (
                      <Terminal className="h-4 w-4" />
                    ) : (
                      <FileText className="h-4 w-4" />
                    )}
                  </div>
                  <div className="truncate">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-slate-400">
                        {item.categoryTitle}
                      </span>
                      {item.method && (
                        <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-200/70 text-slate-700">
                          {item.method}
                        </span>
                      )}
                    </div>
                    <div className="text-sm font-semibold text-slate-900 group-hover:text-emerald-600 truncate transition-colors">
                      {item.title}
                    </div>
                    {item.path && (
                      <div className="text-xs font-mono text-slate-500 truncate">
                        {item.path}
                      </div>
                    )}
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-emerald-600 shrink-0 transition-colors ml-2" />
              </button>
            ))
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
          <span className="flex items-center gap-1.5">
            <span>Navigation:</span>
            <kbd className="px-1.5 py-0.5 bg-white border border-slate-200 rounded font-mono">↑</kbd>
            <kbd className="px-1.5 py-0.5 bg-white border border-slate-200 rounded font-mono">↓</kbd>
            <kbd className="px-1.5 py-0.5 bg-white border border-slate-200 rounded font-mono">↵</kbd>
          </span>
          <span>M&amp;F Protocol API v2.4</span>
        </div>
      </div>
      <div className="fixed inset-0 -z-10" onClick={onClose} />
    </div>
  );
}
