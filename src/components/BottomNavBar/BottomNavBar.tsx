import { IonFooter, IonToolbar } from "@ionic/react";
import { useHistory, useLocation } from "react-router-dom";
import { IconBeranda, IconBerandaSolid, IconProfile, IconProfileSolid, IconNews } from "../Icon";
import BottomNavBarItem from "./BottomNavbarItem";
import {useTranslation} from "react-i18next";

interface BottomNavBarProps {
    isFuelman?:boolean
}

const BottomNavBar: React.FC<BottomNavBarProps> = ({isFuelman}) => {
    const history = useHistory();
    const { t, i18n } = useTranslation();
    const DataNav = [
        {
            icon: <IconBeranda />,
            iconsolid: <IconBerandaSolid />,
            title: t("nav_bar_menu.beranda"),
            navigate: '/dashboard'
        },
        {
            icon: <IconNews />,
            iconsolid: <IconBerandaSolid />,
            title: t("nav_bar_menu.berita"),
            navigate: '#'
        },
        {
            icon: <IconProfile />,
            iconsolid: <IconProfileSolid />,
            title: t("nav_bar_menu.profil"),
            navigate: '/profil'
        }
    ]

    const DataNavFuelman = [
        {
            icon: <IconBeranda />,
            iconsolid: <IconBerandaSolid />,
            title: t("nav_bar_menu.beranda"),
            navigate: '/homepage-fuel'
        },
        {
            icon: <IconProfile />,
            iconsolid: <IconProfileSolid />,
            title: t("nav_bar_menu.profil"),
            navigate: '/profil'
        }
    ]

    const location = useLocation();

    return (
        <IonFooter>
            <IonToolbar>
                {isFuelman ?
                    <div className="grid grid-cols-2 py-1 bg-white text-gray-700">
                        {DataNavFuelman.map((e, i) => (
                            <BottomNavBarItem
                                key={i}
                                children={e.icon}
                                title={e.title}
                                color='text-red-500'
                                onPress={() => e.navigate === "/homepage-fuel" ? history.replace(e.navigate)  : history.push(e.navigate)}/>
                        ))}
                    </div>
                    :
                    <div className="grid grid-cols-3 py-1 bg-white text-gray-500">
                        {DataNav.map((e, i) => (
                            <BottomNavBarItem
                                key={i}
                                children={location.pathname === e.navigate ? e.iconsolid : e.icon }
                                title={e.title}
                                color='text-red-500'
                                onPress={() => e.navigate === "/dashboard" ? history.replace(e.navigate) : history.push(e.navigate)}/>
                        ))}
                    </div>
                }
            </IonToolbar>
        </IonFooter>

    );
};

export default BottomNavBar;