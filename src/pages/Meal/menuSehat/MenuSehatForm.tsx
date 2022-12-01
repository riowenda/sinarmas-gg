import {
    IonPage,
    IonHeader,
    IonContent,
    IonCardContent,
    IonItem,
    IonCard,
    IonLabel,
    IonIcon,
    IonBadge,
    IonInput,
    IonCheckbox,
    IonGrid,
    IonCol,
    IonRow,
    IonButton,
    IonFab,
    IonFabButton,
    IonImg,
    IonTextarea,
    IonRefresher,
    IonRefresherContent,
} from '@ionic/react';

import React from "react";
import { useState, ChangeEvent, FormEvent } from 'react';
import { useHistory } from "react-router-dom";
import { Camera, CameraResultType, CameraSource } from "@capacitor/camera";
import {
    server,
    qrCode,
    camera,
} from 'ionicons/icons';
import './MenuSehat.css';
import {IonReactRouter} from "@ionic/react-router";
import { RefresherEventDetail } from '@ionic/core';
import {useTranslation, initReactI18next} from "react-i18next";
import ListHeader from '../../../components/Header/ListHeader';


const MenuSehatForm: React.FC = () => {
    const [noref, setNoref] = useState<any>();
    const [tanggalAwal, setTanggalAwal] = useState<any>();
    const [tanggalAkhir, setTanggalAkhir] = useState<any>();
    const [keterangan, setKeterangan] = useState<any>();
    const history = useHistory();
    const haris = [{id: 1, nama: "Senin"}, {id: 2, nama: "Selasa"}, {id: 3, nama: "Rabu"}, {id: 4, nama: "Kamis"}, {id: 5, nama: "Jumat"}, {id: 6, nama: "Sabtu"}, {id: 7, nama: "Minggu"}];
   
    const [days, setDays] = useState([
        {hari: "senin", waktu:"pagi", value: false},
        {hari: "senin", waktu:"siang", value:false},
        {hari: "senin", waktu:"sore", value:false},
        {hari: "selasa", waktu:"pagi", value:false},
        {hari: "selasa", waktu:"siang", value:false},
        {hari: "selasa", waktu:"sore", value:false},
        {hari: "rabu", waktu:"pagi", value:false},
        {hari: "rabu", waktu:"siang", value:false},
        {hari: "rabu", waktu:"sore", value:false},
        {hari: "kamis", waktu:"pagi", value:false},
        {hari: "kamis", waktu:"siang", value:false},
        {hari: "kamis", waktu:"sore", value:false},
        {hari: "jumat", waktu:"pagi", value:false},
        {hari: "jumat", waktu:"siang", value:false},
        {hari: "jumat", waktu:"sore", value:false},
        {hari: "sabtu", waktu:"pagi", value:false},
        {hari: "sabtu", waktu:"siang", value:false},
        {hari: "sabtu", waktu:"sore", value:false},
        {hari: "minggu", waktu:"pagi", value:false},
        {hari: "minggu", waktu:"siang", value:false},
        {hari: "minggu", waktu:"sore", value:false},
    ]);

    const handleCheckbox = (e: any, jadwalTerpilih:any, waktuTerpilih:any) => {
        if(e.target.checked){
            const newDays = days.map( (obj) => {
                if(obj.hari === jadwalTerpilih.toLowerCase() && obj.waktu === waktuTerpilih){
                    obj.value = true;
                }
                return obj;
            });
            setDays(newDays);
        }else{
            const newDays = days.map( (obj) => {
                if(obj.hari === jadwalTerpilih.toLowerCase() && obj.waktu === waktuTerpilih){
                    obj.value = false;
                }
                return obj;
            });
            setDays(newDays);
        }
    }

    // const handleBeforeSubmit = () => {
        
    //     //push array data
    //     const newData = 
    //     {
    //         no_ref: noref,
    //         date_start : tanggalAwal,
    //         date_end : tanggalAkhir,
    //         user_note: keterangan,
    //         image : file,
    //         days : 
    //         {
    //                 'senin':{'pagi' : days[0].value, 'siang' : days[1].value, 'sore' : days[2].value},
    //                 'selasa':{'pagi' : days[3].value, 'siang' : days[4].value, 'sore' : days[5].value},
    //                 'rabu':{'pagi' : days[6].value, 'siang' : days[7].value, 'sore' : days[8].value},
    //                 'kamis':{'pagi' : days[9].value, 'siang' : days[10].value, 'sore' : days[11].value},
    //                 'jumat':{'pagi' : days[12].value, 'siang' : days[13].value, 'sore' : days[14].value},
    //                 'sabtu':{'pagi' : days[15].value, 'siang' : days[16].value, 'sore' : days[17].value},
    //                 'minggu':{'pagi' : days[18].value, 'siang' : days[19].value, 'sore' : days[20].value},
    //         },
    //     }
    //     console.log(newData);
    // }
    const [file, setFile] = useState<any>();
    const [dataUri, setDataUri] = useState<any>('')
    const [fileName, setFileName] = useState<any>('')
    const handleFile = async () => {
        await Camera.getPhoto({
            resultType: CameraResultType.Base64,
            source: CameraSource.Camera,
            quality: 30
        })
            .then((res) => {
                console.log(res);
                const imgs = `data:image/jpeg;base64, ${res.base64String}`;
                const imgName = (new Date().getTime().toString()) + "." + res.format;
                // @ts-ignore
                setFile(res);
                setFileName(imgName);
                
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
    
    

    // const handleFile = (file:Blob) => {
     
    //     if(!file) {
    //     setDataUri('');
    //     return;
    //     }
    //     setFile(file);
    //     fileToDataUri(file)
    //     .then(dataUri => {
    //         setDataUri(dataUri)
    //     })
        
    // }
    
    const handleSubmit = async (e:any) => {
        e.preventDefault();
        const BASE_API_URL = 'http://182.253.66.235:8000/';
        console.log(file);
        const API_URI = '';
        const url = BASE_API_URL + API_URI + 'healthymenuproposals';
        const blob = await fetch(`data:image/jpeg;base64, ${file.base64String}`).then(r => r.blob());
        const form = new FormData();
        form.append("user_id", "1234");
        form.append("user_nik", "357819465465462");
        form.append("user_name", "Rio wenda");
        form.append("no_ref", noref);
        form.append("user_note", keterangan);
        form.append("date_start", tanggalAwal);
        form.append("date_end", tanggalAkhir);
        form.append("image", blob, fileName);
        days.map((day:any) => {
            form.append("days["+day.hari+"]["+day.waktu+"]", day.value);
        })
        try {
          let res = await fetch(url, {
            method: "POST",
            body: form
          });
          let resJson = await res.json();
          if (res.status === 200) {
            console.log("sukses menyambung");
          } else {
            console.log("gagal mengirim")
          }
        } catch (err) {
          console.log(err);
        }
    }
    const btnBack = () => {
        history.push("/meal/menusehat");
    }
    
    return (
        <IonPage id="main-content">
        
        <IonContent fullscreen>
            <IonRefresher slot="fixed">
                <IonRefresherContent></IonRefresherContent>
            </IonRefresher>
            <div className="bg-red-700">
                <ListHeader title="Pengajuan Menu Sehat"></ListHeader>
            <IonGrid className='bg-white'>
                <h3 className='text-center'>Permohonan Menu Sehat</h3>
                <IonRow>
                    <IonCol size="12">
                        <IonLabel >No Ref</IonLabel>
                        <input value={noref} placeholder="Masukan No Ref" className="block w-full border border-1 border-gray-300 border-gray-400 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-1"
                         onChange={e => setNoref(e.target.value)}/>
                    </IonCol>
                    <IonCol size="12">
                        <IonLabel>Tanggal Awal</IonLabel>
                        <input type="date" className="block w-full border border-1 border-gray-300 border-gray-400 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-1"
                         onChange={e =>setTanggalAwal(e.target.value)}/>
                    </IonCol>
                    <IonCol size="12">
                        <IonLabel>Tanggal Akhir</IonLabel><br/>
                        <input type="date" className="block w-full border border-1 border-gray-300 border-gray-400 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-1"
                         onChange={e => setTanggalAkhir(e.target.value)}/>
                    </IonCol>
                </IonRow>
                <br/>
                <IonRow className='text-center'>
                    <IonCol>
                        <IonLabel className='text-level1'>Jadwal</IonLabel>
                    </IonCol>
                </IonRow>
                <IonRow>
                    <IonCol size="4"></IonCol>
                    <IonCol size="8">
                        <IonRow>
                            <IonCol size="4">
                                Pagi
                            </IonCol>
                            <IonCol size="4">
                                Siang
                            </IonCol>
                            <IonCol size="4">
                                Sore
                            </IonCol>
                        </IonRow>
                    </IonCol>
                </IonRow>
                {haris.map(hari => {
                    return (
                    <IonRow className='p-0 m-0'>
                        <IonCol size="4" className='mt-2'>
                            <IonLabel className='text-level2'>{hari.nama}</IonLabel>
                        </IonCol>
                        <IonCol size="8">
                            <IonGrid className="grid">
                                <IonRow>
                                    <IonCol size="4" className=''>
                                        <IonCheckbox onClick={(e)=> handleCheckbox(e, hari.nama, 'pagi')}></IonCheckbox>
                                    </IonCol>
                                    <IonCol size="4" className=''>
                                        <IonCheckbox onClick={(e)=> handleCheckbox(e, hari.nama, 'siang')}></IonCheckbox>
                                    </IonCol>
                                    <IonCol size="4" className=''>
                                        <IonCheckbox onClick={(e)=> handleCheckbox(e, hari.nama, 'sore')}></IonCheckbox>
                                    </IonCol>
                                </IonRow>
                            </IonGrid>
                        </IonCol>
                    </IonRow>
                    )
                })}
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
              {/* <IonRow>
                <IonCol size="12" className="text-level1">Upload File</IonCol>
                <IonCol size="12">
                    <img src={dataUri} />
                </IonCol>
                <input type="file" onChange={(event: ChangeEvent<HTMLInputElement>) => { if (event.target.files)
                    handleFile(event.target.files[0])
                }} />
                
              </IonRow> */}
              
              <IonRow>
                <IonCol size="12">
                    <IonLabel>Keterangan</IonLabel>
                </IonCol>
                <IonCol size="12">
                    <textarea value={keterangan} className="rounded-md block w-full border border-1 border-gray-300 border-gray-400 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-1" 
                    placeholder="" onChange={e => setKeterangan(e.target.value)}></textarea>
                </IonCol>
              </IonRow>
              <IonRow className='pull-right'>
                <IonCol  >
                    <IonButton className="btn-cancel" color="danger" onClick={btnBack}>Batal</IonButton>
                    <IonButton className="btn-submit" color="tertiary" onClick={(e)=>handleSubmit(e)}>Submit</IonButton>
                </IonCol>
                <br/>
              </IonRow>
            </IonGrid>
            </div>
        </IonContent>
      </IonPage>
    );
}
export default MenuSehatForm;