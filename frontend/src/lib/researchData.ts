import type { RiskDirection } from './researchRisk';

export interface ResearchFeature {
  type: 'Feature';
  properties: Record<string, unknown>;
  geometry: { type: 'Polygon' | 'MultiPolygon'; coordinates: unknown };
}
export interface FeatureCollection {
  type: 'FeatureCollection';
  features: ResearchFeature[];
}

export const RESEARCH_PATHS = {
  metrics: '/ohio-research/metrics.json',
  geometry: '/ohio-research/study_areas.geojson',
  manifest: '/ohio-research/manifest.json',
} as const;

interface ResearchIndicatorDefinition {
  key: string;
  label: string;
  source: string;
  units: string;
  vintage: string;
  description: string;
  kind: 'source' | 'proximity' | 'percentile' | 'composite';
  format: 'percent' | 'count' | 'currency' | 'distance' | 'score';
}

const OPTIONAL_RESEARCH_INDICATORS = new Set([
  'foodinsecu_pct', 'insured_population_count', 'uninsured_population_count',
  'insured_population_pct', 'uninsured_population_pct',
]);

export const RESEARCH_INDICATORS = [
  { key: 'diabetes_pct', label: 'Diabetes prevalence estimate', source: 'CDC PLACES', units: '% of adults', vintage: '2025 release · 2023 BRFSS', description: 'CDC small-area crude prevalence estimate; not a local clinical case count.', kind: 'source', format: 'percent' },
  { key: 'high_blood_pressure_pct', label: 'High blood pressure prevalence estimate', source: 'CDC PLACES', units: '% of adults', vintage: '2025 release · 2023 BRFSS', description: 'CDC small-area crude prevalence estimate; not a local clinical case count.', kind: 'source', format: 'percent' },
  { key: 'depression_pct', label: 'Depression prevalence estimate', source: 'CDC PLACES', units: '% of adults', vintage: '2025 release · 2023 BRFSS', description: 'CDC small-area crude prevalence estimate; not a local clinical case count.', kind: 'source', format: 'percent' },
  { key: 'foodinsecu_pct', label: 'Adult food insecurity', source: 'CDC PLACES 2025', units: '% of adults', vintage: '2025 release · 2023 estimate · 2020 ZCTAs', description: 'Model-based percentage of adults reporting that food bought did not last and there was not enough money to buy more during the previous 12 months. Modeled adult prevalence, not a direct household survey or count of people.', kind: 'source', format: 'percent' },
  { key: 'median_household_income_usd', label: 'Median household income', source: 'U.S. Census ACS', units: '2023 inflation-adjusted USD', vintage: '2023 ACS 5-year · 2019–2023 · 2020 ZCTAs', description: 'ACS estimate of median household income. A missing estimate remains unavailable; it is not zero or imputed.', kind: 'source', format: 'currency' },
  { key: 'poverty_rate_pct', label: 'Population below poverty level', source: 'U.S. Census ACS', units: '% of poverty universe', vintage: '2023 ACS 5-year · 2019–2023 · 2020 ZCTAs', description: 'Calculated from ACS counts: people below poverty divided by the poverty-universe population.', kind: 'source', format: 'percent' },
  { key: 'no_vehicle_household_rate_pct', label: 'Occupied households with no vehicle', source: 'U.S. Census ACS', units: '% of occupied households', vintage: '2023 ACS 5-year · 2019–2023 · 2020 ZCTAs', description: 'Calculated from ACS counts of owner- and renter-occupied households with no vehicle, divided by occupied households; not a measure of transit service or a person’s travel options.', kind: 'source', format: 'percent' },
  { key: 'insured_population_count', label: 'Insured population', source: 'U.S. Census ACS B27001', units: 'ACS estimate · civilian noninstitutionalized population', vintage: '2023 ACS 5-year · 2019–2023 · 2020 ZCTAs', description: 'ACS estimate calculated as the civilian noninstitutionalized population minus the sum of the 18 no-health-insurance estimate cells. B27001 does not distinguish private from public coverage.', kind: 'source', format: 'count' },
  { key: 'uninsured_population_count', label: 'Uninsured population', source: 'U.S. Census ACS B27001', units: 'ACS estimate · civilian noninstitutionalized population', vintage: '2023 ACS 5-year · 2019–2023 · 2020 ZCTAs', description: 'ACS estimate calculated as the sum of the 18 B27001 no-health-insurance estimate cells; denominator context is the civilian noninstitutionalized population. B27001 does not distinguish private from public coverage.', kind: 'source', format: 'count' },
  { key: 'insured_population_pct', label: 'Insured population (%)', source: 'U.S. Census ACS B27001', units: '% of civilian noninstitutionalized population', vintage: '2023 ACS 5-year · 2019–2023 · 2020 ZCTAs', description: 'Calculated insured population estimate divided by B27001_001E, the civilian noninstitutionalized population estimate. B27001 does not distinguish private from public coverage.', kind: 'source', format: 'percent' },
  { key: 'uninsured_population_pct', label: 'Uninsured population (%)', source: 'U.S. Census ACS B27001', units: '% of civilian noninstitutionalized population', vintage: '2023 ACS 5-year · 2019–2023 · 2020 ZCTAs', description: 'Sum of the 18 B27001 no-health-insurance estimate cells divided by B27001_001E, the civilian noninstitutionalized population estimate. B27001 does not distinguish private from public coverage.', kind: 'source', format: 'percent' },
  { key: 'nearest_hrsa_center_km', label: 'Distance to nearest HRSA center (mi)', source: 'HRSA Health Center Service Delivery and Look-Alike Sites', units: 'miles (mi) · straight-line', vintage: 'Retrieval date unavailable; publisher file may be republished in place', description: 'Great-circle straight-line distance from the 2020 Census Gazetteer internal point to the nearest active HRSA site, displayed in miles (mi). The approved source bundle stores the calculated value in kilometres. This is proximity only, not actual healthcare accessibility, driving distance, travel time, transportation access, or service availability.', kind: 'proximity', format: 'distance' },
  { key: 'health_need_score', label: 'Health-need percentile score', source: 'Derived from CDC PLACES indicators', units: 'within-study-area midrank percentile, 0–100', vintage: 'Calculated over the 26 Lucas County study ZCTAs', description: 'Equal mean of within-study-area midrank percentiles for the three PLACES prevalence estimates; a derived exploratory score.', kind: 'percentile', format: 'score' },
  { key: 'social_disadvantage_score', label: 'Social-disadvantage percentile score', source: 'Derived from ACS indicators', units: 'within-study-area midrank percentile, 0–100', vintage: 'Calculated over the 26 Lucas County study ZCTAs', description: 'Equal mean of poverty, no-vehicle-household, and reversed median-income percentiles; unavailable if any required input is missing.', kind: 'percentile', format: 'score' },
  { key: 'healthcare_access_barrier_score', label: 'HRSA distance percentile score', source: 'Derived from HRSA distance', units: 'within-study-area midrank percentile, 0–100', vintage: 'Calculated over the 26 Lucas County study ZCTAs', description: 'Percentile of straight-line distance to the nearest active HRSA site. It describes relative distance in this study set, not healthcare accessibility.', kind: 'percentile', format: 'score' },
  { key: 'exploratory_composite_score', label: 'Exploratory composite score', source: 'Derived; equal-weight domain mean', units: 'within-study-area score, 0–100', vintage: 'Calculated over the 26 Lucas County study ZCTAs', description: 'Equal mean of the three domain percentile scores. Exploratory and descriptive, not clinically validated; unavailable if a required domain is missing.', kind: 'composite', format: 'score' },
] as const satisfies readonly ResearchIndicatorDefinition[];

