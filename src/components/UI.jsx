import { Star } from "lucide-react";

export const Av = ({ initials, color, size = 38 }) => (
  <div
    className="avatar"
    style={{ width: size, height: size, background: color, fontSize: size * 0.36 }}
  >
    {initials}
  </div>
);

export const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background:"#fff", border:"1px solid #e5e7eb", borderRadius:10, padding:"8px 14px", fontSize:13 }}>
      <p style={{ color:"#6b7280", marginBottom:2 }}>{label}</p>
      <p style={{ fontWeight:700, color:"#4f46e5" }}>{payload[0].value}</p>
    </div>
  );
};

export const StarRating = ({ rating, color = "#f59e0b" }) => (
  <div style={{ display:"flex", gap:4, alignItems:"center" }}>
    {[1,2,3,4,5].map(s => (
      <Star key={s} size={16}
        fill={s <= Math.floor(rating) ? color : "none"}
        color={s <= Math.floor(rating) ? color : "#d1d5db"}
      />
    ))}
    <span style={{ fontSize:13, color:"#6b7280", marginLeft:4 }}>{rating}</span>
  </div>
);

export const Toast = ({ message }) => (
  message ? (
    <div style={{ background:"#ecfdf5", border:"1px solid #a7f3d0", color:"#065f46", borderRadius:12, padding:"12px 18px", marginBottom:20, fontSize:14, fontWeight:500, display:"flex", alignItems:"center", gap:8 }}>
      ✓ {message}
    </div>
  ) : null
);

export const BackButton = ({ onClick, label = "Back" }) => (
  <button onClick={onClick} style={{ display:"flex", alignItems:"center", gap:6, color:"#4f46e5", fontWeight:600, fontSize:14, background:"none", border:"none", cursor:"pointer", marginBottom:24 }}>
    ← {label}
  </button>
);

export const InfoGrid = ({ items }) => (
  <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(180px,1fr))", gap:14 }}>
    {items.map(([k, v]) => (
      <div key={k} style={{ background:"#f9fafb", borderRadius:14, padding:16 }}>
        <p style={{ fontSize:11, color:"#9ca3af", fontWeight:700, textTransform:"uppercase", letterSpacing:.5 }}>{k}</p>
        <p style={{ fontSize:14, fontWeight:600, color:"#111827", marginTop:5 }}>{v}</p>
      </div>
    ))}
  </div>
);