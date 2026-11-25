import React from 'react';
import { createRoot } from 'react-dom/client';
import 'maplibre-gl/dist/maplibre-gl.css';
import './style.css';
import AccessBridgeApp from './AccessBridgeApp';

createRoot(document.getElementById('root')!).render(
  <React.StrictMode><AccessBridgeApp /></React.StrictMode>,
);
