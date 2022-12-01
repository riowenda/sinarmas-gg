import { IonFooter, IonToolbar } from "@ionic/react";
import { useHistory, useLocation } from "react-router-dom";
import { IconBeranda, IconBerandaSolid, IconProfile, IconProfileSolid, IconNews } from "../Icon";
import { useTranslation } from "react-i18next";

interface Modal2ButtonProps {
    title: string;
    message: string;
    data: any;
    buttonsubmit: string;
    buttoncancel: string;
    onSubmitPress?: () => void;
    onCancelPress?: () => void;
}

const Modal2Button: React.FC<Modal2ButtonProps> = ({ title, message, data, buttonsubmit, buttoncancel, onSubmitPress, onCancelPress}) => {
    return (
        <div className="relative z-10" aria-labelledby="modal-title" role="dialog" aria-modal="true">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
            <div className="fixed inset-0 z-10 overflow-y-auto">
                <div className="flex h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                    <div className="relative w-full transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                        <div>
                            <div className="mt-3 text-center sm:mt-5">
                                <h3 className="text-lg font-medium leading-6 text-gray-900" id="modal-title">{title}</h3>
                                <div className="mt-2">
                                    <p className="text-sm text-gray-500">{message}</p>
                                </div>
                            </div>
                        </div>
                        <div className="mt-6 grid grid-cols-2 gap-3">
                            <button type="button" onClick={onCancelPress} className="inline-flex w-full justify-center text-center items-center rounded-md border border-transparent bg-gray-200 px-4 py-2 text-sm font-bold text-indigo-600 shadow-sm ">{buttoncancel}</button>
                            <button type="button" onClick={onSubmitPress} className="inline-flex w-full justify-center text-center items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-bold text-white shadow-sm ">{buttonsubmit}</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Modal2Button;
