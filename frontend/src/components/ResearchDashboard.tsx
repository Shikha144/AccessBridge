import {
  formatResearchValue,
  indicatorMetadata,
  RESEARCH_INDICATORS,
  researchValue,
  summarizeResearchIndicator,
  type ResearchArea,
  type ResearchIndicatorKey,
  type ResearchLoadedData,
} from '../lib/researchData';

type ResearchSection = 'overview' | 'explore' | 'insights';

export default function ResearchDashboard({
  section,
  data,
  onExplore,
}: {
  section: Exclude<ResearchSection, 'explore'>;
  data: ResearchLoadedData;
  onExplore: () => void;
}) {
  const areas = [...data.areas.values()];
  return (
    <div className="absolute inset-x-0 top-[112px] bottom-0 overflow-y-auto bg-[#F7F8FA] sm:top-[68px]">
      {section === 'overview'
        ? <ResearchOverview data={data} areas={areas} onExplore={onExplore} />
        : <ResearchInsights areas={areas} onExplore={onExplore} />}
    </div>
  );
}

function ResearchOverview({
  data,
  areas,
  onExplore,
}: {
  data: ResearchLoadedData;
  areas: ResearchArea[];
  onExplore: () => void;
}) {
  const generated = new Date(String(data.manifest.generated_utc)).toLocaleDateString('en-US', {
    timeZone: 'UTC', month: 'long', day: 'numeric', year: 'numeric',
  });
  const missingIncome = areas.filter((area) => area.median_household_income_usd == null);

  return (
    <main className="mx-auto max-w-6xl px-4 py-6 sm:px-8 sm:py-10">
      <section className="grid gap-6 lg:grid-cols-[minmax(0,1.35fr)_minmax(260px,0.65fr)] lg:items-end">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#17636A]">Research overview · Ohio</p>
          <h2 className="mt-2 max-w-3xl font-serif text-3xl leading-tight text-[#14181F] sm:text-4xl">
            Health and socioeconomic patterns across Lucas County
          </h2>
          <p className="mt-4 max-w-3xl text-base leading-7 text-[#454E5A]">
            This descriptive pilot examines how selected health, food-insecurity, insurance, socioeconomic,
            and health-center proximity measures vary across 26 Census ZIP Code Tabulation Areas.
          </p>
        </div>
        <div className="rounded-lg border border-[#D8E1E5] bg-white p-5 shadow-sm">
          <div className="text-xs font-semibold uppercase tracking-wide text-[#17636A]">Research question</div>
          <p className="mt-2 text-sm leading-6 text-[#202833]">
            How do these indicators vary geographically, and how sensitive is an exploratory summary score to its weighting choices?
          </p>
          <button onClick={onExplore} className="mt-4 min-h-10 rounded-md bg-[#14545A] px-4 text-sm font-semibold text-white hover:bg-[#103F44]">
            Explore the 26 study areas
          </button>
        </div>
      </section>

      <section aria-label="Study scope" className="mt-7 grid gap-3 sm:grid-cols-3">
        <ScopeCard label="Geographic scope" value="Lucas County, Ohio" note="One county · 26 study areas" />
        <ScopeCard label="Geography" value="2020 Census ZCTAs" note="Assigned by largest land-area overlap; not USPS ZIP Codes" />
        <ScopeCard label="Published snapshot" value="November 11, 2026" note={`Snapshot 20261111T233311Z · generated ${generated}`} />
      </section>

      <section className="mt-9">
        <SectionHeading eyebrow="Evidence base" title="Sources and vintages" />
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <SourceCard title="CDC PLACES" vintage="2025 release · selected measures use 2023 BRFSS" description="Modeled ZCTA estimates for diabetes, high blood pressure, depression, and adult food-insecurity prevalence." />
          <SourceCard title="U.S. Census ACS" vintage="2023 ACS 5-year · 2019–2023" description="Household income, poverty, vehicle availability, and insured/uninsured population estimates." />
          <SourceCard title="Census geography" vintage="2020 ZCTAs" description="TIGER/Line boundaries, ZCTA-county land-area relationship, and Gazetteer internal points." />
          <SourceCard title="HRSA health-center file" vintage={indicatorMetadata(data.manifest, 'nearest_hrsa_center_km').vintage} description="Nearest active geocoded site measured as great-circle straight-line proximity from each ZCTA internal point." />
        </div>
      </section>

      <section className="mt-9">
        <SectionHeading eyebrow="Measure definitions" title="What the map indicators represent" />
        <p className="mt-2 max-w-4xl text-sm leading-6 text-[#454E5A]">
          Denominators below describe the source estimate or reference set. The published map bundle contains
          indicator values but does not expose the per-ZCTA ACS numerator and denominator counts.
        </p>
        <div className="mt-4 overflow-x-auto rounded-lg border border-[#D8E1E5] bg-white">
          <table className="min-w-[760px] w-full border-collapse text-left text-sm">
            <thead className="bg-[#EEF3F4] text-xs uppercase tracking-wide text-[#46525E]">
              <tr>
                <th scope="col" className="px-4 py-3">Indicator</th>
                <th scope="col" className="px-4 py-3">Source · year</th>
                <th scope="col" className="px-4 py-3">Unit</th>
                <th scope="col" className="px-4 py-3">Denominator / reference</th>
              </tr>
            </thead>
            <tbody>
              {RESEARCH_INDICATORS.map((indicator) => {
                const key = indicator.key as ResearchIndicatorKey;
                const metadata = indicatorMetadata(data.manifest, key);
                return (
                  <tr key={key} className="border-t border-[#E6EAED] align-top">
                    <th scope="row" className="px-4 py-3 font-semibold text-[#202833]">
                      {indicator.label}
                      <span className="mt-1 block max-w-sm text-xs font-normal leading-5 text-[#596470]">{metadata.description}</span>
                    </th>
                    <td className="px-4 py-3 text-[#37424D]">{metadata.source}<span className="mt-1 block text-xs text-[#596470]">{metadata.vintage}</span></td>
                    <td className="px-4 py-3 text-[#37424D]">{metadata.units}</td>
                    <td className="px-4 py-3 text-[#37424D]">{metadata.denominator}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-9 grid gap-5 lg:grid-cols-2">
        <div className="rounded-lg border border-[#D8E1E5] bg-white p-5">
          <SectionHeading eyebrow="Phase 2 result" title="Meaningful variation across areas" />
          <ul className="mt-4 space-y-3 text-sm leading-6 text-[#37424D]">
            <li><strong className="text-[#202833]">Adult food-insecurity prevalence:</strong> {formatResearchValue(summarizeResearchIndicator(areas, 'foodinsecu_pct').minimum, 'foodinsecu_pct')}–{formatResearchValue(summarizeResearchIndicator(areas, 'foodinsecu_pct').maximum, 'foodinsecu_pct')} across ZCTAs; highest in {formatZctas(summarizeResearchIndicator(areas, 'foodinsecu_pct').maximumZctas)}.</li>
            <li><strong className="text-[#202833]">Poverty:</strong> {formatResearchValue(summarizeResearchIndicator(areas, 'poverty_rate_pct').minimum, 'poverty_rate_pct')}–{formatResearchValue(summarizeResearchIndicator(areas, 'poverty_rate_pct').maximum, 'poverty_rate_pct')}; the highest estimate is in ZCTA {formatZctas(summarizeResearchIndicator(areas, 'poverty_rate_pct').maximumZctas)}.</li>
            <li><strong className="text-[#202833]">Diabetes prevalence:</strong> {formatResearchValue(summarizeResearchIndicator(areas, 'diabetes_pct').minimum, 'diabetes_pct')}–{formatResearchValue(summarizeResearchIndicator(areas, 'diabetes_pct').maximum, 'diabetes_pct')} across the 26 study areas.</li>
          </ul>
          <p className="mt-4 border-t border-[#E6EAED] pt-3 text-xs leading-5 text-[#596470]">
            Food-insecurity prevalence is not a measure of grocery access, retail proximity, or food availability.
            These values are area-level estimates, not individual observations.
          </p>
        </div>
        <div className="rounded-lg border border-[#D8E1E5] bg-[#F0F6F5] p-5">
          <SectionHeading eyebrow="Interpret with care" title="What this study can and cannot say" />
          <ul className="mt-4 space-y-2.5 text-sm leading-6 text-[#37424D]">
            <li>Patterns describe ZCTAs assigned to one county; boundaries and estimates do not represent every resident.</li>
            <li>Insurance coverage does not establish affordability, network adequacy, or healthcare use.</li>
            <li>HRSA values are straight-line distances, not driving routes, travel times, or service availability.</li>
            <li>Associations are exploratory and descriptive. They do not establish causal relationships.</li>
            <li>The composite is exploratory, depends on relative ranks and weights, and is not a validated measure of community need or access.</li>
          </ul>
        </div>
      </section>
      {missingIncome.length > 0 && (
        <p className="mt-5 rounded-md border border-[#D9C89A] bg-[#FFF9E8] px-4 py-3 text-sm text-[#4C432C]">
          Data note: median household income is unavailable for {formatZctas(missingIncome.map((area) => area.zcta5))}.
          It remains missing, and dependent social-disadvantage and composite scores are not calculated for that area.
        </p>
      )}
      <footer className="mt-8 border-t border-[#D8E1E5] py-5 text-xs leading-5 text-[#596470]">
        Published source data, indicator values, and calculations are preserved from snapshot 20261111T233311Z.
        No staged HRSA facility layer is included.
      </footer>
    </main>
  );
}

function ResearchInsights({
  areas,
  onExplore,
}: {
  areas: ResearchArea[];
  onExplore: () => void;
}) {
  const foodSummary = summarizeResearchIndicator(areas, 'foodinsecu_pct');
  const incomeSummary = summarizeResearchIndicator(areas, 'median_household_income_usd');
  const completeComposites = summarizeResearchIndicator(areas, 'exploratory_composite_score').available;
  const missingIncome = areas.filter((area) => area.median_household_income_usd == null);
  const publishedTopFive = ['43611', '43604', '43609', '43607', '43605'];
  const sensitivity = [
    { scheme: 'Published equal domains', weights: '⅓ / ⅓ / ⅓', rho: '1.000', shift: '0.00', retained: '5 / 5' },
    { scheme: 'Health-led', weights: '0.50 / 0.25 / 0.25', rho: '0.967', shift: '6.08', retained: '4 / 5' },
    { scheme: 'Social-led', weights: '0.25 / 0.50 / 0.25', rho: '0.932', shift: '8.96', retained: '3 / 5' },
    { scheme: 'Proximity-led', weights: '0.25 / 0.25 / 0.50', rho: '0.628', shift: '20.48', retained: '2 / 5' },
    { scheme: 'Health + social only', weights: '0.50 / 0.50 / 0', rho: '0.832', shift: '13.76', retained: '3 / 5' },
    { scheme: 'Equal across 7 indicators', weights: 'Indicator-level equal weights', rho: '0.866', shift: '12.48', retained: '3 / 5' },
  ];

  return (
    <main className="mx-auto max-w-6xl px-4 py-6 sm:px-8 sm:py-10">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#17636A]">Research insights · Phase 2 analysis</p>
          <h2 className="mt-2 font-serif text-3xl leading-tight text-[#14181F] sm:text-4xl">Verified patterns, with their limits</h2>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-[#454E5A]">
            Descriptive findings from 26 Lucas County ZCTAs. Correlations are exploratory area-level associations,
            not inferential or causal results.
          </p>
        </div>
        <button onClick={onExplore} className="min-h-10 rounded-md border border-[#14545A] bg-white px-4 text-sm font-semibold text-[#14545A] hover:bg-[#EEF6F5]">
          Explore on map
        </button>
      </header>

      <section aria-label="Key findings" className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <FindingCard label="Adult food-insecurity prevalence" value={`${formatResearchValue(foodSummary.minimum, 'foodinsecu_pct')}–${formatResearchValue(foodSummary.maximum, 'foodinsecu_pct')}`} note={`n = ${foodSummary.available} ZCTAs · highest ${formatZctas(foodSummary.maximumZctas)}`} />
        <FindingCard label="Food insecurity and poverty" value="ρ = 0.953" note="Spearman rank association · n = 26" />
        <FindingCard label="Food insecurity and income" value="ρ = −0.960" note="Spearman rank association · n = 25" />
        <FindingCard label="Composite rank sensitivity" value="ρ = 0.628" note="Proximity-led vs published · n = 25" />
      </section>

      <section className="mt-6 grid gap-5 lg:grid-cols-[minmax(0,1.05fr)_minmax(320px,0.95fr)]">
        <article className="min-w-0 rounded-lg border border-[#D8E1E5] bg-white p-4 sm:p-5">
          <SectionHeading eyebrow="Geographic variation" title="Food-insecurity prevalence and poverty" />
          <p className="mt-2 text-xs leading-5 text-[#596470]">
            One dot per 2020 ZCTA. Axes show CDC PLACES adult prevalence and the ACS poverty rate; each area has equal visual weight.
          </p>
          <FoodPovertyPlot areas={areas} />
          <p className="mt-2 text-xs leading-5 text-[#596470]">
            Food-insecurity prevalence is not geographic food access. Both measures are area-level estimates;
            the association does not establish causality.
          </p>
        </article>
        <article className="min-w-0 rounded-lg border border-[#D8E1E5] bg-white p-4 sm:p-5">
          <SectionHeading eyebrow="Exploratory relationships" title="Rank associations" />
          <p className="mt-2 text-xs leading-5 text-[#596470]">
            Spearman ρ using pairwise complete ZCTAs and average ranks. No p-values are reported.
          </p>
          <div className="mt-3 overflow-x-auto">
            <table aria-label="Exploratory area-level rank associations" className="w-full border-collapse text-left text-sm">
              <thead className="bg-[#EEF3F4] text-[10px] uppercase tracking-wide text-[#46525E]">
                <tr><th className="px-2 py-2">Indicator pair</th><th className="px-2 py-2">ρ</th><th className="px-2 py-2">n</th></tr>
              </thead>
              <tbody>
                <AssociationRow pair="Adult food-insecurity prevalence · poverty" rho="0.953" n="26" />
                <AssociationRow pair="Adult food-insecurity prevalence · median income" rho="−0.960" n="25" />
                <AssociationRow pair="Adult food-insecurity prevalence · diabetes" rho="0.893" n="26" />
                <AssociationRow pair="No-vehicle household rate · HRSA straight-line distance" rho="−0.727" n="26" />
                <AssociationRow pair="Diabetes · high blood pressure" rho="0.957" n="26" />
              </tbody>
            </table>
          </div>
          <p className="mt-3 rounded bg-[#F4F6F7] p-3 text-xs leading-5 text-[#4C5662]">
            ZCTAs are spatially related and aggregate individual variation. These patterns are descriptive only;
            they do not imply individual-level relationships or causal effects.
          </p>
        </article>
      </section>

      <section className="mt-5 grid gap-5 lg:grid-cols-2">
        <article className="min-w-0 rounded-lg border border-[#D8E1E5] bg-white p-4 sm:p-5">
          <SectionHeading eyebrow="Composite sensitivity" title="Weight choices change ordering" />
          <p className="mt-2 text-xs leading-5 text-[#596470]">
            The published exploratory composite equally weights health, social disadvantage, and straight-line
            proximity domains. Alternative weights are sensitivity probes, not replacement scores.
          </p>
          <div className="mt-3 overflow-x-auto">
            <table className="min-w-[540px] w-full border-collapse text-left text-xs">
              <thead className="bg-[#EEF3F4] text-[10px] uppercase tracking-wide text-[#46525E]">
                <tr><th className="px-2 py-2">Scheme</th><th className="px-2 py-2">Health / social / proximity</th><th className="px-2 py-2">ρ vs published</th><th className="px-2 py-2">Mean rank shift</th><th className="px-2 py-2">Published top 5 retained</th></tr>
              </thead>
              <tbody>{sensitivity.map((row) => (
                <tr key={row.scheme} className="border-t border-[#E6EAED]">
                  <th scope="row" className="px-2 py-2 font-medium text-[#202833]">{row.scheme}</th>
                  <td className="num px-2 py-2">{row.weights}</td><td className="num px-2 py-2">{row.rho}</td>
                  <td className="num px-2 py-2">{row.shift}</td><td className="num px-2 py-2">{row.retained}</td>
                </tr>
              ))}</tbody>
            </table>
          </div>
          <p className="mt-3 text-xs leading-5 text-[#596470]">
            Published top five: {publishedTopFive.join(', ')}. The proximity-led ordering has the largest
            change. Composite percentiles are relative to this study set, not comparable across counties.
          </p>
          <p className="mt-2 text-xs font-semibold text-[#37424D]">
            The composite is exploratory—not a validated measure of healthcare access, community need, or a resource-allocation ranking.
          </p>
        </article>

        <article className="min-w-0 rounded-lg border border-[#D8E1E5] bg-white p-4 sm:p-5">
          <SectionHeading eyebrow="Missingness and quality" title="Coverage and reproducibility" />
          <dl className="mt-4 grid grid-cols-2 gap-3">
            <QualityValue label="Study areas" value={`${areas.length} / 26`} />
            <QualityValue label="Complete composites" value={`${completeComposites} / ${areas.length}`} />
            <QualityValue label="Income unavailable" value={missingIncome.map((area) => area.zcta5).join(', ') || 'None'} />
            <QualityValue label="ACS income coverage" value={`${incomeSummary.available} / ${incomeSummary.total}`} />
            <QualityValue label="ACS / PLACES joins" value="26 / 26 each" />
            <QualityValue label="HRSA proximity checks" value="26 / 26 reproduced" />
          </dl>
          <p className="mt-4 text-sm leading-6 text-[#37424D]">
            Median household income is unavailable for {formatZctas(missingIncome.map((area) => area.zcta5))}.
            That value remains null; its dependent social-disadvantage and composite values are also unavailable.
            No value is replaced with zero.
          </p>
          <p className="mt-3 text-xs leading-5 text-[#596470]">
            In a complete-case sensitivity run, excluding the one incomplete ZCTA changed the rank ordering
            among the other 25 very little (ρ = 0.998846; mean shift 0.16 places; maximum shift 1). This does
            not establish that missingness is ignorable.
          </p>
        </article>
      </section>

      <section className="mt-5 rounded-lg border border-[#D9C89A] bg-[#FFF9E8] p-4 sm:p-5">
        <SectionHeading eyebrow="Interpretation limits" title="What these results do not establish" />
        <div className="mt-3 grid gap-3 text-sm leading-6 text-[#4C432C] sm:grid-cols-3">
          <p>Area-level correlations do not establish causal effects or describe individual residents.</p>
          <p>Insurance coverage is not affordability, provider-network adequacy, or utilization.</p>
          <p>HRSA straight-line proximity is not driving distance, travel time, or service availability.</p>
        </div>
      </section>
      <footer className="mt-8 border-t border-[#D8E1E5] py-5 text-xs text-[#596470]">
        Snapshot 20261111T233311Z · CDC PLACES 2025 / 2023 BRFSS · 2023 ACS 5-year · 2020 Census ZCTAs.
        No staged HRSA facility layer is included.
      </footer>
    </main>
  );
}

function FoodPovertyPlot({ areas }: { areas: ResearchArea[] }) {
  const width = 660;
  const height = 330;
  const margin = { top: 16, right: 24, bottom: 56, left: 58 };
  const plotWidth = width - margin.left - margin.right;
  const plotHeight = height - margin.top - margin.bottom;
  const x = (value: number) => margin.left + (value / 50) * plotWidth;
  const y = (value: number) => margin.top + plotHeight - (value / 60) * plotHeight;
  const points = areas.filter((area) =>
    researchValue(area, 'foodinsecu_pct') != null && researchValue(area, 'poverty_rate_pct') != null,
  );
  const labels = new Set(['43604', '43608']);

  return (
    <svg role="img" aria-labelledby="food-poverty-title food-poverty-desc" viewBox={`0 0 ${width} ${height}`} className="mt-3 h-auto w-full">
      <title id="food-poverty-title">Adult food-insecurity prevalence versus poverty across Lucas County ZCTAs</title>
      <desc id="food-poverty-desc">Scatterplot of 26 areas. Spearman rank association rho is 0.953. The relationship is descriptive, not causal.</desc>
      {[0, 15, 30, 45, 60].map((tick) => (
        <g key={`y-${tick}`}>
          <line x1={margin.left} x2={width - margin.right} y1={y(tick)} y2={y(tick)} stroke="#E3E8EB" />
          <text x={margin.left - 9} y={y(tick) + 4} textAnchor="end" fontSize="11" fill="#596470">{tick}%</text>
        </g>
      ))}
      {[0, 10, 20, 30, 40, 50].map((tick) => (
        <g key={`x-${tick}`}>
          <line x1={x(tick)} x2={x(tick)} y1={margin.top} y2={margin.top + plotHeight} stroke="#F0F2F4" />
          <text x={x(tick)} y={margin.top + plotHeight + 20} textAnchor="middle" fontSize="11" fill="#596470">{tick}%</text>
        </g>
      ))}
      <line x1={margin.left} x2={width - margin.right} y1={margin.top + plotHeight} y2={margin.top + plotHeight} stroke="#68727D" />
      <line x1={margin.left} x2={margin.left} y1={margin.top} y2={margin.top + plotHeight} stroke="#68727D" />
      <text x={margin.left + plotWidth / 2} y={height - 10} textAnchor="middle" fontSize="12" fill="#37424D">Adult food-insecurity prevalence (% of adults)</text>
      <text transform={`translate(16 ${margin.top + plotHeight / 2}) rotate(-90)`} textAnchor="middle" fontSize="12" fill="#37424D">Population below poverty (%)</text>
      {points.map((area) => {
        const food = researchValue(area, 'foodinsecu_pct');
        const poverty = researchValue(area, 'poverty_rate_pct');
        if (food == null || poverty == null) return null;
        const px = x(food);
        const py = y(poverty);
        return (
          <g key={area.zcta5}>
            <circle cx={px} cy={py} r={labels.has(area.zcta5) ? 5 : 4} fill={labels.has(area.zcta5) ? '#14545A' : '#287D88'} stroke="#fff" strokeWidth="1.5">
              <title>{`ZCTA ${area.zcta5}: adult food-insecurity prevalence ${food.toFixed(1)}%; poverty ${poverty.toFixed(2)}%`}</title>
            </circle>
            {labels.has(area.zcta5) && <text x={px + 8} y={py - 7} fontSize="10" fill="#26343C">{area.zcta5}</text>}
          </g>
        );
      })}
    </svg>
  );
}

function ScopeCard({ label, value, note }: { label: string; value: string; note: string }) {
  return <div className="rounded-lg border border-[#D8E1E5] bg-white p-4"><div className="text-xs font-semibold uppercase tracking-wide text-[#596470]">{label}</div><div className="mt-1 text-lg font-semibold text-[#202833]">{value}</div><div className="mt-1 text-xs leading-5 text-[#596470]">{note}</div></div>;
}

function SourceCard({ title, vintage, description }: { title: string; vintage: string; description: string }) {
  return <article className="rounded-lg border border-[#D8E1E5] bg-white p-4"><h3 className="font-semibold text-[#202833]">{title}</h3><div className="mt-1 text-xs font-medium text-[#17636A]">{vintage}</div><p className="mt-2 text-sm leading-5 text-[#596470]">{description}</p></article>;
}

function SectionHeading({ eyebrow, title }: { eyebrow: string; title: string }) {
  return <div><p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#17636A]">{eyebrow}</p><h3 className="mt-1 font-serif text-xl leading-snug text-[#202833]">{title}</h3></div>;
}

function FindingCard({ label, value, note }: { label: string; value: string; note: string }) {
  return <article className="rounded-lg border border-[#D8E1E5] bg-white p-4"><div className="text-xs font-medium leading-5 text-[#596470]">{label}</div><div className="num mt-2 text-2xl font-semibold text-[#14545A]">{value}</div><div className="mt-1 text-xs leading-5 text-[#596470]">{note}</div></article>;
}

function AssociationRow({ pair, rho, n }: { pair: string; rho: string; n: string }) {
  return <tr className="border-t border-[#E6EAED]"><th scope="row" className="px-2 py-2 font-normal leading-5 text-[#37424D]">{pair}</th><td className="num px-2 py-2 text-[#202833]">{rho}</td><td className="num px-2 py-2 text-[#202833]">{n}</td></tr>;
}

function QualityValue({ label, value }: { label: string; value: string }) {
  return <div className="rounded-md bg-[#F4F6F7] p-3"><dt className="text-xs text-[#596470]">{label}</dt><dd className="num mt-1 text-sm font-semibold text-[#202833]">{value}</dd></div>;
}

function formatZctas(zctas: string[]) {
  return zctas.length ? zctas.map((zcta) => `ZCTA ${zcta}`).join(', ') : 'Not available';
}
