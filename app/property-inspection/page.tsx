// @ts-nocheck
"use client";
import { useState, useEffect, useRef } from "react";

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
  success: "#4CAF50",
};

const ALLOWED = ["avy", "dennis", "travis"];

const WINGS = [
  "West Wing", "East Wing", "North Wing", "South Wing",
  "Central / Common Areas", "Exterior — North", "Exterior — South",
  "Exterior — East", "Exterior — West", "Roof", "Mechanical Room",
  "Basement", "Parking / Grounds", "General",
];

const ROOMS = [
  "Room 101","Room 102","Room 103","Room 104","Room 105","Room 106",
  "Room 107","Room 108","Room 109","Room 110","Room 111","Room 112",
  "Room 201","Room 202","Room 203","Room 204","Room 205","Room 206",
  "Room 207","Room 208","Room 209","Room 210","Room 211","Room 212",
  "Hallway A","Hallway B","Hallway C","Nurses Station","Common Lounge",
  "Dining Room","Commercial Kitchen","Laundry Room","Activity Room",
  "Chapel / Quiet Room","Administrator Office","Storage Room",
  "Utility Closet","Restroom","ADA Restroom","Stairwell","Elevator",
  "Boiler Room","Electrical Room","Loading Dock","Parking Lot","General Exterior",
];

