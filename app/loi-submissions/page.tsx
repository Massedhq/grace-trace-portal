// @ts-nocheck
"use client";

import { useEffect, useState } from "react";

const C = {
  navy: "#1F2A44",
  gold: "#B08D57",
  bg: "#F7F6F2",
  card: "#FFFFFF",
  border: "#E1DFD8",
  text: "#222222",
  muted: "#666666",
};

export default function LoiSubmissionsPage() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [allowed, setAllowed] = useState(false);
  const [checked, setChecked] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const [activeTab, setActiveTab] = useState("submissions");
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    const userId = localStorage.getItem("gtm_current_user") || "";
    const sessionActive = localStorage.getItem("gtm_session_active");
    const isLeadership = userId === "avy" || userId === "travis" || userId === "deann";
    setAllowed(sessionActive === "true" && isLeadership);
    setChecked(true);
  }, []);

  useEffect(() => {
    if (!allowed) return;
    fetchRows();
  }, [allowed]);

  async function fetchRows() {
    setLoading(true);
    try {
      const res = await fetch("/api/loi/list");
      const data = await res.json();
      setRows(data.rows || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function deleteRow(id) {
    if (!window.confirm("Delete this letter of intent? This cannot be undone.")) return;
    setDeletingId(id);
    try {
      await fetch("/api/loi/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      setRows((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      alert("Could not delete this submission. Please try again.");
    } finally {
      setDeletingId(null);
    }
  }

  function escapeHtml(str) {
    if (!str) return "";
    return String(str).replace(/[&<>"']/g, (m) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[m]));
  }

  function downloadPdf(r) {
    const win = window.open("", "_blank");
    if (!win) return;
    const date = r.submitted_at ? new Date(r.submitted_at).toLocaleDateString() : "";
    const fullName = [r.contact_first_name, r.contact_last_name].filter(Boolean).join(" ");
    const nameAndTitle = r.contact_title ? `${fullName}, ${r.contact_title}` : fullName;
    win.document.write(`
      <html>
        <head>
          <title>GTM Letter of Intent — ${escapeHtml(r.org_name)}</title>
          <style>
            body { font-family: Georgia, 'Times New Roman', serif; color: #222; padding: 48px; max-width: 720px; margin: 0 auto; }
            h1 { color: #1F2A44; font-size: 24px; text-align: center; margin-bottom: 2px; letter-spacing: 1px; }
            .sub { text-align: center; color: #B08D57; font-style: italic; margin-bottom: 6px; }
            .meta { text-align: center; color: #666; font-size: 11px; margin-bottom: 16px; }
            .divider { height: 3px; background: #1F2A44; margin: 12px 0 28px; }
            .date-line { text-align: right; font-size: 13px; color: #444; margin-bottom: 20px; }
            .re { font-weight: bold; font-size: 15px; color: #1F2A44; margin-bottom: 24px; }
            .field-row { margin-bottom: 10px; font-size: 14px; }
            .field-label { font-weight: bold; }
            .body-text { font-size: 14px; line-height: 1.7; margin: 16px 0; }
            .section-title { font-weight: bold; font-size: 14px; color: #1F2A44; margin: 22px 0 8px; }
            .sig-table { width: 100%; margin-top: 40px; border-collapse: collapse; }
            .sig-table td { width: 50%; vertical-align: top; padding-top: 10px; font-size: 12px; }
            .sig-line { border-top: 1px solid #999; margin-top: 40px; padding-top: 6px; color: #444; }
            .sig-header { font-weight: bold; font-size: 12px; color: #1F2A44; margin-bottom: 4px; }
            @media print { body { padding: 24px; } }
          </style>
        </head>
        <body>
          <h1>GRACE TRACE MINISTRIES</h1>
          <div class="sub">Transitional Housing &amp; Reentry Services</div>
          <div class="meta">gracetraceministries.org &nbsp;|&nbsp; EIN 42-2972120 &nbsp;|&nbsp; UEI FR8MBUNRB3J4</div>
          <div class="divider"></div>

          <div class="date-line">Date: ${date}</div>

          <div class="re">RE: Letter of Intent to Partner — Transitional Housing Referral Relationship</div>

          <div class="field-row"><span class="field-label">Partner Organization Name:</span> ${escapeHtml(r.org_name)}</div>
          <div class="field-row"><span class="field-label">Contact Name &amp; Title:</span> ${escapeHtml(nameAndTitle)}</div>
          <div class="field-row"><span class="field-label">Phone / Email:</span> ${escapeHtml(r.contact_info)}</div>
          <div class="field-row"><span class="field-label">City / Location:</span> ${escapeHtml(r.city)}</div>

          <div class="body-text">
            This Letter of Intent confirms that the above-named organization ("Partner") has expressed interest in referring individuals in need of transitional housing to Grace Trace Ministries ("GTM"), a Texas 501(c)(3) nonprofit organization. This letter is non-binding and is intended to document current need and support GTM's planning and funding efforts, including federal and state grant applications for transitional housing capacity.
          </div>

          <div class="section-title">1. Nature of the Need</div>
          <div class="body-text">
            Partner confirms that it regularly encounters individuals who have completed or are completing a program (e.g., sober living, treatment, or reentry) and require transitional housing, and that current housing capacity — whether Partner's own or within the surrounding community — is insufficient to meet this need.
          </div>

          <div class="section-title">2. Estimated Referral Volume</div>
          <div class="field-row"><span class="field-label">Estimated number of individuals per month:</span> ${escapeHtml(r.per_month) || "—"}</div>
          <div class="field-row"><span class="field-label">Estimated number of individuals per year:</span> ${escapeHtml(r.per_year) || "—"}</div>
          <div class="field-row" style="font-style: italic; color: #666; font-size: 12px;">(Estimates are acceptable and will not be treated as a binding commitment.)</div>

          <div class="section-title">3. Population Description</div>
          <div class="body-text">${escapeHtml(r.population) || "—"}</div>

          <div class="section-title">4. Intent to Collaborate</div>
          <div class="body-text">
            Partner agrees to work in good faith with GTM to establish a referral relationship once GTM has capacity available, and understands that GTM is actively developing housing capacity (including a facility redevelopment project) to meet this and similar community needs. This letter may be shared by GTM with funders, grant reviewers, and government agencies as evidence of community need and partnership support.
          </div>

          <table class="sig-table">
            <tr>
              <td>
                <div class="sig-header">PARTNER ORGANIZATION</div>
                <div class="sig-line">Signature</div>
                <div class="sig-line">${escapeHtml(nameAndTitle)}<br/>Printed Name &amp; Title</div>
              </td>
              <td>
                <div class="sig-header">GRACE TRACE MINISTRIES</div>
                <div class="sig-line">Signature</div>
                <div class="sig-line">Avrial Evans, President &amp; Chief Strategist<br/>Printed Name &amp; Title</div>
              </td>
            </tr>
          </table>
        </body>
      </html>
    `);
    win.document.close();
    win.focus();
    setTimeout(() => win.print(), 300);
  }

  function copyCsv() {
    const headers = ["Organization", "First Name", "Last Name", "Title", "Phone/Email", "City", "Per Month", "Per Year", "Population", "Signature", "Submitted"];
    const lines = [headers.join(",")];
    rows.forEach((r) => {
      const line = [
        r.org_name, r.contact_first_name, r.contact_last_name, r.contact_title, r.contact_info, r.city, r.per_month, r.per_year, r.population, r.signature, r.submitted_at,
      ]
        .map((v) => `"${String(v || "").replace(/"/g, '""')}"`)
        .join(",");
      lines.push(line);
    });
    navigator.clipboard.writeText(lines.join("\n"));
  }

  if (!checked) return null;

  if (!allowed) {
    return (
      <div style={{ padding: 40, textAlign: "center", color: C.muted }}>
        You don't have access to this page.
      </div>
    );
  }

  return (
    <div style={{ background: C.bg, minHeight: "100vh", padding: "32px 20px" }}>
      <div style={{ maxWidth: 1150, margin: "0 auto" }}>
        <h1 style={{ color: C.navy, fontSize: 22, marginBottom: 4 }}>Letters of intent</h1>
        <p style={{ color: C.muted, fontSize: 13, marginBottom: 12 }}>
          Submissions from the public LOI form
        </p>

        <div style={{ background: C.card, border: "1px solid " + C.border, borderRadius: 10, padding: "12px 16px", marginBottom: 20, display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
          <span style={{ color: C.navy, fontSize: 13, fontWeight: 600 }}>Share this link with partners:</span>
          <code style={{ background: C.bg, border: "1px solid " + C.border, borderRadius: 6, padding: "4px 8px", fontSize: 12, color: C.text }}>https://staff.gracetraceministries.org/loi</code>
          <button
            onClick={() => {
              navigator.clipboard.writeText("https://staff.gracetraceministries.org/loi");
              setLinkCopied(true);
              setTimeout(() => setLinkCopied(false), 2000);
            }}
            style={{
              fontSize: 12,
              padding: "5px 10px",
              borderRadius: 6,
              border: "1px solid " + (linkCopied ? "#0F6E56" : C.border),
              background: linkCopied ? "#E1F5EE" : "#fff",
              color: linkCopied ? "#0F6E56" : C.navy,
              fontWeight: linkCopied ? 700 : 400,
              cursor: "pointer",
            }}
          >
            {linkCopied ? "✓ Copied" : "Copy link"}
          </button>
        </div>

        <div style={{ display: "flex", gap: 4, marginBottom: 20, borderBottom: "1px solid " + C.border }}>
          <button
            onClick={() => setActiveTab("submissions")}
            style={{
              padding: "10px 18px",
              fontSize: 13,
              fontWeight: 700,
              border: "none",
              background: "transparent",
              cursor: "pointer",
              color: activeTab === "submissions" ? C.navy : C.muted,
              borderBottom: activeTab === "submissions" ? "2px solid " + C.navy : "2px solid transparent",
              marginBottom: -1,
            }}
          >
            Submissions{rows.length ? ` (${rows.length})` : ""}
          </button>
          <button
            onClick={() => setActiveTab("preview")}
            style={{
              padding: "10px 18px",
              fontSize: 13,
              fontWeight: 700,
              border: "none",
              background: "transparent",
              cursor: "pointer",
              color: activeTab === "preview" ? C.navy : C.muted,
              borderBottom: activeTab === "preview" ? "2px solid " + C.navy : "2px solid transparent",
              marginBottom: -1,
            }}
          >
            Live Preview
          </button>
        </div>

        {activeTab === "submissions" && (
          <div>
            <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
              <button
                onClick={fetchRows}
                style={{ fontSize: 13, padding: "8px 14px", borderRadius: 6, border: "1px solid " + C.border, background: "#fff", color: C.navy, cursor: "pointer" }}
              >
                Refresh
              </button>
              <button
                onClick={copyCsv}
                disabled={!rows.length}
                style={{ fontSize: 13, padding: "8px 14px", borderRadius: 6, border: "1px solid " + C.border, background: "#fff", color: C.navy, cursor: rows.length ? "pointer" : "default" }}
              >
                Copy as CSV
              </button>
            </div>

            {loading ? (
              <p style={{ color: C.muted, fontSize: 13 }}>Loading…</p>
            ) : rows.length === 0 ? (
              <div style={{ background: C.card, border: "1px solid " + C.border, borderRadius: 10, padding: 24, textAlign: "center", color: C.muted, fontSize: 13 }}>
                No letters of intent submitted yet.
              </div>
            ) : (
              <div style={{ background: C.card, border: "1px solid " + C.border, borderRadius: 10, overflow: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                  <thead>
                    <tr style={{ background: "#F0EEE7" }}>
                      {["Organization", "First Name", "Last Name", "Title", "Phone/Email", "City", "Per mo.", "Per yr.", "Population", "Signature", "Submitted", "Actions"].map((h) => (
                        <th key={h} style={{ textAlign: "left", padding: "8px 10px", color: C.navy, borderBottom: "1px solid " + C.border }}>
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((r) => (
                      <tr key={r.id}>
                        <td style={cellStyle}>{r.org_name}</td>
                        <td style={cellStyle}>{r.contact_first_name}</td>
                        <td style={cellStyle}>{r.contact_last_name}</td>
                        <td style={cellStyle}>{r.contact_title}</td>
                        <td style={cellStyle}>{r.contact_info}</td>
                        <td style={cellStyle}>{r.city}</td>
                        <td style={cellStyle}>{r.per_month}</td>
                        <td style={cellStyle}>{r.per_year}</td>
                        <td style={cellStyle}>{r.population}</td>
                        <td style={cellStyle}>{r.signature}</td>
                        <td style={cellStyle}>{new Date(r.submitted_at).toLocaleDateString()}</td>
                        <td style={cellStyle}>
                          <div style={{ display: "flex", gap: 6 }}>
                            <button
                              onClick={() => downloadPdf(r)}
                              style={{ fontSize: 11, padding: "4px 8px", borderRadius: 5, border: "1px solid " + C.border, background: "#fff", color: C.navy, cursor: "pointer", whiteSpace: "nowrap" }}
                            >
                              PDF
                            </button>
                            <button
                              onClick={() => deleteRow(r.id)}
                              disabled={deletingId === r.id}
                              style={{ fontSize: 11, padding: "4px 8px", borderRadius: 5, border: "1px solid #C9302C", background: "#fff", color: "#C9302C", cursor: "pointer", whiteSpace: "nowrap" }}
                            >
                              {deletingId === r.id ? "…" : "Delete"}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === "preview" && (
          <div>
            <p style={{ color: C.muted, fontSize: 12, marginBottom: 10 }}>
              This is exactly what partners see. Need a field added or changed? Let Avy know and it can be updated.
            </p>
            <div style={{ border: "1px solid " + C.border, borderRadius: 10, overflow: "hidden", height: 700 }}>
              <iframe
                src="/loi"
                title="Letter of Intent form preview"
                style={{ width: "100%", height: "100%", border: "none" }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const cellStyle = {
  padding: "8px 10px",
  borderBottom: "1px solid #E1DFD8",
  verticalAlign: "top",
};

