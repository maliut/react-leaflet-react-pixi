import {createContext, useContext, useEffect, useRef} from 'react'
import * as PIXI from 'pixi.js'

const Context = createContext({}) // { project, scale }

export const PixiOverlayProvider = Context.Provider
export const PixiOverlayConsumer = Context.Consumer


export function useProject(latlng, parentPosition = [0, 0]) {
  const { project } = useContext(Context)
  const myPosition = project(latlng)
  // 返回值就是应该被填入 PixiJS 元素的 xy 值
  return [myPosition.x - parentPosition[0], myPosition.y - parentPosition[1]]
}

export function useScale() {
  const { scale } = useContext(Context)
  return scale
}

export function useTick(callback) {
  const savedRef = useRef(null)

  useEffect(() => {
    savedRef.current = callback
  }, [callback])

  useEffect(() => {
    const ticker = PIXI.Ticker.shared
    const tick = delta => savedRef.current?.apply(ticker, [delta, ticker])
    ticker.add(tick)

    return () => {
      ticker.remove(tick)
    }
  }, [])
}
