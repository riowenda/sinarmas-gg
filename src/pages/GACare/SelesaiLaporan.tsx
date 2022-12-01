import {IonContent, IonImg, IonPage, useIonLoading} from "@ionic/react"
import React, {useMemo, useState} from "react";
import {useHistory, useLocation} from "react-router";
import {GaCareUpdateStatusAPI} from "../../api";
import {ButtonPrimary} from "../../components/Button";
import {IconPhoto} from "../../components/Icon";
import {ModalDone} from "../../components/Modal";
import {API_URL_IMAGE_GACARE, pref_identity, pref_token} from "../../constant/Index";
import {date, dateDayTimes, dateSortByAscending} from "../../helper/ConvertDate";
import {getPref} from "../../helper/Preferences";
import {Timeline} from "./components";
import Keterangan from "./components/Keterangan";
let dataRole = "";
let userId = "";
let identity_ = "";
let dataId = "";
interface CustomizedState {
    data: {

        [key: string]: string | object;
        laporan: string;
        tanggal: string;
        max_duration: string;
        kategori: {
            [key: string]: string | object;
            name: string;
            parent: {
                [key: string]: string
                name: string;
            }
        };
        lokasi: {
            [key: string]: string | object;
            name: string;
            parent: {
                [key: string]: string;
                name: string;
            }
        };
        riwayats: {
            [key: string]: string | boolean | object;
            id: string;
            identity: string;
            isActive: boolean;
            komentar: [];
            pegawai: {};
            status: string;
            tanggal: string;
        }[];
        pelapor: {
            [key: string]: string | object;
            name: string;
        };
        status: string;
        medias: {}[];
    },
    person: string;
}

const SelesaiLaporan: React.FC = () => {
    const history = useHistory();
    const location = useLocation()
    const state = location.state as CustomizedState

    const [showModalDone, setShowModalDone] = useState(false)
    const [textArea, setTextArea] = useState('')

    const {person} = state || "person"
    const {data} = state || {}

    const [present, dismiss] = useIonLoading()


    const handleBack = () => {
        history.goBack()
    };

    const StatusTextButton = useMemo(() => {
        if (data?.status === "PROPOSED" && person === "GA") {
            return "Open";
        } else if (data?.status === "PROPOSED" && person != "GA") {
            return "Proposed"
        } else if (data?.status === "OPENED") {
            return "Open"
        } else if (data?.status === "PROCESSED") {
            return "Progress"
        } else if (data?.status === 'DONE') {
            return 'Done'
        } else if (data?.status === "CANCELED") {
            return "Cancel"
        } else if (data?.status === "CLOSED") {
            return "Completed"
        }
    }, [data?.status]);

    const handleUpdateDone = () => {


        getPref(pref_identity).then((identity) => {
            let dataStatus = {
                laporan: {
                    id: data?.id
                },
                pegawai: {
                    id: identity,
                },
                status: "DONE",
                Keterangan: textArea
            }
            GaCareUpdateStatusAPI(dataStatus, identity).then((res) => {
                console.log("RESPONS", res)
                history.replace('/ga-care/list-laporan')
                setShowModalDone(false)
            }).catch((error) => {
                console.log("ERROR", error)
                setShowModalDone(false)
            })
        })
        
    }

    return (
        <IonPage>
            <IonContent fullscreen>
                <div className="bg-white min-h-screen px-5 pt-5">
                    <div
                        className="flex flex-row items-center gap-3"
                        onClick={handleBack}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="#000000"
                            stroke-width="2.5"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                        >
                            <path d="M19 12H6M12 5l-7 7 7 7"/>
                        </svg>
                        <h3 className="truncate font-lg text-black">Detail Laporan</h3>
                    </div>
                    <React.Fragment>

                        <div className="flex flex-col my-5 gap-3">
                            <Keterangan title={"Nama"} desc={data?.pelapor?.name} status={false}/>
                            <Keterangan
                                title={"Kategori"}
                                desc={data?.kategori.parent === undefined ? data?.kategori.name : `${data?.kategori?.name} | ${data?.kategori?.parent?.name}`}
                                status={false}
                            />
                            <Keterangan
                                title={"Lokasi"}
                                desc={data?.lokasi.parent === undefined ? data?.lokasi.name : `${data?.lokasi?.name} | ${data.lokasi?.parent.name}`}
                                status={false}/>
                            <Keterangan
                                title={"Laporan"}
                                desc={data?.laporan}
                                status={false}
                            />
                            <Keterangan
                                title={"Tanggal Lapor"}
                                desc={date(data?.tanggal)}
                                status={false}
                            />
                            {data?.status == "OPENED" || data?.status == "PROPOSED" ? (
                                <Keterangan
                                    title={"Response Times"}
                                    desc={`${dateDayTimes(data?.max_duration)}`}
                                    status={false}
                                />
                            ) : person == "GA" && data?.status === "PROCESSED" ? (
                                <Keterangan
                                    title={"Resolution Time"}
                                    desc={`${dateDayTimes(data?.max_duration)}`}
                                    status={false}
                                />
                            ) : person == "GA" || person == "ROLE_USER" && data?.status == "COMPLETED" ? (
                                <Keterangan
                                    title={"Resolution Time"}
                                    desc={`${dateDayTimes(data?.max_duration)}`}
                                    status={false}
                                />
                            ) : null}
                            <Keterangan
                                title={"Status"}
                                status={true}
                                statusText={StatusTextButton}
                            />
                        </div>
                        <div className="flex flex-row gap-3">
                            {data?.medias?.length > 0 ? (
                                <>
                                    {data.medias.map((e: any) => {
                                        console.log(e)
                                        return (
                                            <div className="w-[100px] h-[100px] flex justify-center">
                                                <IonImg src={`${API_URL_IMAGE_GACARE}${e.fileName}`}
                                                        className="object-cover w-full h-full"/>
                                            </div>
                                        )
                                    })}
                                </>
                            ) : (
                                <div className="flex flex-row gap-3">
                                    <IconPhoto/>
                                    <IconPhoto/>
                                </div>
                            )}
                        </div>
                        <div className="dividerDash"/>
                        <Timeline data={dateSortByAscending(data?.riwayats)}/>
                        <div className=" gap-8 my-[1.3rem]">
                            {data?.status == "CLOSED" && (
                                <span className='text-[17px] font-semibold'>Penilaian anda</span>
                            )}


                            <div className="flex flex-row justify-center items-center">
                                <ButtonPrimary color={"medium"} title={"BATALKAN"}
                                               onPress={() => history.replace("/ga-care/list-laporan")}/>
                                <ButtonPrimary color={'tertiary'} title={"SELESAI"}
                                               onPress={() => setShowModalDone(true)}/>
                            </div>
                            {/* <ButtonBottom /> */}
                        </div>
                    </React.Fragment>
                </div>
                {showModalDone && (
                    <ModalDone
                        title={"Selesaikan Laporan"}
                        valueTextArea={textArea}
                        setTextSelesai={setTextArea}
                        onUpdateStatus={() => present({
                            message: "Tunggu sebentar ..",
                            duration: 2000,
                            spinner: "bubbles",
                            onWillDismiss: () => handleUpdateDone()
                        })}
                        onSetModal={() => setShowModalDone(!showModalDone)}/>
                )}
            </IonContent>
        </IonPage>
    )
}

export default SelesaiLaporan