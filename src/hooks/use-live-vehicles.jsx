"use client"

import useSWR from "swr"

import { fetcher } from "@/lib/utils"

export const useLiveVehicles = (bounds) => {
  const { data: vehicles, isLoading: vehiclesLoading } = useSWR(
    bounds && `/api/vehicles?minLng=${bounds.minLng}&minLat=${bounds.minLat}&maxLng=${bounds.maxLng}&maxLat=${bounds.maxLat}`,
    fetcher,
    {
      keepPreviousData: true,
      refreshInterval: 10000
    }
  )

  return { vehicles, vehiclesLoading }
}