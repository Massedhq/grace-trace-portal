// Grace Trace Ministries — Emergency & Incident Procedures
// Content mirrors Grace_Trace_Emergency_Incident_Procedures.docx
// Update both together if the source document changes.

export const STAFF = [
  { id: "avy", name: "Avrial Evans", position: "President & Co-Founder", leadership: true },
  { id: "travis", name: "Travis Ramar", position: "VP / COO", leadership: true },
  { id: "deann", name: "Deann Evans", position: "Director of Outreach", leadership: false },
  { id: "erica", name: "Erica Evans", position: "Director of Residential Services", leadership: false },
  { id: "ialana", name: "Ialana Tippins", position: "Director of Intake & Resident Relations", leadership: false },
  { id: "aubreyon", name: "AuBreyon Woodley", position: "Director of Communication", leadership: false },
  { id: "dennis", name: "Dennis Pride", position: "Director of Operations", leadership: false },
];

export const isLeadership = (id) => id === "avy" || id === "travis";

export const INCIDENT_LEVELS = ["Minor", "Moderate", "Serious", "Severe"];

export const EMERGENCY_PROCEDURES_SECTIONS = [
  {
    id: "medical",
    title: "Section 1 — Medical Emergency Protocol",
    blocks: [
      {
        heading: "Life-Threatening Emergencies",
        type: "numbered",
        items: [
          "Call 911 immediately — do not wait for supervisor approval",
          "Stay with the resident — send another resident or staff member to unlock doors and direct EMS to the location",
          "Provide basic first aid only if trained and safe to do so",
          "Do not move a resident with a suspected head, neck, or spine injury unless there is immediate danger (fire, etc.)",
          "Notify the Director of Residential Services and the President/Executive Director immediately by phone",
          "Contact the resident's emergency contact once the resident is stable or en route to the hospital",
          "If the resident is on parole, probation, or VA supervision, notify their assigned officer/coordinator within 24 hours",
          "Complete an Incident Report same day — see Section 2",
        ],
      },
      {
        heading: "Non-Life-Threatening Medical Situations",
        type: "bulleted",
        items: [
          "Assess the situation calmly — ask the resident what they need",
          "If unsure whether a situation is an emergency, treat it as one and call 911 or a nurse advice line",
          "Transport or coordinate transportation to urgent care or a clinic when appropriate",
          "Document the situation, response, and outcome in the Incident Log same day",
          "For DBMD residents, follow the resident's individualized care plan and notify their assigned Intervener/support staff immediately",
        ],
      },
      {
        heading: "Medication Emergencies",
        type: "bulleted",
        items: [
          "Suspected overdose — call 911 immediately, do not wait to confirm",
          "If naloxone (Narcan) is on-site and staff are trained, administer per training while awaiting EMS",
          "Preserve any substances or containers found for EMS/law enforcement — do not dispose of them",
          "Notify President/Executive Director and complete Incident Report immediately following stabilization",
        ],
      },
    ],
  },
  {
    id: "behavioral",
    title: "Section 2 — Behavioral Incident Documentation",
    intro:
      "Any incident involving conflict, rule violation, threat, property damage, or disruptive behavior must be documented the same day it occurs using the Incident & Conflict Log. Staff do not decide consequences alone for major violations — those are escalated per Section 4.",
    blocks: [
      {
        heading: "What Must Be Documented",
        type: "bulleted",
        items: [
          "Date, time, and exact location of the incident",
          "Residents and staff involved, and any witnesses present",
          "A factual, objective description of what happened — no opinions or assumptions",
          "Immediate action taken by staff at the time",
          "Whether law enforcement, EMS, or a supervising officer was contacted",
          "Follow-up action required and who is responsible for it",
        ],
      },
    ],
    table: {
      heading: "Escalation Path",
      columns: ["Incident Level", "Response"],
      rows: [
        ["Minor — first-time rule violation", "House staff documents, addresses directly with resident, files Incident Log"],
        ["Moderate — repeat violation, verbal conflict", "House staff documents, notifies Director of Residential Services within 24 hours"],
        ["Serious — threats, property damage, safety concern", "Notify Director of Residential Services and President same day; written warning issued"],
        ["Severe — violence, weapons, sexual harassment, theft", "Call 911 if needed; notify President immediately; immediate discharge per House Rules"],
      ],
    },
  },
  {
    id: "relapse",
    title: "Section 3 — Relapse Response Plan",
    intro:
      "Grace Trace Ministries' Drug & Alcohol Policy is zero tolerance, and a confirmed positive test or on-site use is grounds for immediate discharge per the House Rules and Resident Agreement. This section governs how staff handle the moment a relapse is discovered, separate from the discharge decision itself.",
    blocks: [
      {
        heading: "Immediate Steps",
        type: "numbered",
        items: [
          "Ensure the resident's physical safety first — assess for overdose risk or need for medical attention",
          "Remove the resident from common areas to a private space to avoid public embarrassment of the resident",
          "Administer or arrange drug testing to confirm and document the result",
          "Notify the Director of Residential Services and President/Executive Director same day",
          "Notify the resident's supervising officer (parole, probation, VA) within 24 hours if applicable",
          "Follow the discharge protocol in Section 4 unless a documented program exception applies",
          "Offer the resident referral information for substance use treatment regardless of discharge status",
        ],
      },
      {
        heading: "Program Exceptions",
        type: "text",
        items: [
          "Any exception to immediate discharge following relapse (for example, a documented recovery-support track) must be approved in writing by the President/Executive Director before it is communicated to the resident. Staff do not have authority to grant exceptions independently.",
        ],
      },
    ],
  },
  {
    id: "discharge",
    title: "Section 4 — Involuntary Exit / Discharge Process",
    blocks: [
      {
        heading: "Immediate Discharge — No Notice Required",
        type: "bulleted",
        items: [
          "Possession, use, or distribution of drugs or alcohol",
          "Possession of a weapon",
          "Physical violence or threats of violence",
          "Sexual harassment or assault",
          "Theft",
          "AWOL — failure to return after curfew with no contact",
        ],
      },
      {
        heading: "Discharge Procedure",
        type: "numbered",
        items: [
          "Confirm the basis for discharge is documented (Incident Report, drug test result, etc.)",
          "President/Executive Director or Director of Residential Services authorizes the discharge",
          "Notify the resident in person when safe to do so, and in writing",
          "Notify the resident's supervising officer or referring agency (TDCJ, VA, BOP, court) within 24 hours",
          "Coordinate immediate safety needs — shelter referral, transportation, belongings",
          "Complete move-out inventory and return personal belongings per House Rules Section 8",
          "Document the discharge in the resident's permanent file with all supporting documentation",
        ],
      },
      {
        heading: "Standard Notice Discharge",
        type: "text",
        items: [
          "For non-immediate violations (repeated curfew violations, non-payment, non-compliance with program requirements), the standard progression in the House Rules applies: written warning, final warning, then 24-hour notice to vacate. All warnings must be documented in the resident's file.",
        ],
      },
    ],
  },
  {
    id: "reporting",
    title: "Section 5 — Mandatory Reporting Obligations",
    warning:
      "Staff are mandatory reporters under Texas law for suspected abuse, neglect, or exploitation of a child, elderly person, or person with a disability. This applies regardless of program type and cannot be waived by any internal policy.",
    blocks: [
      {
        heading: "What Must Be Reported",
        type: "bulleted",
        items: [
          "Suspected abuse, neglect, or exploitation of a resident who is a minor, elderly, or has a disability — report to Texas Department of Family and Protective Services (DFPS)",
          "Any death of a resident — notify law enforcement, then President/Executive Director immediately",
          "Any allegation of abuse by a staff member — notify President/Executive Director immediately and remove the staff member from resident contact pending investigation",
          "Serious injury requiring hospitalization — notify supervising/referring agency within 24 hours",
          "For DBMD residents specifically, incidents must also be reported per Texas HHSC DBMD waiver incident reporting requirements",
        ],
      },
    ],
    table: {
      heading: "Reporting Contacts",
      columns: ["Situation", "Report To"],
      rows: [
        ["Suspected abuse/neglect/exploitation", "Texas DFPS Abuse Hotline: 1-800-252-5400"],
        ["Life-threatening emergency", "911"],
        ["DBMD waiver incident", "Texas HHSC — per resident's DBMD service plan"],
        ["Internal staff conduct concern", "President/Executive Director — immediately"],
      ],
    },
  },
  {
    id: "contacts",
    title: "Section 6 — Emergency Contacts",
    table: {
      columns: ["Contact", "Number / Notes"],
      rows: [
        ["Emergency Services (Police/Fire/EMS)", "911"],
        ["Texas DFPS Abuse Hotline", "1-800-252-5400"],
        ["Poison Control", "1-800-222-1222"],
        ["National Suicide & Crisis Lifeline", "988"],
        ["SAMHSA National Helpline (Substance Use)", "1-800-662-4357"],
        ["President / Executive Director — Avrial Evans", "On file — primary escalation contact"],
        ["VP/COO — Travis Ramar", "On file — secondary escalation contact"],
        ["Director of Residential Services — Erica Evans", "On file"],
        ["Local Non-Emergency Police Line", "Fill in per property"],
        ["Nearest Hospital / Urgent Care", "Fill in per property"],
      ],
    },
  },
];