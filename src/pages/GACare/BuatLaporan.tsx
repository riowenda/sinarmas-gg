import { IonContent, IonImg, IonPage, IonLoading, useIonLoading } from "@ionic/react";
import React, { useState, useEffect } from "react";
import { useHistory } from "react-router";
import {
  BuatLaporanApi,
  GaCareKategoriAPI,
  LokasiKerjaApi,
  PegawaiListSelec2API,
} from "../../api";
import { pref_identity, pref_token, pref_user_role } from "../../constant/Index";
import { getPref } from "../../helper/preferences";
import { ButtonOutline, ButtonPrimary } from "../../components/Button";
import { usePhotoGallery } from "../../components/Camera";
import { ModalImage, ModalSubmit } from "../../components/Modal";
import SelectSearch from "../../components/SelectSearch/SelectSearch";
import DropDownComponent from "../../components/DropDownComponent";
import { TreeSelectComponent } from "../../components/Select";

interface DataStorage {
  token?: string,
  identity?: string,
  role?: string
}



const BuatLaporan: React.FC = () => {
  const { takePhoto, medias, mediaReview } = usePhotoGallery();

  const history = useHistory();
  const [showModal, setShowModal] = useState(false);
  const [successSubmit, setSuccessSubmit] = useState(false);
  const [laporan, setLaporan] = useState("");
  const [dataStorage, setDataStorage] = useState<DataStorage>()

  const [dataIdentity, setDataIdentity] = useState('')
  const [dataToken, setDataToken] = useState('')
  const [dataRole, setDataRole] = useState()

  // state data user
  const [loadingDataUser, setLoadingDataUser] = useState(false)
  const [dataUser, setDataUser] = useState([])
  const [singleDataUser, setSingleDataUser] = useState({ value: '', label: '' })

  // state data kategori
  const [dataKategori, setDataKategori] = useState([])
  const [singleDataKategori, setSingleDataKategori] = useState('')

  // state data lokasi
  const [dataLokasi, setDataLokasi] = useState([])
  const [singleDataLokasi, setSingleDataLokasi] = useState('')

  const [present, dismiss] = useIonLoading()

  const handleOkButton = () => {
    setSuccessSubmit(!successSubmit);
  };

  const handleKirimLaporan = () => {

    const laporanData = {
      laporan: laporan,
      pelapor: dataIdentity,
      kategori: singleDataKategori,
      lokasi: singleDataLokasi,
      medias: medias
    }

    console.log("LAPORAN DATA STATIC", laporanData);
    BuatLaporanApi(dataToken, dataIdentity, laporanData).then((res) => {
      console.log("respon kirim laporan", res)
      if (res.status == "SUCCESS") {

        history.replace('/ga-care/list-laporan')
      } else {
        console.log("res", res)
      }
    });
  };

  const handleKirimLaporanGA = () => {
    const laporanData = {
      laporan: laporan,
      pelapor: singleDataUser.value,
      kategori: singleDataKategori,
      lokasi: singleDataLokasi,
      medias: medias
    }

    console.log("LAPORAN DATA STATIC", laporanData);
    BuatLaporanApi(dataToken, dataIdentity, laporanData).then((res) => {
      console.log("respon kirim laporan GA", res)
      if (res.status == "SUCCESS") {
        console.log("ini identity user yang di pilih ketika buat laporan dengan akun role GA : ", singleDataUser.value)
        history.replace('/ga-care/list-laporan')
      } else {
        console.log("res", res)
      }
    });
  }

  // get data user with searchable
  const handleSearchUser = (term: string) => {
    setLoadingDataUser(true)
    getPref(pref_token).then((token) => {
      PegawaiListSelec2API(term, token).then((resSelect) => {
        const options = resSelect.data.map((d: any) => ({
          "value": d.id,
          "label": d.name
        }))
        setDataUser(options)

      })
    })
    setLoadingDataUser(false)
  }



  // function get data kategori
  const handleGetDataKategori = () => {
    getPref(pref_token).then((token) => {
      GaCareKategoriAPI(token).then((resKategori) => {
        setDataKategori(resKategori)
        console.log("RES KATEGORI", resKategori)
      })
    })
  }

  // function get data lokasi
  const handleGetDataLokasi = () => {
    getPref(pref_token).then((token) => {
      LokasiKerjaApi(token).then((resLokasi) => {
        setDataLokasi(resLokasi)
      });
    })
  }

  useEffect(() => {
    // * GET DATA KATEGORI
    handleGetDataKategori()

    // * GET DATA LOKASI
    handleGetDataLokasi()

    // * ------------------------------------------

    getPref(pref_user_role).then((role) => {
      setDataRole(role)
    })
    getPref(pref_identity).then((identity) => {
      setDataIdentity(identity)
    });
  }, []);


  return (
    <IonPage>
      <IonContent fullscreen>
        <div className="bg-white pt-5 pl-5 pr-5 min-h-screen flex flex-col">
          <h3 className="truncate text-lg font-semibold text-black mb-5">
            Buat Laporan
          </h3>

          {/* * DROPDOWN * */}
          {dataRole === 'GA' && (
            <DropDownComponent
              title={"User"}>
              <SelectSearch
                options={dataUser}
                onInputChange={(e: any) => handleSearchUser(e)}
                isSearchable={true}
                isLoading={loadingDataUser}
                onChange={(e: any) => setSingleDataUser(e)} />
            </DropDownComponent>
          )}
          <DropDownComponent
            title={"Kategori"}>
            <TreeSelectComponent
              data={dataKategori}
              onChange={(e) => setSingleDataKategori(e)} />
          </DropDownComponent>
          <DropDownComponent
            title={"Lokasi"}>
            <TreeSelectComponent
              data={dataLokasi}
              onChange={(e) => setSingleDataLokasi(e)} />
          </DropDownComponent>

          <h3 className="truncate text-base font-medium text-black">Laporan</h3>
          <textarea
            placeholder="Keran kamar mandi rusak"
            id="laporan"
            className="p-2 border-2 w-full min-h-[150px] max-h-[200px] mb-3"
            value={laporan}
            onChange={(e) => {
              setLaporan(e.target.value);
            }}
          ></textarea>

          <div className="flex gap-3">
            {mediaReview.map((photo, index) => (
              <div
                className="w-[100px] bg-black h-[100px] flex justify-center"
                key={index}
              >
                <IonImg
                  src={photo.base64}
                  className="object-cover w-full h-full"
                />
              </div>
            ))}
          </div>

          <div className="justify-center flex items-center my-[1rem]">
            <ButtonOutline
              color={"tertiary"}
              title={"UPLOAD"}
              onPress={() => takePhoto().then((res) => { })}
            />
          </div>
          <ButtonPrimary
            color={"primary"}
            title={"KIRIM"}
            onPress={handleOkButton}
          />
        </div>

        {showModal && <ModalImage />}
        {successSubmit && (
          <ModalSubmit
            handleOkButton={() => {
              present({
                message: "Tunggu sebentar ...",
                duration: 3000,
                spinner: 'bubbles',
                cssClass: 'custom-loading',
                onWillDismiss: () => {
                  handleKirimLaporan()
                }
              })

            }}
            successSubmit={() => setSuccessSubmit(!successSubmit)}
          />
        )}
      </IonContent>
    </IonPage>
  );
};

export default BuatLaporan;