const CHECKLIST = [
  {
    section: "Exterior",
    items: [
      { key: "ext_roof", label: "Roof — no visible leaks, missing shingles, or sagging" },
      { key: "ext_foundation", label: "Foundation — no major cracks or settling" },
      { key: "ext_gutters", label: "Gutters and downspouts — secure, draining properly" },
      { key: "ext_walls", label: "Exterior walls and siding — no cracks, spalling, rot" },
      { key: "ext_fascia", label: "Fascia and soffit — no gaps, rot, or pest entry points" },
      { key: "ext_windows", label: "Windows — open, close, lock properly from exterior" },
      { key: "ext_doors", label: "Exterior doors — close and lock securely" },
      { key: "ext_stairs", label: "Porch, stairs, and handrails — safe and structurally sound" },
      { key: "ext_parking", label: "Parking lot and driveway — no major damage or hazards" },
      { key: "ext_lighting", label: "Exterior lighting — operational" },
      { key: "ext_landscape", label: "Landscaping — maintained, no overgrowth against building" },
      { key: "ext_drainage", label: "No standing water or drainage issues on site" },
    ],
  },
  {
    section: "Interior",
    items: [
      { key: "int_walls", label: "Walls — free of major damage, holes, or water staining" },
      { key: "int_ceilings", label: "Ceilings — free of stains, water damage, or sagging tiles" },
      { key: "int_floors", label: "Floors — level, no trip hazards, good condition" },
      { key: "int_doors", label: "Interior doors — function properly, hardware intact" },
      { key: "int_windows", label: "Windows — intact, no broken glass" },
      { key: "int_odors", label: "No smoke odors, mold odors, or chemical smells" },
      { key: "int_mold", label: "No visible mold or mildew anywhere in building" },
      { key: "int_asbestos", label: "Asbestos risk — pipe insulation, ceiling tiles (note if pre-1980 materials present)" },
      { key: "int_lead", label: "Lead paint risk — note any deteriorating paint (pre-1978 buildings)" },
    ],
  },
  {
    section: "Electrical",
    items: [
      { key: "elec_lights", label: "All lights operate throughout building" },
      { key: "elec_outlets", label: "Electrical outlets — working and grounded" },
      { key: "elec_gfci", label: "GFCI outlets installed where required (bathrooms, kitchen, exterior)" },
      { key: "elec_panel", label: "Breaker panel — labeled, accessible, age and capacity noted" },
      { key: "elec_exposed", label: "No exposed wiring anywhere in building" },
      { key: "elec_generator", label: "Emergency generator — present, condition noted, fuel level" },
      { key: "elec_exit", label: "Exit and emergency lighting — operational at all points" },
      { key: "elec_nurse_call", label: "Nurse call / intercom wiring — condition noted" },
      { key: "elec_data", label: "Data and internet cabling infrastructure — present, condition noted" },
      { key: "elec_security", label: "Security and camera infrastructure — present, condition noted" },
    ],
  },
  {
    section: "Plumbing",
    items: [
      { key: "plumb_faucets", label: "Faucets — hot and cold water, operate properly" },
      { key: "plumb_toilets", label: "Toilets — flush correctly, no cracks or running" },
      { key: "plumb_showers", label: "Showers — function properly, drain clear" },
      { key: "plumb_water_heater", label: "Water heater — operational, age noted, capacity adequate" },
      { key: "plumb_leaks", label: "No visible leaks — under sinks, around toilets, pipe joints" },
      { key: "plumb_pressure", label: "Proper water pressure throughout building" },
      { key: "plumb_drains", label: "All drains flow properly — no slow drains or backups" },
      { key: "plumb_medical_gas", label: "Medical gas lines and oxygen infrastructure — condition noted (SNF)" },
    ],
  },
  {
    section: "HVAC",
    items: [
      { key: "hvac_ac", label: "Air conditioning — operates, cools adequately" },
      { key: "hvac_heat", label: "Heating — operates, heats adequately" },
      { key: "hvac_filters", label: "Air filters — clean, recently replaced" },
      { key: "hvac_vents", label: "Vents — unobstructed, no damage" },
      { key: "hvac_boiler", label: "Boiler and furnace — age noted, condition, working" },
      { key: "hvac_ducts", label: "Ductwork — no visible damage, leaks, or disconnections" },
    ],
  },
  {
    section: "Kitchen",
    items: [
      { key: "kit_fridge", label: "Refrigerator — working, temperature adequate" },
      { key: "kit_stove", label: "Stove and oven — operational, all burners work" },
      { key: "kit_microwave", label: "Microwave — operational" },
      { key: "kit_cabinets", label: "Cabinets — secure, hinges intact, no damage" },
      { key: "kit_counters", label: "Countertops — good condition, no damage" },
      { key: "kit_sink", label: "Sink — no leaks, drains properly" },
      { key: "kit_hood", label: "Range hood — operational, venting properly" },
      { key: "kit_suppression", label: "Commercial kitchen hood suppression system — present, tagged (if applicable)" },
    ],
  },
  {
    section: "Bathrooms",
    items: [
      { key: "bath_exhaust", label: "Exhaust fan — works, vents to exterior" },
      { key: "bath_mirrors", label: "Mirrors — intact, secure" },
      { key: "bath_grab_bars", label: "Grab bars — present and secure (ADA and SNF requirement)" },
      { key: "bath_tiles", label: "No loose tiles — floor or wall" },
      { key: "bath_caulk", label: "Caulking — good condition around tub, shower, and sink" },
    ],
  },
  {
    section: "Bedrooms",
    items: [
      { key: "bed_egress", label: "Windows provide emergency egress — opens fully, adequate size" },
      { key: "bed_closet", label: "Closet space — adequate, functional" },
      { key: "bed_doors", label: "Doors — lock where appropriate, privacy hardware works" },
      { key: "bed_lighting", label: "Lighting — sufficient, all fixtures working" },
      { key: "bed_dimensions", label: "Room dimensions — adequate for resident occupancy" },
    ],
  },
  {
    section: "Fire & Life Safety",
    items: [
      { key: "fire_smoke", label: "Smoke detectors — installed and tested in all required areas" },
      { key: "fire_co", label: "Carbon monoxide detectors — installed" },
      { key: "fire_extinguisher", label: "Fire extinguishers — present, charged, inspection tag current" },
      { key: "fire_sprinkler", label: "Sprinkler system — heads present, unobstructed, no damage" },
      { key: "fire_exits", label: "Emergency exits — clearly marked, unobstructed, hardware works" },
      { key: "fire_exit_lighting", label: "Exit lighting — operational at all exit points" },
      { key: "fire_first_aid", label: "First aid kit — available and stocked" },
    ],
  },
  {
    section: "Accessibility",
    items: [
      { key: "ada_entrance", label: "ADA entrances — ramps, level access where required" },
      { key: "ada_restroom", label: "Accessible restroom — present and functional" },
      { key: "ada_hallways", label: "Hallways — clear, minimum 36 inch width, handrails both sides" },
      { key: "ada_handrails", label: "Handrails — secure and at proper height throughout" },
      { key: "ada_elevator", label: "Elevator — present, inspection certificate current, operational" },
      { key: "ada_doorways", label: "Doorway widths — 36 inch minimum clearance" },
    ],
  },
  {
    section: "Cleanliness & Pest",
    items: [
      { key: "clean_general", label: "Facility generally clean throughout" },
      { key: "clean_pest", label: "No evidence of pest or rodent activity" },
      { key: "clean_trash", label: "Trash properly contained — no debris or dumping on site" },
      { key: "clean_laundry", label: "Laundry area — operational, venting intact" },
    ],
  },
  {
    section: "Documentation",
    items: [
      { key: "doc_photos", label: "Photos taken of all deficiencies" },
      { key: "doc_repairs", label: "All repairs needed documented with notes" },
      { key: "doc_costs", label: "Estimated repair costs noted where possible" },
      { key: "doc_hazards", label: "All immediate safety hazards identified and flagged" },
    ],
  },
];

