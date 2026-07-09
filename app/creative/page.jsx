"use client";
import { useState, useEffect } from "react";

const C = {
  burgundy: "#6B1A2A",
  burgundyDark: "#4A0E1A",
  green: "#1E4D2B",
  gold: "#C9A84C",
  ivory: "#F5F0E8",
  dark: "#1A0F12",
  card: "#2A1A1E",
  cardBorder: "#3D2028",
  text: "#F0EAE2",
  muted: "#A08878",
  error: "#EF5350",
};

const USERS = [
  { id: "avy", name: "Avrial Evans (Avy)", initials: "AE", color: C.burgundy, password: "GTM@Avy2026", isLeadership: true },
  { id: "travis", name: "Travis Ramar", initials: "TR", color: C.green, password: "GTM@Travis2026", isLeadership: true },
  { id: "deann", name: "Deann Evans", initials: "DE", color: "#8B2A3E", password: "GTM@Deann2026", isLeadership: false },
  { id: "erica", name: "Erica Evans", initials: "EE", color: "#5C3010", password: "GTM@Erica2026", isLeadership: false },
  { id: "ialana", name: "Ialana Tippins", initials: "IT", color: "#1A3D2B", password: "GTM@Ialana2026", isLeadership: false },
  { id: "aubreyon", name: "AuBreyon (Kisses) Woodley", initials: "KW", color: "#4A1A5C", password: "GTM@Kisses2026", isLeadership: false },
  { id: "dennis", name: "Dennis", initials: "DO", color: "#1A4D35", password: "GTM@Dennis2026", isLeadership: false },
];

function loadIdeas() {
  try { const s = localStorage.getItem("gtm_ideas"); return s ? JSON.parse(s) : []; } catch (e) { return []; }
}

function saveIdeas(ideas) {
  try { localStorage.setItem("gtm_ideas", JSON.stringify(ideas)); } catch (e) {}
}

