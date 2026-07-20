"use client";

// app/emergency-procedures/page.jsx
//
// ASSUMPTIONS made without seeing your live repo — adjust as needed:
//   - Staff identity is read from localStorage("staffId"), matching the lightweight
//     pattern implied by your per-person binder pages (erica-binder, ialana-binder, etc).
//     If you already have a real auth/session context, swap getCurrentStaffId() for that.
//   - Brand colors match your site: burgundy #4A0E1A, gold #C9971C, ivory #FAF6EE.
//   - Add a nav link to /emergency-procedures wherever your other top-level tabs
//     (Operations Binder, Meetings, etc.) are listed.

import { useEffect, useState } from "react";
import {
  EMERGENCY_PROCEDURES_SECTIONS,
  STAFF,
  INCIDENT_LEVELS,
  isLeadership,
} from "@/lib/emergencyProceduresContent";

const BURGUNDY = "#4A0E1A";
const GOLD = "#C9971C";
const IVORY = "#FAF6EE";
const WARN_BG = "#FFF0F0";
const WARN_TEXT = "#8B0000";

function getCurrentStaffId() {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem("staffId");
}

export default function EmergencyProceduresPage() {
  const [tab, setTab] = useState("reference");
  const [staffId, setStaffId] = useState(null);

  useEffect(() => {
    setStaffId(getCurrentStaffId());
  }, []);

  const currentStaff = STAFF.find((s) => s.id === staffId) || null;
  const leadership = isLeadership(staffId);

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8">
      <header
        className="rounded-lg mb-6 p-6 text-center"
        style={{ backgroundColor: BURGUNDY }}
      >
        <p className="text-white text-sm tracking-wide font-semibold">GRACE TRACE MINISTRIES</p>
        <h1 className="text-2xl md:text-3xl font-bold mt-1" style={{ color: GOLD }}>
          Emergency & Incident Procedures
        </h1>
        <p className="text-white/80 text-sm italic mt-1">
          Every staff member must know this before working unsupervised with residents.
        </p>
      </header>

      {!staffId && (
        <div className="mb-6 p-3 rounded border text-sm" style={{ backgroundColor: WARN_BG, borderColor: WARN_TEXT, color: WARN_TEXT }}>
          No staff identity found in this browser. Set <code>localStorage.staffId</code> (e.g. "erica")
          or wire this to your real login — acknowledgment and incident forms need to know who's submitting.
        </div>
      )}

      <nav className="flex flex-wrap gap-2 mb-6">
        <TabButton active={tab === "reference"} onClick={() => setTab("reference")}>
          Reference
        </TabButton>
        <TabButton active={tab === "acknowledge"} onClick={() => setTab("acknowledge")}>
          Acknowledge
        </TabButton>
        <TabButton active={tab === "report"} onClick={() => setTab("report")}>
          Report an Incident
        </TabButton>
        {leadership && (
          <TabButton active={tab === "admin"} onClick={() => setTab("admin")}>
            Admin Dashboard
          </TabButton>
        )}
      </nav>

      {tab === "reference" && <ReferenceTab />}
      {tab === "acknowledge" && <AcknowledgeTab currentStaff={currentStaff} />}
      {tab === "report" && <ReportTab currentStaff={currentStaff} />}
      {tab === "admin" && leadership && <AdminTab />}
    </div>
  );
}

function TabButton({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className="px-4 py-2 rounded-full text-sm font-semibold transition"
      style={
        active
          ? { backgroundColor: BURGUNDY, color: "white" }
          : { backgroundColor: IVORY, color: BURGUNDY, border: `1px solid ${GOLD}` }
      }
    >
      {children}
    </button>
  );
}

/* ---------------------------- REFERENCE TAB ---------------------------- */