const FLAG_OPTS = ["Good", "Concern", "Needs repair", "Unsafe", "Not present"];
const RATINGS = ["Excellent", "Good", "Fair", "Poor", "Unsafe for occupancy"];

const RATING_COLORS = {
  "Excellent": { bg: "#EAF3DE", color: "#27500A", border: "#3B6D11" },
  "Good": { bg: "#EAF3DE", color: "#27500A", border: "#3B6D11" },
  "Fair": { bg: "#FAEEDA", color: "#633806", border: "#854F0B" },
  "Poor": { bg: "#FAECE7", color: "#712B13", border: "#993C1D" },
  "Unsafe for occupancy": { bg: "#FCEBEB", color: "#791F1F", border: "#A32D2D" },
};

function FlagDot({ flag }) {
  const color = flag === "Good" ? "#3B6D11" : flag === "Concern" || flag === "Needs repair" ? "#D85A30" : flag === "Unsafe" ? "#A32D2D" : "#3D2028";
  return <span style={{ width: 8, height: 8, borderRadius: "50%", background: color, display: "inline-block", flexShrink: 0 }} />;
}

function NoteModal({ title, onConfirm, onCancel }) {
  const [val, setVal] = useState("");
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div style={{ background: C.card, border: "1px solid " + C.cardBorder, borderRadius: 12, padding: 24, width: "100%", maxWidth: 420 }}>
        <div style={{ color: C.text, fontWeight: 700, fontSize: 14, marginBottom: 10 }}>{title}</div>
        <textarea value={val} onChange={e => setVal(e.target.value)} autoFocus rows={4}
          placeholder="Add your note here..."
          style={{ width: "100%", background: C.dark, border: "1px solid " + C.cardBorder, borderRadius: 8, padding: "10px 12px", color: C.text, fontSize: 13, resize: "vertical", outline: "none", fontFamily: "inherit" }} />
        <div style={{ display: "flex", gap: 8, marginTop: 12, justifyContent: "flex-end" }}>
          <button onClick={onCancel} style={{ background: "transparent", border: "1px solid " + C.cardBorder, borderRadius: 8, padding: "8px 16px", color: C.muted, fontSize: 13, cursor: "pointer" }}>Cancel</button>
          <button onClick={() => onConfirm(val)} style={{ background: C.burgundy, border: "none", borderRadius: 8, padding: "8px 16px", color: C.ivory, fontSize: 13, fontWeight: 700, cursor: "pointer" }}>Save note</button>
        </div>
      </div>
    </div>
  );
}

