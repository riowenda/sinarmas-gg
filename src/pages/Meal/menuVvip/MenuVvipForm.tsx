import React, {useState, useEffect, ChangeEvent, FormEvent} from "react";
import { useHistory } from "react-router";
import {
    IonButton,
    IonCheckbox,
    IonCol,
    IonContent,
    IonItem,
    IonPage,
    IonRadio,
    IonRadioGroup,
    IonRefresher,
    IonRefresherContent,
    IonSelect,
    IonSelectOption,
    useIonViewDidEnter,
  } from "@ionic/react";
import {IonReactRouter} from "@ionic/react-router";
import { Camera, CameraResultType, CameraSource, Photo} from "@capacitor/camera";
import { RefresherEventDetail } from '@ionic/core';
import {useTranslation, initReactI18next} from "react-i18next";
import { camera, receiptOutline, restaurantOutline } from "ionicons/icons";
import './MenuVvip.css';
import ListHeader from "../../../components/Header/ListHeader";
const MenuVvipForm: React.FC = () => {
    //form
    const [jenisTamu, setJenisTamu] = useState<any>("Organik");
    
    const [requestTamu, setRequestTamu] = useState<any>([]);
    const [requestMenu, setRequestMenu] = useState<any>();
    const [jadwal, setJadwal] = useState<any>([]);
    
    const handleJenisTamu = (e: any) => {
        if(e==="organik"){
            setJenisTamu('Organik')
        }
        else{
            setJenisTamu('External')
        }
    }
    const handleRequestTamu = (e: any) => {
        setRequestTamu(e)
    }
    const handleJadwal = (e: any, value:any) => {
        if(e.target.checked){
            setJadwal((current: any)=>[...current, value])
        }else{
            setJadwal(jadwal.filter((item: any)=> item !== value))
        }
    }
    const [file, setFile] = useState<any>();
    const [sendImage, setSendImage] = useState<any>();
    const [fileName, setFileName] = useState<any>();
    const handleFile = async () => {
        const image = await Camera.getPhoto({
            quality: 30,
            allowEditing: false,
            resultType: CameraResultType.Uri,
            source: CameraSource.Camera
        });
        setFile(image.webPath);
        let imgName = (new Date().getTime().toString()) + "." + image.format;
        setFileName(imgName);
        const response = await fetch(image.webPath!);
        const blob = await response.blob();
        setSendImage(blob);

    };
    const today = new Date();
    const handleSubmit = async (e:any) => {
        e.preventDefault();
        const BASE_API_URL = 'http://182.253.66.235:8000/';
        const API_URI = '';
        const url = BASE_API_URL + API_URI + 'vviprequests';
        const form = new FormData();
        form.append("visitor_category", jenisTamu);
        form.append("request_date", today. getFullYear()+'-'+(today. getMonth()+1)+'-'+today. getDate());
        form.append("shift_id", "1");
        form.append("shift_name", jadwal);
        form.append("description", requestMenu);
        form.append("image", sendImage, fileName);
        requestTamu.map((day:any, index:any) => {
            form.append("visitor_lists["+index+"]", day);
        })
        try {
          let res = await fetch(url, {
            method: "POST",
            body: form
          });
          let resJson = await res.json();
          if (res.status === 200) {
            window.location.href = "/menuvvip/detailpengajuan?id="+resJson.id;
          } else {
            window.location.href = "/menuvvip/detailpengajuan?id="+resJson.id;
          }
          
        } catch (err) {
          console.log(err);
        }
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
                <ListHeader title="Pengajuan Menu Sehat"></ListHeader>
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
                            <textarea rows={3} className="block w-full border border-1 border-gray-300 rounded-md border-gray-400 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-1" 
                            onChange={ e => setRequestMenu(e.target.value!)}>
                            </textarea>
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
                                        <img className="object-cover pointer-events-none" src={file} ></img>
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
                            <IonButton expand="block" color="tertiary" onClick={(e) => handleSubmit(e)}>Submit</IonButton>
                            <IonButton className="mt-3" expand="block" color="medium">Draft</IonButton>
                            <IonButton className="mt-3" expand="block" color="danger" onClick={btnBack}>Cancel</IonButton>
                        </div>
                    </div>
                </div>
            </div>
        </IonContent>
        </IonPage>
    )
}
export default MenuVvipForm;