// @ts-nocheck
"use client";
import { useState, useEffect } from "react";

const C = {
  burgundy:"#6B1A2A",burgundyDark:"#4A0E1A",green:"#1E4D2B",gold:"#C9A84C",
  ivory:"#F5F0E8",dark:"#1A0F12",card:"#2A1A1E",cardBorder:"#3D2028",
  text:"#F0EAE2",muted:"#A08878",error:"#EF5350",
};

const COMMITTEES = ["Finance","Grants","Programs","Outreach","Facilities","Communications","Executive","Compliance","Fund Development","Human Resources"];
const CONTACT_METHODS = ["Call","Text","Email","Video Call"];
const MEMBER_TYPES = ["Board Member","Staff","Volunteer","Advisor"];

const DEFAULT_MEMBERS = [
  {
    id:"avy",name:"Avrial Evans",position:"President / Executive Director / Board Chair",
    type:"Staff",status:"Active",phone:"",personalEmail:"",orgEmail:"",city:"Frisco, TX",
    committees:["Executive","Finance","Programs"],joined:"June 2026",
    preferredContact:"Email",photo:"",notes:"Co-Founder of Grace Trace Ministries",
    initials:"AE",color:C.burgundy,
    attendance:[],tasks:[],reminders:[],
  },
  {
    id:"travis",name:"Travis Ramar",position:"VP / COO / Co-Founder / Board Member",
    type:"Board Member",status:"Active",phone:"",personalEmail:"",orgEmail:"",city:"Texas",
    committees:["Executive","Finance","Facilities"],joined:"June 2026",
    preferredContact:"Email",photo:"",notes:"Co-Founder of Grace Trace Ministries",
    initials:"TR",color:C.green,
    attendance:[],tasks:[],reminders:[],
  },
  {
    id:"deann",name:"Deann Evans",position:"Director of Outreach / Registered Agent",
    type:"Staff",status:"Active",phone:"",personalEmail:"",orgEmail:"",city:"Odessa, TX",
    committees:["Outreach","Programs"],joined:"June 2026",
    preferredContact:"Email",photo:"",notes:"",
    initials:"DE",color:"#8B2A3E",
    attendance:[],tasks:[],reminders:[],
  },
  {
    id:"erica",name:"Erica Evans",position:"Director of Residential Services",
    type:"Staff",status:"Active",phone:"",personalEmail:"",orgEmail:"",city:"Texas",
    committees:["Programs","Facilities"],joined:"June 2026",
    preferredContact:"Email",photo:"",notes:"",
    initials:"EE",color:"#5C3010",
    attendance:[],tasks:[],reminders:[],
  },
  {
    id:"ialana",name:"Ialana Tippins",position:"Director of Intake",
    type:"Staff",status:"Active",phone:"",personalEmail:"",orgEmail:"",city:"Texas",
    committees:["Programs","Compliance"],joined:"June 2026",
    preferredContact:"Email",photo:"",notes:"",
    initials:"IT",color:"#1A3D2B",
    attendance:[],tasks:[],reminders:[],
  },
  {
    id:"aubreyon",name:"AuBreyon (Kisses) Woodley",position:"Director of Communication — DBMD Programs",
    type:"Staff",status:"Active",phone:"",personalEmail:"",orgEmail:"",city:"Texas",
    committees:["Communications","Outreach"],joined:"June 2026",
    preferredContact:"Email",photo:"",notes:"",
    initials:"KW",color:"#4A1A5C",
    attendance:[],tasks:[],reminders:[],
  },
  {
    id:"dennis",name:"Dennis Pride",position:"Director of Operations",
    type:"Staff",status:"Active",phone:"",personalEmail:"",orgEmail:"",city:"Texas",
    committees:["Facilities","Compliance"],joined:"June 2026",
    preferredContact:"Email",photo:"",notes:"",
    initials:"DO",color:"#1A4D35",
    attendance:[],tasks:[],reminders:[],
  },
];

async function loadDirectory() {
  try { const r = await fetch("/api/directory"); return await r.json(); } catch(e) { return null; }
}
async function saveDirectory(members) {
  try { await fetch("/api/directory", { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify(members) }); } catch(e) {}
}

