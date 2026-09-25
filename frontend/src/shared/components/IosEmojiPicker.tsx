"use client";

import React, { useState, useEffect, useRef } from "react";
import { Smile, Heart, Flame, ThumbsUp, Briefcase, Search, X, Sparkles, Coffee, Compass } from "lucide-react";

interface IosEmojiPickerProps {
  onSelect: (emoji: string) => void;
  onClose: () => void;
  position?: "top-left" | "top-right" | "bottom-left" | "bottom-right";
}

interface EmojiCategory {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  emojis: string[];
}

const QUICK_REACTIONS = ["❤️", "👍", "😂", "🔥", "🙏", "🎉", "👏", "😮"];

const EMOJI_CATEGORIES: EmojiCategory[] = [
  {
    id: "smileys",
    name: "Smileys & People",
    icon: Smile,
    emojis: [
      "😀", "😃", "😄", "😁", "😆", "😅", "🤣", "😂", "🙂", "🙃",
      "😉", "😊", "😇", "🥰", "😍", "🤩", "😘", "😗", "😚", "😋",
      "😛", "😜", "🤪", "😝", "🤑", "🤗", "🤭", "🤫", "🤔", "🤐",
      "🤨", "😐", "😑", "😶", "😏", "😒", "🙄", "😬", "😌", "😴",
      "😷", "🤒", "🤕", "🤢", "🤧", "🥵", "🥶", "🥴", "😵", "🤯",
      "🤠", "🥳", "😎", "🤓", "🧐"
    ],
  },
  {
    id: "gestures",
    name: "Hands & Gestures",
    icon: ThumbsUp,
    emojis: [
      "👍", "👎", "👏", "🙌", "👐", "🤲", "🤝", "👊", "✊", "🤛",
      "🤜", "🤞", "✌️", "🤟", "🤘", "👌", "🤌", "🤏", "👈", "👉",
      "👆", "👇", "☝️", "✋", "🤚", "🖐️", "🖖", "👋", "🤙", "💪",
      "🙏", "✍️", "🤳", "💅", "👀", "👁️", "🧠", "👤", "👥"
    ],
  },
  {
    id: "hearts",
    name: "Hearts & Emotions",
    icon: Heart,
    emojis: [
      "❤️", "🧡", "💛", "💚", "💙", "💜", "🖤", "🤍", "🤎", "💔",
      "❣️", "💕", "💞", "💓", "💗", "💖", "💘", "💝", "💟", "💯",
      "✨", "⭐", "🌟", "💫", "💥", "💢", "💬", "🗨️", "🗯️", "💭",
      "✅", "❌", "⚠️", "⛔", "🚫", "❓", "❗", "‼️", "ℹ️", "🆗"
    ],
  },
  {
    id: "popular",
    name: "Popular & Tech",
    icon: Flame,
    emojis: [
      "🔥", "🚀", "💡", "🎉", "🏆", "🎯", "💰", "💵", "💳", "📱",
      "💻", "🖥️", "⌨️", "🖱️", "📞", "📡", "🔋", "🔌", "🔒", "🔓",
      "🔑", "⚙️", "🛠️", "🔧", "📊", "📈", "📉", "🌐", "⚡", "☕"
    ],
  },
  {
    id: "food",
    name: "Food & Drinks",
    icon: Coffee,
    emojis: [
      "☕", "🍵", "🧃", "🥤", "🧋", "🍺", "🍻", "🥂", "🍷", "🍕",
      "🍔", "🍟", "🌭", "🍿", "🍩", "🍪", "🎂", "🍰", "🍫", "🍬",
      "🍎", "🍓", "🍉", "🍇", "🥑", "🥐", "🥪", "🌮", "🍣", "🍜"
    ],
  },
  {
    id: "travel",
    name: "Travel & Places",
    icon: Compass,
    emojis: [
      "✈️", "🚗", "🚕", "🚙", "🚌", "🚎", "🏎️", "🚓", "🚑", "🚒",
      "🚲", "🛵", "🏍️", "🚂", "🚆", "🚢", "⛵", "🚀", "🛸", "🚁",
      "🌍", "🌎", "🌏", "🗺️", "🏖️", "🏝️", "🏕️", "🏙️", "🏛️", "🏢"
    ],
  },
  {
    id: "objects",
    name: "Work & Objects",
    icon: Briefcase,
    emojis: [
      "📎", "📁", "📂", "📄", "📃", "📋", "📅", "📆", "📌", "📍",
      "🏷️", "📦", "📫", "📮", "✉️", "📧", "💼", "🏢", "🏦", "🏛️",
      "📷", "📸", "🎥", "🎬", "🎙️", "🔔", "🔕", "⏰", "⏱️", "⏳"
    ],
  },
];

