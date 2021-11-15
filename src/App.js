import {MapContainer, TileLayer, Marker} from 'react-leaflet'
import L from 'leaflet'

const position = [51.505, -0.09]

function App() {
  return (
    <MapContainer center={position} zoom={13} style={{width: '100vw', height: '100vh'}}>
      <TileLayer
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={position} icon={L.divIcon({html: '我是 div icon'})}/>
    </MapContainer>
  )
}

export default App
