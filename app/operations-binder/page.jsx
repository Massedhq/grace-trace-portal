// @ts-nocheck
"use client";
import { useState, useEffect } from "react";

const C = {
  burgundy:"#6B1A2A",burgundyDark:"#4A0E1A",green:"#1E4D2B",gold:"#C9A84C",
  ivory:"#F5F0E8",dark:"#1A0F12",card:"#2A1A1E",cardBorder:"#3D2028",
  text:"#F0EAE2",muted:"#A08878",error:"#EF5350",
};

const SECTIONS = [
  {
    id:"intro",title:"About This Document",content:[
      {type:"alert",text:"GRACE TRACE MINISTRIES — OPERATIONS BINDER\nHouse Rules & Resident Agreement\nGrace Trace Ministries — Official Resident Document"},
      {type:"para",text:"These House Rules are a condition of residency at Grace Trace Ministries. Every resident must read, understand, and sign this document before moving in. As staff, it is your responsibility to know every rule in this binder so you can enforce them consistently, answer resident questions, and protect the integrity of the program."},
      {type:"para",text:"Violations may result in written warnings, loss of privileges, or discharge from the program. Certain violations will result in IMMEDIATE discharge with no notice. If a resident has questions about any rule — they must ask before they sign."},
      {type:"subhead",text:"What This Binder Contains"},
      {type:"bullets",items:[
        "Section 1 — Curfew Policy",
        "Section 2 — Drug & Alcohol Policy",
        "Section 3 — Visitor Policy",
        "Section 4 — Daily Living Rules",
        "Section 5 — Employment & Program Requirements",
        "Section 6 — Safety & Security",
        "Section 7 — Technology & Social Media",
        "Section 8 — Smoking Policy",
        "Section 9 — Prohibited Items",
        "Section 10 — Discharge Policy",
        "Section 11 — Resident Rights",
        "Section 12 — Resident Agreement",
      ]},
    ]
  },
  {
    id:"s1",title:"Section 1 — Curfew",content:[
      {type:"alert",text:"All residents must be inside and accounted for by curfew. No exceptions without prior written approval."},
      {type:"subhead",text:"Curfew Schedule"},
      {type:"table",rows:[
        ["Day","Curfew Time"],
        ["Sunday – Thursday","10:00 PM — All residents must be inside"],
        ["Friday – Saturday","11:00 PM — All residents must be inside"],
        ["Work nights","30 minutes after verified shift end — notify house staff in advance"],
        ["Program / appointment nights","30 minutes after verified end — notify house staff in advance"],
      ]},
      {type:"subhead",text:"Curfew Rules"},
      {type:"bullets",items:[
        "All residents must sign out before leaving and sign in immediately upon returning",
        "Residents must carry a working phone and be reachable at all times",
        "Overnight passes require 48 hours advance written request and approval",
        "No overnight passes during the first 30 days of residency",
      ]},
      {type:"subhead",text:"Curfew Violations"},
      {type:"table",rows:[
        ["Violation","Consequence"],
        ["1st violation","Written warning — documented in file"],
        ["2nd violation","Final warning — meeting with Program Director"],
        ["3rd violation","Discharge — 24 hour notice to vacate"],
        ["AWOL — did not return","Immediate discharge — bed held 24 hours only"],
      ]},
    ]
  },
  {
    id:"s2",title:"Section 2 — Drug & Alcohol Policy",content:[
      {type:"alert",text:"ZERO TOLERANCE — This facility maintains a ZERO TOLERANCE policy for all alcohol and illegal substances. Any resident found in possession of, under the influence of, or distributing drugs or alcohol will be IMMEDIATELY discharged with no second chance."},
      {type:"subhead",text:"Prohibited Substances"},
      {type:"bullets",items:[
        "All illegal substances are prohibited — no exceptions",
        "Alcohol in any form is prohibited on the premises",
        "Cannabis / marijuana is prohibited including medical marijuana unless specifically exempted in writing",
        "Synthetic drugs, K2, spice, bath salts, and designer drugs are prohibited",
        "Any prescription medication not prescribed to you is prohibited",
      ]},
      {type:"subhead",text:"Drug Testing"},
      {type:"bullets",items:[
        "All residents are subject to RANDOM drug testing at any time with no prior notice",
        "Residents may also be tested for cause at any time",
        "Residents must submit to testing within 15 minutes of being asked — refusal is a positive result",
        "Diluted samples are treated as a positive result",
      ]},
      {type:"subhead",text:"Prescription Medications"},
      {type:"bullets",items:[
        "All medications must be disclosed at move-in and stored with house staff",
        "Residents may not share, sell, or transfer medications to any other person",
        "Controlled substances are dispensed by house staff only",
      ]},
    ]
  },
  {
    id:"s3",title:"Section 3 — Visitor Policy",content:[
      {type:"subhead",text:"Visitor Rules"},
      {type:"bullets",items:[
        "ALL visitors must be pre-approved by house staff before entering",
        "Visitors must sign in with full name and ID at every visit",
        "No visitors in bedrooms — all visits in common areas only",
        "Visitors must leave by 9:00 PM Sunday–Thursday and 10:00 PM Friday–Saturday",
        "Visitors may not spend the night under any circumstances",
        "Anyone on parole or probation requires advance written approval from both parole officers",
        "Anyone known to use or sell drugs is prohibited from visiting",
        "Minors under 18 require legal guardian accompaniment and advance Program Director approval",
      ]},
    ]
  },
  {
    id:"s4",title:"Section 4 — Daily Living",content:[
      {type:"subhead",text:"Room & Personal Space"},
      {type:"bullets",items:[
        "Beds must be made by 9:00 AM daily",
        "Rooms are subject to inspection at any time for health, safety, and compliance",
        "No food or drinks in bedrooms — eating in kitchen or dining area only",
        "No candles, incense, or open flames anywhere in the facility",
        "No alterations, painting, or permanent changes to rooms or facility",
        "No sexually explicit, gang-related, or violent imagery",
      ]},
      {type:"subhead",text:"Common Areas"},
      {type:"bullets",items:[
        "All residents share responsibility for keeping common areas clean",
        "Weekly chore assignments are mandatory — failure results in additional duties",
        "Kitchen must be cleaned immediately after every use",
        "Quiet hours are 10:00 PM to 7:00 AM",
      ]},
      {type:"subhead",text:"Hygiene"},
      {type:"bullets",items:[
        "Daily personal hygiene is required — bathing, grooming, clean clothing",
        "Bathrooms must be cleaned after use — no leaving personal items in shared spaces",
      ]},
    ]
  },
  {
    id:"s5",title:"Section 5 — Employment & Program Requirements",content:[
      {type:"subhead",text:"Employment Requirements"},
      {type:"bullets",items:[
        "All residents must actively seek employment from day one",
        "Minimum 5 job applications per week — documented",
        "Within 30 days of move-in residents must be employed or in job training",
        "Pay stubs must be submitted weekly once employed",
      ]},
      {type:"subhead",text:"Program Participation"},
      {type:"bullets",items:[
        "All residents must attend the mandatory weekly house meeting",
        "All residents must participate in minimum 1 life skills or program activity per week",
        "All court dates, parole, probation, and VA appointments must be kept",
        "All appointments must be reported to house staff 24 hours in advance",
        "Weekly check-in with assigned case manager is required",
      ]},
    ]
  },
  {
    id:"s6",title:"Section 6 — Safety & Security",content:[
      {type:"alert",text:"ZERO TOLERANCE — WEAPONS: No weapons of any kind are permitted on the premises. This includes firearms, knives over 3 inches, tasers, brass knuckles, or any object used as a weapon. Violation results in IMMEDIATE discharge and law enforcement will be contacted."},
      {type:"bullets",items:[
        "Physical violence or threats of violence result in IMMEDIATE discharge — 911 will be called",
        "Sexual harassment of any kind results in IMMEDIATE discharge",
        "Theft results in IMMEDIATE discharge — law enforcement will be contacted",
        "Security cameras are in operation in all common areas and entry/exit points",
        "By residing here you consent to being recorded in common areas",
      ]},
    ]
  },
  {
    id:"s7",title:"Section 7 — Technology & Social Media",content:[
      {type:"bullets",items:[
        "Cell phones must be silenced during house meetings and quiet hours",
        "No photography or video of other residents without their express consent",
        "Do not post images, videos, or the address of this facility on social media",
        "No illegal activity using house WiFi",
      ]},
    ]
  },
  {
    id:"s8",title:"Section 8 — Smoking Policy",content:[
      {type:"bullets",items:[
        "Smoking, vaping, and tobacco use are PROHIBITED inside the facility",
        "Smoking is permitted only in the designated outdoor area",
        "Properly dispose of all cigarette materials — no littering",
      ]},
    ]
  },
  {
    id:"s9",title:"Section 9 — Prohibited Items",content:[
      {type:"subhead",text:"The following items are prohibited on the premises"},
      {type:"bullets",items:[
        "Drug paraphernalia of any kind",
        "Pornographic materials",
        "Gang-related clothing, symbols, or materials",
        "Gambling devices or materials",
        "Pets — without prior written approval",
        "Cooking appliances in bedrooms",
        "Extension cords — power strips with surge protectors are permitted",
      ]},
    ]
  },
  {
    id:"s10",title:"Section 10 — Discharge Policy",content:[
      {type:"alert",text:"Immediate Discharge means the resident must vacate immediately with no notice. Administrative Discharge means 24 hours notice to vacate."},
      {type:"subhead",text:"Immediate Discharge — No Notice — Zero Tolerance"},
      {type:"bullets",items:[
        "Positive drug or alcohol test",
        "Possession of weapons",
        "Physical violence or sexual assault",
        "Theft from residents, staff, or facility",
        "Bringing illegal drugs or weapons onto the property",
      ]},
      {type:"subhead",text:"Administrative Discharge — 24 Hour Notice"},
      {type:"bullets",items:[
        "Repeated curfew violations",
        "Non-payment of fees",
        "Failure to meet employment or program participation requirements",
        "Behavior that is disruptive to other residents or the program",
      ]},
    ]
  },
  {
    id:"s11",title:"Section 11 — Resident Rights",content:[
      {type:"alert",text:"YOUR RIGHTS AS A RESIDENT OF GRACE TRACE MINISTRIES — Every resident of Grace Trace Ministries has these rights. Staff are required to uphold them at all times."},
      {type:"bullets",items:[
        "The right to be treated with dignity and respect at all times",
        "The right to privacy within the limits of this agreement",
        "The right to file a grievance without fear of retaliation",
        "The right to receive visitors during approved hours",
        "The right to receive and send mail and phone calls in private",
        "The right to access your own medical and mental health care",
        "The right to know and understand all rules before signing",
        "The right to be free from discrimination, abuse, neglect, and exploitation",
      ]},
    ]
  },
  {
    id:"s12",title:"Section 12 — Resident Agreement",content:[
      {type:"subhead",text:"Program Fee"},
      {type:"table",rows:[
        ["Item","Details"],
        ["Monthly / Weekly Fee","As agreed at move-in"],
        ["Payment Due Date","As agreed at move-in"],
        ["Late Fee","As specified in individual agreement"],
        ["Move-In Fee","As agreed at move-in"],
      ]},
      {type:"subhead",text:"Length of Stay"},
      {type:"table",rows:[
        ["Item","Details"],
        ["Initial Program Length","As agreed at move-in"],
        ["Review Date","As agreed at move-in"],
        ["Notice Required to Leave","7 days written notice minimum"],
      ]},
      {type:"subhead",text:"Program Commitments — Every resident commits to"},
      {type:"bullets",items:[
        "Following all House Rules as written and signed",
        "Actively seeking and maintaining employment throughout residency",
        "Attending all mandatory house meetings and program activities",
        "Keeping all parole, probation, VA, and case management appointments",
        "Submitting to random drug testing at any time with no prior notice",
        "Maintaining personal hygiene and contributing to household cleanliness",
        "Treating all staff, house managers, and fellow residents with respect",
        "Reporting any safety concerns, conflicts, or issues to house staff immediately",
        "Saving a portion of every paycheck toward permanent housing",
      ]},
      {type:"subhead",text:"Property Condition"},
      {type:"para",text:"Resident acknowledges receipt of the room and facility in the condition described on the Move-In Property Inventory Sheet. Resident agrees to return the room in the same or better condition. Any damages beyond normal wear and tear will be charged to the resident."},
      {type:"subhead",text:"Belongings & Liability"},
      {type:"para",text:"Grace Trace Ministries is not responsible for lost, stolen, or damaged personal belongings. Residents are encouraged to use the secured lockbox provided for valuables. A move-in inventory of all personal property will be completed and signed by both parties."},
      {type:"subhead",text:"Grievance Process"},
      {type:"bullets",items:[
        "Submit written grievance to house staff within 5 days of the incident",
        "House staff responds in writing within 3 business days",
        "If unresolved — escalate to Program Director in writing within 5 days",
        "Program Director responds within 5 business days — decision is final",
        "No resident will be retaliated against for filing a good-faith grievance",
      ]},
      {type:"subhead",text:"Move-Out"},
      {type:"bullets",items:[
        "Voluntary departure requires minimum 7 days written notice",
        "Room must be cleaned and returned to move-in condition",
        "All facility property must be returned — keys, lockbox, linens if provided",
        "A move-out inspection will be conducted with the resident present",
        "Personal belongings left after move-out will be held 7 days then donated",
      ]},
    ]
  },
  {
    id:"ack",title:"Staff Acknowledgment",content:[
      {type:"para",text:"By acknowledging below, you confirm that you have read and understand the complete Grace Trace Ministries House Rules and Resident Agreement contained in this Operations Binder. You understand that as a staff member you are responsible for enforcing these rules consistently, explaining them to residents, and upholding every resident's rights as listed in Section 11. You acknowledge that this document is the official standard for resident conduct at Grace Trace Ministries."},
      {type:"signature"},
    ]
  },
];

