import axios from 'axios'
import { BASE_API_URL } from '../constant/Index'

const ApiManager = axios.create({
    baseURL: BASE_API_URL
})

ApiManager.defaults.headers.common['Content-Type'] = 'application/json';

export default ApiManager