import { times } from "../../../helper/ConvertDate";

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
                        {data?.pegawai?.name}
                    </span>
                    <span className="time">
                        {times(data?.tanggal)}
                    </span>
                </div>
                <span className="status">{data?.status}</span>
                {data?.komentars?.length > 0 && data?.komentars.map((e: any) => {
                    console.log("E NIH : ", e)
                    return (
                        <div className='flex flex-row justify-between w-full'>
                            <ul className='w-full'>
                                <li className='flex flex-row justify-between'>
                                    <span className=" progressText">
                                        {`- ${e.komentar}`}
                                    </span>
                                    <span className=" progressTime">
                                        {times(e.tanggal)}
                                    </span>
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