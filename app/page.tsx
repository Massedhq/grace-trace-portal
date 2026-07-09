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

const USERS = [
  {
    id: "avy",
    name: "Avrial Evans (Avy)",
    initials: "AE",
    color: C.burgundy,
    password: "GTM@Avy2026",
    role: "President / Executive Director / Board Chair",
    tasks: [
      {
        id: "a1", title: "Overnight Report Review",
        fields: [
          { key: "incidents", label: "Were there any incidents or curfew violations reported overnight?", type: "textarea", ph: "Describe any incidents, violations, or notes from last night" },
          { key: "action", label: "What action was taken or is needed?", type: "textarea", ph: "Document your response or next steps" },
          { key: "staffNotified", label: "Which staff members were notified?", type: "text", ph: "Names of staff contacted" },
          { key: "time", label: "Time reviewed", type: "text", ph: "e.g. 8:00 AM" },
        ]
      },
      {
        id: "a2", title: "Board and Contract Communications",
        fields: [
          { key: "emailsReviewed", label: "What emails or correspondence were reviewed today?", type: "textarea", ph: "Summarize key emails, calls, or messages received" },
          { key: "agenciesContacted", label: "Which agencies or contacts were communicated with?", type: "text", ph: "e.g. TDCJ, BOP, VA, legal counsel" },
          { key: "actionItems", label: "What action items came out of these communications?", type: "textarea", ph: "List follow-up tasks and who is responsible" },
          { key: "time", label: "Time completed", type: "text", ph: "e.g. 9:30 AM" },
        ]
      },
      {
        id: "a3", title: "Financial Oversight Review",
        fields: [
          { key: "bankReviewed", label: "Was the bank account reviewed today?", type: "select", options: ["Yes", "No"] },
          { key: "expenses", label: "Any notable expenses or transactions to document?", type: "textarea", ph: "Describe any payments made, received, or pending" },
          { key: "concerns", label: "Any financial concerns or discrepancies?", type: "textarea", ph: "Document any issues or flags" },
          { key: "time", label: "Time completed", type: "text", ph: "e.g. 10:00 AM" },
        ]
      },
      {
        id: "a4", title: "Staff Report Review",
        fields: [
          { key: "reportsReceived", label: "Which staff submitted their daily reports today?", type: "textarea", ph: "List names of staff who submitted" },
          { key: "missing", label: "Who has not submitted a report yet?", type: "text", ph: "Names of staff with missing reports" },
          { key: "keyNotes", label: "Key items noted from staff reports", type: "textarea", ph: "Summarize important updates from across the team" },
          { key: "time", label: "Time reviewed", type: "text", ph: "e.g. 11:00 AM" },
        ]
      },
      {
        id: "a5", title: "Contract Opportunity Follow-Ups",
        fields: [
          { key: "agency", label: "Which agency or contract was followed up on today?", type: "text", ph: "e.g. TDCJ, BOP, VA GPD" },
          { key: "contactName", label: "Who was contacted?", type: "text", ph: "Name and title of contact" },
          { key: "outcome", label: "What was the outcome or status?", type: "textarea", ph: "Describe the conversation, email, or response received" },
          { key: "nextStep", label: "What is the next step and when?", type: "textarea", ph: "Document follow-up action and timeline" },
        ]
      },
      {
        id: "a6", title: "Strategic Planning",
        fields: [
          { key: "decisions", label: "What decisions were made today?", type: "textarea", ph: "Document key decisions for the organization" },
          { key: "priorities", label: "What are the top priorities for this week?", type: "textarea", ph: "List priorities in order of importance" },
          { key: "blockers", label: "What blockers or challenges need to be addressed?", type: "textarea", ph: "Document any obstacles and how they will be resolved" },
          { key: "time", label: "Time completed", type: "text", ph: "e.g. 3:00 PM" },
        ]
      },
      {
        id: "a7", title: "Community and Partner Outreach",
        fields: [
          { key: "who", label: "Who was contacted today?", type: "text", ph: "Name and organization" },
          { key: "purpose", label: "What was the purpose of the outreach?", type: "textarea", ph: "Describe the goal of the call or meeting" },
          { key: "outcome", label: "What was the outcome?", type: "textarea", ph: "Describe what was accomplished or agreed upon" },
          { key: "followUp", label: "Is a follow-up needed? When?", type: "text", ph: "Follow-up date or action needed" },
        ]
      },
    ]
  },
  {
    id: "travis",
    name: "Travis Ramar",
    initials: "TR",
    color: C.green,
    password: "GTM@Travis2026",
    role: "VP / COO / Board Member",
    tasks: [
      {
        id: "t1", title: "Staff Report Review",
        fields: [
          { key: "received", label: "Which staff submitted reports today?", type: "textarea", ph: "List names of staff who submitted workday reports" },
          { key: "missing", label: "Who has not submitted?", type: "text", ph: "Names of staff with missing reports" },
          { key: "keyFindings", label: "Key findings from today's reports", type: "textarea", ph: "Summarize the most important updates across all staff reports" },
          { key: "escalations", label: "Any issues that need to be escalated to Avy?", type: "textarea", ph: "Describe any urgent matters requiring the President's attention" },
        ]
      },
      {
        id: "t2", title: "Operations Oversight",
        fields: [
          { key: "issuesReported", label: "What operational issues were reported today?", type: "textarea", ph: "Describe any facility, resident, or staff issues" },
          { key: "actionTaken", label: "What action was taken?", type: "textarea", ph: "Document your response and resolution steps" },
          { key: "openItems", label: "What items remain open and need follow-up?", type: "textarea", ph: "List unresolved items and who is responsible" },
          { key: "time", label: "Time completed", type: "text", ph: "e.g. 10:00 AM" },
        ]
      },
      {
        id: "t3", title: "Contract and Agency Follow-Ups",
        fields: [
          { key: "agency", label: "Which agency or contract was followed up on?", type: "text", ph: "e.g. TDCJ, BOP, VA GPD" },
          { key: "contact", label: "Who was contacted?", type: "text", ph: "Name and title" },
          { key: "status", label: "What is the current status?", type: "textarea", ph: "Describe the outcome of the follow-up" },
          { key: "nextStep", label: "Next step and timeline", type: "textarea", ph: "Document what happens next and when" },
        ]
      },
      {
        id: "t4", title: "Executive Coordination with Avy",
        fields: [
          { key: "topicsDiscussed", label: "What was discussed with Avy today?", type: "textarea", ph: "Summarize the conversation or coordination points" },
          { key: "decisions", label: "What decisions or agreements were made?", type: "textarea", ph: "Document outcomes from the conversation" },
          { key: "myActionItems", label: "What are your action items coming out of this?", type: "textarea", ph: "List your personal follow-up tasks" },
        ]
      },
      {
        id: "t5", title: "Community and Stakeholder Outreach",
        fields: [
          { key: "who", label: "Who was contacted today?", type: "text", ph: "Name and organization" },
          { key: "purpose", label: "Purpose of the outreach", type: "textarea", ph: "Describe the goal of the contact" },
          { key: "outcome", label: "Outcome", type: "textarea", ph: "What was accomplished?" },
          { key: "followUp", label: "Follow-up needed?", type: "text", ph: "Date or action required" },
        ]
      },
      {
        id: "t6", title: "Program Compliance Review",
        fields: [
          { key: "areaReviewed", label: "What area of compliance was reviewed today?", type: "text", ph: "e.g. resident documentation, service delivery, house rules" },
          { key: "findings", label: "What did the review find?", type: "textarea", ph: "Describe what is in compliance and what needs attention" },
          { key: "gaps", label: "Any gaps or concerns identified?", type: "textarea", ph: "Document anything that needs to be corrected" },
          { key: "correctionPlan", label: "Correction plan or next steps", type: "textarea", ph: "How and when will gaps be addressed?" },
        ]
      },
    ]
  },
  {
    id: "deann",
    name: "Deann Evans",
    initials: "DE",
    color: "#8B2A3E",
    password: "GTM@Deann2026",
    role: "Program and Outreach Director / House Manager Oversight / Registered Agent",
    tasks: [
      {
        id: "d1", title: "Registered Agent — Mail and Legal Notices",
        fields: [
          { key: "mailReceived", label: "Was any legal mail or registered agent correspondence received?", type: "select", options: ["Yes", "No"] },
          { key: "description", label: "If yes, describe the correspondence", type: "textarea", ph: "Sender, subject, and content of the notice" },
          { key: "actionRequired", label: "What action is required?", type: "textarea", ph: "Document response needed and deadline" },
          { key: "avyNotified", label: "Was Avy notified?", type: "select", options: ["Yes", "No", "Not required"] },
        ]
      },
      {
        id: "d2", title: "Outreach Contact Log",
        fields: [
          { key: "contactName", label: "Full name of person contacted", type: "text", ph: "First and last name" },
          { key: "contactTitle", label: "Title and organization", type: "text", ph: "e.g. Parole Officer, TDCJ District 4 — Houston" },
          { key: "contactType", label: "Type of contact", type: "select", options: ["Phone call", "Email", "In-person visit", "Virtual meeting", "Text message", "Voicemail left"] },
          { key: "contactPhone", label: "Phone number", type: "text", ph: "Direct phone number" },
          { key: "contactEmail", label: "Email address collected", type: "text", ph: "Email address" },
          { key: "agencyType", label: "Agency or facility type", type: "select", options: ["Parole office", "Probation office", "TDCJ facility", "Federal BOP facility", "VA Medical Center", "Veterans service organization", "Reentry coalition", "Faith-based organization", "Workforce agency", "Legal aid", "Community nonprofit", "Employer", "Other"] },
          { key: "purpose", label: "What was the purpose of this contact?", type: "textarea", ph: "What was the goal — introduce Grace Trace, follow up on referral, build relationship, request to be added to vendor list?" },
          { key: "whatWasNeeded", label: "What did they say is needed from Grace Trace Ministries?", type: "textarea", ph: "Any qualifications, certifications, paperwork, or requirements they mentioned" },
          { key: "vendorApproval", label: "Is vendor or provider approval required to receive referrals from this contact?", type: "select", options: ["Yes — already approved", "Yes — application in progress", "Yes — need to apply", "No — referrals can start now", "Unknown — need to follow up"] },
          { key: "vendorRequirements", label: "What is required to get on their vendor or referral list?", type: "textarea", ph: "List every requirement they mentioned — licensing, insurance, capacity, documentation, background checks, site visits, etc." },
          { key: "outcome", label: "What was the outcome of this contact?", type: "textarea", ph: "What was accomplished, agreed upon, or committed to?" },
          { key: "referralExpected", label: "Is a referral expected from this contact?", type: "select", options: ["Yes — referral incoming", "Maybe — follow up needed", "No — not at this time", "They are adding us to their list"] },
          { key: "followUpDate", label: "Follow-up date and time", type: "text", ph: "e.g. July 15, 2026 at 10:00 AM" },
          { key: "followUpAction", label: "What is the follow-up action?", type: "textarea", ph: "What needs to happen next — call back, send documents, schedule a visit, submit application?" },
        ]
      },
      {
        id: "d3", title: "Parole & Probation Officer Outreach",
        fields: [
          { key: "officerName", label: "Officer name", type: "text", ph: "Full name of parole or probation officer" },
          { key: "officerTitle", label: "Title and office", type: "text", ph: "e.g. Parole Officer — TDCJ Houston District 3" },
          { key: "officerPhone", label: "Direct phone number", type: "text", ph: "Direct line" },
          { key: "officerEmail", label: "Email address", type: "text", ph: "Email address" },
          { key: "districtOrRegion", label: "District or region they cover", type: "text", ph: "e.g. Houston South, Harris County" },
          { key: "howContacted", label: "How was contact made?", type: "select", options: ["Phone call — spoke directly", "Phone call — voicemail left", "Email sent", "In-person visit", "Referred by another officer"] },
          { key: "clientsSupervising", label: "How many clients are they currently supervising who may need housing?", type: "text", ph: "Approximate number" },
          { key: "referralProcess", label: "What is their referral process?", type: "textarea", ph: "How do they refer clients — phone, email, form, through TDCJ system?" },
          { key: "requirementsForReferral", label: "What does Grace Trace need to provide to receive referrals from them?", type: "textarea", ph: "Any documentation, capacity info, certifications, or program details they need" },
          { key: "currentNeed", label: "Do they have anyone in immediate need of housing right now?", type: "select", options: ["Yes — details in notes", "Not right now — but soon", "No current need", "Unknown"] },
          { key: "immediateNeedDetails", label: "If yes — describe the immediate housing need", type: "textarea", ph: "Name or initials, release date, special requirements, supervision conditions" },
          { key: "relationshipStatus", label: "What is the relationship status with this officer?", type: "select", options: ["New contact — first time speaking", "Warm — they are interested", "Active — referrals expected", "Established — sending referrals regularly"] },
          { key: "followUpDate", label: "Follow-up date", type: "text", ph: "e.g. July 14, 2026" },
          { key: "notes", label: "Additional notes", type: "textarea", ph: "Anything else important to document about this officer or conversation" },
        ]
      },
      {
        id: "d4", title: "TDCJ / Federal / Veterans Facility Outreach",
        fields: [
          { key: "facilityName", label: "Facility name", type: "text", ph: "e.g. TDCJ Wynne Unit, FCI Beaumont, Michael E. DeBakey VA Medical Center" },
          { key: "facilityType", label: "Facility type", type: "select", options: ["TDCJ state prison or unit", "Federal BOP facility", "VA Medical Center", "Veterans service organization", "Halfway house or RRC", "Reentry center", "Other federal or state facility"] },
          { key: "facilityCity", label: "City and state", type: "text", ph: "City, TX" },
          { key: "contactName", label: "Contact name", type: "text", ph: "Case manager, reentry coordinator, veterans coordinator, or social worker" },
          { key: "contactTitle", label: "Contact title", type: "text", ph: "e.g. Reentry Coordinator, Homeless Veterans Coordinator" },
          { key: "contactPhone", label: "Phone number", type: "text", ph: "Direct line" },
          { key: "contactEmail", label: "Email address", type: "text", ph: "Email address" },
          { key: "vendorApprovedStatus", label: "Is Grace Trace Ministries currently vendor approved with this facility?", type: "select", options: ["Yes — already approved", "Application submitted — pending", "Not yet — need to apply", "Not applicable"] },
          { key: "vendorApprovalRequirements", label: "What is required to get on their approved vendor or provider list?", type: "textarea", ph: "List every requirement — 501c3 status, SAM.gov registration, TDCJ provider application, site inspection, capacity minimums, staffing ratios, insurance, background checks, program documentation" },
          { key: "applicationProcess", label: "What is the application or approval process?", type: "textarea", ph: "Step by step — who to contact, what forms to submit, timeline, point of contact for application" },
          { key: "referralVolume", label: "How many residents could they potentially refer per month?", type: "text", ph: "Approximate monthly referral volume" },
          { key: "releaseDates", label: "Are there residents with upcoming release dates who need housing now?", type: "select", options: ["Yes — details below", "Not currently", "Unknown"] },
          { key: "upcomingReleases", label: "Upcoming release details", type: "textarea", ph: "Any residents with imminent release dates and housing needs — initials, release date, program type needed" },
          { key: "outcome", label: "Outcome of this contact", type: "textarea", ph: "What was accomplished or agreed upon?" },
          { key: "nextStep", label: "Next step and date", type: "textarea", ph: "What needs to happen next to advance this relationship or get approved?" },
        ]
      },
      {
        id: "d5", title: "Active Referral Follow-Ups",
        fields: [
          { key: "referralName", label: "Prospective resident name or initials", type: "text", ph: "First name or initials" },
          { key: "referralSource", label: "Referral source", type: "text", ph: "Who referred them and from where?" },
          { key: "referralSourceContact", label: "Referral source contact info", type: "text", ph: "Phone or email of referring officer or case manager" },
          { key: "programType", label: "Program type needed", type: "select", options: ["Male reentry", "Female reentry", "Veterans housing", "Disability program", "Unknown — pending screening"] },
          { key: "releaseDate", label: "Release date or availability date", type: "text", ph: "When are they available to move in?" },
          { key: "supervisionStatus", label: "Supervision status", type: "select", options: ["TDCJ parole", "TDCJ probation", "Federal supervised release", "BOP halfway house discharge", "VA referral", "Court ordered", "Self-referral — no supervision", "Other"] },
          { key: "specialRequirements", label: "Any special requirements or conditions?", type: "textarea", ph: "Medical needs, supervision conditions, distance restrictions, employment requirements" },
          { key: "qualificationsMet", label: "Does this person meet Grace Trace program qualifications?", type: "select", options: ["Yes — qualified", "Partially — review needed", "No — does not qualify", "Pending — more information needed"] },
          { key: "status", label: "Current status of this referral", type: "textarea", ph: "Where are they in the process — screened, approved, waitlisted, scheduled for intake?" },
          { key: "handedToIalana", label: "Has this been handed to Ialana for intake screening?", type: "select", options: ["Yes", "No — not yet ready", "Ialana is already working with them"] },
          { key: "followUpDate", label: "Follow-up date", type: "text", ph: "e.g. July 12, 2026" },
          { key: "nextStep", label: "Next step", type: "textarea", ph: "What needs to happen next for this referral?" },
        ]
      },
      {
        id: "d6", title: "Partner & Community Organization Outreach",
        fields: [
          { key: "orgName", label: "Organization name", type: "text", ph: "Full name of the organization" },
          { key: "orgType", label: "Organization type", type: "select", options: ["Faith-based organization", "Workforce development agency", "Legal aid organization", "Behavioral health provider", "Substance abuse treatment", "Food bank or pantry", "Clothing closet", "Community nonprofit", "Employer — willing to hire", "Educational institution", "Other"] },
          { key: "contactName", label: "Contact name and title", type: "text", ph: "Who did you speak with?" },
          { key: "contactPhone", label: "Phone number", type: "text", ph: "Direct line" },
          { key: "contactEmail", label: "Email address", type: "text", ph: "Email address" },
          { key: "purpose", label: "Purpose of this contact", type: "textarea", ph: "Why did you reach out — partnership, referral agreement, resource for residents?" },
          { key: "whatTheyOffer", label: "What services or resources do they offer?", type: "textarea", ph: "Describe what they can provide to Grace Trace residents" },
          { key: "partnershipOpportunity", label: "Is there a formal partnership opportunity?", type: "select", options: ["Yes — MOU or referral agreement needed", "Yes — informal partnership agreed", "Possibly — follow up needed", "No — resource only"] },
          { key: "outcome", label: "Outcome", type: "textarea", ph: "What was accomplished or agreed upon?" },
          { key: "followUpDate", label: "Follow-up date", type: "text", ph: "e.g. July 16, 2026" },
          { key: "followUpAction", label: "Follow-up action needed", type: "textarea", ph: "What needs to happen next?" },
        ]
      },
      {
        id: "d7", title: "Morning House Check",
        fields: [
          { key: "residentsPresent", label: "How many residents are currently in the house?", type: "text", ph: "Number of residents present" },
          { key: "roomsInspected", label: "Were rooms inspected this morning?", type: "select", options: ["Yes", "No"] },
          { key: "inspectionNotes", label: "Room inspection notes", type: "textarea", ph: "Describe the condition of rooms — any violations or concerns" },
          { key: "choresAssigned", label: "Were chores assigned?", type: "select", options: ["Yes", "No"] },
          { key: "signInStarted", label: "Was the sign-in log started for today?", type: "select", options: ["Yes", "No"] },
          { key: "time", label: "Time completed", type: "text", ph: "e.g. 7:30 AM" },
        ]
      },
      {
        id: "d8", title: "Nightly Curfew Close-Out",
        fields: [
          { key: "allResidentsIn", label: "Are all residents in for the night?", type: "select", options: ["Yes", "No — see notes"] },
          { key: "curfewNotes", label: "Document any curfew issues", type: "textarea", ph: "Name of resident and circumstances if not in by curfew" },
          { key: "logCompleted", label: "Was the nightly sign-in log completed?", type: "select", options: ["Yes", "No"] },
          { key: "houseStatus", label: "Overall house status for tonight", type: "textarea", ph: "Describe the general state of the house — quiet, any tension, concerns" },
          { key: "time", label: "Time completed", type: "text", ph: "e.g. 10:30 PM" },
        ]
      },
      {
        id: "d9", title: "Daily Outreach Summary Report",
        fields: [
          { key: "totalContacts", label: "Total number of contacts made today", type: "text", ph: "Total calls, emails, and visits combined" },
          { key: "newContactsAdded", label: "New contacts added to the database today", type: "text", ph: "Number of new contacts" },
          { key: "referralsReceived", label: "Any referrals received today?", type: "select", options: ["Yes — details below", "No"] },
          { key: "referralDetails", label: "Referral details", type: "textarea", ph: "Name or initials, source, program type, and next step" },
          { key: "vendorProgressMade", label: "Any progress made on vendor or provider approvals today?", type: "textarea", ph: "Which facility, what step was completed, what is next?" },
          { key: "summary", label: "Overall summary of today's outreach activity", type: "textarea", ph: "What was accomplished today across all outreach activities?" },
          { key: "urgentItems", label: "Anything urgent for Avy and Travis to know?", type: "textarea", ph: "Flag anything that needs immediate leadership attention" },
          { key: "tomorrowPriorities", label: "Top priorities for tomorrow", type: "textarea", ph: "What will you focus on first tomorrow?" },
        ]
      },
    ]
  },
  {
    id: "erica",
    name: "Erica Evans",
    initials: "EE",
    color: "#5C3010",
    password: "GTM@Erica2026",
    role: "Director of Residential Services and Standards",
    tasks: [
      {
        id: "e1", title: "House Rules and Standards Compliance Audit",
        fields: [
          { key: "residentReviewed", label: "Which residents were reviewed for compliance today?", type: "textarea", ph: "Names or room assignments" },
          { key: "compliant", label: "Who is fully compliant with program expectations?", type: "textarea", ph: "List residents in good standing" },
          { key: "violations", label: "Who has compliance concerns or violations?", type: "textarea", ph: "List resident names and specific issues" },
          { key: "actionTaken", label: "What action was taken for violations?", type: "textarea", ph: "Document warnings issued, conversations had, or escalations made" },
        ]
      },
      {
        id: "e2", title: "Service Quality Audit",
        fields: [
          { key: "serviceChecked", label: "Which service was audited today?", type: "select", options: ["Case management", "Life skills training", "Employment assistance", "Financial literacy", "Peer support", "Drug testing", "Other"] },
          { key: "wasDelivered", label: "Was the service delivered on schedule?", type: "select", options: ["Yes", "No", "Partially"] },
          { key: "qualityNotes", label: "Quality notes", type: "textarea", ph: "Describe the quality and completeness of the service delivered" },
          { key: "gaps", label: "Any gaps in service delivery?", type: "textarea", ph: "What was missed and why?" },
          { key: "correctionNeeded", label: "What correction is needed?", type: "textarea", ph: "How and when will the gap be addressed?" },
        ]
      },
      {
        id: "e3", title: "Weekly Schedule Execution Review",
        fields: [
          { key: "houseMeetingHeld", label: "Was the weekly house meeting held?", type: "select", options: ["Yes", "No"] },
          { key: "peerSupportHeld", label: "Was peer support group held?", type: "select", options: ["Yes", "No"] },
          { key: "roomInspectionDone", label: "Were room inspections completed?", type: "select", options: ["Yes", "No"] },
          { key: "curfewChecksLogged", label: "Were curfew checks logged?", type: "select", options: ["Yes", "No"] },
          { key: "missedItems", label: "What was missed from the schedule this week?", type: "textarea", ph: "Document anything that did not happen as scheduled" },
          { key: "reason", label: "Reason for any missed items", type: "textarea", ph: "Explain why items were missed" },
        ]
      },
      {
        id: "e4", title: "Residential Documentation Review",
        fields: [
          { key: "filesReviewed", label: "Whose resident files were reviewed today?", type: "textarea", ph: "Names or initials of residents whose files were checked" },
          { key: "ispCurrent", label: "Are ISP progress notes current and complete?", type: "select", options: ["Yes", "No — gaps found"] },
          { key: "drugTestLogCurrent", label: "Is the drug test log current?", type: "select", options: ["Yes", "No"] },
          { key: "incidentReportsCurrent", label: "Are incident reports documented and filed?", type: "select", options: ["Yes", "No"] },
          { key: "documentationGaps", label: "What documentation gaps were found?", type: "textarea", ph: "List specific gaps and whose files are incomplete" },
        ]
      },
      {
        id: "e5", title: "Standards and Policy Review",
        fields: [
          { key: "policyReviewed", label: "Which policy or procedure was reviewed?", type: "text", ph: "Name of the policy or section reviewed" },
          { key: "gapsFound", label: "Were any gaps or outdated sections found?", type: "textarea", ph: "Describe what needs to be updated" },
          { key: "recommendedChange", label: "What change do you recommend?", type: "textarea", ph: "Describe the update or revision needed" },
          { key: "submittedToAvy", label: "Was the recommendation submitted to Avy?", type: "select", options: ["Yes", "No", "Will submit tomorrow"] },
        ]
      },
      {
        id: "e6", title: "Resident Concern Coordination",
        fields: [
          { key: "concernResident", label: "Which resident has a concern or issue?", type: "text", ph: "Resident name or initials" },
          { key: "concernDescription", label: "Describe the concern", type: "textarea", ph: "What is the issue? When was it identified?" },
          { key: "staffCoordinated", label: "Which staff were involved in addressing it?", type: "text", ph: "Names of staff consulted (e.g. Deann, Ialana)" },
          { key: "resolution", label: "What was the resolution or next step?", type: "textarea", ph: "Document what was done and what still needs to happen" },
        ]
      },
      {
        id: "e7", title: "Resident Phase Progression Tracker",
        fields: [
          { key: "residentName", label: "Resident name or initials", type: "text", ph: "Who is being reviewed for phase advancement?" },
          { key: "currentPhase", label: "Current phase", type: "select", options: ["Phase 1 — Orientation", "Phase 2 — Stabilization", "Phase 3 — Development", "Phase 4 — Transition"] },
          { key: "meetsRequirements", label: "Does this resident meet all requirements for advancement?", type: "select", options: ["Yes — ready to advance", "No — still in progress", "Needs review"] },
          { key: "advancementNotes", label: "Advancement notes", type: "textarea", ph: "Document progress toward requirements — employment, savings, compliance, housing plan" },
          { key: "recommendedAction", label: "Recommended action", type: "textarea", ph: "Advance to next phase, extend current phase, or flag for review?" },
        ]
      },
      {
        id: "e8", title: "Daily Residential Services Report",
        fields: [
          { key: "summary", label: "Summary of residential services today", type: "textarea", ph: "Overall summary of what was reviewed and accomplished" },
          { key: "flagsForLeadership", label: "Anything to flag for Avy and Travis?", type: "textarea", ph: "Urgent items or concerns for leadership" },
          { key: "tomorrowFocus", label: "Focus areas for tomorrow", type: "textarea", ph: "What will you prioritize tomorrow?" },
        ]
      },
      {
        id: "e9", title: "Laundry Room Schedule",
        sharedWith: ["avy", "travis"],
        fields: [
          { key: "scheduleDate", label: "Schedule date or week", type: "text", ph: "e.g. Week of July 7, 2026" },
          { key: "room1Name", label: "Room 1 — Resident name", type: "text", ph: "Resident name" },
          { key: "room1Time", label: "Room 1 — Assigned laundry time", type: "text", ph: "e.g. Monday 8:00 AM to 9:00 AM" },
          { key: "room2Name", label: "Room 2 — Resident name", type: "text", ph: "Resident name" },
          { key: "room2Time", label: "Room 2 — Assigned laundry time", type: "text", ph: "e.g. Monday 9:00 AM to 10:00 AM" },
          { key: "room3Name", label: "Room 3 — Resident name", type: "text", ph: "Resident name" },
          { key: "room3Time", label: "Room 3 — Assigned laundry time", type: "text", ph: "e.g. Tuesday 8:00 AM to 9:00 AM" },
          { key: "room4Name", label: "Room 4 — Resident name", type: "text", ph: "Resident name" },
          { key: "room4Time", label: "Room 4 — Assigned laundry time", type: "text", ph: "e.g. Tuesday 9:00 AM to 10:00 AM" },
          { key: "room5Name", label: "Room 5 — Resident name", type: "text", ph: "Resident name" },
          { key: "room5Time", label: "Room 5 — Assigned laundry time", type: "text", ph: "e.g. Wednesday 8:00 AM to 9:00 AM" },
          { key: "room6Name", label: "Room 6 — Resident name", type: "text", ph: "Resident name" },
          { key: "room6Time", label: "Room 6 — Assigned laundry time", type: "text", ph: "e.g. Wednesday 9:00 AM to 10:00 AM" },
          { key: "laundryRules", label: "Laundry room rules or notes to communicate", type: "textarea", ph: "e.g. Clean lint trap after each use, remove clothes promptly, no bleach without approval" },
          { key: "schedulePosted", label: "Was the schedule posted in the laundry room?", type: "select", options: ["Yes", "No — will post today"] },
          { key: "residentsNotified", label: "Were all residents notified of their assigned time?", type: "select", options: ["Yes", "No — in progress"] },
        ]
      },
      {
        id: "e10", title: "Move-Out Room Readiness Checklist",
        sharedWith: ["avy", "travis"],
        fields: [
          { key: "roomNumber", label: "Room number being cleared", type: "text", ph: "e.g. Room 3" },
          { key: "residentName", label: "Name of resident who vacated", type: "text", ph: "Resident name or initials" },
          { key: "vacateDate", label: "Date resident vacated", type: "text", ph: "e.g. July 7, 2026" },
          { key: "nextResidentDate", label: "Expected move-in date for next resident", type: "text", ph: "e.g. July 10, 2026" },
          { key: "personalItemsRemoved", label: "All personal belongings removed?", type: "select", options: ["Yes — room cleared", "No — items left behind (see notes)"] },
          { key: "leftBehindItems", label: "Items left behind — describe", type: "textarea", ph: "What was left and what was done with it?" },
          { key: "bedLinensWashed", label: "Bed linens washed and replaced?", type: "select", options: ["Yes", "No"] },
          { key: "mattressInspected", label: "Mattress inspected for damage?", type: "select", options: ["Yes — no damage", "Yes — damage found (see notes)"] },
          { key: "mattressNotes", label: "Mattress damage notes", type: "textarea", ph: "Describe any damage found" },
          { key: "floorsCleaned", label: "Floors swept, mopped, or vacuumed?", type: "select", options: ["Yes", "No"] },
          { key: "surfacesWiped", label: "All surfaces wiped down?", type: "select", options: ["Yes", "No"] },
          { key: "closetCleared", label: "Closet cleared and cleaned?", type: "select", options: ["Yes", "No"] },
          { key: "windowsCleaned", label: "Windows cleaned and blinds dusted?", type: "select", options: ["Yes", "No"] },
          { key: "doorLocksTested", label: "Door and locks tested and functioning?", type: "select", options: ["Yes", "No — needs repair"] },
          { key: "lightsBulbsWorking", label: "All lights and bulbs working?", type: "select", options: ["Yes", "No — replaced"] },
          { key: "outletsTested", label: "Outlets and switches tested?", type: "select", options: ["Yes", "No — issue found"] },
          { key: "smokeDetectorTested", label: "Smoke detector tested?", type: "select", options: ["Yes — working", "No — needs battery or replacement"] },
          { key: "trashRemoved", label: "All trash removed from room?", type: "select", options: ["Yes", "No"] },
          { key: "odorCheck", label: "Room odor check passed?", type: "select", options: ["Yes — room is fresh", "No — treated with cleaning product"] },
          { key: "freshLinensPlaced", label: "Fresh linens and towels placed?", type: "select", options: ["Yes", "No"] },
          { key: "welcomePacketPlaced", label: "Welcome packet and house rules placed in room?", type: "select", options: ["Yes", "No"] },
          { key: "roomReadyStatus", label: "Is this room ready for the next resident?", type: "select", options: ["Yes — room ready", "No — items still outstanding"] },
          { key: "outstandingItems", label: "Outstanding items before room is fully ready", type: "textarea", ph: "What still needs to be done and by when?" },
          { key: "inspectedBy", label: "Checklist completed by", type: "text", ph: "Erica Evans" },
          { key: "inspectionTime", label: "Date and time of inspection", type: "text", ph: "e.g. July 8, 2026 at 2:00 PM" },
        ]
      },
    ]
  },
  {
    id: "ialana",
    name: "Ialana Tippins",
    initials: "IT",
    color: "#1A3D2B",
    password: "GTM@Ialana2026",
    role: "Director of Intake, Resident Relations, Case Management, and Peer Support",
    tasks: [
      {
        id: "i1", title: "New Referral Review and Screening",
        fields: [
          { key: "referralName", label: "Referral name or initials", type: "text", ph: "Name or initials of prospective resident" },
          { key: "referralSource", label: "Who referred them?", type: "text", ph: "Probation officer, parole officer, court, self-referral, etc." },
          { key: "eligibilityDetermination", label: "Eligibility determination", type: "select", options: ["Eligible — proceed with intake", "Not eligible — does not meet criteria", "More information needed", "Waitlisted"] },
          { key: "screeningNotes", label: "Screening notes", type: "textarea", ph: "Document key details from the screening call or review" },
          { key: "nextStep", label: "Next step", type: "textarea", ph: "What happens next and when?" },
        ]
      },
      {
        id: "i2", title: "Intake Screening Conducted",
        fields: [
          { key: "residentName", label: "Resident full legal name", type: "text", ph: "Full legal name as it appears on their ID" },
          { key: "fileNumber", label: "Grace Trace File Number", type: "text", ph: "Auto-format: GTM-2026-001 — assign next available number" },
          { key: "dateOfBirth", label: "Date of birth", type: "text", ph: "MM/DD/YYYY" },
          { key: "screeningType", label: "Type of screening", type: "select", options: ["Phone screening", "In-person screening", "Virtual screening"] },
          { key: "eligibilityStatus", label: "Eligibility status", type: "select", options: ["Approved for intake", "Denied", "On hold — more info needed"] },
          { key: "idCollected", label: "Was a valid government-issued photo ID collected?", type: "select", options: ["Yes — original presented and copied", "Yes — copy only received", "No — pending", "No — resident does not have ID"] },
          { key: "idType", label: "Type of ID collected", type: "select", options: ["Texas Driver's License", "Texas State ID", "Out of state Driver's License", "Out of state ID", "US Passport", "Military ID", "Tribal ID", "No ID — see notes"] },
          { key: "idNumber", label: "ID number (last 4 digits only)", type: "text", ph: "Last 4 digits only — e.g. XXXX1234" },
          { key: "idExpiration", label: "ID expiration date", type: "text", ph: "MM/YYYY" },
          { key: "idExpired", label: "Is the ID expired?", type: "select", options: ["No — valid", "Yes — expired — resident needs renewal", "No ID at all — needs to obtain"] },
          { key: "idActionNeeded", label: "If ID is missing or expired — what action is being taken?", type: "textarea", ph: "e.g. Scheduled appointment at DPS, assisting with birth certificate request, referred to legal aid for ID recovery" },
          { key: "ssnCollected", label: "Was Social Security card or SSN documentation collected?", type: "select", options: ["Yes — card presented and copied", "Yes — SSN provided verbally", "No — pending", "No — lost or unknown"] },
          { key: "supervisionDocsCollected", label: "Was supervision paperwork collected?", type: "select", options: ["Yes — parole certificate", "Yes — probation conditions", "Yes — federal supervised release", "Yes — court order", "No — pending"] },
          { key: "drugTestCompleted", label: "Was intake drug test administered?", type: "select", options: ["Yes — passed", "Yes — failed — see notes", "No — scheduled", "Refused"] },
          { key: "drugTestNotes", label: "Drug test notes", type: "textarea", ph: "Results, substances found if failed, action taken" },
          { key: "agreementSigned", label: "Was the Resident Agreement signed?", type: "select", options: ["Yes", "No — pending", "Refused"] },
          { key: "programsRequired", label: "What programs are REQUIRED by their supervising institution?", type: "textarea", ph: "List every program mandated by parole, probation, court, BOP, or VA — e.g. drug testing, substance abuse treatment, anger management, sex offender treatment, employment program, mental health counseling" },
          { key: "programsEnrolled", label: "What programs has the resident already enrolled in or completed?", type: "textarea", ph: "List programs they are currently in or have already completed — include provider name and dates if known" },
          { key: "programsNeeded", label: "What additional programs does Grace Trace recommend or need to connect them to?", type: "textarea", ph: "Life skills, employment assistance, financial literacy, peer support, GED, vocational training, benefits enrollment, housing search assistance" },
          { key: "institutionRequirements", label: "Are there any specific institution requirements Grace Trace must meet for this resident?", type: "textarea", ph: "e.g. Facility must be within X miles of parole office, resident must check in weekly, specific curfew time required by parole, employment requirement within 30 days" },
          { key: "referringInstitution", label: "Referring institution and contact", type: "text", ph: "e.g. TDCJ Parole Officer Jane Smith — 713-555-0100" },
          { key: "intakeNotes", label: "Additional intake notes", type: "textarea", ph: "Anything else important to document about this resident or their intake" },
        ]
      },
      {
        id: "i3", title: "Individual Service Plan (ISP) Updates",
        fields: [
          { key: "residentName", label: "Resident name or initials", type: "text", ph: "Whose ISP was updated today?" },
          { key: "goalsReviewed", label: "What goals were reviewed?", type: "textarea", ph: "List the goals discussed and assessed" },
          { key: "progressMade", label: "What progress has been made?", type: "textarea", ph: "Describe accomplishments since last review" },
          { key: "challengesFaced", label: "What challenges is the resident facing?", type: "textarea", ph: "Barriers to progress" },
          { key: "planUpdates", label: "What updates were made to the ISP?", type: "textarea", ph: "Document changes to goals, timelines, or action steps" },
          { key: "nextReviewDate", label: "Next ISP review date", type: "text", ph: "e.g. July 21, 2026" },
        ]
      },
      {
        id: "i4", title: "Resident Case Management Check-In",
        fields: [
          { key: "residentName", label: "Resident name or initials", type: "text", ph: "Who was checked in with today?" },
          { key: "employmentStatus", label: "Employment status", type: "select", options: ["Employed — full time", "Employed — part time", "Actively job searching", "In job training", "Not employed — concern"] },
          { key: "savingsUpdate", label: "Savings update", type: "textarea", ph: "How much are they saving? Are they meeting the savings goal for their phase?" },
          { key: "housingPlanUpdate", label: "Housing plan update", type: "textarea", ph: "Where are they in the housing search? Applications submitted? Landlord contacts?" },
          { key: "personalGoalUpdate", label: "Personal goals update", type: "textarea", ph: "Any other goals — ID, benefits, legal, education, family" },
          { key: "resourcesProvided", label: "What resources or referrals were provided?", type: "textarea", ph: "Services connected, referrals made, resources shared" },
          { key: "concerns", label: "Any concerns about this resident?", type: "textarea", ph: "Anything that needs escalation to Erica, Deann, Avy, or Travis?" },
        ]
      },
      {
        id: "i5", title: "Peer Support Group Session",
        fields: [
          { key: "sessionHeld", label: "Was peer support group held today?", type: "select", options: ["Yes", "No — rescheduled", "No — cancelled"] },
          { key: "attendance", label: "How many residents attended?", type: "text", ph: "Number of attendees" },
          { key: "topicDiscussed", label: "What topic was discussed?", type: "textarea", ph: "Describe the theme or focus of today's group session" },
          { key: "keyTakeaways", label: "Key takeaways or moments from the session", type: "textarea", ph: "What stood out? Any breakthroughs or concerns that emerged?" },
          { key: "followUpNeeded", label: "Does any resident need a follow-up after today's session?", type: "textarea", ph: "Name and reason for follow-up" },
        ]
      },
      {
        id: "i6", title: "Resident Relations — Concerns and Needs",
        fields: [
          { key: "residentName", label: "Resident name or initials", type: "text", ph: "Who came to you with a concern or need?" },
          { key: "concern", label: "What was the concern or need?", type: "textarea", ph: "Describe what the resident shared" },
          { key: "actionTaken", label: "What action was taken?", type: "textarea", ph: "How did you respond? What was done to address it?" },
          { key: "escalated", label: "Was this escalated to another staff member?", type: "select", options: ["Yes — to Deann", "Yes — to Erica", "Yes — to Avy", "No — resolved at my level"] },
          { key: "resolution", label: "Was the concern resolved?", type: "select", options: ["Yes — fully resolved", "Partially resolved", "Still in progress"] },
        ]
      },
      {
        id: "i7", title: "Bed Availability and Waitlist Management",
        fields: [
          { key: "currentOccupancy", label: "Current number of residents in the house", type: "text", ph: "e.g. 4 of 6 beds occupied" },
          { key: "availableBeds", label: "Number of available beds", type: "text", ph: "e.g. 2 beds available" },
          { key: "waitlistCount", label: "Number of people on the waitlist", type: "text", ph: "Number of approved referrals waiting for a bed" },
          { key: "communicatedTo", label: "Was availability communicated to Deann and Avy?", type: "select", options: ["Yes", "No", "Not needed today"] },
          { key: "upcomingIntakes", label: "Any upcoming intakes scheduled?", type: "textarea", ph: "Names, dates, and details of confirmed upcoming intakes" },
        ]
      },
      {
        id: "i8", title: "Discharge and Aftercare Planning",
        fields: [
          { key: "residentName", label: "Resident name or initials", type: "text", ph: "Who is being prepared for discharge?" },
          { key: "targetDischargeDate", label: "Target discharge date", type: "text", ph: "e.g. August 1, 2026" },
          { key: "housingSecured", label: "Is permanent housing secured?", type: "select", options: ["Yes — move-in date confirmed", "In progress — applications submitted", "Not yet started"] },
          { key: "aftercarePlan", label: "What aftercare services are in place?", type: "textarea", ph: "Services connected after discharge — mental health, employment, benefits, support groups" },
          { key: "exitPlanWritten", label: "Has the written exit plan been completed?", type: "select", options: ["Yes", "No — in progress"] },
          { key: "certificateReady", label: "Is the certificate of completion ready?", type: "select", options: ["Yes", "No"] },
        ]
      },
      {
        id: "i9", title: "Referral Source Relationship Management",
        fields: [
          { key: "sourceContacted", label: "Which referral source was contacted today?", type: "text", ph: "Name and organization" },
          { key: "purpose", label: "Purpose of contact", type: "textarea", ph: "Why did you reach out? Were you following up on a referral or building the relationship?" },
          { key: "outcome", label: "Outcome", type: "textarea", ph: "What was discussed or decided?" },
          { key: "newReferralExpected", label: "Is a new referral expected from this source?", type: "select", options: ["Yes", "Maybe", "No"] },
        ]
      },
      {
        id: "i10", title: "Daily Intake and Case Management Report",
        fields: [
          { key: "summary", label: "Summary of today's intake and case management activity", type: "textarea", ph: "Overall summary of what was accomplished today" },
          { key: "urgentFlags", label: "Anything urgent for Avy and Travis to know?", type: "textarea", ph: "Flag any residents, referrals, or situations that need leadership attention" },
          { key: "tomorrowPriorities", label: "Top priorities for tomorrow", type: "textarea", ph: "What will you focus on first tomorrow?" },
        ]
      },
    ]
  },
  {
    id: "aubreyon",
    name: "AuBreyon (Kisses) Woodley",
    initials: "KW",
    color: "#4A1A5C",
    password: "GTM@Kisses2026",
    role: "Director of Communication — Deaf, Blind, and Disabled Programs",
    tasks: [
      {
        id: "k1", title: "DBMD Program Communications Review",
        fields: [
          { key: "inquiriesReceived", label: "Were any DBMD or disability-related inquiries received today?", type: "select", options: ["Yes", "No"] },
          { key: "inquiryDetails", label: "If yes, describe the inquiry", type: "textarea", ph: "Who reached out, what was the question or need?" },
          { key: "responseGiven", label: "What response was given?", type: "textarea", ph: "How did you respond?" },
          { key: "followUpNeeded", label: "Is follow-up needed?", type: "text", ph: "Next step and date" },
        ]
      },
      {
        id: "k2", title: "DBMD Referral Source Outreach",
        fields: [
          { key: "agencyContacted", label: "Which agency or organization was contacted?", type: "text", ph: "HHSC, disability advocacy org, waiver coordinator, etc." },
          { key: "contactPerson", label: "Who did you speak with?", type: "text", ph: "Name and title" },
          { key: "purpose", label: "Purpose of the outreach", type: "textarea", ph: "What was the goal of this contact?" },
          { key: "outcome", label: "Outcome", type: "textarea", ph: "What was accomplished or shared?" },
          { key: "nextStep", label: "Next step", type: "text", ph: "Follow-up action and date" },
        ]
      },
      {
        id: "k3", title: "DBMD Licensure and Enrollment Research",
        fields: [
          { key: "topicResearched", label: "What DBMD enrollment or licensure topic was researched today?", type: "text", ph: "e.g. HHSC DBMD waiver enrollment requirements" },
          { key: "findings", label: "What did you find?", type: "textarea", ph: "Summarize the key information discovered" },
          { key: "nextResearchStep", label: "What is the next research step?", type: "textarea", ph: "What do you need to find out next?" },
          { key: "documentedWhere", label: "Where was this documented?", type: "text", ph: "e.g. Google Drive folder, Phase 3 planning document" },
        ]
      },
      {
        id: "k4", title: "Communication Accessibility Planning",
        fields: [
          { key: "materialReviewed", label: "Which material or outreach piece was reviewed for accessibility?", type: "text", ph: "Name of the document, flyer, or communication piece" },
          { key: "accessibilityCheck", label: "Accessibility formats reviewed", type: "textarea", ph: "ASL, Braille, large print, screen reader compatible — which were addressed?" },
          { key: "changesNeeded", label: "What changes are needed?", type: "textarea", ph: "Document what needs to be updated for accessibility compliance" },
          { key: "completedBy", label: "When will changes be completed?", type: "text", ph: "Target date for completion" },
        ]
      },
      {
        id: "k5", title: "Disability Services Partnership Building",
        fields: [
          { key: "orgIdentified", label: "What organization was identified or contacted today?", type: "text", ph: "Name of the organization" },
          { key: "serviceProvided", label: "What service do they provide?", type: "text", ph: "e.g. occupational therapy, adaptive equipment, specialized care" },
          { key: "contactMade", label: "Was contact made?", type: "select", options: ["Yes — spoke with someone", "Yes — left message", "Email sent", "No — will follow up"] },
          { key: "partnershipPotential", label: "Partnership potential", type: "textarea", ph: "How could this organization support the Grace Trace DBMD program?" },
          { key: "nextStep", label: "Next step", type: "text", ph: "What happens next with this organization?" },
        ]
      },
      {
        id: "k6", title: "Phase 3 Program Development Progress",
        fields: [
          { key: "milestoneWorkedOn", label: "What Phase 3 milestone was worked on today?", type: "text", ph: "e.g. HHSC enrollment, accessibility planning, partner network" },
          { key: "progressMade", label: "What progress was made?", type: "textarea", ph: "Describe what was accomplished" },
          { key: "blockersOrChallenges", label: "Any blockers or challenges?", type: "textarea", ph: "What is slowing progress and how can it be addressed?" },
          { key: "nextMilestone", label: "What is the next milestone?", type: "textarea", ph: "What is the next step toward Phase 3 launch?" },
        ]
      },
      {
        id: "k7", title: "Daily Activity Report",
        fields: [
          { key: "summary", label: "Summary of today's communication and program development activity", type: "textarea", ph: "Overall summary of what was accomplished" },
          { key: "flagsForLeadership", label: "Anything to flag for Avy and Travis?", type: "textarea", ph: "Urgent items or important updates for leadership" },
          { key: "tomorrowPriorities", label: "Priorities for tomorrow", type: "textarea", ph: "What will you focus on first tomorrow?" },
        ]
      },
    ]
  },
  {
    id: "dennis",
    name: "Dennis",
    initials: "DO",
    color: "#1A4D35",
    password: "GTM@Dennis2026",
    role: "Director of Operations and Facilities",
    tasks: [
      {
        id: "op1", title: "Facility Inspection and Walkthrough",
        fields: [
          { key: "areasInspected", label: "Which areas were inspected today?", type: "textarea", ph: "List areas checked — common areas, entry/exit, hallways, exterior" },
          { key: "camerasOperational", label: "Are all security cameras operational?", type: "select", options: ["Yes", "No — see notes"] },
          { key: "safetyEquipmentChecked", label: "Was safety equipment checked?", type: "select", options: ["Yes", "No"] },
          { key: "issuesFound", label: "What issues were found during inspection?", type: "textarea", ph: "Describe anything that needs attention — damage, cleanliness, safety concerns" },
          { key: "immediateActionTaken", label: "What immediate action was taken?", type: "textarea", ph: "What did you do on the spot to address any issues?" },
          { key: "time", label: "Time completed", type: "text", ph: "e.g. 8:00 AM" },
        ]
      },
      {
        id: "op2", title: "Operational Log Review",
        fields: [
          { key: "logsReviewed", label: "Which logs were reviewed today?", type: "textarea", ph: "Curfew log, sign-in/out log, incident reports, drug test log" },
          { key: "logsCurrentAndComplete", label: "Are all logs current and complete?", type: "select", options: ["Yes", "No — gaps found"] },
          { key: "logGaps", label: "Document any gaps in the logs", type: "textarea", ph: "Which logs are incomplete and what is missing?" },
          { key: "reportedToDeann", label: "Were gaps reported to Deann?", type: "select", options: ["Yes", "No", "Not needed"] },
        ]
      },
      {
        id: "op3", title: "Maintenance and Repair Coordination",
        fields: [
          { key: "issueDescription", label: "Describe the maintenance or repair issue", type: "textarea", ph: "What needs to be fixed or repaired and where?" },
          { key: "urgencyLevel", label: "Urgency level", type: "select", options: ["Immediate — safety risk", "High — fix within 48 hours", "Medium — fix this week", "Low — schedule when possible"] },
          { key: "vendorContacted", label: "Was a vendor or contractor contacted?", type: "select", options: ["Yes", "No — will contact tomorrow", "Handled in-house"] },
          { key: "vendorName", label: "Vendor or contractor name", type: "text", ph: "Who was contacted for the repair?" },
          { key: "scheduledDate", label: "When is the repair scheduled?", type: "text", ph: "Date and time of repair" },
          { key: "avyNotified", label: "Was Avy notified of the issue?", type: "select", options: ["Yes", "No", "Not required"] },
        ]
      },
      {
        id: "op4", title: "Supply and Inventory Check",
        fields: [
          { key: "suppliesChecked", label: "What supplies were checked today?", type: "textarea", ph: "Cleaning supplies, first aid kit, paper products, kitchen supplies, etc." },
          { key: "lowOrOutItems", label: "What items are low or out of stock?", type: "textarea", ph: "List items that need to be reordered" },
          { key: "reorderPlaced", label: "Was a reorder placed?", type: "select", options: ["Yes", "No — will order tomorrow", "Not needed"] },
          { key: "estimatedCost", label: "Estimated cost of reorder", type: "text", ph: "e.g. $45.00" },
          { key: "approvedBy", label: "Was the purchase approved by Avy or Travis?", type: "select", options: ["Yes", "No — pending approval", "Under approval threshold"] },
        ]
      },
      {
        id: "op5", title: "Vendor and Contractor Communications",
        fields: [
          { key: "vendorName", label: "Vendor or contractor name", type: "text", ph: "Who was contacted?" },
          { key: "purposeOfContact", label: "Purpose of contact", type: "textarea", ph: "What was the reason for the call or email?" },
          { key: "outcome", label: "Outcome", type: "textarea", ph: "What was decided or scheduled?" },
          { key: "costImplication", label: "Any cost implication?", type: "text", ph: "Amount if applicable" },
          { key: "approvedBy", label: "Approved by", type: "text", ph: "Who approved this expense or service?" },
        ]
      },
      {
        id: "op6", title: "Occupancy and Bed Status Review",
        fields: [
          { key: "currentOccupancy", label: "Current number of residents", type: "text", ph: "e.g. 4 of 6 beds occupied" },
          { key: "availableBeds", label: "Number of available beds", type: "text", ph: "How many beds are open?" },
          { key: "bedCondition", label: "Are all available beds cleaned, made, and ready?", type: "select", options: ["Yes", "No — needs attention"] },
          { key: "reportedToIalana", label: "Was occupancy status reported to Ialana?", type: "select", options: ["Yes", "No"] },
          { key: "upcomingNeeds", label: "Any facility needs for upcoming intakes?", type: "textarea", ph: "Anything that needs to be done before a new resident moves in?" },
        ]
      },
      {
        id: "op7", title: "Zoning, Compliance, and Licensing",
        fields: [
          { key: "complianceItemReviewed", label: "What compliance or licensing item was addressed today?", type: "text", ph: "e.g. zoning confirmation, fire marshal, occupancy permit" },
          { key: "status", label: "Current status", type: "textarea", ph: "Where does this item stand? What has been completed?" },
          { key: "actionRequired", label: "What action is required?", type: "textarea", ph: "What needs to happen next?" },
          { key: "deadline", label: "Deadline", type: "text", ph: "When does this need to be completed?" },
          { key: "avyNotified", label: "Was Avy notified?", type: "select", options: ["Yes", "No", "Not required"] },
        ]
      },
      {
        id: "op8", title: "Daily Operations Report",
        fields: [
          { key: "summary", label: "Summary of facility and operations activity today", type: "textarea", ph: "Overall summary of what was done and the current status of the facility" },
          { key: "openIssues", label: "Open issues that carry over to tomorrow", type: "textarea", ph: "What is still unresolved and needs to be picked up tomorrow?" },
          { key: "flagsForLeadership", label: "Anything to flag for Avy and Travis?", type: "textarea", ph: "Urgent facility or operations items needing leadership attention" },
        ]
      },
    ]
  },
];

