"use client";

// app/announcements/page.jsx
//
// Styled with the same inline color palette as the rest of the portal
// (matches the C object in your main WorkdayPortal file) so it looks
// native instead of using a different styling system.

import { useEffect, useState } from "react";

const C = {
  burgundy: "#6B1A2A",
  burgundyDark: "#4A0E1A",
  green: "#1E4D2B",
  gold: "#C9A84C",
  ivory: "#F5F0E8",
  dark: "#1A0F12",
  card: "#2A1A1E",
  cardBorder: "#3D2028",
  text: "#F0EAE2",
  muted: "#A08878",
  error: "#EF5350",
};

const CATEGORIES = [
  { value: "partnership", label: "New Partnership", color: "#1E4D2B" },
  { value: "policy", label: "Policy Update", color: "#6B1A2A" },
  { value: "contact", label: "New Contact / Agency", color: "#4A5D8B" },
  { value: "funding", label: "Funding / Grant", color: "#C9A84C" },
  { value: "compliance", label: "Compliance / Legal", color: "#8B2A3E" },
  { value: "property", label: "Property Opportunity", color: "#2E7D32" },
  { value: "general", label: "General Announcement", color: "#5C3010" },
];

const STAFF_NAMES = {
  avy: "Avrial Evans",
  travis: "Travis Ramar",
  deann: "Deann Evans",
  erica: "Erica Evans",
  ialana: "Ialana Tippins",
  aubreyon: "AuBreyon Woodley",
  dennis: "Dennis Pride",
};

function getCurrentStaffId() {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem("gtm_current_user");
}

function isLeadership(id) {
  return id === "avy" || id === "travis";
}

function categoryMeta(value) {
  return CATEGORIES.find((c) => c.value === value) || CATEGORIES[CATEGORIES.length - 1];
}

function linkifyText(text, linkColor) {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const result = [];
  let lastIndex = 0;
  let match;
  let key = 0;
  while ((match = urlRegex.exec(text)) !== null) {
    if (match.index > lastIndex) result.push(text.slice(lastIndex, match.index));
    result.push(
      <a key={key++} href={match[0]} style={{ color: linkColor, textDecoration: "underline", wordBreak: "break-all" }}>
        {match[0]}
      </a>
    );
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < text.length) result.push(text.slice(lastIndex));
  return result;
}

