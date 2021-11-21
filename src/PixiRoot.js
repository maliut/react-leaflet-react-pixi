import 'leaflet-pixi-overlay' // Must be called before the 'leaflet' import
import L from 'leaflet'
import * as PIXI from 'pixi.js'
import {useCallback, useEffect, useState} from 'react'
import {useMap} from 'react-leaflet'
import {render} from '@inlet/react-pixi'
import {PixiOverlayProvider} from './hooks'

const container = new PIXI.Container()

export function PixiRoot({ children }) {
  // 获取 map 实例，map 来自 react-leaflet 的 MapContainer
  const map = useMap()

  const [scale, setScale] = useState(1)

  const [pixiOverlay] = useState(L.pixiOverlay((utils) => {
    const container = utils.getContainer()
    const renderer = utils.getRenderer()
    // 更新当前的 scale
    setScale(utils.getScale())
    // 本职工作：渲染画面
    renderer.render(container)
  }, container))

  useEffect(() => {
    pixiOverlay.addTo(map)
  }, [map, pixiOverlay])

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
  }, [needsRenderUpdate, pixiOverlay])

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
    const project = pixiOverlay.utils.latLngToLayerPoint
    const provider = <PixiOverlayProvider value={{project, scale}}>{children}</PixiOverlayProvider>
    render(provider, container)
  }, [children, pixiOverlay, scale])

  return null
}
