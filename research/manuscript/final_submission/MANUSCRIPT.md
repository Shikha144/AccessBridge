# Mapping health-related and socioeconomic variation across Lucas County, Ohio: an exploratory, reproducible ZCTA pilot

**Author:** Shikha Sharma
**Affiliation:** Independent Researcher, Columbus, Ohio, USA
**ORCID:** [https://orcid.org/0009-0007-7255-3578](https://orcid.org/0009-0007-7255-3578)
**Corresponding author:** shikhaasharma144@gmail.com

## Abstract

**Background:** Geographic summaries can help examine how health-related and socioeconomic estimates vary across communities. However, area-level estimates do not establish individual circumstances or demonstrate realized healthcare access.

**Methods:** We analyzed the immutable AccessBridge snapshot `20261111T233311Z`, comprising 26 2020 Census ZIP Code Tabulation Areas (ZCTAs) assigned to Lucas County, Ohio, using the largest-land-area-overlap county rule. Specifically, each ZCTA was assigned to the county with which it shared the largest land-area intersection in the national 2020 Census ZCTAâ€“County Relationship File; ZCTAs assigned to Lucas County were retained. Data sources included Centers for Disease Control and Prevention (CDC) PLACES 2025 release estimates, selected measures of which use 2023 Behavioral Risk Factor Surveillance System (BRFSS) data; 2023 American Community Survey (ACS) five-year estimates (2019â€“2023); and the Health Resources and Services Administration (HRSA) combined *Health Center Service Delivery and Look-Alike Sites* file retrieved on November 11, 2026. PLACES uses model-based small-area estimation and publishes 95% confidence intervals (CIs); this analysis uses point estimates only and does not propagate PLACES or ACS uncertainty. PLACES estimates are used descriptively and are not converted into an overall-health ranking. The composite is a researcher-created exploratory descriptive index combining selected health, socioeconomic, and proximity indicators. It is not a CDC measure, validated health ranking, causal model, predictive score, or resource-allocation instrument.

**Results:** Adult food-insecurity prevalence ranged from 6.9% to 48.0% across 26 ZCTAs. Its rank association with poverty was Ï = 0.953 (n = 26), and its association with median household income was Ï = âˆ’0.960 (n = 25). These are exploratory ecological associations. Median household income was missing for ZCTA 43547 and was not imputed; its dependent social-disadvantage score and exploratory composite remain null, leaving 25 complete composites. Under the proximity-led composite sensitivity scheme, the rank correlation with the published ordering was Ï = 0.628 (n = 25).

**Conclusions:** This one-county pilot demonstrates an auditable approach to examining public-source estimates alongside a narrowly defined straight-line proximity measure. Its small, spatially dependent sample supports descriptive exploration only; no differences are established as statistically significant. The index is not validated, and the distance measure does not represent travel time or actual healthcare access.

**Keywords:** ZCTA; health equity; social determinants of health; geographic information systems; spatial accessibility; food insecurity; health insurance; composite indicators; ecological analysis; reproducibility

## 1. Background

Health-related estimates are shaped by social and economic context, and their geographic distributions can prompt locally grounded research questions. Area-level summaries, however, can conceal within-area differences and should not be interpreted as individual-level measures [1,2]. Similarly, healthcare access is multidimensional: distance alone does not establish service availability, affordability, acceptability, or use [3â€“7].

AccessBridge is an interdisciplinary exploratory project integrating software engineering, geospatial data processing, public-health estimates, and health-equity questions. This manuscript describes one Lucas County pilot using a fixed published snapshot. It does not report a causal effect, individual-level association, prediction, clinical risk assessment, or evaluation of actual healthcare service access.

### 1.1. Research questions

1. How do selected health, food-insecurity, socioeconomic, insurance, and HRSA proximity estimates vary across the 26 Lucas County study ZCTAs?
2. Which pairs of indicators demonstrate descriptive rank co-patterning in this snapshot?
3. How does the ordering of the published exploratory composite change under the alternative weighting schemes evaluated in the Phase 2 analysis?

### 1.2. Research contribution

The contribution is a documented integration of public-source estimates and geospatial transformations, with source vintages, retrieval dates, joins, hashes, denominators, missingness, and interpretation limits made explicit. The work is a software and geospatial research prototype, not a validated index or statewide assessment.

### 1.3. Related work

Social epidemiology and health-equity literature emphasizes broader social determinants and careful interpretation of population-level measures [1,2]. Healthcare access frameworks distinguish several dimensions, while GIS methods range from simple proximity measures to approaches incorporating supply, demand, transportation, or spatial competition [3â€“7]. AccessBridge's nearest-site distance measure represents a narrower construct than these broader approaches.

The analysis is ecological: each observation represents a ZCTA, not an individual. Ecological correlations do not establish individual-level relationships. Spatial results can also depend on the choice and aggregation of areal units [8]. Composite indicators embed methodological choices concerning constructs, normalization, direction, missingness, and weighting; these choices should be transparent and examined through sensitivity analysis [9].

## 2. Methods

### 2.1. Study area and datasets

The fixed snapshot `20261111T233311Z` was generated on November 11, 2026, and contains 26 2020 Census ZCTAs assigned to Lucas County, Ohio, using the largest-land-area-overlap county rule. For each ZCTA in the national 2020 Census ZCTAâ€“County Relationship File, the county with the largest `AREALAND_PART` was identified; ZCTAs whose winning county was Lucas County (FIPS `39095`) were retained [16]. This procedure assigns each ZCTA to one county based on its largest land-area intersection nationally, rather than selecting the largest intersections among ZCTAs that happen to intersect Lucas County. ZCTAs are statistical geographies, not USPS ZIP Codes [12]. Full ZCTA boundaries were retained, so selected areas may extend beyond Lucas County; estimates are not restricted to the portions of each ZCTA polygon within the county. Study coverage and analytic characteristics are summarized in Table 1.

**Table 1. Study coverage and analytic characteristics**

| Characteristic | Value |
|---|---|
| Design | Cross-sectional, descriptive, ecological pilot |
| Study area | Lucas County, Ohio; one county |
| Snapshot | `20261111T233311Z`; generated November 11, 2026 |
| Geographic unit | 26 2020 Census ZCTAs |
| ZCTA selection | Each national 2020 ZCTAâ€“County relationship assigned to its largest land-area-overlap county; 26 ZCTAs assigned to Lucas County (FIPS 39095) |
| Health and food-insecurity source | CDC PLACES: ZCTA Data (GIS Friendly Format), 2025 release; selected measures use 2023 BRFSS |
| Socioeconomic and insurance source | 2023 ACS five-year estimates, 2019â€“2023 period |
| Facility-proximity input | Combined HRSA Health Center Service Delivery and Look-Alike Sites CSV retrieved November 11, 2026; mutable publisher file, not a pinned historical vintage |
| Complete published composites | 25 of 26; median income missing for ZCTA 43547 |

PLACES uses multilevel regression and poststratification to produce small-area estimates. Its methodology describes Monte Carlo simulation of 1,000 draws and reports point estimates with 95% CIs [14]. The selected PLACES 2025 measures use 2023 BRFSS data [15]. Archived metadata identifies `foodinsecu_crudeprev` as a model-based crude adult prevalence estimate for food insecurity in the past 12 months and identifies a corresponding `FOODINSECU_Crude95CI` field [11]. This analysis uses the prevalence point estimate, not the CI, and does not propagate estimate uncertainty. The archived field description does not establish more specific survey-item wording. Food-insecurity prevalence is not a direct count of people, a grocery-retailer measure, or a measure of geographic food access. PLACES estimates are used descriptively and are not converted into an overall-health ranking.

ACS measures use the 2019â€“2023 five-year estimate period [10]. Insurance indicators describe the civilian noninstitutionalized population and aggregate insured and uninsured counts and percentages; they do not distinguish private from public coverage. Insurance coverage does not measure affordability, out-of-pocket exposure, network adequacy, continuity of coverage, healthcare utilization, or health outcomes.

The HRSA input is the combined *Health Center Service Delivery and Look-Alike Sites* file retrieved November 11, 2026 [13]. A qualifying record has `Site Status Description` equal to `Active` and finite numeric coordinates within latitude 17â€“72 and longitude âˆ’180 to âˆ’64. The calculation does not filter to FQHC records or to `Service Delivery Site` classifications. The nearest qualifying active HRSA-listed site is measured from the Census Gazetteer ZCTA internal point using haversine great-circle distance, in kilometers.

The author reports that HRSA provided written confirmation that no restrictions apply to the intended research use covered by that response. This refers to research use; it is not represented as permission to redistribute the original HRSA source file or facility-level records. The source response, its exact wording and date, and any broader permissions are not reproduced here. The analysis publishes aggregate ZCTA-level distance results and does not reproduce the source file or facility-level records. No HRSA endorsement is implied.

### 2.2. Data processing and geographic methodology

The analysis uses the published metrics and feature bundle without changing or regenerating them. The published manifest identifies source versions, retrieval timestamps, hashes, transformations, joins, missingness, and output hashes. Existing Phase 2 validation independently reproduced the published ACS and PLACES values from archived inputs, recalculated HRSA distances, and reproduced the composite, including its null value for ZCTA 43547.

The U.S. Census Bureau 2020 ZCTAâ€“County Relationship File records `AREALAND_PART` by ZCTAâ€“county pair. The pipeline evaluates the national relationship file and retains, for each ZCTA, the county associated with its largest land-area intersection. It then selects ZCTAs whose assigned county FIPS is `39095` (Lucas County). The selection was independently reproduced using the same relationship-file snapshot recorded in the manifest: the national file contained 33,791 unique ZCTAs, and the resulting 26 Lucas County assignments matched all 26 ZCTAs in the manifest, with no additional or missing ZCTAs. No tied maximum-area county assignments were identified in that verification. The pipeline retains the full 2020 TIGER/Line ZCTA polygon. One Census 2020 Gazetteer internal point (`INTPTLAT`, `INTPTLONG`) represents each ZCTA for distance calculations; it is not population weighted.

The HRSA calculation uses the source coordinate columns `Geocoding Artifact Address Primary Y Coordinate` (latitude) and `Geocoding Artifact Address Primary X Coordinate` (longitude). It accepts active rows with finite coordinates within latitude 17â€“72 and longitude âˆ’180 to âˆ’64, without a center-type or site-classification filter, and calculates the minimum haversine great-circle distance from each Census Gazetteer internal point. The Earth-radius constant is 6,371.0088 km; output is rounded to 0.001 km.

This is straight-line distance to the nearest qualifying active HRSA-listed site, not road distance, driving or transit time, facility capacity, service availability, affordability, or realized access.

### 2.3. Indicator definitions and denominators

Table 2 lists the source fields, denominators, and limitations for each published indicator.

**Table 2. Published indicators, source fields, and reference populations**

| Indicator | Source fields / calculation | Denominator or reference; limitation |
|---|---|---|
| Diabetes, high blood pressure, depression | CDC PLACES `diabetes_crudeprev`, `bphigh_crudeprev`, `depression_crudeprev` | Modeled crude adult prevalence estimates; not clinical case counts |
| Adult food-insecurity prevalence | CDC PLACES `foodinsecu_crudeprev` | Model-based crude adult prevalence estimate for food insecurity in the past 12 months; not geographic food access |
| Median household income | ACS `B19013_001E` | ACS median in 2023 inflation-adjusted USD; not a rate |
| Poverty rate | `100 Ã— B17001_002E / B17001_001E` | Population below poverty divided by the poverty-universe population estimate |
| No-vehicle household rate | `100 Ã— (B25044_003E + B25044_010E) / B25044_001E` | No-vehicle owner- and renter-occupied households divided by occupied households |
| Uninsured population estimate (count) | Sum of 18 B27001 no-coverage estimate cells | B27001_001E civilian noninstitutionalized population denominator; not a private/public coverage split |
| Insured population estimate (count) | `B27001_001E âˆ’ uninsured estimate` | Same civilian noninstitutionalized population denominator |
| Insured/uninsured population percentages | Count divided by `B27001_001E Ã— 100` | ACS estimate percentages; not affordability or care utilization |

The 18 no-coverage ACS estimate cells are `B27001_005E`, `B27001_008E`, `B27001_011E`, `B27001_014E`, `B27001_017E`, `B27001_020E`, `B27001_023E`, `B27001_026E`, `B27001_029E`, `B27001_033E`, `B27001_036E`, `B27001_039E`, `B27001_042E`, `B27001_045E`, `B27001_048E`, `B27001_051E`, `B27001_054E`, and `B27001_057E`.

Invalid or sentinel values, incomplete inputs, negative values, or zero-denominator inputs are not converted into observed zeros. The published map bundle does not expose all per-ZCTA ACS numerator and denominator counts as separate map properties.

### 2.4. Composite construction and weighting

The composite is a researcher-created exploratory descriptive index combining selected health, socioeconomic, and proximity indicators. It is not a CDC measure, validated health ranking, causal model, predictive score, or resource-allocation instrument.

Each component uses an empirical midrank percentile on a 0â€“100 scale across the 26 ZCTAs where that value is present. Ties receive the average rank. For a value, the implementation computes:

\[
100 \times \frac{\text{number below} + 0.5 \times \text{number tied}}{\text{number nonmissing}}
\]

Income is reverse-ranked; adverse health prevalence, poverty, no-vehicle rate, and HRSA distance are ranked higher when values increase.

The health-need domain is the equal mean of the three PLACES percentiles (diabetes, high blood pressure, and depression). The social-disadvantage domain is the equal mean of poverty, no-vehicle rate, and reversed-income percentiles. The HRSA-distance domain is its own within-study percentile.

The published composite is the equal mean of these three domains. Each domain requires all its components, and the composite requires all three domains. No imputation is used. Missing income for ZCTA 43547 therefore leaves its social score and composite null, resulting in 25 of 26 ZCTAs having a composite.

Alternative domain-weight scenarios apply the stated weights to the existing health, social, and proximity domain scores, then compare midrank orderings among the same 25 complete composites. The seven-indicator scenario averages the seven component percentiles. The composite is not a CDC measure, validated health ranking, causal model, predictive score, or resource-allocation instrument.

### 2.5. Statistical methods

Descriptive summaries are unweighted across available ZCTAs. They are not countywide or population-weighted estimates. Pairwise associations are Spearman rank correlations using pairwise-complete observations and average ranks for ties. Sample size is reported for each pair.

CDC publishes PLACES 95% CIs, including the archived food-insecurity interval field, but this analysis uses point estimates only; no ACS margins of error or PLACES uncertainty is propagated. The Phase 2 output does not report p-values or adjust for spatial dependence, confounding, multiple comparisons, or estimate uncertainty. PLACES estimates are used descriptively and are not converted into an overall-health ranking.

Composite sensitivity compares each alternative's rank ordering with the published ordering on the 25 complete-composite ZCTAs. Sensitivity results use the existing Phase 2 output; no values or historical outputs were recalculated for this manuscript. The supplementary leave-one-ZCTA-out file reports a robustness check for two prespecified associations; it is not an inferential test (Additional file 2).

## 3. Results

Descriptive statistics across study ZCTAs are presented in Table 3.

**Table 3. ZCTA-level descriptive statistics**

Means and medians are unweighted summaries across ZCTA estimates; the mean of ZCTA medians is not the mean income of residents. Ranges give minimumâ€“maximum values. ZCTA IDs identify observed extrema.

| Indicator | n | Mean | Median | Range | Min ZCTA | Max ZCTA |
|---|---:|---:|---:|---:|---|---|
| Adult food-insecurity prevalence (%) | 26 | 19.24 | 14.50 | 6.9â€“48.0 | 43617 | 43608 |
| Poverty rate (%) | 26 | 18.17 | 14.90 | 0.83â€“55.97 | 43504 | 43604 |
| Diabetes prevalence (%) | 26 | 14.45 | 12.90 | 10.5â€“23.9 | 43560 | 43608 |
| High blood pressure prevalence (%) | 26 | 37.52 | 36.40 | 30.7â€“48.8 | 43434 | 43608 |
| Depression prevalence (%) | 26 | 26.37 | 26.00 | 23.7â€“30.0 | 43610 | 43605 |
| Median household income (2023 USD) | 25 | $70,903 | $63,425 | $18,980â€“$167,321 | 43604 | 43542 |
| Occupied households with no vehicle (%) | 26 | 9.36 | 6.81 | 0â€“42.12 | 43542, 43547 | 43604 |
| Uninsured population (%) | 26 | 4.96 | 4.69 | 0â€“11.12 | 43547 | 43605 |
| Nearest qualifying active HRSA-listed site, straight-line distance (km) | 26 | 4.929 | 3.024 | 0.015â€“17.660 | 43620 | 43547 |
| Published exploratory composite | 25 | 49.667 | 49.453 | 22.889â€“65.009 | 43617 | 43611 |

The highest observed food-insecurity and diabetes estimates were in ZCTA 43608 (48.0% and 23.9%); the highest poverty and no-vehicle estimates were in ZCTA 43604 (55.97% and 42.12%). These are area-level extrema, not evidence that the indicators cause one another. Selected rank associations are summarized in Table 4.

**Table 4. Selected exploratory Spearman rank associations**

| Indicator pair | n | Spearman Ï |
|---|---:|---:|
| Adult food-insecurity prevalence and poverty rate | 26 | 0.953 |
| Adult food-insecurity prevalence and median household income | 25 | âˆ’0.960 |
| Adult food-insecurity prevalence and diabetes prevalence | 26 | 0.893 |
| No-vehicle household rate and HRSA straight-line distance | 26 | âˆ’0.727 |
| Diabetes and high blood pressure prevalence | 26 | 0.957 |

These coefficients describe co-ordering among aggregated ZCTAs only. The negative no-vehicle/distance association does not establish that residents can reach or use nearby services.

In leave-one-ZCTA-out checks, food insecurity versus poverty remained positive (full-sample Ï = 0.953488, n = 26; leave-one-out range 0.947672â€“0.964416), and food insecurity versus median household income remained negative (full-sample Ï = âˆ’0.959985, n = 25; range âˆ’0.966507 to âˆ’0.954763). These are checks on individual-area influence, not causal tests or independent validation (Additional file 2).

Composite sensitivity scenarios are summarized in Table 5.

**Table 5. Composite sensitivity and missingness**

| Sensitivity scheme | Health / social / proximity weights | n | Ï vs published | Mean absolute percentile-rank shift | Maximum shift | Published top-five retained |
|---|---|---:|---:|---:|---:|---:|
| Published equal domains | 1/3 / 1/3 / 1/3 | 25 | 1.000 | 0.00 | 0 | 5/5 |
| Health-led | 0.50 / 0.25 / 0.25 | 25 | 0.967 | 6.08 | 16 | 4/5 |
| Social-led | 0.25 / 0.50 / 0.25 | 25 | 0.932 | 8.96 | 24 | 3/5 |
| Proximity-led | 0.25 / 0.25 / 0.50 | 25 | 0.628 | 20.48 | 48 | 2/5 |
| Health + social only | 0.50 / 0.50 / 0 | 25 | 0.832 | 13.76 | 32 | 3/5 |
| Equal across seven component indicators | Indicator-level equal weights | 25 | 0.866 | 12.48 | 28 | 3/5 |

The proximity-led scheme changes ordering the most among these alternatives. Its Ï = 0.628 indicates sensitivity to weighting, not validation or predictive accuracy.

Median household income is missing for ZCTA 43547, so the published composite is available for 25 areas. In a separate complete-case sensitivity calculation, ranks recomputed after excluding that ZCTA had Ï = 0.998846 versus published ranks on the same 25 areas, mean absolute percentile-rank shift 0.16, and maximum shift 1 point. This does not establish that the missing value is ignorable. The existing sensitivity output is provided in Additional file 1.

Figure 1 maps the indicator-specific patterns; Figure 2 displays selected area-level co-patterns.

**Figure 1. Indicator-specific maps across the Lucas County study ZCTAs.** Each panel has its own scale; colors are not comparable between panels. Adult food-insecurity prevalence is not geographic food access.

![Published Phase 2 indicator maps](./Figure_1_Indicator_maps.png)

**Figure 2. Selected area-level associations.** Scatterplots show descriptive co-patterning, not causal or individual-level relationships.

![Published Phase 2 association scatterplots](./Figure_2_Associations.png)

## 4. Discussion

The strong food-insecurityâ€“poverty and food-insecurityâ€“income rank associations indicate that these area-level estimates co-vary in this sample. They are not independent proof of a mechanism or causal relationship. Poverty, income, and vehicle availability are ACS-derived and share source and geographic context. Food insecurity is a PLACES measure, but its association with ACS poverty still compares conceptually related constructs over the same geographies.

Reference populations differ: PLACES prevalence concerns adults, poverty uses the poverty-universe population, vehicle availability uses occupied households, and insurance uses the civilian noninstitutionalized population. Denominators vary, and ZCTA summaries weight areas equally rather than residents. CDC publishes 95% CIs for PLACES estimates, but this analysis uses point estimates only and does not propagate either PLACES or ACS uncertainty. Apparent differences are therefore not statistically established.

PLACES estimates are used descriptively and are not converted into an overall-health ranking; the study-specific index must not be interpreted as such a ranking.

The composite is mathematically coupled to its component indicators. Associations among the composite and its inputs cannot independently validate it. The AccessBridge composite is a researcher-created exploratory descriptive index combining selected health, socioeconomic, and proximity indicators; it is not a CDC measure, validated health ranking, causal model, predictive score, or resource-allocation instrument. Reweighting is a sensitivity probe of normative choices, not external validation. The proximity-led Ï = 0.628 reflects sensitivity to weighting, not validation or predictive accuracy.

The leave-one-out results suggest that these two correlations are not dominated by one ZCTA, but they do not supply independent validation. Spatial dependence is not modeled, and with 25â€“26 areas, coefficients can be sensitive to observations, ties, aggregation, and shared context.

Finally, an internal point-to-site straight-line distance omits road networks, transit, barriers, service capacity, hours, eligibility, affordability, and appointment availability. Insurance coverage likewise does not establish affordability or healthcare utilization. The evidence supports description of mapped estimates, not conclusions about actual healthcare access.

### 4.1. Limitations

1. **Geographic scope:** This is a one-county, 26-ZCTA pilot, not representative statewide research. ZCTAs can cross the county boundary; area-level results do not describe individuals.
2. **Sample size and spatial structure:** The small spatially structured sample is not adjusted for spatial autocorrelation, confounding, multiple comparisons, or influential observations.
3. **Geographic representation:** ZCTAs are assigned to one county according to the largest land-area intersection in the national relationship file. This assignment rule and the use of full ZCTA boundaries affect the geographic units; internal points do not represent residents' locations.
4. **Source periods and uncertainty:** Sources have different reference periods. ACS margins of error and published PLACES 95% CIs are not propagated; only PLACES point estimates are analyzed. PLACES estimates are used descriptively rather than converted into an overall-health ranking. HRSA is a mutable file retrieved November 11, 2026, not a pinned historical release. The author reports written HRSA confirmation that no restrictions apply to the research use covered by the response.
5. **Denominators and construct overlap:** Denominators and constructs differ; multiple socioeconomic measures share ACS provenance. Composite-input associations are mathematically coupled.
6. **Measurement limitations:** Food-insecurity prevalence is not geographic food access; insurance is not affordability or utilization; straight-line HRSA proximity is not travel time or realized access.
7. **Composite validity:** Composite percentiles depend on this study set, indicators, directions, and weights and lack external or construct validation.
8. **Missing data:** Income is missing for ZCTA 43547. The affected score and composite remain null; the complete-case sensitivity analysis does not identify a missingness mechanism.

### 4.2. Implications

Individual indicators should remain visible with their source, reference period, denominator, missingness, and geographic limitations. Food-insecurity prevalence should not be relabeled as food access, insurance coverage as affordability or utilization, or HRSA distance as travel time or realized access.

Future work would require uncertainty-aware spatial methods, harmonized geographies and source periods, and independently documented transportation and service-capacity data. County-specific percentile scores should not be compared across counties as if they shared a common reference distribution.

## 5. Conclusions

The fixed AccessBridge snapshot supports a reproducible descriptive account of health-related and socioeconomic variation across 26 Lucas County ZCTAs. Associations and composite sensitivity can motivate further research questions but do not support causal, individual-level, clinical, predictive, or statewide conclusions.

The contribution is a transparent research and visualization workflow, not a validated index or a measure of actual healthcare access.

## 6. List of abbreviations

- **ACS:** American Community Survey
- **BPHC:** Bureau of Primary Health Care
- **CDC:** Centers for Disease Control and Prevention
- **CI:** Confidence interval
- **HRSA:** Health Resources and Services Administration
- **PLACES:** Population Level Analysis and Community Estimates
- **ZCTA:** ZIP Code Tabulation Area

## 7. Additional files

**Additional file 1:** `Supplementary_composite_sensitivity.csv` (CSV). Existing Phase 2 composite-weight sensitivity estimates and rank-shift summaries used in Table 5.

**Additional file 2:** `Supplementary_leave_one_ZCTA_out.csv` (CSV). Existing Phase 3 leave-one-ZCTA-out results for the two prespecified pairwise associations.

## 8. Declarations

### 8.1. Ethics approval and consent to participate

Not applicable. This study used secondary, publicly available, geographically aggregated estimates and did not involve human participants, individual-level human data, or human tissue.

### 8.2. Consent for publication

Not applicable. The manuscript does not contain data from an identifiable individual person.

### 8.3. Availability of data and materials

## Availability of data and materials

The analysis is based on the frozen AccessBridge data snapshot identified as `20261111T233311Z`. Project source code, documentation, aggregate ZCTA-level analytical outputs, and permitted reproducibility materials are available through the [AccessBridge GitHub repository](https://github.com/Shikha144/AccessBridge). The original project code is distributed under the MIT License. This license does not extend to third-party datasets or source materials, which remain subject to their respective data-use and redistribution terms.

The `SOURCE_AND_OUTPUT_MANIFEST.json` file documents data provenance and output checksums to support traceability and reproducibility.

The original Health Resources and Services Administration (HRSA) source file and facility-level records are not included in the public release. Aggregate ZCTA-level results are presented separately from the underlying source records. Publicly available source data remain attributable to their respective providers and are subject to applicable data-use and redistribution terms.

A persistent archived release identifier or DOI has not yet been assigned. A DOI will be added following archival deposit and verification of the archived release.

### 8.4. Competing interests

I declare that I have no competing interests.

### 8.5. Funding

I received no specific funding for this research.

### 8.6. Authors' contributions

Shikha Sharma: Conceptualization, methodology, software, data curation, formal analysis, investigation, visualization, writing â€“ original draft, and writing â€“ review and editing. I reviewed and approved the final manuscript.

### 8.7. Acknowledgements

Not applicable.

### 8.8. Use of generative AI and AI-assisted technologies

ChatGPT (OpenAI) was used as an AI-assisted tool during software-development support and manuscript preparation, including assistance with code-related problem solving, organization, and language refinement. The author reviewed and edited the material, is responsible for the final content, and must independently verify all code, calculations, data interpretations, citations, and references. ChatGPT is not an author and was not used as a substitute for source-data validation or author responsibility.

## 9. References

1. Braveman P, Egerter S, Williams DR. The Social Determinants of Health: Coming of Age. *Annual Review of Public Health*. 2011;32:381â€“398. https://doi.org/10.1146/annurev-publhealth-031210-101218

2. Krieger N. A glossary for social epidemiology. *Journal of Epidemiology and Community Health*. 2001;55(10):693â€“700. https://doi.org/10.1136/jech.55.10.693

3. Penchansky R, Thomas JW. The Concept of Access: Definition and Relationship to Consumer Satisfaction. *Medical Care*. 1981;19(2):127â€“140. https://doi.org/10.1097/00005650-198102000-00001

4. Guagliardo MF. Spatial accessibility of primary care: concepts, methods and challenges. *International Journal of Health Geographics*. 2004;3:3. https://doi.org/10.1186/1476-072X-3-3

5. Luo W, Wang F. Measures of Spatial Accessibility to Health Care in a GIS Environment: Synthesis and a Case Study in the Chicago Region. *Environment and Planning B: Planning and Design*. 2003;30(6):865â€“884. https://doi.org/10.1068/b29120

6. McLafferty SL. GIS and Health Care. *Annual Review of Public Health*. 2003;24:25â€“42. https://doi.org/10.1146/annurev.publhealth.24.012902.141012

7. Wang F. Measurement, Optimization, and Impact of Health Care Accessibility: A Methodological Review. *Annals of the Association of American Geographers*. 2012;102(5):1104â€“1112. https://doi.org/10.1080/00045608.2012.657146

8. Fotheringham AS, Wong DWS. The Modifiable Areal Unit Problem in Multivariate Statistical Analysis. *Environment and Planning A*. 1991;23(7):1025â€“1044. https://doi.org/10.1068/a231025

9. OECD, European Union, and Joint Research Centre of the European Commission. *Handbook on Constructing Composite Indicators: Methodology and User Guide*. Paris: OECD Publishing; 2008. https://doi.org/10.1787/9789264043466-en

10. U.S. Census Bureau. *2023 American Community Survey 5-Year Detailed Tables*. Tables B19013, B17001, B25044, and B27001. https://api.census.gov/data/2023/acs/acs5.html. Accessed November 11, 2026.

11. Centers for Disease Control and Prevention. *PLACES: ZCTA Data (GIS Friendly Format), 2025 release*. Dataset `kee5-23sr`; archived metadata retrieved November 11, 2026. https://data.cdc.gov/api/views/kee5-23sr.json. Accessed November 11, 2026.

12. U.S. Census Bureau. *2020 TIGER/Line Cartographic Boundary Files and 2020 ZCTA Gazetteer*. https://www.census.gov/geographies/mapping-files/time-series/geo/tiger-line-file.2020.html; https://www2.census.gov/geo/docs/maps-data/data/gazetteer/2020_Gazetteer/2020_Gaz_zcta_national.zip. Accessed November 11, 2026.

13. Health Resources and Services Administration. *Health Center Service Delivery and Look-Alike Sites* data file. Retrieved November 11, 2026. https://data.hrsa.gov/DataDownload/DD_Files/Health_Center_Service_Delivery_and_LookAlike_Sites.csv. Accessed November 11, 2026.

14. Centers for Disease Control and Prevention. *PLACES: Methodology*. Small area estimation, Monte Carlo simulation, and estimate uncertainty. https://www.cdc.gov/places/methodology/. Accessed November 11, 2026.

15. Centers for Disease Control and Prevention. *PLACES: Current Release Notes*. December 2025 release; 2023 BRFSS and 2019â€“2023 ACS vintages. https://www.cdc.gov/places/current-release-notes/. Accessed November 11, 2026.

16. U.S. Census Bureau. *2020 Census ZCTA-to-County Relationship File*. 2020 Census ZCTA5 Relationship Files. https://www2.census.gov/geo/docs/maps-data/data/rel2020/zcta520/tab20_zcta520_county20_natl.txt. Accessed November 11, 2026.