export default function AnnouncementsPage() {
  const [staffId, setStaffId] = useState(null);
  const [announcements, setAnnouncements] = useState([]);
  const [reads, setReads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    setStaffId(getCurrentStaffId());
    loadAnnouncements();
    loadReads();
  }, []);

  function loadAnnouncements() {
    setLoading(true);
    fetch("/api/announcements")
      .then((r) => r.json())
      .then((d) => setAnnouncements(d.announcements || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }

  function loadReads() {
    fetch("/api/announcement-reads")
      .then((r) => r.json())
      .then((d) => setReads(d.reads || []))
      .catch(() => {});
  }

  const leadership = isLeadership(staffId);
  const currentName = STAFF_NAMES[staffId] || "Unknown";

  return (
    <div style={{ minHeight: "100vh", background: C.dark, fontFamily: "'Inter','Segoe UI',sans-serif" }}>
      <div style={{ background: "linear-gradient(135deg," + C.burgundyDark + " 0%," + C.dark + " 70%)", borderBottom: "2px solid " + C.gold, padding: "20px 24px" }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <div style={{ color: C.gold, fontSize: 11, fontWeight: 800, letterSpacing: 2, textTransform: "uppercase" }}>Grace Trace Ministries</div>
          <div style={{ color: C.ivory, fontSize: 24, fontWeight: 900, marginTop: 4 }}>📣 Announcements</div>
          <div style={{ color: C.muted, fontSize: 13, marginTop: 4 }}>Partnerships, policy updates, new contacts, and other updates from leadership</div>
        </div>
      </div>

      <div style={{ maxWidth: 720, margin: "0 auto", padding: "24px 20px" }}>
        {leadership && (
          <div style={{ marginBottom: 20 }}>
            <button
              onClick={() => setShowForm(!showForm)}
              style={{ width: "100%", background: showForm ? C.cardBorder : C.burgundy, border: "1px solid " + C.gold + "66", borderRadius: 10, padding: "13px", color: C.ivory, fontSize: 14, fontWeight: 800, cursor: "pointer" }}
            >
              {showForm ? "Cancel" : "+ Post New Announcement"}
            </button>
            {showForm && (
              <NewAnnouncementForm
                currentName={currentName}
                onPosted={() => {
                  setShowForm(false);
                  loadAnnouncements();
                }}
              />
            )}
          </div>
        )}

        {loading ? (
          <p style={{ color: C.muted, fontSize: 14 }}>Loading announcements…</p>
        ) : announcements.length === 0 ? (
          <p style={{ color: C.muted, fontSize: 14 }}>No announcements yet.</p>
        ) : (
          announcements.map((a) => (
            <AnnouncementCard
              key={a.id}
              announcement={a}
              leadership={leadership}
              staffId={staffId}
              currentName={currentName}
              reads={reads.filter((r) => r.announcement_id === a.id)}
              onDeleted={loadAnnouncements}
              onPinToggled={loadAnnouncements}
              onRead={loadReads}
            />
          ))
        )}
      </div>
    </div>
  );
}

function NewAnnouncementForm({ currentName, onPosted }) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0].value);
  const [body, setBody] = useState("");
  const [pinned, setPinned] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!title.trim() || !body.trim()) {
      setError("Title and body are both required.");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/announcements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, category, body, pinned, createdBy: currentName }),
      });
      if (!res.ok) {
        const b = await res.json().catch(() => ({}));
        throw new Error(b.error || "Failed to post announcement");
      }
      setTitle(""); setBody(""); setPinned(false); setCategory(CATEGORIES[0].value);
      onPosted();
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ background: C.card, border: "1px solid " + C.cardBorder, borderRadius: 12, padding: 18, marginTop: 12 }}>
      <div style={{ marginBottom: 14 }}>
        <label style={{ color: C.gold, fontSize: 11, fontWeight: 800, letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 6 }}>Title</label>
        <input
          type="text" value={title} onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Texas Tax Exemption Approved"
          style={{ width: "100%", background: C.dark, border: "1px solid " + C.cardBorder, borderRadius: 8, padding: "10px 14px", color: C.text, fontSize: 14, outline: "none", fontFamily: "inherit" }}
        />
      </div>

      <div style={{ marginBottom: 14 }}>
        <label style={{ color: C.gold, fontSize: 11, fontWeight: 800, letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 6 }}>Category</label>
        <select
          value={category} onChange={(e) => setCategory(e.target.value)}
          style={{ width: "100%", background: C.dark, border: "1px solid " + C.cardBorder, borderRadius: 8, padding: "10px 14px", color: C.text, fontSize: 14, outline: "none", fontFamily: "inherit" }}
        >
          {CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
        </select>
      </div>

      <div style={{ marginBottom: 14 }}>
        <label style={{ color: C.gold, fontSize: 11, fontWeight: 800, letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 6 }}>Details</label>
        <textarea
          value={body} onChange={(e) => setBody(e.target.value)} rows={8}
          placeholder="Paste the full update here — letters, notices, policy text, whatever staff need to see"
          style={{ width: "100%", background: C.dark, border: "1px solid " + C.cardBorder, borderRadius: 8, padding: "10px 14px", color: C.text, fontSize: 14, outline: "none", fontFamily: "inherit", resize: "vertical", lineHeight: 1.6 }}
        />
      </div>

      <label style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14, color: C.text, fontSize: 13 }}>
        <input type="checkbox" checked={pinned} onChange={(e) => setPinned(e.target.checked)} />
        Pin to top
      </label>

      {error && <div style={{ color: C.error, fontSize: 13, marginBottom: 12 }}>{error}</div>}

      <button
        type="submit" disabled={submitting}
        style={{ width: "100%", background: C.green, border: "none", borderRadius: 8, padding: "12px", color: C.ivory, fontSize: 14, fontWeight: 800, cursor: "pointer" }}
      >
        {submitting ? "Posting…" : "Post Announcement"}
      </button>
    </form>
  );
}

