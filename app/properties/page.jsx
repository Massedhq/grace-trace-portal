// @ts-nocheck
"use client";
import { useState, useEffect } from "react";

const C = {
  burgundy:"#6B1A2A",burgundyDark:"#4A0E1A",green:"#1E4D2B",gold:"#C9A84C",
  ivory:"#F5F0E8",dark:"#1A0F12",card:"#2A1A1E",cardBorder:"#3D2028",
  text:"#F0EAE2",muted:"#A08878",error:"#EF5350",blue:"#1565C0",
};

const ALL_STAFF = [
  {id:"avy",name:"Avrial Evans (Avy)",initials:"AE",color:C.burgundy},
  {id:"travis",name:"Travis Ramar",initials:"TR",color:C.green},
  {id:"deann",name:"Deann Evans",initials:"DE",color:"#8B2A3E"},
  {id:"erica",name:"Erica Evans",initials:"EE",color:"#5C3010"},
  {id:"ialana",name:"Ialana Tippins",initials:"IT",color:"#1A3D2B"},
  {id:"aubreyon",name:"AuBreyon (Kisses) Woodley",initials:"KW",color:"#4A1A5C"},
  {id:"dennis",name:"Dennis Pride",initials:"DO",color:"#1A4D35"},
];

const STATUSES = ["New Submission","Gathering Information","Under Review","Tour Requested","Tour Scheduled","Financial Review","Offer Considered","Not Selected","Approved Candidate"];
const PROPERTY_TYPES = ["Office","Hotel","Assisted Living","Nursing Facility","School","Church","Apartment","Warehouse","Other"];
const STATUS_COLORS = {
  "New Submission":C.gold,"Gathering Information":"#1E88E5","Under Review":"#FB8C00",
  "Tour Requested":"#8E24AA","Tour Scheduled":"#00ACC1","Financial Review":"#43A047",
  "Offer Considered":"#E53935","Not Selected":C.muted,"Approved Candidate":"#2E7D32",
};

const FILTER_TABS = ["All","Under Review","Tour Scheduled","Offer Considered","Approved Candidate","Not Selected"];

async function loadProperties() {
  try { const r = await fetch("/api/properties"); return await r.json(); } catch(e) { return []; }
}
async function saveProperties(props) {
  try { await fetch("/api/properties", { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify(props) }); } catch(e) {}
}

const EMPTY_FORM = {
  name:"", address:"", city:"", state:"TX", askingPrice:"", monthlyLease:"",
  propertyType:"", squareFt:"", acres:"", numRooms:"", bathrooms:"", parkingSpaces:"",
  listingUrl:"", realtorName:"", realtorPhone:"", realtorEmail:"", description:"",
  kitchen:false, laundry:false, commercialKitchen:false, elevator:false,
  sprinklerSystem:false, adaAccessible:false, gatedProperty:false,
  fitsMission:false, separateMenWomen:false, spaceForOffices:false,
  spaceForClassrooms:false, outdoorRecreation:false, expansionPossible:false,
  photoUrl:"", pros:"", cons:"", zoning:"", notes:"",
};

