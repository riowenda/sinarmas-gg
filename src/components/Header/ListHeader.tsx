import React, {useEffect, useState} from "react";
import {useHistory} from "react-router-dom";
import {IonBackButton, useIonViewDidEnter, useIonViewWillEnter, useIonViewWillLeave} from "@ionic/react";

interface ListHeaderProps {
    title: string,
    link?: string,
    addButton?: boolean | false,
    isReplace?: boolean | false,
    handleOnPress?: () => void
}

const ListHeader: React.FC<ListHeaderProps> = ({title, link, handleOnPress, addButton, isReplace}) => {
    const history = useHistory();
    const [status, setStatus] = useState("");
    const [clas, setClas] = useState("");

    const btnAdd = (replace: boolean) => {
        let toLink = link != null && link !== "" ? link : "/profil";
        if(replace){
            history.replace(toLink);
        } else {
            history.push(toLink);
        }
    }

    return (
        <div className="py-3 px-1 bg-red-700">
            <div className="flex">
                <div slot="start" className="pb-1 w-6 h-6 text-white">
                    <IonBackButton defaultHref="/" />
                </div>
                {/*<svg onClick={toList} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"*/}
                {/*     strokeWidth="2" stroke="currentColor" className="w-6 h-6 text-white">*/}
                {/*    <path strokeLinecap="round" strokeLinejoin="round"*/}
                {/*          d="M19.5 12h-15m0 0l6.75 6.75M4.5 12l6.75-6.75"/>*/}
                {/*</svg>*/}
                <div className='py-2 flex justify-between w-full items-center text-white'>
                    <div className="ml-4 px-2">
                        <h3 className="text-base font-bold text-white">{title}</h3>
                    </div>
                </div>
                <div className="p-2 float-right text-white">
                    {addButton ?
                        <svg onClick={(event) => btnAdd(isReplace != null ? isReplace : false)}
                             xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                             fill="currentColor" className="w-8 h-8">
                            <path fill-rule="evenodd"
                                  d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 9a.75.75 0 00-1.5 0v2.25H9a.75.75 0 000 1.5h2.25V15a.75.75 0 001.5 0v-2.25H15a.75.75 0 000-1.5h-2.25V9z"
                                  clip-rule="evenodd"/>
                        </svg>
                        :
                        <div className="w-8 h-8"></div>
                    }
                </div>
            </div>
        </div>
    );
};

export default ListHeader;