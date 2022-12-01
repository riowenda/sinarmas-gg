import packageJson from '../../package.json';
import axios from 'axios'
import {APP_MODE_DEV, APP_MODE_PROD, BASE_API_URL, BASE_API_URL_DEV, pref_identity, pref_token} from '../constant/Index'

export const BaseAPI = () => {
    return ""+(packageJson.mode === APP_MODE_PROD ? BASE_API_URL : BASE_API_URL_DEV); //window.localStorage.getItem(pref_identity));
}

const ApiManager = axios.create({
    baseURL: BaseAPI()
});

ApiManager.defaults.headers.common['Content-Type'] = 'application/json';

// @ts-ignore
ApiManager.defaults.headers.common['Identity'] = window.localStorage.getItem(pref_identity);

// @ts-ignore
ApiManager.defaults.headers.common['Authorization'] = `Bearer ${window.localStorage.getItem(pref_token)}`;

export default ApiManager