export type ResearchIndicatorKey = (typeof RESEARCH_INDICATORS)[number]['key'];
export type ResearchValue = number | string | null;

export const RESEARCH_DENOMINATORS: Record<ResearchIndicatorKey, string> = {
  diabetes_pct: 'Adults aged 18 years and older; modeled PLACES prevalence estimate',
  high_blood_pressure_pct: 'Adults aged 18 years and older; modeled PLACES prevalence estimate',
  depression_pct: 'Adults aged 18 years and older; modeled PLACES prevalence estimate',
  foodinsecu_pct: 'Adults aged 18 years and older; modeled PLACES prevalence estimate',
  median_household_income_usd: 'Not a rate; ACS median household income estimate',
  poverty_rate_pct: 'ACS poverty universe (B17001_001E)',
  no_vehicle_household_rate_pct: 'Occupied households (B25044_001E)',
  insured_population_count: 'ACS civilian noninstitutionalized population (B27001_001E)',
  uninsured_population_count: 'ACS civilian noninstitutionalized population (B27001_001E)',
  insured_population_pct: 'ACS civilian noninstitutionalized population (B27001_001E)',
  uninsured_population_pct: 'ACS civilian noninstitutionalized population (B27001_001E)',
  nearest_hrsa_center_km: 'Not applicable; distance from a ZCTA internal point to the nearest active HRSA site',
  health_need_score: 'Within-study midrank reference; component-specific valid ZCTAs',
  social_disadvantage_score: 'Within-study midrank reference; income is missing for 1 of 26 ZCTAs',
  healthcare_access_barrier_score: 'Within-study midrank reference; 26 Lucas County ZCTAs',
  exploratory_composite_score: '25 complete ZCTAs; within-study domain percentile scores',
};

