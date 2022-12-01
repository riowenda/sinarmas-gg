import {
    useIonViewWillEnter,
    useIonViewDidEnter,
    useIonViewWillLeave,
    useIonViewDidLeave, useIonAlert,
} from '@ionic/react';

import './FuelHomeComponent.css';
import { useTranslation } from "react-i18next";
import React, { useState } from "react";
import {
    AUTH_FUEL_OTHER_REQUEST,
    AUTH_FUEL_REQUEST,
    pref_pegawai_unit_id
} from "../../../constant/Index";

import { useHistory } from "react-router-dom";
import { getPref } from "../../../helper/Preferences";
import moment from "moment";

interface FuelHomeProps {
    data: any,
    auth: any,
    simper: any,
    allowOperateUnit: boolean,
    hanldeOnClick?: () => void,
}

const FuelHomeComponent: React.FC<FuelHomeProps> = ({ data, auth, simper, allowOperateUnit, hanldeOnClick }) => {
    const history = useHistory();
    const { t } = useTranslation();
    const [presentAlert] = useIonAlert();

    /* BEGIN LIFECYCLE APPS */

    /* Proses animasi saat Mau masuk halaman
    disini bisa load data dari API,
    jika dirasa load data akan menyebabkan performa menurun
    bisa dipindah ke diEnter */
    useIonViewWillEnter(() => {
    });

    /* Proses animasi selsai dan sudah sepenuhnya masuk halaman,
    jika load data dilakukan disini sebaiknya diberikan loading screen agar lebih maksimal */
    useIonViewDidEnter(() => {
    });

    /* Proses animasi akan dimulai saat akan meninggalkan halaman
    disini cocok untuk melakukan clean up atau sebagainya yang sesuai kebutuhan */
    useIonViewWillLeave(() => {
    });

    /* Proses transisi ke halaman berikutnya
    tidak cocok untuk beberapa logic yang butuh waktu */
    useIonViewDidLeave(() => {
    });
    /* END LIFECYCLE APPS */

    const btnP2H = () => {
        if(allowOperateUnit) {
            history.push("/fuel/p2h/p2hlist");
        } else {
            showAlert();
        }
    };

    const btnGantiUnit = () => {
        if(allowOperateUnit) {
            history.push("/fuel/unit/ganti");
        } else {
            showAlert();
        }
    };
    const btnDaftarPermintaanUnit = () => {
        history.push("/fuel/unit/daftar-permintaan");
    };
    const btnDaftarPermintaanUnitSementara = () => {
        if(allowOperateUnit) {
            history.push("/fuel/temp-unit/daftar-permintaan");
        } else {
            showAlert();
        }
    };
    const btnDaftarPermintaanOtherCoupon = () => {
        history.push("/fuel/req-other/daftar-permintaan")
    };
    const btnUpdateOdo = () => {
        history.push("/fuel/list-perbaikan-odo");
    };

    const btnTolist = () => {
        if(allowOperateUnit) {
            history.push("/fuel/req-fuel/daftar-permintaan");
        } else {
            showAlert();
        }
    }

    const hanldeRiwayatOnClick = () => {
        history.push("/fuel/unit/riwayat");
    }

    const btnCoupon = () => {
        // history.goBack();
        history.push("/all-coupon");
    }

    const slideOpts = {
        initialSlide: 1,
        speed: 400
      };

    const showAlert = () => {
        let teks = "";
        if(simper != null && simper['adaSimper'] == false){
            teks = "Anda tidak diizinkan untuk menggunakan fitur ini karna belum memiliki SIMPER!";
        } else {
            teks = "Anda tidak diizinkan untuk menggunakan fitur ini karna SIMPER anda sudah kadaluarsa!";
        }
        presentAlert({
            subHeader: teks,
            backdropDismiss: false,
            buttons: [
                {
                    text: t('btn.oke'),
                    cssClass: 'alert-button-confirm',
                }
            ],
        })
    }

    return (
        <>
            <div className="px-4 pt-4">
                <div className="w-full rounded-lg bg-white border border-gray-300 text-sm shadow-md">
                <dl className='px-4 divide-y divide-gray-300'>
                    <div className="grid grid-cols-3 gap-4 py-2">
                        <dt className="text-xs text-gray-900">SIMPER anda</dt>
                        <dd className="text-xs font-bold text-gray-900 col-span-2 sm:mt-0">{simper != null && simper['nomor'] != null ? simper['nomor'] : "-"}</dd>
                    </div>
                    <div className="grid grid-cols-3 gap-4 py-2">
                        <dt className="text-xs text-gray-900">Berlaku Sampai</dt>
                        {/* kalau tangal expired kasih warna red-500 */}
                        {simper != null && simper['nomor'] != null ?
                            <>
                            { simper['isExpired'] == false ?
                                <dd className="text-xs font-bold text-emerald-500 col-span-2 sm:mt-0">{simper['tanggal'] != null ? moment(simper['tanggal']).format("DD MMM yyyy") : "-"}</dd>
                                :
                                <dd className="text-xs font-bold text-red-500 col-span-2 sm:mt-0">{simper['tanggal'] ? moment(simper['tanggal']).format("DD MMM yyyy") : "-"}</dd>
                            }
                            </>
                            :
                            <dd className="text-xs font-bold text-gray-900 col-span-2 sm:mt-0">-</dd>
                        }
                    </div>
                    </dl>
                </div>
            </div>
            <div className="px-4 py-4">
                <h3 className="font-bold py-2">Status</h3>
                <div className="w-full items-center overflow-hidden rounded-lg border border-1 border-gray-200 text-sm">
                    <div className='relative bg-teal-500 text-white  overflow-hidden'>
                        <div className='p-4 w-full grid grid-cols-1 divide-y divide-white'>
                            <div className='py-2 flex justify-between'>
                                <span className="align-middle">{data != null ? t('beranda.bawa_unit') : t('beranda.tidak_bawa_unit')}</span>
                            </div>
                            {/* Todo: Rapihkan colspan */}
                            <div className='py-2'>
                                <div className='grid grid-cols-6 items-baseline'>
                                    <span className='col-span-2 text-xs'>Tipe</span>
                                    <span className='col-span-4'>{data != null && data['jenisUnit'] != null ? data['jenisUnit']['name'] : "-"}</span>
                                </div>
                                <div className='grid grid-cols-6 items-baseline'>
                                    <span className='col-span-2 text-xs'>{t('unit.nomor_polisi')}</span>
                                    <span className='col-span-4'>{data != null && data['noPol'] != null ? data['noPol'] : "-"}</span>
                                </div>
                                <div className='grid grid-cols-6 items-baseline'>
                                    <span className='col-span-2 text-xs'>{t('unit.nomor_lambung')}</span>
                                    <span className='col-span-4'>{data != null && data['noLambung'] != null ? data['noLambung'] : "-"}</span>
                                </div>
                            </div>
                            <img className='absolute h-24 bottom-0 right-0' src='assets/images/banners/car-mpv-on-visit.png' />
                        </div>
                    </div>
                    <div>
                        <div>
                            {(auth != null && auth.includes(AUTH_FUEL_REQUEST)) &&
                                <div className='flex flex-col py-4 p-auto m-auto '>
                                    {data != null ?
                                        <div className="flex w-full overflow-x-scroll hide-scroll-bar">
                                            <div className='flex flex-nowrap'>
                                                <div className='inline-block px-1.5'>
                                                    <div
                                                        className="whitespace-nowrap text-center rounded-lg px-3 py-2 text-xs bg-gray-300 text-gray-900 justify-center">
                                                        {t('unit.penumpang')}
                                                    </div>
                                                </div>
                                                <div className='inline-block px-1.5'>
                                                    <div
                                                        className="whitespace-nowrap text-center rounded-lg px-3 py-2 text-xs bg-gray-300 text-gray-900 justify-center">
                                                        {t('unit.qr')}
                                                    </div>
                                                </div>
                                                <div className='inline-block px-1.5'>
                                                    <div onClick={hanldeOnClick}
                                                        className="whitespace-nowrap text-center font-bold rounded-lg px-3 py-2 text-xs bg-gray-100 text-gray-900 justify-center">
                                                        {t('unit.lepas')}
                                                    </div>
                                                </div>
                                                <div className='inline-block px-1.5'>
                                                    <div onClick={hanldeRiwayatOnClick}
                                                        className="whitespace-nowrap text-center font-bold rounded-lg px-3 py-2 text-xs bg-gray-100 text-gray-900 justify-center">
                                                        {t('unit.riwayat')}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        :
                                        <div className="flex w-full overflow-x-scroll hide-scroll-bar">
                                            <div className='flex flex-nowrap ml-1.5'>
                                                <div onClick={btnGantiUnit}
                                                     className="whitespace-nowrap text-center font-bold rounded-lg px-3 py-2 text-xs bg-gray-100 text-gray-900 justify-center">
                                                    {t('unit.pilih')}
                                                </div>
                                                <div className='inline-block px-1.5'>
                                                    <div onClick={hanldeRiwayatOnClick}
                                                         className="whitespace-nowrap text-center font-bold rounded-lg px-3 py-2 text-xs bg-gray-100 text-gray-900 justify-center">
                                                        {t('unit.riwayat')}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    }
                                </div>
                            }
                        </div>
                    </div>
                </div>
            </div>
            {/* === End Current Status === */}

            {/* === Start Request === */}
            <div className="px-4 py-4">
                <h3 className="font-bold py-2">{t("permintaan.untuk")}</h3>
                <div className="grid grid-cols-2 gap-4">
                    <button disabled={auth != null && auth.includes(AUTH_FUEL_REQUEST) && data != null ? false : true} onClick={btnP2H} className={auth != null && auth.includes(AUTH_FUEL_REQUEST) && data != null ? "inline-flex items-center rounded-lg bg-gray-100 px-2.5 py-3 text-xs font-bold" : "inline-flex items-center rounded-lg bg-gray-300 px-2.5 py-3 text-xs"}>
                        <img className={auth != null && auth.includes(AUTH_FUEL_REQUEST) && data != null ? "w-6 mr-2" : "w-6 mr-2 grayscale"} src='assets/icon/p2h-icon.png' />
                        <span className='ml-1 text-left'>
                            {t("permintaan.p2h")}
                        </span>
                    </button>
                    <button disabled={auth != null && auth.includes(AUTH_FUEL_REQUEST) && data != null ? false : true} onClick={btnTolist} className={auth != null && auth.includes(AUTH_FUEL_REQUEST) && data != null ? "inline-flex items-center rounded-lg bg-gray-100 px-2.5 py-3 text-xs font-bold" : "inline-flex items-center rounded-lg bg-gray-300 px-2.5 py-3 text-xs"}>
                        <img className={auth != null && auth.includes(AUTH_FUEL_REQUEST) && data != null ? "w-6 mr-2" : "w-6 mr-2 grayscale"} src='assets/icon/fuel-unit-icon.png' />
                        <span className='ml-1 text-left'>
                            {t("permintaan.bahan_bakar")}
                        </span>
                    </button>
                    <button disabled={auth != null && auth.includes(AUTH_FUEL_OTHER_REQUEST) ? false : true} onClick={btnDaftarPermintaanOtherCoupon} className={auth != null && auth.includes(AUTH_FUEL_OTHER_REQUEST) ? "inline-flex items-center rounded-lg bg-gray-100 px-2.5 py-3 text-xs font-bold" : "inline-flex items-center rounded-lg bg-gray-300 px-2.5 py-3 text-xs"}>
                        <img className={auth != null && auth.includes(AUTH_FUEL_OTHER_REQUEST) ? "w-6 mr-2" : "w-6 mr-2 grayscale"} src='assets/icon/fuel-non-unit-icon.png' />
                        <span className='ml-1 text-left'>
                            {t("permintaan.bahan_bakar_lain")}
                        </span>
                    </button>
                    <button disabled={auth != null && ((auth.includes(AUTH_FUEL_REQUEST) && data != null) || auth.includes(AUTH_FUEL_OTHER_REQUEST)) ? false : true} onClick={btnCoupon} className={auth != null && ((auth.includes(AUTH_FUEL_REQUEST) && data != null) || auth.includes(AUTH_FUEL_OTHER_REQUEST)) ? "inline-flex items-center rounded-lg bg-gray-100 px-2.5 py-3 text-xs font-bold" : "inline-flex items-center rounded-lg bg-gray-300 px-2.5 py-3 text-xs"}>
                        <img className={auth != null && ((auth.includes(AUTH_FUEL_REQUEST) && data != null) || auth.includes(AUTH_FUEL_OTHER_REQUEST)) ? "w-6 mr-2" : "w-6 mr-2 grayscale"} src='assets/icon/coupon-icon.png' />
                        <span className='ml-1 text-left'>
                            {t("permintaan.kupon")}
                        </span>
                    </button>
                    <button disabled={auth != null && auth.includes(AUTH_FUEL_REQUEST) && data != null ? false : true} onClick={btnDaftarPermintaanUnitSementara} className={auth != null && auth.includes(AUTH_FUEL_REQUEST) && data != null ? "inline-flex items-center rounded-lg bg-gray-100 px-2.5 py-3 text-xs font-bold" : "inline-flex items-center rounded-lg bg-gray-300 px-2.5 py-3 text-xs"}>
                        <img className={auth != null && auth.includes(AUTH_FUEL_REQUEST) && data != null ? "w-6 mr-2" : "w-6 mr-2 grayscale"} src='assets/icon/temporary-unit-icon.png' />
                        <span className='ml-1 text-left'>
                            {t("permintaan.unit_sementara")}
                        </span>

                    </button>
                    <button disabled={auth != null && auth.includes(AUTH_FUEL_REQUEST) && data != null ? false : true} onClick={btnGantiUnit} className={auth != null && auth.includes(AUTH_FUEL_REQUEST) && data != null ? "inline-flex items-center rounded-lg bg-gray-100 px-2.5 py-3 text-xs font-bold" : "inline-flex items-center rounded-lg bg-gray-300 px-2.5 py-3 text-xs"}>
                        <img className={auth != null && auth.includes(AUTH_FUEL_REQUEST) && data != null ? "w-6 mr-2" : "w-6 mr-2 grayscale"} src='assets/icon/change-unit-icon.png' />
                        <span className='ml-1 text-left'>
                            {t("permintaan.ganti_unit")}
                        </span>

                    </button>
                    <button disabled={auth != null && auth.includes(AUTH_FUEL_REQUEST) ? false : true} onClick={btnDaftarPermintaanUnit} className={auth != null && auth.includes(AUTH_FUEL_REQUEST) ? "inline-flex items-center rounded-lg bg-gray-100 px-2.5 py-3 text-xs font-bold" : "inline-flex items-center rounded-lg bg-gray-300 px-2.5 py-3 text-xs"}>
                        <img className={auth != null && auth.includes(AUTH_FUEL_REQUEST) ? "w-6 mr-2" : "w-6 mr-2 grayscale"} src='assets/icon/change-unit-icon.png' />
                        <span className='ml-1 text-left'>
                            {t("permintaan.ambil_alih")}
                        </span>
                    </button>
                    <button disabled={auth != null && auth.includes(AUTH_FUEL_REQUEST) && data != null ? false : true} onClick={btnUpdateOdo} className={auth != null && auth.includes(AUTH_FUEL_REQUEST) && data != null ? "inline-flex items-center rounded-lg bg-gray-100 px-2.5 py-3 text-xs font-bold" : "inline-flex items-center rounded-lg bg-gray-300 px-2.5 py-3 text-xs"}>
                        <img className={auth != null && auth.includes(AUTH_FUEL_REQUEST) && data != null ? "w-6 mr-2" : "w-6 mr-2 grayscale"} src='assets/icon/odometer-icon.png' />
                        <span className='ml-1 text-left'>
                            {t("permintaan.update_odo")}
                        </span>
                    </button>
                </div>
            </div>
            {/* === End Request === */}

            {/* === Start Last Request === */}
            <div className="px-4 py-4" hidden>
                <div className="flex justify-between">
                    <h3 className="font-bold py-2">{t('permintaan_terakhir')}</h3>
                    <button hidden className="text-sm font-bold py-2 text-red-700">Lihat Semua</button>
                </div>
                <div className="flex justify-center">
                    {t('segera_hadir')}
                </div>
                <div hidden className="rounded-lg py-1 mb-3 border border-1 border-gray-200">
                    <div className="px-2 py-2">
                        <div className="relative flex space-x-3">
                            <div>
                                <span className="h-5 w-5 rounded-full bg-blue-500 flex items-center justify-center ">
                                    <svg className="h-3 w-3 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
                                    </svg>
                                </span>
                            </div>
                            <div className="flex min-w-0 flex-1 justify-between space-x-4">
                                <div>
                                    <p className="text-base font-bold text-gray-900">BIB 123 - H8347AQ</p>
                                    <p className="text-sm text-gray-900">Triton</p>
                                    <p className="text-sm text-gray-900">PT. Semesta Transportasi Limbah Indonesia</p>
                                </div>
                                <div className="whitespace-nowrap text-right text-sm text-gray-500">
                                    <span className="text-base font-bold text-green-600">APPROVED</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div hidden className="rounded-lg py-1 mb-3 border border-1 border-gray-200">
                    <div className="px-2 py-2">
                        <div className="relative flex space-x-3">
                            <div>
                                <span className="h-5 w-5 rounded-full bg-blue-500 flex items-center justify-center ">
                                    <svg className="h-3 w-3 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
                                    </svg>
                                </span>
                            </div>
                            <div className="flex min-w-0 flex-1 justify-between space-x-4">
                                <div>
                                    <p className="text-base font-bold text-gray-900">BIB 123 - H8347AQ</p>
                                    <p className="text-sm text-gray-900">Triton</p>
                                    <p className="text-sm text-gray-900">PT. Semesta Transportasi Limbah Indonesia</p>
                                </div>
                                <div className="whitespace-nowrap text-right text-sm text-gray-500">
                                    <span className="text-base font-bold text-red-600">REJECTED</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
            {/* === END Last Request === */}

        </>
    );
};


export default FuelHomeComponent;
function classNames(arg0: string, arg1: string): string | undefined {
    throw new Error('Function not implemented.');
}

