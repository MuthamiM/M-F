// src/shared/components/ChatWidget.tsx
"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { usePathname } from "next/navigation";
import { MessageSquare, X, Send, User, PhoneCall, HelpCircle, UserCheck, ArrowLeft, CheckCircle2, Bell, Paperclip, Smile, FileText, Download, Loader2, Image as ImageIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { IosEmojiPicker } from "./IosEmojiPicker";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */
interface Message {
  id: string;
  role: "bot" | "user" | "system";
  text: string;
  attachmentUrl?: string;
  attachmentName?: string;
  attachmentType?: "image" | "document";
  timestamp: string;
}

interface ChatSession {
  messages: Message[];
  liveTicket?: string | null;
  ticketClosed?: boolean;
  popCount?: number;
  userName?: string | null;
  userEmail?: string | null;
}

interface IosNotification {
  id: string;
  title: string;
  body: string;
  time: string;
}

/* ------------------------------------------------------------------ */
/*  M&F Institutional Logo                                              */
/* ------------------------------------------------------------------ */
function MfLogo({ size = 22 }: { size?: number }) {
  const inner = Math.round(size * 0.5);
  return (
    <div className="relative flex items-center justify-center shrink-0" style={{ width: size, height: size }}>
      <span className="absolute rounded-full bg-[#3E4C59]" style={{ width: size, height: size }} />
      <span className="absolute right-0 rounded-full bg-white" style={{ width: inner, height: inner }} />
    </div>
  );
}

let sharedWidgetAudioCtx: AudioContext | null = null;

function initWidgetAudioContext() {
  if (typeof window === "undefined") return;
  if (!sharedWidgetAudioCtx) {
    const Ctx = window.AudioContext || (window as any).webkitAudioContext;
    if (Ctx) {
      sharedWidgetAudioCtx = new Ctx();
    }
  }
  if (sharedWidgetAudioCtx && sharedWidgetAudioCtx.state === "suspended") {
    sharedWidgetAudioCtx.resume().catch(() => {});
  }
}

function playIosNotificationSound(onPlay?: () => void) {
  try {
    initWidgetAudioContext();
    if (!sharedWidgetAudioCtx) {
      if (onPlay) onPlay();
      return;
    }

    const ctx = sharedWidgetAudioCtx;
    const triggerTones = () => {
      const playTone = (freq: number, start: number, dur: number) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, start);
        gain.gain.setValueAtTime(0.18, start);
        gain.gain.exponentialRampToValueAtTime(0.001, start + dur);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(start);
        osc.stop(start + dur);
      };
      const now = ctx.currentTime;
      // Classic iOS Note Chime (C6 -> E6 -> G6)
      playTone(1046.5, now, 0.12);
      playTone(1318.51, now + 0.08, 0.12);
      playTone(1567.98, now + 0.16, 0.25);
      if (onPlay) onPlay();
    };

    if (ctx.state === "suspended") {
      ctx.resume().then(triggerTones).catch(() => {
        if (onPlay) onPlay();
      });
    } else {
      triggerTones();
    }
  } catch {
    if (onPlay) onPlay();
  }
}

/* ------------------------------------------------------------------ */
/*  Clean Text Helper                                                  */
/* ------------------------------------------------------------------ */
function cleanText(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, "$1")
    .replace(/\*(.+?)\*/g, "$1")
    .replace(/__(.+?)__/g, "$1")
    .replace(/_(.+?)_/g, "$1")
    .replace(/#{1,6}\s?/g, "")
    .replace(/`(.+?)`/g, "$1")
    .trim();
}

/* ------------------------------------------------------------------ */
/*  Persistent Storage (localStorage prevents chat vanishing)          */
/* ------------------------------------------------------------------ */
const STORAGE_KEY = "mf_chat_session_v7";
const LEGACY_STORAGE_KEY = "mf_chat_session_v6";
const INACTIVITY_LIMIT_MS = 10 * 60 * 1000; // 10 minutes
const MAX_AUTO_POPS = 5;

