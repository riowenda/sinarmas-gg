import { Camera, CameraResultType, CameraSource, } from '@capacitor/camera';
import { useState } from "react";

// import { Filesystem, Directory } from '@capacitor/filesystem';
// import { Preferences } from '@capacitor/preferences';
// import { Capacitor } from '@capacitor/core';

export interface Medias {
    // id: string,
    data?: string,
    fileName?: string,
    // laporan?: string
}

export interface MediaReview {
    base64?: string

}

export function usePhotoGallery() {


    const [medias, setMedias] = useState<Medias[]>([]);
    const [mediaReview, setMediaReview] = useState<MediaReview[]>([])

    const takePhoto = async () => {
        const photo = await Camera.getPhoto({
            resultType: CameraResultType.Base64,
            source: CameraSource.Camera,
            quality: 100,

        })

        const fileBase64 = "data:image/jpeg;base64," + photo.base64String
        const fileBase64Original = photo.base64String

        console.log("PHOTO", photo)

        const fileName = new Date().getTime() + '.jpeg';

        // const newMedias = [
        //     {
        //         id: '123',
        //         data: fileBase64,
        //         fileName: fileName,
        //         laporan: laporan
        //     },
        //     ...medias
        // ]
        const newMedias = [
            {
                data: fileBase64Original,
                fileName: fileName
            },
            ...medias
        ]

        const newMediaReview = [
            {
                base64: fileBase64,
            },
            ...mediaReview
        ]

        setMedias(newMedias)
        setMediaReview(newMediaReview)
    }
    return {
        takePhoto,
        medias,
        mediaReview
    }
}