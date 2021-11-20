import {MapContainer, TileLayer} from 'react-leaflet'
import {useState} from 'react'
import {Container, Sprite, Text} from '@inlet/react-pixi'
import {PixiRoot} from './PixiRoot'

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
  const [flag, setFlag] = useState(true)
  return (
    <Container x={65506} y={43586} scale={1/16} interactive={true} click={() => setFlag(val => !val)}>
      <Text text={flag ? 'Pixi Text' : 'Text Changed'} />
      {flag && <Sprite y={50} image="https://s3-us-west-2.amazonaws.com/s.cdpn.io/693612/IaUrttj.png"/>}
    </Container>
  )
}

export default App
