"use client";
import { useState, useEffect } from "react";

const C = {
  burgundy:"#6B1A2A",burgundyDark:"#4A0E1A",green:"#1E4D2B",gold:"#C9A84C",
  ivory:"#F5F0E8",dark:"#1A0F12",card:"#2A1A1E",cardBorder:"#3D2028",
  text:"#F0EAE2",muted:"#A08878",error:"#EF5350",
};

const ALL_STAFF = [
  {id:"avy",name:"Avrial Evans (Avy)",role:"President / Executive Director",initials:"AE",color:C.burgundy},
  {id:"travis",name:"Travis Ramar",role:"VP / COO",initials:"TR",color:C.green},
  {id:"deann",name:"Deann Evans",role:"Director of Outreach",initials:"DE",color:"#8B2A3E"},
  {id:"erica",name:"Erica Evans",role:"Director of Residential Services",initials:"EE",color:"#5C3010"},
  {id:"ialana",name:"Ialana Tippins",role:"Director of Intake",initials:"IT",color:"#1A3D2B"},
  {id:"aubreyon",name:"AuBreyon (Kisses) Woodley",role:"Director of Communication",initials:"KW",color:"#4A1A5C"},
  {id:"dennis",name:"Dennis Pride",role:"Director of Operations",initials:"DO",color:"#1A4D35"},
];

async function loadTasks() {
  try { const r = await fetch("/api/mandatory-tasks"); return await r.json(); } catch(e) { return []; }
}
async function saveTasks(t) {
  try { await fetch("/api/mandatory-tasks", { method: "POST", headers: {"Content-Type":"application/json"}, body: JSON.stringify(t) }); } catch(e) {}
}

