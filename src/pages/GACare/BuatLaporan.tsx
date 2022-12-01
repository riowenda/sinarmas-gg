import {
    IonContent, IonImg, IonPage, IonLoading, useIonLoading, useIonViewWillEnter, useIonToast, IonRefresher,
    IonRefresherContent, useIonAlert,
} from "@ionic/react";
import './BuatLaporan.css';
import React, {useState, useEffect} from "react";
import {useHistory, useLocation} from "react-router";
import {
    BuatLaporanApi,
    GaCareKategoriAPI,
    LokasiKerjaApi,
    PegawaiListSelec2API,
} from "../../api";
import {
    API_URI, AUTH_FUEL_GA,
    GA_CARE_KATEGORI_URI_LIST_TREE,
    GA_CARE_LAPORAN_URI_CREATE,
    GA_CARE_TIPE_URI_LIST,
    LOKASI_KERJA_URI_LIST_TREE,
    MD_PEGAWAI_URI_LIST_SELECT,
    pref_identity,
    pref_json_pegawai_info_login,
    pref_token,
    pref_unit,
    pref_user_role,
} from "../../constant/Index";
import {getFuelMenu, getJsonPref, getPref} from "../../helper/Preferences";
import {ButtonOutline, ButtonPrimary} from "../../components/Button";
import SelectSearch from "../../components/SelectSearch/SelectSearch";
import DropDownComponent from "../../components/DropDownComponent";
import {TreeSelect2, TreeSelectComponent} from "../../components/Select";
import {GaCareTipeAPI} from "../../api/GaCareTipeAPI";
import ListHeader from "../../components/Header/ListHeader";
import TextareaExpand from "react-expanding-textarea";
import {TreeDataNode, TreeSelect} from "antd";
import DropdownTreeSelect from "react-dropdown-tree-select";
import {RefresherEventDetail} from "@ionic/core";
import {useTranslation} from "react-i18next";
import 'antd/dist/antd.css';
/*import {Camera, CameraResultType, CameraSource} from "@capacitor/camera";*/
import {BaseAPI} from "../../api/ApiManager";
import {usePhotoGallery} from "../../components/Camera";

/*
export interface Medias {
    data?: string,
    fileName?: string,
}

export interface MediaReview {
    base64?: string

}
*/

const {TreeNode} = TreeSelect;
/*const [medias, setMedias] = useState<>([]);
const [mediaReview, setMediaReview] = useState<>([])*/

interface DataStorage {
    token?: string,
    identity?: string,
    role?: string
}

