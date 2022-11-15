import {
  IonContent,
  IonPage,
  IonRefresher,
  IonRefresherContent,
  IonModal,
  useIonViewDidEnter,
  useIonLoading,
  useIonAlert,
  useIonToast
} from "@ionic/react";
import { RefresherEventDetail } from "@ionic/core";
import { useTranslation, initReactI18next } from "react-i18next";
import Select from 'react-select'

import React, { useRef, useState, useCallback } from "react";
import { useHistory, useParams } from "react-router-dom";
// import { } from "@heroicons/react/24/outline";
import {getJsonPref, getPref} from "../../../helper/preferences";
import ListHeader from "../../../components/Header/ListHeader";

import {
  // BASE_API_URL,
  // API_URI,
  pref_json_pegawai_info_login,
  pref_token,
  MEAL_PACKET,
  MEAL_PACKET_SAVE
} from "../../../constant/Index";

const BASE_API_URL = 'http://182.253.66.235:8000';
const API_URI = '';

const shifts = [
  { id: 1, name: 'Pagi' },
  { id: 2, name: 'Siang' },
  { id: 3, name: 'Sore' },
]

const locations = [
  { value: 3, label: 'MES 3' },
  { value: 4, label: 'Kantin 1' },
]

const MealRequestForm: React.FC = () => {
  useIonViewDidEnter(() => {
    loadDataById();
  });

  const history = useHistory();
  const { id } = useParams<{ id: string }>();

  const { t } = useTranslation();
  const [present, dismiss] = useIonLoading();
  const [showConfirm] = useIonAlert();
  const [toast] = useIonToast();

  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const [item, setItem] = useState(null);

  const [token, setToken] = useState(null);
  const [userInfo, setUserInfo] = useState({
    email: '',
    identity: '',
    imageUrl: '',
    name: '',
    nik: '',
    role: [],
    userId: ''
  })

  const [visitorType, setVisitorType] = useState<string>();
  const [shiftActivities, setShiftActivities] = useState(() => shifts.map((x) => false));
  const [data, setData] = useState(() => ({
    id: '',
    user_id: '',
    user_name: '',
    packet_category_id: '',
    packet_category_name: '',
    request_date: '',
    shift_id: '',
    shift_name: '',
    menu_lists: '',
    price: '',
    status: '',
    reason: '',
    handled_at: '',
    deleted_at: '',
    created_at: '',
    updated_at: '',
  }))

  const doRefresh = (event: CustomEvent<RefresherEventDetail>) => {
    setTimeout(() => {
      console.log("Async operation has ended");
      event.detail.complete();
    }, 2000);
  }

  // const loadDataPref = () => {
  //   getPref(pref_token).then(res => {
  //     setToken(res);
  //     // loadDataTujuan(res);
  //   });
  //   getJsonPref(pref_json_pegawai_info_login).then(res => {
  //     setUserInfo(res);

  //     // setData(prevData => ({
  //     //   ...prevData, 
  //     //   user_id: res.userId, 
  //     //   user_nik: res.nik, 
  //     //   user_name: res.name, 
  //     // }))
  //   });
  // }

  const loadDataById = () => {
    const url = BASE_API_URL + API_URI + MEAL_PACKET + '/' + id;
    fetch(url).then(res => res.json()).then(
      (result) => {
        // console.log(result.data);
        setData(result)
        setIsLoaded(true);
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

  // const handleSelectChange = async (event: any) => {
  //   console.log(event)
  // }

  const toggleActive = (index: number, val: any) => {
    const newShiftActivities = [...shiftActivities];
    newShiftActivities[index] = val;
    setShiftActivities(newShiftActivities);
  }

  // const handleSetLocation = (index: number, shiftId: number, shiftName: string, selected: any) => {
  //   const newArr = [...data]
  //   newArr[index] = {
  //     shift_id: shiftId,
  //     shift_name: shiftName,
  //     delivery_location_id: selected.value,
  //     delivery_location_name: selected.label,
  //     reason: ''
  //   }
  //   setData(newArr);
  // }

  // const handleSetReason = (index: number, shiftId: number, shiftName: string, val: any) => {
  //   const newArr = [...data]
  //   newArr[index] = {
  //     shift_id: shiftId,
  //     shift_name: shiftName,
  //     delivery_location_id: 0,
  //     delivery_location_name: '',
  //     reason: val
  //   }
  //   setData(newArr);
  // }

  const showConfimForm = () => {
    showConfirm({
      subHeader: 'Pesanan Untuk',
      inputs: 
      // shifts.map((x) => ({
      //   label: x.name,
      //   type: 'checkbox',
      //   value: x.id,
      //   handler: (e) => {toggleActive(index, e.target.checked)},
      // }))

      [
        {
          label: 'Pagi',
          type: 'checkbox',
          handler: (e) => {toggleActive(0, e.checked)},
        },
        {
          label: 'Siang',
          type: 'checkbox',
          handler: (e) => {toggleActive(1, e.checked)},
        },
        {
          label: 'Sore',
          type: 'checkbox',
          handler: (e) => {toggleActive(2, e.checked)},
        }
      ],
      buttons: [{
        text: 'Buat',
        role: 'confirm',
        cssClass: 'alert-button-confirm',
        // handler: () => { sendRequest() }
      }, {
        text: 'Batal',
        role: 'cancel',
        cssClass: 'alert-button-cancel'
      }]
    })
  }

  const modal = useRef<HTMLIonModalElement>(null);

  const doSubmit = (e: any) => {
    e.preventDefault();

    showConfirm({
      subHeader: 'Konfirmasi pembuatan pesanan',
      buttons: [{
        text: 'OK',
        role: 'confirm',
        cssClass: 'alert-button-confirm',
        handler: () => { sendRequest() }
      }, {
        text: 'Batal',
        role: 'cancel',
        cssClass: 'alert-button-cancel'
      }]
    })
  }


  const sendRequest = () => {
    const loading = present({
      message: 'Memproses permintaan ...',
    })
    const url = BASE_API_URL + API_URI + MEAL_PACKET_SAVE;

    const formData = {
      user_id: userInfo.userId,
      user_nik: userInfo.nik,
      user_name: userInfo.name,
      user_location_id: 0,
      user_location_name: ' ',
      request_date: '',
      user_type: userInfo.role.length ? userInfo.role[0] : '',
      // details: [...data]
    }

    fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Identity': userInfo.userId ? userInfo.userId :''},
      body: JSON.stringify(formData)
    })
    .then(res => res.json())
    .then((result) => {
      console.log(result)
      dismiss().then(() => {
        if(result.statusCode) { // error
          showConfirm({
            subHeader: result.message,
            buttons: [{
              text: 'OK',
              cssClass: 'alert-button-confirm'
            }]
          })
        } else {
          showConfirm({
            subHeader: 'Permintaan makanan berhasil diajukan!',
            buttons: [{
              text: 'OK',
              cssClass: 'alert-button-confirm',
              handler: () => { history.goBack() }
            }]
          })
        }
      })

      // } else {
      //   toast({ message: "Terjadi kesalahan!", duration: 1500, position: "top" });
      // }
    }, (error) => {
      console.log(error)
      dismiss().then(() => {
        toast({ message: "Terjadi kesalahan! ["+error.message+"]", duration: 1500, position: "top"});
      });
    })
  };

  return (
    <IonPage>
      <IonContent fullscreen>
        <IonRefresher slot="fixed" onIonRefresh={doRefresh}>
          <IonRefresherContent></IonRefresherContent>
        </IonRefresher>

        <div className="bg-red-700">

          <ListHeader title={"Buat Pesanan"} isReplace={false} />

          <div className="bg-white">
          {/*<div className="bg-white rounded-t-3xl px-2 pt-2 pb-6">*/}
            <div className="p-6">
              <label htmlFor="visitorType" className="block text-sm text-gray-900">Pemohon</label>
              <div className="border-b border-gray-300 py-1 text-gray-900">
                {data.user_name}
              </div>

              <label htmlFor="visitorType" className="block mt-3 text-sm text-gray-900">Kategori Paket</label>
              <div className="border-b border-gray-300 py-1 text-gray-900">
                {data.packet_category_name}
              </div>

              <label htmlFor="visitorType" className="block mt-3 text-sm text-gray-900">Shift</label>
              <div className="border-b border-gray-300 py-1 text-gray-900">
                {data.shift_name}
                {/*
                <Select
                  isMulti
                  placeholder="Tamu VVIP"
                  options={employees}
                  onChange={(e) => setData(d => ({ ...d, users: [...e.map((i) => i.label)] }))} 
                /> 
                */}
              </div>

            </div>

            <div className='p-6 items-end bg-white'>
              <button className="w-full items-center mx-auto rounded-md bg-emerald-500 px-3 py-2 text-sm font-bold text-white" onClick={doSubmit}>
                Buat Pesanan
              </button>
            </div>
          </div>
        </div>

        {/*id="buttonRequest"*/}

        <IonModal ref={modal} trigger="buttonRequest" initialBreakpoint={0.5} breakpoints={[0, 0.25, 0.5, 0.75]}>
          <IonContent className="ion-padding">
            <div>
              <h3 className="text-base font-bold text-gray-900 text-center my-2">Pesanan Untuk</h3>

              <div className="text-gray-900">
                <label>
                  <input type="checkbox" checked /> Pagi <br />
                </label>
                <label>
                  <input type="checkbox" checked /> Siang <br />
                </label>
                <label>
                  <input type="checkbox" checked /> Sore <br />
                </label>
                <label>
                  <input type="checkbox" checked /> Supper <br />
                </label>
              </div>

              <div className="text-center">
                <button className="inline-flex text-center items-center rounded bg-gray-200 px-2.5 py-3 text-xs font-bold mt-5">
                  <span className="text-purple-700">Batal</span>
                </button>

                <button 
                  className="inline-flex text-center items-center rounded bg-purple-700 px-2.5 py-3 text-xs font-bold mt-5 ml-4" 
                  onClick={() => {window.alert('tes')}}
                >
                  <span className="text-white">Buat</span>
                </button>
              </div>

            </div>
          </IonContent>
        </IonModal>
      </IonContent>
    </IonPage>
  );
};

export default MealRequestForm;
function classNames(arg0: string, arg1: string): string | undefined {
  throw new Error("Function not implemented.");
}
