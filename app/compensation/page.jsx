// @ts-nocheck
"use client";
import { useState, useEffect } from "react";

const C = {
  burgundy:"#6B1A2A",burgundyDark:"#4A0E1A",green:"#1E4D2B",gold:"#C9A84C",
  ivory:"#F5F0E8",dark:"#1A0F12",card:"#2A1A1E",cardBorder:"#3D2028",
  text:"#F0EAE2",muted:"#A08878",error:"#EF5350",
};

const STAFF_NAMES = {
  avy:"Avrial Evans (Avy)",travis:"Travis Ramar",deann:"Deann Evans",
  erica:"Erica Evans",ialana:"Ialana Tippins",aubreyon:"AuBreyon (Kisses) Woodley",dennis:"Dennis Pride",
};

async function loadCompensation() {
  try { const r = await fetch("/api/compensation"); return await r.json(); } catch(e) { return {}; }
}

export default function CompensationDeclaration() {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [allData, setAllData] = useState({});
  const [myRecord, setMyRecord] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [view, setView] = useState("form"); // form | admin

  const [form, setForm] = useState({
    employer:"", position:"", monthlyTakeHome:"",
    additionalIncome:"", notes:"", acknowledged:false,
    docFileName:"", docFileData:"", docFileType:"",
  });
  const [formError, setFormError] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editReason, setEditReason] = useState("");
  const [editField, setEditField] = useState("");
  const [editValue, setEditValue] = useState("");
  const [editSaved, setEditSaved] = useState(false);

  const isLeadership = currentUser?.id === "avy" || currentUser?.id === "travis";

  useEffect(() => {
    try {
      const uid = localStorage.getItem("gtm_current_user");
      if (uid) setCurrentUser({id:uid, name:STAFF_NAMES[uid]||uid});
    } catch(e) {}
    loadCompensation().then(data => {
      setAllData(data || {});
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (currentUser && allData[currentUser.id]) {
      setMyRecord(allData[currentUser.id]);
      setSubmitted(true);
    }
  }, [currentUser, allData]);

  function handleFile(file) {
    if (!file) return;
    if (file.size > 10*1024*1024) { alert("File must be under 10MB."); return; }
    const reader = new FileReader();
    reader.onload = ev => setForm(p=>({...p, docFileName:file.name, docFileData:ev.target.result, docFileType:file.type}));
    reader.readAsDataURL(file);
  }

  async function submitDeclaration() {
    if (!form.employer.trim()) { setFormError("Please enter your current employer."); return; }
    if (!form.position.trim()) { setFormError("Please enter your current position."); return; }
    if (!form.monthlyTakeHome.trim()) { setFormError("Please enter your current monthly take-home pay."); return; }
    if (!form.acknowledged) { setFormError("You must acknowledge the declaration before submitting."); return; }

    const now = new Date().toLocaleDateString("en-US",{month:"long",day:"numeric",year:"numeric"});
    const nowTime = new Date().toLocaleString();

    const record = {
      userId: currentUser.id,
      userName: currentUser.name,
      employer: form.employer,
      position: form.position,
      monthlyTakeHome: form.monthlyTakeHome,
      additionalIncome: form.additionalIncome,
      notes: form.notes,
      docFileName: form.docFileName,
      docFileData: form.docFileData,
      docFileType: form.docFileType,
      submittedOn: now,
      submittedAt: nowTime,
      acknowledged: true,
      locked: true,
      auditLog: [{
        action: "Initial Submission",
        by: currentUser.id,
        byName: currentUser.name,
        at: nowTime,
        reason: "Employee submitted initial compensation declaration",
        changes: `Employer: ${form.employer} | Position: ${form.position} | Monthly Take-Home: ${form.monthlyTakeHome}`,
      }],
    };

    const updated = {...allData, [currentUser.id]: record};
    setAllData(updated);
    setMyRecord(record);
    setSubmitted(true);

    try {
      await fetch("/api/compensation", {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({userId: currentUser.id, data: record})
      });
    } catch(e) {}
  }

  async function saveEdit() {
    if (!editReason.trim()) { alert("Please enter a reason for this change."); return; }
    if (!editField || !editValue.trim()) { alert("Please select a field and enter a new value."); return; }

    const now = new Date().toLocaleString();
    const record = allData[editingId];
    const auditEntry = {
      action: "Record Modified",
      by: currentUser.id,
      byName: currentUser.name,
      at: now,
      reason: editReason,
      changes: `Field "${editField}" changed to: ${editValue}`,
    };

    const updated = {
      ...record,
      [editField]: editValue,
      auditLog: [...(record.auditLog||[]), auditEntry],
    };

    const newAll = {...allData, [editingId]: updated};
    setAllData(newAll);
    setEditingId(null);
    setEditReason("");
    setEditField("");
    setEditValue("");
    setEditSaved(true);
    setTimeout(()=>setEditSaved(false), 2000);

    try {
      await fetch("/api/compensation", {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({userId: editingId, data: updated})
      });
    } catch(e) {}
  }

  async function reopenForEmployee(uid) {
    if (!window.confirm("Reopen this record for editing by the employee?")) return;
    const now = new Date().toLocaleString();
    const record = allData[uid];
    const auditEntry = {
      action: "Record Reopened for Employee",
      by: currentUser.id,
      byName: currentUser.name,
      at: now,
      reason: "Leadership reopened record for employee correction",
      changes: "Record unlocked for employee re-submission",
    };
    const updated = {...record, locked:false, auditLog:[...(record.auditLog||[]),auditEntry]};
    const newAll = {...allData, [uid]: updated};
    setAllData(newAll);
    try {
      await fetch("/api/compensation", {method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({userId:uid,data:updated})});
    } catch(e) {}
  }

  if (loading) return <div style={{minHeight:"100vh",background:C.dark,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Inter','Segoe UI',sans-serif"}}><div style={{color:C.muted}}>Loading...</div></div>;

  if (!currentUser) return (
    <div style={{minHeight:"100vh",background:C.dark,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Inter','Segoe UI',sans-serif"}}>
      <a href="/" style={{background:C.burgundy,borderRadius:8,padding:"11px 24px",color:C.ivory,fontSize:14,fontWeight:800,textDecoration:"none"}}>Log in first</a>
    </div>
  );

  return (
    <div style={{minHeight:"100vh",background:C.dark,fontFamily:"'Inter','Segoe UI',sans-serif"}}>

      {/* Header */}
      <div style={{background:"linear-gradient(135deg,"+C.burgundyDark+" 0%,"+C.dark+" 70%)",borderBottom:"2px solid "+C.gold,padding:"14px 20px",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:8}}>
        <div>
          <div style={{color:C.gold,fontSize:10,fontWeight:800,letterSpacing:3,textTransform:"uppercase"}}>Mandatory Onboarding</div>
          <h1 style={{color:C.ivory,fontSize:16,fontWeight:900,margin:"2px 0"}}>Compensation Baseline & Pay Cap Declaration</h1>
          <div style={{color:C.muted,fontSize:12}}>Grace Trace Ministries — Confidential</div>
        </div>
        <div style={{display:"flex",gap:8}}>
          {isLeadership&&(
            <button onClick={()=>setView(view==="admin"?"form":"admin")}
              style={{background:view==="admin"?C.muted:C.burgundy,border:"1px solid "+C.gold+"66",borderRadius:8,padding:"7px 14px",color:C.ivory,fontSize:12,fontWeight:700,cursor:"pointer"}}>
              {view==="admin"?"← My Record":"👁 Admin View"}
            </button>
          )}
          <button onClick={()=>window.history.back()} style={{background:"transparent",border:"1px solid "+C.cardBorder,borderRadius:8,padding:"6px 12px",color:C.muted,fontSize:12,cursor:"pointer"}}>← Back</button>
        </div>
      </div>

      <div style={{maxWidth:700,margin:"0 auto",padding:"24px 16px"}}>

        {/* ADMIN VIEW — Leadership only */}
        {view==="admin"&&isLeadership&&(
          <div>
            <div style={{color:C.gold,fontSize:11,fontWeight:800,letterSpacing:2,textTransform:"uppercase",marginBottom:6}}>All Staff Compensation Records</div>
            <div style={{color:C.muted,fontSize:12,marginBottom:16}}>Visible only to Avy and Travis. All changes are logged with reason and timestamp.</div>

            {editSaved&&<div style={{background:"#4CAF5022",border:"1px solid #4CAF5044",borderRadius:10,padding:12,color:"#4CAF50",fontWeight:700,fontSize:13,marginBottom:16}}>✓ Record updated and logged</div>}

            {Object.keys(STAFF_NAMES).map(uid=>{
              const record = allData[uid];
              const name = STAFF_NAMES[uid];
              return (
                <div key={uid} style={{background:C.card,border:"1px solid "+(record?"#4CAF5044":C.cardBorder),borderRadius:12,padding:"16px 20px",marginBottom:12}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:8,marginBottom:record?12:0}}>
                    <div>
                      <div style={{color:C.text,fontWeight:800,fontSize:15}}>{name}</div>
                      {record&&<div style={{color:C.muted,fontSize:12,marginTop:2}}>Submitted {record.submittedOn}</div>}
                    </div>
                    <div style={{display:"flex",gap:6,alignItems:"center"}}>
                      <div style={{background:record?"#4CAF5022":C.error+"22",border:"1px solid "+(record?"#4CAF5044":C.error+"44"),borderRadius:20,padding:"3px 10px",color:record?"#4CAF50":C.error,fontSize:11,fontWeight:700}}>
                        {record?"✓ Submitted":"Not Submitted"}
                      </div>
                      {record&&<div style={{background:record.locked?C.gold+"22":C.green+"22",border:"1px solid "+(record.locked?C.gold+"44":C.green+"44"),borderRadius:20,padding:"3px 10px",color:record.locked?C.gold:"#4CAF50",fontSize:11,fontWeight:700}}>
                        {record.locked?"🔒 Locked":"🔓 Open"}
                      </div>}
                    </div>
                  </div>

                  {record&&(
                    <div>
                      {/* Compensation details */}
                      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:12}}>
                        {[
                          ["Current Employer",record.employer],
                          ["Current Position",record.position],
                          ["Monthly Take-Home",record.monthlyTakeHome],
                          ["Additional Income",record.additionalIncome||"—"],
                        ].map(([label,val],i)=>(
                          <div key={i} style={{background:C.dark,borderRadius:8,padding:"10px 12px"}}>
                            <div style={{color:C.muted,fontSize:11,marginBottom:3}}>{label}</div>
                            <div style={{color:label.includes("Monthly")||label.includes("Income")?C.gold:C.text,fontWeight:label.includes("Monthly")?800:600,fontSize:14}}>{val}</div>
                          </div>
                        ))}
                      </div>

                      {record.notes&&<div style={{background:C.dark,borderRadius:8,padding:"10px 12px",marginBottom:12}}><div style={{color:C.muted,fontSize:11,marginBottom:3}}>Notes</div><div style={{color:C.text,fontSize:13}}>{record.notes}</div></div>}

                      {/* Document */}
                      {record.docFileName&&(
                        <div style={{background:C.dark,borderRadius:8,padding:"10px 12px",marginBottom:12,display:"flex",alignItems:"center",gap:10}}>
                          <span style={{fontSize:18}}>{record.docFileType?.includes("pdf")?"📄":"🖼"}</span>
                          <span style={{color:C.text,fontSize:13,flex:1}}>{record.docFileName}</span>
                          <a href={record.docFileData} download={record.docFileName} style={{color:C.gold,fontSize:12,textDecoration:"none",fontWeight:700}}>⬇ Download</a>
                        </div>
                      )}

                      {/* Edit record */}
                      {editingId===uid?(
                        <div style={{background:C.dark,border:"1px solid "+C.gold+"44",borderRadius:10,padding:"14px",marginBottom:12}}>
                          <div style={{color:C.gold,fontSize:11,fontWeight:800,letterSpacing:1,textTransform:"uppercase",marginBottom:10}}>Edit Record — {name}</div>
                          <div style={{marginBottom:10}}>
                            <div style={{color:C.text,fontSize:12,fontWeight:600,marginBottom:5}}>Field to change</div>
                            <select value={editField} onChange={e=>setEditField(e.target.value)}
                              style={{width:"100%",background:C.card,border:"1px solid "+C.cardBorder,borderRadius:8,padding:"9px 12px",color:C.text,fontSize:13,outline:"none"}}>
                              <option value="">Select field...</option>
                              <option value="employer">Current Employer</option>
                              <option value="position">Current Position</option>
                              <option value="monthlyTakeHome">Monthly Take-Home Pay</option>
                              <option value="additionalIncome">Additional Income</option>
                              <option value="notes">Notes</option>
                            </select>
                          </div>
                          <div style={{marginBottom:10}}>
                            <div style={{color:C.text,fontSize:12,fontWeight:600,marginBottom:5}}>New value</div>
                            <input type="text" value={editValue} onChange={e=>setEditValue(e.target.value)} placeholder="Enter new value"
                              style={{width:"100%",background:C.card,border:"1px solid "+C.cardBorder,borderRadius:8,padding:"9px 12px",color:C.text,fontSize:13,outline:"none",fontFamily:"inherit"}}/>
                          </div>
                          <div style={{marginBottom:12}}>
                            <div style={{color:C.text,fontSize:12,fontWeight:600,marginBottom:5}}>Reason for change <span style={{color:C.error}}>*</span></div>
                            <textarea value={editReason} onChange={e=>setEditReason(e.target.value)} placeholder="Required — explain why this record is being changed" rows={2}
                              style={{width:"100%",background:C.card,border:"1px solid "+C.cardBorder,borderRadius:8,padding:"9px 12px",color:C.text,fontSize:13,outline:"none",fontFamily:"inherit",resize:"vertical",lineHeight:1.6}}/>
                          </div>
                          <div style={{display:"flex",gap:8}}>
                            <button onClick={saveEdit} style={{flex:1,background:C.green,border:"none",borderRadius:8,padding:"10px",color:C.ivory,fontSize:13,fontWeight:800,cursor:"pointer"}}>Save & Log Change</button>
                            <button onClick={()=>{setEditingId(null);setEditReason("");setEditField("");setEditValue("");}} style={{background:"transparent",border:"1px solid "+C.cardBorder,borderRadius:8,padding:"10px 16px",color:C.muted,fontSize:13,cursor:"pointer"}}>Cancel</button>
                          </div>
                        </div>
                      ):(
                        <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                          <button onClick={()=>{setEditingId(uid);setEditField("");setEditValue("");setEditReason("");}}
                            style={{background:C.gold+"22",border:"1px solid "+C.gold+"44",borderRadius:8,padding:"7px 14px",color:C.gold,fontSize:12,fontWeight:700,cursor:"pointer"}}>
                            ✏ Edit Record
                          </button>
                          {record.locked&&(
                            <button onClick={()=>reopenForEmployee(uid)}
                              style={{background:C.burgundy+"44",border:"1px solid "+C.burgundy,borderRadius:8,padding:"7px 14px",color:C.ivory,fontSize:12,fontWeight:700,cursor:"pointer"}}>
                              🔓 Reopen for Employee
                            </button>
                          )}
                        </div>
                      )}

                      {/* Audit log */}
                      {(record.auditLog||[]).length>0&&(
                        <div style={{marginTop:14,background:C.dark,borderRadius:10,padding:"12px 14px"}}>
                          <div style={{color:C.gold,fontSize:10,fontWeight:800,letterSpacing:2,textTransform:"uppercase",marginBottom:8}}>Audit Log</div>
                          <table style={{width:"100%",borderCollapse:"collapse",fontSize:11}}>
                            <thead>
                              <tr>
                                {["Date & Time","Action","By","Reason","Changes"].map(h=>(
                                  <th key={h} style={{color:C.muted,fontWeight:700,padding:"4px 8px",textAlign:"left",borderBottom:"1px solid "+C.cardBorder}}>{h}</th>
                                ))}
                              </tr>
                            </thead>
                            <tbody>
                              {(record.auditLog||[]).map((entry,i)=>(
                                <tr key={i}>
                                  <td style={{color:C.muted,padding:"5px 8px",borderBottom:"1px solid "+C.cardBorder,whiteSpace:"nowrap"}}>{entry.at}</td>
                                  <td style={{color:C.gold,padding:"5px 8px",borderBottom:"1px solid "+C.cardBorder,fontWeight:700}}>{entry.action}</td>
                                  <td style={{color:C.text,padding:"5px 8px",borderBottom:"1px solid "+C.cardBorder}}>{entry.byName}</td>
                                  <td style={{color:C.text,padding:"5px 8px",borderBottom:"1px solid "+C.cardBorder}}>{entry.reason}</td>
                                  <td style={{color:C.muted,padding:"5px 8px",borderBottom:"1px solid "+C.cardBorder}}>{entry.changes}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* EMPLOYEE VIEW */}
        {view==="form"&&(
          <div>
            {/* Policy notice */}
            <div style={{background:C.burgundy+"33",border:"1px solid "+C.burgundy,borderRadius:12,padding:"16px 20px",marginBottom:20}}>
              <div style={{color:C.gold,fontSize:11,fontWeight:800,letterSpacing:2,textTransform:"uppercase",marginBottom:8}}>Compensation Baseline Policy</div>
              <div style={{color:C.text,fontSize:13,lineHeight:1.8,marginBottom:10}}>All officers and employees shall submit their current monthly net (after-tax) compensation from their primary employment as part of their onboarding process. This information shall remain confidential and be visible only to the Executive Director and President.</div>
              <div style={{color:C.text,fontSize:13,lineHeight:1.8,marginBottom:10}}>Grace Trace Ministries uses this information as one factor when determining compensation, subject to available funding, board-approved compensation policies, organizational needs, and applicable law.</div>
              <div style={{background:C.burgundy,borderRadius:8,padding:"10px 14px",marginTop:8}}>
                <div style={{color:C.ivory,fontSize:13,fontWeight:800}}>⚠ Compensation Cap: $25,000 per month</div>
                <div style={{color:C.ivory,fontSize:12,marginTop:4,opacity:0.8}}>This cap applies to all staff unless formally revised by the Executive Director and President in accordance with organizational policy.</div>
              </div>
            </div>

            {/* Already submitted — locked */}
            {submitted&&myRecord?.locked&&(
              <div style={{background:"#4CAF5022",border:"1px solid #4CAF5044",borderRadius:12,padding:"20px",marginBottom:20,textAlign:"center"}}>
                <div style={{fontSize:28,marginBottom:8}}>🔒</div>
                <div style={{color:"#4CAF50",fontWeight:800,fontSize:16,marginBottom:4}}>Declaration Submitted & Locked</div>
                <div style={{color:C.muted,fontSize:13,marginBottom:16}}>Submitted on {myRecord.submittedOn}. This record is now read-only. Only Avy or Travis can make changes.</div>
                <div style={{background:C.card,borderRadius:10,padding:"14px",textAlign:"left"}}>
                  {[
                    ["Current Employer",myRecord.employer],
                    ["Current Position",myRecord.position],
                    ["Monthly Take-Home",myRecord.monthlyTakeHome],
                    ["Additional Income",myRecord.additionalIncome||"—"],
                  ].map(([label,val],i)=>(
                    <div key={i} style={{display:"flex",gap:12,padding:"7px 0",borderBottom:"1px solid "+C.cardBorder}}>
                      <div style={{color:C.muted,fontSize:12,width:160,flexShrink:0}}>{label}</div>
                      <div style={{color:label.includes("Monthly")?C.gold:C.text,fontWeight:label.includes("Monthly")?700:400,fontSize:13}}>{val}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Reopened for editing */}
            {submitted&&myRecord&&!myRecord.locked&&(
              <div style={{background:C.gold+"22",border:"1px solid "+C.gold+"44",borderRadius:12,padding:"14px",marginBottom:16,textAlign:"center"}}>
                <div style={{color:C.gold,fontWeight:800,fontSize:13}}>🔓 Your record has been reopened for correction by leadership. Please update and resubmit.</div>
              </div>
            )}

            {/* Form — show if not submitted or reopened */}
            {(!submitted||!myRecord?.locked)&&(
              <div style={{background:C.card,border:"1px solid "+C.cardBorder,borderRadius:12,padding:"20px 22px"}}>
                <div style={{color:C.gold,fontSize:11,fontWeight:800,letterSpacing:2,textTransform:"uppercase",marginBottom:16}}>Your Compensation Information</div>
                <div style={{color:C.muted,fontSize:12,marginBottom:16}}>This information is strictly confidential. Only Avy and Travis can view your submission.</div>

                {[
                  {label:"Current employer",key:"employer",ph:"Company or organization name",required:true},
                  {label:"Current position / job title",key:"position",ph:"Your current job title",required:true},
                  {label:"Current monthly take-home pay (after taxes)",key:"monthlyTakeHome",ph:"e.g. $3,200 — net pay after all deductions",required:true},
                  {label:"Additional monthly income (if any)",key:"additionalIncome",ph:"Side income, benefits, allowances — or leave blank if none"},
                ].map(f=>(
                  <div key={f.key} style={{marginBottom:14}}>
                    <div style={{color:C.text,fontSize:13,fontWeight:600,marginBottom:5}}>{f.label}{f.required&&<span style={{color:C.error}}> *</span>}</div>
                    <input type="text" value={form[f.key]} onChange={e=>setForm(p=>({...p,[f.key]:e.target.value}))} placeholder={f.ph}
                      style={{width:"100%",background:C.dark,border:"1px solid "+C.cardBorder,borderRadius:8,padding:"10px 14px",color:C.text,fontSize:14,outline:"none",fontFamily:"inherit"}}/>
                  </div>
                ))}

                <div style={{marginBottom:14}}>
                  <div style={{color:C.text,fontSize:13,fontWeight:600,marginBottom:5}}>Notes (optional)</div>
                  <textarea value={form.notes} onChange={e=>setForm(p=>({...p,notes:e.target.value}))} placeholder="Any additional context about your compensation situation" rows={3}
                    style={{width:"100%",background:C.dark,border:"1px solid "+C.cardBorder,borderRadius:8,padding:"10px 14px",color:C.text,fontSize:14,resize:"vertical",outline:"none",fontFamily:"inherit",lineHeight:1.6}}/>
                </div>

                <div style={{marginBottom:20}}>
                  <div style={{color:C.text,fontSize:13,fontWeight:600,marginBottom:5}}>Supporting documentation <span style={{color:C.muted,fontWeight:400}}>(optional — pay stub or verification)</span></div>
                  <input type="file" accept=".pdf,image/*,.doc,.docx" onChange={e=>handleFile(e.target.files[0])}
                    style={{width:"100%",background:C.dark,border:"1px solid "+C.cardBorder,borderRadius:8,padding:"10px 14px",color:C.text,fontSize:13,cursor:"pointer"}}/>
                  {form.docFileName&&(
                    <div style={{marginTop:8,display:"flex",alignItems:"center",gap:10,background:C.dark,border:"1px solid #4CAF50",borderRadius:8,padding:"8px 14px"}}>
                      <span>{form.docFileType?.includes("pdf")?"📄":"🖼"}</span>
                      <span style={{color:"#4CAF50",fontSize:13,fontWeight:600,flex:1}}>{form.docFileName}</span>
                      <button onClick={()=>setForm(p=>({...p,docFileName:"",docFileData:"",docFileType:""}))} style={{background:"transparent",border:"none",color:C.error,cursor:"pointer",fontSize:16}}>✕</button>
                    </div>
                  )}
                </div>

                {/* Acknowledgment */}
                <div style={{background:C.dark,border:"1px solid "+C.gold+"44",borderRadius:10,padding:"16px",marginBottom:16}}>
                  <div style={{color:C.gold,fontSize:11,fontWeight:800,letterSpacing:1,textTransform:"uppercase",marginBottom:10}}>Declaration & Acknowledgment</div>
                  <div style={{color:C.text,fontSize:13,lineHeight:1.9,marginBottom:14}}>
                    I certify that the compensation information I have provided is accurate. I understand that Grace Trace Ministries uses this information as the basis for determining my compensation, subject to organizational policies. I understand that my compensation may not exceed the organization's approved compensation cap of <strong style={{color:C.gold}}>$25,000 per month</strong>, unless formally revised by the Executive Director and President in accordance with organizational policy. I understand that only authorized administrators may modify this record after submission.
                  </div>
                  <button onClick={()=>setForm(p=>({...p,acknowledged:!p.acknowledged}))}
                    style={{display:"flex",alignItems:"center",gap:12,background:"transparent",border:"none",cursor:"pointer",padding:0}}>
                    <div style={{width:24,height:24,borderRadius:6,background:form.acknowledged?C.gold:C.dark,border:"2px solid "+(form.acknowledged?C.gold:C.cardBorder),display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,fontSize:14,color:C.dark,fontWeight:800}}>
                      {form.acknowledged?"✓":""}
                    </div>
                    <span style={{color:form.acknowledged?C.gold:C.muted,fontSize:13,fontWeight:form.acknowledged?700:400,textAlign:"left"}}>
                      I have read and understand the above declaration and certify all information is accurate
                    </span>
                  </button>
                </div>

                {formError&&<div style={{color:C.error,fontSize:13,marginBottom:12}}>{formError}</div>}
                <button onClick={submitDeclaration}
                  style={{width:"100%",background:form.acknowledged?C.green:C.muted,border:"none",borderRadius:10,padding:"13px",color:C.ivory,fontSize:14,fontWeight:800,cursor:form.acknowledged?"pointer":"not-allowed"}}>
                  Submit Compensation Declaration — This record will be locked upon submission
                </button>
              </div>
            )}
          </div>
        )}

        <div style={{height:48}}/>
      </div>
    </div>
  );
}