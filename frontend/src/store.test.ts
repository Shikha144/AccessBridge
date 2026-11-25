import { describe, it, expect, vi, afterEach } from 'vitest';
import { readInitialDataMode, useStore } from './store';
import { SUBSCORE_LAZY_COLS, type SlimMetric } from './lib/types';
import { COMPOSITE_METRIC } from './lib/types';
import { RESEARCH_INDICATORS, RESEARCH_PATHS } from './lib/researchData';

// T8: sub-score lens columns (subscores.json) load lazily on first sub-score metric select and are
// merged onto the already-loaded SlimMetric records. Assert the merge + one-time-fetch caching.
describe('ensureSubscoreColumns (T8 lazy sub-score merge)', () => {
  afterEach(() => vi.unstubAllGlobals());

  it('fetches subscores.json once and merges its columns onto the records', async () => {
    const subs: Record<string, unknown> = { n: 2, zcta5: ['00001', '00002'] };
    for (const c of SUBSCORE_LAZY_COLS) subs[c] = [11, 22];
    const fetchMock = vi.fn(async () => ({ ok: true, json: async () => subs }));
    vi.stubGlobal('fetch', fetchMock);

    useStore.setState({
      metrics: new Map([
        ['00001', { zcta5: '00001' } as unknown as SlimMetric],
        ['00002', { zcta5: '00002' } as unknown as SlimMetric],
      ]),
      subscoresStatus: 'idle',
    });

    await useStore.getState().ensureSubscoreColumns();
    await useStore.getState().ensureSubscoreColumns(); // second call reuses the cached promise

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock).toHaveBeenCalledWith('/subscores.json');
    expect(useStore.getState().subscoresStatus).toBe('ready');
    const m = useStore.getState().metrics;
    expect(m.get('00001')?.insurance_pctile).toBe(11);
    expect(m.get('00002')?.life_expectancy_pctile).toBe(22);
  });
});

describe('demo and Ohio research data-mode separation', () => {
  afterEach(() => vi.unstubAllGlobals());

  const researchBundle = () => {
    const row: Record<string, unknown> = {
      zcta5: '04301', county_fips: '39095', county_name: 'Lucas County', centroid_lat: 41.5, centroid_lon: -83.6,
    };
    for (const indicator of RESEARCH_INDICATORS) row[indicator.key] = indicator.key === 'median_household_income_usd' ? null : 10;
    return {
      [RESEARCH_PATHS.metrics]: { mode: 'ohio_research', rows: [row] },
      [RESEARCH_PATHS.geometry]: { type: 'FeatureCollection', features: [{ type: 'Feature', properties: { zcta5: '04301' },
        geometry: { type: 'Polygon', coordinates: [[[-83.7, 41.4], [-83.5, 41.4], [-83.5, 41.6], [-83.7, 41.4]]] } }] },
      [RESEARCH_PATHS.manifest]: { study: { name: 'Lucas County', county_fips: '39095', zcta_geography: '2020 ZCTA' },
        sources: {}, row_count: 1, missingness: {}, composite: { formula: 'exploratory', interpretation: 'Exploratory', complete_composites: 0, score_range: [null, null] } },
    };
  };

  it('keeps demo metrics separate while research data loads, and restores demo mode cleanly', async () => {
    const demoMetric = { zcta5: '99999' } as unknown as SlimMetric;
    const demoMetrics = new Map([[demoMetric.zcta5, demoMetric]]);
    const demoOverview = { type: 'FeatureCollection' as const, features: [] };
    useStore.setState({ dataMode: 'demo', researchLoadStatus: 'idle', researchModeError: null, researchData: null,
      metrics: demoMetrics, overview: demoOverview, bounds: [[-100, 30], [-90, 40]] });
    const bundle = researchBundle();
    vi.stubGlobal('fetch', vi.fn(async (url: string) => ({ ok: true, status: 200, json: async () => bundle[url as keyof typeof bundle] })));

    await useStore.getState().setDataMode('ohio_research');
    expect(useStore.getState().dataMode).toBe('ohio_research');
    expect(useStore.getState().researchData?.areas.has('04301')).toBe(true);
    expect(useStore.getState().metrics).toBe(demoMetrics);
    expect(useStore.getState().overview).toBe(demoOverview);

    await useStore.getState().setDataMode('demo');
    expect(useStore.getState().dataMode).toBe('demo');
    expect(useStore.getState().metric).toBe(COMPOSITE_METRIC);
    expect(useStore.getState().metrics).toBe(demoMetrics);
    expect(useStore.getState().researchData?.areas.has('04301')).toBe(true);
  });

  it('fails visibly to demo mode when the research bundle cannot load', async () => {
    const demoMetric = { zcta5: '99999' } as unknown as SlimMetric;
    const demoMetrics = new Map([[demoMetric.zcta5, demoMetric]]);
    useStore.setState({ dataMode: 'demo', researchLoadStatus: 'idle', researchModeError: null, researchData: null,
      metrics: demoMetrics });
    vi.stubGlobal('fetch', vi.fn(async () => ({ ok: false, status: 404, json: async () => ({}) })));

    await useStore.getState().setDataMode('ohio_research');
    expect(useStore.getState().dataMode).toBe('demo');
    expect(useStore.getState().researchLoadStatus).toBe('error');
    expect(useStore.getState().researchModeError).toMatch(/HTTP 404/);
    expect(useStore.getState().metrics).toBe(demoMetrics);
  });

  it('loads Ohio research directly without requesting national demo assets', async () => {
    const bundle = researchBundle();
    const fetchMock = vi.fn(async (url: string) => ({
      ok: true, status: 200, json: async () => bundle[url as keyof typeof bundle],
    }));
    vi.stubGlobal('fetch', fetchMock);
    useStore.setState({ dataMode: 'ohio_research', status: 'loading', researchData: null,
      researchLoadStatus: 'idle', researchModeError: null });

    await useStore.getState().load();

    expect(useStore.getState().dataMode).toBe('ohio_research');
    expect(useStore.getState().status).toBe('ready');
    expect(fetchMock.mock.calls.map(([url]) => url).sort()).toEqual(Object.values(RESEARCH_PATHS).sort());
    expect(readInitialDataMode('?mode=ohio_research')).toBe('ohio_research');
    expect(readInitialDataMode('')).toBe('demo');
  });
});
