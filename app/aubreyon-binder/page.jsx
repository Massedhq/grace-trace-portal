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
      ["Position Title","Director of Communication — DBMD Programs"],
      ["Employee Name","AuBreyon (Kisses) Woodley"],
      ["Organization","Grace Trace Ministries"],
      ["Reports To","Avrial Evans — President & Founder"],
      ["Position Type","Part time — remote with required in person meetings and events"],
      ["Department Purpose","To manage all internal and external communications for Grace Trace Ministries and to develop and oversee programming related to Deaf-Blind Multiple Disability services"],
      ["Effective Date","June 2026"],
    ]},
    {type:"para",text:"The Director of Communication — DBMD Programs is responsible for how Grace Trace Ministries presents itself to the world and how it communicates internally with its team. This position manages all social media, public relations, internal communications, and community outreach messaging. In addition, this role leads the development of Grace Trace Ministries' Deaf-Blind Multiple Disability program — a future service line that will expand the organization's reach to individuals with complex disabilities."},
  ]},
  {id:"s2",title:"Job Description",content:[
    {type:"subhead",text:"Position Summary"},
    {type:"para",text:"The Director of Communication — DBMD Programs manages all communication channels for Grace Trace Ministries including social media, community outreach messaging, internal staff communications, and public relations. This position also leads the research and development of the organization's planned DBMD residential care program."},
    {type:"subhead",text:"Primary Purpose"},
    {type:"bullets",items:["Manage all Grace Trace Ministries social media platforms and digital presence","Develop and execute communication strategies that grow program awareness","Create and distribute internal communications to staff as directed by President","Build and maintain the Grace Trace Ministries brand voice across all channels","Lead research and development for the DBMD residential care program","Represent Grace Trace Ministries professionally in all community settings","Support outreach efforts with marketing materials and messaging"]},
    {type:"subhead",text:"Qualifications"},
    {type:"bullets",items:["Strong written and verbal communication skills","Experience with social media management and content creation","Ability to maintain a consistent and professional brand voice","Knowledge of or willingness to learn about DBMD services and disability housing","Organized and self-directed — able to work remotely with minimal supervision","Commitment to the mission and values of Grace Trace Ministries"]},
  ]},
  {id:"s3",title:"Duties & Responsibilities",content:[
    {type:"subhead",text:"1. Social Media Management"},
    {type:"bullets",items:["Manage all Grace Trace Ministries social media accounts — Facebook, Instagram, LinkedIn, and others as assigned","Create and post content minimum 3 times per week across all platforms","Develop a monthly content calendar and submit to President for approval by the 25th of each month","Respond to all comments and messages within 24 hours — professional tone at all times","Monitor social media analytics and report monthly performance to President","Never post anything related to Grace Trace Ministries without President approval","Maintain brand consistency — colors, fonts, tone, and messaging across all platforms"]},
    {type:"subhead",text:"2. External Communications"},
    {type:"bullets",items:["Draft all press releases, announcements, and public statements for President review and approval","Develop program flyers, brochures, and marketing materials as directed","Maintain the Grace Trace Ministries email newsletter — monthly minimum","Build media relationships with local news outlets and community organizations","Coordinate all public events and community presence activities","Respond to media inquiries — immediately notify President of any media contact"]},
    {type:"subhead",text:"3. Internal Communications"},
    {type:"bullets",items:["Draft internal announcements, memos, and staff communications as directed by President","Maintain staff communication templates and organizational documents","Coordinate meeting announcements and follow-up communications","Assist with onboarding communications for new staff","Maintain the Grace Trace Ministries document library and communication archives"]},
    {type:"subhead",text:"4. DBMD Program Development"},
    {type:"bullets",items:["Research Texas DBMD licensing requirements and program standards","Study HHS DBMD waiver program requirements and provider qualifications","Identify potential DBMD residents and referral sources in Texas","Research staffing requirements for DBMD residential care","Develop a written DBMD Program Development Plan — submit to President quarterly","Build relationships with Deaf-Blind community organizations and advocacy groups","Identify funding sources specifically for DBMD programs — grants, Medicaid waiver, HHS contracts","Report all DBMD research and development progress to President monthly"]},
    {type:"subhead",text:"5. Brand & Marketing"},
    {type:"bullets",items:["Maintain and protect the Grace Trace Ministries brand identity","Ensure all materials use approved colors, fonts, and logos","Create graphics and visual content for digital and print use","Develop and maintain the Grace Trace Ministries style guide","Photography and video documentation of events and programs with permission"]},
  ]},
  {id:"s4",title:"Daily Work Schedule",content:[
    {type:"table",rows:[
      ["Time","Activity","Notes"],
      ["8:00 AM","Start of day — check social media and messages","Respond to all comments and messages within 24 hours"],
      ["8:30 AM","Review daily priorities and content schedule","Reference monthly content calendar"],
      ["9:00 AM","Content creation — social media posts, graphics, captions","Schedule posts for the day"],
      ["10:00 AM","External communications — press releases, newsletters, materials","As assigned by President"],
      ["11:00 AM","DBMD research and program development work","Minimum 1 hour daily"],
      ["12:00 PM","Lunch — 30 minutes",""],
      ["12:30 PM","Internal communications — memos, announcements, templates","As directed by President"],
      ["1:30 PM","Social media monitoring and engagement","Respond to all interactions"],
      ["2:30 PM","Brand and marketing projects","Ongoing project work"],
      ["3:30 PM","Administrative tasks — reports, documentation, archives","Keep all records current"],
      ["4:30 PM","End of day check in with President — brief text or email","Daily required"],
      ["5:00 PM","End of work day",""],
    ]},
  ]},
  {id:"s5",title:"Weekly Work Plan",content:[
    {type:"table",rows:[
      ["Day","Priority Activities"],
      ["Monday","Weekly planning — review content calendar — post on all social platforms — check analytics — respond to all messages"],
      ["Tuesday","Content creation — graphics, captions, videos — DBMD research — newsletter work"],
      ["Wednesday","Social media posting — external communications — brand materials — President check in"],
      ["Thursday","DBMD program development — internal communications — event coordination if needed"],
      ["Friday","Weekly report to President — social analytics review — plan next week content — update archives"],
    ]},
    {type:"subhead",text:"Weekly Minimum Standards"},
    {type:"table",rows:[
      ["Activity","Weekly Minimum"],
      ["Social media posts across all platforms","3 posts minimum"],
      ["Social media engagement responses","All within 24 hours"],
      ["DBMD research and development hours","Minimum 5 hours"],
      ["Weekly report to President","Every Friday by 5:00 PM"],
      ["Daily check in with President","Every work day"],
      ["Content calendar — monthly submission","By 25th of each month"],
    ]},
  ]},
  {id:"s6",title:"Monthly Goals & Targets",content:[
    {type:"table",rows:[
      ["Goal","Monthly Target"],
      ["Social media posts published","Minimum 12 posts across all platforms"],
      ["Social media follower growth","Positive growth each month — report actual numbers"],
      ["Email newsletter sent","Minimum 1 per month"],
      ["Press releases or announcements issued","As needed — minimum 1 per quarter"],
      ["DBMD research report submitted","By last Friday of each month"],
      ["Content calendar submitted to President","By 25th of prior month"],
      ["Monthly communication report submitted","By 5th of following month"],
      ["Marketing materials updated","As program updates occur"],
    ]},
  ]},
  {id:"s7",title:"DBMD Program Development Responsibilities",content:[
    {type:"alert",text:"DBMD — DEAF-BLIND MULTIPLE DISABILITY — This is a specialized Texas HHS program that provides residential services for individuals who are Deaf-Blind. Grace Trace Ministries is committed to developing this program as part of our Phase 3 expansion."},
    {type:"subhead",text:"What is DBMD?"},
    {type:"para",text:"The Deaf-Blind with Multiple Disabilities (DBMD) program is a Texas Medicaid waiver program administered by the Texas Health and Human Services Commission (HHSC). It provides community-based services to people who have both hearing and vision loss along with other disabilities. Grace Trace Ministries plans to become a licensed DBMD residential care provider."},
    {type:"subhead",text:"Your DBMD Research Responsibilities"},
    {type:"bullets",items:["Research HHSC DBMD provider requirements — licensing, staffing, facility standards","Study DBMD waiver services — what services can Grace Trace provide and bill for","Identify the HHSC DBMD program contact — build a relationship","Research interpreter and support staff requirements for DBMD residents","Identify potential DBMD residents and waitlist in Texas","Research Texas School for the Blind and Visually Impaired (TSBVI) — build connection","Research DBMD funding — Medicaid waiver rates, grants, HHS contracts","Develop a full written DBMD Program Development Plan for President review"]},
    {type:"subhead",text:"Key DBMD Contacts to Research and Establish"},
    {type:"table",rows:[
      ["Organization","Purpose"],
      ["Texas HHSC — DBMD Program","Provider licensing and waiver program contact"],
      ["Criss Cole Rehabilitation Center","Deaf-Blind services in Texas"],
      ["Texas School for the Blind and Visually Impaired","Transition age youth referral source"],
      ["DeafBlind Multihandicapped Association of Texas (DBMAT)","Community organization and advocacy"],
      ["Helen Keller National Center","National DBMD resource and connection"],
    ]},
  ]},
  {id:"s8",title:"Communication Standards & Protocols",content:[
    {type:"alert",text:"ALL PUBLIC COMMUNICATIONS REQUIRE PRESIDENT APPROVAL BEFORE POSTING OR DISTRIBUTION — No post, press release, announcement, or public statement may go out without Avrial Evans reviewing and approving it first."},
    {type:"subhead",text:"Social Media Standards"},
    {type:"bullets",items:["Always use approved Grace Trace Ministries brand colors — Burgundy #4A0E1A, Forest Green #1A3D2B, Champagne Gold #C9A84C","Never post photos of residents without written consent","Always tag posts with approved hashtags","Never respond to negative comments without President guidance","Screenshot and report any inappropriate comments or messages to President immediately","Never make any statements about Grace Trace Ministries programs, funding, or government contracts on social media"]},
    {type:"subhead",text:"Internal Communication Standards"},
    {type:"bullets",items:["All internal staff communications drafted for President review before distribution","Maintain confidentiality of all staff and resident information at all times","Use info@gracetraceministries.org for all official communications","Never share internal organizational information publicly","Respond to all President communications within 2 hours during work hours"]},
    {type:"subhead",text:"Brand Voice Guidelines"},
    {type:"bullets",items:["Professional — always formal and dignified","Warm — compassionate and mission-focused","Empowering — celebrate residents and program successes","Credible — factual, accurate, and trustworthy","Never sensationalize resident stories or struggles","Always lead with the mission — Tracing the Path of Grace with New Beginnings"]},
  ]},
  {id:"s9",title:"Meeting Requirements",content:[
    {type:"table",rows:[
      ["Meeting Type","Frequency / Details"],
      ["Daily check in with President","Every work day — text or email — brief update"],
      ["Weekly one on one with President","Every Monday — 30 minutes — by phone or video"],
      ["Monthly review with President","First week of each month — 1 hour — review report and set goals"],
      ["Quarterly in person meeting","Once per quarter — in person — full performance and DBMD development review"],
      ["Board meetings","Quarterly — attend when requested — provide communication update"],
      ["Annual performance review","Once per year — in person — with President"],
    ]},
  ]},
  {id:"s10",title:"Reporting Requirements",content:[
    {type:"subhead",text:"Daily Check In"},
    {type:"bullets",items:["Text or email to President every work day","Social media activity completed that day","Any media inquiries or unusual communications received","Plan for next day"]},
    {type:"subhead",text:"Weekly Communication Report — Due Every Friday by 5:00 PM"},
    {type:"bullets",items:["Social media posts published — platform, content, engagement","Social media metrics — reach, followers, engagement rate","External communications completed","Internal communications completed","DBMD research progress this week","Challenges or issues","Plan for following week"]},
    {type:"subhead",text:"Monthly Communication Report — Due by 5th of Following Month"},
    {type:"bullets",items:["Total social media posts and performance metrics","Follower growth across all platforms","Newsletter performance — open rate, click rate","Marketing materials created or updated","DBMD program development progress — research completed, contacts made, next steps","Goals and priorities for next month"]},
  ]},
  {id:"s11",title:"Required Logs & Documentation",content:[
    {type:"subhead",text:"Log 1 — Content Calendar"},
    {type:"table",rows:[
      ["Date","Platform","Content Type","Topic/Caption","Status","Approved by President","Engagement"],
      ["","","","","","",""],["","","","","","",""],["","","","","","",""],
    ]},
    {type:"subhead",text:"Log 2 — Social Media Analytics Log"},
    {type:"table",rows:[
      ["Month","Platform","Followers Start","Followers End","Total Posts","Total Reach","Engagement Rate","Notes"],
      ["","","","","","","",""],["","","","","","","",""],["","","","","","","",""],
    ]},
    {type:"subhead",text:"Log 3 — DBMD Research & Development Log"},
    {type:"table",rows:[
      ["Date","Research Topic","Source / Contact","Key Findings","Action Items","Report to President","Status"],
      ["","","","","","",""],["","","","","","",""],["","","","","","",""],
    ]},
    {type:"subhead",text:"Log 4 — Media & Press Log"},
    {type:"table",rows:[
      ["Date","Media Outlet / Contact","Type of Inquiry","Response Given","President Notified","Outcome"],
      ["","","","","",""],["","","","","",""],["","","","","",""],
    ]},
  ]},
  {id:"s12",title:"Rules & Standards of Conduct",content:[
    {type:"alert",text:"VIOLATION OF THESE RULES MAY RESULT IN IMMEDIATE TERMINATION"},
    {type:"bullets",items:["Posting any content related to Grace Trace Ministries on any platform without President approval","Sharing confidential resident, staff, or organizational information publicly or with unauthorized parties","Making any public statement about Grace Trace Ministries funding, contracts, or government relationships","Posting photos of residents without documented written consent","Responding to media inquiries without immediately notifying President","Using Grace Trace Ministries name, logo, or brand for personal benefit"]},
    {type:"subhead",text:"Professional Standards"},
    {type:"bullets",items:["Maintain professional appearance and conduct in all settings representing Grace Trace Ministries","Respond to President communications within 2 hours during work hours","Submit all reports on time — late reports are not acceptable without prior notice","Complete all logs same day as activity — never backfill logs","Maintain brand standards at all times — no unofficial or off-brand content","Disclose any conflict of interest to President immediately"]},
  ]},
  {id:"s13",title:"Performance Metrics",content:[
    {type:"table",rows:[
      ["Metric","Target","Frequency"],
      ["Social media posts published","Minimum 3 per week","Weekly"],
      ["Social media engagement responses","100% within 24 hours","Weekly"],
      ["Follower growth","Positive growth every month","Monthly"],
      ["Monthly newsletter sent","Minimum 1 per month","Monthly"],
      ["Content calendar submitted to President","By 25th of prior month","Monthly"],
      ["DBMD research hours logged","Minimum 5 hours per week","Weekly"],
      ["Monthly DBMD report submitted","By last Friday of month","Monthly"],
      ["Weekly report submitted on time","Every Friday by 5:00 PM — 100%","Weekly"],
      ["Daily check in completed","Every work day — 100%","Daily"],
      ["Response time to President","Within 2 hours during work hours","Ongoing"],
    ]},
  ]},
  {id:"s14",title:"Acknowledgment & Signature",content:[
    {type:"para",text:"I, AuBreyon (Kisses) Woodley, acknowledge that I have received, read, and understand the contents of this Department Operations Binder for the position of Director of Communication — DBMD Programs at Grace Trace Ministries. I understand and agree to perform all duties and responsibilities as described in this binder, meet all reporting requirements and deadlines, maintain all required logs and documentation, uphold all communication and brand standards, protect the confidentiality of Grace Trace Ministries and its residents, attend all required meetings including quarterly in person meetings, and never post or distribute any public communications without President approval. This binder is the property of Grace Trace Ministries and must be returned upon separation from this position."},
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

export default function AubreyonBinder(){
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
      const allowed = ["aubreyon","avy","travis"];
      if(uid2&&allowed.includes(uid2)){
        setAuthorized(true);
        // Always check API first — never rely on localStorage alone
        fetch("/api/signatures")
          .then(function(r){return r.json();})
          .then(function(sigs){
            if(sigs["binder_aubreyon"]&&sigs["binder_aubreyon"].signed){
              setSigned(true);
            } else {
              // Fallback to localStorage
              try{
                const s=localStorage.getItem("gtm_orientation_aubreyon");
                if(s){const p=JSON.parse(s);if(p.signed)setSigned(true);}
              }catch(e){}
            }
          })
          .catch(function(){
            // Offline fallback
            try{
              const s=localStorage.getItem("gtm_orientation_aubreyon");
              if(s){const p=JSON.parse(s);if(p.signed)setSigned(true);}
            }catch(e){}
          });
      }
    }catch(e){}
    setLoading(false);
  },[]);

  function submitSignature(){
    if(!signatureName.trim()){setSignError("Please type your full name to sign.");return;}
    if(!signatureDate.trim()){setSignError("Please enter today\'s date.");return;}
    const sigData={signed:true,name:signatureName,date:signatureDate};
    try{localStorage.setItem("gtm_orientation_aubreyon",JSON.stringify(sigData));}catch(e){}
    fetch("/api/signatures",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({userId:"binder_aubreyon",data:sigData})})
      .catch(function(){});
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
          <div style={{color:C.ivory,fontWeight:900,fontSize:16}}>AuBreyon (Kisses) Woodley</div>
          <div style={{color:C.muted,fontSize:12}}>Director of Communication — DBMD Programs</div>
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
                      <div style={{color:C.text,fontSize:13,fontWeight:600,marginBottom:6}}>Type your full name: <span style={{color:C.gold}}>(AuBreyon Woodley)</span></div>
                      <input type="text" value={signatureName} onChange={e=>{setSignatureName(e.target.value);setSignError("");}} placeholder="AuBreyon Woodley"
                        style={{width:"100%",background:C.dark,border:"1px solid "+(signError?C.error:C.cardBorder),borderRadius:8,padding:"10px 14px",color:C.text,fontSize:14,outline:"none",fontFamily:"inherit"}}/>
                    </div>
                    <div style={{marginBottom:14}}>
                      <div style={{color:C.text,fontSize:13,fontWeight:600,marginBottom:6}}>Date</div>
                      <input type="text" value={signatureDate} onChange={e=>{setSignatureDate(e.target.value);setSignError("");}} placeholder="e.g. July 12, 2026"
                        style={{width:"100%",background:C.dark,border:"1px solid "+(signError?C.error:C.cardBorder),borderRadius:8,padding:"10px 14px",color:C.text,fontSize:14,outline:"none",fontFamily:"inherit"}}/>
                    </div>
                    {signError&&<div style={{color:C.error,fontSize:13,marginBottom:10}}>{signError}</div>}
                    <button onClick={submitSignature} style={{width:"100%",background:C.green,border:"none",borderRadius:10,padding:"13px",color:C.ivory,fontSize:14,fontWeight:800,cursor:"pointer"}}>
                      I Have Read and Understood This Binder — Sign and Submit
                    </button>
                  </div>
                ):(
                  <div style={{background:"#4CAF5022",border:"1px solid #4CAF5044",borderRadius:12,padding:"24px",textAlign:"center"}}>
                    <div style={{fontSize:32,marginBottom:8}}>✓</div>
                    <div style={{color:"#4CAF50",fontWeight:800,fontSize:16}}>Binder Signed and Acknowledged</div>
                    <div style={{color:C.muted,fontSize:13,marginTop:4}}>AuBreyon (Kisses) Woodley — {signatureDate||"Signed"}</div>
                    <div style={{marginTop:20,display:"flex",flexDirection:"column",gap:10}}>
                      <div style={{color:"#4CAF5088",fontSize:12,textAlign:"center",marginBottom:4}}>What would you like to do next?</div>
                      <button onClick={function(){
                        var uid2=localStorage.getItem("gtm_current_user")||"";
                        fetch("/api/signatures").then(function(r){return r.json();}).then(function(sigs){
                          var oSigned=sigs["orientation_"+uid2]?sigs["orientation_"+uid2].signed:false;
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