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

const STAFF = [
  {
    id: "avy",
    name: "Avrial Evans (Avy)",
    initials: "AE",
    color: C.burgundy,
    password: "GTM@Avy2026",
    title: "President / Executive Director / Board Chair",
    criticalRole: "You are the founder and ultimate authority of Grace Trace Ministries. Every financial decision, government contract, banking relationship, and strategic direction flows through you. You set the standard for the entire organization and are responsible for its legal compliance, growth, and mission fulfillment.",
    expectations: [
      "Maintain sole authority over all financial decisions, banking, procurement, and government contracts",
      "Review and approve all staff reports daily",
      "Lead all contract negotiations and agency relationships",
      "Ensure the organization remains compliant with 501(c)(3) requirements at all times",
      "Make final decisions on all program policies, hirings, and organizational changes",
      "Be available for escalations from Travis and all department directors",
      "Review and approve all ideas submitted through the Creative tab before they go to a team vote",
      "Maintain the integrity and mission of Grace Trace Ministries in every decision",
    ],
    tasks: [
      "Review overnight incident and house reports each morning",
      "Check all board and contract communications daily",
      "Conduct financial oversight review — bank activity, expenses, and income",
      "Review all staff workday reports submitted",
      "Follow up on active contract opportunities — TDCJ, BOP, VA GPD",
      "Document strategic planning decisions and weekly priorities",
      "Conduct community and partner outreach",
    ],
  },
  {
    id: "travis",
    name: "Travis Ramar",
    initials: "TR",
    color: C.green,
    password: "GTM@Travis2026",
    title: "VP / COO / Board Member",
    criticalRole: "You serve as the operational backbone of Grace Trace Ministries, supporting the President in overseeing all staff, contracts, and program compliance. You are the first point of escalation before issues reach Avy and are responsible for ensuring daily operations run smoothly and all staff are accountable.",
    expectations: [
      "Review all staff daily reports and flag any urgent items to Avy",
      "Oversee operational issues and ensure timely resolution",
      "Support Avy in contract and agency follow-ups",
      "Coordinate with Avy on all executive decisions and action items",
      "Maintain awareness of all program compliance requirements",
      "Review and co-approve ideas submitted through the Creative tab",
      "Serve as interim decision-maker when Avy is unavailable for non-financial matters",
      "Ensure all department directors are meeting their performance expectations",
    ],
    tasks: [
      "Review daily reports submitted by all staff",
      "Conduct operations oversight and address any escalations",
      "Follow up on contract and agency correspondence",
      "Coordinate with Avy on executive decisions and priorities",
      "Conduct community and stakeholder outreach",
      "Review program compliance across all departments",
    ],
  },
  {
    id: "deann",
    name: "Deann Evans",
    initials: "DE",
    color: "#8B2A3E",
    password: "GTM@Deann2026",
    title: "Program and Outreach Director / House Manager Oversight / Registered Agent",
    criticalRole: "You are the face of Grace Trace Ministries in the community and the operational anchor of the residential facility. As Registered Agent, all legal correspondence for the organization comes through you. As Program and Outreach Director, you build the relationships that fill beds and sustain the program. As House Manager Oversight, you ensure the daily structure of the house is maintained, residents are accountable, and operations run without incident.",
    expectations: [
      "Check for all legal mail and registered agent correspondence daily and notify Avy immediately",
      "Open the house each morning — inspect rooms, assign chores, start the sign-in log",
      "Review overnight curfew logs and document any violations or incidents",
      "Conduct daily community outreach to referral sources — probation, parole, courts, and partners",
      "Follow up on all active referrals and hand qualified prospects to Ialana for intake",
      "Maintain all partner relationships — faith-based, legal aid, workforce, food banks",
      "Complete the nightly curfew close-out and sign-in log every evening",
      "Submit a complete daily activity report to Avy and Travis",
      "Never leave resident accountability undocumented",
    ],
    tasks: [
      "Check registered agent mail and legal notices",
      "Open the house — morning room inspection and sign-in log",
      "Review overnight curfew and accountability logs",
      "Conduct community outreach — contact referral sources",
      "Follow up on active referrals and prospects",
      "Conduct partner relationship check-ins",
      "Complete nightly curfew close-out and log",
      "Submit daily activity report to Avy and Travis",
    ],
  },
  {
    id: "erica",
    name: "Erica Evans",
    initials: "EE",
    color: "#5C3010",
    password: "GTM@Erica2026",
    title: "Director of Residential Services and Standards",
    criticalRole: "You are responsible for the quality, consistency, and compliance of everything that happens inside the residential program. You ensure that Grace Trace Ministries operates at the highest standard — that residents are progressing through phases, documentation is complete, services are being delivered, and the facility is always ready for the next resident. You also manage the laundry schedule and oversee room readiness when a resident exits.",
    expectations: [
      "Conduct daily audits of house rules compliance and document any violations",
      "Verify that all scheduled services are being delivered on time and at standard",
      "Review all resident files, ISP notes, drug test logs, and incident reports regularly",
      "Track every resident's phase progression and make advancement recommendations",
      "Identify and report any gaps in policies, procedures, or standards to Avy",
      "Coordinate with Deann and Ialana on resident concerns and behavioral issues",
      "Maintain and post the laundry room schedule — assign times by room number",
      "Complete the full move-out room readiness checklist before any new resident moves in",
      "Submit a complete daily residential services report to Avy and Travis",
    ],
    tasks: [
      "House rules and standards compliance audit",
      "Service quality audit",
      "Weekly schedule execution review",
      "Residential documentation review",
      "Standards and policy review",
      "Resident concern coordination",
      "Resident phase progression tracker",
      "Daily residential services report",
      "Laundry room schedule — assign rooms and times",
      "Move-out room readiness checklist",
    ],
  },
  {
    id: "ialana",
    name: "Ialana Tippins",
    initials: "IT",
    color: "#1A3D2B",
    password: "GTM@Ialana2026",
    title: "Director of Intake, Resident Relations, Case Management, and Peer Support",
    criticalRole: "You are the first person a prospective resident interacts with and the ongoing relationship they depend on throughout their stay. You manage every stage from the first screening call through discharge and aftercare. You develop and maintain Individual Service Plans, facilitate peer support groups, manage the waitlist and bed availability, and ensure every resident has the support and accountability they need to succeed.",
    expectations: [
      "Screen all incoming referrals for eligibility and document every determination",
      "Conduct intake screenings thoroughly and collect all required documentation",
      "Develop and maintain an Individual Service Plan for every current resident",
      "Conduct weekly case management check-ins with every resident",
      "Facilitate the weekly peer support group session and document attendance and topics",
      "Address all resident concerns and needs promptly and document every interaction",
      "Maintain accurate bed availability and waitlist records at all times",
      "Begin discharge and aftercare planning no later than Phase 3",
      "Maintain active relationships with all referral sources",
      "Submit a complete daily intake and case management report to Avy and Travis",
    ],
    tasks: [
      "Review new referrals and screen for eligibility",
      "Conduct intake screenings",
      "Update Individual Service Plans (ISP)",
      "Resident case management check-ins",
      "Peer support group facilitation",
      "Resident relations — address concerns and needs",
      "Bed availability and waitlist management",
      "Discharge and aftercare planning",
      "Referral source relationship management",
      "Submit daily intake and case management report",
    ],
  },
  {
    id: "aubreyon",
    name: "AuBreyon (Kisses) Woodley",
    initials: "KW",
    color: "#4A1A5C",
    password: "GTM@Kisses2026",
    title: "Director of Communication — Deaf, Blind, and Disabled Programs",
    criticalRole: "You are responsible for building the foundation of Grace Trace Ministries' Phase 3 expansion into Deaf-Blind and disability residential services. Your work today determines whether this population has a safe, accessible, and compliant home in the future. You lead all DBMD communications, research the licensure pathway, build our disability services network, and ensure every piece of communication from Grace Trace is accessible to all populations we serve.",
    expectations: [
      "Check and respond to all DBMD and disability-related communications daily",
      "Conduct regular outreach to HHSC, disability advocacy organizations, and waiver coordinators",
      "Research and document all HHSC DBMD waiver enrollment requirements",
      "Ensure all Grace Trace outreach materials are accessible — ASL, Braille, large print, screen reader compatible",
      "Build and maintain a network of disability services partners — OT providers, adaptive equipment, specialized care",
      "Document all Phase 3 program development milestones and report progress regularly",
      "Submit a complete daily activity report to Avy and Travis",
    ],
    tasks: [
      "DBMD program communications review",
      "Outreach to DBMD referral sources and agencies",
      "Research DBMD licensure and enrollment requirements",
      "Communication accessibility planning",
      "Disability services partnership building",
      "Phase 3 program development progress documentation",
      "Submit daily activity report to Avy and Travis",
    ],
  },
  {
    id: "dennis",
    name: "Dennis",
    initials: "DO",
    color: "#1A4D35",
    password: "GTM@Dennis2026",
    title: "Director of Operations and Facilities",
    criticalRole: "You are responsible for the physical integrity, safety, and operational readiness of every Grace Trace facility. Every inspection, repair, supply order, vendor relationship, and compliance item runs through you. If the facility is not safe, clean, stocked, and compliant — the program cannot operate. You ensure the house is always ready to receive residents and that every operational log is complete and current.",
    expectations: [
      "Conduct a thorough facility inspection and walkthrough every day",
      "Review all operational logs — curfew, sign-in/out, incident reports, drug test logs — and flag any gaps to Deann",
      "Coordinate all maintenance and repairs promptly based on urgency level",
      "Maintain complete supply and inventory records and reorder before items run out",
      "Manage all vendor and contractor relationships professionally",
      "Report occupancy and bed availability to Ialana daily",
      "Follow up on all zoning, compliance, and licensing requirements",
      "Submit a complete daily operations report to Avy and Travis",
      "Never let a safety issue go unaddressed or undocumented",
    ],
    tasks: [
      "Facility inspection and walkthrough",
      "Operational log review",
      "Maintenance and repair coordination",
      "Supply and inventory check",
      "Vendor and contractor communications",
      "Occupancy and bed status review",
      "Zoning, compliance, and licensing follow-ups",
      "Submit daily operations report to Avy and Travis",
    ],
  },
];

