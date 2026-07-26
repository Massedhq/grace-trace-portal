"use client";

// app/outreach-resource-center/page.jsx
//
// Styled to match the portal's existing inline color palette.
// Supports deep-linking: /outreach-resource-center?cat=veterans opens
// directly into that category instead of the home grid.
//
// NOTE: reads the query string via window.location instead of
// next/navigation's useSearchParams — that hook requires a Suspense
// boundary for static generation, which isn't needed here since this
// is a client-only lookup done after mount.

import { useState, useEffect } from "react";
import { CATEGORIES, DIRECTOR_TRAINING, RESEARCH_TEMPLATE_FIELDS } from "@/lib/outreachResourceContent";

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

const TABS = ["Learning Center", "Templates", "Forms", "Documents", "Completed Examples"];

const PROPERTY_FIELDS = [
  { key: "address", label: "Property Address" },
  { key: "vacancyLength", label: "Vacancy Length" },
  { key: "population", label: "Estimated Population Served (city/county)" },
  { key: "owner", label: "Owner Name (via appraisal district / deed records)" },
  { key: "ownerContact", label: "Owner Contact Info" },
  { key: "zoning", label: "Zoning" },
  { key: "nearbyResources", label: "Nearby Veteran/Reentry Resources" },
  { key: "edcContact", label: "Local Economic Development Contact" },
  { key: "outreachStatus", label: "Outreach Status" },
  { key: "nextStep", label: "Next Step" },
];

export default function OutreachResourceCenter() {
  const [view, setView] = useState("home"); // "home" | "category" | "training"
  const [activeCategoryId, setActiveCategoryId] = useState(null);
  const [activeTab, setActiveTab] = useState("Learning Center");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const cat = params.get("cat");
    if (cat === "training") {
      setView("training");
    } else if (cat && CATEGORIES.some((c) => c.id === cat)) {
      setActiveCategoryId(cat);
      setActiveTab("Learning Center");
      setView("category");
    }
  }, []);

  const activeCategory = CATEGORIES.find((c) => c.id === activeCategoryId);

  function openCategory(id) {
    setActiveCategoryId(id);
    setActiveTab("Learning Center");
    setView("category");
  }

  return (
    <div style={{ minHeight: "100vh", background: C.dark, fontFamily: "'Inter','Segoe UI',sans-serif" }}>
      <div style={{ background: "linear-gradient(135deg," + C.burgundyDark + " 0%," + C.dark + " 70%)", borderBottom: "2px solid " + C.gold, padding: "20px 24px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={{ color: C.gold, fontSize: 11, fontWeight: 800, letterSpacing: 2, textTransform: "uppercase" }}>Director of Outreach</div>
          <div style={{ color: C.ivory, fontSize: 24, fontWeight: 900, marginTop: 4 }}>Outreach Resource Center</div>
          <div style={{ color: C.muted, fontSize: 13, marginTop: 4 }}>Knowledge • Templates • Training • Resources</div>
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "24px 20px" }}>
        {view !== "home" && (
          <button onClick={() => setView("home")} style={{ background: "transparent", border: "1px solid " + C.cardBorder, borderRadius: 8, padding: "7px 14px", color: C.muted, fontSize: 12, cursor: "pointer", marginBottom: 20 }}>
            ← Back to Resource Center
          </button>
        )}

        {view === "home" && (
          <>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))", gap: 12, marginBottom: 24 }}>
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => openCategory(cat.id)}
                  style={{ background: C.card, border: "1px solid " + C.cardBorder, borderRadius: 12, padding: "18px 16px", textAlign: "left", cursor: "pointer" }}
                >
                  <div style={{ fontSize: 26, marginBottom: 8 }}>{cat.icon}</div>
                  <div style={{ color: C.ivory, fontWeight: 800, fontSize: 14 }}>{cat.title}</div>
                  <div style={{ color: C.muted, fontSize: 12, marginTop: 4, lineHeight: 1.4 }}>{cat.tagline}</div>
                </button>
              ))}
            </div>

            <button
              onClick={() => setView("training")}
              style={{ width: "100%", background: C.burgundy, border: "1px solid " + C.gold + "66", borderRadius: 12, padding: "18px 20px", textAlign: "left", cursor: "pointer" }}
            >
              <div style={{ fontSize: 26, marginBottom: 8 }}>🎓</div>
              <div style={{ color: C.ivory, fontWeight: 800, fontSize: 15 }}>Director Training</div>
              <div style={{ color: C.gold, fontSize: 12, marginTop: 4 }}>Step-by-step guides for outreach, from first contact to long-term partnership</div>
            </button>
          </>
        )}

        {view === "training" && <DirectorTrainingView />}

        {view === "category" && activeCategory && (
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
              <span style={{ fontSize: 32 }}>{activeCategory.icon}</span>
              <div>
                <div style={{ color: C.ivory, fontWeight: 900, fontSize: 20 }}>{activeCategory.title}</div>
                <div style={{ color: C.muted, fontSize: 13, marginTop: 2 }}>{activeCategory.tagline}</div>
              </div>
            </div>

            <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
              {TABS.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  style={{
                    background: activeTab === tab ? C.burgundy : C.card,
                    border: "1px solid " + (activeTab === tab ? C.gold + "88" : C.cardBorder),
                    borderRadius: 20, padding: "8px 16px", color: activeTab === tab ? C.ivory : C.muted,
                    fontSize: 13, fontWeight: 700, cursor: "pointer",
                  }}
                >
                  {tab}
                </button>
              ))}
            </div>

            {activeTab === "Learning Center" && <LearningCenterView data={activeCategory.learningCenter} />}
            {activeTab === "Templates" && <TemplatesView templates={activeCategory.templates} />}
            {activeTab === "Forms" && (
              <FormsView fields={activeCategory.id === "potentialProperties" ? PROPERTY_FIELDS : RESEARCH_TEMPLATE_FIELDS} categoryTitle={activeCategory.title} />
            )}
            {activeTab === "Documents" && <DocumentsView documents={activeCategory.documents} />}
            {activeTab === "Completed Examples" && <CompletedExamplesView examples={activeCategory.completedExamples} />}
          </div>
        )}
      </div>
    </div>
  );
}

