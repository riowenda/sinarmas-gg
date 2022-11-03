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

import { RefresherEventDetail } from '@ionic/core';
import { useTranslation, initReactI18next, ReactI18NextChild} from "react-i18next";
import React, {useCallback, useEffect, useRef, useState} from "react";
import ActionSheet from "actionsheet-react";
import {
    API_URI,
    BASE_API_URL,
    FUEL_REQ_UNIT_APPROVAL_URI,
    FUEL_REQ_UNIT_URI, IMAGE_FUEL_URI,
    PO_DO_APPROVEMENT_LOGISTIC_URI,
    PO_DO_DETAIL_URI,
    PO_URI,
    pref_identity,
    pref_json_pegawai_info_login,
    pref_pegawai_id,
    pref_token,
    pref_unit,
    TEMP_UNIT_APPROVAL_URI,
    TEMP_UNIT_URI,
} from "../../../../constant/Index";
import {useHistory, useLocation, useParams} from "react-router-dom";
import {getJsonPref, getPref} from "../../../../helper/preferences";
import moment from "moment";
import SVGStopCloseCheckCircle from "../../../Layout/SVGStopCloseCheckCircle";
import SkeletonDetail from '../../../Layout/SkeletonDetail';
import DetailHeader from '../../../../components/Header/DetailHeader';
import TextareaExpand from 'react-expanding-textarea';
import QRCodeWithLogo from "../../../../components/QRCodeWithLogo/QRCodeWithLogo";
import {PO} from "../../../../api/PODOFuelAPI/PO";
import {QualityListAPI} from "../../../../api/MDForFuel/QualityList";
import {Camera, CameraResultType, CameraSource} from "@capacitor/camera";
import update from "immutability-helper";
import keterangan from "../../../GACare/components/Keterangan";

