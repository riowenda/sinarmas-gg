import {
    IonBackButton,
    IonContent,
    IonPage,
    IonRefresher,
    IonRefresherContent, useIonAlert, useIonLoading,
    useIonToast, useIonViewDidEnter, useIonViewWillEnter,
} from '@ionic/react';

import './Profile.css';
import {RefresherEventDetail} from '@ionic/core';
import {useTranslation} from "react-i18next";
import React, {useRef, useState} from "react";
import {
    API_URI, AUTH_FUEL_MANAGER, AUTH_FUEL_STATION, MD_PEGAWAI_UPDATE_PROFILE, MD_PEGAWAI_URI, pref_identity,
    pref_json_pegawai_info_login,
    pref_lng,
    pref_pegawai_id,
    pref_pegawai_unit_id,
    pref_token,
    pref_token_fbnotif,
} from "../../constant/Index";
import {useHistory} from "react-router-dom";
import {
    getFuelMenu,
    getJsonPref,
    getPref, simpanDataPegawai
} from "../../helper/Preferences";
import ActionSheet from 'actionsheet-react';
import axios from "axios";
import {getPermPref} from "../../helper/PermanentPreferences";
import {BaseAPI} from "../../api/ApiManager";
import {Camera, CameraResultType, CameraSource} from "@capacitor/camera";

const user = {name: "", email: "", nik: "", imageUrl: "", nomorTelepon: "", isafeNo: ""};

