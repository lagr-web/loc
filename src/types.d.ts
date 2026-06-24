
interface IconOptions {
    iconUrl: string;
    iconSize: [number, number];
    iconAnchor: [number, number];
    popupAnchor: [number, number];
}


//MyMap.js   
interface loc {
    latitude: number;
    longitude: number;
    accuracy: number;
    altitudeAccuracy: number | null | undefined;
    altitude: number | null; speed: number | null;
    heading: number | null;
}

interface MarkerPositions {
    image: string;
    location: string;
    name: string;
    comment:string
    latitude: number ;
    longitude: number ;
}