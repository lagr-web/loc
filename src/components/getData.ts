import supabase from '../lib/subabase-client';
import Compressor from 'compressorjs';


export const uploadFile = async (webPath: string, to_storage: string) => {

    console.log(webPath, to_storage);

    const saved = document.querySelector("#saved") as HTMLDivElement;
    const formCon = document.querySelector("#myFormContainer") as HTMLDivElement;

    if (saved) saved.style.display = "block";


    // 1. Fetch virker perfekt på den nye webPath på tværs af iOS/Android/Web
    const response = await fetch(webPath);
    const blob = await response.blob();

    const time = new Date().getTime();
    const fileName = `${"myimage"}-${time}.jpg`;


    new Compressor(blob, {
        quality: 0.6, // Super effektivt til at holde databasen let!
        convertTypes: ["image/jpeg", "image/png"],
        convertSize: 10000,
        success: (compressedResult: Blob) => {

            console.log(compressedResult);

            const finalFile = new File([compressedResult], fileName, {
                type: "image/jpeg",
            });

            console.log("Klar til Supabase:", finalFile);

            myUpload(to_storage, fileName, finalFile, [saved, formCon]);

        },
        error: (err) => {
            console.error("Komprimeringsfejl:", err.message);
        }
    });

    return fileName;

};


export const myUpload = async (ts: string, fn: string, bl: Blob, obj: HTMLElement[]) => {


    console.log(ts, fn, bl, obj);


    const { data, error } = await supabase.storage
        .from(ts)
        .upload(`${fn}`, bl, {
            cacheControl: "3600",
            upsert: false
        })

    if (error) {

        alert(error.message);

    } else {

        //obj[0].style.display = "none";
        // obj[1].style.display = "grid";
    }

};


export const fetchLocation = async (dbTable: any) => {

    const { data: mloc } = await supabase
        .from(dbTable)
        .select('*')
        .order('location')

    return mloc

}




