"use client"

import { useSearchParams } from "next/navigation"
import useSWR from "swr"

import { fetcher } from "@/lib/utils"

export const TimeTableDisplay = () => {
  const { route_id } = Object.fromEntries(useSearchParams())

  const { data, isLoading } = useSWR(route_id && `/api/timetable?routeId=${route_id}`, fetcher, {
    keepPreviousData: true
  })

  if (isLoading) return <p style={{ color: "white" }}>Loading...</p>

  return (
    <div style={{ color: "white" }}>
      <h1>Route {data.title}</h1>
      {Object.entries(data.timetable).map(([heading, _]) => (
        <>
          <h3>To {heading}</h3>
          <table style={{ fontSize: "12px" }}>
            {Object.entries(data.timetable[heading]).map(([stop, _]) => (
              <tr>
                <th>{stop}</th>
                {data.timetable[heading][stop].map(time => (
                  <td>{time}</td>
                ))}
              </tr>
            ))}
          </table>
        </>
      ))}
    </div>
  )
}