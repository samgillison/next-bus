import moment from "moment"

export const fetcher = (...args) => fetch(...args).then(res => res.json()) 

export const getQueryString = ({ minLng, minLat, maxLng, maxLat }) => {
  return `?boundingBox=${minLng},${minLat},${maxLng},${maxLat}&api_key=${process.env.BODS_API_KEY}`
}

export const timeToMilli = (time) => {
  return moment(time, "hh:mm:ss").valueOf()
}