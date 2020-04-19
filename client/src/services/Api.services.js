import axios from "axios";
import conf from '../config/conf';

//export const baseURL = `${process.env.REACT_APP_BASE_URL}`;
const baseURL = `/api/v1`;

export const axiosInstance = axios.create({ baseURL });
export const cancelToken = axios.CancelToken
export const isCancel = (e) => axios.isCancel(e)

export class Api {
    static config() {
        try {
            const token = localStorage.getItem(conf.cmstoken);
            return (
                token && {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `JWT ${token}`
                    }
                }
            )
        }
        catch {
            return null
        }
    }

    static get(url, params, conf, cancel) {
        const headers = this.config()
        const config = {...headers, params, ...conf, cancelToken: new axios.CancelToken(c => c)}
        return axiosInstance.get(url, config);
    }

    static post(url, data, conf) {
        const headers = this.config()
        const config = { ...headers, ...conf }
        return axiosInstance.post(url, data, config)
    }

    static put(url, data, conf) {
        const headers = this.config()
        const config = { ...headers, ...conf }
        return axiosInstance.put(url, data, config)
    }

    static delete(url, conf) {
        const headers = this.config()
        const config = { ...headers, ...conf }
        return axiosInstance.delete(url, config)
    }
}