import { CardDashboardProps } from "./CardDashboard.config"


const CardDashboard: React.FC<CardDashboardProps> = ({ cardDashboardCategori, title }) => {
    return (
        <div className="divide-y divide-gray-200 overflow-hidden border border-1 border-gray-300 rounded-lg bg-white">
            <div className="px-4 py-4 p-6">
                <h3 className="text-md font-bold text-gray-900">
                    {title}
                </h3>
                {cardDashboardCategori == 'ongoing' ? (
                    <div className="divide-y divide-gray-200">
                        <div className="grid grid-cols-3 gap-2 mt-4">
                            <span className="text-left font-bold text-red-800">
                                1 Jan 2022
                            </span>
                            <span className="items-center mx-auto">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke-width="1.5"
                                    stroke="currentColor"
                                    className="w-6 h-6"
                                >
                                    <path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        d="M12.75 15l3-3m0 0l-3-3m3 3h-7.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                </svg>
                            </span>
                            <span className="text-right font-bold text-red-800">
                                5 Jan 2022
                            </span>
                        </div>
                        <div className="mt-2">
                            <div className="mt-2">
                                <span>Survei Lokasi</span>
                            </div>
                        </div>
                    </div>
                ) : cardDashboardCategori == 'meal' ? (
                    <>
                        <div className="grid grid-cols-2 gap-2 mt-4">
                            <span className="inline-flex items-center text-gray-900">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                    className="w-6 h-5 mr-6 text-green-600"
                                >
                                    <path
                                        fill-rule="evenodd"
                                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                                        clip-rule="evenodd"
                                    />
                                </svg>
                                Pagi
                            </span>
                            <span className="text-right text-gray-900">Kantin BIB</span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 mt-4">
                            <span className="inline-flex items-center text-gray-900">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                    className="w-6 h-5 mr-6 text-gray-200"
                                >
                                    <path
                                        fill-rule="evenodd"
                                        d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm3 10.5a.75.75 0 000-1.5H9a.75.75 0 000 1.5h6z"
                                        clip-rule="evenodd"
                                    />
                                </svg>
                                Siang
                            </span>
                            <span className="text-right text-gray-900">Kantin BIB</span>
                        </div>
                    </>

                ) : cardDashboardCategori == 'fuel' ? (
                    <>
                        <div className="mt-4">
                            <span className="text-gray-900">BIB123 - AB 1234 CD</span>
                        </div>
                        <div className="mt-2">
                            <span className="text-gray-500">1 Jan 2022</span>
                        </div>
                    </>
                ) : null}
            </div>
            {cardDashboardCategori == 'fuel' && (<div className="px-4 py-4 sm:px-6">
                <p className="text-green-600 font-bold">Disetujui GA</p>
            </div>)}
        </div>
    )
}

export default CardDashboard