function ReferenceTab() {
  const [query, setQuery] = useState("");

  const filtered = EMERGENCY_PROCEDURES_SECTIONS.filter((section) => {
    if (!query.trim()) return true;
    const haystack = JSON.stringify(section).toLowerCase();
    return haystack.includes(query.toLowerCase());
  });

  return (
    <div>
      <input
        type="text"
        placeholder="Search procedures (e.g. 'overdose', 'AWOL', 'DFPS')"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full mb-6 p-3 rounded border"
        style={{ borderColor: GOLD }}
      />

      {filtered.map((section) => (
        <section key={section.id} className="mb-8 print:break-inside-avoid">
          <h2
            className="text-lg font-bold mb-2 pb-2 border-b-2"
            style={{ color: BURGUNDY, borderColor: BURGUNDY }}
          >
            {section.title}
          </h2>

          {section.warning && (
            <div className="mb-4 p-3 rounded" style={{ backgroundColor: WARN_BG, color: WARN_TEXT }}>
              {section.warning}
            </div>
          )}

          {section.intro && <p className="mb-4 text-sm text-gray-700">{section.intro}</p>}

          {section.blocks?.map((block, i) => (
            <div key={i} className="mb-4">
              <h3 className="font-semibold mb-1" style={{ color: BURGUNDY }}>
                {block.heading}
              </h3>
              {block.type === "numbered" && (
                <ol className="list-decimal list-inside space-y-1 text-sm">
                  {block.items.map((it, j) => <li key={j}>{it}</li>)}
                </ol>
              )}
              {block.type === "bulleted" && (
                <ul className="list-disc list-inside space-y-1 text-sm">
                  {block.items.map((it, j) => <li key={j}>{it}</li>)}
                </ul>
              )}
              {block.type === "text" && (
                block.items.map((it, j) => <p key={j} className="text-sm">{it}</p>)
              )}
            </div>
          ))}

          {section.table && (
            <div className="overflow-x-auto mt-2">
              {section.table.heading && (
                <h3 className="font-semibold mb-1" style={{ color: BURGUNDY }}>
                  {section.table.heading}
                </h3>
              )}
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr style={{ backgroundColor: BURGUNDY }}>
                    {section.table.columns.map((c) => (
                      <th key={c} className="text-left text-white p-2 border">{c}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {section.table.rows.map((row, i) => (
                    <tr key={i} style={{ backgroundColor: i % 2 === 0 ? IVORY : "white" }}>
                      {row.map((cell, j) => (
                        <td key={j} className="p-2 border align-top">{cell}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      ))}

      <button
        onClick={() => window.print()}
        className="mt-4 px-4 py-2 rounded text-white text-sm font-semibold"
        style={{ backgroundColor: BURGUNDY }}
      >
        Print / Save as PDF
      </button>
    </div>
  );
}

/* --------------------------- ACKNOWLEDGE TAB ---------------------------- */

function AcknowledgeTab({ currentStaff }) {
  const [acks, setAcks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    fetch("/api/emergency-ack")
      .then((r) => r.json())
      .then((d) => setAcks(d.acknowledgments || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const alreadyAcked = currentStaff && acks.some((a) => a.staff_id === currentStaff.id);

  async function handleAcknowledge() {
    if (!currentStaff) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/emergency-ack", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          staffId: currentStaff.id,
          staffName: currentStaff.name,
          position: currentStaff.position,
        }),
      });
      if (res.ok) {
        const { acknowledgment } = await res.json();
        setAcks((prev) => [acknowledgment, ...prev]);
        setDone(true);
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div>
      <div className="p-4 rounded mb-6" style={{ backgroundColor: WARN_BG, color: WARN_TEXT }}>
        <p className="font-bold mb-1">By acknowledging, you confirm:</p>
        <ul className="list-disc list-inside text-sm space-y-1">
          <li>You have read and understand the Emergency & Incident Procedures.</li>
          <li>In a medical emergency, your first action is to call 911 — not to wait for approval.</li>
          <li>You understand your obligations as a mandatory reporter under Texas law.</li>
          <li>Failure to follow these procedures may result in disciplinary action up to termination.</li>
        </ul>
      </div>

      {!currentStaff && (
        <p className="text-sm text-gray-600">Staff identity not found — can't acknowledge until identified.</p>
      )}

      {currentStaff && (
        <div className="mb-6">
          <p className="mb-3 text-sm">
            Signing in as <strong>{currentStaff.name}</strong> — {currentStaff.position}
          </p>
          {alreadyAcked || done ? (
            <p className="text-sm font-semibold" style={{ color: BURGUNDY }}>
              ✅ You've already acknowledged this document.
            </p>
          ) : (
            <button
              onClick={handleAcknowledge}
              disabled={submitting}
              className="px-5 py-2 rounded text-white font-semibold"
              style={{ backgroundColor: BURGUNDY }}
            >
              {submitting ? "Submitting…" : "I Acknowledge & Agree"}
            </button>
          )}
        </div>
      )}

      <h3 className="font-semibold mb-2" style={{ color: BURGUNDY }}>Staff Acknowledgment Status</h3>
      {loading ? (
        <p className="text-sm text-gray-500">Loading…</p>
      ) : (
        <ul className="text-sm space-y-1">
          {STAFF.map((s) => {
            const ack = acks.find((a) => a.staff_id === s.id);
            return (
              <li key={s.id} className="flex justify-between border-b py-1">
                <span>{s.name} — {s.position}</span>
                <span style={{ color: ack ? "#2E7D32" : WARN_TEXT }}>
                  {ack ? `✅ ${new Date(ack.acknowledged_at).toLocaleDateString()}` : "⏳ Not yet"}
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

/* ------------------------------ REPORT TAB ------------------------------ */

const emptyForm = {
  dateOccurred: "",
  timeOccurred: "",
  location: "",
  level: "Minor",
  residentsInvolved: "",
  staffInvolved: "",
  witnesses: "",
  description: "",
  actionTaken: "",
  emsCalled: false,
  lawEnforcementCalled: false,
  reportedTo: "",
  followUpRequired: "",
  followUpOwner: "",
};

function ReportTab({ currentStaff }) {
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/incident-reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, createdBy: currentStaff?.name || "Unknown" }),
      });
      if (!res.ok) throw new Error("Save failed");
      setSuccess(true);
      setForm(emptyForm);
    } catch (err) {
      setError("Could not save the report. Try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (success) {
    return (
      <div className="p-4 rounded" style={{ backgroundColor: IVORY, border: `1px solid ${GOLD}` }}>
        <p className="font-semibold mb-2" style={{ color: BURGUNDY }}>✅ Incident report submitted.</p>
        <p className="text-sm text-gray-700 mb-3">
          If this was Serious or Severe, make sure the President/Executive Director has been notified directly
          — this form does not replace calling 911 or notifying leadership by phone.
        </p>
        <button
          onClick={() => setSuccess(false)}
          className="px-4 py-2 rounded text-white text-sm font-semibold"
          style={{ backgroundColor: BURGUNDY }}
        >
          Log Another Incident
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="Date Occurred *">
          <input required type="date" value={form.dateOccurred}
            onChange={(e) => update("dateOccurred", e.target.value)} className="input" />
        </Field>
        <Field label="Time Occurred">
          <input type="time" value={form.timeOccurred}
            onChange={(e) => update("timeOccurred", e.target.value)} className="input" />
        </Field>
      </div>

      <Field label="Location">
        <input type="text" value={form.location}
          onChange={(e) => update("location", e.target.value)} className="input" placeholder="e.g. Kitchen, Living Room" />
      </Field>

      <Field label="Incident Level *">
        <select required value={form.level} onChange={(e) => update("level", e.target.value)} className="input">
          {INCIDENT_LEVELS.map((l) => <option key={l} value={l}>{l}</option>)}
        </select>
      </Field>

      <Field label="Residents Involved">
        <input type="text" value={form.residentsInvolved}
          onChange={(e) => update("residentsInvolved", e.target.value)} className="input" />
      </Field>

      <Field label="Staff Involved">
        <input type="text" value={form.staffInvolved}
          onChange={(e) => update("staffInvolved", e.target.value)} className="input" />
      </Field>

      <Field label="Witnesses">
        <input type="text" value={form.witnesses}
          onChange={(e) => update("witnesses", e.target.value)} className="input" />
      </Field>

      <Field label="Description — factual, objective *">
        <textarea required rows={4} value={form.description}
          onChange={(e) => update("description", e.target.value)} className="input" />
      </Field>

      <Field label="Immediate Action Taken">
        <textarea rows={3} value={form.actionTaken}
          onChange={(e) => update("actionTaken", e.target.value)} className="input" />
      </Field>

      <div className="flex gap-6">
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={form.emsCalled}
            onChange={(e) => update("emsCalled", e.target.checked)} />
          EMS Called
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={form.lawEnforcementCalled}
            onChange={(e) => update("lawEnforcementCalled", e.target.checked)} />
          Law Enforcement Called
        </label>
      </div>

      <Field label="Reported To (supervising officer, agency, DFPS, etc.)">
        <input type="text" value={form.reportedTo}
          onChange={(e) => update("reportedTo", e.target.value)} className="input" />
      </Field>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="Follow-Up Required">
          <input type="text" value={form.followUpRequired}
            onChange={(e) => update("followUpRequired", e.target.value)} className="input" />
        </Field>
        <Field label="Follow-Up Owner">
          <input type="text" value={form.followUpOwner}
            onChange={(e) => update("followUpOwner", e.target.value)} className="input" />
        </Field>
      </div>

      {error && <p className="text-sm" style={{ color: WARN_TEXT }}>{error}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="px-5 py-2 rounded text-white font-semibold"
        style={{ backgroundColor: BURGUNDY }}
      >
        {submitting ? "Saving…" : "Submit Incident Report"}
      </button>

      <style jsx>{`
        .input {
          width: 100%;
          padding: 0.6rem;
          border-radius: 0.375rem;
          border: 1px solid ${GOLD};
        }
      `}</style>
    </form>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <label className="block text-sm font-semibold mb-1" style={{ color: BURGUNDY }}>{label}</label>
      {children}
    </div>
  );
}

/* ------------------------------- ADMIN TAB ------------------------------- */

function AdminTab() {
  const [incidents, setIncidents] = useState([]);
  const [showOpenOnly, setShowOpenOnly] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/incident-reports${showOpenOnly ? "?open=true" : ""}`)
      .then((r) => r.json())
      .then((d) => setIncidents(d.incidents || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [showOpenOnly]);

  async function markResolved(id) {
    await fetch("/api/incident-reports", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, resolved: true }),
    });
    setIncidents((prev) => prev.filter((i) => i.id !== id || !showOpenOnly));
    setIncidents((prev) => prev.map((i) => (i.id === id ? { ...i, resolved: true } : i)));
  }

  const levelColor = { Minor: "#6b7280", Moderate: "#B58900", Serious: "#D2691E", Severe: WARN_TEXT };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-bold text-lg" style={{ color: BURGUNDY }}>Incident Reports</h2>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={showOpenOnly} onChange={(e) => setShowOpenOnly(e.target.checked)} />
          Open only
        </label>
      </div>

      {loading ? (
        <p className="text-sm text-gray-500">Loading…</p>
      ) : incidents.length === 0 ? (
        <p className="text-sm text-gray-500">No incidents to show.</p>
      ) : (
        <div className="space-y-3">
          {incidents.map((inc) => (
            <div key={inc.id} className="border rounded p-3" style={{ borderColor: GOLD, backgroundColor: IVORY }}>
              <div className="flex justify-between items-start mb-1">
                <span className="font-semibold" style={{ color: levelColor[inc.level] || BURGUNDY }}>
                  {inc.level} — {new Date(inc.date_occurred).toLocaleDateString()} {inc.time_occurred || ""}
                </span>
                {!inc.resolved && (
                  <button
                    onClick={() => markResolved(inc.id)}
                    className="text-xs px-2 py-1 rounded text-white"
                    style={{ backgroundColor: BURGUNDY }}
                  >
                    Mark Resolved
                  </button>
                )}
                {inc.resolved && <span className="text-xs text-green-700">Resolved</span>}
              </div>
              <p className="text-sm"><strong>Location:</strong> {inc.location || "—"}</p>
              <p className="text-sm"><strong>Residents:</strong> {inc.residents_involved || "—"}</p>
              <p className="text-sm"><strong>Description:</strong> {inc.description}</p>
              {inc.action_taken && <p className="text-sm"><strong>Action taken:</strong> {inc.action_taken}</p>}
              <p className="text-xs text-gray-500 mt-1">
                Filed by {inc.created_by || "Unknown"} · EMS: {inc.ems_called ? "Yes" : "No"} · Law Enforcement: {inc.law_enforcement_called ? "Yes" : "No"}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}