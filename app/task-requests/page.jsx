// @ts-nocheck
"use client";
import { useState, useEffect } from "react";

const C = {
  burgundy:"#6B1A2A",burgundyDark:"#4A0E1A",green:"#1E4D2B",gold:"#C9A84C",
  ivory:"#F5F0E8",dark:"#1A0F12",card:"#2A1A1E",cardBorder:"#3D2028",
  text:"#F0EAE2",muted:"#A08878",error:"#EF5350",
};

const ALL_STAFF = [
  {id:"avy",name:"Avrial Evans (Avy)",initials:"AE",color:C.burgundy},
  {id:"travis",name:"Travis Ramar",initials:"TR",color:C.green},
  {id:"deann",name:"Deann Evans",initials:"DE",color:"#8B2A3E"},
  {id:"erica",name:"Erica Evans",initials:"EE",color:"#5C3010"},
  {id:"ialana",name:"Ialana Tippins",initials:"IT",color:"#1A3D2B"},
  {id:"dennis",name:"Dennis Pride",initials:"DO",color:"#1A4D35"},
];

async function loadRequests() {
  try { const r = await fetch("/api/task-requests"); return await r.json(); } catch(e) { return []; }
}
async function saveRequests(requests) {
  try { await fetch("/api/task-requests", { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify(requests) }); } catch(e) {}
}

