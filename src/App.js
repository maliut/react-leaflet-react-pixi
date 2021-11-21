import {MapContainer, TileLayer} from 'react-leaflet'
import {useState} from 'react'
import {Container, Sprite} from '@inlet/react-pixi'
import {PixiRoot} from './PixiRoot'
import {useProject, useScale, useTick} from './hooks'

const position = [51.505, -0.09]

function App() {
  return (
    <MapContainer center={position} zoom={13} style={{width: '100vw', height: '100vh'}}>
      <TileLayer
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {/*<Marker position={position} icon={L.divIcon({html: '我是 div icon'})}/>*/}
      <PixiRoot>
        <MyContent />
      </PixiRoot>
    </MapContainer>
  )
}

function MyContent() {
  const [containerX, containerY] = useProject([51.5, -0.09])
  const [markerOffset, setMarkerOffset] = useState(0)
  const [markerX, markerY] = useProject([51.5, -0.09 + markerOffset], [containerX, containerY])
  const scale = useScale()

  const [direction, setDirection] = useState(1)
  useTick(delta => {
    setMarkerOffset(val => val + delta * direction / 3000)
    if (markerOffset > 0.05) {
      setDirection(-1)
    } else if (markerOffset < -0.05) {
      setDirection(1)
    }
  })

  return (
    <Container x={containerX} y={containerY}>
      <Sprite x={markerX} y={markerY} anchor={0.5} scale={1/scale} image="https://s3-us-west-2.amazonaws.com/s.cdpn.io/693612/IaUrttj.png"/>
    </Container>
  )
}

export default App