export default function PropertyInspection() {
  const [currentUser, setCurrentUser] = useState(null);
  const [view, setView] = useState("mine"); // "mine" | "shared"
  const [wing, setWing] = useState("");
  const [roomArea, setRoomArea] = useState("");
  const [inspectionId, setInspectionId] = useState(null);
  const [itemStates, setItemStates] = useState({});
  const [rating, setRating] = useState("");
  const [generalNotes, setGeneralNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [allReports, setAllReports] = useState([]);
  const [myProgress, setMyProgress] = useState(0);
  const [otherProgress, setOtherProgress] = useState(0);
  const [sharedFlags, setSharedFlags] = useState([]);
  const [noteModal, setNoteModal] = useState(null); // { key, label }
  const [photoUploading, setPhotoUploading] = useState(false);
  const [activeSection, setActiveSection] = useState(null);
  const fileInputRef = useRef(null);
  const [activePhotoKey, setActivePhotoKey] = useState(null);

  useEffect(() => {
    try {
      const uid = localStorage.getItem("gtm_current_user");
      const active = localStorage.getItem("gtm_session_active");
      if (!uid || active !== "true" || !ALLOWED.includes(uid)) {
        window.location.href = "/";
        return;
      }
      const names = { avy: "Avrial Evans (Avy)", dennis: "Dennis", travis: "Travis Ramar" };
      setCurrentUser({ id: uid, name: names[uid] });
    } catch (e) { window.location.href = "/"; return; }
  }, []);

  useEffect(() => {
    if (currentUser) {
      loadAllReports();
    }
  }, [currentUser]);

  async function loadAllReports() {
    const r = await fetch("/api/property-inspection");
    const d = await r.json();
    const reports = d.reports || [];
    setAllReports(reports);

    const mine = reports.filter(r => r.inspector_id === currentUser.id);
    const others = reports.filter(r => r.inspector_id !== currentUser.id);

    // Calculate my progress
    if (mine.length > 0) {
      const latestMine = mine[0];
      setInspectionId(latestMine.id);
      setWing(latestMine.wing || "");
      setRoomArea(latestMine.room_area || "");
      setRating(latestMine.overall_rating || "");
      setGeneralNotes(latestMine.general_notes || "");
      // Load items
      const ir = await fetch("/api/property-inspection?id=" + latestMine.id);
      const id2 = await ir.json();
      const map = {};
      (id2.items || []).forEach(item => { map[item.item_key] = item; });
      setItemStates(map);
      const total = CHECKLIST.reduce((acc, s) => acc + s.items.length, 0);
      const done = (id2.items || []).filter(i => i.checked).length;
      setMyProgress(total ? Math.round((done / total) * 100) : 0);
    }

    // Other inspector progress
    if (others.length > 0) {
      const otherReport = others[0];
      const or = await fetch("/api/property-inspection?id=" + otherReport.id);
      const od = await or.json();
      const total = CHECKLIST.reduce((acc, s) => acc + s.items.length, 0);
      const done = (od.items || []).filter(i => i.checked).length;
      setOtherProgress(total ? Math.round((done / total) * 100) : 0);

      // Collect flags from both
      const flags = [];
      const allItems = [...(od.items || [])];
      if (mine.length > 0) {
        const mir = await fetch("/api/property-inspection?id=" + mine[0].id);
        const mid = await mir.json();
        allItems.push(...(mid.items || []).map(i => ({ ...i, _mine: true })));
      }
      allItems.filter(i => i.flag === "Concern" || i.flag === "Needs repair" || i.flag === "Unsafe").forEach(i => {
        flags.push({
          label: i.item_label,
          flag: i.flag,
          note: i.note,
          inspector: i._mine ? currentUser.name : otherReport.inspector_name,
          wing: i._mine ? mine[0]?.wing : otherReport.wing,
          room: i._mine ? mine[0]?.room_area : otherReport.room_area,
          time: i.checked_at ? new Date(i.checked_at).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }) : "",
        });
      });
      setSharedFlags(flags);
    }
  }

  async function getOrCreateInspection() {
    if (inspectionId) return inspectionId;
    const r = await fetch("/api/property-inspection", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ inspector_id: currentUser.id, inspector_name: currentUser.name, wing, room_area: roomArea }),
    });
    const d = await r.json();
    setInspectionId(d.report.id);
    return d.report.id;
  }

  async function toggleItem(section, item) {
    const current = itemStates[item.key];
    const newChecked = !current?.checked;

    // Update local state optimistically
    setItemStates(prev => ({ ...prev, [item.key]: { ...current, item_key: item.key, checked: newChecked, section } }));

    const id = await getOrCreateInspection();
    await fetch("/api/property-inspection", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, item: { section, item_key: item.key, item_label: item.label, checked: newChecked, flag: current?.flag, note: current?.note } }),
    });

    // Recalculate progress
    const total = CHECKLIST.reduce((acc, s) => acc + s.items.length, 0);
    const done = Object.values({ ...itemStates, [item.key]: { checked: newChecked } }).filter((i: any) => i.checked).length;
    setMyProgress(total ? Math.round((done / total) * 100) : 0);
  }

  async function saveFlag(itemKey, itemLabel, section, flag) {
    const current = itemStates[itemKey];
    setItemStates(prev => ({ ...prev, [itemKey]: { ...current, flag } }));
    const id = await getOrCreateInspection();
    await fetch("/api/property-inspection", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, item: { section, item_key: itemKey, item_label: itemLabel, checked: current?.checked || false, flag, note: current?.note } }),
    });
  }

  async function saveNote(itemKey, note) {
    const current = itemStates[itemKey];
    const section = noteModal?.section;
    const label = noteModal?.label;
    setItemStates(prev => ({ ...prev, [itemKey]: { ...current, note } }));
    setNoteModal(null);
    const id = await getOrCreateInspection();
    await fetch("/api/property-inspection", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, item: { section, item_key: itemKey, item_label: label, checked: current?.checked || false, flag: current?.flag, note } }),
    });
  }

  async function saveHeader() {
    setSaving(true);
    if (inspectionId) {
      await fetch("/api/property-inspection", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: inspectionId, wing, room_area: roomArea, overall_rating: rating, general_notes: generalNotes }),
      });
    } else {
      await getOrCreateInspection();
    }
    setSaving(false);
  }

  async function handlePhotoUpload(e, itemKey) {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoUploading(true);
    const reader = new FileReader();
    reader.onload = async (ev) => {
      const base64 = ev.target?.result as string;
      const id = await getOrCreateInspection();
      await fetch("/api/property-inspection-photos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ inspection_id: id, item_key: itemKey, inspector_id: currentUser.id, photo_data: base64, file_name: file.name }),
      });
      const current = itemStates[itemKey];
      setItemStates(prev => ({ ...prev, [itemKey]: { ...current, photo_count: (current?.photo_count || 0) + 1 } }));
      setPhotoUploading(false);
    };
    reader.readAsDataURL(file);
  }

  if (!currentUser) return <div style={{ background: C.dark, minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", color: C.muted }}>Loading...</div>;

  const totalItems = CHECKLIST.reduce((acc, s) => acc + s.items.length, 0);
  const checkedItems = Object.values(itemStates).filter((i: any) => i.checked).length;

  const otherInspector = allReports.find(r => r.inspector_id !== currentUser.id);
  const otherName = otherInspector?.inspector_name || (currentUser.id === "avy" ? "Dennis" : "Avy");

  return (
    <div style={{ minHeight: "100vh", background: C.dark, fontFamily: "'Inter','Segoe UI',sans-serif" }}>

      {noteModal && (
        <NoteModal
          title={"Note — " + noteModal.label}
          onConfirm={(note) => saveNote(noteModal.key, note)}
          onCancel={() => setNoteModal(null)}
        />
      )}

      <input type="file" ref={fileInputRef} accept="image/*" capture="environment" style={{ display: "none" }}
        onChange={e => handlePhotoUpload(e, activePhotoKey)} />

      {/* Header */}
      <div style={{ background: C.burgundyDark, borderBottom: "2px solid " + C.gold, padding: "14px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
        <div>
          <a href="/" style={{ color: C.muted, fontSize: 13, textDecoration: "none" }}>← Portal home</a>
          <div style={{ color: C.ivory, fontWeight: 800, fontSize: 16, marginTop: 2 }}>Property Inspection</div>
          <div style={{ color: C.gold, fontSize: 11 }}>Athens, TX — State Hwy 31 West · {currentUser.name}</div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {["mine", "shared"].map(v => (
            <button key={v} onClick={() => { setView(v); if (v === "shared") loadAllReports(); }}
              style={{ padding: "8px 16px", borderRadius: 8, border: "1px solid " + (view === v ? C.gold : C.cardBorder), background: view === v ? C.gold : C.card, color: view === v ? C.dark : C.muted, fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
              {v === "mine" ? "My report" : "Shared view"}
            </button>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: 800, margin: "0 auto", padding: "20px 16px" }}>

        {view === "mine" && (
          <>
            {/* Area selectors */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                <label style={{ fontSize: 10, fontWeight: 700, color: C.gold, textTransform: "uppercase", letterSpacing: 1 }}>Wing / Zone</label>
                <input type="text" list="wings-list" value={wing} onChange={e => setWing(e.target.value)} onBlur={saveHeader}
                  placeholder="e.g. West Wing, Exterior North..."
                  style={{ background: C.card, border: "1px solid " + C.cardBorder, borderRadius: 8, padding: "9px 12px", color: C.text, fontSize: 13, outline: "none", fontFamily: "inherit" }} />
                <datalist id="wings-list">{WINGS.map(w => <option key={w} value={w} />)}</datalist>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                <label style={{ fontSize: 10, fontWeight: 700, color: C.gold, textTransform: "uppercase", letterSpacing: 1 }}>Room / Specific Area</label>
                <input type="text" list="rooms-list" value={roomArea} onChange={e => setRoomArea(e.target.value)} onBlur={saveHeader}
                  placeholder="e.g. Room 101, Kitchen..."
                  style={{ background: C.card, border: "1px solid " + C.cardBorder, borderRadius: 8, padding: "9px 12px", color: C.text, fontSize: 13, outline: "none", fontFamily: "inherit" }} />
                <datalist id="rooms-list">{ROOMS.map(r => <option key={r} value={r} />)}</datalist>
              </div>
            </div>

            {/* Progress */}
            <div style={{ background: C.card, border: "1px solid " + C.cardBorder, borderRadius: 12, padding: "14px 16px", marginBottom: 14 }}>
              {[
                { label: "My progress", pct: myProgress, color: C.burgundyDark },
                { label: otherName, pct: otherProgress, color: C.green },
              ].map(p => (
                <div key={p.label} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 7 }}>
                  <span style={{ fontSize: 12, color: C.muted, width: 90, flexShrink: 0 }}>{p.label}</span>
                  <div style={{ flex: 1, background: C.dark, borderRadius: 4, height: 7, overflow: "hidden" }}>
                    <div style={{ background: p.color, height: 7, borderRadius: 4, width: p.pct + "%", transition: "width 0.3s" }} />
                  </div>
                  <span style={{ color: C.text, fontSize: 12, fontWeight: 700, width: 32, textAlign: "right" }}>{p.pct}%</span>
                </div>
              ))}
              <div style={{ color: C.muted, fontSize: 12, marginTop: 4 }}>{checkedItems} of {totalItems} items checked</div>
            </div>

            {/* Checklist sections */}
            {CHECKLIST.map(sec => (
              <div key={sec.section} style={{ background: C.card, border: "1px solid " + C.cardBorder, borderRadius: 12, padding: "12px 16px", marginBottom: 10 }}>
                <button onClick={() => setActiveSection(activeSection === sec.section ? null : sec.section)}
                  style={{ width: "100%", background: "transparent", border: "none", display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer", padding: 0 }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: C.gold, textTransform: "uppercase", letterSpacing: 1 }}>{sec.section}</span>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 11, color: C.muted }}>
                      {sec.items.filter(i => itemStates[i.key]?.checked).length}/{sec.items.length}
                    </span>
                    <span style={{ color: C.gold, fontSize: 16 }}>{activeSection === sec.section ? "▲" : "▼"}</span>
                  </div>
                </button>

                {(activeSection === sec.section || activeSection === null) && (
                  <div style={{ marginTop: 10 }}>
                    {sec.items.map(item => {
                      const state = itemStates[item.key] || {};
                      return (
                        <div key={item.key} style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "8px 0", borderBottom: "1px solid " + C.cardBorder }}>
                          <input type="checkbox" checked={!!state.checked} onChange={() => toggleItem(sec.section, item)}
                            style={{ width: 15, height: 15, flexShrink: 0, marginTop: 2, accentColor: C.green, cursor: "pointer" }} />
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: 13, color: state.checked ? C.muted : C.text, textDecoration: state.checked ? "line-through" : "none", lineHeight: 1.4 }}>
                              {item.label}
                            </div>
                            {state.note && (
                              <div style={{ fontSize: 11, color: C.gold, marginTop: 3, fontStyle: "italic" }}>Note: {state.note}</div>
                            )}
                          </div>
                          <div style={{ display: "flex", gap: 5, alignItems: "center", flexShrink: 0, flexWrap: "wrap" }}>
                            {state.flag && <FlagDot flag={state.flag} />}
                            <select value={state.flag || ""} onChange={e => saveFlag(item.key, item.label, sec.section, e.target.value)}
                              style={{ fontSize: 11, padding: "3px 6px", borderRadius: 6, border: "1px solid " + C.cardBorder, background: C.dark, color: C.text, fontFamily: "inherit", cursor: "pointer" }}>
                              <option value="">Flag</option>
                              {FLAG_OPTS.map(f => <option key={f} value={f}>{f}</option>)}
                            </select>
                            <button onClick={() => setNoteModal({ key: item.key, label: item.label, section: sec.section })}
                              style={{ fontSize: 11, padding: "3px 8px", borderRadius: 6, border: "1px solid " + C.cardBorder, background: C.dark, color: C.muted, cursor: "pointer" }}>
                              Note
                            </button>
                            <button onClick={() => { setActivePhotoKey(item.key); fileInputRef.current?.click(); }}
                              style={{ fontSize: 11, padding: "3px 8px", borderRadius: 6, border: "1px solid " + C.cardBorder, background: C.dark, color: C.muted, cursor: "pointer", display: "flex", alignItems: "center", gap: 3 }}>
                              📷 {state.photo_count > 0 && <span style={{ background: C.gold, color: C.dark, fontSize: 10, fontWeight: 700, padding: "1px 5px", borderRadius: 8 }}>{state.photo_count}</span>}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}

            {/* Overall rating */}
            <div style={{ background: C.card, border: "1px solid " + C.cardBorder, borderRadius: 12, padding: "14px 16px", marginBottom: 10 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: C.gold, textTransform: "uppercase", letterSpacing: 1, marginBottom: 10 }}>Overall inspection rating</div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {RATINGS.map(r => {
                  const rc = RATING_COLORS[r];
                  const sel = rating === r;
                  return (
                    <button key={r} onClick={() => { setRating(r); saveHeader(); }}
                      style={{ padding: "8px 14px", borderRadius: 8, border: "1px solid " + (sel ? rc.border : C.cardBorder), background: sel ? rc.bg : C.dark, color: sel ? rc.color : C.text, fontSize: 13, fontWeight: sel ? 700 : 400, cursor: "pointer" }}>
                      {r}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* General notes */}
            <div style={{ background: C.card, border: "1px solid " + C.cardBorder, borderRadius: 12, padding: "14px 16px", marginBottom: 14 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: C.gold, textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>General notes for this area</div>
              <textarea value={generalNotes} onChange={e => setGeneralNotes(e.target.value)} onBlur={saveHeader}
                placeholder="Add any additional notes, observations, or concerns for this area..."
                rows={4}
                style={{ width: "100%", background: C.dark, border: "1px solid " + C.cardBorder, borderRadius: 8, padding: "10px 12px", color: C.text, fontSize: 13, resize: "vertical", outline: "none", fontFamily: "inherit", lineHeight: 1.6 }} />
            </div>

            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <button onClick={saveHeader} style={{ background: C.burgundyDark, border: "none", borderRadius: 8, padding: "11px 20px", color: C.ivory, fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
                {saving ? "Saving..." : "Save this area"}
              </button>
              <button onClick={() => { setWing(""); setRoomArea(""); setRating(""); setGeneralNotes(""); setInspectionId(null); setItemStates({}); }}
                style={{ background: C.green, border: "none", borderRadius: 8, padding: "11px 20px", color: C.ivory, fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
                Start new area
              </button>
              <button onClick={() => { setView("shared"); loadAllReports(); }}
                style={{ background: C.card, border: "1px solid " + C.cardBorder, borderRadius: 8, padding: "11px 16px", color: C.muted, fontSize: 13, cursor: "pointer" }}>
                View shared report
              </button>
            </div>
          </>
        )}

        {view === "shared" && (
          <>
            {/* Progress both */}
            <div style={{ background: C.card, border: "1px solid " + C.cardBorder, borderRadius: 12, padding: "14px 16px", marginBottom: 14 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: C.gold, textTransform: "uppercase", letterSpacing: 1, marginBottom: 10 }}>Inspection progress — both inspectors</div>
              {[
                { label: "Avy Evans", pct: currentUser.id === "avy" ? myProgress : otherProgress, color: C.burgundyDark },
                { label: "Dennis", pct: currentUser.id === "dennis" ? myProgress : otherProgress, color: C.green },
              ].map(p => (
                <div key={p.label} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                  <span style={{ fontSize: 12, color: C.muted, width: 100, flexShrink: 0 }}>{p.label}</span>
                  <div style={{ flex: 1, background: C.dark, borderRadius: 4, height: 7, overflow: "hidden" }}>
                    <div style={{ background: p.color, height: 7, borderRadius: 4, width: p.pct + "%", transition: "width 0.3s" }} />
                  </div>
                  <span style={{ color: C.text, fontSize: 12, fontWeight: 700, width: 32, textAlign: "right" }}>{p.pct}%</span>
                </div>
              ))}
            </div>

            {/* Both inspector panels */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 14 }}>
              {allReports.slice(0, 2).map(report => (
                <div key={report.id} style={{ background: C.card, border: "1px solid " + C.cardBorder, borderRadius: 12, padding: "14px 16px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12, paddingBottom: 10, borderBottom: "1px solid " + C.cardBorder }}>
                    <div style={{ width: 36, height: 36, borderRadius: "50%", background: report.inspector_id === "avy" ? C.burgundyDark : C.green, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: C.ivory, flexShrink: 0 }}>
                      {report.inspector_name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                    </div>
                    <div>
                      <div style={{ color: C.text, fontWeight: 700, fontSize: 13 }}>{report.inspector_name}</div>
                      <div style={{ color: C.muted, fontSize: 11, marginTop: 2 }}>{report.wing || "—"} · {report.room_area || "—"}</div>
                    </div>
                  </div>
                  {report.overall_rating && (
                    <div style={{ marginBottom: 8 }}>
                      <span style={{ fontSize: 11, color: C.muted }}>Rating: </span>
                      <span style={{ fontSize: 12, fontWeight: 700, color: RATING_COLORS[report.overall_rating]?.color || C.text }}>
                        {report.overall_rating}
                      </span>
                    </div>
                  )}
                  {report.general_notes && (
                    <div style={{ fontSize: 12, color: C.muted, fontStyle: "italic", marginBottom: 8 }}>"{report.general_notes}"</div>
                  )}
                  <div style={{ fontSize: 11, color: C.muted }}>Last updated: {new Date(report.updated_at).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}</div>
                </div>
              ))}
            </div>

            {/* Flagged concerns */}
            {sharedFlags.length > 0 && (
              <div style={{ background: C.card, border: "1px solid " + C.cardBorder, borderRadius: 12, padding: "14px 16px", marginBottom: 14 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#D85A30", textTransform: "uppercase", letterSpacing: 1, marginBottom: 10 }}>
                  ⚠️ Flagged concerns — both reports ({sharedFlags.length})
                </div>
                {sharedFlags.map((f, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "8px 0", borderBottom: i < sharedFlags.length - 1 ? "1px solid " + C.cardBorder : "none" }}>
                    <FlagDot flag={f.flag} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, color: C.text }}>{f.wing && f.room ? f.wing + " — " + f.room + " — " : ""}{f.label}</div>
                      <div style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>
                        {f.inspector}{f.time ? " · " + f.time : ""} · {f.flag}
                        {f.note && <span> · "{f.note}"</span>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {sharedFlags.length === 0 && (
              <div style={{ background: C.card, border: "1px solid " + C.cardBorder, borderRadius: 12, padding: "20px", marginBottom: 14, textAlign: "center", color: C.muted, fontSize: 14 }}>
                No concerns flagged yet — flags will appear here as both inspectors work through the checklist.
              </div>
            )}

            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => setView("mine")} style={{ background: C.burgundyDark, border: "none", borderRadius: 8, padding: "11px 20px", color: C.ivory, fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
                Back to my report
              </button>
              <button onClick={loadAllReports} style={{ background: C.card, border: "1px solid " + C.cardBorder, borderRadius: 8, padding: "11px 16px", color: C.muted, fontSize: 13, cursor: "pointer" }}>
                ↻ Refresh
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}