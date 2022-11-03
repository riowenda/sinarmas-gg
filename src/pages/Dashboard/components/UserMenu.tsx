import {DataMenu, DataMenuFuelman, DataMenuGA, DataMenuLogistic} from "./constants";
import ListMenu from "./ListMenu";
import React from "react";
import {useHistory} from "react-router-dom";

interface UserMenuProps {
    userRole: string
}

const UserMenu: React.FC<UserMenuProps> = ({ userRole }) => {
    const history = useHistory();
    return (
        <>
        {(() => {
            if (userRole === 'GA' || userRole === 'FINANCE') {
                return <ul role="list" className="grid grid-cols-4 gap-x-1 gap-y-8 mt-2">
                    {DataMenuGA.map((e, i) => {
                        return (
                            <ListMenu
                                key={i}
                                img={e.img}
                                onPress={() => {
                                    history.push(e.navigate)
                                }}
                                title={e.title} />
                        )
                    })}
                </ul>
            } else if (userRole === 'LOGISTIC') {
                return <ul role="list" className="grid grid-cols-4 gap-x-1 gap-y-8 mt-2">
                    {DataMenuLogistic.map((e, i) => {
                        return (
                            <ListMenu
                                key={i}
                                img={e.img}
                                onPress={() => {
                                    history.push(e.navigate)
                                }}
                                title={e.title} />
                        )
                    })}
                </ul>
            } else if (userRole === 'FUELMAN') {
                return <ul role="list" className="grid grid-cols-4 gap-x-1 gap-y-8 mt-2">
                    {DataMenuFuelman.map((e, i) => {
                        return (
                            <ListMenu
                                key={i}
                                img={e.img}
                                onPress={() => {
                                    history.push(e.navigate)
                                }}
                                title={e.title} />
                        )
                    })}
                </ul>
            } else {
                return <ul role="list" className="grid grid-cols-4 gap-x-1 gap-y-8 mt-2">
                    {DataMenu.map((e, i) => {
                        return (
                            <ListMenu
                                key={i}
                                img={e.img}
                                onPress={() => {
                                    history.push(e.navigate)
                                }}
                                title={e.title} />
                        )
                    })}
                </ul>
            }
        })()}
        </>
    )
}

export default UserMenu