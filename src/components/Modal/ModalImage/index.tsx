import { IconPhoto } from "../../Icon"

interface ModalImageProps {
    onPress?: () => void
}

const ModalImage: React.FC<ModalImageProps> = ({ onPress }) => {
    return (
        <div className="w-screen h-screen flex flex-col justify-center items-center  z-[999] fixed top-0 left-0 p-5">
            <div className="bg-white p-6 w-full">
                <div className="p-20 flex items-center justify-center bg-gray-200 rounded-sm">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="80"
                        height="80"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="rgb(107 114 128 / var(--tw-bg-opacity))"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    >
                        <rect x="3" y="3" width="18" height="18" rx="2" />
                        <circle cx="8.5" cy="8.5" r="1.5" />
                        <path d="M20.4 14.5L16 10 4 20" />
                    </svg>
                </div>
                <div className="flex row items-center justify-center mt-5 gap-2">
                    <IconPhoto onPress={onPress} />
                    <IconPhoto onPress={onPress} />
                    <IconPhoto onPress={onPress} />
                </div>
            </div>
            <div
                className="bg-slate-600/40 w-full h-full absolute top-0 left-0 z-[-1]"
                onClick={onPress}
            ></div>
        </div>
    )
}

export default ModalImage