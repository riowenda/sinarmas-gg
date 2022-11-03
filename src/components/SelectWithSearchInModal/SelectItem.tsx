import React, {useState} from "react";
import {
    IonAvatar, IonBackButton,
    IonButton,
    IonButtons,
    IonContent,
    IonHeader, IonImg, IonItem, IonLabel, IonList,
    IonModal,
    IonSearchbar,
    IonTitle,
    IonToolbar
} from "@ionic/react";
import {ChevronDownIcon, MagnifyingGlassCircleIcon} from "@heroicons/react/24/solid";
import {TicketIcon} from "@heroicons/react/24/solid";

interface SelectItemProps {
    list: any[],
    placeholder: string,
    id: string,
    nameComp: string,
    img?: string,
    isName?:boolean | true,
    defaultValue?: string,
    handleOnPress?: () => void,
    handleOnchange?: (arg: string, tipe: string) => void,
    handleOnClick?: () => void
}

const SelectItem: React.FC<SelectItemProps> = ({id, isName, nameComp, placeholder, img, list, defaultValue, handleOnClick, handleOnchange, handleOnPress}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [display, setDisplay] = useState("");
    const [select, setSelect] = useState("");
    let [results, setResults] = useState<any[]>(list);

    const handleItemClick = (data:any, tipe:any) => {
        setIsOpen(false);
        if(isName){
            setDisplay(data["name"]);
        } else {
            setDisplay(data["nama"]);
        }
        setSelect(data["id"]);
        if (handleOnchange) {
            handleOnchange(data["id"], tipe);
        }
    }

    const handleOpen = () => {
        setIsOpen(true);
        setResults(list);
    }

    const handleChange = (ev: Event) => {
        let query = "";
        const target = ev.target as HTMLIonSearchbarElement;
        if (target) query = target.value!.toLowerCase();
        if(isName) {
            setResults(list.filter((d: { [d: string]: { [d: string]: null; }; }) => (d["name"]).toString().toLowerCase().indexOf(query) > -1));
        } else {
            setResults(list.filter((d: { [d: string]: { [d: string]: null; }; }) => (d["nama"]).toString().toLowerCase().indexOf(query) > -1));
        }
    }
    return (
        <>
            <div className="relative border-b border-gray-300 py-2">
                <input
                    onClick={() => handleOpen()}
                    readOnly
                    type="text"
                    name={nameComp}
                    value={defaultValue != null && defaultValue !== "" ? defaultValue : display}
                    className="block w-full rounded-md border-gray-300 pr-10 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    placeholder={placeholder}
                />
                    <input hidden id={id}
                           value={select}/>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-1">
                    <ChevronDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true"/>
                </div>
            </div>
            <IonModal isOpen={isOpen}>
                <IonHeader>
                    <div className="py-3 px-1 bg-red-700">
                        <div className="flex">
                            <div className='py-2 flex justify-between w-full items-left items-center text-white'>
                                <div className="ml-4 px-2">
                                    <p className="text-base font-bold text-white">{placeholder}</p>
                                </div>
                            </div>
                            <div onClick={() => setIsOpen(false)} className="py-2 pr-4 float-right text-white">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                     stroke-width="1.5" stroke="currentColor" className="w-8 h-8">
                                    <path stroke-linecap="round" stroke-linejoin="round"
                                          d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                </svg>
                            </div>
                        </div>
                    </div>
                </IonHeader>
                <IonContent className="ion-padding">
                    <IonSearchbar debounce={1000} className="cari-item" placeholder="Cari ..." onIonChange={(ev) => handleChange(ev)}></IonSearchbar>
                    {results.length > 0 ?
                        <IonList>
                            {results.map((item, index) => {
                                return (
                                    <IonItem key={index} id={item["id"]} onClick={(event) => handleItemClick(item,id)}>
                                        <IonAvatar slot="start">
                                            {img !== "" ?
                                                <IonImg className="p-2" src={img}/>
                                                :
                                                <MagnifyingGlassCircleIcon className="text-red-600"/>
                                            }
                                        </IonAvatar>
                                        <IonLabel>
                                            <h2>{ isName ? item["name"] : item["nama"]}</h2>
                                        </IonLabel>
                                    </IonItem>
                                )
                            })}
                        </IonList>
                    :
                    <div>Tidak ada data</div>
                    }
                </IonContent>
            </IonModal>
        </>
    )
}

export default SelectItem;