// lib/outreachResourceContent.js
//
// Content for the Outreach Resource Center. Each category follows the same
// 5-tab structure: Learning Center, Templates, Forms, Documents, Completed Examples.
//
// NOTE: Completed Examples only contain REAL information already researched
// (Veterans Services, Potential Properties). Categories without real partner
// data yet start empty by design — do not fabricate example organizations,
// contacts, or numbers here. Add real ones as Deann documents them.

export const RESEARCH_TEMPLATE_FIELDS = [
  { key: "orgName", label: "Organization Name" },
  { key: "orgType", label: "Organization Type" },
  { key: "website", label: "Website" },
  { key: "address", label: "Address" },
  { key: "contactName", label: "Primary Contact" },
  { key: "contactTitle", label: "Title" },
  { key: "phone", label: "Phone Number" },
  { key: "email", label: "Email Address" },
  { key: "serviceArea", label: "Service Area" },
  { key: "mission", label: "Mission" },
  { key: "programs", label: "Programs & Services" },
  { key: "population", label: "Population Served" },
  { key: "eligibility", label: "Eligibility Requirements" },
  { key: "referralProcess", label: "Referral Process" },
  { key: "docsRequired", label: "Required Documentation" },
  { key: "communityNeeds", label: "Current Community Needs" },
  { key: "partnershipOpportunities", label: "Partnership Opportunities" },
  { key: "questionsToAsk", label: "Questions to Ask" },
  { key: "meetingNotes", label: "Meeting Notes" },
  { key: "followUpActions", label: "Follow-Up Actions" },
  { key: "nextFollowUpDate", label: "Next Follow-Up Date" },
  { key: "status", label: "Status (Researching / Initial Contact / Meeting Scheduled / Partnership Discussion / Active Partner / Referral Partner)" },
  { key: "notes", label: "Internal Notes" },
];

function genericLearningCenter(topic) {
  return {
    whatItIs: `An overview of ${topic} as it relates to Grace Trace Ministries' outreach and partnership work.`,
    whyItMatters: `Strong relationships in ${topic} expand the referral network, surface funding and partnership opportunities, and help Grace Trace understand unmet needs in the community.`,
    howItWorks: "Research the organization, make initial contact, document what's learned, schedule a meeting, and move the relationship from 'researching' toward 'active partner' using the standard research template.",
    terminology: ["Referral partner", "MOU (Memorandum of Understanding)", "Service area", "Eligibility criteria", "Warm referral vs. cold referral"],
    faqs: [
      { q: "Where do I start?", a: "Use the Templates tab for outreach scripts, then log everything in the Forms tab using the standard research template." },
      { q: "What if the organization doesn't respond?", a: "Follow up once by phone and once by email before moving on. Document every attempt in the Forms tab." },
    ],
    bestPractices: ["Always follow up in writing after a call", "Document community needs mentioned in every meeting — even small details matter later", "Keep every contact's information current in the research template"],
  };
}

function genericTemplates() {
  return [
    {
      title: "Initial Outreach Email",
      body: `Subject: Introduction — Grace Trace Ministries

Hi [Name],

My name is Deann Evans, Director of Outreach for Grace Trace Ministries, a Texas 501(c)(3) nonprofit providing transitional housing and reentry support services. I'm reaching out to learn more about [organization] and explore whether there's an opportunity to partner or coordinate referrals.

Would you have 15–20 minutes this week or next for a short call?

Thank you for your time,
Deann Evans
Director of Outreach, Grace Trace Ministries`,
    },
    {
      title: "Phone Call Script",
      body: `1. Introduce yourself and Grace Trace Ministries (one sentence — nonprofit, transitional housing, reentry support).
2. Ask what the organization does and who they serve.
3. Ask: "What are you seeing in terms of unmet needs in this population right now?"
4. Ask: "How do you currently handle referrals in or out?"
5. Ask if they'd be open to a follow-up meeting or site visit.
6. Thank them and confirm next steps.`,
    },
    {
      title: "Meeting Agenda",
      body: `1. Introductions
2. Grace Trace Ministries overview (mission, programs, populations served)
3. Their organization's overview
4. Current needs and gaps
5. Referral process — both directions
6. Partnership opportunities
7. Next steps and follow-up date`,
    },
    {
      title: "Follow-Up Email",
      body: `Subject: Thank you — Grace Trace Ministries

Hi [Name],

Thank you for taking the time to meet with me today. I really appreciated learning more about [organization] and [specific detail from the meeting].

As discussed, next steps are: [list next steps].

I'll follow up on [date]. Please don't hesitate to reach out before then with any questions.

Best,
Deann Evans
Director of Outreach, Grace Trace Ministries`,
    },
  ];
}

function genericDocuments() {
  return ["Grace Trace Ministries One-Page Overview", "501(c)(3) Determination Letter", "Program Brochure", "MOU Template (blank)", "Referral Form Template (blank)"];
}

