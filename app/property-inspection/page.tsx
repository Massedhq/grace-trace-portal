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

const ALLOWED = ["avy", "dennis", "travis", "ialana", "deann", "erica", "aubreyon"];

const DEFAULT_PROPERTY = "Athens TX — State Hwy 31 West";

const WINGS = [
  "West Wing", "East Wing", "North Wing", "South Wing",
  "Central / Common Areas", "Exterior — North", "Exterior — South",
  "Exterior — East", "Exterior — West", "Mechanical Room",
  "Basement", "General",
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

const EXTERIOR_SECTION = {
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
};

const INTERIOR_SECTIONS = [
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

function areaItemKey(areaId, key) { return "AREA_" + areaId + "__" + key; }

function parseAreaItemKey(item_key) {
  if (typeof item_key !== "string" || !item_key.startsWith("AREA_")) return null;
  const rest = item_key.slice(5);
  const sep = rest.indexOf("__");
  if (sep === -1) return null;
  return { areaId: rest.slice(0, sep), key: rest.slice(sep + 2) };
}

const EXTERIOR_KEYS = new Set(EXTERIOR_SECTION.items.map(i => i.key));

const SHORT_NAMES = { avy: "Avy", dennis: "Dennis", travis: "Travis", ialana: "Ialana", deann: "Deann", erica: "Erica", aubreyon: "AuBreyon" };
function shortInspectorName(report) {
  return SHORT_NAMES[report.inspector_id] || (report.inspector_name || "").split(" ")[0];
}

// Items saved before Wing/Room tracking existed have plain (unprefixed) keys
// that aren't in EXTERIOR_KEYS either — e.g. "int_walls" or "kit_stove" from
// an old per-room report. Nothing was lost; this just makes that data
// visible again by grouping it using the section/label already stored on
// each item row, without needing to touch the database.
function buildLegacySections(itemsMap) {
  const bySection = {};
  const order = [];
  Object.values(itemsMap || {}).forEach((it) => {
    if (!it || EXTERIOR_KEYS.has(it.item_key)) return;
    const secName = it.section || "Other (unlabeled)";
    if (!bySection[secName]) { bySection[secName] = []; order.push(secName); }
    if (!bySection[secName].some(existing => existing.key === it.item_key)) {
      bySection[secName].push({ key: it.item_key, label: it.item_label || it.item_key });
    }
  });
  return order.map(secName => ({ section: secName, items: bySection[secName] }));
}

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

function canonProp(s) {
  return (s || "").trim().toLowerCase().replace(/\s+/g, " ").replace(/[–—−]/g, "-");
}

function groupByProperty(list, getPropertyName) {
  const map = {};
  const order = [];
  const displayNames = {};
  list.forEach(entry => {
    const raw = getPropertyName(entry) || "Unnamed property";
    const key = canonProp(raw);
    if (!map[key]) { map[key] = []; order.push(key); displayNames[key] = raw; }
    map[key].push(entry);
  });
  return order.map(key => ({ propertyName: displayNames[key], entries: map[key] }));
}

export default function PropertyInspection() {
  const [currentUser, setCurrentUser] = useState(null);
  const [view, setView] = useState("mine"); // "mine" | "shared"
  const [propertyName, setPropertyName] = useState("");
  const [inspectionId, setInspectionId] = useState(null);
  const [viewingInspectorId, setViewingInspectorId] = useState(null);
  const [viewingInspectorName, setViewingInspectorName] = useState(null);

  // Exterior checklist state (unprefixed item keys, global to the property report)
  const [itemStates, setItemStates] = useState({});
  const [myPhotos, setMyPhotos] = useState({});
  const [exteriorOpen, setExteriorOpen] = useState(true);

  // Interior areas (Wing -> Room) within the current report
  const [areas, setAreas] = useState([]); // [{id, wing, room}]
  const [areaItemStates, setAreaItemStates] = useState({}); // { [areaId]: { [key]: state } }
  const [areaPhotos, setAreaPhotos] = useState({}); // { [areaId]: { [key]: [photo] } }
  const [expandedAreaId, setExpandedAreaId] = useState(null);
  const [activeInteriorSection, setActiveInteriorSection] = useState({}); // { [areaId]: sectionName|null }
  const [showAddArea, setShowAddArea] = useState(false);
  const [newWing, setNewWing] = useState("");
  const [newRoom, setNewRoom] = useState("");

  const [rating, setRating] = useState("");
  const [generalNotes, setGeneralNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [allReports, setAllReports] = useState([]);
  const [myProgress, setMyProgress] = useState(0);
  const [sharedFlags, setSharedFlags] = useState([]);
  const [noteModal, setNoteModal] = useState(null); // { key, label, section, areaId }
  const [photoUploading, setPhotoUploading] = useState(false);
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);
  const [activePhotoKey, setActivePhotoKey] = useState(null);
  const [activePhotoAreaId, setActivePhotoAreaId] = useState(null);
  const [myProperties, setMyProperties] = useState([]); // this inspector's own reports (one per property)
  const [sharedReportData, setSharedReportData] = useState([]);
  const [selectedBrowseProperty, setSelectedBrowseProperty] = useState(null);
  const [selectedSharedProperty, setSelectedSharedProperty] = useState(null);
  const [lightboxPhoto, setLightboxPhoto] = useState(null);

  useEffect(() => {
    try {
      const uid = localStorage.getItem("gtm_current_user");
      const active = localStorage.getItem("gtm_session_active");
      if (!uid || active !== "true" || !ALLOWED.includes(uid)) {
        window.location.href = "/";
        return;
      }
      const names = {
        avy: "Avrial Evans (Avy)",
        dennis: "Dennis",
        travis: "Travis Ramar",
        ialana: "Ialana Tippins",
        deann: "Deann Evans",
        erica: "Erica Evans",
        aubreyon: "AuBreyon \"Kisses\" Woodley",
      };
      setCurrentUser({ id: uid, name: names[uid] });
    } catch (e) { window.location.href = "/"; return; }
  }, []);

  useEffect(() => {
    if (currentUser) {
      loadAllReports();
    }
  }, [currentUser]);

  function computeProgress(exteriorMap, areaMap, areaCount) {
    const exteriorTotal = EXTERIOR_SECTION.items.length;
    const interiorPerArea = INTERIOR_SECTIONS.reduce((a, s) => a + s.items.length, 0);
    const exteriorItems = Object.values(exteriorMap).filter(i => EXTERIOR_KEYS.has(i.item_key));
    const legacyItems = Object.values(exteriorMap).filter(i => !EXTERIOR_KEYS.has(i.item_key));
    const exteriorChecked = exteriorItems.filter(i => i.checked).length;
    const legacyChecked = legacyItems.filter(i => i.checked).length;
    const interiorChecked = Object.values(areaMap).reduce(
      (acc, itemsObj) => acc + Object.values(itemsObj || {}).filter(i => i.checked).length, 0
    );
    const totalPossible = exteriorTotal + interiorPerArea * areaCount + legacyItems.length;
    const checked = exteriorChecked + interiorChecked + legacyChecked;
    return totalPossible ? Math.round((checked / totalPossible) * 100) : 0;
  }

  function applyReportData(report, items, areasList, photos) {
    const exteriorMap = {};
    const areaMap = {};
    (items || []).forEach(it => {
      const parsed = parseAreaItemKey(it.item_key);
      if (parsed) {
        if (!areaMap[parsed.areaId]) areaMap[parsed.areaId] = {};
        areaMap[parsed.areaId][parsed.key] = it;
      } else {
        exteriorMap[it.item_key] = it;
      }
    });

    const exteriorPhotoMap = {};
    const areaPhotoMap = {};
    (photos || []).forEach(p => {
      const parsed = parseAreaItemKey(p.item_key || "");
      if (parsed) {
        if (!areaPhotoMap[parsed.areaId]) areaPhotoMap[parsed.areaId] = {};
        if (!areaPhotoMap[parsed.areaId][parsed.key]) areaPhotoMap[parsed.areaId][parsed.key] = [];
        areaPhotoMap[parsed.areaId][parsed.key].push(p);
      } else {
        const key = p.item_key || "general";
        if (!exteriorPhotoMap[key]) exteriorPhotoMap[key] = [];
        exteriorPhotoMap[key].push(p);
      }
    });

    setInspectionId(report.id);
    setPropertyName(report.property_name || "");
    setViewingInspectorId(report.inspector_id || null);
    setViewingInspectorName(report.inspector_name || null);
    setRating(report.overall_rating || "");
    setGeneralNotes(report.general_notes || "");
    setItemStates(exteriorMap);
    setMyPhotos(exteriorPhotoMap);
    setAreas(areasList || []);
    setAreaItemStates(areaMap);
    setAreaPhotos(areaPhotoMap);
    setExpandedAreaId(null);
    setMyProgress(computeProgress(exteriorMap, areaMap, (areasList || []).length));
  }

  async function loadAllReports() {
    try {
      const r = await fetch("/api/property-inspection?full=true");
      const d = await r.json();
      const reports = d.reports || [];
      let enriched = d.enriched || [];

      // The bulk full=true response deliberately excludes raw photo bytes
      // (base64 image data across many reports/photos can exceed the
      // platform's response size limit). Fetch actual photo data per report
      // in parallel, then merge it into the enriched photos map.
      if (reports.length > 0) {
        const photoResults = await Promise.all(
          reports.map((rep) =>
            fetch("/api/property-inspection-photos?inspection_id=" + rep.id)
              .then(res => res.json())
              .then(pd => ({ id: rep.id, photos: pd.photos || [] }))
              .catch(() => ({ id: rep.id, photos: [] }))
          )
        );
        const photosByReport = {};
        photoResults.forEach(pr => { photosByReport[pr.id] = pr.photos; });

        enriched = enriched.map((e) => {
          const fullPhotos = photosByReport[e.report.id] || [];
          const photoMap = {};
          fullPhotos.forEach((p) => {
            const key = p.item_key || "general";
            if (!photoMap[key]) photoMap[key] = [];
            photoMap[key].push(p);
          });
          return { ...e, photos: photoMap };
        });
      }

      setAllReports(reports);

      const mine = reports.filter(rep => rep.inspector_id === currentUser.id);
      setMyProperties(mine);
      setSharedReportData(enriched);

      const stillActive = inspectionId ? mine.find(rep => rep.id === inspectionId) : null;
      const fallback = mine.length > 0 ? mine[0] : null;
      const activeReport = stillActive || fallback;

      if (activeReport) {
        const activeEnriched = enriched.find(e => e.report.id === activeReport.id);
        if (activeEnriched) {
          setInspectionId(activeReport.id);
          setPropertyName(activeReport.property_name || "");
          setViewingInspectorId(activeReport.inspector_id || null);
          setViewingInspectorName(activeReport.inspector_name || null);
          setRating(activeReport.overall_rating || "");
          setGeneralNotes(activeReport.general_notes || "");
          setAreas(activeEnriched.areas || []);

          const exteriorMap = {};
          const areaMap = {};
          Object.entries(activeEnriched.items).forEach(([key, it]) => {
            const parsed = parseAreaItemKey(key);
            if (parsed) {
              if (!areaMap[parsed.areaId]) areaMap[parsed.areaId] = {};
              areaMap[parsed.areaId][parsed.key] = it;
            } else {
              exteriorMap[key] = it;
            }
          });
          setItemStates(exteriorMap);

          const exteriorPhotoMap = {};
          const areaPhotoMap = {};
          Object.entries(activeEnriched.photos).forEach(([key, list]) => {
            const parsed = parseAreaItemKey(key);
            if (parsed) {
              if (!areaPhotoMap[parsed.areaId]) areaPhotoMap[parsed.areaId] = {};
              areaPhotoMap[parsed.areaId][parsed.key] = list;
            } else {
              exteriorPhotoMap[key] = list;
            }
          });
          setMyPhotos(exteriorPhotoMap);
          setAreaItemStates(areaMap);
          setAreaPhotos(areaPhotoMap);
          setMyProgress(activeEnriched.progress);
        }
      } else {
        // No reports of my own for any property. Make sure we're not stuck
        // showing a teammate's report from an earlier "By property"/"Shared
        // view" visit — reset to a blank, fully editable state so a new or
        // first-time inspector can actually start typing/checking/uploading.
        setInspectionId(null);
        setPropertyName("");
        setViewingInspectorId(null);
        setViewingInspectorName(null);
        setItemStates({});
        setMyPhotos({});
        setAreas([]);
        setAreaItemStates({});
        setAreaPhotos({});
        setRating("");
        setGeneralNotes("");
        setMyProgress(0);
      }

      // Build flags from all enriched data
      const flags = [];
      enriched.forEach(({ report, items, areas: reportAreas }) => {
        const areaLookup = {};
        (reportAreas || []).forEach(a => { areaLookup[a.id] = a; });
        Object.entries(items).forEach(([key, i]) => {
          if (i.flag === "Concern" || i.flag === "Needs repair" || i.flag === "Unsafe") {
            const parsed = parseAreaItemKey(key);
            const area = parsed ? areaLookup[parsed.areaId] : null;
            flags.push({
              label: i.item_label, flag: i.flag, note: i.note,
              inspector: report.inspector_name, propertyName: report.property_name,
              location: area ? (area.wing + " — " + area.room) : "Exterior",
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

  async function deleteReport(id) {
    await fetch("/api/property-inspection?id=" + id, { method: "DELETE" });

    if (inspectionId === id) {
      setInspectionId(null);
      setPropertyName("");
      setItemStates({});
      setMyPhotos({});
      setAreas([]);
      setAreaItemStates({});
      setAreaPhotos({});
      setRating("");
      setGeneralNotes("");
      setMyProgress(0);
    }

    const r2 = await fetch("/api/property-inspection?inspector_id=" + currentUser.id);
    const d2 = await r2.json();
    setMyProperties(d2.reports || []);
  }

  async function loadReportById(id) {
    const ir = await fetch("/api/property-inspection?id=" + id);
    const id2 = await ir.json();
    const pr = await fetch("/api/property-inspection-photos?inspection_id=" + id);
    const pd = await pr.json();
    applyReportData(id2.report, id2.items, id2.areas, pd.photos);
    setShowMyProperties(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function switchProperty(rawName) {
    const newName = (rawName || "").trim();
    if (!newName) return;
    if (inspectionId && (propertyName || "").trim() === newName) return;

    const existing = myProperties.find(r => canonProp(r.property_name) === canonProp(newName));
    if (existing) {
      await loadReportById(existing.id);
      return;
    }

    setPropertyName(newName);
    setInspectionId(null);
    setViewingInspectorId(null);
    setViewingInspectorName(null);
    setItemStates({});
    setMyPhotos({});
    setAreas([]);
    setAreaItemStates({});
    setAreaPhotos({});
    setRating("");
    setGeneralNotes("");
    setMyProgress(0);
  }

  async function getOrCreateInspection() {
    if (inspectionId) return inspectionId;
    const finalName = (propertyName || "").trim() || DEFAULT_PROPERTY;
    const r = await fetch("/api/property-inspection", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ inspector_id: currentUser.id, inspector_name: currentUser.name, property_name: finalName }),
    });
    const d = await r.json();
    setInspectionId(d.report.id);
    setPropertyName(d.report.property_name || finalName);
    setViewingInspectorId(currentUser.id);
    setViewingInspectorName(currentUser.name);
    const r2 = await fetch("/api/property-inspection?inspector_id=" + currentUser.id);
    const d2 = await r2.json();
    setMyProperties(d2.reports || []);
    return d.report.id;
  }

  async function addArea() {
    const wing = (newWing || "").trim();
    const room = (newRoom || "").trim();
    if (!wing || !room) return;
    const id = await getOrCreateInspection();
    const res = await fetch("/api/property-inspection-areas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ inspection_id: id, wing, room }),
    });
    const d = await res.json();
    setAreas(prev => prev.some(a => a.id === d.area.id) ? prev : [...prev, d.area]);
    setAreaItemStates(prev => ({ ...prev, [d.area.id]: prev[d.area.id] || {} }));
    setAreaPhotos(prev => ({ ...prev, [d.area.id]: prev[d.area.id] || {} }));
    setExpandedAreaId(d.area.id);
    setNewWing("");
    setNewRoom("");
    setShowAddArea(false);
    setMyProgress(computeProgress(itemStates, { ...areaItemStates, [d.area.id]: areaItemStates[d.area.id] || {} }, areas.length + (areas.some(a => a.id === d.area.id) ? 0 : 1)));
  }

  async function toggleChecklistItem(section, item, areaId) {
    const current = areaId ? areaItemStates[areaId]?.[item.key] : itemStates[item.key];
    const newChecked = !current?.checked;
    const encodedKey = areaId ? areaItemKey(areaId, item.key) : item.key;

    let updatedExteriorMap = itemStates;
    let updatedAreaMap = areaItemStates;

    if (areaId) {
      updatedAreaMap = { ...areaItemStates, [areaId]: { ...(areaItemStates[areaId] || {}), [item.key]: { ...current, item_key: item.key, checked: newChecked, section } } };
      setAreaItemStates(updatedAreaMap);
    } else {
      updatedExteriorMap = { ...itemStates, [item.key]: { ...current, item_key: item.key, checked: newChecked, section } };
      setItemStates(updatedExteriorMap);
    }

    const id = await getOrCreateInspection();
    await fetch("/api/property-inspection", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, item: { section, item_key: encodedKey, item_label: item.label, checked: newChecked, flag: current?.flag, note: current?.note } }),
    });

    setMyProgress(computeProgress(updatedExteriorMap, updatedAreaMap, areas.length));
  }

  async function saveFlag(itemKey, itemLabel, section, flag, areaId) {
    const current = areaId ? areaItemStates[areaId]?.[itemKey] : itemStates[itemKey];
    const encodedKey = areaId ? areaItemKey(areaId, itemKey) : itemKey;

    if (areaId) {
      setAreaItemStates(prev => ({ ...prev, [areaId]: { ...(prev[areaId] || {}), [itemKey]: { ...current, flag } } }));
    } else {
      setItemStates(prev => ({ ...prev, [itemKey]: { ...current, flag } }));
    }

    const id = await getOrCreateInspection();
    await fetch("/api/property-inspection", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, item: { section, item_key: encodedKey, item_label: itemLabel, checked: current?.checked || false, flag, note: current?.note } }),
    });
  }

  async function saveNote(note) {
    const { key: itemKey, label, section, areaId } = noteModal || {};
    if (!itemKey) return;
    const current = areaId ? areaItemStates[areaId]?.[itemKey] : itemStates[itemKey];
    const flag = current?.flag;
    const checked = current?.checked || false;
    const encodedKey = areaId ? areaItemKey(areaId, itemKey) : itemKey;

    if (areaId) {
      setAreaItemStates(prev => ({ ...prev, [areaId]: { ...(prev[areaId] || {}), [itemKey]: { ...(prev[areaId]?.[itemKey] || {}), note } } }));
    } else {
      setItemStates(prev => ({ ...prev, [itemKey]: { ...(prev[itemKey] || {}), note } }));
    }
    setNoteModal(null);

    const id = await getOrCreateInspection();
    await fetch("/api/property-inspection", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, item: { section: section || "General", item_key: encodedKey, item_label: label || itemKey, checked, flag, note } }),
    });
  }

  async function saveHeader() {
    setSaving(true);
    if (inspectionId) {
      await fetch("/api/property-inspection", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: inspectionId, overall_rating: rating, general_notes: generalNotes }),
      });
    } else {
      await getOrCreateInspection();
    }
    setSaving(false);
    const r2 = await fetch("/api/property-inspection?inspector_id=" + currentUser.id);
    const d2 = await r2.json();
    setMyProperties(d2.reports || []);
  }

  async function handlePhotoUpload(e, itemKey, areaId) {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setPhotoUploading(true);

    const id = await getOrCreateInspection();
    const encodedKey = areaId ? areaItemKey(areaId, itemKey) : itemKey;

    for (const file of files) {
      await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = async (ev) => {
          const base64 = ev.target?.result;
          const res = await fetch("/api/property-inspection-photos", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ inspection_id: id, item_key: encodedKey, inspector_id: currentUser.id, photo_data: base64, file_name: file.name }),
          });
          const resData = await res.json();

          if (areaId) {
            setAreaItemStates(prev => ({
              ...prev,
              [areaId]: {
                ...(prev[areaId] || {}),
                [itemKey]: { ...(prev[areaId]?.[itemKey] || {}), photo_count: ((prev[areaId]?.[itemKey]?.photo_count) || 0) + 1 }
              }
            }));
            setAreaPhotos(prev => {
              const areaMap = prev[areaId] || {};
              const existing = areaMap[itemKey] || [];
              return { ...prev, [areaId]: { ...areaMap, [itemKey]: [...existing, { ...(resData.photo || {}), photo_data: base64 }] } };
            });
          } else {
            setItemStates(prev => ({
              ...prev,
              [itemKey]: { ...(prev[itemKey] || {}), photo_count: (prev[itemKey]?.photo_count || 0) + 1 }
            }));
            setMyPhotos(prev => {
              const existing = prev[itemKey] || [];
              return { ...prev, [itemKey]: [...existing, { ...(resData.photo || {}), photo_data: base64 }] };
            });
          }
          resolve();
        };
        reader.readAsDataURL(file);
      });
    }

    if (fileInputRef.current) fileInputRef.current.value = "";
    if (cameraInputRef.current) cameraInputRef.current.value = "";
    setPhotoUploading(false);
  }

  async function deletePhoto(photoId, itemKey, areaId) {
    if (!photoId) return;
    await fetch("/api/property-inspection-photos?id=" + photoId, { method: "DELETE" });

    if (areaId) {
      setAreaPhotos(prev => {
        const areaMap = prev[areaId] || {};
        const existing = areaMap[itemKey] || [];
        return { ...prev, [areaId]: { ...areaMap, [itemKey]: existing.filter(p => p.id !== photoId) } };
      });
      setAreaItemStates(prev => ({
        ...prev,
        [areaId]: { ...(prev[areaId] || {}), [itemKey]: { ...(prev[areaId]?.[itemKey] || {}), photo_count: Math.max(0, (prev[areaId]?.[itemKey]?.photo_count || 0) - 1) } }
      }));
    } else {
      setMyPhotos(prev => {
        const existing = prev[itemKey] || [];
        return { ...prev, [itemKey]: existing.filter(p => p.id !== photoId) };
      });
      setItemStates(prev => ({
        ...prev,
        [itemKey]: { ...(prev[itemKey] || {}), photo_count: Math.max(0, (prev[itemKey]?.photo_count || 0) - 1) }
      }));
    }
    setLightboxPhoto(null);
  }

  async function openCamera(itemKey, areaId) {
    setActivePhotoKey(itemKey);
    setActivePhotoAreaId(areaId || null);
    // Create/confirm the report in the database BEFORE launching the camera.
    // Some phones reload or suspend this tab while the camera app is open —
    // if the report didn't exist yet at that moment, returning from the
    // camera can look like the inspection never started.
    await getOrCreateInspection();
    if (cameraInputRef.current) {
      cameraInputRef.current.value = "";
      setTimeout(() => cameraInputRef.current?.click(), 50);
    }
  }

  async function openLibrary(itemKey, areaId) {
    setActivePhotoKey(itemKey);
    setActivePhotoAreaId(areaId || null);
    await getOrCreateInspection();
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
      setTimeout(() => fileInputRef.current?.click(), 50);
    }
  }

  // Renders one checklist section's rows (used for Exterior, legacy items, and each area's interior sections)
  function renderSectionItems(sec, states, photos, areaId, readOnly) {
    return sec.items.map(item => {
      const state = states[item.key] || {};
      const photoList = (photos[item.key]) || [];
      return (
        <div key={item.key} style={{ padding: "10px 0", borderBottom: "1px solid " + C.cardBorder }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
            <input type="checkbox" checked={!!state.checked} disabled={!!readOnly}
              onChange={() => { if (!readOnly) toggleChecklistItem(sec.section, item, areaId); }}
              style={{ width: 15, height: 15, flexShrink: 0, marginTop: 2, accentColor: C.green, cursor: readOnly ? "default" : "pointer" }} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, color: state.checked ? C.muted : C.text, textDecoration: state.checked ? "line-through" : "none", lineHeight: 1.4 }}>
                {item.label}
              </div>
              {state.note && (
                <div style={{ fontSize: 11, color: C.gold, marginTop: 3, fontStyle: "italic" }}>Note: {state.note}</div>
              )}
              {photoList.length > 0 && (
                <div style={{ display: "flex", gap: 5, flexWrap: "wrap", marginTop: 5 }}>
                  {photoList.map((photo, pi) => (
                    <div key={pi} style={{ position: "relative", width: 48, height: 48, flexShrink: 0 }}>
                      <div onClick={() => setLightboxPhoto({ src: photo.photo_data, photoId: photo.id, itemKey: item.key, areaId })}
                        style={{ width: 48, height: 48, borderRadius: 5, overflow: "hidden", border: "1px solid " + C.cardBorder, cursor: "pointer" }}>
                        <img src={photo.photo_data} alt={"Photo " + (pi + 1)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      </div>
                      {!readOnly && (
                        <button onClick={(e) => { e.stopPropagation(); if (window.confirm("Delete this photo?")) deletePhoto(photo.id, item.key, areaId); }}
                          style={{ position: "absolute", top: -6, right: -6, width: 18, height: 18, borderRadius: "50%", background: "#A32D2D", color: "#fff", border: "none", fontSize: 11, lineHeight: "16px", cursor: "pointer", padding: 0 }}>
                          ×
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div style={{ display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap", marginTop: 8, paddingLeft: 25 }}>
            {state.flag && <FlagDot flag={state.flag} />}
            {readOnly ? (
              state.flag && (
                <span style={{ fontSize: 11, padding: "3px 8px", borderRadius: 6, border: "1px solid " + C.cardBorder, color: C.muted }}>{state.flag}</span>
              )
            ) : (
              <select value={state.flag || ""} onChange={e => saveFlag(item.key, item.label, sec.section, e.target.value, areaId)}
                style={{ fontSize: 11, padding: "4px 6px", borderRadius: 6, border: "1px solid " + C.cardBorder, background: C.dark, color: C.text, fontFamily: "inherit", cursor: "pointer" }}>
                <option value="">Flag</option>
                {FLAG_OPTS.map(f => <option key={f} value={f}>{f}</option>)}
              </select>
            )}
            {!readOnly && (
              <>
                <button onClick={() => setNoteModal({ key: item.key, label: item.label, section: sec.section, areaId })}
                  style={{ fontSize: 11, padding: "4px 9px", borderRadius: 6, border: "1px solid " + C.cardBorder, background: C.dark, color: C.muted, cursor: "pointer" }}>
                  Note
                </button>
                <button onClick={() => openCamera(item.key, areaId)}
                  style={{ fontSize: 11, padding: "4px 9px", borderRadius: 6, border: "1px solid " + C.gold, background: C.dark, color: C.gold, cursor: "pointer", display: "flex", alignItems: "center", gap: 4, fontWeight: 600 }}>
                  📷 Take photo
                </button>
                <button onClick={() => openLibrary(item.key, areaId)}
                  style={{ fontSize: 11, padding: "4px 9px", borderRadius: 6, border: "1px solid " + C.cardBorder, background: C.dark, color: C.muted, cursor: "pointer", display: "flex", alignItems: "center", gap: 4, fontWeight: 600 }}>
                  🖼️ {photoList.length > 0
                    ? <span>+Add · <span style={{ background: C.gold, color: C.dark, fontSize: 10, fontWeight: 700, padding: "1px 5px", borderRadius: 8 }}>{photoList.length}</span></span>
                    : "Library"}
                  {photoUploading && activePhotoKey === item.key && activePhotoAreaId === (areaId || null) && <span style={{ fontSize: 10, color: C.muted }}>Uploading...</span>}
                </button>
              </>
            )}
          </div>
        </div>
      );
    });
  }

  function areaProgress(areaId) {
    const total = INTERIOR_SECTIONS.reduce((a, s) => a + s.items.length, 0);
    const done = Object.values(areaItemStates[areaId] || {}).filter(i => i.checked).length;
    return total ? Math.round((done / total) * 100) : 0;
  }

  function generatePDF() {
    const date = new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" });
    const propertyGroups = groupByProperty(sharedReportData, e => e.report.property_name);

    let html = `<!DOCTYPE html><html><head><meta charset="UTF-8">
    <title>Grace Trace Ministries — Property Inspection Report</title>
    <style>
      body { font-family: Arial, sans-serif; max-width: 900px; margin: 0 auto; padding: 32px; color: #1A0F12; }
      h1 { color: #4A0E1A; font-size: 24px; margin-bottom: 4px; }
      h2 { color: #4A0E1A; font-size: 16px; margin: 24px 0 8px; border-bottom: 2px solid #4A0E1A; padding-bottom: 4px; }
      h3 { color: #1E4D2B; font-size: 13px; margin: 16px 0 6px; }
      .property-title { color: #6B1A2A; font-size: 20px; margin: 36px 0 4px; border-bottom: 3px solid #C9A84C; padding-bottom: 6px; }
      .area-title { color: #1E4D2B; font-size: 14px; margin: 18px 0 6px; }
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
    <div class="sub">Property Inspection Report &mdash; ${date}</div>
    <button onclick="window.print()" style="position:fixed;top:16px;right:16px;background:#1E4D2B;color:#fff;border:none;border-radius:8px;padding:10px 18px;font-size:14px;font-weight:700;cursor:pointer;z-index:999;">🖨️ Print / Save as PDF</button>`;

    propertyGroups.forEach(({ propertyName: propName, entries }) => {
      html += `<div class="property-title">${propName}</div>`;

      // ---- One combined overall score for the property, not a card per old report ----
      const RATING_SEVERITY = ["Unsafe for occupancy", "Poor", "Fair", "Good", "Excellent"];
      let worstRating = null;
      entries.forEach(({ report }) => {
        if (!report.overall_rating) return;
        const idx = RATING_SEVERITY.indexOf(report.overall_rating);
        if (idx === -1) return;
        if (worstRating === null || idx < RATING_SEVERITY.indexOf(worstRating)) worstRating = report.overall_rating;
      });
      const avgProgress = entries.length ? Math.round(entries.reduce((a, e) => a + e.progress, 0) / entries.length) : 0;
      const overallRatingClass = (worstRating || "").replace(/[^a-zA-Z]/g, "");

      html += `<div style="background:#F5F0E8;border:1px solid #D4C8B8;border-radius:10px;padding:16px 20px;margin-bottom:20px">
        <div style="font-size:14px;margin-bottom:6px">Overall Property Progress: <strong>${avgProgress}%</strong></div>
        ${worstRating
          ? `<div style="font-size:14px">Overall Property Score: <span class="rating rating-${overallRatingClass}">${worstRating}</span></div>`
          : `<div style="font-size:13px;color:#999;font-style:italic">Not yet rated</div>`}
      </div>`;

      const notesWithText = entries.filter(e => e.report.general_notes && e.report.general_notes.trim());
      if (notesWithText.length > 0) {
        html += `<div style="margin-bottom:20px"><h3 style="margin-bottom:8px">General Notes</h3>`;
        notesWithText.forEach(({ report }) => {
          html += `<div style="font-size:12px;color:#666;margin-bottom:6px"><strong>${report.inspector_name}:</strong> <span style="font-style:italic">"${report.general_notes}"</span></div>`;
        });
        html += `</div>`;
      }

      // ---- Merge every contributing report's data into one combined checklist ----
      const exteriorMerged = {};   // item_key -> [{report, item, photos}]
      const legacyMerged = {};     // section -> { item_key -> { label, contributors: [...] } }
      const areaGroups = {};       // normKey -> { wing, room, sections: { section -> { item_key -> { label, contributors: [...] } } } }
      const areaGroupOrder = [];

      entries.forEach(({ report, items, photos, areas: reportAreas }) => {
        Object.entries(items).forEach(([key, itm]) => {
          const parsed = parseAreaItemKey(key);
          if (parsed) return; // area items handled below
          const photoList = photos[key] || [];
          if (!itm?.checked && !itm?.flag && !itm?.note && photoList.length === 0) return;

          if (EXTERIOR_KEYS.has(key)) {
            if (!exteriorMerged[key]) exteriorMerged[key] = [];
            exteriorMerged[key].push({ report, item: itm, photos: photoList });
          } else {
            const secName = itm.section || "Other";
            if (!legacyMerged[secName]) legacyMerged[secName] = {};
            if (!legacyMerged[secName][key]) legacyMerged[secName][key] = { label: itm.item_label || key, contributors: [] };
            legacyMerged[secName][key].contributors.push({ report, item: itm, photos: photoList });
          }
        });

        (reportAreas || []).forEach(area => {
          const normKey = (area.wing || "").trim().toLowerCase() + "||" + (area.room || "").trim().toLowerCase();
          if (!areaGroups[normKey]) {
            areaGroups[normKey] = { wing: area.wing, room: area.room, sections: {} };
            areaGroupOrder.push(normKey);
          }
          INTERIOR_SECTIONS.forEach(sec => {
            sec.items.forEach(interiorItem => {
              const encodedKey = "AREA_" + area.id + "__" + interiorItem.key;
              const itm = items[encodedKey];
              const photoList = photos[encodedKey] || [];
              if (!itm?.checked && !itm?.flag && !itm?.note && photoList.length === 0) return;
              if (!areaGroups[normKey].sections[sec.section]) areaGroups[normKey].sections[sec.section] = {};
              if (!areaGroups[normKey].sections[sec.section][interiorItem.key]) {
                areaGroups[normKey].sections[sec.section][interiorItem.key] = { label: interiorItem.label, contributors: [] };
              }
              areaGroups[normKey].sections[sec.section][interiorItem.key].contributors.push({ report, item: itm, photos: photoList });
            });
          });
        });
      });

      function renderContributors(contributors) {
        let out = "";
        contributors.forEach(({ report, item: itm, photos: photoList }) => {
          const tagClass = report.inspector_id === "avy" ? "tag-avy" : "tag-dennis";
          out += `<div style="margin-top:4px"><span class="inspector-tag ${tagClass}">${shortInspectorName(report)}</span>`;
          if (itm?.checked) out += `<span style="color:#3B6D11;font-size:11px">&#10003; Checked</span>`;
          if (itm?.flag) {
            const fc = (itm.flag || "").replace(/[^a-zA-Z]/g, "");
            out += `<span class="flag flag-${fc}">${itm.flag}</span>`;
          }
          if (itm?.note) out += `<div class="note">"${itm.note}"</div>`;
          if (photoList.length > 0) {
            out += `<div class="photos">`;
            photoList.forEach(p => { if (p.photo_data) out += `<img src="${p.photo_data}" class="photo-thumb" alt="Inspection photo">`; });
            out += `</div>`;
          }
          out += `</div>`;
        });
        return out;
      }

      // Exterior — one combined section for the whole property
      if (Object.keys(exteriorMerged).length > 0) {
        html += `<h2>Exterior</h2>`;
        EXTERIOR_SECTION.items.forEach(item => {
          const contributors = exteriorMerged[item.key];
          if (!contributors) return;
          const anyChecked = contributors.some(c => c.item?.checked);
          html += `<div class="item"><input type="checkbox" class="check" ${anyChecked ? "checked" : ""} disabled>
            <div class="item-label ${anyChecked ? "done" : ""}">${item.label}${renderContributors(contributors)}</div></div>`;
        });
      }

      // Legacy items — from before wing/room tracking, still combined (not repeated per report)
      Object.entries(legacyMerged).forEach(([secName, itemsMap]) => {
        html += `<h2>${secName} <span style="font-size:11px;color:#999;font-weight:normal">(recorded before wing/room tracking)</span></h2>`;
        Object.entries(itemsMap).forEach(([, bucket]) => {
          const anyChecked = bucket.contributors.some(c => c.item?.checked);
          html += `<div class="item"><input type="checkbox" class="check" ${anyChecked ? "checked" : ""} disabled>
            <div class="item-label ${anyChecked ? "done" : ""}">${bucket.label}${renderContributors(bucket.contributors)}</div></div>`;
        });
      });

      // Interior areas — one combined section per Wing/Room, merging all inspectors who worked that area
      areaGroupOrder.forEach(normKey => {
        const grp = areaGroups[normKey];
        if (Object.keys(grp.sections).length === 0) return;
        html += `<div class="area-title">${grp.wing} — ${grp.room}</div>`;
        INTERIOR_SECTIONS.forEach(sec => {
          const itemsMap = grp.sections[sec.section];
          if (!itemsMap) return;
          html += `<h3>${sec.section}</h3>`;
          sec.items.forEach(interiorItem => {
            const bucket = itemsMap[interiorItem.key];
            if (!bucket) return;
            const anyChecked = bucket.contributors.some(c => c.item?.checked);
            html += `<div class="item"><input type="checkbox" class="check" ${anyChecked ? "checked" : ""} disabled>
              <div class="item-label ${anyChecked ? "done" : ""}">${bucket.label}${renderContributors(bucket.contributors)}</div></div>`;
          });
        });
      });

      const propFlags = sharedFlags.filter(f => canonProp(f.propertyName) === canonProp(propName));
      if (propFlags.length > 0) {
        html += `<div class="concerns"><h2 style="color:#D85A30;border-color:#D85A30;margin-top:0">&#9888; Flagged Concerns (${propFlags.length})</h2>`;
        propFlags.forEach(f => {
          html += `<div class="concern-item">
            <strong>${f.location} — ${f.label}</strong><br>
            <span style="font-size:12px;color:#666">${f.inspector}${f.time ? " &middot; " + f.time : ""} &middot; ${f.flag}</span>
            ${f.note ? `<br><span style="font-style:italic;color:#C9A84C">"${f.note}"</span>` : ""}
          </div>`;
        });
        html += `</div>`;
      }
    });

    html += `<div style="margin-top:32px;font-size:11px;color:#999;border-top:1px solid #EEE;padding-top:12px">
      Generated by Grace Trace Ministries Staff Portal &middot; ${date} &middot; Confidential — Internal Use Only
    </div></body></html>`;

    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    window.open(url, "_blank");
  }

  if (!currentUser) return <div style={{ background: C.dark, minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", color: C.muted }}>Loading...</div>;

  const sharedGroups = groupByProperty(sharedReportData, e => e.report.property_name);
  const isReadOnly = !!(viewingInspectorId && viewingInspectorId !== currentUser.id);

  return (
    <div style={{ minHeight: "100vh", background: C.dark, fontFamily: "'Inter','Segoe UI',sans-serif", overflowX: "hidden" }}>

      {noteModal && (
        <NoteModal
          title={"Note — " + noteModal.label}
          onConfirm={(note) => saveNote(note)}
          onCancel={() => setNoteModal(null)}
        />
      )}

      <input type="file" ref={fileInputRef} accept="image/*" multiple style={{ display: "none" }}
        onChange={e => handlePhotoUpload(e, activePhotoKey, activePhotoAreaId)} />
      <input type="file" ref={cameraInputRef} accept="image/*" capture="environment" style={{ display: "none" }}
        onChange={e => handlePhotoUpload(e, activePhotoKey, activePhotoAreaId)} />

      {/* Header */}
      <div style={{ background: C.burgundyDark, borderBottom: "2px solid " + C.gold, padding: "14px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
        <div>
          <a href="/" style={{ color: C.muted, fontSize: 13, textDecoration: "none" }}>← Portal home</a>
          <div style={{ color: C.ivory, fontWeight: 800, fontSize: 16, marginTop: 2 }}>Property Inspection</div>
          <div style={{ color: C.gold, fontSize: 11 }}>{propertyName || "No property selected"} · {currentUser.name}</div>
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {["mine", "shared", "browse"].map(v => (
            <button key={v} onClick={() => { setView(v); loadAllReports(); }}
              style={{ padding: "8px 16px", borderRadius: 8, border: "1px solid " + (view === v ? C.gold : C.cardBorder), background: view === v ? C.gold : C.card, color: view === v ? C.dark : C.muted, fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
              {v === "mine" ? "My report" : v === "shared" ? "Shared view" : "By property"}
            </button>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: 800, margin: "0 auto", padding: "20px 16px" }}>

        {view === "mine" && (
          <>
            {lightboxPhoto && (
              <div onClick={() => setLightboxPhoto(null)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.92)", zIndex: 300, display: "flex", alignItems: "center", justifyContent: "center", padding: 20, cursor: "pointer" }}>
                <img src={lightboxPhoto.src} alt="Inspection photo" style={{ maxWidth: "100%", maxHeight: "90vh", borderRadius: 8, objectFit: "contain" }} />
                <div style={{ position: "absolute", top: 20, right: 20, color: "#fff", fontSize: 28, cursor: "pointer" }}>✕</div>
                {!isReadOnly && lightboxPhoto.photoId && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (window.confirm("Delete this photo? This can't be undone.")) {
                        deletePhoto(lightboxPhoto.photoId, lightboxPhoto.itemKey, lightboxPhoto.areaId);
                      }
                    }}
                    style={{ position: "absolute", bottom: 30, left: "50%", transform: "translateX(-50%)", background: "#A32D2D", color: "#fff", border: "none", borderRadius: 8, padding: "10px 20px", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>
                    🗑️ Delete this photo
                  </button>
                )}
              </div>
            )}

            {isReadOnly && (
              <div style={{ background: "#2A1008", border: "1px solid #D85A30", borderRadius: 10, padding: "10px 14px", marginBottom: 14, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}>
                <span style={{ fontSize: 12, color: "#D85A30", fontWeight: 700 }}>
                  🔒 Viewing {viewingInspectorName || "another inspector"}'s report — read-only
                </span>
                <button onClick={() => loadAllReports()}
                  style={{ background: C.burgundyDark, border: "none", borderRadius: 6, padding: "6px 12px", color: C.ivory, fontSize: 12, fontWeight: 700, cursor: "pointer" }}>
                  ← Back to my report
                </button>
              </div>
            )}

            {/* Property selector */}
            <div style={{ display: "flex", flexDirection: "column", gap: 5, marginBottom: 14 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
                <label style={{ fontSize: 10, fontWeight: 700, color: C.gold, textTransform: "uppercase", letterSpacing: 1 }}>Property being inspected</label>
                <button onClick={() => { setPropertyName(""); setRating(""); setGeneralNotes(""); setInspectionId(null); setViewingInspectorId(null); setViewingInspectorName(null); setItemStates({}); setMyPhotos({}); setAreas([]); setAreaItemStates({}); setAreaPhotos({}); setMyProgress(0); }}
                  style={{ background: C.card, border: "1px solid " + C.cardBorder, borderRadius: 6, padding: "4px 10px", color: C.text, fontSize: 11, fontWeight: 700, cursor: "pointer" }}>
                  + Start new property
                </button>
              </div>
              <input type="text" list="properties-list" value={propertyName} disabled={isReadOnly}
                onChange={e => setPropertyName(e.target.value)}
                onBlur={e => switchProperty(e.target.value)}
                placeholder="e.g. Athens TX — State Hwy 31 West"
                style={{ background: C.card, border: "1px solid " + C.cardBorder, borderRadius: 8, padding: "9px 12px", color: C.text, fontSize: 13, outline: "none", fontFamily: "inherit", opacity: isReadOnly ? 0.6 : 1 }} />
              <datalist id="properties-list">{myProperties.map(r => <option key={r.id} value={r.property_name} />)}</datalist>
              {(() => {
                const activeReport = allReports.find(r => r.id === inspectionId);
                if (activeReport && (activeReport.wing || activeReport.room_area)) {
                  return (
                    <div style={{ fontSize: 11, color: C.gold, fontStyle: "italic" }}>
                      This report was originally recorded as: {[activeReport.wing, activeReport.room_area].filter(Boolean).join(" — ")} (from before wing/room tracking was added — the notes and checklist below for this report belong to that area).
                    </div>
                  );
                }
                return null;
              })()}
            </div>

            {/* Progress */}
            <div style={{ background: C.card, border: "1px solid " + C.cardBorder, borderRadius: 12, padding: "14px 16px", marginBottom: 14 }}>
              {(() => {
                const propertyReports = allReports.filter(r => canonProp(r.property_name) === canonProp(propertyName));
                const latestByOtherInspector = {};
                propertyReports.forEach(r => {
                  if (r.inspector_id === currentUser.id) return;
                  const existing = latestByOtherInspector[r.inspector_id];
                  if (!existing || new Date(r.updated_at) > new Date(existing.updated_at)) {
                    latestByOtherInspector[r.inspector_id] = r;
                  }
                });
                const rows = [
                  { key: "me", label: "My progress", pct: myProgress, color: C.burgundyDark },
                  ...Object.values(latestByOtherInspector).map(r => {
                    const enriched = sharedReportData.find(e => e.report.id === r.id);
                    return { key: r.id, label: shortInspectorName(r), pct: enriched ? enriched.progress : 0, color: C.green };
                  }),
                ];
                return rows.map(p => (
                  <div key={p.key} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 7 }}>
                    <span style={{ fontSize: 12, color: C.muted, width: 90, flexShrink: 0 }}>{p.label}</span>
                    <div style={{ flex: 1, background: C.dark, borderRadius: 4, height: 7, overflow: "hidden" }}>
                      <div style={{ background: p.color, height: 7, borderRadius: 4, width: p.pct + "%", transition: "width 0.3s" }} />
                    </div>
                    <span style={{ color: C.text, fontSize: 12, fontWeight: 700, width: 32, textAlign: "right" }}>{p.pct}%</span>
                  </div>
                ));
              })()}
            </div>

            {/* EXTERIOR — single, property-wide section */}
            <div style={{ background: C.card, border: "1px solid " + C.cardBorder, borderRadius: 12, padding: "12px 16px", marginBottom: 14 }}>
              <button onClick={() => setExteriorOpen(!exteriorOpen)}
                style={{ width: "100%", background: "transparent", border: "none", display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer", padding: 0 }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: C.gold, textTransform: "uppercase", letterSpacing: 1 }}>Exterior</span>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 11, color: C.muted }}>
                    {EXTERIOR_SECTION.items.filter(i => itemStates[i.key]?.checked).length}/{EXTERIOR_SECTION.items.length}
                  </span>
                  <span style={{ color: C.gold, fontSize: 16 }}>{exteriorOpen ? "▲" : "▼"}</span>
                </div>
              </button>
              {exteriorOpen && (
                <div style={{ marginTop: 10 }}>
                  {renderSectionItems(EXTERIOR_SECTION, itemStates, myPhotos, null, isReadOnly)}
                </div>
              )}
            </div>

            {/* Previously recorded items — from before Wing/Room tracking existed.
                Nothing was deleted; this surfaces old checklist data and photos
                that don't fit the new Exterior/Area structure so you can still
                see, edit, and photograph them. */}
            {buildLegacySections(itemStates).map(sec => (
              <div key={"legacy-" + sec.section} style={{ background: C.card, border: "1px solid #6B1A2A", borderRadius: 12, padding: "12px 16px", marginBottom: 10 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#D85A30", textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}>
                  Previously recorded — {sec.section}
                </div>
                <div style={{ fontSize: 11, color: C.muted, marginBottom: 10 }}>
                  Saved before wing/room tracking was added. Still fully editable — assign it to a wing/room by adding a new area and rechecking there if you'd like it organized going forward.
                </div>
                {renderSectionItems(sec, itemStates, myPhotos, null, isReadOnly)}
              </div>
            ))}

            {/* INTERIOR AREAS — Wing -> Room */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: C.gold, textTransform: "uppercase", letterSpacing: 1 }}>Interior areas ({areas.length})</span>
              {!isReadOnly && (
                <button onClick={() => setShowAddArea(!showAddArea)}
                  style={{ background: C.green, border: "none", borderRadius: 8, padding: "8px 14px", color: C.ivory, fontSize: 12, fontWeight: 700, cursor: "pointer" }}>
                  + Add wing / room
                </button>
              )}
            </div>

            {showAddArea && !isReadOnly && (
              <div style={{ background: C.card, border: "1px solid " + C.gold, borderRadius: 12, padding: "14px 16px", marginBottom: 14 }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                    <label style={{ fontSize: 10, fontWeight: 700, color: C.gold, textTransform: "uppercase", letterSpacing: 1 }}>Wing</label>
                    <input type="text" list="wings-list" value={newWing} onChange={e => setNewWing(e.target.value)}
                      placeholder="e.g. Canton Wing"
                      style={{ background: C.dark, border: "1px solid " + C.cardBorder, borderRadius: 8, padding: "9px 12px", color: C.text, fontSize: 13, outline: "none", fontFamily: "inherit" }} />
                    <datalist id="wings-list">{WINGS.map(w => <option key={w} value={w} />)}</datalist>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                    <label style={{ fontSize: 10, fontWeight: 700, color: C.gold, textTransform: "uppercase", letterSpacing: 1 }}>Room</label>
                    <input type="text" list="rooms-list" value={newRoom} onChange={e => setNewRoom(e.target.value)}
                      placeholder="e.g. Room 601, or type a custom room like Salon"
                      style={{ background: C.dark, border: "1px solid " + C.cardBorder, borderRadius: 8, padding: "9px 12px", color: C.text, fontSize: 13, outline: "none", fontFamily: "inherit" }} />
                    <datalist id="rooms-list">{ROOMS.map(r => <option key={r} value={r} />)}</datalist>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button onClick={addArea} disabled={!newWing.trim() || !newRoom.trim()}
                    style={{ background: C.burgundyDark, border: "none", borderRadius: 8, padding: "9px 16px", color: C.ivory, fontSize: 13, fontWeight: 700, cursor: "pointer", opacity: (!newWing.trim() || !newRoom.trim()) ? 0.5 : 1 }}>
                    Add area
                  </button>
                  <button onClick={() => { setShowAddArea(false); setNewWing(""); setNewRoom(""); }}
                    style={{ background: "transparent", border: "1px solid " + C.cardBorder, borderRadius: 8, padding: "9px 16px", color: C.muted, fontSize: 13, cursor: "pointer" }}>
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {areas.length === 0 && !showAddArea && (
              <div style={{ background: C.card, border: "1px solid " + C.cardBorder, borderRadius: 12, padding: "16px", color: C.muted, fontSize: 13, marginBottom: 14, textAlign: "center" }}>
                No interior areas yet — add a wing and room to start the interior checklist for that area.
              </div>
            )}

            {areas.map(area => {
              const isOpen = expandedAreaId === area.id;
              const pct = areaProgress(area.id);
              const currentActiveSec = activeInteriorSection[area.id] ?? null;
              return (
                <div key={area.id} style={{ background: C.card, border: "1px solid " + C.cardBorder, borderRadius: 12, padding: "12px 16px", marginBottom: 10 }}>
                  <button onClick={() => setExpandedAreaId(isOpen ? null : area.id)}
                    style={{ width: "100%", background: "transparent", border: "none", display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer", padding: 0 }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: C.text }}>{area.wing} — {area.room}</span>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ fontSize: 11, color: C.muted }}>{pct}%</span>
                      <span style={{ color: C.gold, fontSize: 16 }}>{isOpen ? "▲" : "▼"}</span>
                    </div>
                  </button>

                  {isOpen && (
                    <div style={{ marginTop: 12 }}>
                      {INTERIOR_SECTIONS.map(sec => (
                        <div key={sec.section} style={{ background: C.dark, border: "1px solid " + C.cardBorder, borderRadius: 10, padding: "10px 12px", marginBottom: 8 }}>
                          <button onClick={() => setActiveInteriorSection(prev => ({ ...prev, [area.id]: currentActiveSec === sec.section ? null : sec.section }))}
                            style={{ width: "100%", background: "transparent", border: "none", display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer", padding: 0 }}>
                            <span style={{ fontSize: 11, fontWeight: 700, color: C.gold, textTransform: "uppercase", letterSpacing: 1 }}>{sec.section}</span>
                            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                              <span style={{ fontSize: 11, color: C.muted }}>
                                {sec.items.filter(i => areaItemStates[area.id]?.[i.key]?.checked).length}/{sec.items.length}
                              </span>
                              <span style={{ color: C.gold, fontSize: 14 }}>{currentActiveSec === sec.section ? "▲" : "▼"}</span>
                            </div>
                          </button>
                          {(currentActiveSec === sec.section || currentActiveSec === null) && (
                            <div style={{ marginTop: 8 }}>
                              {renderSectionItems(sec, areaItemStates[area.id] || {}, areaPhotos[area.id] || {}, area.id, isReadOnly)}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}

            {/* Overall rating */}
            <div style={{ background: C.card, border: "1px solid " + C.cardBorder, borderRadius: 12, padding: "14px 16px", marginBottom: 10, marginTop: 14 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: C.gold, textTransform: "uppercase", letterSpacing: 1, marginBottom: 10 }}>Overall inspection rating</div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {RATINGS.map(r => {
                  const rc = RATING_COLORS[r];
                  const sel = rating === r;
                  return (
                    <button key={r} disabled={isReadOnly} onClick={() => { setRating(r); saveHeader(); }}
                      style={{ padding: "8px 14px", borderRadius: 8, border: "1px solid " + (sel ? rc.border : C.cardBorder), background: sel ? rc.bg : C.dark, color: sel ? rc.color : C.text, fontSize: 13, fontWeight: sel ? 700 : 400, cursor: isReadOnly ? "default" : "pointer", opacity: isReadOnly ? 0.7 : 1 }}>
                      {r}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* General notes */}
            <div style={{ background: C.card, border: "1px solid " + C.cardBorder, borderRadius: 12, padding: "14px 16px", marginBottom: 14 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: C.gold, textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>General notes for this property</div>
              <textarea value={generalNotes} disabled={isReadOnly} onChange={e => setGeneralNotes(e.target.value)} onBlur={saveHeader}
                placeholder="Add any additional notes, observations, or concerns for this property..."
                rows={4}
                style={{ width: "100%", background: C.dark, border: "1px solid " + C.cardBorder, borderRadius: 8, padding: "10px 12px", color: C.text, fontSize: 13, resize: "vertical", outline: "none", fontFamily: "inherit", lineHeight: 1.6, opacity: isReadOnly ? 0.7 : 1 }} />
            </div>

            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              {!isReadOnly && (
                <>
                  <button onClick={saveHeader} style={{ background: C.burgundyDark, border: "none", borderRadius: 8, padding: "11px 20px", color: C.ivory, fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
                    {saving ? "Saving..." : "Save"}
                  </button>
                  <button onClick={() => setShowAddArea(true)}
                    style={{ background: C.green, border: "none", borderRadius: 8, padding: "11px 20px", color: C.ivory, fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
                    + Start new area
                  </button>
                </>
              )}
              <button onClick={() => { setPropertyName(""); setRating(""); setGeneralNotes(""); setInspectionId(null); setViewingInspectorId(null); setViewingInspectorName(null); setItemStates({}); setMyPhotos({}); setAreas([]); setAreaItemStates({}); setAreaPhotos({}); setMyProgress(0); }}
                style={{ background: C.card, border: "1px solid " + C.cardBorder, borderRadius: 8, padding: "11px 20px", color: C.text, fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
                + Start new property
              </button>
              <button onClick={() => { setView("shared"); loadAllReports(); }}
                style={{ background: C.card, border: "1px solid " + C.cardBorder, borderRadius: 8, padding: "11px 16px", color: C.muted, fontSize: 13, cursor: "pointer" }}>
                View shared report
              </button>
            </div>
          </>
        )}

        {view === "browse" && (
          <>
            {(() => {
              const browseGroups = groupByProperty(allReports, r => r.property_name);
              const activeGroup = browseGroups.find(g => g.propertyName === selectedBrowseProperty);

              if (!selectedBrowseProperty || !activeGroup) {
                return (
                  <>
                    {browseGroups.length === 0 && (
                      <div style={{ background: C.card, border: "1px solid " + C.cardBorder, borderRadius: 12, padding: "20px 16px", color: C.muted, fontSize: 13, textAlign: "center" }}>
                        No properties inspected yet.
                      </div>
                    )}
                    {browseGroups.map(({ propertyName: propName, entries: propReports }) => (
                      <button key={propName} onClick={() => setSelectedBrowseProperty(propName)}
                        style={{ width: "100%", textAlign: "left", background: C.card, border: "1px solid " + C.cardBorder, borderRadius: 12, padding: "16px", marginBottom: 10, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between" }}
                        onMouseEnter={e => e.currentTarget.style.borderColor = C.gold}
                        onMouseLeave={e => e.currentTarget.style.borderColor = C.cardBorder}>
                        <div>
                          <div style={{ color: C.text, fontWeight: 700, fontSize: 14 }}>{propName}</div>
                          <div style={{ color: C.muted, fontSize: 12, marginTop: 3 }}>{propReports.length} report{propReports.length === 1 ? "" : "s"}</div>
                        </div>
                        <span style={{ color: C.gold, fontSize: 18 }}>→</span>
                      </button>
                    ))}
                  </>
                );
              }

              return (
                <>
                  <button onClick={() => setSelectedBrowseProperty(null)}
                    style={{ background: "transparent", border: "1px solid " + C.cardBorder, borderRadius: 8, padding: "8px 14px", color: C.muted, fontSize: 12, cursor: "pointer", marginBottom: 14 }}>
                    ← All properties
                  </button>
                  <div style={{ color: C.gold, fontWeight: 800, fontSize: 15, marginBottom: 10, borderBottom: "2px solid " + C.gold, paddingBottom: 8 }}>
                    {activeGroup.propertyName}
                  </div>
                  {activeGroup.entries.map(report => {
                    const isMine = report.inspector_id === currentUser.id;
                    return (
                      <div key={report.id}
                        style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 12px", background: (inspectionId === report.id) ? "#2A1A0A" : C.card, border: "1px solid " + ((inspectionId === report.id) ? C.gold : C.cardBorder), borderRadius: 8, marginBottom: 8, gap: 8 }}
                        onMouseEnter={e => e.currentTarget.style.borderColor = C.gold}
                        onMouseLeave={e => { if (inspectionId !== report.id) e.currentTarget.style.borderColor = C.cardBorder; }}>
                        <div onClick={() => { loadReportById(report.id); setView("mine"); }} style={{ cursor: "pointer", flex: 1, minWidth: 0 }}>
                          <div style={{ color: C.text, fontWeight: 600, fontSize: 13 }}>
                            <span style={{ fontSize: 10, fontWeight: 700, padding: "1px 7px", borderRadius: 8, background: isMine ? C.burgundyDark : C.green, color: C.ivory, marginRight: 6 }}>
                              {shortInspectorName(report)}
                            </span>
                            {report.inspector_name}
                          </div>
                          {(report.wing || report.room_area) && (
                            <div style={{ color: C.gold, fontSize: 11, marginTop: 2, fontStyle: "italic" }}>
                              Originally recorded as: {[report.wing, report.room_area].filter(Boolean).join(" — ")}
                            </div>
                          )}
                          <div style={{ color: C.muted, fontSize: 11, marginTop: 2 }}>
                            {report.overall_rating || "No rating"} · {new Date(report.updated_at).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}
                          </div>
                        </div>
                        <span onClick={() => { loadReportById(report.id); setView("mine"); }} style={{ color: C.muted, fontSize: 13, cursor: "pointer", flexShrink: 0 }}>
                          {isMine ? "Open →" : "View →"}
                        </span>
                        {isMine && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              if (window.confirm("Delete this report for \"" + report.property_name + "\"? This removes its checklist, notes, and photos permanently.")) {
                                deleteReport(report.id);
                              }
                            }}
                            style={{ background: "transparent", border: "1px solid #A32D2D", borderRadius: 6, padding: "5px 8px", color: "#D85A30", fontSize: 12, cursor: "pointer", flexShrink: 0 }}>
                            🗑️
                          </button>
                        )}
                      </div>
                    );
                  })}
                </>
              );
            })()}
          </>
        )}

        {view === "shared" && (
          <>
            {lightboxPhoto && (
              <div onClick={() => setLightboxPhoto(null)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.92)", zIndex: 300, display: "flex", alignItems: "center", justifyContent: "center", padding: 20, cursor: "pointer" }}>
                <img src={lightboxPhoto.src} alt="Inspection photo" style={{ maxWidth: "100%", maxHeight: "90vh", borderRadius: 8, objectFit: "contain" }} />
                <div style={{ position: "absolute", top: 20, right: 20, color: "#fff", fontSize: 28, cursor: "pointer" }}>✕</div>
              </div>
            )}

            {sharedGroups.length === 0 && (
              <div style={{ background: C.card, border: "1px solid " + C.cardBorder, borderRadius: 12, padding: "20px 16px", color: C.muted, fontSize: 13, textAlign: "center" }}>
                No inspections recorded yet.
              </div>
            )}

            {!selectedSharedProperty && sharedGroups.map(({ propertyName: propName, entries }) => (
              <button key={propName} onClick={() => setSelectedSharedProperty(propName)}
                style={{ width: "100%", textAlign: "left", background: C.card, border: "1px solid " + C.cardBorder, borderRadius: 12, padding: "16px", marginBottom: 10, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between" }}
                onMouseEnter={e => e.currentTarget.style.borderColor = C.gold}
                onMouseLeave={e => e.currentTarget.style.borderColor = C.cardBorder}>
                <div>
                  <div style={{ color: C.text, fontWeight: 700, fontSize: 14 }}>{propName}</div>
                  <div style={{ color: C.muted, fontSize: 12, marginTop: 3 }}>{entries.length} inspector report{entries.length === 1 ? "" : "s"}</div>
                </div>
                <span style={{ color: C.gold, fontSize: 18 }}>→</span>
              </button>
            ))}

            {selectedSharedProperty && (
              <button onClick={() => setSelectedSharedProperty(null)}
                style={{ background: "transparent", border: "1px solid " + C.cardBorder, borderRadius: 8, padding: "8px 14px", color: C.muted, fontSize: 12, cursor: "pointer", marginBottom: 14 }}>
                ← All properties
              </button>
            )}

            {sharedGroups.filter(g => g.propertyName === selectedSharedProperty).map(({ propertyName: propName, entries }) => {
              const propFlags = sharedFlags.filter(f => canonProp(f.propertyName) === canonProp(propName));
              return (
                <div key={propName} style={{ marginBottom: 32 }}>
                  <div style={{ color: C.gold, fontWeight: 800, fontSize: 15, marginBottom: 12, borderBottom: "2px solid " + C.gold, paddingBottom: 8 }}>
                    {propName}
                  </div>

                  <div style={{ background: C.card, border: "1px solid " + C.cardBorder, borderRadius: 12, padding: "14px 16px", marginBottom: 14 }}>
                    {entries.map(({ report, progress }) => (
                      <div key={report.id} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                        <span style={{ fontSize: 12, color: C.muted, width: 110, flexShrink: 0 }}>{shortInspectorName(report)}</span>
                        <div style={{ flex: 1, background: C.dark, borderRadius: 4, height: 7, overflow: "hidden" }}>
                          <div style={{ background: report.inspector_id === "avy" ? C.burgundyDark : C.green, height: 7, borderRadius: 4, width: progress + "%", transition: "width 0.3s" }} />
                        </div>
                        <span style={{ color: C.text, fontSize: 12, fontWeight: 700, width: 32, textAlign: "right" }}>{progress}%</span>
                      </div>
                    ))}
                  </div>

                  {entries.map(({ report, items, photos, areas: reportAreas }) => (
                    <div key={report.id} style={{ background: C.card, border: "1px solid " + C.cardBorder, borderRadius: 12, padding: "14px 16px", marginBottom: 14 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10, paddingBottom: 10, borderBottom: "1px solid " + C.cardBorder }}>
                        <div style={{ width: 32, height: 32, borderRadius: "50%", background: report.inspector_id === "avy" ? C.burgundyDark : C.green, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: C.ivory, flexShrink: 0 }}>
                          {(report.inspector_name || "?").split(" ").map(n => n[0]).join("").slice(0, 2)}
                        </div>
                        <div style={{ color: C.text, fontWeight: 700, fontSize: 13 }}>{report.inspector_name}</div>
                      </div>

                      {(report.wing || report.room_area) && (
                        <div style={{ fontSize: 11, color: C.gold, fontStyle: "italic", marginBottom: 10 }}>
                          Originally recorded as: {[report.wing, report.room_area].filter(Boolean).join(" — ")}
                        </div>
                      )}

                      {/* Exterior items that have activity */}
                      {EXTERIOR_SECTION.items.some(i => items[i.key]?.checked || items[i.key]?.flag || items[i.key]?.note) && (
                        <div style={{ marginBottom: 12 }}>
                          <div style={{ fontSize: 11, fontWeight: 700, color: C.gold, textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>Exterior</div>
                          {EXTERIOR_SECTION.items.map(item => {
                            const itm = items[item.key];
                            const photoList = photos[item.key] || [];
                            if (!itm?.checked && !itm?.flag && !itm?.note && photoList.length === 0) return null;
                            return (
                              <div key={item.key} style={{ fontSize: 12, color: C.text, padding: "4px 0", borderBottom: "1px solid " + C.cardBorder }}>
                                {itm?.checked && <span style={{ color: C.success, marginRight: 6 }}>✓</span>}
                                {item.label}
                                {itm?.flag && <span style={{ marginLeft: 6, fontSize: 11, fontWeight: 700, color: itm.flag === "Good" ? "#3B6D11" : "#D85A30" }}>{itm.flag}</span>}
                                {itm?.note && <div style={{ fontSize: 11, color: C.gold, fontStyle: "italic" }}>"{itm.note}"</div>}
                                {photoList.length > 0 && (
                                  <div style={{ display: "flex", gap: 5, flexWrap: "wrap", marginTop: 4 }}>
                                    {photoList.map((photo, pi) => (
                                      <div key={pi} onClick={() => setLightboxPhoto({ src: photo.photo_data })} style={{ width: 40, height: 40, borderRadius: 5, overflow: "hidden", border: "1px solid " + C.cardBorder, cursor: "pointer" }}>
                                        {photo.photo_data && <img src={photo.photo_data} alt="Photo" style={{ width: "100%", height: "100%", objectFit: "cover" }} />}
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}

                      {/* Previously recorded items — from before Wing/Room tracking */}
                      {buildLegacySections(items).map(sec => (
                        <div key={"legacy-" + sec.section} style={{ marginBottom: 12 }}>
                          <div style={{ fontSize: 11, fontWeight: 700, color: "#D85A30", textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>
                            Previously recorded — {sec.section}
                          </div>
                          {sec.items.map(item => {
                            const itm = items[item.key];
                            const photoList = photos[item.key] || [];
                            if (!itm?.checked && !itm?.flag && !itm?.note && photoList.length === 0) return null;
                            return (
                              <div key={item.key} style={{ fontSize: 12, color: C.text, padding: "4px 0", borderBottom: "1px solid " + C.cardBorder }}>
                                {itm?.checked && <span style={{ color: C.success, marginRight: 6 }}>✓</span>}
                                {item.label}
                                {itm?.flag && <span style={{ marginLeft: 6, fontSize: 11, fontWeight: 700, color: itm.flag === "Good" ? "#3B6D11" : "#D85A30" }}>{itm.flag}</span>}
                                {itm?.note && <div style={{ fontSize: 11, color: C.gold, fontStyle: "italic" }}>"{itm.note}"</div>}
                                {photoList.length > 0 && (
                                  <div style={{ display: "flex", gap: 5, flexWrap: "wrap", marginTop: 4 }}>
                                    {photoList.map((photo, pi) => (
                                      <div key={pi} onClick={() => setLightboxPhoto({ src: photo.photo_data })} style={{ width: 40, height: 40, borderRadius: 5, overflow: "hidden", border: "1px solid " + C.cardBorder, cursor: "pointer" }}>
                                        {photo.photo_data && <img src={photo.photo_data} alt="Photo" style={{ width: "100%", height: "100%", objectFit: "cover" }} />}
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      ))}

                      {/* Areas */}
                      {(reportAreas || []).map(area => {
                        const areaHasActivity = INTERIOR_SECTIONS.some(sec => sec.items.some(i => {
                          const key = "AREA_" + area.id + "__" + i.key;
                          return items[key]?.checked || items[key]?.flag || items[key]?.note;
                        }));
                        return (
                          <div key={area.id} style={{ marginBottom: 10 }}>
                            <div style={{ fontSize: 11, fontWeight: 700, color: C.gold, textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>
                              {area.wing} — {area.room}{!areaHasActivity && <span style={{ color: C.muted, fontWeight: 400, marginLeft: 8 }}>— not yet inspected</span>}
                            </div>
                            {INTERIOR_SECTIONS.map(sec => sec.items.map(item => {
                              const key = "AREA_" + area.id + "__" + item.key;
                              const itm = items[key];
                              const photoList = photos[key] || [];
                              if (!itm?.checked && !itm?.flag && !itm?.note && photoList.length === 0) return null;
                              return (
                                <div key={key} style={{ fontSize: 12, color: C.text, padding: "4px 0", borderBottom: "1px solid " + C.cardBorder }}>
                                  {itm?.checked && <span style={{ color: C.success, marginRight: 6 }}>✓</span>}
                                  {item.label}
                                  {itm?.flag && <span style={{ marginLeft: 6, fontSize: 11, fontWeight: 700, color: itm.flag === "Good" ? "#3B6D11" : "#D85A30" }}>{itm.flag}</span>}
                                  {itm?.note && <div style={{ fontSize: 11, color: C.gold, fontStyle: "italic" }}>"{itm.note}"</div>}
                                  {photoList.length > 0 && (
                                    <div style={{ display: "flex", gap: 5, flexWrap: "wrap", marginTop: 4 }}>
                                      {photoList.map((photo, pi) => (
                                        <div key={pi} onClick={() => setLightboxPhoto({ src: photo.photo_data })} style={{ width: 40, height: 40, borderRadius: 5, overflow: "hidden", border: "1px solid " + C.cardBorder, cursor: "pointer" }}>
                                          {photo.photo_data && <img src={photo.photo_data} alt="Photo" style={{ width: "100%", height: "100%", objectFit: "cover" }} />}
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              );
                            }))}
                          </div>
                        );
                      })}

                      {report.general_notes && (
                        <div style={{ fontSize: 12, color: C.muted, fontStyle: "italic", marginTop: 8 }}>General notes: "{report.general_notes}"</div>
                      )}
                    </div>
                  ))}

                  {propFlags.length > 0 && (
                    <div style={{ background: "#2A1008", border: "1px solid #D85A30", borderRadius: 12, padding: "14px 16px", marginBottom: 14 }}>
                      <div style={{ fontSize: 11, fontWeight: 700, color: "#D85A30", textTransform: "uppercase", letterSpacing: 1, marginBottom: 10 }}>
                        ⚠️ Flagged concerns ({propFlags.length})
                      </div>
                      {propFlags.map((f, i) => (
                        <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "8px 0", borderBottom: i < propFlags.length - 1 ? "1px solid #3D2028" : "none" }}>
                          <FlagDot flag={f.flag} />
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: 13, color: C.text }}>{f.location} — {f.label}</div>
                            <div style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>
                              {f.inspector}{f.time ? " · " + f.time : ""} · {f.flag}
                              {f.note && <span style={{ color: C.gold }}> · "{f.note}"</span>}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}

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