export default function PropertyOpportunities() {
  const [currentUser, setCurrentUser] = useState(null);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState("list");
  const [activeProperty, setActiveProperty] = useState(null);
  const [filterTab, setFilterTab] = useState("All");
  const [search, setSearch] = useState("");
  const [form, setForm] = useState({...EMPTY_FORM});
  const [formError, setFormError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [quickUrl, setQuickUrl] = useState("");
  const [quickLoading, setQuickLoading] = useState(false);

  const isLeadership = currentUser?.id === "avy" || currentUser?.id === "travis";

  useEffect(() => {
    try {
      const uid = localStorage.getItem("gtm_current_user");
      if (uid) { const u = ALL_STAFF.find(s=>s.id===uid)||{id:uid,name:uid,initials:"?",color:C.burgundy}; setCurrentUser(u); }
    } catch(e) {}
    loadProperties().then(p => { setProperties(p); setLoading(false); });
  }, []);

  async function fetchFromUrl() {
    if (!quickUrl.trim()) return;
    setQuickLoading(true);
    try {
      const res = await fetch("/api/scrape", {
        method: "POST",
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify({ url: quickUrl })
      });
      const data = await res.json();
      if (data.error) {
        // Even if scraping fails, save the URL
        setForm(p => ({...p, listingUrl: quickUrl}));
        setQuickLoading(false);
        return;
      }
      setForm(p => ({
        ...p,
        listingUrl: quickUrl,
        name: data.title || p.name,
        description: data.description || p.description,
        photoUrl: data.photo || p.photoUrl,
        askingPrice: data.price || p.askingPrice,
        address: data.address || p.address,
        squareFt: data.sqft || p.squareFt,
        bathrooms: data.baths || p.bathrooms,
        numRooms: data.beds || p.numRooms,
      }));
    } catch(e) {
      setForm(p => ({...p, listingUrl: quickUrl}));
    }
    setQuickLoading(false);
  }

  function submitProperty() {
    if (!form.address.trim()) { setFormError("Please enter the property address."); return; }
    if (!form.city.trim()) { setFormError("Please enter the city."); return; }
    if (!form.propertyType) { setFormError("Please select a property type."); return; }
    const now = new Date().toLocaleDateString("en-US",{month:"long",day:"numeric",year:"numeric"});
    const prop = {
      id: Date.now().toString(),
      ...form,
      name: form.name || form.address,
      submittedBy: currentUser.id,
      submittedByName: currentUser.name,
      submittedOn: now,
      status: "New Submission",
      votes: {},
      comments: [],
      score: 0,
    };
    const updated = [prop, ...properties];
    setProperties(updated);
    saveProperties(updated);
    setForm({...EMPTY_FORM});
    setFormError("");
    setSubmitted(true);
    setTimeout(()=>{ setSubmitted(false); setView("list"); }, 1500);
  }

  function castVote(propId, vote) {
    const updated = properties.map(p => {
      if (p.id !== propId) return p;
      const votes = {...(p.votes||{})};
      votes[currentUser.id] = vote;
      const yesCount = Object.values(votes).filter(v=>v==="yes").length;
      const noCount = Object.values(votes).filter(v=>v==="no").length;
      const total = yesCount + noCount;
      const score = total > 0 ? Math.round((yesCount/total)*100) : 0;
      return {...p, votes, score};
    });
    setProperties(updated);
    saveProperties(updated);
    if (activeProperty?.id === propId) setActiveProperty(updated.find(p=>p.id===propId));
  }

  function addComment(propId) {
    if (!newComment.trim()) return;
    const now = new Date().toLocaleDateString("en-US",{month:"long",day:"numeric",year:"numeric"});
    const comment = { id:Date.now().toString(), text:newComment, authorId:currentUser.id, authorName:currentUser.name, date:now };
    const updated = properties.map(p => p.id!==propId?p:{...p,comments:[...(p.comments||[]),comment]});
    setProperties(updated);
    saveProperties(updated);
    if (activeProperty?.id===propId) setActiveProperty(updated.find(p=>p.id===propId));
    setNewComment("");
  }

  function updateStatus(propId, status) {
    const updated = properties.map(p => p.id!==propId?p:{...p,status});
    setProperties(updated);
    saveProperties(updated);
    if (activeProperty?.id===propId) setActiveProperty(updated.find(p=>p.id===propId));
  }

  function deleteProperty(propId) {
    if (!window.confirm("Remove this property?")) return;
    const updated = properties.filter(p=>p.id!==propId);
    setProperties(updated);
    saveProperties(updated);
    setActiveProperty(null);
    setView("list");
  }

  if (loading) return <div style={{minHeight:"100vh",background:C.dark,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Inter','Segoe UI',sans-serif"}}><div style={{color:C.muted,fontSize:14}}>Loading properties...</div></div>;

  if (!currentUser) return (
    <div style={{minHeight:"100vh",background:C.dark,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Inter','Segoe UI',sans-serif"}}>
      <a href="/" style={{background:C.burgundy,borderRadius:8,padding:"11px 24px",color:C.ivory,fontSize:14,fontWeight:800,textDecoration:"none"}}>Log in first</a>
    </div>
  );

  const filtered = properties.filter(p => {
    const matchSearch = !search || p.name?.toLowerCase().includes(search.toLowerCase()) || p.address?.toLowerCase().includes(search.toLowerCase()) || p.city?.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filterTab==="All" || p.status===filterTab;
    return matchSearch && matchFilter;
  });

  // PROPERTY DETAIL
  if (activeProperty) {
    const prop = properties.find(p=>p.id===activeProperty.id)||activeProperty;
    const myVote = (prop.votes||{})[currentUser.id];
    const yesVotes = Object.values(prop.votes||{}).filter(v=>v==="yes").length;
    const noVotes = Object.values(prop.votes||{}).filter(v=>v==="no").length;
    const totalVotes = yesVotes + noVotes;
    const staff = ALL_STAFF.find(s=>s.id===prop.submittedBy);

    return (
      <div style={{minHeight:"100vh",background:C.dark,fontFamily:"'Inter','Segoe UI',sans-serif"}}>
        <div style={{background:"linear-gradient(135deg,"+C.burgundyDark+" 0%,"+C.dark+" 70%)",borderBottom:"2px solid "+C.gold,padding:"14px 20px",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:10}}>
          <div>
            <div style={{color:C.gold,fontSize:10,fontWeight:800,letterSpacing:3,textTransform:"uppercase"}}>Property Opportunities</div>
            <div style={{color:C.ivory,fontWeight:900,fontSize:16,marginTop:2}}>{prop.name||prop.address}</div>
          </div>
          <div style={{display:"flex",gap:8}}>
            {isLeadership&&<button onClick={()=>deleteProperty(prop.id)} style={{background:C.error+"22",border:"1px solid "+C.error+"44",borderRadius:8,padding:"6px 12px",color:C.error,fontSize:12,fontWeight:700,cursor:"pointer"}}>Remove</button>}
            <button onClick={()=>setActiveProperty(null)} style={{background:"transparent",border:"1px solid "+C.cardBorder,borderRadius:8,padding:"6px 12px",color:C.muted,fontSize:12,cursor:"pointer"}}>← Back</button>
          </div>
        </div>

        <div style={{maxWidth:720,margin:"0 auto",padding:"20px 16px"}}>

          {/* Status badge */}
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16,flexWrap:"wrap",gap:8}}>
            <div style={{background:(STATUS_COLORS[prop.status]||C.gold)+"22",border:"1px solid "+(STATUS_COLORS[prop.status]||C.gold)+"66",borderRadius:20,padding:"4px 14px",color:STATUS_COLORS[prop.status]||C.gold,fontSize:12,fontWeight:800}}>
              {prop.status}
            </div>
            <div style={{color:C.muted,fontSize:12}}>Submitted by {prop.submittedByName} · {prop.submittedOn}</div>
          </div>

          {/* Photo */}
          {prop.photoUrl&&(
            <div style={{width:"100%",height:220,borderRadius:12,overflow:"hidden",marginBottom:16,background:C.card}}>
              <img src={prop.photoUrl} alt={prop.name} style={{width:"100%",height:"100%",objectFit:"cover"}} onError={e=>e.target.style.display="none"}/>
            </div>
          )}

          {/* Overview */}
          <div style={{background:C.card,border:"1px solid "+C.cardBorder,borderRadius:12,padding:"18px 20px",marginBottom:14}}>
            <div style={{color:C.gold,fontSize:11,fontWeight:800,letterSpacing:2,textTransform:"uppercase",marginBottom:12}}>Property Overview</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"8px 16px"}}>
              {[
                ["Address",prop.address+", "+prop.city+", "+prop.state],
                ["Type",prop.propertyType],
                ["Asking Price",prop.askingPrice||"—"],
                ["Monthly Lease",prop.monthlyLease||"—"],
                ["Square Footage",prop.squareFt||"—"],
                ["Acres",prop.acres||"—"],
                ["Rooms",prop.numRooms||"—"],
                ["Bathrooms",prop.bathrooms||"—"],
                ["Parking",prop.parkingSpaces||"—"],
                ["Zoning",prop.zoning||"—"],
              ].map(([label,val],i)=>(
                <div key={i} style={{padding:"6px 0",borderBottom:"1px solid "+C.cardBorder}}>
                  <div style={{color:C.muted,fontSize:11}}>{label}</div>
                  <div style={{color:C.text,fontSize:13,fontWeight:600,marginTop:2}}>{val}</div>
                </div>
              ))}
            </div>
            {prop.description&&<div style={{marginTop:12,color:C.text,fontSize:14,lineHeight:1.8}}>{prop.description}</div>}
            {prop.listingUrl&&<a href={prop.listingUrl} target="_blank" rel="noreferrer" style={{display:"inline-block",marginTop:12,background:C.burgundy,border:"1px solid "+C.gold+"66",borderRadius:8,padding:"8px 16px",color:C.ivory,fontSize:13,fontWeight:700,textDecoration:"none"}}>🔗 Open Original Listing</a>}
          </div>

          {/* Realtor */}
          {(prop.realtorName||prop.realtorPhone||prop.realtorEmail)&&(
            <div style={{background:C.card,border:"1px solid "+C.cardBorder,borderRadius:12,padding:"16px 20px",marginBottom:14}}>
              <div style={{color:C.gold,fontSize:11,fontWeight:800,letterSpacing:2,textTransform:"uppercase",marginBottom:10}}>Listing Agent</div>
              {prop.realtorName&&<div style={{color:C.text,fontSize:14,fontWeight:700}}>{prop.realtorName}</div>}
              {prop.realtorPhone&&<div style={{color:C.muted,fontSize:13,marginTop:4}}>📞 {prop.realtorPhone}</div>}
              {prop.realtorEmail&&<div style={{color:C.muted,fontSize:13,marginTop:2}}>✉️ {prop.realtorEmail}</div>}
            </div>
          )}

          {/* Amenities */}
          <div style={{background:C.card,border:"1px solid "+C.cardBorder,borderRadius:12,padding:"16px 20px",marginBottom:14}}>
            <div style={{color:C.gold,fontSize:11,fontWeight:800,letterSpacing:2,textTransform:"uppercase",marginBottom:12}}>Building Features</div>
            <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
              {[
                {key:"kitchen",label:"Kitchen"},
                {key:"laundry",label:"Laundry"},
                {key:"commercialKitchen",label:"Commercial Kitchen"},
                {key:"elevator",label:"Elevator"},
                {key:"sprinklerSystem",label:"Sprinkler System"},
                {key:"adaAccessible",label:"ADA Accessible"},
                {key:"gatedProperty",label:"Gated Property"},
              ].map(f=>(
                <div key={f.key} style={{background:prop[f.key]?"#4CAF5022":C.dark,border:"1px solid "+(prop[f.key]?"#4CAF5044":C.cardBorder),borderRadius:20,padding:"4px 12px",color:prop[f.key]?"#4CAF50":C.muted,fontSize:12,fontWeight:600}}>
                  {prop[f.key]?"✓":"✗"} {f.label}
                </div>
              ))}
            </div>
          </div>

          {/* Grace Trace Fit */}
          <div style={{background:C.card,border:"1px solid "+C.cardBorder,borderRadius:12,padding:"16px 20px",marginBottom:14}}>
            <div style={{color:C.gold,fontSize:11,fontWeight:800,letterSpacing:2,textTransform:"uppercase",marginBottom:12}}>Grace Trace Evaluation</div>
            <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
              {[
                {key:"fitsMission",label:"Fits Our Mission"},
                {key:"separateMenWomen",label:"Can Separate Men & Women"},
                {key:"spaceForOffices",label:"Space for Offices"},
                {key:"spaceForClassrooms",label:"Space for Classrooms"},
                {key:"outdoorRecreation",label:"Outdoor Recreation"},
                {key:"expansionPossible",label:"Expansion Possible"},
              ].map(f=>(
                <div key={f.key} style={{background:prop[f.key]?"#4CAF5022":C.dark,border:"1px solid "+(prop[f.key]?"#4CAF5044":C.cardBorder),borderRadius:20,padding:"4px 12px",color:prop[f.key]?"#4CAF50":C.muted,fontSize:12,fontWeight:600}}>
                  {prop[f.key]?"✅":"❌"} {f.label}
                </div>
              ))}
            </div>
          </div>

          {/* Pros / Cons / Notes */}
          {(prop.pros||prop.cons||prop.notes)&&(
            <div style={{background:C.card,border:"1px solid "+C.cardBorder,borderRadius:12,padding:"16px 20px",marginBottom:14}}>
              {prop.pros&&<div style={{marginBottom:10}}><div style={{color:"#4CAF50",fontSize:11,fontWeight:800,letterSpacing:1,textTransform:"uppercase",marginBottom:4}}>Pros</div><div style={{color:C.text,fontSize:14,lineHeight:1.8,whiteSpace:"pre-wrap"}}>{prop.pros}</div></div>}
              {prop.cons&&<div style={{marginBottom:10}}><div style={{color:C.error,fontSize:11,fontWeight:800,letterSpacing:1,textTransform:"uppercase",marginBottom:4}}>Cons</div><div style={{color:C.text,fontSize:14,lineHeight:1.8,whiteSpace:"pre-wrap"}}>{prop.cons}</div></div>}
              {prop.notes&&<div><div style={{color:C.muted,fontSize:11,fontWeight:800,letterSpacing:1,textTransform:"uppercase",marginBottom:4}}>Notes</div><div style={{color:C.text,fontSize:14,lineHeight:1.8,whiteSpace:"pre-wrap"}}>{prop.notes}</div></div>}
            </div>
          )}

          {/* Community Vote */}
          <div style={{background:C.card,border:"1px solid "+C.gold+"44",borderRadius:12,padding:"20px",marginBottom:14}}>
            <div style={{color:C.gold,fontSize:11,fontWeight:800,letterSpacing:2,textTransform:"uppercase",marginBottom:8}}>Team Vote</div>
            <div style={{color:C.text,fontSize:14,marginBottom:16}}>Should Grace Trace Ministries investigate this property?</div>
            <div style={{display:"flex",gap:10,marginBottom:16}}>
              <button onClick={()=>castVote(prop.id,"yes")} style={{flex:1,background:myVote==="yes"?"#4CAF50":C.dark,border:"2px solid "+(myVote==="yes"?"#4CAF50":C.cardBorder),borderRadius:10,padding:"12px",color:myVote==="yes"?C.dark:C.muted,fontSize:14,fontWeight:800,cursor:"pointer"}}>
                👍 Move Forward
              </button>
              <button onClick={()=>castVote(prop.id,"no")} style={{flex:1,background:myVote==="no"?C.error:C.dark,border:"2px solid "+(myVote==="no"?C.error:C.cardBorder),borderRadius:10,padding:"12px",color:myVote==="no"?C.ivory:C.muted,fontSize:14,fontWeight:800,cursor:"pointer"}}>
                👎 Pass on This
              </button>
            </div>
            <div style={{display:"flex",gap:10}}>
              <div style={{flex:1,background:"#4CAF5022",border:"1px solid #4CAF5044",borderRadius:10,padding:"10px",textAlign:"center"}}>
                <div style={{color:"#4CAF50",fontWeight:900,fontSize:22}}>👍 {yesVotes}</div>
                <div style={{color:C.muted,fontSize:11,marginTop:2}}>Move Forward</div>
              </div>
              <div style={{flex:1,background:C.error+"22",border:"1px solid "+C.error+"44",borderRadius:10,padding:"10px",textAlign:"center"}}>
                <div style={{color:C.error,fontWeight:900,fontSize:22}}>👎 {noVotes}</div>
                <div style={{color:C.muted,fontSize:11,marginTop:2}}>Pass on This</div>
              </div>
              <div style={{flex:1,background:C.card,border:"1px solid "+C.cardBorder,borderRadius:10,padding:"10px",textAlign:"center"}}>
                <div style={{color:prop.score>=60?"#4CAF50":prop.score>=40?C.gold:C.error,fontWeight:900,fontSize:22}}>{prop.score}%</div>
                <div style={{color:C.muted,fontSize:11,marginTop:2}}>Team Score</div>
              </div>
            </div>
          </div>

          {/* Leadership Status Control */}
          {isLeadership&&(
            <div style={{background:C.card,border:"1px solid "+C.burgundy,borderRadius:12,padding:"16px 20px",marginBottom:14}}>
              <div style={{color:C.gold,fontSize:11,fontWeight:800,letterSpacing:2,textTransform:"uppercase",marginBottom:10}}>Leadership — Update Status</div>
              <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
                {STATUSES.map(s=>(
                  <button key={s} onClick={()=>updateStatus(prop.id,s)}
                    style={{background:prop.status===s?(STATUS_COLORS[s]||C.gold):C.dark,border:"1px solid "+(prop.status===s?(STATUS_COLORS[s]||C.gold)+"88":C.cardBorder),borderRadius:8,padding:"7px 12px",color:prop.status===s?C.ivory:C.muted,fontSize:12,fontWeight:prop.status===s?800:400,cursor:"pointer"}}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Comments */}
          <div style={{background:C.card,border:"1px solid "+C.cardBorder,borderRadius:12,padding:"16px 20px",marginBottom:14}}>
            <div style={{color:C.gold,fontSize:11,fontWeight:800,letterSpacing:2,textTransform:"uppercase",marginBottom:12}}>Team Discussion</div>
            {(prop.comments||[]).length===0&&<div style={{color:C.muted,fontSize:13,marginBottom:12}}>No comments yet. Be the first to share your thoughts.</div>}
            {(prop.comments||[]).map(c=>{
              const author = ALL_STAFF.find(s=>s.id===c.authorId);
              return(
                <div key={c.id} style={{display:"flex",gap:10,marginBottom:12,paddingBottom:12,borderBottom:"1px solid "+C.cardBorder}}>
                  <div style={{width:32,height:32,borderRadius:"50%",background:author?.color||C.burgundy,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:800,color:C.ivory,flexShrink:0}}>{author?.initials||"?"}</div>
                  <div style={{flex:1}}>
                    <div style={{display:"flex",gap:8,alignItems:"center",marginBottom:4}}>
                      <span style={{color:C.text,fontWeight:700,fontSize:13}}>{c.authorName}</span>
                      <span style={{color:C.muted,fontSize:11}}>{c.date}</span>
                    </div>
                    <div style={{color:C.text,fontSize:14,lineHeight:1.7}}>{c.text}</div>
                  </div>
                </div>
              );
            })}
            <div style={{display:"flex",gap:8,marginTop:8}}>
              <input type="text" value={newComment} onChange={e=>setNewComment(e.target.value)} onKeyDown={e=>e.key==="Enter"&&addComment(prop.id)} placeholder="Leave a comment..."
                style={{flex:1,background:C.dark,border:"1px solid "+C.cardBorder,borderRadius:8,padding:"10px 14px",color:C.text,fontSize:13,outline:"none",fontFamily:"inherit"}}/>
              <button onClick={()=>addComment(prop.id)} style={{background:C.burgundy,border:"1px solid "+C.gold+"66",borderRadius:8,padding:"10px 16px",color:C.ivory,fontSize:13,fontWeight:700,cursor:"pointer"}}>Post</button>
            </div>
          </div>

          <div style={{height:48}}/>
        </div>
      </div>
    );
  }

  return (
    <div style={{minHeight:"100vh",background:C.dark,fontFamily:"'Inter','Segoe UI',sans-serif"}}>
      <div style={{background:"linear-gradient(135deg,"+C.burgundyDark+" 0%,"+C.dark+" 70%)",borderBottom:"2px solid "+C.gold,padding:"14px 20px",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:10}}>
        <div>
          <div style={{color:C.gold,fontSize:10,fontWeight:800,letterSpacing:3,textTransform:"uppercase"}}>Grace Trace Ministries</div>
          <h1 style={{color:C.ivory,fontSize:17,fontWeight:900,margin:"2px 0"}}>🏢 Property Opportunities</h1>
          <div style={{color:C.muted,fontSize:12}}>Help choose our future Grace Trace location</div>
        </div>
        <div style={{display:"flex",gap:8}}>
          <button onClick={()=>setView(view==="submit"?"list":"submit")}
            style={{background:view==="submit"?C.muted:C.burgundy,border:"1px solid "+C.gold+"66",borderRadius:8,padding:"8px 16px",color:C.ivory,fontSize:13,fontWeight:800,cursor:"pointer"}}>
            {view==="submit"?"← Back":"+ Submit Property"}
          </button>
          <button onClick={()=>window.history.back()} style={{background:"transparent",border:"1px solid "+C.cardBorder,borderRadius:8,padding:"6px 12px",color:C.muted,fontSize:12,cursor:"pointer"}}>← Portal</button>
        </div>
      </div>

      <div style={{maxWidth:760,margin:"0 auto",padding:"20px 16px"}}>

        {/* SUBMIT FORM */}
        {view==="submit"&&(
          <div>
            {/* Quick URL paste */}
            <div style={{background:C.card,border:"1px solid "+C.gold+"44",borderRadius:12,padding:"16px 20px",marginBottom:20}}>
              <div style={{color:C.gold,fontSize:11,fontWeight:800,letterSpacing:2,textTransform:"uppercase",marginBottom:8}}>⚡ Quick Add from Listing Site</div>
              <div style={{color:C.muted,fontSize:12,marginBottom:10}}>Paste a Zillow, LoopNet, Crexi, or Realtor.com link — we'll pull the photo, price, address and description automatically</div>
              <div style={{display:"flex",gap:8}}>
                <input type="text" value={quickUrl} onChange={e=>setQuickUrl(e.target.value)} placeholder="https://www.zillow.com/homes/..."
                  style={{flex:1,background:C.dark,border:"1px solid "+C.cardBorder,borderRadius:8,padding:"10px 14px",color:C.text,fontSize:13,outline:"none",fontFamily:"inherit"}}/>
                <button onClick={fetchFromUrl} disabled={quickLoading} style={{background:C.gold,border:"none",borderRadius:8,padding:"10px 16px",color:C.dark,fontSize:13,fontWeight:800,cursor:quickLoading?"not-allowed":"pointer",opacity:quickLoading?0.7:1}}>
                  {quickLoading?"⏳ Pulling info...":"⚡ Import"}
                </button>
              </div>
            </div>

            <div style={{background:C.card,border:"1px solid "+C.cardBorder,borderRadius:12,padding:"20px 22px"}}>
              <div style={{color:C.gold,fontSize:13,fontWeight:800,marginBottom:16}}>Property Information</div>

              {/* Basic info */}
              {[
                {label:"Property name or nickname",key:"name",ph:"e.g. The Houston Church Building"},
                {label:"Street address",key:"address",ph:"123 Main Street",required:true},
                {label:"City",key:"city",ph:"Houston",required:true},
                {label:"State",key:"state",ph:"TX"},
                {label:"Asking price",key:"askingPrice",ph:"e.g. $850,000"},
                {label:"Monthly lease",key:"monthlyLease",ph:"e.g. $4,500/month"},
              ].map(f=>(
                <div key={f.key} style={{marginBottom:12}}>
                  <div style={{color:C.text,fontSize:13,fontWeight:600,marginBottom:5}}>{f.label}{f.required&&<span style={{color:C.error}}> *</span>}</div>
                  <input type="text" value={form[f.key]} onChange={e=>setForm(p=>({...p,[f.key]:e.target.value}))} placeholder={f.ph}
                    style={{width:"100%",background:C.dark,border:"1px solid "+C.cardBorder,borderRadius:8,padding:"9px 14px",color:C.text,fontSize:14,outline:"none",fontFamily:"inherit"}}/>
                </div>
              ))}

              {/* Property type */}
              <div style={{marginBottom:12}}>
                <div style={{color:C.text,fontSize:13,fontWeight:600,marginBottom:5}}>Property type <span style={{color:C.error}}>*</span></div>
                <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
                  {PROPERTY_TYPES.map(t=>(
                    <button key={t} onClick={()=>setForm(p=>({...p,propertyType:t}))}
                      style={{background:form.propertyType===t?C.burgundy:C.dark,border:"1px solid "+(form.propertyType===t?C.gold+"66":C.cardBorder),borderRadius:8,padding:"7px 12px",color:form.propertyType===t?C.ivory:C.muted,fontSize:12,fontWeight:600,cursor:"pointer"}}>
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Photo URL */}
              <div style={{marginBottom:12}}>
                <div style={{color:C.text,fontSize:13,fontWeight:600,marginBottom:5}}>Main photo URL</div>
                <input type="text" value={form.photoUrl} onChange={e=>setForm(p=>({...p,photoUrl:e.target.value}))} placeholder="https://... (paste image URL from listing)"
                  style={{width:"100%",background:C.dark,border:"1px solid "+C.cardBorder,borderRadius:8,padding:"9px 14px",color:C.text,fontSize:14,outline:"none",fontFamily:"inherit"}}/>
              </div>

              {/* Building details */}
              <div style={{color:C.gold,fontSize:13,fontWeight:800,margin:"16px 0 12px"}}>Building Details</div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:12}}>
                {[
                  {label:"Square footage",key:"squareFt",ph:"e.g. 5,000 sq ft"},
                  {label:"Acres",key:"acres",ph:"e.g. 1.2 acres"},
                  {label:"Number of rooms",key:"numRooms",ph:"e.g. 20"},
                  {label:"Bathrooms",key:"bathrooms",ph:"e.g. 8"},
                  {label:"Parking spaces",key:"parkingSpaces",ph:"e.g. 25"},
                  {label:"Zoning",key:"zoning",ph:"e.g. R-3, Commercial"},
                ].map(f=>(
                  <div key={f.key}>
                    <div style={{color:C.muted,fontSize:11,marginBottom:4}}>{f.label}</div>
                    <input type="text" value={form[f.key]} onChange={e=>setForm(p=>({...p,[f.key]:e.target.value}))} placeholder={f.ph}
                      style={{width:"100%",background:C.dark,border:"1px solid "+C.cardBorder,borderRadius:8,padding:"8px 12px",color:C.text,fontSize:13,outline:"none",fontFamily:"inherit"}}/>
                  </div>
                ))}
              </div>

              {/* Amenity toggles */}
              <div style={{color:C.gold,fontSize:13,fontWeight:800,margin:"16px 0 10px"}}>Building Features</div>
              <div style={{display:"flex",flexWrap:"wrap",gap:8,marginBottom:16}}>
                {[
                  {key:"kitchen",label:"Kitchen"},
                  {key:"laundry",label:"Laundry"},
                  {key:"commercialKitchen",label:"Commercial Kitchen"},
                  {key:"elevator",label:"Elevator"},
                  {key:"sprinklerSystem",label:"Sprinklers"},
                  {key:"adaAccessible",label:"ADA Accessible"},
                  {key:"gatedProperty",label:"Gated"},
                ].map(f=>(
                  <button key={f.key} onClick={()=>setForm(p=>({...p,[f.key]:!p[f.key]}))}
                    style={{background:form[f.key]?"#4CAF5022":C.dark,border:"1px solid "+(form[f.key]?"#4CAF5044":C.cardBorder),borderRadius:20,padding:"6px 14px",color:form[f.key]?"#4CAF50":C.muted,fontSize:12,fontWeight:600,cursor:"pointer"}}>
                    {form[f.key]?"✓":"+"} {f.label}
                  </button>
                ))}
              </div>

              {/* Grace Trace fit */}
              <div style={{color:C.gold,fontSize:13,fontWeight:800,margin:"16px 0 10px"}}>Grace Trace Evaluation</div>
              <div style={{display:"flex",flexWrap:"wrap",gap:8,marginBottom:16}}>
                {[
                  {key:"fitsMission",label:"Fits Our Mission"},
                  {key:"separateMenWomen",label:"Can Separate Men & Women"},
                  {key:"spaceForOffices",label:"Space for Offices"},
                  {key:"spaceForClassrooms",label:"Space for Classrooms"},
                  {key:"outdoorRecreation",label:"Outdoor Recreation"},
                  {key:"expansionPossible",label:"Expansion Possible"},
                ].map(f=>(
                  <button key={f.key} onClick={()=>setForm(p=>({...p,[f.key]:!p[f.key]}))}
                    style={{background:form[f.key]?"#4CAF5022":C.dark,border:"1px solid "+(form[f.key]?"#4CAF5044":C.cardBorder),borderRadius:20,padding:"6px 14px",color:form[f.key]?"#4CAF50":C.muted,fontSize:12,fontWeight:600,cursor:"pointer"}}>
                    {form[f.key]?"✅":"—"} {f.label}
                  </button>
                ))}
              </div>

              {/* Listing info */}
              <div style={{color:C.gold,fontSize:13,fontWeight:800,margin:"16px 0 12px"}}>Listing Information</div>
              {[
                {label:"Listing URL",key:"listingUrl",ph:"https://www.zillow.com/..."},
                {label:"Realtor name",key:"realtorName",ph:"Agent or broker name"},
                {label:"Realtor phone",key:"realtorPhone",ph:"Direct phone number"},
                {label:"Realtor email",key:"realtorEmail",ph:"Agent email"},
              ].map(f=>(
                <div key={f.key} style={{marginBottom:10}}>
                  <div style={{color:C.muted,fontSize:11,marginBottom:4}}>{f.label}</div>
                  <input type="text" value={form[f.key]} onChange={e=>setForm(p=>({...p,[f.key]:e.target.value}))} placeholder={f.ph}
                    style={{width:"100%",background:C.dark,border:"1px solid "+C.cardBorder,borderRadius:8,padding:"9px 14px",color:C.text,fontSize:13,outline:"none",fontFamily:"inherit"}}/>
                </div>
              ))}

              {/* Description / Pros / Cons / Notes */}
              {[
                {label:"Property description",key:"description",ph:"Describe the property — condition, history, highlights"},
                {label:"Pros",key:"pros",ph:"What makes this property a strong candidate?"},
                {label:"Cons",key:"cons",ph:"What concerns or drawbacks does this property have?"},
                {label:"Notes",key:"notes",ph:"Any other information about this property"},
              ].map(f=>(
                <div key={f.key} style={{marginBottom:12}}>
                  <div style={{color:C.text,fontSize:13,fontWeight:600,marginBottom:5}}>{f.label}</div>
                  <textarea value={form[f.key]} onChange={e=>setForm(p=>({...p,[f.key]:e.target.value}))} placeholder={f.ph} rows={3}
                    style={{width:"100%",background:C.dark,border:"1px solid "+C.cardBorder,borderRadius:8,padding:"9px 14px",color:C.text,fontSize:13,resize:"vertical",outline:"none",fontFamily:"inherit",lineHeight:1.6}}/>
                </div>
              ))}

              {formError&&<div style={{color:C.error,fontSize:13,marginBottom:12}}>{formError}</div>}
              {submitted&&<div style={{color:"#4CAF50",fontSize:13,fontWeight:700,marginBottom:12}}>✓ Property submitted for team review</div>}
              <button onClick={submitProperty} style={{width:"100%",background:C.burgundy,border:"1px solid "+C.gold+"66",borderRadius:10,padding:"13px",color:C.ivory,fontSize:14,fontWeight:800,cursor:"pointer"}}>
                🏢 Submit Property for Team Review
              </button>
            </div>
          </div>
        )}

        {/* PROPERTY LIST */}
        {view==="list"&&(
          <div>
            <div style={{color:C.ivory,fontSize:13,lineHeight:1.7,marginBottom:20,textAlign:"center",padding:"0 8px"}}>
              Know of a building that could become a Grace Trace Ministries location?<br/>
              <span style={{color:C.gold,fontWeight:700}}>Submit it below for review by our team.</span>
            </div>

            {/* Search */}
            <input type="text" value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search properties by name, address, or city..."
              style={{width:"100%",background:C.card,border:"1px solid "+C.cardBorder,borderRadius:8,padding:"10px 14px",color:C.text,fontSize:13,outline:"none",fontFamily:"inherit",marginBottom:12}}/>

            {/* Filter tabs */}
            <div style={{display:"flex",gap:4,overflowX:"auto",paddingBottom:4,marginBottom:16}}>
              {FILTER_TABS.map(tab=>{
                const count = tab==="All"?properties.length:properties.filter(p=>p.status===tab).length;
                return(
                  <button key={tab} onClick={()=>setFilterTab(tab)}
                    style={{background:filterTab===tab?C.burgundy:C.dark,border:"1px solid "+(filterTab===tab?C.gold+"66":C.cardBorder),borderRadius:20,padding:"5px 12px",color:filterTab===tab?C.ivory:C.muted,fontSize:11,fontWeight:filterTab===tab?800:500,cursor:"pointer",whiteSpace:"nowrap",flexShrink:0}}>
                    {tab} {count>0&&`(${count})`}
                  </button>
                );
              })}
            </div>

            {/* Stats */}
            <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8,marginBottom:16}}>
              {[
                {label:"Total Properties",count:properties.length,color:C.text},
                {label:"Under Review",count:properties.filter(p=>["Under Review","Tour Requested","Tour Scheduled","Financial Review","Offer Considered"].includes(p.status)).length,color:C.gold},
                {label:"Approved",count:properties.filter(p=>p.status==="Approved Candidate").length,color:"#4CAF50"},
              ].map((s,i)=>(
                <div key={i} style={{background:C.card,border:"1px solid "+C.cardBorder,borderRadius:10,padding:"12px",textAlign:"center"}}>
                  <div style={{color:s.color,fontWeight:900,fontSize:20}}>{s.count}</div>
                  <div style={{color:C.muted,fontSize:10,marginTop:2}}>{s.label}</div>
                </div>
              ))}
            </div>

            {filtered.length===0&&(
              <div style={{background:C.card,border:"1px solid "+C.cardBorder,borderRadius:12,padding:32,textAlign:"center"}}>
                <div style={{fontSize:32,marginBottom:8}}>🏢</div>
                <div style={{color:C.muted,fontSize:14}}>No properties found. Be the first to submit one!</div>
                <button onClick={()=>setView("submit")} style={{marginTop:12,background:C.burgundy,border:"1px solid "+C.gold+"66",borderRadius:8,padding:"10px 20px",color:C.ivory,fontSize:13,fontWeight:800,cursor:"pointer"}}>Submit a Property</button>
              </div>
            )}

            {filtered.map(prop=>{
              const myVote = (prop.votes||{})[currentUser.id];
              const yesVotes = Object.values(prop.votes||{}).filter(v=>v==="yes").length;
              const noVotes = Object.values(prop.votes||{}).filter(v=>v==="no").length;
              return(
                <div key={prop.id} style={{background:C.card,border:"1px solid "+C.cardBorder,borderRadius:12,marginBottom:12,overflow:"hidden"}}>
                  {/* Photo */}
                  {prop.photoUrl&&(
                    <div style={{width:"100%",height:160,background:C.dark}}>
                      <img src={prop.photoUrl} alt={prop.name} style={{width:"100%",height:"100%",objectFit:"cover"}} onError={e=>e.target.style.display="none"}/>
                    </div>
                  )}
                  {!prop.photoUrl&&(
                    <div style={{width:"100%",height:80,background:"linear-gradient(135deg,"+C.burgundyDark+" 0%,"+C.dark+" 100%)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:32}}>🏢</div>
                  )}

                  <div style={{padding:"14px 16px"}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:8,marginBottom:8}}>
                      <div>
                        <div style={{color:C.text,fontWeight:800,fontSize:15}}>{prop.name||prop.address}</div>
                        <div style={{color:C.muted,fontSize:12,marginTop:2}}>{prop.city}, {prop.state} · {prop.propertyType}</div>
                      </div>
                      <div style={{background:(STATUS_COLORS[prop.status]||C.gold)+"22",border:"1px solid "+(STATUS_COLORS[prop.status]||C.gold)+"66",borderRadius:20,padding:"3px 10px",color:STATUS_COLORS[prop.status]||C.gold,fontSize:10,fontWeight:800,flexShrink:0}}>
                        {prop.status}
                      </div>
                    </div>

                    <div style={{display:"flex",gap:12,marginBottom:10,flexWrap:"wrap"}}>
                      {prop.askingPrice&&<div style={{color:C.gold,fontWeight:800,fontSize:14}}>{prop.askingPrice}</div>}
                      {prop.squareFt&&<div style={{color:C.muted,fontSize:12}}>{prop.squareFt}</div>}
                      {prop.numRooms&&<div style={{color:C.muted,fontSize:12}}>{prop.numRooms} rooms</div>}
                    </div>

                    <div style={{color:C.muted,fontSize:11,marginBottom:12}}>Submitted by {prop.submittedByName} · {prop.submittedOn} · {(prop.comments||[]).length} comments</div>

                    {/* Vote bar */}
                    <div style={{display:"flex",gap:8,alignItems:"center",marginBottom:12}}>
                      <div style={{color:"#4CAF50",fontSize:12,fontWeight:700}}>👍 {yesVotes}</div>
                      <div style={{flex:1,height:6,background:C.dark,borderRadius:20,overflow:"hidden"}}>
                        <div style={{height:"100%",background:"#4CAF50",borderRadius:20,width:(yesVotes+noVotes>0?Math.round(yesVotes/(yesVotes+noVotes)*100):0)+"%",transition:"width 0.3s"}}/>
                      </div>
                      <div style={{color:C.error,fontSize:12,fontWeight:700}}>{noVotes} 👎</div>
                    </div>

                    {/* Action buttons */}
                    <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                      <button onClick={()=>setActiveProperty(prop)} style={{flex:1,background:C.burgundy,border:"1px solid "+C.gold+"66",borderRadius:8,padding:"8px",color:C.ivory,fontSize:12,fontWeight:700,cursor:"pointer"}}>View Details</button>
                      <button onClick={()=>{castVote(prop.id,"yes");}} style={{background:myVote==="yes"?"#4CAF50":C.dark,border:"1px solid "+(myVote==="yes"?"#4CAF50":C.cardBorder),borderRadius:8,padding:"8px 12px",color:myVote==="yes"?C.dark:C.muted,fontSize:13,fontWeight:800,cursor:"pointer"}}>👍</button>
                      <button onClick={()=>{castVote(prop.id,"no");}} style={{background:myVote==="no"?C.error:C.dark,border:"1px solid "+(myVote==="no"?C.error:C.cardBorder),borderRadius:8,padding:"8px 12px",color:myVote==="no"?C.ivory:C.muted,fontSize:13,fontWeight:800,cursor:"pointer"}}>👎</button>
                      {prop.listingUrl&&<a href={prop.listingUrl} target="_blank" rel="noreferrer" style={{background:C.dark,border:"1px solid "+C.cardBorder,borderRadius:8,padding:"8px 12px",color:C.muted,fontSize:12,textDecoration:"none",display:"flex",alignItems:"center"}}>🔗</a>}
                    </div>
                  </div>
                </div>
              );
            })}
            <div style={{height:48}}/>
          </div>
        )}
      </div>
    </div>
  );
}