import {MapContainer, TileLayer, Marker, useMap} from 'react-leaflet'
import 'leaflet-pixi-overlay' // Must be called before the 'leaflet' import
import L from 'leaflet'
import * as PIXI from 'pixi.js'
import {useCallback, useEffect, useState} from 'react'
import {Container, render, Sprite, Text} from '@inlet/react-pixi'

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

const container = new PIXI.Container()

const pixiOverlay = L.pixiOverlay((utils) => {
  const container = utils.getContainer()
  const renderer = utils.getRenderer()
  const project = utils.latLngToLayerPoint
  const scale = utils.getScale()

  const coords = project([51.505, -0.08])

  renderer.render(container)
}, container)

function PixiRoot({ children }) {
  // 获取 map 实例，map 来自 react-leaflet 的 MapContainer
  const map = useMap()

  useEffect(() => {
    pixiOverlay.addTo(map)
  }, [map])

  // 判断是否需要重绘的 flag
  const [needsRenderUpdate, setNeedsRenderUpdate] = useState(false)

  // 当触发 __REACT_PIXI_REQUEST_RENDER__ 事件时，不立即重绘，而是点亮 flag
  const requestUpdate = useCallback(() => {
    setNeedsRenderUpdate(true)
  }, [])

  // 在每次 tick 时判断 flag 来决定是否真正触发重绘
  const renderStage = useCallback(() => {
    if (needsRenderUpdate) {
      setNeedsRenderUpdate(false)
      pixiOverlay.redraw(container)
    }
  }, [needsRenderUpdate])

  useEffect(() => {
    const ticker = PIXI.Ticker.shared
    ticker.autoStart = true
    ticker.add(renderStage)
    window.addEventListener('__REACT_PIXI_REQUEST_RENDER__', requestUpdate)

    return () => {
      ticker.remove(renderStage)
      window.removeEventListener('__REACT_PIXI_REQUEST_RENDER__', requestUpdate)
    }
  }, [renderStage, requestUpdate])

  useEffect(() => {
    render(children, container)
  }, [children])

  return null
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
