import { useEffect, useMemo, useState } from 'react';
import AccessBridgeMap from './AccessBridgeMap';
import ResearchDashboard from '../components/ResearchDashboard';
import { formatResearchValue, indicatorMetadata, loadResearchData, RESEARCH_INDICATORS, researchValue, type ResearchIndicatorKey, type ResearchLoadedData } from '../lib/researchData';
import { RISK_LEVELS } from '../lib/researchRisk';

type Section = 'overview' | 'explore' | 'insights';
export default function AccessBridgeApp() {
  const [data, setData] = useState<ResearchLoadedData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [section, setSection] = useState<Section>('overview');
  const [indicator, setIndicator] = useState<ResearchIndicatorKey>('diabetes_pct');
  const [selected, setSelected] = useState<string | null>(null);
  const [compared, setCompared] = useState<string[]>([]);
  const [query, setQuery] = useState('');

  const load = () => { setError(null); void loadResearchData().then(setData).catch((reason: unknown) => setError(reason instanceof Error ? reason.message : String(reason))); };
  useEffect(load, []);
  const areas = useMemo(() => data ? [...data.areas.values()].sort((a, b) => a.zcta5.localeCompare(b.zcta5)) : [], [data]);
  const selectedArea = selected && data ? data.areas.get(selected) : null;
  const metadata = data ? indicatorMetadata(data.manifest, indicator) : RESEARCH_INDICATORS.find((item) => item.key === indicator)!;
  const compare = (id: string) => setCompared((items) => items.includes(id) || items.length >= 5 ? items : [...items, id]);

  if (!data) return <main className="load-screen"><section><h1>AccessBridge</h1>{error ? <><p role="alert">Ohio research data could not be loaded: {error}</p><button onClick={load}>Retry</button></> : <p role="status">Loading the published Lucas County research bundle…</p>}</section></main>;
  return <div className="app-shell">
    <header className="topbar"><div><p className="eyebrow">Ohio research prototype</p><h1>AccessBridge</h1></div><nav aria-label="Research sections">{(['overview','explore','insights'] as const).map((name) => <button key={name} aria-current={section === name ? 'page' : undefined} onClick={() => setSection(name)}>{name === 'overview' ? 'Overview' : name === 'explore' ? 'Explore map' : 'Research insights'}</button>)}</nav></header>
    {section !== 'explore' ? <ResearchDashboard section={section} data={data} onExplore={() => setSection('explore')} /> : <main className="workspace">
      <aside className="research-sidebar" aria-label="Ohio research controls">
        <h2>Lucas County, Ohio</h2><p>26 study areas · 2020 Census ZIP Code Tabulation Areas (ZCTAs)</p>
        <p className="census-notice">This product uses the Census Bureau Data API but is not endorsed or certified by the Census Bureau.</p>
        <label htmlFor="indicator">Map indicator</label><select id="indicator" value={indicator} onChange={(event) => setIndicator(event.target.value as ResearchIndicatorKey)}>{RESEARCH_INDICATORS.map((item) => <option key={item.key} value={item.key}>{item.label}</option>)}</select>
        <section className="legend"><b>{metadata.label}</b><div className="swatches">{RISK_LEVELS.map((level) => <span key={level.key}><i style={{ backgroundColor: level.color }} />{level.label}</span>)}</div><div className="no-data-key"><i />No data</div><p>Observed range: {(() => { const vs = areas.map((area) => researchValue(area, indicator)).filter((v): v is number => v != null); return vs.length ? `${formatResearchValue(Math.min(...vs), indicator)} – ${formatResearchValue(Math.max(...vs), indicator)}` : 'Not available'; })()}</p><small>{metadata.units} · {metadata.source} · {metadata.vintage}</small><p>{metadata.description}</p><p>Relative categories are descriptive within this study set; they are not clinical thresholds.</p>{indicator === 'nearest_hrsa_center_km' && <p>Great-circle straight-line proximity to HRSA sites only; it is not driving distance, travel time, transportation access, service availability, or actual healthcare accessibility.</p>}{(metadata.kind === 'percentile' || metadata.kind === 'composite') && <p>Exploratory descriptive score; not clinically validated.</p>}</section>
        <form onSubmit={(event) => { event.preventDefault(); if (data.areas.has(query)) { setSelected(query); setError(null); } else setError(`ZCTA ${query} is not in the Lucas County study bundle.`); }}><label htmlFor="zcta-search">Find ZCTA</label><div className="search-row"><input id="zcta-search" inputMode="numeric" maxLength={5} value={query} onChange={(event) => setQuery(event.target.value.replace(/\D/g, ''))} placeholder="Five-digit ZCTA"/><button>Find</button></div>{error && <p role="alert">{error}</p>}</form>
        <section className="area-details"><div className="section-heading"><h3>{selectedArea ? `ZCTA ${selectedArea.zcta5}` : 'Area details'}</h3>{selectedArea && <button onClick={() => compare(selectedArea.zcta5)} disabled={compared.includes(selectedArea.zcta5) || compared.length >= 5}>Compare</button>}</div>{selectedArea ? <dl>{RESEARCH_INDICATORS.map((item) => <div key={item.key}><dt>{item.label}</dt><dd>{formatResearchValue(researchValue(selectedArea, item.key), item.key)}</dd></div>)}</dl> : <p>Select a polygon or search for a ZCTA.</p>}</section>
        {compared.length > 0 && <section className="comparison"><div className="section-heading"><h3>Compare areas ({compared.length}/5)</h3><button onClick={() => setCompared([])}>Clear</button></div><div className="table-scroll"><table><thead><tr><th>Indicator</th>{compared.map((id) => <th key={id}><button onClick={() => setSelected(id)}>{id}</button><button aria-label={`Remove ZCTA ${id}`} onClick={() => setCompared((items) => items.filter((x) => x !== id))}>×</button></th>)}</tr></thead><tbody>{RESEARCH_INDICATORS.map((item) => <tr key={item.key}><th>{item.label}</th>{compared.map((id) => <td key={id}>{formatResearchValue(researchValue(data.areas.get(id)!, item.key), item.key)}</td>)}</tr>)}</tbody></table></div></section>}
      </aside>
      <section className="map-section" aria-label="Research map"><AccessBridgeMap data={data} indicator={indicator} selected={selected} onSelect={setSelected}/><div className="map-caption">2020 Census ZCTA polygons selected by largest land-area overlap with Lucas County. Boundaries may extend beyond the county. Map tiles © CARTO; © OpenStreetMap contributors.</div></section>
    </main>}
  </div>;
}
