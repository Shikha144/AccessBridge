import { useMemo, useState } from 'react';
import Map, { Layer, NavigationControl, Popup, Source, type MapLayerMouseEvent } from 'react-map-gl/maplibre';
import { RESEARCH_INDICATORS, researchRiskDirection, researchValue, type ResearchIndicatorKey, type ResearchLoadedData } from '../lib/researchData';
import { buildRiskClassifier, riskColor } from '../lib/researchRisk';

const lineLayer = { id: 'zcta-outline', type: 'line' as const, paint: { 'line-color': '#667781', 'line-width': 0.7 } };

export default function AccessBridgeMap({ data, indicator, selected, onSelect }: {
  data: ResearchLoadedData; indicator: ResearchIndicatorKey; selected: string | null; onSelect: (zcta: string) => void;
}) {
  const [hover, setHover] = useState<{ id: string; longitude: number; latitude: number } | null>(null);
  const definition = RESEARCH_INDICATORS.find((item) => item.key === indicator)!;
  const classify = useMemo(() => buildRiskClassifier(
    [...data.areas.values()].map((area) => researchValue(area, indicator)), researchRiskDirection(indicator),
  ), [data, indicator, definition.key]);
  const geojson = useMemo(() => ({
    ...data.overview,
    features: data.overview.features.map((feature) => {
      const id = String(feature.properties?.zcta5 ?? '');
      const value = data.areas.has(id) ? researchValue(data.areas.get(id)!, indicator) : null;
      const rgb = riskColor(classify(value));
      return { ...feature, properties: { ...feature.properties, mapValue: value, fillColor: `rgb(${rgb.join(',')})` } };
    }),
  }) as never, [data, indicator, classify]);
  const onMove = (event: MapLayerMouseEvent) => {
    const feature = event.features?.[0];
    const id = feature?.properties?.zcta5;
    setHover(typeof id === 'string' ? { id, longitude: event.lngLat.lng, latitude: event.lngLat.lat } : null);
  };
  const label = (id: string) => data.areas.get(id)?.county_name ?? 'Lucas County study area';
  const area = hover ? data.areas.get(hover.id) : null;
  const shown = area ? researchValue(area, indicator) : null;

  return <div style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
 <Map
 style={{ width: '100%', height: '100%' }}
    initialViewState={{ bounds: data.bounds, fitBoundsOptions: { padding: 30 } }}
    mapStyle="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
    interactiveLayerIds={['zcta-fill']}
    onMouseMove={onMove}
    onMouseLeave={() => setHover(null)}
    onClick={(event) => { const id = event.features?.[0]?.properties?.zcta5; if (typeof id === 'string') onSelect(id); }}
    aria-label="Lucas County ZCTA indicator map"
  >
    <NavigationControl position="top-right" />
    <Source id="study-areas" type="geojson" data={geojson}>
      <Layer id="zcta-fill" type="fill" paint={{ 'fill-color': ['get', 'fillColor'], 'fill-opacity': 0.72 }} />
      <Layer {...lineLayer} />
      {selected && <Layer id="selected-outline" type="line" filter={['==', ['get', 'zcta5'], selected]} paint={{ 'line-color': '#101820', 'line-width': 2.5 }} />}
    </Source>
    {hover && <Popup longitude={hover.longitude} latitude={hover.latitude} closeButton={false} closeOnClick={false} anchor="bottom">
      <strong>ZCTA {hover.id}</strong><br />{label(hover.id)}<br />{definition.label}: {shown == null ? 'No data' : (awaitFormat(shown, indicator))}
    </Popup>}
   </Map>
</div>;
}

function awaitFormat(value: number, indicator: ResearchIndicatorKey): string {
  if (indicator === 'nearest_hrsa_center_km') return `${(value * 0.621371192237334).toFixed(2)} mi`;
  if (indicator === 'median_household_income_usd') return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value);
  if (indicator.endsWith('_pct')) return `${value.toFixed(1)}%`;
  return `${value.toFixed(1)} / 100`;
}
