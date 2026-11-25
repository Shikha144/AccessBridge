import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import AccessBridgeApp from './AccessBridgeApp';
import * as research from '../lib/researchData';

vi.mock('./AccessBridgeMap', () => ({ default: () => <div aria-label="map mock" /> }));
vi.mock('../components/ResearchDashboard', () => ({ default: () => <div>Research overview</div> }));

describe('independent Ohio application entry', () => {
  it('loads only the published Lucas County bundle and renders indicator controls', async () => {
    const feature = { type: 'Feature' as const, properties: { zcta5: '43547', county_name: 'Lucas' }, geometry: { type: 'Polygon' as const, coordinates: [[[-83,41],[-82,41],[-82,42],[-83,41]]] } };
    const row = { zcta5: '43547', county_name: 'Lucas', centroid_lat: 41.6, centroid_lon: -83.6, diabetes_pct: 12, high_blood_pressure_pct: 30, depression_pct: 20, foodinsecu_pct: 10, median_household_income_usd: null, poverty_rate_pct: 14, no_vehicle_household_rate_pct: 8, insured_population_count: 900, uninsured_population_count: 100, insured_population_pct: 90, uninsured_population_pct: 10, nearest_hrsa_center_km: 2.552, health_need_score: 70, social_disadvantage_score: null, healthcare_access_barrier_score: 50, exploratory_composite_score: null };
    const loaded = { areas: new Map([['43547', row]]), overview: { type: 'FeatureCollection' as const, features: [feature] }, centroids: new Map([['43547', [-83.6, 41.6] as [number, number]]]), bounds: [[-83, 41], [-82, 42]] as [[number, number],[number, number]], manifest: { study: { name: 'Lucas', county_fips: '39095', zcta_geography: '2020 Census ZCTAs' }, sources: {}, row_count: 1, generated_utc: '2026-10-27T00:00:00Z', missingness: {}, composite: { formula: '', interpretation: '', complete_composites: 0, score_range: [null, null] } } } as unknown as research.ResearchLoadedData;
    vi.spyOn(research, 'loadResearchData').mockResolvedValue(loaded);
    render(<AccessBridgeApp />);
    await screen.findByRole('button', { name: 'Explore map' });
    fireEvent.click(screen.getByRole('button', { name: 'Explore map' }));
    await waitFor(() => expect(screen.getByText('Area details')).toBeTruthy());
    fireEvent.change(screen.getByLabelText('Map indicator'), { target: { value: 'nearest_hrsa_center_km' } });
    fireEvent.change(screen.getByLabelText('Find ZCTA'), { target: { value: '43547' } });
    fireEvent.click(screen.getByRole('button', { name: 'Find' }));
    expect(screen.getByText('ZCTA 43547')).toBeTruthy();
    const detailRows = screen.getByLabelText('Ohio research controls').querySelectorAll('.area-details dd');
    expect(detailRows[4]?.textContent).toBe('Not available');
    expect(screen.getByText('1.59 mi')).toBeTruthy();
  });
});
