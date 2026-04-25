// Inline SVG schematics shown on hover over each Impact card.
// One small bespoke diagram per project, hand-tuned for editorial feel.

import type { ProjectShape } from '../data/resume';

const stroke = '#0a0e1a';
const muted = '#94a3b8';
const indigo = '#4f46e5';
const sky = '#0ea5e9';

function Frame({ children }: { children: React.ReactNode }) {
  return (
    <svg viewBox="0 0 200 120" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
      {children}
    </svg>
  );
}

function SchematicRAG() {
  return (
    <Frame>
      <g transform="translate(14, 30)">
        {[0, 4, 8].map(o => (
          <rect key={o} x={o} y={o} width="28" height="36" fill="white" stroke={stroke} strokeWidth="1" />
        ))}
        <line x1="14" y1="46" x2="32" y2="46" stroke={muted} strokeWidth="0.6" />
        <line x1="14" y1="50" x2="36" y2="50" stroke={muted} strokeWidth="0.6" />
        <line x1="14" y1="54" x2="28" y2="54" stroke={muted} strokeWidth="0.6" />
      </g>
      <line x1="62" y1="55" x2="86" y2="55" stroke={stroke} strokeWidth="1" />
      <polyline points="82,51 86,55 82,59" fill="none" stroke={stroke} strokeWidth="1" />
      <circle cx="100" cy="55" r="14" fill="white" stroke={indigo} strokeWidth="1.2" />
      <text x="100" y="58" textAnchor="middle" fontSize="7" fontFamily="JetBrains Mono" fill={indigo}>RAG</text>
      <line x1="116" y1="55" x2="140" y2="55" stroke={stroke} strokeWidth="1" />
      <polyline points="136,51 140,55 136,59" fill="none" stroke={stroke} strokeWidth="1" />
      <rect x="146" y="34" width="40" height="42" fill="white" stroke={stroke} strokeWidth="1" />
      <text x="166" y="50" textAnchor="middle" fontSize="6" fontFamily="JetBrains Mono" fill={stroke}>VERIFIED</text>
      <line x1="151" y1="56" x2="181" y2="56" stroke={muted} strokeWidth="0.6" />
      <line x1="151" y1="60" x2="178" y2="60" stroke={muted} strokeWidth="0.6" />
      <line x1="151" y1="64" x2="174" y2="64" stroke={muted} strokeWidth="0.6" />
      <circle cx="180" cy="38" r="2" fill="#10b981" />
    </Frame>
  );
}

function SchematicNAV() {
  return (
    <Frame>
      {['Morpho', 'Euler', 'Silo', 'Fluid'].map((p, i) => (
        <g key={p} transform={`translate(14, ${20 + i * 20})`}>
          <rect width="36" height="14" fill="white" stroke={stroke} strokeWidth="1" />
          <text x="18" y="10" textAnchor="middle" fontSize="6" fontFamily="JetBrains Mono" fill={stroke}>{p}</text>
          <line x1="36" y1="7" x2="68" y2={56 - i * 20} stroke={muted} strokeWidth="0.7" />
        </g>
      ))}
      <rect x="68" y="46" width="40" height="28" fill="white" stroke={indigo} strokeWidth="1.2" />
      <text x="88" y="58" textAnchor="middle" fontSize="6" fontFamily="JetBrains Mono" fill={indigo}>NAV</text>
      <text x="88" y="68" textAnchor="middle" fontSize="6" fontFamily="JetBrains Mono" fill={indigo}>ENGINE</text>
      <line x1="108" y1="60" x2="124" y2="60" stroke={stroke} strokeWidth="1" />
      <polyline points="120,56 124,60 120,64" fill="none" stroke={stroke} strokeWidth="1" />
      <rect x="128" y="32" width="58" height="56" fill="white" stroke={stroke} strokeWidth="1" />
      <polyline points="132,80 142,72 152,76 162,60 172,56 182,40" fill="none" stroke={indigo} strokeWidth="1.2" />
    </Frame>
  );
}

function SchematicOracle() {
  return (
    <Frame>
      <g transform="translate(14, 22)">
        {Array.from({ length: 24 }).map((_, i) => {
          const x = (i % 6) * 8;
          const y = Math.floor(i / 6) * 8;
          return <circle key={i} cx={x} cy={y} r="1.6" fill={i < 18 ? indigo : muted} />;
        })}
      </g>
      <text x="14" y="100" fontSize="6" fontFamily="JetBrains Mono" fill={muted}>40+ CHAINS</text>
      <line x1="74" y1="55" x2="92" y2="55" stroke={stroke} strokeWidth="1" />
      <polyline points="88,51 92,55 88,59" fill="none" stroke={stroke} strokeWidth="1" />
      <rect x="94" y="42" width="40" height="26" fill="white" stroke={stroke} strokeWidth="1" />
      <text x="114" y="58" textAnchor="middle" fontSize="6" fontFamily="JetBrains Mono" fill={stroke}>INDEXER</text>
      <line x1="134" y1="55" x2="150" y2="55" stroke={stroke} strokeWidth="1" />
      <polyline points="146,51 150,55 146,59" fill="none" stroke={stroke} strokeWidth="1" />
      <g transform="translate(154, 30)">
        {[16, 22, 12, 26, 10].map((h, i) => (
          <rect key={i} x={i * 6} y={30 - h} width="4" height={h} fill={i === 3 ? indigo : sky} opacity={i === 3 ? 1 : 0.6} />
        ))}
        <line x1="0" y1="32" x2="32" y2="32" stroke={stroke} strokeWidth="0.6" />
        <text x="0" y="46" fontSize="5" fontFamily="JetBrains Mono" fill={muted}>per-feed metrics</text>
      </g>
    </Frame>
  );
}

function SchematicAgent() {
  return (
    <Frame>
      <circle cx="100" cy="60" r="16" fill="white" stroke={indigo} strokeWidth="1.2" />
      <text x="100" y="58" textAnchor="middle" fontSize="6" fontFamily="JetBrains Mono" fill={indigo}>PLANNER</text>
      <text x="100" y="66" textAnchor="middle" fontSize="5" fontFamily="JetBrains Mono" fill={muted}>claude</text>
      {[
        { x: 36, y: 30, label: 'R&D' },
        { x: 36, y: 90, label: 'CONTENT' },
        { x: 164, y: 60, label: 'MEMORY' },
      ].map((t, i) => (
        <g key={i}>
          <line x1="100" y1="60" x2={t.x} y2={t.y} stroke={muted} strokeWidth="0.8" strokeDasharray="2 2" />
          <rect x={t.x - 22} y={t.y - 8} width="44" height="16" fill="white" stroke={stroke} strokeWidth="1" />
          <text x={t.x} y={t.y + 3} textAnchor="middle" fontSize="6" fontFamily="JetBrains Mono" fill={stroke}>{t.label}</text>
        </g>
      ))}
    </Frame>
  );
}

const SCHEMATIC_BY_SHAPE: Record<ProjectShape, () => JSX.Element> = {
  rag: SchematicRAG,
  nav: SchematicNAV,
  oracle: SchematicOracle,
  agent: SchematicAgent,
};

export default function Schematic({ shape }: { shape: ProjectShape }) {
  const Component = SCHEMATIC_BY_SHAPE[shape];
  return <Component />;
}
