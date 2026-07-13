"use client";
import { useState, useEffect } from "react";

const C = {
  burgundy:"#6B1A2A",burgundyDark:"#4A0E1A",green:"#1E4D2B",gold:"#C9A84C",
  ivory:"#F5F0E8",dark:"#1A0F12",card:"#2A1A1E",cardBorder:"#3D2028",
  text:"#F0EAE2",muted:"#A08878",error:"#EF5350",
};

const SECTIONS = [
  {id:"s1",title:"Position Overview & Purpose",content:[
    {type:"table",rows:[
      ["Position Title","Director of Operations & Facilities"],
      ["Employee Name","Dennis Pride"],
      ["Organization","Grace Trace Ministries"],
      ["Reports To","Travis Ramar — VP & COO / Avrial Evans — President"],
      ["Works Alongside","Travis Ramar — VP & COO"],
      ["Position Type","Part time to full time — remote with required in person site visits"],
      ["Department Purpose","To assess, prepare, maintain, and manage all Grace Trace Ministries physical facilities — oversee construction and renovation contracts — manage male resident program oversight"],
      ["Effective Date","June 2026"],
    ]},
    {type:"para",text:"The Director of Operations & Facilities is the person who makes sure every Grace Trace Ministries property is ready, safe, compliant, and maintained to the highest standard. This role is the difference between a house that passes a government inspection and one that does not. Dennis Pride brings the construction knowledge, project management experience, and on-the-ground presence that Grace Trace Ministries needs to operate professional, inspection-ready facilities across Texas."},
  ]},
  {id:"s2",title:"Job Description",content:[
    {type:"subhead",text:"Position Summary"},
    {type:"para",text:"The Director of Operations & Facilities is responsible for all physical facility operations at Grace Trace Ministries. This includes assessing and approving properties before lease signing, overseeing renovations and repairs, managing construction and maintenance contractors, ensuring all facilities meet government inspection standards, and providing male resident program oversight across all male facilities."},
    {type:"subhead",text:"Primary Purpose"},
    {type:"bullets",items:["Assess and approve all properties before Grace Trace Ministries signs a lease","Oversee all renovation, repair, and maintenance work at all facilities","Negotiate and manage construction and contractor agreements — private sector only","Ensure all facilities meet TDCJ, BOP, and VA inspection standards","Supervise and support male resident programs on the ground","Coordinate with house managers at male facilities","Report facility and operational status to VP/COO and President"]},
    {type:"subhead",text:"Qualifications"},
    {type:"bullets",items:["Experience in construction, renovation, or facility management","Ability to assess property condition and estimate repair costs","Experience negotiating and managing contractor agreements","Strong organizational and project management skills","Reliable transportation for in person property visits across Texas","Ability to read and understand lease agreements and contractor contracts","Commitment to the mission and values of Grace Trace Ministries"]},
  ]},
  {id:"s3",title:"Duties & Responsibilities",content:[
    {type:"subhead",text:"1. Property Assessment & Approval"},
    {type:"bullets",items:["Visit and physically inspect every property before Grace Trace Ministries signs a lease","Assess structural condition — roof, foundation, walls, floors, plumbing, electrical, HVAC","Assess compliance readiness — smoke detectors, fire extinguishers, egress windows, accessibility","Identify all repairs needed before property is move-in ready","Estimate cost and timeline for all required repairs","Provide written property assessment report to President before lease is signed","Negotiate with landlord for any repairs to be completed before move-in","Give final approval or rejection recommendation on every property"]},
    {type:"subhead",text:"2. Renovation & Repair Oversight"},
    {type:"bullets",items:["Manage all renovation and repair projects at Grace Trace Ministries facilities","Obtain minimum 3 contractor bids for any project over $500","Present contractor bids and recommendations to President for approval","Oversee contractor work — quality, timeline, and budget compliance","Inspect all completed work before final payment is released to any contractor","Document all renovation and repair work with photos — before and after","Maintain records of all contractor agreements and work completed"]},
    {type:"subhead",text:"3. Construction Contract Management"},
    {type:"bullets",items:["Negotiate construction and renovation contracts on behalf of Grace Trace Ministries","Ensure all contractor agreements are in writing and signed before work begins","Verify contractor insurance and licensing before awarding any contract","Track contract performance — deliverables, timeline, and budget","Report any contractor disputes or issues to President immediately","All contracts over $1,000 require President approval before signing"]},
    {type:"subhead",text:"4. Facility Maintenance"},
    {type:"bullets",items:["Establish and maintain a preventive maintenance schedule for all facilities","Respond to maintenance requests from house managers within 24 hours","Coordinate emergency repairs immediately — same day response required","Maintain relationships with reliable plumbers, electricians, and general contractors","Conduct monthly facility inspections — document and address all issues found","Ensure all facilities are clean, safe, and properly maintained at all times"]},
    {type:"subhead",text:"5. Government Inspection Preparation"},
    {type:"bullets",items:["Know TDCJ, BOP, and VA facility inspection standards completely","Prepare all facilities for government inspections — nothing left to chance","Conduct pre-inspection walk-throughs before every scheduled government inspection","Address all inspection findings immediately — no delays on compliance issues","Document all inspection results and corrective actions taken","Report inspection outcomes to VP/COO and President same day"]},
    {type:"subhead",text:"6. Male Resident Oversight"},
    {type:"bullets",items:["Provide on-the-ground oversight of male resident programs","Support house managers at male facilities — backup authority when needed","Conduct site visits to male facilities minimum twice per month","Observe resident compliance — curfew, cleanliness, program participation","Address resident behavioral issues that escalate beyond house manager authority","Report resident program concerns to VP/COO and President","Coordinate with case managers on male resident progress"]},
  ]},
  {id:"s4",title:"Daily Work Schedule",content:[
    {type:"table",rows:[
      ["Time","Activity","Notes"],
      ["8:00 AM","Start of day — check messages and emails","Respond within 2 hours"],
      ["8:30 AM","Review daily priorities — maintenance requests — site visits","Reference weekly plan"],
      ["9:00 AM","Contractor calls and follow ups","Minimum 3 contractor contacts per day when projects active"],
      ["10:00 AM","Site visits — property assessments or facility inspections","As scheduled"],
      ["12:00 PM","Lunch — 30 minutes",""],
      ["12:30 PM","Update facility logs — document morning activities","Same day documentation required"],
      ["1:00 PM","Maintenance coordination — contractor oversight","Active project management"],
      ["2:00 PM","Male facility site visits or resident oversight","Minimum 2 visits per week"],
      ["3:00 PM","Administrative tasks — contracts, reports, photos","Keep all documentation current"],
      ["4:30 PM","End of day check in with VP/COO — brief update","Daily communication required"],
      ["5:00 PM","End of work day",""],
    ]},
  ]},
  {id:"s5",title:"Weekly Work Plan",content:[
    {type:"table",rows:[
      ["Day","Priority Activities"],
      ["Monday","Weekly planning — review all active projects — contractor check ins — maintenance request review — update project tracker"],
      ["Tuesday","Property visits — facility inspections — contractor oversight — male facility site visit"],
      ["Wednesday","Contractor meetings or bids — renovation oversight — compliance review — maintenance follow ups"],
      ["Thursday","Male facility site visit — resident oversight — facility documentation — inspection preparation"],
      ["Friday","Weekly report to VP/COO and President — update all logs — review week performance — plan next week"],
    ]},
    {type:"subhead",text:"Weekly Minimum Standards"},
    {type:"table",rows:[
      ["Activity","Weekly Minimum"],
      ["Male facility site visits","2 visits minimum"],
      ["Contractor contacts when projects active","Daily"],
      ["Maintenance request response time","Within 24 hours"],
      ["Emergency repair response time","Same day"],
      ["Facility log updates","Daily — same day as activity"],
      ["Weekly report to VP/COO","Every Friday by 5:00 PM"],
      ["Daily check in with VP/COO","Every work day"],
      ["Photo documentation of all work","Before and after every project"],
    ]},
  ]},
  {id:"s6",title:"Monthly Goals & Targets",content:[
    {type:"table",rows:[
      ["Goal","Monthly Target"],
      ["Property assessments completed","As needed — every property before lease signing"],
      ["Active contractor relationships maintained","Minimum 5 reliable contractors on call"],
      ["Facility inspections completed","All active facilities inspected monthly"],
      ["Maintenance requests resolved","100% within 48 hours — emergencies same day"],
      ["Male facility site visits","Minimum 8 per month — 2 per week"],
      ["Photo documentation updated","All active projects — weekly photos minimum"],
      ["Monthly facility report submitted","By 5th of following month"],
      ["Government inspection compliance","All facilities 100% compliant at all times"],
    ]},
  ]},
  {id:"s7",title:"Facility Assessment & Approval Process",content:[
    {type:"alert",text:"NO PROPERTY IS APPROVED WITHOUT DENNIS PRIDE'S WRITTEN ASSESSMENT — Before Grace Trace Ministries signs any lease Dennis Pride must complete a full physical assessment and submit a written report to the President. This is non-negotiable."},
    {type:"subhead",text:"Structural & Safety Checklist"},
    {type:"bullets",items:["Roof condition — no leaks or visible damage","Foundation — no cracks or structural concerns","Walls and ceilings — no water damage, mold, or structural issues","Floors — stable, no damage or safety hazards","Windows — functional, lockable, and adequate for emergency egress","Doors — all exterior doors lockable and secure"]},
    {type:"subhead",text:"Systems Checklist"},
    {type:"bullets",items:["Plumbing — all fixtures functional, no leaks, adequate water pressure","Electrical — no exposed wiring, adequate outlets, panel in good condition","HVAC — heating and cooling functional and adequate for occupancy","Hot water heater — functional and adequate capacity","Smoke detectors — present and functional in all required locations","Fire extinguishers — present and current inspection date","Carbon monoxide detectors — present and functional"]},
    {type:"subhead",text:"Compliance Standards"},
    {type:"bullets",items:["Minimum square footage per resident — at least 50 square feet per person","Private bathroom — meets VA and TDCJ standards","Kitchen — functional stove, refrigerator, sink, and adequate food storage","ADA accessibility — meets applicable requirements","Neighborhood safety — assessment of surrounding area","Proximity to employment, transportation, and services"]},
    {type:"subhead",text:"Assessment Report Format"},
    {type:"bullets",items:["Property address and date of assessment","Overall recommendation — Approve / Approve with conditions / Reject","List of all issues found with severity rating — Minor / Moderate / Major","Estimated cost to bring property to compliance","Estimated timeline for repairs","Landlord repair requests recommended","Photo documentation — minimum 20 photos","Final sign off — Dennis Pride signature and date"]},
  ]},
  {id:"s8",title:"Construction & Contractor Standards",content:[
    {type:"alert",text:"NO CONTRACTOR BEGINS WORK WITHOUT WRITTEN AGREEMENT AND PRESIDENT APPROVAL — All contracts over $1,000 require President approval before signing."},
    {type:"subhead",text:"Contractor Selection Process"},
    {type:"bullets",items:["Identify the scope of work needed — written description","Obtain minimum 3 bids for any project over $500","Verify insurance and licensing for all bidding contractors","Present bids and recommendation to President","President approves contractor and budget","Written contract signed before any work begins","Work supervised by Dennis Pride throughout","Final inspection before payment released","Document completed work with photos"]},
    {type:"subhead",text:"Contractor Agreement Minimum Requirements"},
    {type:"bullets",items:["Scope of work — detailed description of all work to be performed","Total contract price — fixed price whenever possible","Payment schedule — tied to milestones not time","Timeline — start date and completion date","Warranty — minimum 90 days on all labor","Insurance requirements — contractor liability and workers compensation","Change order process — all changes in writing before work proceeds","Dispute resolution — how disagreements are handled"]},
  ]},
  {id:"s9",title:"Male Resident Oversight Responsibilities",content:[
    {type:"para",text:"Dennis Pride serves as the on-the-ground oversight authority for all male resident facilities. This role works in coordination with house managers and reports to the VP/COO."},
    {type:"subhead",text:"Male Resident Oversight Duties"},
    {type:"bullets",items:["Conduct minimum 2 unannounced site visits per week to male facilities","Observe overall facility condition — cleanliness, maintenance, safety","Observe resident behavior and compliance during visits","Meet with house manager during each visit — review logs and issues","Address any resident behavioral issues that require authority above house manager","Report all significant observations to VP/COO same day","Support house manager in maintaining order and program standards","Coordinate with case manager on resident progress and challenges"]},
    {type:"subhead",text:"What Dennis Does NOT Do With Residents"},
    {type:"bullets",items:["Does not administer drug tests — that is the house manager's responsibility","Does not make discharge decisions — those go to VP/COO and President","Does not manage resident finances or program fees","Does not make promises or commitments to residents about their program status","Does not share confidential resident information with outside parties"]},
  ]},
  {id:"s10",title:"Meeting Requirements",content:[
    {type:"table",rows:[
      ["Meeting Type","Frequency / Details"],
      ["Daily check in with VP/COO","Every work day — text or email — brief update on activities"],
      ["Weekly one on one with VP/COO","Every Monday — 30 minutes — phone or video — review weekly plan"],
      ["Monthly review with President and VP/COO","First week of each month — 1 hour — review monthly report and goals"],
      ["Quarterly in person meeting","Once per quarter — in person — full review of facilities, projects, and performance"],
      ["Pre-inspection meetings","Before every government facility inspection — walk through with house manager"],
      ["Contractor meetings","As needed — document all meeting outcomes"],
      ["Annual performance review","Once per year — in person — with President and VP/COO"],
    ]},
  ]},
  {id:"s11",title:"Reporting Requirements",content:[
    {type:"subhead",text:"Daily Check In"},
    {type:"bullets",items:["Text or email to VP/COO every work day","Brief summary of activities completed","Any urgent maintenance or facility issues","Plan for next day"]},
    {type:"subhead",text:"Weekly Facilities Report — Due Every Friday by 5:00 PM"},
    {type:"bullets",items:["All site visits completed — location, date, observations","All maintenance requests received and status","Active contractor projects — status and timeline","Any facility issues requiring immediate attention","Male resident oversight observations","Plan for following week"]},
    {type:"subhead",text:"Monthly Facilities Report — Due by 5th of Following Month"},
    {type:"bullets",items:["Summary of all facility activities for the month","Property assessments completed","All renovation and repair projects — status and costs","Maintenance completed — costs and contractors used","Government inspection results and corrective actions","Male resident oversight summary","Performance metrics — actual vs targets","Upcoming facility needs and recommendations"]},
  ]},
  {id:"s12",title:"Input & Output Requirements",content:[
    {type:"subhead",text:"Inputs — What You Receive"},
    {type:"table",rows:[
      ["Input","Source"],
      ["Property leads to assess","President — as properties are identified"],
      ["Budget approvals for repairs","President — before any work begins"],
      ["Contractor approval","President — before contracts are signed"],
      ["Government inspection standards","VP/COO — TDCJ, BOP, VA requirements"],
      ["Maintenance requests","House managers — all facilities"],
      ["Resident concerns from house managers","House managers — male facilities"],
      ["Weekly priorities","VP/COO — Monday meeting"],
    ]},
    {type:"subhead",text:"Outputs — What You Produce"},
    {type:"table",rows:[
      ["Output","Frequency / Recipient"],
      ["Property assessment reports","Every property — before lease signing — President"],
      ["Contractor bid comparisons","Every project over $500 — President"],
      ["Daily check in","Every work day — VP/COO"],
      ["Weekly facilities report","Every Friday — VP/COO"],
      ["Monthly facilities report","By 5th — President and VP/COO"],
      ["Facility inspection reports","Monthly — all facilities"],
      ["Photo documentation","All projects — before and after"],
      ["Completed facility logs","Daily — filed in department binder"],
    ]},
  ]},
  {id:"s13",title:"Required Logs & Documentation",content:[
    {type:"subhead",text:"Log 1 — Property Assessment Log"},
    {type:"table",rows:[
      ["Date","Property Address","Landlord","Assessment Outcome","Repairs Needed","Estimated Cost","Recommendation","President Decision"],
      ["","","","","","","",""],["","","","","","","",""],["","","","","","","",""],
    ]},
    {type:"subhead",text:"Log 2 — Active Projects Tracker"},
    {type:"table",rows:[
      ["Property","Project Description","Contractor","Contract Amount","Start Date","Completion Date","Status","Notes"],
      ["","","","","","","",""],["","","","","","","",""],["","","","","","","",""],
    ]},
    {type:"subhead",text:"Log 3 — Contractor Database"},
    {type:"table",rows:[
      ["Company Name","Contact","Phone","Trade/Service","Licensed","Insured","Last Used","Rating"],
      ["","","","","","","",""],["","","","","","","",""],["","","","","","","",""],
    ]},
    {type:"subhead",text:"Log 4 — Facility Monthly Inspection Log"},
    {type:"table",rows:[
      ["Date","Facility Address","Items Inspected","Issues Found","Action Required","Completed By","Date Resolved","Notes"],
      ["","","","","","","",""],["","","","","","","",""],["","","","","","","",""],
    ]},
    {type:"subhead",text:"Log 5 — Male Resident Site Visit Log"},
    {type:"table",rows:[
      ["Date","Facility","House Manager Present","Observations","Issues Noted","Action Taken","Report to VP/COO","Follow Up"],
      ["","","","","","","",""],["","","","","","","",""],["","","","","","","",""],
    ]},
    {type:"subhead",text:"Log 6 — Maintenance Request Log"},
    {type:"table",rows:[
      ["Date Received","Facility","Issue Reported","Priority","Contractor Assigned","Date Resolved","Cost","Notes"],
      ["","","","","","","",""],["","","","","","","",""],["","","","","","","",""],
    ]},
  ]},
  {id:"s14",title:"Rules & Standards of Conduct",content:[
    {type:"alert",text:"VIOLATION OF THESE RULES MAY RESULT IN IMMEDIATE TERMINATION"},
    {type:"bullets",items:["Signing any contract or financial agreement without President approval","Releasing payment to any contractor without completed work inspection","Sharing confidential organizational or resident information with unauthorized parties","Falsifying logs, reports, or documentation of any kind","Using Grace Trace Ministries resources or relationships for personal benefit","Making promises or commitments to contractors or residents without authorization"]},
    {type:"subhead",text:"Professional Standards"},
    {type:"bullets",items:["Represent Grace Trace Ministries professionally in all contractor and landlord interactions","Respond to VP/COO and President communications within 2 hours during work hours","Respond to emergency maintenance requests same day — no exceptions","Complete all logs same day — never backfill documentation","Submit all reports on time — prior notice required if unable to meet deadline","Maintain professional appearance during all site visits and contractor meetings"]},
    {type:"subhead",text:"Financial Standards"},
    {type:"bullets",items:["All expenditures over $500 require President approval before commitment","Obtain minimum 3 bids for all projects over $500","Never pay a contractor before inspecting and approving completed work","Keep all receipts and invoices — submit with monthly report","Never accept gifts, kickbacks, or personal benefits from contractors"]},
  ]},
  {id:"s15",title:"Performance Metrics",content:[
    {type:"table",rows:[
      ["Metric","Target","Frequency"],
      ["Property assessments completed before lease signing","100% — no exceptions","Per property"],
      ["Maintenance request response time","100% within 24 hours — emergencies same day","Weekly"],
      ["Male facility site visits","Minimum 2 per week","Weekly"],
      ["Monthly facility inspections completed","100% of active facilities","Monthly"],
      ["Contractor bids obtained for projects over $500","Minimum 3 bids — 100% compliance","Per project"],
      ["Government inspection pass rate","100% — all facilities","Per inspection"],
      ["Reports submitted on time","100% on time","Weekly/Monthly"],
      ["Photo documentation completed","100% — all projects before and after","Per project"],
      ["Contractor agreements signed before work starts","100% — no exceptions","Per project"],
      ["Log completion same day","100% compliance","Daily"],
    ]},
  ]},
  {id:"s16",title:"Acknowledgment & Signature",content:[
    {type:"para",text:"I, Dennis Pride, acknowledge that I have received, read, and understand the contents of this Department Operations Binder for the position of Director of Operations & Facilities at Grace Trace Ministries. I understand and agree to perform all duties and responsibilities as described in this binder, meet all reporting requirements and deadlines, maintain all required logs and documentation, uphold all professional and financial standards, protect the confidentiality of Grace Trace Ministries and its residents, attend all required meetings including quarterly in person meetings, and never sign contracts or release payments without proper approval. This binder is the property of Grace Trace Ministries and must be returned upon separation from this position."},
    {type:"signature"},
  ]},
];

