import { afterEach, describe, expect, it } from 'vitest';
import { fireEvent, render, screen, within } from '@testing-library/react';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import ResearchModePanel from './ResearchModePanel';
import { useStore } from '../store';
import { parseResearchBundle, RESEARCH_INDICATORS } from '../lib/researchData';

function seedResearchPanel() {
  const makeRow = (zcta5: string, overrides: Record<string, unknown> = {}): Record<string, unknown> => {
    const row: Record<string, unknown> = { zcta5, county_fips: '39095', county_name: 'Lucas County', centroid_lat: 41.5, centroid_lon: -83.6 };
    for (const item of RESEARCH_INDICATORS) row[item.key] = 10;
    return { ...row, median_household_income_usd: 50000, ...overrides };
  };
  const rows = [
    makeRow('04301', {
      median_household_income_usd: null, social_disadvantage_score: null,
      exploratory_composite_score: null, nearest_hrsa_center_km: 2.552,
      foodinsecu_pct: 14.6, insured_population_count: 12345,
      uninsured_population_count: 300, insured_population_pct: 97.6,
      uninsured_population_pct: 2.4,
    }),
    makeRow('04302', {
      nearest_hrsa_center_km: 10, foodinsecu_pct: 20.5,
      insured_population_count: 9876, uninsured_population_count: 444,
      insured_population_pct: 95.7, uninsured_population_pct: 4.3,
    }),
  ];
  const features = rows.map((row, i) => ({ type: 'Feature', properties: { zcta5: row.zcta5 }, geometry: {
    type: 'Polygon', coordinates: [[[-83.7 + i * 0.1, 41.4], [-83.6 + i * 0.1, 41.4], [-83.6 + i * 0.1, 41.5], [-83.7 + i * 0.1, 41.4]]],
  } }));
  const data = parseResearchBundle({ mode: 'ohio_research', rows }, { type: 'FeatureCollection', features }, {
    study: { name: 'Lucas County, Ohio', county_fips: '39095', zcta_geography: '2020 ZCTAs' },
    sources: {
      cdc_places_values: { dataset_name: 'PLACES 2025 release', release: '2025 release; selected measures use 2023 BRFSS' },
      acs_values: { release: '2023 ACS 5-year estimates (2019-2023 period)' },
      hrsa_health_centers: {
        source: 'HRSA Health Center Service Delivery and Look-Alike Sites',
        retrieved_utc: '2026-11-11T23:33:37.567223+00:00',
      },
    },
    row_count: rows.length, missingness: {}, composite: { formula: 'formula', interpretation: 'Exploratory', complete_composites: 1, score_range: [10, 10] },
  });
  useStore.setState({ dataMode: 'ohio_research', researchData: data, researchLoadStatus: 'ready', researchModeError: null,
    metric: 'diabetes_pct', selectedZcta: '04301', compareZctas: [], });
}

