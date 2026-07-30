"use client";

// app/my-outreach-contacts/page.jsx
//
// Any staff member sees contacts assigned specifically to them here,
// with a checkbox to mark completed. Completion is timestamped and
// attributed, visible to leadership in the admin view.

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

export default function MyOutreachContacts() {
  const [staffId, setStaffId] = useState(null);
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

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

  async function toggleComplete(c) {
    setUpdatingId(c.id);
    try {
      await fetch("/api/outreach-contacts", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: c.id, completed: !c.completed, completedBy: STAFF_NAMES[staffId] }),
      });
      loadContacts(staffId);
    } finally {
      setUpdatingId(null);
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
        <div style={{ maxWidth: 700, margin: "0 auto" }}>
          <div style={{ color: C.gold, fontSize: 11, fontWeight: 800, letterSpacing: 2, textTransform: "uppercase" }}>{STAFF_NAMES[staffId] || "Staff"}</div>
          <div style={{ color: C.ivory, fontSize: 24, fontWeight: 900, marginTop: 4 }}>My Outreach Contacts</div>
          <div style={{ color: C.muted, fontSize: 13, marginTop: 4 }}>Organizations and people leadership needs you to reach out to</div>
        </div>
      </div>

      <div style={{ maxWidth: 700, margin: "0 auto", padding: "24px 20px" }}>
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
                  <div key={c.id} style={{ background: C.card, border: "1px solid " + C.gold + "66", borderRadius: 12, padding: "14px 16px", marginBottom: 10, display: "flex", gap: 14 }}>
                    <input type="checkbox" checked={false} disabled={updatingId === c.id} onChange={() => toggleComplete(c)}
                      style={{ width: 20, height: 20, marginTop: 2, flexShrink: 0, cursor: "pointer" }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ color: C.ivory, fontWeight: 800, fontSize: 15 }}>{c.organization_name}</div>
                      {c.contact_name && <div style={{ color: C.text, fontSize: 13, marginTop: 3 }}>{c.contact_name}</div>}
                      {c.phone && <div style={{ color: C.gold, fontSize: 13, marginTop: 2 }}>📞 {c.phone}</div>}
                      {c.notes && <div style={{ color: C.muted, fontSize: 13, marginTop: 6, lineHeight: 1.5 }}>{c.notes}</div>}
                      <div style={{ color: C.muted, fontSize: 11, marginTop: 6 }}>Assigned by {c.assigned_by || "leadership"} — {new Date(c.created_at).toLocaleDateString()}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {done.length > 0 && (
              <div>
                <div style={{ color: "#4CAF50", fontSize: 12, fontWeight: 800, letterSpacing: 1, textTransform: "uppercase", marginBottom: 10 }}>Completed ({done.length})</div>
                {done.map((c) => (
                  <div key={c.id} style={{ background: C.card, border: "1px solid " + C.cardBorder, borderRadius: 12, padding: "14px 16px", marginBottom: 10, display: "flex", gap: 14, opacity: 0.7 }}>
                    <input type="checkbox" checked={true} disabled={updatingId === c.id} onChange={() => toggleComplete(c)}
                      style={{ width: 20, height: 20, marginTop: 2, flexShrink: 0, cursor: "pointer" }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ color: C.text, fontWeight: 700, fontSize: 14, textDecoration: "line-through" }}>{c.organization_name}</div>
                      <div style={{ color: "#4CAF50", fontSize: 12, marginTop: 4 }}>Completed {new Date(c.completed_at).toLocaleDateString()}</div>
                    </div>
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