export default function OrientationPackage() {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [signed, setSigned] = useState(false);
  const [signatureName, setSignatureName] = useState("");
  const [signatureDate, setSignatureDate] = useState("");
  const [signError, setSignError] = useState("");
  const [confirmed, setConfirmed] = useState(false);

  useEffect(() => {
    try {
      const uid = localStorage.getItem("gtm_current_user");
      if (uid) {
        const u = STAFF.find(s => s.id === uid);
        if (u) setCurrentUser(u);
      }
    } catch(e) {}
    setLoading(false);
  }, []);

  function submitSignature() {
    if (!signatureName.trim()) { setSignError("Please type your full name to sign."); return; }
    if (!signatureDate.trim()) { setSignError("Please enter today's date."); return; }
    if (signatureName.trim().toLowerCase() !== currentUser.name.toLowerCase()) {
      setSignError("Name does not match your account. Please type your full name exactly as shown above.");
      return;
    }
    const sigData = { signed: true, name: signatureName, date: signatureDate };
    try {
      const key = "gtm_orientation_" + currentUser.id;
      localStorage.setItem(key, JSON.stringify(sigData));
    } catch (e) {}
    fetch("/api/signatures", { method: "POST", headers: {"Content-Type":"application/json"}, body: JSON.stringify({ userId: "orientation_" + currentUser.id, data: sigData }) }).catch(()=>{});
    setSigned(true);
    setConfirmed(true);
  }

  function logout() { try { localStorage.removeItem("gtm_current_user"); } catch(e) {} window.location.href = "/"; }

  if (loading) return (
    <div style={{ minHeight: "100vh", background: C.dark, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Inter','Segoe UI',sans-serif" }}>
      <div style={{ color: C.muted, fontSize: 14 }}>Loading...</div>
    </div>
  );

  if (confirmed) return (
    <div style={{ minHeight: "100vh", background: C.dark, display: "flex", alignItems: "center", justifyContent: "center", padding: 20, fontFamily: "'Inter','Segoe UI',sans-serif" }}>
      <div style={{ width: "100%", maxWidth: 480, textAlign: "center" }}>
        <div style={{ width: 72, height: 72, borderRadius: "50%", background: "#4CAF5022", border: "2px solid #4CAF50", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", fontSize: 32 }}>✓</div>
        <h2 style={{ color: "#4CAF50", fontSize: 22, fontWeight: 900, margin: "0 0 8px" }}>Orientation Complete</h2>
        <p style={{ color: C.ivory, fontSize: 15, margin: "0 0 6px" }}>{currentUser.name}</p>
        <p style={{ color: C.muted, fontSize: 13, margin: "0 0 4px" }}>{currentUser.title}</p>
        <p style={{ color: C.muted, fontSize: 13, margin: "0 0 24px" }}>Signed on {signatureDate}</p>
        <p style={{ color: C.text, fontSize: 14, lineHeight: 1.7, marginBottom: 28 }}>
          Your orientation package has been acknowledged and your digital signature has been recorded. You have confirmed that you understand your role, responsibilities, and expectations at Grace Trace Ministries.
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 8 }}>
          <div style={{ color: C.muted, fontSize: 12, marginBottom: 4 }}>What would you like to do next?</div>
          <button onClick={() => {
            fetch("/api/signatures").then(r=>r.json()).then(sigs=>{
              const uid = localStorage.getItem("gtm_current_user") || "";
              const bSigned = sigs["binder_"+uid]?.signed || false;
              if (!bSigned) { window.location.href = "/" + uid + "-binder"; }
              else { window.location.href = "/"; }
            }).catch(() => { window.location.href = "/"; });
          }} style={{ background: C.burgundy, border: "1px solid " + C.gold + "66", borderRadius: 10, padding: "12px 28px", color: C.ivory, fontSize: 14, fontWeight: 800, cursor: "pointer" }}>
            Continue to My Department Binder →
          </button>
          <button onClick={() => { window.location.href = "/"; }} style={{ background: "transparent", border: "1px solid " + C.cardBorder, borderRadius: 10, padding: "12px 28px", color: C.muted, fontSize: 14, cursor: "pointer" }}>
            Return to My Workday Dashboard
          </button>
        </div>
      </div>
    </div>
  );

  const u = currentUser;

  return (
    <div style={{ minHeight: "100vh", background: C.dark, fontFamily: "'Inter','Segoe UI',sans-serif" }}>
      <div style={{ background: "linear-gradient(135deg, " + C.burgundyDark + " 0%, " + C.dark + " 70%)", borderBottom: "2px solid " + C.gold, padding: "16px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
        <div>
          <div style={{ color: C.gold, fontSize: 10, fontWeight: 800, letterSpacing: 3, textTransform: "uppercase", marginBottom: 4 }}>Grace Trace Ministries</div>
          <h1 style={{ color: C.ivory, fontSize: 18, fontWeight: 900, margin: 0 }}>Staff Orientation Package</h1>
          <div style={{ color: C.muted, fontSize: 12, marginTop: 2 }}>{u.name} — {u.title}</div>
        </div>
<div style={{ display: "flex", gap: 8 }}>
          <button onClick={() => window.history.back()} style={{ background: "transparent", border: "1px solid " + C.cardBorder, borderRadius: 8, padding: "7px 14px", color: C.muted, fontSize: 12, cursor: "pointer" }}>← Back</button>
          <button onClick={logout} style={{ background: "transparent", border: "1px solid " + C.cardBorder, borderRadius: 8, padding: "7px 14px", color: C.muted, fontSize: 12, cursor: "pointer" }}>Log out</button>
        </div>
      </div>

      <div style={{ maxWidth: 760, margin: "0 auto", padding: "28px 20px" }}>

        {/* Welcome */}
        <div style={{ background: C.burgundy + "33", border: "1px solid " + C.burgundy, borderRadius: 12, padding: "20px 24px", marginBottom: 24 }}>
          <div style={{ color: C.gold, fontSize: 11, fontWeight: 800, letterSpacing: 2, textTransform: "uppercase", marginBottom: 8 }}>Welcome to Grace Trace Ministries</div>
          <p style={{ color: C.ivory, fontSize: 15, lineHeight: 1.8, margin: 0 }}>
            This orientation package outlines your position, your critical role in the organization, the expectations placed on you, and every task you are responsible for. Please read every section carefully. Your signature at the bottom confirms that you have read, understood, and agree to fulfill the responsibilities of your role.
          </p>
        </div>

        {/* Job Title */}
        <div style={{ background: C.card, border: "1px solid " + C.cardBorder, borderRadius: 12, padding: "20px 24px", marginBottom: 16 }}>
          <div style={{ color: C.gold, fontSize: 11, fontWeight: 800, letterSpacing: 2, textTransform: "uppercase", marginBottom: 12 }}>Your Position</div>
          <div style={{ color: C.text, fontSize: 22, fontWeight: 900, marginBottom: 4 }}>{u.name}</div>
          <div style={{ color: C.gold, fontSize: 15, fontWeight: 700 }}>{u.title}</div>
          <div style={{ color: C.muted, fontSize: 13, marginTop: 6 }}>Grace Trace Ministries — Houston, TX</div>
        </div>

        {/* Critical Role */}
        <div style={{ background: C.card, border: "1px solid " + C.cardBorder, borderRadius: 12, padding: "20px 24px", marginBottom: 16 }}>
          <div style={{ color: C.gold, fontSize: 11, fontWeight: 800, letterSpacing: 2, textTransform: "uppercase", marginBottom: 12 }}>Your Critical Role</div>
          <p style={{ color: C.text, fontSize: 14, lineHeight: 1.9, margin: 0 }}>{u.criticalRole}</p>
        </div>

        {/* Expectations */}
        <div style={{ background: C.card, border: "1px solid " + C.cardBorder, borderRadius: 12, padding: "20px 24px", marginBottom: 16 }}>
          <div style={{ color: C.gold, fontSize: 11, fontWeight: 800, letterSpacing: 2, textTransform: "uppercase", marginBottom: 16 }}>Expectations</div>
          {u.expectations.map((exp, i) => (
            <div key={i} style={{ display: "flex", gap: 12, padding: "8px 0", borderBottom: "1px solid " + C.cardBorder, alignItems: "flex-start" }}>
              <div style={{ width: 22, height: 22, borderRadius: "50%", background: C.burgundy, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 800, color: C.gold, flexShrink: 0, marginTop: 1 }}>{i + 1}</div>
              <div style={{ color: C.text, fontSize: 14, lineHeight: 1.7 }}>{exp}</div>
            </div>
          ))}
        </div>

        {/* Tasks */}
        <div style={{ background: C.card, border: "1px solid " + C.cardBorder, borderRadius: 12, padding: "20px 24px", marginBottom: 16 }}>
          <div style={{ color: C.gold, fontSize: 11, fontWeight: 800, letterSpacing: 2, textTransform: "uppercase", marginBottom: 16 }}>Your Daily Tasks</div>
          <p style={{ color: C.muted, fontSize: 13, marginBottom: 16, lineHeight: 1.6 }}>These are the tasks you are responsible for completing every workday. Each task has a dedicated workbook in your Staff Workday Portal where you will document your activity.</p>
          {u.tasks.map((task, i) => (
            <div key={i} style={{ display: "flex", gap: 12, padding: "8px 0", borderBottom: "1px solid " + C.cardBorder, alignItems: "center" }}>
              <div style={{ color: C.gold, fontWeight: 800, fontSize: 13, flexShrink: 0, minWidth: 24 }}>{i + 1}.</div>
              <div style={{ color: C.text, fontSize: 14 }}>{task}</div>
            </div>
          ))}
        </div>

        {/* Creative Tab Notice */}
        <div style={{ background: C.green + "22", border: "1px solid " + C.green, borderRadius: 12, padding: "20px 24px", marginBottom: 24 }}>
          <div style={{ color: "#4CAF50", fontSize: 11, fontWeight: 800, letterSpacing: 2, textTransform: "uppercase", marginBottom: 10 }}>Creative Tab — Share Your Ideas</div>
          <p style={{ color: C.text, fontSize: 14, lineHeight: 1.8, margin: 0 }}>
            Inside your Staff Workday Portal you will find a Creative tab. This is your space to submit ideas, suggestions, and improvements for Grace Trace Ministries. You can type your idea, share a link, and submit it. Every idea goes directly to Avy and Travis for review and approval. Once approved, the idea will be shared with the entire team. Your team members can vote with a thumbs up, thumbs down, or a question mark if they need more clarity before deciding.
          </p>
        </div>

        {/* Volunteer Notice */}
        <div style={{ background: C.green + "22", border: "1px solid " + C.green, borderRadius: 12, padding: "20px 24px", marginBottom: 16 }}>
          <div style={{ color: "#4CAF50", fontSize: 11, fontWeight: 800, letterSpacing: 2, textTransform: "uppercase", marginBottom: 12 }}>Volunteer Position — Compensation Notice</div>
          <p style={{ color: C.text, fontSize: 14, lineHeight: 1.9, margin: "0 0 12px" }}>
            Grace Trace Ministries is a newly formed 501(c)(3) nonprofit organization currently in its pre-revenue operational phase. All staff positions at this time are <strong style={{ color: C.ivory }}>volunteer roles</strong>. You will not receive monetary compensation until the organization has secured government contracts, grants, or other sustainable funding sources.
          </p>
          <p style={{ color: C.text, fontSize: 14, lineHeight: 1.9, margin: "0 0 12px" }}>
            As funding is secured and revenue begins flowing into the organization, compensation structures will be established and implemented for all team members in accordance with the organization's financial capacity and board-approved compensation plan. Your contributions during this foundational period are recognized, valued, and essential to the long-term success of Grace Trace Ministries and the residents we serve.
          </p>
          <p style={{ color: C.gold, fontSize: 13, lineHeight: 1.8, margin: 0, fontWeight: 600 }}>
            By signing this orientation package you acknowledge that you understand and accept the volunteer nature of your current position and agree to fulfill your responsibilities in support of the Grace Trace Ministries mission.
          </p>
        </div>

        {/* Signature */}
        <div style={{ background: C.card, border: "1px solid " + C.gold + "66", borderRadius: 12, padding: "20px 24px", marginBottom: 32 }}>
          <div style={{ color: C.gold, fontSize: 11, fontWeight: 800, letterSpacing: 2, textTransform: "uppercase", marginBottom: 12 }}>Digital Signature</div>
          <p style={{ color: C.muted, fontSize: 13, lineHeight: 1.7, marginBottom: 20 }}>
            By signing below, you confirm that you have read and understood this entire orientation package, including your job title, critical role, expectations, and daily tasks. You agree to fulfill these responsibilities as a member of the Grace Trace Ministries team.
          </p>
          <div style={{ marginBottom: 14 }}>
            <div style={{ color: C.text, fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Type your full name to sign: <span style={{ color: C.gold }}>({u.name})</span></div>
            <input type="text" value={signatureName} onChange={e => { setSignatureName(e.target.value); setSignError(""); }} placeholder="Type your full name exactly as shown above"
              style={{ width: "100%", background: C.dark, border: "1px solid " + (signError ? C.error : C.cardBorder), borderRadius: 8, padding: "10px 14px", color: C.text, fontSize: 14, outline: "none", fontFamily: "inherit" }} />
          </div>
          <div style={{ marginBottom: 14 }}>
            <div style={{ color: C.text, fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Date</div>
            <input type="text" value={signatureDate} onChange={e => { setSignatureDate(e.target.value); setSignError(""); }} placeholder="e.g. July 8, 2026"
              style={{ width: "100%", background: C.dark, border: "1px solid " + (signError ? C.error : C.cardBorder), borderRadius: 8, padding: "10px 14px", color: C.text, fontSize: 14, outline: "none", fontFamily: "inherit" }} />
          </div>
          {signError && <div style={{ color: C.error, fontSize: 13, marginBottom: 10 }}>{signError}</div>}
          <button onClick={submitSignature} style={{ width: "100%", background: C.green, border: "none", borderRadius: 10, padding: "13px", color: C.ivory, fontSize: 14, fontWeight: 800, cursor: "pointer" }}>
            I Have Read and Understood This Orientation — Sign and Submit
          </button>
        </div>
        <div style={{ height: 40 }} />
      </div>
    </div>
  );
}