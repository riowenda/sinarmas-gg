import ApiManager from "../ApiManager"


export const GaCareKategoriAPI = async () => {
    try {
        const result = await ApiManager('/api/gacare/kategoris/list-tree', {
            method: "GET"
        })

        return result.data
    } catch (error) {
        return error
    }
}

export const GaCareKategoriUpdateAPI = async (data: {
    id: number,
    parent: string,
    name: string,
    resolutionTime: number
}) => {
    try {
        const result = await ApiManager('/api/gacare/kategoris/update', {
            method: "PUT",
            data: data
        })

        return result.data
    } catch (error) {
        return error
    }
}

export const GaCareKategoriPagingAPI = async (data: {
    start: 0,
    length: 0,
    draw: 0,
    order: [
        {
            column: 0,
            dir: string
        }
    ],
    column: [
        {
            data: string,
            name: string,
            searchable: boolean,
            orderable: boolean,
            search: {
                value: string,
                regexp: string
            }
        }
    ],
    search: {
        value: string,
        regexp: string
    }

}) => {
    try {
        const result = await ApiManager('/api/gacare/kategoris/list-paging', {
            method: 'POST',
            data: data
        })

        return result.data
    } catch (error) {
        return error
    }
}

export const GaCareKategoriCreateAPI = async (data: {
    id: string,
    parent: string,
    name: string,
    resolutionTime: 0
}) => {
    try {
        const result = await ApiManager('/api/gacare/kategoris/list-paging', {
            method: "POST",
            data: data
        })

        return result.data
    } catch (error) {
        return error
    }
}

export const GaCareKategoriListSelectAPI = async (key: string, term: string, page: number) => {
    try {
        const result = await ApiManager(`/api/gacare/kategoris/list-select2?key=${key}&term=${term}&page=${page}`, {
            method: "GET",
        })

        return result.data
    } catch (error) {
        return error
    }
}

export const GaCareKategoriDetailAPI = async (id: string) => {
    try {
        const result = await ApiManager(`/api/gacare/kategoris/detail/${id}`, {
            method: "GET"
        })

        return result.data
    } catch (error) {
        return error
    }
}

export const GaCareKategoriDeleteAPI = async (id: string) => {
    try {
        const result = await ApiManager(`/api/gacare/kategoris/delete/${id}`, {
            method: "DELETE",
        })

        return result.data
    } catch (error) {
        return error
    }
}