function SectionHeading({ children }) {
  return <div style={{ color: C.gold, fontSize: 11, fontWeight: 800, letterSpacing: 2, textTransform: "uppercase", marginBottom: 10, marginTop: 20 }}>{children}</div>;
}

function LearningCenterView({ data }) {
  return (
    <div style={{ background: C.card, border: "1px solid " + C.cardBorder, borderRadius: 12, padding: "20px 22px" }}>
      <SectionHeading>What It Is</SectionHeading>
      <p style={{ color: C.text, fontSize: 14, lineHeight: 1.7 }}>{data.whatItIs}</p>

      <SectionHeading>Why It Matters</SectionHeading>
      <p style={{ color: C.text, fontSize: 14, lineHeight: 1.7 }}>{data.whyItMatters}</p>

      <SectionHeading>How It Works</SectionHeading>
      <p style={{ color: C.text, fontSize: 14, lineHeight: 1.7 }}>{data.howItWorks}</p>

      <SectionHeading>Terminology</SectionHeading>
      <ul style={{ margin: 0, paddingLeft: 20 }}>
        {data.terminology.map((t, i) => (
          <li key={i} style={{ color: C.text, fontSize: 13, lineHeight: 1.8 }}>{t}</li>
        ))}
      </ul>

      <SectionHeading>Frequently Asked Questions</SectionHeading>
      {data.faqs.map((f, i) => (
        <div key={i} style={{ marginBottom: 12 }}>
          <div style={{ color: C.ivory, fontWeight: 700, fontSize: 13 }}>❓ {f.q}</div>
          <div style={{ color: C.muted, fontSize: 13, marginTop: 2 }}>→ {f.a}</div>
        </div>
      ))}

      <SectionHeading>Best Practices</SectionHeading>
      {data.bestPractices.map((b, i) => (
        <div key={i} style={{ display: "flex", gap: 8, marginBottom: 6 }}>
          <span style={{ color: C.gold }}>✦</span>
          <span style={{ color: C.text, fontSize: 13, lineHeight: 1.6 }}>{b}</span>
        </div>
      ))}
    </div>
  );
}

