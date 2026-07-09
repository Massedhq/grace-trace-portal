"use client";
import { useEffect, useState } from "react";

const C = {
  burgundy:"#6B1A2A",burgundyDark:"#4A0E1A",green:"#1E4D2B",gold:"#C9A84C",
  ivory:"#F5F0E8",dark:"#1A0F12",card:"#2A1A1E",cardBorder:"#3D2028",
  text:"#F0EAE2",muted:"#A08878",
};

const PAGES = [
  {
    icon:"📋",title:"Staff Workday Portal",url:"/",who:"All Staff",
    description:"Your main login page. Select your name, enter your password, and access your personal dashboard. Complete your daily task workbooks, track your progress, and generate your end-of-day report.",
    steps:[
      "Go to the main portal URL",
      "Click your name from the staff list",
      "Enter your password",
      "Your dashboard loads — click any task to open the workbook",
      "Fill in all fields — they turn green as you complete them",
      "Click Submit when all fields are complete",
      "When all tasks are done — click Generate Workday Report",
      "Click Send to submit your report to leadership",
      "Use the ☰ hamburger menu in the top right to navigate to other pages",
    ],
    tips:["Your session stays active — you will not be logged out when navigating to other pages","The hamburger menu only shows pages you have access to","Completed tasks show a green checkmark and cannot be reopened"],
  },
  {
    icon:"👥",title:"Staff Reports",url:"/staff-reports",who:"Avy and Travis only",
    description:"Leadership dashboard showing the real-time workday status of every staff member. See who has completed their tasks, read their submitted field entries, and check orientation and binder signature status.",
    steps:[
      "Log in to the Staff Workday Portal first",
      "Click the ☰ hamburger menu in the top right",
      "Click Staff Reports",
      "The page loads automatically — no second login needed",
      "View the Orientation Package Status section at the top",
      "Scroll down to see individual staff cards",
      "Click any staff card to expand and see their task details",
      "Click Refresh to pull the latest data",
    ],
    tips:["Green checkmarks mean the task is complete and submitted","Red 'Not signed' means that staff member has not completed their orientation","Click the + on any staff card to expand their full task list"],
  },
  {
    icon:"📄",title:"Orientation Package",url:"/orientation",who:"All Staff",
    description:"Your personal orientation document. Read your job title, critical role, expectations, and all daily tasks. Sign digitally at the bottom to confirm you have read and understood everything.",
    steps:[
      "Log in to the Staff Workday Portal first",
      "Click the ☰ hamburger menu",
      "Click Orientation Package",
      "Read every section carefully",
      "Scroll to the bottom — type your full legal name and today's date",
      "Click Sign and Submit",
      "Your signature is recorded and visible to Avy and Travis in Staff Reports",
    ],
    tips:["You only need to sign once — your signature is saved","Your name must be typed exactly as it appears on your account","Avy and Travis can see who has and has not signed from the Staff Reports page"],
  },
  {
    icon:"💡",title:"Creative Tab",url:"/creative",who:"All Staff",
    description:"Submit ideas, suggestions, and improvements for Grace Trace Ministries. Approved ideas go to a team vote. Everyone votes thumbs up, thumbs down, or question mark and can leave a comment.",
    steps:[
      "Log in to the Staff Workday Portal first",
      "Click the ☰ hamburger menu",
      "Click Creative Tab",
      "Click Submit Idea to share a new idea",
      "Enter a title, describe your idea, and add an optional link",
      "Click Submit — your idea goes to Avy and Travis for review",
      "Once approved it appears on the Idea Board",
      "Click any approved idea to cast your vote and leave a comment",
    ],
    tips:["Avy and Travis see a badge count showing how many ideas are pending review","You can only vote once per idea","Question mark vote means you need more information before deciding"],
  },
  {
    icon:"📅",title:"Meeting Board",url:"/meetings",who:"All Staff",
    description:"Leadership schedules meetings here. You will see all meetings scheduled for you, confirm how you will attend, and acknowledge the date and time. If you cannot attend you must set a follow-up date.",
    steps:[
      "Log in to the Staff Workday Portal first",
      "Click the ☰ hamburger menu",
      "Click Meeting Board",
      "Review all meetings listed for you",
      "Click on a meeting to open it",
      "Select how you will attend — In Person, Virtual, Video, or Phone Conference",
      "Acknowledge the date and time",
      "If you cannot attend — select Cannot Attend and set a follow-up date",
      "Submit your response",
    ],
    tips:["You must respond to every meeting — no response is not acceptable","Avy and Travis can see everyone's attendance responses","Meetings can be printed from the meeting detail page for organizational records"],
  },
  {
    icon:"📘",title:"Department Binders",url:"(see hamburger menu)",who:"Each staff member sees their own binder — Avy and Travis see all",
    description:"Your complete department operations binder. Read your full job description, duties, schedules, logs, standards, and performance metrics. Sign on the final section to acknowledge receipt.",
    steps:[
      "Log in to the Staff Workday Portal first",
      "Click the ☰ hamburger menu",
      "Click your binder — it will show your name",
      "Use the sidebar to navigate between sections",
      "Click Next or Previous to move through sections",
      "Read every section thoroughly",
      "On the final section — type your full name and date to sign",
      "Click Sign and Submit",
    ],
    tips:["Avy and Travis can access all staff binders from their hamburger menu","Your signature on the binder is separate from your orientation signature","The sidebar shows all sections — click any section to jump directly to it"],
  },
];

