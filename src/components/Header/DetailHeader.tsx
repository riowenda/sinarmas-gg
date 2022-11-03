import React, {useEffect, useState} from "react";
import {useHistory} from "react-router-dom";
import {IonBackButton, useIonViewDidEnter, useIonViewWillEnter, useIonViewWillLeave} from "@ionic/react";

interface DetailHeaderProps {
    title: string,
    approval: any,
    link: string,
    handleOnPress?: () => void
}

const DetailHeader: React.FC<DetailHeaderProps> = ({title, approval, link, handleOnPress}) => {
    const history = useHistory();
    const [status, setStatus] = useState("");
    const [clas, setClas] = useState("");

    const toList = () => {
        history.push(link);
    }

    return (
        <>
            <div className={
                (() => {
                    if(approval === "APPROVED"){ // emerald start
                        return "py-3 px-1 bg-emerald-500";
                    } else if(approval === "DONE"){
                        return  "py-3 px-1 bg-emerald-500";
                    } else if(approval === "CLOSED"){
                        return  "py-3 px-1 bg-emerald-500";
                    } else if(approval === "READY"){ // emerald end
                        return  "py-3 px-1 bg-emerald-500";
                    } else if(approval === "REJECTED"){ // red start
                        return  "py-3 px-1 bg-red-700";
                    } else if(approval === "CANCELED"){ // red end
                        return  "py-3 px-1 bg-red-700";
                    } else if(approval === "PROPOSED"){ // blue start
                        return  "py-3 px-1 bg-blue-500";
                    } else if(approval === "OPENED"){
                        return  "py-3 px-1 bg-blue-500";
                    } else if(approval === "FILLED"){
                        return  "py-3 px-1 bg-blue-500";
                    } else if(approval === "PROCESSED"){ // blue end
                        return  "py-3 px-1 bg-blue-500";
                    } else if(approval === "ONHOLD"){ // amber start
                        return  "py-3 px-1 bg-amber-500";
                    } else if(approval === "FORGIVENESS"){
                        return  "py-3 px-1 bg-amber-500";
                    } else if(approval === "REFILL"){
                        return  "py-3 px-1 bg-amber-500";
                    } else if(approval === "RELEASED"){
                        return  "py-3 px-1 bg-amber-500";
                    } else if(approval === "REOPENED"){ // amber end
                        return  "py-3 px-1 bg-amber-500";
                    } else {
                        return  "py-3 px-1 bg-red-700";
                    }
                })()
            }>
                <div className="flex">
                    <div slot="start" className="pb-1 w-6 h-6 text-white">
                        <IonBackButton defaultHref="/" />
                    </div>
                    {/*<svg onClick={toList} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"*/}
                    {/*     strokeWidth="2" stroke="currentColor" className="w-6 h-6 text-white">*/}
                    {/*    <path strokeLinecap="round" strokeLinejoin="round"*/}
                    {/*          d="M19.5 12h-15m0 0l6.75 6.75M4.5 12l6.75-6.75"/>*/}
                    {/*</svg>*/}
                    <div className="pl-6 py-2 flex justify-center w-full items-center text-white">
                        <h3 className="text-base font-bold text-white">{title} {(() => {
                            if(approval === "APPROVED"){ // emerald start
                                return  "Approved";
                            } else if(approval === "DONE"){
                                return  "Done";
                            } else if(approval === "CLOSED"){
                                return  "Closed";
                            } else if(approval === "READY"){ // emerald end
                                return  "Ready";
                            } else if(approval === "REJECTED"){ // red start
                                return  "Rejected";
                            } else if(approval === "CANCELED"){ // red end
                                return  "Canceled";
                            } else if(approval === "PROPOSED"){ // blue start
                                return  "Proposed";
                            } else if(approval === "OPENED"){
                                return  "Opened";
                            } else if(approval === "FILLED"){
                                return  "Filled";
                            } else if(approval === "PROCESSED"){ // blue end
                                return  "Processed";
                            } else if(approval === "ONHOLD"){ // amber start
                                return  "On Hold";
                            } else if(approval === "FORGIVENESS"){
                                return  "Forgiveness";
                            } else if(approval === "REFILL"){
                                return  "Refill";
                            } else if(approval === "RELEASED"){
                                return  "Released";
                            } else if(approval === "REOPENED"){ // amber end
                                return  "Re Opened";
                            } else {
                                return  approval;
                            }
                        })()}</h3>
                    </div>
                    <div className="p-2 float-right text-white">
                        <div className='w-8 h-8'></div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default DetailHeader;