const userInfo = {name: "", nik: "", imageUrl: ""}
const userUnit = {id: "", noPol: "", noLambung: "", vendor: {name: ""}, jenisUnit: {name: ""}};
const itemQuality = {id: "", value: false, file: "", data: "", nama: "", isEvidence: false}
const DetailDOFuel: React.FC = () => {
    const [getId, setGetId] = useState<string>();
    const [identity, setIdentity] = useState("");
    const history = useHistory();
    const [user, setUser] = useState(userInfo);
    const [unit, setUnit] = useState(userUnit);
    const [pegId, setPegId] = useState("");
    const [presentAlert] = useIonAlert();
    const [present, dismiss] = useIonLoading();
    const [toast] = useIonToast();
    const [sendId, setSendId] = useState("");
    const [reqFuel, setReqFuel] = useState<any>(null);
    const [showConfirm] = useIonAlert();
    const [isLoaded, setIsLoaded] = useState(false);
    const [txt, setTxt] = useState("");
    const [quality, setQuality] = useState<any>([]);
    const {t} = useTranslation();
    const location = useLocation();

    /* BEGIN LIFECYCLE APPS */

    /* Proses animasi saat Mau masuk halaman
    disini bisa load data dari API,
    jika dirasa load data akan menyebabkan performa menurun
    bisa dipindah ke diEnter */
    useIonViewWillEnter(() => {
        // let teks = "hrgabib_po_960b02e5-7cca-4f5a-98f6-18299c0c7f6c_1233487";
        // setTxt(teks);
        // console.log(teks);
    });

    /* Proses animasi selsai dan sudah sepenuhnya masuk halaman,
    jika load data dilakukan disini sebaiknya diberikan loading screen agar lebih maksimal */
    useIonViewDidEnter(() => {
        loadData()
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
        loadDetail(sendId);
        setTimeout(() => {
            console.log('Async operation has ended');
            event.detail.complete();
        }, 2000);
    }

    const loadDataPref = () => {
        getJsonPref(pref_json_pegawai_info_login).then(res => {
            setUser(res);
        });
        getJsonPref(pref_unit).then(rest => {
            setUnit(rest);
        });
        getPref(pref_pegawai_id).then(res => {
            setPegId(res);
        });
        getPref(pref_identity).then(res => {
            setIdentity(res);
        });
    }

    const loadData = () => {
        loadDataPref();
        // @ts-ignore
        const dataId = history.location.state.detail;
        // const dataId = 'b9f413da-0e65-4a58-baed-bdbcb0f0e413';
        setSendId(dataId);
        // @ts-ignore
        loadDetail(dataId);
    }

    const loadDetail = (id: any) => {
        // @ts-ignore
        const urlContents = BASE_API_URL + API_URI + PO_URI + PO_DO_DETAIL_URI + "/" + id;
        //const url = BASE_API_URL + API_URI + P2H_ITEM_URI;
        // console.log("URL: " + urlContents);

        fetch(urlContents, {
            method: 'GET'
        })
            .then(res => res.json())
            .then(
                (result) => {
                    if (result.status === "SUCCESS") {
                        setReqFuel(result.data);
                        const now = new Date();
                        // @ts-ignore
                        const time = now.setTime(now.getTime() + (5 * 60000));
                        let teks = "hrgabib_do_" + result.data.id + "_" + time;
                        setTxt(teks);
                        console.log(teks);
                        getPref(pref_token).then(res => {
                            loadDataMDQuality(res, result.data);
                        });
                    }
                    setIsLoaded(true);
                },
                (error) => {
                    //setIsLoaded(true);
                    //setError(error);
                }
            );
    }

    const loadDataMDQuality = (token: string, doss: any) => {
        let data = QualityListAPI(token).then(result => {
            let item = result;
            let evidence: { id: string; value: string; file: string; data: string; nama: string; isEvidence: boolean; }[] = [];
            // @ts-ignore
            let dt = item.filter((x: { [x: string]: { [x: string]: null; }; }) => (x['isActive'] == true));
            if(doss['status'] === 'PROPOSED') {
                dt.map((obj: any) => {
                    let d = {id: obj.id, value: false, file: "", data: "", nama: obj.nama, isEvidence: obj.isEvidence,};
                    // @ts-ignore
                    evidence.push(d);
                });
            } else {
                let ds = doss.data;
                ds.map((obj: any) => {
                    dt.map((q: any) => {
                        if(q.id === obj.id) {
                            let i = {id: obj.id, data: q.nama, file: obj.file, value: obj.value}
                            // @ts-ignore
                            evidence.push(i);
                        }
                    });
                })
            }
            // console.log(dt);
            setQuality(evidence);
        })
    }

    const sendRequestApprovement = (status: any) => {
        const loading = present({
            message: 'Memproses ' + status === 'REJECTED' ? 'penolakan' : 'persetujuan' + ' ...',
        })
        const url = BASE_API_URL + API_URI + PO_URI + PO_DO_APPROVEMENT_LOGISTIC_URI+"/"+sendId;
        const datas = { id: sendId, tanggal:new Date(), jumlah: reqFuel.jumlah, keterangan: reqFuel.keterangan, pemeriksa: {id: pegId}, status: status, data: quality} //user diambil dari pref
        fetch(url, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', 'Identity': identity ? identity : '' },
            body: JSON.stringify(datas)
        })
            .then(res => res.json())
            .then(
                (result) => {
                    if (result.status === 'SUCCESS') {
                        showAlertConfirmed(status);
                    } else {
                        dismiss();
                        let keterangan = 'Tidak dapat memproses ' + status === 'REJECTED' ? 'penolakan!' : 'persetujuan!';
                        showConfirm({
                            //simpan unit id ke pref
                            subHeader: keterangan,
                            buttons: [
                                {
                                    text: 'OK',
                                    cssClass: 'alert-button-confirm',
                                },
                            ],
                        })
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

    const showAlertConfirmed = (status: any) => {
        dismiss();
        showConfirm({
            //simpan unit id ke pref
            subHeader: '' + ("Berhasil memproses " + (status === "REJECTED" ? "Penolakan." : "Persetujuan.")) + '',
            buttons: [
                {
                    text: 'OK',
                    cssClass: 'alert-button-confirm',
                    handler: () => {
                        setIsLoaded(false);
                        loadDetail(sendId);
                        // history.goBack();
                        // history.push('/fuel/temp-unit/ga-daftar-permintaan');
                    }
                },
            ],
        })
    }

    const takePhoto = async (index: any) => {
        await Camera.getPhoto({
            resultType: CameraResultType.Base64,
            source: CameraSource.Camera,
            quality: 30
        })
            .then((res) => {
                console.log(res);
                let imgs = res.base64String;
                let imgName = (new Date().getTime().toString()) + "." + res.format;
                //copy data quality
                let newQuality = [...quality];
                let datas = newQuality[index]; // copy data array yang terpilih
                newQuality[index] = {...datas, data:imgs, file:imgName}; // update data dari item array
                setQuality(newQuality);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const handleOnCheck = (index:any, val:any) => {
        //copy data quality
        let newQuality = [...quality];
        let datas = newQuality[index]; // copy data array yang terpilih
        newQuality[index] = {...datas, value:val}; // update data dari item array
        setQuality(newQuality);
    }

    const handleOnClick = (status: any) => {
        // let data = JSON.stringify(quality);
        // console.log(data);
        let alasan = reqFuel.keterangan;
        let keterangan = "";
        let allowToPush = false;
        // console.log(alasan);
        if (status === "REJECTED") {
            if (alasan !== null && alasan !== "" && alasan.length >= 20) {
                keterangan = "Anda yakin untuk menolak DO ini?";
                allowToPush = true;
            } else {
                toast({
                    message: "Alasan wajib diisi!",
                    duration: 1500,
                    position: "top"
                });
            }
        } else {
            if(reqFuel.jumlah != null && reqFuel.jumlah > 0) {
                keterangan = "Anda yakin untuk menyetujui DO ini?";
                allowToPush = true;
            } else {
                toast({
                    message: "Jumlah dikirim wajib diisi!",
                    duration: 1500,
                    position: "top"
                });
            }
        }
        if (allowToPush) {
            presentAlert({
                subHeader: keterangan,
                buttons: [
                    {
                        text: 'Batal',
                        cssClass: 'alert-button-cancel',
                    },
                    {
                        text: 'Ya',
                        cssClass: 'alert-button-confirm',
                        handler: () => {
                            sendRequestApprovement(status);
                        }
                    },
                ],
            })
        }
    }
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
                        <div className="bg-gray-100 flex flex-col min-h-screen justify-between">

                            {/* === Start Content  === */}
                            <div>
                                <DetailHeader title='Delivery Order' link={""}
                                              approval={reqFuel['status']}></DetailHeader>

                                <div className="p-6 bg-white">

                                    <div className="mt-4">
                                        <label className="block text-sm text-gray-400">
                                            No. PO
                                        </label>
                                        <div>
                                            <strong>{reqFuel['po']['nomor']}</strong>
                                        </div>
                                    </div>
                                    <div className="mt-4">
                                        <label className="block text-sm text-gray-400">
                                            No. DO
                                        </label>
                                        <div>
                                            {reqFuel['nomor']}
                                        </div>
                                    </div>
                                    <div className="mt-4">
                                        <label className="block text-sm text-gray-400">
                                            Stasiun Pengisian
                                        </label>
                                        <div>
                                            {reqFuel['fuelStasiun']['nama']}
                                        </div>
                                    </div>
                                    <div className="mt-4">
                                        <label className="block text-sm text-gray-400">
                                            Jumlah Pengiriman
                                        </label>
                                        <div>
                                            {reqFuel['jumlahRencana']}
                                        </div>
                                    </div>
                                    <div className="mt-4">
                                        <label className="block text-sm text-gray-400">
                                            Vendor
                                        </label>
                                        <div>
                                            {reqFuel['po']['vendor']['name']}
                                        </div>
                                    </div>
                                    <div className="mt-4">
                                        <label className="block text-sm text-gray-400">
                                            Tanggal Permintaan
                                        </label>
                                        <div>
                                            {moment(reqFuel['po']['tanggal']).format('DD MMM yyyy').toString()}
                                        </div>
                                    </div>
                                    <div className="mt-4">
                                        <label className="block text-sm text-gray-400">
                                            Tanggal Target Pengisian
                                        </label>
                                        <div>
                                            {moment(reqFuel['tanggalRencana']).format('DD MMM yyyy').toString()}
                                        </div>
                                    </div>
                                    {/* looping data MD kualitas */}
                                    {reqFuel['status'] === "PROPOSED" ?
                                        <>
                                            {quality.map((item: { [x: string]: string | number | boolean}, index: React.Key | null | undefined) => {
                                        return (
                                            <div className="mt-4" key={index} >
                                                <div className='flex text-center'>
                                                    <input type="checkbox" className="h-4 w-4 rounded" onChange={(event) => handleOnCheck(index, event.target.checked)}/>
                                                    <label className="ml-2 text-gray-500">{item['nama']}</label>
                                                </div>
                                                {item['isEvidence'] == true &&
                                                    <div className="ml-6 mt-2">
                                                        {item['data'] != null && item['data'] !== "" ?
                                                            <><div className="group block rounded-lg aspect-auto bg-gray-100 overflow-hidden">
                                                                <img className="object-cover pointer-events-none" src={`data:image/jpeg;base64,${item['data']}`} ></img>
                                                            </div></>
                                                            :
                                                            <div className="rounded-md border-2 border-dashed border-gray-300 py-10">
                                                                <><div className="flex justify-center">
                                                                    <button onClick={() => {
                                                                        takePhoto(index);
                                                                    }}
                                                                            className="items-center rounded-full bg-slate-800 px-3 py-3 text-white">
                                                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                                                                            <path fill-rule="evenodd" d="M1 8a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 018.07 3h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0016.07 6H17a2 2 0 012 2v7a2 2 0 01-2 2H3a2 2 0 01-2-2V8zm13.5 3a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM10 14a3 3 0 100-6 3 3 0 000 6z" clip-rule="evenodd" />
                                                                        </svg>
                                                                    </button>
                                                                </div><p className="mt-1 text-xs text-center text-gray-500">Ambil Foto Evidence untuk {item['nama']}</p></>
                                                            </div>
                                                        }
                                                    </div>
                                                }
                                            </div>
                                        )
                                    })}
                                    </>
                                    :
                                    <>
                                        {quality.map((item: { [x: string]: string | number | boolean}, index: React.Key | null | undefined) => {
                                            return (
                                                <div className="mt-4" key={index} >
                                                    <div className='flex text-center'>
                                                        <input type="checkbox" className="h-4 w-4 rounded" readOnly checked={item["value"] == true ? true : false}/>
                                                        <label className="ml-2 text-gray-500">{item['data']}</label>
                                                    </div>
                                                    <div className="ml-6 mt-2">
                                                        {(item['file'] != null && item['file'] !== "") &&
                                                            <><div className="group block rounded-lg aspect-auto bg-gray-100 overflow-hidden">
                                                                <img className="object-cover pointer-events-none" src={`${BASE_API_URL}${API_URI}${IMAGE_FUEL_URI}${item['file']}`} ></img>
                                                            </div></>
                                                        }
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </>
                                }
                                {/* end Looping */}
                                <div className="mt-4">
                                    <label className="block text-sm text-gray-400">
                                        {reqFuel['status'] === 'PROPOSED' ? "Jumlah Dikirim (liter)" : "Jumlah Aktual" }
                                    </label>
                                    {reqFuel != null && (reqFuel["status"] !== "PROPOSED") ?
                                        <div>{reqFuel['jumlah'] != null ? (reqFuel['jumlah']+ " liter") : 'N/A'}</div>
                                        :
                                        <div className="border-b border-gray-300 py-2">
                                            <input
                                                // defaultValue={filled.liter != null ? filled.liter : ""}
                                                // onChange={(event) => setFilled({ ...filled, liter: event.target.value })}
                                                onChange={(event) => setReqFuel({ ...reqFuel, jumlah: event.target.value })}
                                                type="number"
                                                name="liter"
                                                id="liter"
                                                className="block w-full"
                                            />
                                        </div>
                                    }
                                </div>
                                <div className="mt-4">
                                    <label className="block text-sm text-gray-400">
                                        Tanggal Aktual
                                    </label>
                                    {reqFuel != null && (reqFuel["status"] !== "PROPOSED") ?
                                        <div>
                                            {moment(reqFuel['tanggal']).format('DD MMM yyyy').toString()}
                                        </div>
                                        :
                                        <div className="border-b border-gray-300 py-2">
                                            <input
                                                value={moment(new Date()).format('DD MMM yyyy').toString()}
                                                // defaultValue={filled.liter != null ? filled.liter : ""}
                                                // onChange={(event) => setFilled({ ...filled, liter: event.target.value })}
                                                readOnly
                                                type="text"
                                                name="liter"
                                                id="liter"
                                                // readOnly={reqFuel != null && (reqFuel["status"] === "FILLED") ? true : false}
                                                className="block w-full"
                                            />
                                        </div>
                                    }
                                </div>
                                <div className="mt-4">
                                    <label htmlFor='odometer' className="block text-sm text-gray-400">
                                        Alasan setuju/tolak
                                    </label>

                                    {reqFuel != null && (reqFuel["status"] !== "PROPOSED") ?
                                        <div>
                                            {reqFuel['keterangan'] != null ?
                                                <>
                                                {reqFuel['pemeriksa']['name']} :<br/>
                                                {reqFuel['keterangan']}
                                                </>
                                                :
                                                <>
                                                    -
                                                </>
                                            }
                                        </div>
                                        :
                                        <TextareaExpand
                                            // onChange={}
                                            onChange={(event) => setReqFuel({
                                                ...reqFuel,
                                                keterangan: event.target.value
                                            })}
                                            className="block w-full border-b border-gray-300 py-2"
                                            id="keterangan"
                                            name="keterangan"
                                        />
                                    }
                                </div>

                                {/*<div className="mt-4">*/}
                                {/*    <label className="block text-sm text-gray-400">*/}
                                {/*        Jumlah Aktual*/}
                                {/*    </label>*/}
                                {/*    <div>*/}
                                {/*        300 liter*/}
                                {/*    </div>*/}
                                {/*</div>*/}
                                {/*<div className="mt-4">*/}
                                {/*    <label className="block text-sm text-gray-400">*/}
                                {/*        Jumlah Aktual*/}
                                {/*    </label>*/}
                                {/*    <div>*/}
                                {/*        3 jan 2022*/}
                                {/*    </div>*/}
                                {/*</div>*/}

                                    {reqFuel['status'] === 'APPROVED' &&
                                        <>
                                        <div className="mt-4">
                                            <div className="aspect-auto bg-white-100 w-full flex item-center">
                                                {/*<img height={180} width={180} className="mx-auto object-cover object-center rounded-lg pointer-events-none" src={`data:image/png;base64,${photo}`} ></img>*/}
                                                <div className="mx-auto">
                                                    <QRCodeWithLogo text={txt}/>
                                                </div>
                                            </div>

                                        </div>
                                        <div className="mt-4">
                                        <p className='text-sm text-center'>Untuk discan oleh Fuelman sebagai persetujuan penerimaan.</p>
                                        </div>
                                        </>
                                    }
                            </div>


                        </div>
                        {/* === End Content === */}

                        {/* === Footer button ===*/}
                        {reqFuel['status'] === 'PROPOSED' &&
                            <div className='py-6 grid grid-cols-2 bg-white'>
                                <div className="pl-6 pr-3">
                                    <button onClick={() => { handleOnClick("REJECTED")}}
                                        className="items-center w-full mx-auto rounded-md bg-gray-200 px-3 py-2 text-sm font-bold text-gray-900">
                                        TOLAK
                                    </button>
                                </div>
                                <div className="pl-3 pr-6">
                                    <button onClick={() => { handleOnClick("APPROVED")}}
                                        className="items-center w-full mx-auto rounded-md bg-green-600 px-3 py-2 text-sm font-bold text-white">
                                        DISETUJUI
                                    </button>
                                </div>
                            </div>
                        }
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

export default DetailDOFuel;
function classNames(arg0: string, arg1: string): string | undefined {
    throw new Error('Function not implemented.');
}

