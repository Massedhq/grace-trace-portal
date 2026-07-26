"use client";

// app/my-resource-templates/page.jsx
//
// Any staff member visits this to see templates assigned to them
// (or to "all staff"), grouped by category and section, with
// New/Updated badges based on whether they've viewed the current version.
//
// This works today for every director, even before a fully custom
// Resource Center page like Deann's exists for their role.

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
  avy: "Avrial Evans", travis: "Travis Ramar", deann: "Deann Evans",
  erica: "Erica Evans", ialana: "Ialana Tippins", aubreyon: "AuBreyon Woodley", dennis: "Dennis Pride",
};

function getCurrentStaffId() {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem("gtm_current_user");
}

export default function MyResourceTemplates() {
  const [staffId, setStaffId] = useState(null);
  const [templates, setTemplates] = useState([]);
  const [reads, setReads] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const id = getCurrentStaffId();
    setStaffId(id);
    if (id) {
      loadTemplates(id);
      loadReads();
    } else {
      setLoading(false);
    }
  }, []);

  function loadTemplates(id) {
    fetch("/api/resource-templates?director=" + id)
      .then((r) => r.json())
      .then((d) => setTemplates(d.templates || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }

  function loadReads() {
    fetch("/api/resource-template-reads")
      .then((r) => r.json())
      .then((d) => setReads(d.reads || []))
      .catch(() => {});
  }

  function markViewed(templateId) {
    if (!staffId) return;
    fetch("/api/resource-template-reads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ templateId, staffId }),
    }).then(() => loadReads());
  }

  function statusFor(t) {
    const r = reads.find((x) => x.template_id === t.id && x.staff_id === staffId);
    if (!r) return "new";
    if (new Date(t.updated_at) > new Date(r.viewed_at)) return "updated";
    return "seen";
  }

  if (!staffId) {
    return (
      <div style={{ minHeight: "100vh", background: C.dark, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Inter','Segoe UI',sans-serif" }}>
        <div style={{ color: C.muted, fontSize: 14 }}>Please log in through the main portal first.</div>
      </div>
    );
  }

  // Group by category, then by section
  const grouped = {};
  templates.forEach((t) => {
    if (!grouped[t.category]) grouped[t.category] = {};
    if (!grouped[t.category][t.section]) grouped[t.category][t.section] = [];
    grouped[t.category][t.section].push(t);
  });

  return (
    <div style={{ minHeight: "100vh", background: C.dark, fontFamily: "'Inter','Segoe UI',sans-serif" }}>
      <div style={{ background: "linear-gradient(135deg," + C.burgundyDark + " 0%," + C.dark + " 70%)", borderBottom: "2px solid " + C.gold, padding: "20px 24px" }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <div style={{ color: C.gold, fontSize: 11, fontWeight: 800, letterSpacing: 2, textTransform: "uppercase" }}>{STAFF_NAMES[staffId] || "Staff"}</div>
          <div style={{ color: C.ivory, fontSize: 24, fontWeight: 900, marginTop: 4 }}>My Resource Templates</div>
          <div style={{ color: C.muted, fontSize: 13, marginTop: 4 }}>Templates and resources assigned to you by leadership</div>
        </div>
      </div>

      <div style={{ maxWidth: 800, margin: "0 auto", padding: "24px 20px" }}>
        {loading ? (
          <p style={{ color: C.muted, fontSize: 14 }}>Loading…</p>
        ) : templates.length === 0 ? (
          <div style={{ background: C.card, border: "1px solid " + C.cardBorder, borderRadius: 12, padding: "24px 20px", textAlign: "center" }}>
            <div style={{ fontSize: 28, marginBottom: 10 }}>📚</div>
            <div style={{ color: C.muted, fontSize: 14 }}>No templates have been assigned to you yet.</div>
          </div>
        ) : (
          Object.keys(grouped).map((category) => (
            <div key={category} style={{ marginBottom: 28 }}>
              <div style={{ color: C.gold, fontSize: 13, fontWeight: 800, letterSpacing: 1, textTransform: "uppercase", marginBottom: 12, borderBottom: "1px solid " + C.cardBorder, paddingBottom: 8 }}>
                {category}
              </div>
              {Object.keys(grouped[category]).map((section) => (
                <div key={section} style={{ marginBottom: 16 }}>
                  <div style={{ color: C.muted, fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", marginBottom: 8 }}>{section}</div>
                  {grouped[category][section].map((t) => {
                    const status = statusFor(t);
                    return (
                      <div key={t.id}
                        onClick={() => status !== "seen" && markViewed(t.id)}
                        style={{ background: C.card, border: "1px solid " + (status !== "seen" ? C.gold + "88" : C.cardBorder), borderRadius: 10, padding: "14px 16px", marginBottom: 8, cursor: status !== "seen" ? "pointer" : "default" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                          <div style={{ color: C.ivory, fontWeight: 700, fontSize: 14 }}>{t.title}</div>
                          {status === "new" && <span style={{ background: C.gold, color: C.dark, fontSize: 10, fontWeight: 800, padding: "2px 8px", borderRadius: 10 }}>🆕 NEW — tap to mark seen</span>}
                          {status === "updated" && <span style={{ background: C.burgundy, color: C.ivory, fontSize: 10, fontWeight: 800, padding: "2px 8px", borderRadius: 10 }}>🔄 UPDATED — tap to mark seen</span>}
                        </div>
                        <pre style={{ color: C.text, fontSize: 13, lineHeight: 1.7, whiteSpace: "pre-wrap", fontFamily: "inherit", margin: 0 }}>{t.body}</pre>
                        <div style={{ color: C.muted, fontSize: 11, marginTop: 8 }}>
                          Last updated {new Date(t.updated_at).toLocaleDateString()}{t.updated_by ? " by " + t.updated_by : ""}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          ))
        )}
      </div>
    </div>
  );
}