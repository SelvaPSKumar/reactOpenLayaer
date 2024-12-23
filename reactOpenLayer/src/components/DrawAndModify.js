import React, { useEffect, useRef, useState } from 'react';
import Map from 'ol/Map.js';
import View from 'ol/View.js';
import { Draw, Modify, Snap } from 'ol/interaction.js';
import { OSM, Vector as VectorSource } from 'ol/source.js';
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer.js';
import { get } from 'ol/proj.js';

const DrawAndModify = () => {
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);
  const [type, setType] = useState('Point'); // Default geometry type

  useEffect(() => {
    // Initialize raster and vector layers
    const raster = new TileLayer({
      source: new OSM(),
    });

    const source = new VectorSource();
    const vector = new VectorLayer({
      source: source,
      style: {
        'fill-color': 'rgba(255, 255, 255, 0.2)',
        'stroke-color': '#ffcc33',
        'stroke-width': 2,
        'circle-radius': 7,
        'circle-fill-color': '#ffcc33',
      },
    });

    // Set extent
    const extent = get('EPSG:3857').getExtent().slice();
    extent[0] += extent[0];
    extent[2] += extent[2];

    // Initialize map
    const newMap = new Map({
      layers: [raster, vector],
      target: mapRef.current,
      view: new View({
        center: [-11000000, 4600000],
        zoom: 4,
        extent,
      }),
    });

    // Add Modify interaction
    const modify = new Modify({ source });
    newMap.addInteraction(modify);

    setMap(newMap);

    return () => {
      newMap.setTarget(null); // Cleanup on unmount
    };
  }, []);

  useEffect(() => {
    if (!map) return;

    // Add Draw and Snap interactions
    const source = map.getLayers().getArray()[1].getSource(); // Vector layer source
    const draw = new Draw({
      source,
      type,
    });
    const snap = new Snap({ source });

    map.addInteraction(draw);
    map.addInteraction(snap);

    return () => {
      // Cleanup interactions
      map.removeInteraction(draw);
      map.removeInteraction(snap);
    };
  }, [map, type]); // Update whenever `map` or `type` changes

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
      <form>
        <label htmlFor="type">Geometry type &nbsp;</label>
        <select
          id="type"
          value={type}
          onChange={(e) => setType(e.target.value)} // Update state on change
        >
          <option value="Point">Point</option>
          <option value="LineString">LineString</option>
          <option value="Polygon">Polygon</option>
          <option value="Circle">Circle</option>
        </select>
      </form>
    </>
  );
};

export default DrawAndModify;
