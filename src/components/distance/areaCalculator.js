export default function areaCalculator(coords) {

    let area = 0;
    for (let i = 0; i < coords.length; i++) {
        const lat1 = coords[i].lat;
        const lat2 = coords[(i + 1) % coords.length].lat;
        const lng1 = coords[i].lng;
        const lng2 = coords[(i + 1) % coords.length].lng;

        area += lat1 * lng2 - lat2 * lng1
    }

    return Math.abs(area*10000) / 2;
    // replace with
    // return Math.abs(area) / 2;
}