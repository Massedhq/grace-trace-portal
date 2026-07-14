"use client";
import { useState, useEffect } from "react";

const C = {
  burgundy:"#6B1A2A",burgundyDark:"#4A0E1A",green:"#1E4D2B",gold:"#C9A84C",
  ivory:"#F5F0E8",dark:"#1A0F12",card:"#2A1A1E",cardBorder:"#3D2028",
  text:"#F0EAE2",muted:"#A08878",error:"#EF5350",
};

const SECTIONS = [
  {id:"s1",title:"Organization Overview",content:[
    {type:"para",text:"Travis — First thank you for choosing me to walk this path with you. This was your idea and mine — we thought of it together — and building the foundation of something that will change lives and leave a lasting legacy has been everything. I built it with you in mind from day one. You are a Co-Founder of Grace Trace Ministries and your role in this organization is critical to its success. Read this document carefully. Understand every section. You are not walking in as a guest. You are walking in as the Vice President and Chief Operating Officer of a real organization.\n\n— Avrial Evans, Co-Founder & President"},
    {type:"table",rows:[
      ["Organization Name","Grace Trace Ministries"],
      ["Entity Type","501(c)(3) Nonprofit Corporation — State of Texas"],
      ["EIN","42-2972120"],
      ["Texas SOS File Number","806637680"],
      ["SAM.gov UEI","FR8MBUNRB3J4"],
      ["Formation Date","June 5, 2026"],
      ["Primary Service Area","State of Texas"],
      ["Phase 1 Location","Houston, Texas"],
      ["Virtual Principal Office","539 W Commerce St, Suite 5887, Dallas, TX 75208"],
      ["Mailing Address","5729 Lebanon Rd, Suite 144605, Frisco, TX 75034"],
      ["Registered Agent","2018 Palo Duro Drive, Odessa, TX 79762"],
      ["Website","gracetraceministries.org"],
      ["Email","info@gracetraceministries.org"],
      ["Phone","469-430-7467"],
      ["Primary NAICS Code","623990 — Other Residential Care Facilities"],
      ["Status","SAM.gov ACTIVE — CAGE 21SQ1 — 1023-EZ filed — 501c3 pending"],
    ]},
  ]},
  {id:"s2",title:"The Mission and Why It Matters",content:[
    {type:"alert",text:"TRACING THE PATH OF GRACE WITH NEW BEGINNINGS"},
    {type:"subhead",text:"Our Mission"},
    {type:"para",text:"Grace Trace Ministries provides safe, structured transitional housing and reentry services for returning citizens, veterans, individuals with disabilities, and young adults transitioning to independent living across the State of Texas."},
    {type:"subhead",text:"Why This Mission Matters"},
    {type:"para",text:"Texas has one of the highest incarceration rates in the United States. Every year tens of thousands of individuals are released from Texas and federal prisons with nowhere to go. Without proper housing within the first 72 hours of release the likelihood of reoffending increases dramatically. Veterans returning home face similar challenges. Thousands of Texas veterans experience homelessness every year. The VA has funding specifically designed to address this — and they pay organizations like Grace Trace Ministries directly to house and support these veterans."},
    {type:"para",text:"Grace Trace Ministries sits at the intersection of a massive community need and significant government funding. We provide the housing. The government pays us to do it. The residents rebuild their lives. That is the model. This is not charity work hoping for donations. This is a structured, government-funded operation with a clear business model, real contracts, and a mission that changes lives."},
  ]},
  {id:"s3",title:"Who We Serve",content:[
    {type:"table",rows:[
      ["Population","Program","Phase"],
      ["Returning Citizens — Male","Male Reentry House","Phase 1 — Now"],
      ["Returning Citizens — Female","Female Reentry House","Phase 1 — Now"],
      ["Homeless Veterans","Veterans Transitional Housing","Phase 2"],
      ["Deaf-Blind Individuals","DBMD Residential Care","Phase 3"],
      ["Adults with Disabilities","Disability Group Home","Phase 3"],
      ["Young Adults — Foster Care","Independent Living Program","Phase 3"],
    ]},
    {type:"para",text:"Our residents are people at a crossroads. They are not statistics — they are human beings who deserve a real chance. Every resident signs agreements, submits to drug testing, maintains curfew, seeks employment, saves money, and participates in programming. This is not a shelter — it is a structured program with real expectations and real outcomes."},
  ]},
  {id:"s4",title:"How the Business Works",content:[
    {type:"alert",text:"CONTRACT FIRST — PROPERTY SECOND — DENNIS APPROVES — RESIDENTS MOVE IN — REVENUE STARTS"},
    {type:"subhead",text:"The Core Business Model"},
    {type:"para",text:"Grace Trace Ministries leases properties — we do not own them. We place residents in those properties under structured programs. Government agencies and residents pay us for the housing and services we provide."},
    {type:"subhead",text:"The Startup Sequence"},
    {type:"bullets",items:["Get fully legally set up — nonprofit status, EIN, SAM.gov, bank account","Get approved as a provider with TDCJ, BOP, and VA","Secure referral commitments — know how many residents are coming","Dennis Pride assesses and approves the property","Lease signed — residents move in — revenue starts from day one","Rent and operating costs covered by program fees and per diem","Reinvest surplus into growth and additional facilities"]},
    {type:"para",text:"We never sign a lease on an empty house. Contract first. Property second. Dennis approves. Revenue from day one."},
  ]},
  {id:"s5",title:"How Grace Trace Makes Money",content:[
    {type:"subhead",text:"Revenue Stream 1 — Private Pay Program Fees"},
    {type:"table",rows:[
      ["Fee","Amount"],
      ["Weekly per resident","$200 — $250/week"],
      ["Monthly per resident","$800 — $1,000/month"],
      ["6 residents monthly","$4,800 — $6,000/month"],
    ]},
    {type:"subhead",text:"Revenue Stream 2 — TDCJ Contract"},
    {type:"table",rows:[
      ["Detail","Information"],
      ["Agency","TDCJ CJAD — 512-406-5202"],
      ["Daily rate","$50 — $80 per resident"],
      ["6 residents monthly","$9,000 — $14,400/month"],
    ]},
    {type:"subhead",text:"Revenue Stream 3 — Bureau of Prisons"},
    {type:"table",rows:[
      ["Detail","Information"],
      ["Contact","Kevin Hoff — khoff@bop.gov"],
      ["Daily rate","$85 — $110 per resident"],
      ["6 residents monthly","$15,300 — $19,800/month"],
    ]},
    {type:"subhead",text:"Revenue Stream 4 — VA GPD Per Diem"},
    {type:"table",rows:[
      ["Detail","Information"],
      ["Contact","GPDGrants@va.gov — VA Houston: 713-791-1414"],
      ["Standard rate","$85.37 per veteran per day"],
      ["Specialized rate","$128.38 per veteran per day"],
      ["6 veterans monthly","$15,367/month"],
    ]},
    {type:"subhead",text:"Revenue Stream 5 — Grants & Foundations"},
    {type:"para",text:"Federal, state, and foundation grants to supplement revenue and fund expansion. Key sources: HUD, Texas Veterans Commission, SSVF, DOJ Second Chance Act, private foundations."},
  ]},
  {id:"s6",title:"Financial Projections",content:[
    {type:"subhead",text:"Phase 1 — Private Pay — One House"},
    {type:"table",rows:[
      ["Item","Monthly","Annual"],
      ["Revenue — 6 residents","$5,400","$64,800"],
      ["Total expenses","($4,100)","($49,200)"],
      ["NET","$1,300","$15,600"],
    ]},
    {type:"subhead",text:"Phase 2 — TDCJ Contract — Two Houses"},
    {type:"table",rows:[
      ["Item","Monthly","Annual"],
      ["Revenue — 12 residents","$23,400","$280,800"],
      ["Total expenses","($8,800)","($105,600)"],
      ["NET","$14,600","$175,200"],
    ]},
    {type:"subhead",text:"Phase 3 — Four Houses — Mixed Contracts"},
    {type:"table",rows:[
      ["Item","Monthly","Annual"],
      ["Revenue — 24 residents","$46,800+","$561,600+"],
      ["Total expenses","($17,600)","($211,200)"],
      ["NET","$29,200+","$350,400+"],
    ]},
  ]},
  {id:"s7",title:"The Government Contract Strategy",content:[
    {type:"subhead",text:"Step 1 — Get Fully Set Up"},
    {type:"bullets",items:["Texas SOS — COMPLETE","EIN — COMPLETE","SAM.gov — SUBMITTED","1023-EZ — FILED","Bank account — OPEN"]},
    {type:"subhead",text:"Step 2 — TDCJ First"},
    {type:"para",text:"Call 512-406-5202. Introduce Grace Trace Ministries. Request provider approval. Fastest path to residents and revenue in Texas."},
    {type:"subhead",text:"Step 3 — BOP Second"},
    {type:"para",text:"Contact Kevin Hoff at khoff@bop.gov. Higher per diem rates than TDCJ. Takes longer but the revenue is substantially higher."},
    {type:"subhead",text:"Step 4 — VA GPD Third"},
    {type:"para",text:"VA GPD Per Diem Only notice expected late 2026. Grace Trace must be on Grants.gov and SAM.gov before the notice drops. Gateway to Phase 2 veterans housing."},
  ]},
  {id:"s8",title:"The Growth Plan",content:[
    {type:"table",rows:[
      ["Phase","Goals & Timeline"],
      ["Phase 1 — Now","Complete legal setup. TDCJ provider approval. First reentry house open in Houston. 3-6 residents. Private pay and TDCJ referrals."],
      ["Phase 2 — 6-12 months","Male and female houses open. TDCJ active. BOP application submitted. VA GPD application submitted. 12 residents total."],
      ["Phase 3 — 12-24 months","Veterans housing launched. VA GPD active. 3-4 facilities statewide. Expand to DFW, Austin, San Antonio, Midland/Odessa."],
      ["Phase 4 — 2-3 years","DBMD license. Disability and young adults programs launched. Multiple Texas markets."],
      ["Phase 5 — 3-5 years","10+ facilities. Full government contract portfolio. Recognized statewide provider."],
    ]},
  ]},
  {id:"s9",title:"Legal and Corporate Structure",content:[
    {type:"table",rows:[
      ["Entity","Details"],
      ["Grace Trace Ministries","501(c)(3) Nonprofit — Texas — File No. 806637680"],
      ["EIN","42-2972120"],
      ["SAM.gov UEI","FR8MBUNRB3J4"],
      ["CAGE Code","21SQ1"],
      ["Bank Account","Open and active"],
      ["Future: Satori Holdings LLC","Holding company — asset protection — when funded"],
      ["Future: Corelush Management LLC","Operating company — S-Corp — management fees for founders"],
    ]},
  ]},
  {id:"s10",title:"The Team",content:[
    {type:"subhead",text:"Board of Directors"},
    {type:"table",rows:[
      ["Name","Role"],
      ["Avrial Evans","Co-Founder, President & Board Chair — strategy, finance, government contracts, final decisions"],
      ["Travis Ramar","Co-Founder, VP & COO & Board Member — second in command, operations, compliance, governance"],
      ["Dennis Pride","Board Member & Director of Operations & Facilities — construction contracts, facility management, male resident oversight"],
      ["Erica Evans","Board Member — governance and oversight"],
      ["AuBreyon Woodley","Board Member — governance and oversight"],
      ["Ialana Tippins","Board Member — governance and oversight — Phase 1 Houston location support"],
    ]},
    {type:"subhead",text:"Operational Staff"},
    {type:"table",rows:[
      ["Name","Role"],
      ["Deann Evans","Director of Outreach & Program Development — community relationships, referral pipeline, government outreach"],
      ["Dennis Pride","Director of Operations & Facilities — construction contracts, facility assessment, male resident oversight, project management"],
      ["House Manager — to be hired","Day to day facility operations — resident supervision — logs — drug testing — curfew"],
      ["Case Manager — to be contracted","Individual service plans — employment assistance — benefits navigation"],
    ]},
  ]},
  {id:"s11",title:"Your Role, Responsibilities & Execution Plan",content:[
    {type:"alert",text:"CO-FOUNDER | VICE PRESIDENT | CHIEF OPERATING OFFICER | BOARD MEMBER — When you step in you are the second most powerful person in this organization."},
    {type:"subhead",text:"Your Title and What It Means"},
    {type:"table",rows:[
      ["Title","Description"],
      ["Co-Founder","You helped build this from the ground. This is your organization as much as it is mine."],
      ["Vice President","Second in command. When the President is unavailable you speak for Grace Trace Ministries."],
      ["Chief Operating Officer","Responsible for the operational performance of Grace Trace Ministries. Houses run correctly. Staff perform. Logs complete. Residents compliant. Programs deliver results."],
      ["Board Member","You sit on the Board of Directors. You vote on major decisions. You provide governance oversight."],
    ]},
    {type:"subhead",text:"1. Operations Oversight"},
    {type:"bullets",items:["Oversee day to day performance of all Grace Trace Ministries facilities","Ensure house managers are performing correctly and on time","Review operational logs weekly — sign off on compliance","Monitor resident compliance — curfew, drug testing, employment, program participation","Identify operational problems early and resolve before they escalate","Report operational status to President weekly"]},
    {type:"subhead",text:"2. Working with Dennis Pride"},
    {type:"bullets",items:["Dennis Pride reports to you as VP/COO on all facility and construction matters","Review Dennis's weekly facility reports","Jointly approve property assessments before presenting to President","Coordinate with Dennis on male resident oversight and facility compliance","Support Dennis in contractor disputes or facility emergencies","Together you and Dennis cover everything operational — you run the business side, Dennis runs the physical side"]},
    {type:"subhead",text:"3. Staff Management"},
    {type:"bullets",items:["Directly supervise house managers across all facilities","Conduct house manager performance reviews quarterly","Ensure all staff trained and operating within Grace Trace policies","Assist with hiring decisions for operational staff"]},
    {type:"subhead",text:"4. Government Contract Compliance"},
    {type:"bullets",items:["Ensure all facilities meet TDCJ, BOP, and VA contract standards","Oversee compliance with all contract reporting requirements","Coordinate with Dennis on VA facility inspections","Review and sign off on monthly billing vouchers","Monitor KPIs — occupancy rate, employment rate, successful exits"]},
    {type:"subhead",text:"5. Board Governance"},
    {type:"bullets",items:["Attend all quarterly board meetings","Review financial reports before each board meeting","Vote on major organizational decisions","Provide COO report at each board meeting","Participate in strategic planning with President"]},
    {type:"subhead",text:"Your Weekly Execution Plan"},
    {type:"table",rows:[
      ["Day","Priority Activities"],
      ["Monday","Review weekly priorities — check in with house managers — review Dennis's facility update — identify compliance issues"],
      ["Tuesday","Government contract compliance review — billing preparation — resident status — performance metrics"],
      ["Wednesday","Staff check ins — operational issues — coordinate with Dennis on facility matters — community meetings as needed"],
      ["Thursday","Strategic work — grant research, program development — board preparation as needed"],
      ["Friday","Weekly report to President — review week performance — plan following week"],
    ]},
    {type:"subhead",text:"What You Are NOT Responsible For"},
    {type:"bullets",items:["Final financial decisions — President","Government contract negotiations and signing — President","Grant applications final approval — President","Board appointments — President"]},
  ]},
  {id:"s12",title:"How to Speak About Grace Trace Ministries",content:[
    {type:"subhead",text:"The 30-Second Introduction"},
    {type:"para",text:"\"Grace Trace Ministries is a 501(c)(3) nonprofit organization based in Texas. We provide safe, structured transitional housing and reentry services for returning citizens, homeless veterans, individuals with disabilities, and young adults across the state. We partner with TDCJ, the Bureau of Prisons, and the Department of Veterans Affairs to provide government-contracted housing and wraparound support services. Our model combines structure, accountability, and genuine support to help residents achieve permanent housing and long-term stability.\""},
    {type:"subhead",text:"Key Talking Points — Know These Cold"},
    {type:"bullets",items:["Grace Trace Ministries is a 501(c)(3) nonprofit corporation organized under Texas law","We are registered in SAM.gov and pursuing federal and state contracts","We serve returning citizens, veterans, individuals with disabilities, and young adults","Primary NAICS code 623990 — Other Residential Care Facilities","We operate structured transitional housing programs — not shelters","Residents must follow house rules, pass drug tests, maintain curfew, and seek employment","Programs produce measurable outcomes — employment, permanent housing, reduced recidivism"]},
    {type:"subhead",text:"What You Should NEVER Say"},
    {type:"bullets",items:["Never quote specific contract rates or financial projections to outside parties","Never make commitments to government agencies without President approval","Never discuss organizational finances or internal matters publicly","Never represent yourself as authorized to sign contracts"]},
  ]},
  {id:"s13",title:"What Success Looks Like",content:[
    {type:"table",rows:[
      ["Metric","Target"],
      ["TDCJ provider approval","Within 90 days of full legal setup"],
      ["First facility open","Within 6 months of TDCJ approval"],
      ["Occupancy rate","85% or greater"],
      ["Residents exiting to permanent housing","70% or greater"],
      ["Residents employed at discharge","65% or greater"],
      ["BOP contract application","Within 12 months"],
      ["VA GPD application","When notice drops — estimated late 2026"],
      ["Second facility open","Within 12 months of first"],
    ]},
    {type:"para",text:"In 5 years Grace Trace Ministries should be a recognized statewide provider with multiple facilities, full government contract portfolios, an established grants program, and a professional team delivering life-changing programs across Texas."},
  ]},
  {id:"s14",title:"Immediate Priorities When You Step In",content:[
    {type:"alert",text:"THIS IS YOUR FIRST 90 DAYS"},
    {type:"subhead",text:"Days 1 to 30 — Get Up to Speed"},
    {type:"bullets",items:["Read this entire document — know it completely","Review all Grace Trace documents — bylaws, program plan, house rules, operational logs, Dennis's binder, Deann's binder","Meet with President — full briefing on current status and priorities","Review SAM.gov and government contract status","Review financials — bank account, revenue, expenses","Connect with Deann Evans — understand outreach pipeline","Connect with Dennis Pride — understand facility status and any active projects","Visit Houston — understand Phase 1 situation firsthand"]},
    {type:"subhead",text:"Days 31 to 60 — Get Active"},
    {type:"bullets",items:["Begin attending weekly meetings with President","Take ownership of house manager supervision once first facility operational","Begin building your own government relationships — TDCJ, BOP, VA contacts","Review operational logs and compliance weekly","Submit first COO weekly report to President","Participate in first board meeting as official board member"]},
    {type:"subhead",text:"Days 61 to 90 — Full Execution"},
    {type:"bullets",items:["Operating as full VP and COO — all responsibilities active","First quarterly review with President","Government relationship development — in person meetings","Operations running smoothly — no compliance gaps","Begin strategic input on Phase 2 — veterans housing"]},
    {type:"para",text:"Travis — you are not walking into startup chaos. You are walking into a structured organization with documented policies, completed legal formation, submitted government registrations, a bank account, an active outreach director, Dennis handling facilities, and a clear strategic plan. The foundation has been built. Your job is to help operate it, grow it, and make sure it delivers on the mission every single day. Welcome to Grace Trace Ministries. Now let us get to work.\n\n— Avrial Evans, Co-Founder & President"},
    {type:"signature"},
  ]},
];

