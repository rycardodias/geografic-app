import React, { useState, useEffect } from 'react'
import { MapContainer, TileLayer, useMap, Marker, Popup, useMapEvents } from 'react-leaflet'

export const Map = () => {
    const [markerList, setmarkerList] = useState([])

    function LocationMarker() {
        const [position, setPosition] = useState(null)
        const map = useMapEvents({
            click() {
                map.locate()
            },
            locationfound(e) {
                setPosition(e.latlng)
                map.flyTo(e.latlng, map.getZoom())
            },
        })

        return position === null ? null : (
            <Marker position={position}>
                <Popup>You are here</Popup>
            </Marker>
        )

    }

    function AddMarker() {

        const map = useMapEvents({
            mousedown(ev) {
                let coordinates = map.mouseEventToLatLng(ev.originalEvent)
                setmarkerList(old => [...old, coordinates])

            },
            mouseup() {
                console.log("largou")
            }

        })

        return markerList.length > 0 && (
            markerList.map((e, i) => {
                return <Marker key={i} position={[e.lat, e.lng]}>
                    <Popup>You are here</Popup>
                </Marker >

            })
        )
    }





    return (
        <MapContainer center={[51.505, -0.09]} zoom={13} scrollWheelZoom={false} style={{ height: '600px' }}>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <AddMarker />
            {/* <LocationMarker /> */}
        </MapContainer>
    )
}
