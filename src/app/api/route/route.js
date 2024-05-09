import { readFileSync } from "fs"
import { closeDb, getShapesAsGeoJSON, getStopsAsGeoJSON, openDb } from "gtfs"

export const GET = async (request) => {
  const { routeId } = Object.fromEntries(request.nextUrl.searchParams)

  const config = JSON.parse(readFileSync("config.json"))

  const db = openDb(config)

  const route = getShapesAsGeoJSON({
    route_id: routeId
  })

  const stops = getStopsAsGeoJSON({
    route_id: routeId
  })

  closeDb(db)

  return Response.json({ route, stops })
}