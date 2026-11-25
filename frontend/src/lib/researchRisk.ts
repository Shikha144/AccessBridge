export type RiskDirection = 'higher' | 'lower';

export const RISK_LEVELS = [
  { key: 'lowest', label: 'Lowest concern', color: '#EFF3FF' },
  { key: 'lower', label: 'Lower', color: '#BDD7E7' },
  { key: 'moderate', label: 'Moderate', color: '#6BAED6' },
  { key: 'high', label: 'High', color: '#3182BD' },
  { key: 'critical', label: 'Highest', color: '#08519C' },
] as const;

export type RiskLevel = (typeof RISK_LEVELS)[number];

export interface ResearchRiskTooltipDetails {
  heading: string;
  value: string;
  units: string;
  category: string;
  explanation: string;
}

const RISK_LEVEL_BY_CONCERN = [
  RISK_LEVELS[0],
  RISK_LEVELS[1],
  RISK_LEVELS[2],
  RISK_LEVELS[3],
  RISK_LEVELS[4],
] as const;

function levelForConcernPercentile(percentile: number): RiskLevel {
  if (percentile >= 0.9) return RISK_LEVEL_BY_CONCERN[4];
  if (percentile >= 0.7) return RISK_LEVEL_BY_CONCERN[3];
  if (percentile >= 0.3) return RISK_LEVEL_BY_CONCERN[2];
  if (percentile >= 0.1) return RISK_LEVEL_BY_CONCERN[1];
  return RISK_LEVEL_BY_CONCERN[0];
}

export function buildRiskClassifier(
  values: readonly (number | null)[],
  direction: RiskDirection,
): (value: number | null) => RiskLevel | null {
  const sorted = values.filter((value): value is number => value != null && Number.isFinite(value)).sort((a, b) => a - b);
  const levels = new Map<number, RiskLevel>();
  let start = 0;

  while (start < sorted.length) {
    let end = start + 1;
    while (end < sorted.length && sorted[end] === sorted[start]) end += 1;

    const midpointRank = sorted.length === 1 ? 0.5 : (start + (end - start - 1) / 2) / (sorted.length - 1);
    const concernPercentile = direction === 'higher' ? midpointRank : 1 - midpointRank;
    const level = levelForConcernPercentile(concernPercentile);
    for (let index = start; index < end; index += 1) levels.set(sorted[index], level);
    start = end;
  }

  return (value) => value != null && Number.isFinite(value) ? levels.get(value) ?? null : null;
}

export function riskColor(level: RiskLevel | null): [number, number, number] {
  const color = level?.color ?? '#D1D5DB';
  return [
    Number.parseInt(color.slice(1, 3), 16),
    Number.parseInt(color.slice(3, 5), 16),
    Number.parseInt(color.slice(5, 7), 16),
  ];
}

export function riskDirectionText(direction: RiskDirection): string {
  return direction === 'higher'
    ? 'Higher values indicate greater concern.'
    : 'Lower values indicate greater concern.';
}

export function riskCategoryExplanation(level: RiskLevel | null, direction: RiskDirection): string {
  if (!level) return 'No data available for this study area.';
  const position = level.key === 'critical' ? 'among the highest concern values'
    : level.key === 'high' ? 'in the higher-concern group'
      : level.key === 'moderate' ? 'in the middle of the observed distribution'
        : level.key === 'lower' ? 'in the lower-concern group'
          : 'among the lowest concern values';
  const measure = direction === 'higher' ? 'higher values' : 'lower values';
  return `This area is ${position} within the study areas; ${measure} indicate greater concern.`;
}

export function researchRiskTooltipDetails(options: {
  zcta: string;
  indicator: string;
  value: string | null;
  units: string;
  level: RiskLevel | null;
  direction: RiskDirection;
}): ResearchRiskTooltipDetails {
  return {
    heading: `ZCTA ${options.zcta}`,
    value: `${options.indicator}: ${options.value ?? 'No data available'}`,
    units: options.units,
    category: options.level?.label ?? 'No data',
    explanation: riskCategoryExplanation(options.level, options.direction),
  };
}
