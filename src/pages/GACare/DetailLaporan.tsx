import {
    IonContent,
    IonPage,
    IonRefresher,
    IonRefresherContent,
    useIonAlert,
    useIonLoading,
    useIonToast,
    useIonViewDidEnter, useIonViewDidLeave,
    useIonViewWillEnter,
    useIonViewWillLeave,
} from '@ionic/react';

import './DetailLaporan.css';
import { RefresherEventDetail } from '@ionic/core';
import { useTranslation, initReactI18next } from "react-i18next";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {dateSortByAscending} from "../../helper/ConvertDate";
import {
    API_URI, API_URL_IMAGE_GACARE, AUTH_FUEL_GA,
    FUEL_REQ_UNIT_APPROVAL_URI,
    FUEL_REQ_UNIT_URI, GA_CARE_LAPORAN_URI_ADD_KOMENTAR, GA_CARE_LAPORAN_URI_DETAIL, GA_CARE_LAPORAN_URI_UPDATE_STATUS,
    pref_identity,
    pref_json_pegawai_info_login,
    pref_pegawai_id, pref_token,
    pref_unit,
} from "../../constant/Index";
import { useHistory, useLocation, useParams } from "react-router-dom";
import {getFuelMenu, getJsonPref, getPref} from "../../helper/Preferences";
import moment from "moment";
import SVGStopCloseCheckCircle from "../Layout/SVGStopCloseCheckCircle";
import SkeletonDetail from '../Layout/SkeletonDetail';
import DetailHeader from "../../components/Header/DetailHeader";
import {FuelStationAvailableListAPI} from "../../api/MDForFuel/FuelStation";
import { StarIcon } from '@heroicons/react/20/solid';
import {BaseAPI} from "../../api/ApiManager";

const userInfo = { name: "", nik: "", imageUrl: "" }
const userUnit = { id: "", noPol: "", noLambung: "", vendor: { name: "" }, jenisUnit: { name: "" } };

let dataRole = "";
let userId = "";
let identity_ = "";
let dataId = "";
let token_ = "";




