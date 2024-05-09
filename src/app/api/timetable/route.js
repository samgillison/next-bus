import { readFileSync } from "fs"
import { closeDb, getRoutes, getStops, getStoptimes, getTrips, openDb } from "gtfs"

import { timeToMilli } from "@/lib/utils"

export const GET = async (request) => {
  const { routeId } = Object.fromEntries(request.nextUrl.searchParams)

  const config = JSON.parse(readFileSync("config.json"))

  const db = openDb(config)

  let timetable = {}

  const trips = getTrips({ route_id: routeId })

  const route = getRoutes({ route_id: routeId })[0]

  trips.forEach(trip => {
    const stopTimes = getStoptimes({ trip_id: trip.trip_id }, [], [["stop_sequence", "ASC"]])

    stopTimes.forEach(stopTime => {
      const stop = getStops({stop_id: stopTime.stop_id })[0]

      if (
        timeToMilli(stopTime.departure_time) > timeToMilli("04:00:00") && 
        timeToMilli(stopTime.departure_time) < timeToMilli("24:00:00")
      ) {
        if (!timetable.hasOwnProperty(trip.trip_headsign)) {
          timetable[trip.trip_headsign] = {}
        }
      
        if (!timetable[trip.trip_headsign].hasOwnProperty(stop.stop_name)) {
          timetable[trip.trip_headsign][stop.stop_name] = []
        }

        timetable[trip.trip_headsign][stop.stop_name].push(stopTime.departure_time)
      }
    })
  })

  closeDb(db)

  for (const [heading, _] of Object.entries(timetable)) {
    for (const [stop, _] of Object.entries(timetable[heading])) {
      timetable[heading][stop].sort((a, b) => {
        if (timeToMilli(a) < timeToMilli(b)) {
          return -1
        }
      })
    }
  }

  return Response.json({
    title: route.route_short_name,
    timetable
  })
}