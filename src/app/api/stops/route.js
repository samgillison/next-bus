import { closeDb, getStops, openDb } from "gtfs"
import { readFileSync } from "fs"

export const GET = async (request) => {
  const { minLng, minLat, maxLng, maxLat } = Object.fromEntries(request.nextUrl.searchParams)

  const config = JSON.parse(readFileSync("config.json"))

  const db = openDb(config)

  const allStops = getStops(
    {},
    ["stop_name", "stop_lon", "stop_lat"]
  )
  
  closeDb(db)
  
  const stops = allStops.filter((stop) => {
    const isLngInBounds = stop.stop_lon >= minLng && stop.stop_lon <= maxLng
    const isLatInBounds = stop.stop_lat >= minLat && stop.stop_lon <= maxLat

    return isLngInBounds && isLatInBounds
  })

  const geojson = {
    type: "FeatureCollection",
    features: []
  }

  stops.forEach((stop) => {
    geojson.features.push({
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [stop.stop_lon, stop.stop_lat]
      },
      properties: {
        stop_name: stop.stop_name
      }
    })
  })

  return Response.json(geojson)
}