// Helper to get Apple-style emoji image URL
export function getAppleEmojiUrl(emoji: string): string {
  return `https://emojicdn.elk.sh/${encodeURIComponent(emoji)}?style=apple`;
}

export function IosEmojiPicker({ onSelect, onClose, position = "top-right" }: IosEmojiPickerProps) {
  const [activeCategory, setActiveCategory] = useState<string>("smileys");
  const [search, setSearch] = useState<string>("");
  const pickerRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  const filteredEmojis = search.trim()
    ? EMOJI_CATEGORIES.flatMap((c) => c.emojis)
    : EMOJI_CATEGORIES.find((c) => c.id === activeCategory)?.emojis || [];

  const positionClass =
    position === "top-left"
      ? "bottom-full left-0 mb-2"
      : position === "top-right"
      ? "bottom-full right-0 mb-2"
      : position === "bottom-left"
      ? "top-full left-0 mt-2"
      : "top-full right-0 mt-2";

  return (
    <div
      ref={pickerRef}
      className={`absolute z-50 w-72 sm:w-84 bg-[#F2F2F7]/95 backdrop-blur-2xl border border-slate-300/70 rounded-3xl shadow-2xl p-3 flex flex-col gap-2 font-sans select-none animate-in fade-in zoom-in-95 duration-150 ${positionClass}`}
      style={{
        boxShadow: "0 24px 48px -12px rgba(0, 0, 0, 0.28), 0 0 0 1px rgba(255, 255, 255, 0.4) inset",
      }}
    >
      {/* iOS iMessage Quick Reactions Bar */}
      <div className="flex items-center justify-between px-1.5 py-1 bg-white/70 rounded-2xl border border-white/60 shadow-xs mb-1">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider pl-1">Quick</span>
        <div className="flex items-center gap-1">
          {QUICK_REACTIONS.map((emoji) => (
            <button
              key={emoji}
              type="button"
              onClick={() => onSelect(emoji)}
              className="h-7 w-7 flex items-center justify-center rounded-lg hover:bg-white active:scale-90 transition-all cursor-pointer"
              title={emoji}
            >
              <img
                src={getAppleEmojiUrl(emoji)}
                alt={emoji}
                className="h-5 w-5 object-contain pointer-events-none drop-shadow-xs"
                loading="eager"
                onError={(e) => {
                  (e.currentTarget as HTMLElement).style.display = "none";
                  if (e.currentTarget.nextElementSibling) {
                    (e.currentTarget.nextElementSibling as HTMLElement).style.display = "inline";
                  }
                }}
              />
              <span style={{ display: "none" }} className="text-base leading-none">
                {emoji}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Header with Search and Close */}
      <div className="flex items-center justify-between gap-2 px-1">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search Apple Emojis..."
            className="w-full pl-8 pr-3 py-1.5 bg-white/80 rounded-xl text-xs text-[#1B222C] placeholder-slate-400 focus:outline-none focus:ring-1.5 focus:ring-[#007AFF] border border-slate-200/60 shadow-inner transition-all"
            autoFocus
          />
        </div>
        <button
          type="button"
          onClick={onClose}
          className="p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-white/80 transition-colors cursor-pointer"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Apple Emojis Grid */}
      <div className="h-48 overflow-y-auto pr-1 grid grid-cols-7 sm:grid-cols-8 gap-1.5 scrollbar-thin scrollbar-thumb-slate-300">
        {filteredEmojis.map((emoji, idx) => (
          <button
            key={`${emoji}-${idx}`}
            type="button"
            onClick={() => onSelect(emoji)}
            className="h-8 w-8 flex items-center justify-center rounded-xl hover:bg-white/90 hover:scale-110 active:scale-95 transition-all cursor-pointer p-0.5"
          >
            <img
              src={getAppleEmojiUrl(emoji)}
              alt={emoji}
              className="h-6 w-6 object-contain pointer-events-none drop-shadow-xs"
              loading="lazy"
              onError={(e) => {
                (e.currentTarget as HTMLElement).style.display = "none";
                if (e.currentTarget.nextElementSibling) {
                  (e.currentTarget.nextElementSibling as HTMLElement).style.display = "inline";
                }
              }}
            />
            <span style={{ display: "none" }} className="text-xl leading-none">
              {emoji}
            </span>
          </button>
        ))}
      </div>

      {/* iOS Category Navigation Bar */}
      {!search.trim() && (
        <div className="flex items-center justify-around pt-2 border-t border-slate-200/70">
          {EMOJI_CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategory(cat.id)}
                title={cat.name}
                className={`p-1.5 rounded-xl transition-all cursor-pointer ${
                  isActive
                    ? "bg-[#007AFF] text-white shadow-xs scale-105"
                    : "text-slate-400 hover:text-slate-700 hover:bg-white/70"
                }`}
              >
                <Icon className="h-4 w-4" />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
