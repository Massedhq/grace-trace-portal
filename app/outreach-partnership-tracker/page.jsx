"use client";

// app/outreach-partnership-tracker/page.jsx
//
// Shared Outreach Partnership Contact Tracker for Avy and Deann.
// No assignment model — both work every contact collaboratively.
// Active Tracker holds working contacts; Mark Complete moves a contact
// permanently into the Completed Partnership File (the official record).

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

const STAFF_NAMES = {
  avy: "Avrial Evans (Avy)", travis: "Travis Ramar", deann: "Deann Evans",
  erica: "Erica Evans", ialana: "Ialana Tippins", aubreyon: "AuBreyon Woodley", dennis: "Dennis Pride",
};

const ORG_TYPES = ["Workforce", "TDCJ", "VA", "Court", "Community Org", "Faith-Based", "Employer", "Other"];
const STATUSES = ["Not Started", "In Progress", "Waiting on Response", "Information Gathered", "Application Submitted"];

const STATUS_COLORS = {
  "Not Started": C.muted,
  "In Progress": C.gold,
  "Waiting on Response": "#D98C3C",
  "Information Gathered": "#4C9FC9",
  "Application Submitted": "#4CAF50",
};

const GATHERED_FIELDS = [
  { key: "whoToSpeakTo", label: "Who to speak to for partnerships", ph: "Name, title, department" },
  { key: "howToApply", label: "How to apply", ph: "Steps to apply or initiate a partnership" },
  { key: "applicationPaperwork", label: "Application / paperwork needed", ph: "Forms, documentation, requirements" },
  { key: "hiringProcess", label: "Hiring process", ph: "If applicable — how their hiring process works" },
  { key: "processingRequirements", label: "Processing requirements", ph: "Timelines, approvals, review steps" },
  { key: "partnershipAgreementDetails", label: "Partnership agreement details", ph: "MOU terms, referral terms, formal agreement notes" },
];

const BLANK_FORM = {
  organizationName: "", region: "", orgType: "",
  contactName: "", contactTitle: "", contactPhone: "", contactEmail: "",
  whoToSpeakTo: "", howToApply: "", applicationPaperwork: "",
  hiringProcess: "", processingRequirements: "", partnershipAgreementDetails: "",
  status: "Not Started",
};

function getCurrentStaffId() {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem("gtm_current_user");
}

function fieldStyle(hasValue) {
  return {
    width: "100%", background: C.dark, border: "1px solid " + (hasValue ? C.green : C.cardBorder),
    borderRadius: 8, padding: "9px 12px", color: C.text, fontSize: 13, outline: "none",
    fontFamily: "inherit", lineHeight: 1.6,
  };
}

function labelStyle() {
  return { color: C.text, fontSize: 12, fontWeight: 700, marginBottom: 5, display: "block" };
}

