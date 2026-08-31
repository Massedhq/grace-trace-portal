// @ts-nocheck
"use client";

import { useState } from "react";

const C = {
  navy: "#1F2A44",
  gold: "#B08D57",
  bg: "#F7F6F2",
  card: "#FFFFFF",
  border: "#E1DFD8",
  text: "#222222",
  muted: "#666666",
  error: "#B3261E",
  success: "#0F6E56",
};

export default function LoiFormPage() {
  const [form, setForm] = useState({
    orgName: "",
    contactName: "",
    contactInfo: "",
    city: "",
    perMonth: "",
    perYear: "",
    population: "",
    signature: "",
  });
  const [agree, setAgree] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function validate() {
    const e = {};
    if (!form.orgName.trim()) e.orgName = "Enter your organization's name.";
    if (!form.contactName.trim()) e.contactName = "Enter a contact name.";
    if (!form.contactInfo.trim()) e.contactInfo = "Enter a phone number or email.";
    if (!form.city.trim()) e.city = "Enter your city.";
    if (!form.perMonth.trim() && !form.perYear.trim())
      e.volume = "Give at least one estimate — monthly or yearly.";
    if (!form.signature.trim()) e.signature = "Type your name to sign.";
    if (!agree) e.agree = "Please check the confirmation box.";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit() {
    if (!validate()) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/loi/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("submit failed");
      setSubmitted(true);
    } catch (err) {
      alert("Something went wrong submitting this form. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  const fieldStyle = {
    width: "100%",
    padding: "10px 12px",
    fontSize: 14,
    border: `1px solid #C9C7BE`,
    borderRadius: 6,
    fontFamily: "inherit",
    color: C.text,
    background: "#FEFEFD",
    marginTop: 6,
    boxSizing: "border-box",
  };

  const labelStyle = {
    display: "block",
    fontSize: 13,
    fontWeight: 600,
    color: C.navy,
    marginTop: 14,
  };

  const errorStyle = {
    color: C.error,
    fontSize: 12,
    marginTop: 4,
  };

  if (submitted) {
    return (
      <div style={{ background: C.bg, minHeight: "100vh", padding: "24px 16px" }}>
        <div style={{ maxWidth: 560, margin: "0 auto" }}>
          <div
            style={{
              background: C.card,
              border: `1px solid ${C.border}`,
              borderRadius: 10,
              padding: "48px 24px",
              textAlign: "center",
            }}
          >
            <div
              style={{
                width: 52,
                height: 52,
                borderRadius: "50%",
                background: "#E1F5EE",
                color: C.success,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 16px",
                fontSize: 26,
              }}
            >
              ✓
            </div>
            <h2 style={{ color: C.navy, fontSize: 18, margin: "0 0 8px" }}>Thank you</h2>
            <p style={{ color: C.muted, fontSize: 14, lineHeight: 1.6 }}>
              Your letter of intent has been received. Someone from Grace Trace Ministries will
              follow up with you soon.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: C.bg, minHeight: "100vh", padding: "24px 16px 64px" }}>
      <div style={{ maxWidth: 620, margin: "0 auto" }}>
        <div style={{ textAlign: "center", padding: "8px 0 20px" }}>
          <h1 style={{ fontSize: 20, letterSpacing: 0.5, color: C.navy, margin: "0 0 4px" }}>
            GRACE TRACE MINISTRIES
          </h1>
          <p style={{ fontSize: 13, color: C.gold, fontStyle: "italic", margin: 0 }}>
            Transitional Housing &amp; Reentry Services
          </p>
        </div>
        <div style={{ height: 3, background: C.navy, margin: "16px 0 24px" }} />

        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: "24px 20px" }}>
          <p style={{ fontSize: 14, lineHeight: 1.6, margin: "0 0 8px", color: C.text }}>
            <strong>Letter of Intent to Partner</strong> — Transitional Housing Referral Relationship
          </p>
          <p style={{ fontSize: 13, color: C.muted, lineHeight: 1.6 }}>
            This confirms your organization's interest in referring individuals in need of
            transitional housing to Grace Trace Ministries (GTM), a Texas 501(c)(3) nonprofit.
            This is non-binding and helps GTM plan capacity and support funding efforts.
          </p>

          <h2 style={{ fontSize: 15, color: C.navy, marginTop: 24, borderTop: `1px solid ${C.border}`, paddingTop: 12 }}>
            Your organization
          </h2>

          <label style={labelStyle}>Partner organization name</label>
          <input style={fieldStyle} value={form.orgName} onChange={(e) => update("orgName", e.target.value)} placeholder="e.g. New Horizons Sober Living" />
          {errors.orgName && <div style={errorStyle}>{errors.orgName}</div>}

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div>
              <label style={labelStyle}>Contact name &amp; title</label>
              <input style={fieldStyle} value={form.contactName} onChange={(e) => update("contactName", e.target.value)} placeholder="e.g. Jane Smith, Program Director" />
              {errors.contactName && <div style={errorStyle}>{errors.contactName}</div>}
            </div>
            <div>
              <label style={labelStyle}>Phone or email</label>
              <input style={fieldStyle} value={form.contactInfo} onChange={(e) => update("contactInfo", e.target.value)} placeholder="e.g. (432) 555-0102" />
              {errors.contactInfo && <div style={errorStyle}>{errors.contactInfo}</div>}
            </div>
          </div>

          <label style={labelStyle}>City / location</label>
          <input style={fieldStyle} value={form.city} onChange={(e) => update("city", e.target.value)} placeholder="e.g. Odessa, TX" />
          {errors.city && <div style={errorStyle}>{errors.city}</div>}

          <h2 style={{ fontSize: 15, color: C.navy, marginTop: 24, borderTop: `1px solid ${C.border}`, paddingTop: 12 }}>
            Referral need
          </h2>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div>
              <label style={labelStyle}>Estimated referrals per month</label>
              <input style={fieldStyle} type="number" value={form.perMonth} onChange={(e) => update("perMonth", e.target.value)} placeholder="e.g. 4" />
            </div>
            <div>
              <label style={labelStyle}>Estimated referrals per year</label>
              <input style={fieldStyle} type="number" value={form.perYear} onChange={(e) => update("perYear", e.target.value)} placeholder="e.g. 40" />
            </div>
          </div>
          {errors.volume && <div style={errorStyle}>{errors.volume}</div>}

          <label style={labelStyle}>Who needs referral (gender, program type, length of stay, etc.)</label>
          <textarea
            style={{ ...fieldStyle, minHeight: 70, resize: "vertical" }}
            value={form.population}
            onChange={(e) => update("population", e.target.value)}
            placeholder="e.g. Men completing 90-day program, need 2-4 months of transitional housing"
          />

          <h2 style={{ fontSize: 15, color: C.navy, marginTop: 24, borderTop: `1px solid ${C.border}`, paddingTop: 12 }}>
            Intent to collaborate
          </h2>
          <p style={{ fontSize: 13, lineHeight: 1.6, color: C.text }}>
            By signing below, you confirm your organization's interest in working with GTM in
            good faith to establish a referral relationship as capacity becomes available, and
            understand this letter may be shared with funders and grant reviewers as evidence of
            community need.
          </p>

          <label style={labelStyle}>Type full name as signature</label>
          <input style={fieldStyle} value={form.signature} onChange={(e) => update("signature", e.target.value)} placeholder="Type your full name" />
          {errors.signature && <div style={errorStyle}>{errors.signature}</div>}

          <div style={{ display: "flex", gap: 10, alignItems: "flex-start", marginTop: 18, fontSize: 13, lineHeight: 1.5 }}>
            <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} style={{ marginTop: 3 }} />
            <label style={{ margin: 0, fontWeight: 400 }}>
              I confirm the information above is accurate and I am authorized to submit this on
              behalf of my organization.
            </label>
          </div>
          {errors.agree && <div style={errorStyle}>{errors.agree}</div>}

          <button
            onClick={handleSubmit}
            disabled={submitting}
            style={{
              width: "100%",
              background: C.navy,
              color: "#fff",
              border: "none",
              padding: 13,
              borderRadius: 6,
              fontSize: 15,
              fontWeight: 600,
              cursor: submitting ? "default" : "pointer",
              marginTop: 22,
              opacity: submitting ? 0.7 : 1,
            }}
          >
            {submitting ? "Submitting…" : "Submit letter of intent"}
          </button>
          <p style={{ textAlign: "center", fontSize: 11, color: C.muted, marginTop: 18 }}>
            Grace Trace Ministries · EIN 42-2972120 · gracetraceministries.org
          </p>
        </div>
      </div>
    </div>
  );
}


