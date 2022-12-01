import ListMenu from "./ListMenu";
import React from "react";
import {useHistory} from "react-router-dom";
import {getFuelMenu} from "../../../helper/Preferences";
import {AUTH_FUEL_MANAGER, AUTH_FUEL_STATION} from "../../../constant/Index";

interface UserMenuProps {
    menu: any[]
}

const UserMenu: React.FC<UserMenuProps> = ({ menu }) => {
    const history = useHistory();
    const toPage = (link:string) => {
        if(link === "/fuel/homepage"){
            getFuelMenu().then(m => {
                if(m != null && m.length > 0){
                    if(m.includes("FUEL_GA") || m.includes("FUEL_FINANCE") || m.includes("FUEL_LOGISTIC")){
                        history.push("/ga/fuel/homepage");
                    } else if(m.includes(AUTH_FUEL_STATION) || m.includes(AUTH_FUEL_MANAGER)){
                        history.push("/homepage-fuel");
                    } else {
                        history.push(link);
                    }
                } else {
                    history.push(link);
                }
            });
        } else {
            history.push(link);
        }
    }

    return (
        <>
            <ul role="list" className="grid grid-cols-4 gap-x-1 gap-y-8 mt-2">
                {menu.map((e, i) => {
                    return (
                        <ListMenu
                            key={i}
                            img={e.img}
                            onPress={() => {toPage(e.navigate)}}
                            allowed={e.allowed}
                            title={e.title} />
                    )
                })}
            </ul>
        </>
    )
}

export default UserMenu