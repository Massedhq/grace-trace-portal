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
  const [showMyAreas, setShowMyAreas] = useState(false);
  const [myAreas, setMyAreas] = useState([]);
  const [sharedReportData, setSharedReportData] = useState([]);
  const [lightboxPhoto, setLightboxPhoto] = useState(null);
  const [myPhotos, setMyPhotos] = useState({});

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

  async function loadMyAreas() {
    const r = await fetch("/api/property-inspection");
    const d = await r.json();
    setMyAreas(d.reports || []);
  }

  async function loadAllReports() {
    try {
      const r = await fetch("/api/property-inspection");
      const d = await r.json();
      const reports = d.reports || [];
      setAllReports(reports);
      setMyAreas(reports);

      const total = CHECKLIST.reduce((acc, s) => acc + s.items.length, 0);
      const mine = reports.filter(rep => rep.inspector_id === currentUser.id);
      const others = reports.filter(rep => rep.inspector_id !== currentUser.id);

      // Load my most recent report items and photos
      if (mine.length > 0) {
        const latestMine = mine[0];
        setInspectionId(latestMine.id);
        setWing(latestMine.wing || "");
        setRoomArea(latestMine.room_area || "");
        setRating(latestMine.overall_rating || "");
        setGeneralNotes(latestMine.general_notes || "");
        const ir = await fetch("/api/property-inspection?id=" + latestMine.id);
        const id2 = await ir.json();
        const map = {};
        (id2.items || []).forEach(item => { map[item.item_key] = item; });
        setItemStates(map);
        const done = (id2.items || []).filter(i => i.checked).length;
        setMyProgress(total ? Math.round((done / total) * 100) : 0);
        const pr = await fetch("/api/property-inspection-photos?inspection_id=" + latestMine.id);
        const pd = await pr.json();
        const photoMap = {};
        (pd.photos || []).forEach(p => {
          if (!photoMap[p.item_key]) photoMap[p.item_key] = [];
          photoMap[p.item_key].push(p);
        });
        setMyPhotos(photoMap);
      }

      // Build shared view data — load items and photos for each report
      const sharedData = [];
      for (const report of reports) {
        try {
          const ir = await fetch("/api/property-inspection?id=" + report.id);
          const id2 = await ir.json();
          const pr = await fetch("/api/property-inspection-photos?inspection_id=" + report.id);
          const pd = await pr.json();
          const photoMap = {};
          (pd.photos || []).forEach(p => {
            if (!photoMap[p.item_key]) photoMap[p.item_key] = [];
            photoMap[p.item_key].push(p);
          });
          const itemMap = {};
          (id2.items || []).forEach(i => { itemMap[i.item_key] = i; });
          const done = (id2.items || []).filter(i => i.checked).length;
          sharedData.push({ report, items: itemMap, photos: photoMap, progress: total ? Math.round((done / total) * 100) : 0 });
        } catch (e) {
          console.error("Failed to load report", report.id, e);
        }
      }
      setSharedReportData(sharedData);

      // Other inspector progress
      if (others.length > 0) {
        const otherData = sharedData.find(sd => sd.report.inspector_id !== currentUser.id);
        setOtherProgress(otherData?.progress || 0);
      }

      // Build flags
      const flags = [];
      sharedData.forEach(({ report, items }) => {
        Object.values(items).forEach((i: any) => {
          if (i.flag === "Concern" || i.flag === "Needs repair" || i.flag === "Unsafe") {
            flags.push({
              label: i.item_label, flag: i.flag, note: i.note,
              inspector: report.inspector_name, wing: report.wing, room: report.room_area,
              time: i.checked_at ? new Date(i.checked_at).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }) : "",
            });
          }
        });
      });
      setSharedFlags(flags);
    } catch (err) {
      console.error("loadAllReports failed:", err);
    }
  }

  async function getOrCreateInspection() {
    // If a report is already loaded (including someone else's), use it
    if (inspectionId) return inspectionId;
    // Otherwise create a new one under the current user
    const r = await fetch("/api/property-inspection", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ inspector_id: currentUser.id, inspector_name: currentUser.name, wing, room_area: roomArea }),
    });
    const d = await r.json();
    setInspectionId(d.report.id);
    const r2 = await fetch("/api/property-inspection");
    const d2 = await r2.json();
    setMyAreas(d2.reports || []);
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
    // Capture everything before clearing modal
    const current = itemStates[itemKey];
    const section = noteModal?.section;
    const label = noteModal?.label;
    const flag = current?.flag;
    const checked = current?.checked || false;
    // Update local state immediately
    setItemStates(prev => ({ ...prev, [itemKey]: { ...(prev[itemKey] || {}), note } }));
    setNoteModal(null);
    // Save to database
    const id = await getOrCreateInspection();
    await fetch("/api/property-inspection", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, item: { section: section || "General", item_key: itemKey, item_label: label || itemKey, checked, flag, note } }),
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
    // Refresh areas list
    const r2 = await fetch("/api/property-inspection");
    const d2 = await r2.json();
    setMyAreas(d2.reports || []);
  }

  async function handlePhotoUpload(e, itemKey) {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setPhotoUploading(true);

    const id = await getOrCreateInspection();

    for (const file of files) {
      await new Promise<void>((resolve) => {
        const reader = new FileReader();
        reader.onload = async (ev) => {
          const base64 = ev.target?.result as string;
          const res = await fetch("/api/property-inspection-photos", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ inspection_id: id, item_key: itemKey, inspector_id: currentUser.id, photo_data: base64, file_name: file.name }),
          });
          const resData = await res.json();
          setItemStates(prev => ({
            ...prev,
            [itemKey]: { ...(prev[itemKey] || {}), photo_count: (prev[itemKey]?.photo_count || 0) + 1 }
          }));
          setMyPhotos(prev => {
            const existing = prev[itemKey] || [];
            return { ...prev, [itemKey]: [...existing, { ...(resData.photo || {}), photo_data: base64 }] };
          });
          resolve();
        };
        reader.readAsDataURL(file);
      });
    }

    // Always reset input so more photos can be added immediately
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    setPhotoUploading(false);
  }

  function generatePDF() {
    const date = new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" });
    let html = `<!DOCTYPE html><html><head><meta charset="UTF-8">
    <title>Grace Trace Ministries — Property Inspection Report</title>
    <style>
      body { font-family: Arial, sans-serif; max-width: 900px; margin: 0 auto; padding: 32px; color: #1A0F12; }
      h1 { color: #4A0E1A; font-size: 24px; margin-bottom: 4px; }
      h2 { color: #4A0E1A; font-size: 16px; margin: 24px 0 8px; border-bottom: 2px solid #4A0E1A; padding-bottom: 4px; }
      h3 { color: #1E4D2B; font-size: 13px; margin: 16px 0 6px; }
      .sub { color: #A08878; font-size: 13px; margin-bottom: 24px; }
      .inspector-card { display: inline-block; background: #F5F0E8; border: 1px solid #D4C8B8; padding: 14px 20px; margin: 8px 8px 8px 0; border-radius: 8px; vertical-align: top; width: 43%; }
      .inspector-card h3 { margin: 0 0 6px; color: #4A0E1A; }
      .rating { display: inline-block; padding: 2px 10px; border-radius: 10px; font-size: 12px; font-weight: bold; }
      .rating-Excellent,.rating-Good { background: #EAF3DE; color: #27500A; }
      .rating-Fair { background: #FAEEDA; color: #633806; }
      .rating-Poor { background: #FAECE7; color: #712B13; }
      .rating-Unsafeforoccupancy { background: #FCEBEB; color: #791F1F; }
      .section { margin-bottom: 16px; }
      .item { display: flex; align-items: flex-start; gap: 10px; padding: 5px 0; border-bottom: 1px solid #EEE; font-size: 13px; }
      .check { width: 16px; height: 16px; flex-shrink: 0; margin-top: 1px; }
      .item-label { flex: 1; }
      .item-label.done { text-decoration: line-through; color: #999; }
      .flag { display: inline-block; font-size: 11px; font-weight: bold; padding: 1px 8px; border-radius: 8px; margin-left: 6px; }
      .flag-Good { background: #EAF3DE; color: #27500A; }
      .flag-Concern,.flag-Needsrepair { background: #FAECE7; color: #712B13; }
      .flag-Unsafe { background: #FCEBEB; color: #791F1F; }
      .note { font-style: italic; color: #C9A84C; font-size: 12px; margin-top: 2px; }
      .inspector-tag { font-size: 11px; font-weight: bold; padding: 1px 7px; border-radius: 8px; margin-right: 4px; }
      .tag-avy { background: #F5E6EC; color: #4A0E1A; }
      .tag-dennis { background: #E6F0E9; color: #1E4D2B; }
      .concerns { background: #FFF3EE; border: 2px solid #D85A30; padding: 16px; border-radius: 8px; margin: 24px 0; }
      .concern-item { padding: 6px 0; border-bottom: 1px solid #F0C4B0; font-size: 13px; }
      .concern-item:last-child { border-bottom: none; }
      .photos { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 6px; }
      .photo-thumb { width: 80px; height: 80px; object-fit: cover; border-radius: 4px; border: 1px solid #DDD; }
      .no-data { color: #999; font-style: italic; font-size: 13px; }
      @media print { body { padding: 16px; } button { display: none; } }
    </style></head><body>`;

    html += `<h1>Grace Trace Ministries</h1>
    <div class="sub">Property Inspection Report &mdash; Athens, TX &middot; State Hwy 31 West &middot; ${date}</div>`;

    // Inspector summary cards
    html += `<div style="margin-bottom:24px">`;
    sharedReportData.forEach(({ report, progress }) => {
      const ratingClass = (report.overall_rating || "").replace(/[^a-zA-Z]/g, "");
      html += `<div class="inspector-card">
        <h3>${report.inspector_name}</h3>
        <div style="font-size:12px;color:#666;margin-bottom:6px">${report.wing || "Area not set"} &middot; ${report.room_area || "Room not set"}</div>
        <div style="font-size:12px;margin-bottom:4px">Progress: <strong>${progress}%</strong></div>
        ${report.overall_rating ? `<div>Rating: <span class="rating rating-${ratingClass}">${report.overall_rating}</span></div>` : ""}
        ${report.general_notes ? `<div style="font-size:12px;color:#666;margin-top:6px;font-style:italic">"${report.general_notes}"</div>` : ""}
      </div>`;
    });
    html += `</div>`;

    // Flagged concerns summary
    if (sharedFlags.length > 0) {
      html += `<div class="concerns"><h2 style="color:#D85A30;border-color:#D85A30;margin-top:0">&#9888; Flagged Concerns (${sharedFlags.length})</h2>`;
      sharedFlags.forEach(f => {
        html += `<div class="concern-item">
          <strong>${f.wing ? f.wing + (f.room ? " &mdash; " + f.room + " &mdash; " : " &mdash; ") : ""}${f.label}</strong><br>
          <span style="font-size:12px;color:#666">${f.inspector}${f.time ? " &middot; " + f.time : ""} &middot; ${f.flag}</span>
          ${f.note ? `<br><span style="font-style:italic;color:#C9A84C">"${f.note}"</span>` : ""}
        </div>`;
      });
      html += `</div>`;
    }

    // Full checklist
    CHECKLIST.forEach(sec => {
      html += `<div class="section"><h2>${sec.section}</h2>`;
      sec.items.forEach(item => {
        const inspectorData = sharedReportData.map(({ report, items, photos }) => ({
          report, item: items[item.key], photos: photos[item.key] || []
        })).filter(d => d.item || d.photos.length > 0);

        const anyChecked = inspectorData.some(d => d.item?.checked);
        html += `<div class="item">
          <input type="checkbox" class="check" ${anyChecked ? "checked" : ""} disabled>
          <div class="item-label ${anyChecked ? "done" : ""}">${item.label}`;

        inspectorData.forEach(({ report, item: itm, photos }) => {
          if (!itm && photos.length === 0) return;
          const tagClass = report.inspector_id === "avy" ? "tag-avy" : "tag-dennis";
          html += `<div style="margin-top:4px">
            <span class="inspector-tag ${tagClass}">${report.inspector_name.split(" ")[0]}</span>`;
          if (itm?.checked) html += `<span style="color:#3B6D11;font-size:11px">&#10003; Checked</span>`;
          if (itm?.flag) {
            const fc = (itm.flag || "").replace(/[^a-zA-Z]/g, "");
            html += `<span class="flag flag-${fc}">${itm.flag}</span>`;
          }
          if (itm?.note) html += `<div class="note">"${itm.note}"</div>`;
          if (photos.length > 0) {
            html += `<div class="photos">`;
            photos.forEach(p => {
              if (p.photo_data) html += `<img src="${p.photo_data}" class="photo-thumb" alt="Inspection photo">`;
            });
            html += `</div>`;
          }
          html += `</div>`;
        });

        html += `</div></div>`;
      });
      html += `</div>`;
    });

    html += `<div style="margin-top:32px;font-size:11px;color:#999;border-top:1px solid #EEE;padding-top:12px">
      Generated by Grace Trace Ministries Staff Portal &middot; ${date} &middot; Confidential — Internal Use Only
    </div></body></html>`;

    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const win = window.open(url, "_blank");
    if (win) {
      win.onload = () => { win.print(); };
    }
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

      <input type="file" ref={fileInputRef} accept="image/*" multiple style={{ display: "none" }}
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
            {/* Lightbox for my report */}
            {lightboxPhoto && (
              <div onClick={() => setLightboxPhoto(null)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.92)", zIndex: 300, display: "flex", alignItems: "center", justifyContent: "center", padding: 20, cursor: "pointer" }}>
                <img src={lightboxPhoto} alt="Inspection photo" style={{ maxWidth: "100%", maxHeight: "90vh", borderRadius: 8, objectFit: "contain" }} />
                <div style={{ position: "absolute", top: 20, right: 20, color: "#fff", fontSize: 28, cursor: "pointer" }}>✕</div>
              </div>
            )}
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
                            {myPhotos[item.key]?.length > 0 && (
                              <div style={{ display: "flex", gap: 5, flexWrap: "wrap", marginTop: 5 }}>
                                {myPhotos[item.key].map((photo, pi) => (
                                  <div key={pi} onClick={() => setLightboxPhoto(photo.photo_data)}
                                    style={{ width: 48, height: 48, borderRadius: 5, overflow: "hidden", border: "1px solid " + C.cardBorder, cursor: "pointer", flexShrink: 0 }}>
                                    <img src={photo.photo_data} alt={"Photo " + (pi+1)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                  </div>
                                ))}
                              </div>
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
                            <button onClick={() => {
                                setActivePhotoKey(item.key);
                                // Force reset then click so multiple uploads work
                                if (fileInputRef.current) {
                                  fileInputRef.current.value = "";
                                  setTimeout(() => fileInputRef.current?.click(), 50);
                                }
                              }}
                              style={{ fontSize: 11, padding: "3px 8px", borderRadius: 6, border: "1px solid " + C.gold, background: C.dark, color: C.gold, cursor: "pointer", display: "flex", alignItems: "center", gap: 4, fontWeight: 600 }}>
                              📷 {(myPhotos[item.key]?.length || 0) > 0
                                ? <span>+Add · <span style={{ background: C.gold, color: C.dark, fontSize: 10, fontWeight: 700, padding: "1px 5px", borderRadius: 8 }}>{myPhotos[item.key]?.length}</span></span>
                                : "Add photos"}
                              {photoUploading && activePhotoKey === item.key && <span style={{ fontSize: 10, color: C.muted }}>Uploading...</span>}
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
              <button onClick={() => { setWing(""); setRoomArea(""); setRating(""); setGeneralNotes(""); setInspectionId(null); setItemStates({}); setMyPhotos({}); }}
                style={{ background: C.green, border: "none", borderRadius: 8, padding: "11px 20px", color: C.ivory, fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
                + Start new area
              </button>
              <button onClick={() => setShowMyAreas(!showMyAreas)}
                style={{ background: C.card, border: "1px solid " + C.gold, borderRadius: 8, padding: "11px 16px", color: C.gold, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
                📋 All saved areas ({myAreas.length})
              </button>
              <button onClick={() => { setView("shared"); loadAllReports(); }}
                style={{ background: C.card, border: "1px solid " + C.cardBorder, borderRadius: 8, padding: "11px 16px", color: C.muted, fontSize: 13, cursor: "pointer" }}>
                View shared report
              </button>
            </div>
            {showMyAreas && (
              <div style={{ background: C.card, border: "1px solid " + C.gold, borderRadius: 12, padding: "14px 16px", marginTop: 14 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: C.gold, textTransform: "uppercase", letterSpacing: 1, marginBottom: 10 }}>
                  All saved areas — tap any to load and add photos or notes
                </div>
                {myAreas.length === 0 && (
                  <div style={{ color: C.muted, fontSize: 13 }}>No saved areas yet.</div>
                )}
                {myAreas.map(report => (
                  <div key={report.id}
                    onClick={async () => {
                      setInspectionId(report.id);
                      setWing(report.wing || "");
                      setRoomArea(report.room_area || "");
                      setRating(report.overall_rating || "");
                      setGeneralNotes(report.general_notes || "");
                      // Load all items for this report
                      const ir = await fetch("/api/property-inspection?id=" + report.id);
                      const id2 = await ir.json();
                      const map = {};
                      (id2.items || []).forEach(item => { map[item.item_key] = item; });
                      setItemStates(map);
                      // Load all photos for this report
                      const pr = await fetch("/api/property-inspection-photos?inspection_id=" + report.id);
                      const pd = await pr.json();
                      const photoMap = {};
                      (pd.photos || []).forEach(p => {
                        if (!photoMap[p.item_key]) photoMap[p.item_key] = [];
                        photoMap[p.item_key].push(p);
                      });
                      setMyPhotos(photoMap);
                      setShowMyAreas(false);
                      // Recalculate progress
                      const total = CHECKLIST.reduce((acc, s) => acc + s.items.length, 0);
                      const done = (id2.items || []).filter(i => i.checked).length;
                      setMyProgress(total ? Math.round((done / total) * 100) : 0);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 12px", background: inspectionId === report.id ? "#2A1A0A" : C.dark, border: "1px solid " + (inspectionId === report.id ? C.gold : C.cardBorder), borderRadius: 8, marginBottom: 8, cursor: "pointer" }}
                    onMouseEnter={e => e.currentTarget.style.borderColor = C.gold}
                    onMouseLeave={e => { if (inspectionId !== report.id) e.currentTarget.style.borderColor = C.cardBorder; }}>
                    <div>
                      <div style={{ color: C.text, fontWeight: 600, fontSize: 13 }}>{report.wing || "No wing set"} — {report.room_area || "No room set"}</div>
                      <div style={{ color: C.muted, fontSize: 11, marginTop: 2 }}>
                        <span style={{ color: report.inspector_id === "avy" ? "#C9A84C" : "#4CAF50", fontWeight: 700 }}>{report.inspector_name}</span>
                        {" · "}{report.overall_rating || "No rating"} · {new Date(report.updated_at).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}
                      </div>
                    </div>
                    {inspectionId === report.id
                      ? <span style={{ color: C.gold, fontSize: 12, fontWeight: 700 }}>Active ✓</span>
                      : <span style={{ color: C.muted, fontSize: 13 }}>Open →</span>
                    }
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {view === "shared" && (
          <>
            {/* Lightbox */}
            {lightboxPhoto && (
              <div onClick={() => setLightboxPhoto(null)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.92)", zIndex: 300, display: "flex", alignItems: "center", justifyContent: "center", padding: 20, cursor: "pointer" }}>
                <img src={lightboxPhoto} alt="Inspection photo" style={{ maxWidth: "100%", maxHeight: "90vh", borderRadius: 8, objectFit: "contain" }} />
                <div style={{ position: "absolute", top: 20, right: 20, color: "#fff", fontSize: 28, cursor: "pointer" }}>✕</div>
              </div>
            )}

            {/* Progress */}
            <div style={{ background: C.card, border: "1px solid " + C.cardBorder, borderRadius: 12, padding: "14px 16px", marginBottom: 14 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: C.gold, textTransform: "uppercase", letterSpacing: 1, marginBottom: 10 }}>Combined inspection — Athens TX · State Hwy 31 West</div>
              {sharedReportData.map(({ report, progress }) => (
                <div key={report.id} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                  <span style={{ fontSize: 12, color: C.muted, width: 110, flexShrink: 0 }}>{report.inspector_name.split(" ")[0]}</span>
                  <div style={{ flex: 1, background: C.dark, borderRadius: 4, height: 7, overflow: "hidden" }}>
                    <div style={{ background: report.inspector_id === "avy" ? C.burgundyDark : C.green, height: 7, borderRadius: 4, width: progress + "%", transition: "width 0.3s" }} />
                  </div>
                  <span style={{ color: C.text, fontSize: 12, fontWeight: 700, width: 32, textAlign: "right" }}>{progress}%</span>
                </div>
              ))}
            </div>

            {/* Inspector summary cards */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 14 }}>
              {sharedReportData.map(({ report }) => (
                <div key={report.id} style={{ background: C.card, border: "1px solid " + C.cardBorder, borderRadius: 12, padding: "14px 16px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10, paddingBottom: 10, borderBottom: "1px solid " + C.cardBorder }}>
                    <div style={{ width: 36, height: 36, borderRadius: "50%", background: report.inspector_id === "avy" ? C.burgundyDark : C.green, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: C.ivory, flexShrink: 0 }}>
                      {(report.inspector_name || "?").split(" ").map(n => n[0]).join("").slice(0, 2)}
                    </div>
                    <div>
                      <div style={{ color: C.text, fontWeight: 700, fontSize: 13 }}>{report.inspector_name}</div>
                      <div style={{ color: C.muted, fontSize: 11, marginTop: 2 }}>{report.wing || "Area not set"} · {report.room_area || "Room not set"}</div>
                    </div>
                  </div>
                  {report.overall_rating && (
                    <div style={{ marginBottom: 6 }}>
                      <span style={{ fontSize: 11, color: C.muted }}>Rating: </span>
                      <span style={{ fontSize: 12, fontWeight: 700, color: RATING_COLORS[report.overall_rating]?.color || C.text }}>{report.overall_rating}</span>
                    </div>
                  )}
                  {report.general_notes && (
                    <div style={{ fontSize: 12, color: C.muted, fontStyle: "italic", marginTop: 4 }}>General notes: "{report.general_notes}"</div>
                  )}
                  <div style={{ fontSize: 11, color: C.muted, marginTop: 6 }}>
                    Last updated: {new Date(report.updated_at).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}
                  </div>
                </div>
              ))}
            </div>

            {/* Full combined checklist */}
            {CHECKLIST.map(sec => {
              const hasActivity = sharedReportData.some(({ items }) =>
                sec.items.some(i => items[i.key]?.checked || items[i.key]?.flag || items[i.key]?.note)
              );
              return (
                <div key={sec.section} style={{ background: C.card, border: "1px solid " + C.cardBorder, borderRadius: 12, padding: "12px 16px", marginBottom: 10 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: C.gold, textTransform: "uppercase", letterSpacing: 1, marginBottom: 10 }}>
                    {sec.section}
                    {!hasActivity && <span style={{ color: C.muted, fontWeight: 400, marginLeft: 8 }}>— not yet inspected</span>}
                  </div>
                  {sec.items.map(item => {
                    const inspectorData = sharedReportData.map(({ report, items, photos }) => ({
                      report,
                      item: items[item.key],
                      photos: photos[item.key] || [],
                    })).filter(d => d.item?.checked || d.item?.flag || d.item?.note || d.photos.length > 0);

                    if (inspectorData.length === 0) return (
                      <div key={item.key} style={{ display: "flex", alignItems: "center", gap: 10, padding: "6px 0", borderBottom: "1px solid " + C.cardBorder, opacity: 0.4 }}>
                        <input type="checkbox" disabled style={{ width: 14, height: 14, flexShrink: 0 }} />
                        <span style={{ fontSize: 13, color: C.muted }}>{item.label}</span>
                      </div>
                    );

                    return (
                      <div key={item.key} style={{ padding: "8px 0", borderBottom: "1px solid " + C.cardBorder }}>
                        <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                          <input type="checkbox" checked={inspectorData.some(d => d.item?.checked)} disabled style={{ width: 14, height: 14, flexShrink: 0, marginTop: 2 }} />
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: 13, color: C.text, lineHeight: 1.4 }}>{item.label}</div>
                            {inspectorData.map(({ report, item: itm, photos }) => (
                              <div key={report.id} style={{ marginTop: 6, paddingLeft: 0 }}>
                                <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                                  <div style={{ width: 20, height: 20, borderRadius: "50%", background: report.inspector_id === "avy" ? C.burgundyDark : C.green, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 700, color: C.ivory, flexShrink: 0 }}>
                                    {(report.inspector_name || "?")[0]}
                                  </div>
                                  <span style={{ fontSize: 11, color: C.muted }}>{report.inspector_name.split(" ")[0]}</span>
                                  {itm?.checked && <span style={{ fontSize: 11, color: C.success }}>✓ Checked</span>}
                                  {itm?.flag && (
                                    <span style={{ fontSize: 11, fontWeight: 700, color: itm.flag === "Good" ? "#3B6D11" : itm.flag === "Unsafe" ? "#A32D2D" : "#D85A30", background: itm.flag === "Good" ? "#EAF3DE" : itm.flag === "Unsafe" ? "#FCEBEB" : "#FAECE7", padding: "1px 8px", borderRadius: 8 }}>
                                      {itm.flag}
                                    </span>
                                  )}
                                  {itm?.note && <span style={{ fontSize: 11, color: C.gold, fontStyle: "italic" }}>"{itm.note}"</span>}
                                </div>
                                {/* Photo thumbnails */}
                                {photos.length > 0 && (
                                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 6 }}>
                                    {photos.map((photo, pi) => (
                                      <div key={pi} onClick={() => setLightboxPhoto(photo.photo_data)}
                                        style={{ width: 56, height: 56, borderRadius: 6, overflow: "hidden", border: "1px solid " + C.cardBorder, cursor: "pointer", flexShrink: 0, background: C.dark }}>
                                        {photo.photo_data
                                          ? <img src={photo.photo_data} alt={"Photo " + (pi + 1)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                          : <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>📷</div>
                                        }
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })}

            {/* Flagged concerns summary */}
            {sharedFlags.length > 0 && (
              <div style={{ background: "#2A1008", border: "1px solid #D85A30", borderRadius: 12, padding: "14px 16px", marginBottom: 14 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#D85A30", textTransform: "uppercase", letterSpacing: 1, marginBottom: 10 }}>
                  ⚠️ Flagged concerns — both reports ({sharedFlags.length})
                </div>
                {sharedFlags.map((f, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "8px 0", borderBottom: i < sharedFlags.length - 1 ? "1px solid #3D2028" : "none" }}>
                    <FlagDot flag={f.flag} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, color: C.text }}>{f.wing ? f.wing + (f.room ? " — " + f.room + " — " : " — ") : ""}{f.label}</div>
                      <div style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>
                        {f.inspector}{f.time ? " · " + f.time : ""} · {f.flag}
                        {f.note && <span style={{ color: C.gold }}> · "{f.note}"</span>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <button onClick={() => setView("mine")} style={{ background: C.burgundyDark, border: "none", borderRadius: 8, padding: "11px 20px", color: C.ivory, fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
                Back to my report
              </button>
              <button onClick={loadAllReports} style={{ background: C.card, border: "1px solid " + C.cardBorder, borderRadius: 8, padding: "11px 16px", color: C.muted, fontSize: 13, cursor: "pointer" }}>
                ↻ Refresh
              </button>
              <button onClick={() => generatePDF()} style={{ background: C.green, border: "none", borderRadius: 8, padding: "11px 16px", color: C.ivory, fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
                📄 Download PDF Report
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}