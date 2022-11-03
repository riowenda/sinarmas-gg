import { IonContent, IonPage, useIonViewWillEnter, IonRefresher, IonRefresherContent, useIonLoading } from "@ionic/react";
import moment from "moment";
import { RefresherEventDetail } from '@ionic/core';
import { useEffect, useState } from "react";
import { useHistory } from "react-router";
import { GaCareListLaporanAPI, GaCareListLaporanGAAPI } from "../../api";
import { CardListLaporan } from "../../components/Card";
import Skeleton from "../../components/Skeleton/Skeleton";
import { pref_identity, pref_json_pegawai_info_login, pref_token } from "../../constant/Index";
import { date, dateSort, dateSortByAscending } from "../../helper/ConvertDate";
import { getJsonPref, getPref } from "../../helper/preferences";
import ListHeader from "../../components/Header/ListHeader";
import Select from 'react-select'
import SelectSearch from "../../components/SelectSearch/SelectSearch";

interface PegawaiInfoType {
  email: string;
  identity: string;
  imageUrl: string;
  name: string;
  nik: string;
  role: string[];
  userId: string;
}

const optionsGA = [
  { value: '-', label: 'ALL' },
  { value: 'PROPOSED', label: 'PROPOSED' },
  { value: 'OPENED', label: 'OPENED' },
  { value: 'PROCESSED', label: 'PROGRESS' },
  { value: 'CANCELED', label: 'CANCELED' },
  { value: 'DONE', label: 'DONE' },
  { value: 'COMPELETED', label: 'COMPELETED' },
]

const optionsUser = [
  { value: '-', label: 'ALL' },
  { value: 'DRAFT', label: 'DRAFT' },
  { value: 'PROPOSED', label: 'PROPOSED' },
  { value: 'REOPENED', label: 'REOPENED' },
  { value: 'CLOSED', label: 'CLOSED' },
  { value: 'CANCELED', label: 'CANCELED' },
  { value: 'DONE', label: 'DONE' },
  { value: 'COMPELETED', label: 'COMPELETED' },
]

