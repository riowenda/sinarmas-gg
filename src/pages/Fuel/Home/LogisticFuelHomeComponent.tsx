import {useTranslation} from "react-i18next";
import React, {useState} from "react";
import {useHistory, useLocation} from "react-router-dom";

interface FuelHomeProps {
    countDo: any,
    countPo: any,
}

const LogisticFuelHomeComponent: React.FC<FuelHomeProps> = ({ countDo, countPo }) => {
    const history = useHistory();
    const {t} = useTranslation();

    const menuPo = () => {
        history.push("/fuel/po");
    };

    const menuFuel = () => {
        history.push("/fuel/do-stok");
    };

    return (
        <>
            <div className="w-full rounded-t-3xl bg-white p-6 flex-auto">
                <div className="my-10 text-center">
                    <button onClick={menuPo}
                            className="py-4 px-1 relative top-50 left-50 border-2 border-transparent text-white rounded-full"
                            aria-label="Cart">
                        <img className="w-10 mr-2" src='assets/icon/fuel-unit-icon.png'/>
                        <span className="absolute inset-0 object-right-top -mr-6 mt-1">
                                  <div
                                      className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-semibold leading-4 bg-gray-900 text-white">
                                    {countPo}
                                  </div>
                                </span>
                    </button>
                    <p>PO Deposit</p>
                </div>
                <div className="flex-grow border-t border-gray-400 mb-6"></div>
                <div className="my-10 text-center">
                    <button onClick={menuFuel}
                            className="py-4 px-1 relative top-50 left-50 border-2 border-transparent text-white rounded-full"
                            aria-label="Cart">
                        <img className="w-10 mr-2" src='assets/icon/fuel-non-unit-icon.png'/>
                        <span className="absolute inset-0 object-right-top -mr-6 mt-1">
                                  <div
                                      className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-semibold leading-4 bg-gray-900 text-white">
                                    {countDo}
                                  </div>
                                </span>
                    </button>
                    <p>Fuel Deposit</p>
                </div>
            </div>
        </>
    );
};

export default LogisticFuelHomeComponent;

function classNames(arg0: string, arg1: string): string | undefined {
    throw new Error('Function not implemented.');
}

