// @ts-nocheck
"use client";
import { useState, useEffect } from "react";

const C = {
  burgundy:"#6B1A2A",burgundyDark:"#4A0E1A",green:"#1E4D2B",gold:"#C9A84C",
  ivory:"#F5F0E8",dark:"#1A0F12",card:"#2A1A1E",cardBorder:"#3D2028",
  text:"#F0EAE2",muted:"#A08878",error:"#EF5350",
};

const CATEGORIES = [
  "Office Supplies","Cleaning Supplies","Facility Maintenance","Food & Groceries",
  "Clothing & Uniforms","Technology & Equipment","Printing & Marketing",
  "Medical & First Aid","Transportation","Training & Education",
  "Government / Compliance","Construction & Renovation","Other",
];

async function loadVendors() {
  try { const r = await fetch("/api/vendors"); return await r.json(); } catch(e) { return []; }
}
async function saveVendors(vendors) {
  try { await fetch("/api/vendors", { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify(vendors) }); } catch(e) {}
}

export default function VendorList() {
  const [currentUser, setCurrentUser] = useState(null);
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState("list");
  const [activeVendor, setActiveVendor] = useState(null);
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");

  const [form, setForm] = useState({
    name:"", category:"", website:"", phone:"", email:"",
    contactName:"", address:"", description:"", whyRecommend:"",
    priceRange:"", notes:"",
  });
  const [formError, setFormError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const isLeadership = currentUser && (currentUser.id === "avy" || currentUser.id === "travis");

  useEffect(() => {
    try {
      const uid = localStorage.getItem("gtm_current_user");
      if (uid) setCurrentUser({ id: uid });
    } catch(e) {}
    loadVendors().then(v => { setVendors(v); setLoading(false); });
  }, []);

  function submitVendor() {
    if (!form.name.trim()) { setFormError("Please enter the vendor name."); return; }
    if (!form.category) { setFormError("Please select a category."); return; }
    if (!form.description.trim()) { setFormError("Please describe what this vendor offers."); return; }
    const now = new Date().toLocaleDateString("en-US",{month:"long",day:"numeric",year:"numeric"});
    const vendor = {
      id: Date.now().toString(),
      name: form.name,
      category: form.category,
      website: form.website,
      phone: form.phone,
      email: form.email,
      contactName: form.contactName,
      address: form.address,
      description: form.description,
      whyRecommend: form.whyRecommend,
      priceRange: form.priceRange,
      notes: form.notes,
      suggestedBy: currentUser.id,
      suggestedOn: now,
      status: "pending",
      approvedBy: "",
      approvedOn: "",
      approvalNotes: "",
    };
    const updated = [vendor, ...vendors];
    setVendors(updated);
    saveVendors(updated);
    setForm({name:"",category:"",website:"",phone:"",email:"",contactName:"",address:"",description:"",whyRecommend:"",priceRange:"",notes:""});
    setFormError("");
    setSubmitted(true);
    setTimeout(() => { setSubmitted(false); setView("list"); }, 1500);
  }

  function approveVendor(id) {
    const now = new Date().toLocaleDateString("en-US",{month:"long",day:"numeric",year:"numeric"});
    const updated = vendors.map(v => v.id !== id ? v : {...v, status:"approved", approvedBy:currentUser.id, approvedOn:now});
    setVendors(updated); saveVendors(updated);
    setActiveVendor(updated.find(v => v.id === id));
  }

  function rejectVendor(id) {
    const now = new Date().toLocaleDateString("en-US",{month:"long",day:"numeric",year:"numeric"});
    const updated = vendors.map(v => v.id !== id ? v : {...v, status:"rejected", approvedBy:currentUser.id, approvedOn:now});
    setVendors(updated); saveVendors(updated);
    setActiveVendor(updated.find(v => v.id === id));
  }

  function deleteVendor(id) {
    if (!window.confirm("Remove this vendor?")) return;
    const updated = vendors.filter(v => v.id !== id);
    setVendors(updated); saveVendors(updated);
    setActiveVendor(null); setView("list");
  }

  if (loading) return <div style={{minHeight:"100vh",background:C.dark,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Inter','Segoe UI',sans-serif"}}><div style={{color:C.muted}}>Loading...</div></div>;

  if (!currentUser) return (
    <div style={{minHeight:"100vh",background:C.dark,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Inter','Segoe UI',sans-serif"}}>
      <a href="/" style={{background:C.burgundy,borderRadius:8,padding:"11px 24px",color:C.ivory,fontSize:14,fontWeight:800,textDecoration:"none"}}>Log in first</a>
    </div>
  );

  const filtered = vendors.filter(v => {
    const matchSearch = !search || v.name.toLowerCase().includes(search.toLowerCase()) || v.description.toLowerCase().includes(search.toLowerCase());
    const matchCat = filterCategory === "All" || v.category === filterCategory;
    const matchStatus = filterStatus === "All" || v.status === filterStatus;
    return matchSearch && matchCat && matchStatus;
  });

  const pendingCount = vendors.filter(v => v.status === "pending").length;

  return (
    <div style={{minHeight:"100vh",background:C.dark,fontFamily:"'Inter','Segoe UI',sans-serif"}}>
      <div style={{background:"linear-gradient(135deg,"+C.burgundyDark+" 0%,"+C.dark+" 70%)",borderBottom:"2px solid "+C.gold,padding:"14px 24px",display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:10}}>
        <div>
          <div style={{color:C.gold,fontSize:10,fontWeight:800,letterSpacing:3,textTransform:"uppercase"}}>Grace Trace Ministries</div>
          <h1 style={{color:C.ivory,fontSize:17,fontWeight:900,margin:"2px 0"}}>Vendor List 🏪</h1>
          <div style={{color:C.muted,fontSize:12}}>Approved vendors and suggestions</div>
        </div>
        <button onClick={()=>window.history.back()} style={{background:"transparent",border:"1px solid "+C.cardBorder,borderRadius:8,padding:"6px 12px",color:C.muted,fontSize:12,cursor:"pointer"}}>← Back</button>
      </div>

      {/* Tabs */}
      <div style={{background:C.dark,borderBottom:"1px solid "+C.cardBorder,display:"flex",gap:2,padding:"0 24px"}}>
        {["list","suggest"].map(tab=>(
          <button key={tab} onClick={()=>{setView(tab);setActiveVendor(null);}}
            style={{background:"transparent",border:"none",borderBottom:view===tab?"2px solid "+C.gold:"2px solid transparent",color:view===tab?C.gold:C.muted,fontSize:13,fontWeight:view===tab?800:500,padding:"11px 16px",cursor:"pointer"}}>
            {tab==="list"?"Vendor Directory":"Suggest a Vendor"}
            {tab==="list"&&isLeadership&&pendingCount>0&&<span style={{background:C.error,color:C.ivory,borderRadius:20,padding:"1px 7px",fontSize:10,fontWeight:800,marginLeft:6}}>{pendingCount}</span>}
          </button>
        ))}
      </div>

      <div style={{maxWidth:760,margin:"0 auto",padding:"24px 20px"}}>

        {/* VENDOR LIST */}
        {view==="list"&&!activeVendor&&(
          <div>
            {/* Search and filters */}
            <div style={{display:"flex",gap:8,marginBottom:16,flexWrap:"wrap"}}>
              <input type="text" value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search vendors..."
                style={{flex:1,background:C.card,border:"1px solid "+C.cardBorder,borderRadius:8,padding:"9px 14px",color:C.text,fontSize:13,outline:"none",fontFamily:"inherit",minWidth:150}}/>
              <select value={filterCategory} onChange={e=>setFilterCategory(e.target.value)}
                style={{background:C.card,border:"1px solid "+C.cardBorder,borderRadius:8,padding:"9px 12px",color:C.text,fontSize:13,outline:"none"}}>
                <option value="All">All Categories</option>
                {CATEGORIES.map(c=><option key={c} value={c}>{c}</option>)}
              </select>
              <select value={filterStatus} onChange={e=>setFilterStatus(e.target.value)}
                style={{background:C.card,border:"1px solid "+C.cardBorder,borderRadius:8,padding:"9px 12px",color:C.text,fontSize:13,outline:"none"}}>
                <option value="All">All Status</option>
                <option value="approved">Approved</option>
                <option value="pending">Pending Review</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>

            {/* Stats */}
            <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10,marginBottom:20}}>
              {[
                {label:"Approved",count:vendors.filter(v=>v.status==="approved").length,color:"#4CAF50"},
                {label:"Pending",count:pendingCount,color:C.gold},
                {label:"Total",count:vendors.length,color:C.text},
              ].map((s,i)=>(
                <div key={i} style={{background:C.card,border:"1px solid "+C.cardBorder,borderRadius:10,padding:"12px",textAlign:"center"}}>
                  <div style={{color:s.color,fontWeight:900,fontSize:20}}>{s.count}</div>
                  <div style={{color:C.muted,fontSize:11,marginTop:2}}>{s.label}</div>
                </div>
              ))}
            </div>

            {filtered.length===0&&<div style={{background:C.card,border:"1px solid "+C.cardBorder,borderRadius:12,padding:24,textAlign:"center",color:C.muted,fontSize:14}}>No vendors found.</div>}
            {filtered.map(vendor=>(
              <div key={vendor.id} onClick={()=>setActiveVendor(vendor)}
                style={{background:C.card,border:"1px solid "+(vendor.status==="approved"?"#4CAF5044":vendor.status==="pending"?C.gold+"44":C.cardBorder),borderRadius:12,padding:"16px 20px",marginBottom:10,cursor:"pointer"}}
                onMouseEnter={e=>e.currentTarget.style.borderColor=C.gold+"66"}
                onMouseLeave={e=>e.currentTarget.style.borderColor=vendor.status==="approved"?"#4CAF5044":vendor.status==="pending"?C.gold+"44":C.cardBorder}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:8}}>
                  <div>
                    <div style={{color:C.text,fontWeight:800,fontSize:15}}>{vendor.name}</div>
                    <div style={{color:C.muted,fontSize:12,marginTop:2}}>{vendor.category} · Suggested by {vendor.suggestedBy} on {vendor.suggestedOn}</div>
                    <div style={{color:C.muted,fontSize:12,marginTop:2}}>{vendor.description.slice(0,80)}{vendor.description.length>80?"...":""}</div>
                  </div>
                  <div style={{background:vendor.status==="approved"?"#4CAF5022":vendor.status==="pending"?C.gold+"22":C.error+"22",border:"1px solid "+(vendor.status==="approved"?"#4CAF5044":vendor.status==="pending"?C.gold+"44":C.error+"44"),borderRadius:20,padding:"3px 12px",color:vendor.status==="approved"?"#4CAF50":vendor.status==="pending"?C.gold:C.error,fontSize:11,fontWeight:700,flexShrink:0}}>
                    {vendor.status==="approved"?"✓ Approved":vendor.status==="pending"?"⚠ Pending Review":"✗ Not Approved"}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* VENDOR DETAIL */}
        {view==="list"&&activeVendor&&(()=>{
          const v = vendors.find(x=>x.id===activeVendor.id)||activeVendor;
          return(
            <div>
              <button onClick={()=>setActiveVendor(null)} style={{background:"transparent",border:"1px solid "+C.cardBorder,borderRadius:8,padding:"7px 14px",color:C.muted,fontSize:13,cursor:"pointer",marginBottom:16}}>← Vendor List</button>
              <div style={{background:C.card,border:"1px solid "+C.cardBorder,borderRadius:12,padding:"20px 24px",marginBottom:16}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:10,marginBottom:16}}>
                  <div>
                    <h2 style={{color:C.ivory,fontSize:20,fontWeight:900,margin:"0 0 4px"}}>{v.name}</h2>
                    <div style={{color:C.gold,fontSize:12}}>{v.category}</div>
                  </div>
                  <div style={{display:"flex",gap:8,alignItems:"center"}}>
                    <div style={{background:v.status==="approved"?"#4CAF5022":v.status==="pending"?C.gold+"22":C.error+"22",border:"1px solid "+(v.status==="approved"?"#4CAF5044":v.status==="pending"?C.gold+"44":C.error+"44"),borderRadius:20,padding:"3px 12px",color:v.status==="approved"?"#4CAF50":v.status==="pending"?C.gold:C.error,fontSize:11,fontWeight:700}}>
                      {v.status==="approved"?"✓ Approved":v.status==="pending"?"⚠ Pending":"✗ Not Approved"}
                    </div>
                    {isLeadership&&<button onClick={()=>deleteVendor(v.id)} style={{background:C.error+"22",border:"1px solid "+C.error+"44",borderRadius:8,padding:"5px 12px",color:C.error,fontSize:11,fontWeight:700,cursor:"pointer"}}>Remove</button>}
                  </div>
                </div>
                {[
                  ["Website",v.website],["Phone",v.phone],["Email",v.email],
                  ["Contact Name",v.contactName],["Address",v.address],
                  ["Price Range",v.priceRange],["Suggested By",v.suggestedBy],
                  ["Suggested On",v.suggestedOn],
                  v.approvedBy&&["Reviewed By",v.approvedBy+" on "+v.approvedOn],
                ].filter(Boolean).filter(([,val])=>val).map(([label,val],i)=>(
                  <div key={i} style={{display:"flex",gap:12,padding:"7px 0",borderBottom:"1px solid "+C.cardBorder}}>
                    <div style={{color:C.muted,fontSize:13,width:140,flexShrink:0}}>{label}</div>
                    <div style={{color:C.text,fontSize:13}}>{label==="Website"?<a href={val} target="_blank" rel="noreferrer" style={{color:C.gold}}>{val}</a>:val}</div>
                  </div>
                ))}
                <div style={{marginTop:12}}>
                  <div style={{color:C.gold,fontSize:11,fontWeight:800,letterSpacing:1,textTransform:"uppercase",marginBottom:6}}>What They Offer</div>
                  <div style={{color:C.text,fontSize:14,lineHeight:1.8}}>{v.description}</div>
                </div>
                {v.whyRecommend&&<div style={{marginTop:12}}>
                  <div style={{color:C.gold,fontSize:11,fontWeight:800,letterSpacing:1,textTransform:"uppercase",marginBottom:6}}>Why Recommended</div>
                  <div style={{color:C.text,fontSize:14,lineHeight:1.8}}>{v.whyRecommend}</div>
                </div>}
                {v.notes&&<div style={{marginTop:12}}>
                  <div style={{color:C.gold,fontSize:11,fontWeight:800,letterSpacing:1,textTransform:"uppercase",marginBottom:6}}>Notes</div>
                  <div style={{color:C.text,fontSize:14,lineHeight:1.8}}>{v.notes}</div>
                </div>}
              </div>

              {isLeadership&&v.status==="pending"&&(
                <div style={{display:"flex",gap:10}}>
                  <button onClick={()=>approveVendor(v.id)} style={{flex:1,background:"#4CAF5022",border:"1px solid #4CAF5044",borderRadius:10,padding:"12px",color:"#4CAF50",fontSize:13,fontWeight:800,cursor:"pointer"}}>✓ Approve Vendor</button>
                  <button onClick={()=>rejectVendor(v.id)} style={{flex:1,background:C.error+"22",border:"1px solid "+C.error+"44",borderRadius:10,padding:"12px",color:C.error,fontSize:13,fontWeight:800,cursor:"pointer"}}>✗ Do Not Approve</button>
                </div>
              )}
            </div>
          );
        })()}

        {/* SUGGEST VENDOR */}
        {view==="suggest"&&(
          <div>
            <div style={{color:C.gold,fontSize:11,fontWeight:800,letterSpacing:2,textTransform:"uppercase",marginBottom:14}}>Suggest a Vendor</div>
            <div style={{background:C.card,border:"1px solid "+C.cardBorder,borderRadius:12,padding:"20px 22px"}}>
              {[
                {label:"Vendor or company name",key:"name",ph:"Full name of the vendor or company"},
                {label:"Website",key:"website",ph:"e.g. https://vendor.com"},
                {label:"Phone number",key:"phone",ph:"Main phone number"},
                {label:"Email",key:"email",ph:"Contact email"},
                {label:"Contact person name",key:"contactName",ph:"Name of the person to contact"},
                {label:"Address",key:"address",ph:"Business address if applicable"},
                {label:"Price range",key:"priceRange",ph:"e.g. $, $$, $$$, or specific pricing"},
              ].map(f=>(
                <div key={f.key} style={{marginBottom:14}}>
                  <div style={{color:C.text,fontSize:13,fontWeight:600,marginBottom:6}}>{f.label}</div>
                  <input type="text" value={form[f.key]} onChange={e=>setForm(p=>({...p,[f.key]:e.target.value}))} placeholder={f.ph}
                    style={{width:"100%",background:C.dark,border:"1px solid "+C.cardBorder,borderRadius:8,padding:"10px 14px",color:C.text,fontSize:14,outline:"none",fontFamily:"inherit"}}/>
                </div>
              ))}
              <div style={{marginBottom:14}}>
                <div style={{color:C.text,fontSize:13,fontWeight:600,marginBottom:6}}>Category</div>
                <select value={form.category} onChange={e=>setForm(p=>({...p,category:e.target.value}))}
                  style={{width:"100%",background:C.dark,border:"1px solid "+C.cardBorder,borderRadius:8,padding:"10px 14px",color:form.category?C.text:C.muted,fontSize:14,outline:"none",fontFamily:"inherit"}}>
                  <option value="">Select a category...</option>
                  {CATEGORIES.map(c=><option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div style={{marginBottom:14}}>
                <div style={{color:C.text,fontSize:13,fontWeight:600,marginBottom:6}}>What does this vendor offer? <span style={{color:C.error}}>*</span></div>
                <textarea value={form.description} onChange={e=>setForm(p=>({...p,description:e.target.value}))} placeholder="Describe what products or services this vendor provides and how they could help Grace Trace Ministries" rows={4}
                  style={{width:"100%",background:C.dark,border:"1px solid "+C.cardBorder,borderRadius:8,padding:"10px 14px",color:C.text,fontSize:14,resize:"vertical",outline:"none",fontFamily:"inherit",lineHeight:1.6}}/>
              </div>
              <div style={{marginBottom:14}}>
                <div style={{color:C.text,fontSize:13,fontWeight:600,marginBottom:6}}>Why are you recommending this vendor?</div>
                <textarea value={form.whyRecommend} onChange={e=>setForm(p=>({...p,whyRecommend:e.target.value}))} placeholder="Have you used them before? Why would they be a good fit for Grace Trace Ministries?" rows={3}
                  style={{width:"100%",background:C.dark,border:"1px solid "+C.cardBorder,borderRadius:8,padding:"10px 14px",color:C.text,fontSize:14,resize:"vertical",outline:"none",fontFamily:"inherit",lineHeight:1.6}}/>
              </div>
              <div style={{marginBottom:20}}>
                <div style={{color:C.text,fontSize:13,fontWeight:600,marginBottom:6}}>Additional notes</div>
                <textarea value={form.notes} onChange={e=>setForm(p=>({...p,notes:e.target.value}))} placeholder="Any other information that would help Avy and Travis evaluate this vendor" rows={2}
                  style={{width:"100%",background:C.dark,border:"1px solid "+C.cardBorder,borderRadius:8,padding:"10px 14px",color:C.text,fontSize:14,resize:"vertical",outline:"none",fontFamily:"inherit",lineHeight:1.6}}/>
              </div>
              {formError&&<div style={{color:C.error,fontSize:13,marginBottom:12}}>{formError}</div>}
              {submitted&&<div style={{color:"#4CAF50",fontSize:13,fontWeight:700,marginBottom:12}}>✓ Vendor suggestion submitted for review</div>}
              <button onClick={submitVendor} style={{width:"100%",background:C.burgundy,border:"1px solid "+C.gold+"66",borderRadius:10,padding:"13px",color:C.ivory,fontSize:14,fontWeight:800,cursor:"pointer"}}>
                Submit Vendor Suggestion
              </button>
            </div>
          </div>
        )}

        <div style={{height:48}}/>
      </div>
    </div>
  );
}