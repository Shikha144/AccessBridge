# AccessBridge
### Exploring Health-Related and Socioeconomic Variation Across Lucas County, Ohio

**An exploratory, reproducible geospatial research project integrating public health estimates, socioeconomic indicators, and geographic proximity to HRSA-listed health center sites across 2020 Census ZIP Code Tabulation Areas (ZCTAs).**

<p align="center">
  <a href="https://accessbridge-zuns.onrender.com"><strong>Explore the Live Application →</strong></a>
  &nbsp; | &nbsp;
  <a href="https://github.com/Shikha144/AccessBridge">Source Code</a>
  &nbsp; | &nbsp;
  <a href="https://orcid.org/0009-0007-7255-3578">ORCID</a>
</p>

---

## Overview

Where do health-related and socioeconomic disadvantages overlap geographically, and how does proximity to listed health center sites vary across communities?

**AccessBridge** is an exploratory geospatial research project developed to investigate these questions at the ZIP Code Tabulation Area (ZCTA) level.

The initial research pilot focuses on Lucas County, Ohio, integrating health-related prevalence estimates, socioeconomic characteristics, health insurance coverage, household vehicle availability, and geographic proximity to Health Resources and Services Administration (HRSA)-listed health center sites.

The project brings together publicly available and documented geographic data sources to construct a transparent analytical framework for examining variation across communities.

AccessBridge is designed around three principles:

- **Geographic specificity:** Examine variation below the county level using standardized Census ZCTA geography.
- **Analytical transparency:** Document indicator definitions, denominators, data provenance, geographic processing, and composite construction.
- **Reproducibility:** Preserve a frozen analytical snapshot, source documentation, output checksums, and supplementary sensitivity analyses.

The project is an independent research initiative. It is not an official government health-equity ranking or a validated measure of healthcare access.

## Explore AccessBridge

