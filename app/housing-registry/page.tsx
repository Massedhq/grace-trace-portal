// @ts-nocheck
"use client";
import { useState, useEffect, useRef } from "react";

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
  success: "#4CAF50",
};

const PIPELINE_STAGES = [
  "Interest Received",
  "Eligibility Review",
  "Housing Readiness",
  "Career Ready Program",
  "Placed / Active",
];

const CHECKLIST_ITEMS = [
  { key: "step1", label: "Step 1 registration received", auto: true },
  { key: "step2", label: "Step 2 program readiness received", auto: true },
  { key: "eligibility", label: "Eligibility confirmed" },
  { key: "career_ready", label: "Career Ready Program acknowledged", auto: true },
  { key: "room", label: "Room assigned" },
  { key: "transport", label: "Transportation confirmed" },
  { key: "id_docs", label: "ID / documents plan in place" },
  { key: "employment", label: "Employment intake scheduled" },
  { key: "placed", label: "Placed / active" },
];

const BADGE_COLORS = {
  "Returning Citizen / Reentry": { bg: "#EEEDFE", color: "#534AB7" },
  "Veteran": { bg: "#E6F1FB", color: "#185FA5" },
  "Young Adult (18–25)": { bg: "#EAF3DE", color: "#3B6D11" },
  "Individual with Disabilities (DBMD)": { bg: "#FAEEDA", color: "#854F0B" },
};

function daysUntil(dateStr) {
  if (!dateStr) return null;
  const release = new Date(dateStr);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  release.setHours(0, 0, 0, 0);
  return Math.ceil((release - today) / (1000 * 60 * 60 * 24));
}

function DaysBadge({ days }) {
  if (days === null) return null;
  const bg = days <= 14 ? "#FAECE7" : days <= 30 ? "#FAEEDA" : "#EAF3DE";
  const color = days <= 14 ? "#993C1D" : days <= 30 ? "#854F0B" : "#3B6D11";
  const label = days < 0 ? "Released" : days === 0 ? "Today" : days + " days";
  return (
    <span style={{ background: bg, color, fontSize: 11, fontWeight: 700, padding: "2px 9px", borderRadius: 10 }}>
      {label}
    </span>
  );
}

function PopBadge({ population }) {
  const colors = BADGE_COLORS[population] || { bg: "#F1EFE8", color: "#5F5E5A" };
  const short = population === "Returning Citizen / Reentry" ? "Reentry"
    : population === "Individual with Disabilities (DBMD)" ? "DBMD"
    : population === "Young Adult (18–25)" ? "Young Adult"
    : population || "—";
  return (
    <span style={{ background: colors.bg, color: colors.color, fontSize: 11, fontWeight: 700, padding: "2px 9px", borderRadius: 10 }}>
      {short}
    </span>
  );
}

