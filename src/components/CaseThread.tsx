"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { CaseMessage, fetchClientThread, sendClientMessage } from "../lib/caseMessages";

function formatTime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  const today = new Date();
  if (d.toDateString() === today.toDateString()) return "Today";
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  if (d.toDateString() === yesterday.toDateString()) return "Yesterday";
  return d.toLocaleDateString([], { month: "short", day: "numeric", year: "numeric" });
}

function groupByDate(messages: CaseMessage[]): { date: string; msgs: CaseMessage[] }[] {
  const groups: { date: string; msgs: CaseMessage[] }[] = [];
  let currentDate = "";
  for (const msg of messages) {
    const d = formatDate(msg.created_at);
    if (d !== currentDate) {
      currentDate = d;
      groups.push({ date: d, msgs: [] });
    }
    groups[groups.length - 1].msgs.push(msg);
  }
  return groups;
}

export default function CaseThread({ token, caseId }: { token: string; caseId: string }) {
  const [messages, setMessages] = useState<CaseMessage[]>([]);
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const lastFetch = useRef<string | undefined>(undefined);

  const scrollToBottom = useCallback(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, []);

  const loadMessages = useCallback(async (since?: string) => {
    try {
      const data = await fetchClientThread(token, caseId, since);
      if (since && data.messages.length > 0) {
        setMessages((prev) => {
          const existingIds = new Set(prev.map((m) => m.id));
          const newMsgs = data.messages.filter((m) => !existingIds.has(m.id) && !m.id.startsWith("pending-"));
          if (newMsgs.length === 0) return prev;
          return [...prev.filter((m) => !m.id.startsWith("pending-")), ...newMsgs];
        });
      } else if (!since) {
        setMessages(data.messages);
      }
      if (data.messages.length > 0) {
        lastFetch.current = data.messages[data.messages.length - 1].created_at;
      }
    } catch {
      // Silent fail on poll — do not disrupt UI
    } finally {
      setLoading(false);
    }
  }, [token, caseId]);

  useEffect(() => {
    loadMessages();
  }, [loadMessages]);

  useEffect(() => {
    const poll = setInterval(() => {
      if (document.visibilityState === "visible") {
        loadMessages(lastFetch.current);
      }
    }, 5000);
    return () => clearInterval(poll);
  }, [loadMessages]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const handleSend = async () => {
    const text = draft.trim();
    if (!text || sending) return;
    setError(null);
    setSending(true);

    const pendingId = `pending-${Date.now()}`;
    const optimistic: CaseMessage = {
      id: pendingId,
      case_id: caseId,
      sender_role: "client",
      message: text,
      created_at: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, optimistic]);
    setDraft("");

    try {
      await sendClientMessage(token, caseId, text);
      // POST returns { success: true } only — next poll picks up the real message
      setTimeout(() => loadMessages(lastFetch.current), 600);
    } catch {
      setError("Failed to send. Your message has been preserved — please try again.");
      setMessages((prev) => prev.filter((m) => m.id !== pendingId));
      setDraft(text);
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const groups = groupByDate(messages);

  return (
    <div style={{ border: "1px solid #e2e8f0", borderRadius: "8px", overflow: "hidden", background: "#fff" }}>
      <div style={{ padding: "12px 16px", borderBottom: "1px solid #e2e8f0", background: "#f8fafc" }}>
        <h3 style={{ margin: 0, fontSize: "14px", fontWeight: 600, color: "#1e293b" }}>
          Secure Messages
        </h3>
        <p style={{ margin: "2px 0 0", fontSize: "12px", color: "#64748b" }}>
          Messages regarding your case
        </p>
      </div>

      <div
        ref={scrollRef}
        style={{
          height: "320px",
          overflowY: "auto",
          padding: "16px",
          background: "#f8fafc",
        }}
      >
        {loading ? (
          <div style={{ textAlign: "center", padding: "40px 0", color: "#94a3b8", fontSize: "13px" }}>
            Loading messages...
          </div>
        ) : messages.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px 16px", color: "#94a3b8", fontSize: "13px" }}>
            No messages yet. You can securely message our team here regarding your case.
          </div>
        ) : (
          groups.map((group) => (
            <div key={group.date}>
              <div style={{ textAlign: "center", margin: "12px 0 8px", fontSize: "11px", color: "#94a3b8", fontWeight: 500 }}>
                {group.date}
              </div>
              {group.msgs.map((msg) => {
                const isClient = msg.sender_role === "client";
                const isPending = msg.id.startsWith("pending-");
                return (
                  <div
                    key={msg.id}
                    style={{
                      display: "flex",
                      justifyContent: isClient ? "flex-end" : "flex-start",
                      marginBottom: "8px",
                    }}
                  >
                    <div
                      style={{
                        maxWidth: "75%",
                        padding: "8px 12px",
                        borderRadius: isClient ? "12px 12px 2px 12px" : "12px 12px 12px 2px",
                        background: isClient ? "#0f766e" : "#e2e8f0",
                        color: isClient ? "#fff" : "#1e293b",
                        fontSize: "13px",
                        lineHeight: "1.4",
                        opacity: isPending ? 0.6 : 1,
                      }}
                    >
                      {!isClient && (
                        <div style={{ fontSize: "11px", fontWeight: 600, marginBottom: "2px", color: "#64748b" }}>
                          {msg.sender_display_name || "Rosen Experts Team"}
                        </div>
                      )}
                      <div style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}>{msg.message}</div>
                      <div
                        style={{
                          fontSize: "10px",
                          marginTop: "4px",
                          opacity: 0.7,
                          textAlign: isClient ? "right" : "left",
                        }}
                      >
                        {isPending ? "Sending..." : formatTime(msg.created_at)}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ))
        )}
      </div>

      {error && (
        <div style={{ padding: "8px 16px", background: "#fef2f2", color: "#991b1b", fontSize: "12px", borderTop: "1px solid #fecaca" }}>
          {error}
        </div>
      )}

      <div style={{ padding: "12px 16px", borderTop: "1px solid #e2e8f0", background: "#fff" }}>
        <div style={{ display: "flex", gap: "8px", alignItems: "flex-end" }}>
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            maxLength={4000}
            rows={2}
            style={{
              flex: 1,
              padding: "8px 12px",
              border: "1px solid #e2e8f0",
              borderRadius: "8px",
              fontSize: "13px",
              resize: "none",
              outline: "none",
              fontFamily: "inherit",
              lineHeight: "1.4",
            }}
          />
          <button
            onClick={handleSend}
            disabled={!draft.trim() || sending}
            style={{
              padding: "8px 16px",
              background: !draft.trim() || sending ? "#94a3b8" : "#0f766e",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              fontSize: "13px",
              fontWeight: 500,
              cursor: !draft.trim() || sending ? "default" : "pointer",
              whiteSpace: "nowrap",
            }}
          >
            {sending ? "Sending..." : "Send"}
          </button>
        </div>
        <div style={{ fontSize: "10px", color: "#94a3b8", marginTop: "4px", textAlign: "right" }}>
          {draft.length}/4000
        </div>
      </div>
    </div>
  );
}
