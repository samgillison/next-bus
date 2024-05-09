"use client"

import { useLiveVehicles } from "@/hooks/use-live-vehicles"
import { useStops } from "@/hooks/use-stops"
import Link from "next/link"
import { useCallback, useRef, useState } from "react"
import { GeolocateControl, Layer, Map, NavigationControl, Popup, Source } from "react-map-gl"

export default () => {
  const geoRef = useRef()

  const [cursor, setCursor] = useState()

  const [bounds, setBounds] = useState()
  const [hoverInfo, setHoverInfo] = useState()
  const [popupInfo, setPopupInfo] = useState()

  const { stops, stopsLoading } = useStops(bounds)
  const { vehicles, vehiclesLoading } = useLiveVehicles(bounds)
  
  const handleMapLoad = useCallback(() => {
    geoRef.current.trigger()
  }, [])

  const handleMapMoveEnd = useCallback((event) => {
    setBounds({
      minLng: event.target.getBounds()._sw.lng,
      minLat: event.target.getBounds()._sw.lat,
      maxLng: event.target.getBounds()._ne.lng,
      maxLat: event.target.getBounds()._ne.lat
    })
  }, [])

  const handleMouseMove = useCallback((event) => {
    const { features, point: { x, y } } = event

    const hoveredFeature = features && features[0]

    setHoverInfo(hoveredFeature && hoveredFeature.layer.id === "stops" && { feature: hoveredFeature, x, y })
  }, [])

  const handleMouseDown = useCallback((event) => {
    const { features } = event

    const hoveredFeature = features && features[0]

    setPopupInfo(hoveredFeature && hoveredFeature.layer.id === "vehicles" && { feature: hoveredFeature })
  }, [])

  const handleMouseEnter = useCallback(() => setCursor("pointer"), [])
  const handleMouseLeave = useCallback(() => setCursor(""), [])

  return (
    <Map
      mapboxAccessToken="pk.eyJ1Ijoic2FtZ2lsbGlzb24iLCJhIjoiY2xubTk5eTVqMDEyMDJxbnh6cmM5cXI1ZSJ9.r-e86hPNdHoNO4WnGVIrCA"
      mapStyle="mapbox://styles/mapbox/streets-v12"
      interactiveLayerIds={["vehicles", "stops"]}
      onLoad={handleMapLoad}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMoveEnd={handleMapMoveEnd}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      cursor={cursor}
    >
        {popupInfo && (
          <Popup 
            longitude={popupInfo.feature.geometry.coordinates[0]}
            latitude={popupInfo.feature.geometry.coordinates[1]}
            closeOnClick={false}
            closeOnMove={false}
            closeButton={false}
          >
            <p><strong>Route: </strong>{popupInfo.feature.properties.route_short_name}</p>
            <br />
            <Link href={`/route?centre=${popupInfo.feature.geometry.coordinates[0]},${popupInfo.feature.geometry.coordinates[1]}&route_id=${popupInfo.feature.properties.route_id}`} target="_blank">Show Route</Link><br />
            <Link href={`/timetable?route_id=${popupInfo.feature.properties.route_id}`} target="_blank">Show Timetable</Link>
          </Popup>
        )}

        {hoverInfo && (
          <div className="tooltip" style={{ left: hoverInfo.x, top: hoverInfo.y }}>
            <p>{hoverInfo.feature.properties.stop_name}</p>
          </div>
        )}

        {vehicles &&
          <Source type="geojson" data={vehicles}>
            <Layer id="vehicles" type="circle" paint={{ "circle-color": "red", "circle-radius": 6 }}/>
          </Source>
        }
        
        {stops && 
          <Source type="geojson" data={stops}>
            <Layer id="stops" type="circle" paint={{ "circle-color": "black", "circle-radius": 6 }}/>
          </Source>
        }

        {(stopsLoading || vehiclesLoading) && 
          <div className="map-status">
            Loading...
          </div>
        }

      <GeolocateControl
        trackUserLocation={true}
        showUserHeading={true}
        showAccuracyCircle={false}
        ref={geoRef}
      />
      <NavigationControl showCompass={false}/>
    </Map>
  )
}