function AnnouncementCard({ announcement, leadership, staffId, currentName, reads, onDeleted, onPinToggled, onRead }) {
  const meta = categoryMeta(announcement.category);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [pinning, setPinning] = useState(false);
  const [marking, setMarking] = useState(false);
  const [showReadList, setShowReadList] = useState(false);

  const alreadyRead = staffId && reads.some((r) => r.staff_id === staffId);

  async function handleDelete() {
    setDeleting(true);
    try {
      await fetch("/api/announcements", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: announcement.id }),
      });
      onDeleted();
    } finally {
      setDeleting(false);
    }
  }

  async function handleTogglePin() {
    setPinning(true);
    try {
      await fetch("/api/announcements", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: announcement.id, pinned: !announcement.pinned }),
      });
      onPinToggled();
    } finally {
      setPinning(false);
    }
  }

  async function handleMarkRead() {
    if (!staffId) return;
    setMarking(true);
    try {
      await fetch("/api/announcement-reads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ announcementId: announcement.id, staffId, staffName: currentName }),
      });
      onRead();
    } finally {
      setMarking(false);
    }
  }

  const date = new Date(announcement.created_at).toLocaleDateString("en-US", {
    weekday: "long", month: "long", day: "numeric", year: "numeric",
  });

  return (
    <div style={{ background: C.card, border: "1px solid " + (announcement.pinned ? C.gold + "77" : C.cardBorder), borderRadius: 12, padding: "16px 18px", marginBottom: 14 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10, marginBottom: 8 }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
            {announcement.pinned && <span style={{ fontSize: 12 }}>📌</span>}
            <span style={{ background: meta.color, color: C.ivory, fontSize: 10, fontWeight: 800, letterSpacing: 1, textTransform: "uppercase", padding: "3px 10px", borderRadius: 20 }}>
              {meta.label}
            </span>
          </div>
          <div style={{ color: C.text, fontSize: 16, fontWeight: 800, marginTop: 8 }}>{announcement.title}</div>
          <div style={{ color: C.muted, fontSize: 12, marginTop: 2 }}>
            {date}{announcement.created_by ? " — Posted by " + announcement.created_by : ""}
          </div>
        </div>
        {leadership && (
          <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
            <button onClick={handleTogglePin} disabled={pinning} style={{ background: announcement.pinned ? C.gold : "transparent", border: "1px solid " + C.gold + "88", borderRadius: 6, padding: "5px 10px", color: announcement.pinned ? C.dark : C.gold, fontSize: 11, fontWeight: 700, cursor: "pointer" }}>
              {pinning ? "…" : announcement.pinned ? "📌 Pinned" : "Pin"}
            </button>
            {confirmingDelete ? (
              <>
                <button onClick={handleDelete} disabled={deleting} style={{ background: C.error, border: "none", borderRadius: 6, padding: "5px 10px", color: "white", fontSize: 11, fontWeight: 700, cursor: "pointer" }}>
                  {deleting ? "…" : "Confirm"}
                </button>
                <button onClick={() => setConfirmingDelete(false)} style={{ background: "transparent", border: "1px solid " + C.cardBorder, borderRadius: 6, padding: "5px 10px", color: C.muted, fontSize: 11, cursor: "pointer" }}>
                  Cancel
                </button>
              </>
            ) : (
              <button onClick={() => setConfirmingDelete(true)} style={{ background: "transparent", border: "1px solid " + C.cardBorder, borderRadius: 6, padding: "5px 10px", color: C.muted, fontSize: 11, cursor: "pointer" }}>
                Delete
              </button>
            )}
          </div>
        )}
      </div>
      <div style={{ color: C.text, fontSize: 14, lineHeight: 1.7, whiteSpace: "pre-wrap", marginTop: 6 }}>
        {linkifyText(announcement.body, C.gold)}
      </div>

      {announcement.category === "property" && (() => {
        const urlMatch = announcement.body.match(/https?:\/\/[^\s]+/);
        if (!urlMatch) return null;
        return (
          <a href={urlMatch[0]} style={{ display: "inline-block", marginTop: 10, background: C.green, border: "1px solid #4CAF5066", borderRadius: 8, padding: "9px 18px", color: C.ivory, fontSize: 13, fontWeight: 800, textDecoration: "none" }}>
            🏢 View Property Opportunity →
          </a>
        );
      })()}

      <div style={{ marginTop: 14, paddingTop: 12, borderTop: "1px solid " + C.cardBorder, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
        {staffId ? (
          alreadyRead ? (
            <span style={{ color: C.green, fontSize: 12, fontWeight: 700 }}>✅ You've read this</span>
          ) : (
            <button onClick={handleMarkRead} disabled={marking} style={{ background: C.burgundy, border: "none", borderRadius: 6, padding: "6px 14px", color: C.ivory, fontSize: 12, fontWeight: 700, cursor: "pointer" }}>
              {marking ? "Marking…" : "Mark as Read"}
            </button>
          )
        ) : (
          <span style={{ color: C.muted, fontSize: 12 }}>Log in to mark as read</span>
        )}

        {leadership && (
          <button onClick={() => setShowReadList(!showReadList)} style={{ background: "transparent", border: "none", color: C.muted, fontSize: 12, cursor: "pointer", textDecoration: "underline" }}>
            {reads.length} of 7 staff have read this
          </button>
        )}
      </div>

      {leadership && showReadList && (
        <div style={{ marginTop: 10, paddingTop: 10, borderTop: "1px solid " + C.cardBorder }}>
          {Object.keys(STAFF_NAMES).map((id) => {
            const r = reads.find((x) => x.staff_id === id);
            return (
              <div key={id} style={{ display: "flex", justifyContent: "space-between", fontSize: 12, padding: "3px 0" }}>
                <span style={{ color: C.text }}>{STAFF_NAMES[id]}</span>
                <span style={{ color: r ? C.green : C.muted }}>
                  {r ? "✅ " + new Date(r.read_at).toLocaleDateString() : "⏳ Not yet"}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}