import { useState, type FormEvent } from 'react';
import { useStore } from '../store';
import { RISK_LEVELS, riskDirectionText } from '../lib/researchRisk';
import {
  formatResearchValue, indicatorMetadata, RESEARCH_INDICATORS, researchValue,
  researchRiskDirection, summarizeResearchIndicator, RESEARCH_DENOMINATORS,
  type ResearchIndicatorKey,
} from '../lib/researchData';

export default function ResearchModePanel() {
  const data = useStore((s) => s.researchData);
  const metric = useStore((s) => s.metric);
  const setMetric = useStore((s) => s.setMetric);
  const selectedZcta = useStore((s) => s.selectedZcta);
  const select = useStore((s) => s.select);
  const compareZctas = useStore((s) => s.compareZctas);
  const addCompare = useStore((s) => s.addCompare);
  const removeCompare = useStore((s) => s.removeCompare);
  const clearCompare = useStore((s) => s.clearCompare);
  const [search, setSearch] = useState('');
  const [searchError, setSearchError] = useState<string | null>(null);

  const activeIndicator = (RESEARCH_INDICATORS.find((item) => item.key === metric) ?? RESEARCH_INDICATORS[0]);
  const indicatorKey = activeIndicator.key as ResearchIndicatorKey;
  const areas = data ? [...data.areas.values()].sort((a, b) => a.zcta5.localeCompare(b.zcta5)) : [];
  const sourceIndicators = RESEARCH_INDICATORS.filter((item) => item.kind === 'source');
  const proximityIndicators = RESEARCH_INDICATORS.filter((item) => item.kind === 'proximity');
  const percentileIndicators = RESEARCH_INDICATORS.filter((item) => item.kind === 'percentile');
  const compositeIndicator = RESEARCH_INDICATORS.filter((item) => item.kind === 'composite');
  const selected = selectedZcta && data ? data.areas.get(selectedZcta) : undefined;
  const compared = compareZctas.map((zcta) => data?.areas.get(zcta)).filter((area) => area != null);
  const values = areas.map((area) => researchValue(area, indicatorKey)).filter((value): value is number => value != null);
  const lo = values.length ? Math.min(...values) : null;
  const hi = values.length ? Math.max(...values) : null;
  const activeMeta = data
    ? indicatorMetadata(data.manifest, indicatorKey)
    : { ...activeIndicator, denominator: RESEARCH_DENOMINATORS[indicatorKey] };
  const riskDirection = researchRiskDirection(indicatorKey);

  const submitSearch = (event: FormEvent) => {
    event.preventDefault();
    const id = search.trim();
    if (!/^\d{5}$/.test(id)) {
      setSearchError('Enter a five-digit ZCTA.');
      return;
    }
    if (!data?.areas.has(id)) {
      setSearchError(`ZCTA ${id} is not in this Lucas County study bundle.`);
      return;
    }
    setSearchError(null);
    select(id, { fly: true });
  };

  if (!data) return null;
  const valueFor = (area: (typeof areas)[number], key: ResearchIndicatorKey) => researchValue(area, key);

  return (
    <aside aria-label="Ohio research controls" className="absolute z-20 left-2 right-2 bottom-2 sm:left-3 sm:top-[104px] sm:bottom-3 sm:right-auto sm:w-[370px] max-h-[46vh] sm:max-h-[calc(100vh-116px)] overflow-y-auto panel rounded-md p-3 text-[11px] leading-snug text-graphite shadow-lg">
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="font-medium text-ink text-[13px]">Lucas County, Ohio · Research study</div>
          <div className="mt-0.5">{areas.length} study areas · public-source estimates and derived scores</div>
        </div>
        <span className="shrink-0 rounded border border-hairline px-1.5 py-0.5 text-[10px] text-accent">RESEARCH</span>
      </div>

      <p className="mt-2">Study areas are 2020 Census ZCTAs selected by largest land-area overlap with Lucas County. They are not postal ZIP Codes; full ZCTA boundaries may extend beyond the county.</p>
      <p className="mt-2 rounded border border-hairline bg-surface/80 p-2 text-[10px] text-ink">This product uses the Census Bureau Data API but is not endorsed or certified by the Census Bureau.</p>

      <label className="block mt-3 font-medium text-ink" htmlFor="research-indicator">Map indicator</label>
      <select id="research-indicator" aria-label="Research indicator" value={indicatorKey}
        onChange={(event) => setMetric(event.target.value)}
        className="mt-1 w-full rounded border border-hairline bg-surface px-2 py-1.5 text-[12px] text-ink">
        <optgroup label="Public-source estimates">
          {sourceIndicators.map((item) =>
            <option key={item.key} value={item.key}>{item.label}</option>)}
        </optgroup>
        <optgroup label="Derived straight-line proximity measure">
          {proximityIndicators.map((item) => <option key={item.key} value={item.key}>{item.label}</option>)}
        </optgroup>
        <optgroup label="Derived within-study percentile scores">
          {percentileIndicators.map((item) =>
            <option key={item.key} value={item.key}>{item.label}</option>)}
        </optgroup>
        <optgroup label="Exploratory composite">
          {compositeIndicator.map((item) => <option key={item.key} value={item.key}>{item.label}</option>)}
        </optgroup>
      </select>

      <div aria-label="Map legend" className="mt-2 rounded border border-hairline/70 bg-surface/80 p-2">
        <div className="font-medium text-ink">{activeMeta.label}</div>
        <div className="mt-2 grid grid-cols-5 gap-1">
          {[...RISK_LEVELS].reverse().map((level) => (
            <div key={level.key} className="min-w-0 text-center">
              <span className="block h-3 rounded-sm border border-black/10" style={{ backgroundColor: level.color }} />
              <span className="text-[9px] leading-tight">{level.label}</span>
            </div>
          ))}
        </div>
        <div className="mt-1 flex items-center gap-1.5 text-[10px]">
          <span className="inline-block h-3 w-4 rounded-sm border border-hairline" style={{ backgroundColor: '#D1D5DB' }} />
          <span>No data</span>
        </div>
        <div className="mt-1">Darker blue indicates greater relative concern within this study set; it is not a clinical threshold.</div>
        <div className="font-medium text-ink">{riskDirectionText(riskDirection)}</div>
        <div className="mt-1">Range: {lo == null ? 'Not available' : formatResearchValue(lo, indicatorKey)} – {hi == null ? 'Not available' : formatResearchValue(hi, indicatorKey)}</div>
        <div>{activeMeta.units} · denominator/reference: {activeMeta.denominator}</div>
        <div className="mt-1">Colors show relative within-study percentile categories, not clinical thresholds. Tied values share a category and some categories may be empty.</div>
        <div>Source: {activeMeta.source}</div>
        <div>Vintage: {activeMeta.vintage}</div>
        <div className="mt-1">{activeMeta.description}</div>
        {indicatorKey === 'nearest_hrsa_center_km' && <div className="mt-1 text-ink">Straight-line proximity only. It does not measure actual healthcare accessibility, travel time, transportation access, or service availability.</div>}
        {(activeMeta.kind === 'percentile' || activeMeta.kind === 'composite') && <div className="mt-1 text-ink">Exploratory descriptive score; not clinically validated and not a causal estimate.</div>}
      </div>

      <details className="mt-3 border-t border-hairline pt-2">
        <summary className="cursor-pointer font-medium text-ink">Observed ranges across study areas</summary>
        <p className="mt-1">Descriptive minimum and maximum values calculated from this bundle only. Missing values are excluded from the range and counted below; no significance or causal analysis is performed.</p>
        <div className="mt-2 overflow-x-auto">
          <table className="min-w-full border-collapse text-left" aria-label="Descriptive indicator ranges">
            <thead><tr className="border-b border-hairline"><th className="p-1">Indicator</th><th className="p-1">Minimum</th><th className="p-1">Maximum</th><th className="p-1">Missing</th></tr></thead>
            <tbody>{RESEARCH_INDICATORS.map((item) => {
              const key = item.key as ResearchIndicatorKey;
              const summary = summarizeResearchIndicator(areas, key);
              return <tr key={key} className="border-b border-hairline/60">
                <th className="p-1 font-normal text-ink">{item.label}<span className="block text-[9px] text-graphite">{item.kind === 'source' ? 'Public-source indicator' : item.kind === 'proximity' ? 'Derived proximity measure' : item.kind === 'composite' ? 'Exploratory composite' : 'Derived percentile'}</span></th>
                <td className="num p-1">{formatResearchValue(summary.minimum, key)}{summary.minimumZctas.length > 0 && <span className="block text-[9px]">ZCTA {summary.minimumZctas.join(', ')}</span>}</td>
                <td className="num p-1">{formatResearchValue(summary.maximum, key)}{summary.maximumZctas.length > 0 && <span className="block text-[9px]">ZCTA {summary.maximumZctas.join(', ')}</span>}</td>
                <td className="num p-1">{summary.missing} / {summary.total}</td>
              </tr>;
            })}</tbody>
          </table>
        </div>
      </details>

      <details className="mt-3 border-t border-hairline pt-2">
        <summary className="cursor-pointer font-medium text-ink">Method and interpretation</summary>
        <div className="mt-1 space-y-1.5">
          <p><b>Health prevalence:</b> three CDC PLACES crude prevalence estimates, 2025 release using 2023 BRFSS. They are modeled small-area estimates, not local case counts.</p>
          <p><b>Economic food insecurity:</b> CDC PLACES 2025 modeled adult prevalence estimate for 2023, displayed separately from geographic food access. It reflects adults reporting that food bought did not last and there was not enough money to buy more in the previous 12 months; it is not a direct household survey, a count of people, or a grocery-store distance measure.</p>
          <p><b>Socioeconomic conditions:</b> 2023 ACS five-year estimates (2019–2023). Poverty and no-vehicle rates are calculated from ACS counts and denominators documented in the research brief.</p>
          <p><b>Health insurance:</b> 2023 ACS five-year B27001 estimates for the civilian noninstitutionalized population. The uninsured estimate sums the 18 no-coverage cells; insured is the denominator minus uninsured. B27001 does not distinguish private from public coverage. These indicators are displayed separately and are not inputs to the composite.</p>
          <p><b>HRSA proximity:</b> great-circle straight-line distance from each ZCTA Gazetteer internal point to the nearest active site in the Health Center Service Delivery and Look-Alike Sites file. {indicatorMetadata(data.manifest, 'nearest_hrsa_center_km').vintage}. The published bundle stores kilometres; this display converts them to miles (mi). Distance alone does not establish service availability and is not driving distance or travel time.</p>
          <p><b>Percentile scores:</b> midrank percentiles are calculated within these 26 study areas. Health need is the equal mean of three prevalence percentiles; social disadvantage is the equal mean of poverty, no-vehicle, and reversed-income percentiles; the HRSA distance score ranks straight-line distance.</p>
          <p><b>Composite:</b> equal mean of the three domain scores. Every required input must be present; missing values remain missing, including income for ZCTA 43547. Scores are exploratory and descriptive.</p>
          <p>ZCTA-level patterns do not describe every resident and do not support individual-level or causal conclusions. Straight-line proximity is not actual healthcare accessibility or transportation access.</p>
        </div>
      </details>

      <form onSubmit={submitSearch} className="mt-3">
        <label htmlFor="research-area-search" className="font-medium text-ink">Find an area by ZCTA</label>
        <div className="mt-1 flex gap-1.5">
          <input id="research-area-search" list="research-zcta-options" value={search} maxLength={5} inputMode="numeric"
            onChange={(event) => { setSearch(event.target.value.replace(/\D/g, '')); setSearchError(null); }}
            placeholder="Five-digit ZCTA" className="num min-w-0 flex-1 rounded border border-hairline bg-surface px-2 py-1.5 text-ink" />
          <datalist id="research-zcta-options">{areas.map((area) => <option key={area.zcta5} value={area.zcta5}>{area.county_name}</option>)}</datalist>
          <button className="rounded border border-hairline bg-surface px-2 py-1 text-ink hover:text-accent">Find</button>
        </div>
        {searchError && <div role="alert" className="mt-1 text-accent">{searchError}</div>}
      </form>

      <section className="mt-3 border-t border-hairline pt-2" aria-label="Selected area details">
        <div className="flex items-center justify-between gap-2">
          <h2 className="font-medium text-ink">{selected ? `ZCTA ${selected.zcta5} · ${selected.county_name}` : 'Area details'}</h2>
          {selected && <button onClick={() => addCompare(selected.zcta5)} disabled={compareZctas.includes(selected.zcta5) || compareZctas.length >= 5}
            className="rounded border border-hairline px-2 py-1 disabled:opacity-50">{compareZctas.includes(selected.zcta5) ? 'Added to compare' : 'Compare area'}</button>}
        </div>
        {!selected ? <p className="mt-1">Search for a ZCTA or select a polygon to view the source values.</p> : (
          <div className="mt-1 space-y-1.5">
            {RESEARCH_INDICATORS.map((item) => {
              const key = item.key as ResearchIndicatorKey;
              const value = valueFor(selected, key);
              const meta = indicatorMetadata(data.manifest, key);
              return (
                <div key={key} className="border-b border-hairline/50 pb-1">
                  <div className="flex justify-between gap-2"><span className="text-ink">{item.label}</span><span className="num text-ink">{formatResearchValue(value, key)}</span></div>
                  <div>{meta.units} · denominator/reference: {meta.denominator}</div>
                  <div>{value == null ? (item.kind === 'source' ? 'Missing in source; not imputed' : item.kind === 'proximity' ? 'Not available from the recorded site inputs' : 'Not computed; required input is missing') : 'Available'}</div>
                  <div>{meta.source} · {meta.vintage}</div>
                  <div>{meta.description}</div>
                  {key === 'nearest_hrsa_center_km' && <div>Straight-line proximity only; not actual healthcare accessibility, travel time, transportation access, or service availability.</div>}
                </div>
              );
            })}
          </div>
        )}
      </section>

      {compareZctas.length > 0 && (
        <section className="mt-3 border-t border-hairline pt-2" aria-label="Area comparison">
          <div className="flex items-center justify-between">
            <h2 className="font-medium text-ink">Compare areas ({compared.length}/5)</h2>
            <button onClick={clearCompare} className="text-accent hover:underline">Clear</button>
          </div>
          <div className="mt-1 overflow-x-auto">
            <table className="min-w-full border-collapse text-left">
              <thead><tr><th className="sticky left-0 bg-surface p-1">Indicator</th>{compared.map((area) => (
                <th key={area.zcta5} className="min-w-[72px] p-1"><button onClick={() => select(area.zcta5, { fly: true })} className="text-accent hover:underline">{area.zcta5}</button><button aria-label={`Remove ${area.zcta5} from comparison`} onClick={() => removeCompare(area.zcta5)} className="ml-1 text-graphite">×</button></th>
              ))}</tr></thead>
              <tbody>{RESEARCH_INDICATORS.map((item) => {
                const key = item.key as ResearchIndicatorKey;
                const meta = indicatorMetadata(data.manifest, key);
                return <tr key={key} className="border-t border-hairline/60"><th className="sticky left-0 bg-surface p-1 font-normal text-graphite"><span className="text-ink">{item.label}</span><span className="block text-[9px]">{item.kind === 'source' ? 'Public-source indicator' : item.kind === 'proximity' ? 'Derived proximity measure' : item.kind === 'composite' ? 'Exploratory composite' : 'Derived percentile'} · {meta.units} · denominator/reference: {meta.denominator} · {meta.source} · {meta.vintage}</span></th>{compared.map((area) => <td key={area.zcta5} className="num p-1 text-ink">{formatResearchValue(valueFor(area, key), key)}</td>)}</tr>;
              })}</tbody>
            </table>
          </div>
        </section>
      )}

      <p className="mt-3 border-t border-hairline pt-2 text-[10px]">ZCTAs are Census statistical areas, not USPS ZIP Codes; their full boundaries may extend outside Lucas County. All findings here are descriptive. The composite is exploratory, missing values remain missing, and this research data is separate from synthetic demo mode.</p>
    </aside>
  );
}