export default function MandatoryTaskBoard() {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState([]);
  const [view, setView] = useState("board");
  const [activeTask, setActiveTask] = useState(null);

  // Create task form
  const [form, setForm] = useState({
    title:"", description:"", deadline:"", requiresReceipt:true,
    requiresTracking:false, requiresMailingAddress:false,
    requiresDeliveryDate:false, customFields:[], link:"",
    attachmentName:"", attachmentData:"", attachmentType:"",
    assignedTo:"all",
  });
  const [formError, setFormError] = useState("");
  const [created, setCreated] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState("");
  const [newFieldLabel, setNewFieldLabel] = useState("");

  // Submission form
  const [submission, setSubmission] = useState({
    mailingAddress:"", orderConfirmation:"", receiptNote:"",
    trackingNumber:"", deliveryDate:"", notes:"", customAnswers:{},
    receiptFileName:"", receiptFileData:"", receiptFileType:"",
  });
  const [subError, setSubError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const isLeadership = currentUser && (currentUser.id === "avy" || currentUser.id === "travis");

  useEffect(() => {
    try {
      const uid = localStorage.getItem("gtm_current_user");
      if (uid) { const u = ALL_STAFF.find(s => s.id === uid); if (u) setCurrentUser(u); }
    } catch(e) {}
    loadTasks().then(t => { setTasks(t); setLoading(false); });
  }, []);

  function addCustomField() {
    if (!newFieldLabel.trim()) return;
    setForm(p => ({...p, customFields:[...p.customFields, {label:newFieldLabel.trim()}]}));
    setNewFieldLabel("");
  }

  function removeCustomField(i) {
    setForm(p => ({...p, customFields:p.customFields.filter((_,idx)=>idx!==i)}));
  }

  function loadTaskIntoForm(task) {
    setForm({
      title: task.title,
      description: task.description,
      deadline: task.deadline,
      requiresReceipt: task.requiresReceipt,
      requiresTracking: task.requiresTracking,
      requiresMailingAddress: task.requiresMailingAddress,
      requiresDeliveryDate: task.requiresDeliveryDate,
      customFields: task.customFields || [],
      link: task.link || "",
      attachmentName: task.attachmentName || "",
      attachmentData: task.attachmentData || "",
      attachmentType: task.attachmentType || "",
      assignedTo: "all",
    });
    setEditingTask(task.id);
    setView("edit");
    setFormError("");
    setCreated(false);
    setActiveTask(null);
  }

  async function generateWithAI() {
    if (!aiPrompt.trim()) { setAiError("Please describe the task you want to create."); return; }
    setAiLoading(true); setAiError("");
    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-6",
          max_tokens: 1000,
          messages: [{
            role: "user",
            content: `You are helping create a mandatory task for Grace Trace Ministries staff. Generate a professional task based on this request: "${aiPrompt}". 
            
Respond ONLY with a JSON object in this exact format, no markdown, no backticks:
{
  "title": "short clear task title",
  "description": "full detailed instructions for staff explaining exactly what they need to do, where to go, what to order or complete, and any important details",
  "deadline": "within 2 weeks from today",
  "requiresMailingAddress": true or false,
  "requiresReceipt": true or false,
  "requiresTracking": true or false,
  "requiresDeliveryDate": true or false,
  "customFields": ["field label 1", "field label 2"]
}`
          }]
        })
      });
      const data = await response.json();
      const text = data.content?.[0]?.text || "";
      const clean = text.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(clean);
      setForm(p => ({
        ...p,
        title: parsed.title || p.title,
        description: parsed.description || p.description,
        deadline: parsed.deadline || p.deadline,
        requiresMailingAddress: parsed.requiresMailingAddress ?? p.requiresMailingAddress,
        requiresReceipt: parsed.requiresReceipt ?? p.requiresReceipt,
        requiresTracking: parsed.requiresTracking ?? p.requiresTracking,
        requiresDeliveryDate: parsed.requiresDeliveryDate ?? p.requiresDeliveryDate,
        customFields: (parsed.customFields || []).map((label) => ({ label })),
      }));
      setAiPrompt("");
    } catch(e) {
      setAiError("Could not generate task. Try again or fill in manually.");
    }
    setAiLoading(false);
  }

  function createTask() {
    if (!form.title.trim()) { setFormError("Please enter a task title."); return; }
    if (!form.description.trim()) { setFormError("Please describe what staff need to do."); return; }
    if (!form.deadline.trim()) { setFormError("Please enter a deadline."); return; }
    // If editing existing task
    if (editingTask) {
      const updated = tasks.map(t => t.id !== editingTask ? t : {
        ...t,
        title: form.title,
        description: form.description,
        deadline: form.deadline,
        requiresReceipt: form.requiresReceipt,
        requiresTracking: form.requiresTracking,
        requiresMailingAddress: form.requiresMailingAddress,
        requiresDeliveryDate: form.requiresDeliveryDate,
        customFields: form.customFields,
        link: form.link,
        attachmentName: form.attachmentName,
        attachmentData: form.attachmentData,
        attachmentType: form.attachmentType,
      });
      setTasks(updated);
      saveTasks(updated);
      setEditingTask(null);
      setForm({title:"",description:"",deadline:"",requiresReceipt:true,requiresTracking:false,requiresMailingAddress:false,requiresDeliveryDate:false,customFields:[],link:"",attachmentName:"",attachmentData:"",attachmentType:"",assignedTo:"all"});
      setCreated(true);
      setTimeout(() => { setCreated(false); setView("board"); }, 1500);
      return;
    }
    const now = new Date().toLocaleDateString("en-US",{month:"long",day:"numeric",year:"numeric"});
    const newTask = {
      id: Date.now().toString(),
      title: form.title,
      description: form.description,
      deadline: form.deadline,
      requiresReceipt: form.requiresReceipt,
      requiresTracking: form.requiresTracking,
      requiresMailingAddress: form.requiresMailingAddress,
      requiresDeliveryDate: form.requiresDeliveryDate,
      customFields: form.customFields,
      link: form.link,
      attachmentName: form.attachmentName,
      attachmentData: form.attachmentData,
      attachmentType: form.attachmentType,
      assignedTo: form.assignedTo === "all" ? ALL_STAFF.map(s=>s.id) : form.assignedTo,
      createdBy: currentUser.id,
      createdByName: currentUser.name,
      createdOn: now,
      submissions: {},
      status: "active",
    };
    const updated = [newTask, ...tasks];
    setTasks(updated);
    saveTasks(updated);  // async, fire and forget
    setForm({title:"",description:"",deadline:"",requiresReceipt:true,requiresTracking:false,requiresMailingAddress:false,requiresDeliveryDate:false,customFields:[],link:"",attachmentName:"",attachmentData:"",attachmentType:"",assignedTo:"all"});
    setFormError("");
    setCreated(true);
    setTimeout(() => { setCreated(false); setView("board"); }, 1500);
  }

  function submitResponse(taskId) {
    const task = tasks.find(t => t.id === taskId);
    if (task.requiresMailingAddress && !submission.mailingAddress.trim()) {
      setSubError("Please enter your mailing address."); return;
    }
    if (task.requiresReceipt && !submission.receiptNote.trim() && !submission.orderConfirmation.trim()) {
      setSubError("Please enter your order confirmation number or receipt details."); return;
    }
    if (task.requiresDeliveryDate && !submission.deliveryDate.trim()) {
      setSubError("Please enter your expected delivery date."); return;
    }
    const now = new Date().toLocaleDateString("en-US",{month:"long",day:"numeric",year:"numeric"});
    const updated = tasks.map(t => {
      if (t.id !== taskId) return t;
      return {
        ...t,
        submissions: {
          ...t.submissions,
          [currentUser.id]: {
            ...submission,
            completedOn: now,
            completedByName: currentUser.name,
          }
        }
      };
    });
    setTasks(updated);
    saveTasks(updated);
    setActiveTask(updated.find(t => t.id === taskId) || null);
    setSubmitted(true);
    setSubError("");
    setSubmission({mailingAddress:"",orderConfirmation:"",receiptNote:"",trackingNumber:"",deliveryDate:"",notes:"",customAnswers:{}});
  }

  function deleteTask(taskId) {
    const updated = tasks.filter((t) => t.id !== taskId);
    setTasks(updated);
    saveTasks(updated);
    setActiveTask(null);
  }

  function closeTask(taskId) {
    const updated = tasks.map(t => t.id !== taskId ? t : {...t, status:"closed"});
    setTasks(updated);
    saveTasks(updated);
    setActiveTask(updated.find(t => t.id === taskId));
  }

  if (loading) return <div style={{minHeight:"100vh",background:C.dark,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Inter','Segoe UI',sans-serif"}}><div style={{color:C.muted}}>Loading...</div></div>;

  if (!currentUser) return (
    <div style={{minHeight:"100vh",background:C.dark,display:"flex",alignItems:"center",justifyContent:"center",padding:20,fontFamily:"'Inter','Segoe UI',sans-serif"}}>
      <div style={{textAlign:"center"}}>
        <div style={{color:C.ivory,fontSize:16,fontWeight:700,marginBottom:12}}>Log in to the Staff Portal first</div>
        <a href="/" style={{background:C.burgundy,border:"1px solid "+C.gold+"66",borderRadius:8,padding:"11px 24px",color:C.ivory,fontSize:14,fontWeight:800,textDecoration:"none"}}>Go to Staff Portal</a>
      </div>
    </div>
  );

  const myTasks = tasks.filter(t => t.assignedTo.includes(currentUser.id));
  const pendingMine = myTasks.filter(t => t.status==="active" && !t.submissions[currentUser.id]);

  return (
    <div style={{minHeight:"100vh",background:C.dark,fontFamily:"'Inter','Segoe UI',sans-serif"}}>
      <div style={{background:"linear-gradient(135deg,"+C.burgundyDark+" 0%,"+C.dark+" 70%)",borderBottom:"2px solid "+C.gold,padding:"14px 24px",display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:10}}>
        <div>
          <div style={{color:C.gold,fontSize:10,fontWeight:800,letterSpacing:3,textTransform:"uppercase"}}>Grace Trace Ministries</div>
          <h1 style={{color:C.ivory,fontSize:17,fontWeight:900,margin:"2px 0"}}>Mandatory Task Board 📌</h1>
          <div style={{color:C.muted,fontSize:12}}>{currentUser.name}</div>
        </div>
        <button onClick={()=>window.history.back()} style={{background:"transparent",border:"1px solid "+C.cardBorder,borderRadius:8,padding:"6px 12px",color:C.muted,fontSize:12,cursor:"pointer"}}>← Back</button>
      </div>

      {/* Tab nav */}
      <div style={{background:C.dark,borderBottom:"1px solid "+C.cardBorder,display:"flex",gap:2,padding:"0 24px"}}>
        {["board", isLeadership&&"create", editingTask&&isLeadership&&"edit", isLeadership&&"tracker"].filter(Boolean).map(tab=>(
          <button key={tab} onClick={()=>{setView(tab);setActiveTask(null);setSubmitted(false);}}
            style={{background:"transparent",border:"none",borderBottom:view===tab?"2px solid "+C.gold:"2px solid transparent",color:view===tab?C.gold:C.muted,fontSize:13,fontWeight:view===tab?800:500,padding:"11px 16px",cursor:"pointer"}}>
            {tab==="board"?"My Tasks":tab==="create"?"Create Task":tab==="edit"?"Edit Task":"Track Completion"}
            {tab==="board"&&pendingMine.length>0&&<span style={{background:C.error,color:C.ivory,borderRadius:20,padding:"1px 7px",fontSize:10,fontWeight:800,marginLeft:6}}>{pendingMine.length}</span>}
          </button>
        ))}
      </div>

      <div style={{maxWidth:760,margin:"0 auto",padding:"24px 20px"}}>

        {/* TASK BOARD */}
        {view==="board"&&!activeTask&&(
          <div>
            <div style={{color:C.gold,fontSize:11,fontWeight:800,letterSpacing:2,textTransform:"uppercase",marginBottom:14}}>Your Mandatory Tasks</div>
            {myTasks.length===0&&(
              <div style={{background:C.card,border:"1px solid "+C.cardBorder,borderRadius:12,padding:24,textAlign:"center",color:C.muted,fontSize:14}}>No mandatory tasks assigned yet.</div>
            )}
            {myTasks.map(task=>{
              const mySub = task.submissions[currentUser.id];
              const completedCount = Object.keys(task.submissions).length;
              const totalAssigned = task.assignedTo.length;
              return(
                <div key={task.id} onClick={()=>{setActiveTask(task);setSubmitted(false);setSubmission({mailingAddress:"",orderConfirmation:"",receiptNote:"",trackingNumber:"",deliveryDate:"",notes:"",customAnswers:{}}); setSubError("");}}
                  style={{background:C.card,border:"1px solid "+(mySub?"#4CAF5044":task.status==="closed"?C.cardBorder:C.error+"44"),borderRadius:12,padding:"16px 20px",marginBottom:10,cursor:"pointer"}}
                  onMouseEnter={e=>e.currentTarget.style.borderColor=C.gold+"66"}
                  onMouseLeave={e=>e.currentTarget.style.borderColor=mySub?"#4CAF5044":task.status==="closed"?C.cardBorder:C.error+"44"}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:8}}>
                    <div style={{flex:1}}>
                      <div style={{color:C.text,fontWeight:800,fontSize:15}}>{task.title}</div>
                      <div style={{color:C.muted,fontSize:12,marginTop:3}}>Due: {task.deadline} — Created by {task.createdByName}</div>
                      <div style={{color:C.muted,fontSize:12,marginTop:2}}>{completedCount} of {totalAssigned} staff completed</div>
                    </div>
                    <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:4}}>
                      <div style={{display:"flex",flexDirection:"column",gap:4,alignItems:"flex-end"}}>
                        <div style={{background:task.status==="closed"?C.cardBorder:mySub?"#4CAF5022":C.error+"22",border:"1px solid "+(task.status==="closed"?C.cardBorder:mySub?"#4CAF5044":C.error+"44"),borderRadius:20,padding:"2px 10px",color:task.status==="closed"?C.muted:mySub?"#4CAF50":C.error,fontSize:11,fontWeight:700}}>
                          {task.status==="closed"?"Closed":mySub?"✓ Completed":"⚠ Action Required"}
                        </div>
                        {isLeadership&&<button onClick={e=>{e.stopPropagation();loadTaskIntoForm(task);}} style={{background:C.gold+"22",border:"1px solid "+C.gold+"44",borderRadius:8,padding:"3px 10px",color:C.gold,fontSize:11,cursor:"pointer"}}>Edit</button>}
                        {isLeadership&&<button onClick={e=>{e.stopPropagation();if(window.confirm("Delete this task permanently?"))deleteTask(task.id);}} style={{background:C.error+"22",border:"1px solid "+C.error+"44",borderRadius:8,padding:"3px 10px",color:C.error,fontSize:11,cursor:"pointer"}}>Delete</button>}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* TASK DETAIL */}
        {view==="board"&&activeTask&&(()=>{
          const task = tasks.find(t=>t.id===activeTask.id)||activeTask;
          const mySub = task.submissions[currentUser.id];
          return(
            <div>
              <button onClick={()=>{setActiveTask(null);setSubmitted(false);}} style={{background:"transparent",border:"1px solid "+C.cardBorder,borderRadius:8,padding:"7px 14px",color:C.muted,fontSize:13,cursor:"pointer",marginBottom:16}}>← All Tasks</button>

              <div style={{background:C.card,border:"1px solid "+C.cardBorder,borderRadius:12,padding:"20px 24px",marginBottom:16}}>
                <div style={{color:C.gold,fontSize:10,fontWeight:800,letterSpacing:2,textTransform:"uppercase",marginBottom:6}}>Mandatory Task</div>
                <h2 style={{color:C.ivory,fontSize:20,fontWeight:900,margin:"0 0 8px"}}>{task.title}</h2>
                <div style={{color:C.muted,fontSize:13,marginBottom:16}}>Due: {task.deadline} | Created by {task.createdByName} on {task.createdOn}</div>
                <div style={{background:C.dark,borderRadius:10,padding:"14px 16px",marginBottom:16}}>
                  <div style={{color:C.text,fontSize:14,lineHeight:1.8}}>{task.description}</div>
                </div>
                {task.link&&(
                  <div style={{marginTop:12,padding:"12px 16px",background:C.dark,borderRadius:10,border:"1px solid "+C.cardBorder}}>
                    <div style={{color:C.gold,fontSize:11,fontWeight:800,letterSpacing:1,textTransform:"uppercase",marginBottom:6}}>Link / Resource</div>
                    <a href={task.link} target="_blank" rel="noreferrer" style={{color:C.gold,fontSize:14,wordBreak:"break-all"}}>🔗 {task.link}</a>
                  </div>
                )}
                {task.attachmentData&&(
                  <div style={{marginTop:12,padding:"14px 16px",background:C.dark,borderRadius:10,border:"1px solid "+C.cardBorder}}>
                    <div style={{color:C.gold,fontSize:11,fontWeight:800,letterSpacing:1,textTransform:"uppercase",marginBottom:10}}>Attached File</div>
                    {task.attachmentType?.includes("pdf")?
                      <div>
                        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}>
                          <span style={{fontSize:24}}>📄</span>
                          <span style={{color:C.text,fontSize:13,fontWeight:600}}>{task.attachmentName}</span>
                        </div>
                        <a href={task.attachmentData} download={task.attachmentName} style={{display:"inline-block",background:C.burgundy,border:"1px solid "+C.gold+"66",borderRadius:8,padding:"8px 16px",color:C.ivory,fontSize:13,fontWeight:700,textDecoration:"none",marginRight:10}}>⬇ Download PDF</a>
                        <a href={task.attachmentData} target="_blank" rel="noreferrer" style={{display:"inline-block",background:C.dark,border:"1px solid "+C.cardBorder,borderRadius:8,padding:"8px 16px",color:C.muted,fontSize:13,fontWeight:600,textDecoration:"none"}}>Open in New Tab</a>
                      </div>
                    :
                      <div>
                        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}>
                          <span style={{fontSize:24}}>🖼</span>
                          <span style={{color:C.text,fontSize:13,fontWeight:600}}>{task.attachmentName}</span>
                        </div>
                        <img src={task.attachmentData} alt={task.attachmentName} style={{width:"100%",maxHeight:400,objectFit:"contain",borderRadius:8,border:"1px solid "+C.cardBorder}}/>
                        <a href={task.attachmentData} download={task.attachmentName} style={{display:"inline-block",marginTop:10,background:C.burgundy,border:"1px solid "+C.gold+"66",borderRadius:8,padding:"8px 16px",color:C.ivory,fontSize:13,fontWeight:700,textDecoration:"none"}}>⬇ Download Image</a>
                      </div>
                    }
                  </div>
                )}
                <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                  {task.requiresMailingAddress&&<div style={{background:C.burgundy+"33",border:"1px solid "+C.burgundy,borderRadius:20,padding:"3px 12px",color:C.ivory,fontSize:11,fontWeight:700}}>📦 Mailing Address Required</div>}
                  {task.requiresReceipt&&<div style={{background:C.burgundy+"33",border:"1px solid "+C.burgundy,borderRadius:20,padding:"3px 12px",color:C.ivory,fontSize:11,fontWeight:700}}>🧾 Receipt / Confirmation Required</div>}
                  {task.requiresTracking&&<div style={{background:C.burgundy+"33",border:"1px solid "+C.burgundy,borderRadius:20,padding:"3px 12px",color:C.ivory,fontSize:11,fontWeight:700}}>📍 Tracking Number Required</div>}
                  {task.requiresDeliveryDate&&<div style={{background:C.burgundy+"33",border:"1px solid "+C.burgundy,borderRadius:20,padding:"3px 12px",color:C.ivory,fontSize:11,fontWeight:700}}>📅 Delivery Date Required</div>}
                </div>
              </div>

              {/* Submit response */}
              {!mySub&&task.status==="active"&&!submitted&&(
                <div style={{background:C.card,border:"1px solid "+C.gold+"66",borderRadius:12,padding:"20px 22px",marginBottom:16}}>
                  <div style={{color:C.gold,fontSize:11,fontWeight:800,letterSpacing:2,textTransform:"uppercase",marginBottom:16}}>Complete This Task</div>

                  {task.requiresMailingAddress&&(
                    <div style={{marginBottom:16}}>
                      <div style={{color:C.text,fontSize:13,fontWeight:600,marginBottom:6}}>📦 Your mailing address for delivery <span style={{color:C.error}}>*</span></div>
                      <textarea value={submission.mailingAddress} onChange={e=>setSubmission(p=>({...p,mailingAddress:e.target.value}))} placeholder="Full mailing address — Street, City, State, ZIP" rows={3}
                        style={{width:"100%",background:C.dark,border:"1px solid "+C.cardBorder,borderRadius:8,padding:"10px 14px",color:C.text,fontSize:14,resize:"vertical",outline:"none",fontFamily:"inherit",lineHeight:1.6}}/>
                    </div>
                  )}

                  {task.requiresReceipt&&(
                    <div style={{marginBottom:16}}>
                      <div style={{color:C.text,fontSize:13,fontWeight:600,marginBottom:6}}>🧾 Receipt or order confirmation <span style={{color:C.error}}>*</span></div>
                      <input type="text" value={submission.orderConfirmation} onChange={e=>setSubmission(p=>({...p,orderConfirmation:e.target.value}))} placeholder="Order or confirmation number"
                        style={{width:"100%",background:C.dark,border:"1px solid "+C.cardBorder,borderRadius:8,padding:"10px 14px",color:C.text,fontSize:14,outline:"none",fontFamily:"inherit",marginBottom:8}}/>
                      <textarea value={submission.receiptNote} onChange={e=>setSubmission(p=>({...p,receiptNote:e.target.value}))} placeholder="Describe your order — vendor, amount paid, item ordered, date ordered" rows={2}
                        style={{width:"100%",background:C.dark,border:"1px solid "+C.cardBorder,borderRadius:8,padding:"10px 14px",color:C.text,fontSize:14,resize:"vertical",outline:"none",fontFamily:"inherit",lineHeight:1.6,marginBottom:8}}/>
                      <div style={{color:C.text,fontSize:13,fontWeight:600,marginBottom:6}}>📎 Upload receipt photo or PDF</div>
                      <input type="file" accept=".pdf,image/*" onChange={e=>{
                        const file=e.target.files[0];
                        if(!file)return;
                        if(file.size>5*1024*1024){alert("File must be under 5MB.");return;}
                        const reader=new FileReader();
                        reader.onload=ev=>setSubmission(p=>({...p,receiptFileName:file.name,receiptFileData:ev.target.result,receiptFileType:file.type}));
                        reader.readAsDataURL(file);
                      }} style={{width:"100%",background:C.dark,border:"1px solid "+C.cardBorder,borderRadius:8,padding:"10px 14px",color:C.text,fontSize:13,cursor:"pointer",fontFamily:"inherit"}}/>
                      {submission.receiptFileName&&(
                        <div style={{marginTop:8,display:"flex",alignItems:"center",gap:10,background:C.dark,border:"1px solid "+C.green,borderRadius:8,padding:"8px 14px"}}>
                          <span style={{fontSize:18}}>{submission.receiptFileType?.includes("pdf")?"📄":"🖼"}</span>
                          <span style={{color:"#4CAF50",fontSize:13,fontWeight:600,flex:1}}>{submission.receiptFileName}</span>
                          <button onClick={()=>setSubmission(p=>({...p,receiptFileName:"",receiptFileData:"",receiptFileType:""}))} style={{background:"transparent",border:"none",color:C.error,fontSize:16,cursor:"pointer"}}>✕</button>
                        </div>
                      )}
                    </div>
                  )}

                  {task.requiresTracking&&(
                    <div style={{marginBottom:16}}>
                      <div style={{color:C.text,fontSize:13,fontWeight:600,marginBottom:6}}>📍 Tracking number <span style={{color:C.muted,fontWeight:400}}>(if available)</span></div>
                      <input type="text" value={submission.trackingNumber} onChange={e=>setSubmission(p=>({...p,trackingNumber:e.target.value}))} placeholder="Tracking number — e.g. 1Z999AA10123456784"
                        style={{width:"100%",background:C.dark,border:"1px solid "+C.cardBorder,borderRadius:8,padding:"10px 14px",color:C.text,fontSize:14,outline:"none",fontFamily:"inherit"}}/>
                    </div>
                  )}

                  {task.requiresDeliveryDate&&(
                    <div style={{marginBottom:16}}>
                      <div style={{color:C.text,fontSize:13,fontWeight:600,marginBottom:6}}>📅 Expected delivery date <span style={{color:C.error}}>*</span></div>
                      <input type="text" value={submission.deliveryDate} onChange={e=>setSubmission(p=>({...p,deliveryDate:e.target.value}))} placeholder="e.g. July 18, 2026"
                        style={{width:"100%",background:C.dark,border:"1px solid "+C.cardBorder,borderRadius:8,padding:"10px 14px",color:C.text,fontSize:14,outline:"none",fontFamily:"inherit"}}/>
                    </div>
                  )}

                  {task.customFields?.map((field,i)=>(
                    <div key={i} style={{marginBottom:16}}>
                      <div style={{color:C.text,fontSize:13,fontWeight:600,marginBottom:6}}>{field.label}</div>
                      <input type="text" value={submission.customAnswers[i]||""} onChange={e=>setSubmission(p=>({...p,customAnswers:{...p.customAnswers,[i]:e.target.value}}))} placeholder="Your answer"
                        style={{width:"100%",background:C.dark,border:"1px solid "+C.cardBorder,borderRadius:8,padding:"10px 14px",color:C.text,fontSize:14,outline:"none",fontFamily:"inherit"}}/>
                    </div>
                  ))}

                  <div style={{marginBottom:16}}>
                    <div style={{color:C.text,fontSize:13,fontWeight:600,marginBottom:6}}>Additional notes <span style={{color:C.muted,fontWeight:400}}>(optional)</span></div>
                    <textarea value={submission.notes} onChange={e=>setSubmission(p=>({...p,notes:e.target.value}))} placeholder="Anything else you want Avy or Travis to know about your completion of this task" rows={3}
                      style={{width:"100%",background:C.dark,border:"1px solid "+C.cardBorder,borderRadius:8,padding:"10px 14px",color:C.text,fontSize:14,resize:"vertical",outline:"none",fontFamily:"inherit",lineHeight:1.6}}/>
                  </div>

                  {subError&&<div style={{color:C.error,fontSize:13,marginBottom:12}}>{subError}</div>}
                  <button onClick={()=>submitResponse(task.id)} style={{width:"100%",background:C.green,border:"none",borderRadius:10,padding:"13px",color:C.ivory,fontSize:14,fontWeight:800,cursor:"pointer"}}>
                    ✓ Mark as Complete — Submit
                  </button>
                </div>
              )}

              {(submitted||mySub)&&(
                <div style={{background:"#4CAF5022",border:"1px solid #4CAF5044",borderRadius:12,padding:"18px 20px",marginBottom:16}}>
                  <div style={{color:"#4CAF50",fontWeight:800,fontSize:15,marginBottom:12}}>✓ Task Completed</div>
                  {[
                    mySub?.mailingAddress&&["Mailing Address",mySub.mailingAddress],
                    mySub?.orderConfirmation&&["Order Confirmation",mySub.orderConfirmation],
                    mySub?.receiptNote&&["Receipt / Confirmation Details",mySub.receiptNote],
                    mySub?.receiptFileName&&["Receipt File",mySub.receiptFileName],
                    mySub?.trackingNumber&&["Tracking Number",mySub.trackingNumber],
                    mySub?.deliveryDate&&["Expected Delivery",mySub.deliveryDate],
                    mySub?.notes&&["Notes",mySub.notes],
                    mySub?.completedOn&&["Completed On",mySub.completedOn],
                  ].filter(Boolean).map(([label,val],i)=>(
                    <div key={i} style={{display:"flex",gap:12,padding:"7px 0",borderBottom:"1px solid #4CAF5022"}}>
                      <div style={{color:"#4CAF5088",fontSize:13,width:180,flexShrink:0}}>{label}</div>
                      <div style={{color:C.text,fontSize:13}}>{val}</div>
                    </div>
                  ))}
                  {mySub?.customAnswers&&task.customFields?.map((field,i)=>mySub.customAnswers[i]?(
                    <div key={i} style={{display:"flex",gap:12,padding:"7px 0",borderBottom:"1px solid #4CAF5022"}}>
                      <div style={{color:"#4CAF5088",fontSize:13,width:180,flexShrink:0}}>{field.label}</div>
                      <div style={{color:C.text,fontSize:13}}>{mySub.customAnswers[i]}</div>
                    </div>
                  ):null)}
                </div>
              )}
            </div>
          );
        })()}

        {/* CREATE TASK */}
        {view==="create"&&isLeadership&&(
          <div>
            <div style={{color:C.gold,fontSize:11,fontWeight:800,letterSpacing:2,textTransform:"uppercase",marginBottom:14}}>Create a Mandatory Task</div>
            <div style={{background:C.card,border:"1px solid "+C.cardBorder,borderRadius:12,padding:"20px 22px"}}>
              {/* AI Assist */}
              <div style={{background:C.dark,border:"1px solid "+C.gold+"44",borderRadius:12,padding:"16px",marginBottom:20}}>
                <div style={{color:C.gold,fontSize:11,fontWeight:800,letterSpacing:2,textTransform:"uppercase",marginBottom:8}}>✨ AI Task Assistant</div>
                <div style={{color:C.muted,fontSize:12,marginBottom:10}}>Describe the task in a few words and AI will fill in the full details for you.</div>
                <div style={{display:"flex",gap:8,marginBottom:8}}>
                  <input type="text" value={aiPrompt} onChange={e=>{setAiPrompt(e.target.value);setAiError("");}} onKeyDown={e=>e.key==="Enter"&&generateWithAI()} placeholder="e.g. everyone needs to order corporate shirts, mail to their address"
                    style={{flex:1,background:C.card,border:"1px solid "+C.cardBorder,borderRadius:8,padding:"10px 14px",color:C.text,fontSize:13,outline:"none",fontFamily:"inherit"}}/>
                  <button onClick={generateWithAI} disabled={aiLoading}
                    style={{background:C.gold,border:"none",borderRadius:8,padding:"10px 18px",color:C.dark,fontSize:13,fontWeight:800,cursor:aiLoading?"not-allowed":"pointer",flexShrink:0,opacity:aiLoading?0.7:1}}>
                    {aiLoading?"Generating...":"Generate ✨"}
                  </button>
                </div>
                {aiError&&<div style={{color:C.error,fontSize:12}}>{aiError}</div>}
              </div>

              <div style={{marginBottom:14}}>
                <div style={{color:C.text,fontSize:13,fontWeight:600,marginBottom:6}}>Task title</div>
                <input type="text" value={form.title} onChange={e=>setForm(p=>({...p,title:e.target.value}))} placeholder="e.g. Order Grace Trace Corporate Shirts"
                  style={{width:"100%",background:C.dark,border:"1px solid "+C.cardBorder,borderRadius:8,padding:"10px 14px",color:C.text,fontSize:14,outline:"none",fontFamily:"inherit"}}/>
              </div>
              <div style={{marginBottom:14}}>
                <div style={{color:C.text,fontSize:13,fontWeight:600,marginBottom:6}}>Instructions — tell staff exactly what to do</div>
                <textarea value={form.description} onChange={e=>setForm(p=>({...p,description:e.target.value}))} placeholder="e.g. All staff are required to order their Grace Trace Ministries corporate shirt. Go to the link below, select your size, and ship to your mailing address. Shirts must be ordered by the deadline below. Upload your receipt confirmation and tracking number once ordered." rows={5}
                  style={{width:"100%",background:C.dark,border:"1px solid "+C.cardBorder,borderRadius:8,padding:"10px 14px",color:C.text,fontSize:14,resize:"vertical",outline:"none",fontFamily:"inherit",lineHeight:1.6}}/>
              </div>
              <div style={{marginBottom:14}}>
                <div style={{color:C.text,fontSize:13,fontWeight:600,marginBottom:6}}>Link <span style={{color:C.muted,fontWeight:400}}>(optional — website, order page, or shared file)</span></div>
                <input type="text" value={form.link||""} onChange={e=>setForm(p=>({...p,link:e.target.value}))} placeholder="e.g. https://orderlink.com/gracetrace or Google Drive link to a photo or file"
                  style={{width:"100%",background:C.dark,border:"1px solid "+C.cardBorder,borderRadius:8,padding:"10px 14px",color:C.text,fontSize:14,outline:"none",fontFamily:"inherit"}}/>
                <div style={{color:C.muted,fontSize:12,marginTop:5}}>This link will be visible to all staff on the task. Use it to share an order page, photo, document, or any file they need to reference.</div>
              </div>
              <div style={{marginBottom:14}}>
                <div style={{color:C.text,fontSize:13,fontWeight:600,marginBottom:6}}>Upload a file <span style={{color:C.muted,fontWeight:400}}>(optional — PDF, photo, or image)</span></div>
                <input type="file" accept=".pdf,image/*" onChange={e=>{
                  const file=e.target.files[0];
                  if(!file)return;
                  if(file.size>5*1024*1024){alert("File must be under 5MB.");return;}
                  const reader=new FileReader();
                  reader.onload=ev=>setForm(p=>({...p,attachmentName:file.name,attachmentData:ev.target.result,attachmentType:file.type}));
                  reader.readAsDataURL(file);
                }} style={{width:"100%",background:C.dark,border:"1px solid "+C.cardBorder,borderRadius:8,padding:"10px 14px",color:C.text,fontSize:13,cursor:"pointer",fontFamily:"inherit"}}/>
                {form.attachmentName&&(
                  <div style={{marginTop:8,display:"flex",alignItems:"center",gap:10,background:C.dark,border:"1px solid "+C.green,borderRadius:8,padding:"8px 14px"}}>
                    <span style={{fontSize:18}}>{form.attachmentType?.includes("pdf")?"📄":"🖼"}</span>
                    <span style={{color:"#4CAF50",fontSize:13,fontWeight:600,flex:1}}>{form.attachmentName}</span>
                    <button onClick={()=>setForm(p=>({...p,attachmentName:"",attachmentData:"",attachmentType:""}))} style={{background:"transparent",border:"none",color:C.error,fontSize:16,cursor:"pointer"}}>✕</button>
                  </div>
                )}
                <div style={{color:C.muted,fontSize:12,marginTop:5}}>Max file size 5MB. Staff will be able to view this file directly inside the task — no external link needed.</div>
              </div>
              <div style={{marginBottom:14}}>
                <div style={{color:C.text,fontSize:13,fontWeight:600,marginBottom:6}}>Deadline</div>
                <input type="text" value={form.deadline} onChange={e=>setForm(p=>({...p,deadline:e.target.value}))} placeholder="e.g. July 25, 2026"
                  style={{width:"100%",background:C.dark,border:"1px solid "+C.cardBorder,borderRadius:8,padding:"10px 14px",color:C.text,fontSize:14,outline:"none",fontFamily:"inherit"}}/>
              </div>

              <div style={{marginBottom:16}}>
                <div style={{color:C.text,fontSize:13,fontWeight:600,marginBottom:10}}>What do staff need to submit?</div>
                <div style={{display:"flex",flexDirection:"column",gap:10}}>
                  {[
                    {key:"requiresMailingAddress",label:"📦 Mailing address — where to ship their item"},
                    {key:"requiresReceipt",label:"🧾 Receipt or order confirmation — proof they completed the task"},
                    {key:"requiresTracking",label:"📍 Tracking number — if their order has one"},
                    {key:"requiresDeliveryDate",label:"📅 Expected delivery date"},
                  ].map(opt=>(
                    <button key={opt.key} onClick={()=>setForm(p=>({...p,[opt.key]:!p[opt.key]}))}
                      style={{background:form[opt.key]?C.burgundy:C.dark,border:"1px solid "+(form[opt.key]?C.gold+"66":C.cardBorder),borderRadius:10,padding:"11px 16px",color:form[opt.key]?C.ivory:C.muted,fontSize:13,fontWeight:600,cursor:"pointer",textAlign:"left",display:"flex",alignItems:"center",gap:10}}>
                      <span style={{width:20,height:20,borderRadius:4,background:form[opt.key]?C.gold:C.cardBorder,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,flexShrink:0}}>{form[opt.key]?"✓":""}</span>
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{marginBottom:16}}>
                <div style={{color:C.text,fontSize:13,fontWeight:600,marginBottom:8}}>Add custom fields <span style={{color:C.muted,fontWeight:400}}>(optional — for anything else you need from staff)</span></div>
                <div style={{display:"flex",gap:8,marginBottom:8}}>
                  <input type="text" value={newFieldLabel} onChange={e=>setNewFieldLabel(e.target.value)} onKeyDown={e=>e.key==="Enter"&&addCustomField()} placeholder="e.g. Shirt size, preferred color, shirt style"
                    style={{flex:1,background:C.dark,border:"1px solid "+C.cardBorder,borderRadius:8,padding:"9px 12px",color:C.text,fontSize:13,outline:"none",fontFamily:"inherit"}}/>
                  <button onClick={addCustomField} style={{background:C.burgundy,border:"1px solid "+C.gold+"66",borderRadius:8,padding:"9px 16px",color:C.ivory,fontSize:13,fontWeight:700,cursor:"pointer"}}>Add</button>
                </div>
                {form.customFields.map((f,i)=>(
                  <div key={i} style={{display:"flex",alignItems:"center",gap:8,background:C.dark,border:"1px solid "+C.cardBorder,borderRadius:8,padding:"9px 12px",marginBottom:6}}>
                    <span style={{color:C.text,fontSize:13,flex:1}}>{f.label}</span>
                    <button onClick={()=>removeCustomField(i)} style={{background:"transparent",border:"none",color:C.error,fontSize:16,cursor:"pointer",padding:"0 4px"}}>✕</button>
                  </div>
                ))}
              </div>

              <div style={{marginBottom:20}}>
                <div style={{color:C.text,fontSize:13,fontWeight:600,marginBottom:8}}>Assign to</div>
                <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                  <button onClick={()=>setForm(p=>({...p,assignedTo:"all"}))}
                    style={{background:form.assignedTo==="all"?C.burgundy:C.dark,border:"1px solid "+(form.assignedTo==="all"?C.gold+"66":C.cardBorder),borderRadius:8,padding:"8px 16px",color:form.assignedTo==="all"?C.ivory:C.muted,fontSize:13,fontWeight:600,cursor:"pointer"}}>
                    All Staff
                  </button>
                </div>
              </div>

              {formError&&<div style={{color:C.error,fontSize:13,marginBottom:12}}>{formError}</div>}
              {created&&<div style={{color:"#4CAF50",fontSize:13,fontWeight:700,marginBottom:12}}>✓ Task created and sent to all staff</div>}
              <button onClick={createTask} style={{width:"100%",background:C.burgundy,border:"1px solid "+C.gold+"66",borderRadius:10,padding:"13px",color:C.ivory,fontSize:14,fontWeight:800,cursor:"pointer"}}>
                {editingTask ? "✓ Save Changes" : "📌 Send Mandatory Task to Staff"}
              </button>
              {editingTask && <button onClick={()=>{setEditingTask(null);setForm({title:"",description:"",deadline:"",requiresReceipt:true,requiresTracking:false,requiresMailingAddress:false,requiresDeliveryDate:false,customFields:[],link:"",attachmentName:"",attachmentData:"",attachmentType:"",assignedTo:"all"});setView("board");}} style={{width:"100%",background:"transparent",border:"1px solid "+C.cardBorder,borderRadius:10,padding:"11px",color:C.muted,fontSize:13,cursor:"pointer",marginTop:8}}>Cancel Edit</button>}
            </div>
          </div>
        )}

        {/* EDIT TASK */}
        {view==="edit"&&isLeadership&&editingTask&&(
          <div>
            <div style={{color:C.gold,fontSize:11,fontWeight:800,letterSpacing:2,textTransform:"uppercase",marginBottom:14}}>Edit Mandatory Task</div>
            <div style={{background:C.card,border:"1px solid "+C.cardBorder,borderRadius:12,padding:"20px 22px"}}>
              <div style={{marginBottom:14}}>
                <div style={{color:C.text,fontSize:13,fontWeight:600,marginBottom:6}}>Task title</div>
                <input type="text" value={form.title} onChange={e=>setForm(p=>({...p,title:e.target.value}))} placeholder="Task title"
                  style={{width:"100%",background:C.dark,border:"1px solid "+C.cardBorder,borderRadius:8,padding:"10px 14px",color:C.text,fontSize:14,outline:"none",fontFamily:"inherit"}}/>
              </div>
              <div style={{marginBottom:14}}>
                <div style={{color:C.text,fontSize:13,fontWeight:600,marginBottom:6}}>Instructions</div>
                <textarea value={form.description} onChange={e=>setForm(p=>({...p,description:e.target.value}))} rows={5}
                  style={{width:"100%",background:C.dark,border:"1px solid "+C.cardBorder,borderRadius:8,padding:"10px 14px",color:C.text,fontSize:14,resize:"vertical",outline:"none",fontFamily:"inherit",lineHeight:1.6}}/>
              </div>
              <div style={{marginBottom:14}}>
                <div style={{color:C.text,fontSize:13,fontWeight:600,marginBottom:6}}>Deadline</div>
                <input type="text" value={form.deadline} onChange={e=>setForm(p=>({...p,deadline:e.target.value}))} placeholder="e.g. July 25, 2026"
                  style={{width:"100%",background:C.dark,border:"1px solid "+C.cardBorder,borderRadius:8,padding:"10px 14px",color:C.text,fontSize:14,outline:"none",fontFamily:"inherit"}}/>
              </div>
              <div style={{marginBottom:14}}>
                <div style={{color:C.text,fontSize:13,fontWeight:600,marginBottom:6}}>Link (optional)</div>
                <input type="text" value={form.link||""} onChange={e=>setForm(p=>({...p,link:e.target.value}))} placeholder="Order page, Google Drive link, or resource URL"
                  style={{width:"100%",background:C.dark,border:"1px solid "+C.cardBorder,borderRadius:8,padding:"10px 14px",color:C.text,fontSize:14,outline:"none",fontFamily:"inherit"}}/>
              </div>
              <div style={{marginBottom:16}}>
                <div style={{color:C.text,fontSize:13,fontWeight:600,marginBottom:10}}>What do staff need to submit?</div>
                <div style={{display:"flex",flexDirection:"column",gap:10}}>
                  {[
                    {key:"requiresMailingAddress",label:"📦 Mailing address"},
                    {key:"requiresReceipt",label:"🧾 Receipt or order confirmation"},
                    {key:"requiresTracking",label:"📍 Tracking number"},
                    {key:"requiresDeliveryDate",label:"📅 Expected delivery date"},
                  ].map(opt=>(
                    <button key={opt.key} onClick={()=>setForm(p=>({...p,[opt.key]:!p[opt.key]}))}
                      style={{background:form[opt.key]?C.burgundy:C.dark,border:"1px solid "+(form[opt.key]?C.gold+"66":C.cardBorder),borderRadius:10,padding:"11px 16px",color:form[opt.key]?C.ivory:C.muted,fontSize:13,fontWeight:600,cursor:"pointer",textAlign:"left",display:"flex",alignItems:"center",gap:10}}>
                      <span style={{width:20,height:20,borderRadius:4,background:form[opt.key]?C.gold:C.cardBorder,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,flexShrink:0}}>{form[opt.key]?"✓":""}</span>
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
              {formError&&<div style={{color:C.error,fontSize:13,marginBottom:12}}>{formError}</div>}
              {created&&<div style={{color:"#4CAF50",fontSize:13,fontWeight:700,marginBottom:12}}>✓ Task updated</div>}
              <button onClick={createTask} style={{width:"100%",background:C.green,border:"none",borderRadius:10,padding:"13px",color:C.ivory,fontSize:14,fontWeight:800,cursor:"pointer",marginBottom:10}}>
                ✓ Save Changes
              </button>
              <button onClick={()=>{setEditingTask(null);setForm({title:"",description:"",deadline:"",requiresReceipt:true,requiresTracking:false,requiresMailingAddress:false,requiresDeliveryDate:false,customFields:[],link:"",attachmentName:"",attachmentData:"",attachmentType:"",assignedTo:"all"});setView("board");}}
                style={{width:"100%",background:"transparent",border:"1px solid "+C.cardBorder,borderRadius:10,padding:"11px",color:C.muted,fontSize:13,cursor:"pointer"}}>
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* TRACK COMPLETION */}
        {view==="tracker"&&isLeadership&&(
          <div>
            <div style={{color:C.gold,fontSize:11,fontWeight:800,letterSpacing:2,textTransform:"uppercase",marginBottom:14}}>Task Completion Tracker</div>
            {tasks.length===0&&(
              <div style={{background:C.card,border:"1px solid "+C.cardBorder,borderRadius:12,padding:24,textAlign:"center",color:C.muted,fontSize:14}}>No mandatory tasks created yet.</div>
            )}
            {tasks.map(task=>{
              const completedIds = Object.keys(task.submissions);
              const totalAssigned = task.assignedTo.length;
              const pct = totalAssigned ? Math.round(completedIds.length/totalAssigned*100) : 0;
              return(
                <div key={task.id} style={{background:C.card,border:"1px solid "+C.cardBorder,borderRadius:12,padding:"18px 20px",marginBottom:16}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:8,marginBottom:12}}>
                    <div>
                      <div style={{color:C.text,fontWeight:800,fontSize:15}}>{task.title}</div>
                      <div style={{color:C.muted,fontSize:12,marginTop:3}}>Due: {task.deadline} | Created by {task.createdByName} on {task.createdOn}</div>
                    </div>
                    <div style={{display:"flex",gap:8,alignItems:"center"}}>
                      <div style={{color:pct===100?"#4CAF50":C.gold,fontWeight:800,fontSize:14}}>{completedIds.length}/{totalAssigned}</div>
                      {task.status==="active"&&isLeadership&&(
                        <button onClick={()=>closeTask(task.id)} style={{background:"transparent",border:"1px solid "+C.cardBorder,borderRadius:8,padding:"4px 10px",color:C.muted,fontSize:11,cursor:"pointer"}}>Close Task</button>
                      )}
                      {isLeadership&&(
                        <button onClick={e=>{e.stopPropagation();if(window.confirm("Delete this task permanently?"))deleteTask(task.id);}} style={{background:C.error+"22",border:"1px solid "+C.error+"44",borderRadius:8,padding:"4px 10px",color:C.error,fontSize:11,cursor:"pointer"}}>Delete</button>
                      )}
                      {task.status==="closed"&&<div style={{background:C.cardBorder,borderRadius:20,padding:"2px 10px",color:C.muted,fontSize:11,fontWeight:700}}>Closed</div>}
                    </div>
                  </div>
                  <div style={{background:C.dark,borderRadius:20,height:6,marginBottom:14}}>
                    <div style={{background:pct===100?"#4CAF50":C.gold,height:6,borderRadius:20,width:pct+"%",transition:"width 0.4s"}}/>
                  </div>
                  {task.assignedTo.map(id=>{
                    const staff=ALL_STAFF.find(s=>s.id===id);
                    const sub=task.submissions[id];
                    if(!staff)return null;
                    return(
                      <div key={id} style={{background:sub?"#4CAF5011":C.error+"11",border:"1px solid "+(sub?"#4CAF5033":C.error+"33"),borderRadius:10,padding:"12px 16px",marginBottom:8}}>
                        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:sub?10:0}}>
                          <div style={{width:30,height:30,borderRadius:"50%",background:staff.color,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:800,color:C.ivory,flexShrink:0}}>{staff.initials}</div>
                          <div style={{flex:1}}>
                            <div style={{color:C.text,fontWeight:700,fontSize:13}}>{staff.name}</div>
                            <div style={{color:C.muted,fontSize:11}}>{staff.role}</div>
                          </div>
                          <div style={{background:sub?"#4CAF5022":C.error+"22",border:"1px solid "+(sub?"#4CAF5044":C.error+"44"),borderRadius:20,padding:"2px 10px",color:sub?"#4CAF50":C.error,fontSize:11,fontWeight:700,flexShrink:0}}>
                            {sub?"✓ Completed":"⚠ Not Completed"}
                          </div>
                        </div>
                        {sub&&(
                          <div style={{paddingLeft:40}}>
                            {[
                              sub.mailingAddress&&["📦 Mailing Address",sub.mailingAddress],
                              sub.orderConfirmation&&["🧾 Confirmation #",sub.orderConfirmation],
                              sub.receiptNote&&["Receipt Details",sub.receiptNote],
                              sub.trackingNumber&&["📍 Tracking",sub.trackingNumber],
                              sub.deliveryDate&&["📅 Delivery Date",sub.deliveryDate],
                              sub.notes&&["Notes",sub.notes],
                              sub.completedOn&&["Completed On",sub.completedOn],
                            ].filter(Boolean).map(([label,val],i)=>(
                              <div key={i} style={{display:"flex",gap:8,marginBottom:4,flexWrap:"wrap"}}>
                                <span style={{color:C.muted,fontSize:12,width:140,flexShrink:0}}>{label}:</span>
                                <span style={{color:C.text,fontSize:12,flex:1}}>{val}</span>
                              </div>
                            ))}
                            {sub.customAnswers&&task.customFields?.map((field,i)=>sub.customAnswers[i]?(
                              <div key={i} style={{display:"flex",gap:8,marginBottom:4,flexWrap:"wrap"}}>
                                <span style={{color:C.muted,fontSize:12,width:140,flexShrink:0}}>{field.label}:</span>
                                <span style={{color:C.text,fontSize:12,flex:1}}>{sub.customAnswers[i]}</span>
                              </div>
                            ):null)}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        )}

        <div style={{height:48}}/>
      </div>
    </div>
  );
}