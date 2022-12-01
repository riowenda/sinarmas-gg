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
import moment from "moment";

import React, { useRef, useState, useCallback } from "react";
import { useHistory, useParams } from "react-router-dom";
// import { } from "@heroicons/react/24/outline";
import {getJsonPref, getPref} from "../../../helper/Preferences";
import ListHeader from "../../../components/Header/ListHeader";
import BadgeStatus from "../../../components/Badge/BadgeStatus";

import {
  // BASE_API_URL,
  // API_URI,
  pref_json_pegawai_info_login,
  pref_token,
  MEAL_REQ_SELF,
} from "../../../constant/Index";

interface MealReqItemDetail {
  id: string
  meal_request_id: number
  shift_id: number
  shift_name: string
  user_id: string
  user_name: string
  user_nik: string
  user_type: string
  user_desc: string
  is_healthy_menu: boolean
  user_location_id: string
  user_location_name: string
  delivery_location_id: null | number
  delivery_location_name: null | string
  is_prasmanan: boolean
  request_date: string
  menu_id: null | number
  menu_type: string
  menus: null | string
  reason: string
  created_at: null | string
  updated_at: null | string
  deleted_at: null | string
}

interface MealReqItem {
  id: string,
  user_id: string,
  user_nik: string,
  user_name: string,
  request_date: string,
  request_type: string,
  users: null | string,
  non_users: null | string,
  order_reason: null | string,
  group_name: null | string,
  status: string,
  is_template: boolean,
  template_name: null | string,
  is_additional_request: boolean,
  created_at: null | string,
  updated_at: null | string,
  deleted_at: null | string,
  details: MealReqItemDetail[]
}

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
  const [data, setData] = useState<MealReqItem>({
    id: "1",
    user_id: "24941d93-3dd8-3bd5-86d5-cc5c0d23237f",
    user_nik: "3307305205114139",
    user_name: "Elvina Hasanah",
    request_date: "2022-11-22",
    request_type: "self",
    users: null,
    non_users: null,
    order_reason: null,
    group_name: null,
    status: "Waiting Approval",
    is_template: false,
    template_name: null,
    is_additional_request: false,
    created_at: "2022-11-15T16:36:01.000Z",
    updated_at: "2022-11-15T16:36:01.000Z",
    deleted_at: null,
    details: [{
      id: "1",
      meal_request_id: 1,
      shift_id: 1,
      shift_name: "Pagi",
      user_id: "24941d93-3dd8-3bd5-86d5-cc5c0d23237f",
      user_name: "Elvina Hasanah",
      user_nik: "3307305205114139",
      user_type: "staff",
      user_desc: "Security",
      is_healthy_menu: false,
      user_location_id: "2",
      user_location_name: "Kantin 2",
      delivery_location_id: null,
      delivery_location_name: null,
      is_prasmanan: false,
      request_date: "2022-11-22",
      menu_id: null,
      menu_type: "Menu Reguler",
      menus: null,
      reason: "Corporis sit consequatur consequatur non.",
      created_at: "2022-11-15T16:36:01.000Z",
      updated_at: "2022-11-15T16:36:01.000Z",
      deleted_at: null
    }]
  })

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
    const url = BASE_API_URL + API_URI + MEAL_REQ_SELF + '/' + id;
    fetch(url).then(res => res.json()).then(
      (result) => {
        // console.log(result.data);

        result.details = [{
          id: "1",
          meal_request_id: 1,
          shift_id: 1,
          shift_name: "Pagi",
          user_id: "24941d93-3dd8-3bd5-86d5-cc5c0d23237f",
          user_name: "Elvina Hasanah",
          user_nik: "3307305205114139",
          user_type: "staff",
          user_desc: "Security",
          is_healthy_menu: false,
          user_location_id: "2",
          user_location_name: "Kantin",
          delivery_location_id: null,
          delivery_location_name: null,
          is_prasmanan: true,
          request_date: "2022-11-22",
          menu_id: null,
          menu_type: "Menu Reguler",
          menus: null,
          reason: "Corporis sit consequatur consequatur non.",
          created_at: "2022-11-15T16:36:01.000Z",
          updated_at: "2022-11-15T16:36:01.000Z",
          deleted_at: null
        },{
          id: "2",
          meal_request_id: 1,
          shift_id: 1,
          shift_name: "Pagi",
          user_id: "24941d93-3dd8-3bd5-86d5-cc5c0d23237f",
          user_name: "Elvina Hasanah",
          user_nik: "3307305205114139",
          user_type: "staff",
          user_desc: "Security",
          is_healthy_menu: false,
          user_location_id: "2",
          user_location_name: "Pos 1",
          delivery_location_id: null,
          delivery_location_name: null,
          is_prasmanan: false,
          request_date: "2022-11-22",
          menu_id: null,
          menu_type: "Menu Reguler",
          menus: null,
          reason: "Corporis sit consequatur consequatur non.",
          created_at: "2022-11-15T16:36:01.000Z",
          updated_at: "2022-11-15T16:36:01.000Z",
          deleted_at: null
        },{
          id: "1",
          meal_request_id: 1,
          shift_id: 1,
          shift_name: "Pagi",
          user_id: "24941d93-3dd8-3bd5-86d5-cc5c0d23237f",
          user_name: "Elvina Hasanah",
          user_nik: "3307305205114139",
          user_type: "staff",
          user_desc: "Security",
          is_healthy_menu: false,
          user_location_id: "2",
          user_location_name: "Pos 4",
          delivery_location_id: null,
          delivery_location_name: null,
          is_prasmanan: false,
          request_date: "2022-11-22",
          menu_id: null,
          menu_type: "Menu Reguler",
          menus: null,
          reason: "Corporis sit consequatur consequatur non.",
          created_at: "2022-11-15T16:36:01.000Z",
          updated_at: "2022-11-15T16:36:01.000Z",
          deleted_at: null
        }]

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
    // const loading = present({
    //   message: 'Memproses permintaan ...',
    // })
    // const url = BASE_API_URL + API_URI + MEAL_REQ_SELF_SAVE;

    // const formData = {
    //   user_id: userInfo.userId,
    //   user_nik: userInfo.nik,
    //   user_name: userInfo.name,
    //   user_location_id: 0,
    //   user_location_name: ' ',
    //   request_date: '',
    //   user_type: userInfo.role.length ? userInfo.role[0] : '',
    //   // details: [...data]
    // }

    // fetch(url, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json', 'Identity': userInfo.userId ? userInfo.userId :''},
    //   body: JSON.stringify(formData)
    // })
    // .then(res => res.json())
    // .then((result) => {
    //   console.log(result)
    //   dismiss().then(() => {
    //     if(result.statusCode) { // error
    //       showConfirm({
    //         subHeader: result.message,
    //         buttons: [{
    //           text: 'OK',
    //           cssClass: 'alert-button-confirm'
    //         }]
    //       })
    //     } else {
    //       showConfirm({
    //         subHeader: 'Permintaan makanan berhasil diajukan!',
    //         buttons: [{
    //           text: 'OK',
    //           cssClass: 'alert-button-confirm',
    //           handler: () => { history.goBack() }
    //         }]
    //       })
    //     }
    //   })

    //   // } else {
    //   //   toast({ message: "Terjadi kesalahan!", duration: 1500, position: "top" });
    //   // }
    // }, (error) => {
    //   console.log(error)
    //   dismiss().then(() => {
    //     toast({ message: "Terjadi kesalahan! ["+error.message+"]", duration: 1500, position: "top"});
    //   });
    // })
  };

  return (
    <IonPage>
      <IonContent fullscreen>
        <IonRefresher slot="fixed" onIonRefresh={doRefresh}>
          <IonRefresherContent></IonRefresherContent>
        </IonRefresher>

        <div className="bg-red-700">

          <ListHeader title={"Detail Pesanan"} isReplace={false} />

          <div className="bg-white">
          {/*<div className="bg-white rounded-t-3xl px-2 pt-2 pb-6">*/}
            <div className="p-6">
              <label htmlFor="visitorType" className="block text-sm text-gray-900">Tanggal Pesanan</label>
              <div className="border-b border-gray-300 py-1 text-gray-900">
                {moment(data.request_date).format('DD MMM yyyy').toString()}
              </div>

              <label htmlFor="visitorType" className="block mt-3 text-sm text-gray-900">Shift</label>
              <div className="border-b border-gray-300 py-1 text-gray-900 mb-5">
                
                <Select
                  placeholder="Shift"
                  options={shifts}
                  // onChange={(e) => setData(d => ({ ...d, users: [...e.map((i) => i.label)] }))} 
                /> 
                
              </div>

              {data.details.map((row, index) => {
                return (
                  <div 
                    className="rounded-lg py-1 mb-3 border border-1 border-gray-300 cursor-pointer" 
                    key={row['id']} 
                    onClick={() => { history.push("/meal/request-cathering/detail-action/" + row['id']) } }
                  >
                    <div className="px-2 py-2">
                      <div className="relative flex space-x-3">
                        <div className="flex min-w-0 flex-1 justify-between space-x-4">
                          <div>
                            <p className="text-gray-900">
                              {row.user_location_name} - &nbsp;
                              {row.is_prasmanan ? 'Prasmanan' : 'Packing'}
                            </p>
                            {/*<p className="text-sm text-gray-900">PT. Semesta Transportasi Limbah Indonesia</p>*/}
                          </div>
                          <BadgeStatus title="Proses" />
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
{/*
              <label htmlFor="visitorType" className="block mt-3 text-sm text-gray-900">Detail Paket :</label>
              {data.menu_lists.map(( obj, index ) => {
                
                const items = [];
                for (let key in obj) {
                  if (obj.hasOwnProperty(key)) {
                    items.push(<tr key={key}>
                      <td className="p-1 border">{key}</td>
                      <td className="p-1 border">{obj[key]}</td>
                    </tr>)
                  }
                }

                return (<table className="border-collapse w-full my-3 bg-gray-50">{items}</table>)
              })}
*/}
            </div>
          </div>
        </div>

      </IonContent>
    </IonPage>
  );
};

export default MealRequestForm;
function classNames(arg0: string, arg1: string): string | undefined {
  throw new Error("Function not implemented.");
}
