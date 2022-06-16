import { useMapEvents } from 'react-leaflet'
import { useState } from 'react'

export default function AddMarker(props) {
    const [coordinates, setcoordinates] = useState([])

    const map = useMapEvents({
        mousedown(e) {
            let coordinates = map.mouseEventToLatLng(e.originalEvent)
            setcoordinates(coordinates)

        },
        mouseup() {
            let label = prompt('Insert the label here!');
            let category = props.category

            label && props.markerListChange({ coordinates, label, category })
        },

    })
}