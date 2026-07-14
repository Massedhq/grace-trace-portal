"use client";
import { useState, useEffect } from "react";

const C = {
  burgundy: "#6B1A2A", burgundyDark: "#4A0E1A", green: "#1E4D2B", gold: "#C9A84C",
  ivory: "#F5F0E8", dark: "#1A0F12", card: "#2A1A1E", cardBorder: "#3D2028",
  text: "#F0EAE2", muted: "#A08878", error: "#EF5350",
};

const SECTIONS = [
  { id:"s1", title:"Position Overview & Purpose", content:[
    {type:"table",rows:[
      ["Position Title","Director of Outreach & Program Development"],
      ["Employee Name","Deann Evans"],
      ["Organization","Grace Trace Ministries"],
      ["Reports To","Avrial Evans — President & Founder"],
      ["Position Type","Part time — remote with required in person meetings and outreach activities"],
      ["Location","Odessa, Texas — statewide outreach as assigned"],
      ["Department Purpose","To build and maintain relationships with government agencies, community partners, referral sources, and the public that result in residents being placed in Grace Trace Ministries programs"],
      ["Effective Date","June 2026"],
    ]},
    {type:"para",text:"The Director of Outreach & Program Development is the face of Grace Trace Ministries in the community. This position is responsible for building the referral pipeline that fills our beds, securing community partnerships, and developing program awareness across Texas. Every relationship built in this role directly supports the mission of Grace Trace Ministries and the lives of the residents we serve."},
  ]},
  { id:"s2", title:"Job Description", content:[
    {type:"subhead",text:"Position Summary"},
    {type:"para",text:"The Director of Outreach & Program Development is responsible for developing, managing, and executing all outreach activities for Grace Trace Ministries. This position builds and maintains relationships with government agencies, parole and probation offices, courts, veteran service organizations, community nonprofits, faith based organizations, and the general public to create a consistent and reliable referral pipeline for all Grace Trace Ministries programs."},
    {type:"subhead",text:"Primary Purpose"},
    {type:"bullets",items:["Generate referrals that fill Grace Trace Ministries residential programs","Build and maintain relationships with TDCJ, BOP, VA, parole offices, and courts","Represent Grace Trace Ministries professionally in all community settings","Develop and execute outreach strategies that expand program awareness across Texas","Support program development by identifying community needs and funding opportunities","Document all outreach activities and report results to the President"]},
    {type:"subhead",text:"Qualifications"},
    {type:"bullets",items:["Strong verbal and written communication skills","Ability to build and maintain professional relationships","Organized and self directed — able to work remotely with minimal supervision","Reliable transportation for in person outreach activities","Proficiency with email, phone, and basic computer applications","Knowledge of or willingness to learn the reentry, veterans, and disability housing landscape in Texas","Commitment to the mission and values of Grace Trace Ministries"]},
  ]},
  { id:"s3", title:"Duties & Responsibilities", content:[
    {type:"subhead",text:"1. Outreach & Relationship Building"},
    {type:"bullets",items:["Conduct regular outreach to parole and probation offices in assigned Texas regions","Build relationships with TDCJ Community Supervision officers and administrators","Contact Bureau of Prisons case managers and residential reentry coordinators","Visit VA Medical Centers and connect with Homeless Veterans Coordinators","Attend community reentry meetings, task forces, and coalitions","Distribute Grace Trace Ministries materials — flyers, brochures, program information packets","Follow up with all contacts within 48 hours of initial contact","Maintain active relationships with at least 20 referral sources at all times"]},
    {type:"subhead",text:"2. Program Development Support"},
    {type:"bullets",items:["Research and identify new program opportunities and funding sources","Attend grant information sessions, workshops, and training relevant to Grace Trace programs","Identify gaps in community services that Grace Trace Ministries can fill","Provide written reports to the President on program development opportunities","Assist with development of program materials, presentations, and proposals"]},
    {type:"subhead",text:"3. Community Partnerships"},
    {type:"bullets",items:["Identify and establish formal referral agreements with community organizations","Build relationships with workforce development agencies — Workforce Solutions Texas","Connect with faith based organizations for volunteer and donation partnerships","Establish relationships with legal aid organizations for resident support","Build relationships with behavioral health and substance abuse treatment providers","Connect with local employers willing to hire Grace Trace Ministries program graduates"]},
    {type:"subhead",text:"4. Marketing & Awareness"},
    {type:"bullets",items:["Represent Grace Trace Ministries at community events, fairs, and conferences","Distribute program information at courthouses, jails, halfway houses, and community centers","Assist with social media content related to outreach activities when directed","Collect testimonials and success stories for marketing use with resident permission"]},
    {type:"subhead",text:"5. Documentation & Reporting"},
    {type:"bullets",items:["Complete all required logs and reports on time — no exceptions","Submit weekly outreach report to President every Friday by 5:00 PM","Maintain organized contact database of all referral sources and partners","Document all phone calls, visits, emails, and meetings in the outreach log","Track referrals received — source, date, outcome","Maintain confidentiality of all resident and organizational information"]},
  ]},
  { id:"s4", title:"Daily Work Schedule", content:[
    {type:"table",rows:[
      ["Time","Activity","Notes"],
      ["8:00 AM","Start of day — check email and messages","Respond to all messages within 2 hours"],
      ["8:30 AM","Review daily outreach plan and priorities","Reference weekly work plan"],
      ["9:00 AM","Phone outreach — calls to referral sources","Minimum 5 calls per day"],
      ["10:00 AM","Email outreach and follow ups","Follow up on all pending contacts"],
      ["11:00 AM","In person visits — parole offices, agencies","As scheduled — 2-3 times per week"],
      ["12:00 PM","Lunch — 30 minutes",""],
      ["12:30 PM","Update outreach log with morning activities","Must be updated same day"],
      ["1:00 PM","Program development research and documentation","Grant research, partnership development"],
      ["2:00 PM","Phone calls and follow ups","Afternoon outreach calls"],
      ["3:00 PM","Community meetings or events as scheduled","Attend minimum 1 community meeting per week"],
      ["4:00 PM","Administrative tasks — reports, database updates","Keep contact database current"],
      ["4:30 PM","End of day report to President — brief text or email","Daily check in required"],
      ["5:00 PM","End of work day",""],
    ]},
  ]},
  { id:"s5", title:"Weekly Work Plan", content:[
    {type:"table",rows:[
      ["Day","Priority Activities"],
      ["Monday","Weekly planning — review goals — email outreach — update contact database — minimum 5 outreach calls"],
      ["Tuesday","In person outreach visits — parole offices or community agencies — minimum 2 in person visits"],
      ["Wednesday","Phone outreach — follow up on all pending contacts — attend community meeting if scheduled"],
      ["Thursday","In person outreach or agency visits — program development research — partnership development"],
      ["Friday","Complete weekly outreach report — submit to President by 5:00 PM — plan next week priorities — end of week log update"],
    ]},
    {type:"subhead",text:"Weekly Minimum Standards"},
    {type:"table",rows:[
      ["Activity","Weekly Minimum"],
      ["Outreach phone calls","25 calls minimum"],
      ["Outreach emails sent","15 emails minimum"],
      ["In person visits","2 visits minimum"],
      ["New contacts added to database","5 new contacts minimum"],
      ["Community meetings attended","1 meeting minimum"],
      ["Weekly report submitted to President","Every Friday by 5:00 PM"],
      ["Daily check in with President","Every work day"],
      ["Outreach log updated","Daily — same day as activity"],
    ]},
  ]},
  { id:"s6", title:"Monthly Goals & Targets", content:[
    {type:"table",rows:[
      ["Goal","Monthly Target"],
      ["Active referral relationships maintained","20 or more"],
      ["New referral sources contacted","10 or more"],
      ["Formal referral agreements initiated","2 or more"],
      ["Referrals received for program placement","5 or more"],
      ["Community events attended","2 or more"],
      ["Program information packets distributed","50 or more"],
      ["Grant or funding opportunities identified","2 or more — reported to President"],
      ["Monthly outreach report submitted","By 5th of following month"],
      ["Contact database updated and accurate","100% current at all times"],
    ]},
  ]},
  { id:"s7", title:"Outreach Standards & Protocols", content:[
    {type:"alert",text:"YOU REPRESENT GRACE TRACE MINISTRIES AT ALL TIMES — Professional conduct, appearance, and communication are required in all settings."},
    {type:"bullets",items:["Always introduce yourself as the Director of Outreach & Program Development for Grace Trace Ministries","Dress professionally for all in person outreach visits — business casual minimum","Arrive on time or early for all scheduled meetings and appointments","Always carry Grace Trace Ministries materials — program flyers, business cards, information packets","Never make promises or commitments to referral sources without President approval","Never discuss confidential resident information with outside parties","Always follow up within 48 hours of any contact or meeting"]},
    {type:"subhead",text:"Phone Outreach Protocol"},
    {type:"bullets",items:["Introduce yourself — name, title, and Grace Trace Ministries","State the purpose of the call clearly and briefly","Ask for the appropriate point of contact if needed","Leave a professional voicemail if no answer — include name, organization, and call back number","Document the call in the outreach log same day","Follow up by email within 24 hours of the call","Call back if no response within 5 business days"]},
    {type:"subhead",text:"In Person Visit Protocol"},
    {type:"bullets",items:["Schedule appointment in advance whenever possible","Confirm appointment 24 hours before","Arrive 10 minutes early","Bring program information packets and business cards","Present Grace Trace Ministries programs professionally and clearly","Leave materials with all relevant staff","Get contact information for follow up","Document visit in outreach log same day","Send thank you email within 24 hours"]},
    {type:"subhead",text:"Email Outreach Protocol"},
    {type:"bullets",items:["Use info@gracetraceministries.org for all outreach emails","Use a professional subject line that clearly identifies Grace Trace Ministries","Keep emails concise — 3 to 5 sentences maximum for initial contact","Always include your name, title, phone number, and website in your signature","Respond to all incoming emails within 24 hours — 2 hours for urgent matters","Document all outreach emails in the outreach log"]},
  ]},
  { id:"s8", title:"Meeting Requirements", content:[
    {type:"table",rows:[
      ["Meeting Type","Frequency / Details"],
      ["Daily check in with President","Every work day — text or email — brief update on activities and priorities"],
      ["Weekly one on one with President","Every Monday — 30 minutes — by phone or video — review weekly plan and priorities"],
      ["Monthly review meeting with President","First week of each month — 1 hour — by phone or video — review monthly report and set goals"],
      ["Quarterly in person meeting","Once per quarter — in person — full review of outreach performance, goals, and strategy"],
      ["Board meetings","Quarterly — attend when requested by President — provide outreach update to board"],
      ["Community meetings","Minimum 1 per week — reentry coalitions, task forces, partner agency meetings"],
      ["Annual performance review","Once per year — in person — with President — full evaluation of performance and goals"],
    ]},
    {type:"subhead",text:"Quarterly In Person Meeting — MANDATORY"},
    {type:"bullets",items:["Review of previous quarter outreach log and activity report","Review of referrals received and placement outcomes","Review of community partnerships established or maintained","Performance metrics review — actual vs targets","Challenges and barriers discussion","Strategy and priorities for upcoming quarter","Training or development needs"]},
  ]},
  { id:"s9", title:"Reporting Requirements", content:[
    {type:"subhead",text:"Daily Report"},
    {type:"bullets",items:["Brief daily check in required every work day — text or email to President","Activities completed that day","Any new contacts or referrals received","Any issues or challenges","Plan for the next day"]},
    {type:"subhead",text:"Weekly Outreach Report — Due Every Friday by 5:00 PM"},
    {type:"bullets",items:["Total outreach calls made","Total outreach emails sent","In person visits completed — agency name, contact, outcome","New contacts added to database","Referrals received — source and outcome","Community meetings attended","Partnerships initiated or advanced","Challenges or barriers encountered","Plan for following week"]},
    {type:"subhead",text:"Monthly Outreach Report — Due by 5th of Following Month"},
    {type:"bullets",items:["Summary of all outreach activity for the month","Total contacts made — calls, emails, visits","New referral sources added","Referrals received and outcomes","Partnerships established or advanced","Community meetings and events attended","Performance metrics — actual vs monthly targets","Grant or funding opportunities identified","Goals and priorities for next month"]},
  ]},
  { id:"s10", title:"Input & Output Requirements", content:[
    {type:"subhead",text:"Inputs — What You Receive"},
    {type:"table",rows:[
      ["Input","Source / Purpose"],
      ["Program information and materials","From President — use for all outreach activities"],
      ["Weekly priorities and direction","From President — Monday meeting and as needed"],
      ["Approved outreach targets and contacts","From President — who to contact and when"],
      ["Program updates and changes","From President — communicate to referral sources as directed"],
      ["Budget for outreach activities","From President — mileage, printing, materials"],
      ["Referral intake process and criteria","From President — communicate to referral sources"],
      ["Feedback on referrals placed","From President — use to improve outreach strategy"],
    ]},
    {type:"subhead",text:"Outputs — What You Produce"},
    {type:"table",rows:[
      ["Output","Frequency / Recipient"],
      ["Daily check in report","Every work day — President"],
      ["Weekly outreach report","Every Friday by 5:00 PM — President"],
      ["Monthly outreach report","By 5th of following month — President"],
      ["Updated contact database","Continuously — maintained and current at all times"],
      ["Completed outreach logs","Daily — filed in department binder"],
      ["Referral source agreements","As established — filed with President"],
      ["Community meeting notes","After each meeting — filed in department binder"],
      ["New program opportunity reports","As identified — submitted to President"],
    ]},
  ]},
  { id:"s11", title:"Required Logs & Documentation", content:[
    {type:"subhead",text:"Log 1 — Daily Outreach Activity Log"},
    {type:"table",rows:[
      ["Date","Contact Name","Organization","Phone/Email","Type","Purpose","Outcome/Next Step","Follow Up Date"],
      ["","","","","","","",""],["","","","","","","",""],["","","","","","","",""],
    ]},
    {type:"subhead",text:"Log 2 — Referral Tracking Log"},
    {type:"table",rows:[
      ["Date Received","Referral Source","Referred Individual","Program Type","Status","Placement Date","Notes"],
      ["","","","","","",""],["","","","","","",""],["","","","","","",""],
    ]},
    {type:"subhead",text:"Log 3 — Partner & Referral Source Database"},
    {type:"table",rows:[
      ["Organization","Contact Name","Title","Phone","Email","Type","Date Added","Last Contact"],
      ["","","","","","","",""],["","","","","","","",""],["","","","","","","",""],
    ]},
    {type:"subhead",text:"Log 4 — Community Meeting Log"},
    {type:"table",rows:[
      ["Date","Meeting Name / Organization","Location","Contacts Made","Key Info Learned","Action Items","Follow Up"],
      ["","","","","","",""],["","","","","","",""],["","","","","","",""],
    ]},
    {type:"subhead",text:"Log 5 — Materials Distribution Log"},
    {type:"table",rows:[
      ["Date","Location / Agency","Materials Distributed","Quantity","Contact Name","Notes"],
      ["","","","","",""],["","","","","",""],["","","","","",""],
    ]},
  ]},
  { id:"s12", title:"Key Contacts & Relationships", content:[
    {type:"subhead",text:"Internal Contacts"},
    {type:"table",rows:[
      ["Name / Role","Contact Information"],
      ["Avrial Evans — President & Founder","info@gracetraceministries.org — Primary supervisor — all questions and decisions go through President"],
      ["Grace Trace Ministries General","info@gracetraceministries.org — gracetraceministries.org"],
    ]},
    {type:"subhead",text:"Priority External Contacts to Establish"},
    {type:"table",rows:[
      ["Agency / Organization","Purpose"],
      ["TDCJ — Community Justice Assistance Division","512-406-5202 — Reentry housing referrals and provider approval"],
      ["Bureau of Prisons — Residential Reentry","Kevin Hoff — khoff@bop.gov — 202-598-6164 — Federal reentry contracts"],
      ["VA Houston — Michael E. DeBakey","713-791-1414 — Homeless Veterans Coordinator — veteran housing referrals"],
      ["Texas Veterans Commission Houston","713-558-4000 — Veteran services and funding"],
      ["Workforce Solutions Texas","Local offices — employment referrals for residents"],
      ["Local Parole Offices — Houston","To be identified — primary referral source for reentry program"],
      ["Local Courts — Houston","To be identified — court ordered housing placements"],
    ]},
  ]},
  { id:"s13", title:"Rules & Standards of Conduct", content:[
    {type:"alert",text:"VIOLATION OF THESE RULES MAY RESULT IN IMMEDIATE TERMINATION"},
    {type:"bullets",items:["Sharing confidential resident or organizational information with unauthorized parties","Making financial commitments or agreements on behalf of Grace Trace Ministries without President approval","Misrepresenting Grace Trace Ministries programs or services to referral sources or the public","Falsifying outreach logs, reports, or activity records","Conduct unbecoming of a Grace Trace Ministries representative in any setting","Failure to maintain confidentiality of organizational strategy and operations"]},
    {type:"subhead",text:"Professional Standards"},
    {type:"bullets",items:["Maintain professional appearance and conduct at all times when representing Grace Trace Ministries","Respond to all communications from the President within 2 hours during work hours","Submit all reports on time — late reports are not acceptable without prior notice and approval","Complete all logs same day — never backfill logs after the fact","Never use Grace Trace Ministries name, logo, or resources for personal benefit","Disclose any conflict of interest to the President immediately","Use info@gracetraceministries.org for all official outreach communications","Do not use personal email for Grace Trace Ministries outreach"]},
  ]},
  { id:"s14", title:"Performance Metrics", content:[
    {type:"table",rows:[
      ["Metric","Target","Frequency"],
      ["Weekly outreach calls made","25 per week minimum","Weekly"],
      ["Weekly outreach emails sent","15 per week minimum","Weekly"],
      ["In person visits completed","2 per week minimum","Weekly"],
      ["New referral sources added monthly","10 per month minimum","Monthly"],
      ["Active referral relationships maintained","20 at all times","Monthly"],
      ["Monthly referrals received","5 per month target","Monthly"],
      ["Reports submitted on time","100% on time — no exceptions","Monthly"],
      ["Logs completed same day","100% compliance","Weekly"],
      ["Formal referral agreements initiated","2 per month minimum","Monthly"],
      ["Community meetings attended","1 per week minimum","Weekly"],
      ["Response time to President","Within 2 hours during work hours","Ongoing"],
      ["Contact database accuracy","100% current and accurate","Monthly"],
    ]},
  ]},
  { id:"s15", title:"Acknowledgment & Signature", content:[
    {type:"para",text:"I, Deann Evans, acknowledge that I have received, read, and understand the contents of this Department Operations Binder for the position of Director of Outreach & Program Development at Grace Trace Ministries. I understand and agree to perform all duties and responsibilities as described in this binder, meet all reporting requirements and deadlines, maintain all required logs and documentation, uphold all professional standards and rules of conduct, protect the confidentiality of Grace Trace Ministries and its residents, and attend all required meetings including quarterly in person meetings. This binder is the property of Grace Trace Ministries and must be returned upon separation from this position."},
    {type:"signature"},
  ]},
];

