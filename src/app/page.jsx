import dynamic from "next/dynamic"

const BusMap = dynamic(() => import("@/components/bus-map"), { ssr: false })

const Home = () => {
  return (
    <BusMap />
  )
}

export default Home