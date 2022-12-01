import { date, dateDayTimes, dateSort, dateSortByAscending, times } from "../../../helper/ConvertDate";

interface TimelineItemProps {
    data: {
        [key: string]: string | Date | object;
        tanggal: string;
        pegawai: {
            name: string;

        };
        komentars: {}[]
    };
}

const TimelineItem: React.FC<TimelineItemProps> = ({ data }) => {

    return (
        <div className="timeline-item ">
            <div className="timeline-item-content">
                <div className='flex flex-row justify-between w-full'>
                    <span className="tag">
                        {`${data?.pegawai?.name} - ${date(data?.tanggal)}`}
                    </span>
                    <span className="time">
                        {times(data?.tanggal)}
                    </span>
                </div>
                <span className="status">{data?.status === "CLOSED" ? "COMPLETED" : data?.status}</span>
                {data?.keterangan != null && (
                    <span>{data?.keterangan}</span>
                )}
                {data?.komentars?.length > 0 && dateSortByAscending(data?.komentars).map((e: any, index: any) => {
                    return (
                        <div className='flex flex-row justify-between w-full gap-2' key={index}>
                            <ul className='w-full'>
                                <li className='flex flex-row justify-between mx-[10px] gap-2'>
                                    <span className=" progressText">
                                        {`- ${e.komentar}`}
                                    </span>
                                    <span className=" progressTime">
                                        {times(e?.tanggal)}
                                    </span>
                                    {/* <div className="flex flex-col">
                                        <span className=" progressTime">
                                            {date(e?.tanggal)}
                                        </span>
                                        
                                    </div> */}
                                </li>
                            </ul>

                        </div>
                    )
                })}
                <span className="circle" />
            </div>
        </div>
    )
}

export default TimelineItem