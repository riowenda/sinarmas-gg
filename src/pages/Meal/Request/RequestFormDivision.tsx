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
import CreatableSelect from 'react-select/creatable';

import React, { useRef, useState, useCallback } from "react";
import { useHistory } from "react-router-dom";
// import { } from "@heroicons/react/24/outline";
import {getJsonPref, getPref} from "../../../helper/preferences";
import ListHeader from "../../../components/Header/ListHeader";

import {
  // BASE_API_URL,
  // API_URI,
  pref_json_pegawai_info_login,
  pref_token,
  MEAL_REQ_DIVISION_SAVE
} from "../../../constant/Index";

const BASE_API_URL = 'http://182.253.66.235:8000';
const API_URI = '';

const shifts = [
  { value: 1, label: 'Pagi' },
  { value: 2, label: 'Siang' },
  { value: 3, label: 'Sore' },
]

const locations = [
  { value: 3, label: 'MES 3' },
  { value: 4, label: 'Kantin 1' },
]

const employees = [
  { value: 1, label: 'aam' },
  { value: 2, label: 'iim' },
  { value: 3, label: 'uum' },
]

const MealRequestFormDivision: React.FC = () => {
  useIonViewDidEnter(() => {
    loadDataPref();
  });

  const history = useHistory();
  const { t } = useTranslation();
  const [present, dismiss] = useIonLoading();
  const [showConfirm] = useIonAlert();
  const [toast] = useIonToast();

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

  const [reqDate, setReqDate] = useState<string>();
  const [shiftActivities, setShiftActivities] = useState(() => shifts.map((x) => false));
  const [data, setData] = useState({
    request_date: '',
    shift_id: 0,
    shift_name: '',
    delivery_location_id: 0,
    delivery_location_name: '',
    group_name: '',
    destination: '',
    order_reason: '',
    users: [''],
    non_users: ['']
  })

  const doRefresh = (event: CustomEvent<RefresherEventDetail>) => {
    setTimeout(() => {
      console.log("Async operation has ended");
      event.detail.complete();
    }, 2000);
  }

  const loadDataPref = () => {
    getPref(pref_token).then(res => {
      setToken(res);
      // loadDataTujuan(res);
    });
    getJsonPref(pref_json_pegawai_info_login).then(res => { setUserInfo(res) });
  }

  // const handleSelectChange = async (event: any) => {
  //   console.log(event)
  // }

  const toggleActive = (index: number, val: any) => {
    const newShiftActivities = [...shiftActivities];
    newShiftActivities[index] = !newShiftActivities[index];
    setShiftActivities(newShiftActivities);
  }

  const handleSetLocation = (index: number, shiftId: number, shiftName: string, selected: any) => {
    
  }

  const handleSetReason = (index: number, shiftId: number, shiftName: string, val: any) => {
    
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
    const url = BASE_API_URL + API_URI + MEAL_REQ_DIVISION_SAVE;

    const formData = {
      user_id: userInfo.userId,
      user_nik: userInfo.nik,
      user_name: userInfo.name,
      user_location_id: 0,
      user_location_name: ' ',
      user_type: userInfo.role.length ? userInfo.role[0] : '',
      ...data
    }

    formData.users = [...formData.users, ...formData.non_users]

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

  const saveTemplate = () => {
    showConfirm({
      subHeader: 'Save as template',
      inputs: [
        {
          placeholder: 'Nama Template',
        }
      ],
      buttons: [{
        text: 'OK',
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

  const loadTemplate = () => {
    showConfirm({
      subHeader: 'Load from template',
      inputs: [
        {
          label: 'Pesanan Bunati NS',
          type: 'radio',
          value: 1,
        },
        {
          label: 'Pesanan Fav',
          type: 'radio',
          value: 2,
        }
      ],
      buttons: [{
        text: 'OK',
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
              <label htmlFor="reqDate" className="block text-sm text-gray-900">Tanggal</label>
              <div className="border-b border-gray-300 py-2 text-gray-900">
                <input
                  type="date"
                  id="reqDate"
                  className="block w-full"
                  defaultValue={reqDate}
                  onChange={({target}) => setData(d => ({...d, request_date: target.value}))}
                />
              </div>

              <div className="rounded-lg px-2 py-2 mb-3 border border-1 border-gray-300 bg-gray-100 mt-3">
                <div className="min-w-0">
                  <p className="text-sm text-gray-900 py-2">Shift</p>
                  <Select
                    placeholder="Shift"
                    options={shifts}
                    onChange={(e) => setData(d => ({...d, shift_id: Number(e?.value), shift_name: String(e?.label)}))}
                  /> 
                </div>

                <div className="min-w-0">
                  <p className="text-sm text-gray-900 py-2">Group Name</p>
                  <div className="border-b border-gray-300 py-2">
                    <input
                      defaultValue={data.group_name}
                      onChange={({target}) => setData(d => ({...d, group_name: target.value}))}
                      required
                      name="group_name"
                      id="group_name"
                      className="block w-full"
                    />
                  </div>
                </div>

                <div className="min-w-0">
                  <p className="text-sm text-gray-900 py-2">Tujuan</p>
                  <div className="border-b border-gray-300 py-2">
                    <input
                      defaultValue={data.destination}
                      onChange={({target}) => setData(d => ({...d, destination: target.value}))}
                      required
                      name="destination"
                      id="destination"
                      className="block w-full"
                    />
                  </div>
                </div>

                <div className="min-w-0">
                  <p className="text-sm text-gray-900 py-2">Diantar ke</p>
                  <Select
                    placeholder="Diantar ke"
                    options={locations}
                    onChange={(e) => setData(d => ({...d, delivery_location_id: Number(e?.value), delivery_location_name: String(e?.label)}))} 
                  /> 
                </div>

                <div className="min-w-0">
                  <p className="text-sm text-gray-900 py-2">Nama - Menu Reguler</p>
                  <Select
                    isMulti
                    placeholder="Nama - Menu Reguler"
                    options={employees}
                    onChange={(e) => setData(d => ({ ...d, users: [...e.map((i) => i.label)] }))} 
                  /> 
                </div>

                <div className="min-w-0">
                  <p className="text-sm text-gray-900 py-2">Nama Tambahan (Non-User)</p>
                  <CreatableSelect 
                    isMulti 
                    placeholder="Nama Tambahan (Non-User)" 
                    options={[{value:'', label:''}]} 
                    onChange={(e) => setData(d => ({ ...d, non_users: [...e.map((i) => i.label)] }))} 
                  /> 
                </div>

                <div className="min-w-0">
                  <p className="text-sm text-gray-900 py-2">Jumlah</p>
                  <div className="border-b border-gray-300 py-2">
                    <input
                      value={
                        (data.users[0] === '' && data.users.length === 1 ? 0 : data.users.length) + 
                        (data.non_users[0] === '' && data.non_users.length === 1 ? 0 : data.non_users.length)
                      }
                      readOnly
                      name="count_users"
                      id="count_users"
                      className="block w-full"
                    />
                  </div>
                </div>

                <div className="min-w-0">
                  <p className="text-sm text-gray-900 py-2">Keterangan</p>
                  <textarea
                    onChange={({target}) => setData(d => ({...d, order_reason: target.value}))}
                    rows={3}
                    className="block w-full border border-1 border-gray-300 rounded-md border-gray-400 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-1"
                    defaultValue={data.order_reason}
                  />
                </div>
              </div>
            </div>

            <div className='p-6 items-end bg-white'>
              <button className="w-full items-center mx-auto rounded-md bg-emerald-500 px-3 py-2 text-sm font-bold text-white" onClick={doSubmit}>
                Buat Pesanan
              </button>

              <button className="w-full text-center items-center rounded bg-gray-200 px-2.5 py-3 text-xs font-bold mt-5" onClick={loadTemplate}>
                <span className="text-red-700">Load from template</span>
              </button>

              <button className="w-full text-center items-center rounded bg-gray-200 px-2.5 py-3 text-xs font-bold mt-5" onClick={saveTemplate}>
                <span className="text-red-700">Save as template</span>
              </button>
            </div>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default MealRequestFormDivision;
function classNames(arg0: string, arg1: string): string | undefined {
  throw new Error("Function not implemented.");
}
