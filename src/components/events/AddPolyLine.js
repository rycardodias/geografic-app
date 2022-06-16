import { useMapEvents } from 'react-leaflet'
import { useState } from 'react'
import distanceLine from '../distance/lineDistance'

export default function AddPolyLine(props) {
    const [coordinates, setcoordinates] = useState([])
    const [id] = useState(Math.random().toString(16).slice(2))
    const [first, setfirst] = useState(true)



    const map = useMapEvents({
        mousedown(e) {
            let coordinates = map.mouseEventToLatLng(e.originalEvent)
            setcoordinates(old => [...old, coordinates])

        },
        mouseup() {
            let label = ''
            let category = props.category
            if (!first) {

                props.polyLineListChange({ coordinates, label, id, category })
            } else {
                label = prompt('Insert the label here!');

                label && props.polyLineListChange({ coordinates, label, id, category })
                setfirst(false)
            }
        },

    })
}