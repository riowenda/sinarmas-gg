import TimelineItem from "./TimelineItem"
import React from 'react'
import { times } from "../../../helper/ConvertDate";


interface TimelineProps {
  data: {
    [key: string]: string | boolean | object;
    id: string;
    identity: string;
    isActive: boolean;
    komentar: [];
    pegawai: {};
    status: string;
    tanggal: string;
  }[]
}

const Timeline: React.FC<TimelineProps> = ({ data }) => {




  return (
    <React.Fragment>
      {data?.length > 0 && (
        <div className="timeline-container">
          {data.map((data: any, idx: number) => (
            <TimelineItem
              data={data}
              key={idx}
            />
          ))}
        </div>
      )}
    </React.Fragment>
  )
}

export default Timeline