const PASSWORDS = {
  avy:"GTM@Avy2026",travis:"GTM@Travis2026",deann:"GTM@Deann2026",
  erica:"GTM@Erica2026",ialana:"GTM@Ialana2026",aubreyon:"GTM@Kisses2026",dennis:"GTM@Dennis2026",
};

export default function NavigationGuide() {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activePage, setActivePage] = useState(null);

  useEffect(() => {
    try {
      const uid = localStorage.getItem("gtm_current_user");
      if (uid) setCurrentUser(uid);
    } catch(e) {}
    setLoading(false);
  }, []);

  if (loading) return <div style={{minHeight:"100vh",background:C.dark,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Inter','Segoe UI',sans-serif"}}><div style={{color:C.muted}}>Loading...</div></div>;

  return (
    <div style={{minHeight:"100vh",background:C.dark,fontFamily:"'Inter','Segoe UI',sans-serif"}}>
      <div style={{background:"linear-gradient(135deg,"+C.burgundyDark+" 0%,"+C.dark+" 70%)",borderBottom:"2px solid "+C.gold,padding:"16px 24px",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:10}}>
        <div>
          <div style={{color:C.gold,fontSize:10,fontWeight:800,letterSpacing:3,textTransform:"uppercase"}}>Grace Trace Ministries</div>
          <h1 style={{color:C.ivory,fontSize:18,fontWeight:900,margin:"4px 0 2px"}}>Portal Navigation Guide</h1>
          <div style={{color:C.muted,fontSize:12}}>How to use every page in the staff portal</div>
        </div>
        <button onClick={()=>window.history.back()} style={{background:"transparent",border:"1px solid "+C.cardBorder,borderRadius:8,padding:"7px 14px",color:C.muted,fontSize:12,cursor:"pointer"}}>← Back</button>
      </div>

      <div style={{maxWidth:760,margin:"0 auto",padding:"24px 20px"}}>

        {/* Quick reference */}
        <div style={{background:C.card,border:"1px solid "+C.cardBorder,borderRadius:12,padding:"16px 20px",marginBottom:24}}>
          <div style={{color:C.gold,fontSize:11,fontWeight:800,letterSpacing:2,textTransform:"uppercase",marginBottom:14}}>Quick Reference — All Portal Pages</div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))",gap:10}}>
            {PAGES.map((p,i)=>(
              <button key={i} onClick={()=>setActivePage(activePage===i?null:i)}
                style={{background:activePage===i?C.burgundy:C.dark,border:"1px solid "+(activePage===i?C.gold+"66":C.cardBorder),borderRadius:10,padding:"12px 14px",textAlign:"left",cursor:"pointer"}}>
                <div style={{fontSize:20,marginBottom:4}}>{p.icon}</div>
                <div style={{color:activePage===i?C.ivory:C.text,fontWeight:700,fontSize:13}}>{p.title}</div>
                <div style={{color:activePage===i?C.gold:C.muted,fontSize:11,marginTop:2}}>{p.url}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Page detail */}
        {activePage !== null && (
          <div style={{background:C.card,border:"1px solid "+C.gold+"44",borderRadius:12,padding:"20px 24px",marginBottom:24}}>
            <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:16}}>
              <span style={{fontSize:28}}>{PAGES[activePage].icon}</span>
              <div>
                <div style={{color:C.ivory,fontWeight:900,fontSize:17}}>{PAGES[activePage].title}</div>
                <div style={{color:C.gold,fontSize:12,marginTop:2}}>{PAGES[activePage].url}</div>
                <div style={{background:C.burgundy+"44",border:"1px solid "+C.burgundy,borderRadius:20,padding:"2px 10px",color:C.ivory,fontSize:11,fontWeight:700,display:"inline-block",marginTop:4}}>{PAGES[activePage].who}</div>
              </div>
            </div>
            <p style={{color:C.text,fontSize:14,lineHeight:1.8,marginBottom:16}}>{PAGES[activePage].description}</p>
            <div style={{color:C.gold,fontSize:11,fontWeight:800,letterSpacing:2,textTransform:"uppercase",marginBottom:10}}>Step by Step</div>
            {PAGES[activePage].steps.map((step,i)=>(
              <div key={i} style={{display:"flex",gap:12,padding:"7px 0",borderBottom:"1px solid "+C.cardBorder,alignItems:"flex-start"}}>
                <div style={{width:22,height:22,borderRadius:"50%",background:C.burgundy,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:800,color:C.gold,flexShrink:0,marginTop:1}}>{i+1}</div>
                <div style={{color:C.text,fontSize:14,lineHeight:1.6}}>{step}</div>
              </div>
            ))}
            <div style={{color:C.gold,fontSize:11,fontWeight:800,letterSpacing:2,textTransform:"uppercase",margin:"16px 0 10px"}}>Tips</div>
            {PAGES[activePage].tips.map((tip,i)=>(
              <div key={i} style={{display:"flex",gap:10,marginBottom:8,alignItems:"flex-start"}}>
                <span style={{color:C.gold,fontSize:14,flexShrink:0}}>✦</span>
                <div style={{color:C.muted,fontSize:13,lineHeight:1.6}}>{tip}</div>
              </div>
            ))}
          </div>
        )}

        {/* Passwords — leadership only */}
        {(currentUser === "avy" || currentUser === "travis") && (
        <div style={{background:C.card,border:"1px solid "+C.cardBorder,borderRadius:12,padding:"16px 20px",marginBottom:24}}>
          <div style={{color:C.gold,fontSize:11,fontWeight:800,letterSpacing:2,textTransform:"uppercase",marginBottom:14}}>Staff Login Passwords</div>
          {[
            {name:"Avrial Evans (Avy)",pw:"GTM@Avy2026",role:"President / Executive Director"},
            {name:"Travis Ramar",pw:"GTM@Travis2026",role:"VP / COO"},
            {name:"Deann Evans",pw:"GTM@Deann2026",role:"Director of Outreach"},
            {name:"Erica Evans",pw:"GTM@Erica2026",role:"Director of Residential Services"},
            {name:"Ialana Tippins",pw:"GTM@Ialana2026",role:"Director of Intake"},
            {name:"AuBreyon (Kisses) Woodley",pw:"GTM@Kisses2026",role:"Director of Communication"},
            {name:"Dennis Pride",pw:"GTM@Dennis2026",role:"Director of Operations"},
          ].map((u,i)=>(
            <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"9px 0",borderBottom:"1px solid "+C.cardBorder,flexWrap:"wrap",gap:8}}>
              <div>
                <div style={{color:C.text,fontWeight:700,fontSize:13}}>{u.name}</div>
                <div style={{color:C.muted,fontSize:11}}>{u.role}</div>
              </div>
              <div style={{background:C.dark,border:"1px solid "+C.cardBorder,borderRadius:8,padding:"5px 12px",color:C.gold,fontSize:13,fontWeight:700,fontFamily:"monospace"}}>{u.pw}</div>
            </div>
          ))}
        </div>
        )}

        {/* Hamburger menu guide */}
        <div style={{background:C.card,border:"1px solid "+C.cardBorder,borderRadius:12,padding:"16px 20px",marginBottom:24}}>
          <div style={{color:C.gold,fontSize:11,fontWeight:800,letterSpacing:2,textTransform:"uppercase",marginBottom:14}}>How to Use the ☰ Hamburger Menu</div>
          <p style={{color:C.text,fontSize:14,lineHeight:1.8,marginBottom:12}}>The hamburger menu (☰) is located in the top right corner of your dashboard after you log in. It is the main way to navigate between all portal pages without logging out.</p>
          {[
            "Click ☰ in the top right of your dashboard",
            "A slide-out panel opens from the right side of the screen",
            "Click any page link to navigate — your session carries with you",
            "Click anywhere outside the menu or press ✕ to close it",
            "The Log Out button is at the bottom of the menu",
            "Pages you do not have access to will not appear in your menu",
          ].map((step,i)=>(
            <div key={i} style={{display:"flex",gap:12,padding:"7px 0",borderBottom:"1px solid "+C.cardBorder,alignItems:"flex-start"}}>
              <div style={{width:22,height:22,borderRadius:"50%",background:C.burgundy,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:800,color:C.gold,flexShrink:0,marginTop:1}}>{i+1}</div>
              <div style={{color:C.text,fontSize:14}}>{step}</div>
            </div>
          ))}
        </div>

        {/* Troubleshooting */}
        <div style={{background:C.card,border:"1px solid "+C.cardBorder,borderRadius:12,padding:"16px 20px",marginBottom:32}}>
          <div style={{color:C.gold,fontSize:11,fontWeight:800,letterSpacing:2,textTransform:"uppercase",marginBottom:14}}>Troubleshooting</div>
          {[
            {q:"The page is stuck on Loading...",a:"Go back to the main portal and log in first. Your session must be active before navigating to other pages."},
            {q:"My completed tasks disappeared",a:"Task data is saved in your browser. If you clear your browser data or switch browsers, tasks will reset. Always use the same browser on the same device."},
            {q:"The hamburger menu is not showing some pages",a:"Some pages are restricted by role. Staff Reports is only visible to Avy and Travis. Binders are only visible to the person they belong to plus Avy and Travis."},
            {q:"I typed my name to sign but it says it does not match",a:"Your name must be typed exactly as it appears in the system — including capitalization and spacing."},
            {q:"I cannot find my binder in the menu",a:"Log out and log back in, then check the hamburger menu again. Your binder link will appear with your name on it."},
            {q:"The Creative Tab or Orientation is loading but I cannot see any content",a:"Make sure you are logged into the main portal first. Navigate using the hamburger menu — do not go directly to the URL without logging in first."},
          ].map((item,i)=>(
            <div key={i} style={{marginBottom:14,padding:"12px 14px",background:C.dark,borderRadius:10,border:"1px solid "+C.cardBorder}}>
              <div style={{color:C.ivory,fontWeight:700,fontSize:13,marginBottom:4}}>❓ {item.q}</div>
              <div style={{color:C.muted,fontSize:13,lineHeight:1.6}}>→ {item.a}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}