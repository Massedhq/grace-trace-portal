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
        ["Position Title", "Director of Residential Services & Standards"],
        ["Employee Name", "Erica Evans"],
        ["Organization", "Grace Trace Ministries"],
        ["Reports To", "Avrial Evans — President & Co-Founder"],
        ["Works Alongside", "Travis Ramar — VP/COO | Dennis Pride — Director of Operations & Facilities | Ialana Tippins — Director of Intake"],
        ["Position Type", "Part time to full time — remote with required in person facility visits"],
        ["Effective Date", "June 2026"],
      ]},
      { type: "para", text: "The Director of Residential Services & Standards is the person who makes sure every Grace Trace Ministries facility looks, feels, and operates like a professional residential program — not just a house. Erica Evans brings direct experience in hotel operations, facility cleanliness, laundry management, nursing facility care, banquet service, and personal assistance. Her role ensures that every resident is treated with dignity and that every facility reflects the values and professionalism of Grace Trace Ministries." },
    ]
  },
  {
    id: "s2", title: "Job Description",
    content: [
      { type: "subhead", text: "Position Summary" },
      { type: "para", text: "The Director of Residential Services & Standards establishes and enforces cleanliness, hospitality, and residential service standards across all Grace Trace Ministries facilities. This position oversees laundry programs, household supply management, facility appearance standards, resident support services including grocery runs and personal assistance, and coordinates with Dennis Pride on interior facility standards. This role also supports Phase 3 disability and nursing care program development." },
      { type: "subhead", text: "Primary Purpose" },
      { type: "bullets", items: [
        "Establish and enforce cleanliness and hospitality standards at all Grace Trace facilities",
        "Oversee laundry programs and ensure residents have access to clean linens and laundry facilities",
        "Manage household supply needs — coordinate all procurement requests to President for approval",
        "Train and support house managers on facility standards and resident services",
        "Conduct facility cleanliness inspections and report findings to President",
        "Provide resident support services — grocery runs, errands, personal assistance coordination",
        "Support development of residential care protocols for Phase 3 disability programs",
      ]},
      { type: "subhead", text: "Qualifications" },
      { type: "bullets", items: [
        "Experience in hotel operations, hospitality, or facility cleanliness management",
        "Experience in laundry operations and linen management",
        "Experience in nursing facilities or residential care settings",
        "Banquet service and personal assistant experience",
        "Strong attention to detail and high cleanliness standards",
        "Ability to train others and hold staff accountable to standards",
        "Commitment to treating residents with dignity and respect at all times",
      ]},
    ]
  },
  {
    id: "s3", title: "Duties & Responsibilities",
    content: [
      { type: "subhead", text: "1. Facility Cleanliness & Standards" },
      { type: "bullets", items: [
        "Establish written cleanliness and appearance standards for all Grace Trace Ministries facilities",
        "Train house managers on cleanliness standards and daily inspection protocols",
        "Conduct monthly unannounced facility cleanliness inspections — document all findings",
        "Ensure common areas — kitchen, bathrooms, living room, hallways — are clean and organized at all times",
        "Establish and enforce standards for kitchen sanitation, bathroom cleanliness, and bedroom upkeep",
        "Coordinate with Dennis Pride on any facility condition issues beyond cleanliness",
        "Develop and distribute facility standards checklist for house managers to use daily",
      ]},
      { type: "subhead", text: "2. Laundry Program Management" },
      { type: "bullets", items: [
        "Establish laundry schedules for all facilities — each resident assigned specific laundry days",
        "Ensure all laundry equipment is functioning — report maintenance issues to Dennis Pride same day",
        "Maintain inventory of laundry supplies — detergent, fabric softener, dryer sheets",
        "Establish linen standards — minimum 2 sets of sheets and towels per resident",
        "Oversee move-in linen distribution and move-out linen collection and laundering",
        "Train house managers on laundry program management and resident accountability",
      ]},
      { type: "subhead", text: "3. Household Supply Management" },
      { type: "bullets", items: [
        "Establish and maintain a master supply list for all Grace Trace Ministries facilities",
        "Monitor supply levels at all facilities — submit procurement requests to President same week as need identified",
        "Conduct supply inventory checks monthly — ensure no facility runs out of any essential supply",
        "Coordinate supply runs and deliveries to facilities",
        "Track all supply expenditures — submit records with monthly report",
        "Identify cost effective suppliers for all household and facility supplies",
      ]},
      { type: "subhead", text: "4. Resident Support Services" },
      { type: "bullets", items: [
        "Coordinate grocery runs and essential errand assistance for residents — especially during first 30 days",
        "Assist residents in accessing food banks, clothing closets, and community resources",
        "Coordinate personal assistance needs — essential errands, supply pickup, appointment support",
        "Ensure all residents have basic personal care supplies at move-in — soap, shampoo, toothpaste, toilet paper",
        "Manage donated goods and supplies — organize, inventory, and distribute fairly to residents in need",
      ]},
      { type: "subhead", text: "5. Hospitality & Move-In Standards" },
      { type: "bullets", items: [
        "Ensure every resident's room is clean, freshly made, and properly supplied before move-in",
        "Develop a move-in welcome packet — facility information, laundry schedule, supply list, house rules summary",
        "Establish a welcoming, dignified move-in experience for every new resident",
        "Apply banquet service experience to any Grace Trace hosted community events or resident celebrations",
        "Ensure all facilities present professionally at all times — no clutter, clean surfaces, fresh environment",
      ]},
      { type: "subhead", text: "6. Phase 3 Residential Care Support" },
      { type: "bullets", items: [
        "Apply nursing facility knowledge to support development of disability and DBMD care standards",
        "Advise on residential care protocols — personal care, hygiene assistance, meal standards",
        "Provide input on facility setup for disability group homes in Phase 3",
        "Support development of care plan documentation processes for future disability programs",
      ]},
    ]
  },
  {
    id: "s4", title: "Daily Work Schedule",
    content: [
      { type: "table", rows: [
        ["Time", "Activity", "Notes"],
        ["8:00 AM", "Start of day — check messages and supply requests", "Respond within 2 hours"],
        ["8:30 AM", "Review daily priorities and facility needs", "Reference weekly plan"],
        ["9:00 AM", "Coordinate supply needs — submit procurement requests to President", "All requests require President approval"],
        ["10:00 AM", "Facility visits — cleanliness inspections or supply delivery", "As scheduled"],
        ["11:00 AM", "House manager check in — standards review and feedback", "By phone or in person"],
        ["12:00 PM", "Lunch — 30 minutes", ""],
        ["12:30 PM", "Update logs — document morning activities", "Same day required"],
        ["1:00 PM", "Laundry program oversight and supply inventory review", "All facilities"],
        ["2:00 PM", "Resident support coordination — errands or assistance", "As needed — same day response"],
        ["3:00 PM", "Administrative tasks — reports, supply tracking, standards documentation", ""],
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
        ["Monday", "Weekly planning — review supply levels at all facilities — coordinate supply requests — house manager check in on standards compliance"],
        ["Tuesday", "Facility visit — cleanliness inspection — minimum one facility per week — document and photograph findings"],
        ["Wednesday", "Laundry program review — supply inventory — coordinate resident support services — house manager training follow up"],
        ["Thursday", "Facility visit or supply delivery — resident support coordination — standards documentation update"],
        ["Friday", "Weekly report to President by 5:00 PM — update all logs — review week — plan next week"],
      ]},
      { type: "subhead", text: "Weekly Minimum Standards" },
      { type: "table", rows: [
        ["Activity", "Weekly Minimum"],
        ["Facility cleanliness inspections", "Minimum 1 facility per week"],
        ["House manager standards check in", "Every house weekly — by phone or in person"],
        ["Supply inventory review", "All facilities weekly"],
        ["Procurement requests to President", "Same week as need identified"],
        ["Resident support response time", "Same day"],
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
        ["Facility cleanliness inspections", "All active facilities — minimum once per month"],
        ["Standards compliance rate", "95% or greater across all facilities"],
        ["Supply inventory accuracy", "100% current — no facility runs out"],
        ["Move-in room readiness", "100% — every room clean and supplied before resident arrives"],
        ["Laundry program compliance", "All facilities following established schedule"],
        ["Procurement requests submitted", "Same week as need identified"],
        ["Monthly report submitted", "By 5th of following month"],
        ["House manager standards training", "Documented monthly"],
      ]},
    ]
  },
  {
    id: "s7", title: "Facility Cleanliness & Standards",
    content: [
      { type: "alert", text: "EVERY GRACE TRACE MINISTRIES FACILITY MUST MEET PROFESSIONAL RESIDENTIAL STANDARDS" },
      { type: "subhead", text: "Common Areas — Daily" },
      { type: "bullets", items: [
        "Living room — vacuumed or swept and mopped — no clutter — furniture clean and arranged",
        "Kitchen — cleaned after every use — counters wiped, sink clean, floors swept and mopped",
        "Bathrooms — sanitized daily — toilets, sinks, showers, and floors cleaned every morning",
        "Hallways — swept daily — no personal items left in common areas",
        "Outside entrance — swept daily — no trash or debris",
      ]},
      { type: "subhead", text: "Resident Rooms — Daily" },
      { type: "bullets", items: [
        "Beds made by 9:00 AM",
        "No food or drinks in rooms",
        "Personal items stored — not on floors or surfaces",
        "Windows clean — blinds properly positioned",
      ]},
      { type: "subhead", text: "Monthly Deep Clean" },
      { type: "bullets", items: [
        "All appliances cleaned inside and out",
        "Baseboards and walls wiped down",
        "Windows cleaned inside",
        "All drains cleared",
        "Mattresses sanitized and rotated",
        "All furniture wiped and sanitized",
      ]},
      { type: "subhead", text: "Inspection Process" },
      { type: "bullets", items: [
        "Arrive with minimal notice — 30 minutes or less",
        "Walk every room — common areas and resident rooms",
        "Complete facility inspection log — document every finding with photos",
        "Brief house manager on findings immediately",
        "Set correction deadline — minor 24 hours — major same day",
        "Submit inspection report to President same day",
        "Follow up to confirm corrections completed",
      ]},
    ]
  },
  {
    id: "s8", title: "Resident Support Services",
    content: [
      { type: "subhead", text: "Move-In Preparation Checklist" },
      { type: "bullets", items: [
        "Room clean, freshly made, and fully supplied before resident arrives",
        "Bed made with clean linens — pillow, sheets, blanket",
        "Towels and washcloths — minimum 2 sets",
        "Basic personal care supplies — soap, shampoo, toothpaste, toilet paper",
        "Welcome packet prepared and placed in room",
        "Room photo documented before resident moves in",
      ]},
      { type: "subhead", text: "Ongoing Resident Support" },
      { type: "bullets", items: [
        "Coordinate grocery runs for residents who need assistance — especially first 30 days",
        "Assist residents in accessing food banks, clothing closets, and community resources",
        "Coordinate personal assistance needs — errands, supply pickup",
        "Ensure no resident goes without basic necessities — escalate to President if funding needed",
        "Manage donated goods — organize, inventory, distribute fairly",
      ]},
      { type: "subhead", text: "Laundry Schedule Template" },
      { type: "table", rows: [
        ["Day", "Laundry Assignment"],
        ["Monday", "Residents 1 and 2"],
        ["Tuesday", "Residents 3 and 4"],
        ["Wednesday", "Residents 5 and 6"],
        ["Thursday", "House linens and common area items"],
        ["Friday", "Makeup day — any resident who missed their day"],
        ["Saturday", "House manager discretion"],
        ["Sunday", "No laundry — rest day"],
      ]},
    ]
  },
  {
    id: "s9", title: "Hospitality & Care Standards",
    content: [
      { type: "para", text: "Grace Trace Ministries is not just a house — it is a program that treats every resident with dignity. The hospitality standards established by the Director of Residential Services & Standards ensure that every person who enters our facilities feels respected, cared for, and supported." },
      { type: "subhead", text: "Resident Dignity Standards" },
      { type: "bullets", items: [
        "Every resident is addressed by name — always",
        "Resident rooms are private — staff knock before entering",
        "Residents are never publicly humiliated for violations",
        "Residents have access to clean, well-maintained facilities at all times",
        "No resident is denied basic necessities — food, hygiene supplies, clean linens",
      ]},
      { type: "subhead", text: "Move-In Hospitality Protocol" },
      { type: "bullets", items: [
        "Room clean, made, and supplied before resident arrives",
        "Resident greeted warmly and professionally",
        "House tour conducted — all areas shown and explained",
        "Welcome packet provided and reviewed",
        "Laundry schedule explained and resident assigned their day",
        "Supply closet shown — resident knows where to get supplies",
        "Any immediate needs addressed before intake finalized",
      ]},
      { type: "subhead", text: "Banquet & Event Standards" },
      { type: "para", text: "When Grace Trace Ministries hosts community events, donor meetings, or resident celebrations Erica Evans applies her banquet experience to ensure professional event setup, food and beverage presentation, professional serving, and complete cleanup and restoration after each event." },
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
        ["Coordination with Dennis Pride", "Weekly — facility standards and condition coordination"],
        ["Coordination with Ialana Tippins", "Weekly — Houston facility move-in coordination"],
        ["House manager standards meetings", "Monthly — by phone or video"],
        ["Annual performance review", "Once per year — in person — with President"],
      ]},
    ]
  },
  {
    id: "s11", title: "Reporting Requirements",
    content: [
      { type: "subhead", text: "Daily Check In" },
      { type: "bullets", items: ["Text or email to President every work day", "Summary of activities and any urgent supply or facility issues"] },
      { type: "subhead", text: "Weekly Report — Due Every Friday by 5:00 PM" },
      { type: "bullets", items: [
        "Facilities visited and inspection results",
        "Supply levels and procurement requests submitted",
        "Laundry program status",
        "Resident support services provided",
        "Standards violations and corrective actions",
        "Plan for following week",
      ]},
      { type: "subhead", text: "Monthly Report — Due by 5th of Following Month" },
      { type: "bullets", items: [
        "All facility inspections — findings and outcomes",
        "Supply inventory and expenditures",
        "Laundry program performance",
        "Move-ins prepared — room readiness rate",
        "Standards compliance rate across all facilities",
        "Training provided to house managers",
        "Recommendations for improvement",
      ]},
    ]
  },
  {
    id: "s12", title: "Required Logs & Documentation",
    content: [
      { type: "subhead", text: "Log 1 — Facility Cleanliness Inspection Log" },
      { type: "table", rows: [
        ["Date", "Facility", "Areas Inspected", "Standards Met", "Issues Found", "Action Required", "Corrected By", "Photos"],
        ["", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", ""],
      ]},
      { type: "subhead", text: "Log 2 — Supply Inventory Log" },
      { type: "table", rows: [
        ["Date", "Facility", "Item", "Qty on Hand", "Min Level", "Reorder Y/N", "Request Submitted", "Received"],
        ["", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", ""],
      ]},
      { type: "subhead", text: "Log 3 — Laundry Program Log" },
      { type: "table", rows: [
        ["Date", "Facility", "Resident", "Laundry Day", "Completed", "Issues", "Action Taken", "Notes"],
        ["", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", ""],
      ]},
      { type: "subhead", text: "Log 4 — Move-In Preparation Log" },
      { type: "table", rows: [
        ["Move-In Date", "Resident", "Facility", "Room Clean", "Linens Ready", "Supplies Ready", "Welcome Packet", "Prepared By"],
        ["", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", ""],
      ]},
      { type: "subhead", text: "Log 5 — Resident Support Services Log" },
      { type: "table", rows: [
        ["Date", "Resident", "Facility", "Service Provided", "Time Spent", "Cost", "Outcome", "Notes"],
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
        "Making any purchase without President approval",
        "Sharing confidential resident or organizational information",
        "Falsifying inspection logs, supply records, or any documentation",
        "Using Grace Trace Ministries resources for personal benefit",
        "Conduct unbecoming of a Grace Trace Ministries representative",
      ]},
      { type: "subhead", text: "Professional Standards" },
      { type: "bullets", items: [
        "Maintain highest personal presentation standards during facility visits",
        "Respond to President within 2 hours during work hours",
        "Respond to emergency supply or resident needs same day",
        "Complete all logs same day — never backfill",
        "Submit all reports on time",
        "Treat all residents with dignity and respect at all times — no exceptions",
      ]},
    ]
  },
  {
    id: "s14", title: "Performance Metrics",
    content: [
      { type: "table", rows: [
        ["Metric", "Target", "Frequency"],
        ["Facility inspections completed", "All facilities monthly", "Monthly"],
        ["Standards compliance rate", "95% or greater", "Monthly"],
        ["Move-in room readiness", "100% every move-in", "Per move-in"],
        ["Supply inventory accuracy", "100% no facility runs out", "Weekly"],
        ["Procurement request response", "Same week as need identified", "Weekly"],
        ["Reports submitted on time", "100%", "Weekly/Monthly"],
        ["Log completion same day", "100%", "Daily"],
        ["Resident support response", "Same day", "As needed"],
      ]},
    ]
  },
  {
    id: "s15", title: "Acknowledgment & Signature",
    content: [
      { type: "para", text: "I, Erica Evans, acknowledge that I have received, read, and understand the contents of this Department Operations Binder for the position of Director of Residential Services & Standards at Grace Trace Ministries. I understand and agree to perform all duties, meet all reporting requirements, maintain all required logs, uphold all professional standards, protect the confidentiality of Grace Trace Ministries and its residents, and attend all required meetings including quarterly in person meetings. This binder is the property of Grace Trace Ministries and must be returned upon separation from this position." },
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

export default function EricaBinder() {
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
      if (uid === "erica" || uid === "avy" || uid === "travis") {
        setAuthorized(true);
        const saved = localStorage.getItem("gtm_orientation_erica");
        if (saved) { const p = JSON.parse(saved); if (p.signed) setSigned(true); }
      }
    } catch (e) {}
    setLoading(false);
  }, []);

  function submitSignature() {
    if (!signatureName.trim()) { setSignError("Please type your full name to sign."); return; }
    if (!signatureDate.trim()) { setSignError("Please enter today's date."); return; }
    try { localStorage.setItem("gtm_orientation_erica", JSON.stringify({ signed: true, name: signatureName, date: signatureDate })); } catch (e) {}
    fetch("/api/signatures", { method: "POST", headers: {"Content-Type":"application/json"}, body: JSON.stringify({ userId: "erica", data: { signed: true, name: signatureName, date: signatureDate } }) }).catch(()=>{});
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
          <div style={{ color: C.ivory, fontWeight: 900, fontSize: 16 }}>Erica Evans</div>
          <div style={{ color: C.muted, fontSize: 12 }}>Director of Residential Services & Standards</div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {signed && <div style={{ background: "#4CAF5022", border: "1px solid #4CAF5044", borderRadius: 20, padding: "4px 12px", color: "#4CAF50", fontSize: 12, fontWeight: 700 }}>✓ Signed</div>}
          <button onClick={() => window.history.back()} style={{ background: "transparent", border: "1px solid " + C.cardBorder, borderRadius: 8, padding: "6px 12px", color: C.muted, fontSize: 12, cursor: "pointer" }}>← Back</button>
        </div>
      </div>

      <div style={{ display: "flex", flex: 1 }}>
        <div style={{ width: 220, background: C.card, borderRight: "1px solid " + C.cardBorder, padding: "12px 0", flexShrink: 0, overflowY: "auto" }}>
          {SECTIONS.map((s, i) => (
            <button key={s.id} onClick={() => setActiveSection(s.id)}
              style={{ width: "100%", textAlign: "left", padding: "10px 16px", background: activeSection === s.id ? C.burgundy : "transparent", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 8, borderLeft: activeSection === s.id ? "3px solid " + C.gold : "3px solid transparent" }}>
              <span style={{ color: C.gold, fontSize: 11, fontWeight: 800, flexShrink: 0 }}>{i + 1}</span>
              <span style={{ color: activeSection === s.id ? C.ivory : C.muted, fontSize: 12, fontWeight: activeSection === s.id ? 700 : 400, lineHeight: 1.4 }}>{s.title}</span>
            </button>
          ))}
        </div>

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
                      <div style={{ color: C.text, fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Type your full name: <span style={{ color: C.gold }}>(Erica Evans)</span></div>
                      <input type="text" value={signatureName} onChange={e => { setSignatureName(e.target.value); setSignError(""); }} placeholder="Erica Evans"
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
                    <div style={{ color: C.muted, fontSize: 13, marginTop: 4 }}>Erica Evans — {signatureDate || "Signed"}</div>
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