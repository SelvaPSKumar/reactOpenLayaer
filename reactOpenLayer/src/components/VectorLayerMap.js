import React, { useEffect, useRef } from 'react';
import GeoJSON from 'ol/format/GeoJSON';
import Map from 'ol/Map';
import View from 'ol/View';
import VectorSource from 'ol/source/Vector';
import VectorLayer from 'ol/layer/Vector';
import { Style, Stroke, Fill } from 'ol/style';

const VectorLayerMap = () => {
  const mapRef = useRef(null); // To reference the map container
  const infoRef = useRef(null); // To reference the info container
  const highlightRef = useRef(null); // To persist the highlight variable

  useEffect(() => {
    // Define the vector layer
    const vectorLayer = new VectorLayer({
      background: '#1a2b39',
      source: new VectorSource({
        url: 'https://openlayers.org/data/vector/ecoregions.json',
        format: new GeoJSON(),
      }),
      style: (feature) =>
        new Style({
          fill: new Fill({
            color: feature.get('COLOR') || '#eee',
          }),
        }),
    });

    // Define the highlight overlay
    const featureOverlay = new VectorLayer({
      source: new VectorSource(),
      style: new Style({
        stroke: new Stroke({
          color: 'rgba(255, 255, 255, 0.7)',
          width: 2,
        }),
      }),
    });

    // Initialize the map
    const map = new Map({
      target: mapRef.current,
      layers: [vectorLayer, featureOverlay],
      view: new View({
        center: [0, 0],
        zoom: 1,
      }),
    });

    const displayFeatureInfo = (pixel) => {
      const feature = map.forEachFeatureAtPixel(pixel, (feat) => feat);

      if (infoRef.current) {
        infoRef.current.innerHTML = feature?.get('ECO_NAME') || '&nbsp;';
      }

      if (feature !== highlightRef.current) {
        if (highlightRef.current) {
          featureOverlay.getSource().removeFeature(highlightRef.current);
        }
        if (feature) {
          featureOverlay.getSource().addFeature(feature);
        }
        highlightRef.current = feature;
      }
    };

    // Add event listeners
    map.on('pointermove', (evt) => {
      if (evt.dragging) return;
      displayFeatureInfo(evt.pixel);
    });

    map.on('click', (evt) => {
      displayFeatureInfo(evt.pixel);
    });

    // Cleanup on unmount
    return () => {
      map.setTarget(null);
    };
  }, []);

  return (
    <>
      <style>
        {`
          .map {
            width: 100%;
            height: 400px;
          }
        `}
      </style>
      <div ref={mapRef} className="map"></div>
      <div ref={infoRef} id="info">&nbsp;</div>
    </>
  );
};

export default VectorLayerMap;
