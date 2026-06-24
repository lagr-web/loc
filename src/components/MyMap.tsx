import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L, { divIcon, LatLngExpression, marker } from "leaflet";
import "../myMap.scss";
import { useEffect, useState } from "react";
import { Geolocation } from "@capacitor/geolocation";
import { IonCol, IonContent, IonLoading, IonRow, IonImg } from "@ionic/react";
import MyCamera from "./MyCamera";
import supabase from "../lib/subabase-client";
import { fetchLocation } from "./getData";

/* interface IconOptions {
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
    latitude: number ;
    longitude: number ;
} */



const MyMap: React.FC = () => {


    const markerPositions: MarkerPositions[] = [


        {
            image: "/assets/position-images/spot-icon.jpg",
            location: "Ebeltoft",
            name: "glasmuseet",
            comment: "",
            latitude: 56.19656102762782,
            longitude: 10.678123381787396,
        },

        {
            image: "/assets/position-images/spot-icon.jpg",
            location: "Lønstrup",
            name: "lønstrup",
            comment: "",
            latitude: 57.47520549523601,
            longitude: 9.797069303027442,
        },
        {
            image: "/assets/position-images/spot-icon.jpg",
            location: "Kalyves",
            name: "Provlita",
            comment: "",
            latitude: 35.45508926793525,
            longitude: 24.171037403669782,
        },
        {
            image: "/assets/position-images/spot-icon.jpg",
            location: "Kalyves",
            name: "Dimitra",
            comment: "",
            latitude: 35.456922591535694,
            longitude: 24.167508999612433,
        },
        {
            image: "/assets/position-images/spot-icon.jpg",
            location: "Kalyves",
            name: "Cactus coffee",
            comment: "",
            latitude: 35.45797294238098,
            longitude: 24.16576565846501,
        }
    ];


    const position: LatLngExpression = [56.52635293804066, 9.614244537563335];


    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<any | null>(null);
    const [myPosition, setMyPostion] = useState<loc | null>(null);
    const [showLoading, setShowloading] = useState<boolean>(true);
    const [dbData, setDbData] = useState<MarkerPositions[] | null>([]);


    const [myspot, setMySpot] = useState<L.Icon | null>(null);


    const [spots, setSpots] = useState<L.Icon | null>(null);

    const url = "https://woumnidrxvcievydosww.supabase.co/storage/v1/object/public/image-mapmyplace/";


    const defaultIconOptions: IconOptions = {
        iconUrl: "/assets/my-icon.png",
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
    };


    const refreshData = () => {

        fetchLocation("mapmyplace")
            .then(response => setDbData(response))
            .catch(err => console.error("Fejl ved refresh:", err));

    };




    useEffect(() => {

        const mSpot: IconOptions = {
            iconUrl: "/assets/my-icon.png",
            iconSize: [28, 28],
            iconAnchor: [14, 14],
            popupAnchor: [0, 0]
        };

        const spot = L.icon(mSpot);
        setMySpot(spot);

        const uSpot: IconOptions = {
            iconUrl: "/assets/spot-icon.png",
            iconSize: [28, 28],
            iconAnchor: [14, 14],
            popupAnchor: [0, 0]
        };

        const useSpot = L.icon(uSpot);
        setSpots(useSpot);



        (async () => {

            try {
                const coordinates = await Geolocation.getCurrentPosition({
                    enableHighAccuracy: false, // Sæt til false på emulator, så den ikke venter på millimeter-præcision
                    timeout: 15000,            // Giver emulatoren op til 15 sekunder til at svare (standard er ofte for lav)
                    maximumAge: 0
                });
                setMyPostion(coordinates.coords);
            } catch (error) {

                /*  console.error("Error fetching data: ", error);
                 setError(error); */

                setMyPostion({
                    latitude: 56.1529, // Aarhus som fallback
                    longitude: 10.2039,
                    accuracy: 0,
                    altitudeAccuracy: null,
                    altitude: null,
                    speed: null,
                    heading: null
                });

            } finally {
                setLoading(false);
            }

        })()

        /* fetchLocation("mapmyplace")
            .then(response => setDbData(response)); */

        refreshData();



    }, [])

    if (error) return <div>error</div>;






    return (


        <div id="content">

            <IonLoading
                spinner="bubbles"
                isOpen={loading} // Brug 'loading' direkte her i stedet for en separat state
                message="Vent lige lidt... henter kortdata"
            // Fjern 'duration' og 'onDidDismiss' hvis det styres udelukkende af din data-loading state
            />


            <MyCamera onUploadSuccess={refreshData} position={myPosition ? [myPosition.latitude, myPosition.longitude] : [0, 0]} />



            <MapContainer center={position} zoom={7} scrollWheelZoom={true} >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

                <Marker
                    position={

                        myPosition ? [myPosition.latitude, myPosition.longitude] as LatLngExpression
                            : [56.52635293804066, 9.614244537563335]
                    }

                    icon={myspot || L.icon(defaultIconOptions)}
                >
                    <Popup>Im here</Popup>

                </Marker>

                {dbData &&

                    dbData.map((data: MarkerPositions, index: number) => (


                        <Marker
                            key={"map" + index}
                            position={[data.latitude, data.longitude]}
                            icon={spots || L.icon(defaultIconOptions)}
                        >

                            <Popup>
                                <IonRow>
                                    <IonImg src={url + data.image} />
                                </IonRow>
                                <IonRow className="headline">{data.location}</IonRow>
                                <IonRow className="comment">{data.comment}</IonRow>
                                <IonRow>
                                    <IonCol className="geolocation">
                                        {`${data.latitude}${data.longitude}`}
                                    </IonCol>
                                </IonRow>


                            </Popup>

                        </Marker>


                    ))


                }



            </MapContainer>

        </div>

    )

}

export default MyMap;
