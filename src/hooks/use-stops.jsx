"use client"

import useSWR from "swr"

import { fetcher } from "@/lib/utils"

export const useStops = (bounds) => {
  const { data: stops, isLoading: stopsLoading } = useSWR(
    bounds && `/api/stops?minLng=${bounds.minLng}&minLat=${bounds.minLat}&maxLng=${bounds.maxLng}&maxLat=${bounds.maxLat}`,
    fetcher,
    {
      keepPreviousData: true,
    }
  )

  return { stops, stopsLoading }
}