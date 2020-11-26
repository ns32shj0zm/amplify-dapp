import { request } from '../../utils/request'
import { AxiosResponse } from 'axios'
import { ConfigInterface, responseInterface} from 'swr'

export interface IGetAuthorSales {
    errCode: number
    errMsg: string
}

// 登录帐号
export function login(data): Promise<AxiosResponse<IGetAuthorSales>> {
    return request('https://cnodejs.org/api/v1/topics', {
        // return request(`/112`, {
        method: 'GET',
        params: {
            ...data
        }
    })
}

// 注册帐号
export function register(data): Promise<AxiosResponse<IGetAuthorSales>> {
    return request(`/111`, {
        method: 'POST',
        data
    })
}

// 查询账户余款表格
export function userInfo(data): Promise<AxiosResponse<IGetAuthorSales>> {
    return request(`/user/getmember`)
}