export default function CreativeTab() {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [ideas, setIdeas] = useState([]);
  const [view, setView] = useState("board");
  const [ideaTitle, setIdeaTitle] = useState("");
  const [ideaDesc, setIdeaDesc] = useState("");
  const [ideaLink, setIdeaLink] = useState("");
  const [submitMsg, setSubmitMsg] = useState("");
  const [voteNote, setVoteNote] = useState({});

  useEffect(() => {
    try {
      const uid = localStorage.getItem("gtm_current_user");
      if (uid) {
        const u = USERS.find(u => u.id === uid);
        if (u) setCurrentUser(u);
      }
    } catch(e) {}
    setIdeas(loadIdeas());
    setLoading(false);
  }, []);

  function logout() { 
    try { localStorage.removeItem("gtm_current_user"); } catch(e) {}
    window.location.href = "/";
  }

  function submitIdea() {
    if (!ideaTitle.trim()) { setSubmitMsg("Please enter an idea title."); return; }
    if (!ideaDesc.trim()) { setSubmitMsg("Please describe your idea."); return; }
    const newIdea = {
      id: Date.now().toString(),
      title: ideaTitle.trim(),
      description: ideaDesc.trim(),
      link: ideaLink.trim(),
      submittedBy: currentUser.name,
      submittedById: currentUser.id,
      submittedAt: new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
      status: "pending",
      votes: {},
      voteNotes: {},
    };
    const updated = [newIdea, ...ideas];
    setIdeas(updated);
    saveIdeas(updated);
    setIdeaTitle(""); setIdeaDesc(""); setIdeaLink("");
    setSubmitMsg("Idea submitted! Avy and Travis will review it.");
    setView("board");
  }

  function approveIdea(id) {
    const updated = ideas.map(idea => idea.id === id ? { ...idea, status: "approved" } : idea);
    setIdeas(updated); saveIdeas(updated);
  }

  function rejectIdea(id) {
    const updated = ideas.map(idea => idea.id === id ? { ...idea, status: "rejected" } : idea);
    setIdeas(updated); saveIdeas(updated);
  }

  function castVote(id, vote) {
    const note = voteNote[id] || "";
    const updated = ideas.map(idea => {
      if (idea.id !== id) return idea;
      return {
        ...idea,
        votes: { ...idea.votes, [currentUser.id]: vote },
        voteNotes: { ...idea.voteNotes, [currentUser.id]: note },
      };
    });
    setIdeas(updated); saveIdeas(updated);
    setVoteNote(prev => ({ ...prev, [id]: "" }));
  }

  function getVoteCounts(idea) {
    const votes = Object.values(idea.votes || {});
    return {
      up: votes.filter(v => v === "up").length,
      down: votes.filter(v => v === "down").length,
      question: votes.filter(v => v === "question").length,
    };
  }

  if (loading) return (
    <div style={{ minHeight: "100vh", background: C.dark, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Inter','Segoe UI',sans-serif" }}>
      <div style={{ color: C.muted, fontSize: 14 }}>Loading...</div>
    </div>
  );

  const approvedIdeas = ideas.filter(i => i.status === "approved");
  const pendingIdeas = ideas.filter(i => i.status === "pending");
  const rejectedIdeas = ideas.filter(i => i.status === "rejected");

  return (
    <div style={{ minHeight: "100vh", background: C.dark, fontFamily: "'Inter','Segoe UI',sans-serif" }}>
      {/* Header */}
      <div style={{ background: "linear-gradient(135deg, " + C.burgundyDark + " 0%, " + C.dark + " 70%)", borderBottom: "2px solid " + C.gold, padding: "14px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
        <div>
          <div style={{ color: C.gold, fontSize: 10, fontWeight: 800, letterSpacing: 3, textTransform: "uppercase", marginBottom: 3 }}>Grace Trace Ministries</div>
          <h1 style={{ color: C.ivory, fontSize: 17, fontWeight: 900, margin: 0 }}>Creative Tab 💡</h1>
          <div style={{ color: C.muted, fontSize: 12, marginTop: 2 }}>{currentUser.name}</div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={() => window.history.back()} style={{ background: "transparent", border: "1px solid " + C.cardBorder, borderRadius: 8, padding: "6px 12px", color: C.muted, fontSize: 12, cursor: "pointer" }}>← Back</button>
          <button onClick={logout} style={{ background: "transparent", border: "1px solid " + C.cardBorder, borderRadius: 8, padding: "6px 12px", color: C.muted, fontSize: 12, cursor: "pointer" }}>Log out</button>
        </div>
      </div>

      {/* Tab nav */}
      <div style={{ background: C.dark, borderBottom: "1px solid " + C.cardBorder, display: "flex", gap: 2, padding: "0 24px" }}>
        {["board", "submit", currentUser.isLeadership && "review"].filter(Boolean).map(tab => (
          <button key={tab} onClick={() => { setView(tab); setSubmitMsg(""); }}
            style={{ background: "transparent", border: "none", borderBottom: view === tab ? "2px solid " + C.gold : "2px solid transparent", color: view === tab ? C.gold : C.muted, fontSize: 13, fontWeight: view === tab ? 800 : 500, padding: "11px 16px", cursor: "pointer", textTransform: "capitalize" }}>
            {tab === "board" ? "Idea Board" : tab === "submit" ? "Submit Idea" : "Review Pending"}
            {tab === "review" && pendingIdeas.length > 0 && (
              <span style={{ background: C.error, color: C.ivory, borderRadius: 20, padding: "1px 7px", fontSize: 10, fontWeight: 800, marginLeft: 6 }}>{pendingIdeas.length}</span>
            )}
          </button>
        ))}
      </div>

      <div style={{ maxWidth: 720, margin: "0 auto", padding: "24px 20px" }}>

        {/* IDEA BOARD */}
        {view === "board" && (
          <div>
            <div style={{ color: C.gold, fontSize: 11, fontWeight: 800, letterSpacing: 2, textTransform: "uppercase", marginBottom: 14 }}>Approved Ideas — Team Vote</div>
            {approvedIdeas.length === 0 && (
              <div style={{ background: C.card, border: "1px solid " + C.cardBorder, borderRadius: 12, padding: "24px", textAlign: "center", color: C.muted, fontSize: 14 }}>No approved ideas yet. Submit one and leadership will review it.</div>
            )}
            {approvedIdeas.map(idea => {
              const counts = getVoteCounts(idea);
              const myVote = idea.votes[currentUser.id];
              return (
                <div key={idea.id} style={{ background: C.card, border: "1px solid " + C.cardBorder, borderRadius: 12, padding: "18px 20px", marginBottom: 14 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 8, marginBottom: 10 }}>
                    <div>
                      <div style={{ color: C.text, fontWeight: 800, fontSize: 15 }}>{idea.title}</div>
                      <div style={{ color: C.muted, fontSize: 12, marginTop: 3 }}>Submitted by {idea.submittedBy} — {idea.submittedAt}</div>
                    </div>
                    <div style={{ background: "#4CAF5022", border: "1px solid #4CAF5044", borderRadius: 20, padding: "2px 10px", color: "#4CAF50", fontSize: 11, fontWeight: 700 }}>Approved</div>
                  </div>
                  <p style={{ color: C.text, fontSize: 14, lineHeight: 1.7, margin: "0 0 10px" }}>{idea.description}</p>
                  {idea.link && <a href={idea.link} target="_blank" rel="noreferrer" style={{ color: C.gold, fontSize: 13, display: "block", marginBottom: 12 }}>🔗 {idea.link}</a>}

                  {/* Vote counts */}
                  <div style={{ display: "flex", gap: 16, marginBottom: 14 }}>
                    {[["👍", "up", counts.up], ["👎", "down", counts.down], ["❓", "question", counts.question]].map(([emoji, type, count]) => (
                      <div key={type} style={{ color: C.muted, fontSize: 13 }}>{emoji} {count}</div>
                    ))}
                  </div>

                  {/* Cast vote */}
                  {!myVote ? (
                    <div>
                      <div style={{ color: C.muted, fontSize: 12, marginBottom: 8 }}>Cast your vote</div>
                      <textarea value={voteNote[idea.id] || ""} onChange={e => setVoteNote(prev => ({ ...prev, [idea.id]: e.target.value }))} placeholder="Add an explanation or comment (optional)"
                        rows={2} style={{ width: "100%", background: C.dark, border: "1px solid " + C.cardBorder, borderRadius: 8, padding: "8px 12px", color: C.text, fontSize: 13, resize: "none", outline: "none", fontFamily: "inherit", marginBottom: 10 }} />
                      <div style={{ display: "flex", gap: 8 }}>
                        <button onClick={() => castVote(idea.id, "up")} style={{ flex: 1, background: "#4CAF5022", border: "1px solid #4CAF5044", borderRadius: 8, padding: "9px", color: "#4CAF50", fontSize: 14, cursor: "pointer", fontWeight: 700 }}>👍 I'm in</button>
                        <button onClick={() => castVote(idea.id, "down")} style={{ flex: 1, background: C.error + "22", border: "1px solid " + C.error + "44", borderRadius: 8, padding: "9px", color: C.error, fontSize: 14, cursor: "pointer", fontWeight: 700 }}>👎 No</button>
                        <button onClick={() => castVote(idea.id, "question")} style={{ flex: 1, background: C.gold + "22", border: "1px solid " + C.gold + "44", borderRadius: 8, padding: "9px", color: C.gold, fontSize: 14, cursor: "pointer", fontWeight: 700 }}>❓ Need more info</button>
                      </div>
                    </div>
                  ) : (
                    <div style={{ background: C.dark, borderRadius: 8, padding: "10px 14px", color: C.muted, fontSize: 13 }}>
                      You voted: {myVote === "up" ? "👍 I'm in" : myVote === "down" ? "👎 No" : "❓ Need more info"}
                      {idea.voteNotes[currentUser.id] && <div style={{ color: C.text, fontSize: 13, marginTop: 4 }}>"{idea.voteNotes[currentUser.id]}"</div>}
                    </div>
                  )}

                  {/* Show all vote notes */}
                  {Object.entries(idea.voteNotes || {}).filter(([k, v]) => v).length > 0 && (
                    <div style={{ marginTop: 12, borderTop: "1px solid " + C.cardBorder, paddingTop: 12 }}>
                      <div style={{ color: C.muted, fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>Team comments</div>
                      {Object.entries(idea.voteNotes).filter(([k, v]) => v).map(([uid, note]) => {
                        const voter = USERS.find(u => u.id === uid);
                        return voter ? (
                          <div key={uid} style={{ display: "flex", gap: 8, marginBottom: 8, alignItems: "flex-start" }}>
                            <div style={{ width: 26, height: 26, borderRadius: "50%", background: voter.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 800, color: C.ivory, flexShrink: 0 }}>{voter.initials}</div>
                            <div>
                              <div style={{ color: C.gold, fontSize: 11, fontWeight: 700 }}>{voter.name} — {idea.votes[uid] === "up" ? "👍" : idea.votes[uid] === "down" ? "👎" : "❓"}</div>
                              <div style={{ color: C.text, fontSize: 13 }}>{note}</div>
                            </div>
                          </div>
                        ) : null;
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* SUBMIT IDEA */}
        {view === "submit" && (
          <div>
            <div style={{ color: C.gold, fontSize: 11, fontWeight: 800, letterSpacing: 2, textTransform: "uppercase", marginBottom: 14 }}>Submit a New Idea</div>
            <div style={{ background: C.card, border: "1px solid " + C.cardBorder, borderRadius: 12, padding: "20px 22px" }}>
              <div style={{ marginBottom: 16 }}>
                <div style={{ color: C.text, fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Idea title</div>
                <input type="text" value={ideaTitle} onChange={e => { setIdeaTitle(e.target.value); setSubmitMsg(""); }} placeholder="Give your idea a clear title"
                  style={{ width: "100%", background: C.dark, border: "1px solid " + C.cardBorder, borderRadius: 8, padding: "10px 14px", color: C.text, fontSize: 14, outline: "none", fontFamily: "inherit" }} />
              </div>
              <div style={{ marginBottom: 16 }}>
                <div style={{ color: C.text, fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Describe your idea</div>
                <textarea value={ideaDesc} onChange={e => { setIdeaDesc(e.target.value); setSubmitMsg(""); }} placeholder="Explain the idea, why it would help, and how it could work" rows={5}
                  style={{ width: "100%", background: C.dark, border: "1px solid " + C.cardBorder, borderRadius: 8, padding: "10px 14px", color: C.text, fontSize: 14, resize: "vertical", outline: "none", fontFamily: "inherit", lineHeight: 1.6 }} />
              </div>
              <div style={{ marginBottom: 20 }}>
                <div style={{ color: C.text, fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Link (optional)</div>
                <input type="text" value={ideaLink} onChange={e => setIdeaLink(e.target.value)} placeholder="Paste a link to a resource, article, or reference"
                  style={{ width: "100%", background: C.dark, border: "1px solid " + C.cardBorder, borderRadius: 8, padding: "10px 14px", color: C.text, fontSize: 14, outline: "none", fontFamily: "inherit" }} />
              </div>
              {submitMsg && <div style={{ color: submitMsg.includes("submitted") ? "#4CAF50" : C.error, fontSize: 13, marginBottom: 12 }}>{submitMsg}</div>}
              <button onClick={submitIdea} style={{ width: "100%", background: C.burgundy, border: "1px solid " + C.gold + "66", borderRadius: 10, padding: "13px", color: C.ivory, fontSize: 14, fontWeight: 800, cursor: "pointer" }}>
                Submit Idea to Avy and Travis
              </button>
            </div>
          </div>
        )}

        {/* REVIEW PENDING — Leadership only */}
        {view === "review" && currentUser.isLeadership && (
          <div>
            <div style={{ color: C.gold, fontSize: 11, fontWeight: 800, letterSpacing: 2, textTransform: "uppercase", marginBottom: 14 }}>Pending Ideas — Leadership Review</div>
            {pendingIdeas.length === 0 && (
              <div style={{ background: C.card, border: "1px solid " + C.cardBorder, borderRadius: 12, padding: "24px", textAlign: "center", color: C.muted, fontSize: 14 }}>No pending ideas right now.</div>
            )}
            {pendingIdeas.map(idea => (
              <div key={idea.id} style={{ background: C.card, border: "1px solid " + C.gold + "44", borderRadius: 12, padding: "18px 20px", marginBottom: 14 }}>
                <div style={{ color: C.gold, fontSize: 11, fontWeight: 700, textTransform: "uppercase", marginBottom: 6 }}>Pending Review</div>
                <div style={{ color: C.text, fontWeight: 800, fontSize: 15, marginBottom: 4 }}>{idea.title}</div>
                <div style={{ color: C.muted, fontSize: 12, marginBottom: 10 }}>Submitted by {idea.submittedBy} — {idea.submittedAt}</div>
                <p style={{ color: C.text, fontSize: 14, lineHeight: 1.7, margin: "0 0 10px" }}>{idea.description}</p>
                {idea.link && <a href={idea.link} target="_blank" rel="noreferrer" style={{ color: C.gold, fontSize: 13, display: "block", marginBottom: 14 }}>🔗 {idea.link}</a>}
                <div style={{ display: "flex", gap: 10 }}>
                  <button onClick={() => approveIdea(idea.id)} style={{ flex: 1, background: "#4CAF5022", border: "1px solid #4CAF5044", borderRadius: 8, padding: "10px", color: "#4CAF50", fontSize: 13, fontWeight: 800, cursor: "pointer" }}>✓ Approve — Share with Team</button>
                  <button onClick={() => rejectIdea(idea.id)} style={{ flex: 1, background: C.error + "22", border: "1px solid " + C.error + "44", borderRadius: 8, padding: "10px", color: C.error, fontSize: 13, fontWeight: 800, cursor: "pointer" }}>✗ Decline</button>
                </div>
              </div>
            ))}

            {rejectedIdeas.length > 0 && (
              <>
                <div style={{ color: C.muted, fontSize: 11, fontWeight: 800, letterSpacing: 2, textTransform: "uppercase", marginBottom: 10, marginTop: 24 }}>Declined Ideas</div>
                {rejectedIdeas.map(idea => (
                  <div key={idea.id} style={{ background: C.card, border: "1px solid " + C.cardBorder, borderRadius: 12, padding: "14px 18px", marginBottom: 10, opacity: 0.6 }}>
                    <div style={{ color: C.text, fontWeight: 700, fontSize: 14 }}>{idea.title}</div>
                    <div style={{ color: C.muted, fontSize: 12, marginTop: 3 }}>Submitted by {idea.submittedBy} — Declined</div>
                  </div>
                ))}
              </>
            )}
          </div>
        )}

        <div style={{ height: 48 }} />
      </div>
    </div>
  );
}