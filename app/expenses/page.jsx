// @ts-nocheck
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

const CATEGORIES = [
  "Transportation","Office Supplies","Facility Supplies","Resident Services",
  "Food & Meals","Outreach Materials","Printing & Copies","Postage & Shipping",
  "Utilities","Repairs & Maintenance","Medical Supplies","Clothing & Uniforms",
  "Technology & Equipment","Training & Education","Other",
];

const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];

async function loadExpenses() {
  try { const r = await fetch("/api/expenses"); return await r.json(); } catch(e) { return []; }
}
async function saveExpenses(expenses) {
  try { await fetch("/api/expenses", { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify(expenses) }); } catch(e) {}
}

export default function ExpenseTracker() {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expenses, setExpenses] = useState([]);
  const [view, setView] = useState("my");
  const [activeExpense, setActiveExpense] = useState(null);

  // Form state
  const [form, setForm] = useState({
    description:"", amount:"", category:"", vendor:"",
    purchaseDate:"", dateReceived:"", confirmationNumber:"",
    notes:"", receiptFile:"", receiptFileName:"", receiptFileType:"",
    docFile:"", docFileName:"", docFileType:"",
  });
  const [formError, setFormError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  // Filter state
  const [filterMonth, setFilterMonth] = useState(new Date().getMonth());
  const [filterYear, setFilterYear] = useState(new Date().getFullYear());

  const isLeadership = currentUser && (currentUser.id === "avy" || currentUser.id === "travis");

  useEffect(() => {
    try {
      const uid = localStorage.getItem("gtm_current_user");
      if (uid) { const u = ALL_STAFF.find(s => s.id === uid); if (u) setCurrentUser(u); }
    } catch(e) {}
    loadExpenses().then(e => { setExpenses(e); setLoading(false); });
  }, []);

  function handleFileUpload(file, field) {
    if (!file) return;
    if (file.size > 10*1024*1024) { alert("File must be under 10MB."); return; }
    const reader = new FileReader();
    reader.onload = ev => {
      if (field === "receipt") {
        setForm(p => ({...p, receiptFile: ev.target.result, receiptFileName: file.name, receiptFileType: file.type}));
      } else {
        setForm(p => ({...p, docFile: ev.target.result, docFileName: file.name, docFileType: file.type}));
      }
    };
    reader.readAsDataURL(file);
  }

  function submitExpense() {
    if (!form.description.trim()) { setFormError("Please enter an expense description."); return; }
    if (!form.amount.trim() || isNaN(parseFloat(form.amount))) { setFormError("Please enter a valid amount."); return; }
    if (!form.category) { setFormError("Please select a category."); return; }
    if (!form.purchaseDate.trim()) { setFormError("Please enter the purchase date."); return; }
    if (!form.receiptFile && !form.confirmationNumber.trim()) { setFormError("Please upload a receipt or enter a confirmation number."); return; }

    const now = new Date();
    const expense = {
      id: Date.now().toString(),
      staffId: currentUser.id,
      staffName: currentUser.name,
      staffRole: currentUser.role,
      description: form.description,
      amount: parseFloat(form.amount),
      category: form.category,
      vendor: form.vendor,
      purchaseDate: form.purchaseDate,
      dateReceived: form.dateReceived,
      confirmationNumber: form.confirmationNumber,
      notes: form.notes,
      receiptFile: form.receiptFile,
      receiptFileName: form.receiptFileName,
      receiptFileType: form.receiptFileType,
      docFile: form.docFile,
      docFileName: form.docFileName,
      docFileType: form.docFileType,
      submittedOn: now.toLocaleDateString("en-US",{month:"long",day:"numeric",year:"numeric"}),
      month: now.getMonth(),
      year: now.getFullYear(),
      status: "pending",
      approvedBy: "",
      approvedOn: "",
      reimbursedOn: "",
    };

    const updated = [expense, ...expenses];
    setExpenses(updated);
    saveExpenses(updated);
    setForm({description:"",amount:"",category:"",vendor:"",purchaseDate:"",dateReceived:"",confirmationNumber:"",notes:"",receiptFile:"",receiptFileName:"",receiptFileType:"",docFile:"",docFileName:"",docFileType:""});
    setFormError("");
    setSubmitted(true);
    setTimeout(() => { setSubmitted(false); setView("my"); }, 2000);
  }

  function approveExpense(id) {
    const updated = expenses.map(e => e.id !== id ? e : {...e, status:"approved", approvedBy: currentUser.name, approvedOn: new Date().toLocaleDateString("en-US",{month:"long",day:"numeric",year:"numeric"})});
    setExpenses(updated); saveExpenses(updated);
    setActiveExpense(updated.find(e => e.id === id));
  }

  function rejectExpense(id) {
    const updated = expenses.map(e => e.id !== id ? e : {...e, status:"rejected", approvedBy: currentUser.name, approvedOn: new Date().toLocaleDateString("en-US",{month:"long",day:"numeric",year:"numeric"})});
    setExpenses(updated); saveExpenses(updated);
    setActiveExpense(updated.find(e => e.id === id));
  }

  function markReimbursed(id) {
    const updated = expenses.map(e => e.id !== id ? e : {...e, status:"reimbursed", reimbursedOn: new Date().toLocaleDateString("en-US",{month:"long",day:"numeric",year:"numeric"})});
    setExpenses(updated); saveExpenses(updated);
    setActiveExpense(updated.find(e => e.id === id));
  }

  function printMonthlyReport() {
    const filtered = expenses.filter(e => e.month === filterMonth && e.year === filterYear);
    const total = filtered.reduce((sum, e) => sum + e.amount, 0);
    const byPerson = {};
    filtered.forEach(e => { if (!byPerson[e.staffName]) byPerson[e.staffName] = []; byPerson[e.staffName].push(e); });
    const byCategory = {};
    filtered.forEach(e => { byCategory[e.category] = (byCategory[e.category]||0) + e.amount; });

    const win = window.open("","_blank");
    win.document.write(`
      <html><head><title>Expense Report — ${MONTHS[filterMonth]} ${filterYear}</title>
      <style>
        body{font-family:Arial,sans-serif;max-width:800px;margin:40px auto;color:#1A0F12;font-size:13px;line-height:1.7;}
        h1{font-size:20px;color:#6B1A2A;border-bottom:2px solid #C9A84C;padding-bottom:8px;}
        h2{font-size:14px;color:#6B1A2A;margin:20px 0 8px;text-transform:uppercase;letter-spacing:1px;}
        h3{font-size:13px;color:#1A3D2B;margin:14px 0 6px;}
        table{width:100%;border-collapse:collapse;font-size:12px;margin-bottom:16px;}
        th{background:#6B1A2A;color:#F5F0E8;padding:8px;text-align:left;}
        td{padding:7px 8px;border-bottom:1px solid #ddd;}
        tr:nth-child(even){background:#f9f9f9;}
        .total{font-weight:bold;color:#6B1A2A;font-size:14px;}
        .header{text-align:center;margin-bottom:24px;}
        .org{font-size:11px;color:#888;}
        .status-pending{color:#E67E22;font-weight:700;}
        .status-approved{color:#27AE60;font-weight:700;}
        .status-rejected{color:#E74C3C;font-weight:700;}
        .status-reimbursed{color:#2980B9;font-weight:700;}
        @media print{body{margin:20px;}}
      </style></head>
      <body>
        <div class="header">
          <div style="font-size:18px;font-weight:900;color:#6B1A2A;">GRACE TRACE MINISTRIES</div>
          <div class="org">Monthly Expense Report | EIN: 42-2972120 | Confidential</div>
          <h1>${MONTHS[filterMonth]} ${filterYear} — Expense Report</h1>
          <div>Generated: ${new Date().toLocaleDateString("en-US",{month:"long",day:"numeric",year:"numeric"})}</div>
        </div>

        <h2>Summary</h2>
        <table>
          <tr><th>Total Expenses</th><th>Total Amount</th><th>Pending</th><th>Approved</th><th>Reimbursed</th></tr>
          <tr>
            <td>${filtered.length}</td>
            <td class="total">$${total.toFixed(2)}</td>
            <td class="status-pending">${filtered.filter(e=>e.status==="pending").length}</td>
            <td class="status-approved">${filtered.filter(e=>e.status==="approved").length}</td>
            <td class="status-reimbursed">${filtered.filter(e=>e.status==="reimbursed").length}</td>
          </tr>
        </table>

        <h2>By Category</h2>
        <table>
          <tr><th>Category</th><th>Total</th></tr>
          ${Object.entries(byCategory).sort((a,b)=>b[1]-a[1]).map(([cat,amt])=>`<tr><td>${cat}</td><td>$${(amt).toFixed(2)}</td></tr>`).join("")}
        </table>

        <h2>By Staff Member</h2>
        ${Object.entries(byPerson).map(([name, exps])=>`
          <h3>${name} — Total: $${exps.reduce((s,e)=>s+e.amount,0).toFixed(2)}</h3>
          <table>
            <tr><th>Date</th><th>Description</th><th>Category</th><th>Vendor</th><th>Amount</th><th>Confirmation</th><th>Status</th></tr>
            ${exps.map(e=>`<tr>
              <td>${e.purchaseDate}</td>
              <td>${e.description}</td>
              <td>${e.category}</td>
              <td>${e.vendor||"—"}</td>
              <td>$${e.amount.toFixed(2)}</td>
              <td>${e.confirmationNumber||"—"}</td>
              <td class="status-${e.status}">${e.status.charAt(0).toUpperCase()+e.status.slice(1)}</td>
            </tr>`).join("")}
          </table>
        `).join("")}

        <h2>All Expenses — Detailed</h2>
        <table>
          <tr><th>Staff</th><th>Date</th><th>Description</th><th>Category</th><th>Amount</th><th>Status</th><th>Submitted</th></tr>
          ${filtered.map(e=>`<tr>
            <td>${e.staffName}</td>
            <td>${e.purchaseDate}</td>
            <td>${e.description}</td>
            <td>${e.category}</td>
            <td>$${e.amount.toFixed(2)}</td>
            <td class="status-${e.status}">${e.status.charAt(0).toUpperCase()+e.status.slice(1)}</td>
            <td>${e.submittedOn}</td>
          </tr>`).join("")}
          <tr style="background:#f0e8d8;">
            <td colspan="4"><strong>TOTAL</strong></td>
            <td><strong>$${total.toFixed(2)}</strong></td>
            <td colspan="2"></td>
          </tr>
        </table>

        <div style="text-align:center;margin-top:40px;font-size:10px;color:#888;border-top:1px solid #ccc;padding-top:16px;">
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

  const myExpenses = expenses.filter(e => e.staffId === currentUser.id);
  const myTotal = myExpenses.reduce((s,e) => s+e.amount, 0);
  const monthlyExpenses = expenses.filter(e => e.month === filterMonth && e.year === filterYear);
  const monthlyTotal = monthlyExpenses.reduce((s,e) => s+e.amount, 0);
  const pendingCount = expenses.filter(e => e.status === "pending").length;

  // Detail view
  if (activeExpense) {
    const e = expenses.find(x => x.id === activeExpense.id) || activeExpense;
    return (
      <div style={{minHeight:"100vh",background:C.dark,fontFamily:"'Inter','Segoe UI',sans-serif"}}>
        <div style={{background:"linear-gradient(135deg,"+C.burgundyDark+" 0%,"+C.dark+" 70%)",borderBottom:"2px solid "+C.gold,padding:"14px 20px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div>
            <div style={{color:C.gold,fontSize:10,fontWeight:800,letterSpacing:3,textTransform:"uppercase"}}>Expense Detail</div>
            <div style={{color:C.ivory,fontWeight:900,fontSize:16}}>Grace Trace Ministries</div>
          </div>
          <button onClick={()=>setActiveExpense(null)} style={{background:"transparent",border:"1px solid "+C.cardBorder,borderRadius:8,padding:"6px 12px",color:C.muted,fontSize:12,cursor:"pointer"}}>← Back</button>
        </div>
        <div style={{maxWidth:680,margin:"0 auto",padding:"24px 20px"}}>
          <div style={{background:C.card,border:"1px solid "+C.cardBorder,borderRadius:12,padding:"20px 24px",marginBottom:16}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:10,marginBottom:16}}>
              <div>
                <div style={{color:C.ivory,fontWeight:900,fontSize:18}}>{e.description}</div>
                <div style={{color:C.muted,fontSize:13,marginTop:3}}>Submitted by {e.staffName} on {e.submittedOn}</div>
              </div>
              <div style={{color:C.gold,fontWeight:900,fontSize:22}}>${e.amount.toFixed(2)}</div>
            </div>
            {[
              ["Category",e.category],
              ["Vendor",e.vendor||"—"],
              ["Purchase Date",e.purchaseDate],
              ["Date Received",e.dateReceived||"—"],
              ["Confirmation Number",e.confirmationNumber||"—"],
              ["Status",e.status.charAt(0).toUpperCase()+e.status.slice(1)],
              e.approvedBy&&["Reviewed By",e.approvedBy+" on "+e.approvedOn],
              e.reimbursedOn&&["Reimbursed On",e.reimbursedOn],
            ].filter(Boolean).map(([label,val],i)=>(
              <div key={i} style={{display:"flex",gap:12,padding:"7px 0",borderBottom:"1px solid "+C.cardBorder}}>
                <div style={{color:C.muted,fontSize:13,width:160,flexShrink:0}}>{label}</div>
                <div style={{color:label==="Status"?(e.status==="approved"||e.status==="reimbursed"?"#4CAF50":e.status==="rejected"?C.error:C.gold):C.text,fontSize:13,fontWeight:label==="Status"?700:400}}>{val}</div>
              </div>
            ))}
            {e.notes&&<div style={{marginTop:12}}><div style={{color:C.muted,fontSize:12,marginBottom:4}}>Notes</div><div style={{color:C.text,fontSize:14,lineHeight:1.7}}>{e.notes}</div></div>}
          </div>

          {/* Receipt */}
          {e.receiptFile&&(
            <div style={{background:C.card,border:"1px solid "+C.cardBorder,borderRadius:12,padding:"18px 20px",marginBottom:16}}>
              <div style={{color:C.gold,fontSize:11,fontWeight:800,letterSpacing:2,textTransform:"uppercase",marginBottom:12}}>Receipt</div>
              {e.receiptFileType?.includes("pdf")?(
                <div>
                  <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}>
                    <span style={{fontSize:24}}>📄</span>
                    <span style={{color:C.text,fontSize:13,fontWeight:600}}>{e.receiptFileName}</span>
                  </div>
                  <a href={e.receiptFile} download={e.receiptFileName} style={{display:"inline-block",background:C.burgundy,border:"1px solid "+C.gold+"66",borderRadius:8,padding:"8px 16px",color:C.ivory,fontSize:13,fontWeight:700,textDecoration:"none",marginRight:10}}>⬇ Download PDF</a>
                  <a href={e.receiptFile} target="_blank" rel="noreferrer" style={{display:"inline-block",background:C.dark,border:"1px solid "+C.cardBorder,borderRadius:8,padding:"8px 16px",color:C.muted,fontSize:13,textDecoration:"none"}}>Open in New Tab</a>
                </div>
              ):(
                <div>
                  <img src={e.receiptFile} alt="Receipt" style={{width:"100%",maxHeight:400,objectFit:"contain",borderRadius:8,border:"1px solid "+C.cardBorder,marginBottom:10}}/>
                  <a href={e.receiptFile} download={e.receiptFileName} style={{display:"inline-block",background:C.burgundy,border:"1px solid "+C.gold+"66",borderRadius:8,padding:"8px 16px",color:C.ivory,fontSize:13,fontWeight:700,textDecoration:"none"}}>⬇ Download Image</a>
                </div>
              )}
            </div>
          )}

          {/* Supporting Doc */}
          {e.docFile&&(
            <div style={{background:C.card,border:"1px solid "+C.cardBorder,borderRadius:12,padding:"18px 20px",marginBottom:16}}>
              <div style={{color:C.gold,fontSize:11,fontWeight:800,letterSpacing:2,textTransform:"uppercase",marginBottom:12}}>Supporting Document</div>
              <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}>
                <span style={{fontSize:24}}>{e.docFileType?.includes("pdf")?"📄":"🖼"}</span>
                <span style={{color:C.text,fontSize:13,fontWeight:600}}>{e.docFileName}</span>
              </div>
              <a href={e.docFile} download={e.docFileName} style={{display:"inline-block",background:C.burgundy,border:"1px solid "+C.gold+"66",borderRadius:8,padding:"8px 16px",color:C.ivory,fontSize:13,fontWeight:700,textDecoration:"none",marginRight:10}}>⬇ Download</a>
              <a href={e.docFile} target="_blank" rel="noreferrer" style={{display:"inline-block",background:C.dark,border:"1px solid "+C.cardBorder,borderRadius:8,padding:"8px 16px",color:C.muted,fontSize:13,textDecoration:"none"}}>Open in New Tab</a>
            </div>
          )}

          {/* Leadership actions */}
          {isLeadership&&e.status==="pending"&&(
            <div style={{display:"flex",gap:10}}>
              <button onClick={()=>approveExpense(e.id)} style={{flex:1,background:"#4CAF5022",border:"1px solid #4CAF5044",borderRadius:10,padding:"12px",color:"#4CAF50",fontSize:13,fontWeight:800,cursor:"pointer"}}>✓ Approve for Reimbursement</button>
              <button onClick={()=>rejectExpense(e.id)} style={{flex:1,background:C.error+"22",border:"1px solid "+C.error+"44",borderRadius:10,padding:"12px",color:C.error,fontSize:13,fontWeight:800,cursor:"pointer"}}>✗ Decline</button>
            </div>
          )}
          {isLeadership&&e.status==="approved"&&(
            <button onClick={()=>markReimbursed(e.id)} style={{width:"100%",background:C.green,border:"none",borderRadius:10,padding:"12px",color:C.ivory,fontSize:13,fontWeight:800,cursor:"pointer"}}>Mark as Reimbursed</button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div style={{minHeight:"100vh",background:C.dark,fontFamily:"'Inter','Segoe UI',sans-serif"}}>
      <div style={{background:"linear-gradient(135deg,"+C.burgundyDark+" 0%,"+C.dark+" 70%)",borderBottom:"2px solid "+C.gold,padding:"14px 24px",display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:10}}>
        <div>
          <div style={{color:C.gold,fontSize:10,fontWeight:800,letterSpacing:3,textTransform:"uppercase"}}>Grace Trace Ministries</div>
          <h1 style={{color:C.ivory,fontSize:17,fontWeight:900,margin:"2px 0"}}>Expense Tracker 💰</h1>
          <div style={{color:C.muted,fontSize:12}}>{currentUser.name}</div>
        </div>
        <button onClick={()=>window.history.back()} style={{background:"transparent",border:"1px solid "+C.cardBorder,borderRadius:8,padding:"6px 12px",color:C.muted,fontSize:12,cursor:"pointer"}}>← Back</button>
      </div>

      {/* Tabs */}
      <div style={{background:C.dark,borderBottom:"1px solid "+C.cardBorder,display:"flex",gap:2,padding:"0 24px",overflowX:"auto"}}>
        {["my","submit",isLeadership&&"all",isLeadership&&"report"].filter(Boolean).map(tab=>(
          <button key={tab} onClick={()=>setView(tab)}
            style={{background:"transparent",border:"none",borderBottom:view===tab?"2px solid "+C.gold:"2px solid transparent",color:view===tab?C.gold:C.muted,fontSize:13,fontWeight:view===tab?800:500,padding:"11px 16px",cursor:"pointer",whiteSpace:"nowrap"}}>
            {tab==="my"?"My Expenses":tab==="submit"?"Submit Expense":tab==="all"?"All Expenses":"Monthly Report"}
            {tab==="all"&&pendingCount>0&&<span style={{background:C.error,color:C.ivory,borderRadius:20,padding:"1px 7px",fontSize:10,fontWeight:800,marginLeft:6}}>{pendingCount}</span>}
          </button>
        ))}
      </div>

      <div style={{maxWidth:760,margin:"0 auto",padding:"24px 20px"}}>

        {/* MY EXPENSES */}
        {view==="my"&&(
          <div>
            <div style={{background:C.card,border:"1px solid "+C.cardBorder,borderRadius:12,padding:"16px 20px",marginBottom:20,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div>
                <div style={{color:C.muted,fontSize:12}}>Your total submitted expenses</div>
                <div style={{color:C.gold,fontWeight:900,fontSize:24,marginTop:2}}>${myTotal.toFixed(2)}</div>
              </div>
              <div style={{textAlign:"right"}}>
                <div style={{color:C.muted,fontSize:12}}>{myExpenses.length} expense{myExpenses.length!==1?"s":""} submitted</div>
                <div style={{color:"#4CAF50",fontSize:12,marginTop:2}}>{myExpenses.filter(e=>e.status==="reimbursed").length} reimbursed</div>
              </div>
            </div>
            {myExpenses.length===0&&<div style={{background:C.card,border:"1px solid "+C.cardBorder,borderRadius:12,padding:24,textAlign:"center",color:C.muted,fontSize:14}}>No expenses submitted yet.</div>}
            {myExpenses.map(e=>(
              <div key={e.id} onClick={()=>setActiveExpense(e)} style={{background:C.card,border:"1px solid "+C.cardBorder,borderRadius:12,padding:"16px 20px",marginBottom:10,cursor:"pointer"}}
                onMouseEnter={ev=>ev.currentTarget.style.borderColor=C.gold+"66"}
                onMouseLeave={ev=>ev.currentTarget.style.borderColor=C.cardBorder}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:8}}>
                  <div>
                    <div style={{color:C.text,fontWeight:700,fontSize:14}}>{e.description}</div>
                    <div style={{color:C.muted,fontSize:12,marginTop:3}}>{e.category} · {e.purchaseDate}</div>
                    {e.vendor&&<div style={{color:C.muted,fontSize:12}}>{e.vendor}</div>}
                  </div>
                  <div style={{textAlign:"right"}}>
                    <div style={{color:C.gold,fontWeight:800,fontSize:16}}>${e.amount.toFixed(2)}</div>
                    <div style={{background:e.status==="reimbursed"?"#2196F322":e.status==="approved"?"#4CAF5022":e.status==="rejected"?C.error+"22":C.gold+"22",border:"1px solid "+(e.status==="reimbursed"?"#2196F344":e.status==="approved"?"#4CAF5044":e.status==="rejected"?C.error+"44":C.gold+"44"),borderRadius:20,padding:"2px 10px",color:e.status==="reimbursed"?"#2196F3":e.status==="approved"?"#4CAF50":e.status==="rejected"?C.error:C.gold,fontSize:11,fontWeight:700,marginTop:4}}>
                      {e.status.charAt(0).toUpperCase()+e.status.slice(1)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* SUBMIT EXPENSE */}
        {view==="submit"&&(
          <div>
            <div style={{color:C.gold,fontSize:11,fontWeight:800,letterSpacing:2,textTransform:"uppercase",marginBottom:14}}>Submit an Expense for Reimbursement</div>
            <div style={{background:C.card,border:"1px solid "+C.cardBorder,borderRadius:12,padding:"20px 22px"}}>
              {[
                {label:"Expense description",key:"description",ph:"What was purchased and why",type:"text"},
                {label:"Amount spent ($)",key:"amount",ph:"e.g. 45.00",type:"text"},
                {label:"Vendor or store name",key:"vendor",ph:"e.g. Walmart, Home Depot, Amazon",type:"text"},
                {label:"Purchase date",key:"purchaseDate",ph:"e.g. July 10, 2026",type:"text"},
                {label:"Date received",key:"dateReceived",ph:"e.g. July 12, 2026",type:"text"},
                {label:"Order or confirmation number",key:"confirmationNumber",ph:"Order number, receipt number, or transaction ID",type:"text"},
              ].map(f=>(
                <div key={f.key} style={{marginBottom:14}}>
                  <div style={{color:C.text,fontSize:13,fontWeight:600,marginBottom:6}}>{f.label}</div>
                  <input type={f.type} value={form[f.key]} onChange={e=>setForm(p=>({...p,[f.key]:e.target.value}))}
                    placeholder={f.ph} style={{width:"100%",background:C.dark,border:"1px solid "+C.cardBorder,borderRadius:8,padding:"10px 14px",color:C.text,fontSize:14,outline:"none",fontFamily:"inherit"}}/>
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
                <div style={{color:C.text,fontSize:13,fontWeight:600,marginBottom:6}}>Notes (optional)</div>
                <textarea value={form.notes} onChange={e=>setForm(p=>({...p,notes:e.target.value}))} placeholder="Any additional details about this expense" rows={3}
                  style={{width:"100%",background:C.dark,border:"1px solid "+C.cardBorder,borderRadius:8,padding:"10px 14px",color:C.text,fontSize:14,resize:"vertical",outline:"none",fontFamily:"inherit",lineHeight:1.6}}/>
              </div>

              {/* Receipt upload */}
              <div style={{marginBottom:14}}>
                <div style={{color:C.text,fontSize:13,fontWeight:600,marginBottom:6}}>📸 Upload receipt <span style={{color:C.muted,fontWeight:400}}>(photo or PDF — required if no confirmation number)</span></div>
                <input type="file" accept="image/*,.pdf" onChange={e=>handleFileUpload(e.target.files[0],"receipt")}
                  style={{width:"100%",background:C.dark,border:"1px solid "+C.cardBorder,borderRadius:8,padding:"10px 14px",color:C.text,fontSize:13,cursor:"pointer"}}/>
                {form.receiptFileName&&(
                  <div style={{marginTop:8,display:"flex",alignItems:"center",gap:10,background:C.dark,border:"1px solid #4CAF50",borderRadius:8,padding:"8px 14px"}}>
                    <span>{form.receiptFileType?.includes("pdf")?"📄":"🖼"}</span>
                    <span style={{color:"#4CAF50",fontSize:13,fontWeight:600,flex:1}}>{form.receiptFileName}</span>
                    <button onClick={()=>setForm(p=>({...p,receiptFile:"",receiptFileName:"",receiptFileType:""}))} style={{background:"transparent",border:"none",color:C.error,cursor:"pointer",fontSize:16}}>✕</button>
                  </div>
                )}
              </div>

              {/* Supporting doc upload */}
              <div style={{marginBottom:20}}>
                <div style={{color:C.text,fontSize:13,fontWeight:600,marginBottom:6}}>📎 Upload supporting document <span style={{color:C.muted,fontWeight:400}}>(optional — invoice, quote, or approval)</span></div>
                <input type="file" accept="image/*,.pdf,.doc,.docx" onChange={e=>handleFileUpload(e.target.files[0],"doc")}
                  style={{width:"100%",background:C.dark,border:"1px solid "+C.cardBorder,borderRadius:8,padding:"10px 14px",color:C.text,fontSize:13,cursor:"pointer"}}/>
                {form.docFileName&&(
                  <div style={{marginTop:8,display:"flex",alignItems:"center",gap:10,background:C.dark,border:"1px solid #4CAF50",borderRadius:8,padding:"8px 14px"}}>
                    <span>{form.docFileType?.includes("pdf")?"📄":"🖼"}</span>
                    <span style={{color:"#4CAF50",fontSize:13,fontWeight:600,flex:1}}>{form.docFileName}</span>
                    <button onClick={()=>setForm(p=>({...p,docFile:"",docFileName:"",docFileType:""}))} style={{background:"transparent",border:"none",color:C.error,cursor:"pointer",fontSize:16}}>✕</button>
                  </div>
                )}
              </div>

              {formError&&<div style={{color:C.error,fontSize:13,marginBottom:12}}>{formError}</div>}
              {submitted&&<div style={{color:"#4CAF50",fontSize:13,fontWeight:700,marginBottom:12}}>✓ Expense submitted for review</div>}
              <button onClick={submitExpense} style={{width:"100%",background:C.burgundy,border:"1px solid "+C.gold+"66",borderRadius:10,padding:"13px",color:C.ivory,fontSize:14,fontWeight:800,cursor:"pointer"}}>
                Submit Expense
              </button>
            </div>
          </div>
        )}

        {/* ALL EXPENSES — Leadership */}
        {view==="all"&&isLeadership&&(
          <div>
            <div style={{background:C.card,border:"1px solid "+C.cardBorder,borderRadius:12,padding:"16px 20px",marginBottom:20,display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:10}}>
              <div>
                <div style={{color:C.muted,fontSize:12}}>Total all expenses</div>
                <div style={{color:C.gold,fontWeight:900,fontSize:22,marginTop:2}}>${expenses.reduce((s,e)=>s+e.amount,0).toFixed(2)}</div>
              </div>
              <div style={{display:"flex",gap:16}}>
                <div style={{textAlign:"center"}}><div style={{color:C.gold,fontWeight:800,fontSize:16}}>{expenses.filter(e=>e.status==="pending").length}</div><div style={{color:C.muted,fontSize:11}}>Pending</div></div>
                <div style={{textAlign:"center"}}><div style={{color:"#4CAF50",fontWeight:800,fontSize:16}}>{expenses.filter(e=>e.status==="approved").length}</div><div style={{color:C.muted,fontSize:11}}>Approved</div></div>
                <div style={{textAlign:"center"}}><div style={{color:"#2196F3",fontWeight:800,fontSize:16}}>{expenses.filter(e=>e.status==="reimbursed").length}</div><div style={{color:C.muted,fontSize:11}}>Reimbursed</div></div>
              </div>
            </div>
            {expenses.length===0&&<div style={{background:C.card,border:"1px solid "+C.cardBorder,borderRadius:12,padding:24,textAlign:"center",color:C.muted,fontSize:14}}>No expenses submitted yet.</div>}
            {expenses.map(e=>{
              const staff = ALL_STAFF.find(s=>s.id===e.staffId);
              return(
                <div key={e.id} onClick={()=>setActiveExpense(e)} style={{background:C.card,border:"1px solid "+(e.status==="pending"?C.gold+"44":C.cardBorder),borderRadius:12,padding:"16px 20px",marginBottom:10,cursor:"pointer"}}
                  onMouseEnter={ev=>ev.currentTarget.style.borderColor=C.gold+"66"}
                  onMouseLeave={ev=>ev.currentTarget.style.borderColor=e.status==="pending"?C.gold+"44":C.cardBorder}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:8}}>
                    <div style={{display:"flex",gap:12,alignItems:"center"}}>
                      <div style={{width:32,height:32,borderRadius:"50%",background:staff?.color||C.burgundy,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:800,color:C.ivory,flexShrink:0}}>{staff?.initials||"?"}</div>
                      <div>
                        <div style={{color:C.text,fontWeight:700,fontSize:14}}>{e.description}</div>
                        <div style={{color:C.muted,fontSize:12,marginTop:2}}>{e.staffName} · {e.category} · {e.purchaseDate}</div>
                      </div>
                    </div>
                    <div style={{textAlign:"right"}}>
                      <div style={{color:C.gold,fontWeight:800,fontSize:16}}>${e.amount.toFixed(2)}</div>
                      <div style={{background:e.status==="reimbursed"?"#2196F322":e.status==="approved"?"#4CAF5022":e.status==="rejected"?C.error+"22":C.gold+"22",border:"1px solid "+(e.status==="reimbursed"?"#2196F344":e.status==="approved"?"#4CAF5044":e.status==="rejected"?C.error+"44":C.gold+"44"),borderRadius:20,padding:"2px 10px",color:e.status==="reimbursed"?"#2196F3":e.status==="approved"?"#4CAF50":e.status==="rejected"?C.error:C.gold,fontSize:11,fontWeight:700,marginTop:4}}>
                        {e.status==="pending"?"⚠ Pending Review":e.status.charAt(0).toUpperCase()+e.status.slice(1)}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* MONTHLY REPORT — Leadership */}
        {view==="report"&&isLeadership&&(
          <div>
            <div style={{color:C.gold,fontSize:11,fontWeight:800,letterSpacing:2,textTransform:"uppercase",marginBottom:14}}>Monthly Expense Report</div>
            <div style={{display:"flex",gap:10,marginBottom:20,flexWrap:"wrap"}}>
              <select value={filterMonth} onChange={e=>setFilterMonth(parseInt(e.target.value))}
                style={{background:C.card,border:"1px solid "+C.cardBorder,borderRadius:8,padding:"10px 14px",color:C.text,fontSize:14,outline:"none",flex:1}}>
                {MONTHS.map((m,i)=><option key={i} value={i}>{m}</option>)}
              </select>
              <select value={filterYear} onChange={e=>setFilterYear(parseInt(e.target.value))}
                style={{background:C.card,border:"1px solid "+C.cardBorder,borderRadius:8,padding:"10px 14px",color:C.text,fontSize:14,outline:"none",width:120}}>
                {[2025,2026,2027].map(y=><option key={y} value={y}>{y}</option>)}
              </select>
              <button onClick={printMonthlyReport} style={{background:C.burgundy,border:"1px solid "+C.gold+"66",borderRadius:8,padding:"10px 18px",color:C.ivory,fontSize:13,fontWeight:800,cursor:"pointer"}}>🖨 Print / Send Report</button>
            </div>

            {/* Summary cards */}
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(140px,1fr))",gap:10,marginBottom:20}}>
              {[
                {label:"Total Spent",value:"$"+monthlyTotal.toFixed(2),color:C.gold},
                {label:"Expenses",value:monthlyExpenses.length,color:C.text},
                {label:"Pending",value:monthlyExpenses.filter(e=>e.status==="pending").length,color:C.gold},
                {label:"Approved",value:monthlyExpenses.filter(e=>e.status==="approved").length,color:"#4CAF50"},
                {label:"Reimbursed",value:monthlyExpenses.filter(e=>e.status==="reimbursed").length,color:"#2196F3"},
              ].map((s,i)=>(
                <div key={i} style={{background:C.card,border:"1px solid "+C.cardBorder,borderRadius:10,padding:"14px 16px",textAlign:"center"}}>
                  <div style={{color:s.color,fontWeight:900,fontSize:20}}>{s.value}</div>
                  <div style={{color:C.muted,fontSize:11,marginTop:3}}>{s.label}</div>
                </div>
              ))}
            </div>

            {/* Per staff breakdown */}
            <div style={{color:C.gold,fontSize:11,fontWeight:800,letterSpacing:2,textTransform:"uppercase",marginBottom:12}}>By Staff Member</div>
            {ALL_STAFF.map(staff=>{
              const staffExp = monthlyExpenses.filter(e=>e.staffId===staff.id);
              if (staffExp.length===0) return null;
              const total = staffExp.reduce((s,e)=>s+e.amount,0);
              return(
                <div key={staff.id} style={{background:C.card,border:"1px solid "+C.cardBorder,borderRadius:12,padding:"14px 18px",marginBottom:10}}>
                  <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:10}}>
                    <div style={{width:34,height:34,borderRadius:"50%",background:staff.color,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:800,color:C.ivory}}>{staff.initials}</div>
                    <div style={{flex:1}}>
                      <div style={{color:C.text,fontWeight:700,fontSize:14}}>{staff.name}</div>
                      <div style={{color:C.muted,fontSize:11}}>{staffExp.length} expense{staffExp.length!==1?"s":""}</div>
                    </div>
                    <div style={{color:C.gold,fontWeight:900,fontSize:16}}>${total.toFixed(2)}</div>
                  </div>
                  {staffExp.map(e=>(
                    <div key={e.id} onClick={()=>setActiveExpense(e)} style={{display:"flex",justifyContent:"space-between",padding:"6px 0",borderBottom:"1px solid "+C.cardBorder,cursor:"pointer"}}>
                      <div>
                        <span style={{color:C.text,fontSize:13}}>{e.description}</span>
                        <span style={{color:C.muted,fontSize:11,marginLeft:8}}>{e.category}</span>
                      </div>
                      <div style={{display:"flex",gap:10,alignItems:"center"}}>
                        <span style={{color:C.gold,fontSize:13,fontWeight:700}}>${e.amount.toFixed(2)}</span>
                        <span style={{color:e.status==="reimbursed"?"#2196F3":e.status==="approved"?"#4CAF50":e.status==="rejected"?C.error:C.gold,fontSize:11,fontWeight:700}}>{e.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              );
            })}
            {monthlyExpenses.length===0&&<div style={{background:C.card,border:"1px solid "+C.cardBorder,borderRadius:12,padding:24,textAlign:"center",color:C.muted,fontSize:14}}>No expenses for {MONTHS[filterMonth]} {filterYear}.</div>}
          </div>
        )}

        <div style={{height:48}}/>
      </div>
    </div>
  );
}


