import { describe, expect, it } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import { readFileSync } from 'node:fs';
import { parseResearchBundle } from '../lib/researchData';
import ResearchDashboard from './ResearchDashboard';

const readJson = (path: string) => JSON.parse(readFileSync(new URL(path, import.meta.url), 'utf8')) as unknown;
const data = parseResearchBundle(
  readJson('../../public/ohio-research/metrics.json'),
  readJson('../../public/ohio-research/study_areas.geojson'),
  readJson('../../public/ohio-research/manifest.json'),
);

describe('ResearchDashboard', () => {
  it('presents the verified study scope, research question, sources, and indicator denominators', () => {
    render(<ResearchDashboard section="overview" data={data} onExplore={() => {}} />);

    expect(screen.getByRole('heading', { name: /Health and socioeconomic patterns across Lucas County/ })).toBeTruthy();
    expect(screen.getByText(/How do these indicators vary geographically/)).toBeTruthy();
    expect(screen.getAllByText(/26 study areas/).length).toBeGreaterThan(0);
    expect(screen.getByText(/2023 ACS 5-year · 2019–2023/)).toBeTruthy();
    expect(screen.getAllByText(/Adults aged 18 years and older; modeled PLACES prevalence estimate/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/ACS civilian noninstitutionalized population \(B27001_001E\)/).length).toBeGreaterThan(0);
    expect(screen.getByText(/does not expose the per-ZCTA ACS numerator and denominator counts/)).toBeTruthy();
    expect(document.body.textContent).toContain('Food-insecurity prevalence is not a measure of grocery access');
  });

  it('shows Phase 2 area-level associations, composite sensitivity, missingness, and limitations', () => {
    render(<ResearchDashboard section="insights" data={data} onExplore={() => {}} />);

    expect(screen.getByRole('heading', { name: /Verified patterns, with their limits/ })).toBeTruthy();
    expect(screen.getByRole('img', { name: /Adult food-insecurity prevalence versus poverty/ })).toBeTruthy();
    expect(screen.getByText('ρ = 0.953')).toBeTruthy();
    expect(screen.getByText('ρ = −0.960')).toBeTruthy();
    expect(screen.getByText('0.628')).toBeTruthy();
    expect(screen.getByRole('row', { name: /Proximity-led/ })).toBeTruthy();
    expect(screen.getByText(/income is unavailable for ZCTA 43547/)).toBeTruthy();
    expect(document.body.textContent).toContain('Area-level correlations do not establish causal effects');
    const associationTable = screen.getByText('Indicator pair').closest('table');
    expect(associationTable).not.toBeNull();
    expect(within(associationTable as HTMLElement).getAllByText('26').length).toBeGreaterThan(0);
  });
});
