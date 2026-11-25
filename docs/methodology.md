# Study Methodology

## Study design

This study is an exploratory ecological analysis of health-related and socioeconomic variation across 2020 Census ZIP Code Tabulation Areas (ZCTAs) assigned to Lucas County, Ohio (FIPS 39095).

The unit of analysis is the ZCTA. The study describes geographic variation and selected pairwise associations. It does not estimate individual-level relationships, establish causality, predict health outcomes, or validate a resource-allocation index.

## Geographic selection

The study uses the official 2020 Census ZCTA-to-County Relationship File:

https://www2.census.gov/geo/docs/maps-data/data/rel2020/zcta520/tab20_zcta520_county20_natl.txt

For each ZCTA, the county with the greatest land-area intersection (`AREALAND_PART`) was identified. ZCTAs whose maximum-overlap county was Lucas County (FIPS 39095) were retained.

This procedure evaluated 33,791 national ZCTAs and selected 26 for the study. No tied maximum-area county assignments were identified among the evaluated ZCTAs.

The selected ZCTA identifiers are:

43412, 43434, 43504, 43528, 43537, 43542, 43547, 43560, 43566, 43571, 43604, 43605, 43606, 43607, 43608, 43609, 43610, 43611, 43612, 43613, 43614, 43615, 43616, 43617, 43620, and 43623.

Whole ZCTA geometries were used rather than clipping them to the Lucas County boundary. ZCTAs are statistical geographic areas and do not necessarily correspond to USPS ZIP Code delivery areas.

## Data sources

The analysis combines the following public data sources:

1. **CDC PLACES 2025:** modeled small-area estimates based on 2023 Behavioral Risk Factor Surveillance System (BRFSS) data.
2. **American Community Survey 2023 five-year estimates:** 2019–2023 estimates for socioeconomic and household characteristics.
3. **2020 Census geography:** ZCTA boundaries, the ZCTA-to-county relationship file, and Census Gazetteer internal points.
4. **HRSA health-center site data:** combined Health Center Service Delivery and Look-Alike Sites CSV, retrieved November 11, 2026.

The HRSA source is mutable. Its retrieval date is therefore relevant to interpreting and reproducing the analysis.

## Indicators

The analysis includes modeled health prevalence, socioeconomic measures, insurance coverage, and proximity to HRSA-listed sites.

### Health indicators

- Diabetes prevalence
- High blood pressure prevalence
- Depression prevalence
- Food insecurity prevalence

CDC PLACES estimates are modeled small-area estimates. The analysis uses published point estimates and does not propagate the underlying Monte Carlo uncertainty into subsequent correlations or composite scores.

Food insecurity is analyzed separately. It represents modeled adult prevalence and is not a measure of geographic food access.

### Socioeconomic indicators

**Poverty prevalence**

Calculated from ACS table B17001:

`100 × B17001_002E / B17001_001E`

**Households with no vehicle**

Calculated from ACS table B25044:

`100 × (B25044_003E + B25044_010E) / B25044_001E`

**Median household income**

Taken from ACS variable B19013_001E. Values are reported in 2023 inflation-adjusted dollars.

**Uninsured prevalence**

The uninsured population was calculated by summing the 18 no-health-insurance cells in ACS table B27001:

`_005E`, `_008E`, `_011E`, `_014E`, `_017E`, `_020E`, `_023E`, `_026E`, `_029E`, `_033E`, `_036E`, `_039E`, `_042E`, `_045E`, `_048E`, `_051E`, `_054E`, and `_057E`.

The uninsured count was divided by the civilian noninstitutionalized population denominator and multiplied by 100. The analysis does not separate private and public insurance coverage.

## HRSA site proximity

The HRSA dataset combines Health Center Service Delivery and Look-Alike Sites. Rows were retained when `Site Status Description` was `Active` and coordinates were finite and within the broad screening bounds of latitude 17–72 and longitude -180 to -64.

The coordinate fields are Y (latitude) and X (longitude).

For each ZCTA, the distance to the nearest retained site was calculated from the Census Gazetteer ZCTA internal point using the Haversine formula and an Earth radius of 6,371.0088 kilometers. Distances were rounded to 0.001 km.

This is straight-line proximity, not road-network distance or travel time. It does not establish that a site offers a particular service, has available appointments or capacity, is affordable, or is accessible to a particular resident.

## Exploratory composite

The composite is a researcher-created descriptive measure intended to summarize relative variation across three domains:

1. Health
2. Socioeconomic conditions
3. HRSA site proximity

Each input indicator was converted to an empirical midrank percentile:

`100 × (number below + 0.5 × number tied) / number nonmissing`

Higher adverse health prevalence, poverty, no-vehicle prevalence, and distance to the nearest HRSA site correspond to higher percentile values. Median household income was reversed so that lower income corresponds to a higher adverse-condition percentile.

The health domain is the mean percentile of diabetes, high blood pressure, and depression.

The socioeconomic domain is the mean percentile of poverty, no-vehicle prevalence, and reverse-coded median household income.

HRSA proximity is represented by its own distance percentile.

The published composite is the equal-weighted mean of the three domain scores. All required components must be present; no imputation is performed. Median household income is unavailable for ZCTA 43547, so the published composite contains 25 ZCTAs.

Food insecurity and uninsured prevalence are reported as separate indicators and are not included in the composite.

## Statistical analysis

Pairwise associations were assessed using Spearman rank correlation with pairwise complete observations and average ranks for ties.

No p-values are reported. The analysis does not adjust for spatial dependence, confounding, multiple comparisons, or uncertainty in the modeled estimates.

Two prespecified associations were examined using leave-one-ZCTA-out recalculation to assess whether their observed rank correlations were dominated by a single ZCTA.

## Sensitivity analysis

The composite was recalculated under alternative domain weights, including health-led, social-led, proximity-led, health-and-social-only, and equal-seven-indicator scenarios.

Rank agreement with the published composite was assessed using Spearman correlation. Mean and maximum absolute percentile-rank shifts and top-five overlap were also calculated.

A separate missingness sensitivity comparison examined the effect of excluding the ZCTA with missing median household income. This comparison does not establish that the missing value is missing at random.

## Ethics and interpretation

The study uses secondary, publicly available, geographically aggregated estimates. It does not involve human participants, individual-level human data, or human tissue.

All findings should be interpreted as exploratory geographic descriptions. The composite is not externally validated, predictive, causal, or suitable as a standalone resource-allocation ranking.
