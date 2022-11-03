import {IonFooter, IonToolbar, useIonToast} from "@ionic/react";
import { useHistory } from "react-router-dom";
import React, {useEffect, useState} from "react";
import {useTimer} from "react-timer-hook";
import QRCodeWithLogo from "../QRCodeWithLogo/QRCodeWithLogo";

const QRCodeWithCountDown: React.FC<{texts?: string | "", timer?: number | 5}> = ({ texts, timer}) => {
    const sleep = (ms:any) => new Promise(r => setTimeout(r, ms));
    const [val, setVal] = useState(texts);

    let limit = timer;
    const now = new Date();
    // @ts-ignore
    now.setTime(now.getTime()+(limit * 60000));

    const [expiryTimestamp, setExpiryTimestamp] = useState<any>(now);//
    const {
        seconds,
        minutes,
        hours,
        days,
        isRunning,
        start,
        pause,
        resume,
        restart,
    } = useTimer({ expiryTimestamp, onExpire: () => { seconds<1 ? resetTimer() : console.log("ok")
    }
    });

    useEffect(() => {
        resetTimer();
    }, [])

    function reset() {
        let ele = document.getElementById('resetTime');
        if(ele != null ) ele.click();
    }

    const resetTimer = ()=> {
        const now = new Date();
        // @ts-ignore
        const time = now.setTime(now.getTime() + (timer * 60000));
        // @ts-ignore
        restart(time);
        setVal(texts+"_"+time);
    }

    return (
        <>
            <div className="aspect-auto bg-white-100 w-full flex item-center">
                {/*<img height={180} width={180} className="mx-auto object-cover object-center rounded-lg pointer-events-none" src={`data:image/png;base64,${photo}`} ></img>*/}
                <div className="mx-auto">
                <QRCodeWithLogo text={val ? val : ""} />
                </div>
            </div>
            <div className="pt-3" style={{textAlign: 'center'}}>
                <div style={{fontSize: '18px'}}>
                    <strong><span>{minutes < 10 ? "0"+minutes : minutes}</span>:<span>{seconds < 10 ? "0"+seconds : seconds}</span></strong>
                    {isRunning ? "" :  start()}
                </div>
            </div>
            <div className="pt-3 hidden" style={{textAlign: 'center'}}>
                <button id="resetTime" onClick={() => {
                    // Restarts to 5 minutes timer
                    resetTimer();
                }}>Reset QR Code</button>
            </div>
        </>
    );
};

export default QRCodeWithCountDown;