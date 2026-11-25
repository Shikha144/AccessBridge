import { afterEach, describe, expect, it, vi } from 'vitest';
import { readFileSync } from 'node:fs';
import {
  formatResearchValue, indicatorMetadata, loadResearchData, parseResearchBundle, RESEARCH_INDICATORS,
  RESEARCH_PATHS, summarizeResearchIndicator, type ResearchArea,
} from './researchData';

const row = {
  zcta5: '04301', county_fips: '39095', county_name: 'Lucas County',
  centroid_lat: 41.5, centroid_lon: -83.6,
  diabetes_pct: 10, high_blood_pressure_pct: 30, depression_pct: 20,
  median_household_income_usd: null, poverty_rate_pct: 15,
  no_vehicle_household_rate_pct: 5, nearest_hrsa_center_km: 1.25,
  health_need_score: 50, social_disadvantage_score: null,
  healthcare_access_barrier_score: 50, exploratory_composite_score: null,
};
const metrics = { mode: 'ohio_research', label: 'Ohio research bundle', rows: [row] };
const geometry = {
  type: 'FeatureCollection',
  features: [{ type: 'Feature', properties: { zcta5: '04301' },
    geometry: { type: 'Polygon', coordinates: [[[-83.7, 41.4], [-83.5, 41.4], [-83.5, 41.6], [-83.7, 41.4]]] } }],
};
const manifest = {
  study: { name: 'Lucas County, Ohio', county_fips: '39095', zcta_geography: '2020 ZCTAs' },
  sources: { cdc_places_values: {}, acs_values: {}, hrsa_health_centers: {} },
  row_count: 1, missingness: {}, composite: { formula: 'documented formula', interpretation: 'Exploratory', complete_composites: 0, score_range: [null, null] as [number | null, number | null] },
};

