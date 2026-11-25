import { describe, expect, it } from 'vitest';
import { RESEARCH_INDICATORS, researchRiskDirection } from './researchData';
import {
  buildRiskClassifier, researchRiskTooltipDetails, riskCategoryExplanation, riskColor, riskDirectionText, RISK_LEVELS,
} from './researchRisk';

describe('research risk classification', () => {
  it('uses the specified risk direction for each research indicator', () => {
    const directions = Object.fromEntries(RESEARCH_INDICATORS.map(({ key }) => [key, researchRiskDirection(key)]));
    expect(directions).toEqual({
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
    });
  });

  it('maps higher-is-worse values from light to dark blue as values rise', () => {
    const classify = buildRiskClassifier([0, 1, 2, 3, 4], 'higher');
    expect(classify(0)?.key).toBe('lowest');
    expect(riskColor(classify(0))).toEqual([239, 243, 255]);
    expect(classify(2)?.key).toBe('moderate');
    expect(classify(4)?.key).toBe('critical');
    expect(riskColor(classify(4))).toEqual([8, 81, 156]);
  });

  it('reverses risk direction for lower-is-worse values', () => {
    const classify = buildRiskClassifier([0, 1, 2, 3, 4], 'lower');
    expect(classify(0)?.key).toBe('critical');
    expect(classify(2)?.key).toBe('moderate');
    expect(classify(4)?.key).toBe('lowest');
  });

  it('uses the requested 10/20/40/20/10 rank bands when values are unique', () => {
    const classify = buildRiskClassifier(Array.from({ length: 10 }, (_, index) => index), 'higher');
    const counts = new Map<string, number>();
    for (let value = 0; value < 10; value += 1) {
      const key = classify(value)!.key;
      counts.set(key, (counts.get(key) ?? 0) + 1);
    }
    expect(Object.fromEntries(counts)).toEqual({
      lowest: 1, lower: 2, moderate: 4, high: 2, critical: 1,
    });
  });

  it('treats zero as a valid value and null or non-finite values as no data', () => {
    const classify = buildRiskClassifier([0, 5, null, Number.NaN, Number.POSITIVE_INFINITY], 'higher');
    expect(classify(0)?.key).toBe('lowest');
    expect(classify(null)).toBeNull();
    expect(classify(Number.NaN)).toBeNull();
    expect(riskColor(null)).toEqual([209, 213, 219]);
  });

  it('keeps ties together and permits categories to collapse', () => {
    const values = [0, 1, 1, 1, 10];
    const classify = buildRiskClassifier(values, 'higher');
    expect(classify(1)?.key).toBe('moderate');
    expect(classify(0)?.key).not.toBe(classify(1)?.key);

    const allTied = buildRiskClassifier([7, 7, 7, 7], 'higher');
    expect(new Set([7, 7, 7, 7].map((value) => allTied(value)?.key)).size).toBe(1);
    expect(allTied(7)?.key).toBe('moderate');
  });

  it('handles all-null and single-value distributions safely', () => {
    const noValues = buildRiskClassifier([null, Number.NaN], 'higher');
    expect(noValues(0)).toBeNull();
    expect(noValues(null)).toBeNull();
    expect(buildRiskClassifier([42], 'higher')(42)?.key).toBe('moderate');
  });

  it('uses the approved risk colors and describes the direction without thresholds', () => {
    expect(RISK_LEVELS.map((level) => level.color)).toEqual([
      '#EFF3FF', '#BDD7E7', '#6BAED6', '#3182BD', '#08519C',
    ]);
    expect(riskDirectionText('higher')).toBe('Higher values indicate greater concern.');
    expect(riskDirectionText('lower')).toBe('Lower values indicate greater concern.');
    expect(riskCategoryExplanation(RISK_LEVELS[4], 'higher')).toMatch(/highest concern values.*higher values indicate greater concern/);
    expect(riskCategoryExplanation(null, 'higher')).toBe('No data available for this study area.');
  });

  it('builds tooltip values, units, category, and direction from the selected measure', () => {
    const classify = buildRiskClassifier([2, 5, 9], 'higher');
    expect(researchRiskTooltipDetails({
      zcta: '43608', indicator: 'Adult food insecurity', value: '9.0%',
      units: '% of adults', level: classify(9), direction: 'higher',
    })).toEqual({
      heading: 'ZCTA 43608',
      value: 'Adult food insecurity: 9.0%',
      units: '% of adults',
      category: 'Highest',
      explanation: 'This area is among the highest concern values within the study areas; higher values indicate greater concern.',
    });
    expect(researchRiskTooltipDetails({
      zcta: '43547', indicator: 'Median household income', value: null,
      units: '2023 inflation-adjusted USD', level: null, direction: 'lower',
    }).value).toBe('Median household income: No data available');
  });
});
