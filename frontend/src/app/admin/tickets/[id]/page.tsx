"use client";

import React, { useEffect, useState, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  ArrowLeft, 
  User, 
  Building, 
  Mail, 
  Phone, 
  Layers, 
  AlertCircle, 
  CheckCircle,
  Clock,
  Plus,
  Send,
  MessageSquare,
  Play,
  Pause,
  Timer,
  PhoneCall,
  Paperclip,
  Smile,
  FileText,
  Download,
  Loader2,
  X,
  Globe,
  MapPin,
  ExternalLink
} from "lucide-react";
import { IosEmojiPicker } from "@/shared/components/IosEmojiPicker";


interface Note {
  id: string;
  text: string;
  createdAt: string;
}

interface ChatMessage {
  id: string;
  sender: "client" | "agent";
  senderName: string;
  text: string;
  attachmentUrl?: string;
  attachmentName?: string;
  attachmentType?: "image" | "document";
  timestamp: string;
}

interface CallLog {
  id: string;
  agentName: string;
  phoneNumber: string;
  outcome: "answered" | "no_answer" | "voicemail" | "busy" | "callback_scheduled";
  durationSeconds?: number;
  notes?: string;
  calledAt: string;
}

interface TicketDetail {
  id: string;
  type: "chatbot" | "demo" | "contact" | "application";
  name: string;
  email: string;
  phone?: string;
  company?: string;
  message: string;
  status: "open" | "in_progress" | "resolved" | "closed";
  priority: "low" | "medium" | "high";
  assignedAgent?: string;
  latitude?: number;
  longitude?: number;
  ipAddress?: string;
  geoCity?: string;
  geoCountry?: string;
  geoRegion?: string;
  notes: Note[];
  messages: ChatMessage[];
  callLogs: CallLog[];
  isClientTyping?: boolean;
  isAgentTyping?: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function TicketDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);

  const [ticket, setTicket] = useState<TicketDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Edit fields
  const [status, setStatus] = useState<string>("open");
  const [priority, setPriority] = useState<string>("medium");
  const [assignedAgent, setAssignedAgent] = useState<string>("");
  const [newNote, setNewNote] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);

  // Chat fields
  const [newChatMessage, setNewChatMessage] = useState("");
  const [sendingChat, setSendingChat] = useState(false);
  // Quick-send from admin console
  const [quickMessage, setQuickMessage] = useState("");
  const [sendingQuick, setSendingQuick] = useState(false);
  const [prevMsgCount, setPrevMsgCount] = useState<number | null>(null);

  // Live typing state
  const [isClientTyping, setIsClientTyping] = useState(false);
  const adminTypingTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  // Attachment & Emoji state
  const [showAdminEmojiPicker, setShowAdminEmojiPicker] = useState(false);
  const [adminAttachment, setAdminAttachment] = useState<{ url: string; name: string; type: "image" | "document"; size?: number; isUploading?: boolean } | null>(null);
  const [adminUploading, setAdminUploading] = useState(false);
  const [previewImage, setPreviewImage] = useState<{ url: string; name: string } | null>(null);
  const adminFileInputRef = React.useRef<HTMLInputElement>(null);

  const compressImageForUpload = async (file: File): Promise<File> => {
    if (!file.type.startsWith("image/") || file.type.includes("svg") || file.type.includes("gif")) {
      return file;
    }
    return new Promise((resolve) => {
      const objectUrl = URL.createObjectURL(file);
      const img = new Image();
      img.onload = () => {
        URL.revokeObjectURL(objectUrl);
        const maxDim = 1200;
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
            resolve(new File([blob], safeName, { type: "image/jpeg", lastModified: Date.now() }));
          },
          "image/jpeg",
          0.75
        );
      };
      img.onerror = () => {
        URL.revokeObjectURL(objectUrl);
        resolve(file);
      };
      img.src = objectUrl;
    });
  };

  const uploadAdminAttachment = async (file: File) => {
    if (adminUploading) return;
    setAdminUploading(true);

    // Instant local preview thumbnail while optimizing & uploading
    const localUrl = URL.createObjectURL(file);
    setAdminAttachment({
      url: localUrl,
      name: file.name,
      type: file.type.startsWith("image/") ? "image" : "document",
      size: file.size,
      isUploading: true,
    });

    try {
      const optimizedFile = await compressImageForUpload(file);
      const formData = new FormData();
      formData.append("file", optimizedFile);

      const response = await fetch("/api/tickets/upload", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      if (response.ok && data.success && data.data) {
        setAdminAttachment({
          ...data.data,
          isUploading: false,
        });
      } else {
        setAdminAttachment(null);
      }
    } catch (err) {
      console.error("Failed to upload attachment:", err);
      setAdminAttachment(null);
    } finally {
      setAdminUploading(false);
    }
  };

  const handleAdminInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setNewChatMessage(val);

    if (adminTypingTimeoutRef.current) clearTimeout(adminTypingTimeoutRef.current);
    const isTypingNow = val.trim().length > 0;

    fetch(`/api/tickets/${id}/typing`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sender: "agent", isTyping: isTypingNow }),
    }).catch(() => {});

    if (isTypingNow) {
      adminTypingTimeoutRef.current = setTimeout(() => {
        fetch(`/api/tickets/${id}/typing`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sender: "agent", isTyping: false }),
        }).catch(() => {});
      }, 3000);
    }
  };

  const handleAdminPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    if (e.clipboardData.files && e.clipboardData.files.length > 0) {
      const file = e.clipboardData.files[0];
      e.preventDefault();
      uploadAdminAttachment(file);
    }
  };

  // Call logging fields
  const [callOutcome, setCallOutcome] = useState<string>("answered");
  const [callNotes, setCallNotes] = useState("");
  const [callDuration, setCallDuration] = useState<number>(0);
  const [timerActive, setTimerActive] = useState(false);
  const [submittingCall, setSubmittingCall] = useState(false);

  // Beep when a new message is received from client
  useEffect(() => {
    if (!ticket || !ticket.messages) return;
    const currentCount = ticket.messages.length;

    if (prevMsgCount !== null && currentCount > prevMsgCount) {
      const lastMsg = ticket.messages[currentCount - 1];
      if (lastMsg && lastMsg.sender === "client") {
        import("@/shared/lib/audioAlert").then((mod) => {
          mod.playNotificationBeep();
        });
      }
    }
    setPrevMsgCount(currentCount);
  }, [ticket?.messages, prevMsgCount]);

  useEffect(() => {
    let interval: any = null;
    if (timerActive) {
      interval = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    } else {
      if (interval) clearInterval(interval);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timerActive]);

  const fetchDetail = async () => {
    try {
      const token = sessionStorage.getItem("adminToken");
      const headers = { 
        Authorization: `Bearer ${token}`,
        "Cache-Control": "no-cache",
      };

      const response = await fetch(`/api/tickets/${id}`, { headers, cache: "no-store" });
      const resData = await response.json();

      if (response.ok && resData.success) {
        setTicket(resData.data);
        setStatus(resData.data.status);
        setPriority(resData.data.priority);
        setAssignedAgent(resData.data.assignedAgent || "");
        setIsClientTyping(Boolean(resData.data.isClientTyping));
      } else {
        setErrorMsg(resData.error || "Failed to load ticket details.");
      }
    } catch {
      setErrorMsg("Failed to connect to support endpoint.");
    } finally {
      setLoading(false);
    }
  };

  const openApplicationDocument = async (kind: "cv" | "resume") => {
    try {
      const token = sessionStorage.getItem("adminToken");
      const response = await fetch(`/api/tickets/${id}/application-documents/${kind}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Unable to load document");
      const fileUrl = URL.createObjectURL(await response.blob());
      window.open(fileUrl, "_blank", "noopener,noreferrer");
      window.setTimeout(() => URL.revokeObjectURL(fileUrl), 60_000);
    } catch {
      setErrorMsg("Could not open the application document.");
    }
  };

  useEffect(() => {
    fetchDetail();
    // Live polling: reload details, messages, and typing status every 700ms
    const interval = setInterval(fetchDetail, 700);
    return () => clearInterval(interval);
  }, [id]);

  const handleSendChatMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChatMessage.trim() && !adminAttachment) return;

    setSendingChat(true);
    try {
      const token = sessionStorage.getItem("adminToken");
      const agentName = assignedAgent.trim() || "M&F Agent";

      const response = await fetch(`/api/tickets/${id}/agent-messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          text: newChatMessage.trim(),
          senderName: agentName,
          attachmentUrl: adminAttachment?.url,
          attachmentName: adminAttachment?.name,
          attachmentType: adminAttachment?.type,
        }),
      });

      const resData = await response.json();
      if (response.ok && resData.success) {
        setNewChatMessage("");
        setAdminAttachment(null);
        setShowAdminEmojiPicker(false);
        fetchDetail();
      } else {
        setErrorMsg(resData.error || "Failed to send message.");
      }
    } catch {
      setErrorMsg("Failed to deliver message to client.");
    } finally {
      setSendingChat(false);
    }
  };

  const handleLogCall = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticket || !ticket.phone) return;

    setSubmittingCall(true);
    try {
      const token = sessionStorage.getItem("adminToken");
      const agentName = assignedAgent.trim() || "M&F Agent";

      const response = await fetch(`/api/tickets/${id}/calls`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          agentName,
          phoneNumber: ticket.phone,
          outcome: callOutcome,
          durationSeconds: callDuration,
          notes: callNotes.trim() || undefined,
        }),
      });

      const resData = await response.json();
      if (response.ok && resData.success) {
        setCallNotes("");
        setCallDuration(0);
        setTimerActive(false);
        setSuccessMsg("Call logged successfully.");
        fetchDetail();
      } else {
        setErrorMsg(resData.error || "Failed to log call.");
      }
    } catch {
      setErrorMsg("Failed to connect to backend call tracker.");
    } finally {
      setSubmittingCall(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");
    setSubmitting(true);

    try {
      const token = sessionStorage.getItem("adminToken");
      const response = await fetch(`/api/tickets/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          status,
          priority,
          assignedAgent: assignedAgent.trim() || undefined,
          noteText: newNote.trim() || undefined,
        }),
      });

      const resData = await response.json();

      if (response.ok && resData.success) {
        setSuccessMsg("Ticket saved successfully alone.");
        setNewNote("");
        fetchDetail();
      } else {
        setErrorMsg(resData.error || "Failed to save updates.");
      }
    } catch {
      setErrorMsg("Database connection failure.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleQuickSend = async () => {
    if (!quickMessage.trim()) return;

    setSendingQuick(true);
    try {
      const token = sessionStorage.getItem("adminToken");
      const agentName = assignedAgent.trim() || "M&F Agent";

      const response = await fetch(`/api/tickets/${id}/agent-messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ text: quickMessage.trim(), senderName: agentName }),
      });

      const resData = await response.json();
      if (response.ok && resData.success) {
        setQuickMessage("");
        setSuccessMsg("Message sent to client.");
        fetchDetail();
      } else {
        setErrorMsg(resData.error || "Failed to send quick message.");
      }
    } catch {
      setErrorMsg("Failed to deliver quick message.");
    } finally {
      setSendingQuick(false);
    }
  };

  const handleCloseAndSend = async () => {
    if (!quickMessage.trim()) return;
    setSendingQuick(true);
    setErrorMsg("");
    setSuccessMsg("");
    try {
      const token = sessionStorage.getItem("adminToken");
      const agentName = assignedAgent.trim() || "M&F Agent";

      // Send agent message first
      const resp1 = await fetch(`/api/tickets/${id}/agent-messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ text: quickMessage.trim(), senderName: agentName }),
      });
      const d1 = await resp1.json();
      if (!resp1.ok || !d1.success) {
        setErrorMsg(d1.error || "Failed to send message before closing.");
        return;
      }

      // Then close with the same text as reason
      const resp2 = await fetch(`/api/tickets/${id}/close`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ reason: quickMessage.trim() }),
      });
      const d2 = await resp2.json();
      if (!resp2.ok || !d2.success) {
        setErrorMsg(d2.error || "Failed to close ticket after sending message.");
        return;
      }

      setQuickMessage("");
      setSuccessMsg("Message sent and ticket closed.");
      fetchDetail();
    } catch (err) {
      setErrorMsg("Failed to close and send message.");
    } finally {
      setSendingQuick(false);
    }
  };

  const handleCloseTicket = async () => {
    setErrorMsg("");
    setSuccessMsg("");
    try {
      const token = sessionStorage.getItem("adminToken");
      const response = await fetch(`/api/tickets/${id}/close`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ reason: "Closed by admin: no response from client" }),
      });

      const resData = await response.json();
      if (response.ok && resData.success) {
        setSuccessMsg("Ticket closed.");
        fetchDetail();
      } else {
        setErrorMsg(resData.error || "Failed to close ticket.");
      }
    } catch {
      setErrorMsg("Unable to contact backend to close ticket.");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-2">
          <div className="h-6 w-6 rounded-full border-2 border-[#1B222C] border-t-transparent animate-spin" />
          <span className="text-xs font-semibold text-slate-500">Loading details...</span>
        </div>
      </div>
    );
  }

  if (errorMsg && !ticket) {
    return (
      <div className="space-y-4">
        <Link href="/admin/tickets" className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back to registry
        </Link>
        <div className="bg-red-50 text-red-700 text-xs px-4 py-3 rounded-xl flex items-center gap-2">
          <AlertCircle className="h-4 w-4" />
          <span>{errorMsg}</span>
        </div>
      </div>
    );
  }

  if (!ticket) return null;

  return (
    <>
      <div className="space-y-6 font-sans antialiased text-[#1B222C]">
      {/* Top Nav and ID */}
      <div className="space-y-2">
        <Link href="/admin/tickets" className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back to registry
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <h1 className="text-xl font-bold tracking-tight">
            Manage Ticket: <span className="font-mono text-slate-600">{ticket.id}</span>
          </h1>
          <span className={`self-start px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
            ticket.status === "open" ? "bg-red-50 text-red-600 border border-red-200" :
            ticket.status === "in_progress" ? "bg-amber-50 text-amber-600 border border-amber-200" :
            ticket.status === "resolved" ? "bg-emerald-50 text-emerald-600 border border-emerald-200" :
            "bg-slate-100 text-slate-500 border border-slate-200"
          }`}>
            {ticket.status.replace("_", " ")}
          </span>
        </div>
      </div>

      {/* Main Grid split: Ticket Details (Left) + Console Update Forms (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Ticket Details Panel */}
        <div className="lg:col-span-2 space-y-6">
          {/* Card: Requester & Message */}
          <div className="bg-white border border-[#E4E7EB] rounded-2xl p-6 shadow-sm space-y-6">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-[#E4E7EB]/60 pb-3">Requester Profile</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center gap-2.5 text-xs">
                <User className="h-4 w-4 text-slate-400 shrink-0" />
                <div>
                  <span className="text-[10px] text-slate-400 block font-semibold">Name</span>
                  <span className="font-bold text-slate-700">{ticket.name}</span>
                </div>
              </div>

              <div className="flex items-center gap-2.5 text-xs">
                <Mail className="h-4 w-4 text-slate-400 shrink-0" />
                <div>
                  <span className="text-[10px] text-slate-400 block font-semibold">Work Email</span>
                  <a href={`mailto:${ticket.email}`} className="font-bold text-[#3E4C59] hover:underline">{ticket.email}</a>
                </div>
              </div>

              {ticket.phone && (
                <div className="flex items-center gap-2.5 text-xs">
                  <Phone className="h-4 w-4 text-slate-400 shrink-0" />
                  <div>
                    <span className="text-[10px] text-slate-400 block font-semibold">Phone Number</span>
                    <a href={`tel:${ticket.phone}`} className="font-bold text-slate-700 hover:underline">{ticket.phone}</a>
                  </div>
                </div>
              )}

              {ticket.company && (
                <div className="flex items-center gap-2.5 text-xs">
                  <Building className="h-4 w-4 text-slate-400 shrink-0" />
                  <div>
                    <span className="text-[10px] text-slate-400 block font-semibold">Company / Organization</span>
                    <span className="font-bold text-slate-700">{ticket.company}</span>
                  </div>
                </div>
              )}

              {ticket.type === "application" && (
                <div className="sm:col-span-2 border-t border-slate-100 pt-4">
                  <span className="text-[10px] text-slate-400 block font-semibold mb-2">APPLICATION DOCUMENTS</span>
                  <div className="flex flex-wrap gap-2">
                    <button type="button" onClick={() => openApplicationDocument("cv")} className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50">
                      <FileText className="h-4 w-4 text-[#007AFF]" /> View CV
                    </button>
                    <button type="button" onClick={() => openApplicationDocument("resume")} className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50">
                      <FileText className="h-4 w-4 text-[#007AFF]" /> View Résumé
                    </button>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-2.5 text-xs">
                <Clock className="h-4 w-4 text-slate-400 shrink-0" />
                <div>
                  <span className="text-[10px] text-slate-400 block font-semibold">Ticket Created</span>
                  <span className="font-bold text-slate-700">{new Date(ticket.createdAt).toLocaleString()}</span>
                </div>
              </div>

              {ticket.ipAddress && (
                <div className="flex items-center gap-2.5 text-xs">
                  <Globe className="h-4 w-4 text-slate-400 shrink-0" />
                  <div>
                    <span className="text-[10px] text-slate-400 block font-semibold">Visitor IP Address</span>
                    <span className="font-mono font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded text-[11px] border border-slate-200">{ticket.ipAddress}</span>
                  </div>
                </div>
              )}

              {(ticket.geoCity || ticket.geoCountry || ticket.geoRegion || (ticket.latitude !== undefined && ticket.longitude !== undefined)) && (
                <div className="flex flex-col gap-2.5 text-xs sm:col-span-2 bg-slate-50 border border-[#E4E7EB] rounded-xl p-4">
                  <div className="flex items-start gap-2.5">
                    <MapPin className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div className="space-y-1 flex-1">
                      <span className="text-[10px] text-slate-400 block font-semibold uppercase tracking-wider">Geolocation Origin</span>
                      <div className="font-bold text-slate-800 text-xs">
                        {[ticket.geoCity, ticket.geoRegion, ticket.geoCountry].filter(Boolean).join(", ")}
                      </div>
                      {ticket.latitude !== undefined && ticket.longitude !== undefined && (
                        <div className="flex items-center gap-2 text-[11px] text-slate-500 font-normal">
                          <span>Coordinates: {ticket.latitude.toFixed(4)}, {ticket.longitude.toFixed(4)}</span>
                          <a
                            href={`https://www.google.com/maps?q=${ticket.latitude},${ticket.longitude}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#1B222C] font-bold underline hover:text-[#3E4C59] inline-flex items-center gap-0.5"
                          >
                            Open Google Maps <ExternalLink className="h-2.5 w-2.5" />
                          </a>
                        </div>
                      )}
                    </div>
                  </div>

                  {ticket.latitude !== undefined && ticket.longitude !== undefined && (
                    <div className="mt-1 h-44 w-full rounded-xl overflow-hidden border border-slate-200 shadow-sm bg-slate-100 relative">
                      <iframe
                        title="Interactive Geolocation Map"
                        width="100%"
                        height="100%"
                        frameBorder="0"
                        scrolling="no"
                        marginHeight={0}
                        marginWidth={0}
                        src={`https://www.openstreetmap.org/export/embed.html?bbox=${ticket.longitude - 0.05}%2C${ticket.latitude - 0.05}%2C${ticket.longitude + 0.05}%2C${ticket.latitude + 0.05}&layer=mapnik&marker=${ticket.latitude}%2C${ticket.longitude}`}
                        className="w-full h-full border-0"
                      />
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="border-t border-[#E4E7EB]/60 pt-4 space-y-2">
              <span className="text-[10px] text-slate-400 block font-semibold">Message Description</span>
              <div className="bg-[#F4F6F8] rounded-xl p-4 text-xs font-semibold leading-relaxed text-slate-800 whitespace-pre-line border border-[#E4E7EB]">
                {ticket.message}
              </div>
            </div>
          </div>

          {/* Outbound Call Console & Tracker */}
          {ticket.phone && (
            <div className="bg-white border border-[#E4E7EB] rounded-2xl p-6 shadow-sm space-y-5">
              <div className="flex items-center justify-between border-b border-[#E4E7EB]/60 pb-3">
                <div className="flex items-center gap-2">
                  <PhoneCall className="h-4 w-4 text-[#1B222C]" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Outbound Call Console</h3>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className={`h-2 w-2 rounded-full ${timerActive ? "bg-red-500 animate-ping" : "bg-slate-300"}`} />
                  <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">
                    {timerActive ? "Call in Progress" : "System Offline"}
                  </span>
                </div>
              </div>

              {/* Call Control panel */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Dialing panel */}
                <div className="bg-slate-50 border border-[#E4E7EB] rounded-xl p-4 flex flex-col justify-between space-y-4">
                  <div>
                    <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">Customer Number</span>
                    <a href={`tel:${ticket.phone}`} className="text-sm font-bold text-slate-800 hover:underline block truncate mt-1">
                      {ticket.phone}
                    </a>
                  </div>

                  <div className="flex items-center gap-3">
                    {!timerActive ? (
                      <button
                        type="button"
                        onClick={() => {
                          setTimerActive(true);
                          setCallDuration(0);
                        }}
                        className="flex-1 py-2 bg-[#1B222C] hover:bg-[#3E4C59] text-white text-[10px] font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Play className="h-3 w-3" />
                        <span>Dial &amp; Track Call</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setTimerActive(false)}
                        className="flex-1 py-2 bg-red-600 hover:bg-red-700 text-white text-[10px] font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Pause className="h-3 w-3" />
                        <span>Stop Tracking</span>
                      </button>
                    )}
                  </div>

                  {/* Stopwatch UI */}
                  <div className="flex items-center justify-between border-t border-slate-200/60 pt-2 text-[10px] font-semibold text-slate-500">
                    <span className="flex items-center gap-1">
                      <Timer className="h-3.5 w-3.5" />
                      <span>Duration:</span>
                    </span>
                    <span className="font-mono text-slate-800 font-bold">
                      {Math.floor(callDuration / 60).toString().padStart(2, "0")}:
                      {(callDuration % 60).toString().padStart(2, "0")}
                    </span>
                  </div>
                </div>

                {/* Call Logging Form */}
                <form onSubmit={handleLogCall} className="space-y-3.5">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold uppercase tracking-wider text-slate-500">Outcome</label>
                      <select
                        value={callOutcome}
                        onChange={(e) => setCallOutcome(e.target.value)}
                        className="w-full text-[10px] px-2 py-1.5 border border-slate-200 rounded-lg focus:outline-none focus:border-[#1B222C] font-semibold bg-white"
                      >
                        <option value="answered">Answered</option>
                        <option value="no_answer">No Answer</option>
                        <option value="voicemail">Voicemail</option>
                        <option value="busy">Busy</option>
                        <option value="callback_scheduled">Reschedule</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[9px] font-bold uppercase tracking-wider text-slate-500">Duration (sec)</label>
                      <input
                        type="number"
                        min="0"
                        value={callDuration}
                        onChange={(e) => setCallDuration(parseInt(e.target.value) || 0)}
                        className="w-full text-[10px] px-2 py-1.5 border border-slate-200 rounded-lg focus:outline-none focus:border-[#1B222C] font-semibold"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] font-bold uppercase tracking-wider text-slate-500">Call Conversation Notes</label>
                    <textarea
                      value={callNotes}
                      onChange={(e) => setCallNotes(e.target.value)}
                      placeholder="Summary of call conversation..."
                      rows={2}
                      className="w-full text-[10px] px-2.5 py-1.5 border border-slate-200 rounded-lg focus:outline-none focus:border-[#1B222C] font-semibold resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submittingCall}
                    className="w-full py-1.5 bg-[#3E4C59] hover:bg-[#1B222C] text-white text-[10px] font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    {submittingCall ? (
                      <span className="h-3 w-3 rounded-full border-2 border-white border-t-transparent animate-spin" />
                    ) : (
                      <>
                        <Plus className="h-3 w-3" />
                        <span>Log Call Details</span>
                      </>
                    )}
                  </button>
                </form>
              </div>

              {/* Call History Timeline */}
              {ticket.callLogs && ticket.callLogs.length > 0 && (
                <div className="border-t border-[#E4E7EB]/60 pt-4 space-y-3">
                  <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Call History Logs</h4>
                  <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                    {ticket.callLogs.map((log) => (
                      <div key={log.id} className="text-[10px] border border-slate-100 bg-slate-50/50 p-2.5 rounded-lg flex flex-col gap-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-[#1B222C]">
                            {log.agentName} called {log.phoneNumber}
                          </span>
                          <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider ${
                            log.outcome === "answered" ? "bg-emerald-50 text-emerald-600 border border-emerald-100" :
                            log.outcome === "callback_scheduled" ? "bg-blue-50 text-blue-600 border border-blue-100" :
                            "bg-amber-50 text-amber-600 border border-amber-100"
                          }`}>
                            {log.outcome.replace("_", " ")}
                          </span>
                        </div>
                        {log.notes && <p className="font-medium text-slate-600">{log.notes}</p>}
                        <div className="text-[8px] text-slate-400 font-bold uppercase tracking-wider flex justify-between mt-1">
                          <span>Duration: {Math.floor((log.durationSeconds || 0) / 60)}m {(log.durationSeconds || 0) % 60}s</span>
                          <span>{new Date(log.calledAt).toLocaleString()}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Live Chat Communication Hub (Real-time chat client interface) */}
          {(ticket.type === "chatbot" || (ticket.messages && ticket.messages.length > 0)) && (
            <div className="bg-white border border-[#E4E7EB] rounded-2xl p-6 shadow-sm space-y-5">
              <div className="flex items-center justify-between border-b border-[#E4E7EB]/60 pb-3">
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-[#1B222C]" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Live Chat Communication Hub</h3>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
                  <span className="text-[9px] font-bold text-emerald-600 uppercase tracking-wider">Listening Live</span>
                </div>
              </div>

              {/* Messages viewport */}
              <div className="h-80 overflow-y-auto space-y-4 pr-1.5 scrollbar-thin scrollbar-thumb-slate-200">
                {ticket.messages && ticket.messages.length > 0 ? (
                  ticket.messages.map((msg) => (
                    <div key={msg.id} className="space-y-1">
                      <div className={`flex ${msg.sender === "agent" ? "justify-end" : "justify-start"}`}>
                        <div className={`p-3 text-xs font-semibold leading-relaxed rounded-2xl shadow-sm max-w-[85%] ${
                          msg.sender === "agent"
                            ? "bg-[#1B222C] text-white rounded-tr-none"
                            : "bg-slate-100 text-slate-800 rounded-tl-none border border-slate-200/60"
                        }`}>
                          {msg.attachmentUrl && (
                            <div className="mb-2">
                              {msg.attachmentType === "image" || /\.(png|jpe?g|webp|gif)$/i.test(msg.attachmentUrl) ? (
                                <button
                                  type="button"
                                  onClick={() => setPreviewImage({ url: msg.attachmentUrl!, name: msg.attachmentName || "Attached Image" })}
                                  className="block overflow-hidden rounded-xl group text-left cursor-zoom-in"
                                >
                                  <img
                                    src={msg.attachmentUrl}
                                    alt={msg.attachmentName || "Attached screenshot or photo"}
                                    className="max-h-60 max-w-full rounded-xl object-cover hover:opacity-95 transition-opacity border border-black/10 shadow-sm"
                                  />
                                </button>
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
                      <span className={`text-[9px] font-bold text-slate-400 block ${
                        msg.sender === "agent" ? "text-right mr-1.5" : "text-left ml-1.5"
                      }`}>
                        {msg.senderName} • {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-2">
                    <MessageSquare className="h-8 w-8 text-slate-300" />
                    <p className="text-xs text-slate-500 font-semibold">No active live chat messages yet.</p>
                    <p className="text-[10px] text-slate-400 max-w-[240px]">Send a reply below to initiate the live chat communication link with the visitor.</p>
                  </div>
                )}
              </div>

              {/* Real-time Visitor Typing Notification */}
              {isClientTyping && (
                <div className="flex items-center gap-2 px-3.5 py-2 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-semibold text-emerald-800 animate-pulse">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
                  <span>💬 Visitor ({ticket.name}) is typing right now...</span>
                </div>
              )}

              {/* Admin Attached File Preview Strip */}
              {adminAttachment && (
                <div className="flex items-center justify-between gap-2 px-3 py-2 bg-slate-100 border border-slate-200 rounded-xl text-xs">
                  <div className="flex items-center gap-2 truncate">
                    {adminAttachment.type === "image" ? (
                      <div
                        className="relative h-9 w-9 shrink-0 cursor-pointer"
                        onClick={() => !adminAttachment.isUploading && setPreviewImage({ url: adminAttachment.url, name: adminAttachment.name })}
                      >
                        <img src={adminAttachment.url} alt="Thumbnail" className={`h-9 w-9 object-cover rounded-lg border border-slate-300 ${adminAttachment.isUploading ? "opacity-50" : "hover:opacity-90"}`} />
                        {adminAttachment.isUploading && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-lg">
                            <Loader2 className="h-3.5 w-3.5 animate-spin text-white" />
                          </div>
                        )}
                      </div>
                    ) : (
                      <FileText className="h-4 w-4 text-[#007AFF] shrink-0" />
                    )}
                    <div className="truncate">
                      <span className="truncate font-semibold text-slate-700 block">{adminAttachment.name}</span>
                      <span className="text-[10px] text-slate-400 block">
                        {adminAttachment.isUploading ? "Optimizing & uploading..." : (adminAttachment.size ? `${Math.round(adminAttachment.size / 1024)} KB` : "Ready to send")}
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setAdminAttachment(null)}
                    className="p-1 text-slate-400 hover:text-red-500 rounded-full transition-colors cursor-pointer shrink-0"
                    title="Remove attachment"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              )}

              {/* Chat Input Bar */}
              <form onSubmit={handleSendChatMessage} className="relative flex items-center gap-2 border-t border-[#E4E7EB]/60 pt-4">
                {/* iPhone Emoji Picker Popover */}
                {showAdminEmojiPicker && (
                  <IosEmojiPicker
                    position="top-left"
                    onSelect={(emoji) => {
                      setNewChatMessage((prev) => prev + emoji);
                      setShowAdminEmojiPicker(false);
                    }}
                    onClose={() => setShowAdminEmojiPicker(false)}
                  />
                )}

                {/* Hidden File Input for Screenshots, Photos, and Documents */}
                <input
                  ref={adminFileInputRef}
                  type="file"
                  accept="image/*,.pdf,.doc,.docx,.txt"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      uploadAdminAttachment(e.target.files[0]);
                      e.target.value = "";
                    }
                  }}
                />

                {/* Paperclip Button */}
                <button
                  type="button"
                  onClick={() => adminFileInputRef.current?.click()}
                  disabled={adminUploading || sendingChat}
                  title="Attach screenshot, photo, or document"
                  className="h-10 w-10 flex items-center justify-center rounded-xl text-slate-500 hover:text-[#1B222C] hover:bg-slate-100 disabled:opacity-40 transition-colors cursor-pointer shrink-0 border border-slate-200"
                >
                  {adminUploading ? <Loader2 className="h-4 w-4 animate-spin text-[#007AFF]" /> : <Paperclip className="h-4 w-4" />}
                </button>

                {/* Apple Emoji Button */}
                <button
                  type="button"
                  onClick={() => setShowAdminEmojiPicker((prev) => !prev)}
                  disabled={sendingChat}
                  title="iPhone Emojis"
                  className={`h-10 w-10 flex items-center justify-center rounded-xl transition-colors cursor-pointer shrink-0 border border-slate-200 ${
                    showAdminEmojiPicker ? "bg-slate-200 text-[#007AFF]" : "text-slate-500 hover:text-[#1B222C] hover:bg-slate-100"
                  }`}
                >
                  <Smile className="h-4 w-4" />
                </button>

                <input
                  type="text"
                  value={newChatMessage}
                  onChange={handleAdminInputChange}
                  onPaste={handleAdminPaste}
                  onFocus={(e) => setTimeout(() => e.target.scrollIntoView({ behavior: "smooth", block: "center" }), 350)}
                  placeholder={`Reply to ${ticket.name} or paste screenshot...`}
                  className="flex-1 text-xs px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:border-[#1B222C] font-semibold bg-slate-50/50"
                  disabled={sendingChat}
                />
                <button
                  type="submit"
                  disabled={sendingChat || (!newChatMessage.trim() && !adminAttachment) || adminUploading}
                  className="px-5 py-3 bg-[#1B222C] hover:bg-[#3E4C59] text-white font-bold text-xs rounded-xl shadow-lg transition-colors flex items-center justify-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shrink-0"
                >
                  {sendingChat ? (
                    <span className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                  ) : (
                    <>
                      <Send className="h-3.5 w-3.5" />
                      <span className="hidden sm:inline">Send</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          )}

          {/* Internal Notes History logs */}
          <div className="bg-white border border-[#E4E7EB] rounded-2xl p-6 shadow-sm space-y-6">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-[#E4E7EB]/60 pb-3">Internal Activity Logs</h3>
            
            <div className="space-y-4">
              {ticket.notes.map((n) => (
                <div key={n.id} className="flex gap-3 text-xs bg-slate-50/50 p-3.5 border border-[#E4E7EB]/60 rounded-xl">
                  <Clock className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-slate-700 leading-relaxed">{n.text}</p>
                    <span className="text-[9px] text-slate-400 font-medium block mt-1.5">
                      Logged on {new Date(n.createdAt).toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
              {ticket.notes.length === 0 && (
                <p className="text-xs text-slate-400 italic text-center py-4">No internal notes logged yet.</p>
              )}
            </div>
          </div>
        </div>

        {/* Update console panel (Right) */}
        <div className="space-y-4">
          <form onSubmit={handleUpdate} className="bg-white border border-[#E4E7EB] rounded-2xl p-5 shadow-sm space-y-5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-[#E4E7EB]/60 pb-3">Update alone</h3>

            {successMsg && (
              <div className="bg-emerald-50 text-emerald-700 text-xs px-4 py-3 rounded-xl flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                <span>{successMsg}</span>
              </div>
            )}

            {errorMsg && (
              <div className="bg-red-50 text-red-700 text-xs px-4 py-3 rounded-xl flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                <span>{errorMsg}</span>
              </div>
            )}

            <div className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Ticket Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full text-xs px-3 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:border-[#1B222C] font-semibold bg-white"
                >
                  <option value="open">Open</option>
                  <option value="in_progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                  <option value="closed">Closed</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Priority Level</label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className="w-full text-xs px-3 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:border-[#1B222C] font-semibold bg-white"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Assigned Agent</label>
                <input
                  type="text"
                  value={assignedAgent}
                  onChange={(e) => setAssignedAgent(e.target.value)}
                  placeholder="e.g. Jane Mwangi"
                  className="w-full text-xs px-3 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:border-[#1B222C] font-semibold"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Add Internal Note</label>
                <textarea
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="Type an internal update..."
                  rows={3}
                  className="w-full text-xs px-3 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:border-[#1B222C] font-semibold resize-none"
                />
              </div>
              {/* Quick send to client */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Quick Send to Client</label>
                <div className="space-y-2">
                  <textarea
                    value={quickMessage}
                    onChange={(e) => setQuickMessage(e.target.value)}
                    onFocus={(e) => setTimeout(() => e.target.scrollIntoView({ behavior: "smooth", block: "center" }), 350)}
                    placeholder="Short message to send to the client..."
                    rows={2}
                    className="w-full text-xs px-3 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:border-[#1B222C] font-semibold resize-none"
                  />
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={handleQuickSend}
                      disabled={sendingQuick}
                      className="flex-1 py-2 bg-[#1B222C] hover:bg-[#3E4C59] text-white font-bold text-xs rounded-xl shadow-lg transition-colors flex items-center justify-center gap-1.5 disabled:opacity-75 cursor-pointer"
                    >
                      {sendingQuick ? (
                        <span className="h-3 w-3 rounded-full border-2 border-white border-t-transparent animate-spin" />
                      ) : (
                        <>
                          <Send className="h-3.5 w-3.5" />
                          <span>Quick Send</span>
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={handleCloseTicket}
                      className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow transition-colors"
                    >
                      Close Ticket
                    </button>
                    <button
                      type="button"
                      onClick={handleCloseAndSend}
                      disabled={sendingQuick}
                      className="px-3 py-2 bg-red-700 hover:bg-red-800 text-white font-bold text-xs rounded-xl shadow transition-colors disabled:opacity-60"
                    >
                      {sendingQuick ? "Closing..." : "Close & Send"}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-2.5 bg-[#1B222C] hover:bg-[#3E4C59] text-white font-bold text-xs rounded-xl shadow-lg transition-colors flex items-center justify-center gap-1.5 disabled:opacity-75 cursor-pointer"
            >
              {submitting ? (
                <span className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
              ) : (
                <>
                  <Plus className="h-4 w-4" />
                  <span>Save Changes</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>

      {/* ── Full-Screen Image Lightbox Modal ── */}
      {previewImage && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200"
          onClick={() => setPreviewImage(null)}
        >
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); setPreviewImage(null); }}
            className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/50 hover:bg-black/70 text-white transition-colors cursor-pointer"
            aria-label="Close preview"
          >
            <X className="h-6 w-6" />
          </button>
          <img
            src={previewImage.url}
            alt={previewImage.name}
            onClick={(e) => e.stopPropagation()}
            className="max-w-full max-h-[90vh] rounded-2xl shadow-2xl object-contain select-none"
          />
          <a
            href={previewImage.url}
            download={previewImage.name}
            target="_blank"
            rel="noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="absolute bottom-6 right-6 flex items-center gap-2 px-4 py-2 bg-white/90 hover:bg-white text-[#1B222C] font-bold text-xs rounded-xl shadow-lg transition-colors"
          >
            <Download className="h-4 w-4" />
            <span>Download</span>
          </a>
        </div>
      )}
    </>
  );
}