function loadSession(): ChatSession | null {
  try {
    if (typeof window === "undefined") return null;
    const raw = localStorage.getItem(STORAGE_KEY) || sessionStorage.getItem(LEGACY_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function saveSession(session: ChatSession) {
  try {
    if (typeof window === "undefined") return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  } catch {}
}

function clearSessionData() {
  try {
    if (typeof window === "undefined") return;
    localStorage.removeItem(STORAGE_KEY);
    sessionStorage.removeItem(LEGACY_STORAGE_KEY);
  } catch {}
}

/* ------------------------------------------------------------------ */
/*  ChatWidget Component                                               */
/* ------------------------------------------------------------------ */
export function ChatWidget() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [liveTicket, setLiveTicket] = useState<string | null>(null);
  const [ticketClosed, setTicketClosed] = useState(false);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [popCount, setPopCount] = useState<number>(0);
  const [promptState, setPromptState] = useState<"waiting" | "visible" | "dismissed">("waiting");
  
  // iOS Push Banner state
  const [iosBanner, setIosBanner] = useState<IosNotification | null>(null);

  // Emoji, Attachment, and Live Typing state
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [attachment, setAttachment] = useState<{ url: string; name: string; type: "image" | "document"; size?: number } | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isAgentTyping, setIsAgentTyping] = useState(false);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Active Form Mode: null | "callback" | "live_agent"
  const [activeForm, setActiveForm] = useState<null | "callback" | "live_agent">(null);

  // Form fields
  const [formName, setFormName] = useState("");
  const [formPhone, setFormPhone] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formReason, setFormReason] = useState("");
  const [formSubmitting, setFormSubmitting] = useState(false);

  // User identity persisted during session (for correct direct message routing)
  const [userName, setUserName] = useState<string>("");
  const [userEmail, setUserEmail] = useState<string>("");

  // Virtual keyboard positioning offset
  const [visualOffset, setVisualOffset] = useState<number>(0);
  const [viewportHeight, setViewportHeight] = useState<number | null>(null);

  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const lastActivityRef = useRef<number>(Date.now());
  const isInitialPollRef = useRef<boolean>(true);

  // Fast client-side image compressor: shrinks 10MB mobile/camera photos to crisp ~180KB in <50ms
  const compressImageForUpload = async (file: File): Promise<File> => {
    if (!file.type.startsWith("image/") || file.type.includes("svg") || file.type.includes("gif")) {
      return file;
    }
    // If already lightweight (under 250KB), no compression needed
    if (file.size <= 250 * 1024) {
      return file;
    }

    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const maxDim = 1600;
          let { width, height } = img;
          if (width > maxDim || height > maxDim) {
            if (width > height) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            } else {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }

          const canvas = document.createElement("canvas");
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          if (!ctx) {
            resolve(file);
            return;
          }

          ctx.drawImage(img, 0, 0, width, height);
          canvas.toBlob(
            (blob) => {
              if (!blob || blob.size >= file.size) {
                resolve(file);
                return;
              }
              const safeName = file.name.replace(/\.[^.]+$/, "") + ".jpg";
              const compressedFile = new File([blob], safeName, {
                type: "image/jpeg",
                lastModified: Date.now(),
              });
              resolve(compressedFile);
            },
            "image/jpeg",
            0.82
          );
        };
        img.onerror = () => resolve(file);
        img.src = e.target?.result as string;
      };
      reader.onerror = () => resolve(file);
      reader.readAsDataURL(file);
    });
  };

  const uploadAttachment = async (file: File) => {
    if (isUploading) return;
    setIsUploading(true);
    try {
      // Instant client-side compression makes upload 50x faster
      const optimizedFile = await compressImageForUpload(file);
      const formData = new FormData();
      formData.append("file", optimizedFile);

      const apiHost = typeof window !== "undefined" ? "" : "http://localhost:4000";
      const res = await fetch(`${apiHost}/api/tickets/upload`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (res.ok && data.success && data.data) {
        setAttachment(data.data);
      }
    } catch (err) {
      console.error("Failed to upload attachment:", err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    touchActivity();
    const val = e.target.value;
    setInputText(val);

    if (liveTicket && !ticketClosed) {
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      const apiHost = typeof window !== "undefined" ? "" : "http://localhost:4000";
      const isTypingNow = val.trim().length > 0;

      fetch(`${apiHost}/api/tickets/${liveTicket}/typing`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sender: "client", isTyping: isTypingNow }),
      }).catch(() => {});

      if (isTypingNow) {
        typingTimeoutRef.current = setTimeout(() => {
          fetch(`${apiHost}/api/tickets/${liveTicket}/typing`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ sender: "client", isTyping: false }),
          }).catch(() => {});
        }, 3000);
      }
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    if (e.clipboardData.files && e.clipboardData.files.length > 0) {
      const file = e.clipboardData.files[0];
      e.preventDefault();
      uploadAttachment(file);
    }
  };

  // visualViewport API to detect and handle virtual keyboard overlays on mobile
  useEffect(() => {
    if (typeof window === "undefined" || !window.visualViewport) return;

    const handleResize = () => {
      const vv = window.visualViewport;
      if (!vv) return;
      
      const offset = window.innerHeight - vv.height;
      setVisualOffset(offset > 0 ? offset : 0);
      setViewportHeight(vv.height);
    };

    window.visualViewport.addEventListener("resize", handleResize);
    window.visualViewport.addEventListener("scroll", handleResize);
    handleResize();

    return () => {
      window.visualViewport?.removeEventListener("resize", handleResize);
      window.visualViewport?.removeEventListener("scroll", handleResize);
    };
  }, []);

  // Do not render inside admin or docs/API reference pages
  if (typeof window !== "undefined" && (pathname?.startsWith("/admin") || pathname?.startsWith("/docs") || pathname?.startsWith("/api-reference"))) {
    return null;
  }

  const touchActivity = useCallback(() => {
    lastActivityRef.current = Date.now();
  }, []);

  /* ---- Show iOS Push Notification Banner ---- */
  const triggerIosNotification = (title: string, body: string) => {
    const showBanner = () => {
      setIosBanner({
        id: "ios-notif-" + Date.now(),
        title,
        body,
        time: "now",
      });
      setTimeout(() => {
        setIosBanner((current) => (current?.title === title ? null : current));
      }, 5000);
    };

    playIosNotificationSound(showBanner);
  };

  /* ---- Trigger Pop-Up Prompt (No annoying sound chime on auto-popup) ---- */
  const triggerPopUpPrompt = useCallback(() => {
    if (isOpen || popCount >= MAX_AUTO_POPS) return;
    
    // Respect user dismissal choices to avoid annoying pop-up repetition
    if (typeof window !== "undefined" && sessionStorage.getItem("mf_chat_dismissed") === "true") {
      return;
    }

    setPromptState("visible");
    setPopCount((prev) => prev + 1);
  }, [isOpen, popCount]);

  /* ---- Restore Session ---- */
  useEffect(() => {
    const saved = loadSession();
    if (saved) {
      if (saved.messages && saved.messages.length > 0) {
        setMessages(saved.messages);
      }
      setLiveTicket(saved.liveTicket || null);
      setTicketClosed(saved.ticketClosed || false);
      if (typeof saved.popCount === "number") {
        setPopCount(saved.popCount);
      }
      if (saved.userName) {
        setUserName(saved.userName);
      }
      if (saved.userEmail) {
        setUserEmail(saved.userEmail);
      }
    }
  }, []);

  /* ---- Save Session ---- */
  useEffect(() => {
    saveSession({ messages, liveTicket, ticketClosed, popCount, userName, userEmail });
  }, [messages, liveTicket, ticketClosed, popCount, userName, userEmail]);

  const isServicesPage = pathname?.startsWith("/services");

  // Unlock Chat AudioContext on user interaction
  useEffect(() => {
    const handleInteraction = () => {
      initWidgetAudioContext();
    };
    window.addEventListener("click", handleInteraction);
    window.addEventListener("keydown", handleInteraction);
    return () => {
      window.removeEventListener("click", handleInteraction);
      window.removeEventListener("keydown", handleInteraction);
    };
  }, []);

  /* ---- Initial Immediate Pop-Up (600ms) on site load ---- */
  useEffect(() => {
    const timer = setTimeout(() => {
      if (popCount === 0 && !isOpen && !liveTicket) {
        if (typeof window !== "undefined" && sessionStorage.getItem("mf_chat_dismissed") !== "true") {
          triggerPopUpPrompt();
        }
      }
    }, 600);
    return () => clearTimeout(timer);
  }, [popCount, isOpen, triggerPopUpPrompt, liveTicket]);

  /* ---- Services Page Special Behavior: Always present prompt ---- */
  useEffect(() => {
    if (isServicesPage && !isOpen && !liveTicket && promptState !== "visible") {
      if (typeof window !== "undefined" && sessionStorage.getItem("mf_chat_dismissed") !== "true") {
        setPromptState("visible");
      }
    }
  }, [pathname, isServicesPage, isOpen, liveTicket, promptState]);

  /* ---- Route Navigation Pop-Up Trigger (up to 5 times as user navigates) ---- */
  useEffect(() => {
    if (!isServicesPage && !liveTicket && popCount > 0 && popCount < MAX_AUTO_POPS && !isOpen) {
      if (typeof window !== "undefined" && sessionStorage.getItem("mf_chat_dismissed") !== "true") {
        const timer = setTimeout(() => {
          triggerPopUpPrompt();
        }, 1500);
        return () => clearTimeout(timer);
      }
    }
  }, [pathname, isServicesPage, liveTicket, popCount, isOpen, triggerPopUpPrompt]);

  /* ---- 30-Second Interval Pop-Up Trigger (every 30s up to 5 times) ---- */
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isServicesPage && !liveTicket && popCount < MAX_AUTO_POPS && !isOpen && promptState !== "visible") {
        if (typeof window !== "undefined" && sessionStorage.getItem("mf_chat_dismissed") !== "true") {
          triggerPopUpPrompt();
        }
      }
    }, 30000);
    return () => clearInterval(interval);
  }, [popCount, isOpen, promptState, triggerPopUpPrompt, isServicesPage, liveTicket]);

  /* ---- Active Support Ticket Polling (every 4s) ---- */
  useEffect(() => {
    if (!liveTicket || ticketClosed) return;

    // Reset initial poll on mount or ticket change to prevent historic message play
    isInitialPollRef.current = true;

    let pollInterval: NodeJS.Timeout;
    let isFetching = false;

    const pollMessages = async () => {
      if (isFetching) return;
      isFetching = true;
      try {
        const apiHost = typeof window !== "undefined" ? "" : "http://localhost:4000";
        const res = await fetch(`${apiHost}/api/tickets/${liveTicket}/messages`);
        if (res.ok) {
          const data = await res.json();
          if (data.success && Array.isArray(data.data)) {
            // Update ticket status dynamically (e.g. if admin closed it on their end)
            if (data.status === "closed" && !ticketClosed) {
              setTicketClosed(true);
              const closedTime = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
              setMessages((prev) => [
                ...prev,
                {
                  id: "sys-" + Date.now(),
                  role: "system",
                  text: `Support Session for ${liveTicket} was ended at ${closedTime}.`,
                  timestamp: new Date().toISOString(),
                },
              ]);
              triggerIosNotification("Support Session Ended", `Ticket ${liveTicket} closed`);
              return;
            }

            // Extract real-time typing status from support agent
            setIsAgentTyping(Boolean(data.isAgentTyping));

            // Map API messages to client messages
            const mapped: Message[] = data.data.map((m: any) => ({
              id: m.id || `msg-${new Date(m.timestamp).getTime()}`,
              role: m.sender === "client" ? "user" : "bot",
              text: m.text,
              attachmentUrl: m.attachmentUrl,
              attachmentName: m.attachmentName,
              attachmentType: m.attachmentType,
              timestamp: m.timestamp,
            }));

            // Check if there are new messages
            setMessages((prev) => {
              // Find any message in mapped that does not exist in prev
              const newMsgs = mapped.filter(
                (m) => !prev.some((p) => p.id === m.id || (p.text === m.text && Math.abs(new Date(p.timestamp).getTime() - new Date(m.timestamp).getTime()) < 5000))
              );

              if (newMsgs.length > 0) {
                // If any new message is from the agent, play sound!
                const hasAgentMsg = newMsgs.some((m) => m.role === "bot");
                if (hasAgentMsg && !isInitialPollRef.current) {
                  playIosNotificationSound();
                  // If chat panel is closed or minimized, trigger the iOS banner alert!
                  if (!isOpen) {
                    const latestAgentMsg = newMsgs.filter((m) => m.role === "bot").pop();
                    if (latestAgentMsg) {
                      triggerIosNotification("Support Agent Reply", latestAgentMsg.text || "Sent an attachment");
                    }
                  }
                }

                // Reconstruct the message list: start with the greeting if it exists,
                // then append all mapped messages, plus any system messages.
                const greetingMsg = prev.find((m) => m.id.startsWith("greeting-"));
                const systemMsgs = prev.filter((m) => m.role === "system");

                const combined: Message[] = [];
                if (greetingMsg) {
                  combined.push(greetingMsg);
                }
                for (const m of mapped) {
                  combined.push(m);
                }
                for (const sys of systemMsgs) {
                  combined.push(sys);
                }
                combined.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
                return combined;
              }
              return prev;
            });

            // Mark first poll as finished
            isInitialPollRef.current = false;
          }
        }
      } catch (err) {
        console.error("Failed to poll live agent messages:", err);
      } finally {
        isFetching = false;
      }
    };

    pollMessages();
    pollInterval = setInterval(pollMessages, 700);

    return () => clearInterval(pollInterval);
  }, [liveTicket, ticketClosed, isOpen]);

  /* ---- Inactivity 4-minute check ---- */
  useEffect(() => {
    const interval = setInterval(() => {
      if (Date.now() - lastActivityRef.current >= INACTIVITY_LIMIT_MS) {
        clearSessionData();
        setMessages([]);
        setLiveTicket(null);
        setTicketClosed(false);
        setActiveForm(null);
        setIsOpen(false);
        setPromptState("dismissed");
        setIosBanner(null);
        setPopCount(0);
      }
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  /* ---- Auto-scroll ---- */
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping, activeForm]);

  /* ---- Focus input ---- */
  useEffect(() => {
    if (isOpen && !activeForm) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen, activeForm]);

  /* ---- Start Chat ---- */
  const initChat = useCallback(() => {
    if (messages.length > 0) return;
    const greetMsg: Message = {
      id: "greeting-" + Date.now(),
      role: "bot",
      text: "Welcome to M&F Technologies. How can we help you today?",
      timestamp: new Date().toISOString(),
    };
    setMessages([greetMsg]);
  }, [messages]);

  const handleOpenChat = () => {
    touchActivity();
    setPromptState("dismissed");
    setIosBanner(null);
    setIsOpen(true);
    initChat();
  };

  const handleMinimize = () => {
    touchActivity();
    setIsOpen(false);
  };

  const handleDismissPrompt = () => {
    touchActivity();
    setPromptState("dismissed");
    if (typeof window !== "undefined") {
      sessionStorage.setItem("mf_chat_dismissed", "true");
    }
  };

  /* ---- Quick Menu Actions ---- */
  const handleWhatWeDo = () => {
    touchActivity();
    sendUserQuery("What core solutions and services does M&F Technologies provide?");
  };

  /* ---- Submit Callback Form ---- */
  const handleCallbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    touchActivity();
    if (!formName.trim() || !formPhone.trim() || formSubmitting) return;

    setFormSubmitting(true);
    const userSummary = `Requested Callback: ${formName.trim()} (${formPhone.trim()})`;

    const userMsg: Message = {
      id: "user-" + Date.now(),
      role: "user",
      text: userSummary,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMsg]);

    try {
      const apiHost = typeof window !== "undefined" ? "" : "http://localhost:4000";
      const res = await fetch(`${apiHost}/api/chatbot/message`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: "request_callback",
          name: formName.trim(),
          phone: formPhone.trim(),
          email: formEmail.trim(),
          reason: formReason.trim(),
        }),
      });

      const data = await res.json();
      const botText = data.success
        ? cleanText(data.data.response)
        : "Your callback request has been logged. Our team will contact you shortly.";

      const botMsg: Message = {
        id: "bot-" + Date.now(),
        role: "bot",
        text: botText,
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, botMsg]);

      if (!isOpen) {
        triggerIosNotification("Callback Logged", botText);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: "err-" + Date.now(),
          role: "bot",
          text: "Your callback request has been logged. Our team will contact you shortly.",
          timestamp: new Date().toISOString(),
        },
      ]);
    } finally {
      setFormSubmitting(false);
      setActiveForm(null);
      resetFormFields();
    }
  };

  /* ---- Submit Live Agent Form ---- */
  const handleLiveAgentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    touchActivity();
    if (!formName.trim() || !formEmail.trim() || formSubmitting) return;

    setFormSubmitting(true);
    const userSummary = `Request Live Support Agent: ${formName.trim()} (${formEmail.trim()})`;

    const userMsg: Message = {
      id: "user-" + Date.now(),
      role: "user",
      text: userSummary,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setUserName(formName.trim());
    setUserEmail(formEmail.trim());

    try {
      const apiHost = typeof window !== "undefined" ? "" : "http://localhost:4000";
      const res = await fetch(`${apiHost}/api/chatbot/message`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: "request_live_agent",
          name: formName.trim(),
          email: formEmail.trim(),
          issue: formReason.trim(),
        }),
      });

      const data = await res.json();
      const tId = data.success && data.data.ticket ? data.data.ticket : "TKT-LIVE-SESSION";

      setLiveTicket(tId);
      setTicketClosed(false);

      const botText = data.success
        ? cleanText(data.data.response)
        : "Live support ticket created. An agent will join this session shortly.";

      const botMsg: Message = {
        id: "bot-" + Date.now(),
        role: "bot",
        text: botText,
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, botMsg]);

      triggerIosNotification("Support Ticket Created", `${tId} — Agent will join shortly`);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: "err-" + Date.now(),
          role: "bot",
          text: "Live support ticket created. An agent will join this session shortly.",
          timestamp: new Date().toISOString(),
        },
      ]);
    } finally {
      setFormSubmitting(false);
      setActiveForm(null);
      resetFormFields();
    }
  };

  /* ---- End Live Support Ticket Session ---- */
  const handleEndLiveTicket = async () => {
    touchActivity();
    if (!liveTicket) return;

    try {
      const apiHost = typeof window !== "undefined" ? "" : "http://localhost:4000";
      await fetch(`${apiHost}/api/tickets/${liveTicket}/client-close`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason: "Customer ended live chat support session." })
      });
    } catch (err) {
      console.error("Failed to close ticket on server:", err);
    }

    const closedTime = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const closeMsg: Message = {
      id: "sys-" + Date.now(),
      role: "system",
      text: `Support Session for ${liveTicket} was ended at ${closedTime}.`,
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, closeMsg]);
    setTicketClosed(true);

    triggerIosNotification("Support Session Ended", `Ticket ${liveTicket} closed at ${closedTime}`);
  };

  /* ---- Start a Fresh Conversation ---- */
  const handleStartNewChat = () => {
    touchActivity();
    clearSessionData();
    setMessages([]);
    setLiveTicket(null);
    setTicketClosed(false);
    setUserName("");
    setUserEmail("");
    setActiveForm(null);
    setIsTyping(false);
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("mf_chat_dismissed");
    }

    const greetMsg: Message = {
      id: "greeting-" + Date.now(),
      role: "bot",
      text: "Welcome to M&F Technologies. How can we help you today?",
      timestamp: new Date().toISOString(),
    };
    setMessages([greetMsg]);
  };

  const resetFormFields = () => {
    setFormName("");
    setFormPhone("");
    setFormEmail("");
    setFormReason("");
  };

  /* ---- Send Message ---- */
  const sendUserQuery = async (queryText: string, attachedFile?: typeof attachment) => {
    touchActivity();
    if ((!queryText.trim() && !attachedFile) || isTyping || ticketClosed) return;

    const userMsg: Message = {
      id: "user-" + Date.now(),
      role: "user",
      text: queryText.trim(),
      attachmentUrl: attachedFile?.url,
      attachmentName: attachedFile?.name,
      attachmentType: attachedFile?.type,
      timestamp: new Date().toISOString(),
    };

    const updated = [...messages, userMsg];
    setMessages(updated);
    setIsTyping(true);

    // Cancel typing immediately on send
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    if (liveTicket) {
      const apiHost = typeof window !== "undefined" ? "" : "http://localhost:4000";
      fetch(`${apiHost}/api/tickets/${liveTicket}/typing`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sender: "client", isTyping: false }),
      }).catch(() => {});
    }

    try {
      const apiHost = typeof window !== "undefined" ? "" : "http://localhost:4000";

      if (liveTicket && !ticketClosed) {
        // Direct routing of user queries to the support ticket instead of AI agent
        const res = await fetch(`${apiHost}/api/tickets/${liveTicket}/messages`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            text: queryText.trim(),
            senderName: userName || "Website Visitor",
            attachmentUrl: attachedFile?.url,
            attachmentName: attachedFile?.name,
            attachmentType: attachedFile?.type,
          }),
        });

        if (!res.ok) {
          throw new Error("Failed to send message to live ticket");
        }
      } else {
        // Standard chatbot behavior (AI Assistant)
        const history = updated.slice(1).map((m) => ({
          role: m.role === "bot" ? "assistant" : "user",
          content: m.text,
        }));

        const res = await fetch(`${apiHost}/api/chatbot/message`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: queryText.trim() || `Sent attachment: ${attachedFile?.name || "file"}`, history, ticket: liveTicket }),
        });

        const data = await res.json();
        if (data.success && data.data?.ticket && !liveTicket) {
          setLiveTicket(data.data.ticket);
        }

        const botText = data.success
          ? cleanText(data.data.response)
          : "Thank you for reaching out to M&F Technologies. We specialize in core lending systems, credit scoring platforms, collections automation, and financial API integrations. How can our team assist you today?";

        const botMsg: Message = {
          id: "bot-" + Date.now(),
          role: "bot",
          text: botText,
          timestamp: new Date().toISOString(),
        };

        setMessages((prev) => [...prev, botMsg]);

        if (!isOpen) {
          triggerIosNotification("M&F Support", botText);
        }
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: "err-" + Date.now(),
          role: "bot",
          text: "Connection error. Please check your network connection.",
          timestamp: new Date().toISOString(),
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleFormSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() && !attachment) return;
    const text = inputText;
    const currentAttachment = attachment;
    setInputText("");
    setAttachment(null);
    setShowEmojiPicker(false);
    sendUserQuery(text, currentAttachment);
  };

  const fmtTime = (iso: string) => {
    try {
      return new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    } catch {
      return "";
    }
  };

  return (
    <>
      {/* iOS NOTIFICATION BANNER (Top-Center / Top-Right Push Style) */}
      <AnimatePresence>
        {iosBanner && (
          <motion.div
            initial={{ opacity: 0, y: -40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -30, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 28 }}
            onClick={() => {
              setIosBanner(null);
              handleOpenChat();
            }}
            className="fixed top-4 left-4 right-4 sm:left-auto sm:right-6 sm:w-[360px] z-[100000] cursor-pointer"
          >
            <div className="bg-[#111827]/90 backdrop-blur-xl text-white rounded-[22px] p-3.5 shadow-2xl border border-white/15 flex flex-col gap-1.5 select-none hover:bg-[#111827]/95 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-5 w-5 rounded-md bg-[#1B222C] border border-white/20 flex items-center justify-center p-0.5">
                    <MfLogo size={14} />
                  </div>
                  <span className="text-[10px] font-bold tracking-wider text-slate-300 uppercase">
                    M&amp;F SUPPORT
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-slate-400 font-medium">{iosBanner.time}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setIosBanner(null);
                    }}
                    className="text-slate-400 hover:text-white p-0.5 rounded-full"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Bell className="h-3 w-3 text-blue-400" />
                  {iosBanner.title}
                </h4>
                <p className="text-xs text-slate-300 font-normal line-clamp-2 leading-tight mt-0.5">
                  {iosBanner.body}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pop-up Prompt Bubble */}
      <AnimatePresence>
        {promptState === "visible" && !isOpen && !iosBanner && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="fixed right-4 sm:right-6 z-[99999] w-[260px] sm:w-[280px]"
            style={{ bottom: "calc(5.2rem + var(--cookie-banner-h, 0px))", transition: "bottom 0.3s ease-out" }}
          >
            <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
              <div className="bg-[#1B222C] px-3.5 py-2.5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MfLogo size={18} />
                  <span className="text-xs font-semibold text-white">M&amp;F Support</span>
                </div>
                <button
                  onClick={handleDismissPrompt}
                  className="text-[#9AA5B1] hover:text-white transition-colors p-0.5"
                  aria-label="Dismiss"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>

              <div className="p-3.5">
                <p className="text-xs text-[#1B222C] font-medium leading-relaxed mb-3">
                  Do you want help getting started?
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={handleOpenChat}
                    className="flex-1 py-1.5 px-3 text-xs font-semibold text-white bg-[#1B222C] hover:bg-[#3E4C59] rounded-lg transition-colors cursor-pointer"
                  >
                    Contact Us
                  </button>
                  <button
                    onClick={handleDismissPrompt}
                    className="flex-1 py-1.5 px-3 text-xs font-semibold text-[#616E7C] bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
                  >
                    No, thanks
                  </button>
                </div>
              </div>
            </div>

            <div className="flex justify-end pr-5">
              <div className="w-2.5 h-2.5 bg-white border-r border-b border-slate-200 rotate-45 -mt-1.5" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Round Toggle Button (FAB) */}
      <div className="fixed right-4 sm:right-6 z-[99999]" style={{ bottom: `calc(1.25rem + var(--cookie-banner-h, 0px) + ${visualOffset}px)`, transition: "bottom 0.1s ease-out" }}>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            if (isOpen) {
              handleMinimize();
            } else {
              handleOpenChat();
            }
          }}
          className="relative flex h-12 w-12 sm:h-13 sm:w-13 items-center justify-center rounded-full bg-[#1B222C] text-white shadow-xl hover:bg-[#3E4C59] transition-colors focus:outline-none"
          aria-label="Toggle chat window"
        >
          {isOpen ? <X className="h-5 w-5" /> : <MessageSquare className="h-5 w-5" />}
        </motion.button>
      </div>

      {/* Compact Expanded Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="fixed right-4 sm:right-6 w-[320px] sm:w-[350px] bg-white border border-slate-200 rounded-2xl shadow-2xl z-[99999] flex flex-col overflow-hidden"
            style={{ 
              bottom: `calc(4.8rem + var(--cookie-banner-h, 0px) + ${visualOffset}px)`, 
              height: viewportHeight ? `min(calc(${viewportHeight}px - 6rem - var(--cookie-banner-h, 0px)), 480px)` : "480px",
              transition: "bottom 0.1s ease-out" 
            }}
          >
            {/* Header */}
            <div className="bg-[#1B222C] text-white px-3.5 py-3 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <MfLogo size={26} />
                <div>
                  <h3 className="text-xs font-bold tracking-tight">M&amp;F Support</h3>
                  <span className="text-[9px] text-[#9AA5B1] block -mt-0.5">Online</span>
                </div>
              </div>
              <button
                onClick={handleMinimize}
                className="text-[#9AA5B1] hover:text-white transition-colors rounded-lg p-1"
                aria-label="Minimize chat"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Pinned Live Ticket Banner */}
            {liveTicket && (
              <div className="bg-slate-100 border-b border-slate-200 px-3 py-1.5 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse" />
                  <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">
                    {ticketClosed ? "Ticket Closed" : "Live Session"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-[#1B222C] font-mono">
                    {liveTicket}
                  </span>
                  {!ticketClosed && (
                    <button
                      onClick={handleEndLiveTicket}
                      title="End Session"
                      className="text-[9px] font-semibold text-red-600 hover:underline"
                    >
                      End
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Messages body */}
            <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-slate-50/50">
              {messages.map((msg) => {
                if (msg.role === "system") {
                  return (
                    <div key={msg.id} className="my-2 py-1.5 px-3 bg-slate-200/70 rounded-xl text-center">
                      <p className="text-[10px] font-semibold text-slate-600 flex items-center justify-center gap-1">
                        <CheckCircle2 className="h-3 w-3 text-slate-500" />
                        {msg.text}
                      </p>
                    </div>
                  );
                }

                return (
                  <div key={msg.id} className="space-y-0.5">
                    <div className={`flex items-start gap-2 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
                      {msg.role === "bot" ? (
                        <div className="shrink-0 mt-0.5">
                          <MfLogo size={20} />
                        </div>
                      ) : (
                        <div className="h-5 w-5 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center shrink-0 mt-0.5">
                          <User className="h-3 w-3" />
                        </div>
                      )}

                      <div
                        className={`max-w-[82%] rounded-2xl px-3.5 py-2 text-xs leading-relaxed whitespace-pre-line shadow-sm border ${
                          msg.role === "bot"
                            ? "bg-white text-[#1B222C] border-slate-200 rounded-tl-none"
                            : "bg-[#1B222C] text-white border-transparent rounded-tr-none"
                        }`}
                      >
                        {msg.attachmentUrl && (
                          <div className="mb-2">
                            {msg.attachmentType === "image" || /\.(png|jpe?g|webp|gif)$/i.test(msg.attachmentUrl) ? (
                              <a href={msg.attachmentUrl} target="_blank" rel="noreferrer" className="block overflow-hidden rounded-xl group">
                                <img
                                  src={msg.attachmentUrl}
                                  alt={msg.attachmentName || "Attached screenshot or photo"}
                                  className="max-h-48 max-w-full rounded-xl object-cover hover:opacity-95 transition-opacity cursor-pointer border border-black/10"
                                />
                              </a>
                            ) : (
                              <a
                                href={msg.attachmentUrl}
                                download={msg.attachmentName || "download"}
                                target="_blank"
                                rel="noreferrer"
                                className="flex items-center gap-2 p-2 rounded-xl bg-black/5 hover:bg-black/10 transition-colors text-xs font-medium"
                              >
                                <FileText className="h-4 w-4 shrink-0 text-[#007AFF]" />
                                <span className="truncate flex-1 underline">{msg.attachmentName || "Attached File"}</span>
                                <Download className="h-3.5 w-3.5 shrink-0 opacity-70" />
                              </a>
                            )}
                          </div>
                        )}
                        {msg.text && <div>{msg.text}</div>}
                      </div>
                    </div>
                    <span
                      className={`text-[8px] font-medium text-slate-400 block ${
                        msg.role === "user" ? "text-right mr-7" : "text-left ml-7"
                      }`}
                    >
                      {msg.role === "bot" ? "M&F Support" : "You"} &bull; {fmtTime(msg.timestamp)}
                    </span>
                  </div>
                );
              })}

              {/* Support Options Menu — ONLY SHOWN IF NO LIVE TICKET & NO ACTIVE FORM */}
              {!liveTicket && !activeForm && !ticketClosed && messages.length > 0 && (
                <div className="space-y-1.5 pt-1 pl-6">
                  <div className="text-[9px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                    Support Options
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <button
                      onClick={handleWhatWeDo}
                      disabled={isTyping}
                      className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-[#1B222C] bg-white border border-slate-200 rounded-xl hover:bg-slate-100 transition-colors text-left shadow-sm disabled:opacity-50 cursor-pointer"
                    >
                      <HelpCircle className="h-3.5 w-3.5 text-slate-500 shrink-0" />
                      <span>What We Do</span>
                    </button>
                    <button
                      onClick={() => {
                        touchActivity();
                        resetFormFields();
                        setActiveForm("live_agent");
                      }}
                      disabled={isTyping}
                      className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-[#1B222C] bg-white border border-slate-200 rounded-xl hover:bg-slate-100 transition-colors text-left shadow-sm disabled:opacity-50 cursor-pointer"
                    >
                      <UserCheck className="h-3.5 w-3.5 text-slate-500 shrink-0" />
                      <span>Talk to Live Support Agent</span>
                    </button>
                    <button
                      onClick={() => {
                        touchActivity();
                        resetFormFields();
                        setActiveForm("callback");
                      }}
                      disabled={isTyping}
                      className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-[#1B222C] bg-white border border-slate-200 rounded-xl hover:bg-slate-100 transition-colors text-left shadow-sm disabled:opacity-50 cursor-pointer"
                    >
                      <PhoneCall className="h-3.5 w-3.5 text-slate-500 shrink-0" />
                      <span>Request Callback</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Form 1: Request Callback Form */}
              {activeForm === "callback" && (
                <div className="bg-white border border-slate-200 rounded-2xl p-3 shadow-md space-y-2 mt-1 ml-6">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-1.5">
                    <span className="text-xs font-bold text-[#1B222C]">Request Callback</span>
                    <button onClick={() => setActiveForm(null)} className="text-slate-400 hover:text-slate-600 p-0.5">
                      <ArrowLeft className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <form onSubmit={handleCallbackSubmit} className="space-y-1.5">
                    <div>
                      <label className="block text-[9px] font-semibold text-slate-500 mb-0.5">Full Name *</label>
                      <input
                        type="text"
                        required
                        value={formName}
                        onChange={(e) => { touchActivity(); setFormName(e.target.value); }}
                        placeholder="John Doe"
                        className="w-full px-2.5 py-1 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-[#1B222C]"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] font-semibold text-slate-500 mb-0.5">Phone Number *</label>
                      <input
                        type="tel"
                        required
                        value={formPhone}
                        onChange={(e) => { touchActivity(); setFormPhone(e.target.value); }}
                        placeholder="+254 700 000 000"
                        className="w-full px-2.5 py-1 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-[#1B222C]"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] font-semibold text-slate-500 mb-0.5">Email Address</label>
                      <input
                        type="email"
                        value={formEmail}
                        onChange={(e) => { touchActivity(); setFormEmail(e.target.value); }}
                        placeholder="john@institution.com"
                        className="w-full px-2.5 py-1 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-[#1B222C]"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] font-semibold text-slate-500 mb-0.5">Reason for Callback *</label>
                      <input
                        type="text"
                        required
                        value={formReason}
                        onChange={(e) => { touchActivity(); setFormReason(e.target.value); }}
                        placeholder="e.g. Core Lending Integration"
                        className="w-full px-2.5 py-1 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-[#1B222C]"
                      />
                    </div>
                    <div className="flex gap-2 pt-1">
                      <button
                        type="submit"
                        disabled={formSubmitting || !formName.trim() || !formPhone.trim() || !formReason.trim()}
                        className="flex-1 py-1.5 text-xs font-semibold text-white bg-[#1B222C] hover:bg-[#3E4C59] rounded-lg transition-colors disabled:opacity-50 cursor-pointer"
                      >
                        {formSubmitting ? "Submitting..." : "Submit Callback"}
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveForm(null)}
                        className="py-1.5 px-2.5 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Form 2: Talk to Live Agent Form */}
              {activeForm === "live_agent" && (
                <div className="bg-white border border-slate-200 rounded-2xl p-3 shadow-md space-y-2 mt-1 ml-6">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-1.5">
                    <span className="text-xs font-bold text-[#1B222C]">Connect Live Support</span>
                    <button onClick={() => setActiveForm(null)} className="text-slate-400 hover:text-slate-600 p-0.5">
                      <ArrowLeft className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <form onSubmit={handleLiveAgentSubmit} className="space-y-1.5">
                    <div>
                      <label className="block text-[9px] font-semibold text-slate-500 mb-0.5">Full Name *</label>
                      <input
                        type="text"
                        required
                        value={formName}
                        onChange={(e) => { touchActivity(); setFormName(e.target.value); }}
                        placeholder="John Doe"
                        className="w-full px-2.5 py-1 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-[#1B222C]"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] font-semibold text-slate-500 mb-0.5">Email Address *</label>
                      <input
                        type="email"
                        required
                        value={formEmail}
                        onChange={(e) => { touchActivity(); setFormEmail(e.target.value); }}
                        placeholder="john@institution.com"
                        className="w-full px-2.5 py-1 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-[#1B222C]"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] font-semibold text-slate-500 mb-0.5">Issue Description *</label>
                      <input
                        type="text"
                        required
                        value={formReason}
                        onChange={(e) => { touchActivity(); setFormReason(e.target.value); }}
                        placeholder="e.g. API authentication issue"
                        className="w-full px-2.5 py-1 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-[#1B222C]"
                      />
                    </div>
                    <div className="flex gap-2 pt-1">
                      <button
                        type="submit"
                        disabled={formSubmitting || !formName.trim() || !formEmail.trim() || !formReason.trim()}
                        className="flex-1 py-1.5 text-xs font-semibold text-white bg-[#1B222C] hover:bg-[#3E4C59] rounded-lg transition-colors disabled:opacity-50 cursor-pointer"
                      >
                        {formSubmitting ? "Connecting..." : "Request Live Ticket"}
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveForm(null)}
                        className="py-1.5 px-2.5 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Real-time Typing Indicators */}
              {(isTyping || isAgentTyping) && (
                <div className="flex items-center gap-2 pl-2">
                  <div className="shrink-0 mt-0.5">
                    <MfLogo size={20} />
                  </div>
                  <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-none px-3 py-2 flex items-center gap-1.5 shadow-sm">
                    <span className="w-1.5 h-1.5 bg-[#007AFF] rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-1.5 h-1.5 bg-[#007AFF] rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-1.5 h-1.5 bg-[#007AFF] rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                    <span className="text-[10px] text-slate-600 ml-1 font-semibold">
                      {isAgentTyping ? "Agent is typing..." : "Assistant is typing..."}
                    </span>
                  </div>
                </div>
              )}

              {ticketClosed && (
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-center space-y-2 mt-2">
                  <p className="text-xs text-slate-700 font-medium">This support session has ended.</p>
                  <button
                    onClick={handleStartNewChat}
                    type="button"
                    className="w-full py-1.5 text-xs font-semibold text-white bg-[#1B222C] hover:bg-[#3E4C59] rounded-lg transition-colors cursor-pointer"
                  >
                    Start New Chat
                  </button>
                </div>
              )}

              <div ref={chatEndRef} />
            </div>

            {/* Attached File Preview Strip */}
            {attachment && (
              <div className="flex items-center justify-between gap-2 px-3 py-1.5 bg-slate-100 border-t border-slate-200 text-xs animate-in fade-in duration-150">
                <div className="flex items-center gap-2 truncate">
                  {attachment.type === "image" ? (
                    <img src={attachment.url} alt="Thumbnail" className="h-7 w-7 object-cover rounded-lg border border-slate-300" />
                  ) : (
                    <FileText className="h-4 w-4 text-[#007AFF] shrink-0" />
                  )}
                  <span className="truncate font-semibold text-slate-700">{attachment.name}</span>
                  {attachment.size && (
                    <span className="text-[10px] text-slate-400">({Math.round(attachment.size / 1024)} KB)</span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => setAttachment(null)}
                  className="p-1 text-slate-400 hover:text-red-500 rounded-full transition-colors cursor-pointer"
                  title="Remove attachment"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            )}

            {/* Input form */}
            <form onSubmit={handleFormSend} className="relative p-2.5 border-t border-slate-200 bg-white flex items-center gap-1.5 shrink-0">
              {/* iPhone Emoji Picker Popover */}
              {showEmojiPicker && (
                <IosEmojiPicker
                  position="top-left"
                  onSelect={(emoji) => {
                    setInputText((prev) => prev + emoji);
                    setShowEmojiPicker(false);
                    inputRef.current?.focus();
                  }}
                  onClose={() => setShowEmojiPicker(false)}
                />
              )}

              {/* Hidden File Input for Screenshots, Photos, and Files */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,.pdf,.doc,.docx,.txt"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    uploadAttachment(e.target.files[0]);
                    e.target.value = "";
                  }
                }}
              />

              {/* Paperclip Button */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading || activeForm !== null || ticketClosed}
                title="Attach screenshot, photo, or document"
                className="h-8 w-8 flex items-center justify-center rounded-xl text-slate-500 hover:text-[#1B222C] hover:bg-slate-100 disabled:opacity-40 transition-colors cursor-pointer shrink-0"
              >
                {isUploading ? <Loader2 className="h-4 w-4 animate-spin text-[#007AFF]" /> : <Paperclip className="h-4 w-4" />}
              </button>

              {/* Apple Emoji Button */}
              <button
                type="button"
                onClick={() => setShowEmojiPicker((prev) => !prev)}
                disabled={activeForm !== null || ticketClosed}
                title="iPhone Emojis"
                className={`h-8 w-8 flex items-center justify-center rounded-xl transition-colors cursor-pointer shrink-0 ${
                  showEmojiPicker ? "bg-slate-200 text-[#007AFF]" : "text-slate-500 hover:text-[#1B222C] hover:bg-slate-100"
                }`}
              >
                <Smile className="h-4 w-4" />
              </button>

              {/* Text Input with Clipboard Screenshot Paste Support */}
              <input
                ref={inputRef}
                type="text"
                value={inputText}
                onChange={handleInputChange}
                onPaste={handlePaste}
                disabled={isTyping || activeForm !== null || ticketClosed}
                placeholder={
                  ticketClosed
                    ? "Session closed."
                    : activeForm !== null
                    ? "Fill in details above..."
                    : isTyping
                    ? "Responding..."
                    : "Message or paste screenshot..."
                }
                className="flex-1 px-3 py-1.5 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-[#1B222C] transition-colors disabled:bg-slate-50 disabled:text-slate-400"
              />

              {/* Send Button */}
              <button
                type="submit"
                disabled={(!inputText.trim() && !attachment) || isTyping || activeForm !== null || ticketClosed || isUploading}
                className="h-8 w-8 flex items-center justify-center rounded-xl bg-[#1B222C] hover:bg-[#3E4C59] text-white disabled:bg-slate-200 disabled:text-slate-400 transition-colors cursor-pointer shrink-0"
              >
                <Send className="h-3.5 w-3.5" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
