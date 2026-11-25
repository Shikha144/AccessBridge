# Validation and Reproducibility

## Study scope

This validation summary documents the exploratory ZCTA-level analysis of Lucas County, Ohio (county FIPS 39095). The study includes 26 2020 Census ZIP Code Tabulation Areas (ZCTAs).

The analysis is ecological and descriptive. It is not a causal study, predictive model, externally validated index, or resource-allocation ranking.

## Geographic selection checks

ZCTAs were assigned to counties using the official 2020 Census ZCTA-to-County Relationship File. For each ZCTA, the county with the greatest land-area intersection (`AREALAND_PART`) was selected. ZCTAs assigned to Lucas County (FIPS 39095) were retained.

- National ZCTAs evaluated: 33,791
- Lucas County ZCTAs selected: 26
- Tied maximum-area county assignments: 0
- Selected ZCTA identifiers were checked against the archived selection manifest.
- Whole ZCTA geometries were retained; they were not clipped to the county boundary.

## Descriptive indicator checks

| Indicator | N | Mean | Median | Minimum | Maximum |
|---|---:|---:|---:|---:|---:|
| Food insecurity (%) | 26 | 19.24 | 14.50 | 6.9 | 48.0 |
| Poverty (%) | 26 | 18.17 | 14.90 | 0.83 | 55.97 |
| Diabetes (%) | 26 | 14.45 | 12.90 | 10.5 | 23.9 |
| High blood pressure (%) | 26 | 37.52 | 36.40 | 30.7 | 48.8 |
| Depression (%) | 26 | 26.37 | 26.00 | 23.7 | 30.0 |
| Median household income (USD) | 25 | 70,903 | 63,425 | 18,980 | 167,321 |
| Households with no vehicle (%) | 26 | 9.36 | 6.81 | 0 | 42.12 |
| Uninsured (%) | 26 | 4.96 | 4.69 | 0 | 11.12 |
| Distance to nearest HRSA site (km) | 26 | 4.929 | 3.024 | 0.015 | 17.660 |
| Exploratory composite percentile | 25 | 49.667 | 49.453 | 22.889 | 65.009 |

Income and composite summaries have 25 observations because median household income was unavailable for ZCTA 43547. The composite requires all specified components and does not impute missing values.

## Association checks

Pairwise-complete Spearman rank correlations produced the following selected results:

| Indicator pair | Spearman rho | N |
|---|---:|---:|
| Food insecurity and poverty | 0.953 | 26 |
| Food insecurity and median income | -0.960 | 25 |
| Food insecurity and diabetes | 0.893 | 26 |
| Households with no vehicle and distance to nearest HRSA site | -0.727 | 26 |
| Diabetes and high blood pressure | 0.957 | 26 |

These are descriptive associations. No p-values or inferential claims are reported. The analysis does not adjust for spatial dependence, confounding, multiple comparisons, or measurement uncertainty.

## Leave-one-ZCTA-out checks

Two prespecified associations were recalculated after removing one ZCTA at a time:

- Food insecurity and poverty: full-sample rho = 0.953488; leave-one-out range = 0.947672 to 0.964416.
- Food insecurity and median income: full-sample rho = -0.959985; leave-one-out range = -0.966507 to -0.954763.

The direction and magnitude of these two associations were stable under this check. This does not establish causal relationships or generalizability beyond the study geography.

## Composite weighting sensitivity

The published composite gives equal weight to three domains: health, socioeconomic conditions, and proximity to an HRSA site. Alternative weights produced the following rank agreement with the published composite:

| Weighting scenario | Spearman rho | Mean absolute rank shift | Maximum rank shift | Top-five overlap |
|---|---:|---:|---:|---:|
| Equal domain weights | 1.000 | 0.00 | 0 | 5/5 |
| Health-led | 0.967 | 6.08 | 16 | 4/5 |
| Social-led | 0.932 | 8.96 | 24 | 3/5 |
| Proximity-led | 0.628 | 20.48 | 48 | 2/5 |
| Health and social only | 0.832 | 13.76 | 32 | 3/5 |
| Equal seven-indicator weighting | 0.866 | 12.48 | 28 | 3/5 |

Rank shifts are expressed on the percentile-rank scale (0–100). Equal weighting of seven indicators is not equivalent to equal weighting of the three domains.

## Missingness sensitivity

Excluding ZCTA 43547, the area missing median household income, produced a Spearman correlation of 0.998846 between the compared composite rankings among the remaining 25 ZCTAs. The mean absolute rank shift was 0.16 and the maximum shift was 1.

This comparison does not demonstrate that the missing income value is missing at random or that missingness is ignorable.

## Interpretation and limitations

CDC PLACES estimates are modeled small-area estimates. The analysis uses point estimates and does not propagate their uncertainty into correlations or composite scores.

HRSA proximity is straight-line distance from Census Gazetteer ZCTA internal points to the nearest active site in the combined health-center service-delivery and look-alike dataset. It does not measure road distance, travel time, capacity, appointment availability, affordability, eligibility, or realized access.

Food insecurity is a modeled adult prevalence measure, not a measure of geographic food access. It is analyzed separately and excluded from the composite.

The composite is a researcher-created exploratory descriptive measure. Its results depend on the selected indicators, domain definitions, weighting choices, and available data. It should not be interpreted as a validated measure or used to allocate resources.

## Reproducibility

The analysis uses public CDC PLACES, American Community Survey, Census, and HRSA data. Source vintages, formulas, geographic selection rules, and sensitivity checks should be considered together when reproducing or extending the analysis.
