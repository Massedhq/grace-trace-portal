"use client";

// app/admin/resource-templates/page.jsx
//
// Leadership-only console for creating, editing, and deleting resource
// templates, and assigning each one to a staff member (or "all staff"),
// a category/folder, and a section.

import { useState, useEffect } from "react";
import { CATEGORIES as OUTREACH_CATEGORIES } from "@/lib/outreachResourceContent";

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

const SECTIONS = ["Learning Center", "Templates", "Forms", "Documents", "Completed Examples"];

function getCurrentStaffId() {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem("gtm_current_user");
}

function isLeadership(id) {
  return id === "avy" || id === "travis";
}

const emptyForm = { id: null, directorId: "deann", category: "", section: "Templates", title: "", body: "" };

export default function ResourceTemplatesAdmin() {
  const [staffId, setStaffId] = useState(null);
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [filterDirector, setFilterDirector] = useState("");
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  useEffect(() => {
    setStaffId(getCurrentStaffId());
    loadTemplates();
  }, []);

  function loadTemplates() {
    setLoading(true);
    fetch("/api/resource-templates")
      .then((r) => r.json())
      .then((d) => setTemplates(d.templates || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }

  const leadership = isLeadership(staffId);
  const currentName = STAFF_NAMES[staffId] || "Unknown";

  if (!staffId) {
    return <div style={{ minHeight: "100vh", background: C.dark, display: "flex", alignItems: "center", justifyContent: "center", color: C.muted }}>Loading…</div>;
  }

  if (!leadership) {
    return (
      <div style={{ minHeight: "100vh", background: C.dark, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Inter','Segoe UI',sans-serif" }}>
        <div style={{ color: C.error, fontSize: 15, textAlign: "center" }}>
          This page is only available to Avy and Travis.
        </div>
      </div>
    );
  }

  function update(field, val) {
    setForm((f) => ({ ...f, [field]: val }));
  }

  function startEdit(t) {
    setForm({ id: t.id, directorId: t.director_id, category: t.category, section: t.section, title: t.title, body: t.body });
    setEditingId(t.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function cancelEdit() {
    setForm(emptyForm);
    setEditingId(null);
    setError(null);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.category.trim() || !form.title.trim() || !form.body.trim()) {
      setError("Category, title, and body are all required.");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      if (editingId) {
        const res = await fetch("/api/resource-templates", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: editingId, directorId: form.directorId, category: form.category,
            section: form.section, title: form.title, body: form.body, updatedBy: currentName,
          }),
        });
        if (!res.ok) throw new Error("Failed to update template");
      } else {
        const res = await fetch("/api/resource-templates", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            directorId: form.directorId, category: form.category, section: form.section,
            title: form.title, body: form.body, createdBy: currentName,
          }),
        });
        if (!res.ok) throw new Error("Failed to save template");
      }
      cancelEdit();
      loadTemplates();
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id) {
    await fetch("/api/resource-templates", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    setConfirmDeleteId(null);
    loadTemplates();
  }

  const filtered = filterDirector ? templates.filter((t) => t.director_id === filterDirector) : templates;
  const grouped = {};
  filtered.forEach((t) => {
    const dirLabel = t.director_id === "all" ? "All Staff" : (STAFF_NAMES[t.director_id] || t.director_id);
    if (!grouped[dirLabel]) grouped[dirLabel] = [];
    grouped[dirLabel].push(t);
  });

  return (
    <div style={{ minHeight: "100vh", background: C.dark, fontFamily: "'Inter','Segoe UI',sans-serif" }}>
      <div style={{ background: "linear-gradient(135deg," + C.burgundyDark + " 0%," + C.dark + " 70%)", borderBottom: "2px solid " + C.gold, padding: "20px 24px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={{ color: C.gold, fontSize: 11, fontWeight: 800, letterSpacing: 2, textTransform: "uppercase" }}>Leadership Only</div>
          <div style={{ color: C.ivory, fontSize: 24, fontWeight: 900, marginTop: 4 }}>Manage Resource Templates</div>
          <div style={{ color: C.muted, fontSize: 13, marginTop: 4 }}>Create, assign, and edit templates across every director's Resource Center</div>
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "24px 20px" }}>
        <form onSubmit={handleSubmit} style={{ background: C.card, border: "1px solid " + (editingId ? C.gold + "88" : C.cardBorder), borderRadius: 12, padding: 20, marginBottom: 28 }}>
          <div style={{ color: C.gold, fontSize: 11, fontWeight: 800, letterSpacing: 1, textTransform: "uppercase", marginBottom: 14 }}>
            {editingId ? "Editing Template #" + editingId : "Create New Template"}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
            <div>
              <label style={{ color: C.text, fontSize: 12, fontWeight: 700, display: "block", marginBottom: 6 }}>Assign To</label>
              <select value={form.directorId} onChange={(e) => { update("directorId", e.target.value); update("category", ""); }}
                style={{ width: "100%", background: C.dark, border: "1px solid " + C.cardBorder, borderRadius: 8, padding: "9px 12px", color: C.text, fontSize: 13 }}>
                <option value="all">All Staff</option>
                {STAFF.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
            <div>
              <label style={{ color: C.text, fontSize: 12, fontWeight: 700, display: "block", marginBottom: 6 }}>Section</label>
              <select value={form.section} onChange={(e) => update("section", e.target.value)}
                style={{ width: "100%", background: C.dark, border: "1px solid " + C.cardBorder, borderRadius: 8, padding: "9px 12px", color: C.text, fontSize: 13 }}>
                {SECTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>

          <div style={{ marginBottom: 14 }}>
            <label style={{ color: C.text, fontSize: 12, fontWeight: 700, display: "block", marginBottom: 6 }}>Category / Folder</label>
            {form.directorId === "deann" ? (
              <select value={form.category} onChange={(e) => update("category", e.target.value)}
                style={{ width: "100%", background: C.dark, border: "1px solid " + C.cardBorder, borderRadius: 8, padding: "9px 12px", color: form.category ? C.text : C.muted, fontSize: 13 }}>
                <option value="">Select a category…</option>
                {OUTREACH_CATEGORIES.map((c) => (
                  <option key={c.id} value={c.title}>{c.icon} {c.title}</option>
                ))}
              </select>
            ) : (
              <>
                <input type="text" value={form.category} onChange={(e) => update("category", e.target.value)}
                  placeholder="This director doesn't have a fixed category list yet — type one (e.g. Payroll, Vendor Relations)"
                  style={{ width: "100%", background: C.dark, border: "1px solid " + C.cardBorder, borderRadius: 8, padding: "9px 12px", color: C.text, fontSize: 13 }} />
                <div style={{ color: C.muted, fontSize: 11, marginTop: 5 }}>
                  Only Deann's Outreach Resource Center has predefined categories right now — pick "Deann Evans" above to choose from the dropdown.
                </div>
              </>
            )}
          </div>

          <div style={{ marginBottom: 14 }}>
            <label style={{ color: C.text, fontSize: 12, fontWeight: 700, display: "block", marginBottom: 6 }}>Title</label>
            <input type="text" value={form.title} onChange={(e) => update("title", e.target.value)}
              style={{ width: "100%", background: C.dark, border: "1px solid " + C.cardBorder, borderRadius: 8, padding: "9px 12px", color: C.text, fontSize: 13 }} />
          </div>

          <div style={{ marginBottom: 14 }}>
            <label style={{ color: C.text, fontSize: 12, fontWeight: 700, display: "block", marginBottom: 6 }}>Body / Content</label>
            <textarea value={form.body} onChange={(e) => update("body", e.target.value)} rows={8}
              style={{ width: "100%", background: C.dark, border: "1px solid " + C.cardBorder, borderRadius: 8, padding: "9px 12px", color: C.text, fontSize: 13, resize: "vertical", fontFamily: "inherit" }} />
          </div>

          {error && <div style={{ color: C.error, fontSize: 13, marginBottom: 12 }}>{error}</div>}

          <div style={{ display: "flex", gap: 10 }}>
            <button type="submit" disabled={submitting}
              style={{ flex: 1, background: C.green, border: "none", borderRadius: 8, padding: "12px", color: C.ivory, fontSize: 14, fontWeight: 800, cursor: "pointer" }}>
              {submitting ? "Saving…" : editingId ? "Save Changes" : "Create Template"}
            </button>
            {editingId && (
              <button type="button" onClick={cancelEdit}
                style={{ background: "transparent", border: "1px solid " + C.cardBorder, borderRadius: 8, padding: "12px 18px", color: C.muted, fontSize: 14, cursor: "pointer" }}>
                Cancel
              </button>
            )}
          </div>
        </form>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14, flexWrap: "wrap", gap: 10 }}>
          <div style={{ color: C.gold, fontSize: 11, fontWeight: 800, letterSpacing: 1, textTransform: "uppercase" }}>
            All Templates ({filtered.length})
          </div>
          <select value={filterDirector} onChange={(e) => setFilterDirector(e.target.value)}
            style={{ background: C.card, border: "1px solid " + C.cardBorder, borderRadius: 8, padding: "7px 12px", color: C.text, fontSize: 12 }}>
            <option value="">All Directors</option>
            <option value="all">All Staff (global)</option>
            {STAFF.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
        </div>

        {loading ? (
          <p style={{ color: C.muted, fontSize: 14 }}>Loading…</p>
        ) : filtered.length === 0 ? (
          <p style={{ color: C.muted, fontSize: 14 }}>No templates yet.</p>
        ) : (
          Object.keys(grouped).map((dirLabel) => (
            <div key={dirLabel} style={{ marginBottom: 24 }}>
              <div style={{ color: C.ivory, fontWeight: 800, fontSize: 14, marginBottom: 10 }}>{dirLabel}</div>
              {grouped[dirLabel].map((t) => (
                <div key={t.id} style={{ background: C.card, border: "1px solid " + C.cardBorder, borderRadius: 10, padding: "12px 16px", marginBottom: 8 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10 }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 4 }}>
                        <span style={{ background: C.burgundy, color: C.ivory, fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 12 }}>{t.category}</span>
                        <span style={{ color: C.gold, fontSize: 11, fontWeight: 700 }}>{t.section}</span>
                      </div>
                      <div style={{ color: C.text, fontWeight: 700, fontSize: 14 }}>{t.title}</div>
                      <div style={{ color: C.muted, fontSize: 11, marginTop: 2 }}>
                        Created by {t.created_by || "Unknown"} · Last updated {new Date(t.updated_at).toLocaleDateString()}
                        {t.updated_by ? " by " + t.updated_by : ""}
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                      <button onClick={() => startEdit(t)} style={{ background: "transparent", border: "1px solid " + C.gold + "66", borderRadius: 6, padding: "5px 10px", color: C.gold, fontSize: 11, fontWeight: 700, cursor: "pointer" }}>Edit</button>
                      {confirmDeleteId === t.id ? (
                        <>
                          <button onClick={() => handleDelete(t.id)} style={{ background: C.error, border: "none", borderRadius: 6, padding: "5px 10px", color: "white", fontSize: 11, fontWeight: 700, cursor: "pointer" }}>Confirm</button>
                          <button onClick={() => setConfirmDeleteId(null)} style={{ background: "transparent", border: "1px solid " + C.cardBorder, borderRadius: 6, padding: "5px 10px", color: C.muted, fontSize: 11, cursor: "pointer" }}>Cancel</button>
                        </>
                      ) : (
                        <button onClick={() => setConfirmDeleteId(t.id)} style={{ background: "transparent", border: "1px solid " + C.cardBorder, borderRadius: 6, padding: "5px 10px", color: C.muted, fontSize: 11, cursor: "pointer" }}>Delete</button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))
        )}
      </div>
    </div>
  );
}