function Block({block}) {
  if (block.type==="para") return <p style={{color:C.text,fontSize:14,lineHeight:1.9,margin:"0 0 14px"}}>{block.text}</p>;
  if (block.type==="subhead") return <div style={{color:C.gold,fontSize:12,fontWeight:800,textTransform:"uppercase",letterSpacing:1,margin:"20px 0 8px",borderLeft:"3px solid "+C.gold,paddingLeft:10}}>{block.text}</div>;
  if (block.type==="alert") return (
    <div style={{background:C.burgundy+"44",border:"1px solid "+C.burgundy,borderRadius:10,padding:"14px 18px",margin:"0 0 16px"}}>
      {block.text.split("\n").map((line,i)=><div key={i} style={{color:C.ivory,fontSize:13,fontWeight:700,lineHeight:1.7}}>{line}</div>)}
    </div>
  );
  if (block.type==="bullets") return (
    <ul style={{margin:"0 0 14px",paddingLeft:20}}>
      {block.items.map((item,i)=><li key={i} style={{color:C.text,fontSize:14,lineHeight:1.9,marginBottom:4}}>{item}</li>)}
    </ul>
  );
  if (block.type==="table") return (
    <div style={{overflowX:"auto",marginBottom:16}}>
      <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
        <tbody>
          {block.rows.map((row,i)=>(
            <tr key={i} style={{background:i===0?C.burgundy:i%2===0?C.dark:C.card}}>
              {row.map((cell,j)=>(
                <td key={j} style={{padding:"9px 14px",color:i===0?C.ivory:j===0?C.gold:C.text,fontWeight:i===0||j===0?700:400,border:"1px solid "+C.cardBorder,fontSize:13,lineHeight:1.6}}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
  return null;
}

export default function OperationsBinder() {
  const [currentUser, setCurrentUser] = useState(null);
  const [activeSection, setActiveSection] = useState("intro");
  const [loading, setLoading] = useState(true);
  const [signed, setSigned] = useState(false);
  const [signatureName, setSignatureName] = useState("");
  const [signatureDate, setSignatureDate] = useState("");
  const [signError, setSignError] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    try {
      const uid = localStorage.getItem("gtm_current_user");
      if (uid) {
        setCurrentUser({id:uid});
        fetch("/api/signatures")
          .then(r=>r.json())
          .then(sigs=>{
            if (sigs["ops_binder_"+uid]&&sigs["ops_binder_"+uid].signed) setSigned(true);
          }).catch(()=>{});
      }
    } catch(e) {}
    setLoading(false);
  }, []);

  function submitSignature() {
    if (!signatureName.trim()) { setSignError("Please type your full name to acknowledge."); return; }
    if (!signatureDate.trim()) { setSignError("Please enter today's date."); return; }
    const sigData = {signed:true, name:signatureName, date:signatureDate};
    try { localStorage.setItem("gtm_ops_binder_"+(currentUser?.id||""), JSON.stringify(sigData)); } catch(e) {}
    fetch("/api/signatures", {
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify({userId:"ops_binder_"+(currentUser?.id||""), data:sigData})
    }).catch(()=>{});
    setSigned(true);
  }

  if (loading) return <div style={{minHeight:"100vh",background:C.dark,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Inter','Segoe UI',sans-serif"}}><div style={{color:C.muted}}>Loading...</div></div>;

  if (!currentUser) return (
    <div style={{minHeight:"100vh",background:C.dark,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Inter','Segoe UI',sans-serif"}}>
      <a href="/" style={{background:C.burgundy,borderRadius:8,padding:"11px 24px",color:C.ivory,fontSize:14,fontWeight:800,textDecoration:"none"}}>Log in first</a>
    </div>
  );

  const currentIdx = SECTIONS.findIndex(s=>s.id===activeSection);
  const currentSec = SECTIONS[currentIdx];

  return (
    <div style={{minHeight:"100vh",background:C.dark,fontFamily:"'Inter','Segoe UI',sans-serif",display:"flex",flexDirection:"column"}}>

      {/* Header */}
      <div style={{background:"linear-gradient(135deg,"+C.burgundyDark+" 0%,"+C.dark+" 70%)",borderBottom:"2px solid "+C.gold,padding:"14px 20px",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:8}}>
        <div>
          <div style={{color:C.gold,fontSize:10,fontWeight:800,letterSpacing:3,textTransform:"uppercase"}}>Operations Binder</div>
          <div style={{color:C.ivory,fontWeight:900,fontSize:16}}>Grace Trace Ministries</div>
          <div style={{color:C.muted,fontSize:12}}>House Rules & Resident Agreement</div>
        </div>
        <div style={{display:"flex",gap:8,alignItems:"center"}}>
          {signed&&<div style={{background:"#4CAF5022",border:"1px solid #4CAF5044",borderRadius:20,padding:"4px 12px",color:"#4CAF50",fontSize:11,fontWeight:700}}>✓ Acknowledged</div>}
          <button onClick={()=>setMenuOpen(!menuOpen)} style={{background:C.burgundy,border:"1px solid "+C.gold+"66",borderRadius:8,padding:"6px 14px",color:C.ivory,fontSize:12,fontWeight:700,cursor:"pointer"}}>☰ Sections</button>
          <button onClick={()=>window.history.back()} style={{background:"transparent",border:"1px solid "+C.cardBorder,borderRadius:8,padding:"6px 12px",color:C.muted,fontSize:12,cursor:"pointer"}}>← Back</button>
        </div>
      </div>

      {/* Mobile section menu */}
      {menuOpen&&(
        <div style={{background:C.card,borderBottom:"1px solid "+C.cardBorder,padding:"10px 0",maxHeight:260,overflowY:"auto"}}>
          {SECTIONS.map((s,i)=>(
            <button key={s.id} onClick={()=>{setActiveSection(s.id);setMenuOpen(false);}}
              style={{width:"100%",textAlign:"left",padding:"9px 20px",background:activeSection===s.id?C.burgundy:"transparent",border:"none",cursor:"pointer",color:activeSection===s.id?C.ivory:C.muted,fontSize:13,fontWeight:activeSection===s.id?700:400,borderLeft:activeSection===s.id?"3px solid "+C.gold:"3px solid transparent"}}>
              {i+1}. {s.title}
            </button>
          ))}
        </div>
      )}

      <div style={{display:"flex",flex:1}}>

        {/* Sidebar — desktop */}
        <div style={{width:220,background:C.card,borderRight:"1px solid "+C.cardBorder,padding:"12px 0",flexShrink:0,overflowY:"auto",display:"none"}} className="desktop-sidebar">
          {SECTIONS.map((s,i)=>(
            <button key={s.id} onClick={()=>setActiveSection(s.id)}
              style={{width:"100%",textAlign:"left",padding:"10px 16px",background:activeSection===s.id?C.burgundy:"transparent",border:"none",cursor:"pointer",display:"flex",alignItems:"flex-start",gap:8,borderLeft:activeSection===s.id?"3px solid "+C.gold:"3px solid transparent"}}>
              <span style={{color:C.gold,fontSize:11,fontWeight:800,flexShrink:0,marginTop:2}}>{i+1}</span>
              <span style={{color:activeSection===s.id?C.ivory:C.muted,fontSize:12,fontWeight:activeSection===s.id?700:400,lineHeight:1.5}}>{s.title}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        <div style={{flex:1,padding:"24px 20px",overflowY:"auto",maxWidth:700,margin:"0 auto",width:"100%"}}>

          {/* Progress bar */}
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
            <div style={{color:C.muted,fontSize:11}}>{currentIdx+1} of {SECTIONS.length}</div>
            <div style={{flex:1,height:4,background:C.cardBorder,borderRadius:20,margin:"0 12px",overflow:"hidden"}}>
              <div style={{height:"100%",background:C.gold,borderRadius:20,width:((currentIdx+1)/SECTIONS.length*100)+"%",transition:"width 0.3s"}}/>
            </div>
            {signed&&<div style={{color:"#4CAF50",fontSize:11,fontWeight:700}}>✓ Done</div>}
          </div>

          <div style={{color:C.gold,fontSize:10,fontWeight:800,letterSpacing:2,textTransform:"uppercase",marginBottom:6}}>{currentSec.id==="intro"?"Introduction":currentSec.id==="ack"?"Staff Acknowledgment":"House Rules"}</div>
          <h2 style={{color:C.ivory,fontSize:20,fontWeight:900,margin:"0 0 20px",paddingBottom:12,borderBottom:"1px solid "+C.cardBorder}}>{currentSec.title}</h2>

          {currentSec.content.map((block,i)=>{
            if (block.type==="signature") return (
              <div key={i}>
                {!signed?(
                  <div style={{background:C.card,border:"1px solid "+C.gold+"66",borderRadius:12,padding:"22px"}}>
                    <div style={{color:C.muted,fontSize:13,lineHeight:1.8,marginBottom:18}}>By signing below you confirm that you have read and understood the complete Grace Trace Ministries House Rules and Resident Agreement. You acknowledge your responsibility as a staff member to enforce these rules consistently and uphold all resident rights.</div>
                    <div style={{marginBottom:14}}>
                      <div style={{color:C.text,fontSize:13,fontWeight:600,marginBottom:6}}>Type your full name</div>
                      <input type="text" value={signatureName} onChange={e=>{setSignatureName(e.target.value);setSignError("");}} placeholder="Full name"
                        style={{width:"100%",background:C.dark,border:"1px solid "+(signError?C.error:C.cardBorder),borderRadius:8,padding:"10px 14px",color:C.text,fontSize:14,outline:"none",fontFamily:"inherit"}}/>
                    </div>
                    <div style={{marginBottom:18}}>
                      <div style={{color:C.text,fontSize:13,fontWeight:600,marginBottom:6}}>Date</div>
                      <input type="text" value={signatureDate} onChange={e=>{setSignatureDate(e.target.value);setSignError("");}} placeholder="e.g. July 16, 2026"
                        style={{width:"100%",background:C.dark,border:"1px solid "+(signError?C.error:C.cardBorder),borderRadius:8,padding:"10px 14px",color:C.text,fontSize:14,outline:"none",fontFamily:"inherit"}}/>
                    </div>
                    {signError&&<div style={{color:C.error,fontSize:13,marginBottom:12}}>{signError}</div>}
                    <button onClick={submitSignature} style={{width:"100%",background:C.green,border:"none",borderRadius:10,padding:"13px",color:C.ivory,fontSize:14,fontWeight:800,cursor:"pointer"}}>
                      I Have Read and Understood the House Rules — Acknowledge
                    </button>
                  </div>
                ):(
                  <div style={{background:"#4CAF5022",border:"1px solid #4CAF5044",borderRadius:12,padding:"24px",textAlign:"center"}}>
                    <div style={{fontSize:32,marginBottom:8}}>✓</div>
                    <div style={{color:"#4CAF50",fontWeight:800,fontSize:16,marginBottom:4}}>Operations Binder Acknowledged</div>
                    <div style={{color:C.muted,fontSize:13}}>{signatureName} — {signatureDate}</div>
                    <div style={{marginTop:20,display:"flex",flexDirection:"column",gap:10}}>
                      <div style={{color:"#4CAF5088",fontSize:12,marginBottom:4}}>What would you like to do next?</div>
                      <button onClick={function(){window.location.href="/";}} style={{background:C.burgundy,border:"1px solid "+C.gold+"66",borderRadius:10,padding:"12px",color:C.ivory,fontSize:14,fontWeight:800,cursor:"pointer"}}>
                        Return to My Workday Dashboard
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
            return <Block key={i} block={block}/>;
          })}

          {/* Navigation */}
          <div style={{display:"flex",justifyContent:"space-between",marginTop:28,paddingTop:16,borderTop:"1px solid "+C.cardBorder,gap:10}}>
            <button onClick={()=>{if(currentIdx>0)setActiveSection(SECTIONS[currentIdx-1].id);}} disabled={currentIdx===0}
              style={{background:"transparent",border:"1px solid "+(currentIdx===0?C.cardBorder+"66":C.cardBorder),borderRadius:8,padding:"10px 20px",color:currentIdx===0?C.cardBorder:C.muted,fontSize:13,cursor:currentIdx===0?"default":"pointer"}}>
              ← Previous
            </button>
            <div style={{color:C.muted,fontSize:11,alignSelf:"center",textAlign:"center"}}>
              {SECTIONS[currentIdx].title}
            </div>
            <button onClick={()=>{if(currentIdx<SECTIONS.length-1)setActiveSection(SECTIONS[currentIdx+1].id);}} disabled={currentIdx===SECTIONS.length-1}
              style={{background:currentIdx===SECTIONS.length-1?C.dark:C.burgundy,border:"1px solid "+(currentIdx===SECTIONS.length-1?C.cardBorder:C.gold+"66"),borderRadius:8,padding:"10px 20px",color:currentIdx===SECTIONS.length-1?C.muted:C.ivory,fontSize:13,fontWeight:700,cursor:currentIdx===SECTIONS.length-1?"default":"pointer"}}>
              Next →
            </button>
          </div>

          {/* Jump to acknowledgment */}
          {!signed&&currentIdx<SECTIONS.length-1&&(
            <button onClick={()=>setActiveSection("ack")} style={{width:"100%",marginTop:12,background:"transparent",border:"1px solid "+C.gold+"44",borderRadius:8,padding:"10px",color:C.gold,fontSize:12,cursor:"pointer"}}>
              Jump to Acknowledgment →
            </button>
          )}

          <div style={{height:48}}/>
        </div>
      </div>
    </div>
  );
}