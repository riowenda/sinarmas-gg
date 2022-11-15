import React, {useState, useEffect, useRef} from "react";
import { useHistory, useParams } from "react-router-dom";
import {
    IonButton,
    IonButtons,
    IonCheckbox,
    IonCol,
    IonContent,
    IonGrid,
    IonIcon,
    IonImg,
    IonInput,
    IonItem,
    IonList,
    IonModal,
    IonPage,
    IonRadio,
    IonRadioGroup,
    IonRefresher,
    IonRefresherContent,
    IonRow,
    IonSelect,
    IonSelectOption,
    IonText,
    useIonAlert,
    useIonToast,
    useIonViewDidEnter,
  } from "@ionic/react";

import {IonReactRouter} from "@ionic/react-router";
import { RefresherEventDetail } from '@ionic/core';
import {useTranslation, initReactI18next} from "react-i18next";
import { camera, ellipse, receiptOutline, restaurantOutline } from "ionicons/icons";
import ListHeader from "../../../components/Header/ListHeader";
const BASE_API_URL = 'http://182.253.66.235:8000';
const API_URI = '';

const user = { name: "", email: "", nik: "", imageUrl: "" };
const userUnit = { id: "", noPol: "", noLambung: "" };

const MenuVvipView: React.FC = () => {
    const [isGa, setIsGa] = useState<boolean>(true);
    const [isUser, setIsUser ] = useState<boolean>(false);
    const [isCatering, setIsCatering ] = useState<boolean>(false);
    const params = useParams<any>();
    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [identity, setIdentity] = useState<string>();
    const [pegUnitId, setPegUnitId] = useState();
    const [pegawai, setPegawai] = useState(user);
    const [role, setRole] = useState();
    const [unit, setUnit] = useState(userUnit);

    const [items, setItems] = useState<any>();
    useIonViewDidEnter(() => {
        loadDataMealReq(1);
    });

    function doRefresh(event: CustomEvent<RefresherEventDetail>) {
        console.log("Begin async operation");
        loadDataMealReq(1);
        setTimeout(() => {
          console.log("Async operation has ended");
          event.detail.complete();
        }, 2000);
    }
    const [deleteConfirm] = useIonAlert();
    const [submitConfirm] = useIonAlert();
    const handleDelete = (id:any) => {
        fetch(BASE_API_URL+API_URI+'/vviprequests/'+id, { method: 'DELETE' })
        .then(response => response.json())
    }
      
    
      
      const history = useHistory();
    const btnBack = () => {
    history.push("/meal/menuvvip");
    }
    const loadDataMealReq = (user: any) => {
        const url = BASE_API_URL + API_URI + '/vviprequests' +'/'+ params.id;
        fetch(url).then(res => res.json()).then(
          (result) => {
            setItems(result);
            setIsLoaded(true);
            setPrice(result.price);
            if(result.reason == "null"){
                setReason("");
            }else{
                setReason(result.reason);
            }
          },
          // Note: it's important to handle errors here
          // instead of a catch() block so that we don't swallow
          // exceptions from actual bugs in components.
          (error) => {
            setIsLoaded(true);
            setError(error);
          }
        )
      }
    const [menuId, setMenuId] = useState<any>();
    const [description, setDescription] = useState<any>();
    const [notifUpdate, setNotifUpdate] = useState(false);
    const [reason, setReason] = useState<any>();
    const [price, setPrice] = useState<any>();
    const [note, setNote] = useState<any>();
    const urlencoded = new URLSearchParams();
    const [updateBerhasil] = useIonToast();
    urlencoded.append("menu_id", params.id);
    urlencoded.append("type_id", "5");
    urlencoded.append("reason", reason);
    urlencoded.append("price", price);
    urlencoded.append("description", description);
    const handleUpdate = () => {
        const url = BASE_API_URL + API_URI + '/menuconfirms';
        urlencoded.append("status", "Proposed");
        fetch(url, {
            method: 'POST',
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: urlencoded,
        }).then(res => res.json())
        .then(res => {
            console.log(res);
            if(res.message == "Ok"){
                updateBerhasil({
                    message: "Update Berhasil",
                    duration: 2000,
                    position: "top",
                    color: "success",
                    buttons: [
                        {
                            text: "Close",
                            role: "cancel",
                            handler: () => {
                                console.log("Cancel clicked");
                            },
                        },
                    ],
                });
                loadDataMealReq(1);
            }else{
                updateBerhasil({
                    message: res.message,
                    duration: 2000,
                    position: "top",
                    color: "danger",
                    buttons: [
                        {
                            text: "Close",
                            role: "cancel",
                            handler: () => {
                                console.log("Cancel clicked");
                            },
                        },
                    ],
                });
            }
        })
    }
    const [approveConfirm] = useIonAlert();
    const [gagalSubmit] = useIonAlert();
    const [rejectConfirm] = useIonAlert();
    
      
    const handleApprove = () => {
        const url = BASE_API_URL + API_URI + '/menuconfirms';
        urlencoded.append("status", "Approved");
        fetch(url, {
            method: 'POST',
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: urlencoded,
        }).then(res => res.json())
        .then(res => {
            console.log(res);
            if(res.message == "Ok"){
                window.location.reload();
                updateBerhasil({
                    message: "Berhasil Approve",
                    duration: 2000,
                    position: "top",
                    color: "success",
                    buttons: [
                        {
                            text: "X",
                            role: "cancel",
                            handler: () => {
                                console.log("Cancel clicked");
                            },
                        },
                    ],
                });
            }else{
                gagalSubmit({
                    header: 'Gagal',
                    message: res.message,
                    buttons: [
                        'OK'
                    ],
                    onDidDismiss: () => console.log('dismissed')
                });
            }
            
        }
        )
    }

    const handleReject = () => {
        const url = BASE_API_URL + API_URI + '/menuconfirms';
        urlencoded.append("status", "Rejected");
        fetch(url, {
            method: 'POST',
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: urlencoded,
        }).then(res => res.json())
        .then(res => {
            console.log(res);
        }
        )
    }
    const modal = useRef<HTMLIonModalElement>(null);
    function dismiss() {
        modal.current?.dismiss();
    }
    return (
        <IonPage>
        <IonContent fullscreen>
          <IonRefresher slot="fixed" onIonRefresh={doRefresh} >
            <IonRefresherContent></IonRefresherContent>
          </IonRefresher>
            <div className="bg-red-700">
                <ListHeader title="Detail Pengajuan VVIP" />
                
            {items && (
                
                <div className="bg-white rounded-t-3xl px-2 pt-2 pb-6">
                    <div className="px-4 py-4">
                        <h3 className="font-bold py-2">Status</h3>
                        <div className="flex justify-between items-center overflow-hidden rounded-lg bg-teal-500 text-white border border-1 border-gray-200 text-sm">
                            <div className='px-4'>
                                {items.status}
                            </div>
                        </div>
                    </div>
                    <div className="container">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="">
                                <label className="ml-3">Jenis Tamu</label>
                            </div>
                            <div>
                                {items.visitor_category}
                            </div>
                            <div>
                                <label className="ml-3">Tamu VVIP</label>
                            </div>
                            <div>
                                {items.visitor_lists.map((item:any) => {
                                return (
                                <div>
                                <ul className="list-disc">
                                    <li>{item}</li>
                                </ul> 
                                </div>
                                )})}
                            </div>
                            <div>
                                <label className="ml-3">Request Menu</label>
                            </div>
                            <div>
                                {items.description}
                            </div>
                            <div>
                                <label className="ml-3">Jadwal</label>
                            </div>
                            <div>
                                {items.shift_name}
                            </div>
                        </div>
                        <br/>
                        <div>
                            
                        </div>
                        <br/>
                        {!isUser && (
                        <div>
                            <label className="ml-3">Keterangan</label>
                            <div className="ml-3 mr-2">
                            <textarea rows={3} className="block w-full border border-1 border-gray-300 rounded-md border-gray-400 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-1" 
                            readOnly={isGa ? true:false} placeholder="Keterangan" value={items.description}/>
                            </div>
                            <br/>
                            <label className="ml-3">Harga Paket</label>
                            <div className="ml-3 mr-2 col-span-12">
                                <IonInput className="block w-full border border-1 border-gray-300 rounded-md border-gray-400 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-1"
                                readonly={isGa ? true:false} placeholder="Harga Paket"
                                value={price} onIonChange={(e) => setPrice(e.target.value)}/>
                            </div>
                            <br/>
                            <div className="grid items-end justify-end justify-items-end mt-3">
                                <IonText id="open-modal" color="tertiary"><u>Commentar</u></IonText>
                            </div>
                            { !isGa && ( 
                                <div>
                                    <IonButton expand="block" className="mt-4" color="tertiary" 
                                    onClick={()=>submitConfirm({
                                        header: 'Submit',
                                        message: 'Apakah anda yakin ingin mengajukan ini?',
                                        buttons: [
                                            {
                                                text: 'Tidak',
                                                role: 'cancel',
                                                cssClass: 'secondary',
                                            }
                                            ,{
                                                text: 'Ya',
                                                handler: () => {
                                                    handleUpdate();
                                                }
                                            }
                                        ],
                                    })}>Submit</IonButton>
                                </div>
                            )}
                            { isCatering && ( 
                            <div>
                                <IonButton expand="block" className="mt-4" color="danger" 
                                onClick={() => deleteConfirm({
                                    header: 'Hapus',
                                    message: 'Apakah anda yakin ingin menghapus pengajuan ini?',
                                    buttons: [
                                        { text: 'Batal', role: 'cancel' },
                                        { text: 'Hapus', handler: (e) => handleDelete(items.id) }
                                    ],
                                })}>
                                    Hapus Pengajuan</IonButton>
                            </div>
                            )}

                            <IonModal id="example-modal" ref={modal} trigger="open-modal" className="" initialBreakpoint={0.5} breakpoints={[0, 0.25, 0.5, 0.75]}>
                                <IonContent className="mr-3 ml-3 mt-3">
                                    <div className="m-3">
                                    <textarea rows={3} className="block w-full border border-1 border-gray-300 rounded-md border-gray-400 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-1"
                                     placeholder="Note" 
                                    onChange={(e)=>setNote(e.target.value)} value={note}/><br/>
                                    <label>Reason</label>
                                    <textarea rows={2} className="block w-full border border-1 border-gray-300 rounded-md border-gray-400 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-1" 
                                     placeholder="Reason"  
                                    onChange={(e)=> setReason(e.target.value)} value={reason} required/>
                                    {isGa && (
                                        <div>
                                            <IonButton color="tertiary" expand="block" className="mt-4"
                                            onClick={()=> approveConfirm({
                                                header : "Approve Pengajuan",
                                                message : "Apa anda yakin ingin approve pengajuan ini?",
                                                buttons : [
                                                    {
                                                        text : "Tidak",
                                                        role : "cancel",
                                                        cssClass : "secondary",
                                                    },
                                                    {
                                                        text : "Ya",
                                                        handler : () => handleApprove()
                                                    }
                                                ]
                                            })}>Approve</IonButton>
                                            <IonButton color="danger" expand="block" className="mt-4"
                                            onClick={()=>rejectConfirm({
                                                header : "Reject Pengajuan",
                                                message : "Apa anda yakin ingin reject pengajuan ini?",
                                                buttons : [
                                                    {
                                                        text : "Tidak",
                                                        role : "cancel",
                                                        cssClass : "secondary",
                                                    },
                                                    {
                                                        text : "Ya",
                                                        handler : () => handleReject()
                                                    }
                                                ]
                                            })}>Reject</IonButton>
                                        </div>
                                    )}
                                    <button onClick={() => dismiss()} className="inline-flex text-center items-center rounded bg-gray-200 px-2.5 py-3 text-xs font-bold mt-5">
                                        <span className="text-purple-700">Kembali</span>
                                    </button>
                                    </div>
                                </IonContent>
                            </IonModal>
                        </div>
                        )}
                    </div>
                </div>
                )}
            </div>
        </IonContent>
        </IonPage>
    )
}
export default MenuVvipView;