function Block({ block }) {
  if (block.type==="para") return <p style={{color:C.text,fontSize:14,lineHeight:1.8,margin:"0 0 12px"}}>{block.text}</p>;
  if (block.type==="subhead") return <div style={{color:C.gold,fontSize:13,fontWeight:800,textTransform:"uppercase",letterSpacing:1,margin:"18px 0 8px",borderLeft:"3px solid "+C.gold,paddingLeft:10}}>{block.text}</div>;
  if (block.type==="alert") return <div style={{background:C.burgundy+"33",border:"1px solid "+C.burgundy,borderRadius:8,padding:"12px 16px",color:C.ivory,fontSize:13,fontWeight:700,margin:"12px 0"}}>{block.text}</div>;
  if (block.type==="bullets") return <ul style={{margin:"0 0 12px",paddingLeft:20}}>{block.items.map((item,i)=><li key={i} style={{color:C.text,fontSize:14,lineHeight:1.8,marginBottom:4}}>{item}</li>)}</ul>;
  if (block.type==="table") return (
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

export default function DeannBinder() {
  const [activeSection,setActiveSection]=useState("s1");
  const [signatureName,setSignatureName]=useState("");
  const [signatureDate,setSignatureDate]=useState("");
  const [signError,setSignError]=useState("");
  const [signed,setSigned]=useState(false);
  const [loading,setLoading]=useState(true);
  const [authorized,setAuthorized]=useState(false);

  useEffect(()=>{
    try{
      const uid2=localStorage.getItem("gtm_current_user");
      const allowed = ["deann","avy","travis"];
      if(uid2&&allowed.includes(uid2)){
        setAuthorized(true);
        // Always check API first — never rely on localStorage alone
        fetch("/api/signatures")
          .then(function(r){return r.json();})
          .then(function(sigs){
            if(sigs["binder_deann"]&&sigs["binder_deann"].signed){
              setSigned(true);
            } else {
              // Fallback to localStorage
              try{
                const s=localStorage.getItem("gtm_orientation_deann");
                if(s){const p=JSON.parse(s);if(p.signed)setSigned(true);}
              }catch(e){}
            }
          })
          .catch(function(){
            // Offline fallback
            try{
              const s=localStorage.getItem("gtm_orientation_deann");
              if(s){const p=JSON.parse(s);if(p.signed)setSigned(true);}
            }catch(e){}
          });
      }
    }catch(e){}
    setLoading(false);
  },[]);

  function submitSignature(){
    if(!signatureName.trim()){setSignError("Please type your full name to sign.");return;}
    if(!signatureDate.trim()){setSignError("Please enter today's date.");return;}
    const sigData = {signed:true,name:signatureName,date:signatureDate};
    try{localStorage.setItem("gtm_orientation_deann",JSON.stringify(sigData));}catch(e){}
    fetch("/api/signatures",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({userId:"binder_deann",data:sigData})}).catch(()=>{});
    setSigned(true);
    fetch("/api/signatures",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({userId:"orientation_deann",data:sigData})}).catch(function(){});
    fetch("/api/signatures",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({userId:"deann",data:sigData})}).catch(function(){});
  }

  if(loading) return <div style={{minHeight:"100vh",background:C.dark,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Inter','Segoe UI',sans-serif"}}><div style={{color:C.muted}}>Loading...</div></div>;
  if(!authorized) return <div style={{minHeight:"100vh",background:C.dark,display:"flex",alignItems:"center",justifyContent:"center",padding:20,fontFamily:"'Inter','Segoe UI',sans-serif"}}><div style={{textAlign:"center"}}><div style={{color:C.ivory,fontSize:16,fontWeight:700,marginBottom:12}}>Access restricted — log in to the Staff Portal first</div><a href="/" style={{background:C.burgundy,border:"1px solid "+C.gold+"66",borderRadius:8,padding:"11px 24px",color:C.ivory,fontSize:14,fontWeight:800,textDecoration:"none"}}>Go to Staff Portal</a></div></div>;

  const current=SECTIONS.find(s=>s.id===activeSection);
  const idx=SECTIONS.findIndex(s=>s.id===activeSection);

  return (
    <div style={{minHeight:"100vh",background:C.dark,fontFamily:"'Inter','Segoe UI',sans-serif",display:"flex",flexDirection:"column"}}>
      <div style={{background:"linear-gradient(135deg,"+C.burgundyDark+" 0%,"+C.dark+" 70%)",borderBottom:"2px solid "+C.gold,padding:"14px 20px",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:10}}>
        <div>
          <div style={{color:C.gold,fontSize:10,fontWeight:800,letterSpacing:3,textTransform:"uppercase"}}>Department Operations Binder</div>
          <div style={{color:C.ivory,fontWeight:900,fontSize:16}}>Deann Evans</div>
          <div style={{color:C.muted,fontSize:12}}>Director of Outreach & Program Development</div>
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
            if(block.type==="signature") return (
              <div key={i}>
                {!signed?(
                  <div style={{background:C.card,border:"1px solid "+C.gold+"66",borderRadius:12,padding:"20px"}}>
                    <div style={{color:C.muted,fontSize:13,marginBottom:16}}>By signing below you confirm you have read and understood this entire binder and agree to fulfill all responsibilities of your role.</div>
                    <div style={{marginBottom:14}}>
                      <div style={{color:C.text,fontSize:13,fontWeight:600,marginBottom:6}}>Type your full name: <span style={{color:C.gold}}>(Deann Evans)</span></div>
                      <input type="text" value={signatureName} onChange={e=>{setSignatureName(e.target.value);setSignError("");}} placeholder="Deann Evans" style={{width:"100%",background:C.dark,border:"1px solid "+(signError?C.error:C.cardBorder),borderRadius:8,padding:"10px 14px",color:C.text,fontSize:14,outline:"none",fontFamily:"inherit"}}/>
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
                    <div style={{color:C.muted,fontSize:13,marginTop:4}}>Deann Evans — {signatureDate||"Signed"}</div>

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
            return <Block key={i} block={block}/>;
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