function Block({block}){
  if(block.type==="para")return<p style={{color:C.text,fontSize:14,lineHeight:1.8,margin:"0 0 12px",whiteSpace:"pre-line"}}>{block.text}</p>;
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

export default function TravisBinder(){
  const[activeSection,setActiveSection]=useState("s1");
  const[signatureName,setSignatureName]=useState("");
  const[signatureDate,setSignatureDate]=useState("");
  const[signError,setSignError]=useState("");
  const[signed,setSigned]=useState(false);
  const[loading,setLoading]=useState(true);
  const[authorized,setAuthorized]=useState(false);

  useEffect(()=>{
    try{
      const uid2=localStorage.getItem("gtm_current_user");
      const allowed = ["travis","avy","travis"];
      if(uid2&&allowed.includes(uid2)){
        setAuthorized(true);
        // Always check API first — never rely on localStorage alone
        fetch("/api/signatures")
          .then(function(r){return r.json();})
          .then(function(sigs){
            if(sigs["binder_travis"]&&sigs["binder_travis"].signed){
              setSigned(true);
            } else {
              // Fallback to localStorage
              try{
                const s=localStorage.getItem("gtm_orientation_travis");
                if(s){const p=JSON.parse(s);if(p.signed)setSigned(true);}
              }catch(e){}
            }
          })
          .catch(function(){
            // Offline fallback
            try{
              const s=localStorage.getItem("gtm_orientation_travis");
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
    try{localStorage.setItem("gtm_orientation_travis",JSON.stringify(sigData));}catch(e){}
    fetch("/api/signatures",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({userId:"binder_travis",data:sigData})}).catch(()=>{});
    setSigned(true);
    fetch("/api/signatures",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({userId:"orientation_travis",data:sigData})}).catch(function(){});
    fetch("/api/signatures",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({userId:"travis",data:sigData})}).catch(function(){});
  }

  if(loading)return<div style={{minHeight:"100vh",background:C.dark,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Inter','Segoe UI',sans-serif"}}><div style={{color:C.muted}}>Loading...</div></div>;
  if(!authorized)return<div style={{minHeight:"100vh",background:C.dark,display:"flex",alignItems:"center",justifyContent:"center",padding:20,fontFamily:"'Inter','Segoe UI',sans-serif"}}><div style={{textAlign:"center"}}><div style={{color:C.ivory,fontSize:16,fontWeight:700,marginBottom:12}}>Access restricted — log in to the Staff Portal first</div><a href="/" style={{background:C.burgundy,border:"1px solid "+C.gold+"66",borderRadius:8,padding:"11px 24px",color:C.ivory,fontSize:14,fontWeight:800,textDecoration:"none"}}>Go to Staff Portal</a></div></div>;

  const current=SECTIONS.find(s=>s.id===activeSection);
  const idx=SECTIONS.findIndex(s=>s.id===activeSection);

  return(
    <div style={{minHeight:"100vh",background:C.dark,fontFamily:"'Inter','Segoe UI',sans-serif",display:"flex",flexDirection:"column"}}>
      <div style={{background:"linear-gradient(135deg,"+C.burgundyDark+" 0%,"+C.dark+" 70%)",borderBottom:"2px solid "+C.gold,padding:"14px 20px",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:10}}>
        <div>
          <div style={{color:C.gold,fontSize:10,fontWeight:800,letterSpacing:3,textTransform:"uppercase"}}>Co-Founder Business Brief</div>
          <div style={{color:C.ivory,fontWeight:900,fontSize:16}}>Travis Ramar</div>
          <div style={{color:C.muted,fontSize:12}}>Vice President | Chief Operating Officer | Board Member</div>
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
                    <div style={{color:C.muted,fontSize:13,marginBottom:16}}>By signing below you confirm you have read and understood this entire brief and agree to fulfill all responsibilities of your role as Co-Founder, VP & COO.</div>
                    <div style={{marginBottom:14}}>
                      <div style={{color:C.text,fontSize:13,fontWeight:600,marginBottom:6}}>Type your full name: <span style={{color:C.gold}}>(Travis Ramar)</span></div>
                      <input type="text" value={signatureName} onChange={e=>{setSignatureName(e.target.value);setSignError("");}} placeholder="Travis Ramar" style={{width:"100%",background:C.dark,border:"1px solid "+(signError?C.error:C.cardBorder),borderRadius:8,padding:"10px 14px",color:C.text,fontSize:14,outline:"none",fontFamily:"inherit"}}/>
                    </div>
                    <div style={{marginBottom:14}}>
                      <div style={{color:C.text,fontSize:13,fontWeight:600,marginBottom:6}}>Date</div>
                      <input type="text" value={signatureDate} onChange={e=>{setSignatureDate(e.target.value);setSignError("");}} placeholder="e.g. July 8, 2026" style={{width:"100%",background:C.dark,border:"1px solid "+(signError?C.error:C.cardBorder),borderRadius:8,padding:"10px 14px",color:C.text,fontSize:14,outline:"none",fontFamily:"inherit"}}/>
                    </div>
                    {signError&&<div style={{color:C.error,fontSize:13,marginBottom:10}}>{signError}</div>}
                    <button onClick={submitSignature} style={{width:"100%",background:C.green,border:"none",borderRadius:10,padding:"13px",color:C.ivory,fontSize:14,fontWeight:800,cursor:"pointer"}}>I Have Read and Understood This Brief — Sign and Submit</button>
                  </div>
                ):(
                  <div style={{background:"#4CAF5022",border:"1px solid #4CAF5044",borderRadius:12,padding:"24px",textAlign:"center"}}>
                    <div style={{fontSize:32,marginBottom:8}}>✓</div>
                    <div style={{color:"#4CAF50",fontWeight:800,fontSize:16}}>Brief Signed and Acknowledged</div>
                    <div style={{color:C.muted,fontSize:13,marginTop:4}}>Travis Ramar — {signatureDate||"Signed"}</div>

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