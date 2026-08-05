"use client";

// app/my-outreach-contacts/page.jsx
//
// Any staff member sees contacts assigned specifically to them here,
// presented like an email/task: subject, sender, date, and a flowing
// message body. Two-step accountability: Acknowledge Task, then
// Mark Complete. Once completed, the item collapses to a single line.

import { useState, useEffect } from "react";

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
};

const STAFF_NAMES = {
  avy: "Avrial Evans", travis: "Travis Ramar", deann: "Deann Evans",
  erica: "Erica Evans", ialana: "Ialana Tippins", aubreyon: "AuBreyon Woodley", dennis: "Dennis Pride",
};

function getCurrentStaffId() {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem("gtm_current_user");
}

// Renders notes as flowing paragraph(s) — like a real email body, not a
// stack of individually broken-out sentences. Only actual line breaks the
// person typed create paragraph splits; everything else wraps naturally.
function NotesBody({ notes }) {
  if (!notes || !notes.trim()) {
    return <p style={{ margin: 0, color: C.muted, fontSize: 14, fontStyle: "italic" }}>No additional notes.</p>;
  }
  if (notes.includes("\n")) {
    return notes.split(/\n+/).map((p, i) => (
      <p key={i} style={{ margin: i === 0 ? "0 0 14px" : "0 0 14px", color: C.text, fontSize: 14, lineHeight: 1.8 }}>
        {p.trim()}
      </p>
    ));
  }
  return <p style={{ margin: 0, color: C.text, fontSize: 14, lineHeight: 1.8 }}>{notes}</p>;
}

function formatDateTime(iso) {
  if (!iso) return "";
  return new Date(iso).toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" });
}