export const RESEARCH_RISK_DIRECTIONS = {
  diabetes_pct: 'higher',
  high_blood_pressure_pct: 'higher',
  depression_pct: 'higher',
  foodinsecu_pct: 'higher',
  median_household_income_usd: 'lower',
  poverty_rate_pct: 'higher',
  no_vehicle_household_rate_pct: 'higher',
  insured_population_count: 'lower',
  uninsured_population_count: 'higher',
  insured_population_pct: 'lower',
  uninsured_population_pct: 'higher',
  nearest_hrsa_center_km: 'higher',
  health_need_score: 'higher',
  social_disadvantage_score: 'higher',
  healthcare_access_barrier_score: 'higher',
  exploratory_composite_score: 'higher',
} as const satisfies Record<ResearchIndicatorKey, RiskDirection>;

export function researchRiskDirection(key: ResearchIndicatorKey): RiskDirection {
  return RESEARCH_RISK_DIRECTIONS[key];
}

export interface ResearchArea {
  zcta5: string;
  county_fips: string;
  county_name: string;
  centroid_lat: number;
  centroid_lon: number;
  [key: string]: ResearchValue | unknown;
}

export interface ResearchManifest {
  study: { name: string; county_fips: string; zcta_geography: string };
  sources: Record<string, Record<string, unknown>>;
  row_count: number;
  missingness: Record<string, { missing: number; total: number; fraction: number }>;
  composite: { formula: string; interpretation: string; complete_composites: number; score_range: [number | null, number | null] };
  [key: string]: unknown;
}

export interface ResearchLoadedData {
  areas: Map<string, ResearchArea>;
  overview: FeatureCollection;
  centroids: Map<string, [number, number]>;
  bounds: [[number, number], [number, number]];
  manifest: ResearchManifest;
}

export interface ResearchIndicatorSummary {
  total: number;
  available: number;
  missing: number;
  minimum: number | null;
  minimumZctas: string[];
  maximum: number | null;
  maximumZctas: string[];
}

function isFiniteNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value);
}

function geoBounds(features: FeatureCollection['features']): [[number, number], [number, number]] {
  let minLon = Infinity, minLat = Infinity, maxLon = -Infinity, maxLat = -Infinity;
  const walk = (coordinates: unknown) => {
    if (Array.isArray(coordinates) && typeof coordinates[0] === 'number' && typeof coordinates[1] === 'number') {
      const lon = coordinates[0] as number, lat = coordinates[1] as number;
      if (!Number.isFinite(lon) || !Number.isFinite(lat)) throw new Error('Research boundary has non-finite coordinates');
      minLon = Math.min(minLon, lon); minLat = Math.min(minLat, lat);
      maxLon = Math.max(maxLon, lon); maxLat = Math.max(maxLat, lat);
    } else if (Array.isArray(coordinates)) coordinates.forEach(walk);
  };
  features.forEach((feature) => walk(feature.geometry.coordinates));
  if (![minLon, minLat, maxLon, maxLat].every(Number.isFinite)) throw new Error('Research boundary has no coordinates');
  return [[minLon, minLat], [maxLon, maxLat]];
}

