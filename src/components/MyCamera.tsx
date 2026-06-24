

import { Camera } from "@capacitor/camera";
import { IonButton, IonFab, IonFabButton, IonIcon, IonImg } from "@ionic/react";
import { camera, close } from "ionicons/icons";
import { defineCustomElements } from "@ionic/pwa-elements/loader"
import { useEffect, useState } from "react";
import FormData from "./FormData";
import { uploadFile } from "./getData";


type mPos = {
    position: number[];
     onUploadSuccess: () => void; // Tilføjet så TypeScript genkender den
}

const MyCamera: React.FC<mPos> = ({ position, onUploadSuccess  }) => {

    const [photos, setPhotos] = useState<string>("");
    const [fileNameDB, setFilenameDB] = useState("");

    const formContainer = document.querySelector('#myFormContainer') as HTMLElement | null;


    useEffect(() => {

        defineCustomElements(window);

    }, [])




    const takePhoto = async () => {


        try {
            // 1. Brug den nye metode: takePhoto() i stedet for getPhoto()
            // 2. Vi behøver ikke længere angive resultType!
            const photo = await Camera.takePhoto({
                quality: 50,
            });

            // Billedets sti ligger nu altid direkte på photo.webPath
            //console.log("Billedsti:", photo.webPath);

            if (photo.webPath) {
                setPhotos(photo.webPath);
            }

        } catch (e) {
            console.error("Fejl:", e);
        }


    }

    const closePhoto = () => {
        setPhotos('');
    }
    

        const uploadImage = async (path: string) => {

        if (formContainer) formContainer.style.display = "grid";

        uploadFile(path, "image-mapmyplace")
            .then(response => setFilenameDB(response))

if (formContainer) formContainer.style.display = "grid";


    }



    return (

        <>

            <FormData position={position} img={fileNameDB} mSucces={onUploadSuccess} />


            {photos ? (
                <div id="cameraimage">
                    <div id="closephoto"><IonIcon icon={close} onClick={closePhoto} /> </div>
                    <IonImg src={photos} />
                    <div id="saveImgContainer">
                        <IonButton color="secondary" onClick={async () => { await uploadImage(photos) }}>Gem billede</IonButton>
                    </div>

                              <div id="saved"><span>gemmer billede</span> </div>

                </div>

                  


            ) : (
                <></>
            )
            }




            <IonFab
                vertical="bottom"
                horizontal="center"
                slot="fixed"
            >
                <IonFabButton color="secondary" onClick={takePhoto} >
                    <IonIcon icon={camera} />
                </IonFabButton>

            </IonFab>



        </>


    )

};

export default MyCamera;
