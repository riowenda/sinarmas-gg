import React, {useState, useEffect, ChangeEvent, FormEvent} from "react";
import { useHistory } from "react-router";
import {
    IonButton,
    IonCheckbox,
    IonCol,
    IonContent,
    IonGrid,
    IonIcon,
    IonImg,
    IonInput,
    IonItem,
    IonPage,
    IonRadio,
    IonRadioGroup,
    IonRefresher,
    IonRefresherContent,
    IonRow,
    IonSelect,
    IonSelectOption,
    IonTextarea,
    useIonViewDidEnter,
  } from "@ionic/react";
import {IonReactRouter} from "@ionic/react-router";
import { Camera, CameraResultType, CameraSource } from "@capacitor/camera";
import { RefresherEventDetail } from '@ionic/core';
import {useTranslation, initReactI18next} from "react-i18next";
import { camera, receiptOutline, restaurantOutline } from "ionicons/icons";
import './MenuVvip.css';
const MenuVvipForm: React.FC = () => {
    //form
    const [jenisTamu, setJenisTamu] = useState<string>();
    const [tamuVvip, setTamuVvip] = useState<any>([]);
    const [requestTamu, setRequestTamu] = useState<string>();
    const [requestMenu, setRequestMenu] = useState<string>();
    const [jadwal, setJadwal] = useState<any>([]);
    
    const handleJenisTamu = (e: any) => {
        if(e==="organik"){
            setJenisTamu('organik')
        }
        else{
            setJenisTamu('external')
        }
    }
    const handleRequestTamu = (e: any) => {
        console.log(e);
    }
    const handleJadwal = (e: any, value:any) => {
        if(e.target.checked){
            setJadwal((current: any)=>[...current, value])
        }else{
            setJadwal(jadwal.filter((item: any)=> item !== value))
        }
    }
    const [file, setFile] = useState<any>();
    const [dataUri, setDataUri] = useState<any>('')
    const handleFile = async () => {
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
                setFile(res);
                fileToDataUri(file)
                .then(dataUri => {
                    setDataUri(dataUri)
                })
            })
            .catch((err) => {
                console.log(err);
            });
    };
    const fileToDataUri = (file: Blob) => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (event:any) => {
          resolve(event.target.result)
        };
        reader.readAsDataURL(file);
    })
    const handleBefore = () => {
        console.log(jadwal);
    }


    const history = useHistory();
    const btnBack = () => {
    history.push("/meal/menuvvip");
    }
    return (
        <IonPage>
        <IonContent fullscreen>
          <IonRefresher slot="fixed" >
            <IonRefresherContent></IonRefresherContent>
          </IonRefresher>
            <div className="bg-red-700">
                <div className="px-4 py-6">
                    <div className="flex">
                        <svg onClick={btnBack} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-6 h-6 text-white">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12h-15m0 0l6.75 6.75M4.5 12l6.75-6.75" />
                        </svg>
                        <div className="ml-4">
                            <h3 className="text-base font-bold text-white">Pengajuan Menu VVIP</h3>
                        </div>
                    </div>
                </div>

                <div className="rounded-2xl bg-white drop-shadow-md mx-5 mb-5 mt-0">
                    <div className="flex w-full items-center justify-between space-x-6 py-4 px-6">
                    <div className="flex-1 truncate">
                        <div className="flex items-center">
                        <p className="truncate text-sm font-medium text-gray-900">
                            {/* {pegawai["name"]} <br />
                            {pegawai["nik"]} */}
                            Irvan Nofiansyah <br/>
                            123456789
                        </p>
                        {/*
                        <p className="truncate text-sm font-medium text-gray-900">
                        </p>
                        */}
                        </div>
                    </div>
                    </div>
                    <div className="grid divide-gray-200 border-t border-gray-200  grid-cols-2 divide-y-0 divide-x">
                    <div className="px-6 py-3 text-center text-sm font-medium">
                        <span className="text-gray-600">
                        Masuk Kerja
                        </span>
                    </div>
                    <div className="px-6 py-3 text-center text-sm font-medium">
                        <span className="text-gray-600">
                        123 POINTS
                        </span>
                    </div>
                    </div>
                </div>
                <div className="bg-white rounded-t-3xl px-2 pt-2 pb-6">
                    <div className="container">
                        <label className="ml-3 text-lg">Jenis Tamu</label><br/>
                        <div className="mr-3 ml-3">
                            <IonRadioGroup value="organik">
                                <IonItem>
                                    <IonRadio onClick={(e) => handleJenisTamu('organik')} className="mr-1" value="organik" id="organik">
                                    </IonRadio>
                                    <label htmlFor="#organik">Organik</label>
                                </IonItem>
                                <IonItem>
                                    <IonRadio onClick={(e) => handleJenisTamu('external')} className="mr-1" value="external" id="external"></IonRadio>
                                    <label htmlFor="#external">Eksternal</label>
                                </IonItem>
                            </IonRadioGroup>
                        </div>
                        <br/>
                        <label className="ml-3 text-lg">Tamu VVIP</label><br/>
                        <div className="mr-3 ml-3">
                            <IonSelect placeholder="pilih tamu" multiple={true} className="border-2 inherit" 
                            onIonChange={(e)=>handleRequestTamu(e.target.value)}>
                                <IonSelectOption value="Irvan">Irvan Nofiansyah</IonSelectOption>
                                <IonSelectOption value="Rizky">Rizky</IonSelectOption>
                            </IonSelect>
                        </div>
                        <br/>
                        <label className="ml-3 text-lg">Request Menu</label><br/>
                        <div className="ml-3 mr-3">
                            <IonTextarea className="pl-1 pr-1 border-2 inherit" onIonChange={ e => setRequestMenu(e.target.value!)}>
                            </IonTextarea>
                        </div>
                        <br/>
                        <div className="grid grid-cols-4 gap-4">
                            <div></div>
                            <div className="text-center">Pagi</div>
                            <div className="text-center">Siang</div>
                            <div className="text-center">Sore</div>
                        </div>
                        <div className="grid grid-cols-4 gap-4">
                            <div>
                                <label className="text-lg">Jadwal</label>
                            </div>
                            <div className="text-center">
                                <IonCheckbox id="pagi" onClick={(e)=>handleJadwal(e,'pagi')}></IonCheckbox>
                            </div>
                            <div className="text-center">
                                <IonCheckbox id="siang" onClick={(e)=>handleJadwal(e,'siang')}></IonCheckbox>
                            </div>
                            <div className="text-center">
                                <IonCheckbox id="sore" onClick={(e)=>handleJadwal(e,'sore')}></IonCheckbox>
                            </div>
                            
                        </div>
                        <br/>
                        <div className="mt-4">
                                <label htmlFor='odometer' className="block text-sm text-gray-400">
                                    Upload
                                </label>
                                {file ?
                                    <><div className="group block rounded-lg aspect-auto bg-gray-100 overflow-hidden">
                                        <img className="object-cover pointer-events-none" src={`data:image/jpeg;base64,${file.base64String}`} ></img>
                                    </div></>
                                    :
                                    <div className="rounded-md border-2 border-dashed border-gray-300 py-10">
                                        <><div className="flex justify-center">
                                            <button onClick={() => {
                                                handleFile();
                                            }}
                                                className="items-center rounded-full bg-slate-800 px-3 py-3 text-white">
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                                                    <path fill-rule="evenodd" d="M1 8a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 018.07 3h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0016.07 6H17a2 2 0 012 2v7a2 2 0 01-2 2H3a2 2 0 01-2-2V8zm13.5 3a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM10 14a3 3 0 100-6 3 3 0 000 6z" clip-rule="evenodd" />
                                                </svg>
                                            </button>
                                        </div><p className="mt-1 text-xs text-center text-gray-500">Ambil Foto</p></>
                                    </div>
                                }
                        </div>
                        <br/>
                        <div className="container text-center">
                            <IonButton expand="block" color="tertiary" onClick={() => handleBefore()}>Submit</IonButton>
                            <IonButton className="mt-3" expand="block" color="medium">Draft</IonButton>
                            <IonButton className="mt-3" expand="block" color="danger">Cancel</IonButton>
                        </div>

                    </div>
                    
                </div>
            </div>
        </IonContent>
        </IonPage>
    )
}
export default MenuVvipForm;