"use client";
import { useState, useEffect } from "react";

const C = {
  burgundy:"#6B1A2A",burgundyDark:"#4A0E1A",green:"#1E4D2B",gold:"#C9A84C",
  ivory:"#F5F0E8",dark:"#1A0F12",card:"#2A1A1E",cardBorder:"#3D2028",
  text:"#F0EAE2",muted:"#A08878",error:"#EF5350",
};

const ALL_STAFF = [
  {id:"avy",name:"Avrial Evans (Avy)",role:"President / Executive Director / Board Chair",initials:"AE",color:C.burgundy},
  {id:"travis",name:"Travis Ramar",role:"VP / COO / Board Member",initials:"TR",color:C.green},
  {id:"deann",name:"Deann Evans",role:"Director of Outreach & Program Development",initials:"DE",color:"#8B2A3E"},
  {id:"erica",name:"Erica Evans",role:"Director of Residential Services & Standards",initials:"EE",color:"#5C3010"},
  {id:"ialana",name:"Ialana Tippins",role:"Director of Intake & Resident Relations",initials:"IT",color:"#1A3D2B"},
  {id:"aubreyon",name:"AuBreyon (Kisses) Woodley",role:"Director of Communication — DBMD Programs",initials:"KW",color:"#4A1A5C"},
  {id:"dennis",name:"Dennis Pride",role:"Director of Operations & Facilities",initials:"DO",color:"#1A4D35"},
];

function loadMeetings() {
  try { const s = localStorage.getItem("gtm_meetings"); return s ? JSON.parse(s) : []; } catch(e) { return []; }
}
function saveMeetings(m) {
  try { localStorage.setItem("gtm_meetings", JSON.stringify(m)); } catch(e) {}
}