export default function TaskRequestBoard() {
  const [currentUser, setCurrentUser] = useState(null);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState("board");
  const [activeRequest, setActiveRequest] = useState(null);

  const [form, setForm] = useState({ title:"", description:"", deadline:"", priority:"Normal" });
  const [formError, setFormError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const [completion, setCompletion] = useState({ outcome:"", notes:"" });
  const [completionError, setCompletionError] = useState("");
  const [completionDone, setCompletionDone] = useState(false);

  const isKisses = currentUser?.id === "aubreyon";
  const isLeadership = currentUser?.id === "avy" || currentUser?.id === "travis";

  useEffect(() => {
    try {
      const uid = localStorage.getItem("gtm_current_user");
      if (uid) { const u = ALL_STAFF.find(s => s.id === uid) || {id:uid,name:uid,initials:"?",color:C.burgundy}; setCurrentUser(u); }
    } catch(e) {}
    loadRequests().then(r => { setRequests(r); setLoading(false); });
  }, []);

  function submitRequest() {
    if (!form.title.trim()) { setFormError("Please enter a task title."); return; }
    if (!form.description.trim()) { setFormError("Please describe what you need done."); return; }
    const now = new Date().toLocaleDateString("en-US",{month:"long",day:"numeric",year:"numeric"});
    const req = {
      id: Date.now().toString(),
      title: form.title,
      description: form.description,
      deadline: form.deadline,
      priority: form.priority,
      requestedBy: currentUser.id,
      requestedByName: currentUser.name,
      requestedOn: now,
      status: "pending",
      completedOn: "",
      outcome: "",
      completionNotes: "",
    };
    const updated = [req, ...requests];
    setRequests(updated);
    saveRequests(updated);
    setForm({ title:"", description:"", deadline:"", priority:"Normal" });
    setFormError("");
    setSubmitted(true);
    setTimeout(() => { setSubmitted(false); setView("board"); }, 1500);
  }

  function markComplete(reqId) {
    if (!completion.outcome.trim()) { setCompletionError("Please describe what was completed."); return; }
    const now = new Date().toLocaleDateString("en-US",{month:"long",day:"numeric",year:"numeric"});
    const updated = requests.map(r => r.id !== reqId ? r : {
      ...r, status:"completed", completedOn:now,
      outcome:completion.outcome, completionNotes:completion.notes,
    });
    setRequests(updated);
    saveRequests(updated);
    setActiveRequest(updated.find(r => r.id === reqId));
    setCompletionDone(true);
    setCompletion({ outcome:"", notes:"" });
    setCompletionError("");
  }

  function deleteRequest(reqId) {
    if (!window.confirm("Delete this task request?")) return;
    const updated = requests.filter(r => r.id !== reqId);
    setRequests(updated);
    saveRequests(updated);
    setActiveRequest(null);
    setView("board");
  }

  if (loading) return <div style={{minHeight:"100vh",background:C.dark,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Inter','Segoe UI',sans-serif"}}><div style={{color:C.muted}}>Loading...</div></div>;

  if (!currentUser) return (
    <div style={{minHeight:"100vh",background:C.dark,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Inter','Segoe UI',sans-serif"}}>
      <div style={{textAlign:"center"}}>
        <div style={{color:C.ivory,fontSize:16,fontWeight:700,marginBottom:12}}>Log in first</div>
        <a href="/" style={{background:C.burgundy,borderRadius:8,padding:"11px 24px",color:C.ivory,fontSize:14,fontWeight:800,textDecoration:"none"}}>Go to Staff Portal</a>
      </div>
    </div>
  );

  // What the current user sees
  const myRequests = isKisses
    ? requests // Kisses sees all tasks assigned to her
    : isLeadership
    ? requests // Leadership sees all
    : requests.filter(r => r.requestedBy === currentUser.id); // Others see only their own

  const pendingForKisses = requests.filter(r => r.status === "pending");
  const myPending = isKisses ? pendingForKisses.length : requests.filter(r => r.requestedBy === currentUser.id && r.status === "pending").length;

  return (
    <div style={{minHeight:"100vh",background:C.dark,fontFamily:"'Inter','Segoe UI',sans-serif"}}>
      <div style={{background:"linear-gradient(135deg,"+C.burgundyDark+" 0%,"+C.dark+" 70%)",borderBottom:"2px solid "+C.gold,padding:"14px 24px",display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:10}}>
        <div>
          <div style={{color:C.gold,fontSize:10,fontWeight:800,letterSpacing:3,textTransform:"uppercase"}}>Grace Trace Ministries</div>
          <h1 style={{color:C.ivory,fontSize:17,fontWeight:900,margin:"2px 0"}}>Task Requests — Kisses 📋</h1>
          <div style={{color:C.muted,fontSize:12}}>{currentUser.name}</div>
        </div>
        <button onClick={()=>window.history.back()} style={{background:"transparent",border:"1px solid "+C.cardBorder,borderRadius:8,padding:"6px 12px",color:C.muted,fontSize:12,cursor:"pointer"}}>← Back</button>
      </div>

      {/* Tabs */}
      <div style={{background:C.dark,borderBottom:"1px solid "+C.cardBorder,display:"flex",gap:2,padding:"0 24px"}}>
        {["board", !isKisses&&"request"].filter(Boolean).map(tab=>(
          <button key={tab} onClick={()=>{setView(tab);setActiveRequest(null);}}
            style={{background:"transparent",border:"none",borderBottom:view===tab?"2px solid "+C.gold:"2px solid transparent",color:view===tab?C.gold:C.muted,fontSize:13,fontWeight:view===tab?800:500,padding:"11px 16px",cursor:"pointer"}}>
            {tab==="board"?isKisses?"My Task Queue":"My Requests":"Request a Task"}
            {tab==="board"&&myPending>0&&<span style={{background:C.error,color:C.ivory,borderRadius:20,padding:"1px 7px",fontSize:10,fontWeight:800,marginLeft:6}}>{myPending}</span>}
          </button>
        ))}
      </div>

      <div style={{maxWidth:760,margin:"0 auto",padding:"24px 20px"}}>

        {/* BOARD */}
        {view==="board"&&!activeRequest&&(
          <div>
            {isKisses&&(
              <div style={{background:C.card,border:"1px solid "+C.cardBorder,borderRadius:12,padding:"14px 18px",marginBottom:20,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <div style={{color:C.text,fontSize:14}}>Tasks assigned to you by staff</div>
                <div style={{display:"flex",gap:16}}>
                  <div style={{textAlign:"center"}}><div style={{color:C.error,fontWeight:800,fontSize:18}}>{pendingForKisses.length}</div><div style={{color:C.muted,fontSize:11}}>Pending</div></div>
                  <div style={{textAlign:"center"}}><div style={{color:"#4CAF50",fontWeight:800,fontSize:18}}>{requests.filter(r=>r.status==="completed").length}</div><div style={{color:C.muted,fontSize:11}}>Completed</div></div>
                </div>
              </div>
            )}
            {myRequests.length===0&&<div style={{background:C.card,border:"1px solid "+C.cardBorder,borderRadius:12,padding:24,textAlign:"center",color:C.muted,fontSize:14}}>No task requests yet.</div>}
            {myRequests.map(req=>{
              const requester = ALL_STAFF.find(s=>s.id===req.requestedBy);
              return(
                <div key={req.id} onClick={()=>{setActiveRequest(req);setCompletionDone(false);setCompletion({outcome:"",notes:""});setCompletionError("");}}
                  style={{background:C.card,border:"1px solid "+(req.status==="pending"?C.error+"44":req.status==="completed"?"#4CAF5044":C.cardBorder),borderRadius:12,padding:"16px 20px",marginBottom:10,cursor:"pointer"}}
                  onMouseEnter={e=>e.currentTarget.style.borderColor=C.gold+"66"}
                  onMouseLeave={e=>e.currentTarget.style.borderColor=req.status==="pending"?C.error+"44":req.status==="completed"?"#4CAF5044":C.cardBorder}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:8}}>
                    <div style={{flex:1}}>
                      <div style={{color:C.text,fontWeight:800,fontSize:14}}>{req.title}</div>
                      <div style={{color:C.muted,fontSize:12,marginTop:3}}>
                        Requested by {req.requestedByName} on {req.requestedOn}
                        {req.deadline&&` · Due: ${req.deadline}`}
                      </div>
                      {req.status==="completed"&&<div style={{color:"#4CAF50",fontSize:12,marginTop:2}}>✓ Completed on {req.completedOn}</div>}
                    </div>
                    <div style={{display:"flex",gap:6,alignItems:"center",flexDirection:"column"}}>
                      <div style={{background:req.status==="completed"?"#4CAF5022":req.status==="pending"?C.error+"22":C.cardBorder,border:"1px solid "+(req.status==="completed"?"#4CAF5044":req.status==="pending"?C.error+"44":C.cardBorder),borderRadius:20,padding:"2px 10px",color:req.status==="completed"?"#4CAF50":req.status==="pending"?C.error:C.muted,fontSize:11,fontWeight:700}}>
                        {req.status==="pending"?"⚠ Pending":"✓ Completed"}
                      </div>
                      <div style={{background:req.priority==="Urgent"?C.error+"22":req.priority==="High"?C.gold+"22":C.cardBorder,borderRadius:20,padding:"2px 10px",color:req.priority==="Urgent"?C.error:req.priority==="High"?C.gold:C.muted,fontSize:10,fontWeight:700}}>
                        {req.priority}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* REQUEST DETAIL */}
        {view==="board"&&activeRequest&&(()=>{
          const req = requests.find(r=>r.id===activeRequest.id)||activeRequest;
          const requester = ALL_STAFF.find(s=>s.id===req.requestedBy);
          const isMyRequest = req.requestedBy === currentUser.id;
          return(
            <div>
              <button onClick={()=>setActiveRequest(null)} style={{background:"transparent",border:"1px solid "+C.cardBorder,borderRadius:8,padding:"7px 14px",color:C.muted,fontSize:13,cursor:"pointer",marginBottom:16}}>← All Requests</button>
              <div style={{background:C.card,border:"1px solid "+C.cardBorder,borderRadius:12,padding:"20px 24px",marginBottom:16}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:10,marginBottom:16}}>
                  <h2 style={{color:C.ivory,fontSize:18,fontWeight:900,margin:0}}>{req.title}</h2>
                  {(isMyRequest||isLeadership)&&<button onClick={()=>deleteRequest(req.id)} style={{background:C.error+"22",border:"1px solid "+C.error+"44",borderRadius:8,padding:"6px 12px",color:C.error,fontSize:12,fontWeight:700,cursor:"pointer"}}>Delete</button>}
                </div>
                {[
                  ["Requested By",req.requestedByName],
                  ["Requested On",req.requestedOn],
                  ["Deadline",req.deadline||"No deadline set"],
                  ["Priority",req.priority],
                  ["Status",req.status==="completed"?"✓ Completed":"⚠ Pending"],
                  req.completedOn&&["Completed On",req.completedOn],
                ].filter(Boolean).map(([label,val],i)=>(
                  <div key={i} style={{display:"flex",gap:12,padding:"7px 0",borderBottom:"1px solid "+C.cardBorder}}>
                    <div style={{color:C.muted,fontSize:13,width:140,flexShrink:0}}>{label}</div>
                    <div style={{color:val.toString().includes("✓")?"#4CAF50":C.text,fontSize:13,fontWeight:val.toString().includes("✓")?700:400}}>{val}</div>
                  </div>
                ))}
                <div style={{marginTop:14}}>
                  <div style={{color:C.gold,fontSize:11,fontWeight:800,letterSpacing:1,textTransform:"uppercase",marginBottom:6}}>Task Description</div>
                  <div style={{color:C.text,fontSize:14,lineHeight:1.8}}>{req.description}</div>
                </div>
              </div>

              {/* Completion details */}
              {req.status==="completed"&&(
                <div style={{background:"#4CAF5022",border:"1px solid #4CAF5044",borderRadius:12,padding:"18px 20px",marginBottom:16}}>
                  <div style={{color:"#4CAF50",fontWeight:800,fontSize:14,marginBottom:12}}>✓ Completed by AuBreyon (Kisses) Woodley</div>
                  <div style={{color:C.text,fontSize:14,marginBottom:8}}><strong style={{color:C.gold}}>What was done:</strong> {req.outcome}</div>
                  {req.completionNotes&&<div style={{color:C.text,fontSize:14}}><strong style={{color:C.gold}}>Notes:</strong> {req.completionNotes}</div>}
                </div>
              )}

              {/* Kisses marks complete */}
              {isKisses&&req.status==="pending"&&!completionDone&&(
                <div style={{background:C.card,border:"1px solid "+C.gold+"66",borderRadius:12,padding:"18px 20px",marginBottom:16}}>
                  <div style={{color:C.gold,fontSize:11,fontWeight:800,letterSpacing:2,textTransform:"uppercase",marginBottom:14}}>Mark Task as Complete</div>
                  <div style={{marginBottom:14}}>
                    <div style={{color:C.text,fontSize:13,fontWeight:600,marginBottom:6}}>What was completed? <span style={{color:C.error}}>*</span></div>
                    <textarea value={completion.outcome} onChange={e=>setCompletion(p=>({...p,outcome:e.target.value}))} placeholder="Describe exactly what was done and what was delivered to the requesting staff member" rows={4}
                      style={{width:"100%",background:C.dark,border:"1px solid "+C.cardBorder,borderRadius:8,padding:"10px 14px",color:C.text,fontSize:14,resize:"vertical",outline:"none",fontFamily:"inherit",lineHeight:1.6}}/>
                  </div>
                  <div style={{marginBottom:14}}>
                    <div style={{color:C.text,fontSize:13,fontWeight:600,marginBottom:6}}>Additional notes (optional)</div>
                    <textarea value={completion.notes} onChange={e=>setCompletion(p=>({...p,notes:e.target.value}))} placeholder="Any additional context or follow-up needed" rows={2}
                      style={{width:"100%",background:C.dark,border:"1px solid "+C.cardBorder,borderRadius:8,padding:"10px 14px",color:C.text,fontSize:14,resize:"vertical",outline:"none",fontFamily:"inherit",lineHeight:1.6}}/>
                  </div>
                  {completionError&&<div style={{color:C.error,fontSize:13,marginBottom:10}}>{completionError}</div>}
                  <button onClick={()=>markComplete(req.id)} style={{width:"100%",background:C.green,border:"none",borderRadius:10,padding:"13px",color:C.ivory,fontSize:14,fontWeight:800,cursor:"pointer"}}>
                    ✓ Mark as Complete — Notify Requester
                  </button>
                </div>
              )}
              {completionDone&&<div style={{background:"#4CAF5022",border:"1px solid #4CAF5044",borderRadius:12,padding:14,textAlign:"center",color:"#4CAF50",fontWeight:700,fontSize:14,marginBottom:16}}>✓ Task marked complete</div>}
            </div>
          );
        })()}

        {/* SUBMIT REQUEST */}
        {view==="request"&&!isKisses&&(
          <div>
            <div style={{color:C.gold,fontSize:11,fontWeight:800,letterSpacing:2,textTransform:"uppercase",marginBottom:14}}>Request a Task from Kisses</div>
            <div style={{background:C.card,border:"1px solid "+C.gold+"33",borderRadius:12,padding:"16px 18px",marginBottom:16}}>
              <div style={{display:"flex",gap:10,alignItems:"center"}}>
                <div style={{width:40,height:40,borderRadius:"50%",background:"#4A1A5C",display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,fontWeight:800,color:C.ivory}}>KW</div>
                <div>
                  <div style={{color:C.ivory,fontWeight:700,fontSize:14}}>AuBreyon (Kisses) Woodley</div>
                  <div style={{color:C.muted,fontSize:12}}>Director of Communication — Available to assist all staff</div>
                </div>
              </div>
            </div>
            <div style={{background:C.card,border:"1px solid "+C.cardBorder,borderRadius:12,padding:"20px 22px"}}>
              <div style={{marginBottom:14}}>
                <div style={{color:C.text,fontSize:13,fontWeight:600,marginBottom:6}}>Task title</div>
                <input type="text" value={form.title} onChange={e=>setForm(p=>({...p,title:e.target.value}))} placeholder="e.g. Create a flyer for our open house event"
                  style={{width:"100%",background:C.dark,border:"1px solid "+C.cardBorder,borderRadius:8,padding:"10px 14px",color:C.text,fontSize:14,outline:"none",fontFamily:"inherit"}}/>
              </div>
              <div style={{marginBottom:14}}>
                <div style={{color:C.text,fontSize:13,fontWeight:600,marginBottom:6}}>Describe what you need done</div>
                <textarea value={form.description} onChange={e=>setForm(p=>({...p,description:e.target.value}))} placeholder="Be as specific as possible — what do you need, what format, what details should be included, and who it is for" rows={5}
                  style={{width:"100%",background:C.dark,border:"1px solid "+C.cardBorder,borderRadius:8,padding:"10px 14px",color:C.text,fontSize:14,resize:"vertical",outline:"none",fontFamily:"inherit",lineHeight:1.6}}/>
              </div>
              <div style={{marginBottom:14}}>
                <div style={{color:C.text,fontSize:13,fontWeight:600,marginBottom:6}}>Deadline (optional)</div>
                <input type="text" value={form.deadline} onChange={e=>setForm(p=>({...p,deadline:e.target.value}))} placeholder="e.g. July 18, 2026"
                  style={{width:"100%",background:C.dark,border:"1px solid "+C.cardBorder,borderRadius:8,padding:"10px 14px",color:C.text,fontSize:14,outline:"none",fontFamily:"inherit"}}/>
              </div>
              <div style={{marginBottom:20}}>
                <div style={{color:C.text,fontSize:13,fontWeight:600,marginBottom:8}}>Priority</div>
                <div style={{display:"flex",gap:8}}>
                  {["Normal","High","Urgent"].map(p=>(
                    <button key={p} onClick={()=>setForm(prev=>({...prev,priority:p}))}
                      style={{flex:1,background:form.priority===p?(p==="Urgent"?C.error:p==="High"?C.gold:C.burgundy):C.dark,border:"1px solid "+(form.priority===p?p==="Urgent"?C.error:p==="High"?C.gold:C.gold+"66":C.cardBorder),borderRadius:8,padding:"9px",color:form.priority===p?C.ivory:C.muted,fontSize:13,fontWeight:600,cursor:"pointer"}}>
                      {p}
                    </button>
                  ))}
                </div>
              </div>
              {formError&&<div style={{color:C.error,fontSize:13,marginBottom:12}}>{formError}</div>}
              {submitted&&<div style={{color:"#4CAF50",fontSize:13,fontWeight:700,marginBottom:12}}>✓ Task request sent to Kisses</div>}
              <button onClick={submitRequest} style={{width:"100%",background:C.burgundy,border:"1px solid "+C.gold+"66",borderRadius:10,padding:"13px",color:C.ivory,fontSize:14,fontWeight:800,cursor:"pointer"}}>
                Send Task Request to Kisses
              </button>
            </div>
          </div>
        )}

        <div style={{height:48}}/>
      </div>
    </div>
  );
}