const ListLaporan: React.FC = () => {
  const history = useHistory();
  const [pegawaiInfo, setPegawaiInfo] = useState<PegawaiInfoType>({
    email: '',
    identity: '',
    imageUrl: '',
    name: '',
    nik: '',
    role: [''],
    userId: ''
  })
  const [dataLaporan, setDataLaporan] = useState([])
  const [dataLaporanByDate, setDataLaporanByDate] = useState([])
  const [loaded, setLoaded] = useState(false)
  const [present, dismiss] = useIonLoading()

  console.log("dataLaporan", dataLaporan)

  const handleBuatLaporan = () => {
    history.push("/ga-care/buat-laporan");
  };

  const handleDetailLaporan = (status: string, id: string) => {
    console.log("status", status);
    history.push({
      pathname: "/ga-care/detail-laporan",
      state: {
        person: pegawaiInfo.role[0],
        id: id
      },
    });
  };

  // handler fetch list laporan
  const getList = () => {
    setLoaded(true)
    console.log("masuk get list")
    getPref(pref_token).then((token) => {
      getJsonPref(pref_json_pegawai_info_login).then((res) => {
        setPegawaiInfo(res)

        if (res.role == "GA") {
          GaCareListLaporanGAAPI(token).then(async (resList) => {
            console.log("reslist", resList)

            const sort = dateSortByAscending(resList)

            console.log("ARR", sort)
            setDataLaporan(sort)
            setLoaded(false)
          }).catch((error) => {
            console.error(error)
          })
        } else {
          GaCareListLaporanAPI(res.identity, token).then((resList) => {
            const sort = dateSortByAscending(resList.data)
            setDataLaporan(sort)
            setLoaded(false)
          }).catch((error) => {
            console.error(error)
            setLoaded(false)
          })
        }


      })
    })
  }

  function doRefresh(event: CustomEvent<RefresherEventDetail>) {
    console.log("dorefres : ", event)
    getList()
    setTimeout(() => {
      event.detail.complete()
    }, 2000);
  }


  // fetch data list laporan
  // useEffect(() => {
  //   getList()
  // }, [])

  // * FETCH DATA AGAIN
  useIonViewWillEnter(() => {
    present({
      message: "Tunggu sebentar ...",
      duration: 2000,
      spinner: "bubbles",
      onWillDismiss: () => getList()
    })
  }, [])

  const handleSelectChange = async (event: any) => {
    getPref(pref_token).then((token) => {
      if (pegawaiInfo.role[0] === "GA") {
        GaCareListLaporanGAAPI(token).then((res) => {


          if (event.value !== null && event.value !== "" && event.value !== "-") {
            let data = res.filter((x: { [x: string]: { [x: string]: null; }; }) => x['status'] == event.value);
            const sort = dateSortByAscending(data)
            setDataLaporan(sort)
          } else {
            const sort = dateSortByAscending(res)
            setDataLaporan(sort)
          }
        })
      } else {
        getJsonPref(pref_json_pegawai_info_login).then((res) => {
          GaCareListLaporanAPI(res.identity, token).then((res) => {
            if (event.value !== null && event.value !== "" && event.value !== "-") {
              let data = res.filter((x: { [x: string]: { [x: string]: null; }; }) => x['status'] == event.value);
              const sort = dateSortByAscending(data)

              setDataLaporan(sort)
            } else {
              const sort = dateSortByAscending(res)

              setDataLaporan(sort)
            }
          })
        })
      }
    })

  }

  // test

  return (
    <div className="bg-gradient-to-r from-red-700 to-red-500">
      <IonPage className="bg-gradient-to-r from-red-700 to-red-500">
        <IonContent fullscreen className="bg-gradient-to-r from-red-700 to-red-500 bg-danger h-auto">
          <IonRefresher slot="fixed" onIonRefresh={doRefresh}>
            <IonRefresherContent></IonRefresherContent>
          </IonRefresher>
          <div className="bg-white">
            <ListHeader title={"Daftar laporan anda"} isReplace={false} link={""} addButton={false} />

            <div className="px-5 py-5">

              <div
                className="justify-center items-center flex border-2 p-2 rounded-lg border-purple-300 gap-3"
                onClick={handleBuatLaporan}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke={"rgb(168 85 247 / var(--tw-border-opacity))"}
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path d="M20 14.66V20a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h5.34"></path>
                  <polygon points="18 2 22 6 12 16 8 16 8 12 18 2"></polygon>
                </svg>
                <h3 className="truncate text-lg font-medium text-purple-500">
                  Buat Laporan
                </h3>
              </div>
              <div className="my-5 divide-y divide-gray-300">
                <SelectSearch
                  options={pegawaiInfo.role[0] == "GA" ? optionsGA : optionsUser}
                  isSearchable={true}
                  onChange={(event) => {
                    present({
                      message: "Tunggu sebentar ...",
                      duration: 2000,
                      spinner: "bubbles",
                      cssClass: "custom-loading",
                      onWillDismiss: () => {
                        handleSelectChange(event)
                      }
                    })
                  }}
                  placeholder={"Filter..."} />
                {/* <Select placeholder="Filter..." options={options} onChange={event => handleSelectChange(event)} /> */}
              </div>
              <div className="gap-3 flex flex-col">
                {loaded && dataLaporan.length < 0 ? (
                  <Skeleton />
                ) : (
                  <>
                    {dataLaporan.map((e: any) => {
                      return (
                        <CardListLaporan
                          key={e.id}
                          status={e.status === 'PROPOSED' ? "Proposed" : e.status === 'PROCESSED' ? "Progress" : e.status === "DONE" ? "Done" : e.status === "CANCELED" ? "Cancel" : e.status === "OPENED" ? "Open" : e.status}
                          kategori={e?.kategori?.name}
                          tanggal={date(e.tanggal)}
                          // star={e.star}
                          handleOnPress={() => handleDetailLaporan(e.status, e.id)}
                        />
                      );
                    })}
                  </>
                )}


              </div>
            </div>
          </div>
        </IonContent>
      </IonPage>
    </div>
  );
};

export default ListLaporan;