export default function MyOutreachContacts() {
  const [staffId, setStaffId] = useState(null);
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);

  useEffect(() => {
    const id = getCurrentStaffId();
    setStaffId(id);
    if (id) loadContacts(id);
    else setLoading(false);
  }, []);

  function loadContacts(id) {
    fetch("/api/outreach-contacts?assignedTo=" + id)
      .then((r) => r.json())
      .then((d) => setContacts(d.contacts || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }

  async function acknowledgeTask(c) {
    setBusyId(c.id);
    try {
      await fetch("/api/outreach-contacts", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: c.id, acknowledged: true, acknowledgedBy: STAFF_NAMES[staffId] }),
      });
      loadContacts(staffId);
    } finally {
      setBusyId(null);
    }
  }

  async function markComplete(c) {
    setBusyId(c.id);
    try {
      await fetch("/api/outreach-contacts", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: c.id, completed: true, completedBy: STAFF_NAMES[staffId] }),
      });
      loadContacts(staffId);
    } finally {
      setBusyId(null);
    }
  }

  if (!staffId) {
    return (
      <div style={{ minHeight: "100vh", background: C.dark, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Inter','Segoe UI',sans-serif" }}>
        <div style={{ color: C.muted, fontSize: 14 }}>Please log in through the main portal first.</div>
      </div>
    );
  }

  const pending = contacts.filter((c) => !c.completed);
  const done = contacts.filter((c) => c.completed);

  return (
    <div style={{ minHeight: "100vh", background: C.dark, fontFamily: "'Inter','Segoe UI',sans-serif" }}>
      <div style={{ background: "linear-gradient(135deg," + C.burgundyDark + " 0%," + C.dark + " 70%)", borderBottom: "2px solid " + C.gold, padding: "20px 24px" }}>
        <div style={{ maxWidth: 780, margin: "0 auto" }}>
          <div style={{ color: C.gold, fontSize: 11, fontWeight: 800, letterSpacing: 2, textTransform: "uppercase" }}>{STAFF_NAMES[staffId] || "Staff"}</div>
          <div style={{ color: C.ivory, fontSize: 24, fontWeight: 900, marginTop: 4 }}>My Outreach Contacts</div>
          <div style={{ color: C.muted, fontSize: 13, marginTop: 4 }}>Organizations and people leadership needs you to reach out to</div>
        </div>
      </div>

      <div style={{ maxWidth: 780, margin: "0 auto", padding: "24px 20px" }}>
        <a href="/" style={{ display: "inline-block", background: "transparent", border: "1px solid " + C.cardBorder, borderRadius: 8, padding: "7px 14px", color: C.muted, fontSize: 12, textDecoration: "none", marginBottom: 20 }}>
          ← Back to Portal
        </a>

        {loading ? (
          <p style={{ color: C.muted, fontSize: 14 }}>Loading…</p>
        ) : contacts.length === 0 ? (
          <div style={{ background: C.card, border: "1px solid " + C.cardBorder, borderRadius: 12, padding: "24px 20px", textAlign: "center" }}>
            <div style={{ fontSize: 28, marginBottom: 10 }}>📇</div>
            <div style={{ color: C.muted, fontSize: 14 }}>No contacts assigned to you right now.</div>
          </div>
        ) : (
          <>
            {pending.length > 0 && (
              <div style={{ marginBottom: 24 }}>
                <div style={{ color: C.gold, fontSize: 12, fontWeight: 800, letterSpacing: 1, textTransform: "uppercase", marginBottom: 10 }}>To Do ({pending.length})</div>
                {pending.map((c) => (
                  <div key={c.id} style={{ background: C.card, border: "1px solid " + C.gold + "66", borderRadius: 12, overflow: "hidden", marginBottom: 14 }}>
                    {/* Header — reads like an email header block */}
                    <div style={{ padding: "18px 22px", borderBottom: "1px solid " + C.cardBorder, background: C.dark }}>
                      <div style={{ color: C.ivory, fontWeight: 800, fontSize: 17, marginBottom: 10 }}>{c.organization_name}</div>
                      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                        <div style={{ fontSize: 12 }}>
                          <span style={{ color: C.gold, fontWeight: 700 }}>From: </span>
                          <span style={{ color: C.muted }}>{c.assigned_by || "Leadership"}</span>
                        </div>
                        <div style={{ fontSize: 12 }}>
                          <span style={{ color: C.gold, fontWeight: 700 }}>Date: </span>
                          <span style={{ color: C.muted }}>{formatDateTime(c.created_at)}</span>
                        </div>
                        {(c.contact_name || c.phone) && (
                          <div style={{ fontSize: 12 }}>
                            <span style={{ color: C.gold, fontWeight: 700 }}>Contact: </span>
                            <span style={{ color: C.muted }}>{c.contact_name || ""}{c.contact_name && c.phone ? " — " : ""}{c.phone || ""}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Body — the message itself */}
                    <div style={{ padding: "20px 22px" }}>
                      <NotesBody notes={c.notes} />
                    </div>

                    {/* Footer — actions and accountability trail */}
                    <div style={{ padding: "14px 22px", borderTop: "1px solid " + C.cardBorder, display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                      {!c.acknowledged ? (
                        <button onClick={() => acknowledgeTask(c)} disabled={busyId === c.id}
                          style={{ background: C.burgundy, border: "1px solid " + C.gold + "66", borderRadius: 8, padding: "9px 18px", color: C.ivory, fontSize: 13, fontWeight: 800, cursor: busyId === c.id ? "default" : "pointer" }}>
                          {busyId === c.id ? "…" : "Acknowledge Task"}
                        </button>
                      ) : (
                        <>
                          <span style={{ color: "#4CAF50", fontSize: 12, fontWeight: 700 }}>
                            ✓ Acknowledged {formatDateTime(c.acknowledged_at)}
                          </span>
                          <button onClick={() => markComplete(c)} disabled={busyId === c.id}
                            style={{ background: C.green, border: "none", borderRadius: 8, padding: "9px 18px", color: C.ivory, fontSize: 13, fontWeight: 800, cursor: busyId === c.id ? "default" : "pointer", marginLeft: "auto" }}>
                            {busyId === c.id ? "…" : "Mark Complete"}
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {done.length > 0 && (
              <div>
                <div style={{ color: "#4CAF50", fontSize: 12, fontWeight: 800, letterSpacing: 1, textTransform: "uppercase", marginBottom: 10 }}>Completed ({done.length})</div>
                {done.map((c) => (
                  <div key={c.id} style={{ background: C.card, border: "1px solid " + C.cardBorder, borderRadius: 10, padding: "12px 16px", marginBottom: 8, display: "flex", alignItems: "center", gap: 10, opacity: 0.75 }}>
                    <span style={{ color: "#4CAF50", fontSize: 15 }}>✓</span>
                    <span style={{ color: C.text, fontWeight: 700, fontSize: 13, flex: 1, textDecoration: "line-through" }}>{c.organization_name}</span>
                    <span style={{ color: "#4CAF50", fontSize: 12 }}>Completed {formatDateTime(c.completed_at)} by {c.completed_by}</span>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
