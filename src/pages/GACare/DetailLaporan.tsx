import { IonContent, IonPage, useIonViewDidEnter, useIonViewWillEnter, useIonLoading, IonImg } from "@ionic/react";
import React, { useEffect, useMemo, useState } from "react";
import { useHistory, useLocation } from "react-router";
import { ButtonOutline, ButtonPrimary } from "../../components/Button";
import "./style.css";
import { IconPhoto } from "../../components/Icon";
import { Timeline } from "./components";
import { ModalGALaporan } from "../../components/Modal";
import Keterangan from "./components/Keterangan";
import { date, dateDay, dateSort } from "../../helper/ConvertDate";
import i18n from "../../i18n";
import { getPref } from "../../helper/preferences";
import { API_URL_IMAGE_GACARE, pref_identity, pref_token } from "../../constant/Index";
import { GaCareDetailLaporanAPI, GaCareKomentarAPI, GaCareUpdateStatusAPI } from "../../api";
import Skeleton from "../../components/Skeleton/Skeleton";

const timelineData = [
  {
    text: "Wrote my first blog post ever on Medium",
    status: "Progress",
    progress: [
      {
        text: "Sedang dilakukan perbaikan",
        time: "10:15 WIB",
      },
      {
        text: "Perbaikan Selesai",
        time: "12:15 WIB",
      },
    ],
    category: {
      name: "Hamid - Selasa 2 Juli 2022",
      time: "11:00 WIB",
    },
    link: {
      url: "https://medium.com/@popflorin1705/javascript-coding-challenge-1-6d9c712963d2",
      text: "Read more",
    },
  },
  {
    text: "Wrote my first blog post ever on Medium Wrote my first blog post ever on Medium  ",
    status: "Open",
    Open: "Baik Pak Besok",
    category: {
      name: "Hamid - Selasa 2 Juli 2022",
      time: "12:00 WIB",
    },
    link: {
      url: "https://medium.com/@popflorin1705/javascript-coding-challenge-1-6d9c712963d2",
      text: "Read more",
    },
  },
  {
    text: "Wrote my first blog post ever on Medium",
    status: "Propose",
    category: {
      name: "Hamid - Selasa 2 Juli 2022",
      time: "15:00 WIB",
    },
    link: {
      url: "https://medium.com/@popflorin1705/javascript-coding-challenge-1-6d9c712963d2",
      text: "Read more",
    },
  },
];

interface CustomizedState {
  person: string;
  id: string;
}

interface DataState {
  [key: string]: string | object;
  laporan: string;
  tanggal: string;
  kategori: {
    [key: string]: string | object;
    name: string;
    parent: {
      [key: string]: string
      name: string;
    }
  },
  lokasi: {
    [key: string]: string | object;
    name: string;
    parent: {
      [key: string]: string;
      name: string;
    }
  },
  riwayats: {
    [key: string]: string | boolean | object;
    id: string;
    identity: string;
    isActive: boolean;
    komentar: [];
    pegawai: {};
    status: string;
    tanggal: string;
  }[]
}