function TemplatesView({ templates }) {
  const [copiedIndex, setCopiedIndex] = useState(null);

  function handleCopy(text, i) {
    navigator.clipboard?.writeText(text).then(() => {
      setCopiedIndex(i);
      setTimeout(() => setCopiedIndex(null), 1500);
    });
  }

  return (
    <div>
      {templates.map((t, i) => (
        <div key={i} style={{ background: C.card, border: "1px solid " + C.cardBorder, borderRadius: 12, padding: "16px 18px", marginBottom: 14 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
            <div style={{ color: C.ivory, fontWeight: 800, fontSize: 14 }}>{t.title}</div>
            <button onClick={() => handleCopy(t.body, i)} style={{ background: "transparent", border: "1px solid " + C.gold + "66", borderRadius: 6, padding: "5px 12px", color: C.gold, fontSize: 11, fontWeight: 700, cursor: "pointer" }}>
              {copiedIndex === i ? "Copied ✓" : "Copy"}
            </button>
          </div>
          <pre style={{ color: C.text, fontSize: 13, lineHeight: 1.7, whiteSpace: "pre-wrap", fontFamily: "inherit", margin: 0 }}>{t.body}</pre>
        </div>
      ))}
    </div>
  );
}

function FormsView({ fields, categoryTitle }) {
  const [values, setValues] = useState({});
  const [generated, setGenerated] = useState(null);

  function update(key, val) {
    setValues((v) => ({ ...v, [key]: val }));
  }

  function generate() {
    let txt = "GRACE TRACE MINISTRIES — " + categoryTitle.toUpperCase() + " RESEARCH RECORD\n" + "=".repeat(56) + "\n\n";
    fields.forEach((f) => {
      txt += f.label + ":\n  " + (values[f.key]?.trim() || "—") + "\n\n";
    });
    txt += "=".repeat(56) + "\nGenerated: " + new Date().toLocaleString() + "\n";
    setGenerated(txt);
  }

  function download() {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([generated], { type: "text/plain" }));
    a.download = categoryTitle.replace(/\s+/g, "_") + "_Research_" + new Date().toISOString().slice(0, 10) + ".txt";
    a.click();
  }

  return (
    <div>
      <div style={{ background: C.card, border: "1px solid " + C.cardBorder, borderRadius: 12, padding: "18px 20px" }}>
        <div style={{ color: C.gold, fontSize: 11, fontWeight: 800, letterSpacing: 1, textTransform: "uppercase", marginBottom: 14 }}>
          Research Form — fill in what you know
        </div>
        {fields.map((f) => (
          <div key={f.key} style={{ marginBottom: 14 }}>
            <label style={{ color: C.text, fontSize: 13, fontWeight: 600, display: "block", marginBottom: 6 }}>{f.label}</label>
            <textarea
              value={values[f.key] || ""}
              onChange={(e) => update(f.key, e.target.value)}
              rows={f.key.includes("Notes") || f.key.includes("Requirements") || f.key.includes("Process") || f.key.includes("Actions") || f.key.includes("resources") ? 3 : 1}
              style={{ width: "100%", background: C.dark, border: "1px solid " + C.cardBorder, borderRadius: 8, padding: "8px 12px", color: C.text, fontSize: 13, outline: "none", fontFamily: "inherit", resize: "vertical" }}
            />
          </div>
        ))}
        <button onClick={generate} style={{ width: "100%", background: C.green, border: "none", borderRadius: 8, padding: "12px", color: C.ivory, fontSize: 14, fontWeight: 800, cursor: "pointer" }}>
          Generate Record
        </button>
      </div>

      {generated && (
        <div style={{ marginTop: 14 }}>
          <pre style={{ background: C.card, border: "1px solid " + C.cardBorder, borderRadius: 12, padding: 18, color: C.text, fontSize: 12, lineHeight: 1.7, whiteSpace: "pre-wrap", fontFamily: "monospace" }}>{generated}</pre>
          <button onClick={download} style={{ marginTop: 10, background: C.burgundy, border: "1px solid " + C.gold + "66", borderRadius: 8, padding: "10px 18px", color: C.ivory, fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
            Download as Text File
          </button>
        </div>
      )}

      <p style={{ color: C.muted, fontSize: 12, marginTop: 12 }}>
        This form generates a downloadable record — it does not save automatically. Download it and share it with Avy or Travis, or paste it into an Announcement once a partnership is confirmed.
      </p>
    </div>
  );
}

function DocumentsView({ documents }) {
  return (
    <div style={{ background: C.card, border: "1px solid " + C.cardBorder, borderRadius: 12, padding: "18px 20px" }}>
      {documents.length === 0 ? (
        <p style={{ color: C.muted, fontSize: 14 }}>No reference documents added yet.</p>
      ) : (
        documents.map((d, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 0", borderBottom: i < documents.length - 1 ? "1px solid " + C.cardBorder : "none" }}>
            <span style={{ fontSize: 16 }}>📄</span>
            <span style={{ color: C.text, fontSize: 14 }}>{d}</span>
          </div>
        ))
      )}
    </div>
  );
}

function CompletedExamplesView({ examples }) {
  if (examples.length === 0) {
    return (
      <div style={{ background: C.card, border: "1px solid " + C.cardBorder, borderRadius: 12, padding: "24px 20px", textAlign: "center" }}>
        <div style={{ fontSize: 28, marginBottom: 10 }}>⭐</div>
        <div style={{ color: C.ivory, fontWeight: 700, fontSize: 14, marginBottom: 6 }}>No completed examples yet</div>
        <div style={{ color: C.muted, fontSize: 13, lineHeight: 1.6 }}>
          Once a real partnership or research record is documented in this category, add it here as a reference example for future outreach work.
        </div>
      </div>
    );
  }
  return (
    <div>
      {examples.map((ex, i) => (
        <div key={i} style={{ background: C.card, border: "1px solid " + C.gold + "44", borderRadius: 12, padding: "16px 18px", marginBottom: 14 }}>
          <div style={{ color: C.gold, fontWeight: 800, fontSize: 14, marginBottom: 8 }}>⭐ {ex.title}</div>
          <pre style={{ color: C.text, fontSize: 13, lineHeight: 1.7, whiteSpace: "pre-wrap", fontFamily: "inherit", margin: 0 }}>{ex.body}</pre>
        </div>
      ))}
    </div>
  );
}

function DirectorTrainingView() {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
        <span style={{ fontSize: 32 }}>🎓</span>
        <div>
          <div style={{ color: C.ivory, fontWeight: 900, fontSize: 20 }}>Director Training</div>
          <div style={{ color: C.muted, fontSize: 13, marginTop: 2 }}>Step-by-step guides — the same repeatable process for every outreach coordinator</div>
        </div>
      </div>

      {DIRECTOR_TRAINING.map((guide, i) => (
        <div key={i} style={{ background: C.card, border: "1px solid " + C.cardBorder, borderRadius: 12, marginBottom: 10, overflow: "hidden" }}>
          <button
            onClick={() => setOpenIndex(openIndex === i ? null : i)}
            style={{ width: "100%", textAlign: "left", background: "transparent", border: "none", padding: "14px 18px", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center" }}
          >
            <span style={{ color: C.ivory, fontWeight: 700, fontSize: 14 }}>{i + 1}. {guide.title}</span>
            <span style={{ color: C.gold, fontSize: 18 }}>{openIndex === i ? "−" : "+"}</span>
          </button>
          {openIndex === i && (
            <div style={{ padding: "0 18px 16px" }}>
              <pre style={{ color: C.text, fontSize: 13, lineHeight: 1.8, whiteSpace: "pre-wrap", fontFamily: "inherit", margin: 0 }}>{guide.body}</pre>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}