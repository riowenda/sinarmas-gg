import {IonContent, IonPage, useIonViewWillEnter, IonRefresher, IonRefresherContent, useIonLoading} from "@ionic/react";
import moment from "moment";
import {RefresherEventDetail} from '@ionic/core';
import React, {useEffect, useState} from "react";
import {useHistory} from "react-router";
import {GaCareListLaporanAPI, GaCareListLaporanGAAPI} from "../../api";
import {CardListLaporan} from "../../components/Card";
import Skeleton from "../../components/Skeleton/Skeleton";
import {
    API_URI,
    AUTH_FUEL_GA, GA_CARE_LAPORAN_URI_DETAIL,
    GA_CARE_LAPORAN_URI_UPDATE_STATUS,
    pref_identity,
    pref_json_pegawai_info_login, pref_pegawai_id,
    pref_token
} from "../../constant/Index";
import {date, dateSort, dateSortByAscending} from "../../helper/ConvertDate";
import {getFuelMenu, getJsonPref, getPref} from "../../helper/Preferences";
import ListHeader from "../../components/Header/ListHeader";
import Select from 'react-select'
import SelectSearch from "../../components/SelectSearch/SelectSearch";
import {BaseAPI} from "../../api/ApiManager";

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
    {value: '-', label: 'ALL'},
    {value: 'PROPOSED', label: 'PROPOSED'},
    {value: 'OPENED', label: 'OPENED'},
    {value: 'PROCESSED', label: 'PROGRESS'},
    {value: 'CANCELED', label: 'CANCELED'},
    {value: 'DONE', label: 'DONE'},
    {value: 'CLOSED', label: 'COMPLETED'},
]