describe('ResearchModePanel', () => {
  afterEach(() => {
    useStore.setState({ dataMode: 'demo', researchData: null, researchLoadStatus: 'idle', researchModeError: null,
      metric: 'access_gap_score', selectedZcta: null, compareZctas: [] });
  });

  it('shows raw values, source vintage, units, and explicit missing-value status', () => {
    seedResearchPanel();
    render(<ResearchModePanel />);
    expect(screen.getByText(/Lucas County, Ohio · Research study/)).toBeTruthy();
    expect(screen.getByText(/largest land-area overlap with Lucas County/)).toBeTruthy();
    expect(screen.getByText(/not postal ZIP Codes; full ZCTA boundaries may extend beyond the county/)).toBeTruthy();
    expect(screen.getAllByText('10.0%').length).toBeGreaterThan(0);
    expect(screen.getAllByText(/U.S. Census American Community Survey · 2023 ACS 5-year/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/denominator\/reference: Adults aged 18 years and older/).length).toBeGreaterThan(0);
    expect(screen.getByText(/Missing in source; not imputed/)).toBeTruthy();
    expect(screen.getByText('Observed ranges across study areas')).toBeTruthy();
    expect(screen.getByText('Method and interpretation')).toBeTruthy();
    fireEvent.change(screen.getByRole('combobox', { name: 'Research indicator' }), { target: { value: 'nearest_hrsa_center_km' } });
    expect(screen.getByText(/Straight-line proximity only\. It does not measure actual healthcare accessibility/)).toBeTruthy();
    expect(screen.getAllByText(/Retrieved November 11, 2026/).length).toBeGreaterThan(0);
    expect(screen.queryByText(/October 27, 2026/)).toBeNull();
    fireEvent.change(screen.getByRole('combobox', { name: 'Research indicator' }), { target: { value: 'exploratory_composite_score' } });
    expect(screen.getByText(/not clinically validated and not a causal estimate/)).toBeTruthy();
  });

  it('changes the map indicator and searches only the research ZCTA set', () => {
    seedResearchPanel();
    render(<ResearchModePanel />);
    fireEvent.change(screen.getByRole('combobox', { name: 'Research indicator' }), { target: { value: 'poverty_rate_pct' } });
    expect(useStore.getState().metric).toBe('poverty_rate_pct');
    fireEvent.change(screen.getByLabelText('Find an area by ZCTA'), { target: { value: '04302' } });
    fireEvent.click(screen.getByRole('button', { name: 'Find' }));
    expect(useStore.getState().selectedZcta).toBe('04302');
    expect(useStore.getState().metric).toBe('poverty_rate_pct');
    expect(within(screen.getByRole('region', { name: 'Selected area details' })).getByRole('heading', { name: /ZCTA 04302/ })).toBeTruthy();
  });

  it('adds selected areas to an actual-value comparison table', () => {
    seedResearchPanel();
    render(<ResearchModePanel />);
    fireEvent.click(screen.getByRole('button', { name: 'Compare area' }));
    expect(screen.getByRole('region', { name: 'Area comparison' })).toBeTruthy();
    expect(screen.getByText('Compare areas (1/5)')).toBeTruthy();
    expect(screen.getByRole('button', { name: '04301' })).toBeTruthy();
  });

  it('shows the HRSA straight-line distance in miles across research displays', () => {
    seedResearchPanel();
    render(<ResearchModePanel />);
    fireEvent.change(screen.getByRole('combobox', { name: 'Research indicator' }), { target: { value: 'nearest_hrsa_center_km' } });
    const legend = screen.getByLabelText('Ohio research controls');
    expect(legend.textContent).toContain('Range: 1.59 mi – 6.21 mi');
    expect(legend.textContent).toContain('miles (mi) · straight-line');
    expect(legend.textContent).not.toMatch(/\d+(?:\.\d+)?\s*km\b/i);

    const details = screen.getByRole('region', { name: 'Selected area details' });
    expect(within(details).getByText('1.59 mi')).toBeTruthy();
    fireEvent.click(within(details).getByRole('button', { name: 'Compare area' }));
    const comparison = screen.getByRole('region', { name: 'Area comparison' });
    const distanceRow = within(comparison).getByRole('row', { name: /Distance to nearest HRSA center/ });
    expect(within(distanceRow).getByText('1.59 mi')).toBeTruthy();
    expect(distanceRow.textContent).not.toMatch(/\bkm\b|kilomet(?:er|re)s?/i);
  });

  it('displays food insecurity and insurance as distinct indicators with appropriate units', () => {
    seedResearchPanel();
    render(<ResearchModePanel />);
    const selector = screen.getByRole('combobox', { name: 'Research indicator' });
    expect(within(selector).getByRole('option', { name: 'Adult food insecurity' })).toBeTruthy();
    expect(within(selector).getByRole('option', { name: 'Insured population' })).toBeTruthy();
    expect(within(selector).getByRole('option', { name: 'Insured population (%)' })).toBeTruthy();

    fireEvent.change(selector, { target: { value: 'foodinsecu_pct' } });
    const panel = screen.getByLabelText('Ohio research controls');
    expect(panel.textContent).toContain('Range: 14.6% – 20.5%');
    expect(panel.textContent).toContain('2023 estimate');
    expect(panel.textContent).toContain('2020 ZCTAs');
    expect(panel.textContent).toContain('not a direct household survey');
    expect(panel.textContent).toContain('displayed separately from geographic food access');
    const foodRow = within(screen.getByRole('region', { name: 'Selected area details' }))
      .getByText('Adult food insecurity').closest('div.border-b');
    expect(foodRow).not.toBeNull();
    expect(within(foodRow as HTMLElement).getByText('14.6%')).toBeTruthy();

    fireEvent.change(selector, { target: { value: 'insured_population_count' } });
    expect(panel.textContent).toContain('Range: 9,876 – 12,345');
    const insuredRow = within(screen.getByRole('region', { name: 'Selected area details' }))
      .getByText('Insured population').closest('div.border-b');
    expect(insuredRow).not.toBeNull();
    expect(within(insuredRow as HTMLElement).getByText('12,345')).toBeTruthy();
    expect(insuredRow?.textContent).toContain('civilian noninstitutionalized population');
    fireEvent.click(within(screen.getByRole('region', { name: 'Selected area details' }))
      .getByRole('button', { name: 'Compare area' }));
    const comparison = screen.getByRole('region', { name: 'Area comparison' });
    const comparisonInsured = within(comparison).getByRole('row', { name: /^Insured populationPublic-source indicator/ });
    expect(within(comparisonInsured).getByText('12,345')).toBeTruthy();

    fireEvent.change(selector, { target: { value: 'uninsured_population_pct' } });
    expect(panel.textContent).toContain('Range: 2.4% – 4.3%');
    expect(panel.textContent).toContain('B27001 does not distinguish private from public coverage');
  });

  it('updates risk direction with the selected indicator without changing area selection', () => {
    seedResearchPanel();
    render(<ResearchModePanel />);
    const selector = screen.getByRole('combobox', { name: 'Research indicator' });
    const legend = screen.getByLabelText('Map legend');

    fireEvent.change(selector, { target: { value: 'foodinsecu_pct' } });
    expect(legend.textContent).toContain('Adult food insecurity');
    expect(legend.textContent).toContain('Higher values indicate greater concern.');
    expect(legend.textContent).toContain('Darker blue indicates greater relative concern within this study set; it is not a clinical threshold.');
    expect(legend.textContent).toContain('Highest');
    expect(legend.textContent).toContain('No data');
    expect(useStore.getState().selectedZcta).toBe('04301');

    fireEvent.change(selector, { target: { value: 'median_household_income_usd' } });
    expect(legend.textContent).toContain('Median household income');
    expect(legend.textContent).toContain('Lower values indicate greater concern.');
    expect(useStore.getState().selectedZcta).toBe('04301');
  });

  it('shows the approved 43547 income as missing in details and comparison', () => {
    const metrics = JSON.parse(readFileSync(resolve(process.cwd(), 'public/ohio-research/metrics.json'), 'utf8'));
    const geometry = JSON.parse(readFileSync(resolve(process.cwd(), 'public/ohio-research/study_areas.geojson'), 'utf8'));
    const manifest = JSON.parse(readFileSync(resolve(process.cwd(), 'public/ohio-research/manifest.json'), 'utf8'));
    const data = parseResearchBundle(metrics, geometry, manifest);
    useStore.setState({ dataMode: 'ohio_research', researchData: data, researchLoadStatus: 'ready', researchModeError: null,
      metric: 'median_household_income_usd', selectedZcta: '43547', compareZctas: [] });
    render(<ResearchModePanel />);

    const areaDetails = screen.getByRole('region', { name: 'Selected area details' });
    const incomeRow = within(areaDetails).getByText('Median household income').closest('div.border-b');
    expect(incomeRow).not.toBeNull();
    expect(within(incomeRow as HTMLElement).getByText('Not available')).toBeTruthy();
    expect(within(incomeRow as HTMLElement).getByText(/Missing in source; not imputed/)).toBeTruthy();
    expect(incomeRow?.textContent).not.toContain('$0');

    fireEvent.click(within(areaDetails).getByRole('button', { name: 'Compare area' }));
    const comparison = screen.getByRole('region', { name: 'Area comparison' });
    const comparisonIncome = within(comparison).getByRole('row', { name: /Median household income/ });
    expect(within(comparisonIncome).getByText('Not available')).toBeTruthy();
    expect(comparisonIncome.textContent).not.toContain('$0');

    fireEvent.change(screen.getByRole('combobox', { name: 'Research indicator' }), { target: { value: 'foodinsecu_pct' } });
    const foodRow = within(areaDetails).getByText('Adult food insecurity').closest('div.border-b');
    expect(foodRow).not.toBeNull();
    const foodValue = metrics.rows.find((row: { zcta5: string }) => row.zcta5 === '43547')?.foodinsecu_pct;
    expect(typeof foodValue).toBe('number');
    const formattedFoodValue = `${foodValue.toFixed(1)}%`;
    expect(within(foodRow as HTMLElement).getByText(formattedFoodValue)).toBeTruthy();
    const comparisonFood = within(comparison).getByRole('row', { name: /Adult food insecurity/ });
    expect(within(comparisonFood).getByText(formattedFoodValue)).toBeTruthy();
  });

  it('displays optional food insecurity as unavailable for an older bundle', () => {
    const metrics = JSON.parse(readFileSync(resolve(process.cwd(), 'public/ohio-research/metrics.json'), 'utf8'));
    const geometry = JSON.parse(readFileSync(resolve(process.cwd(), 'public/ohio-research/study_areas.geojson'), 'utf8'));
    const manifest = JSON.parse(readFileSync(resolve(process.cwd(), 'public/ohio-research/manifest.json'), 'utf8'));
    for (const row of metrics.rows) {
      delete row.foodinsecu_pct;
      delete row.insured_population_count;
      delete row.uninsured_population_count;
      delete row.insured_population_pct;
      delete row.uninsured_population_pct;
    }
    const data = parseResearchBundle(metrics, geometry, manifest);
    expect(data.areas.get('43547')?.foodinsecu_pct).toBeNull();
    useStore.setState({ dataMode: 'ohio_research', researchData: data, researchLoadStatus: 'ready', researchModeError: null,
      metric: 'foodinsecu_pct', selectedZcta: '43547', compareZctas: [] });
    render(<ResearchModePanel />);

    const areaDetails = screen.getByRole('region', { name: 'Selected area details' });
    const foodRow = within(areaDetails).getByText('Adult food insecurity').closest('div.border-b');
    expect(foodRow).not.toBeNull();
    expect(within(foodRow as HTMLElement).getByText('Not available')).toBeTruthy();
    expect(within(foodRow as HTMLElement).getByText(/Missing in source; not imputed/)).toBeTruthy();
  });
});