export function parseResearchBundle(rawMetrics: unknown, rawGeometry: unknown, rawManifest: unknown): ResearchLoadedData {
  const metricsDoc = rawMetrics as { mode?: unknown; rows?: unknown };
  const manifest = rawManifest as ResearchManifest;
  const geojson = rawGeometry as FeatureCollection;
  if (metricsDoc?.mode !== 'ohio_research') throw new Error('Research bundle mode marker is missing or invalid');
  if (!Array.isArray(metricsDoc.rows)) throw new Error('Research metrics rows are missing');
  if (manifest?.study?.county_fips !== '39095') throw new Error('Research manifest is not the validated Lucas County bundle');
  if (!Number.isInteger(manifest.row_count) || manifest.row_count !== metricsDoc.rows.length) {
    throw new Error('Research manifest row count does not match metrics');
  }
  if (geojson?.type !== 'FeatureCollection' || !Array.isArray(geojson.features)) {
    throw new Error('Research study-area GeoJSON is invalid');
  }
  if (geojson.features.length !== metricsDoc.rows.length) throw new Error('Research geometry and metrics row counts differ');

  const areas = new Map<string, ResearchArea>();
  for (const raw of metricsDoc.rows) {
    if (!raw || typeof raw !== 'object') throw new Error('Research metrics contain an invalid row');
    const row = { ...raw } as ResearchArea;
    if (typeof row.zcta5 !== 'string' || !/^\d{5}$/.test(row.zcta5)) throw new Error('Research ZCTA identifiers must be five-digit strings');
    if (areas.has(row.zcta5)) throw new Error(`Research metrics contain duplicate ZCTA ${row.zcta5}`);
    if (!isFiniteNumber(row.centroid_lat) || !isFiniteNumber(row.centroid_lon)) throw new Error(`Research centroid is invalid for ${row.zcta5}`);
    for (const { key } of RESEARCH_INDICATORS) {
      const value = row[key];
      if (value === undefined && OPTIONAL_RESEARCH_INDICATORS.has(key)) {
        row[key] = null;
        continue;
      }
      if (value !== null && !isFiniteNumber(value)) throw new Error(`Research indicator ${key} is invalid for ${row.zcta5}`);
    }
    areas.set(row.zcta5, row);
  }

  const featureIds = new Set<string>();
  for (const feature of geojson.features) {
    const id = feature?.properties?.zcta5;
    if (typeof id !== 'string' || !/^\d{5}$/.test(id)) throw new Error('Research GeoJSON contains an invalid ZCTA identifier');
    if (featureIds.has(id)) throw new Error(`Research GeoJSON contains duplicate ZCTA ${id}`);
    featureIds.add(id);
    if (!areas.has(id)) throw new Error(`Research geometry has no metrics row for ZCTA ${id}`);
    if (!['Polygon', 'MultiPolygon'].includes(feature.geometry?.type)) throw new Error(`Research geometry is not polygonal for ZCTA ${id}`);
  }
  if (featureIds.size !== areas.size) throw new Error('Research geometry and metric ZCTA sets differ');

  const centroids = new Map<string, [number, number]>();
  for (const [zcta5, row] of areas) centroids.set(zcta5, [row.centroid_lon, row.centroid_lat]);
  // Retain the trusted Census polygons and their full properties; no geometry is synthesized here.
  return { areas, overview: geojson, centroids, bounds: geoBounds(geojson.features), manifest };
}

export async function loadResearchData(): Promise<ResearchLoadedData> {
  const [metricsResponse, geometryResponse, manifestResponse] = await Promise.all([
    fetch(RESEARCH_PATHS.metrics), fetch(RESEARCH_PATHS.geometry), fetch(RESEARCH_PATHS.manifest),
  ]);
  for (const [name, response] of [['metrics', metricsResponse], ['geometry', geometryResponse], ['manifest', manifestResponse]] as const) {
    if (!response.ok) throw new Error(`Ohio research ${name} bundle returned HTTP ${response.status}`);
  }
  const [metrics, geometry, manifest] = await Promise.all([
    metricsResponse.json(), geometryResponse.json(), manifestResponse.json(),
  ]);
  return parseResearchBundle(metrics, geometry, manifest);
}

export function researchValue(area: ResearchArea, key: ResearchIndicatorKey): number | null {
  const value = area[key];
  return isFiniteNumber(value) ? value : null;
}

