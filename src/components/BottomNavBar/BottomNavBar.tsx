import { IonFooter, IonToolbar } from "@ionic/react";
import { useHistory } from "react-router-dom";
import { IconBeranda, IconGaCare, IconProfile, IconNews } from "../Icon";
import BottomNavBarItem from "./BottomNavbarItem";

const DataNav = [
    {
        icon: <IconBeranda />,
        title: 'Beranda',
        navigate: '/dashboard'
    },
    {
        icon: <IconNews />,
        title: 'News',
        navigate: '/dashboard'
    },
    // {
    //     icon: <IconGaCare />,
    //     title: 'Profile',
    //     navigate: '/dashboard'
    // },
    {
        icon: <IconProfile />,
        title: 'Profile',
        navigate: '/profil'
    }
]

const BottomNavBar: React.FC = () => {
    const history = useHistory();

    const navDashboard = () => {
        history.push("/dashboard");
    };

    const navCoupon = () => {
        history.push("/all-coupon");
    };

    const navProfile = () => {
        history.push("/profil");
    };

    const navGaCare = () => {
        history.push("/dashboard-ga");
    };

    // return (
    // <IonFooter>
    //     <IonToolbar>
    //         <div className="grid grid-cols-3 py-1 bg-white text-gray-500">
    //             <div onClick={navDashboard} className="py-3 text-center text-xs ">
    //                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-6 h-6 mx-auto">
    //                     <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
    //                 </svg>
    //                 <p className="mt-1">Beranda</p>
    //             </div>
    //             {/* <div onClick={navCoupon} className="py-3 text-center text-xs">
    //                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-6 h-6 mx-auto">
    //                     <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v3.026a2.999 2.999 0 010 5.198v3.026c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-3.026a2.999 2.999 0 010-5.198V6.375c0-.621-.504-1.125-1.125-1.125H3.375z" />
    //                 </svg>
    //                 <p className="mt-1">KuponAPI</p>
    //             </div> */}
    //             <div className="py-3 text-center text-xs">                      
    //                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-6 h-6 mx-auto">
    //                     <path stroke-linecap="round" stroke-linejoin="round" d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 01-2.25 2.25M16.5 7.5V18a2.25 2.25 0 002.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 002.25 2.25h13.5M6 7.5h3v3H6v-3z" />
    //                 </svg>
    //                 <p className="mt-1">News</p>
    //             </div>
    //             <div onClick={navProfile} className="py-3 text-center text-xs">
    //                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-6 h-6 mx-auto">
    //                     <path stroke-linecap="round" stroke-linejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
    //                 </svg>
    //                 <p className="mt-1">Profil</p>
    //             </div>
    return (
        <IonFooter>
            <IonToolbar>
                <div className="grid grid-cols-3 py-1 bg-white text-gray-500">
                    {DataNav.map((e, i) => (
                        <BottomNavBarItem
                            key={i}
                            children={e.icon}
                            title={e.title}
                            onPress={() => e.navigate === "/dashboard" ? history.replace(e.navigate) : history.push(e.navigate)} />
                    ))}
                </div>
            </IonToolbar>
        </IonFooter>

    );
};

export default BottomNavBar;