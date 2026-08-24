import { NETWORK_NODES } from "./PcwgNetwork";

/**
 * The decorative constellation behind the PCWG page hero (source line 1572):
 * the same node geometry as the interactive network diagram, but static,
 * dimmer, and slice-scaled to fill the hero. Only its centre glow animates.
 */
export default function PcwgConstellation() {
  return (
    <div aria-hidden className="absolute inset-0 opacity-90">
      <svg viewBox="0 0 1200 700" width="100%" height="100%" preserveAspectRatio="xMidYMid slice" style={{ display: "block" }}>
        {NETWORK_NODES.map((n) => (
          <line
            key={"l-" + n.name}
            x1={600}
            y1={350}
            x2={n.cx}
            y2={n.cy}
            stroke={n.current ? "#C8A75D" : "#00A8A8"}
            strokeWidth={n.current ? 1.2 : 1}
            strokeOpacity={n.current ? 0.38 : 0.18}
            strokeDasharray={n.current ? "7 9" : "3 10"}
          />
        ))}
        {NETWORK_NODES.filter((n) => n.current).map((n) => (
          <g key={"m-" + n.name}>
            <circle cx={n.cx} cy={n.cy} r={6} fill="#C8A75D" fillOpacity={0.8} />
            <circle cx={n.cx} cy={n.cy} r={16} fill="#C8A75D" fillOpacity={0.1} />
          </g>
        ))}
        {NETWORK_NODES.filter((n) => !n.current).map((n) => (
          <circle key={"p-" + n.name} cx={n.cx} cy={n.cy} r={4} fill="none" stroke="#00A8A8" strokeOpacity={0.45} strokeWidth={1.2} />
        ))}
        <circle cx={600} cy={350} r={90} fill="#C8A75D" fillOpacity={0.05} style={{ animation: "qomGlow 5s ease-in-out infinite" }} />
        <circle cx={600} cy={350} r={52} fill="#C8A75D" fillOpacity={0.1} />
        <circle cx={600} cy={350} r={18} fill="#C8A75D" />
      </svg>
    </div>
  );
}