/** Read-only descriptive summary of the values already present in a loaded research bundle. */
export function summarizeResearchIndicator(
  areas: Iterable<ResearchArea>,
  key: ResearchIndicatorKey,
): ResearchIndicatorSummary {
  const rows = [...areas];
  const available = rows
    .map((area) => ({ zcta5: area.zcta5, value: researchValue(area, key) }))
    .filter((item): item is { zcta5: string; value: number } => item.value !== null);
  if (!available.length) {
    return { total: rows.length, available: 0, missing: rows.length, minimum: null, minimumZctas: [], maximum: null, maximumZctas: [] };
  }
  const minimum = Math.min(...available.map((item) => item.value));
  const maximum = Math.max(...available.map((item) => item.value));
  return {
    total: rows.length,
    available: available.length,
    missing: rows.length - available.length,
    minimum,
    minimumZctas: available.filter((item) => item.value === minimum).map((item) => item.zcta5).sort(),
    maximum,
    maximumZctas: available.filter((item) => item.value === maximum).map((item) => item.zcta5).sort(),
  };
}

export function formatResearchValue(value: number | null, indicator: ResearchIndicatorKey): string {
  if (value == null || !Number.isFinite(value)) return 'Not available';
  const format = RESEARCH_INDICATORS.find((item) => item.key === indicator)!.format;
  if (format === 'currency') return new Intl.NumberFormat('en-US', {
    style: 'currency', currency: 'USD', maximumFractionDigits: 0,
  }).format(value);
  if (format === 'distance') return `${(value * 0.621371192237334).toFixed(2)} mi`;
  if (format === 'score') return `${value.toFixed(1)} / 100`;
  if (format === 'count') return new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(value);
  return `${value.toFixed(1)}%`;
}

export function indicatorMetadata(manifest: ResearchManifest, key: ResearchIndicatorKey): {
  key: ResearchIndicatorKey;
  label: string;
  source: string;
  units: string;
  vintage: string;
  description: string;
  kind: 'source' | 'proximity' | 'percentile' | 'composite';
  format: 'percent' | 'count' | 'currency' | 'distance' | 'score';
  denominator: string;
  riskDirection: RiskDirection;
} {
  const definition = RESEARCH_INDICATORS.find((indicator) => indicator.key === key)!;
  let source: string = definition.source;
  let vintage: string = definition.vintage;
  if (key === 'diabetes_pct' || key === 'high_blood_pressure_pct' || key === 'depression_pct' || key === 'foodinsecu_pct') {
    const places = manifest.sources.cdc_places_values;
    source = String(places?.dataset_name ?? source);
    vintage = `${String(places?.release ?? vintage)} · 2023 estimate · 2020 ZCTAs`;
  } else if (key === 'median_household_income_usd' || key === 'poverty_rate_pct' || key === 'no_vehicle_household_rate_pct'
    || key === 'insured_population_count' || key === 'uninsured_population_count'
    || key === 'insured_population_pct' || key === 'uninsured_population_pct') {
    const acs = manifest.sources.acs_values;
    source = 'U.S. Census American Community Survey';
    vintage = `${String(acs?.release ?? vintage)} · 2020 ZCTAs`;
  } else if (key === 'nearest_hrsa_center_km') {
    const hrsa = manifest.sources.hrsa_health_centers;
    source = String(hrsa?.source ?? source);
    const retrieved = hrsa?.retrieved_utc;
    const date = formatUtcRetrievalDate(retrieved);
    if (date) {
      vintage = `Retrieved ${date}; publisher file may be republished in place`;
    }
  }
  return {
    key: definition.key,
    label: definition.label,
    source,
    units: definition.units,
    vintage,
    description: definition.description,
    denominator: RESEARCH_DENOMINATORS[key],
    kind: definition.kind,
    format: definition.format,
    riskDirection: researchRiskDirection(key),
  };
}

function formatUtcRetrievalDate(value: unknown): string | null {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}T/.test(value)) return null;
  const timestamp = new Date(value);
  if (!Number.isFinite(timestamp.getTime())) return null;
  const [year, month, day] = value.slice(0, 10).split('-').map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  if (date.toISOString().slice(0, 10) !== value.slice(0, 10)) return null;
  return new Intl.DateTimeFormat('en-US', {
    timeZone: 'UTC', month: 'long', day: 'numeric', year: 'numeric',
  }).format(date);
}
