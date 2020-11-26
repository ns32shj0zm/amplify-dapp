import axios, { AxiosResponse, AxiosRequestConfig } from 'axios'
import { baseService } from './config'
import storage from './storage'

axios.defaults.baseURL = baseService
axios.defaults.withCredentials = false

function checkStatus(response: AxiosResponse): AxiosResponse {
    if (response.status >= 200 && response.status < 300) {
        return response
    }
    const error = new Error(response.statusText)
    throw error
}

export async function request(reqUrl: string, options: AxiosRequestConfig = { method: 'GET' }): Promise<AxiosResponse> {
    let acNum = ''
    if (reqUrl.indexOf('do') !== -1) {
        acNum = reqUrl.split('&')[2].split('=')[1]
    }
    if (!(acNum === '112' || acNum === '111')) {
        axios.defaults.headers.common['authKey'] = storage.get('token') ? storage.get('token') : ''
    }
    const response = await axios(reqUrl, options)
        .then(checkStatus)
        .catch(err => {
            throw err
        })
    return response
}
