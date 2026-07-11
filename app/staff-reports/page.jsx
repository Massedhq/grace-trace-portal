"use client";
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

const STAFF = [
  {
    id: "deann", name: "Deann Evans", initials: "DE", color: "#8B2A3E",
    role: "Program and Outreach Director / House Manager Oversight / Registered Agent",
    tasks: ["Registered Agent — Mail and Legal Notices", "Open the House — Morning Check", "Overnight Curfew and Accountability Review", "Community Outreach", "Active Referral Follow-Ups", "Partner Relationship Check-Ins", "Nightly Curfew Close-Out", "Daily Activity Report"],
  },
  {
    id: "erica", name: "Erica Evans", initials: "EE", color: "#5C3010",
    role: "Director of Residential Services and Standards",
    tasks: ["House Rules and Standards Compliance Audit", "Service Quality Audit", "Weekly Schedule Execution Review", "Residential Documentation Review", "Standards and Policy Review", "Resident Concern Coordination", "Resident Phase Progression Tracker", "Daily Residential Services Report", "Laundry Room Schedule", "Move-Out Room Readiness Checklist"],
  },
  {
    id: "ialana", name: "Ialana Tippins", initials: "IT", color: "#1A3D2B",
    role: "Director of Intake, Resident Relations, Case Management, and Peer Support",
    tasks: ["New Referral Review and Screening", "Intake Screening Conducted", "Individual Service Plan (ISP) Updates", "Resident Case Management Check-In", "Peer Support Group Session", "Resident Relations — Concerns and Needs", "Bed Availability and Waitlist Management", "Discharge and Aftercare Planning", "Referral Source Relationship Management", "Daily Intake and Case Management Report"],
  },
  {
    id: "aubreyon", name: "AuBreyon (Kisses) Woodley", initials: "KW", color: "#4A1A5C",
    role: "Director of Communication — Deaf, Blind, and Disabled Programs",
    tasks: ["DBMD Program Communications Review", "DBMD Referral Source Outreach", "DBMD Licensure and Enrollment Research", "Communication Accessibility Planning", "Disability Services Partnership Building", "Phase 3 Program Development Progress", "Daily Activity Report"],
  },
  {
    id: "dennis", name: "Dennis Pride", initials: "DO", color: "#1A4D35",
    role: "Director of Operations and Facilities",
    tasks: ["Facility Inspection and Walkthrough", "Operational Log Review", "Maintenance and Repair Coordination", "Supply and Inventory Check", "Vendor and Contractor Communications", "Occupancy and Bed Status Review", "Zoning, Compliance, and Licensing", "Daily Operations Report"],
  },
  {
    id: "travis", name: "Travis Ramar", initials: "TR", color: "#1E4D2B",
    role: "VP / COO / Board Member",
    tasks: ["Daily Executive Check-In", "Staff Oversight Review", "Facility Operations Review", "Government Contract Follow-Up", "Financial Review", "Weekly Report"],
  },
];

