import React, { useState, useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup, Polygon, Polyline } from 'react-leaflet'
import AddMarker from './events/AddMarker'
import AddPolygon from './events/AddPolygon'
import AddPolyLine from './events/AddPolyLine'

export const Map = ({ filterState }) => {
    const [loading, setloading] = useState(true)
    const [markerList, setmarkerList] = useState([])
    const [polyLineList, setpolyLineList] = useState([])

    const [polygonList, setpolygonList] = useState([])

    async function handleMarkerListChange(e) {
        await setloading(true)
        await setmarkerList(old => [...old, e])
        await setloading(false)
    }

    async function handlePolyLineListChange(e) {
        await setloading(true)

        const list = JSON.parse(localStorage.getItem('polyLineList')) || [];

        let objIndex = list.findIndex((i => i.id === e.id));
        if (objIndex === -1) {
            await setpolyLineList(old => [...old, e])
        } else {
            let newList = [...polyLineList]

            newList[objIndex].coordinates = e.coordinates

            await setpolyLineList(newList)
            await localStorage.setItem('polyLineList', JSON.stringify(newList))
        }

        await setloading(false)
    }

    async function handlePolygonListChange(e) {
        await setloading(true)

        const list = JSON.parse(localStorage.getItem('polygonList')) || [];

        let objIndex = list.findIndex((i => i.id === e.id));
        if (objIndex === -1) {
            await setpolygonList(old => [...old, e])
        } else {
            let newList = [...polygonList]

            newList[objIndex].coordinates = e.coordinates

            await setpolygonList(newList)
            await localStorage.setItem('polygonList', JSON.stringify(newList))
        }

        await setloading(false)
    }


    useEffect(() => {
        const list = JSON.parse(localStorage.getItem('markerList')) || [];
        markerList.length > list.length &&
            localStorage.setItem('markerList', JSON.stringify(markerList))
    }, [markerList]);

    useEffect(() => {
        const list = JSON.parse(localStorage.getItem('polyLineList')) || [];

        polyLineList.length > list.length &&
            localStorage.setItem('polyLineList', JSON.stringify(polyLineList))
    }, [polyLineList]);

    useEffect(() => {
        const list = JSON.parse(localStorage.getItem('polygonList')) || [];

        polygonList.length > list.length &&
            localStorage.setItem('polygonList', JSON.stringify(polygonList))
    }, [polygonList]);

    useEffect(() => {
        const markerList = JSON.parse(localStorage.getItem('markerList')) || [];
        markerList.length > 0 && setmarkerList(markerList)

        const polyLineList = JSON.parse(localStorage.getItem('polyLineList')) || [];
        polyLineList.length > 0 && setpolyLineList(polyLineList)

        const polygonList = JSON.parse(localStorage.getItem('polygonList')) || [];
        polygonList.length > 0 && setpolygonList(polygonList)

        setloading(false)

    }, []);


    return (
        <MapContainer center={[51.505, -0.09]} zoom={13} scrollWheelZoom={false} style={{ height: '700px' }}>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {filterState.addingMarkers && <AddMarker markerListChange={handleMarkerListChange} />}
            {filterState.addingLines && <AddPolyLine polyLineListChange={handlePolyLineListChange} />}

            {filterState.addingPolygon && <AddPolygon polygonListChange={handlePolygonListChange} />}

            {/* SHOWING ZONE */}

            {!loading && filterState.showAll &&
                markerList.map((e, i) => {
                    return <Marker key={i} position={[e.coordinates.lat, e.coordinates.lng]}>
                        <Popup>{e.label}</Popup>
                    </Marker >
                })
            }

            {!loading && filterState.showAll &&
                polyLineList.map((e, i) => {
                    console.log(e)
                    return <Polyline key={i} positions={e.coordinates} >
                        <Popup>{e.label}</Popup>
                    </Polyline >
                })
            }

            {!loading && filterState.showAll &&
                polygonList.map((e, i) => {
                    return <Polygon key={i} positions={e.coordinates} >
                        <Popup>{e.label}</Popup>
                    </Polygon >
                })
            }


            {/* SHOW INDIVIDUAL */}

            {!loading && !filterState.showAll &&
                filterState.showMarkers && (
                    markerList.map((e, i) => {
                        return <Marker key={i} position={[e.coordinates.lat, e.coordinates.lng]}>
                            <Popup>{e.label}</Popup>
                        </Marker >
                    })
                )
            }

            {!loading && !filterState.showAll &&
                filterState.showLines && (
                    polyLineList.map((e, i) => {
                        return <Polyline key={i} positions={e.coordinates} >
                            <Popup>{e.label}</Popup>
                        </Polyline >
                    })
                )
            }

            {!loading && !filterState.showAll &&
                filterState.showPolygon && (
                    polygonList.map((e, i) => {
                        return <Polygon key={i} positions={e.coordinates} >
                            <Popup>{e.label}</Popup>
                        </Polygon >
                    })
                )
            }
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