const DetailLaporan: React.FC = () => {
  const history = useHistory();
  const location = useLocation();
  const state = location.state as CustomizedState;

  const { person, id } = state || 'asd';

  const [data, setData] = useState<DataState | any>()

  // loading
  const [present, dismiss] = useIonLoading()


  const [showModalProgress, setShowModalProgress] = useState(false);
  const [showModalReject, setShowModalReject] = useState(false);
  const [showModalProgressAdmin, setShowModalProgressAdmin] = useState(false);
  const [showModalKembalikan, setShowModalKembalikan] = useState(false);
  const [loaded, setLoaded] = useState(false)

  const [textAreaProgress, setTextAreaProgress] = useState("");
  const [textAreaReject, setTextAreaReject] = useState("");
  const [textAreaProgressAdmin, setTextAreaProgressAdmin] = useState("");
  const [textAreaKembalikan, setTextAreaKembalikan] = useState("");

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
    }
  }, [data?.status]);

  const handleBack = () => {
    history.goBack()
  };

  // * get data
  // useEffect(() => {

  //   getPref(pref_token).then((token) => {
  //     GaCareDetailLaporanAPI(id, token).then((res) => {
  //       setData(res.data)
  //     })
  //   })
  // }, [])

  console.log('person', person)

  // * UPDATE STATUS
  const handleUpdateStatus = (status: string, keterangan: string) => {
    let dataStatus = {
      laporan: {
        id: data?.id
      },
      pegawai: {
        id: data?.pelapor.id
      },
      status: status,
      keterangan: keterangan
    }


    getPref(pref_token).then((token) => {
      getPref(pref_identity).then((identity) => {
        present({
          message: "Tunggu sebentar ...",
          duration: 3000,
          spinner: "bubbles",
          onWillDismiss: () => GaCareUpdateStatusAPI(identity, dataStatus, token).then((result) => {
            setShowModalProgress(false)
            history.replace("/ga-care/list-laporan")
          })
        })
      })

    })
  }

  // * ADD KOMENTAR
  const handleAddKomentar = (komentar: string) => {

    const filtered: { id: string; status: string; pegawai: { id: string } }[] = data?.riwayats
    const filterRiwayat = filtered.filter(stats => stats?.status == "PROCESSED")

    let dataKomentar = {
      riwayat: {
        id: filterRiwayat[0].id
      },
      pegawai: {
        id: filterRiwayat[0].pegawai.id
      },
      komentar: komentar
    }

    getPref(pref_token).then((token) => {
      getPref(pref_identity).then((identity) => {
        present({
          message: "Tunggu sebentar ...",
          duration: 3000,
          spinner: "bubbles",
          onWillDismiss: () => GaCareKomentarAPI(identity, dataKomentar, token).then((res) => {
            setShowModalProgress(false)
          })
        })
      })
    })
  }

  console.log("DATA LAPORAN", data)


  const ButtonBottom = () => {
    if (person == "ROLE_USER" && data?.status == "PROPOSED") {
      return <ButtonOutline title={"PROSESS"} color={"tertiary"} onPress={() => setShowModalProgress(true)} />
    }
    if (person == "GA" && data?.status == "PROPOSED" || data?.status === "OPENED") {
      return (
        <React.Fragment>
          <ButtonPrimary title={"PROGRESS"} color={"tertiary"} onPress={() => setShowModalProgress(true)} />
          <ButtonPrimary
            title={"REJECT"}
            color={"danger"}
            onPress={() => setShowModalReject(true)}
          />
        </React.Fragment>
      );
    }

    if (person == "GA" && data?.status == "Open") {
      return (
        <React.Fragment>
          <ButtonOutline
            title={"as"}
            color={"tertiary"}
          />
          <ButtonPrimary
            title={"REJECT"}
            color={"danger"}
            onPress={() => setShowModalReject(true)}
          />
        </React.Fragment>
      );
    }
    if (person !== "GA" && data?.status == "DONE") {
      return (
        <React.Fragment>
          <ButtonPrimary
            title={"KONFIRMASI"}
            color={"tertiary"}
            onPress={() => history.replace("/ga-care/kirim-laporan")}
          />
          <ButtonOutline
            title={"KEMBALIKAN"}
            color={"danger"}
            onPress={() => setShowModalKembalikan(true)}
          />
        </React.Fragment>
      );
    }
    if (person === "ROLE_USER" && data?.status == "PROCESSED") {
      return <ButtonOutline
        title={"COMMENT"}
        color={"tertiary"}
      />
    }
    if (person == "GA" && data?.status == "PROCESSED") {
      return (
        <React.Fragment>
          <ButtonOutline
            title={"COMMENT"}
            color={"tertiary"}
            onPress={() => setShowModalProgress(true)}
          />
          <ButtonPrimary
            title={"DONE"}
            color={"tertiary"}
          />
        </React.Fragment>
      );
    }
    if (person == "GA" && data?.status == "DONE") {
      return (
        <div className='flex flex-row'>
          <ButtonPrimary
            title={"BATALKAN"}
            color={"medium"}
            onPress={() => setShowModalReject(true)}
          />
          <ButtonPrimary
            title={"SELESAI"}
            color={"tertiary"}
            onPress={() => setShowModalProgressAdmin(true)}
          />
        </div>
      );
    }
    return null;
  };

  // * HANDLE COMMENT AND UPDATE
  const handleComment = () => {
    console.log("DATA STATUS : ", data.status)
    if (data.status === "PROPOSED" || data.status === "OPENED") {
      present({
        message: "Tunggu sebentar ...",
        duration: 2000,
        spinner: 'bubbles',
        onDidDismiss: () => {
          handleUpdateStatus("PROCESSED", textAreaProgress)
        }
      })

    } else if (data.status === "PROCESSED") {
      present({
        message: "Tunggu sebentar ...",
        duration: 2000,
        spinner: 'bubbles',
        onDidDismiss: () => {
          handleAddKomentar(textAreaProgress)

        }
      })
    }
  }


  //* handle update status GA

  const handleUpProposeToOpen = (status: string, laporanId: string, pegawaiId: string) => {
    let dataStatus = {
      laporan: {
        id: laporanId
      },
      pegawai: {
        id: pegawaiId
      },
      status: status,
    }

    console.log("DATA STATS : ", dataStatus)
    getPref(pref_token).then((token) => {
      getPref(pref_identity).then((identity) => {
        GaCareUpdateStatusAPI(identity, dataStatus, token).then((result) => {
          console.log("result update status", result)
          GaCareDetailLaporanAPI(id, token).then((res) => {
            console.log("res detail laporan : ", res.data)
            setData(res.data)
            setLoaded(false)
          })

        }).catch((error) => {
          console.error(error)
          setLoaded(false)
        })
      })

    })
  }


  useIonViewWillEnter(() => {
    setLoaded(true)
    getPref(pref_token).then((token) => {

      present({
        message: "Tunggu sebentar ...",
        duration: 3000,
        spinner: "bubbles",
        onWillDismiss: () => GaCareDetailLaporanAPI(id, token).then((res) => {
          setData(res.data)
          if (person === "GA" && res.data.status === "PROPOSED") {
            handleUpProposeToOpen("OPENED", res.data.id, res.data.pelapor.id)
          } else {
            setLoaded(false)
          }
        })
      })
    })
  }, [])

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
              <path d="M19 12H6M12 5l-7 7 7 7" />
            </svg>
            <h3 className="truncate font-lg text-black">Detail Laporan</h3>
          </div>
          {loaded == false && (
            <React.Fragment>

              <div className="flex flex-col my-5 gap-3">
                <Keterangan title={"Nama"} desc={data?.pelapor.name} status={false} />
                <Keterangan
                  title={"Kategori"}
                  desc={data?.kategori.parent === undefined ? data?.kategori.name : `${data?.kategori?.name} | ${data?.kategori?.parent?.name}`}
                  status={false}
                />
                <Keterangan
                  title={"Lokasi"}
                  desc={data?.lokasi.parent === undefined ? data?.lokasi.name : `${data?.lokasi?.name} | ${data.lokasi?.parent.name}`}
                  status={false} />
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
                    desc={`${data?.duration}`}
                    status={false}
                  />
                ) : person == "GA" && data?.status === "PROCESSED" ? (
                  <Keterangan
                    title={"Resolution Time"}
                    desc={`${data?.duration}`}
                    status={false}
                  />
                ) : person == "GA" || person == "ROLE_USER" && data?.status == "COMPLETED" ? (
                  <Keterangan
                    title={"Resolution Time"}
                    desc={`${data?.duration}`}
                    status={false}
                  />
                ) : null}
                <Keterangan
                  title={"Status"}
                  status={true}
                  statusText={StatusTextButton}
                />
              </div>
              {/* {person === "ROLE_USER" && (
                <div className="flex flex-row gap-3">
                  <IconPhoto />
                  <IconPhoto />
                </div>
              )} */}
              <div className="flex flex-row gap-3">
                {data?.medias?.length > 0 ? (
                  <>
                    {data.medias.map((e: any) => {
                      console.log(e)
                      return (
                        <div className="w-[100px] h-[100px] flex justify-center">
                          <IonImg src={`${API_URL_IMAGE_GACARE}${e.fileName}`} className="object-cover w-full h-full" />
                        </div>
                      )
                    })}
                  </>
                ) : (
                  <div className="flex flex-row gap-3">
                    <IconPhoto />
                    <IconPhoto />
                  </div>
                )}
              </div>
              <div className="dividerDash" />
              <Timeline data={dateSort(data?.riwayats)} />
              <div className=" gap-8 my-[1.3rem]">
                <ButtonBottom />
              </div>
            </React.Fragment>
          )}
        </div>

        {loaded && <Skeleton />}
        {showModalProgress && (
          <ModalGALaporan
            title={"Progress"}
            valueTextArea={textAreaProgress}
            setTextProgress={setTextAreaProgress}
            onSetModal={() => setShowModalProgress(!showModalProgress)}
            colorButton={"tertiary"}
            titleButton={"COMMENT"}
            statusUpload={false}
            onUpdateStatus={handleComment}
          />
        )}
        {showModalReject && (
          <ModalGALaporan
            title={"Batalkan Laporan"}
            valueTextArea={textAreaReject}
            setTextProgress={setTextAreaReject}
            onSetModal={() => setShowModalReject(!showModalReject)}
            colorButton={"danger"}
            titleButton={"REJECT"}
            statusUpload={false}
            onUpdateStatus={() => handleUpdateStatus("CANCELED", textAreaReject)}
          />
        )}
        {showModalProgressAdmin && (
          <ModalGALaporan
            title={"Selesaikan Laporan"}
            valueTextArea={textAreaProgressAdmin}
            setTextProgress={setTextAreaProgressAdmin}
            onSetModal={() =>
              setShowModalProgressAdmin(!showModalProgressAdmin)
            }
            colorButton={"tertiary"}
            titleButton={"PROSES"}
            statusUpload={false}
          />
        )}
        {showModalKembalikan && (
          <ModalGALaporan
            title={"Pengembalian"}
            valueTextArea={textAreaKembalikan}
            setTextProgress={setTextAreaKembalikan}
            onSetModal={() => setShowModalKembalikan(!showModalKembalikan)}
            statusUpload={true}
          />
        )}
      </IonContent>
    </IonPage>
  );
};

export default DetailLaporan;