export default function StaffReports() {
  const [taskData, setTaskData] = useState({});
  const [signatures, setSignatures] = useState({});
  const [expandedStaff, setExpandedStaff] = useState(null);
  const [currentUserId, setCurrentUserId] = useState("");

  useEffect(() => {
    try { const uid = localStorage.getItem("gtm_current_user"); if (uid) setCurrentUserId(uid); } catch(e) {}
    fetch("/api/taskdata").then(r => r.json()).then(d => setTaskData(d)).catch(() => {});
    fetch("/api/signatures").then(r => r.json()).then(d => setSignatures(d)).catch(() => {});
  }, []);

  function refresh() {
    fetch("/api/taskdata").then(r => r.json()).then(d => setTaskData(d)).catch(() => {});
    fetch("/api/signatures").then(r => r.json()).then(d => setSignatures(d)).catch(() => {});
  }

  // Avy sees everyone including Travis. Travis sees everyone except Avy.
  const visibleStaff = STAFF.filter(u => {
    if (currentUserId === "avy") return true;
    if (currentUserId === "travis") return u.id !== "avy";
    return false;
  });

  const date = new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" });
  const totalCompleted = visibleStaff.reduce((acc, u) => acc + (taskData[u.id] ? Object.values(taskData[u.id]).filter(x => x.completed).length : 0), 0);
  const totalTasks = visibleStaff.reduce((acc, u) => acc + u.tasks.length, 0);
  const overallPct = totalTasks ? Math.round(totalCompleted / totalTasks * 100) : 0;

  return (
    <div style={{ minHeight: "100vh", background: C.dark, fontFamily: "'Inter','Segoe UI',sans-serif" }}>
      <div style={{ background: "linear-gradient(135deg, " + C.burgundyDark + " 0%, " + C.dark + " 70%)", borderBottom: "2px solid " + C.gold, padding: "16px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
        <div>
          <div style={{ color: C.gold, fontSize: 10, fontWeight: 800, letterSpacing: 3, textTransform: "uppercase", marginBottom: 4 }}>Grace Trace Ministries</div>
          <h1 style={{ color: C.ivory, fontSize: 18, fontWeight: 900, margin: 0 }}>Staff Reports</h1>
          <div style={{ color: C.muted, fontSize: 12, marginTop: 2 }}>{date}</div>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={refresh} style={{ background: C.green, border: "none", borderRadius: 8, padding: "7px 14px", color: C.ivory, fontSize: 12, fontWeight: 700, cursor: "pointer" }}>Refresh</button>
          <button onClick={() => window.history.back()} style={{ background: "transparent", border: "1px solid " + C.cardBorder, borderRadius: 8, padding: "6px 12px", color: C.muted, fontSize: 12, cursor: "pointer" }}>← Back</button>
        </div>
      </div>

      <div style={{ maxWidth: 760, margin: "0 auto", padding: "24px 20px" }}>
        <div style={{ background: C.card, border: "1px solid " + C.cardBorder, borderRadius: 12, padding: "16px 20px", marginBottom: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
            <span style={{ color: C.text, fontSize: 14, fontWeight: 700 }}>Team progress today</span>
            <span style={{ color: overallPct === 100 ? "#4CAF50" : C.gold, fontWeight: 800, fontSize: 14 }}>{totalCompleted} of {totalTasks} tasks complete</span>
          </div>
          <div style={{ background: C.dark, borderRadius: 20, height: 8 }}>
            <div style={{ background: overallPct === 100 ? "#4CAF50" : C.gold, height: 8, borderRadius: 20, width: overallPct + "%", transition: "width 0.4s" }} />
          </div>
        </div>

        <div style={{ color: C.gold, fontSize: 11, fontWeight: 800, letterSpacing: 2, textTransform: "uppercase", marginBottom: 12 }}>Orientation Package Status</div>
        <div style={{ background: C.card, border: "1px solid " + C.cardBorder, borderRadius: 12, padding: "16px 20px", marginBottom: 24 }}>
          {visibleStaff.map(u => {
            const orientationSigData = signatures["orientation_" + u.id] || null;
            const binderSigData = signatures["binder_" + u.id] || null;
            const signed = orientationSigData ? orientationSigData.signed : false;
            const binderSigned = binderSigData ? binderSigData.signed : false;
            const signedName = orientationSigData ? orientationSigData.name : "";
            const signedDate = orientationSigData ? orientationSigData.date : "";
            return (
              <div key={u.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: "1px solid " + C.cardBorder }}>
                <div style={{ width: 34, height: 34, borderRadius: "50%", background: u.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 800, color: C.ivory, flexShrink: 0 }}>{u.initials}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ color: C.text, fontWeight: 700, fontSize: 14 }}>{u.name}</div>
                  {signed && <div style={{ color: C.muted, fontSize: 12, marginTop: 2 }}>Orientation signed on {signedDate}</div>}
                </div>
                <div style={{ display: "flex", gap: 6, flexDirection: "column", alignItems: "flex-end" }}>
                  <div style={{ background: signed ? "#4CAF5022" : C.error + "22", border: "1px solid " + (signed ? "#4CAF5044" : C.error + "44"), borderRadius: 20, padding: "2px 10px", color: signed ? "#4CAF50" : C.error, fontSize: 11, fontWeight: 700 }}>
                    📄 Orientation: {signed ? "✓ Signed" : "Not signed"}
                  </div>
                  <div style={{ background: binderSigned ? "#4CAF5022" : C.error + "22", border: "1px solid " + (binderSigned ? "#4CAF5044" : C.error + "44"), borderRadius: 20, padding: "2px 10px", color: binderSigned ? "#4CAF50" : C.error, fontSize: 11, fontWeight: 700 }}>
                    📘 Binder: {binderSigned ? "✓ Signed" : "Not signed"}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div style={{ color: C.gold, fontSize: 11, fontWeight: 800, letterSpacing: 2, textTransform: "uppercase", marginBottom: 12 }}>Individual Staff Reports</div>

        {visibleStaff.map(u => {
          const ud = taskData[u.id];
          const completed = ud ? Object.values(ud).filter(x => x.completed).length : 0;
          const total = u.tasks.length;
          const pct = total ? Math.round(completed / total * 100) : 0;
          const isExpanded = expandedStaff === u.id;

          return (
            <div key={u.id} style={{ background: C.card, border: "1px solid " + (pct === 100 ? "#4CAF5044" : C.cardBorder), borderRadius: 12, marginBottom: 12, overflow: "hidden" }}>
              <div onClick={() => setExpandedStaff(isExpanded ? null : u.id)} style={{ padding: "16px 20px", cursor: "pointer", display: "flex", alignItems: "center", gap: 14 }}>
                <div style={{ width: 42, height: 42, borderRadius: "50%", background: u.color, border: "1px solid " + C.gold + "55", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 800, color: C.ivory, flexShrink: 0 }}>{u.initials}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ color: C.text, fontWeight: 800, fontSize: 15 }}>{u.name}</div>
                  <div style={{ color: C.muted, fontSize: 11, marginTop: 2 }}>{u.role}</div>
                  <div style={{ background: C.dark, borderRadius: 20, height: 5, marginTop: 8 }}>
                    <div style={{ background: pct === 100 ? "#4CAF50" : C.gold, height: 5, borderRadius: 20, width: pct + "%", transition: "width 0.4s" }} />
                  </div>
                </div>
                <div style={{ textAlign: "right", flexShrink: 0 }}>
                  <div style={{ color: pct === 100 ? "#4CAF50" : C.gold, fontWeight: 800, fontSize: 14 }}>{completed}/{total}</div>
                  <div style={{ color: pct === 100 ? "#4CAF50" : C.muted, fontSize: 11, marginTop: 2 }}>{pct === 100 ? "All done" : pct + "% done"}</div>
                  <div style={{ color: C.gold, fontSize: 18, marginTop: 4 }}>{isExpanded ? "−" : "+"}</div>
                </div>
              </div>

              {isExpanded && (
                <div style={{ borderTop: "1px solid " + C.cardBorder, padding: "12px 20px 16px" }}>
                  {ud ? u.tasks.map((taskName, i) => {
                    const taskKeys = Object.keys(ud);
                    const taskId = taskKeys[i];
                    const td = taskId ? ud[taskId] : null;
                    const isComplete = td && td.completed;
                    return (
                      <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "9px 0", borderBottom: "1px solid " + C.cardBorder }}>
                        <div style={{ width: 20, height: 20, borderRadius: "50%", background: isComplete ? "#4CAF5033" : C.cardBorder, border: "2px solid " + (isComplete ? "#4CAF50" : C.cardBorder), display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>
                          {isComplete && <span style={{ color: "#4CAF50", fontSize: 11, fontWeight: 900 }}>✓</span>}
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ color: isComplete ? "#4CAF50" : C.muted, fontSize: 13, fontWeight: 600, textDecoration: isComplete ? "line-through" : "none" }}>{taskName}</div>
                          {isComplete && td.fields && Object.entries(td.fields).filter(([k, v]) => v).slice(0, 2).map(([k, v]) => (
                            <div key={k} style={{ marginTop: 3 }}>
                              <span style={{ color: C.text, fontSize: 12 }}>{v}</span>
                            </div>
                          ))}
                        </div>
                        <div style={{ color: isComplete ? "#4CAF50" : C.muted, fontSize: 11, flexShrink: 0 }}>{isComplete ? "Complete" : "Pending"}</div>
                      </div>
                    );
                  }) : <div style={{ color: C.muted, fontSize: 13, fontStyle: "italic", padding: "8px 0" }}>No activity logged yet today</div>}
                </div>
              )}
            </div>
          );
        })}
        <div style={{ height: 48 }} />
      </div>
    </div>
  );
}