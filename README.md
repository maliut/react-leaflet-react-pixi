# React Leaflet + React Pixi

Write Leaflet and PixiJS applications using React declarative style.

Demo usage:

```javascript
function App() {
  return (
    <MapContainer center={[51.505, -0.09]} zoom={13} style={{width: '100vw', height: '100vh'}}>
      <TileLayer
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
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
      <Sprite x={markerX} y={markerY} anchor={0.5} scale={1 / scale} image="https://s3-us-west-2.amazonaws.com/s.cdpn.io/693612/IaUrttj.png" />
    </Container>
  )
}
```

![](./public/demo.gif)

---

The work is based on [React Leaflet](https://react-leaflet.js.org/), [React Pixi](https://reactpixi.org/) and [Leaflet.PixiOverlay](https://github.com/manubb/Leaflet.PixiOverlay). This project is to combine them all together, provide a natural declarative code style, and fully encapsulate Leaflet.PixiOverlay inside.

The code is quite simple. You just need to copy `PixiRoot.js` and `hooks.js` in your project. Feel free to modify them as your need.