export default function WorkdayPortal() {
  const [screen, setScreen] = useState("login");
  const [selectedUser, setSelectedUser] = useState(null);
  const [passwordInput, setPasswordInput] = useState("");
  const [loginError, setLoginError] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const [taskData, setTaskData] = useState({});
  const [activeTask, setActiveTask] = useState(null);
  const [reportText, setReportText] = useState("");
  const [reportVisible, setReportVisible] = useState(false);
  const [sent, setSent] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    try {
      const uid = localStorage.getItem("gtm_current_user");
      const active = localStorage.getItem("gtm_session_active");
      if (uid && active === "true") {
        const user = USERS.find(u => u.id === uid);
        if (user) {
          const saved = localStorage.getItem("gtm_taskdata");
          if (saved) {
            const parsed = JSON.parse(saved);
            setTaskData(parsed);
            if (!parsed[user.id]) {
              const d = {};
              user.tasks.forEach(t => { const fields: Record<string, string> = {}; t.fields.forEach(f => { fields[f.key] = ""; }); d[t.id] = { completed: false, fields }; });
              const updated = { ...parsed, [user.id]: d };
              setTaskData(updated);
            }
          } else {
            const d = {};
            user.tasks.forEach(t => { const fields: Record<string, string> = {}; t.fields.forEach(f => { fields[f.key] = ""; }); d[t.id] = { completed: false, fields }; });
            setTaskData({ [user.id]: d });
          }
          setCurrentUser(user);
          setScreen("dashboard");
        }
      }
    } catch(e) {}
  }, []);
  const [activeTab, setActiveTab] = useState("workday");

  function selectUser(user) { setSelectedUser(user); setPasswordInput(""); setLoginError(""); setScreen("password"); }

  function attemptLogin() {
    if (passwordInput === selectedUser.password) {
      try {
        const saved = localStorage.getItem("gtm_taskdata");
        if (saved) {
          const parsed = JSON.parse(saved);
          setTaskData(parsed);
          if (!parsed[selectedUser.id]) {
            const d = {};
            selectedUser.tasks.forEach(t => { const fields: Record<string, string> = {}; t.fields.forEach(f => { fields[f.key] = ""; }); d[t.id] = { completed: false, fields }; });
            const updated = { ...parsed, [selectedUser.id]: d };
            setTaskData(updated);
            localStorage.setItem("gtm_taskdata", JSON.stringify(updated));
          }
        } else {
          if (!taskData[selectedUser.id]) {
            const d = {};
            selectedUser.tasks.forEach(t => { const fields: Record<string, string> = {}; t.fields.forEach(f => { fields[f.key] = ""; }); d[t.id] = { completed: false, fields }; });
            setTaskData(prev => ({ ...prev, [selectedUser.id]: d }));
          }
        }
      } catch(e) {
        if (!taskData[selectedUser.id]) {
          const d = {};
          selectedUser.tasks.forEach(t => { const fields: Record<string, string> = {}; t.fields.forEach(f => { fields[f.key] = ""; }); d[t.id] = { completed: false, fields }; });
          setTaskData(prev => ({ ...prev, [selectedUser.id]: d }));
        }
      }
      try { localStorage.setItem("gtm_current_user", selectedUser.id); localStorage.setItem("gtm_session_active", "true"); } catch(e) {}
      setCurrentUser(selectedUser); setActiveTask(null); setReportText(""); setReportVisible(false); setSent(false); setActiveTab("workday"); setScreen("dashboard");
    } else { setLoginError("Incorrect password. Please try again."); }
  }

  function logout() { try { localStorage.removeItem("gtm_current_user"); localStorage.removeItem("gtm_session_active"); } catch(e) {} setCurrentUser(null); setSelectedUser(null); setPasswordInput(""); setLoginError(""); setActiveTask(null); setScreen("login"); }

  function updateField(taskId, key, val) {
    setTaskData(prev => ({ ...prev, [currentUser.id]: { ...prev[currentUser.id], [taskId]: { ...prev[currentUser.id][taskId], fields: { ...prev[currentUser.id][taskId].fields, [key]: val } } } }));
  }

  function submitTask(taskId) {
    setTaskData(prev => {
      const updated = { ...prev, [currentUser.id]: { ...prev[currentUser.id], [taskId]: { ...prev[currentUser.id][taskId], completed: true } } };
      try { localStorage.setItem("gtm_taskdata", JSON.stringify(updated)); } catch(e) {}
      return updated;
    });
    setActiveTask(null);
  }

  function getSendLabel() {
    if (currentUser.id === "avy") return "Send to Travis";
    if (currentUser.id === "travis") return "Send to Avy";
    return "Complete and Send";
  }

  function getSentConfirmation() {
    if (currentUser.id === "avy") return "Report sent to Travis";
    if (currentUser.id === "travis") return "Report sent to Avy";
    return "Report complete and sent";
  }

  function generateReport() {
    const d = taskData[currentUser.id];
    const date = new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" });
    const completed = Object.values(d).filter(x => x.completed).length;
    let txt = "GRACE TRACE MINISTRIES — WORKDAY REPORT\n" + "=".repeat(56) + "\n";
    txt += "Staff Member: " + currentUser.name + "\nRole: " + currentUser.role + "\nDate: " + date + "\nTasks Completed: " + completed + " of " + currentUser.tasks.length + "\n" + "=".repeat(56) + "\n\n";
    currentUser.tasks.forEach((task, i) => {
      const td = d[task.id];
      txt += "TASK " + (i + 1) + ": " + task.title.toUpperCase() + "\nStatus: " + (td.completed ? "COMPLETE" : "INCOMPLETE") + "\n";
      task.fields.forEach(f => { const val = td.fields[f.key]; if (val) txt += f.label + ":\n  " + val + "\n"; });
      txt += "\n";
    });
    txt += "=".repeat(56) + "\nGenerated: " + new Date().toLocaleString() + "\n";
    setReportText(txt); setReportVisible(true); setSent(false);
  }

  function downloadReport() {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([reportText], { type: "text/plain" }));
    a.download = "GraceTrace_" + currentUser.id + "_" + new Date().toISOString().slice(0, 10) + ".txt";
    a.click();
  }

  if (screen === "login") return (
    <div style={{ minHeight: "100vh", background: C.dark, display: "flex", alignItems: "center", justifyContent: "center", padding: 20, fontFamily: "'Inter','Segoe UI',sans-serif" }}>
      <div style={{ width: "100%", maxWidth: 440 }}>
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{ width: 64, height: 64, borderRadius: "50%", background: C.burgundy, border: "2px solid " + C.gold, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", fontSize: 26 }}>✦</div>
          <h1 style={{ color: C.ivory, fontSize: 24, fontWeight: 900, margin: "0 0 4px" }}>Grace Trace Ministries</h1>
          <p style={{ color: C.gold, fontSize: 13, fontStyle: "italic", margin: "0 0 6px" }}>Tracing the Path of Grace with New Beginnings</p>
          <p style={{ color: C.muted, fontSize: 13, margin: 0 }}>Staff Workday Portal — Select your name to continue</p>
        </div>
        <div style={{ background: C.card, border: "1px solid " + C.cardBorder, borderRadius: 14, overflow: "hidden" }}>
          {USERS.map((u, i) => (
            <button key={u.id} onClick={() => selectUser(u)} style={{ width: "100%", textAlign: "left", padding: "15px 18px", background: "transparent", border: "none", borderBottom: i < USERS.length - 1 ? "1px solid " + C.cardBorder : "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 14 }}
              onMouseEnter={e => e.currentTarget.style.background = "#3A1A20"} onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
              <div style={{ width: 42, height: 42, borderRadius: "50%", background: u.color, border: "1px solid " + C.gold + "55", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 800, color: C.ivory, flexShrink: 0 }}>{u.initials}</div>
              <div style={{ flex: 1 }}><div style={{ color: C.text, fontWeight: 700, fontSize: 15 }}>{u.name}</div><div style={{ color: C.muted, fontSize: 12, marginTop: 2 }}>{u.role}</div></div>
              <span style={{ color: C.gold, fontSize: 20 }}>›</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  if (screen === "password") return (
    <div style={{ minHeight: "100vh", background: C.dark, display: "flex", alignItems: "center", justifyContent: "center", padding: 20, fontFamily: "'Inter','Segoe UI',sans-serif" }}>
      <div style={{ width: "100%", maxWidth: 380 }}>
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <div style={{ width: 52, height: 52, borderRadius: "50%", background: selectedUser.color, border: "2px solid " + C.gold, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px", fontSize: 16, fontWeight: 800, color: C.ivory }}>{selectedUser.initials}</div>
          <h2 style={{ color: C.ivory, fontSize: 20, fontWeight: 800, margin: "0 0 4px" }}>{selectedUser.name}</h2>
          <p style={{ color: C.muted, fontSize: 13, margin: 0 }}>{selectedUser.role}</p>
        </div>
        <div style={{ background: C.card, border: "1px solid " + C.cardBorder, borderRadius: 14, padding: "24px" }}>
          <div style={{ color: C.muted, fontSize: 13, marginBottom: 8 }}>Enter your password</div>
          <input type="password" value={passwordInput} onChange={e => { setPasswordInput(e.target.value); setLoginError(""); }} onKeyDown={e => e.key === "Enter" && attemptLogin()} placeholder="Password"
            style={{ width: "100%", background: C.dark, border: "1px solid " + (loginError ? C.error : C.cardBorder), borderRadius: 8, padding: "11px 14px", color: C.text, fontSize: 15, outline: "none", fontFamily: "inherit", marginBottom: 8 }} autoFocus />
          {loginError && <div style={{ color: C.error, fontSize: 13, marginBottom: 10 }}>{loginError}</div>}
          <button onClick={attemptLogin} style={{ width: "100%", background: C.burgundy, border: "1px solid " + C.gold + "66", borderRadius: 8, padding: "12px", color: C.ivory, fontSize: 15, fontWeight: 800, cursor: "pointer", marginTop: 4 }}>Log In</button>
          <button onClick={() => setScreen("login")} style={{ width: "100%", background: "transparent", border: "none", color: C.muted, fontSize: 13, cursor: "pointer", marginTop: 12, padding: "6px" }}>← Back to staff list</button>
        </div>
      </div>
    </div>
  );

  const d = taskData[currentUser.id] || {};
  const total = currentUser.tasks.length;
  const completedCount = Object.values(d).filter(x => x.completed).length;
  const pct = total ? Math.round((completedCount / total) * 100) : 0;

  const sharedTasksVisible = [];
  USERS.forEach(u => {
    if (u.id === currentUser.id) return;
    u.tasks.forEach(t => {
      if (t.sharedWith && t.sharedWith.includes(currentUser.id)) {
        const td = taskData[u.id] && taskData[u.id][t.id];
        if (td) sharedTasksVisible.push({ user: u, task: t, td });
      }
    });
  });

  if (activeTask) {
    const task = currentUser.tasks.find(t => t.id === activeTask);
    const td = d[task.id];
    const allFilled = task.fields.every(f => td.fields[f.key] && td.fields[f.key].trim() !== "");
    return (
      <div style={{ minHeight: "100vh", background: C.dark, fontFamily: "'Inter','Segoe UI',sans-serif" }}>
        <div style={{ background: C.burgundyDark, borderBottom: "2px solid " + C.gold, padding: "14px 20px", display: "flex", alignItems: "center", gap: 14 }}>
          <button onClick={() => setActiveTask(null)} style={{ background: "transparent", border: "1px solid " + C.cardBorder, borderRadius: 8, padding: "7px 14px", color: C.muted, fontSize: 13, cursor: "pointer" }}>← Back</button>
          <div><div style={{ color: C.ivory, fontWeight: 800, fontSize: 15 }}>{task.title}</div><div style={{ color: C.gold, fontSize: 11 }}>{currentUser.name} — {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}</div></div>
        </div>
        <div style={{ maxWidth: 680, margin: "0 auto", padding: "24px 20px" }}>
          <div style={{ background: C.card, border: "1px solid " + C.cardBorder, borderRadius: 12, padding: "6px 18px 18px", marginBottom: 20 }}>
            <div style={{ color: C.gold, fontSize: 11, fontWeight: 800, letterSpacing: 2, textTransform: "uppercase", margin: "16px 0" }}>Workbook — complete all fields</div>
            {task.fields.map((f, i) => (
              <div key={f.key} style={{ marginBottom: 18 }}>
                <div style={{ color: C.text, fontSize: 14, fontWeight: 600, marginBottom: 6 }}>{i + 1}. {f.label}</div>
                {f.type === "textarea" ? (
                  <textarea value={td.fields[f.key] || ""} onChange={e => updateField(task.id, f.key, e.target.value)} placeholder={f.ph} rows={4}
                    style={{ width: "100%", background: C.dark, border: "1px solid " + (td.fields[f.key] ? C.green : C.cardBorder), borderRadius: 8, padding: "10px 14px", color: C.text, fontSize: 14, resize: "vertical", outline: "none", fontFamily: "inherit", lineHeight: 1.6 }} />
                ) : f.type === "select" ? (
                  <select value={td.fields[f.key] || ""} onChange={e => updateField(task.id, f.key, e.target.value)}
                    style={{ width: "100%", background: C.dark, border: "1px solid " + (td.fields[f.key] ? C.green : C.cardBorder), borderRadius: 8, padding: "10px 14px", color: td.fields[f.key] ? C.text : C.muted, fontSize: 14, outline: "none", fontFamily: "inherit" }}>
                    <option value="">Select an option...</option>
                    {f.options.map(o => <option key={o} value={o}>{o}</option>)}
                  </select>
                ) : (
                  <input type="text" value={td.fields[f.key] || ""} onChange={e => updateField(task.id, f.key, e.target.value)} placeholder={f.ph}
                    style={{ width: "100%", background: C.dark, border: "1px solid " + (td.fields[f.key] ? C.green : C.cardBorder), borderRadius: 8, padding: "10px 14px", color: C.text, fontSize: 14, outline: "none", fontFamily: "inherit" }} />
                )}
              </div>
            ))}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
            <div style={{ flex: 1, background: C.cardBorder, borderRadius: 20, height: 6 }}>
              <div style={{ background: allFilled ? "#4CAF50" : C.gold, height: 6, borderRadius: 20, width: (task.fields.filter(f => td.fields[f.key] && td.fields[f.key].trim()).length / task.fields.length * 100) + "%", transition: "width 0.3s" }} />
            </div>
            <span style={{ color: C.muted, fontSize: 12 }}>{task.fields.filter(f => td.fields[f.key] && td.fields[f.key].trim()).length} of {task.fields.length} fields completed</span>
          </div>
          <button onClick={() => submitTask(task.id)} disabled={!allFilled}
            style={{ width: "100%", background: allFilled ? C.green : C.cardBorder, border: "none", borderRadius: 10, padding: "14px", color: allFilled ? C.ivory : C.muted, fontSize: 15, fontWeight: 800, cursor: allFilled ? "pointer" : "not-allowed", marginTop: 12 }}>
            {allFilled ? "✓ Submit and mark complete" : "Complete all fields to submit"}
          </button>
          <div style={{ height: 40 }} />
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: C.dark, fontFamily: "'Inter','Segoe UI',sans-serif" }}>
      <div style={{ background: "linear-gradient(135deg, " + C.burgundyDark + " 0%, " + C.dark + " 70%)", borderBottom: "2px solid " + C.gold, padding: "16px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ width: 42, height: 42, borderRadius: "50%", background: currentUser.color, border: "1px solid " + C.gold, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 800, color: C.ivory }}>{currentUser.initials}</div>
          <div><div style={{ color: C.ivory, fontWeight: 800, fontSize: 15 }}>{currentUser.name}</div><div style={{ color: C.gold, fontSize: 11, marginTop: 1 }}>{currentUser.role}</div></div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ color: C.muted, fontSize: 12 }}>{new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}</div>
          <button onClick={() => setMenuOpen(!menuOpen)} style={{ background: "transparent", border: "1px solid " + C.cardBorder, borderRadius: 8, padding: "7px 12px", color: C.ivory, fontSize: 18, cursor: "pointer", lineHeight: 1 }}>☰</button>
        </div>
      </div>



      {menuOpen && (
        <div style={{ position: "fixed", top: 0, right: 0, width: 280, height: "100vh", background: C.card, borderLeft: "1px solid " + C.cardBorder, zIndex: 100, display: "flex", flexDirection: "column", boxShadow: "-4px 0 20px rgba(0,0,0,0.5)" }}>
          <div style={{ padding: "20px", borderBottom: "1px solid " + C.cardBorder, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ color: C.gold, fontSize: 10, fontWeight: 800, letterSpacing: 2, textTransform: "uppercase" }}>Menu</div>
              <div style={{ color: C.text, fontWeight: 700, fontSize: 14, marginTop: 2 }}>{currentUser.name}</div>
            </div>
            <button onClick={() => setMenuOpen(false)} style={{ background: "transparent", border: "none", color: C.muted, fontSize: 22, cursor: "pointer", lineHeight: 1 }}>✕</button>
          </div>
          <div style={{ flex: 1, padding: "16px 0", overflowY: "auto" }}>
            {[
              { label: "My Workday", href: "/", icon: "📋" },
              { label: "Meeting Board", href: "/meetings", icon: "📅" },
              { label: "Mandatory Tasks", href: "/mandatory-tasks", icon: "📌" },
              { label: "Creative Tab", href: "/creative", icon: "💡" },
              { label: "Orientation Package", href: "/orientation", icon: "📄" },
              { label: "Navigation Guide", href: "/navigation", icon: "🗺" },
              ...(currentUser.id === "avy" || currentUser.id === "travis" ? [{ label: "Staff Reports", href: "/staff-reports", icon: "👥" }] : []),
              ...(currentUser.id === "ialana" || currentUser.id === "avy" || currentUser.id === "travis" ? [{ label: "Ialana's Binder", href: "/ialana-binder", icon: "📘" }] : []),
              ...(currentUser.id === "erica" || currentUser.id === "avy" || currentUser.id === "travis" ? [{ label: "Erica's Binder", href: "/erica-binder", icon: "📗" }] : []),
              ...(currentUser.id === "deann" || currentUser.id === "avy" || currentUser.id === "travis" ? [{ label: "Deann's Binder", href: "/deann-binder", icon: "📙" }] : []),
              ...(currentUser.id === "dennis" || currentUser.id === "avy" || currentUser.id === "travis" ? [{ label: "Dennis's Binder", href: "/dennis-binder", icon: "📒" }] : []),
              ...(currentUser.id === "travis" || currentUser.id === "avy" ? [{ label: "Travis's Binder", href: "/travis-binder", icon: "📓" }] : []),
              ...(currentUser.id === "avy" ? [{ label: "My Binder", href: "/avy-binder", icon: "📔" }] : []),
            ].map((item) => (
              <a key={item.label} href={item.href} onClick={() => setMenuOpen(false)}
                style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 20px", color: C.text, textDecoration: "none", borderBottom: "1px solid " + C.cardBorder, fontSize: 14, fontWeight: 600 }}
                onMouseEnter={e => e.currentTarget.style.background = C.dark}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                <span style={{ fontSize: 18 }}>{item.icon}</span>
                {item.label}
              </a>
            ))}
          </div>
          <div style={{ padding: "16px 20px", borderTop: "1px solid " + C.cardBorder }}>
            <button onClick={logout} style={{ width: "100%", background: C.burgundy, border: "none", borderRadius: 8, padding: "11px", color: C.ivory, fontSize: 13, fontWeight: 800, cursor: "pointer" }}>Log out</button>
          </div>
        </div>
      )}
      {menuOpen && <div onClick={() => setMenuOpen(false)} style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", background: "rgba(0,0,0,0.5)", zIndex: 99 }} />}

      <div style={{ maxWidth: 720, margin: "0 auto", padding: "24px 20px" }}>
        {(() => {
          const mandatoryTasks = (() => { try { const s = localStorage.getItem("gtm_mandatory_tasks"); return s ? JSON.parse(s) : []; } catch(e) { return []; } })();
          const meetings = (() => { try { const s = localStorage.getItem("gtm_meetings"); return s ? JSON.parse(s) : []; } catch(e) { return []; } })();
          const pendingTasks = mandatoryTasks.filter((t: any) => t.assignedTo.includes(currentUser.id) && t.status === "active" && !t.submissions?.[currentUser.id]);
          const pendingMeetings = meetings.filter((m: any) => m.attendees.includes(currentUser.id) && m.status === "scheduled" && !m.responses?.[currentUser.id] && m.createdBy !== currentUser.id);
          const total = pendingTasks.length + pendingMeetings.length;
          if (total === 0) return null;
          return (
            <div style={{ background: "#7B2D00", border: "1px solid " + C.error, borderRadius: 12, padding: "14px 18px", marginBottom: 20, display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
              <span style={{ fontSize: 24, flexShrink: 0 }}>🔔</span>
              <div style={{ flex: 1 }}>
                <div style={{ color: C.ivory, fontWeight: 800, fontSize: 14 }}>You have {total} item{total !== 1 ? "s" : ""} that need your attention</div>
                <div style={{ color: C.muted, fontSize: 13, marginTop: 3 }}>
                  {pendingTasks.length > 0 && <span>{pendingTasks.length} mandatory task{pendingTasks.length !== 1 ? "s" : ""} pending</span>}
                  {pendingTasks.length > 0 && pendingMeetings.length > 0 && <span> · </span>}
                  {pendingMeetings.length > 0 && <span>{pendingMeetings.length} meeting{pendingMeetings.length !== 1 ? "s" : ""} need{pendingMeetings.length === 1 ? "s" : ""} your response</span>}
                </div>
              </div>
              <div style={{ display: "flex", gap: 8", flexWrap: "wrap" }}>
                {pendingTasks.length > 0 && <a href="/mandatory-tasks" style={{ background: C.error, border: "none", borderRadius: 8, padding: "8px 14px", color: C.ivory, fontSize: 12, fontWeight: 800, textDecoration: "none" }}>View Tasks 📌</a>}
                {pendingMeetings.length > 0 && <a href="/meetings" style={{ background: C.burgundy, border: "1px solid " + C.error, borderRadius: 8, padding: "8px 14px", color: C.ivory, fontSize: 12, fontWeight: 800, textDecoration: "none" }}>View Meetings 📅</a>}
              </div>
            </div>
          );
        })()}
        <div style={{ background: C.card, border: "1px solid " + C.cardBorder, borderRadius: 12, padding: "16px 20px", marginBottom: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
            <span style={{ color: C.text, fontSize: 14, fontWeight: 700 }}>Today's workday progress</span>
            <span style={{ color: pct === 100 ? "#4CAF50" : C.gold, fontWeight: 800, fontSize: 14 }}>{completedCount} of {total} tasks complete</span>
          </div>
          <div style={{ background: C.dark, borderRadius: 20, height: 8, overflow: "hidden" }}>
            <div style={{ background: pct === 100 ? "#4CAF50" : C.gold, height: 8, borderRadius: 20, width: pct + "%", transition: "width 0.4s" }} />
          </div>
          {pct === 100 && <div style={{ color: "#4CAF50", fontSize: 13, marginTop: 10, fontWeight: 700, textAlign: "center" }}>All tasks complete — generate your report below</div>}
        </div>

        {sharedTasksVisible.length > 0 && (
          <div style={{ marginBottom: 24 }}>
            <div style={{ color: C.gold, fontSize: 11, fontWeight: 800, letterSpacing: 2, textTransform: "uppercase", marginBottom: 10 }}>Staff Updates — Shared Task Completions</div>
            {sharedTasksVisible.map(({ user, task, td }) => (
              <div key={user.id + task.id} style={{ background: td.completed ? C.green + "22" : C.card, border: "1px solid " + (td.completed ? "#4CAF5044" : C.cardBorder), borderRadius: 12, padding: "14px 18px", marginBottom: 8 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 32, height: 32, borderRadius: "50%", background: user.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 800, color: C.ivory, flexShrink: 0 }}>{user.initials}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ color: C.muted, fontSize: 11, fontWeight: 700, textTransform: "uppercase" }}>{user.name}</div>
                    <div style={{ color: td.completed ? "#4CAF50" : C.text, fontWeight: 700, fontSize: 14, marginTop: 2 }}>{task.title}</div>
                    <div style={{ color: C.muted, fontSize: 12, marginTop: 2 }}>{td.completed ? "Completed and submitted" : "In progress"}</div>
                  </div>
                  <div style={{ background: td.completed ? "#4CAF5022" : C.cardBorder, border: "1px solid " + (td.completed ? "#4CAF5055" : C.cardBorder), borderRadius: 20, padding: "3px 12px", color: td.completed ? "#4CAF50" : C.muted, fontSize: 11, fontWeight: 700 }}>{td.completed ? "Complete" : "Pending"}</div>
                </div>
                {td.completed && task.fields.slice(0, 4).map(f => td.fields[f.key] ? (
                  <div key={f.key} style={{ marginTop: 8, paddingLeft: 44 }}>
                    <span style={{ color: C.muted, fontSize: 12 }}>{f.label}: </span>
                    <span style={{ color: C.text, fontSize: 12 }}>{td.fields[f.key]}</span>
                  </div>
                ) : null)}
              </div>
            ))}
          </div>
        )}

        <div style={{ color: C.gold, fontSize: 11, fontWeight: 800, letterSpacing: 2, textTransform: "uppercase", marginBottom: 12 }}>Workday tasks — click to open</div>
        {currentUser.tasks.map((task, i) => {
          const td = d[task.id];
          const isComplete = td && td.completed;
          const filledCount = td ? task.fields.filter(f => td.fields[f.key] && td.fields[f.key].trim()).length : 0;
          return (
            <button key={task.id} onClick={() => !isComplete && setActiveTask(task.id)}
              style={{ width: "100%", textAlign: "left", background: isComplete ? C.green + "22" : C.card, border: "1px solid " + (isComplete ? "#4CAF5044" : C.cardBorder), borderRadius: 12, padding: "16px 18px", marginBottom: 8, cursor: isComplete ? "default" : "pointer", display: "flex", alignItems: "center", gap: 14 }}
              onMouseEnter={e => { if (!isComplete) e.currentTarget.style.borderColor = C.gold + "66"; }}
              onMouseLeave={e => { if (!isComplete) e.currentTarget.style.borderColor = C.cardBorder; }}>
              <div style={{ width: 36, height: 36, borderRadius: "50%", background: isComplete ? "#4CAF5033" : C.cardBorder, border: "2px solid " + (isComplete ? "#4CAF50" : C.cardBorder), display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                {isComplete ? <span style={{ color: "#4CAF50", fontSize: 16, fontWeight: 900 }}>✓</span> : <span style={{ color: C.muted, fontSize: 13, fontWeight: 700 }}>{i + 1}</span>}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ color: isComplete ? "#4CAF50" : C.text, fontWeight: 700, fontSize: 14, textDecoration: isComplete ? "line-through" : "none" }}>{task.title}</div>
                <div style={{ color: C.muted, fontSize: 12, marginTop: 3 }}>
                  {isComplete ? "Completed" : filledCount > 0 ? filledCount + " of " + task.fields.length + " fields filled — click to continue" : task.fields.length + " fields to complete — click to open workbook"}
                </div>
              </div>
              {!isComplete && <span style={{ color: C.gold, fontSize: 20, flexShrink: 0 }}>›</span>}
            </button>
          );
        })}

        <button onClick={generateReport} style={{ width: "100%", background: C.burgundy, border: "1px solid " + C.gold + "66", borderRadius: 10, padding: "13px", color: C.ivory, fontSize: 14, fontWeight: 800, cursor: "pointer", marginTop: 20 }}>
          Generate workday report
        </button>

        {reportVisible && (
          <>
            <div style={{ background: C.card, border: "1px solid " + C.cardBorder, borderRadius: 12, padding: 18, marginTop: 12, fontSize: 12, color: C.text, lineHeight: 1.8, whiteSpace: "pre-wrap", fontFamily: "monospace", maxHeight: 400, overflowY: "auto" }}>{reportText}</div>
            <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
              <button onClick={() => setSent(true)} style={{ flex: 1, background: C.green, border: "none", borderRadius: 8, padding: "12px", color: C.ivory, fontSize: 13, fontWeight: 800, cursor: "pointer" }}>
                {getSendLabel()}
              </button>
              <button onClick={downloadReport} style={{ flex: 1, background: "transparent", border: "1px solid " + C.cardBorder, borderRadius: 8, padding: "12px", color: C.muted, fontSize: 13, cursor: "pointer" }}>Download</button>
            </div>
            {sent && <div style={{ color: "#4CAF50", fontSize: 13, fontWeight: 700, textAlign: "center", padding: "10px 0" }}>
              ✓ {getSentConfirmation()} — {new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}
            </div>}
          </>
        )}
        <div style={{ height: 48 }} />
      </div>
    </div>
  );
}