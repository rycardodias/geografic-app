import React, { useState, useEffect } from 'react'
import { MapContainer, TileLayer, useMap, Marker, Popup, useMapEvents } from 'react-leaflet'
import AddMarker from './events/AddMarker'

export const Map = ({ filterState }) => {
    const [loading, setloading] = useState(true)
    const [markerList, setmarkerList] = useState([])

    async function handleMarkerListChange(e) {
        await setloading(true)
        await setmarkerList(old => [...old, e])
        await setloading(false)
    }

    useEffect(() => {
        const list = JSON.parse(localStorage.getItem('markerList')) || [];
        markerList.length > list.length &&
            localStorage.setItem('markerList', JSON.stringify(markerList))
    }, [markerList]);

    useEffect(() => {
        const list = JSON.parse(localStorage.getItem('markerList')) || [];

        list.length > 0 && setmarkerList(list)
        setloading(false)

    }, []);


    return (
        <MapContainer center={[51.505, -0.09]} zoom={13} scrollWheelZoom={false} style={{ height: '700px' }}>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {console.log(filterState)}
            {filterState.addingMarkers && <AddMarker markerListChange={handleMarkerListChange} />}

            {/* SHOW ALL PINS */}
            {!loading && filterState.showMarkers && (
                markerList.map((e, i) => {
                    return <Marker key={i} position={[e.coordinates.lat, e.coordinates.lng]}>
                        <Popup>{e.label}</Popup>
                    </Marker >
                })
            )}
            {/* <LocationMarker /> */}
        </MapContainer>
    )
}


// function LocationMarker() {
//     const [position, setPosition] = useState(null)
//     const map = useMapEvents({
//         click() {
//             map.locate()
//         },
//         locationfound(e) {
//             setPosition(e.latlng)
//             map.flyTo(e.latlng, map.getZoom())
//         },
//     })

//     return position === null ? null : (
//         <Marker position={position}>
//             <Popup>You are here</Popup>
//         </Marker>
//     )

// }