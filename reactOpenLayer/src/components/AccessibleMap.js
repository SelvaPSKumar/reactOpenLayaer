import React, { useEffect, useRef } from "react"
import "ol/ol.css"
import Map from "ol/Map"
import View from "ol/View"
import Tilelayer from "ol/layer/Tile"
import OSM from "ol/source/OSM"

const AccessibleMap = () => {

    const mapRef = useRef(null) //Reference for the Map Div
    const mapInstanceRef = useRef(null) //Reference for the Map Instance

    useEffect( () => {
        // Initialize the map only once
        mapInstanceRef.current = new Map({
            target: mapRef.current,
            layers: [
                new Tilelayer({
                    source: new OSM(),
                }),
            ],
            view: new View({
                center: [0, 0],
                zoom: 2,
            }),
        });

        return() => {
            // Clean up the map instance on component unmount
            if(mapInstanceRef.current) {
                mapInstanceRef.current.setTarget(null)
            }
        }
    }, [])

    const handleZoom = (delta) => {
        const view = mapInstanceRef.current.getView()
        const currentZoom = view.getZoom()
        view.setZoom(currentZoom + delta)
    }
    
    return(
        <>
            <style>
                {`
                .map {
                width: 100%;
                height: 400px;
                }
                a.skiplink {
                position: absolute;
                clip: rect(1px, 1px, 1px, 1px);
                padding: 0;
                border: 0;
                height: 1px;
                width: 1px;
                overflow: hidden;
                }
                a.skiplink:focus {
                clip: auto;
                height: auto;
                width: auto;
                background-color: #fff;
                padding: 0.3em;
                }
                #map:focus {
                outline: #4A74A8 solid 0.15em;
                }
                `}
            </style>
            <a href="#map" className="skiplink">Go to map</a>
            <div ref={mapRef} id="map" className="map" tabIndex={0}></div>
            <button onClick={() => handleZoom(-1)}>Zoom Out</button>
            <button onClick={() => handleZoom(1)}>Zoom In</button>
        </>
    )

    // return <div ref={ mapRef } style={{ width: "100%", height: "500px" }}></div>
}

export default AccessibleMap