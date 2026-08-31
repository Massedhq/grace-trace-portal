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

  useEffect(() => {
    // Same leadership gate used elsewhere in the portal
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

  function copyCsv() {
    const headers = ["Organization", "Contact", "Phone/Email", "City", "Per Month", "Per Year", "Population", "Signature", "Submitted"];
    const lines = [headers.join(",")];
    rows.forEach((r) => {
      const line = [
        r.org_name, r.contact_name, r.contact_info, r.city, r.per_month, r.per_year, r.population, r.signature, r.submitted_at,
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
      <div style={{ maxWidth: 1000, margin: "0 auto" }}>
        <h1 style={{ color: C.navy, fontSize: 22, marginBottom: 4 }}>Letters of intent</h1>
        <p style={{ color: C.muted, fontSize: 13, marginBottom: 12 }}>
          Submissions from the public LOI form
        </p>
        <div style={{ background: C.card, border: "1px solid " + C.border, borderRadius: 10, padding: "12px 16px", marginBottom: 20, display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
          <span style={{ color: C.navy, fontSize: 13, fontWeight: 600 }}>Share this link with partners:</span>
          <code id="loiShareLink" style={{ background: C.bg, border: "1px solid " + C.border, borderRadius: 6, padding: "4px 8px", fontSize: 12, color: C.text }}>https://staff.gracetraceministries.org/loi</code>
          <button
            onClick={() => { navigator.clipboard.writeText("https://staff.gracetraceministries.org/loi"); }}
            style={{ fontSize: 12, padding: "5px 10px", borderRadius: 6, border: "1px solid " + C.border, background: "#fff", cursor: "pointer" }}
          >
            Copy link
          </button>
        </div>

        <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
          <button
            onClick={fetchRows}
            style={{ fontSize: 13, padding: "8px 14px", borderRadius: 6, border: `1px solid ${C.border}`, background: "#fff", cursor: "pointer" }}
          >
            Refresh
          </button>
          <button
            onClick={copyCsv}
            disabled={!rows.length}
            style={{ fontSize: 13, padding: "8px 14px", borderRadius: 6, border: `1px solid ${C.border}`, background: "#fff", cursor: rows.length ? "pointer" : "default" }}
          >
            Copy as CSV
          </button>
        </div>

        {loading ? (
          <p style={{ color: C.muted, fontSize: 13 }}>Loading…</p>
        ) : rows.length === 0 ? (
          <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: 24, textAlign: "center", color: C.muted, fontSize: 13 }}>
            No letters of intent submitted yet.
          </div>
        ) : (
          <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, overflow: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
              <thead>
                <tr style={{ background: "#F0EEE7" }}>
                  {["Organization", "Contact", "Phone/Email", "City", "Per mo.", "Per yr.", "Population", "Signature", "Submitted"].map((h) => (
                    <th key={h} style={{ textAlign: "left", padding: "8px 10px", color: C.navy, borderBottom: `1px solid ${C.border}` }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.id}>
                    <td style={cellStyle}>{r.org_name}</td>
                    <td style={cellStyle}>{r.contact_name}</td>
                    <td style={cellStyle}>{r.contact_info}</td>
                    <td style={cellStyle}>{r.city}</td>
                    <td style={cellStyle}>{r.per_month}</td>
                    <td style={cellStyle}>{r.per_year}</td>
                    <td style={cellStyle}>{r.population}</td>
                    <td style={cellStyle}>{r.signature}</td>
                    <td style={cellStyle}>{new Date(r.submitted_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
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




