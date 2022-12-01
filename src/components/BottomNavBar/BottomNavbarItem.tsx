import { BottomNavbarItemProps } from "./BottomNavbarItem.config"


const BottomNavBarItem: React.FC<BottomNavbarItemProps> = ({ onPress, children, title, color }) => {
    return (
        <div onClick={onPress} className="py-3 text-center text-xs">
            {children}
            <p className="mt-1 text-gray-700">{title}</p>
        </div>
    )
}

export default BottomNavBarItem