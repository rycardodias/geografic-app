import React, { useState, useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup, Polygon, Polyline } from 'react-leaflet'
import AddMarker from './events/AddMarker'
import AddPolygon from './events/AddPolygon'
import AddPolyLine from './events/AddPolyLine'
import distanceLine from './distance/lineDistance'
import areaCalculator from './distance/areaCalculator'

export const Map = ({ filterState, categoryState, markerDistance }) => {
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
            console.log(e)
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

    const [markerCoordinates, setmarkerCoordinates] = useState([])


    function handleMarkerClick(coordinates) {
        setloading(true)
        setmarkerCoordinates(old => [...old, coordinates])

        setloading(false)
    }

    useEffect(() => {
        const size = markerCoordinates.length

        if (size > 1) {
            let newArray = []
            newArray.push(markerCoordinates[size - 2])
            newArray.push(markerCoordinates[size - 1])

            let distance = distanceLine(newArray)
            markerDistance(distance)
        }
    }, [markerCoordinates])


    const markerDisplay = markerList.map((e, i) => {
        return categoryState === "None" ?
            <Marker key={i} position={[e.coordinates.lat, e.coordinates.lng]}
                eventHandlers={{
                    click: (e) => { handleMarkerClick(e.latlng) }
                }}>
                <Popup>{e.label}<br />{`Category: ${e.category}`}</Popup>
            </Marker >
            : categoryState === e.category &&
            <Marker key={i} position={[e.coordinates.lat, e.coordinates.lng]} onClick={() => alert("teste")}>
                <Popup>{e.label}<br />{`Category: ${e.category}`}</Popup>
            </Marker >
    });

    const lineDisplay = polyLineList.map((e, i) => {
        return categoryState === "None" ?
            <Polyline key={i} positions={e.coordinates} >
                <Popup>{e.label}
                    <br />{`Category: ${e.category}`}<br />
                    {e.coordinates.length === 2 && `Distance: ${distanceLine(e.coordinates)}`}
                </Popup>
            </Polyline >
            : categoryState === e.category &&
            <Polyline key={i} positions={e.coordinates} >
                <Popup>{e.label}
                    <br />{`Category: ${e.category}`}<br />
                    {e.coordinates.length === 2 && `Distance: ${distanceLine(e.coordinates)}`}
                </Popup>
            </Polyline >
    })

    const polygonDisplay = polygonList.map((e, i) => {
        return categoryState === "None" ?
            <Polygon key={i} positions={e.coordinates} >
                <Popup>{e.label}<br />{`Category: ${e.category}`}<br />{`Area: ${areaCalculator(e.coordinates)}`} </Popup>
            </Polygon >
            : categoryState === e.category &&
            <Polygon key={i} positions={e.coordinates} >
                <Popup>{e.label}<br />{`Category: ${e.category}`}<br />{`Area: ${areaCalculator(e.coordinates)}`}</Popup>
            </Polygon >
    })


    return (
        <MapContainer center={[51.505, -0.09]} zoom={13} scrollWheelZoom={false} style={{ height: '700px' }}>
            <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

            {filterState.addingMarkers && <AddMarker markerListChange={handleMarkerListChange} category={categoryState} />}
            {filterState.addingLines && <AddPolyLine polyLineListChange={handlePolyLineListChange} category={categoryState} />}

            {filterState.addingPolygon && <AddPolygon polygonListChange={handlePolygonListChange} category={categoryState} />}

            {/* SHOWING ZONE */}

            {/* {!loading && console.log(markerCoordinates)} */}

            {!loading && (filterState.showAll || filterState.showMarkers) && markerDisplay}

            {!loading && (filterState.showAll || filterState.showLines) && lineDisplay}

            {!loading && (filterState.showAll || filterState.showPolygon) && polygonDisplay}
        </MapContainer >
    )
}