let dataRole = "";
/*let userId = "";*/
let identity_ = "";
/*let MediaReview any;
let  Medias any;*/
const BuatLaporan: React.FC = () => {
    const {takePhoto, medias, mediaReview} = usePhotoGallery();

    const [userId, setUserId] = useState("");
    /*const [photo, setPhoto] = useState<any>(null);*/
    /*const [medias, setMedias] = useState<any>([]);
    const [mediaReview, setMediaReview] = useState<any>([])*/
    /*const [medias, setMedias] = useState<Medias[]>([]);
    const [mediaReview, setMediaReview] = useState<MediaReview[]>([])*/

    const history = useHistory();
    const [showModal, setShowModal] = useState(false);
    const [successSubmit, setSuccessSubmit] = useState(false);
    const [laporan, setLaporan] = useState("");
    const [dataStorage, setDataStorage] = useState<DataStorage>()

    const [dataIdentity, setDataIdentity] = useState('')
    const [dataToken, setDataToken] = useState('')


    // state data user
    const [loadingDataUser, setLoadingDataUser] = useState(false)
    const [dataUser, setDataUser] = useState([])
    const [singleDataUser, setSingleDataUser] = useState({value: '', label: ''})


    // state data kategori
    const [dataKategori, setDataKategori] = useState([])
    const [dataKategoriParent, setDataKategoriParent] = useState([])

    // state data lokasi
    const [dataLokasi, setDataLokasi] = useState([])
    const [singleDataLokasi, setSingleDataLokasi] = useState({value: '', label: ''})

    // state data tipe
    const [dataTipe, setDataTipe] = useState([])
    const [singleDataTipe, setSingleDataTipe] = useState({value: '', label: ''})
    const [photo, setPhoto] = useState<any>(null);

    const [present, dismiss] = useIonLoading()
    const handleOkButton = () => {
        setSuccessSubmit(!successSubmit);
    };

    /*const handleKirimLaporan = () => {

        console.log("Pelapor: ", dataIdentity);
        const laporanData = {
            laporan: laporan,
            pelapor: dataIdentity,
            kategori: singleDataKategori.value,
            lokasi: singleDataLokasi.value,
            tipe: singleDataTipe.value,
            medias: medias
        }

        console.log("LAPORAN DATA STATIC", laporanData);
        BuatLaporanApi(laporanData).then((res) => {
            if (res.status == "SUCCESS") {

                history.replace('/ga-care/list-laporan')
            } else {
                console.log("res", res)
            }
        });
    };*/

    /*const handleKirimLaporanGA = () => {
        const laporanData = {
            laporan: laporan,
            pelapor: singleDataUser.value,
            kategori: singleDataKategori.value,
            lokasi: singleDataLokasi.value,
            tipe: singleDataTipe.value,
            medias: medias
        }

        console.log('laporan data : ', laporanData)

        console.log("LAPORAN DATA STATIC", laporanData);
        BuatLaporanApi(laporanData).then((res) => {
            if (res.status == "SUCCESS") {
                console.log("ini identity user yang di pilih ketika buat laporan dengan akun role GA : ", singleDataUser.value)
                history.replace('/ga-care/list-laporan')
            } else {
                console.log("res", res)
            }
        });
    }*/


    // get data user with searchable
    const handleSearchUser = () => {
        PegawaiListSelec2API().then((resSelect) => {
            const options = resSelect.map((d: any) => ({
                "value": d.id,
                "label": d.name
            }));
            setDataUser(options);
            console.log("buat resSelect: ", options);
        })
        //setLoadingDataUser(true)
    }
    const handleSearchUser2 = (term: any) => {
        //setLoadingDataUser(true);
        //userId = term.value;
        setUserId(term.value);
        //console.log("UserId: ", userId);
    }


    /*const handleGetDataKategoriParent = ((d: any) => {

      console.log("parent data: ", d);
      const options = d.map((x: any) => ({

        label : x.name != undefined ? x.name : x.name,
        value : x.name != undefined ? x.id : x.id,
        children : x.children != undefined ? [
          {
            label : x.children.name,
            value : x.children.id
          }
        ] : null,
      }));
      setDataKategoriParent(options)
    });*/
    // function get data kategori
    const getRootNodes = () => {
        // @ts-ignore
        const data = nodes.filter(node => node.children === null);
        const options = data.map((d: any) => ({
            label: d.name != undefined ? d.name : d.name,
            value: d.name != undefined ? d.id : d.id,
            children: d.children != undefined ? getChildNodes(d) : null,
        }));

        // @ts-ignore
        setNodes(options);
        console.log("Tree: ", nodes);
        return nodes; //nodes.filter(node => node.children === null)
    }
    const getChildNodes = (node: { children: any; }) => {
        if (!node.children) return [];
        // @ts-ignore
        return nodes.children.map(parent => nodes(parent));
    }
    const handleGetDataKategori = () => {
        GaCareKategoriAPI().then((resKategori) => {
            setNodes(resKategori.data);
        })
    }

    const findDuplicate = (arr: any) => {
        let sorted_arr = arr.slice().sort()

        let results = []
        for (let i = 0; i < sorted_arr.length - 1; i++) {
            if (sorted_arr[i + 1] === sorted_arr[i].id) {
                results.push(sorted_arr[i].id)
            }
        }

        //console.log('Result duplicate', results)
    }

    const handleGetDataTipe = () => {
        GaCareTipeAPI().then((resTipe) => {
            //console.log("TIPE RESULT : ", resTipe)
            const options = resTipe.map((d: any) => ({
                "value": d.id,
                "label": d.name
            }))
            //console.log("Options tipe :", options)
            setDataTipe(options)
        })
    }

    useIonViewWillEnter(() => {

        /*getPref(pref_user_role).then((role) => {
          setDataRole(role)
        })*/
        getPref(pref_identity).then((identity) => {
            setDataIdentity(identity);
            identity_ = identity;
        });
        loadDataPref();
        // * GET DATA KATEGORI
        /*handleGetDataKategori()*/

        /*// * GET DATA LOKASI
        handleGetDataLokasi()*/

        // * GET DATA TIPE
        /*handleGetDataTipe()*/

        // * GET DATA USER EARLY ACCESS

    }, [])


    /* Start Data Baru */

    /* Start Baru */
    const obj = {
        pegawaiUnit: {id: ""},
        odometerPermintaan: null,
        odometerPermintaanImg: null,
        odometerPengisianSebelumnya: 0,
        odometerPengisian: 0,
        odometerPengisianImg: null,
        status: null,
        riwayats: null,
        permintaanDataImg: null,
        pengisianDataImg: null
    }
    const userInfo = {name: "", nik: "", imageUrl: ""}
    const [user, setUser] = useState(userInfo);
    const [identity, setIdentity] = useState(null);
    const [nodes, setNodes] = useState([])
    const [nodesLokasiKerja, setNodesLokasiKerja] = useState([])
    const [type, setTypes] = useState([])
    const [token, setToken] = useState("")
    const [pegawai, setPegawai] = useState([])
    const [singleDataKategori, setSingleDataKategori] = useState({value: '', label: ''})
    const [toast] = useIonToast();
    /*const [photo, setPhoto] = useState<any>();*/
    const [treeLine] = useState(true);


    const [data, setData] = useState<any>(obj);
    const [showConfirm] = useIonAlert();
    const [lastOdo, setLastOdo] = useState<any>("N/A");
    const {t} = useTranslation();
    const location = useLocation();
    const [terms, setTerms] = useState();

    interface DataStorage {
        token?: string,
        identity?: string,
        role?: string
    }

    /* Start Baru */
    function doRefresh(event: CustomEvent<RefresherEventDetail>) {
        console.log('Begin async operation');

        setTimeout(() => {
            console.log('Async operation has ended');
            event.detail.complete();
        }, 2000);
    }

    const loadDataPref = () => {
        getJsonPref(pref_json_pegawai_info_login).then(res => {
            setUser(res);
            setUserId(res.userId);// = res.userId;
            //console.log("kasih userId2: ", userId);
        });
        getPref(pref_identity).then(res => {
            setIdentity(res);
            identity_ = res;
        });
        getPref(pref_token).then(res => {
            setToken(res);
        });
        getFuelMenu().then(menu => {
            let restRole = "";

            if (menu.includes(AUTH_FUEL_GA)) {
                restRole = 'GA';
                // @ts-ignore
                dataRole = restRole;
                // @ts-ignore
                //setDataRole(restRole);
            }
            //this.dataR

            // @ts-ignore
            //setDataRole(restRole);
            console.log("rest role: ", restRole);
            console.log("cek role: ", dataRole);
            console.log("cek menu: ", menu);


        });
        // @ts-ignore
        //setDataUser(user.id)


        //console.log("cek data user: ", dataUser.id);

        loadDataKategori();
        loadDataLokasi();
        /*loadDataPegawai(terms);*/
        /*loadDataTypes();*/
        handleGetDataTipe();
        handleSearchUser();

    }
    /* const BuatLaporanApi(dataToken, dataIdentity, laporanData).then((res) => {
       if (res.status == "SUCCESS") {

         history.replace('/ga-care/list-laporan')
       } else {
         console.log("res", res)
       }
     });*/
    /* Start baru */
    const loadDataTypes = () => {
        const url = BaseAPI() + API_URI + GA_CARE_TIPE_URI_LIST;

        fetch(url, {
            method: 'GET',
            // @ts-ignore
            headers: {Identity: identity_}
        })
            .then(res => res.json())
            .then(
                (result) => {
                    if (result != null) {
                        setTypes(result);
                        console.log("Hasil Types: ", result);
                    }
                },
                // Note: it's important to handle errors here
                // instead of a catch() block so that we don't swallow
                // exceptions from actual bugs in components.
                (error) => {
                    toast({
                            message: "Terjadi kesalahan! [" + error.message + "]", duration: 1500, position: "top"
                        }
                    );
                }
            )
    }
    const loadDataKategori = () => {
        const url = BaseAPI() + API_URI + GA_CARE_KATEGORI_URI_LIST_TREE;
        fetch(url, {
            method: 'GET',
            // @ts-ignore
            headers: {Identity: identity_}
        })
            .then(res => res.json())
            .then(
                (result) => {
                    if (result.status === "SUCCESS") {
                        setNodes(result.data);
                        console.log("Hasilnya: ", result.data);
                    }
                },
                // Note: it's important to handle errors here
                // instead of a catch() block so that we don't swallow
                // exceptions from actual bugs in components.
                (error) => {
                    toast({
                            message: "Terjadi kesalahan! [" + error.message + "]", duration: 1500, position: "top"
                        }
                    );
                }
            )
    }
    const loadDataLokasi = () => {
        const url = BaseAPI() + API_URI + LOKASI_KERJA_URI_LIST_TREE;
        fetch(url, {
            method: 'GET',
            // @ts-ignore
            headers: {Identity: identity_}
        })
            .then(res => res.json())
            .then(
                (result) => {
                    if (result.status === "SUCCESS") {
                        setNodesLokasiKerja(result.data);
                        //console.log("Hasilnya: ", result.data);
                    }
                },
                // Note: it's important to handle errors here
                // instead of a catch() block so that we don't swallow
                // exceptions from actual bugs in components.
                (error) => {
                    toast({
                            message: "Terjadi kesalahan! [" + error.message + "]", duration: 1500, position: "top"
                        }
                    );
                }
            )
    }

    const sendRequest = () => {
        //e.preventDefault();
        /*if(e == "ok") {
            console.log("Sendrequest", e);
        }*/

        console.log("Medias: ", medias);

        const laporanData = {
            laporan: laporan,
            // @ts-ignore
            pelapor: userId,
            kategori: singleDataKategori.value,
            lokasi: singleDataLokasi.value,
            tipe: singleDataTipe.value,
            status: "PROPOSED",
            medias: medias
        }
        console.log("yang dikirim: ", laporanData);
        if (medias) {
            const loading = present({
                message: 'Memproses permintaan ...',
                backdropDismiss: false
            })

            const url = BaseAPI() + API_URI + GA_CARE_LAPORAN_URI_CREATE;

            fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Identity': identity_ != null && identity_ != "" ? identity_ : ''
                },
                body: JSON.stringify(laporanData)
            })
                .then(res => res.json())
                .then(
                    (result) => {
                        dismiss();
                        if (result.status === 'SUCCESS') {
                            showConfirm({
                                //simpan unit id ke pref
                                subHeader: "Pembuatan Laporan berhasil!",
                                backdropDismiss: false,
                                buttons: [
                                    {
                                        text: 'OK',
                                        cssClass: 'alert-button-confirm',
                                        handler: () => {
                                            history.goBack();
                                            // history.push("/ga-care/list-laporan");
                                        }
                                    },
                                ],
                            })
                        } else {
                            dismiss();
                            toast({
                                    message: "Terjadi kesalahan!", duration: 1500, position: "top"
                                }
                            );
                        }
                    },
                    (error) => {
                        dismiss();
                        toast({
                                message: "Terjadi kesalahan! [" + error.message + "]", duration: 1500, position: "top"
                            }
                        );
                    }
                )
        } else {
            toast({
                    message: "Foto harus disertakan", duration: 1500, position: "top"
                }
            );
        }

    };

    const showOkConfirm = (msg: any) => {
        showConfirm({
            //simpan unit id ke pref
            subHeader: msg,
            backdropDismiss: false,
            buttons: [
                {
                    text: 'OK',
                    cssClass: 'alert-button-confirm',
                },
            ],
        })
    }
    /*const takePhoto = async  () => {
        //console.log("foto: ");
        await Camera.getPhoto({
            resultType: CameraResultType.Base64,
            source: CameraSource.Camera,
            quality: 30
        })
            .then((res) => {
                console.log("Ambil fhoto: ", res);
                let imgs = res.base64String;
                let imgName = (new Date().getTime().toString()) + "." + res.format;
                const newMedias = [
                    {
                        data: res.base64String,
                        fileName: imgName
                    }
                ]

                const newMediaReview = [
                    {
                        base64: "data:image/jpeg;base64," + res.base64String,
                    }
                ]
                /!*if(medias != null && medias.length > 0){
                    newMedias.push(medias);

                }*!/
                /!*const newMedias = [
                    {
                        data: res.base64String,
                        fileName: imgName
                    }
                ]

                const newMediaReview = [
                    {
                        base64: "data:image/jpeg;base64," + res.base64String,
                    }
                ]*!/


                // @ts-ignore
                setMedias(newMedias);
                setMediaReview(newMediaReview);
                console.log("Ambil newMedias: ", newMedias);
                console.log("Ambil newMediaReview: ", newMediaReview);
            })
            .catch((err) => {
                //console.log(err);
            });
    };*/


    /*const showAlertConfirmed = () => {
      dismiss();
      showConfirm({
        //simpan unit id ke pref
        subHeader: 'Anda belum mengisi form P2H, isi sekarang?',
        buttons: [
          {
            text: 'Batal',
            cssClass: 'alert-button-cancel',
            handler: () => {
              history.goBack();
              // history.push("/fuel/homepage");
            }
          },
          {
            text: 'Ya',
            cssClass: 'alert-button-confirm',
            handler: () => {
              history.replace("/fuel/p2h/p2hlist");
            }
          },
        ],
      })
    }*/

    /* End Baru */
    /* End Data Baru */
    /*const takePhoto = async () => {
        await Camera.getPhoto({
            resultType: CameraResultType.Base64,
            source: CameraSource.Camera,
            quality: 30
        })
            .then((res) => {
                console.log(res);
                let imgs = res.base64String;
                let imgName = (new Date().getTime().toString()) + "." + res.format;
                // @ts-ignore
                setData({ ...data, permintaanDataImg: imgs, odometerPermintaanImg: imgName });
                setPhoto(res);
            })
            .catch((err) => {
                console.log(err);
            });
    };*/

    // @ts-ignore
    // @ts-ignore
    // @ts-ignore
    // @ts-ignore
    return (
        <IonPage>

            <IonContent fullscreen>
                <IonRefresher slot="fixed" onIonRefresh={doRefresh}>
                    <IonRefresherContent></IonRefresherContent>
                </IonRefresher>
                <div className="bg-white flex flex-col min-h-screen justify-between">

                    {/* === Start Form  === */}
                    {/*<form>*/}
                    <div>
                        {/* === Start Header === */}
                        <ListHeader title={"Form Pembuatan Laporan"} isReplace={false} link={""} addButton={false}/>
                        {/* === End Header ===*/}

                        <div className="p-6">
                            {// @ts-ignore
                                dataRole === 'GA' && (
                                    <div>
                                        <label className="block text-sm text-gray-400">
                                            User
                                        </label>
                                        <div>

                                            <DropDownComponent
                                                title={""}>
                                                <SelectSearch
                                                    options={dataUser}
                                                    //onInputChange={(e: any) => handleSearchUser(e)}
                                                    //onSelect ={(e: any) => handleSearchUser(e)}
                                                    isSearchable={true}
                                                    isLoading={loadingDataUser}

                                                    onChange={(e: any) => handleSearchUser2(e)}
                                                    /*onChange={(e: any) => userId = e.selectedIndex}*/
                                                    /*onChange={(e: any) => setSingleDataUser(e)}*/
                                                />
                                            </DropDownComponent>

                                        </div>
                                    </div>
                                )}

                            <div className="mt-4">
                                <label className="block text-sm text-gray-400">
                                    Tipe
                                </label>
                                <div>
                                    <DropDownComponent
                                        title="">
                                        <SelectSearch
                                            options={dataTipe}

                                            onChange={(e: any) => setSingleDataTipe(e)}
                                            isSearchable={false}/>
                                    </DropDownComponent>
                                </div>
                            </div>

                            <div className="mt-4">
                                <label className="block text-sm text-gray-400">
                                    Kategori
                                </label>
                                <div>
                                    <DropDownComponent title="">
                                        <span className="text-[12px]">{singleDataKategori.label}</span>

                                        {/* eslint-disable-next-line react/jsx-no-undef */}
                                        {/*<DropdownTreeSelect data={nodes} showPartiallySelected={true} mode={'select'} />
*/}
                                        <DropdownTreeSelect
                                            // @ts-ignore
                                            treeLine={treeLine} style={{color: "black", width: 350}}
                                            data={nodes}
                                            placeholder={"Select............"}
                                            onChange={(currentNode: any, selectedNodes: any) => {
                                                setSingleDataKategori(currentNode);
                                            }}
                                        />
                                    </DropDownComponent>
                                    {/*<TreeSelect
                          // @ts-ignore
                          treeLine={treeLine} style={{ color: "black", width: 350 }}
                          onChange={onChange}
                          placeholder={"Select............"}>
                        {nodes.length > 0 && nodes.map((e: any, i: React.Key | null | undefined) => {
                          return (
                              <TreeNode
                                  key={i}
                                  value={e.value}
                                  title={e.label}>
                                 {e.parent != undefined && <TreeNode value={e.parent.id} title={e.parent.name} />}
                                <TreeNode
                                    treeLine={treeLine} style={{ color: "black", width: 350 }}
                                    value={e?.parent?.children.value} title={e?.parent?.children.label} />
                              </TreeNode>
                          )
                        })}
                      </TreeSelect>*/}
                                </div>
                            </div>

                            <div className="mt-4">
                                <label htmlFor='odometer' className="block text-sm text-gray-400">
                                    Lokasi
                                </label>
                                <div className="border-b border-gray-300 py-2">
                                    {/*<DropDownComponent title="">
                        <span className="text-[12px]">{singleDataLokasi.label}</span>

                         eslint-disable-next-line react/jsx-no-undef
                        <DropdownTreeSelect data={nodes} showPartiallySelected={true} mode={'select'} />

                        <DropdownTreeSelect
                            // @ts-ignore
                            treeLine={treeLine} style={{ color: "black", width: 350 }}
                            data={nodesLokasiKerja}
                            placeholder={"Select............"}
                            onChange={(currentNode: any, selectedNodes : any) => {
                              setSingleDataLokasi(currentNode);
                            }}
                        />
                      </DropDownComponent>*/}

                                    <DropDownComponent
                                        title={""}>
                                        <span className="text-[12px]">{singleDataLokasi.label}</span>
                                        <TreeSelect2
                                            // @ts-ignore
                                            data={nodesLokasiKerja}
                                            onChange={async (currentNode: any, selectedNodes: any) => {
                                                setSingleDataLokasi(currentNode)

                                            }}/>
                                    </DropDownComponent>
                                </div>
                            </div>
                            <div className="mt-4">
                                <label htmlFor='laporan' className="block text-sm text-gray-400">
                                    Laporan
                                </label>
                                <TextareaExpand
                                    className="block w-full border-b border-gray-300 py-2 px-2"
                                    id="laporan"
                                    name="laporan"
                                    value={laporan}
                                    onChange={(e) => {
                                        setLaporan(e.target.value);
                                    }}

                                />
                            </div>
                            <div className="mt-4">
                                <label htmlFor='odometer' className="block text-sm text-gray-400">
                                    Foto
                                </label>
                                <div className="w-full grid grid-cols-2 gap-2 flex items-center rounded-md py-2 px-2">
                                {mediaReview.map((photo, index) => (
                                    <>
                                        <div
                                            className="group block rounded-lg aspect-auto bg-gray-100 overflow-hidden"
                                            key={index}>
                                            <img className="object-cover pointer-events-none"
                                                 src={photo.base64}></img>
                                        </div>
                                    </>
                                ))}
                                </div>
                                {/*{mediaReview.map((photo: { base64: string | undefined; }, index: React.Key | null | undefined) => (
                                    <>
                                        <div
                                            className="group block rounded-lg aspect-auto bg-gray-100 overflow-hidden"
                                            key={index}>
                                            <img className="object-cover pointer-events-none"
                                                 src={photo.base64}></img>
                                        </div>
                                    </>
                                ))}*/}

                                <div className="rounded-md border-2 border-dashed border-gray-300 py-10">
                                    <>
                                        <div className="flex justify-center">
                                            <button onClick={() => takePhoto().then((res) => {
                                            })}
                                                    className="items-center rounded-full bg-slate-800 px-3 py-3 text-white">
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"
                                                     fill="currentColor" className="w-5 h-5">
                                                    <path fill-rule="evenodd"
                                                          d="M1 8a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 018.07 3h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0016.07 6H17a2 2 0 012 2v7a2 2 0 01-2 2H3a2 2 0 01-2-2V8zm13.5 3a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM10 14a3 3 0 100-6 3 3 0 000 6z"
                                                          clip-rule="evenodd"/>
                                                </svg>
                                            </button>
                                        </div>
                                        <p className="mt-1 text-xs text-center text-gray-500">Upload Foto</p></>
                                </div>
                            </div>


                        </div>
                    </div>
                    {/*<button onClick={btnDetailReqFuel}>*/}
                    {/*    Detail*/}
                    {/*</button>*/}
                    {/* === End Form === */}

                    {/* === Footer button ===*/}
                    <div className='p-6 items-end bg-white'>
                        <button type="button" onClick={() => sendRequest()}
                                className="w-full items-center mx-auto rounded-md bg-emerald-500 px-3 py-2 text-sm font-bold text-white">
                            KIRIM
                        </button>
                    </div>
                    {/*</form>*/}
                </div>

            </IonContent>
        </IonPage>
    );
};

export default BuatLaporan;
