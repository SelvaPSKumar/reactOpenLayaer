import React, { useEffect, useRef } from 'react';
import MVT from 'ol/format/MVT';
import Map from 'ol/Map';
import VectorTileLayer from 'ol/layer/VectorTile';
import VectorTileSource from 'ol/source/VectorTile';
import View from 'ol/View';
import { Fill, Stroke, Style } from 'ol/style';

const VectorTiles = () => {
  const mapRef = useRef(null); // Reference for the map container

  useEffect(() => {
    const key = 'YOUR_MAPBOX_ACCESS_TOKEN'; // Replace with your actual Mapbox access token

    // Ensure the Mapbox token is valid
    if (!key || key === 'YOUR_MAPBOX_ACCESS_TOKEN') {
      console.error('Please provide a valid Mapbox access token.');
      return;
    }

    // Define the vector tile layer with Mapbox source
    const vectorTileLayer = new VectorTileLayer({
      declutter: true,
      source: new VectorTileSource({
        attributions:
          '© <a href="https://www.mapbox.com/map-feedback/">Mapbox</a> ' +
          '© <a href="https://www.openstreetmap.org/copyright">' +
          'OpenStreetMap contributors</a>',
        format: new MVT(),
        url:
          'https://{a-d}.tiles.mapbox.com/v4/mapbox.mapbox-streets-v6/' +
          '{z}/{x}/{y}.vector.pbf?access_token=' +
          key,
      }),
      style: new Style({
        fill: new Fill({ color: 'rgba(255, 255, 255, 0.6)' }),
        stroke: new Stroke({ color: '#319FD3', width: 1 }),
      }),
    });

    // Initialize the map
    const map = new Map({
      target: mapRef.current,
      layers: [vectorTileLayer],
      view: new View({
        center: [0, 0], // Adjust center to your region of interest
        zoom: 2,
      }),
    });

    // Cleanup on component unmount
    return () => map.setTarget(null);
  }, []);

  return (
    <div>
      <style>
        {`
          .map {
            width: 100%;
            height: 400px;
            background-color: #f8f4f0;
          }
        `}
      </style>
      <div ref={mapRef} className="map"></div>
    </div>
  );
};

export default VectorTiles;
