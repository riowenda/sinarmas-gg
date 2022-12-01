import ApiManager from "../ApiManager"
import {API_URI, MD_FUEL_STATION_AVAILABLE, MD_FUEL_STATION_URI} from "../../constant/Index";

export const FuelStationListModalAPI = async () => {
    try {
        const result = await ApiManager(API_URI+MD_FUEL_STATION_URI, {
            method: "GET"
        })
        return result.data
    } catch (error) {
        return error
    }
}

export const FuelStationAvailableListAPI = async () => {
    try {
        const result = await ApiManager(API_URI+MD_FUEL_STATION_AVAILABLE, {
            method: "GET",
        })
        return result.data
    } catch (error) {
        return error
    }
}

export const FuelStationAPI = async (id: string) => {
    try {
        const result = await ApiManager(API_URI+MD_FUEL_STATION_URI+"/"+id, {
            method: "GET",
        })
        return result.data
    } catch (error) {
        return error
    }
}