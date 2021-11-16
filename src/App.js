import {MapContainer, TileLayer, Marker, useMap} from 'react-leaflet'
import 'leaflet-pixi-overlay' // Must be called before the 'leaflet' import
import L from 'leaflet'
import * as PIXI from 'pixi.js'
import {useEffect} from 'react'

const position = [51.505, -0.09]

function App() {
  return (
    <MapContainer center={position} zoom={13} style={{width: '100vw', height: '100vh'}}>
      <TileLayer
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={position} icon={L.divIcon({html: '我是 div icon'})}/>
      <PixiRoot />
    </MapContainer>
  )
}

const container = new PIXI.Container()
const text = new PIXI.Text('我是 Pixi Text', { fill: 0xff1010 })
container.addChild(text)

const pixiOverlay = L.pixiOverlay((utils) => {
  const container = utils.getContainer()
  const renderer = utils.getRenderer()
  const project = utils.latLngToLayerPoint
  const scale = utils.getScale()

  const coords = project([51.505, -0.08])
  text.x = coords.x
  text.y = coords.y
  text.text = '我是 Pixi Text ' + Math.floor(Math.random() * 100)
  text.scale.set(1 / scale)

  renderer.render(container)
}, container)

function PixiRoot() {
  // 获取 map 实例，map 来自 react-leaflet 的 MapContainer
  const map = useMap()

  useEffect(() => {
    pixiOverlay.addTo(map)
  }, [map])

  return null
}

export default App
