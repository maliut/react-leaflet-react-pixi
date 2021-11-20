import 'leaflet-pixi-overlay' // Must be called before the 'leaflet' import
import L from 'leaflet'
import * as PIXI from 'pixi.js'
import {useCallback, useEffect, useState} from 'react'
import {useMap} from 'react-leaflet'
import {render} from '@inlet/react-pixi'

const container = new PIXI.Container()

const pixiOverlay = L.pixiOverlay((utils) => {
  const container = utils.getContainer()
  const renderer = utils.getRenderer()
  const project = utils.latLngToLayerPoint
  const scale = utils.getScale()

  const coords = project([51.505, -0.08])

  renderer.render(container)
}, container)

export function PixiRoot({ children }) {
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