const EditProfile: React.FC = () => {
    const history = useHistory();
    const [pegawai, setPegawai] = useState(user);
    const [presentAlert] = useIonAlert();
    const {t} = useTranslation();
    const [lng, setLng] = useState("id");
    const [present, dismiss] = useIonLoading();
    const [pegawai_id, setPegId] = useState();
    const [fuelman, setIsFuelman] = useState(false);
    const [photo, setPhoto] = useState(null);
    const [token, setToken] = useState("");
    const [identity, setIdentity] = useState("");
    const [fileType, setFileType] = useState();
    const [toast] = useIonToast();

    const ref = useRef();

    function doRefresh(event: CustomEvent<RefresherEventDetail>) {
        setTimeout(() => {
            console.log('Async operation has ended');
            event.detail.complete();
        }, 2000);
    }

    const loadDataPref = () => {
        getJsonPref(pref_json_pegawai_info_login).then((res) => {
            setPegawai(res);
            // console.log(res);
        });
        getPref(pref_token).then(tkn => {
            setToken(tkn);
        });
        getPref(pref_identity).then(i => {
            setIdentity(i);
        });
        getPref(pref_lng).then(l => {
            setLng(l);
        });
        //console.log("role: ", role);
    };

    const handleOpen = () => {
        /* Todo: disable dulu*/
        // @ts-ignore
        // ref.current.open();
    };

    useIonViewWillEnter(() => {
        loadDataPref();
    });

    useIonViewDidEnter(() => {
        getPref(pref_pegawai_id).then(p => {
            setPegId(p);
        });
    });

    const simpanProfil = () => {
        // @ts-ignore
        document.getElementById("btnKirim").click();
    }
    const simpan = (e: any) => {
        e.preventDefault();
        let teks = "Anda yakin untuk menyimpan data ini?";
        presentAlert({
            subHeader: teks,
            backdropDismiss: false,
            buttons: [
                {
                    text: t('btn.batal'),
                    cssClass: 'alert-button-cancel',
                },
                {
                    text: t('btn.ya'),
                    cssClass: 'alert-button-confirm',
                    handler: () => {
                        sendData();
                    }
                },
            ],
        })
    }

    const sendData = () => {
        const loading = present({
            message: 'Memproses permintaan ...',
            backdropDismiss: false
        })

        //*private UUID pegawai_id;
        //     private String firebase_token;
        //     private String jwt_token;*/
        let msg = "";
        const data = {
            "id":pegawai_id,
            "name": pegawai['name'],
            "nik": pegawai['nik'],
            "file_name": photo != null ? photo['file_name'] : "",
            "file_base64": photo != null ? photo['file_base64'] : "",
            "nomorTelepon": pegawai['nomorTelepon'],
            "isafeNo": pegawai['isafeNo'],
            "email": pegawai['email']
        }

        let config = {
            headers: { 'Content-Type': 'application/json', 'Authorization' : `Bearer ${token}`, 'Identity': identity }
        }
        const uri = `${MD_PEGAWAI_UPDATE_PROFILE}`;
        const api = axios.create({
            baseURL: `${BaseAPI()}` + `${API_URI}` + `${MD_PEGAWAI_URI}`
        })
        api.put(uri, data, config)
            .then(res => {
                console.log(res);
                try{
                    let datas = res.data;
                    let status = datas.status;
                    if(status === "SUCCESS"){
                        let data = datas.data;
                        simpanDataPegawai(data, data);
                        msg = "Pembaruan data profil sukses!";
                    } else {
                        msg = "Gagal menyimpan data profil!";
                    }
                } catch (e){
                    msg = "Gagal menyimpan data profil!";
                }
                toast( {
                        message: msg, duration: 1500, position: "top"
                    }
                );
                dismiss();
            })
            .catch(error => {
                msg = "Terjadi kesalahan saat menyimpan data profil!";
                toast( {
                        message: msg, duration: 1500, position: "top"
                    }
                );
                dismiss();
            })
    }

    const handlePhoto = () => {
        // @ts-ignore
        ref.current.open();
    };

    const onClickGalery = (e: any) => {
        pickPicture();
        // @ts-ignore
        ref.current.close();
    }

    const onClickCamera = (e: any) => {
        takePicture();
        // @ts-ignore
        ref.current.close();
    }

    const takePicture = async () => {
        await Camera.getPhoto({
            resultType: CameraResultType.Base64,
            source: CameraSource.Camera,
            quality: 30
        })
            .then((res) => {
                console.log(res);
                let imgs = res.base64String;
                let imgName = (new Date().getTime().toString()) + "." + res.format;
                // @ts-ignore
                setPhoto({file_name: imgName, file_base64: imgs});
            })
            .catch((err) => {
                console.log(err);
            });
// Can be set to the src of an image now

    }

    const pickPicture = async () => {
        await Camera.getPhoto({
            resultType: CameraResultType.Base64,
            source: CameraSource.Photos,
            quality: 30
        })
            .then((res) => {
                console.log(res);
                let imgs = res.base64String;
                let imgName = (new Date().getTime().toString()) + "." + res.format;
                // @ts-ignore
                setPhoto({file_name: imgName, file_base64: imgs});
            })
            .catch((err) => {
                console.log(err);
            });
// Can be set to the src of an image now

    }

    return (
        <IonPage>
            <div className="top-0 z-10 py-3 px-1 bg-white">
                <div className="flex">
                    <div slot="start" className="pb-1 w-6 h-6 text-gray-700">
                        <IonBackButton defaultHref="/"/>
                    </div>
                    <div className='py-2 flex justify-between w-full items-center text-gray-700'>
                        <div className="ml-4 px-2">
                            <h3 className="text-base font-bold text-gray-700">{t('header.ubah_profil')}</h3>
                        </div>
                    </div>
                    <div onClick={simpanProfil} className="p-2 float-right">
                        <div className='px-3 py-1 bg-red-700 rounded-lg'>
                            <span className='text-white text-sm'>{t('btn.simpan')}</span>
                        </div>
                    </div>
                </div>
            </div>
            <IonContent>
                <IonRefresher slot="fixed" onIonRefresh={doRefresh}>
                    <IonRefresherContent></IonRefresherContent>
                </IonRefresher>
                {/* Header */}

                {/* end Header */}
                <div className="w-full flex flex-col justify-between">
                    {/* <div className='p-4'> */}
                    <div>
                        {pegawai != null &&

                            <div className="px-6 pt-6 flex flex-1 flex-col">
                                <div className='text-center'>
                                    <div onClick={handlePhoto} className='text-center m-0 m-auto w-fit'>
                                    {photo != null ?
                                        <>
                                            <img className="mx-auto h-24 w-24 rounded-full bg-gray-300"
                                                 src={`data:image/jpeg;base64,${photo['file_base64']}`}></img>
                                        </>
                                        :
                                        <>
                                            {pegawai["imageUrl"] != null && pegawai["imageUrl"] !== "" ?
                                                <img
                                                    className="mx-auto h-24 w-24 rounded-full bg-gray-300"
                                                    src={pegawai["imageUrl"]}
                                                    alt=""
                                                /> :
                                                <img
                                                    className="mx-auto h-20 w-20 rounded-full bg-gray-300"
                                                    src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pg0KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDE5LjAuMCwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPg0KPHN2ZyB2ZXJzaW9uPSIxLjEiIGlkPSJMYXllcl8xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4PSIwcHgiIHk9IjBweCINCgkgdmlld0JveD0iMCAwIDUwOCA1MDgiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDUwOCA1MDg7IiB4bWw6c3BhY2U9InByZXNlcnZlIj4NCjxjaXJjbGUgc3R5bGU9ImZpbGw6IzkwREZBQTsiIGN4PSIyNTQiIGN5PSIyNTQiIHI9IjI1NCIvPg0KPGc+DQoJPHBhdGggc3R5bGU9ImZpbGw6I0U2RTlFRTsiIGQ9Ik0yNTUuMiwzNjMuMmMtMC40LDAtMC44LDAuNC0xLjYsMC40Yy0wLjQsMC0wLjgtMC40LTEuNi0wLjRIMjU1LjJ6Ii8+DQoJPHBhdGggc3R5bGU9ImZpbGw6I0U2RTlFRTsiIGQ9Ik00NTguNCw0MDRjLTQ2LDYyLjgtMTIwLjgsMTA0LTIwNC44LDEwNFM5NS4yLDQ2Ny4yLDQ4LjgsNDA0YzM2LTM4LjQsODQuOC01OC44LDEyNS42LTY5LjINCgkJYy0zLjYsMjkuMiwxMS42LDY4LjQsMTIsNjcuMmMxNS4yLTM1LjIsNjYuOC0zOC40LDY2LjgtMzguNHM1MS42LDIuOCw2Ny4yLDM4LjRjMC40LDAuOCwxNS42LTM4LDEyLTY3LjINCgkJQzM3My42LDM0NS4yLDQyMi40LDM2NS42LDQ1OC40LDQwNHoiLz4NCjwvZz4NCjxwYXRoIHN0eWxlPSJmaWxsOiNGRkQwNUI7IiBkPSJNMzE2LjgsMzA4TDMxNi44LDMwOGMwLDUuMi0zLjIsMzIuOC02MS42LDU1LjJIMjUyYy01OC40LTIyLjQtNjEuNi01MC02MS42LTU1LjJsMCwwDQoJYzAuNC0xMC40LDIuOC0yMC44LDcuMi0zMC40YzE2LDE4LDM1LjIsMzAsNTYsMzBjMjAuNCwwLDQwLTExLjYsNTYtMzBDMzE0LDI4Ny4yLDMxNi44LDI5Ny42LDMxNi44LDMwOHoiLz4NCjxwYXRoIHN0eWxlPSJmaWxsOiNGMTU0M0Y7IiBkPSJNMjg4LjQsMzcyLjRMMjc1LjYsMzk4aC00NGwtMTIuOC0yNS42YzE3LjYtNy42LDM0LjgtOC44LDM0LjgtOC44UzI3MS4yLDM2NC44LDI4OC40LDM3Mi40eiIvPg0KPHBhdGggc3R5bGU9ImZpbGw6I0ZGNzA1ODsiIGQ9Ik0yMTgsNTA1LjZjMTEuNiwxLjYsMjMuNiwyLjQsMzYsMi40YzEyLDAsMjQtMC44LDM2LTIuNGwtMTQtMTA3LjJoLTQ0TDIxOCw1MDUuNnoiLz4NCjxnPg0KCTxwYXRoIHN0eWxlPSJmaWxsOiNGRkZGRkY7IiBkPSJNMzE2LjgsMzA3LjJjMCwwLDIuOCwzMi02My4yLDU2LjRjMCwwLDUxLjYsMi44LDY3LjIsMzguNEMzMjEuMiw0MDMuNiwzNTEuMiwzMjYsMzE2LjgsMzA3LjJ6Ii8+DQoJPHBhdGggc3R5bGU9ImZpbGw6I0ZGRkZGRjsiIGQ9Ik0xOTAuNCwzMDcuMmMtMzQsMTguOC00LjQsOTYtMy42LDk0LjhjMTUuMi0zNS4yLDY3LjItMzguNCw2Ny4yLTM4LjQNCgkJQzE4Ny42LDMzOS4yLDE5MC40LDMwNy4yLDE5MC40LDMwNy4yeiIvPg0KPC9nPg0KPHBhdGggc3R5bGU9ImZpbGw6I0Y5QjU0QzsiIGQ9Ik0zMTIuOCwyODUuNmMtMTYuOCwxOC0zNi44LDI5LjYtNTkuMiwyOS42cy00Mi40LTExLjYtNTkuMi0yOS42YzAuOC0yLjgsMi01LjYsMy4yLTgNCgljMTYsMTgsMzUuMiwzMCw1NiwzMHM0MC0xMS42LDU2LTMwQzMxMC44LDI4MCwzMTIsMjgyLjgsMzEyLjgsMjg1LjZ6Ii8+DQo8cGF0aCBzdHlsZT0iZmlsbDojRkZEMDVCOyIgZD0iTTM2Mi44LDIyNC40Yy04LjQsMTQtMjEuMiwyMi40LTMwLjgsMjAuOGMtMTkuMiwzNS42LTQ3LjIsNjItNzguNCw2MnMtNTkuMi0yNi44LTc4LjQtNjINCgljLTkuNiwxLjItMjIuNC02LjgtMzAuOC0yMC44Yy0xMC0xNi40LTEwLjQtMzQuNC0wLjgtNDAuNGMyLjQtMS4yLDQuOC0yLDcuNi0xLjZjNi40LDE2LjQsMTUuMiwyNi40LDE1LjIsMjYuNA0KCWMtOS4yLTUwLjgsMjguNC01Ni40LDIyLTEwNS4yYzAsMCwyMy42LDUyLjQsOTEuMiwxNS42bC01LjIsMTBjOTQuNC0yMS4yLDYyLjgsOTAsNjIsOTIuOGMxMC44LTEzLjYsMTcuNi0yNy4yLDIxLjYtMzkuNg0KCWMxLjYsMCwzLjYsMC44LDQuOCwxLjZDMzczLjIsMTg5LjYsMzcyLjgsMjA4LDM2Mi44LDIyNC40eiIvPg0KPHBhdGggc3R5bGU9ImZpbGw6IzMyNEE1RTsiIGQ9Ik0zMDgsNTAuOGM3LjYtMC44LDIwLDYsMjAsNmMtMzQtMzguOC04OS42LTE0LTg5LjYtMTRjMTguOC0xNiwzNS42LTE0LjQsMzUuNi0xNC40DQoJYy03OS42LTEyLTkzLjIsMzUuNi05My4yLDM1LjZjLTMuNi01LjYtMy42LTEzLjYtMy4yLTE3LjZDMTcyLDU2LDE3OCw3NS4yLDE3OCw3NS4yYy01LjYtMTQtMjUuMi0xMS42LTI1LjItMTEuNg0KCWMxNi44LDIuOCwxOS42LDEzLjIsMTkuNiwxMy4yYy00MiwxNS42LTM0LjgsNTkuMi0zNC44LDU5LjJsMTAtMTJjLTEyLjQsNDcuNiwxOS4yLDg0LjQsMTkuMiw4NC40Yy05LjItNTAuOCwyOC40LTU2LjQsMjItMTA1LjINCgljMCwwLDIzLjYsNTIuNCw5MS4yLDE1LjZsLTUuMiwxMGM5NS42LTIxLjYsNjIsOTMuMiw2Miw5My4yYzM0LTQzLjIsMjguOC04Ny42LDI4LjgtODcuNmw0LDE2QzM4MC40LDc4LjQsMzA4LDUwLjgsMzA4LDUwLjh6Ii8+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8L3N2Zz4NCg=="
                                                />
                                            }
                                        </>
                                    }
                                    <h3 className="mt-2 text-sm text-gray-400">Edit</h3>
                                    </div>
                                </div>
                            </div>

                        }
                        <form onSubmit={simpan} id="formProfil">
                            <div className='px-6'>
                                <div className="mt-4">
                                    <label htmlFor='odometer' className="block text-sm text-gray-400">
                                        Nama
                                    </label>
                                    <div className="border-b border-gray-300 py-2">
                                        <input
                                            readOnly
                                            defaultValue={pegawai["name"]}
                                            required
                                            onChange={(event) => setPegawai({...pegawai, name: event.target.value})}
                                            type="text"
                                            name="name"
                                            id="name"
                                            className="block w-full"
                                        />
                                    </div>
                                </div>
                                <div className="mt-4">
                                    <label htmlFor='odometer' className="block text-sm text-gray-400">
                                        NIK
                                    </label>
                                    <div className="border-b border-gray-300 py-2">
                                        <input
                                            readOnly
                                            defaultValue={pegawai["nik"]}
                                            onChange={(event) => setPegawai({...pegawai, nik: event.target.value})}
                                            required
                                            type="text"
                                            name="nik"
                                            id="nik"
                                            className="block w-full"
                                        />
                                    </div>
                                </div>
                                <div className="mt-4">
                                    <label htmlFor='odometer' className="block text-sm text-gray-400">
                                        No. HP
                                    </label>
                                    <div className="border-b border-gray-300 py-2">
                                        <input
                                            defaultValue={pegawai["nomorTelepon"]}
                                            onChange={(event) => setPegawai({...pegawai, nomorTelepon: event.target.value})}
                                            type="text"
                                            name="nomorTelepon"
                                            id="nomorTelepon"
                                            className="block w-full"
                                        />
                                    </div>
                                </div>
                                <div className="mt-4">
                                    <label htmlFor='odometer' className="block text-sm text-gray-400">
                                        ID iSafe
                                    </label>
                                    <div className="border-b border-gray-300 py-2">
                                        <input
                                            defaultValue={pegawai["isafeNo"]}
                                            onChange={(event) => setPegawai({...pegawai, isafeNo: event.target.value})}
                                            type="text"
                                            name="isafeNo"
                                            id="isafeNo"
                                            className="block w-full"
                                        />
                                    </div>
                                </div>
                                <div className="mt-4">
                                    <label htmlFor='odometer' className="block text-sm text-gray-400">
                                        Email
                                    </label>
                                    <div className="border-b border-gray-300 py-2">
                                        <input
                                            defaultValue={pegawai["email"]}
                                            onChange={(event) => setPegawai({...pegawai, email: event.target.value})}
                                            type="email"
                                            name="email"
                                            id="email"
                                            className="block w-full"
                                        />
                                    </div>
                                </div>

                            </div>
                            <div hidden className='p-6 items-end bg-white'>
                                <button id="btnKirim" className="w-full items-center mx-auto rounded-md bg-emerald-500 px-3 py-2 text-sm font-bold text-white">
                                    KIRIM
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* </div> */}
                </div>


            </IonContent>
            <ActionSheet ref={ref} sheetTransition="transform 0.3s ease-in-out">
                <div className="overflow-hidden rounded-2xl bg-white">
                    {/*<button className="modal-handle" aria-label="Activate to adjust the size of the dialog overlaying the screen"></button>*/}
                    <div className="divide-y pb-6 divide-gray-300">
                        <p className="font-bold text-gray-900 p-6">
                            Ganti foto profil
                        </p>
                        <div>
                            <div className='px-4 divide-y'>
                                <div onClick={event => {
                                    onClickGalery('id')
                                }} className="w-full py-4 px-2 inline-flex">
                                    <div className='flex justify-between w-full'>
                                        <div>
                                            <span className="text-sm text-gray-700 font-medium ml-4" id="lang-id">Pilih dari galeri</span>
                                        </div>
                                    </div>
                                </div>
                                <div onClick={event => {
                                    onClickCamera('id')
                                }} className="w-full py-4 px-2 inline-flex">
                                    <div className='flex justify-between w-full'>
                                        <div>
                                            <span className="text-sm text-gray-700 font-medium ml-4"
                                                  id="lang-id">Kamera</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </ActionSheet>
        </IonPage>
    );
};

export default EditProfile;

function classNames(arg0: string, arg1: string): string | undefined {
    throw new Error('Function not implemented.');
}