const optionsUser = [
    {value: '-', label: 'ALL'},
    {value: 'DRAFT', label: 'DRAFT'},
    {value: 'PROPOSED', label: 'PROPOSED'},
    {value: 'REOPENED', label: 'REOPENED'},
    {value: 'CANCELED', label: 'CANCELED'},
    {value: 'DONE', label: 'DONE'},
    {value: 'CLOSED', label: 'COMPLETED'},
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
    const [dataRole, setDataRole] = useState()
    const [identity, setIdentity] = useState()
    const [userId, setUserId] = useState()


    const handleBuatLaporan = () => {
        history.push("/ga-care/buat-laporan");
    };

    const handleDetailLaporan = (status: string, id: string) => {

        console.log("Pas Click detail: ", dataRole);
        // @ts-ignore
        if(dataRole === "GA" && (status === "PROPOSED" || status === "REOPENED")){
            /*const urlContents = BaseAPI() + API_URI + GA_CARE_LAPORAN_URI_DETAIL + "/" + id;*/
            const urlContents = BaseAPI() + API_URI + GA_CARE_LAPORAN_URI_UPDATE_STATUS;
            const laporanData = {
                laporan: {
                    id: id
                },
                pegawai: {
                    id: userId
                },
                status: "OPENED",
            };

            fetch(urlContents, {
                method: 'POST',
                headers: {'Content-Type': 'application/json', 'Identity': identity != null && identity != "" ? identity : ''},
                body: JSON.stringify(laporanData)
            })
                .then(res => res.json())
                .then(
                    (result) => {
                        if (result.status === "SUCCESS") {
                            history.push({
                                pathname: "/ga-care/detail-laporan",
                                state: {
                                    person: pegawaiInfo.role[0],
                                    id: id
                                },
                            });
                        }else{
                            history.push({
                                pathname: "/ga-care/detail-laporan",
                                state: {
                                    person: pegawaiInfo.role[0],
                                    id: id
                                },
                            });
                        }
                        //setIsLoaded(true);
                    },
                    (error) => {
                        //setIsLoaded(true);
                        //setError(error);
                    }
                );
        }else{
            history.push({
                pathname: "/ga-care/detail-laporan",
                state: {
                    person: pegawaiInfo.role[0],
                    id: id
                },
            });
        }

    };

    // handler fetch list laporan
    const getList = (role: any) => {
        setLoaded(true)
        getJsonPref(pref_json_pegawai_info_login).then((res) => {
            setPegawaiInfo(res)
            //console.log("res pegawai info :", res);
            /*GaCareListLaporanGAAPI(token, res.Identity).then(async (resList) => {

              const sort = dateSortByAscending(resList)
              console.log("sort", sort)
              setDataLaporan(sort)
              setLoaded(false)
            }).catch((error) => {
              console.error(error)
            })*/
            if (role == "GA") {
                GaCareListLaporanGAAPI().then(async (resList) => {

                    const sort = dateSortByAscending(resList)
                    console.log("sort", sort)
                    setDataLaporan(sort)
                    setLoaded(false)
                }).catch((error) => {
                    console.error(error)
                })
            } else {
                GaCareListLaporanAPI(res.identity).then((resList) => {
                    const sort = dateSortByAscending(resList.data)
                    setDataLaporan(sort)
                    setLoaded(false)
                }).catch((error) => {
                    console.error(error)
                    setLoaded(false)
                })
            }


        })
    }

    function doRefresh(event: CustomEvent<RefresherEventDetail>) {

        setTimeout(() => {
            event.detail.complete();
            loadDataPref();
        }, 2000);
    }


    // fetch data list laporan
    // useEffect(() => {
    //   getList()
    // }, [])

    // * FETCH DATA AGAIN
    useIonViewWillEnter(() => {
        loadDataPref();
    }, [])

    const loadDataPref = () => {
        getFuelMenu().then(menu => {
            let restRole = "";

            if (menu.includes(AUTH_FUEL_GA)) {
                restRole = 'GA';
            }

            // @ts-ignore
            setDataRole(restRole);
            // @ts-ignore
            //setDataRole(restRole);

            getPref(pref_identity).then(i => {
                setIdentity(i);
            });
            getPref(pref_pegawai_id).then(res => {
                setUserId(res);
            });
            getList(restRole);


        });
    }

    const handleSelectChange = async (event: any) => {
        GaCareListLaporanGAAPI().then((res) => {
            if (event.value !== null && event.value !== "" && event.value !== "-") {
                let data = res.filter((x: { [x: string]: { [x: string]: null; }; }) => x['status'] == event.value);
                const sort = dateSortByAscending(data)
                setDataLaporan(sort)
            } else {
                const sort = dateSortByAscending(res)
                setDataLaporan(sort)
            }
        })
    }

    // test

    return (
        <div className="bg-gradient-to-r from-red-700 to-red-500">
            <IonPage className="bg-gradient-to-r from-red-700 to-red-500">
                <ListHeader title={"Daftar Laporan"} isReplace={false} link={"/ga-care/buat-laporan"} addButton={true}/>
                <div className="bg-white px-3 pt-4 divide-y divide-gray-300">
                    <div className='top-0 z-10 mb-3'>
                        <SelectSearch
                            options={pegawaiInfo.role[0] == "GA" ? optionsGA : optionsUser}
                            isSearchable={true}
                            onChange={(event) => {
                                /*present({
                                  message: "Tunggu sebentar ...",
                                  duration: 2000,
                                  spinner: "bubbles",
                                  cssClass: "custom-loading",
                                  onWillDismiss: () => {
                                    handleSelectChange(event)
                                  }
                                })*/
                                handleSelectChange(event)
                            }}
                            placeholder={"Filter..."}/>
                    </div>
                    <div></div>
                </div>
                <IonContent className="bg-gradient-to-r from-red-700 to-red-500 bg-danger h-auto">
                    <IonRefresher slot="fixed" onIonRefresh={doRefresh}>
                        <IonRefresherContent></IonRefresherContent>
                    </IonRefresher>
                    <div className="bg-white">
                        <div className="px-3 py-3">
                            <div className="gap-3 flex flex-col">
                                {loaded && dataLaporan != null && dataLaporan.length < 0 ? (
                                    <Skeleton/>
                                ) : (
                                    <>
                                        {dataLaporan != null &&
                                            dataLaporan.map((e: any) => {
                                                return (
                                                    <CardListLaporan
                                                        key={e.id}
                                                        status={e.status === 'PROPOSED' ? "Proposed" : e.status === 'PROCESSED' ? "Progress" : e.status === "DONE" ? "Done" : e.status === "CANCELED" ? "Cancel" : e.status === "OPENED" ? "Open" : e.status}
                                                        nomor={e?.nomor}
                                                        pelapor={e?.pelapor?.name}
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