export default function MeetingBoard() {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [meetings, setMeetings] = useState([]);
  const [view, setView] = useState("board");
  const [activeMeeting, setActiveMeeting] = useState(null);
  const [printMode, setPrintMode] = useState(false);

  // New meeting form
  const [form, setForm] = useState({
    title:"", date:"", time:"", meetingType:"", attendeeType:"",
    attendees:[], externalName:"", externalOrg:"", externalRole:"",
    agenda:"", notes:"", voteOptions:[{date:"",time:""}],
  });
  const [formError, setFormError] = useState("");
  const [created, setCreated] = useState(false);
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState("");

  // Attendance response
  const [response, setResponse] = useState({method:"", canAttend:"", followUpDate:"", followUpNotes:""});
  const [responseError, setResponseError] = useState("");
  const [responseSent, setResponseSent] = useState(false);

  useEffect(() => {
    try {
      const uid = localStorage.getItem("gtm_current_user");
      if (uid) { const u = ALL_STAFF.find(s => s.id === uid); if (u) setCurrentUser(u); }
    } catch(e) {}
    setMeetings(loadMeetings());
    setLoading(false);
  }, []);

  const isLeadership = currentUser && (currentUser.id === "avy" || currentUser.id === "travis");

  function toggleAttendee(id) {
    setForm(prev => ({
      ...prev,
      attendees: prev.attendees.includes(id) ? prev.attendees.filter(a => a !== id) : [...prev.attendees, id]
    }));
  }

  function addVoteOption() {
    setForm(prev => ({...prev, voteOptions:[...prev.voteOptions, {date:"",time:""}]}));
  }

  function updateVoteOption(i, field, val) {
    setForm(prev => {
      const opts = [...prev.voteOptions];
      opts[i] = {...opts[i], [field]: val};
      return {...prev, voteOptions: opts};
    });
  }

  async function generateMeetingWithAI() {
    if (!aiPrompt.trim()) { setAiError("Please describe the meeting."); return; }
    setAiLoading(true); setAiError("");
    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-6",
          max_tokens: 800,
          messages: [{
            role: "user",
            content: `You are helping schedule a meeting for Grace Trace Ministries. Generate professional meeting details based on: "${aiPrompt}".

Respond ONLY with a JSON object, no markdown, no backticks:
{
  "title": "professional meeting title",
  "agenda": "detailed agenda listing what will be covered in this meeting, formatted as numbered items"
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
        agenda: parsed.agenda || p.agenda,
      }));
      setAiPrompt("");
    } catch(e) {
      setAiError("Could not generate meeting details. Try again or fill in manually.");
    }
    setAiLoading(false);
  }

  function createMeeting() {
    if (!form.title.trim()) { setFormError("Please enter a meeting title."); return; }
    if (!form.meetingType) { setFormError("Please select a meeting type."); return; }
    if (!form.attendeeType) { setFormError("Please select who this meeting is with."); return; }
    if (form.attendeeType !== "external-only" && form.attendees.length === 0) { setFormError("Please select at least one attendee."); return; }
    if (form.attendeeType === "vote" && form.voteOptions.filter(o => o.date && o.time).length < 2) { setFormError("Please add at least 2 date and time options for the vote."); return; }
    if (form.attendeeType !== "vote" && !form.date) { setFormError("Please enter the meeting date."); return; }
    if (form.attendeeType !== "vote" && !form.time) { setFormError("Please enter the meeting time."); return; }

    const now = new Date().toLocaleDateString("en-US", {month:"long",day:"numeric",year:"numeric"});
    const newMeeting = {
      id: Date.now().toString(),
      title: form.title,
      date: form.date,
      time: form.time,
      meetingType: form.meetingType,
      attendeeType: form.attendeeType,
      attendees: form.attendeeType === "full-board" ? ALL_STAFF.map(s=>s.id) : form.attendees,
      externalName: form.externalName,
      externalOrg: form.externalOrg,
      externalRole: form.externalRole,
      agenda: form.agenda,
      notes: form.notes,
      voteOptions: form.voteOptions.filter(o=>o.date&&o.time),
      voteResults: {},
      responses: {},
      createdBy: currentUser.id,
      createdByName: currentUser.name,
      createdOn: now,
      status: form.attendeeType === "vote" ? "voting" : "scheduled",
      finalDate: "",
      finalTime: "",
    };

    const updated = [newMeeting, ...meetings];
    setMeetings(updated);
    saveMeetings(updated);
    setForm({title:"",date:"",time:"",meetingType:"",attendeeType:"",attendees:[],externalName:"",externalOrg:"",externalRole:"",agenda:"",notes:"",voteOptions:[{date:"",time:""}]});
    setFormError("");
    setCreated(true);
    setTimeout(() => { setCreated(false); setView("board"); }, 1500);
  }

  function castVote(meetingId, optionIndex) {
    const updated = meetings.map(m => {
      if (m.id !== meetingId) return m;
      const vr = {...(m.voteResults||{})};
      vr[currentUser.id] = optionIndex;
      return {...m, voteResults: vr};
    });
    setMeetings(updated);
    saveMeetings(updated);
    setActiveMeeting(updated.find(m => m.id === meetingId));
  }

  function finalizeMeeting(meetingId, date, time) {
    const updated = meetings.map(m => m.id !== meetingId ? m : {...m, status:"scheduled", finalDate:date, finalTime:time, date:date, time:time});
    setMeetings(updated);
    saveMeetings(updated);
    setActiveMeeting(updated.find(m => m.id === meetingId));
  }

  function submitResponse(meetingId) {
    if (!response.method) { setResponseError("Please select how you will attend."); return; }
    if (response.canAttend === "no" && !response.followUpDate) { setResponseError("Please enter a follow-up date since you cannot attend."); return; }
    const updated = meetings.map(m => {
      if (m.id !== meetingId) return m;
      return {...m, responses: {...(m.responses||{}), [currentUser.id]: {...response, respondedOn: new Date().toLocaleDateString("en-US",{month:"long",day:"numeric",year:"numeric"})}}};
    });
    setMeetings(updated);
    saveMeetings(updated);
    setActiveMeeting(updated.find(m => m.id === meetingId));
    setResponseSent(true);
    setResponse({method:"", canAttend:"", followUpDate:"", followUpNotes:""});
    setResponseError("");
  }

  function printMeeting(m) {
    const attendeeNames = m.attendees.map(id => ALL_STAFF.find(s=>s.id===id)?.name||id).join(", ");
    const responseLines = Object.entries(m.responses||{}).map(([uid, r]) => {
      const staff = ALL_STAFF.find(s=>s.id===uid);
      return `${staff?.name||uid}: ${r.method} — ${r.canAttend==="no"?"Cannot attend — follow up: "+r.followUpDate:"Attending"} ${r.followUpNotes?"| Notes: "+r.followUpNotes:""}`;
    }).join("\n");
    const voteLines = m.voteOptions?.map((o,i) => {
      const voters = Object.entries(m.voteResults||{}).filter(([,v])=>v===i).map(([uid])=>ALL_STAFF.find(s=>s.id===uid)?.name||uid).join(", ");
      return `Option ${i+1}: ${o.date} at ${o.time} — Votes: ${voters||"None"}`;
    }).join("\n");

    const win = window.open("","_blank");
    win.document.write(`
      <html><head><title>${m.title} — Grace Trace Ministries</title>
      <style>
        body { font-family: Arial, sans-serif; max-width: 750px; margin: 40px auto; color: #1A0F12; font-size: 13px; line-height: 1.7; }
        h1 { font-size: 20px; border-bottom: 2px solid #6B1A2A; padding-bottom: 8px; color: #6B1A2A; }
        h2 { font-size: 14px; color: #6B1A2A; margin: 20px 0 6px; text-transform: uppercase; letter-spacing: 1px; }
        .header { text-align: center; margin-bottom: 24px; }
        .org { font-size: 11px; color: #888; }
        .row { display: flex; justify-content: space-between; border-bottom: 1px solid #ddd; padding: 6px 0; }
        .label { font-weight: bold; color: #555; width: 200px; flex-shrink: 0; }
        .sig { margin-top: 40px; border-top: 1px solid #ccc; padding-top: 16px; }
        .sig-line { display: inline-block; width: 280px; border-bottom: 1px solid #333; margin-right: 20px; height: 20px; }
        pre { background: #f5f5f5; padding: 10px; border-radius: 4px; font-size: 12px; white-space: pre-wrap; }
        @media print { body { margin: 20px; } }
      </style></head>
      <body>
        <div class="header">
          <div style="font-size:18px;font-weight:900;color:#6B1A2A;">GRACE TRACE MINISTRIES</div>
          <div class="org">Meeting Record — Confidential | EIN: 42-2972120</div>
          <h1>${m.title}</h1>
        </div>
        <h2>Meeting Details</h2>
        <div class="row"><span class="label">Meeting Title</span><span>${m.title}</span></div>
        <div class="row"><span class="label">Date</span><span>${m.finalDate||m.date||"TBD — pending vote"}</span></div>
        <div class="row"><span class="label">Time</span><span>${m.finalTime||m.time||"TBD — pending vote"}</span></div>
        <div class="row"><span class="label">Meeting Type</span><span>${m.meetingType}</span></div>
        <div class="row"><span class="label">Meeting Scope</span><span>${
          m.attendeeType==="full-board"?"Full Board / All Staff":
          m.attendeeType==="single"?"Single Staff Member":
          m.attendeeType==="external-only"?"External Contact Only":
          m.attendeeType==="external-staff"?"Staff + External Contact":
          m.attendeeType==="vote"?"Vote to Schedule":
          m.attendeeType
        }</span></div>
        <div class="row"><span class="label">Created By</span><span>${m.createdByName}</span></div>
        <div class="row"><span class="label">Created On</span><span>${m.createdOn}</span></div>
        <div class="row"><span class="label">Status</span><span>${m.status==="voting"?"Pending Vote":m.status==="scheduled"?"Scheduled":"Completed"}</span></div>
        ${m.externalName?`<div class="row"><span class="label">External Contact</span><span>${m.externalName}${m.externalOrg?" — "+m.externalOrg:""}${m.externalRole?" ("+m.externalRole+")":""}</span></div>`:""}
        <div class="row"><span class="label">Attendees</span><span>${attendeeNames||"All Staff"}</span></div>
        ${m.agenda?`<h2>Agenda</h2><pre>${m.agenda}</pre>`:""}
        ${m.notes?`<h2>Meeting Notes</h2><pre>${m.notes}</pre>`:""}
        ${m.voteOptions?.length?`<h2>Date & Time Vote Options</h2><pre>${voteLines}</pre>`:""}
        ${responseLines?`<h2>Attendance Responses</h2><pre>${responseLines}</pre>`:""}
        <div class="sig">
          <h2>Signatures</h2>
          <p>By signing below, parties confirm participation in or acknowledgment of this meeting record.</p>
          ${m.attendees.map(id=>{
            const s=ALL_STAFF.find(x=>x.id===id);
            return s?`<p><span class="sig-line"></span> ${s.name} &nbsp;&nbsp; Date: <span class="sig-line" style="width:120px"></span></p>`:"";
          }).join("")}
        </div>
        <div style="text-align:center;margin-top:40px;font-size:10px;color:#888;">
          CONFIDENTIAL — GRACE TRACE MINISTRIES PROPERTY<br>
          Grace Trace Ministries | EIN: 42-2972120 | gracetraceministries.org
        </div>
        <script>window.print();</script>
      </body></html>
    `);
    win.document.close();
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

  // My meetings — ones I am invited to
  const myMeetings = meetings.filter(m => m.attendees.includes(currentUser.id) || m.createdBy === currentUser.id);
  const pendingResponse = myMeetings.filter(m => m.status==="scheduled" && !(m.responses||{})[currentUser.id] && m.createdBy!==currentUser.id);

  return (
    <div style={{minHeight:"100vh",background:C.dark,fontFamily:"'Inter','Segoe UI',sans-serif"}}>
      <div style={{background:"linear-gradient(135deg,"+C.burgundyDark+" 0%,"+C.dark+" 70%)",borderBottom:"2px solid "+C.gold,padding:"14px 24px",display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:10}}>
        <div>
          <div style={{color:C.gold,fontSize:10,fontWeight:800,letterSpacing:3,textTransform:"uppercase"}}>Grace Trace Ministries</div>
          <h1 style={{color:C.ivory,fontSize:17,fontWeight:900,margin:"2px 0"}}>Meeting Board 📅</h1>
          <div style={{color:C.muted,fontSize:12}}>{currentUser.name}</div>
        </div>
        <button onClick={()=>window.history.back()} style={{background:"transparent",border:"1px solid "+C.cardBorder,borderRadius:8,padding:"6px 12px",color:C.muted,fontSize:12,cursor:"pointer"}}>← Back</button>
      </div>

      {/* Tab nav */}
      <div style={{background:C.dark,borderBottom:"1px solid "+C.cardBorder,display:"flex",gap:2,padding:"0 24px"}}>
        {["board", isLeadership&&"schedule", isLeadership&&"vote"].filter(Boolean).map(tab=>(
          <button key={tab} onClick={()=>{setView(tab);setActiveMeeting(null);setResponseSent(false);}}
            style={{background:"transparent",border:"none",borderBottom:view===tab?"2px solid "+C.gold:"2px solid transparent",color:view===tab?C.gold:C.muted,fontSize:13,fontWeight:view===tab?800:500,padding:"11px 16px",cursor:"pointer"}}>
            {tab==="board"?"Meeting Board":tab==="schedule"?"Schedule Meeting":"Vote to Schedule"}
            {tab==="board"&&pendingResponse.length>0&&<span style={{background:C.error,color:C.ivory,borderRadius:20,padding:"1px 7px",fontSize:10,fontWeight:800,marginLeft:6}}>{pendingResponse.length}</span>}
          </button>
        ))}
      </div>

      <div style={{maxWidth:760,margin:"0 auto",padding:"24px 20px"}}>

        {/* MEETING BOARD */}
        {view==="board"&&!activeMeeting&&(
          <div>
            <div style={{color:C.gold,fontSize:11,fontWeight:800,letterSpacing:2,textTransform:"uppercase",marginBottom:14}}>
              {isLeadership?"All Meetings":"Your Meetings"}
            </div>
            {(isLeadership?meetings:myMeetings).length===0&&(
              <div style={{background:C.card,border:"1px solid "+C.cardBorder,borderRadius:12,padding:24,textAlign:"center",color:C.muted,fontSize:14}}>No meetings scheduled yet.</div>
            )}
            {(isLeadership?meetings:myMeetings).map(m=>{
              const myRes = (m.responses||{})[currentUser.id];
              const responseCount = Object.keys(m.responses||{}).length;
              const totalInvited = m.attendees.length;
              return (
                <div key={m.id} onClick={()=>{setActiveMeeting(m);setResponseSent(false);setResponse({method:"",canAttend:"",followUpDate:"",followUpNotes:""}); setResponseError("");}}
                  style={{background:C.card,border:"1px solid "+(m.status==="voting"?C.gold+"44":myRes?C.green+"44":C.cardBorder),borderRadius:12,padding:"16px 20px",marginBottom:10,cursor:"pointer"}}
                  onMouseEnter={e=>e.currentTarget.style.borderColor=C.gold+"66"}
                  onMouseLeave={e=>e.currentTarget.style.borderColor=m.status==="voting"?C.gold+"44":myRes?C.green+"44":C.cardBorder}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:8}}>
                    <div>
                      <div style={{color:C.text,fontWeight:800,fontSize:15}}>{m.title}</div>
                      <div style={{color:C.muted,fontSize:12,marginTop:3}}>
                        {m.status==="voting"?"🗳 Voting in progress — pick a date":
                        `📅 ${m.finalDate||m.date} at ${m.finalTime||m.time}`} — {m.meetingType}
                      </div>
                      <div style={{color:C.muted,fontSize:11,marginTop:2}}>Scheduled by {m.createdByName} on {m.createdOn}</div>
                    </div>
                    <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:4}}>
                      <div style={{background:m.status==="voting"?C.gold+"22":m.status==="scheduled"?C.green+"22":C.cardBorder,border:"1px solid "+(m.status==="voting"?C.gold+"44":m.status==="scheduled"?"#4CAF5044":C.cardBorder),borderRadius:20,padding:"2px 10px",color:m.status==="voting"?C.gold:m.status==="scheduled"?"#4CAF50":C.muted,fontSize:11,fontWeight:700}}>
                        {m.status==="voting"?"Voting":m.status==="scheduled"?"Scheduled":"Completed"}
                      </div>
                      {m.status==="scheduled"&&<div style={{color:C.muted,fontSize:11}}>{responseCount}/{totalInvited} responded</div>}
                      {myRes&&<div style={{color:"#4CAF50",fontSize:11,fontWeight:700}}>✓ You responded</div>}
                      {!myRes&&m.status==="scheduled"&&m.createdBy!==currentUser.id&&<div style={{color:C.error,fontSize:11,fontWeight:700}}>⚠ Response needed</div>}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* MEETING DETAIL */}
        {view==="board"&&activeMeeting&&(()=>{
          const m = meetings.find(x=>x.id===activeMeeting.id)||activeMeeting;
          const myRes = (m.responses||{})[currentUser.id];
          const attendeeStaff = m.attendees.map(id=>ALL_STAFF.find(s=>s.id===id)).filter(Boolean);

          // Tally votes
          const tally = {};
          Object.values(m.voteResults||{}).forEach(i=>{ tally[i]=(tally[i]||0)+1; });
          const winnerIdx = m.voteOptions?.length ? Object.entries(tally).sort((a,b)=>b[1]-a[1])[0]?.[0] : null;

          return (
            <div>
              <button onClick={()=>{setActiveMeeting(null);setResponseSent(false);}} style={{background:"transparent",border:"1px solid "+C.cardBorder,borderRadius:8,padding:"7px 14px",color:C.muted,fontSize:13,cursor:"pointer",marginBottom:16}}>← All Meetings</button>

              <div style={{background:C.card,border:"1px solid "+C.cardBorder,borderRadius:12,padding:"20px 24px",marginBottom:16}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:10,marginBottom:16}}>
                  <div>
                    <div style={{color:C.gold,fontSize:10,fontWeight:800,letterSpacing:2,textTransform:"uppercase",marginBottom:4}}>Meeting Record</div>
                    <h2 style={{color:C.ivory,fontSize:20,fontWeight:900,margin:0}}>{m.title}</h2>
                  </div>
                  <button onClick={()=>printMeeting(m)} style={{background:C.burgundy,border:"1px solid "+C.gold+"66",borderRadius:8,padding:"8px 16px",color:C.ivory,fontSize:12,fontWeight:700,cursor:"pointer"}}>🖨 Print Record</button>
                </div>
                {[
                  ["Date",m.status==="voting"?"TBD — pending vote":(m.finalDate||m.date)],
                  ["Time",m.status==="voting"?"TBD — pending vote":(m.finalTime||m.time)],
                  ["Meeting Type",m.meetingType],
                  ["Meeting Scope",m.attendeeType==="full-board"?"Full Board / All Staff":m.attendeeType==="single"?"Single Staff Member":m.attendeeType==="external-only"?"External Contact Only":m.attendeeType==="external-staff"?"Staff + External Contact":"Vote to Schedule"],
                  ["Created By",m.createdByName],
                  ["Created On",m.createdOn],
                  ...(m.externalName?[["External Contact",`${m.externalName}${m.externalOrg?" — "+m.externalOrg:""}${m.externalRole?" ("+m.externalRole+")":""}`]]:[] ),
                ].map(([k,v])=>(
                  <div key={k} style={{display:"flex",gap:12,padding:"7px 0",borderBottom:"1px solid "+C.cardBorder}}>
                    <div style={{color:C.muted,fontSize:13,width:140,flexShrink:0}}>{k}</div>
                    <div style={{color:C.text,fontSize:13}}>{v}</div>
                  </div>
                ))}
                {m.agenda&&<div style={{marginTop:12}}><div style={{color:C.gold,fontSize:11,fontWeight:800,letterSpacing:1,textTransform:"uppercase",marginBottom:6}}>Agenda</div><div style={{color:C.text,fontSize:14,lineHeight:1.7,whiteSpace:"pre-wrap"}}>{m.agenda}</div></div>}
              </div>

              {/* Vote section */}
              {m.status==="voting"&&(
                <div style={{background:C.card,border:"1px solid "+C.gold+"44",borderRadius:12,padding:"18px 20px",marginBottom:16}}>
                  <div style={{color:C.gold,fontSize:11,fontWeight:800,letterSpacing:2,textTransform:"uppercase",marginBottom:14}}>Vote — Select the Date & Time That Works for You</div>
                  {m.voteOptions.map((opt,i)=>{
                    const myVote=(m.voteResults||{})[currentUser.id];
                    const votes=Object.values(m.voteResults||{}).filter(v=>v===i).length;
                    const voters=Object.entries(m.voteResults||{}).filter(([,v])=>v===i).map(([uid])=>ALL_STAFF.find(s=>s.id===uid)?.name||uid).join(", ");
                    return(
                      <div key={i} style={{background:myVote===i?C.green+"22":C.dark,border:"2px solid "+(myVote===i?"#4CAF50":i===parseInt(winnerIdx)&&isLeadership?C.gold+"66":C.cardBorder),borderRadius:10,padding:"14px 16px",marginBottom:10}}>
                        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:8}}>
                          <div>
                            <div style={{color:C.text,fontWeight:700,fontSize:14}}>📅 {opt.date} at {opt.time}</div>
                            <div style={{color:C.muted,fontSize:12,marginTop:3}}>{votes} vote{votes!==1?"s":""}{voters?" — "+voters:""}</div>
                          </div>
                          <button onClick={()=>castVote(m.id,i)} style={{background:myVote===i?"#4CAF50":C.burgundy,border:"none",borderRadius:8,padding:"8px 16px",color:C.ivory,fontSize:13,fontWeight:700,cursor:"pointer"}}>
                            {myVote===i?"✓ Your Vote":"Vote for this date"}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                  {isLeadership&&winnerIdx!==null&&(
                    <div style={{marginTop:14,padding:"14px",background:C.dark,borderRadius:10,border:"1px solid "+C.gold+"44"}}>
                      <div style={{color:C.gold,fontWeight:700,fontSize:13,marginBottom:10}}>Leading option: {m.voteOptions[parseInt(winnerIdx)]?.date} at {m.voteOptions[parseInt(winnerIdx)]?.time}</div>
                      <button onClick={()=>finalizeMeeting(m.id,m.voteOptions[parseInt(winnerIdx)].date,m.voteOptions[parseInt(winnerIdx)].time)}
                        style={{background:C.green,border:"none",borderRadius:8,padding:"9px 18px",color:C.ivory,fontSize:13,fontWeight:800,cursor:"pointer"}}>
                        Confirm This Date — Schedule Meeting
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Attendees and responses */}
              <div style={{background:C.card,border:"1px solid "+C.cardBorder,borderRadius:12,padding:"18px 20px",marginBottom:16}}>
                <div style={{color:C.gold,fontSize:11,fontWeight:800,letterSpacing:2,textTransform:"uppercase",marginBottom:14}}>Attendees & Responses</div>
                {attendeeStaff.map(s=>{
                  const res=(m.responses||{})[s.id];
                  return(
                    <div key={s.id} style={{display:"flex",alignItems:"center",gap:12,padding:"9px 0",borderBottom:"1px solid "+C.cardBorder}}>
                      <div style={{width:32,height:32,borderRadius:"50%",background:s.color,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:800,color:C.ivory,flexShrink:0}}>{s.initials}</div>
                      <div style={{flex:1}}>
                        <div style={{color:C.text,fontWeight:700,fontSize:13}}>{s.name}</div>
                        {res&&<div style={{color:C.muted,fontSize:11,marginTop:2}}>
                          {res.canAttend==="no"?`Cannot attend — Follow up: ${res.followUpDate}`:`Attending via ${res.method}`}
                          {res.followUpNotes&&` | ${res.followUpNotes}`}
                        </div>}
                      </div>
                      <div style={{background:res?res.canAttend==="no"?C.error+"22":"#4CAF5022":C.cardBorder,border:"1px solid "+(res?res.canAttend==="no"?C.error+"44":"#4CAF5044":C.cardBorder),borderRadius:20,padding:"2px 10px",color:res?res.canAttend==="no"?C.error:"#4CAF50":C.muted,fontSize:11,fontWeight:700,flexShrink:0}}>
                        {res?res.canAttend==="no"?"Cannot Attend":`✓ ${res.method}`:"No Response"}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Submit your response */}
              {m.status==="scheduled"&&!myRes&&m.createdBy!==currentUser.id&&!responseSent&&(
                <div style={{background:C.card,border:"1px solid "+C.gold+"66",borderRadius:12,padding:"18px 20px",marginBottom:16}}>
                  <div style={{color:C.gold,fontSize:11,fontWeight:800,letterSpacing:2,textTransform:"uppercase",marginBottom:14}}>Your Response — Required</div>
                  <div style={{marginBottom:14}}>
                    <div style={{color:C.text,fontSize:13,fontWeight:600,marginBottom:8}}>Can you attend this meeting?</div>
                    <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
                      {["yes","no"].map(opt=>(
                        <button key={opt} onClick={()=>setResponse(p=>({...p,canAttend:opt}))}
                          style={{background:response.canAttend===opt?(opt==="yes"?C.green:C.error):C.dark,border:"1px solid "+(response.canAttend===opt?opt==="yes"?"#4CAF50":C.error:C.cardBorder),borderRadius:8,padding:"9px 20px",color:C.ivory,fontSize:13,fontWeight:700,cursor:"pointer"}}>
                          {opt==="yes"?"✓ Yes I can attend":"✗ No I cannot attend"}
                        </button>
                      ))}
                    </div>
                  </div>
                  {response.canAttend==="yes"&&(
                    <div style={{marginBottom:14}}>
                      <div style={{color:C.text,fontSize:13,fontWeight:600,marginBottom:8}}>How will you attend?</div>
                      <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                        {["In Person","Virtual","Video Conference","Phone Conference"].map(opt=>(
                          <button key={opt} onClick={()=>setResponse(p=>({...p,method:opt}))}
                            style={{background:response.method===opt?C.burgundy:C.dark,border:"1px solid "+(response.method===opt?C.gold+"66":C.cardBorder),borderRadius:8,padding:"8px 14px",color:response.method===opt?C.ivory:C.muted,fontSize:12,fontWeight:600,cursor:"pointer"}}>
                            {opt}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  {response.canAttend==="no"&&(
                    <div style={{marginBottom:14}}>
                      <div style={{color:C.text,fontSize:13,fontWeight:600,marginBottom:6}}>Follow-up date — when can you meet instead?</div>
                      <input type="text" value={response.followUpDate} onChange={e=>setResponse(p=>({...p,followUpDate:e.target.value}))} placeholder="e.g. July 20, 2026 at 2:00 PM"
                        style={{width:"100%",background:C.dark,border:"1px solid "+C.cardBorder,borderRadius:8,padding:"10px 14px",color:C.text,fontSize:14,outline:"none",fontFamily:"inherit"}}/>
                    </div>
                  )}
                  <div style={{marginBottom:14}}>
                    <div style={{color:C.text,fontSize:13,fontWeight:600,marginBottom:6}}>Notes (optional)</div>
                    <input type="text" value={response.followUpNotes} onChange={e=>setResponse(p=>({...p,followUpNotes:e.target.value}))} placeholder="Any additional notes about your attendance"
                      style={{width:"100%",background:C.dark,border:"1px solid "+C.cardBorder,borderRadius:8,padding:"10px 14px",color:C.text,fontSize:14,outline:"none",fontFamily:"inherit"}}/>
                  </div>
                  {responseError&&<div style={{color:C.error,fontSize:13,marginBottom:10}}>{responseError}</div>}
                  <button onClick={()=>submitResponse(m.id)} style={{width:"100%",background:C.green,border:"none",borderRadius:10,padding:"13px",color:C.ivory,fontSize:14,fontWeight:800,cursor:"pointer"}}>Submit My Response</button>
                </div>
              )}
              {responseSent&&<div style={{background:"#4CAF5022",border:"1px solid #4CAF5044",borderRadius:12,padding:16,textAlign:"center",color:"#4CAF50",fontWeight:700,fontSize:14,marginBottom:16}}>✓ Response submitted</div>}
              {myRes&&<div style={{background:"#4CAF5022",border:"1px solid #4CAF5044",borderRadius:12,padding:14,color:"#4CAF50",fontWeight:700,fontSize:13,marginBottom:16}}>✓ Your response: {myRes.canAttend==="no"?`Cannot attend — Follow up: ${myRes.followUpDate}`:`Attending via ${myRes.method}`}</div>}
            </div>
          );
        })()}

        {/* SCHEDULE MEETING */}
        {view==="schedule"&&isLeadership&&(
          <div>
            <div style={{color:C.gold,fontSize:11,fontWeight:800,letterSpacing:2,textTransform:"uppercase",marginBottom:14}}>Schedule a New Meeting</div>
            <div style={{background:C.card,border:"1px solid "+C.cardBorder,borderRadius:12,padding:"20px 22px"}}>
              <div style={{background:C.dark,border:"1px solid "+C.gold+"44",borderRadius:12,padding:"16px",marginBottom:20}}>
                <div style={{color:C.gold,fontSize:11,fontWeight:800,letterSpacing:2,textTransform:"uppercase",marginBottom:8}}>✨ AI Meeting Assistant</div>
                <div style={{color:C.muted,fontSize:12,marginBottom:10}}>Describe the meeting and AI will generate a title and agenda for you.</div>
                <div style={{display:"flex",gap:8,marginBottom:8}}>
                  <input type="text" value={aiPrompt} onChange={e=>{setAiPrompt(e.target.value);setAiError("");}} onKeyDown={e=>e.key==="Enter"&&generateMeetingWithAI()} placeholder="e.g. monthly board review of program operations and finances"
                    style={{flex:1,background:C.card,border:"1px solid "+C.cardBorder,borderRadius:8,padding:"10px 14px",color:C.text,fontSize:13,outline:"none",fontFamily:"inherit"}}/>
                  <button onClick={generateMeetingWithAI} disabled={aiLoading}
                    style={{background:C.gold,border:"none",borderRadius:8,padding:"10px 18px",color:C.dark,fontSize:13,fontWeight:800,cursor:aiLoading?"not-allowed":"pointer",flexShrink:0,opacity:aiLoading?0.7:1}}>
                    {aiLoading?"Generating...":"Generate ✨"}
                  </button>
                </div>
                {aiError&&<div style={{color:C.error,fontSize:12}}>{aiError}</div>}
              </div>
              {[
                {label:"Meeting title",key:"title",type:"text",ph:"e.g. Monthly Staff Check-In, Board Meeting, Intake Review"},
                {label:"Meeting date",key:"date",type:"text",ph:"e.g. July 20, 2026"},
                {label:"Meeting time",key:"time",type:"text",ph:"e.g. 2:00 PM CST"},
              ].map(f=>(
                <div key={f.key} style={{marginBottom:14}}>
                  <div style={{color:C.text,fontSize:13,fontWeight:600,marginBottom:6}}>{f.label}</div>
                  <input type="text" value={form[f.key]} onChange={e=>setForm(p=>({...p,[f.key]:e.target.value}))} placeholder={f.ph}
                    style={{width:"100%",background:C.dark,border:"1px solid "+C.cardBorder,borderRadius:8,padding:"10px 14px",color:C.text,fontSize:14,outline:"none",fontFamily:"inherit"}}/>
                </div>
              ))}
              <div style={{marginBottom:14}}>
                <div style={{color:C.text,fontSize:13,fontWeight:600,marginBottom:8}}>Meeting type</div>
                <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                  {["In Person","Virtual","Video Conference","Phone Conference","Hybrid"].map(opt=>(
                    <button key={opt} onClick={()=>setForm(p=>({...p,meetingType:opt}))}
                      style={{background:form.meetingType===opt?C.burgundy:C.dark,border:"1px solid "+(form.meetingType===opt?C.gold+"66":C.cardBorder),borderRadius:8,padding:"8px 14px",color:form.meetingType===opt?C.ivory:C.muted,fontSize:12,fontWeight:600,cursor:"pointer"}}>
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
              <div style={{marginBottom:14}}>
                <div style={{color:C.text,fontSize:13,fontWeight:600,marginBottom:8}}>Who is this meeting with?</div>
                <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                  {[
                    {val:"full-board",label:"Full Board / All Staff"},
                    {val:"single",label:"Single Staff Member"},
                    {val:"external-only",label:"External Contact Only"},
                    {val:"external-staff",label:"Staff + External Contact"},
                  ].map(opt=>(
                    <button key={opt.val} onClick={()=>setForm(p=>({...p,attendeeType:opt.val,attendees:opt.val==="full-board"?ALL_STAFF.map(s=>s.id):[]}))}
                      style={{background:form.attendeeType===opt.val?C.burgundy:C.dark,border:"1px solid "+(form.attendeeType===opt.val?C.gold+"66":C.cardBorder),borderRadius:8,padding:"8px 14px",color:form.attendeeType===opt.val?C.ivory:C.muted,fontSize:12,fontWeight:600,cursor:"pointer"}}>
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
              {(form.attendeeType==="single"||form.attendeeType==="external-staff")&&(
                <div style={{marginBottom:14}}>
                  <div style={{color:C.text,fontSize:13,fontWeight:600,marginBottom:8}}>Select staff attendees</div>
                  <div style={{display:"flex",flexDirection:"column",gap:6}}>
                    {ALL_STAFF.map(s=>(
                      <button key={s.id} onClick={()=>toggleAttendee(s.id)}
                        style={{background:form.attendees.includes(s.id)?C.burgundy:C.dark,border:"1px solid "+(form.attendees.includes(s.id)?C.gold+"66":C.cardBorder),borderRadius:8,padding:"9px 14px",color:form.attendees.includes(s.id)?C.ivory:C.muted,fontSize:13,fontWeight:600,cursor:"pointer",textAlign:"left",display:"flex",alignItems:"center",gap:10}}>
                        <div style={{width:28,height:28,borderRadius:"50%",background:s.color,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:800,color:C.ivory,flexShrink:0}}>{s.initials}</div>
                        <span>{s.name}</span>
                        {form.attendees.includes(s.id)&&<span style={{marginLeft:"auto",color:C.gold}}>✓</span>}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {(form.attendeeType==="external-only"||form.attendeeType==="external-staff")&&(
                <div style={{marginBottom:14,padding:"14px",background:C.dark,borderRadius:10,border:"1px solid "+C.cardBorder}}>
                  <div style={{color:C.gold,fontSize:11,fontWeight:800,textTransform:"uppercase",letterSpacing:1,marginBottom:10}}>External Contact Details</div>
                  {[
                    {label:"Full name",key:"externalName",ph:"Full name of external contact"},
                    {label:"Organization",key:"externalOrg",ph:"e.g. TDCJ, BOP, VA Houston, employer name"},
                    {label:"Role / Title",key:"externalRole",ph:"e.g. Parole Officer, Facility Director, Employer, Partner Organization"},
                  ].map(f=>(
                    <div key={f.key} style={{marginBottom:10}}>
                      <div style={{color:C.text,fontSize:12,fontWeight:600,marginBottom:5}}>{f.label}</div>
                      <input type="text" value={form[f.key]} onChange={e=>setForm(p=>({...p,[f.key]:e.target.value}))} placeholder={f.ph}
                        style={{width:"100%",background:C.card,border:"1px solid "+C.cardBorder,borderRadius:8,padding:"9px 12px",color:C.text,fontSize:13,outline:"none",fontFamily:"inherit"}}/>
                    </div>
                  ))}
                </div>
              )}
              <div style={{marginBottom:14}}>
                <div style={{color:C.text,fontSize:13,fontWeight:600,marginBottom:6}}>Agenda</div>
                <textarea value={form.agenda} onChange={e=>setForm(p=>({...p,agenda:e.target.value}))} placeholder="List the agenda items for this meeting" rows={4}
                  style={{width:"100%",background:C.dark,border:"1px solid "+C.cardBorder,borderRadius:8,padding:"10px 14px",color:C.text,fontSize:14,resize:"vertical",outline:"none",fontFamily:"inherit",lineHeight:1.6}}/>
              </div>
              <div style={{marginBottom:20}}>
                <div style={{color:C.text,fontSize:13,fontWeight:600,marginBottom:6}}>Meeting notes (optional)</div>
                <textarea value={form.notes} onChange={e=>setForm(p=>({...p,notes:e.target.value}))} placeholder="Any additional notes or context for this meeting" rows={3}
                  style={{width:"100%",background:C.dark,border:"1px solid "+C.cardBorder,borderRadius:8,padding:"10px 14px",color:C.text,fontSize:14,resize:"vertical",outline:"none",fontFamily:"inherit",lineHeight:1.6}}/>
              </div>
              {formError&&<div style={{color:C.error,fontSize:13,marginBottom:12}}>{formError}</div>}
              {created&&<div style={{color:"#4CAF50",fontSize:13,fontWeight:700,marginBottom:12}}>✓ Meeting scheduled and sent to attendees</div>}
              <button onClick={createMeeting} style={{width:"100%",background:C.burgundy,border:"1px solid "+C.gold+"66",borderRadius:10,padding:"13px",color:C.ivory,fontSize:14,fontWeight:800,cursor:"pointer"}}>
                Schedule Meeting — Notify Attendees
              </button>
            </div>
          </div>
        )}

        {/* VOTE TO SCHEDULE */}
        {view==="vote"&&isLeadership&&(
          <div>
            <div style={{color:C.gold,fontSize:11,fontWeight:800,letterSpacing:2,textTransform:"uppercase",marginBottom:14}}>Create a Vote to Schedule a Meeting</div>
            <div style={{background:C.card,border:"1px solid "+C.cardBorder,borderRadius:12,padding:"20px 22px"}}>
              <div style={{marginBottom:14}}>
                <div style={{color:C.text,fontSize:13,fontWeight:600,marginBottom:6}}>Meeting title</div>
                <input type="text" value={form.title} onChange={e=>setForm(p=>({...p,title:e.target.value}))} placeholder="e.g. Quarterly Board Meeting — Vote for Date"
                  style={{width:"100%",background:C.dark,border:"1px solid "+C.cardBorder,borderRadius:8,padding:"10px 14px",color:C.text,fontSize:14,outline:"none",fontFamily:"inherit"}}/>
              </div>
              <div style={{marginBottom:14}}>
                <div style={{color:C.text,fontSize:13,fontWeight:600,marginBottom:8}}>Meeting type</div>
                <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                  {["In Person","Virtual","Video Conference","Phone Conference","Hybrid"].map(opt=>(
                    <button key={opt} onClick={()=>setForm(p=>({...p,meetingType:opt}))}
                      style={{background:form.meetingType===opt?C.burgundy:C.dark,border:"1px solid "+(form.meetingType===opt?C.gold+"66":C.cardBorder),borderRadius:8,padding:"8px 14px",color:form.meetingType===opt?C.ivory:C.muted,fontSize:12,fontWeight:600,cursor:"pointer"}}>
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
              <div style={{marginBottom:14}}>
                <div style={{color:C.text,fontSize:13,fontWeight:600,marginBottom:8}}>Who votes?</div>
                <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:10}}>
                  {[
                    {val:"full-board",label:"Full Board / All Staff"},
                    {val:"single",label:"Selected Staff"},
                  ].map(opt=>(
                    <button key={opt.val} onClick={()=>setForm(p=>({...p,attendeeType:opt.val,attendees:opt.val==="full-board"?ALL_STAFF.map(s=>s.id):[]}))}
                      style={{background:form.attendeeType===opt.val?C.burgundy:C.dark,border:"1px solid "+(form.attendeeType===opt.val?C.gold+"66":C.cardBorder),borderRadius:8,padding:"8px 14px",color:form.attendeeType===opt.val?C.ivory:C.muted,fontSize:12,fontWeight:600,cursor:"pointer"}}>
                      {opt.label}
                    </button>
                  ))}
                </div>
                {form.attendeeType==="single"&&(
                  <div style={{display:"flex",flexDirection:"column",gap:6}}>
                    {ALL_STAFF.map(s=>(
                      <button key={s.id} onClick={()=>toggleAttendee(s.id)}
                        style={{background:form.attendees.includes(s.id)?C.burgundy:C.dark,border:"1px solid "+(form.attendees.includes(s.id)?C.gold+"66":C.cardBorder),borderRadius:8,padding:"9px 14px",color:form.attendees.includes(s.id)?C.ivory:C.muted,fontSize:13,fontWeight:600,cursor:"pointer",textAlign:"left",display:"flex",alignItems:"center",gap:10}}>
                        <div style={{width:28,height:28,borderRadius:"50%",background:s.color,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:800,color:C.ivory,flexShrink:0}}>{s.initials}</div>
                        <span>{s.name}</span>
                        {form.attendees.includes(s.id)&&<span style={{marginLeft:"auto",color:C.gold}}>✓</span>}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <div style={{marginBottom:14}}>
                <div style={{color:C.text,fontSize:13,fontWeight:600,marginBottom:10}}>Date & Time Options — add at least 2 options for the team to vote on</div>
                {form.voteOptions.map((opt,i)=>(
                  <div key={i} style={{display:"flex",gap:10,marginBottom:10}}>
                    <div style={{flex:1}}>
                      <div style={{color:C.muted,fontSize:11,marginBottom:4}}>Option {i+1} — Date</div>
                      <input type="text" value={opt.date} onChange={e=>updateVoteOption(i,"date",e.target.value)} placeholder="e.g. July 20, 2026"
                        style={{width:"100%",background:C.dark,border:"1px solid "+C.cardBorder,borderRadius:8,padding:"9px 12px",color:C.text,fontSize:13,outline:"none",fontFamily:"inherit"}}/>
                    </div>
                    <div style={{flex:1}}>
                      <div style={{color:C.muted,fontSize:11,marginBottom:4}}>Time</div>
                      <input type="text" value={opt.time} onChange={e=>updateVoteOption(i,"time",e.target.value)} placeholder="e.g. 2:00 PM CST"
                        style={{width:"100%",background:C.dark,border:"1px solid "+C.cardBorder,borderRadius:8,padding:"9px 12px",color:C.text,fontSize:13,outline:"none",fontFamily:"inherit"}}/>
                    </div>
                  </div>
                ))}
                <button onClick={addVoteOption} style={{background:"transparent",border:"1px solid "+C.cardBorder,borderRadius:8,padding:"8px 16px",color:C.muted,fontSize:13,cursor:"pointer"}}>+ Add Another Option</button>
              </div>
              <div style={{marginBottom:20}}>
                <div style={{color:C.text,fontSize:13,fontWeight:600,marginBottom:6}}>Agenda</div>
                <textarea value={form.agenda} onChange={e=>setForm(p=>({...p,agenda:e.target.value}))} placeholder="What will this meeting cover?" rows={3}
                  style={{width:"100%",background:C.dark,border:"1px solid "+C.cardBorder,borderRadius:8,padding:"10px 14px",color:C.text,fontSize:14,resize:"vertical",outline:"none",fontFamily:"inherit",lineHeight:1.6}}/>
              </div>
              {formError&&<div style={{color:C.error,fontSize:13,marginBottom:12}}>{formError}</div>}
              {created&&<div style={{color:"#4CAF50",fontSize:13,fontWeight:700,marginBottom:12}}>✓ Vote created — staff can now vote on their preferred date</div>}
              <button onClick={()=>{setForm(p=>({...p,attendeeType:form.attendeeType||"full-board"})); createMeeting();}}
                style={{width:"100%",background:C.burgundy,border:"1px solid "+C.gold+"66",borderRadius:10,padding:"13px",color:C.ivory,fontSize:14,fontWeight:800,cursor:"pointer"}}>
                Send Vote to Staff
              </button>
            </div>
          </div>
        )}

        <div style={{height:48}}/>
      </div>
    </div>
  );
}