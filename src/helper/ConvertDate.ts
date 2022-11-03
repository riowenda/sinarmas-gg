import moment from "moment"

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