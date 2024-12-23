import React, { useEffect, useRef, useState } from 'react';
import Draw, { createBox, createRegularPolygon } from 'ol/interaction/Draw';
import Map from 'ol/Map';
import Polygon from 'ol/geom/Polygon';
import View from 'ol/View';
import { OSM, Vector as VectorSource } from 'ol/source';
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer';

const DrawShapes = () => {
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);
  const [draw, setDraw] = useState(null);
  const [type, setType] = useState('Circle');

  useEffect(() => {
    // Initialize map layers and view
    const raster = new TileLayer({ source: new OSM() });
    const source = new VectorSource({ wrapX: false });
    const vector = new VectorLayer({ source });

    // Initialize map
    const newMap = new Map({
      target: mapRef.current,
      layers: [raster, vector],
      view: new View({
        center: [-11000000, 4600000],
        zoom: 4,
      }),
    });

    setMap(newMap);

    return () => newMap.setTarget(null); // Cleanup on unmount
  }, []);

  useEffect(() => {
    if (!map) return;

    // Remove any existing draw interaction
    if (draw) {
      map.removeInteraction(draw);
    }

    // Define custom geometry function for "Star"
    const createStar = (coordinates, geometry) => {
      const center = coordinates[0];
      const last = coordinates[coordinates.length - 1];
      const dx = center[0] - last[0];
      const dy = center[1] - last[1];
      const radius = Math.sqrt(dx * dx + dy * dy);
      const rotation = Math.atan2(dy, dx);
      const newCoordinates = [];
      const numPoints = 12; // Total points in the star
      for (let i = 0; i < numPoints; ++i) {
        const angle = rotation + (i * 2 * Math.PI) / numPoints;
        const fraction = i % 2 === 0 ? 1 : 0.5; // Alternate between outer and inner points
        const offsetX = radius * fraction * Math.cos(angle);
        const offsetY = radius * fraction * Math.sin(angle);
        newCoordinates.push([center[0] + offsetX, center[1] + offsetY]);
      }
      newCoordinates.push(newCoordinates[0].slice()); // Close the geometry
      if (!geometry) {
        geometry = new Polygon([newCoordinates]);
      } else {
        geometry.setCoordinates([newCoordinates]);
      }
      return geometry;
    };

    // Add new interaction based on the selected type
    let geometryFunction = null;
    if (type === 'Square') {
      geometryFunction = createRegularPolygon(4);
    } else if (type === 'Box') {
      geometryFunction = createBox();
    } else if (type === 'Star') {
      geometryFunction = createStar;
    }

    if (type !== 'None') {
      const newDraw = new Draw({
        source: map.getLayers().getArray()[1].getSource(), // Vector layer source
        type: type === 'Square' || type === 'Box' ? 'Circle' : type,
        geometryFunction,
      });

      map.addInteraction(newDraw);
      setDraw(newDraw);
    }
  }, [map, type]); // Update whenever `map` or `type` changes

  const handleUndo = () => {
    if (draw) {
      draw.removeLastPoint();
    }
  };

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
      <div className="row">
        <div className="col-auto">
          <div className="input-group">
            <label className="input-group-text" htmlFor="type">Shape type:</label>
            <select
              className="form-select"
              id="type"
              value={type}
              onChange={(e) => setType(e.target.value)}
            >
              <option value="Circle">Circle</option>
              <option value="Square">Square</option>
              <option value="Box">Box</option>
              <option value="Star">Star</option>
              <option value="None">None</option>
            </select>
            <input
              className="form-control"
              type="button"
              value="Undo"
              onClick={handleUndo}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default DrawShapes;