function Block({block}){
  if(block.type==="para")return<p style={{color:C.text,fontSize:14,lineHeight:1.8,margin:"0 0 12px"}}>{block.text}</p>;
  if(block.type==="subhead")return<div style={{color:C.gold,fontSize:13,fontWeight:800,textTransform:"uppercase",letterSpacing:1,margin:"18px 0 8px",borderLeft:"3px solid "+C.gold,paddingLeft:10}}>{block.text}</div>;
  if(block.type==="alert")return<div style={{background:C.burgundy+"33",border:"1px solid "+C.burgundy,borderRadius:8,padding:"12px 16px",color:C.ivory,fontSize:13,fontWeight:700,margin:"12px 0"}}>{block.text}</div>;
  if(block.type==="bullets")return<ul style={{margin:"0 0 12px",paddingLeft:20}}>{block.items.map((item,i)=><li key={i} style={{color:C.text,fontSize:14,lineHeight:1.8,marginBottom:4}}>{item}</li>)}</ul>;
  if(block.type==="table")return(
    <div style={{overflowX:"auto",marginBottom:16}}>
      <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
        <tbody>{block.rows.map((row,i)=>(
          <tr key={i} style={{background:i===0?C.burgundy:i%2===0?C.dark:C.card}}>
            {row.map((cell,j)=><td key={j} style={{padding:"8px 12px",color:i===0?C.ivory:j===0?C.gold:C.text,fontWeight:i===0||j===0?700:400,border:"1px solid "+C.cardBorder,fontSize:13}}>{cell}</td>)}
          </tr>
        ))}</tbody>
      </table>
    </div>
  );
  return null;
}

