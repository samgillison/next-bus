"use client"

import { fetcher } from "@/lib/utils"
import { useSearchParams } from "next/navigation"
import { useEffect } from "react"
import { Layer, Map, NavigationControl, Source } from "react-map-gl"
import useSWR from "swr"

export const RouteMap = () => {
  const { centre, route_id } = Object.fromEntries(useSearchParams())

  const { data, isLoading } = useSWR(route_id && `/api/route?routeId=${route_id}`, fetcher, {
    keepPreviousData: true
  })

  return (
    <Map
      mapboxAccessToken="pk.eyJ1Ijoic2FtZ2lsbGlzb24iLCJhIjoiY2xubTk5eTVqMDEyMDJxbnh6cmM5cXI1ZSJ9.r-e86hPNdHoNO4WnGVIrCA"
      mapStyle="mapbox://styles/mapbox/streets-v12"
      initialViewState={{
        longitude: centre.split(',')[0],
        latitude: centre.split(',')[1],
        zoom: 13
      }}
    >
      {data && (
        <>
          <Source type="geojson" data={data.route}>
            <Layer id="route_layout" type="line"/>
          </Source>
          <Source type="geojson" data={data.stops}>
            <Layer id="route_stops" type="circle"/>
          </Source>
        </>
      )}

      {isLoading && (
        <div className="map-status">Loading...</div>
      )}

      <NavigationControl showCompass={false}/>
    </Map>
  )
}