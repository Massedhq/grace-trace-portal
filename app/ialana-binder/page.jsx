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
  error: "#EF5350",
};

const SECTIONS = [
  {
    id: "s1", title: "Position Overview & Purpose",
    content: [
      { type: "table", rows: [
        ["Position Title", "Director of Intake & Resident Relations"],
        ["Employee Name", "Ialana Tippins"],
        ["Organization", "Grace Trace Ministries"],
        ["Reports To", "Avrial Evans — President & Co-Founder"],
        ["Works Alongside", "Travis Ramar — VP/COO | Erica Evans — Director of Residential Services | Deann Evans — Director of Outreach"],
        ["Primary Location", "Houston, Texas — Phase 1 headquarters"],
        ["Position Type", "Part time to full time — primary in person role in Houston"],
        ["Effective Date", "June 2026"],
      ]},
      { type: "para", text: "The Director of Intake & Resident Relations is the most visible and personal role in Grace Trace Ministries daily operations. Ialana Tippins has the natural ability to make people feel welcomed, heard, and supported from the very first contact. Her skills in greeting, relationship building, transportation, and intake coordination make her the perfect person to represent Grace Trace Ministries to every resident who walks through our doors. First impressions matter — and Ialana sets the tone." },
    ]
  },
  {
    id: "s2", title: "Job Description",
    content: [
      { type: "subhead", text: "Position Summary" },
      { type: "para", text: "The Director of Intake & Resident Relations manages all aspects of the resident intake process, builds and maintains positive relationships with residents throughout their program stay, coordinates transportation for residents to appointments, employment, and services, and supports community outreach and greeting activities in the Houston area." },
      { type: "subhead", text: "Primary Purpose" },
      { type: "bullets", items: [
        "Serve as the first point of contact for all incoming residents — from inquiry through move-in",
        "Manage the complete intake process — documents, drug testing, agreements, orientation",
        "Build and maintain positive, professional relationships with all residents",
        "Coordinate transportation for residents to appointments, employment, court dates, and services",
        "Serve as primary resident relations contact — first call for resident concerns and needs",
        "Represent Grace Trace Ministries professionally at Houston community events",
        "Support Deann Evans with local Houston outreach and referral relationship building",
      ]},
      { type: "subhead", text: "Qualifications" },
      { type: "bullets", items: [
        "Natural ability to connect with people and make them feel welcomed and respected",
        "Strong communication skills — verbal and written",
        "Reliable personal vehicle and valid driver's license for transportation duties",
        "Organized and detail oriented — intake process requires precise documentation",
        "Calm and professional under pressure — residents arrive in stressful situations",
        "Knowledge of Houston area — neighborhoods, services, transportation routes",
        "Commitment to treating every resident with dignity regardless of their background",
      ]},
    ]
  },
  {
    id: "s3", title: "Duties & Responsibilities",
    content: [
      { type: "subhead", text: "1. Intake Management" },
      { type: "bullets", items: [
        "Serve as primary intake coordinator for all new residents at Houston facilities",
        "Conduct initial phone screening for all intake inquiries — assess eligibility and program fit",
        "Schedule and coordinate move-in appointments",
        "Greet every new resident personally and warmly upon arrival",
        "Collect all required documents at move-in — government ID, supervision paperwork, medical info",
        "Administer move-in drug test and document results",
        "Complete all intake forms and checklists — same day as move-in",
        "Facilitate signing of House Rules and Resident Agreement — review verbally with resident",
        "Collect first program fee or confirm government billing is initiated",
        "Conduct house tour — show all areas and explain rules and expectations",
        "Introduce resident to house manager and other residents",
        "Coordinate with Erica Evans to confirm room is clean and prepared before arrival",
      ]},
      { type: "subhead", text: "2. Resident Relations" },
      { type: "bullets", items: [
        "Serve as primary relationship contact for residents throughout their program stay",
        "Conduct weekly resident check-ins — by phone or in person — monitor morale and engagement",
        "Serve as first point of contact for resident concerns, questions, and complaints",
        "Resolve minor resident conflicts early — before they escalate to house manager",
        "Communicate resident needs and concerns to house manager and VP/COO as appropriate",
        "Follow up with residents after significant program events",
        "Build a culture of trust and accountability — residents should feel respected and supported",
      ]},
      { type: "subhead", text: "3. Transportation Coordination" },
      { type: "bullets", items: [
        "Provide or coordinate transportation for residents to parole and probation appointments",
        "Provide or coordinate transportation to VA appointments for veterans residents",
        "Coordinate transportation to job interviews and employment — especially first 60 days",
        "Coordinate transportation to court dates — document date, time, and outcome",
        "Connect residents with public transportation resources — bus routes, METRO cards, ride assistance",
        "Maintain transportation log — all rides provided documented same day",
        "Coordinate with Deann Evans on transportation needs for outreach activities",
      ]},
      { type: "subhead", text: "4. Community Outreach Support — Houston" },
      { type: "bullets", items: [
        "Represent Grace Trace Ministries at Houston community events, reentry fairs, and resource events",
        "Distribute program information materials at Houston area events",
        "Build relationships with Houston community organizations, churches, and service providers",
        "Support Deann Evans with Houston area referral relationship building",
        "Greet and welcome visitors, partners, and referral sources who visit Houston facilities",
      ]},
    ]
  },
  {
    id: "s4", title: "Daily Work Schedule",
    content: [
      { type: "table", rows: [
        ["Time", "Activity", "Notes"],
        ["8:00 AM", "Start of day — check messages and intake inquiries", "Respond within 2 hours"],
        ["8:30 AM", "Review scheduled move-ins and appointments for the day", "Coordinate with Erica on room readiness"],
        ["9:00 AM", "Intake phone screenings — respond to all new inquiries", "Same day response required"],
        ["10:00 AM", "Move-in appointments or scheduled resident check-ins", "In person at Houston facility"],
        ["11:00 AM", "Transportation coordination — schedule rides for afternoon appointments", "Document all transportation needs"],
        ["12:00 PM", "Lunch — 30 minutes", ""],
        ["12:30 PM", "Update intake logs and resident relations notes", "Same day required"],
        ["1:00 PM", "Transportation — resident appointments, job interviews, court dates", "As scheduled"],
        ["2:00 PM", "Community outreach or resident relations follow ups", "As scheduled"],
        ["3:00 PM", "Administrative — reports, logs, document management", ""],
        ["4:30 PM", "End of day check in with President", "Daily required"],
        ["5:00 PM", "End of work day", ""],
      ]},
    ]
  },
  {
    id: "s5", title: "Weekly Work Plan",
    content: [
      { type: "table", rows: [
        ["Day", "Priority Activities"],
        ["Monday", "Weekly planning — review scheduled move-ins and appointments — intake inquiry follow ups — resident check-in schedule"],
        ["Tuesday", "Move-in appointments or facility visits — resident check-ins — transportation coordination for week"],
        ["Wednesday", "Intake screenings — resident relations follow ups — community outreach as scheduled — Houston agency visits"],
        ["Thursday", "Transportation runs — resident appointments — intake documentation review — house manager communication"],
        ["Friday", "Weekly report to President by 5:00 PM — update all logs — review week — plan next week"],
      ]},
      { type: "subhead", text: "Weekly Minimum Standards" },
      { type: "table", rows: [
        ["Activity", "Weekly Minimum"],
        ["Intake inquiry responses", "Same day — no inquiry goes unanswered"],
        ["Resident check-ins", "All current residents — weekly"],
        ["Transportation coordination", "All scheduled appointments covered"],
        ["Move-in coordination", "Every scheduled move-in — room confirmed ready with Erica"],
        ["Community outreach events", "Minimum 1 per week when available"],
        ["Log updates", "Daily — same day as activity"],
        ["Weekly report to President", "Every Friday by 5:00 PM"],
      ]},
    ]
  },
  {
    id: "s6", title: "Monthly Goals & Targets",
    content: [
      { type: "table", rows: [
        ["Goal", "Monthly Target"],
        ["Intake inquiries responded to same day", "100%"],
        ["Move-ins completed with full documentation", "100% — no missing documents"],
        ["Resident check-ins completed", "All residents — weekly — 100% completion"],
        ["Transportation requests fulfilled", "95% or greater"],
        ["Community outreach events attended", "Minimum 4 per month"],
        ["Resident satisfaction with intake process", "90% positive based on feedback"],
        ["Monthly report submitted", "By 5th of following month"],
        ["Intake log accuracy", "100% — same day completion"],
      ]},
    ]
  },
  {
    id: "s7", title: "Intake Process — Step by Step",
    content: [
      { type: "alert", text: "EVERY INTAKE MUST FOLLOW THIS PROCESS — NO EXCEPTIONS" },
      { type: "subhead", text: "Phase 1 — Pre-Arrival" },
      { type: "bullets", items: [
        "Receive referral or inquiry — by phone, email, or referral source",
        "Conduct phone screening — confirm eligibility and program fit",
        "Collect basic information — name, date of birth, supervision status, referring agency",
        "Schedule move-in appointment — confirm date, time, and what to bring",
        "Notify Erica Evans — confirm room preparation for move-in date",
        "Notify house manager — prepare for new resident arrival",
        "Confirm move-in with referring agency if applicable",
      ]},
      { type: "subhead", text: "Phase 2 — Move-In Day" },
      { type: "bullets", items: [
        "Greet resident warmly and professionally upon arrival",
        "Collect and copy all required documents — photo ID, supervision paperwork, medical info",
        "Administer drug test — document results immediately",
        "If positive — follow discharge protocol — notify VP/COO same day",
        "If negative — proceed with intake",
        "Review House Rules verbally — answer all questions before signature",
        "Resident signs House Rules and Resident Agreement",
        "Collect first program fee — issue receipt — or confirm government billing initiated",
        "Complete full intake checklist — every item checked",
        "Conduct house tour — show all rooms, common areas, kitchen, laundry, and outside areas",
        "Introduce resident to house manager and current residents",
        "Show resident their room — confirm it is clean and prepared",
        "Provide welcome packet from Erica Evans",
        "Set first case manager appointment",
        "Document entire intake in intake log — same day",
      ]},
      { type: "subhead", text: "Required Documents at Move-In" },
      { type: "table", rows: [
        ["Document", "Required From Resident"],
        ["Government issued photo ID", "Driver's license, state ID, or passport"],
        ["Social Security card or documentation", "Original or certified copy"],
        ["Supervision paperwork", "Parole, probation, or court order"],
        ["Referring agency documentation", "TDCJ, BOP, VA, or court referral"],
        ["DD-214", "Veterans only — discharge papers"],
        ["Medical insurance card", "If applicable"],
        ["Emergency contact information", "Two contacts — name, phone, relationship"],
      ]},
    ]
  },
  {
    id: "s8", title: "Resident Relations Standards",
    content: [
      { type: "subhead", text: "How We Treat Residents" },
      { type: "para", text: "Every person who enters Grace Trace Ministries is someone's family member. They are not their charge. They are not their past. They are a person trying to do better — and it is our job to support that effort with professionalism, dignity, and genuine care." },
      { type: "bullets", items: [
        "Always greet residents by name — never by room number or case number",
        "Listen fully before responding to any resident concern",
        "Never dismiss a resident concern — take it seriously and follow up",
        "Never discuss one resident's situation with another resident",
        "Never use a resident's past as a reason to treat them poorly",
        "Maintain professional boundaries — supportive but not personal",
        "Address violations privately — never publicly embarrass a resident",
      ]},
      { type: "subhead", text: "Conflict Resolution" },
      { type: "bullets", items: [
        "Minor resident conflicts — address immediately with both parties",
        "Document all conflicts and resolutions in incident notes",
        "Escalate to house manager if conflict cannot be resolved at resident level",
        "Escalate to VP/COO if conflict involves rule violations or safety concerns",
        "Never take sides publicly — remain neutral and professional",
      ]},
    ]
  },
  {
    id: "s9", title: "Transportation Coordination",
    content: [
      { type: "table", rows: [
        ["Appointment Type", "Transportation Priority"],
        ["Parole and probation appointments", "HIGHEST — missing these results in violation — same day transportation if needed"],
        ["VA medical appointments", "HIGH — coordinate in advance — schedule rides"],
        ["Court appearances", "HIGH — document date, time, outcome — transportation confirmed in advance"],
        ["Job interviews", "HIGH — especially first 60 days — coordinate as soon as interview is scheduled"],
        ["Drug testing appointments", "HIGH — document transportation provided"],
        ["Case manager appointments", "MEDIUM — coordinate weekly"],
        ["Medical appointments", "MEDIUM — coordinate as needed"],
        ["Employment — daily commute", "MEDIUM — connect with public transit resources"],
      ]},
      { type: "subhead", text: "Public Transportation Resources — Houston" },
      { type: "bullets", items: [
        "METRO Houston — bus and light rail — metro.org — 713-635-4000",
        "METRO Lift — paratransit for individuals with disabilities — 713-225-0119",
        "Goodwill Easter Seals — transportation assistance — 713-692-6221",
        "Gulf Coast Community Services — transportation resources — 713-393-4700",
      ]},
    ]
  },
  {
    id: "s10", title: "Meeting Requirements",
    content: [
      { type: "table", rows: [
        ["Meeting Type", "Frequency / Details"],
        ["Daily check in with President", "Every work day — text or email — brief update"],
        ["Weekly one on one with President", "Every Monday — 30 minutes — phone or video"],
        ["Monthly review with President", "First week of month — 1 hour — review report and goals"],
        ["Quarterly in person meeting", "Once per quarter — in person — full performance review"],
        ["Coordination with Erica Evans", "Weekly — move-in preparation coordination"],
        ["Coordination with Deann Evans", "Weekly — outreach and referral pipeline coordination"],
        ["Coordination with house manager", "Weekly — resident status and issues"],
        ["Annual performance review", "Once per year — in person — with President"],
      ]},
    ]
  },
  {
    id: "s11", title: "Reporting Requirements",
    content: [
      { type: "subhead", text: "Daily Check In" },
      { type: "bullets", items: ["Text or email to President every work day", "Summary of intakes completed, transportation provided, and resident relations activities"] },
      { type: "subhead", text: "Weekly Report — Due Every Friday by 5:00 PM" },
      { type: "bullets", items: [
        "Intake inquiries received and screening outcomes",
        "Move-ins completed — residents placed",
        "Transportation provided — appointments and outcomes",
        "Resident check-ins completed — any concerns noted",
        "Community outreach attended",
        "Any resident relations issues and resolutions",
        "Plan for following week",
      ]},
      { type: "subhead", text: "Monthly Report — Due by 5th of Following Month" },
      { type: "bullets", items: [
        "Total intakes completed",
        "Total transportation provided — mileage and appointment types",
        "Resident check-in completion rate",
        "Community outreach events attended",
        "Referral sources engaged in Houston",
        "Any recurring resident relations issues and recommendations",
      ]},
    ]
  },
  {
    id: "s12", title: "Required Logs & Documentation",
    content: [
      { type: "subhead", text: "Log 1 — Intake Log" },
      { type: "table", rows: [
        ["Date", "Resident Name", "Referral Source", "Drug Test", "Documents", "Agreements Signed", "Fee Collected", "Move-In Complete"],
        ["", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", ""],
      ]},
      { type: "subhead", text: "Log 2 — Resident Check-In Log" },
      { type: "table", rows: [
        ["Date", "Resident Name", "Facility", "Check-In Method", "Status", "Concerns Noted", "Action Taken", "Follow Up"],
        ["", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", ""],
      ]},
      { type: "subhead", text: "Log 3 — Transportation Log" },
      { type: "table", rows: [
        ["Date", "Resident", "Appointment Type", "Location", "Time", "Outcome", "Miles", "Notes"],
        ["", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", ""],
      ]},
      { type: "subhead", text: "Log 4 — Community Outreach Log" },
      { type: "table", rows: [
        ["Date", "Event / Location", "Orgs Contacted", "Materials Distributed", "Referrals Generated", "Notes", "Follow Up", "Outcome"],
        ["", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", ""],
      ]},
      { type: "subhead", text: "Log 5 — Incident & Conflict Log" },
      { type: "table", rows: [
        ["Date", "Residents Involved", "Nature of Issue", "Action Taken", "Reported To", "Resolution", "Date Resolved", "Notes"],
        ["", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", ""],
      ]},
    ]
  },
  {
    id: "s13", title: "Rules & Standards of Conduct",
    content: [
      { type: "alert", text: "VIOLATION OF THESE RULES MAY RESULT IN IMMEDIATE TERMINATION" },
      { type: "bullets", items: [
        "Sharing confidential resident information with unauthorized parties",
        "Taking sides in resident conflicts in a way that creates bias or harm",
        "Making promises to residents about program outcomes without authorization",
        "Using Grace Trace Ministries transportation or resources for personal benefit",
        "Conduct that damages the dignity or safety of any resident",
        "Falsifying intake documents, logs, or transportation records",
      ]},
      { type: "subhead", text: "Professional Standards" },
      { type: "bullets", items: [
        "Always represent Grace Trace Ministries with professionalism and warmth",
        "Respond to President within 2 hours during work hours",
        "Same day response to all intake inquiries — no inquiry goes unanswered",
        "Complete all intake documents same day as move-in — no incomplete intakes",
        "Complete all logs same day — never backfill",
        "Maintain professional boundaries with all residents at all times",
        "Dress professionally for all move-ins and community events",
      ]},
    ]
  },
  {
    id: "s14", title: "Performance Metrics",
    content: [
      { type: "table", rows: [
        ["Metric", "Target", "Frequency"],
        ["Intake inquiry same day response", "100%", "Daily"],
        ["Move-in documentation complete", "100% same day", "Per move-in"],
        ["Resident weekly check-in completion", "100% all residents", "Weekly"],
        ["Transportation requests fulfilled", "95% or greater", "Weekly"],
        ["Community outreach events", "Minimum 4 per month", "Monthly"],
        ["Reports submitted on time", "100%", "Weekly/Monthly"],
        ["Log completion same day", "100%", "Daily"],
        ["Resident satisfaction with intake", "90% positive", "Monthly survey"],
      ]},
    ]
  },
  {
    id: "s15", title: "Acknowledgment & Signature",
    content: [
      { type: "para", text: "I, Ialana Tippins, acknowledge that I have received, read, and understand the contents of this Department Operations Binder for the position of Director of Intake & Resident Relations at Grace Trace Ministries. I understand and agree to perform all duties, meet all reporting requirements, maintain all required logs, uphold all professional standards, protect the confidentiality of Grace Trace Ministries and its residents, and attend all required meetings including quarterly in person meetings. This binder is the property of Grace Trace Ministries and must be returned upon separation from this position." },
      { type: "signature" },
    ]
  },
];

function Block({ block }) {
  if (block.type === "para") return <p style={{ color: C.text, fontSize: 14, lineHeight: 1.8, margin: "0 0 12px" }}>{block.text}</p>;
  if (block.type === "subhead") return <div style={{ color: C.gold, fontSize: 13, fontWeight: 800, textTransform: "uppercase", letterSpacing: 1, margin: "18px 0 8px", borderLeft: "3px solid " + C.gold, paddingLeft: 10 }}>{block.text}</div>;
  if (block.type === "alert") return <div style={{ background: C.burgundy + "33", border: "1px solid " + C.burgundy, borderRadius: 8, padding: "12px 16px", color: C.ivory, fontSize: 13, fontWeight: 700, margin: "12px 0" }}>{block.text}</div>;
  if (block.type === "bullets") return (
    <ul style={{ margin: "0 0 12px", paddingLeft: 20 }}>
      {block.items.map((item, i) => <li key={i} style={{ color: C.text, fontSize: 14, lineHeight: 1.8, marginBottom: 4 }}>{item}</li>)}
    </ul>
  );
  if (block.type === "table") return (
    <div style={{ overflowX: "auto", marginBottom: 16 }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
        <tbody>
          {block.rows.map((row, i) => (
            <tr key={i} style={{ background: i === 0 ? C.burgundy : i % 2 === 0 ? C.dark : C.card }}>
              {row.map((cell, j) => (
                <td key={j} style={{ padding: "8px 12px", color: i === 0 ? C.ivory : j === 0 ? C.gold : C.text, fontWeight: i === 0 || j === 0 ? 700 : 400, border: "1px solid " + C.cardBorder, fontSize: 13 }}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
  return null;
}

export default function IalanaBinder() {
  const [activeSection, setActiveSection] = useState("s1");
  const [signatureName, setSignatureName] = useState("");
  const [signatureDate, setSignatureDate] = useState("");
  const [signError, setSignError] = useState("");
  const [signed, setSigned] = useState(false);
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    try {
      const uid = localStorage.getItem("gtm_current_user");
      if (uid === "ialana" || uid === "avy" || uid === "travis") {
        setAuthorized(true);
        const saved = localStorage.getItem("gtm_orientation_ialana");
        if (saved) { const p = JSON.parse(saved); if (p.signed) setSigned(true); }
      }
    } catch (e) {}
    setLoading(false);
  }, []);

  function submitSignature() {
    if (!signatureName.trim()) { setSignError("Please type your full name to sign."); return; }
    if (!signatureDate.trim()) { setSignError("Please enter today's date."); return; }
    try { localStorage.setItem("gtm_orientation_ialana", JSON.stringify({ signed: true, name: signatureName, date: signatureDate })); } catch (e) {}
    fetch("/api/signatures", { method: "POST", headers: {"Content-Type":"application/json"}, body: JSON.stringify({ userId: "binder_ialana", data: { signed: true, name: signatureName, date: signatureDate } }) }).catch(()=>{});
    setSigned(true);
  }

  if (loading) return <div style={{ minHeight: "100vh", background: C.dark, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Inter','Segoe UI',sans-serif" }}><div style={{ color: C.muted }}>Loading...</div></div>;

  if (!authorized) return (
    <div style={{ minHeight: "100vh", background: C.dark, display: "flex", alignItems: "center", justifyContent: "center", padding: 20, fontFamily: "'Inter','Segoe UI',sans-serif" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ color: C.ivory, fontSize: 16, fontWeight: 700, marginBottom: 12 }}>Access restricted — log in to the Staff Portal first</div>
        <a href="/" style={{ background: C.burgundy, border: "1px solid " + C.gold + "66", borderRadius: 8, padding: "11px 24px", color: C.ivory, fontSize: 14, fontWeight: 800, textDecoration: "none" }}>Go to Staff Portal</a>
      </div>
    </div>
  );

  const current = SECTIONS.find(s => s.id === activeSection);

  return (
    <div style={{ minHeight: "100vh", background: C.dark, fontFamily: "'Inter','Segoe UI',sans-serif", display: "flex", flexDirection: "column" }}>
      <div style={{ background: "linear-gradient(135deg, " + C.burgundyDark + " 0%, " + C.dark + " 70%)", borderBottom: "2px solid " + C.gold, padding: "14px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
        <div>
          <div style={{ color: C.gold, fontSize: 10, fontWeight: 800, letterSpacing: 3, textTransform: "uppercase" }}>Department Operations Binder</div>
          <div style={{ color: C.ivory, fontWeight: 900, fontSize: 16 }}>Ialana Tippins</div>
          <div style={{ color: C.muted, fontSize: 12 }}>Director of Intake & Resident Relations</div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {signed && <div style={{ background: "#4CAF5022", border: "1px solid #4CAF5044", borderRadius: 20, padding: "4px 12px", color: "#4CAF50", fontSize: 12, fontWeight: 700 }}>✓ Signed</div>}
          <button onClick={() => window.history.back()} style={{ background: "transparent", border: "1px solid " + C.cardBorder, borderRadius: 8, padding: "6px 12px", color: C.muted, fontSize: 12, cursor: "pointer" }}>← Back</button>
        </div>
      </div>

      <div style={{ display: "flex", flex: 1 }}>
        {/* Sidebar */}
        <div style={{ width: 220, background: C.card, borderRight: "1px solid " + C.cardBorder, padding: "12px 0", flexShrink: 0, overflowY: "auto" }}>
          {SECTIONS.map((s, i) => (
            <button key={s.id} onClick={() => setActiveSection(s.id)}
              style={{ width: "100%", textAlign: "left", padding: "10px 16px", background: activeSection === s.id ? C.burgundy : "transparent", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 8, borderLeft: activeSection === s.id ? "3px solid " + C.gold : "3px solid transparent" }}>
              <span style={{ color: C.gold, fontSize: 11, fontWeight: 800, flexShrink: 0 }}>{i + 1}</span>
              <span style={{ color: activeSection === s.id ? C.ivory : C.muted, fontSize: 12, fontWeight: activeSection === s.id ? 700 : 400, lineHeight: 1.4 }}>{s.title}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        <div style={{ flex: 1, padding: "24px", overflowY: "auto", maxWidth: 700 }}>
          <div style={{ color: C.gold, fontSize: 11, fontWeight: 800, letterSpacing: 2, textTransform: "uppercase", marginBottom: 6 }}>Section {SECTIONS.findIndex(s => s.id === activeSection) + 1}</div>
          <h2 style={{ color: C.ivory, fontSize: 20, fontWeight: 900, margin: "0 0 20px", paddingBottom: 12, borderBottom: "1px solid " + C.cardBorder }}>{current.title}</h2>

          {current.content.map((block, i) => {
            if (block.type === "signature") return (
              <div key={i}>
                {!signed ? (
                  <div style={{ background: C.card, border: "1px solid " + C.gold + "66", borderRadius: 12, padding: "20px" }}>
                    <div style={{ color: C.muted, fontSize: 13, marginBottom: 16 }}>By signing below you confirm you have read and understood this entire binder and agree to fulfill all responsibilities of your role.</div>
                    <div style={{ marginBottom: 14 }}>
                      <div style={{ color: C.text, fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Type your full name: <span style={{ color: C.gold }}>(Ialana Tippins)</span></div>
                      <input type="text" value={signatureName} onChange={e => { setSignatureName(e.target.value); setSignError(""); }} placeholder="Ialana Tippins"
                        style={{ width: "100%", background: C.dark, border: "1px solid " + (signError ? C.error : C.cardBorder), borderRadius: 8, padding: "10px 14px", color: C.text, fontSize: 14, outline: "none", fontFamily: "inherit" }} />
                    </div>
                    <div style={{ marginBottom: 14 }}>
                      <div style={{ color: C.text, fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Date</div>
                      <input type="text" value={signatureDate} onChange={e => { setSignatureDate(e.target.value); setSignError(""); }} placeholder="e.g. July 8, 2026"
                        style={{ width: "100%", background: C.dark, border: "1px solid " + (signError ? C.error : C.cardBorder), borderRadius: 8, padding: "10px 14px", color: C.text, fontSize: 14, outline: "none", fontFamily: "inherit" }} />
                    </div>
                    {signError && <div style={{ color: C.error, fontSize: 13, marginBottom: 10 }}>{signError}</div>}
                    <button onClick={submitSignature} style={{ width: "100%", background: C.green, border: "none", borderRadius: 10, padding: "13px", color: C.ivory, fontSize: 14, fontWeight: 800, cursor: "pointer" }}>
                      I Have Read and Understood This Binder — Sign and Submit
                    </button>
                  </div>
                ) : (
                  <div style={{ background: "#4CAF5022", border: "1px solid #4CAF5044", borderRadius: 12, padding: "24px", textAlign: "center" }}>
                    <div style={{ fontSize: 32, marginBottom: 8 }}>✓</div>
                    <div style={{ color: "#4CAF50", fontWeight: 800, fontSize: 16 }}>Binder Signed and Acknowledged</div>
                    <div style={{ color: C.muted, fontSize: 13, marginTop: 4 }}>Ialana Tippins — {signatureDate || "Signed"}</div>
                  </div>
                )}
              </div>
            );
            return <Block key={i} block={block} />;
          })}

          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 24, paddingTop: 16, borderTop: "1px solid " + C.cardBorder }}>
            <button onClick={() => { const idx = SECTIONS.findIndex(s => s.id === activeSection); if (idx > 0) setActiveSection(SECTIONS[idx-1].id); }}
              disabled={activeSection === "s1"}
              style={{ background: "transparent", border: "1px solid " + C.cardBorder, borderRadius: 8, padding: "8px 16px", color: activeSection === "s1" ? C.cardBorder : C.muted, fontSize: 13, cursor: activeSection === "s1" ? "default" : "pointer" }}>← Previous</button>
            <button onClick={() => { const idx = SECTIONS.findIndex(s => s.id === activeSection); if (idx < SECTIONS.length - 1) setActiveSection(SECTIONS[idx+1].id); }}
              disabled={activeSection === "s15"}
              style={{ background: activeSection === "s15" ? C.cardBorder : C.burgundy, border: "1px solid " + (activeSection === "s15" ? C.cardBorder : C.gold + "66"), borderRadius: 8, padding: "8px 16px", color: C.ivory, fontSize: 13, cursor: activeSection === "s15" ? "default" : "pointer" }}>Next →</button>
          </div>
          <div style={{ height: 40 }} />
        </div>
      </div>
    </div>
  );
}