export default function BoardDirectory() {
  const [currentUser, setCurrentUser] = useState(null);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState("directory");
  const [activeMember, setActiveMember] = useState(null);
  const [editingMember, setEditingMember] = useState(null);
  const [search, setSearch] = useState("");
  const [filterCommittee, setFilterCommittee] = useState("All");
  const [filterType, setFilterType] = useState("All");
  const [editForm, setEditForm] = useState(null);
  const [editSaved, setEditSaved] = useState(false);
  const [newNote, setNewNote] = useState("");
  const [reminderText, setReminderText] = useState("");
  const [reminderTarget, setReminderTarget] = useState("all");
  const [reminderSent, setReminderSent] = useState(false);
  const [addingMember, setAddingMember] = useState(false);
  const [newMemberForm, setNewMemberForm] = useState({
    name:"",position:"",type:"Board Member",status:"Active",phone:"",
    personalEmail:"",orgEmail:"",city:"",committees:[],joined:"",
    preferredContact:"Email",photo:"",notes:"",initials:"",color:C.burgundy,
  });

  const isLeadership = currentUser?.id === "avy" || currentUser?.id === "travis";

  useEffect(() => {
    try {
      const uid = localStorage.getItem("gtm_current_user");
      if (uid) setCurrentUser({id:uid});
    } catch(e) {}
    loadDirectory().then(data => {
      if (data && data.length > 0) { setMembers(data); }
      else { setMembers(DEFAULT_MEMBERS); saveDirectory(DEFAULT_MEMBERS); }
      setLoading(false);
    });
  }, []);

  function saveMember(updated) {
    setMembers(updated);
    saveDirectory(updated);
  }

  function startEdit(member) {
    setEditForm({...member});
    setEditingMember(member.id);
    setView("edit");
  }

  function saveEdit() {
    const updated = members.map(m => m.id!==editForm.id?m:{...editForm});
    saveMember(updated);
    setActiveMember(updated.find(m=>m.id===editForm.id));
    setEditingMember(null);
    setEditForm(null);
    setEditSaved(true);
    setTimeout(()=>{ setEditSaved(false); setView("profile"); }, 1200);
  }

  function addNote(memberId) {
    if (!newNote.trim()) return;
    const now = new Date().toLocaleDateString("en-US",{month:"long",day:"numeric",year:"numeric"});
    const note = { id:Date.now().toString(), text:newNote, by:currentUser.id, date:now };
    const updated = members.map(m => m.id!==memberId?m:{...m,notes:m.notes+"\n\n["+now+" — "+currentUser.id+"]: "+newNote});
    saveMember(updated);
    if (activeMember?.id===memberId) setActiveMember(updated.find(m=>m.id===memberId));
    setNewNote("");
  }

  function sendReminder() {
    if (!reminderText.trim()) return;
    const now = new Date().toLocaleDateString("en-US",{month:"long",day:"numeric",year:"numeric"});
    const reminder = { id:Date.now().toString(), text:reminderText, sentBy:currentUser.id, date:now, target:reminderTarget };
    let updated;
    if (reminderTarget==="all") {
      updated = members.map(m=>({...m, reminders:[...(m.reminders||[]),reminder]}));
    } else {
      updated = members.map(m=> m.id===reminderTarget?{...m,reminders:[...(m.reminders||[]),reminder]}:m);
    }
    saveMember(updated);
    setReminderText("");
    setReminderSent(true);
    setTimeout(()=>setReminderSent(false),2000);
  }

  function addNewMember() {
    if (!newMemberForm.name.trim()) { alert("Please enter a name."); return; }
    const id = newMemberForm.name.toLowerCase().replace(/\s+/g,"_")+Date.now();
    const initials = newMemberForm.name.split(" ").map(w=>w[0]).join("").toUpperCase().slice(0,2);
    const member = {...newMemberForm, id, initials: newMemberForm.initials||initials, reminders:[], attendance:[], tasks:[]};
    const updated = [...members, member];
    saveMember(updated);
    setAddingMember(false);
    setNewMemberForm({name:"",position:"",type:"Board Member",status:"Active",phone:"",personalEmail:"",orgEmail:"",city:"",committees:[],joined:"",preferredContact:"Email",photo:"",notes:"",initials:"",color:C.burgundy});
  }

  function removeMember(memberId) {
    if (!window.confirm("Remove this member from the directory?")) return;
    const updated = members.filter(m=>m.id!==memberId);
    saveMember(updated);
    setActiveMember(null);
    setView("directory");
  }

  if (loading) return <div style={{minHeight:"100vh",background:C.dark,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Inter','Segoe UI',sans-serif"}}><div style={{color:C.muted}}>Loading directory...</div></div>;

  if (!currentUser) return (
    <div style={{minHeight:"100vh",background:C.dark,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Inter','Segoe UI',sans-serif"}}>
      <a href="/" style={{background:C.burgundy,borderRadius:8,padding:"11px 24px",color:C.ivory,fontSize:14,fontWeight:800,textDecoration:"none"}}>Log in first</a>
    </div>
  );

  const filtered = members.filter(m => {
    const matchSearch = !search || m.name.toLowerCase().includes(search.toLowerCase()) || m.position.toLowerCase().includes(search.toLowerCase());
    const matchCommittee = filterCommittee==="All" || (m.committees||[]).includes(filterCommittee);
    const matchType = filterType==="All" || m.type===filterType;
    return matchSearch && matchCommittee && matchType;
  });

  // EDIT VIEW
  if (view==="edit"&&editForm) return (
    <div style={{minHeight:"100vh",background:C.dark,fontFamily:"'Inter','Segoe UI',sans-serif"}}>
      <div style={{background:"linear-gradient(135deg,"+C.burgundyDark+" 0%,"+C.dark+" 70%)",borderBottom:"2px solid "+C.gold,padding:"14px 20px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div style={{color:C.ivory,fontWeight:900,fontSize:16}}>Edit Profile — {editForm.name}</div>
        <button onClick={()=>{setEditingMember(null);setEditForm(null);setView("profile");}} style={{background:"transparent",border:"1px solid "+C.cardBorder,borderRadius:8,padding:"6px 12px",color:C.muted,fontSize:12,cursor:"pointer"}}>← Cancel</button>
      </div>
      <div style={{maxWidth:680,margin:"0 auto",padding:"20px 16px"}}>
        <div style={{background:C.card,border:"1px solid "+C.cardBorder,borderRadius:12,padding:"20px"}}>
          {[
            {label:"Full name",key:"name"},{label:"Position / Title",key:"position"},
            {label:"Phone",key:"phone"},{label:"Personal email",key:"personalEmail"},
            {label:"Grace Trace email",key:"orgEmail"},{label:"City, State",key:"city"},
            {label:"Joined",key:"joined"},{label:"Photo URL",key:"photo"},
          ].map(f=>(
            <div key={f.key} style={{marginBottom:12}}>
              <div style={{color:C.text,fontSize:13,fontWeight:600,marginBottom:5}}>{f.label}</div>
              <input type="text" value={editForm[f.key]||""} onChange={e=>setEditForm(p=>({...p,[f.key]:e.target.value}))}
                style={{width:"100%",background:C.dark,border:"1px solid "+C.cardBorder,borderRadius:8,padding:"9px 14px",color:C.text,fontSize:14,outline:"none",fontFamily:"inherit"}}/>
            </div>
          ))}
          <div style={{marginBottom:12}}>
            <div style={{color:C.text,fontSize:13,fontWeight:600,marginBottom:8}}>Member type</div>
            <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
              {MEMBER_TYPES.map(t=>(
                <button key={t} onClick={()=>setEditForm(p=>({...p,type:t}))}
                  style={{background:editForm.type===t?C.burgundy:C.dark,border:"1px solid "+(editForm.type===t?C.gold+"66":C.cardBorder),borderRadius:8,padding:"6px 12px",color:editForm.type===t?C.ivory:C.muted,fontSize:12,cursor:"pointer"}}>
                  {t}
                </button>
              ))}
            </div>
          </div>
          <div style={{marginBottom:12}}>
            <div style={{color:C.text,fontSize:13,fontWeight:600,marginBottom:8}}>Status</div>
            <div style={{display:"flex",gap:6}}>
              {["Active","Inactive","On Leave"].map(s=>(
                <button key={s} onClick={()=>setEditForm(p=>({...p,status:s}))}
                  style={{background:editForm.status===s?C.burgundy:C.dark,border:"1px solid "+(editForm.status===s?C.gold+"66":C.cardBorder),borderRadius:8,padding:"6px 12px",color:editForm.status===s?C.ivory:C.muted,fontSize:12,cursor:"pointer"}}>
                  {s}
                </button>
              ))}
            </div>
          </div>
          <div style={{marginBottom:12}}>
            <div style={{color:C.text,fontSize:13,fontWeight:600,marginBottom:8}}>Preferred contact method</div>
            <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
              {CONTACT_METHODS.map(c=>(
                <button key={c} onClick={()=>setEditForm(p=>({...p,preferredContact:c}))}
                  style={{background:editForm.preferredContact===c?C.burgundy:C.dark,border:"1px solid "+(editForm.preferredContact===c?C.gold+"66":C.cardBorder),borderRadius:8,padding:"6px 12px",color:editForm.preferredContact===c?C.ivory:C.muted,fontSize:12,cursor:"pointer"}}>
                  {c==="Call"?"☎️":c==="Text"?"💬":c==="Email"?"📧":"📹"} {c}
                </button>
              ))}
            </div>
          </div>
          <div style={{marginBottom:16}}>
            <div style={{color:C.text,fontSize:13,fontWeight:600,marginBottom:8}}>Committees</div>
            <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
              {COMMITTEES.map(c=>(
                <button key={c} onClick={()=>setEditForm(p=>({...p,committees:p.committees.includes(c)?p.committees.filter(x=>x!==c):[...p.committees,c]}))}
                  style={{background:(editForm.committees||[]).includes(c)?C.burgundy:C.dark,border:"1px solid "+((editForm.committees||[]).includes(c)?C.gold+"66":C.cardBorder),borderRadius:20,padding:"5px 12px",color:(editForm.committees||[]).includes(c)?C.ivory:C.muted,fontSize:12,cursor:"pointer"}}>
                  {c}
                </button>
              ))}
            </div>
          </div>
          <div style={{marginBottom:16}}>
            <div style={{color:C.text,fontSize:13,fontWeight:600,marginBottom:5}}>Notes</div>
            <textarea value={editForm.notes||""} onChange={e=>setEditForm(p=>({...p,notes:e.target.value}))} rows={3}
              style={{width:"100%",background:C.dark,border:"1px solid "+C.cardBorder,borderRadius:8,padding:"9px 14px",color:C.text,fontSize:13,resize:"vertical",outline:"none",fontFamily:"inherit",lineHeight:1.6}}/>
          </div>
          {editSaved&&<div style={{color:"#4CAF50",fontSize:13,fontWeight:700,marginBottom:10}}>✓ Profile saved</div>}
          <button onClick={saveEdit} style={{width:"100%",background:C.green,border:"none",borderRadius:10,padding:"13px",color:C.ivory,fontSize:14,fontWeight:800,cursor:"pointer"}}>Save Profile</button>
        </div>
      </div>
    </div>
  );

  // PROFILE VIEW
  if (view==="profile"&&activeMember) {
    const member = members.find(m=>m.id===activeMember.id)||activeMember;
    return (
      <div style={{minHeight:"100vh",background:C.dark,fontFamily:"'Inter','Segoe UI',sans-serif"}}>
        <div style={{background:"linear-gradient(135deg,"+C.burgundyDark+" 0%,"+C.dark+" 70%)",borderBottom:"2px solid "+C.gold,padding:"14px 20px",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:8}}>
          <div style={{color:C.ivory,fontWeight:900,fontSize:16}}>👤 {member.name}</div>
          <div style={{display:"flex",gap:8}}>
            {isLeadership&&<button onClick={()=>startEdit(member)} style={{background:C.gold+"22",border:"1px solid "+C.gold+"44",borderRadius:8,padding:"6px 12px",color:C.gold,fontSize:12,fontWeight:700,cursor:"pointer"}}>✏ Edit</button>}
            {isLeadership&&member.id!=="avy"&&member.id!=="travis"&&<button onClick={()=>removeMember(member.id)} style={{background:C.error+"22",border:"1px solid "+C.error+"44",borderRadius:8,padding:"6px 12px",color:C.error,fontSize:12,fontWeight:700,cursor:"pointer"}}>Remove</button>}
            <button onClick={()=>{setActiveMember(null);setView("directory");}} style={{background:"transparent",border:"1px solid "+C.cardBorder,borderRadius:8,padding:"6px 12px",color:C.muted,fontSize:12,cursor:"pointer"}}>← Back</button>
          </div>
        </div>
        <div style={{maxWidth:680,margin:"0 auto",padding:"20px 16px"}}>

          {/* Profile header */}
          <div style={{background:C.card,border:"1px solid "+C.cardBorder,borderRadius:12,padding:"20px",marginBottom:14,display:"flex",gap:16,alignItems:"flex-start",flexWrap:"wrap"}}>
            {member.photo?(
              <img src={member.photo} alt={member.name} style={{width:72,height:72,borderRadius:"50%",objectFit:"cover",flexShrink:0}} onError={e=>e.target.style.display="none"}/>
            ):(
              <div style={{width:72,height:72,borderRadius:"50%",background:member.color||C.burgundy,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,fontWeight:800,color:C.ivory,flexShrink:0}}>{member.initials||member.name.slice(0,2).toUpperCase()}</div>
            )}
            <div style={{flex:1}}>
              <div style={{color:C.ivory,fontWeight:900,fontSize:18}}>{member.name}</div>
              <div style={{color:C.gold,fontSize:13,marginTop:2}}>{member.position}</div>
              <div style={{display:"flex",gap:8,marginTop:8,flexWrap:"wrap"}}>
                <div style={{background:member.status==="Active"?"#4CAF5022":C.error+"22",border:"1px solid "+(member.status==="Active"?"#4CAF5044":C.error+"44"),borderRadius:20,padding:"3px 10px",color:member.status==="Active"?"#4CAF50":C.error,fontSize:11,fontWeight:700}}>
                  {member.status==="Active"?"🟢":"🔴"} {member.status}
                </div>
                <div style={{background:C.dark,border:"1px solid "+C.cardBorder,borderRadius:20,padding:"3px 10px",color:C.muted,fontSize:11}}>{member.type}</div>
              </div>
            </div>
          </div>

          {/* Contact info */}
          <div style={{background:C.card,border:"1px solid "+C.cardBorder,borderRadius:12,padding:"16px 20px",marginBottom:14}}>
            <div style={{color:C.gold,fontSize:11,fontWeight:800,letterSpacing:2,textTransform:"uppercase",marginBottom:12}}>Contact Information</div>
            {[
              {label:"Phone",val:member.phone,icon:"📞"},
              {label:"Personal Email",val:member.personalEmail,icon:"📧"},
              {label:"GTM Email",val:member.orgEmail,icon:"✉️"},
              {label:"City",val:member.city,icon:"📍"},
              {label:"Preferred Contact",val:member.preferredContact,icon:"⭐"},
              {label:"Joined",val:member.joined,icon:"📅"},
            ].filter(f=>f.val).map((f,i)=>(
              <div key={i} style={{display:"flex",gap:10,padding:"7px 0",borderBottom:"1px solid "+C.cardBorder,alignItems:"center"}}>
                <div style={{fontSize:14,width:20}}>{f.icon}</div>
                <div style={{color:C.muted,fontSize:12,width:120,flexShrink:0}}>{f.label}</div>
                <div style={{color:C.text,fontSize:13,flex:1}}>{f.val}</div>
              </div>
            ))}
          </div>

          {/* Committees */}
          {(member.committees||[]).length>0&&(
            <div style={{background:C.card,border:"1px solid "+C.cardBorder,borderRadius:12,padding:"16px 20px",marginBottom:14}}>
              <div style={{color:C.gold,fontSize:11,fontWeight:800,letterSpacing:2,textTransform:"uppercase",marginBottom:10}}>Committees</div>
              <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
                {member.committees.map(c=>(
                  <div key={c} style={{background:C.burgundy+"33",border:"1px solid "+C.burgundy,borderRadius:20,padding:"4px 12px",color:C.ivory,fontSize:12,fontWeight:600}}>{c}</div>
                ))}
              </div>
            </div>
          )}

          {/* Quick actions - leadership only */}
          {isLeadership&&(
            <div style={{background:C.card,border:"1px solid "+C.cardBorder,borderRadius:12,padding:"16px 20px",marginBottom:14}}>
              <div style={{color:C.gold,fontSize:11,fontWeight:800,letterSpacing:2,textTransform:"uppercase",marginBottom:12}}>Quick Actions</div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8}}>
                {[
                  {label:"📞 Call",action:()=>member.phone&&window.open("tel:"+member.phone)},
                  {label:"💬 Text",action:()=>member.phone&&window.open("sms:"+member.phone)},
                  {label:"📧 Email",action:()=>member.personalEmail&&window.open("mailto:"+member.personalEmail)},
                  {label:"📅 Schedule",action:()=>window.location.href="/meetings"},
                  {label:"✏ Edit Profile",action:()=>startEdit(member)},
                ].map((a,i)=>(
                  <button key={i} onClick={a.action} style={{background:C.dark,border:"1px solid "+C.cardBorder,borderRadius:8,padding:"10px 6px",color:C.text,fontSize:12,fontWeight:600,cursor:"pointer",textAlign:"center"}}>
                    {a.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Notes */}
          <div style={{background:C.card,border:"1px solid "+C.cardBorder,borderRadius:12,padding:"16px 20px",marginBottom:14}}>
            <div style={{color:C.gold,fontSize:11,fontWeight:800,letterSpacing:2,textTransform:"uppercase",marginBottom:10}}>Notes</div>
            {member.notes&&<div style={{color:C.text,fontSize:14,lineHeight:1.8,whiteSpace:"pre-wrap",marginBottom:12}}>{member.notes}</div>}
            {isLeadership&&(
              <div style={{display:"flex",gap:8}}>
                <input type="text" value={newNote} onChange={e=>setNewNote(e.target.value)} onKeyDown={e=>e.key==="Enter"&&addNote(member.id)} placeholder="Add a note..."
                  style={{flex:1,background:C.dark,border:"1px solid "+C.cardBorder,borderRadius:8,padding:"9px 12px",color:C.text,fontSize:13,outline:"none",fontFamily:"inherit"}}/>
                <button onClick={()=>addNote(member.id)} style={{background:C.burgundy,border:"1px solid "+C.gold+"66",borderRadius:8,padding:"9px 14px",color:C.ivory,fontSize:13,fontWeight:700,cursor:"pointer"}}>Add</button>
              </div>
            )}
          </div>

          {/* Reminder history */}
          {isLeadership&&(member.reminders||[]).length>0&&(
            <div style={{background:C.card,border:"1px solid "+C.cardBorder,borderRadius:12,padding:"16px 20px",marginBottom:14}}>
              <div style={{color:C.gold,fontSize:11,fontWeight:800,letterSpacing:2,textTransform:"uppercase",marginBottom:10}}>Reminder History</div>
              <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
                <thead>
                  <tr>
                    {["Date","Reminder","Sent By"].map(h=>(
                      <th key={h} style={{color:C.muted,fontWeight:700,padding:"6px 8px",textAlign:"left",borderBottom:"1px solid "+C.cardBorder}}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {(member.reminders||[]).map(r=>(
                    <tr key={r.id}>
                      <td style={{color:C.muted,padding:"6px 8px",borderBottom:"1px solid "+C.cardBorder,fontSize:11}}>{r.date}</td>
                      <td style={{color:C.text,padding:"6px 8px",borderBottom:"1px solid "+C.cardBorder}}>{r.text}</td>
                      <td style={{color:C.gold,padding:"6px 8px",borderBottom:"1px solid "+C.cardBorder,fontSize:11}}>{r.sentBy}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div style={{height:48}}/>
        </div>
      </div>
    );
  }

  // DIRECTORY + CONTACT CENTER
  return (
    <div style={{minHeight:"100vh",background:C.dark,fontFamily:"'Inter','Segoe UI',sans-serif"}}>
      <div style={{background:"linear-gradient(135deg,"+C.burgundyDark+" 0%,"+C.dark+" 70%)",borderBottom:"2px solid "+C.gold,padding:"14px 20px",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:8}}>
        <div>
          <div style={{color:C.gold,fontSize:10,fontWeight:800,letterSpacing:3,textTransform:"uppercase"}}>Grace Trace Ministries</div>
          <h1 style={{color:C.ivory,fontSize:17,fontWeight:900,margin:"2px 0"}}>👥 Board & Team Directory</h1>
          <div style={{color:C.muted,fontSize:12}}>{members.length} members</div>
        </div>
        <div style={{display:"flex",gap:8}}>
          {isLeadership&&<button onClick={()=>setAddingMember(!addingMember)} style={{background:addingMember?C.muted:C.burgundy,border:"1px solid "+C.gold+"66",borderRadius:8,padding:"7px 14px",color:C.ivory,fontSize:12,fontWeight:800,cursor:"pointer"}}>{addingMember?"Cancel":"+ Add Member"}</button>}
          <button onClick={()=>window.history.back()} style={{background:"transparent",border:"1px solid "+C.cardBorder,borderRadius:8,padding:"6px 12px",color:C.muted,fontSize:12,cursor:"pointer"}}>← Portal</button>
        </div>
      </div>

      <div style={{maxWidth:760,margin:"0 auto",padding:"20px 16px"}}>

        {/* Add member form */}
        {addingMember&&isLeadership&&(
          <div style={{background:C.card,border:"1px solid "+C.gold+"44",borderRadius:12,padding:"18px 20px",marginBottom:20}}>
            <div style={{color:C.gold,fontSize:11,fontWeight:800,letterSpacing:2,textTransform:"uppercase",marginBottom:12}}>Add New Member</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:10}}>
              {[
                {label:"Full name",key:"name"},{label:"Position",key:"position"},
                {label:"Phone",key:"phone"},{label:"Personal email",key:"personalEmail"},
                {label:"City, State",key:"city"},{label:"Joined",key:"joined"},
              ].map(f=>(
                <div key={f.key}>
                  <div style={{color:C.muted,fontSize:11,marginBottom:4}}>{f.label}</div>
                  <input type="text" value={newMemberForm[f.key]} onChange={e=>setNewMemberForm(p=>({...p,[f.key]:e.target.value}))}
                    style={{width:"100%",background:C.dark,border:"1px solid "+C.cardBorder,borderRadius:8,padding:"8px 12px",color:C.text,fontSize:13,outline:"none",fontFamily:"inherit"}}/>
                </div>
              ))}
            </div>
            <div style={{marginBottom:10}}>
              <div style={{color:C.muted,fontSize:11,marginBottom:4}}>Member type</div>
              <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                {MEMBER_TYPES.map(t=>(
                  <button key={t} onClick={()=>setNewMemberForm(p=>({...p,type:t}))}
                    style={{background:newMemberForm.type===t?C.burgundy:C.dark,border:"1px solid "+(newMemberForm.type===t?C.gold+"66":C.cardBorder),borderRadius:8,padding:"5px 10px",color:newMemberForm.type===t?C.ivory:C.muted,fontSize:11,cursor:"pointer"}}>
                    {t}
                  </button>
                ))}
              </div>
            </div>
            <div style={{marginBottom:12}}>
              <div style={{color:C.muted,fontSize:11,marginBottom:4}}>Committees</div>
              <div style={{display:"flex",flexWrap:"wrap",gap:5}}>
                {COMMITTEES.map(c=>(
                  <button key={c} onClick={()=>setNewMemberForm(p=>({...p,committees:p.committees.includes(c)?p.committees.filter(x=>x!==c):[...p.committees,c]}))}
                    style={{background:newMemberForm.committees.includes(c)?C.burgundy:C.dark,border:"1px solid "+(newMemberForm.committees.includes(c)?C.gold+"66":C.cardBorder),borderRadius:20,padding:"4px 10px",color:newMemberForm.committees.includes(c)?C.ivory:C.muted,fontSize:11,cursor:"pointer"}}>
                    {c}
                  </button>
                ))}
              </div>
            </div>
            <button onClick={addNewMember} style={{width:"100%",background:C.green,border:"none",borderRadius:10,padding:"11px",color:C.ivory,fontSize:13,fontWeight:800,cursor:"pointer"}}>Add to Directory</button>
          </div>
        )}

        {/* Leadership contact center */}
        {isLeadership&&(
          <div style={{background:C.card,border:"1px solid "+C.burgundy,borderRadius:12,padding:"16px 20px",marginBottom:20}}>
            <div style={{color:C.gold,fontSize:11,fontWeight:800,letterSpacing:2,textTransform:"uppercase",marginBottom:12}}>⚡ Send Reminder</div>
            <div style={{display:"flex",gap:8,marginBottom:10,flexWrap:"wrap"}}>
              <select value={reminderTarget} onChange={e=>setReminderTarget(e.target.value)}
                style={{background:C.dark,border:"1px solid "+C.cardBorder,borderRadius:8,padding:"9px 12px",color:C.text,fontSize:13,outline:"none",flex:1,minWidth:140}}>
                <option value="all">All Members</option>
                {members.map(m=><option key={m.id} value={m.id}>{m.name}</option>)}
              </select>
              <input type="text" value={reminderText} onChange={e=>setReminderText(e.target.value)} onKeyDown={e=>e.key==="Enter"&&sendReminder()} placeholder="Type reminder message..."
                style={{flex:2,background:C.dark,border:"1px solid "+C.cardBorder,borderRadius:8,padding:"9px 12px",color:C.text,fontSize:13,outline:"none",fontFamily:"inherit",minWidth:160}}/>
              <button onClick={sendReminder} style={{background:C.burgundy,border:"1px solid "+C.gold+"66",borderRadius:8,padding:"9px 16px",color:C.ivory,fontSize:13,fontWeight:700,cursor:"pointer"}}>Send</button>
            </div>
            {reminderSent&&<div style={{color:"#4CAF50",fontSize:12,fontWeight:700}}>✓ Reminder sent and logged</div>}
          </div>
        )}

        {/* Search + filters */}
        <input type="text" value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search by name or position..."
          style={{width:"100%",background:C.card,border:"1px solid "+C.cardBorder,borderRadius:8,padding:"10px 14px",color:C.text,fontSize:13,outline:"none",fontFamily:"inherit",marginBottom:10}}/>
        <div style={{display:"flex",gap:8,marginBottom:16,flexWrap:"wrap"}}>
          <select value={filterType} onChange={e=>setFilterType(e.target.value)}
            style={{background:C.card,border:"1px solid "+C.cardBorder,borderRadius:8,padding:"8px 12px",color:C.text,fontSize:12,outline:"none"}}>
            <option value="All">All Types</option>
            {MEMBER_TYPES.map(t=><option key={t} value={t}>{t}</option>)}
          </select>
          <select value={filterCommittee} onChange={e=>setFilterCommittee(e.target.value)}
            style={{background:C.card,border:"1px solid "+C.cardBorder,borderRadius:8,padding:"8px 12px",color:C.text,fontSize:12,outline:"none"}}>
            <option value="All">All Committees</option>
            {COMMITTEES.map(c=><option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        {/* Member cards */}
        {filtered.map(member=>(
          <div key={member.id} onClick={()=>{setActiveMember(member);setView("profile");}}
            style={{background:C.card,border:"1px solid "+C.cardBorder,borderRadius:12,padding:"16px 18px",marginBottom:10,cursor:"pointer",display:"flex",gap:14,alignItems:"center"}}
            onMouseEnter={e=>e.currentTarget.style.borderColor=C.gold+"66"}
            onMouseLeave={e=>e.currentTarget.style.borderColor=C.cardBorder}>
            {member.photo?(
              <img src={member.photo} alt={member.name} style={{width:50,height:50,borderRadius:"50%",objectFit:"cover",flexShrink:0}} onError={e=>e.target.style.display="none"}/>
            ):(
              <div style={{width:50,height:50,borderRadius:"50%",background:member.color||C.burgundy,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,fontWeight:800,color:C.ivory,flexShrink:0}}>{member.initials||member.name.slice(0,2).toUpperCase()}</div>
            )}
            <div style={{flex:1,minWidth:0}}>
              <div style={{color:C.text,fontWeight:800,fontSize:14}}>{member.name}</div>
              <div style={{color:C.muted,fontSize:12,marginTop:2}}>{member.position}</div>
              <div style={{display:"flex",gap:6,marginTop:6,flexWrap:"wrap"}}>
                <div style={{background:member.status==="Active"?"#4CAF5022":C.error+"22",border:"1px solid "+(member.status==="Active"?"#4CAF5044":C.error+"44"),borderRadius:20,padding:"2px 8px",color:member.status==="Active"?"#4CAF50":C.error,fontSize:10,fontWeight:700}}>
                  {member.status==="Active"?"🟢":"🔴"} {member.status}
                </div>
                {(member.committees||[]).slice(0,2).map(c=>(
                  <div key={c} style={{background:C.burgundy+"33",borderRadius:20,padding:"2px 8px",color:C.ivory,fontSize:10}}>{c}</div>
                ))}
                {(member.committees||[]).length>2&&<div style={{color:C.muted,fontSize:10}}>+{member.committees.length-2} more</div>}
              </div>
            </div>
            <div style={{textAlign:"right",flexShrink:0}}>
              <div style={{color:C.muted,fontSize:10}}>{member.type}</div>
              {member.preferredContact&&<div style={{color:C.gold,fontSize:10,marginTop:3}}>{member.preferredContact==="Call"?"☎️":member.preferredContact==="Text"?"💬":member.preferredContact==="Email"?"📧":"📹"} {member.preferredContact}</div>}
            </div>
          </div>
        ))}

        <div style={{height:48}}/>
      </div>
    </div>
  );
}