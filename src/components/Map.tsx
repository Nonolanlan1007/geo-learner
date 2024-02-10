import {MapContainer, Marker, TileLayer, Tooltip} from "react-leaflet"
import "leaflet/dist/leaflet.css"
import "leaflet-defaulticon-compatibility"
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css"
import {LatLngBounds, LatLngExpression, Icon} from "leaflet";
import styles from "../app/[slug]/page.module.css"

export default function MyMap(props: { position: LatLngExpression, zoom?: number, tooltip?: string }) {
  const { position, zoom, tooltip } = props

  const mapOptions = {
    center: position,
    zoom: zoom || 1,
    scrollWheelZoom: false,
    zoomControl: true,
    maxBounds: new LatLngBounds([-90, -180], [90, 180]),
    maxBoundsViscosity: 0.8,
    maxZoom: 2,
    touchZoom: false,
    doubleClickZoom: false,
    boxZoom: false,
  }

  const icon = new Icon({
    iconUrl: "marker.svg",
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -30],
  })

  return <MapContainer className={styles.map} {...mapOptions}>
    <TileLayer
      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    />
    <Marker position={position} icon={icon}>
      {
        tooltip ? (<Tooltip permanent direction={"top"} offset={[0, -30]}>{ tooltip }</Tooltip>) : (<></>)
      }
    </Marker>
  </MapContainer>
}