**Live application:** [https://accessbridge-zuns.onrender.com](https://accessbridge-zuns.onrender.com)

The application provides an interactive presentation of the project's geographic analysis and analytical outputs.

<details>
<summary><strong>Application preview</strong></summary>

Add a screenshot of the deployed application here after saving it in the repository as `docs/accessbridge_preview.png`.

```markdown
![AccessBridge application preview](./docs/accessbridge_preview.png)
```

</details>

The research outputs examine:

- Geographic variation in selected health-related indicators.
- Socioeconomic differences across ZCTAs.
- Household vehicle availability and geographic proximity to listed health center sites.
- Associations between selected health and socioeconomic indicators.
- An exploratory composite index and alternative weighting scenarios.

The application is the interactive presentation layer; the GitHub repository is the primary location for source code, research documentation, and reproducibility materials.

---

## Research Objectives

The pilot addresses five research objectives:

1. **Characterize geographic variation:** Examine the distribution of selected health-related and socioeconomic indicators across Lucas County-assigned ZCTAs.
2. **Investigate indicator associations:** Explore relationships between food insecurity, poverty, income, chronic disease prevalence, and transportation-related characteristics.
3. **Examine geographic proximity:** Calculate straight-line distances from ZCTA internal points to the nearest eligible HRSA-listed health center site.
4. **Develop an exploratory composite:** Integrate health, socioeconomic, and geographic proximity domains into a descriptive comparative index.
5. **Evaluate methodological sensitivity:** Assess how alternative domain weightings and missing-data handling affect composite rankings.

## Study Area and Geographic Framework

| Characteristic | Specification |
|---|---|
| Study area | Lucas County, Ohio, USA |
| County FIPS | `39095` |
| Geographic unit | 2020 Census ZCTA |
| Selected geographic units | 26 |
| Geographic assignment | National largest-land-area-overlap county assignment |
| Analysis type | Exploratory ecological analysis |
| Snapshot ID | `20261111T233311Z` |
| Snapshot generation date | November 11, 2026 |

### ZCTA selection methodology

ZCTA selection uses the U.S. Census Bureau's 2020 Census ZCTA–County Relationship File.

Each ZCTA was assigned to the county with which it shared the greatest `AREALAND_PART` (land-area intersection) across the national relationship file. The 26 ZCTAs assigned to Lucas County (FIPS 39095) were retained.

The selection procedure was independently reproduced against the archived source file. All 26 selected ZCTA identifiers matched the snapshot manifest, with no tied maximum-area county assignments.

The selected geographic identifiers are:

```text
43412  43434  43504  43528  43537  43542  43547
43560  43566  43571  43604  43605  43606  43607
43608  43609  43610  43611  43612  43613  43614
43615  43616  43617  43620  43623
```

**Important geographic consideration:** ZCTAs do not necessarily follow county boundaries. Some selected ZCTAs extend beyond Lucas County. Therefore, the analysis uses whole-ZCTA estimates rather than estimates clipped to the county boundary.

The results should be interpreted as describing ZCTAs assigned to Lucas County under the specified national assignment procedure, not exclusively the population physically located within the county boundary.

---

## Data Sources and Analytical Indicators

The project integrates four principal source categories.

| Data source | Dataset / measure | Vintage |
|---|---|---|
| CDC PLACES | Model-based health-related prevalence estimates | 2025 release |
| U.S. Census Bureau ACS | Poverty, household vehicle availability, health insurance, and median household income | 2023 ACS 5-year estimates |
| U.S. Census Bureau | ZCTA–County Relationship File and Census Gazetteer geography | 2020 Census |
| HRSA | Health Center Service Delivery and Look-Alike Sites | Retrieved November 11, 2026 |

### 1. Health-related indicators

The selected health indicators include:

- Diabetes prevalence.
- High blood pressure prevalence.
- Depression prevalence.
- Food insecurity prevalence.

PLACES estimates are model-based small-area estimates derived using the CDC's small-area estimation methodology.

Food insecurity is treated as an estimated adult prevalence indicator. It is not interpreted as a direct measure of food availability, food retail access, or physical access to food.

### 2. Socioeconomic indicators

The ACS provides the socioeconomic measures:

| Indicator | ACS source | Analytical definition |
|---|---|---|
| Poverty rate | `B17001` | Population below poverty level divided by total population |
| No-vehicle household rate | `B25044` | Households without a vehicle divided by total households |
| Health insurance coverage | `B27001` | Civilian noninstitutionalized population with and without coverage |
| Median household income | `B19013` | Median household income in 2023 inflation-adjusted USD |

The uninsured population is calculated by summing the applicable no-coverage cells in ACS table `B27001`. The insured population is calculated as the total civilian noninstitutionalized population minus the uninsured population.

The analysis does not distinguish private from public insurance coverage in its primary insurance indicator.

### 3. Geographic proximity to HRSA-listed sites

The HRSA combined Health Center Service Delivery and Look-Alike Sites dataset provides the geographic locations used for the proximity analysis.

Eligible records are selected using active site status and valid geographic coordinates.

For each ZCTA, the analysis calculates the distance between its Census Gazetteer internal point and the nearest eligible HRSA-listed site.

Distance is calculated using the Haversine formula:

- Earth radius: 6,371.0088 km.
- Distance unit: kilometers.
- Reported precision: 0.001 km.

This is a straight-line geographic proximity measure. It does not measure road-network distance, travel time, appointment availability, service capacity, affordability, eligibility, or realized healthcare utilization.

---

## Analytical Methodology

AccessBridge uses a multi-stage analytical workflow.

### Stage 1. Geographic identification and data integration

- Load 2020 Census ZCTA geographic identifiers.
- Apply the national largest-land-area-overlap county assignment.
- Retain the 26 ZCTAs assigned to Lucas County.
- Normalize geographic identifiers as five-character strings.
- Integrate health, socioeconomic, and geographic datasets using standardized ZCTA identifiers.

### Stage 2. Indicator construction

Source-specific estimates are transformed into comparable percentages or continuous measures using their appropriate denominators.

The analytical dataset retains the original indicator meaning and distinguishes between modeled health prevalence, ACS population estimates, and geographic distance measures.

### Stage 3. Exploratory statistical analysis

The analysis uses:

- Unweighted descriptive statistics across ZCTAs.
- Pairwise-complete Spearman rank correlations.
- Average ranks for tied values.
- Reported sample sizes for each correlation.
- Leave-one-ZCTA-out sensitivity analysis for selected associations.

The correlation analysis is descriptive. No p-values are reported, and the analysis does not adjust for spatial dependence, confounding, multiple comparisons, or uncertainty propagation.

### Stage 4. Composite index construction

The AccessBridge composite is a researcher-created exploratory descriptive index.

It combines three domains:

| Domain | Indicators | Weight |
|---|---|---:|
| Health | Diabetes, high blood pressure, depression | 1/3 |
| Socioeconomic | Poverty, no-vehicle households, reverse-ranked median income | 1/3 |
| Geographic proximity | Distance to nearest eligible HRSA-listed site | 1/3 |

Each component is converted to an empirical midrank percentile:

\[
P_i = 100 \times
\frac{N_{\text{below}} + 0.5N_{\text{tied}}}
{N_{\text{nonmissing}}}
\]

The resulting percentile ranges from 0 to 100.

Higher percentiles represent relatively greater disadvantage under the defined indicator direction.

The health and socioeconomic domains are calculated as equal-weighted means of their component percentiles. Median household income is reverse-ranked so that lower income corresponds to greater relative disadvantage.

The final composite is the equal-weighted mean of the three domain scores. All required components must be available; missing values are not imputed.

**Missing-data consideration:** Median household income is unavailable for ZCTA `43547`. Consequently, the socioeconomic domain and published composite are missing for this ZCTA. The published composite contains 25 ZCTAs rather than 26.

### Stage 5. Sensitivity analysis

The project evaluates alternative composite specifications to examine the influence of domain weighting and missingness.

Sensitivity scenarios include:

- Equal weighting of the three domains.
- Health-led weighting.
- Socioeconomic-led weighting.
- Geographic-proximity-led weighting.
- Health and socioeconomic weighting without the proximity domain.
- Equal weighting of the seven individual component indicators.
- Complete-case comparison excluding the ZCTA with missing median income.

The seven-indicator scenario is an alternative component-level weighting specification, not an equal-domain weighting specification.

Sensitivity statistics include Spearman rank correlation with the published composite, mean absolute percentile-rank shift, maximum percentile-rank shift, and top-five overlap.

---

## Key Analytical Findings

The following findings are from the frozen analytical snapshot `20261111T233311Z`.

### Indicator distributions

| Indicator | ZCTAs | Mean | Median | Range |
|---|---:|---:|---:|---:|
| Food insecurity (%) | 26 | 19.24 | 14.50 | 6.9–48.0 |
| Poverty (%) | 26 | 18.17 | 14.90 | 0.83–55.97 |
| Diabetes (%) | 26 | 14.45 | 12.90 | 10.5–23.9 |
| High blood pressure (%) | 26 | 37.52 | 36.40 | 30.7–48.8 |
| Depression (%) | 26 | 26.37 | 26.00 | 23.7–30.0 |
| Median household income (USD) | 25 | $70,903 | $63,425 | $18,980–$167,321 |
| No-vehicle households (%) | 26 | 9.36 | 6.81 | 0–42.12 |
| Uninsured population (%) | 26 | 4.96 | 4.69 | 0–11.12 |
| Nearest HRSA-listed site (km) | 26 | 4.929 | 3.024 | 0.015–17.660 |
| Published composite percentile | 25 | 49.667 | 49.453 | 22.889–65.009 |

All indicator summaries are unweighted across ZCTAs. They are not population-weighted county estimates.

### Selected associations

Pairwise-complete Spearman rank correlations indicate several strong associations:

| Indicator pair | Spearman's ρ | n |
|---|---:|---:|
| Food insecurity and poverty | 0.953 | 26 |
| Food insecurity and median household income | -0.960 | 25 |
| Food insecurity and diabetes | 0.893 | 26 |
| No-vehicle households and HRSA-site distance | -0.727 | 26 |
| Diabetes and high blood pressure | 0.957 | 26 |

These are exploratory ecological associations. They do not establish individual-level relationships or causal mechanisms.

### Leave-one-ZCTA-out sensitivity

Two selected associations were examined using leave-one-ZCTA-out analysis:

| Association | Full-sample ρ | Leave-one-out range |
|---|---:|---:|
| Food insecurity and poverty | 0.953 | 0.948–0.964 |
| Food insecurity and median household income | -0.960 | -0.967 to -0.955 |

The associations remained directionally consistent across these deletion checks.

### Composite weighting sensitivity

| Scenario | Spearman's ρ | Mean absolute rank shift | Maximum rank shift | Top-five overlap |
|---|---:|---:|---:|---:|
| Equal domains | 1.000 | 0.00 | 0 | 5/5 |
| Health-led | 0.967 | 6.08 | 16 | 4/5 |
| Socioeconomic-led | 0.932 | 8.96 | 24 | 3/5 |
| Proximity-led | 0.628 | 20.48 | 48 | 2/5 |
| Health + socioeconomic | 0.832 | 13.76 | 32 | 3/5 |
| Equal seven components | 0.866 | 12.48 | 28 | 3/5 |

The rank-shift values are measured on the 0–100 percentile-rank scale.

The results demonstrate that the published equal-domain specification is not interchangeable with all alternative weighting schemes. In particular, increasing the geographic-proximity weight produces substantially greater ranking variation.

For the complete-case missingness sensitivity analysis, excluding ZCTA `43547` produced a Spearman correlation of 0.998846 with the published composite ranks among the same 25 ZCTAs. This result does not establish that missingness is ignorable.

---

## Research Visualizations

The project includes two principal analytical figures.

### Figure 1. Geographic distribution of selected indicators

![AccessBridge geographic indicator maps](./Figure_1_Indicator_maps.png)

The figure presents the geographic distribution of selected health-related and socioeconomic indicators across the study ZCTAs.

### Figure 2. Associations among selected indicators

![AccessBridge indicator associations](./Figure_2_Associations.png)

The figure presents selected relationships among health, socioeconomic, and geographic indicators.

The figures are descriptive analytical outputs and should be interpreted in conjunction with the documented indicator definitions and study limitations.

---

## Interpretation and Limitations

AccessBridge is an exploratory ecological analysis, not a causal or predictive model.

Several limitations are central to interpreting its findings.

**1. Geographic aggregation**

The unit of analysis is the ZCTA. ZCTA-level patterns cannot be assumed to represent individual-level health or socioeconomic circumstances.

**2. Geographic assignment**

The 26 selected ZCTAs are assigned to Lucas County using a national largest-land-area-overlap rule. Some ZCTAs extend beyond the county boundary, and estimates are not clipped to county geography.

**3. Modeled health estimates**

CDC PLACES estimates are model-based small-area estimates. Their point estimates are used in the analysis, but their uncertainty intervals are not propagated into the composite.

**4. Proximity is not access**

Straight-line distance to the nearest HRSA-listed site does not establish whether a person can obtain care. The measure does not capture travel time, transportation availability, facility capacity, affordability, appointment availability, service eligibility, or acceptance of particular insurance plans.

**5. Data-vintage differences**

The analysis integrates datasets from different reference periods and population universes. The HRSA source file is mutable and is not represented as a historically pinned vintage.

**6. Composite-index assumptions**

The composite depends on selected indicators, percentile normalization, domain definitions, equal weighting, and complete-component requirements. It is not a validated health-equity index or official resource-allocation ranking.

**7. Statistical limitations**

The sample contains only 26 ZCTAs. Correlations are exploratory and are not adjusted for spatial dependence, confounding, multiple comparisons, or model uncertainty.

**8. Missingness**

Median household income is unavailable for one ZCTA, resulting in 25 complete published composite observations. Sensitivity analysis assesses the effect of excluding this ZCTA but does not establish that missingness is ignorable.

### Intended use

The project is intended to support:

- Exploratory geographic research.
- Identification of overlapping health-related and socioeconomic patterns.
- Methodological experimentation.
- Research transparency and reproducibility.
- Hypothesis generation for future multi-county investigations.

It should not be used as a clinical decision-support tool, individual risk assessment, definitive measure of healthcare access, or validated resource-allocation instrument.

---

## Reproducibility and Data Provenance

**Frozen snapshot:** `20261111T233311Z`

The project uses a frozen analytical snapshot to preserve the relationship between source data, processing procedures, and reported outputs.

The file `SOURCE_AND_OUTPUT_MANIFEST.json` documents source provenance and output checksums.

The manifest records, among other details:

- Study geography and county FIPS.
- Geographic reference vintage.
- Source dataset identifiers and retrieval information.
- Source-file checksums and byte counts where recorded.
- Output provenance information.

The 2020 Census ZCTA–County Relationship File used for geographic selection was verified against its recorded byte count and SHA256 checksum. Reproduction of the national largest-overlap assignment yielded the same 26 ZCTAs as the snapshot manifest.

### Supplementary materials

The analytical release includes the following supplementary outputs:

| File | Description |
|---|---|
| `SOURCE_AND_OUTPUT_MANIFEST.json` | Source provenance and output checksums |
| `Supplementary_composite_sensitivity.csv` | Alternative composite weighting and missingness sensitivity results |
| `Supplementary_leave_one_ZCTA_out.csv` | Leave-one-ZCTA-out sensitivity results |
| `Figure_1_Indicator_maps.png` | Geographic indicator visualizations |
| `Figure_2_Associations.png` | Selected indicator association visualization |

For historical reproduction, use the documented snapshot and corresponding source versions. Current downloads may differ from the versions used in the original analysis.

The original HRSA source file and facility-level records are not redistributed in the repository. Researchers seeking to reproduce the analysis may need to obtain source data independently from the relevant providers and comply with their applicable terms.

---

## Repository Structure

The repository organizes the project around data processing, analysis, and research outputs.

```text
AccessBridge/
│
├── LICENSE
├── README.md
├── SOURCE_AND_OUTPUT_MANIFEST.json
│
├── pipeline/
│   └── Data processing and analytical workflows
│
├── data/
│   └── Source and processed data, subject to access restrictions
│
├── outputs/
│   └── Analytical outputs and visualizations
│
├── Figure_1_Indicator_maps.png
├── Figure_2_Associations.png
│
├── Supplementary_composite_sensitivity.csv
└── Supplementary_leave_one_ZCTA_out.csv
```

Refer to the actual repository files for the current implementation and directory organization.

---

## Technology and Methods

AccessBridge brings together geospatial processing, statistical analysis, and interactive web-based visualization.

The analytical workflow involves:

- Census geographic identifiers and ZCTA assignment.
- Public health and socioeconomic data integration.
- ACS estimate transformation and denominator construction.
- Haversine distance calculations.
- Empirical percentile ranking.
- Composite-index construction.
- Spearman rank correlation analysis.
- Leave-one-ZCTA-out sensitivity analysis.
- Alternative composite-weighting evaluation.
- Provenance tracking and checksum verification.

The repository contains the implementation and supporting research documentation.

---

## Installation and Execution

The repository is the authoritative source for the project's implementation.

For the most accurate reproduction, first inspect the project configuration, dependency files, and pipeline documentation. Execution may require obtaining the underlying source datasets separately.

The frozen analytical snapshot is identified by:

```text
20261111T233311Z
```

The source manifest documents the corresponding data provenance and checksums.

No installation or execution command is specified here until it has been verified against the released repository and its actual dependencies.

---

## Data Availability and Licensing

The AccessBridge source code is distributed under the **MIT License**. See the [`LICENSE`](./LICENSE) file.

The MIT License applies to original project code and does not extend to third-party datasets, source materials, or software libraries, which remain subject to their respective licenses and terms of use.

Project documentation, permitted aggregate ZCTA-level analytical outputs, and reproducibility materials are made available through this repository.

The original HRSA source file and facility-level records are not included in the public release.

The `SOURCE_AND_OUTPUT_MANIFEST.json` file documents data provenance and output checksums.

A persistent archived release DOI has not yet been assigned. An archival identifier will be added following archival deposit.

---

## Future Research Directions

The initial Lucas County pilot provides a foundation for further methodological and geographic investigation.

Potential extensions include:

- Expanding the analytical framework to additional Ohio counties.
- Examining cross-county and regional geographic patterns.
- Incorporating road-network travel times and transportation accessibility.
- Evaluating spatial autocorrelation and spatial dependence.
- Propagating uncertainty from modeled health estimates.
- Testing alternative normalization and composite-index specifications.
- Examining sensitivity to geographic aggregation and boundary definitions.
- Incorporating additional measures of healthcare availability and service capacity where suitable data are available.

These extensions require additional source validation and methodological evaluation.

---

## Author

**Shikha Sharma**  
Independent Researcher  
Columbus, Ohio, USA

**ORCID:** [0009-0007-7255-3578](https://orcid.org/0009-0007-7255-3578)

**Research focus:** Health geography, socioeconomic disparities, geospatial data analysis, public health data integration, and reproducible research.

## Citation

I will cite the associated research manuscript when publication details become available.

**Manuscript title:**

*Mapping health-related and socioeconomic variation across Lucas County, Ohio: an exploratory, reproducible ZCTA pilot.*

## Acknowledgement and Disclaimer

AccessBridge is an independent research project. It is not affiliated with, endorsed by, or representative of the U.S. Census Bureau, Centers for Disease Control and Prevention, Health Resources and Services Administration, or any other government agency.

All interpretations and conclusions are the responsibility of the author.

---

**Project:** AccessBridge  
**Study geography:** Lucas County, Ohio  
**Geographic unit:** 2020 Census ZCTAs  
**Snapshot:** `20261111T233311Z`  
**License:** MIT 