export default function OutreachPartnershipTracker() {
  const [staffId, setStaffId] = useState(null);
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newForm, setNewForm] = useState(BLANK_FORM);
  const [saving, setSaving] = useState(false);
  const [expandedId, setExpandedId] = useState(null);
  const [editForms, setEditForms] = useState({});
  const [newNoteText, setNewNoteText] = useState({});
  const [busyId, setBusyId] = useState(null);
  const [confirmCompleteId, setConfirmCompleteId] = useState(null);

  useEffect(() => {
    const id = getCurrentStaffId();
    setStaffId(id);
    if (id) loadContacts();
    else setLoading(false);
  }, []);

  function loadContacts() {
    fetch("/api/outreach-partnership-tracker")
      .then((r) => r.json())
      .then((d) => setContacts(d.contacts || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }

  const actorName = STAFF_NAMES[staffId] || staffId;
  const authorized = staffId === "avy" || staffId === "deann";

  function updateNewForm(key, val) {
    setNewForm((f) => ({ ...f, [key]: val }));
  }

  async function submitNewContact() {
    if (!newForm.organizationName.trim()) return;
    setSaving(true);
    try {
      await fetch("/api/outreach-partnership-tracker", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...newForm, createdBy: actorName }),
      });
      setNewForm(BLANK_FORM);
      setShowAddForm(false);
      loadContacts();
    } finally {
      setSaving(false);
    }
  }

  function startEdit(c) {
    setEditForms((prev) => ({
      ...prev,
      [c.id]: {
        organizationName: c.organization_name || "", region: c.region || "", orgType: c.org_type || "",
        contactName: c.contact_name || "", contactTitle: c.contact_title || "",
        contactPhone: c.contact_phone || "", contactEmail: c.contact_email || "",
        whoToSpeakTo: c.who_to_speak_to || "", howToApply: c.how_to_apply || "",
        applicationPaperwork: c.application_paperwork || "", hiringProcess: c.hiring_process || "",
        processingRequirements: c.processing_requirements || "",
        partnershipAgreementDetails: c.partnership_agreement_details || "",
        status: c.status || "Not Started",
      },
    }));
    setExpandedId(c.id);
  }

  function updateEditField(id, key, val) {
    setEditForms((prev) => ({ ...prev, [id]: { ...prev[id], [key]: val } }));
  }

  async function saveEdit(id) {
    setBusyId(id);
    try {
      await fetch("/api/outreach-partnership-tracker", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, action: "update", actorName, ...editForms[id] }),
      });
      loadContacts();
    } finally {
      setBusyId(null);
    }
  }

  async function quickStatusChange(c, status) {
    setBusyId(c.id);
    try {
      await fetch("/api/outreach-partnership-tracker", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: c.id, action: "update", actorName, status,
          organizationName: c.organization_name, region: c.region, orgType: c.org_type,
          contactName: c.contact_name, contactTitle: c.contact_title,
          contactPhone: c.contact_phone, contactEmail: c.contact_email,
          whoToSpeakTo: c.who_to_speak_to, howToApply: c.how_to_apply,
          applicationPaperwork: c.application_paperwork, hiringProcess: c.hiring_process,
          processingRequirements: c.processing_requirements,
          partnershipAgreementDetails: c.partnership_agreement_details,
        }),
      });
      loadContacts();
    } finally {
      setBusyId(null);
    }
  }

  async function addNote(id) {
    const text = (newNoteText[id] || "").trim();
    if (!text) return;
    setBusyId(id);
    try {
      await fetch("/api/outreach-partnership-tracker", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, action: "addNote", actorName, text }),
      });
      setNewNoteText((prev) => ({ ...prev, [id]: "" }));
      loadContacts();
    } finally {
      setBusyId(null);
    }
  }

  async function markComplete(id) {
    setBusyId(id);
    try {
      await fetch("/api/outreach-partnership-tracker", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, action: "markComplete", actorName }),
      });
      setConfirmCompleteId(null);
      setExpandedId(null);
      loadContacts();
    } finally {
      setBusyId(null);
    }
  }

  async function reopenContact(id) {
    setBusyId(id);
    try {
      await fetch("/api/outreach-partnership-tracker", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, action: "reopen", actorName }),
      });
      loadContacts();
    } finally {
      setBusyId(null);
    }
  }

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", background: C.dark, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Inter','Segoe UI',sans-serif" }}>
        <div style={{ color: C.muted, fontSize: 14 }}>Loading…</div>
      </div>
    );
  }

  if (!staffId) {
    return (
      <div style={{ minHeight: "100vh", background: C.dark, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Inter','Segoe UI',sans-serif" }}>
        <div style={{ color: C.muted, fontSize: 14 }}>Please log in through the main portal first.</div>
      </div>
    );
  }

  if (!authorized) {
    return (
      <div style={{ minHeight: "100vh", background: C.dark, display: "flex", alignItems: "center", justifyContent: "center", padding: 20, fontFamily: "'Inter','Segoe UI',sans-serif" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ color: C.ivory, fontSize: 16, fontWeight: 700, marginBottom: 12 }}>This tracker is limited to Avy and Deann.</div>
          <a href="/" style={{ background: C.burgundy, border: "1px solid " + C.gold + "66", borderRadius: 8, padding: "11px 24px", color: C.ivory, fontSize: 14, fontWeight: 800, textDecoration: "none" }}>Go to Staff Portal</a>
        </div>
      </div>
    );
  }

  const active = contacts.filter((c) => !c.completed);
  const done = contacts.filter((c) => c.completed);

  return (
    <div style={{ minHeight: "100vh", background: C.dark, fontFamily: "'Inter','Segoe UI',sans-serif" }}>
      <div style={{ background: "linear-gradient(135deg," + C.burgundyDark + " 0%," + C.dark + " 70%)", borderBottom: "2px solid " + C.gold, padding: "20px 24px" }}>
        <div style={{ maxWidth: 860, margin: "0 auto" }}>
          <div style={{ color: C.gold, fontSize: 11, fontWeight: 800, letterSpacing: 2, textTransform: "uppercase" }}>Shared — Avy &amp; Deann</div>
          <div style={{ color: C.ivory, fontSize: 24, fontWeight: 900, marginTop: 4 }}>Outreach Partnership Contact Tracker</div>
          <div style={{ color: C.muted, fontSize: 13, marginTop: 4 }}>Working contacts and the official completed partnership record</div>
        </div>
      </div>

      <div style={{ maxWidth: 860, margin: "0 auto", padding: "24px 20px" }}>
        <a href="/" style={{ display: "inline-block", background: "transparent", border: "1px solid " + C.cardBorder, borderRadius: 8, padding: "7px 14px", color: C.muted, fontSize: 12, textDecoration: "none", marginBottom: 20 }}>
          ← Back to Portal
        </a>

        <button
          onClick={() => setShowAddForm((v) => !v)}
          style={{ width: "100%", background: showAddForm ? "transparent" : C.burgundy, border: "1px solid " + C.gold + "66", borderRadius: 10, padding: "13px", color: C.ivory, fontSize: 14, fontWeight: 800, cursor: "pointer", marginBottom: 16 }}
        >
          {showAddForm ? "Cancel" : "+ Add New Contact"}
        </button>

        {showAddForm && (
          <div style={{ background: C.card, border: "1px solid " + C.gold + "66", borderRadius: 12, padding: "18px 20px", marginBottom: 24 }}>
            <div style={{ color: C.gold, fontSize: 11, fontWeight: 800, letterSpacing: 1, textTransform: "uppercase", marginBottom: 14 }}>New Partnership Contact</div>

            <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 12, marginBottom: 12 }}>
              <div>
                <label style={labelStyle()}>Organization name *</label>
                <input type="text" value={newForm.organizationName} onChange={(e) => updateNewForm("organizationName", e.target.value)}
                  placeholder="e.g. TDCJ Parole Division — Houston" style={fieldStyle(!!newForm.organizationName)} />
              </div>
              <div>
                <label style={labelStyle()}>Region</label>
                <input type="text" value={newForm.region} onChange={(e) => updateNewForm("region", e.target.value)}
                  placeholder="e.g. Houston South" style={fieldStyle(!!newForm.region)} />
              </div>
            </div>

            <div style={{ marginBottom: 12 }}>
              <label style={labelStyle()}>Type</label>
              <select value={newForm.orgType} onChange={(e) => updateNewForm("orgType", e.target.value)} style={fieldStyle(!!newForm.orgType)}>
                <option value="">Select a type…</option>
                {ORG_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
              <div>
                <label style={labelStyle()}>Contact person name</label>
                <input type="text" value={newForm.contactName} onChange={(e) => updateNewForm("contactName", e.target.value)} style={fieldStyle(!!newForm.contactName)} />
              </div>
              <div>
                <label style={labelStyle()}>Title</label>
                <input type="text" value={newForm.contactTitle} onChange={(e) => updateNewForm("contactTitle", e.target.value)} style={fieldStyle(!!newForm.contactTitle)} />
              </div>
              <div>
                <label style={labelStyle()}>Phone</label>
                <input type="text" value={newForm.contactPhone} onChange={(e) => updateNewForm("contactPhone", e.target.value)} style={fieldStyle(!!newForm.contactPhone)} />
              </div>
              <div>
                <label style={labelStyle()}>Email</label>
                <input type="text" value={newForm.contactEmail} onChange={(e) => updateNewForm("contactEmail", e.target.value)} style={fieldStyle(!!newForm.contactEmail)} />
              </div>
            </div>

            <button
              onClick={submitNewContact}
              disabled={saving || !newForm.organizationName.trim()}
              style={{ width: "100%", background: newForm.organizationName.trim() ? C.green : C.cardBorder, border: "none", borderRadius: 8, padding: "12px", color: newForm.organizationName.trim() ? C.ivory : C.muted, fontSize: 14, fontWeight: 800, cursor: newForm.organizationName.trim() ? "pointer" : "not-allowed", marginTop: 4 }}
            >
              {saving ? "Saving…" : "Add Contact to Active Tracker"}
            </button>
            <div style={{ color: C.muted, fontSize: 12, marginTop: 8 }}>
              You can fill in the information gathered fields and notes once the contact is added.
            </div>
          </div>
        )}

        <div style={{ color: C.gold, fontSize: 11, fontWeight: 800, letterSpacing: 2, textTransform: "uppercase", marginBottom: 12 }}>
          Active Tracker ({active.length})
        </div>

        {active.length === 0 ? (
          <div style={{ background: C.card, border: "1px solid " + C.cardBorder, borderRadius: 12, padding: "24px 20px", textAlign: "center", marginBottom: 28 }}>
            <div style={{ fontSize: 28, marginBottom: 10 }}>📇</div>
            <div style={{ color: C.muted, fontSize: 14 }}>No active contacts yet. Add one above to get started.</div>
          </div>
        ) : (
          <div style={{ marginBottom: 28 }}>
            {active.map((c) => (
              <ContactCard
                key={c.id}
                c={c}
                expanded={expandedId === c.id}
                onToggle={() => (expandedId === c.id ? setExpandedId(null) : startEdit(c))}
                editForm={editForms[c.id]}
                onEditField={(key, val) => updateEditField(c.id, key, val)}
                onSave={() => saveEdit(c.id)}
                onQuickStatus={(status) => quickStatusChange(c, status)}
                busy={busyId === c.id}
                newNoteText={newNoteText[c.id] || ""}
                onNoteChange={(val) => setNewNoteText((prev) => ({ ...prev, [c.id]: val }))}
                onAddNote={() => addNote(c.id)}
                confirmingComplete={confirmCompleteId === c.id}
                onRequestComplete={() => setConfirmCompleteId(c.id)}
                onCancelComplete={() => setConfirmCompleteId(null)}
                onConfirmComplete={() => markComplete(c.id)}
                actorName={actorName}
              />
            ))}
          </div>
        )}

        <div style={{ color: "#4CAF50", fontSize: 11, fontWeight: 800, letterSpacing: 2, textTransform: "uppercase", marginBottom: 12 }}>
          Completed Partnership File ({done.length}) — Official Operations Record
        </div>

        {done.length === 0 ? (
          <div style={{ background: C.card, border: "1px solid " + C.cardBorder, borderRadius: 12, padding: "24px 20px", textAlign: "center" }}>
            <div style={{ fontSize: 28, marginBottom: 10 }}>✅</div>
            <div style={{ color: C.muted, fontSize: 14 }}>Completed partnerships will appear here permanently.</div>
          </div>
        ) : (
          done.map((c) => (
            <CompletedCard
              key={c.id}
              c={c}
              expanded={expandedId === c.id}
              onToggle={() => setExpandedId(expandedId === c.id ? null : c.id)}
              onReopen={() => reopenContact(c.id)}
              busy={busyId === c.id}
            />
          ))
        )}

        <div style={{ height: 48 }} />
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const color = STATUS_COLORS[status] || C.muted;
  return (
    <span style={{ background: color + "22", border: "1px solid " + color + "66", borderRadius: 20, padding: "3px 12px", color, fontSize: 11, fontWeight: 700 }}>
      {status}
    </span>
  );
}

function ContactCard({
  c, expanded, onToggle, editForm, onEditField, onSave, onQuickStatus, busy,
  newNoteText, onNoteChange, onAddNote, confirmingComplete, onRequestComplete, onCancelComplete, onConfirmComplete, actorName,
}) {
  const notesLog = Array.isArray(c.notes_log) ? c.notes_log : [];

  return (
    <div style={{ background: C.card, border: "1px solid " + C.cardBorder, borderRadius: 12, marginBottom: 10, overflow: "hidden" }}>
      <button
        onClick={onToggle}
        style={{ width: "100%", textAlign: "left", background: "transparent", border: "none", padding: "16px 18px", cursor: "pointer", display: "flex", alignItems: "center", gap: 14 }}
      >
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
            <span style={{ color: C.ivory, fontWeight: 800, fontSize: 15 }}>{c.organization_name}</span>
            <StatusBadge status={c.status} />
          </div>
          <div style={{ color: C.muted, fontSize: 12, marginTop: 4 }}>
            {[c.org_type, c.region].filter(Boolean).join(" — ") || "No type or region set"}
            {c.contact_name ? " · " + c.contact_name : ""}
          </div>
        </div>
        <span style={{ color: C.gold, fontSize: 18 }}>{expanded ? "−" : "+"}</span>
      </button>

      {!expanded && (
        <div style={{ padding: "0 18px 14px", display: "flex", gap: 8, flexWrap: "wrap" }}>
          {STATUSES.map((s) => (
            <button
              key={s}
              onClick={() => onQuickStatus(s)}
              disabled={busy}
              style={{
                background: c.status === s ? (STATUS_COLORS[s] + "33") : "transparent",
                border: "1px solid " + (c.status === s ? STATUS_COLORS[s] + "88" : C.cardBorder),
                borderRadius: 20, padding: "4px 10px", color: c.status === s ? STATUS_COLORS[s] : C.muted,
                fontSize: 11, fontWeight: 700, cursor: busy ? "default" : "pointer",
              }}
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {expanded && editForm && (
        <div style={{ padding: "0 18px 18px", borderTop: "1px solid " + C.cardBorder }}>
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 12, marginTop: 16 }}>
            <div>
              <label style={labelStyle()}>Organization name</label>
              <input type="text" value={editForm.organizationName} onChange={(e) => onEditField("organizationName", e.target.value)} style={fieldStyle(!!editForm.organizationName)} />
            </div>
            <div>
              <label style={labelStyle()}>Region</label>
              <input type="text" value={editForm.region} onChange={(e) => onEditField("region", e.target.value)} style={fieldStyle(!!editForm.region)} />
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 12 }}>
            <div>
              <label style={labelStyle()}>Type</label>
              <select value={editForm.orgType} onChange={(e) => onEditField("orgType", e.target.value)} style={fieldStyle(!!editForm.orgType)}>
                <option value="">Select a type…</option>
                {ORG_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle()}>Status</label>
              <select value={editForm.status} onChange={(e) => onEditField("status", e.target.value)} style={fieldStyle(!!editForm.status)}>
                {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>

          <div style={{ color: C.gold, fontSize: 11, fontWeight: 800, letterSpacing: 1, textTransform: "uppercase", margin: "18px 0 10px" }}>Contact Person</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div>
              <label style={labelStyle()}>Name</label>
              <input type="text" value={editForm.contactName} onChange={(e) => onEditField("contactName", e.target.value)} style={fieldStyle(!!editForm.contactName)} />
            </div>
            <div>
              <label style={labelStyle()}>Title</label>
              <input type="text" value={editForm.contactTitle} onChange={(e) => onEditField("contactTitle", e.target.value)} style={fieldStyle(!!editForm.contactTitle)} />
            </div>
            <div>
              <label style={labelStyle()}>Phone</label>
              <input type="text" value={editForm.contactPhone} onChange={(e) => onEditField("contactPhone", e.target.value)} style={fieldStyle(!!editForm.contactPhone)} />
            </div>
            <div>
              <label style={labelStyle()}>Email</label>
              <input type="text" value={editForm.contactEmail} onChange={(e) => onEditField("contactEmail", e.target.value)} style={fieldStyle(!!editForm.contactEmail)} />
            </div>
          </div>

          <div style={{ color: C.gold, fontSize: 11, fontWeight: 800, letterSpacing: 1, textTransform: "uppercase", margin: "18px 0 10px" }}>Information Gathered</div>
          {GATHERED_FIELDS.map((f) => (
            <div key={f.key} style={{ marginBottom: 12 }}>
              <label style={labelStyle()}>{f.label}</label>
              <textarea value={editForm[f.key]} onChange={(e) => onEditField(f.key, e.target.value)} placeholder={f.ph} rows={3} style={fieldStyle(!!editForm[f.key])} />
            </div>
          ))}

          <button onClick={onSave} disabled={busy} style={{ width: "100%", background: C.green, border: "none", borderRadius: 8, padding: "12px", color: C.ivory, fontSize: 13, fontWeight: 800, cursor: busy ? "default" : "pointer", marginTop: 4, marginBottom: 20 }}>
            {busy ? "Saving…" : "Save Changes"}
          </button>

          <div style={{ color: C.gold, fontSize: 11, fontWeight: 800, letterSpacing: 1, textTransform: "uppercase", marginBottom: 10 }}>Running Notes Log</div>
          {notesLog.length === 0 ? (
            <div style={{ color: C.muted, fontSize: 12, marginBottom: 12 }}>No notes yet.</div>
          ) : (
            <div style={{ marginBottom: 12 }}>
              {[...notesLog].reverse().map((n, i) => (
                <div key={i} style={{ background: C.dark, borderRadius: 8, padding: "10px 12px", marginBottom: 8 }}>
                  <div style={{ color: C.text, fontSize: 13, lineHeight: 1.6 }}>{n.text}</div>
                  <div style={{ color: C.muted, fontSize: 11, marginTop: 5 }}>
                    {n.author} — {new Date(n.timestamp).toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" })}
                  </div>
                </div>
              ))}
            </div>
          )}
          <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
            <input
              type="text" value={newNoteText} onChange={(e) => onNoteChange(e.target.value)}
              placeholder={"Add a note as " + actorName + "…"}
              onKeyDown={(e) => e.key === "Enter" && onAddNote()}
              style={{ ...fieldStyle(!!newNoteText), flex: 1 }}
            />
            <button onClick={onAddNote} disabled={busy || !newNoteText.trim()} style={{ background: C.burgundy, border: "1px solid " + C.gold + "66", borderRadius: 8, padding: "0 18px", color: C.ivory, fontSize: 13, fontWeight: 700, cursor: newNoteText.trim() ? "pointer" : "default" }}>
              Add
            </button>
          </div>

          {confirmingComplete ? (
            <div style={{ background: "#4CAF5022", border: "1px solid #4CAF5066", borderRadius: 10, padding: "14px 16px" }}>
              <div style={{ color: C.ivory, fontSize: 13, fontWeight: 700, marginBottom: 10 }}>
                Move this contact to the Completed Partnership File? This becomes the permanent official record.
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={onConfirmComplete} disabled={busy} style={{ flex: 1, background: "#4CAF50", border: "none", borderRadius: 8, padding: "10px", color: "#0D2410", fontSize: 13, fontWeight: 800, cursor: "pointer" }}>
                  {busy ? "Moving…" : "Yes, Mark Complete"}
                </button>
                <button onClick={onCancelComplete} style={{ background: "transparent", border: "1px solid " + C.cardBorder, borderRadius: 8, padding: "10px 16px", color: C.muted, fontSize: 13, cursor: "pointer" }}>
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <button onClick={onRequestComplete} style={{ width: "100%", background: "transparent", border: "1px solid #4CAF5066", borderRadius: 8, padding: "12px", color: "#4CAF50", fontSize: 13, fontWeight: 800, cursor: "pointer" }}>
              ✓ Mark Complete → Move to Completed Partnership File
            </button>
          )}
        </div>
      )}
    </div>
  );
}

function CompletedCard({ c, expanded, onToggle, onReopen, busy }) {
  const notesLog = Array.isArray(c.notes_log) ? c.notes_log : [];

  return (
    <div style={{ background: C.card, border: "1px solid #4CAF5044", borderRadius: 12, marginBottom: 10, overflow: "hidden" }}>
      <button
        onClick={onToggle}
        style={{ width: "100%", textAlign: "left", background: "transparent", border: "none", padding: "16px 18px", cursor: "pointer", display: "flex", alignItems: "center", gap: 14 }}
      >
        <span style={{ fontSize: 18 }}>✅</span>
        <div style={{ flex: 1 }}>
          <div style={{ color: C.text, fontWeight: 700, fontSize: 14 }}>{c.organization_name}</div>
          <div style={{ color: "#4CAF50", fontSize: 12, marginTop: 3 }}>
            Completed {c.completed_at ? new Date(c.completed_at).toLocaleDateString() : ""}{c.completed_by ? " by " + c.completed_by : ""}
          </div>
        </div>
        <span style={{ color: C.gold, fontSize: 18 }}>{expanded ? "−" : "+"}</span>
      </button>

      {expanded && (
        <div style={{ padding: "0 18px 18px", borderTop: "1px solid " + C.cardBorder }}>
          <div style={{ marginTop: 16, marginBottom: 6, color: C.muted, fontSize: 12 }}>
            {[c.org_type, c.region].filter(Boolean).join(" — ")}
          </div>

          {c.contact_name && (
            <div style={{ marginBottom: 14 }}>
              <div style={{ color: C.gold, fontSize: 11, fontWeight: 800, letterSpacing: 1, textTransform: "uppercase", marginBottom: 6 }}>Contact Person</div>
              <div style={{ color: C.text, fontSize: 13 }}>{c.contact_name}{c.contact_title ? " — " + c.contact_title : ""}</div>
              {c.contact_phone && <div style={{ color: C.muted, fontSize: 13 }}>📞 {c.contact_phone}</div>}
              {c.contact_email && <div style={{ color: C.muted, fontSize: 13 }}>✉️ {c.contact_email}</div>}
            </div>
          )}

          <div style={{ color: C.gold, fontSize: 11, fontWeight: 800, letterSpacing: 1, textTransform: "uppercase", marginBottom: 8 }}>Information Gathered</div>
          {GATHERED_FIELDS.map((f) => {
            const dbKey = f.key.replace(/([A-Z])/g, "_$1").toLowerCase();
            const val = c[dbKey];
            if (!val) return null;
            return (
              <div key={f.key} style={{ marginBottom: 10 }}>
                <div style={{ color: C.muted, fontSize: 12, fontWeight: 700 }}>{f.label}</div>
                <div style={{ color: C.text, fontSize: 13, marginTop: 2, lineHeight: 1.6 }}>{val}</div>
              </div>
            );
          })}

          {notesLog.length > 0 && (
            <>
              <div style={{ color: C.gold, fontSize: 11, fontWeight: 800, letterSpacing: 1, textTransform: "uppercase", margin: "16px 0 8px" }}>Notes Log</div>
              {[...notesLog].reverse().map((n, i) => (
                <div key={i} style={{ background: C.dark, borderRadius: 8, padding: "10px 12px", marginBottom: 8 }}>
                  <div style={{ color: C.text, fontSize: 13, lineHeight: 1.6 }}>{n.text}</div>
                  <div style={{ color: C.muted, fontSize: 11, marginTop: 5 }}>
                    {n.author} — {new Date(n.timestamp).toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" })}
                  </div>
                </div>
              ))}
            </>
          )}

          <button onClick={onReopen} disabled={busy} style={{ width: "100%", background: "transparent", border: "1px solid " + C.cardBorder, borderRadius: 8, padding: "10px", color: C.muted, fontSize: 12, cursor: "pointer", marginTop: 16 }}>
            {busy ? "Reopening…" : "↺ Reopen to Active Tracker"}
          </button>
        </div>
      )}
    </div>
  );
}