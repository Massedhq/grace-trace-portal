// lib/outreachResourceContent.js
//
// Learning Center content below is general educational reference material
// (what things are, terminology, best practices) — not scripts, contact
// lists, or anything that could be mistaken for content Avy/Deann wrote.
// Templates, Documents, and Completed Examples stay empty by design —
// those are created exclusively through /admin/resource-templates.

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

export const CATEGORIES = [
  {
    id: "veterans", icon: "🪖", title: "Veterans Services",
    tagline: "VA programs, veteran housing resources, and referral partnerships",
    learningCenter: {
      whatItIs: "Research and relationship-building with organizations serving veterans — VA facilities, County Veterans Service Offices, and veteran-focused housing programs.",
      whyItMatters: "Veterans are one of Grace Trace Ministries' core populations. VA-connected referral partnerships bring in stable, well-supported residents and open doors to VA-specific funding programs.",
      howItWorks: "Start with the local County Veterans Service Office — they know local veteran housing needs and can make direct referrals. Then build relationships with the nearest VA Medical Center or clinic.",
      terminology: [
        "GPD — Grant and Per Diem Program (VA-funded transitional housing for veterans)",
        "SSVF — Supportive Services for Veteran Families",
        "HUD-VASH — HUD-VA Supportive Housing (permanent housing vouchers plus VA case management)",
        "CVSO — County Veterans Service Office",
      ],
      faqs: [
        { q: "Do we need to be a VA-approved GPD provider to serve veterans?", a: "No — you can serve veterans without GPD approval, but becoming a GPD provider opens up per diem funding. That's a separate application process worth pursuing once the program is established." },
        { q: "Who should we contact first in a new county?", a: "The County Veterans Service Office. They're free, local, and already know which veterans need housing right now." },
      ],
      bestPractices: ["Never ask for funding on the first call — ask about needs first", "CVSOs move faster than VA facilities — start there", "Ask every contact who else in the area serves veterans — this builds your network fast"],
    },
    templates: [], documents: [], completedExamples: [],
  },
  {
    id: "workforce", icon: "💼", title: "Workforce Development",
    tagline: "Texas Workforce Boards, employer partnerships, and job training resources",
    learningCenter: {
      whatItIs: "Building relationships with Texas Workforce Boards, employers, and job training providers to help residents find stable employment.",
      whyItMatters: "Employment is one of the strongest predictors of successful reentry and long-term housing stability. Workforce partnerships give residents a direct path to jobs.",
      howItWorks: "Contact the local Workforce Solutions office to learn about job placement services, then build direct relationships with employers open to hiring people with records or in transitional housing.",
      terminology: [
        "Workforce Solutions — Texas's local workforce development boards",
        "Second-chance employer — a business explicitly open to hiring people with criminal records",
        "WIOA — Workforce Innovation and Opportunity Act (federal funding for job training)",
      ],
      faqs: [
        { q: "How do we find second-chance employers?", a: "Ask local Workforce Solutions offices — they often maintain lists. Also ask other reentry organizations who they place residents with." },
      ],
      bestPractices: ["Build direct relationships with a few reliable employers rather than a long list of cold contacts", "Ask what support the employer needs from Grace Trace (attendance verification, case management coordination)"],
    },
    templates: [], documents: [], completedExamples: [],
  },
  {
    id: "reentry", icon: "⚖️", title: "Reentry Services",
    tagline: "TDCJ, Federal Bureau of Prisons, probation, parole, and diversion programs",
    learningCenter: {
      whatItIs: "Relationships with correctional and supervision agencies — TDCJ, the Federal Bureau of Prisons, probation, and parole — that refer returning citizens for housing.",
      whyItMatters: "These agencies are the primary referral source for the reentry population Grace Trace serves. Becoming a known, trusted provider increases referral volume.",
      howItWorks: "Identify parole and probation officers in the service area, introduce Grace Trace's program, and clarify the referral process and any vendor approval requirements.",
      terminology: [
        "TDCJ — Texas Department of Criminal Justice",
        "BOP — Federal Bureau of Prisons",
        "RRC — Residential Reentry Center (halfway house)",
        "Supervised release — federal equivalent of parole",
      ],
      faqs: [
        { q: "Do we need to be an approved TDCJ vendor to receive referrals?", a: "Requirements vary by facility and district — some officers can refer informally, while formal contracts require a vendor application. Ask directly when making contact." },
      ],
      bestPractices: ["Document every officer contact with district and coverage area — this becomes the core referral network", "Always ask about upcoming release dates when talking to an officer — it surfaces immediate housing needs"],
    },
    templates: [], documents: [], completedExamples: [],
  },
  {
    id: "housing", icon: "🏠", title: "Housing Resources",
    tagline: "Transitional housing, emergency shelters, sober living, and permanent supportive housing",
    learningCenter: {
      whatItIs: "The broader landscape of housing options in the community — other transitional programs, shelters, sober living homes, and permanent supportive housing.",
      whyItMatters: "Understanding the full local housing landscape helps Grace Trace know where to refer residents who don't fit its program, and identifies potential partners rather than competitors.",
      howItWorks: "Map out other housing providers in the service area, understand who they serve and their capacity, and build referral relationships in both directions.",
      terminology: [
        "PSH — Permanent Supportive Housing",
        "Sober living — alcohol/drug-free housing, typically without formal case management",
        "Continuum of Care (CoC) — the local coordinated homeless-services planning body",
      ],
      faqs: [
        { q: "Should we consider other housing providers competitors?", a: "Generally no — most communities have far more housing need than capacity. Other providers are usually referral partners, not competition." },
      ],
      bestPractices: ["Join or attend the local Continuum of Care meetings if available — this connects to the entire housing network at once"],
    },
    templates: [], documents: [], completedExamples: [],
  },
  {
    id: "community", icon: "🤝", title: "Community Partnerships",
    tagline: "Churches, food banks, healthcare, transportation, education, and legal aid",
    learningCenter: {
      whatItIs: "Relationships with churches, food banks, healthcare providers, transportation services, and legal aid organizations that support residents' broader needs.",
      whyItMatters: "Housing alone doesn't solve every barrier a resident faces. Community partnerships fill gaps Grace Trace's own program doesn't cover — food, healthcare, legal help, transportation.",
      howItWorks: "Identify community organizations serving the same population, introduce Grace Trace's program, and clarify what resources or referrals each side can offer the other.",
      terminology: [
        "Wraparound services — the network of support services surrounding core housing",
        "In-kind donation — non-cash support (goods, services, volunteer time)",
      ],
      faqs: [],
      bestPractices: ["Faith-based organizations are often the fastest to build trust with — many already serve similar populations", "Keep a running list of what each partner can offer so referrals go to the right place"],
    },
    templates: [], documents: [], completedExamples: [],
  },
  {
    id: "property", icon: "🏢", title: "Property Development",
    tagline: "How Grace Trace researches, negotiates, and acquires property for programs",
    learningCenter: {
      whatItIs: "The process and strategy behind identifying, negotiating for, and acquiring buildings for Grace Trace Ministries' programs — separate from the specific list of properties being pursued (see Potential Properties).",
      whyItMatters: "Owning property gives Grace Trace long-term stability and control over program design. Many vacant or underused buildings can be acquired with little upfront cash through creative structuring.",
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
        "Meet with city economic development officials early — they often know which properties are easiest to acquire",
      ],
    },
    templates: [], documents: [], completedExamples: [],
  },
  {
    id: "potentialProperties", icon: "📍", title: "Potential Properties",
    tagline: "The live tracker of specific buildings Grace Trace is pursuing",
    learningCenter: {
      whatItIs: "The running list of specific properties Grace Trace Ministries is actively researching or pursuing for future programs — as opposed to Property Development, which covers the general process and strategy.",
      whyItMatters: "Keeping every potential property in one place, with owner research and outreach status, prevents opportunities from being lost or duplicated as the organization grows.",
      howItWorks: "Every property gets its own entry using the Property Research Form — address, vacancy history, owner information, local population data, and outreach status.",
      terminology: ["Vacancy period", "Appraisal district", "Redevelopment incentive", "Economic Development Corporation (EDC)"],
      faqs: [
        { q: "What's the difference between this and Property Development?", a: "Property Development is the how-to playbook. Potential Properties is the actual list of specific addresses being pursued right now." },
      ],
      bestPractices: ["Log every property the moment it's identified, even before the owner is found", "Note population and nearby resources for every property — it strengthens grant applications later"],
    },
    templates: [], documents: [], completedExamples: [],
  },
  {
    id: "funding", icon: "💰", title: "Funding Opportunities",
    tagline: "Grants, foundations, corporate giving, and sponsorships",
    learningCenter: {
      whatItIs: "The landscape of grants, foundations, corporate giving programs, and sponsorships available to a Texas 501(c)(3) providing transitional housing.",
      whyItMatters: "Diversified funding reduces dependence on any single source and supports program growth and stability.",
      howItWorks: "Register with SAM.gov and Grants.gov, monitor relevant funding opportunities (HUD, DOJ, VA), and build relationships with local and regional foundations.",
      terminology: [
        "SAM.gov — federal System for Award Management, required for federal grant eligibility",
        "Grants.gov — the federal portal for finding and applying to federal grant opportunities",
        "Restricted vs. unrestricted funding — restricted funds must be used for a specific purpose; unrestricted funds can be used anywhere",
      ],
      faqs: [
        { q: "What federal programs are most relevant to Grace Trace?", a: "DOJ Second Chance Act grants and HUD Continuum of Care funding are both directly relevant to reentry and transitional housing work." },
      ],
      bestPractices: ["Track every grant deadline in one place — missed deadlines are the most common lost opportunity", "Build foundation relationships before applying, when possible — a warm introduction improves odds significantly"],
    },
    templates: [], documents: [], completedExamples: [],
  },
];

export const DIRECTOR_TRAINING = [];