export const CATEGORIES = [
  {
    id: "veterans",
    icon: "🪖",
    title: "Veterans Services",
    tagline: "VA programs, veteran housing resources, and referral partnerships",
    learningCenter: {
      whatItIs: "Research and relationship-building with organizations serving veterans — VA facilities, County Veterans Service Offices, and veteran-focused housing programs.",
      whyItMatters: "Veterans are one of Grace Trace Ministries' core populations. VA-connected referral partnerships bring in stable, well-supported residents and open doors to VA-specific funding programs (GPD, SSVF, HUD-VASH).",
      howItWorks: "Start with the local County Veterans Service Office — they know every veteran housing need in the area and can make direct referrals. Then build relationships with the nearest VA Medical Center or clinic.",
      terminology: [
        "GPD — Grant and Per Diem Program (VA-funded transitional housing for veterans)",
        "SSVF — Supportive Services for Veteran Families",
        "HUD-VASH — HUD-VA Supportive Housing (permanent housing vouchers + VA case management)",
        "CVSO — County Veterans Service Office",
      ],
      faqs: [
        { q: "Do we need to be a VA-approved GPD provider to serve veterans?", a: "No — you can serve veterans without GPD approval, but becoming a GPD provider opens up per diem funding. That's a separate, longer application process worth pursuing once the program is established." },
        { q: "Who should we contact first in a new county?", a: "The County Veterans Service Office. They're free, local, and already know which veterans need housing right now." },
      ],
      bestPractices: ["Never ask for funding on the first call — ask about needs first", "CVSOs move faster than VA facilities — start there", "Ask every contact who else in the area serves veterans — this builds your network fast"],
    },
    templates: genericTemplates(),
    documents: [...genericDocuments(), "VA GPD Program Overview", "HUD-VASH Fact Sheet"],
    completedExamples: [
      {
        title: "Henderson County Veterans Service Office",
        body: `Organization Type: County Veterans Service Office
Address: Henderson County Courthouse Annex, Athens, TX
Service Area: Henderson County, TX

Notes: Assists veterans with VA benefits claims and often has direct knowledge of local housing needs and existing community partners. Recommended first contact before reaching out to the VA directly.

Questions to ask when contacting:
- How many veterans in Henderson County need housing assistance right now?
- Which organizations are currently serving homeless or at-risk veterans in the area?
- How can Grace Trace Ministries become a referral partner?
- Would they support a transitional housing program in Athens?

Status: Researching — identified as first point of contact for the Athens, TX property opportunity.`,
      },
      {
        title: "Tyler VA Clinic",
        body: `Organization Type: VA Outpatient Clinic (VA North Texas Health System)
Address: 1700 South Southeast Loop 323, Tyler, TX 75701
Service Area: East Texas, including Henderson County

Notes: Closest VA clinic to Athens, TX. Serves as a regional point of contact for veterans in the area and a potential referral partner once Grace Trace's Athens program is established.

Status: Researching.`,
      },
    ],
  },
  {
    id: "workforce",
    icon: "💼",
    title: "Workforce Development",
    tagline: "Texas Workforce Boards, employer partnerships, and job training resources",
    learningCenter: genericLearningCenter("workforce development"),
    templates: genericTemplates(),
    documents: genericDocuments(),
    completedExamples: [],
  },
  {
    id: "reentry",
    icon: "⚖️",
    title: "Reentry Services",
    tagline: "TDCJ, Federal Bureau of Prisons, probation, parole, and diversion programs",
    learningCenter: {
      ...genericLearningCenter("reentry services"),
      terminology: ["TDCJ — Texas Department of Criminal Justice", "BOP — Federal Bureau of Prisons", "RRC — Residential Reentry Center (halfway house)", "Supervised release", "Parole vs. probation"],
    },
    templates: genericTemplates(),
    documents: [...genericDocuments(), "TDCJ Vendor/Provider Application Overview"],
    completedExamples: [],
  },
  {
    id: "housing",
    icon: "🏠",
    title: "Housing Resources",
    tagline: "Transitional housing, emergency shelters, sober living, and permanent supportive housing",
    learningCenter: genericLearningCenter("housing resources"),
    templates: genericTemplates(),
    documents: genericDocuments(),
    completedExamples: [],
  },
  {
    id: "community",
    icon: "🤝",
    title: "Community Partnerships",
    tagline: "Churches, food banks, healthcare, transportation, education, and legal aid",
    learningCenter: genericLearningCenter("community partnerships"),
    templates: genericTemplates(),
    documents: genericDocuments(),
    completedExamples: [],
  },
  {
    id: "property",
    icon: "🏢",
    title: "Property Development",
    tagline: "How Grace Trace researches, negotiates, and acquires property for programs",
    learningCenter: {
      whatItIs: "The process and strategy behind identifying, negotiating for, and acquiring buildings for Grace Trace Ministries' programs — separate from the specific list of properties being pursued (see Potential Properties).",
      whyItMatters: "Owning property (rather than leasing) gives Grace Trace long-term stability and control over program design. Many vacant or underused buildings can be acquired with little upfront cash through creative structuring.",
      howItWorks: "Identify a vacant or underused building, find the owner through county appraisal district records, and open a conversation focused on control (an option or financing arrangement) rather than an outright cash purchase.",
      terminology: [
        "Owner financing — the seller acts as the lender, receiving payments over time instead of a lump sum",
        "Bargain sale — a below-market sale to a nonprofit, often with tax benefits for the seller",
        "Purchase option — the exclusive right to buy a property within a set time, usually for a small deposit",
        "CDBG — Community Development Block Grant",
        "CDFI — Community Development Financial Institution",
      ],
      faqs: [
        { q: "We have little or no cash — can we still pursue a building?", a: "Yes. The first goal is control, not ownership — a purchase option or owner-financing agreement can secure a building with little to no money down." },
        { q: "How do we find who owns a vacant building?", a: "Search the county appraisal district's property records (usually free online) or county deed records for the property address." },
      ],
      bestPractices: [
        "Lead with mission, not money, when contacting an owner of a long-vacant building",
        "Always ask about owner financing, bargain sale, and purchase options before assuming a cash purchase is required",
        "Meet with city economic development officials early — they often know which properties are easiest to acquire and may offer incentives",
      ],
    },
    templates: [
      {
        title: "Property Owner Outreach Script",
        body: `"I'm the founder of Grace Trace Ministries, a registered 501(c)(3). We'd like to redevelop your vacant building into transitional housing that serves veterans and other individuals rebuilding their lives. Since the property has been vacant for [X years], would you be open to discussing owner financing, a purchase option, or another creative arrangement that allows us to bring it back into productive use?"`,
      },
      ...genericTemplates(),
    ],
    documents: [...genericDocuments(), "One-Page Property Redevelopment Overview"],
    completedExamples: [],
  },
  {
    id: "potentialProperties",
    icon: "📍",
    title: "Potential Properties",
    tagline: "The live tracker of specific buildings Grace Trace is pursuing",
    learningCenter: {
      whatItIs: "The running list of specific properties Grace Trace Ministries is actively researching or pursuing for future programs — as opposed to Property Development, which covers the general process and strategy.",
      whyItMatters: "Keeping every potential property in one place, with owner research and outreach status, prevents opportunities from being lost or duplicated as the organization grows.",
      howItWorks: "Every property gets its own entry using the Property Research Form — address, vacancy history, owner information, local population data, nearby veteran/reentry resources, and outreach status.",
      terminology: ["Vacancy period", "Appraisal district", "Redevelopment incentive", "Economic Development Corporation (EDC)"],
      faqs: [
        { q: "What's the difference between this and Property Development?", a: "Property Development is the how-to playbook. Potential Properties is the actual list of specific addresses being pursued right now." },
      ],
      bestPractices: ["Log every property the moment it's identified, even before the owner is found", "Note population and nearby veteran/reentry resources for every property — it strengthens grant applications later"],
    },
    templates: [
      {
        title: "Property Research Template",
        body: `Property Address:
Vacancy Length:
Estimated Population Served (city/county):
Owner Name (via appraisal district / deed records):
Owner Contact Info:
Zoning:
Nearby Veteran/Reentry Resources:
Local Economic Development Contact:
Outreach Status:
Next Step:`,
      },
    ],
    documents: ["County Appraisal District Search Guide", "One-Page Property Redevelopment Overview"],
    completedExamples: [
      {
        title: "Athens, TX — Vacant Building (Henderson County)",
        body: `Property Address: Athens, TX (specific address pending owner research)
Vacancy Length: Approximately 1,698 days (~4 years, 8 months) as of last research
Estimated Population Served: Athens, TX has an estimated population of about 13,000; it is the county seat of Henderson County

Owner Research: Not yet identified — next step is to search Henderson County Appraisal District or county deed records for the property address to find the current owner.

Nearby Veteran/Reentry Resources:
- Henderson County Veterans Service Office (Henderson County Courthouse Annex, Athens, TX) — first point of contact for veteran housing needs in the area
- Tyler VA Clinic, 1700 South Southeast Loop 323, Tyler, TX 75701 — closest VA facility, part of VA North Texas health system

Outreach Plan:
1. Identify the property owner through Henderson County Appraisal District or deed records
2. Contact the owner with a proposal explaining Grace Trace Ministries' 501(c)(3) status and intent to redevelop into transitional housing
3. Ask about owner financing, a purchase option, a bargain sale, or a delayed closing while funding is secured
4. Meet with Athens city officials and the Economic Development Corporation about redevelopment incentives
5. Meet with the Henderson County Veterans Service Office to discuss local veteran housing needs and referral partnership potential
6. Prepare a one-page Grace Trace Ministries overview to use with the owner, the city, and veterans' organizations

Status: Researching — owner not yet identified.
Next Step: Search Henderson County Appraisal District records for the property address.`,
      },
    ],
  },
  {
    id: "funding",
    icon: "💰",
    title: "Funding Opportunities",
    tagline: "Grants, foundations, corporate giving, and sponsorships",
    learningCenter: genericLearningCenter("funding opportunities"),
    templates: genericTemplates(),
    documents: [...genericDocuments(), "SAM.gov / Grants.gov Registration Overview"],
    completedExamples: [],
  },
];

