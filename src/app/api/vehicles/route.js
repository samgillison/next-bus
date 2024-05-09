import gtfs from "gtfs-realtime-bindings"
import { readFileSync } from "fs"
import { closeDb, getRoutes, openDb } from "gtfs"

import { getQueryString } from "@/lib/utils"

export const GET = async (request) => {
  const query = Object.fromEntries(request.nextUrl.searchParams)

  const response = await fetch(`https://data.bus-data.dft.gov.uk/api/v1/gtfsrtdatafeed/${getQueryString(query)}`)
  const buffer = await response.arrayBuffer()

  const feed = gtfs.transit_realtime.FeedMessage.decode(new Uint8Array(buffer))

  let geojson = {
    type: "FeatureCollection",
    features: []
  }

  const db = openDb(JSON.parse(readFileSync("config.json")))

  feed.entity.forEach((entity) => {
    if (entity.vehicle.trip.routeId === "") return

    const route = getRoutes(
      {
        route_id: entity.vehicle.trip.routeId
      },
      ["route_short_name"]  
    )   

    geojson.features.push({
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [entity.vehicle.position.longitude, entity.vehicle.position.latitude]
      },
      properties: {
        route_id: entity.vehicle.trip.routeId,
        route_short_name: route[0]?.route_short_name,
      }
    })
  })

  closeDb(db)

  return Response.json(geojson)
}