describe('Ohio research bundle loading', () => {
  afterEach(() => vi.unstubAllGlobals());

  it('parses authentic polygon features and preserves null source values', () => {
    const data = parseResearchBundle(metrics, geometry, manifest);
    expect(data.areas.size).toBe(1);
    expect(data.centroids.get('04301')).toEqual([-83.6, 41.5]);
    expect(data.areas.get('04301')?.median_household_income_usd).toBeNull();
    expect(data.bounds).toEqual([[-83.7, 41.4], [-83.5, 41.6]]);
  });

  it('rejects a mixed or mismatched demo bundle', () => {
    expect(() => parseResearchBundle({ ...metrics, mode: 'demo' }, geometry, manifest)).toThrow(/mode marker/);
    expect(() => parseResearchBundle(metrics, { ...geometry, features: [] }, manifest)).toThrow(/row counts differ/);
  });

  it('rejects non-five-digit IDs and missing indicator fields without imputing', () => {
    expect(() => parseResearchBundle({ ...metrics, rows: [{ ...row, zcta5: '4301' }] }, geometry, manifest)).toThrow(/five-digit strings/);
    const missingColumn = { ...row } as Record<string, unknown>;
    delete missingColumn.diabetes_pct;
    expect(() => parseResearchBundle({ ...metrics, rows: [missingColumn] }, geometry, manifest)).toThrow(/indicator diabetes_pct/);
  });

  it('loads the three research assets from their separate public paths', async () => {
    const bodies = [metrics, geometry, manifest];
    const fetchMock = vi.fn(async (_url: string) => ({ ok: true, json: async () => bodies.shift() }));
    vi.stubGlobal('fetch', fetchMock);
    const data = await loadResearchData();
    expect(fetchMock.mock.calls.map((call) => call[0])).toEqual(Object.values(RESEARCH_PATHS));
    expect(data.areas.get('04301')?.exploratory_composite_score).toBeNull();
    expect(RESEARCH_INDICATORS).toHaveLength(16);
    expect(data.areas.get('04301')?.foodinsecu_pct).toBeNull();
    expect(data.areas.get('04301')?.insured_population_count).toBeNull();
  });

  it('fails closed when any research asset is unavailable', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => ({ ok: false, status: 404, json: async () => ({}) })));
    await expect(loadResearchData()).rejects.toThrow(/HTTP 404/);
  });

  it('derives descriptive ranges and preserves the approved missing-income ZCTA', () => {
    const actual = JSON.parse(readFileSync(new URL('../../public/ohio-research/metrics.json', import.meta.url), 'utf8')) as { rows: ResearchArea[] };
    expect(actual.rows).toHaveLength(26);
    const income = summarizeResearchIndicator(actual.rows, 'median_household_income_usd');
    expect(income).toMatchObject({ total: 26, available: 25, missing: 1, minimum: 18980, minimumZctas: ['43604'], maximum: 167321, maximumZctas: ['43542'] });
    const missingArea = actual.rows.find((area) => area.zcta5 === '43547');
    expect(missingArea?.median_household_income_usd).toBeNull();
    expect(missingArea?.social_disadvantage_score).toBeNull();
    expect(missingArea?.exploratory_composite_score).toBeNull();
    expect(summarizeResearchIndicator(actual.rows, 'exploratory_composite_score').missing).toBe(1);
  });

  it('labels HRSA date as the retrieval date, not a pinned release vintage', () => {
    const actualManifest = JSON.parse(readFileSync(new URL('../../public/ohio-research/manifest.json', import.meta.url), 'utf8'));
    const metadata = indicatorMetadata(actualManifest, 'nearest_hrsa_center_km');
    expect(metadata.source).toMatch(/HRSA Health Center Service Delivery/);
    expect(actualManifest.sources.hrsa_health_centers.retrieved_utc).toBe('2026-11-11T23:33:37.567223+00:00');
    expect(metadata.vintage).toBe('Retrieved November 11, 2026; publisher file may be republished in place');
  });

  it('uses a neutral retrieval-date label when HRSA retrieval metadata is missing or invalid', () => {
    const hrsa = { source: 'HRSA Health Center Service Delivery and Look-Alike Sites' };
    const missingDate = indicatorMetadata({
      ...manifest,
      sources: { ...manifest.sources, hrsa_health_centers: hrsa },
    }, 'nearest_hrsa_center_km');
    expect(missingDate.vintage).toBe('Retrieval date unavailable; publisher file may be republished in place');

    const invalidDate = indicatorMetadata({
      ...manifest,
      sources: { ...manifest.sources, hrsa_health_centers: { ...hrsa, retrieved_utc: '2026-02-31T23:33:37Z' } },
    }, 'nearest_hrsa_center_km');
    expect(invalidDate.vintage).toBe('Retrieval date unavailable; publisher file may be republished in place');
    expect(invalidDate.vintage).not.toContain('October 27, 2026');
  });

  it('converts stored kilometre distances to miles only for display and preserves missing values', () => {
    const storedDistanceKm = 2.552;
    const sourceRow = { ...row, nearest_hrsa_center_km: storedDistanceKm };
    expect(formatResearchValue(sourceRow.nearest_hrsa_center_km, 'nearest_hrsa_center_km')).toBe('1.59 mi');
    expect(sourceRow.nearest_hrsa_center_km).toBe(2.552);
    expect(formatResearchValue(null, 'nearest_hrsa_center_km')).toBe('Not available');
  });

  it('formats population counts separately from prevalence percentages', () => {
    expect(formatResearchValue(12345, 'insured_population_count')).toBe('12,345');
    expect(formatResearchValue(18, 'uninsured_population_count')).toBe('18');
    expect(formatResearchValue(92.456, 'insured_population_pct')).toBe('92.5%');
    expect(formatResearchValue(12.5, 'foodinsecu_pct')).toBe('12.5%');
  });

  it('documents food insecurity and insurance sources, geography, denominator, and limits', () => {
    const food = indicatorMetadata({
      ...manifest,
      sources: { ...manifest.sources, cdc_places_values: {
        dataset_name: 'CDC PLACES 2025', release: '2025 release; selected measures use 2023 BRFSS',
      } },
    }, 'foodinsecu_pct');
    expect(food.label).toBe('Adult food insecurity');
    expect(food.source).toBe('CDC PLACES 2025');
    expect(food.vintage).toContain('2023 estimate');
    expect(food.vintage).toContain('2020 ZCTAs');
    expect(food.description).toMatch(/food bought did not last/);
    expect(food.description).toMatch(/not a direct household survey/);
    expect(food.units).toBe('% of adults');

    const insurance = indicatorMetadata({
      ...manifest,
      sources: { ...manifest.sources, acs_values: { release: '2023 ACS 5-year estimates (2019-2023 period)' } },
    }, 'uninsured_population_pct');
    expect(insurance.source).toBe('U.S. Census American Community Survey');
    expect(insurance.vintage).toContain('2019-2023 period');
    expect(insurance.vintage).toContain('2020 ZCTAs');
    expect(insurance.description).toMatch(/civilian noninstitutionalized population/);
    expect(insurance.description).toMatch(/does not distinguish private from public coverage/);
  });

  it('formats converted distance ranges in miles while retaining kilometre summary values', () => {
    const rows = [
      { ...row, zcta5: '04301', nearest_hrsa_center_km: 2.552 },
      { ...row, zcta5: '04302', nearest_hrsa_center_km: 10 },
    ];
    const summary = summarizeResearchIndicator(rows, 'nearest_hrsa_center_km');
    expect(summary.minimum).toBe(2.552);
    expect(summary.maximum).toBe(10);
    expect(formatResearchValue(summary.minimum, 'nearest_hrsa_center_km')).toBe('1.59 mi');
    expect(formatResearchValue(summary.maximum, 'nearest_hrsa_center_km')).toBe('6.21 mi');
  });
});
