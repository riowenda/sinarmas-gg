import React, {useEffect, useState} from "react";
import {useHistory} from "react-router-dom";
import {IonBackButton, useIonViewDidEnter, useIonViewWillEnter, useIonViewWillLeave} from "@ionic/react";
import {useTranslation} from "react-i18next";
import moment from "moment";

interface CardNotifProps {
    read: boolean,
    data: any,
    type: string,
    tgl: string
}

const CardNotif: React.FC<CardNotifProps> = ({data, type, read, tgl}) => {
    const history = useHistory();
    const {t} = useTranslation();

    return (
        <div className={read ? 'bg-white' : 'bg-gray-100'}>
            <div className="px-4">
                <div className='flex'>
                    <div className='py-2 flex justify-center items-top'>
                        {(() => {
                            if (type === "p2h") { // emerald start
                                return (<img className="rounded-full bg-gray-300 p-1 h-8 w-8 mx-1" src='assets/icon/p2h-icon.png'/>);
                            } else if (type === "unit") {
                                return (<img className="rounded-full bg-gray-300 p-1 h-8 w-8 mx-1" src='assets/icon/change-unit-icon.png'/>);
                            } else if (type === "unit_lepas") {
                                return (<img className="rounded-full bg-gray-300 p-1 h-8 w-8 mx-1" src='assets/icon/change-unit-icon.png'/>);
                            } else if (type === "takeover") {
                                return (<img className="rounded-full bg-gray-300 p-1 h-8 w-8 mx-1" src='assets/icon/change-unit-icon.png'/>);
                            } else if (type === "temporary") {
                                return (<img className="rounded-full bg-gray-300 p-1 h-8 w-8 mx-1" src='assets/icon/temporary-unit-icon.png'/>);
                            } else if (type === "fuel") {
                                return (<img className="rounded-full bg-gray-300 p-1 h-8 w-8 mx-1" src='assets/icon/fuel-unit-icon.png'/>);
                            } else if (type === "other") {
                                return (<img className="rounded-full bg-gray-300 p-1 h-8 w-8 mx-1" src='assets/icon/fuel-non-unit-icon.png'/>);
                            } else if (type === "odometer") { // red start
                                return (<img className="rounded-full bg-gray-300 p-1 h-8 w-8 mx-1" src='assets/icon/odometer-icon.png'/>);
                            } else if (type === "po_do") { // red end
                                return (<img className="rounded-full bg-gray-300 p-1 h-8 w-8 mx-1" src='assets/icon/purchase-order-icon.png'/>);
                            } else if (type === "fuelstation_do") { // blue start
                                return (<img className="rounded-full bg-gray-300 p-1 h-8 w-8 mx-1" src='assets/icon/deposit-icon.png'/>);
                            } else if (type === "ga_care") {
                                return (<img className="rounded-full bg-gray-300 p-1 h-8 w-8 mx-1" src='assets/icon/ga_cares.png'/>);
                            } else {
                                return (<img className="rounded-full bg-gray-300 p-1 h-8 w-8 mx-1" src='assets/icon/logo-app.png'/>);
                            }
                        })()}
                    </div>
                    <div className='flex justify-between w-full ml-4 border-b border-gray-300 items-center'>
                        <div className='py-2'>
                            <p className='text-xs text-gray-500'>
                                {(() => {
                                    if (type === "p2h") { // emerald start
                                        return <>{t('permintaan.p2h')}</>;
                                    } else if (type === "unit") {
                                        return <>{t('permintaan.unit')}</>;
                                    } else if (type === "unit_lepas") {
                                        return <>{t('permintaan.unit')}</>;
                                    } else if (type === "takeover") {
                                        return <>{t('permintaan.ganti_unit')}</>;
                                    } else if (type === "temporary") {
                                        return <>{t('permintaan.unit_sementara')}</>;
                                    } else if (type === "fuel") {
                                        return <>{t('permintaan.bahan_bakar')}</>;
                                    } else if (type === "other") {
                                        return <>{t('permintaan.bahan_bakar_lain')}</>;
                                    } else if (type === "odometer") { // red start
                                        return <>{t('permintaan.update_odo')}</>;
                                    } else if (type === "po_do") { // red end
                                        return <>{t('permintaan.do')}</>;
                                    } else if (type === "fuelstation_do") { // blue start
                                        return <>{t('permintaan.deposit')}</>;
                                    } else if (type === "ga_care") {
                                        return <>{t('laporan.ga_care')}</>;
                                    } else {
                                        return <>{t('permintaan.lainnya')}</>;
                                    }
                                })()}
                            </p>
                            <p className={!read ? 'font-bold' : 'font-base'}>{data != null ? data.data.data_info : "N/A"}</p>
                            {/*Sat Nov 26 07:47:27 WIB 2022*/}
                            {/*{new Date("Sat Nov 26 07:47:27 2022") +" = "+ moment(data.data.data_date).format('DDD MMM yyyy HH:mm:ss').toString()}*/}
                            <p className='text-xs text-gray-500'>{data != null ? moment(new Date(tgl)).format('DD MMM yyyy HH:mm:ss').toString() : "N/A"}</p>
                        </div>
                        {!read &&
                            <div className='rounded-full ml-1 p-1.5 bg-red-700'/>
                        }
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CardNotif;

