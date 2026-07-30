// lib/outreachResourceContent.js
//
// This file intentionally contains NO pre-written templates, scripts,
// learning content, documents, or completed examples. Every category
// below is an empty shell — names and icons only, matching the structure
// originally requested. All actual content is created exclusively
// through /admin/resource-templates by leadership, stored in the
// resource_templates database table, and pulled in dynamically.
//
// Do not add authored content to this file. If content needs to exist,
// it gets created through the admin tool, not hardcoded here.

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

const emptyLearningCenter = {
  whatItIs: "",
  whyItMatters: "",
  howItWorks: "",
  terminology: [],
  faqs: [],
  bestPractices: [],
};

export const CATEGORIES = [
  { id: "veterans", icon: "🪖", title: "Veterans Services", tagline: "VA programs, veteran housing resources, and referral partnerships", learningCenter: emptyLearningCenter, templates: [], documents: [], completedExamples: [] },
  { id: "workforce", icon: "💼", title: "Workforce Development", tagline: "Texas Workforce Boards, employer partnerships, and job training resources", learningCenter: emptyLearningCenter, templates: [], documents: [], completedExamples: [] },
  { id: "reentry", icon: "⚖️", title: "Reentry Services", tagline: "TDCJ, Federal Bureau of Prisons, probation, parole, and diversion programs", learningCenter: emptyLearningCenter, templates: [], documents: [], completedExamples: [] },
  { id: "housing", icon: "🏠", title: "Housing Resources", tagline: "Transitional housing, emergency shelters, sober living, and permanent supportive housing", learningCenter: emptyLearningCenter, templates: [], documents: [], completedExamples: [] },
  { id: "community", icon: "🤝", title: "Community Partnerships", tagline: "Churches, food banks, healthcare, transportation, education, and legal aid", learningCenter: emptyLearningCenter, templates: [], documents: [], completedExamples: [] },
  { id: "property", icon: "🏢", title: "Property Development", tagline: "How Grace Trace researches, negotiates, and acquires property for programs", learningCenter: emptyLearningCenter, templates: [], documents: [], completedExamples: [] },
  { id: "potentialProperties", icon: "📍", title: "Potential Properties", tagline: "The live tracker of specific buildings Grace Trace is pursuing", learningCenter: emptyLearningCenter, templates: [], documents: [], completedExamples: [] },
  { id: "funding", icon: "💰", title: "Funding Opportunities", tagline: "Grants, foundations, corporate giving, and sponsorships", learningCenter: emptyLearningCenter, templates: [], documents: [], completedExamples: [] },
];

export const DIRECTOR_TRAINING = [];