// Modal with mandatory textarea
function NoteModal({ title, subtitle, placeholder, confirmLabel, confirmColor, onConfirm, onCancel }) {
  const [note, setNote] = useState("");
  const [err, setErr] = useState(false);
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div style={{ background: C.card, border: "1px solid " + C.cardBorder, borderRadius: 12, padding: 24, width: "100%", maxWidth: 460 }}>
        <div style={{ color: C.text, fontWeight: 800, fontSize: 15, marginBottom: 6 }}>{title}</div>
        <div style={{ color: C.muted, fontSize: 13, marginBottom: 14, lineHeight: 1.5 }}>{subtitle}</div>
        <textarea
          value={note}
          onChange={e => { setNote(e.target.value); setErr(false); }}
          placeholder={placeholder}
          rows={4}
          autoFocus
          style={{ width: "100%", background: C.dark, border: "1px solid " + (err ? C.error : C.cardBorder), borderRadius: 8, padding: "10px 14px", color: C.text, fontSize: 13, resize: "vertical", outline: "none", fontFamily: "inherit", lineHeight: 1.6 }}
        />
        {err && <div style={{ color: C.error, fontSize: 12, marginTop: 4 }}>A note is required before continuing.</div>}
        <div style={{ display: "flex", gap: 10, marginTop: 14, justifyContent: "flex-end" }}>
          {onCancel && (
            <button onClick={onCancel} style={{ background: "transparent", border: "1px solid " + C.cardBorder, borderRadius: 8, padding: "9px 18px", color: C.muted, fontSize: 13, cursor: "pointer" }}>
              Cancel
            </button>
          )}
          <button
            onClick={() => { if (!note.trim()) { setErr(true); return; } onConfirm(note.trim()); }}
            style={{ background: confirmColor || C.green, border: "none", borderRadius: 8, padding: "9px 20px", color: C.ivory, fontSize: 13, fontWeight: 800, cursor: "pointer" }}>
            {confirmLabel || "Confirm"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── RECORD VIEW ─────────────────────────────────────────────────────────────
function RecordView({ registrant: initialRegistrant, currentUser, onBack, onCompleted }) {
  const [registrant, setRegistrant] = useState(initialRegistrant);
  const [notes, setNotes] = useState([]);
  const [checklist, setChecklist] = useState({});
  const [noteInput, setNoteInput] = useState("");
  const [saving, setSaving] = useState(false);
  const [stage, setStage] = useState(initialRegistrant.pipeline_stage || "Interest Received");
  const [actionTaken, setActionTaken] = useState(false);

  // Modal state
  const [modal, setModal] = useState(null);
  // modal types: "checklist", "complete", "exit", "edit"
  const [pendingChecklistKey, setPendingChecklistKey] = useState(null);

  const notesBottomRef = useRef(null);

  useEffect(() => {
    loadNotes();
    loadChecklist();
  }, [registrant.id]);

  async function loadNotes() {
    const r = await fetch("/api/housing-registry-notes?registrant_id=" + registrant.id);
    const d = await r.json();
    setNotes(d.notes || []);
  }

  async function loadChecklist() {
    const r = await fetch("/api/housing-registry-checklist?registrant_id=" + registrant.id);
    const d = await r.json();
    const map = {};
    (d.checklist || []).forEach(item => { map[item.item_key] = item; });
    // Auto-items: step1, step2, career_ready are always true if record exists
    setChecklist(map);
  }

  async function postNote(text, type = "manual") {
    const r = await fetch("/api/housing-registry-notes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ registrant_id: registrant.id, staff_id: currentUser.id, staff_name: currentUser.name, note_text: text, note_type: type }),
    });
    const d = await r.json();
    setNotes(prev => [...prev, d.note]);
    setActionTaken(true);
    setTimeout(() => notesBottomRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
  }

  async function saveChecklistItem(key, label, note) {
    await fetch("/api/housing-registry-checklist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ registrant_id: registrant.id, item_key: key, item_label: label, completed: true, completed_by_id: currentUser.id, completed_by_name: currentUser.name, completion_note: note }),
    });
    await loadChecklist();
    await postNote("Task completed: " + label + " — " + note, "system");
  }

  async function handleSave() {
    setSaving(true);
    await fetch("/api/housing-registry", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: registrant.id, pipeline_stage: stage }),
    });
    setSaving(false);
    setActionTaken(true);
  }

  async function handleComplete(note) {
    await fetch("/api/housing-registry", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: registrant.id, completed: true, pipeline_stage: stage, completion_note: note }),
    });
    await postNote("Record marked complete — " + note, "system");
    setRegistrant(prev => ({ ...prev, completed: true }));
    setModal(null);
    setActionTaken(true);
    if (onCompleted) onCompleted(registrant.id);
  }

  async function handleReopen(note) {
    await fetch("/api/housing-registry", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: registrant.id, completed: false }),
    });
    await postNote("Record reopened for editing — " + note, "system");
    setRegistrant(prev => ({ ...prev, completed: false }));
    setModal(null);
    setActionTaken(true);
  }

  function handleBack() {
    if (!actionTaken) {
      setModal("exit");
    } else {
      onBack();
    }
  }

  const days = daysUntil(registrant.expected_release);
  const isUrgent = days !== null && days <= 14;
  const isSoon = days !== null && days > 14 && days <= 30;
  const fullName = registrant.first_name + " " + registrant.last_name;
  const initials = (registrant.first_name?.[0] || "") + (registrant.last_name?.[0] || "");

  return (
    <div style={{ minHeight: "100vh", background: C.dark, fontFamily: "'Inter','Segoe UI',sans-serif" }}>

      {/* Modals */}
      {modal === "checklist" && (
        <NoteModal
          title={"Note required — " + (CHECKLIST_ITEMS.find(i => i.key === pendingChecklistKey)?.label || "")}
          subtitle="Describe what was completed before this task is saved."
          placeholder="e.g. Called Ialana — room 4 confirmed and ready for arrival..."
          confirmLabel="Save & confirm"
          onConfirm={async (note) => {
            const item = CHECKLIST_ITEMS.find(i => i.key === pendingChecklistKey);
            await saveChecklistItem(pendingChecklistKey, item.label, note);
            setModal(null);
            setPendingChecklistKey(null);
          }}
          onCancel={() => { setModal(null); setPendingChecklistKey(null); }}
        />
      )}

      {modal === "complete" && (
        <NoteModal
          title="Mark record as complete"
          subtitle={"This will move " + fullName + " to the Completed dashboard. Summarize the outcome before confirming."}
          placeholder="e.g. Placed in Room 4 on Aug 12. Transportation completed by Ialana. Enrolled in Career Ready Program. All documents obtained..."
          confirmLabel="Confirm & complete"
          confirmColor={C.green}
          onConfirm={handleComplete}
          onCancel={() => setModal(null)}
        />
      )}

      {modal === "exit" && (
        <NoteModal
          title="No changes were made"
          subtitle="You opened this record but did not complete any tasks or add any notes. Leave a note explaining why you accessed it before leaving."
          placeholder="e.g. Reviewed record to check release date — no action needed at this time..."
          confirmLabel="Save note & leave"
          confirmColor={C.burgundy}
          onConfirm={async (note) => {
            await postNote("Record accessed with no action taken — " + note, "system");
            setModal(null);
            onBack();
          }}
        />
      )}

      {modal === "edit" && (
        <NoteModal
          title="Edit completed record"
          subtitle={"This record is marked complete. Leave a note explaining why you are reopening it."}
          placeholder="e.g. Updating employment information — Marcus changed his career interest to HVAC after placement..."
          confirmLabel="Confirm & edit"
          confirmColor="#854F0B"
          onConfirm={handleReopen}
          onCancel={() => setModal(null)}
        />
      )}

      {/* Header */}
      <div style={{ background: C.burgundyDark, borderBottom: "2px solid " + C.gold, padding: "14px 20px", display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
        <button onClick={handleBack} style={{ background: "transparent", border: "1px solid " + C.cardBorder, borderRadius: 8, padding: "7px 14px", color: C.muted, fontSize: 13, cursor: "pointer" }}>← Back</button>
        <div style={{ flex: 1 }}>
          <div style={{ color: C.ivory, fontWeight: 800, fontSize: 15 }}>{fullName}</div>
          <div style={{ color: C.gold, fontSize: 11, marginTop: 2 }}>Housing Registry — Individual Record</div>
        </div>
        {!registrant.completed && (
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <button onClick={handleSave} style={{ background: C.card, border: "1px solid " + C.cardBorder, borderRadius: 8, padding: "8px 16px", color: C.text, fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
              {saving ? "Saving..." : "Save changes"}
            </button>
            <button onClick={() => setModal("complete")} style={{ background: C.green, border: "none", borderRadius: 8, padding: "8px 16px", color: C.ivory, fontSize: 13, fontWeight: 800, cursor: "pointer" }}>
              ✓ Mark complete
            </button>
          </div>
        )}
        {registrant.completed && (
          <button onClick={() => setModal("edit")} style={{ background: "#854F0B", border: "none", borderRadius: 8, padding: "8px 16px", color: "#FAEEDA", fontSize: 13, fontWeight: 800, cursor: "pointer" }}>
            ✏️ Edit record
          </button>
        )}
      </div>

      <div style={{ maxWidth: 800, margin: "0 auto", padding: "20px 16px" }}>

        {/* Release alert or completed banner */}
        {!registrant.completed && days !== null && days <= 30 && (
          <div style={{ background: "#FAECE7", border: "1px solid #F0997B", borderRadius: 8, padding: "10px 16px", marginBottom: 16, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ color: "#993C1D", fontWeight: 700, fontSize: 13 }}>⚠️ Release date: {registrant.expected_release} — {days <= 0 ? "already released" : days + " days away"}</span>
            <span style={{ color: "#D85A30", fontSize: 12 }}>{days <= 7 ? "Immediate action required" : "Action required soon"}</span>
          </div>
        )}

        {registrant.completed && (
          <div style={{ background: "#EAF3DE", border: "1px solid #97C459", borderRadius: 8, padding: "12px 16px", marginBottom: 16, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <div style={{ color: "#27500A", fontWeight: 700, fontSize: 13 }}>✓ This record has been marked complete</div>
              <div style={{ color: "#3B6D11", fontSize: 12, marginTop: 2 }}>Moved to Completed dashboard</div>
              {registrant.completion_note && <div style={{ color: "#3B6D11", fontSize: 12, marginTop: 4, fontStyle: "italic" }}>"{registrant.completion_note}"</div>}
            </div>
          </div>
        )}

        {/* Identity + stage */}
        <div style={{ background: C.card, border: "1px solid " + C.cardBorder, borderRadius: 12, padding: "16px 18px", marginBottom: 14, display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 14, flexWrap: "wrap" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ width: 48, height: 48, borderRadius: "50%", background: C.burgundy, border: "1px solid " + C.gold, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 800, color: C.ivory, flexShrink: 0 }}>{initials}</div>
            <div>
              <div style={{ color: C.text, fontWeight: 800, fontSize: 16 }}>{fullName}</div>
              <div style={{ marginTop: 4, display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center" }}>
                <PopBadge population={registrant.population} />
                {days !== null && <DaysBadge days={days} />}
              </div>
              <div style={{ color: C.muted, fontSize: 12, marginTop: 4 }}>
                Registered {registrant.created_at ? new Date(registrant.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—"} · {registrant.system_type || "—"} · {registrant.county || "—"}
              </div>
            </div>
          </div>
          {!registrant.completed && (
            <div style={{ display: "flex", flexDirection: "column", gap: 6, flexShrink: 0 }}>
              <div style={{ color: C.gold, fontSize: 10, fontWeight: 800, letterSpacing: 1, textTransform: "uppercase" }}>Pipeline stage</div>
              <select value={stage} onChange={e => { setStage(e.target.value); setActionTaken(true); }}
                style={{ background: C.dark, border: "1px solid " + C.cardBorder, borderRadius: 8, padding: "8px 12px", color: C.text, fontSize: 13, outline: "none", fontFamily: "inherit" }}>
                {PIPELINE_STAGES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          )}
          {registrant.completed && (
            <div style={{ background: "#EAF3DE", border: "1px solid #97C459", borderRadius: 8, padding: "6px 14px", color: "#27500A", fontSize: 12, fontWeight: 700 }}>Completed</div>
          )}
        </div>

        {/* Info grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 14 }}>
          <div style={{ background: C.card, border: "1px solid " + C.cardBorder, borderRadius: 12, padding: "14px 16px" }}>
            <div style={{ color: C.gold, fontSize: 10, fontWeight: 800, letterSpacing: 1, textTransform: "uppercase", marginBottom: 10 }}>Personal information</div>
            {[
              ["Phone", registrant.phone],
              ["Email", registrant.email || "—"],
              ["Date of birth", registrant.date_of_birth || "—"],
              ["County", registrant.county || "—"],
              ["Emergency contact", registrant.emergency_contact || "—"],
              ["Referred by", registrant.referral_source || "—"],
            ].map(([label, val]) => (
              <div key={label} style={{ display: "flex", justifyContent: "space-between", padding: "5px 0", borderBottom: "1px solid " + C.cardBorder, fontSize: 13, gap: 8 }}>
                <span style={{ color: C.muted, flexShrink: 0 }}>{label}</span>
                <span style={{ color: C.text, fontWeight: 600, textAlign: "right" }}>{val}</span>
              </div>
            ))}
          </div>

          <div style={{ background: C.card, border: "1px solid " + C.cardBorder, borderRadius: 12, padding: "14px 16px" }}>
            <div style={{ color: C.gold, fontSize: 10, fontWeight: 800, letterSpacing: 1, textTransform: "uppercase", marginBottom: 10 }}>Incarceration details</div>
            {[
              ["System", registrant.system_type || "—"],
              ["Facility", registrant.facility || "—"],
              ["TDCJ / Register #", registrant.tdcj_number || "Not provided"],
              ["Release date", registrant.expected_release || "—"],
              ["Housing timeline", registrant.housing_timeline || "—"],
              ["Other housing", registrant.other_housing || "—"],
            ].map(([label, val]) => (
              <div key={label} style={{ display: "flex", justifyContent: "space-between", padding: "5px 0", borderBottom: "1px solid " + C.cardBorder, fontSize: 13, gap: 8 }}>
                <span style={{ color: C.muted, flexShrink: 0 }}>{label}</span>
                <span style={{ color: C.text, fontWeight: 600, textAlign: "right" }}>{val}</span>
              </div>
            ))}
          </div>

          <div style={{ background: C.card, border: "1px solid " + C.cardBorder, borderRadius: 12, padding: "14px 16px" }}>
            <div style={{ color: C.gold, fontSize: 10, fontWeight: 800, letterSpacing: 1, textTransform: "uppercase", marginBottom: 10 }}>Employment & education</div>
            {[
              ["Employment timeline", registrant.emp_timeline || "—"],
              ["Work interests", registrant.work_interests || "—"],
              ["Certifications", registrant.certifications || "—"],
              ["Worked inside", registrant.worked_inside || "—"],
              ["Resume help", registrant.resume_help || "—"],
              ["Education interests", registrant.edu_interests || "—"],
              ["Field of study", registrant.edu_field || "—"],
            ].map(([label, val]) => (
              <div key={label} style={{ display: "flex", justifyContent: "space-between", padding: "5px 0", borderBottom: "1px solid " + C.cardBorder, fontSize: 13, gap: 8 }}>
                <span style={{ color: C.muted, flexShrink: 0 }}>{label}</span>
                <span style={{ color: C.text, fontWeight: 600, textAlign: "right", maxWidth: 160 }}>{val}</span>
              </div>
            ))}
          </div>

          <div style={{ background: C.card, border: "1px solid " + C.cardBorder, borderRadius: 12, padding: "14px 16px" }}>
            <div style={{ color: C.gold, fontSize: 10, fontWeight: 800, letterSpacing: 1, textTransform: "uppercase", marginBottom: 10 }}>Services needed</div>
            {registrant.services_needed ? (
              registrant.services_needed.split(",").map(s => s.trim()).filter(Boolean).map(s => (
                <div key={s} style={{ display: "flex", alignItems: "center", gap: 8, padding: "5px 0", borderBottom: "1px solid " + C.cardBorder, fontSize: 13, color: C.text }}>
                  <span style={{ color: C.green, fontWeight: 800 }}>✓</span> {s}
                </div>
              ))
            ) : (
              <div style={{ color: C.muted, fontSize: 13 }}>No services selected</div>
            )}
          </div>
        </div>

        {/* Notes + Checklist */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 14 }}>

          {/* Staff notes */}
          <div style={{ background: C.card, border: "1px solid " + C.cardBorder, borderRadius: 12, padding: "14px 16px" }}>
            <div style={{ color: C.gold, fontSize: 10, fontWeight: 800, letterSpacing: 1, textTransform: "uppercase", marginBottom: 10 }}>Staff notes</div>
            <div style={{ maxHeight: 280, overflowY: "auto", marginBottom: 10 }}>
              {notes.length === 0 && <div style={{ color: C.muted, fontSize: 13 }}>No notes yet.</div>}
              {notes.map(n => (
                <div key={n.id} style={{ paddingBottom: 10, marginBottom: 10, borderBottom: "1px solid " + C.cardBorder }}>
                  <div style={{ fontSize: 11, color: C.muted, marginBottom: 3 }}>
                    <strong style={{ color: C.text }}>{n.staff_name}</strong> · {new Date(n.created_at).toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}
                    {n.note_type === "system" && <span style={{ color: C.muted, marginLeft: 6, fontStyle: "italic" }}>(system)</span>}
                  </div>
                  <div style={{ color: C.text, fontSize: 13, lineHeight: 1.5 }}>{n.note_text}</div>
                </div>
              ))}
              <div ref={notesBottomRef} />
            </div>
            <div style={{ borderTop: "1px solid " + C.cardBorder, paddingTop: 10, display: "flex", gap: 8 }}>
              <input
                value={noteInput}
                onChange={e => setNoteInput(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter" && noteInput.trim()) { postNote(noteInput.trim()); setNoteInput(""); } }}
                placeholder="Add a note..."
                style={{ flex: 1, background: C.dark, border: "1px solid " + C.cardBorder, borderRadius: 8, padding: "8px 12px", color: C.text, fontSize: 13, outline: "none", fontFamily: "inherit" }}
              />
              <button
                onClick={() => { if (noteInput.trim()) { postNote(noteInput.trim()); setNoteInput(""); } }}
                style={{ background: C.burgundy, border: "none", borderRadius: 8, padding: "8px 14px", color: C.ivory, fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
                Add
              </button>
            </div>
          </div>

          {/* Pre-arrival checklist */}
          <div style={{ background: C.card, border: "1px solid " + C.cardBorder, borderRadius: 12, padding: "14px 16px" }}>
            <div style={{ color: C.gold, fontSize: 10, fontWeight: 800, letterSpacing: 1, textTransform: "uppercase", marginBottom: 10 }}>Pre-arrival checklist</div>
            {CHECKLIST_ITEMS.map(item => {
              const done = item.auto ? true : !!(checklist[item.key]?.completed);
              return (
                <div key={item.key} style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "7px 0", borderBottom: "1px solid " + C.cardBorder }}>
                  <input
                    type="checkbox"
                    checked={done}
                    disabled={done || registrant.completed}
                    onChange={() => {
                      if (!done && !registrant.completed) {
                        setPendingChecklistKey(item.key);
                        setModal("checklist");
                      }
                    }}
                    style={{ width: 15, height: 15, flexShrink: 0, marginTop: 2, accentColor: C.green, cursor: done ? "default" : "pointer" }}
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{ color: done ? C.muted : C.text, fontSize: 13, textDecoration: done ? "line-through" : "none" }}>{item.label}</div>
                    {done && checklist[item.key]?.completed_by_name && (
                      <div style={{ color: C.muted, fontSize: 11, marginTop: 1 }}>
                        {checklist[item.key].completed_by_name} · {new Date(checklist[item.key].completed_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                      </div>
                    )}
                    {item.auto && <div style={{ color: C.muted, fontSize: 11, marginTop: 1, fontStyle: "italic" }}>Auto-confirmed</div>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── DASHBOARD ────────────────────────────────────────────────────────────────
export default function HousingRegistryDashboard() {
  const [currentUser, setCurrentUser] = useState(null);
  const [registrants, setRegistrants] = useState([]);
  const [completed, setCompleted] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState("dashboard"); // "dashboard" | "record" | "completed"
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [tab, setTab] = useState("active"); // "active" | "completed"
  const [stageFilter, setStageFilter] = useState("All");

  useEffect(() => {
    try {
      const uid = localStorage.getItem("gtm_current_user");
      if (uid === "avy" || uid === "ialana" || uid === "travis") {
        // Allowed users
        const names = { avy: "Avrial Evans (Avy)", ialana: "Ialana Tippins", travis: "Travis Ramar" };
        setCurrentUser({ id: uid, name: names[uid] });
      } else if (uid) {
        // Other staff — redirect
        window.location.href = "/";
        return;
      } else {
        window.location.href = "/";
        return;
      }
    } catch (e) { window.location.href = "/"; return; }
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    const [activeRes, completedRes] = await Promise.all([
      fetch("/api/housing-registry?completed=false"),
      fetch("/api/housing-registry?completed=true"),
    ]);
    const activeData = await activeRes.json();
    const completedData = await completedRes.json();
    setRegistrants(activeData.registrants || []);
    setCompleted(completedData.registrants || []);
    setLoading(false);
  }

  function openRecord(r) {
    setSelectedRecord(r);
    setView("record");
  }

  if (view === "record" && selectedRecord) {
    return (
      <RecordView
        registrant={selectedRecord}
        currentUser={currentUser}
        onBack={() => { setView("dashboard"); setSelectedRecord(null); loadData(); }}
        onCompleted={() => { loadData(); }}
      />
    );
  }

  // ── Stats ──
  const all = [...registrants, ...completed];
  const releasing30 = registrants.filter(r => { const d = daysUntil(r.expected_release); return d !== null && d >= 0 && d <= 30; });
  const needTransport = all.filter(r => r.services_needed && r.services_needed.includes("Transportation")).length;
  const needEmployment = all.filter(r => r.emp_timeline && r.emp_timeline !== "I already have employment arranged" && r.emp_timeline !== "Not sure yet").length;

  const popCounts = {};
  all.forEach(r => { if (r.population) popCounts[r.population] = (popCounts[r.population] || 0) + 1; });

  const workInterestCounts = {};
  all.forEach(r => {
    if (r.work_interests) r.work_interests.split(",").forEach(w => {
      const t = w.trim(); if (t && t !== "Not sure yet") workInterestCounts[t] = (workInterestCounts[t] || 0) + 1;
    });
  });
  const topWorkInterests = Object.entries(workInterestCounts).sort((a, b) => b[1] - a[1]).slice(0, 5);

  const servicesCounts = {};
  all.forEach(r => {
    if (r.services_needed) r.services_needed.split(",").forEach(s => {
      const t = s.trim(); if (t) servicesCounts[t] = (servicesCounts[t] || 0) + 1;
    });
  });
  const topServices = Object.entries(servicesCounts).sort((a, b) => b[1] - a[1]).slice(0, 5);
  const maxServices = topServices[0]?.[1] || 1;
  const maxWork = topWorkInterests[0]?.[1] || 1;

  // Release windows
  const w7 = registrants.filter(r => { const d = daysUntil(r.expected_release); return d !== null && d >= 0 && d <= 7; }).length;
  const w30 = releasing30.length;
  const w90 = registrants.filter(r => { const d = daysUntil(r.expected_release); return d !== null && d > 30 && d <= 90; }).length;
  const w90plus = registrants.filter(r => { const d = daysUntil(r.expected_release); return d === null || d > 90; }).length;

  const displayRegistrants = tab === "active" ? registrants : completed;
  const filtered = stageFilter === "All" ? displayRegistrants : displayRegistrants.filter(r => r.pipeline_stage === stageFilter);
  const sortedFiltered = [...filtered].sort((a, b) => {
    if (tab === "active") {
      const da = daysUntil(a.expected_release) ?? 9999;
      const db = daysUntil(b.expected_release) ?? 9999;
      return da - db;
    }
    return new Date(b.completed_at) - new Date(a.completed_at);
  });

  return (
    <div style={{ minHeight: "100vh", background: C.dark, fontFamily: "'Inter','Segoe UI',sans-serif" }}>

      {/* Header */}
      <div style={{ background: C.burgundyDark, borderBottom: "2px solid " + C.gold, padding: "14px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
        <div>
          <a href="/" style={{ color: C.muted, fontSize: 13, textDecoration: "none" }}>← Portal home</a>
          <div style={{ color: C.ivory, fontWeight: 800, fontSize: 16, marginTop: 2 }}>Housing Registry Dashboard</div>
          <div style={{ color: C.gold, fontSize: 11 }}>Grace Trace Ministries · {currentUser?.name}</div>
        </div>
        <button onClick={loadData} style={{ background: C.card, border: "1px solid " + C.cardBorder, borderRadius: 8, padding: "8px 14px", color: C.text, fontSize: 13, cursor: "pointer" }}>↻ Refresh</button>
      </div>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "20px 16px" }}>
        {loading ? (
          <div style={{ color: C.muted, textAlign: "center", padding: 60 }}>Loading registry...</div>
        ) : (
          <>
            {/* Stat cards */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10, marginBottom: 16 }}>
              {[
                { num: all.length, label: "Total registrants", color: "#534AB7" },
                { num: releasing30.length, label: "Releasing in 30 days", color: C.error },
                { num: needTransport, label: "Need transportation", color: C.green },
                { num: needEmployment, label: "Need employment", color: "#854F0B" },
              ].map(s => (
                <div key={s.label} style={{ background: C.card, border: "1px solid " + C.cardBorder, borderRadius: 8, padding: "12px 14px" }}>
                  <div style={{ fontSize: 24, fontWeight: 800, color: s.color }}>{s.num}</div>
                  <div style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>{s.label}</div>
                </div>
              ))}
            </div>

            {/* 30-day alert */}
            {releasing30.length > 0 && (
              <div style={{ background: "#FAECE7", border: "1px solid #F0997B", borderRadius: 10, padding: "14px 16px", marginBottom: 16 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                  <span style={{ fontSize: 20 }}>⚠️</span>
                  <div style={{ color: "#993C1D", fontWeight: 800, fontSize: 14 }}>{releasing30.length} registrant{releasing30.length !== 1 ? "s" : ""} releasing within the next 30 days</div>
                </div>
                <div style={{ color: "#D85A30", fontSize: 12, marginBottom: 8 }}>Review each record and confirm housing readiness, transportation, and Career Ready Program status before release date.</div>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {Object.entries(
                    releasing30.reduce((acc, r) => { acc[r.population] = (acc[r.population] || 0) + 1; return acc; }, {})
                  ).map(([pop, count]) => (
                    <span key={pop} style={{ background: "#F0997B", color: "#4A1B0C", fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 10 }}>
                      {count} — {pop === "Returning Citizen / Reentry" ? "Returning citizens" : pop === "Individual with Disabilities (DBMD)" ? "DBMD" : pop}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Release queue + Population */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>

              <div style={{ background: C.card, border: "1px solid " + C.cardBorder, borderRadius: 12, padding: "14px 16px" }}>
                <div style={{ color: C.gold, fontSize: 11, fontWeight: 800, letterSpacing: 1, textTransform: "uppercase", marginBottom: 10 }}>📅 Release date queue — earliest first</div>
                {registrants.filter(r => r.expected_release).sort((a, b) => new Date(a.expected_release) - new Date(b.expected_release)).slice(0, 8).map(r => {
                  const days = daysUntil(r.expected_release);
                  return (
                    <div key={r.id} onClick={() => openRecord(r)} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid " + C.cardBorder, cursor: "pointer" }}
                      onMouseEnter={e => e.currentTarget.style.background = C.dark}
                      onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                      <div>
                        <div style={{ color: C.text, fontSize: 13, fontWeight: 600 }}>{r.first_name} {r.last_name} <PopBadge population={r.population} /></div>
                        <div style={{ color: C.muted, fontSize: 11, marginTop: 2 }}>{r.system_type} · {r.county}</div>
                      </div>
                      <div style={{ textAlign: "right", flexShrink: 0 }}>
                        <div style={{ color: C.text, fontSize: 12, fontWeight: 600 }}>{new Date(r.expected_release + "T00:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</div>
                        <div style={{ marginTop: 3 }}><DaysBadge days={days} /></div>
                      </div>
                    </div>
                  );
                })}
                {registrants.filter(r => r.expected_release).length === 0 && (
                  <div style={{ color: C.muted, fontSize: 13 }}>No release dates on file.</div>
                )}
              </div>

              <div style={{ background: C.card, border: "1px solid " + C.cardBorder, borderRadius: 12, padding: "14px 16px" }}>
                <div style={{ color: C.gold, fontSize: 11, fontWeight: 800, letterSpacing: 1, textTransform: "uppercase", marginBottom: 10 }}>👥 Population breakdown</div>
                {Object.entries(BADGE_COLORS).map(([pop, colors]) => {
                  const count = popCounts[pop] || 0;
                  const pct = all.length ? Math.round((count / all.length) * 100) : 0;
                  const short = pop === "Returning Citizen / Reentry" ? "Returning citizens" : pop === "Individual with Disabilities (DBMD)" ? "DBMD" : pop === "Young Adult (18–25)" ? "Young adults" : pop;
                  return (
                    <div key={pop} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                      <span style={{ background: colors.bg, color: colors.color, fontSize: 10, fontWeight: 700, padding: "2px 9px", borderRadius: 10, minWidth: 90, textAlign: "center", flexShrink: 0 }}>{short}</span>
                      <span style={{ color: C.text, fontWeight: 700, fontSize: 13 }}>{count}</span>
                      <span style={{ color: C.muted, fontSize: 12 }}>— {pct}%</span>
                    </div>
                  );
                })}
                <div style={{ borderTop: "1px solid " + C.cardBorder, paddingTop: 12, marginTop: 4 }}>
                  <div style={{ color: C.muted, fontSize: 11, fontWeight: 700, marginBottom: 8 }}>Release window</div>
                  {[["Within 7 days", w7, "#A32D2D"], ["Within 30 days", w30, "#D85A30"], ["Within 90 days", w90, "#854F0B"], ["90+ days / unknown", w90plus, "#3B6D11"]].map(([label, count, color]) => (
                    <div key={label} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                      <div style={{ width: 80, fontSize: 11, color: C.muted, flexShrink: 0 }}>{label}</div>
                      <div style={{ flex: 1, background: C.dark, borderRadius: 4, height: 7, overflow: "hidden" }}>
                        <div style={{ background: color, height: 7, borderRadius: 4, width: (w30 ? (count / Math.max(w30, w90plus, 1)) * 100 : 0) + "%" }} />
                      </div>
                      <span style={{ color: C.text, fontSize: 12, fontWeight: 700, minWidth: 20 }}>{count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Pipeline columns */}
            <div style={{ background: C.card, border: "1px solid " + C.cardBorder, borderRadius: 12, padding: "14px 16px", marginBottom: 16 }}>
              <div style={{ color: C.gold, fontSize: 11, fontWeight: 800, letterSpacing: 1, textTransform: "uppercase", marginBottom: 12 }}>Pipeline</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 8 }}>
                {PIPELINE_STAGES.map(stage => {
                  const stageRegs = registrants.filter(r => r.pipeline_stage === stage);
                  return (
                    <div key={stage} style={{ background: C.dark, borderRadius: 8, padding: 10 }}>
                      <div style={{ fontSize: 10, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>{stage}</div>
                      {stageRegs.length === 0 && <div style={{ color: C.muted, fontSize: 11, fontStyle: "italic" }}>Empty</div>}
                      {stageRegs.map(r => (
                        <div key={r.id} onClick={() => openRecord(r)} style={{ background: C.card, border: "1px solid " + C.cardBorder, borderRadius: 6, padding: "8px 10px", marginBottom: 6, cursor: "pointer" }}
                          onMouseEnter={e => e.currentTarget.style.borderColor = C.gold + "77"}
                          onMouseLeave={e => e.currentTarget.style.borderColor = C.cardBorder}>
                          <div style={{ color: C.text, fontSize: 12, fontWeight: 600 }}>{r.first_name} {r.last_name}</div>
                          <div style={{ color: C.muted, fontSize: 11, marginTop: 2 }}>{r.county}</div>
                          <div style={{ marginTop: 4 }}><PopBadge population={r.population} /></div>
                        </div>
                      ))}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Employment + Services charts */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
              <div style={{ background: C.card, border: "1px solid " + C.cardBorder, borderRadius: 12, padding: "14px 16px" }}>
                <div style={{ color: C.gold, fontSize: 11, fontWeight: 800, letterSpacing: 1, textTransform: "uppercase", marginBottom: 10 }}>Employment interests</div>
                {topWorkInterests.length === 0 && <div style={{ color: C.muted, fontSize: 13 }}>No data yet.</div>}
                {topWorkInterests.map(([label, count]) => (
                  <div key={label} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                    <div style={{ width: 90, fontSize: 12, color: C.muted, flexShrink: 0 }}>{label}</div>
                    <div style={{ flex: 1, background: C.dark, borderRadius: 4, height: 7, overflow: "hidden" }}>
                      <div style={{ background: "#534AB7", height: 7, borderRadius: 4, width: (count / maxWork * 100) + "%" }} />
                    </div>
                    <span style={{ color: C.text, fontSize: 12, fontWeight: 700, minWidth: 20 }}>{count}</span>
                  </div>
                ))}
              </div>
              <div style={{ background: C.card, border: "1px solid " + C.cardBorder, borderRadius: 12, padding: "14px 16px" }}>
                <div style={{ color: C.gold, fontSize: 11, fontWeight: 800, letterSpacing: 1, textTransform: "uppercase", marginBottom: 10 }}>Services needed</div>
                {topServices.length === 0 && <div style={{ color: C.muted, fontSize: 13 }}>No data yet.</div>}
                {topServices.map(([label, count]) => (
                  <div key={label} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                    <div style={{ width: 90, fontSize: 12, color: C.muted, flexShrink: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{label}</div>
                    <div style={{ flex: 1, background: C.dark, borderRadius: 4, height: 7, overflow: "hidden" }}>
                      <div style={{ background: "#3B6D11", height: 7, borderRadius: 4, width: (count / maxServices * 100) + "%" }} />
                    </div>
                    <span style={{ color: C.text, fontSize: 12, fontWeight: 700, minWidth: 20 }}>{count}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Registrant list tabs */}
            <div style={{ background: C.card, border: "1px solid " + C.cardBorder, borderRadius: 12, padding: "14px 16px" }}>
              <div style={{ display: "flex", gap: 0, marginBottom: 14, borderBottom: "1px solid " + C.cardBorder }}>
                {["active", "completed"].map(t => (
                  <button key={t} onClick={() => setTab(t)} style={{ padding: "8px 20px", background: "transparent", border: "none", borderBottom: "2px solid " + (tab === t ? C.gold : "transparent"), color: tab === t ? C.gold : C.muted, fontSize: 13, fontWeight: 700, cursor: "pointer", textTransform: "capitalize" }}>
                    {t === "active" ? "Active (" + registrants.length + ")" : "Completed (" + completed.length + ")"}
                  </button>
                ))}
                {tab === "active" && (
                  <select value={stageFilter} onChange={e => setStageFilter(e.target.value)}
                    style={{ marginLeft: "auto", background: C.dark, border: "1px solid " + C.cardBorder, borderRadius: 8, padding: "6px 10px", color: C.text, fontSize: 12, outline: "none", fontFamily: "inherit" }}>
                    <option value="All">All stages</option>
                    {PIPELINE_STAGES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                )}
              </div>

              {sortedFiltered.length === 0 && (
                <div style={{ color: C.muted, fontSize: 14, textAlign: "center", padding: 24 }}>
                  {tab === "active" ? "No active registrants." : "No completed records yet."}
                </div>
              )}

              {sortedFiltered.map(r => {
                const days = daysUntil(r.expected_release);
                return (
                  <div key={r.id} onClick={() => openRecord(r)}
                    style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 0", borderBottom: "1px solid " + C.cardBorder, cursor: "pointer", gap: 12, flexWrap: "wrap" }}
                    onMouseEnter={e => e.currentTarget.style.background = C.dark}
                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <div style={{ width: 36, height: 36, borderRadius: "50%", background: C.burgundy, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 800, color: C.ivory, flexShrink: 0 }}>
                        {(r.first_name?.[0] || "") + (r.last_name?.[0] || "")}
                      </div>
                      <div>
                        <div style={{ color: C.text, fontWeight: 700, fontSize: 14 }}>{r.first_name} {r.last_name}</div>
                        <div style={{ color: C.muted, fontSize: 12, marginTop: 2 }}>{r.system_type} · {r.facility} · {r.county}</div>
                      </div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                      <PopBadge population={r.population} />
                      {tab === "active" && <span style={{ background: C.dark, border: "1px solid " + C.cardBorder, color: C.muted, fontSize: 11, fontWeight: 600, padding: "2px 9px", borderRadius: 10 }}>{r.pipeline_stage}</span>}
                      {days !== null && <DaysBadge days={days} />}
                      <span style={{ color: C.gold, fontSize: 18 }}>›</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}