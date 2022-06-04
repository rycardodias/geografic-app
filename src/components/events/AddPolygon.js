import { useMapEvents } from 'react-leaflet'
import { useState, useEffect } from 'react'

export default function AddPolygon(props) {
    const [coordinates, setcoordinates] = useState([])
    const [id, setid] = useState(Math.random().toString(16).slice(2))

    useEffect(() => {
        return () => {
            props.unmount()
            // Anything in here is fired on component unmount.
        }
    }, [])

    const map = useMapEvents({
        mousedown(e) {
            let coordinates = map.mouseEventToLatLng(e.originalEvent)
            setcoordinates(old => [...old, coordinates])

        },
        mouseup() {
            let label = ''

            if (coordinates.length > 0) {
                props.polygonListChange({ coordinates, label, id })
            } else {
                label = prompt('Insert the label here!');

                label && props.polygonListChange({ coordinates, label, id })
            }
        },

    })
}