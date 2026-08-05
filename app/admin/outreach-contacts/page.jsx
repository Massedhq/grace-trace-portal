"use client";

// app/admin/outreach-contacts/page.jsx
//
// Leadership assigns specific contacts to reach out to — organization,
// contact name, phone, notes — to a staff member. Tracks who completed
// what and when.

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
  error: "#EF5350",
};

const STAFF = [
  { id: "avy", name: "Avrial Evans (Avy)" },
  { id: "travis", name: "Travis Ramar" },
  { id: "deann", name: "Deann Evans" },
  { id: "erica", name: "Erica Evans" },
  { id: "ialana", name: "Ialana Tippins" },
  { id: "aubreyon", name: "AuBreyon Woodley" },
  { id: "dennis", name: "Dennis Pride" },
];
const STAFF_NAMES = Object.fromEntries(STAFF.map((s) => [s.id, s.name]));

function getCurrentStaffId() {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem("gtm_current_user");
}
function isLeadership(id) {
  return id === "avy" || id === "travis";
}

// Breaks a long notes string into readable paragraphs. If the person already
// typed line breaks, those are respected as-is. Otherwise, the text is split
// on sentence boundaries so a dense paragraph doesn't render as one unbroken
// wall of text.
function formatNotesIntoParagraphs(text) {
  if (!text) return [];
  if (text.includes("\n")) {
    return text.split(/\n+/).map((p) => p.trim()).filter(Boolean);
  }
  const sentences = text.split(/(?<=[.?!])\s+(?=[A-Z"“])/).map((s) => s.trim()).filter(Boolean);
  return sentences.length > 1 ? sentences : [text.trim()];
}

function NotesBlock({ notes }) {
  const paragraphs = formatNotesIntoParagraphs(notes);
  if (paragraphs.length === 0) return null;
  return (
    <div style={{ marginTop: 10, background: C.dark, border: "1px solid " + C.cardBorder, borderRadius: 8, padding: "12px 14px" }}>
      {paragraphs.map((p, i) => (
        <p key={i} style={{ color: C.text, fontSize: 13, lineHeight: 1.7, margin: i === paragraphs.length - 1 ? 0 : "0 0 10px" }}>
          {p}
        </p>
      ))}
    </div>
  );
}

const emptyForm = { organizationName: "", contactName: "", phone: "", notes: "", assignedTo: "deann" };

export default function OutreachContactsAdmin() {
  const [staffId, setStaffId] = useState(null);
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [filterStaff, setFilterStaff] = useState("");
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  useEffect(() => {
    setStaffId(getCurrentStaffId());
    loadContacts();
  }, []);

  function loadContacts() {
    setLoading(true);
    fetch("/api/outreach-contacts")
      .then((r) => r.json())
      .then((d) => setContacts(d.contacts || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }

  const leadership = isLeadership(staffId);
  const currentName = STAFF_NAMES[staffId] || "Unknown";

  if (!staffId) return <div style={{ minHeight: "100vh", background: C.dark, display: "flex", alignItems: "center", justifyContent: "center", color: C.muted }}>Loading…</div>;
  if (!leadership) {
    return (
      <div style={{ minHeight: "100vh", background: C.dark, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Inter','Segoe UI',sans-serif" }}>
        <div style={{ color: C.error, fontSize: 15 }}>This page is only available to Avy and Travis.</div>
      </div>
    );
  }

  function update(field, val) {
    setForm((f) => ({ ...f, [field]: val }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.organizationName.trim()) {
      setError("Organization name is required.");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/outreach-contacts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, assignedBy: currentName }),
      });
      if (!res.ok) throw new Error("Failed to save");
      setForm(emptyForm);
      loadContacts();
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id) {
    await fetch("/api/outreach-contacts", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    setConfirmDeleteId(null);
    loadContacts();
  }

  const filtered = filterStaff ? contacts.filter((c) => c.assigned_to === filterStaff) : contacts;
  const pending = filtered.filter((c) => !c.completed);
  const done = filtered.filter((c) => c.completed);

  return (
    <div style={{ minHeight: "100vh", background: C.dark, fontFamily: "'Inter','Segoe UI',sans-serif" }}>
      <div style={{ background: "linear-gradient(135deg," + C.burgundyDark + " 0%," + C.dark + " 70%)", borderBottom: "2px solid " + C.gold, padding: "20px 24px" }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <div style={{ color: C.gold, fontSize: 11, fontWeight: 800, letterSpacing: 2, textTransform: "uppercase" }}>Leadership Only</div>
          <div style={{ color: C.ivory, fontSize: 24, fontWeight: 900, marginTop: 4 }}>Assign Outreach Contacts</div>
          <div style={{ color: C.muted, fontSize: 13, marginTop: 4 }}>Fill in specific organizations and contacts for staff to reach out to</div>
        </div>
      </div>

      <div style={{ maxWidth: 800, margin: "0 auto", padding: "24px 20px" }}>
        <a href="/" style={{ display: "inline-block", background: "transparent", border: "1px solid " + C.cardBorder, borderRadius: 8, padding: "7px 14px", color: C.muted, fontSize: 12, textDecoration: "none", marginBottom: 20 }}>
          ← Back to Portal
        </a>

        <form onSubmit={handleSubmit} style={{ background: C.card, border: "1px solid " + C.cardBorder, borderRadius: 12, padding: 20, marginBottom: 28 }}>
          <div style={{ color: C.gold, fontSize: 11, fontWeight: 800, letterSpacing: 1, textTransform: "uppercase", marginBottom: 14 }}>New Contact Assignment</div>

          <div style={{ marginBottom: 14 }}>
            <label style={{ color: C.text, fontSize: 12, fontWeight: 700, display: "block", marginBottom: 6 }}>Assign To</label>
            <select value={form.assignedTo} onChange={(e) => update("assignedTo", e.target.value)}
              style={{ width: "100%", background: C.dark, border: "1px solid " + C.cardBorder, borderRadius: 8, padding: "9px 12px", color: C.text, fontSize: 13 }}>
              {STAFF.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>

          <div style={{ marginBottom: 14 }}>
            <label style={{ color: C.text, fontSize: 12, fontWeight: 700, display: "block", marginBottom: 6 }}>Organization Name</label>
            <input type="text" value={form.organizationName} onChange={(e) => update("organizationName", e.target.value)}
              placeholder="e.g. Henderson County Veterans Service Office"
              style={{ width: "100%", background: C.dark, border: "1px solid " + C.cardBorder, borderRadius: 8, padding: "9px 12px", color: C.text, fontSize: 13 }} />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
            <div>
              <label style={{ color: C.text, fontSize: 12, fontWeight: 700, display: "block", marginBottom: 6 }}>Contact Name</label>
              <input type="text" value={form.contactName} onChange={(e) => update("contactName", e.target.value)}
                placeholder="If known"
                style={{ width: "100%", background: C.dark, border: "1px solid " + C.cardBorder, borderRadius: 8, padding: "9px 12px", color: C.text, fontSize: 13 }} />
            </div>
            <div>
              <label style={{ color: C.text, fontSize: 12, fontWeight: 700, display: "block", marginBottom: 6 }}>Phone Number</label>
              <input type="text" value={form.phone} onChange={(e) => update("phone", e.target.value)}
                placeholder="If known"
                style={{ width: "100%", background: C.dark, border: "1px solid " + C.cardBorder, borderRadius: 8, padding: "9px 12px", color: C.text, fontSize: 13 }} />
            </div>
          </div>

          <div style={{ marginBottom: 14 }}>
            <label style={{ color: C.text, fontSize: 12, fontWeight: 700, display: "block", marginBottom: 6 }}>Notes — why reach out, what to ask</label>
            <textarea value={form.notes} onChange={(e) => update("notes", e.target.value)} rows={6}
              placeholder="Tip: press Enter between separate points or questions — it keeps things organized when Deann reads it back."
              style={{ width: "100%", background: C.dark, border: "1px solid " + C.cardBorder, borderRadius: 8, padding: "9px 12px", color: C.text, fontSize: 13, resize: "vertical", fontFamily: "inherit", lineHeight: 1.6 }} />
          </div>

          {error && <div style={{ color: C.error, fontSize: 13, marginBottom: 12 }}>{error}</div>}

          <button type="submit" disabled={submitting}
            style={{ width: "100%", background: C.green, border: "none", borderRadius: 8, padding: "12px", color: C.ivory, fontSize: 14, fontWeight: 800, cursor: "pointer" }}>
            {submitting ? "Saving…" : "Assign Contact"}
          </button>
        </form>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14, flexWrap: "wrap", gap: 10 }}>
          <div style={{ color: C.gold, fontSize: 11, fontWeight: 800, letterSpacing: 1, textTransform: "uppercase" }}>
            All Assignments ({filtered.length})
          </div>
          <select value={filterStaff} onChange={(e) => setFilterStaff(e.target.value)}
            style={{ background: C.card, border: "1px solid " + C.cardBorder, borderRadius: 8, padding: "7px 12px", color: C.text, fontSize: 12 }}>
            <option value="">Everyone</option>
            {STAFF.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
        </div>

        {loading ? (
          <p style={{ color: C.muted, fontSize: 14 }}>Loading…</p>
        ) : (
          <>
            {pending.length > 0 && (
              <div style={{ marginBottom: 20 }}>
                <div style={{ color: C.gold, fontSize: 12, fontWeight: 700, marginBottom: 8 }}>⏳ Pending ({pending.length})</div>
                {pending.map((c) => (
                  <div key={c.id} style={{ background: C.card, border: "1px solid " + C.cardBorder, borderRadius: 10, padding: "14px 16px", marginBottom: 8 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10 }}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ color: C.muted, fontSize: 11, marginBottom: 3 }}>Assigned to {STAFF_NAMES[c.assigned_to]}</div>
                        <div style={{ color: C.text, fontWeight: 700, fontSize: 15 }}>{c.organization_name}</div>
                        {c.contact_name && <div style={{ color: C.muted, fontSize: 12, marginTop: 2 }}>{c.contact_name}{c.phone ? " — " + c.phone : ""}</div>}
                        <NotesBlock notes={c.notes} />
                      </div>
                      {confirmDeleteId === c.id ? (
                        <span style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                          <button onClick={() => handleDelete(c.id)} style={{ background: C.error, border: "none", borderRadius: 6, padding: "4px 10px", color: "white", fontSize: 11, cursor: "pointer" }}>Confirm</button>
                          <button onClick={() => setConfirmDeleteId(null)} style={{ background: "transparent", border: "1px solid " + C.cardBorder, borderRadius: 6, padding: "4px 10px", color: C.muted, fontSize: 11, cursor: "pointer" }}>Cancel</button>
                        </span>
                      ) : (
                        <button onClick={() => setConfirmDeleteId(c.id)} style={{ background: "transparent", border: "1px solid " + C.cardBorder, borderRadius: 6, padding: "4px 10px", color: C.muted, fontSize: 11, cursor: "pointer", flexShrink: 0 }}>Delete</button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {done.length > 0 && (
              <div>
                <div style={{ color: C.green, fontSize: 12, fontWeight: 700, marginBottom: 8 }}>✅ Completed ({done.length})</div>
                {done.map((c) => (
                  <div key={c.id} style={{ background: C.card, border: "1px solid " + C.cardBorder, borderRadius: 10, padding: "12px 16px", marginBottom: 8, opacity: 0.75 }}>
                    <div style={{ color: C.muted, fontSize: 11, marginBottom: 2 }}>Assigned to {STAFF_NAMES[c.assigned_to]}</div>
                    <div style={{ color: C.text, fontWeight: 700, fontSize: 14 }}>{c.organization_name}</div>
                    <div style={{ color: "#4CAF50", fontSize: 12, marginTop: 4 }}>
                      Completed {new Date(c.completed_at).toLocaleDateString()} by {c.completed_by}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {filtered.length === 0 && <p style={{ color: C.muted, fontSize: 14 }}>No contacts assigned yet.</p>}
          </>
        )}
      </div>
    </div>
  );
}