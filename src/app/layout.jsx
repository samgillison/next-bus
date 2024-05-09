import "mapbox-gl/dist/mapbox-gl.css"
import "./globals.css"
import { Toaster } from "sonner"

export const metadata = {
  title: "BusRadar",
}

const RootLayout = ({ children }) => {
  return (
    <html lang="en">
      <body>
        <Toaster position="top-left" expand={true}/>
        {children}
      </body>
    </html>
  )
}

export default RootLayout