export const DIRECTOR_TRAINING = [
  {
    title: "How to Research an Organization",
    body: `1. Search the organization's website and note their mission, programs, and population served.
2. Identify the primary contact — director, coordinator, or case manager, not general info lines when possible.
3. Check for news mentions or recent grant awards — this tells you what they're currently focused on.
4. Fill in the Standard Outreach Research Template with everything you find before making contact.
5. Prepare 2–3 specific questions based on your research, not generic ones.`,
  },
  {
    title: "How to Make the First Call",
    body: `1. Introduce yourself and Grace Trace Ministries in one or two sentences — don't over-explain.
2. Ask about them first — what they do, who they serve, what's needed.
3. Listen for unmet needs or gaps — these are your partnership opportunities.
4. Ask if they're open to a follow-up meeting.
5. Confirm next steps and a specific date before hanging up.
6. Document the call immediately in the research template while it's fresh.`,
  },
  {
    title: "How to Schedule Meetings",
    body: `1. Propose two or three specific times rather than asking "when works for you" — specifics get faster responses.
2. Confirm the meeting format (in person, phone, or video) in writing.
3. Send a calendar invite or written confirmation the same day it's scheduled.
4. Prepare the Meeting Agenda template in advance and bring it to the meeting.
5. Send a reminder 24 hours before if it's more than a week out.`,
  },
  {
    title: "How to Present Grace Trace Ministries",
    body: `1. Lead with mission: transitional housing and reentry support for veterans, returning citizens, and other individuals rebuilding their lives.
2. Mention 501(c)(3) status early — it signals legitimacy.
3. Briefly describe current programs and populations served.
4. Explain what you're hoping to build together — be specific about the ask (referral partnership, resource sharing, co-location, etc.).
5. Always bring or send the One-Page Grace Trace Ministries Overview document.`,
  },
  {
    title: "How to Build Community Partnerships",
    body: `1. Start with organizations that already serve your target population — they're the fastest path to real partnerships.
2. Ask every contact who else they'd recommend you speak with — this compounds your network quickly.
3. Offer something concrete, not just a request — what can Grace Trace provide them in return?
4. Move slowly from "researching" to "active partner" — don't skip the relationship-building steps.
5. Formalize strong partnerships with an MOU once trust is established.`,
  },
  {
    title: "How to Document Every Meeting",
    body: `1. Fill in the Meeting Notes section of the research template the same day — details fade fast.
2. Capture specific community needs mentioned, even offhand comments — these matter for grant applications later.
3. Note any follow-up commitments made by either side.
4. Update the Status field immediately (Researching → Initial Contact → Meeting Scheduled → Partnership Discussion → Active Partner).
5. Set the Next Follow-Up Date before closing out the record.`,
  },
  {
    title: "How to Request Referrals",
    body: `1. Only ask for referrals after the relationship is established — not on the first call.
2. Be specific about who you can serve — population, eligibility, and current capacity.
3. Explain the referral process clearly — what they need to send you and how.
4. Offer to send referrals back their way when appropriate — referral partnerships work both directions.
5. Follow up on every referral received or sent so the partner knows the loop was closed.`,
  },
  {
    title: "How to Follow Up Professionally",
    body: `1. Send a written follow-up within 24 hours of any call or meeting.
2. Reference something specific from the conversation — shows you were listening.
3. Restate next steps and dates clearly.
4. If they haven't responded by the follow-up date, one more attempt is appropriate — then move on and revisit later.
5. Log every follow-up attempt in the research template, including no-response outcomes.`,
  },
  {
    title: "How to Turn a Contact into a Long-Term Partner",
    body: `1. Stay consistent — check in periodically even when there's no immediate need.
2. Share Grace Trace Ministries updates and successes with active partners.
3. Ask about their evolving needs, not just your own.
4. Formalize the relationship with an MOU once referrals are flowing both directions.
5. Recognize and thank partners publicly when appropriate (with their permission) — strong relationships compound over time.`,
  },
];