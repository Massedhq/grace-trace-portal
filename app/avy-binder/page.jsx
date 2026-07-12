"use client";
import { useState, useEffect } from "react";

const C = {
  burgundy:"#6B1A2A",burgundyDark:"#4A0E1A",green:"#1E4D2B",gold:"#C9A84C",
  ivory:"#F5F0E8",dark:"#1A0F12",card:"#2A1A1E",cardBorder:"#3D2028",
  text:"#F0EAE2",muted:"#A08878",error:"#EF5350",
};

const SECTIONS = [
  {id:"s1",title:"Identity & Organization Overview",content:[
    {type:"alert",text:"CO-FOUNDER | PRESIDENT | BOARD CHAIR | SOLE AUTHORIZED SIGNATORY"},
    {type:"table",rows:[
      ["Full Name","Avrial Evans"],
      ["Title","Co-Founder, President & Board Chair"],
      ["Organization","Grace Trace Ministries"],
      ["EIN","42-2972120"],
      ["Texas SOS File Number","806637680"],
      ["CAGE Code","21SQ1"],
      ["SAM.gov UEI","FR8MBUNRB3J4 — ACTIVE"],
      ["SAM.gov Renewal","June 22, 2027 — calendar reminder required"],
      ["Virtual Principal Office","539 W Commerce St, Suite 5887, Dallas, TX 75208"],
      ["Mailing Address","5729 Lebanon Rd, Suite 144605, Frisco, TX 75034"],
      ["Registered Agent Address","2018 Palo Duro Drive, Odessa, TX 79762 — Deann Evans"],
      ["Website","gracetraceministries.org"],
      ["Email","info@gracetraceministries.org"],
      ["Phone","469-430-7467"],
      ["Bank Account","Open and active — sole authorized signatory"],
      ["501c3 Status","1023-EZ filed — determination letter pending"],
      ["Primary NAICS Code","623990 — Other Residential Care Facilities"],
    ]},
  ]},
  {id:"s2",title:"Role, Authority & Responsibilities",content:[
    {type:"para",text:"As Co-Founder and President of Grace Trace Ministries you hold the highest authority in the organization. Every major decision — financial, strategic, legal, and operational — flows through you. You set the vision. You sign the contracts. You control the money. You build the government relationships. You are the face of Grace Trace Ministries to the world. This binder documents your authority, responsibilities, and operational framework so that everything you do is documented, intentional, and protectable."},
    {type:"subhead",text:"1. Strategic Leadership"},
    {type:"bullets",items:["Set the vision, mission, and strategic direction of Grace Trace Ministries","Make all final organizational decisions","Approve all new programs, expansions, and major initiatives","Set annual goals and priorities for the organization and all staff","Represent Grace Trace Ministries to government agencies, funders, and the public"]},
    {type:"subhead",text:"2. Finance & Banking"},
    {type:"bullets",items:["Sole authorized signatory on all Grace Trace Ministries bank accounts","Authorize all expenditures — sole approval authority","Review financial reports monthly — maintain full awareness of cash position","Oversee bookkeeping accuracy and audit readiness","Submit monthly billing vouchers to TDCJ, BOP, and VA once contracts are active","Manage all grant financial reporting and compliance"]},
    {type:"subhead",text:"3. Procurement"},
    {type:"bullets",items:["Sole procurement authority for Grace Trace Ministries","Approve all purchases over $100","Approve all contractor and vendor agreements — construction and operations","Maintain vendor and contractor approval list","Ensure all procurement is documented and receipts maintained"]},
    {type:"subhead",text:"4. Government Contracts & Grants"},
    {type:"bullets",items:["Negotiate and sign all government contracts — TDCJ, BOP, VA, FEMA, HUD","Submit all grant applications — federal, state, and foundation","Maintain all government registrations — SAM.gov, Grants.gov, state portals","Build and maintain relationships with all government agency contacts","Ensure all contract compliance requirements are met — reporting, inspections, billing"]},
    {type:"subhead",text:"5. Board Governance"},
    {type:"bullets",items:["Chair all board meetings","Set board meeting agenda and schedule","Ensure board members fulfill their governance responsibilities","Bring all major decisions to the board for vote","Maintain all board records — minutes, resolutions, attendance"]},
  ]},
  {id:"s3",title:"Finance & Banking Authority",content:[
    {type:"alert",text:"AVRIAL EVANS IS THE SOLE AUTHORIZED SIGNATORY ON ALL GRACE TRACE MINISTRIES ACCOUNTS"},
    {type:"table",rows:[
      ["Banking Authority","Details"],
      ["Bank account signatory","Sole authorized signatory — Avrial Evans only"],
      ["Check signing","Avrial Evans only"],
      ["Electronic payments","Avrial Evans only"],
      ["Wire transfers","Avrial Evans only"],
      ["Debit card","Avrial Evans — Grace Trace Ministries name"],
      ["Online banking access","Avrial Evans — primary access"],
      ["Credit cards","Avrial Evans — sole authority to apply and manage"],
      ["Lines of credit","Avrial Evans — sole authority"],
      ["Account opening","Avrial Evans only"],
      ["Account closing","Avrial Evans only"],
    ]},
    {type:"subhead",text:"Financial Management Standards"},
    {type:"bullets",items:["Review bank account balance weekly — every Monday","Review all transactions monthly — verify accuracy","Keep all receipts and invoices — minimum 7 years","Submit government billing vouchers within 30 days of month end when contracts active","Maintain separate accounting for each funding source — grants, TDCJ, BOP, VA, private pay","Never commingle personal and organizational funds","Maintain a minimum operating reserve of 3 months expenses"]},
    {type:"subhead",text:"Monthly Financial Checklist"},
    {type:"bullets",items:["Review bank statements — all transactions verified","Submit government billing vouchers — TDCJ, BOP, VA as applicable","Review grant expenditure reports — ensure compliance with grant terms","Review payroll and contractor payments — all approved and documented","Update financial projections — compare actuals to budget","Prepare financial summary for board review","Confirm SAM.gov registration is current — annual renewal June 22 2027"]},
  ]},
  {id:"s4",title:"Procurement Authority",content:[
    {type:"alert",text:"ALL PROCUREMENT DECISIONS REQUIRE AVRIAL EVANS APPROVAL — No purchase, contract, or financial commitment may be made without her approval. This applies to all staff, board members, and contractors."},
    {type:"table",rows:[
      ["Purchase Amount","Approval Process"],
      ["Under $100","Avrial Evans approval — verbal or text OK — document within 24 hours"],
      ["$100 to $500","Avrial Evans approval — email confirmation required before purchase"],
      ["$500 to $1,000","Avrial Evans approval — written approval required — minimum 2 quotes"],
      ["Over $1,000","Avrial Evans approval — minimum 3 quotes — written contract required — board notification"],
      ["Over $5,000","Avrial Evans approval — board vote required — full documentation"],
    ]},
    {type:"subhead",text:"Procurement Documentation Requirements"},
    {type:"bullets",items:["All purchases documented with receipt or invoice — no exceptions","All contractor agreements in writing and signed before work begins","All quotes maintained on file — minimum 3 for projects over $500","Monthly procurement summary submitted to board","Annual vendor review — assess all active vendor relationships"]},
  ]},
  {id:"s5",title:"Government Contracts & Grant Strategy",content:[
    {type:"subhead",text:"Active Government Registrations"},
    {type:"table",rows:[
      ["Registration","Status"],
      ["SAM.gov","ACTIVE — UEI FR8MBUNRB3J4 — CAGE 21SQ1 — renew June 22 2027"],
      ["Grants.gov","Register immediately — SAM.gov is now active"],
      ["IRS 501c3","1023-EZ filed — determination letter pending 2-4 weeks"],
      ["Texas State Tax Exemption","File Form AP-204 after 501c3 letter received"],
      ["TDCJ Provider Approval","Apply when fully set up — call 512-406-5202"],
      ["BOP RRC Contract","Apply after TDCJ — contact Kevin Hoff khoff@bop.gov"],
      ["VA GPD Per Diem","Apply when PDO notice drops — estimated late 2026"],
    ]},
    {type:"subhead",text:"Contract Pursuit Sequence"},
    {type:"bullets",items:["Register on Grants.gov — this week","Receive 501c3 determination letter — 2-4 weeks","File Texas state tax exemption — after determination letter","Call TDCJ — 512-406-5202 — request provider approval","Email BOP — Kevin Hoff — khoff@bop.gov — introduce Grace Trace Ministries","Email VA GPD — GPDGrants@va.gov — request PDO notification","When TDCJ approved — secure property — Dennis assesses — sign lease","First residents placed — revenue begins"]},
    {type:"subhead",text:"Grant Calendar"},
    {type:"table",rows:[
      ["Grant Source","Action Required"],
      ["VA GPD Per Diem Only","Watch for notice — estimated late 2026 — apply immediately when drops"],
      ["HUD CoC","Annual application — research Houston CoC timeline"],
      ["DOJ Second Chance Act","Federal reentry grant — apply after TDCJ contract established"],
      ["Texas Veterans Commission","Apply for veterans housing startup funding"],
      ["SSVF","Supportive Services for Veteran Families — Phase 2"],
      ["Private foundations","Research and identify 10 target foundations — apply quarterly"],
    ]},
  ]},
  {id:"s6",title:"Board Governance Responsibilities",content:[
    {type:"subhead",text:"Board Composition"},
    {type:"table",rows:[
      ["Member","Role"],
      ["Avrial Evans","Co-Founder, President & Board Chair"],
      ["Travis Ramar","Co-Founder, VP & COO & Board Member"],
      ["Dennis Pride","Board Member & Director of Operations & Facilities"],
      ["Erica Evans","Board Member & Director of Residential Services"],
      ["AuBreyon Woodley","Board Member"],
      ["Ialana Tippins","Board Member & Director of Intake & Resident Relations"],
    ]},
    {type:"subhead",text:"Board Meeting Requirements"},
    {type:"bullets",items:["Quarterly board meetings — minimum 4 per year","Annual meeting — full year review, budget approval, officer elections","Special meetings — as needed for major decisions","All meetings documented with formal minutes","Quorum — majority of directors required","All votes documented in minutes"]},
    {type:"subhead",text:"President's Board Responsibilities"},
    {type:"bullets",items:["Set board meeting agenda and distribute 7 days before meeting","Chair all board meetings","Present financial report at every board meeting","Present operational report at every board meeting","Bring all major decisions to board vote","Ensure all directors are informed and engaged","Maintain all board records — minutes, resolutions, attendance"]},
  ]},
  {id:"s7",title:"Team Oversight Structure",content:[
    {type:"para",text:"Avrial Evans directly oversees all staff and board members. The organizational structure flows as follows:"},
    {type:"table",rows:[
      ["Position","Oversight Responsibilities"],
      ["AVRIAL EVANS — CO-FOUNDER & PRESIDENT","All authority flows from this position"],
      ["Travis Ramar — VP & COO","Reports to President | Oversees: House Managers, Case Managers | Works alongside: Dennis Pride"],
      ["Dennis Pride — Director of Operations & Facilities","Reports to VP/COO and President | Oversees: Construction contractors, facility maintenance, male resident oversight"],
      ["Deann Evans — Director of Outreach","Reports to President | Manages: Referral pipeline, community relationships, government outreach"],
      ["Erica Evans — Director of Residential Services","Reports to President | Manages: Cleanliness standards, laundry, supplies, resident support services"],
      ["Ialana Tippins — Director of Intake","Reports to President | Manages: Intake, resident relations, transportation, Houston outreach"],
    ]},
    {type:"subhead",text:"Staff Communication Standards"},
    {type:"bullets",items:["All staff submit weekly reports to President every Friday by 5:00 PM","All staff check in daily — text or email","All staff attend quarterly in person meeting","All major decisions and issues escalate to President immediately","President reviews all weekly reports by end of day Monday"]},
  ]},
  {id:"s8",title:"Daily & Weekly Executive Schedule",content:[
    {type:"table",rows:[
      ["Time","Activity","Notes"],
      ["8:00 AM","Review overnight messages and emails","Respond to urgent items first"],
      ["8:30 AM","Review daily priorities and government correspondence","Check SAM.gov and Grants.gov for updates"],
      ["9:00 AM","Government relationship work — calls, emails, applications","TDCJ, BOP, VA, grant agencies"],
      ["10:00 AM","Finance review — bank account, billing, procurement approvals","Weekly on Mondays — daily check during billing periods"],
      ["11:00 AM","Staff communications — review reports, respond to questions","All staff reports reviewed"],
      ["12:00 PM","Lunch — 30 minutes",""],
      ["12:30 PM","Strategic work — grant writing, contract preparation, program development",""],
      ["2:00 PM","Board and governance matters — documentation, resolutions, correspondence",""],
      ["3:00 PM","Procurement approvals — review and sign off on staff requests","Same day response required"],
      ["4:00 PM","Planning and documentation — update organizational records",""],
      ["5:00 PM","End of executive work day",""],
    ]},
    {type:"subhead",text:"Weekly Executive Priorities"},
    {type:"table",rows:[
      ["Day","Priority Focus"],
      ["Monday","Review all staff weekly reports — set weekly priorities — bank account review — board communications"],
      ["Tuesday","Government relationship work — calls and emails to TDCJ, BOP, VA, grant agencies"],
      ["Wednesday","Grant writing and contract preparation — strategic planning — procurement approvals"],
      ["Thursday","Staff oversight — operational review — board governance — documentation"],
      ["Friday","Financial review — billing submissions — weekly summary — planning for next week"],
    ]},
  ]},
  {id:"s9",title:"Decision-Making Authority",content:[
    {type:"alert",text:"DECISIONS THAT REQUIRE PRESIDENT AUTHORITY ONLY"},
    {type:"table",rows:[
      ["Decision Type","Authority"],
      ["All financial expenditures","President only — no exceptions"],
      ["All procurement","President only — no exceptions"],
      ["Government contract negotiations and signing","President only"],
      ["Grant applications and signing","President only"],
      ["Lease agreements","President only — after Dennis assessment"],
      ["Staff hiring and termination","President only — with VP/COO input"],
      ["Program policy changes","President with board notification"],
      ["New program development","President with board approval"],
      ["Facility opening or closing","President with board approval"],
      ["Media and public statements","President only"],
      ["Legal matters","President only — with legal counsel as needed"],
      ["SAM.gov and Grants.gov actions","President only — sole entity administrator"],
    ]},
    {type:"subhead",text:"Decisions Travis Can Make Without President Approval"},
    {type:"bullets",items:["Day to day operational decisions within approved budget","House manager supervision and minor disciplinary actions","Resident compliance enforcement within established policies","Contractor scheduling within approved projects","Staff scheduling and daily work assignments"]},
    {type:"subhead",text:"Decisions That Must Come to President"},
    {type:"bullets",items:["Any expenditure over $100","Any new contractor or vendor relationship","Any resident discharge — final approval","Any government agency communication — significant matters","Any media inquiry or public statement"]},
  ]},
  {id:"s10",title:"Key Government Contacts",content:[
    {type:"table",rows:[
      ["Agency / Contact","Details"],
      ["TDCJ — Community Justice Assistance Division","512-406-5202 — reentry housing provider approval and contracts"],
      ["Bureau of Prisons — Kevin Hoff","khoff@bop.gov — 202-598-6164 — RRC contracts"],
      ["VA Houston — DeBakey Medical Center","713-791-1414 — Homeless Veterans Coordinator — GPD per diem"],
      ["Texas Veterans Commission — Houston","713-558-4000 — veteran services and grants"],
      ["VA GPD Grants Office","GPDGrants@va.gov — VA GPD grant applications and notifications"],
      ["SAM.gov Federal Service Desk","fsd.gov — 866-606-8220 — SAM.gov support"],
      ["Grants.gov","grants.gov — federal grant applications"],
      ["APEX Accelerator","apexaccelerators.us — free government contracting assistance"],
      ["Texas Secretary of State","512-463-5555 — entity maintenance and updates"],
      ["IRS Tax Exempt Organizations","877-829-5500 — 501c3 status and annual filings"],
    ]},
  ]},
  {id:"s11",title:"Reporting & Accountability",content:[
    {type:"subhead",text:"What President Reviews Weekly"},
    {type:"bullets",items:["All staff weekly reports — due Friday 5:00 PM — reviewed by Monday","Bank account balance and transactions","Government correspondence and deadlines","Operational logs from all facilities — once operational","Outstanding procurement requests and approvals"]},
    {type:"subhead",text:"What President Reports to Board"},
    {type:"bullets",items:["Financial report — quarterly and annually","Operational report — quarterly","Government contract status — quarterly","Grant applications and awards — quarterly","Staff performance summary — annually","Strategic plan progress — annually"]},
    {type:"subhead",text:"Annual Compliance Calendar"},
    {type:"table",rows:[
      ["Item","Deadline"],
      ["SAM.gov annual renewal","June 22, 2027 — set calendar reminder now"],
      ["IRS Form 990-N e-Postcard","Annual — due based on fiscal year end December 31"],
      ["Texas Franchise Tax — nonprofits exempt","Maintain exemption certificate"],
      ["Texas State Tax Exemption renewal","After initial approval — check renewal requirements"],
      ["Board annual meeting","Once per year — document with minutes"],
      ["Staff performance reviews","Annual — all staff"],
      ["Insurance renewal","Annual — all facility policies"],
    ]},
  ]},
  {id:"s12",title:"Required Logs & Documentation",content:[
    {type:"subhead",text:"Log 1 — Government Contact Log"},
    {type:"table",rows:[
      ["Date","Agency","Contact Name","Phone/Email","Purpose","Outcome","Follow Up","Status"],
      ["","","","","","","",""],["","","","","","","",""],["","","","","","","",""],
    ]},
    {type:"subhead",text:"Log 2 — Grant Tracker"},
    {type:"table",rows:[
      ["Grant Name","Agency","Amount","Deadline","Submitted","Status","Award Date","Notes"],
      ["","","","","","","",""],["","","","","","","",""],["","","","","","","",""],
    ]},
    {type:"subhead",text:"Log 3 — Contract Tracker"},
    {type:"table",rows:[
      ["Contract","Agency","Contract Amount","Start Date","End Date","Renewal Date","Status","Notes"],
      ["","","","","","","",""],["","","","","","","",""],["","","","","","","",""],
    ]},
    {type:"subhead",text:"Log 4 — Procurement Approval Log"},
    {type:"table",rows:[
      ["Date","Staff Requesting","Item/Service","Amount","Approved Y/N","Vendor","Date Purchased","Receipt Filed"],
      ["","","","","","","",""],["","","","","","","",""],["","","","","","","",""],
    ]},
    {type:"subhead",text:"Log 5 — Board Meeting Log"},
    {type:"table",rows:[
      ["Date","Directors Present","Agenda Items","Resolutions Passed","Next Meeting Date","Minutes Filed","Notes"],
      ["","","","","","",""],["","","","","","",""],["","","","","","",""],
    ]},
  ]},
  {id:"s13",title:"Strategic Priorities — Now to Year 1",content:[
    {type:"alert",text:"THESE ARE THE PRIORITIES THAT DRIVE EVERY DECISION"},
    {type:"subhead",text:"Immediate Priorities — This Month"},
    {type:"bullets",items:["Register on Grants.gov — this week","Receive 501c3 determination letter — follow up with IRS if not received in 4 weeks","File Texas state tax exemption — Form AP-204 — after determination letter","Call TDCJ — 512-406-5202 — introduce Grace Trace Ministries and request provider approval","Email Kevin Hoff at BOP — khoff@bop.gov — introduce Grace Trace Ministries","Email GPDGrants@va.gov — request PDO notification","Submit notarized Entity Administrator letter to SAM.gov — within 60 days of activation"]},
    {type:"subhead",text:"30 to 90 Days"},
    {type:"bullets",items:["TDCJ provider approval received","First property assessed by Dennis Pride","First lease signed under Grace Trace Ministries","House manager hired for first facility","Case manager contracted","First residents placed — revenue begins","First government billing submitted"]},
    {type:"subhead",text:"90 Days to Year 1"},
    {type:"bullets",items:["Two facilities operating — male and female","BOP contract application submitted","VA GPD application submitted when notice drops","First grant awarded","Travis Ramar formally added to board when available","Financial systems and bookkeeping fully established","First annual board meeting held"]},
  ]},
  {id:"s14",title:"Organizational Rules & Standards",content:[
    {type:"alert",text:"PRESIDENT'S NON-NEGOTIABLE STANDARDS — GRACE TRACE MINISTRIES"},
    {type:"bullets",items:["No expenditure without President approval — no exceptions","No contract signed without President review and signature","No government communication on major matters without President knowledge","No media statements without President approval","No resident discharge without President final approval","SAM.gov registration renewed annually — never allowed to lapse","All organizational records maintained and protected at all times"]},
    {type:"subhead",text:"Organizational Standards"},
    {type:"bullets",items:["Grace Trace Ministries operates with integrity, transparency, and accountability at all times","Every decision is documented — no verbal agreements that are not followed up in writing","All government compliance requirements are met on time — no exceptions","Residents are treated with dignity and respect in every interaction","Staff are held to the highest professional standards","The mission comes first — every decision is evaluated against the mission"]},
  ]},
  {id:"s15",title:"Emergency & Contingency Protocols",content:[
    {type:"subhead",text:"If President is Temporarily Unavailable"},
    {type:"para",text:"Travis Ramar as VP and COO assumes temporary operational authority for day to day decisions only. No financial transactions, contract signings, or government commitments may be made without President availability."},
    {type:"subhead",text:"If SAM.gov Registration Lapses"},
    {type:"bullets",items:["Immediately contact Federal Service Desk — fsd.gov — 866-606-8220","Renewal deadline is June 22 2027 — set multiple calendar reminders","A lapsed registration stops all federal payments and contract eligibility","Renewal takes 1-3 business days — do not let it lapse"]},
    {type:"subhead",text:"If 501c3 Status is Threatened"},
    {type:"bullets",items:["Contact IRS Tax Exempt Organizations line — 877-829-5500","File all annual Form 990-N on time — failure for 3 years results in automatic revocation","Never engage in political campaign activity — immediate loss of exemption","Consult nonprofit attorney immediately if status is questioned"]},
    {type:"subhead",text:"Critical Contact Numbers — Emergency"},
    {type:"table",rows:[
      ["Emergency Contact","Number / Details"],
      ["IRS Tax Exempt Organizations","877-829-5500"],
      ["SAM.gov Federal Service Desk","fsd.gov — 866-606-8220"],
      ["Texas Secretary of State","512-463-5555"],
      ["Travis Ramar — VP/COO","Contact information on file"],
      ["Dennis Pride — Director of Facilities","Contact information on file"],
      ["Deann Evans — Director of Outreach","Contact information on file"],
    ]},
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

export default function AvyBinder(){
  const[activeSection,setActiveSection]=useState("s1");
  const[signatureName,setSignatureName]=useState("");
  const[signatureDate,setSignatureDate]=useState("");
  const[signError,setSignError]=useState("");
  const[signed,setSigned]=useState(false);
  const[loading,setLoading]=useState(true);

  useEffect(()=>{
    try{
      const saved=localStorage.getItem("gtm_orientation_avy");
      if(saved){const p=JSON.parse(saved);if(p.signed)setSigned(true);
    // Smart redirect — go to next unsigned document or back to dashboard}
    }catch(e){}
    setLoading(false);
  },[]);

  function submitSignature(){
    if(!signatureName.trim()){setSignError("Please type your full name to sign.");return;}
    if(!signatureDate.trim()){setSignError("Please enter today's date.");return;}
    try{localStorage.setItem("gtm_orientation_avy",JSON.stringify({signed:true,name:signatureName,date:signatureDate}));
    fetch("/api/signatures",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({userId:"binder_avy",data:{signed:true,name:signatureName,date:signatureDate}})});.catch(()=>{});}catch(e){}
    setSigned(true);
    // Smart redirect — go to next unsigned document or back to dashboard
  }

  if(loading)return<div style={{minHeight:"100vh",background:C.dark,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Inter','Segoe UI',sans-serif"}}><div style={{color:C.muted}}>Loading...</div></div>;

  const current=SECTIONS.find(s=>s.id===activeSection);
  const idx=SECTIONS.findIndex(s=>s.id===activeSection);

  return(
    <div style={{minHeight:"100vh",background:C.dark,fontFamily:"'Inter','Segoe UI',sans-serif",display:"flex",flexDirection:"column"}}>
      <div style={{background:"linear-gradient(135deg,"+C.burgundyDark+" 0%,"+C.dark+" 70%)",borderBottom:"2px solid "+C.gold,padding:"14px 20px",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:10}}>
        <div>
          <div style={{color:C.gold,fontSize:10,fontWeight:800,letterSpacing:3,textTransform:"uppercase"}}>President & Co-Founder — Operations & Authority Binder</div>
          <div style={{color:C.ivory,fontWeight:900,fontSize:16}}>Avrial Evans</div>
          <div style={{color:C.muted,fontSize:12}}>Co-Founder | President | Board Chair | Sole Authorized Signatory</div>
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
                    <div style={{color:C.muted,fontSize:13,marginBottom:16}}>By signing below you confirm you have read and understood this entire binder documenting your authority, responsibilities, and operational framework as President & Co-Founder of Grace Trace Ministries.</div>
                    <div style={{marginBottom:14}}>
                      <div style={{color:C.text,fontSize:13,fontWeight:600,marginBottom:6}}>Type your full name: <span style={{color:C.gold}}>(Avrial Evans)</span></div>
                      <input type="text" value={signatureName} onChange={e=>{setSignatureName(e.target.value);setSignError("");}} placeholder="Avrial Evans" style={{width:"100%",background:C.dark,border:"1px solid "+(signError?C.error:C.cardBorder),borderRadius:8,padding:"10px 14px",color:C.text,fontSize:14,outline:"none",fontFamily:"inherit"}}/>
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
                    <div style={{color:C.muted,fontSize:13,marginTop:4}}>Avrial Evans — {signatureDate||"Signed"}</div>

                  <div style={{marginTop:20,display:"flex",flexDirection:"column",gap:10}}>
                    <div style={{color:"#4CAF5088",fontSize:12,textAlign:"center",marginBottom:4}}>What would you like to do next?</div>
                    <button onClick={()=>{
                      fetch("/api/signatures").then(r=>r.json()).then(sigs=>{
                        const uid=localStorage.getItem("gtm_current_user")||"";
                        const oSigned=sigs["orientation_"+uid]?.signed||false;
                        const bSigned=sigs["binder_"+uid]?.signed||false;
                        if(!oSigned){window.location.href="/orientation";}
                        else if(!bSigned){window.location.href="/"+uid+"-binder";}
                        else{window.location.href="/";}
                      }).catch(()=>{window.location.href="/";});
                    }} style={{background:C.burgundy,border:"1px solid "+C.gold+"66",borderRadius:10,padding:"12px",color:C.ivory,fontSize:14,fontWeight:800,cursor:"pointer"}}>
                      Continue to Next Required Document →
                    </button>
                    <button onClick={()=>{window.location.href="/";}} style={{background:"transparent",border:"1px solid "+C.cardBorder,borderRadius:10,padding:"12px",color:C.muted,fontSize:13,cursor:"pointer"}}>
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