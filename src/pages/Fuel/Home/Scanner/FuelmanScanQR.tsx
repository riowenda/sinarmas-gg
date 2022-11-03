import { BarcodeScanner } from "@capacitor-community/barcode-scanner"
import {
    IonContent,
    IonPage,
    useIonAlert, useIonViewDidEnter, useIonViewDidLeave, useIonViewWillEnter, useIonViewWillLeave
} from "@ionic/react"
import React, { useEffect, useState } from "react"
import "./FuelmanScanQR.css"
import {useHistory, useLocation} from "react-router-dom";
import {useTranslation} from "react-i18next";
import ListHeader from "../../../../components/Header/ListHeader";

const FuelmanScanQR: React.FC = () => {
    const [err, setErr] = useState<string>()
    const [hideBg, setHideBg] = useState("")
    const history = useHistory();
    const location = useLocation();
    const [showConfirm] = useIonAlert();
    const [torch, setTorch] = useState(false);

    /* BEGIN LIFECYCLE APPS */

    /* Proses animasi saat Mau masuk halaman
    disini bisa load data dari API,
    jika dirasa load data akan menyebabkan performa menurun
    bisa dipindah ke diEnter */
    useIonViewWillEnter(() => {
        BarcodeScanner.prepare();
    });

    /* Proses animasi selsai dan sudah sepenuhnya masuk halaman,
    jika load data dilakukan disini sebaiknya diberikan loading screen agar lebih maksimal */
    useIonViewDidEnter(() => {
        // loadDataPref()
        startScan();
    });

    /* Proses animasi akan dimulai saat akan meninggalkan halaman
    disini cocok untuk melakukan clean up atau sebagainya yang sesuai kebutuhan */
    useIonViewWillLeave(() => {
        // @ts-ignore
        document.querySelector('body').classList.remove('scanner-active');
        stopScan();
    });

    /* Proses transisi ke halaman berikutnya
    tidak cocok untuk beberapa logic yang butuh waktu */
    useIonViewDidLeave(() => {
        stopScan();
    });
    /* END LIFECYCLE APPS */

    const { t } = useTranslation();

    const startScan = async () => {
        BarcodeScanner.hideBackground() // make background of WebView transparent
        setHideBg("hideBg")

        const result = await BarcodeScanner.startScan() // start scanning and wait for a result
        stopScan()

        let isValid = false;
        // if the result has content
        if (result.hasContent) {
            document.body.style.background = "";
            document.body.style.opacity="1";
            let data = result.content?.split("_");
            // @ts-ignore
            if(data.length == 4){
                //format QR > hrgabib_tipekupon_idkupon_timestamp
                // @ts-ignore
                let id = data[2];
                // @ts-ignore
                let tipe = data[1]
                try {
                    // @ts-ignore
                    let time = Number(data[3]);
                    let now = new Date().getTime();
                    if(now > time){
                        console.log("SCAN : KuponAPI sudah tidak valid");
                    } else {
                        isValid = true;
                        let path = "";

                        if(tipe === "fuel-unit"){
                            path = "/fuel/detail/";
                        } else if(tipe === "fuel-other"){
                            path = "/fuel/detail-other/";
                        } else if(tipe === "do"){
                            path = "/fuel/detail-do";
                        }

                        history.replace({
                            pathname:path+id,
                            state: {detail:id}
                        });
                    }
                } catch (e){
                    console.log("SCAN : Tidak Valid");
                }

                console.log("SCAN : Valid");
            } else {
                console.log("SCAN : Tidak Valid");
            }
            console.log("SCAN RESULT : "+result.content); // log the raw scanned content
        }
        if(!isValid){
            //record data tidak valid, siapa yang scan, dan di mana
            history.replace({
                pathname:"/fuel/detail/"+0,
                state: {detail:0}
            });
            showConfirm({
                //simpan unit id ke pref
                subHeader: 'QR Code tidak valid, silahkan scan ulang atau minta QR Code baru!',
                buttons: [
                    {
                        text: 'Tidak',
                        cssClass: 'alert-button-cancel',
                        handler: () => {
                            history.goBack();
                            // history.push("/dashboard2");
                        }
                    },
                    {
                        text: 'Ya',
                        cssClass: 'alert-button-confirm',
                        handler: () => {
                            history.replace("/fuel/scan");
                        }
                    },
                ],
            })
        }
    }

    const stopScan = () => {
        BarcodeScanner.showBackground()
        BarcodeScanner.stopScan()
        setHideBg("")
    }

    const [present] = useIonAlert()

    useEffect(() => {
        const checkPermission = async () => {
            try {
                const status = await BarcodeScanner.checkPermission({ force: true })

                if (status.granted) {
                    return true
                }

                return false
            } catch (error) {

            }
        }

        checkPermission()

        return () => {}
    }, [])

    const setTorchOn = (on : boolean) => {
        if(on){
            BarcodeScanner.enableTorch();
            setTorch(true);
        } else {
            BarcodeScanner.disableTorch();
            setTorch(false);
        }
    }

    return (
        <IonPage>
            <ListHeader title={"Scan QR Code "} isReplace={false} link={""} addButton={false} />
            <IonContent className={hideBg}>
                <div hidden={!hideBg} className="scan-box" />
                <div className='absolute bottom-0 w-full mt-12 mb-12'>
                    <div onClick={event => setTorchOn(torch ? false : true)} className='w-full flex justify-center'>
                        {torch ?
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="white" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M11.412 15.655L9.75 21.75l3.745-4.012M9.257 13.5H3.75l2.659-2.849m2.048-2.194L14.25 2.25 12 10.5h8.25l-4.707 5.043M8.457 8.457L3 3m5.457 5.457l7.086 7.086m0 0L21 21" />
                            </svg>
                            :
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="white" className="w-8 h-8">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                            </svg>
                        }
                    </div>
                </div>
            </IonContent>
        </IonPage>
    )
}

export default FuelmanScanQR