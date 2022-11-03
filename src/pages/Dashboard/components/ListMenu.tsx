import { ListMenuProps } from "./ListMenu.config"


const ListMenu: React.FC<ListMenuProps> = ({ onPress, img, title }) => {
    return (
        <li className="text-center">
            <div onClick={onPress} className="flex flex-1 flex-col p-2">
                <img
                    className="mx-auto h-10 w-10 flex-shrink-0"
                    src={img}
                    alt=""
                />
                <h3 className="mt-6 text-sm font-medium text-gray-900">
                    {title}
                </h3>
            </div>
        </li>
    )
}

export default ListMenu