export default function DennisBinder(){
  const[activeSection,setActiveSection]=useState("s1");
  const[signatureName,setSignatureName]=useState("");
  const[signatureDate,setSignatureDate]=useState("");
  const[signError,setSignError]=useState("");
  const[signed,setSigned]=useState(false);
  const[loading,setLoading]=useState(true);
  const[authorized,setAuthorized]=useState(false);

  useEffect(()=>{
    try{
      const uid=localStorage.getItem("gtm_current_user");
      if(uid==="dennis"||uid==="avy"||uid==="travis"){
        setAuthorized(true);
        fetch("/api/signatures").then(function(r){return r.json();}).then(function(sigs){
        if(sigs["binder_dennis"]&&sigs["binder_dennis"].signed){setSigned(true);}
        else{try{const saved=localStorage.getItem("gtm_orientation_dennis");if(saved){const p=JSON.parse(saved);if(p.signed)setSigned(true);}}catch(e){}}
      }).catch(function(){try{const saved=localStorage.getItem("gtm_orientation_dennis");if(saved){const p=JSON.parse(saved);if(p.signed)setSigned(true);}}catch(e){}});
      }
    }catch(e){}
    setLoading(false);
  },[]);

  function submitSignature(){
    if(!signatureName.trim()){setSignError("Please type your full name to sign.");return;}
    if(!signatureDate.trim()){setSignError("Please enter today's date.");return;}
    const sigData = {signed:true,name:signatureName,date:signatureDate};
    try{localStorage.setItem("gtm_orientation_dennis",JSON.stringify(sigData));}catch(e){}
    fetch("/api/signatures",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({userId:"binder_dennis",data:sigData})}).catch(()=>{});
    setSigned(true);
  }

  if(loading)return<div style={{minHeight:"100vh",background:C.dark,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Inter','Segoe UI',sans-serif"}}><div style={{color:C.muted}}>Loading...</div></div>;
  if(!authorized)return<div style={{minHeight:"100vh",background:C.dark,display:"flex",alignItems:"center",justifyContent:"center",padding:20,fontFamily:"'Inter','Segoe UI',sans-serif"}}><div style={{textAlign:"center"}}><div style={{color:C.ivory,fontSize:16,fontWeight:700,marginBottom:12}}>Access restricted — log in to the Staff Portal first</div><a href="/" style={{background:C.burgundy,border:"1px solid "+C.gold+"66",borderRadius:8,padding:"11px 24px",color:C.ivory,fontSize:14,fontWeight:800,textDecoration:"none"}}>Go to Staff Portal</a></div></div>;

  const current=SECTIONS.find(s=>s.id===activeSection);
  const idx=SECTIONS.findIndex(s=>s.id===activeSection);

  return(
    <div style={{minHeight:"100vh",background:C.dark,fontFamily:"'Inter','Segoe UI',sans-serif",display:"flex",flexDirection:"column"}}>
      <div style={{background:"linear-gradient(135deg,"+C.burgundyDark+" 0%,"+C.dark+" 70%)",borderBottom:"2px solid "+C.gold,padding:"14px 20px",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:10}}>
        <div>
          <div style={{color:C.gold,fontSize:10,fontWeight:800,letterSpacing:3,textTransform:"uppercase"}}>Department Operations Binder</div>
          <div style={{color:C.ivory,fontWeight:900,fontSize:16}}>Dennis Pride</div>
          <div style={{color:C.muted,fontSize:12}}>Director of Operations & Facilities</div>
        </div>
        <div style={{display:"flex",gap:8}}>
          {signed&&<div style={{background:"#4CAF5022",border:"1px solid #4CAF5044",borderRadius:20,padding:"4px 12px",color:"#4CAF50",fontSize:12,fontWeight:700}}>✓ Signed</div>}
          <button onClick={()=>window.history.back()} style={{background:"transparent",border:"1px solid "+C.cardBorder,borderRadius:8,padding:"6px 12px",color:C.muted,fontSize:12,cursor:"pointer"}}>← Back</button>
        </div>
      </div>
      <div style={{display:"flex",flex:1}}>
        <div style={{width:220,background:C.card,borderRight:"1px solid "+C.cardBorder,padding:"12px 0",flexShrink:0,overflowY:"auto"}}>
          {SECTIONS.map((s,i)=>(
            <button key={s.id} onClick={()=>setActiveSection(s.id)} style={{width:"100%",textAlign:"left",padding:"10px 16px",background:activeSection===s.id?C.burgundy:"transparent",border:"none",cursor:"pointer",display:"flex",alignItems:"center",gap:8,borderLeft:activeSection===s.id?"3px solid "+C.gold:"3px solid transparent"}}>
              <span style={{color:C.gold,fontSize:11,fontWeight:800,flexShrink:0}}>{i+1}</span>
              <span style={{color:activeSection===s.id?C.ivory:C.muted,fontSize:12,fontWeight:activeSection===s.id?700:400,lineHeight:1.4}}>{s.title}</span>
            </button>
          ))}
        </div>
        <div style={{flex:1,padding:"24px",overflowY:"auto",maxWidth:700}}>
          <div style={{color:C.gold,fontSize:11,fontWeight:800,letterSpacing:2,textTransform:"uppercase",marginBottom:6}}>Section {idx+1}</div>
          <h2 style={{color:C.ivory,fontSize:20,fontWeight:900,margin:"0 0 20px",paddingBottom:12,borderBottom:"1px solid "+C.cardBorder}}>{current.title}</h2>
          {current.content.map((block,i)=>{
            if(block.type==="signature")return(
              <div key={i}>
                {!signed?(
                  <div style={{background:C.card,border:"1px solid "+C.gold+"66",borderRadius:12,padding:"20px"}}>
                    <div style={{color:C.muted,fontSize:13,marginBottom:16}}>By signing below you confirm you have read and understood this entire binder and agree to fulfill all responsibilities of your role.</div>
                    <div style={{marginBottom:14}}>
                      <div style={{color:C.text,fontSize:13,fontWeight:600,marginBottom:6}}>Type your full name: <span style={{color:C.gold}}>(Dennis Pride)</span></div>
                      <input type="text" value={signatureName} onChange={e=>{setSignatureName(e.target.value);setSignError("");}} placeholder="Dennis Pride" style={{width:"100%",background:C.dark,border:"1px solid "+(signError?C.error:C.cardBorder),borderRadius:8,padding:"10px 14px",color:C.text,fontSize:14,outline:"none",fontFamily:"inherit"}}/>
                    </div>
                    <div style={{marginBottom:14}}>
                      <div style={{color:C.text,fontSize:13,fontWeight:600,marginBottom:6}}>Date</div>
                      <input type="text" value={signatureDate} onChange={e=>{setSignatureDate(e.target.value);setSignError("");}} placeholder="e.g. July 8, 2026" style={{width:"100%",background:C.dark,border:"1px solid "+(signError?C.error:C.cardBorder),borderRadius:8,padding:"10px 14px",color:C.text,fontSize:14,outline:"none",fontFamily:"inherit"}}/>
                    </div>
                    {signError&&<div style={{color:C.error,fontSize:13,marginBottom:10}}>{signError}</div>}
                    <button onClick={submitSignature} style={{width:"100%",background:C.green,border:"none",borderRadius:10,padding:"13px",color:C.ivory,fontSize:14,fontWeight:800,cursor:"pointer"}}>I Have Read and Understood This Binder — Sign and Submit</button>
                  </div>
                ):(
                  <div style={{background:"#4CAF5022",border:"1px solid #4CAF5044",borderRadius:12,padding:"24px",textAlign:"center"}}>
                    <div style={{fontSize:32,marginBottom:8}}>✓</div>
                    <div style={{color:"#4CAF50",fontWeight:800,fontSize:16}}>Binder Signed and Acknowledged</div>
                    <div style={{color:C.muted,fontSize:13,marginTop:4}}>Dennis Pride — {signatureDate||"Signed"}</div>

                  <div style={{marginTop:20,display:"flex",flexDirection:"column",gap:10}}>
                    <div style={{color:"#4CAF5088",fontSize:12,textAlign:"center",marginBottom:4}}>What would you like to do next?</div>
                    <button onClick={()=>{
                      const uid=localStorage.getItem("gtm_current_user")||"";
                      fetch("/api/signatures").then(function(r){return r.json();}).then(function(sigs){
                        const oSigned=sigs["orientation_"+uid]?sigs["orientation_"+uid].signed:false;
                        const bSigned=sigs["binder_"+uid]?sigs["binder_"+uid].signed:false;
                        if(!oSigned){window.location.href="/orientation";}
                        else if(!bSigned){window.location.href="/"+uid+"-binder";}
                        else{window.location.href="/";}
                      }).catch(function(){window.location.href="/";});
                    }} style={{background:C.burgundy,border:"1px solid "+C.gold+"66",borderRadius:10,padding:"12px",color:C.ivory,fontSize:14,fontWeight:800,cursor:"pointer"}}>
                      Continue to Next Required Document
                    </button>
                    <button onClick={()=>{window.location.href="/";}} style={{background:"transparent",border:"1px solid "+C.cardBorder,borderRadius:10,padding:"12px",color:C.muted,fontSize:13,cursor:"pointer"}}>
                      Return to My Workday Dashboard
                    </button>
                  </div>
                  <div style={{marginTop:20,display:"flex",flexDirection:"column",gap:10}}>
                    <div style={{color:"#4CAF5088",fontSize:12,textAlign:"center",marginBottom:4}}>What would you like to do next?</div>
                    <button onClick={function(){
                      var uid2=localStorage.getItem("gtm_current_user")||"";
                      fetch("/api/signatures").then(function(r){return r.json();}).then(function(sigs){
                        var oSigned=sigs["orientation_"+uid2]?sigs["orientation_"+uid2].signed:false;
                        // Binder was just signed so treat it as signed
                        if(!oSigned){window.location.href="/orientation";}
                        else{window.location.href="/";}
                      }).catch(function(){window.location.href="/";});
                    }} style={{background:C.burgundy,border:"1px solid "+C.gold+"66",borderRadius:10,padding:"12px",color:C.ivory,fontSize:14,fontWeight:800,cursor:"pointer"}}>
                      Continue to Next Pending Item
                    </button>
                    <button onClick={function(){window.location.href="/";}} style={{background:"transparent",border:"1px solid "+C.cardBorder,borderRadius:10,padding:"12px",color:C.muted,fontSize:13,cursor:"pointer"}}>
                      Return to My Workday Dashboard
                    </button>
                  </div>
                  </div>
                )}
              </div>
            );
            return<Block key={i} block={block}/>;
          })}
          <div style={{display:"flex",justifyContent:"space-between",marginTop:24,paddingTop:16,borderTop:"1px solid "+C.cardBorder}}>
            <button onClick={()=>{if(idx>0)setActiveSection(SECTIONS[idx-1].id);}} disabled={idx===0} style={{background:"transparent",border:"1px solid "+C.cardBorder,borderRadius:8,padding:"8px 16px",color:idx===0?C.cardBorder:C.muted,fontSize:13,cursor:idx===0?"default":"pointer"}}>← Previous</button>
            <button onClick={()=>{if(idx<SECTIONS.length-1)setActiveSection(SECTIONS[idx+1].id);}} disabled={idx===SECTIONS.length-1} style={{background:idx===SECTIONS.length-1?C.cardBorder:C.burgundy,border:"1px solid "+(idx===SECTIONS.length-1?C.cardBorder:C.gold+"66"),borderRadius:8,padding:"8px 16px",color:C.ivory,fontSize:13,cursor:idx===SECTIONS.length-1?"default":"pointer"}}>Next →</button>
          </div>
          <div style={{height:40}}/>
        </div>
      </div>
    </div>
  );
}