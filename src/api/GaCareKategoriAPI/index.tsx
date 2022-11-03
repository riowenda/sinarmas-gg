import ApiManager from "../ApiManager"


export const GaCareKategoriAPI = async (token: string) => {
    try {
        const result = await ApiManager('/api/gacare/kategoris', {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            }
        })

        return result.data
    } catch (error) {
        return error
    }
}

export const GaCareKategoriUpdateAPI = async (identity: string, token: string, data: {
    id: number,
    parent: string,
    name: string,
    resolutionTime: number
}) => {
    try {
        const result = await ApiManager('/api/gacare/kategoris/update', {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json',
                identity: identity,
                Authorization: `Bearer ${token}`
            },
            data: data
        })

        return result.data
    } catch (error) {
        return error
    }
}

export const GaCareKategoriPagingAPI = async (token: string, data: {
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
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            data: data
        })

        return result.data
    } catch (error) {
        return error
    }
}

export const GaCareKategoriCreateAPI = async (token: string, identity: string, data: {
    id: string,
    parent: string,
    name: string,
    resolutionTime: 0
}) => {
    try {
        const result = await ApiManager('/api/gacare/kategoris/list-paging', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
                identity: identity
            },
            data: data
        })

        return result.data
    } catch (error) {
        return error
    }
}

export const GaCareKategoriListSelectAPI = async (token: string, key: string, term: string, page: number) => {
    try {
        const result = await ApiManager(`/api/gacare/kategoris/list-select2?key=${key}&term=${term}&page=${page}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            }
        })

        return result.data
    } catch (error) {
        return error
    }
}

export const GaCareKategoriDetailAPI = async (token: string, id: string) => {
    try {
        const result = await ApiManager(`/api/gacare/kategoris/detail/${id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            }
        })

        return result.data
    } catch (error) {
        return error
    }
}

export const GaCareKategoriDeleteAPI = async (token: string, id: string, identity: string) => {
    try {
        const result = await ApiManager(`/api/gacare/kategoris/delete/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": 'Application/json',
                Authorization: `Bearer ${token}`,
                identity: identity
            }
        })

        return result.data
    } catch (error) {
        return error
    }
}