import moment, { Moment } from "moment"

export const date = (timestamp: string) => {
    const convertDate = moment.utc(timestamp).local().format('DD MMMM YYYY')

    return convertDate
}

export const times = (timestamp: string) => {
    const convertTimes = moment.utc(timestamp).local().format('h:mm a')

    return convertTimes
}

export const dateDay = (timestamp?: string) => {
        const convertDate = moment.utc(timestamp).local().format('dddd')
    

    return convertDate
}

export const dateDayTimes = (timestamp?: string) => {
    const convertDate = moment.utc(timestamp).local().format("DD MMMM YYYY h:mm a")

    return convertDate
}
//untuk menyamakan dengan datetime BE
export const convertTZ = (date: string, tzString: string) => {
    return new Date((typeof date === "string" ? new Date(date) : date).toLocaleString("en-US", {timeZone: tzString}));
}

export const dateSort =  (data: any) => {
    const arr =  data?.sort(function(a: any, b: any) {
        const dateA = new Date(a.tanggal).getTime()
        const dateB = new Date(b.tanggal).getTime()

        return dateA - dateB
    })

    return arr
}

export const dateSortByAscending =  (data: any) => {
    const arr =  data?.sort(function(a: any, b: any) {
        const dateA = new Date(a.tanggal).getTime()
        const dateB = new Date(b.tanggal).getTime()

        return dateB - dateA
    })

    return arr
}

export const countdown =  (timestamp?: string) => {
    const targetTime = moment.utc(timestamp).local().format("DD-")
   
    return targetTime
}

const formatInt = (int: number): string => {
  if (int < 10) {
    return `0${int}`;
  }
  return `${int}`;
};

export const formatDuration = (time: string): string => {
  const seconds = moment.duration(time).seconds();
  const minutes = moment.duration(time).minutes();
  const hours = moment.duration(time).hours();
  if (hours > 0) {
    return `${formatInt(hours)}:${formatInt(minutes)}:${formatInt(seconds)}`;
  }
  if (minutes > 0) {
    return `${formatInt(minutes)}:${formatInt(seconds)}`;
  }
  return `00:${formatInt(seconds)}`;
};