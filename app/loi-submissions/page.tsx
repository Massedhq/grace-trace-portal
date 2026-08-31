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
    win.document.write(`
      <html>
        <head>
          <title>GTM Letter of Intent — ${escapeHtml(r.org_name)}</title>
          <style>
            body { font-family: Georgia, 'Times New Roman', serif; color: #222; padding: 48px; max-width: 700px; margin: 0 auto; }
            h1 { color: #1F2A44; font-size: 22px; text-align: center; margin-bottom: 2px; }
            .sub { text-align: center; color: #B08D57; font-style: italic; margin-bottom: 20px; }
            .divider { height: 3px; background: #1F2A44; margin: 16px 0 28px; }
            .row { margin-bottom: 14px; }
            .label { font-weight: bold; color: #1F2A44; font-size: 13px; }
            .value { font-size: 14px; margin-top: 2px; }
            .section-title { font-size: 15px; color: #1F2A44; margin: 26px 0 10px; border-top: 1px solid #ccc; padding-top: 12px; }
            .sig { margin-top: 40px; border-top: 1px solid #ccc; padding-top: 16px; font-size: 13px; }
            @media print { body { padding: 24px; } }
          </style>
        </head>
        <body>
          <h1>GRACE TRACE MINISTRIES</h1>
          <div class="sub">Transitional Housing &amp; Reentry Services</div>
          <div class="divider"></div>

          <div class="section-title">Partner organization</div>
          <div class="row"><div class="label">Organization</div><div class="value">${escapeHtml(r.org_name)}</div></div>
          <div class="row"><div class="label">First name</div><div class="value">${escapeHtml(r.contact_first_name)}</div></div>
          <div class="row"><div class="label">Last name</div><div class="value">${escapeHtml(r.contact_last_name)}</div></div>
          <div class="row"><div class="label">Title</div><div class="value">${escapeHtml(r.contact_title) || "—"}</div></div>
          <div class="row"><div class="label">Phone / Email</div><div class="value">${escapeHtml(r.contact_info)}</div></div>
          <div class="row"><div class="label">City / Location</div><div class="value">${escapeHtml(r.city)}</div></div>

          <div class="section-title">Referral need</div>
          <div class="row"><div class="label">Estimated referrals per month</div><div class="value">${escapeHtml(r.per_month) || "—"}</div></div>
          <div class="row"><div class="label">Estimated referrals per year</div><div class="value">${escapeHtml(r.per_year) || "—"}</div></div>
          <div class="row"><div class="label">Population description</div><div class="value">${escapeHtml(r.population) || "—"}</div></div>

          <div class="sig">
            <div class="label">Signed</div>
            <div class="value">${escapeHtml(r.signature)}</div>
            <div class="value" style="color:#666; margin-top:6px;">Submitted ${date}</div>
          </div>
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
