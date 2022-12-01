import ApiManager from "../ApiManager";
import {
    API_URI,
    COUNT_CHANGE_URI, COUNT_DO_URI, COUNT_FUEL_FINANCE_URI,
    COUNT_FUEL_URI, COUNT_ODO_URI, COUNT_OTHER_FINANCE_URI,
    COUNT_OTHER_URI,
    COUNT_P2H_URI, COUNT_PO_URI,
    COUNT_TEMPORARY_URI
} from "../../constant/Index";

export const CountP2H =async () => {
    try {
        const result = await ApiManager(API_URI+COUNT_P2H_URI, {
            method : "GET",
            headers : {}
        })

        return result.data
    }catch(error) {
        return error
    }
}

export const CountFuel =async (tipe: string) => {
    if(tipe === 'GA') {
        try {
            const result = await ApiManager(API_URI + COUNT_FUEL_URI, {
                method: "GET"
            })

            return result.data
        } catch (error) {
            return error
        }
    } else {
        try {
            const result = await ApiManager(API_URI + COUNT_FUEL_FINANCE_URI, {
                method: "GET",
            })

            return result.data
        } catch (error) {
            return error
        }
    }
}

export const CountOtherFuel =async (tipe: string) => {
    if(tipe === 'GA') {
        try {
            const result = await ApiManager(API_URI + COUNT_OTHER_URI, {
                method: "GET",
            })

            return result.data
        } catch (error) {
            return error
        }
    } else {
        try {
            const result = await ApiManager(API_URI + COUNT_OTHER_FINANCE_URI, {
                method: "GET",
            })

            return result.data
        } catch (error) {
            return error
        }
    }
}

export const CountTemporary =async () => {
    try {
        const result = await ApiManager(API_URI+COUNT_TEMPORARY_URI, {
            method : "GET",
        })

        return result.data
    }catch(error) {
        return error
    }
}

export const CountChange =async () => {
    try {
        const result = await ApiManager(API_URI+COUNT_CHANGE_URI, {
            method : "GET"
        })

        return result.data
    }catch(error) {
        return error
    }
}

export const CountOdo =async () => {
    try {
        const result = await ApiManager(API_URI+COUNT_ODO_URI, {
            method : "GET",
        })

        return result.data
    }catch(error) {
        return error
    }
}

export const CountPO =async () => {
    try {
        const result = await ApiManager(API_URI+COUNT_PO_URI, {
            method : "GET",
        })

        return result.data
    }catch(error) {
        return error
    }
}

export const CountDO =async () => {
    try {
        const result = await ApiManager(API_URI+COUNT_DO_URI, {
            method : "GET",
        })

        return result.data
    }catch(error) {
        return error
    }
}