const DetailLaporan: React.FC = () => {
    /*const [dataRole, setdataRole] = useState<string>();*/
    //const [getId, setGetId] = useState<string>();
    const [identity, setIdentity] = useState("");
    const history = useHistory();
    const [token, setToken] = useState("");
    const [user, setUser] = useState(userInfo);
    const [unit, setUnit] = useState(userUnit);
    const [pegId, setPegId] = useState("");
    const [presentAlert] = useIonAlert();
    const [present, dismiss] = useIonLoading();
    const [toast] = useIonToast();
    const [sendId, setSendId] = useState("");
    const [dataRow, setDataRow] = useState(null);
    const [showConfirm] = useIonAlert();
    const [approvGA, setApprovGA] = useState(null);
    const [approvFinance, setApprovFinance] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [fuelStation, setFuelStation] = useState([]);

    const [responseTime, setResponseTime] = useState(false);
    const [resolutionTime, setResolutionTime] = useState(false);


    const [ratingStart, setRatingStart] = useState([0, 1, 2, 3, 4]);
    const [isRatingStart, setIsRatingStart] = useState(0);
    /*[0, 1, 2, 3, 4]*/

    const { t } = useTranslation();
    const location = useLocation();

    /* BEGIN LIFECYCLE APPS */

    /* Proses animasi saat Mau masuk halaman
    disini bisa load data dari API,
    jika dirasa load data akan menyebabkan performa menurun
    bisa dipindah ke diEnter */
    useIonViewWillEnter(() => {
    });

    /* Proses animasi selsai dan sudah sepenuhnya masuk halaman,
    jika load data dilakukan disini sebaiknya diberikan loading screen agar lebih maksimal */
    useIonViewDidEnter(() => {
        loadDataPref();
    });

    /* Proses animasi akan dimulai saat akan meninggalkan halaman
    disini cocok untuk melakukan clean up atau sebagainya yang sesuai kebutuhan */
    useIonViewWillLeave(() => {
        setIsLoaded(false);
    });

    /* Proses transisi ke halaman berikutnya
    tidak cocok untuk beberapa logic yang butuh waktu */
    useIonViewDidLeave(() => {
    });
    /* END LIFECYCLE APPS */

    function doRefresh(event: CustomEvent<RefresherEventDetail>) {
        console.log('Begin async operation');
        setIsLoaded(false);
        loadDataPref();
        setTimeout(() => {
            console.log('Async operation has ended');
            event.detail.complete();
        }, 2000);
    }

    /*function btnRating (rating: number){
        setIsRatingStart(rating);
    }*/
    const loadDataPref = () => {
        // @ts-ignore
        dataId = history.location.state.id;
        getJsonPref(pref_json_pegawai_info_login).then(res => {
            setUser(res);
            userId = res.userId;
            //console.log("userId", userId);
        });
        getJsonPref(pref_unit).then(rest => {
            setUnit(rest);
        });
        getPref(pref_pegawai_id).then(res => {
            setPegId(res);
        });
        getPref(pref_token).then(res => {
            setToken(res);
            token_ = res;
            console.log("token_: ", token_);

        });

        getPref(pref_identity).then(i => {
            setIdentity(i);
            identity_ = i;
            //console.log("identity_: ", identity_);
        });
        getFuelMenu().then(menu => {
            let restRole = "";

            if (menu.includes(AUTH_FUEL_GA)) {
                restRole = 'GA';
                // @ts-ignore
                dataRole = restRole;
                /*setDataRole(restRole);*/
                //console.log("cek role GA: ", dataRole);
            }
        });
        /*sendOpened();*/
        loadDetail(dataId);
    }

    /*const loadData = () => {
        loadDataPref();
        // @ts-ignore
        dataId = history.location.state.detail;
        setSendId(dataId);
        // @ts-ignore
        loadDetail(dataId);
    }*/

    const loadDetail = (id: any) => {
        // @ts-ignore
        const urlContents = BaseAPI() + API_URI + GA_CARE_LAPORAN_URI_DETAIL + "/" + dataId;

        fetch(urlContents, {
            method: 'GET',
            headers: {Identity: identity_}
        })
            .then(res => res.json())
            .then(
                (result) => {
                    if (result.status === "SUCCESS") {
                        if(result.data != null && result.data.status === "OPENED"){
                            setResponseTime(true);
                        }
                        if(result.data != null && (result.data.status !== "PROPOSED" && result.data.status !== "OPENED" && result.data.status !== "ONHOLD")){
                            setResolutionTime(true);
                        }
                        setDataRow(result.data);
                        /*let riwayats = result.data.riwayats;
                        // @ts-ignore
                        let appGa = riwayats.filter((x: { [x: string]: { [x: string]: null; }; }) => x['approveType'] == 'GA');
                        setApprovGA(appGa.length > 0 ? appGa[0] : null);
                        // @ts-ignore
                        let appFinance = riwayats.filter((x: { [x: string]: { [x: string]: null; }; }) => x['approveType'] == 'FINANCE');
                        setApprovFinance(appFinance.length > 0 ? appFinance[0] : null);*/
                    }
                    setIsLoaded(true);
                },
                (error) => {
                    //setIsLoaded(true);
                    //setError(error);
                }
            );
    }
    const sendComment = (id: any) => {
        console.log("isi id: ", id);
        // @ts-ignore
        const urlContents = BaseAPI() + API_URI + GA_CARE_LAPORAN_URI_ADD_KOMENTAR;
        // @ts-ignore
        const isiKomentar = document.getElementById(id).value;
        console.log("isi isiKomentar: ", isiKomentar);
        const laporanData = {
            // @ts-ignore
            pegawai: userId,
            riwayat: id,
            komentar: isiKomentar
        }
        fetch(urlContents, {
            method: 'POST',
            headers: {'Content-Type': 'application/json', 'Identity': identity_ != null && identity_ != "" ? identity_ : '',
                'Authorization':`Bearer ${token}`},
            body: JSON.stringify(laporanData)
        })
            .then(res => res.json())
            .then(
                (result) => {
                    if (result.status === "SUCCESS") {
                        // @ts-ignore
                        document.getElementById(id).value = "";
                        loadDataPref();
                    }
                    setIsLoaded(true);
                },
                (error) => {
                    //setIsLoaded(true);
                    //setError(error);
                }
            );
    }

    /*const loadStation = () => {
        FuelStationAvailableListAPI().then((res) => {
            setFuelStation(res.data);
        });
    }*/

    const ref = useRef();

    const handleOpen = () => {
        // @ts-ignore
        ref.current.open();
    };

    const handleClose = () => {
        // @ts-ignore
        ref.current.close();
    };

    const btnBack = () => {
        // history.goBack();
        history.push("/fuel/req-fuel/daftar-permintaan");
    }

    const btnBatal = () => {
        presentAlert({
            subHeader: 'Anda yakin untuk membatalkan Permintaan Bahan Bakar Unit ini?',
            backdropDismiss: false,
            buttons: [
                {
                    text: 'Tidak',
                    cssClass: 'alert-button-cancel',
                },
                {
                    text: 'Ya',
                    cssClass: 'alert-button-confirm',
                    handler: () => {
                        sendRequest();
                    }
                },
            ],
        })
    }
    /*const sendOpened = () => {
        // @ts-ignore
        const urlContents = BaseAPI() + API_URI + GA_CARE_LAPORAN_URI_UPDATE_STATUS;

        const laporanData = {
            laporan: {
                id: dataId
            },
            pegawai: {
                id: userId
            },
            status: "OPENED"
        }
        fetch(urlContents, {
            method: 'POST',
            headers: {'Content-Type': 'application/json', 'Identity': identity_ != null && identity_ != "" ? identity_ : '',
                'Authorization':`Bearer ${token}`},
            body: JSON.stringify(laporanData)
        })
            .then(res => res.json())
            .then(
                (result) => {
                    if (result.status === "SUCCESS") {
                        /!* // @ts-ignore
                         document.getElementById("ketProcess").innerText = "";
                         loadDataPref();*!/
                        //history.push("/ga-care/list-laporan");
                    }
                    setIsLoaded(true);
                },
                (error) => {
                    //setIsLoaded(true);
                    //setError(error);
                }
            );
    }*/


    const btnProcess = () => {
        let frm = document.getElementById("frmProcess");
        let btn = document.getElementById("btnProcess");
        // @ts-ignore
        frm.style.display = 'inline';
        // @ts-ignore
        btn.style.display = 'none';
    }
    const btnProcessCancel = () => {
        let frm = document.getElementById("frmProcess");
        let btn = document.getElementById("btnProcess");
        // @ts-ignore
        frm.style.display = 'none';
        // @ts-ignore
        btn.style.display = 'inline';
    }
    const sendProcess = () => {
        // @ts-ignore
        const urlContents = BaseAPI() + API_URI + GA_CARE_LAPORAN_URI_UPDATE_STATUS;
        // @ts-ignore
        const isiKomentar = document.getElementById("ketProcess").value;
        console.log("isi isiKomentar: ", isiKomentar);

        const laporanData = {
            laporan: {
                id: dataId
            },
            pegawai: {
                id: userId
            },
            status: "PROCESSED",
            keterangan: isiKomentar
        }
        fetch(urlContents, {
            method: 'POST',
            headers: {'Content-Type': 'application/json', 'Identity': identity_ != null && identity_ != "" ? identity_ : '',
                'Authorization':`Bearer ${token}`},
            body: JSON.stringify(laporanData)
        })
            .then(res => res.json())
            .then(
                (result) => {
                    if (result.status === "SUCCESS") {
                       /* // @ts-ignore
                        document.getElementById("ketProcess").innerText = "";
                        loadDataPref();*/
                        history.goBack();
                        // history.push("/ga-care/list-laporan");
                    }
                    setIsLoaded(true);
                },
                (error) => {
                    //setIsLoaded(true);
                    //setError(error);
                }
            );
    }
    const btnReject = () => {
        let frm = document.getElementById("frmReject");
        let btn = document.getElementById("btnReject");
        // @ts-ignore
        frm.style.display = 'inline';
        // @ts-ignore
        btn.style.display = 'none';
    }
    const btnRejectCancel = () => {
        let frm = document.getElementById("frmReject");
        let btn = document.getElementById("btnReject");
        // @ts-ignore
        frm.style.display = 'none';
        // @ts-ignore
        btn.style.display = 'inline';
    }
    const sendReject = () => {
        // @ts-ignore
        const urlContents = BaseAPI() + API_URI + GA_CARE_LAPORAN_URI_UPDATE_STATUS;
        // @ts-ignore
        const isiKomentar = document.getElementById("ketReject").value;
        console.log("isi isiKomentar: ", isiKomentar);

        const laporanData = {
            laporan: {
                id: dataId
            },
            pegawai: {
                id: userId
            },
            status: "REJECTED",
            keterangan: isiKomentar
        }
        fetch(urlContents, {
            method: 'POST',
            headers: {'Content-Type': 'application/json', 'Identity': identity_ != null && identity_ != "" ? identity_ : '',
                'Authorization':`Bearer ${token}`},
            body: JSON.stringify(laporanData)
        })
            .then(res => res.json())
            .then(
                (result) => {
                    if (result.status === "SUCCESS") {
                        /* // @ts-ignore
                         document.getElementById("ketProcess").innerText = "";
                         loadDataPref();*/
                        history.goBack();
                        // history.push("/ga-care/list-laporan");
                    }
                    setIsLoaded(true);
                },
                (error) => {
                    //setIsLoaded(true);
                    //setError(error);
                }
            );
    }
    const btnDone = () => {
        let frm = document.getElementById("frmDone");
        let btn = document.getElementById("btnDone");
        // @ts-ignore
        frm.style.display = 'inline';
        // @ts-ignore
        btn.style.display = 'none';
    }
    const btnDoneCancel = () => {
        let frm = document.getElementById("frmDone");
        let btn = document.getElementById("btnDone");
        // @ts-ignore
        frm.style.display = 'none';
        // @ts-ignore
        btn.style.display = 'inline';
    }
    const sendDone = () => {
        // @ts-ignore
        const urlContents = BaseAPI() + API_URI + GA_CARE_LAPORAN_URI_UPDATE_STATUS;
        // @ts-ignore
        const isiKomentar = document.getElementById("ketDone").value;
        console.log("isi isiKomentar: ", isiKomentar);

        const laporanData = {
            laporan: {
                id: dataId
            },
            pegawai: {
                id: userId
            },
            status: "DONE",
            keterangan: isiKomentar
        }
        fetch(urlContents, {
            method: 'POST',
            headers: {'Content-Type': 'application/json', 'Identity': identity_ != null && identity_ != "" ? identity_ : '',
                'Authorization':`Bearer ${token}`},
            body: JSON.stringify(laporanData)
        })
            .then(res => res.json())
            .then(
                (result) => {
                    if (result.status === "SUCCESS") {
                        /* // @ts-ignore
                         document.getElementById("ketProcess").innerText = "";
                         loadDataPref();*/
                        history.goBack();
                        // history.push("/ga-care/list-laporan");
                    }
                    setIsLoaded(true);
                },
                (error) => {
                    //setIsLoaded(true);
                    //setError(error);
                }
            );
    }


    const btnConfirmation = () => {
        let frm = document.getElementById("frmConfirmation");
        let btn = document.getElementById("btnConfirmation");
        // @ts-ignore
        frm.style.display = 'inline';
        // @ts-ignore
        btn.style.display = 'none';
    }
    const btnConfirmationCancel = () => {
        let frm = document.getElementById("frmConfirmation");
        let btn = document.getElementById("btnConfirmation");
        // @ts-ignore
        frm.style.display = 'none';
        // @ts-ignore
        btn.style.display = 'inline';
    }
    const sendConfirmation = () => {
        // @ts-ignore
        const urlContents = BaseAPI() + API_URI + GA_CARE_LAPORAN_URI_UPDATE_STATUS;
        // @ts-ignore
        const isiKomentar = document.getElementById("ketConfirmation").value;
        console.log("isi isiKomentar: ", isiKomentar);

        const laporanData = {
            laporan: {
                id: dataId
            },
            pegawai: {
                id: userId
            },
            status: "CLOSED",
            keterangan: isiKomentar
        }
        fetch(urlContents, {
            method: 'POST',
            headers: {'Content-Type': 'application/json', 'Identity': identity_ != null && identity_ != "" ? identity_ : '',
                'Authorization':`Bearer ${token}`},
            body: JSON.stringify(laporanData)
        })
            .then(res => res.json())
            .then(
                (result) => {
                    if (result.status === "SUCCESS") {
                        /* // @ts-ignore
                         document.getElementById("ketProcess").innerText = "";
                         loadDataPref();*/
                        history.goBack();
                        // history.push("/ga-care/list-laporan");
                    }
                    setIsLoaded(true);
                },
                (error) => {
                    //setIsLoaded(true);
                    //setError(error);
                }
            );
    }

    const btnReturn = () => {
        let frm = document.getElementById("frmReturn");
        let btn = document.getElementById("btnReturn");
        // @ts-ignore
        frm.style.display = 'inline';
        // @ts-ignore
        btn.style.display = 'none';
    }
    const btnReturnCancel = () => {
        let frm = document.getElementById("frmReturn");
        let btn = document.getElementById("btnReturn");
        // @ts-ignore
        frm.style.display = 'none';
        // @ts-ignore
        btn.style.display = 'inline';
    }
    const sendReturn = () => {
        // @ts-ignore
        const urlContents = BaseAPI() + API_URI + GA_CARE_LAPORAN_URI_UPDATE_STATUS;
        // @ts-ignore
        const isiKomentar = document.getElementById("ketReturn").value;
        console.log("isi isiKomentar: ", isiKomentar);

        const laporanData = {
            laporan: {
                id: dataId
            },
            pegawai: {
                id: userId
            },
            status: "REOPENED",
            keterangan: isiKomentar
        }
        fetch(urlContents, {
            method: 'POST',
            headers: {'Content-Type': 'application/json', 'Identity': identity_ != null && identity_ != "" ? identity_ : '',
                'Authorization':`Bearer ${token}`},
            body: JSON.stringify(laporanData)
        })
            .then(res => res.json())
            .then(
                (result) => {
                    if (result.status === "SUCCESS") {
                        /* // @ts-ignore
                         document.getElementById("ketProcess").innerText = "";
                         loadDataPref();*/
                        history.goBack();
                        // history.push("/ga-care/list-laporan");
                    }
                    setIsLoaded(true);
                },
                (error) => {
                    //setIsLoaded(true);
                    //setError(error);
                }
            );
    }

    const btnCancel = () => {
        let frm = document.getElementById("frmCancel");
        let btn = document.getElementById("btnCancel");
        // @ts-ignore
        frm.style.display = 'inline';
        // @ts-ignore
        btn.style.display = 'none';
    }
    const btnCancelCancel = () => {
        let frm = document.getElementById("frmCancel");
        let btn = document.getElementById("btnCancel");
        // @ts-ignore
        frm.style.display = 'none';
        // @ts-ignore
        btn.style.display = 'inline';
    }
    const sendCancel = () => {
        // @ts-ignore
        const urlContents = BaseAPI() + API_URI + GA_CARE_LAPORAN_URI_UPDATE_STATUS;
        // @ts-ignore
        const isiKomentar = document.getElementById("ketCancel").value;
        console.log("isi isiKomentar: ", isiKomentar);

        const laporanData = {
            laporan: {
                id: dataId
            },
            pegawai: {
                id: userId
            },
            status: "CANCELED",
            keterangan: isiKomentar
        }
        fetch(urlContents, {
            method: 'POST',
            headers: {'Content-Type': 'application/json', 'Identity': identity_ != null && identity_ != "" ? identity_ : '',
                'Authorization':`Bearer ${token}`},
            body: JSON.stringify(laporanData)
        })
            .then(res => res.json())
            .then(
                (result) => {
                    if (result.status === "SUCCESS") {
                        /* // @ts-ignore
                         document.getElementById("ketProcess").innerText = "";
                         loadDataPref();*/
                        history.goBack();
                        // history.push("/ga-care/list-laporan");
                    }
                    setIsLoaded(true);
                },
                (error) => {
                    //setIsLoaded(true);
                    //setError(error);
                }
            );
    }



    const sendRequest = () => {
        const loading = present({
            message: 'Memproses pembatalan ...',
            backdropDismiss: false
        })
        const url = BaseAPI() + API_URI + FUEL_REQ_UNIT_URI + FUEL_REQ_UNIT_APPROVAL_URI;
        const data = { kupon: { id: sendId }, status: "CANCELED", approveType: "USER", komentar: null, tanggal: (new Date()), pegawai: { id: pegId } } //user diambil dari pref
        fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Identity': identity ? identity : '',
                'Authorization':`Bearer ${token}` },
            body: JSON.stringify(data)
        })
            .then(res => res.json())
            .then(
                (result) => {
                    dismiss();
                    if (result.status === "SUCCESS") {
                        showConfirm({
                            //simpan unit id ke pref
                            subHeader: "Pembatalan Permintaan Bahan Bakar Unit berhasil!",
                            backdropDismiss: false,
                            buttons: [
                                {
                                    text: 'OK',
                                    cssClass: 'alert-button-confirm',
                                    handler: () => {
                                        loadDetail(sendId);
                                    }
                                },
                            ],
                        })
                    } else {
                        toast({
                                message: "Terjadi kesalahan! [" + result.message + "]", duration: 1500, position: "top"
                            }
                        );
                    }
                },
                // Note: it's important to handle errors here
                // instead of a catch() block so that we don't swallow
                // exceptions from actual bugs in components.
                (error) => {
                    dismiss();
                    toast({
                            message: "Terjadi kesalahan! [" + error.message + "]", duration: 1500, position: "top"
                        }
                    );
                }
            )
    };

    const reviews = [
        {
            id: 1,
            rating: 5,
            content: `
      <p>This icon pack is just what I need for my latest project. There's an icon for just about anything I could ever need. Love the playful look!</p>
    `,
            date: 'July 16, 2021',
            datetime: '2021-07-16',
            author: 'Emily Selman',
            avatarSrc:
                'https://images.unsplash.com/photo-1502685104226-ee32379fefbe?ixlib=rb-=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=8&w=256&h=256&q=80',
        },
        {
            id: 2,
            rating: 5,
            content: `
      <p>Blown away by how polished this icon pack is. Everything looks so consistent and each SVG is optimized out of the box so I can use it directly with confidence. It would take me several hours to create a single icon this good, so it's a steal at this price.</p>
    `,
            date: 'July 12, 2021',
            datetime: '2021-07-12',
            author: 'Hector Gibbons',
            avatarSrc:
                'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=8&w=256&h=256&q=80',
        },
        // More reviews...
    ]
    // @ts-ignore
    // @ts-ignore
    // @ts-ignore
    // @ts-ignore
    // @ts-ignore
    // @ts-ignore
    // @ts-ignore
    // @ts-ignore
    // @ts-ignore
    // @ts-ignore
    // @ts-ignore
    // @ts-ignore
    // @ts-ignore
    return (
        <IonPage>
            {isLoaded ?
                <>
                    <IonContent fullscreen>
                        <IonRefresher slot="fixed" onIonRefresh={doRefresh}>
                            <IonRefresherContent></IonRefresherContent>
                        </IonRefresher>
                        <div className="bg-white flex flex-col min-h-screen justify-between">

                            {/* === Start Form  === */}
                            <div>
                                {/* Header */}
                                <DetailHeader title='Detail Laporan' link='' approval={dataRow != null ? dataRow["status"] : "N/A"}></DetailHeader>
                                {/* end Header */}
                                <div className="p-3">
                                    <div className="pt-4">
                                        <label className="block text-sm text-gray-400">
                                            Nomor
                                        </label>
                                        <div>
                                            {dataRow != null ? dataRow["nomor"] != null ? dataRow["nomor"] : "-" : "-"}
                                        </div>
                                    </div>
                                    <div className="pt-4">
                                        <label className="block text-sm text-gray-400">
                                            Nama
                                        </label>
                                        <div>
                                            {dataRow != null ? dataRow["pelapor"] != null ? dataRow["pelapor"]["name"] : "-" : "-"}
                                        </div>
                                    </div>

                                    <div className="mt-4">
                                        <label className="block text-sm text-gray-400">
                                            Tipe
                                        </label>
                                        <div>
                                            {dataRow != null ? dataRow["tipe"] != null ? dataRow["tipe"]["name"] : "-" : "-"}
                                        </div>
                                    </div>

                                    <div className="mt-4">
                                        <label className="block text-sm text-gray-400">
                                            Kategori
                                        </label>
                                        <div>
                                            {dataRow != null ? dataRow["kategori"] != null ? dataRow["kategori"]["name"] : "-" : "-"}
                                        </div>
                                    </div>
                                    <div className="mt-4">
                                        <label className="block text-sm text-gray-400">
                                            Lokasi
                                        </label>
                                        <div>
                                            {dataRow != null ? dataRow["lokasi"] != null ? dataRow["lokasi"]["name"] : "-" : "-"}
                                        </div>
                                    </div>
                                    <div className="mt-4">
                                        <label className="block text-sm text-gray-400">
                                            Laporan
                                        </label>
                                        <div>
                                            {dataRow != null ? dataRow["laporan"] != null ? dataRow["laporan"] : "-" : "-"}
                                        </div>
                                    </div>
                                    {responseTime ? (
                                    <div className="mt-4">
                                        <label className="block text-sm text-gray-400">
                                            Response Times
                                        </label>
                                        <div>
                                            {dataRow != null ? moment(dataRow["tanggal"]).format('DD MMM yyyy').toString() : "-"}
                                        </div>
                                    </div>
                                    ) : null}

                                    {resolutionTime ? (
                                        <div className="mt-4">
                                            <label className="block text-sm text-gray-400">
                                                Resolution Times
                                            </label>
                                            <div>
                                                {dataRow != null ? moment(dataRow["tanggal"]).format('DD MMM yyyy').toString() : "-"}
                                            </div>
                                        </div>
                                    ) : null}


                                    <div className="mt-4">
                                        <label className="block text-sm text-gray-400">
                                            Status
                                        </label>
                                        <div className="mt-3">
                                            {// @ts-ignore
                                                dataRow['status'] =="PROPOSED" ? (
                                                <span className="px-2 py-2  rounded-md bg-gray-400  items-center justify-center text-xs">
                                                      {// @ts-ignore
                                                          dataRow['status']
                                                      }
                                                </span>
                                            ) : ("")
                                            }
                                            {// @ts-ignore
                                                dataRow['status'] =="OPENED" ? (
                                                    <span className="px-2 py-2 text-white rounded-md bg-blue-500  items-center justify-center text-xs">
                                                     {// @ts-ignore
                                                         dataRow['status']
                                                     }
                                                </span>
                                                ) : ("")}

                                            {// @ts-ignore
                                                dataRow['status'] =="REOPENED" ? (
                                                <span className="px-2 py-2 text-white rounded-md bg-amber-500  items-center justify-center text-xs">
                                                     {// @ts-ignore
                                                         dataRow['status']
                                                     }
                                                </span>
                                            ) : ("")}
                                            {// @ts-ignore
                                                dataRow['status'] =="REJECTED" || dataRow['status'] =="CANCELED" ? (
                                                <span className="px-2 py-2 text-white rounded-md bg-red-500  items-center justify-center text-xs">
                                                    {// @ts-ignore
                                                        dataRow['status']
                                                    }
                                                </span>
                                            ) : ("")}
                                            {// @ts-ignore
                                                dataRow['status'] =="PROCESSED" ? (
                                                <span className="px-2 py-2  rounded-md bg-green-400  items-center justify-center text-xs ">
                                                {// @ts-ignore
                                                    dataRow['status']
                                                }
                                                </span>
                                            ) : ("")}
                                            {// @ts-ignore
                                                dataRow['status'] =="DONE" || dataRow['status'] =="CLOSED" ? (
                                                <span className="px-2 py-2 text-white rounded-md bg-green-400 items-center justify-center text-xs">

                                                    {// @ts-ignore
                                                        dataRow['status']
                                                    }
                                                </span>
                                            ) : ("")}


                                        </div>
                                    </div>
                                    <div className="mt-4">
                                        <label className="block text-sm text-gray-400">
                                            Evidences
                                        </label>
                                        <div className="grid grid-cols-3 gap-2 flex items-center rounded-md">
                                            {// @ts-ignore
                                                dataRow.medias != null ? dataRow.medias .map((items, index) => (
                                                <>
                                                    <div
                                                        className="border border-gray-300 bg-white text-gray-300"
                                                        // @ts-ignore
                                                        preserveAspectRatio="none"
                                                        stroke="currentColor"
                                                        fill="none"
                                                        viewBox="0 0 200 200"
                                                        aria-hidden="true"
                                                        key={index}>
                                                        <img className="rounded-md object-cover pointer-events-none"
                                                             src={BaseAPI() + API_URI + API_URL_IMAGE_GACARE + items.fileName}></img>
                                                    </div>
                                                </>
                                                )) : null}

                                        </div>
                                    </div>
                                    <div className="mt-4">
                                        <label className="block text-sm text-gray-400">
                                            Riwayat
                                        </label>
                                        <div className="pt-2">
                                            <div className="flow-root">
                                                <ul role="list" className="mb-8">
                                                    {// @ts-ignore
                                                        dataRow.riwayats != null ? dateSortByAscending(dataRow.riwayats) .map((items, index) => (
                                                        <>
                                                            <li key={items.id}>
                                                                <div className="relative pb-3">
                                                                    <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true"></span>
                                                                    <div className="relative flex space-x-3">
                                                                        <div>
                                                                        {items.status =="PROPOSED" ? (
                                                                            <span className="h-7 w-7 rounded-full bg-gray-400 flex items-center justify-center ring-7 ring-white">
                                                                                <svg className="h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                                                                                    <path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"/>
                                                                                </svg>
                                                                            </span>
                                                                            ) : ("")
                                                                        }
                                                                        {items.status =="OPENED" ? (
                                                                            <span className="h-7 w-7 rounded-full bg-blue-500 flex items-center justify-center ring-7 ring-white">
                                                                                <svg className="h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                                                                                    <path stroke-linecap="round" stroke-linejoin="round" d="M21.75 9v.906a2.25 2.25 0 01-1.183 1.981l-6.478 3.488M2.25 9v.906a2.25 2.25 0 001.183 1.981l6.478 3.488m8.839 2.51l-4.66-2.51m0 0l-1.023-.55a2.25 2.25 0 00-2.134 0l-1.022.55m0 0l-4.661 2.51m16.5 1.615a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V8.844a2.25 2.25 0 011.183-1.98l7.5-4.04a2.25 2.25 0 012.134 0l7.5 4.04a2.25 2.25 0 011.183 1.98V19.5z"/>
                                                                                </svg>
                                                                            </span>
                                                                        ) : ("")}

                                                                        {items.status =="REOPENED" ? (
                                                                            <span className="h-7 w-7 rounded-full bg-amber-500 flex items-center justify-center ring-7 ring-white">
                                                                            <svg className="h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                                                                                <path stroke-linecap="round" stroke-linejoin="round" d="M21.75 9v.906a2.25 2.25 0 01-1.183 1.981l-6.478 3.488M2.25 9v.906a2.25 2.25 0 001.183 1.981l6.478 3.488m8.839 2.51l-4.66-2.51m0 0l-1.023-.55a2.25 2.25 0 00-2.134 0l-1.022.55m0 0l-4.661 2.51m16.5 1.615a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V8.844a2.25 2.25 0 011.183-1.98l7.5-4.04a2.25 2.25 0 012.134 0l7.5 4.04a2.25 2.25 0 011.183 1.98V19.5z"/>
                                                                            </svg>
                                                                        </span>
                                                                        ) : ("")}
                                                                        {items.status =="REJECTED" || items.status =="CANCELED" ? (
                                                                            <span className="h-7 w-7 rounded-full bg-red-500 flex items-center justify-center ring-7 ring-white">
                                                                                <svg className="h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                                                                                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
                                                                                </svg>
                                                                            </span>
                                                                        ) : ("")}
                                                                            {items.status =="PROCESSED" ? (
                                                                                <span className="h-7 w-7 rounded-full bg-green-400 flex items-center justify-center ring-7 ring-white">
                                                                                <svg className="h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                                                                                    <path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"/></svg>
                                                                                </span>
                                                                            ) : ("")}
                                                                            {items.status =="DONE" || items.status =="CLOSED"? (
                                                                                <span className="h-7 w-7 rounded-full bg-green-400 flex items-center justify-center ring-7 ring-white">

                                                                                    <svg className="h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                                                                                        <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5"/>
                                                                                    </svg>
                                                                                </span>
                                                                            ) : ("")}
                                                                        </div>
                                                                        <div className="min-w-0 pt-1">
                                                                            <div className="flex flex-1 justify-between">
                                                                                <div>
                                                                                    <span className="text-xs text-gray-500">
                                                                                        {items.status}</span>
                                                                                    </div>
                                                                                <div>
                                                                                    <span className="text-xs text-right text-gray-500 ml-2">
                                                                                        {moment(items.tanggal).format('DD MMM YYYY hh:mm')}
                                                                                    </span>
                                                                                </div>
                                                                            </div>
                                                                            <div>
                                                                                <span className="text-xs font-bold text-gray-900">
                                                                                    {items.pegawai.name}
                                                                                    </span>
                                                                            </div>
                                                                        </div>


                                                                    </div>
                                                                    {items.keterangan != null ? (
                                                                        <div className="flex min-w-0 flex-1 space-x-3 pt-1">
                                                                            <div>
                                                                                <label className="ml-10 block text-sm text-gray-400">
                                                                                    Keterangan:
                                                                                </label>
                                                                                <span className="ml-10 text-xs text-gray-500 font-bold font-italic">
                                                                                    {items.keterangan}
                                                                                </span>
                                                                            </div>
                                                                        </div>
                                                                    ) : null}

                                                                    {// @ts-ignore
                                                                        items.komentars != null ? items.komentars .map((itemss, indexs) => (

                                                                            <div className="min-w-0 space-x-3 pt-1">

                                                                                <div >

                                                                                    <span className="ml-10 text-xs text-gray-500 font-bold font-italic pr-1">
                                                                                    {itemss.pegawai.name}
                                                                                    </span>
                                                                                    <span className="text-xs text-gray-500">
                                                                                    {moment(itemss.tanggal).format('DD MMM YYYY hh:mm')}
                                                                                    </span>
                                                                                </div>
                                                                                <div className="relative flex space-x-3">
                                                                                    <span className="ml-7 h-5 w-5 rounded-full bg-gray-400 flex items-center justify-center ring-5 ring-white">
                                                                                        <svg className="h-3 w-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                                                                                            <path stroke-linecap="round" stroke-linejoin="round" d="M8.625 9.75a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375m-13.5 3.01c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.184-4.183a1.14 1.14 0 01.778-.332 48.294 48.294 0 005.83-.498c1.585-.233 2.708-1.626 2.708-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z"/>
                                                                                        </svg>
                                                                                    </span>
                                                                                    <span className="ml-6 text-xs text-gray-500 ">
                                                                                    {itemss.komentar}
                                                                                    </span>
                                                                                </div>
                                                                            </div>
                                                                        )) : null}

                                                                        {items.status == "PROCESSED" &&  index == 0 &&
                                                                        // @ts-ignore
                                                                        dataRow['status'] == "PROCESSED" ? (
                                                                            <>
                                                                                <div className="ml-10 mt-3">
                                                                                <label htmlFor="comment" className="sr-only">
                                                                                    Comment
                                                                                </label>
                                                                                <div>
                                                                                    <textarea rows={2} id={items.id} name="komentar" className="block w-full border rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-3" placeholder="Add your comment here..." defaultValue={''}/>
                                                                                </div>
                                                                                <div className="mt-2 flex justify-end">
                                                                                    <button onClick={() => sendComment(items.id)} type="button" className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                                                                                        Send
                                                                                    </button>
                                                                                </div>
                                                                                </div>

                                                                            </>
                                                                        ) : null}



                                                                </div>

                                                            </li>

                                                        </>

                                                    )) : null}
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className='p-3 items-end bg-white'>
                                <div id="frmProcess" className="hidden">
                                    <div className="mt-3">
                                        <label className="sr-only">
                                            Process
                                        </label>
                                        <div>
                                            <textarea rows={2} id="ketProcess" name="komentar" className="block w-full border rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-3" placeholder="Add your comment here..." defaultValue={''}/>
                                        </div>
                                        <div className="mt-2 flex justify-end">
                                            <button onClick={btnProcessCancel} type="button" className="ml-1 mb-1  inline-flex items-center rounded-md border border-transparent bg-gray-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                                                Cancel
                                            </button>
                                            <button onClick={sendProcess} type="button" className="ml-1 mb-1 inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                                                Comment
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <div id="frmReject" className="hidden">
                                    <div className="mt-3">
                                        <label htmlFor="comment" className="sr-only">
                                            Reject
                                        </label>
                                        <div>
                                            <textarea rows={2} id="ketReject" name="komentar" className="block w-full border rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-3" placeholder="Add your comment here..." defaultValue={''}/>
                                        </div>
                                        <div className="mt-2 flex justify-end">
                                            <button onClick={btnRejectCancel} type="button" className="ml-1 mb-1  inline-flex items-center rounded-md border border-transparent bg-gray-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                                                Cancel
                                            </button>
                                            <button onClick={sendReject} type="button" className="ml-1 mb-1 inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                                                Comment
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <div id="frmDone" className="hidden">
                                    <div className="mt-3">
                                        <label htmlFor="comment" className="sr-only">
                                            Done
                                        </label>
                                        <div>
                                            <textarea rows={2} id="ketDone" name="komentar" className="block w-full border rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-3" placeholder="Add your comment here..." defaultValue={''}/>
                                        </div>
                                        <div className="mt-2 flex justify-end">
                                            <button onClick={btnDoneCancel} type="button" className="ml-1 mb-1  inline-flex items-center rounded-md border border-transparent bg-gray-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                                                Cancel
                                            </button>
                                            <button onClick={sendDone} type="button" className="ml-1 mb-1 inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                                                Comment
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <div id="frmConfirmation" className="hidden">
                                    <div className="mt-3">
                                        <label htmlFor="comment" className="sr-only">
                                            Confirmation
                                        </label>
                                        <div className="mt-3 mb-3 px-3 text-center">
                                            <span className="text-center text-xs">
                                                Berikan penilaian anda pada laporan kami
                                            </span>
                                            <div className="w-full flex flex-1">
                                                <div className="mx-auto mt-4 mb-4 flex items-center">
                                                   {/* <StarIcon className="text-yellow-400" aria-hidden="true"/>*/}


                                                    {ratingStart.map((rating) => (
                                                        <>
                                                            {/*{rating}, {isRatingStart} a*/}
                                                            {isRatingStart > 0 ?  (
                                                                <>
                                                                        <StarIcon
                                                                            key={rating}
                                                                            className={(// @ts-ignore
                                                                                isRatingStart > rating ? 'h-8 w-8 text-yellow-400' : ' h-8 w-8 text-gray-600'
                                                                            )}
                                                                            aria-hidden="true"
                                                                        />
                                                                </>
                                                            ) : (
                                                                <>
                                                                        <StarIcon
                                                                            key={rating}
                                                                            className="h-8 w-8 flex-shrink-0" aria-hidden="true"
                                                                        />
                                                                </>
                                                            )}
                                                        </>
                                                    ))}
                                                </div>
                                            </div>
                                            {/*<div className="fle flex-1">
                                                <div className="mt-4 flex items-center">
                                                    <div className="ml-10">
                                                        <div className="mt-4 flex items-center">
                                                            <StarIcon className="text-yellow-400 text-gray-300 h-5 w-5 flex-shrink-0" />

                                                            {[0, 1, 2, 3, 4].map(() => (
                                                                <StarIcon>aaa</StarIcon>
                                                            ))}

                                                        </div>
                                                        {reviews.map((review, reviewIdx) => (
                                                            <>
                                                            <div key={review.id} className="flex space-x-4 text-sm text-gray-500">
                                                                <div className="flex-none py-10">
                                                                    <img src={review.avatarSrc} alt="" className="h-10 w-10 rounded-full bg-gray-100" />
                                                                </div>
                                                                <div className={classNames(reviewIdx === 0 ? '' : 'border-t border-gray-200', 'flex-1 py-10')}>
                                                                    <h3 className="font-medium text-gray-900">{review.author}</h3>
                                                                    <p>
                                                                        <time dateTime={review.datetime}>{review.date}</time>
                                                                    </p>

                                                                    <div className="mt-4 flex items-center">
                                                                        {[0, 1, 2, 3, 4].map((rating) => (
                                                                            <StarIcon
                                                                                key={rating}
                                                                                className={classNames(
                                                                                    review.rating > rating ? 'text-yellow-400' : 'text-gray-300',
                                                                                    'h-5 w-5 flex-shrink-0'
                                                                                )}
                                                                                aria-hidden="true"
                                                                            />
                                                                        ))}
                                                                    </div>
                                                                    <p className="sr-only">{review.rating} out of 5 stars</p>

                                                                    <div
                                                                        className="prose prose-sm mt-4 max-w-none text-gray-500"
                                                                        dangerouslySetInnerHTML={{ __html: review.content }}
                                                                    />
                                                                </div>
                                                            </div>
                                                            </>
                                                        ))}
                                                    </div>
                                                </div>
                                                <p className="sr-only">{// @ts-ignore
                                                    5} out of 5 stars</p>
                                            </div>*/}
                                        </div>
                                        <div>
                                            <textarea rows={2} id="ketConfirmation" name="komentar" className="block w-full border rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-3" placeholder="Add your comment here..." defaultValue={''}/>
                                        </div>
                                        <div className="mt-2 flex justify-end">
                                            <button onClick={btnConfirmationCancel} type="button" className="ml-1 mb-1  inline-flex items-center rounded-md border border-transparent bg-gray-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                                                Cancel
                                            </button>
                                            <button onClick={sendConfirmation} type="button" className="ml-1 mb-1 inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                                                Comment
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <div id="frmReturn" className="hidden">
                                    <div className="mt-3">
                                        <label htmlFor="comment" className="sr-only">
                                            Return
                                        </label>
                                        <div>
                                            <textarea rows={2} id="ketReturn" name="komentar" className="block w-full border rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-3" placeholder="Add your comment here..." defaultValue={''}/>
                                        </div>
                                        <div className="mt-2 flex justify-end">
                                            <button onClick={btnReturnCancel} type="button" className="ml-1 mb-1  inline-flex items-center rounded-md border border-transparent bg-gray-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                                                Cancel
                                            </button>
                                            <button onClick={sendReturn} type="button" className="ml-1 mb-1 inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                                                Comment
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <div id="frmCancel" className="hidden">
                                    <div className="mt-3">
                                        <label htmlFor="comment" className="sr-only">
                                            Return
                                        </label>
                                        <div>
                                            <textarea rows={2} id="ketCancel" name="komentar" className="block w-full border rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-3" placeholder="Add your comment here..." defaultValue={''}/>
                                        </div>
                                        <div className="mt-2 flex justify-end">
                                            <button onClick={btnCancelCancel} type="button" className="ml-1 mb-1  inline-flex items-center rounded-md border border-transparent bg-gray-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                                                Cancel
                                            </button>
                                            <button onClick={sendCancel} type="button" className="ml-1 mb-1 inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                                                Comment
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/*Cek Role: {dataRole}
                                Cek Status: {// @ts-ignore
                                    dataRow['status']
                                }*/}
                                {// @ts-ignore
                                    (dataRow['status'] === "OPENED") && dataRole === "GA"? (
                                    <>
                                    <button id="btnProcess" onClick={btnProcess} className="mb-1 mt-1 w-full items-center mx-auto rounded-md bg-green-400 px-3 py-2 text-sm font-bold text-white">
                                        Process
                                    </button>
                                    <button id="btnReject" onClick={btnReject} className="mb-1 mt-1 w-full items-center mx-auto rounded-md bg-red-500 px-3 py-2 text-sm font-bold text-white">
                                        Reject
                                    </button>
                                    </>
                                ) : null }
                                {// @ts-ignore
                                dataRow['status'] === "PROCESSED" && dataRole === "GA" ? (
                                    <>
                                        <button id="btnDone" onClick={btnDone} className="mb-1 mt-1 w-full items-center mx-auto rounded-md bg-indigo-600 px-3 py-2 text-sm font-bold text-white">
                                            Done
                                        </button>
                                    </>
                                ) : null }
                                {// @ts-ignore
                                dataRow['status'] === "DONE" && dataRole !== "GA" ? (
                                    <>
                                        <button id="btnConfirmation" onClick={btnConfirmation} className="mb-1 mt-1 w-full items-center mx-auto rounded-md bg-indigo-600 px-3 py-2 text-sm font-bold text-white">
                                            Confirmation
                                        </button>
                                        <button id="btnReturn" onClick={btnReturn} className="mb-1 mt-1 w-full items-center mx-auto rounded-md bg-red-500 px-3 py-2 text-sm font-bold text-white">
                                            Return
                                        </button>
                                    </>
                                ) : null }
                                {// @ts-ignore
                                    dataRow['status'] === "PROPOSED" && dataRole !== "GA" ? (
                                        <>
                                            <button id="btnCancel" onClick={btnCancel} className="mb-1 mt-1 w-full items-center mx-auto rounded-md bg-red-500 px-3 py-2 text-sm font-bold text-white">
                                                Cancel
                                            </button>
                                        </>
                                    ) : null }
                            </div>
                            {/* === End Form === */}
                            {/*{(reqFuel != null && (reqFuel["status"] === "PROPOSED" || reqFuel["status"] === "APPROVED" || reqFuel === "READY")) &&
                                <div className='p-3 items-end bg-white'>
                                    <button onClick={btnBatal} className="w-full items-center mx-auto rounded-md bg-red-500 px-3 py-2 text-sm font-bold text-white">
                                        BATAL
                                    </button>
                                </div>
                            }*/}
                            {/* === Footer button ===*/}
                            {/*<ActionSheet ref={ref} sheetTransition="transform 0.3s ease-in-out">
                                <div className="overflow-hidden rounded-2xl bg-white">
                                    <div className="divide-y pb-6 divide-gray-300">
                                        <p className="font-bold text-gray-900 p-6">
                                            Daftar Stasiun Bahan Bakar
                                        </p>
                                        <div className="w-full px-4 items-center">
                                            {fuelStation.map((req, index) => {
                                                return (
                                                    <p key={index} className="text-sm py-3 font-medium text-gray-900 border-b border-gray-300">{req['nama']}</p>
                                                )
                                            })}
                                        </div>
                                    </div>
                                </div>
                            </ActionSheet>*/}

                        </div>

                    </IonContent>
                </>
                : <>
                    {
                        <SkeletonDetail />
                    }
                </>}
        </IonPage>

    );

};

export default DetailLaporan;
function classNames(arg0: string, arg1: string): string | undefined {
    throw new Error('Function not implemented.');
}

