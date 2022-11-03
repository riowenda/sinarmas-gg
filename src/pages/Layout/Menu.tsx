import './Menu.css';
import React, { } from "react";
import {
    IonCol,
    IonGrid,
    IonRow,
} from "@ionic/react";
import { ChatBubbleBottomCenterTextIcon, PaperClipIcon, PencilIcon, TrashIcon } from "@heroicons/react/20/solid";

interface ContainerProps { }

const Menu: React.FC<ContainerProps> = () => {
    return (
        <><>
            <div className="relative">
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                    <div className="w-full border-t border-red-500" />
                </div>
                <div className="relative flex justify-center">
                    <span className="isolate inline-flex -space-x-px rounded-md shadow-sm">
                        <button type="button" className="relative inline-flex items-center rounded-l-md border border-red-300 bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-50 focus:z-10 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500">
                            <span className="sr-only">Edit</span>
                            <PencilIcon className="h-5 w-5" aria-hidden="true" />
                        </button>
                        <button type="button" className="relative inline-flex items-center border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-400 hover:bg-gray-50 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500">
                            <span className="sr-only">Attachment</span>
                            <PaperClipIcon className="h-5 w-5" aria-hidden="true" />
                        </button>
                        <button type="button" className="relative inline-flex items-center border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-400 hover:bg-gray-50 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500">
                            <span className="sr-only">Annotate</span>
                            <ChatBubbleBottomCenterTextIcon className="h-5 w-5" aria-hidden="true" />
                        </button>
                        <button type="button" className="relative inline-flex items-center rounded-r-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-400 hover:bg-gray-50 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500">
                            <span className="sr-only">Delete</span>
                            <TrashIcon className="h-5 w-5" aria-hidden="true" />
                        </button>
                    </span>
                </div>
            </div>
        </>
            <IonGrid>
                <IonRow>
                    <IonCol className="setCenter">
                        <img src="/assets/icon/fuel_mgm_icon.png" className="slide-main-image sizeImaze" />
                        <p>Fuel</p>
                    </IonCol>
                    <IonCol className="setCenter">
                        <img src="/assets/icon/meal_mgm_icon.png" color="danger"
                            className="slide-main-image sizeImaze" />
                        <p>Meal</p>
                    </IonCol>
                    <IonCol className="setCenter">
                        <img src="/assets/icon/visit_mgm_icon.png" className="slide-main-image sizeImaze" />
                        <p>Visit</p>
                    </IonCol>
                    <IonCol className="setCenter">
                        <img src="/assets/icon/masterdata_icon.png" className="slide-main-image sizeImaze" />
                        <p>MD</p>
                    </IonCol>
                    <IonCol className="setCenter">
                        <img src="/assets/icon/ga_care_icon.png" className="slide-main-image sizeImaze_" />
                        <p>GA Care</p>
                    </IonCol>
                </IonRow>
            </IonGrid></>

    );
};

export default Menu;
