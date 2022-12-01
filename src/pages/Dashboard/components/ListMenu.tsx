export type ListMenuProps = {
    onPress?: () => void,
    img: string,
    title: string,
    allowed: boolean
}

const ListMenu: React.FC<ListMenuProps> = ({ onPress, img, title , allowed}) => {
    return (
        <li className="text-center">
            <div onClick={onPress} className="flex flex-1 flex-col p-2">
                <img
                    className={allowed ? "mx-auto h-10 w-10 flex-shrink-0 grayscale-0" : "mx-auto h-10 w-10 flex-shrink-0 grayscale"}
                    src={img}
                    alt=""
                />
                <h3 className="mt-3 text-sm font-medium text-gray-900">
                    {title}
                </h3>
            </div>
        </li>
    )
}

export default ListMenu