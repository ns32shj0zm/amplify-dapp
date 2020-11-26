import { request } from '../../utils/request'
import { AxiosResponse } from 'axios'
interface IData {
    list: IList[]
    page_info: IPageInfo
}

interface IList {
    rank: number
    author_id: string
    avatar: string
    nickname: string
    label: string
    follower_count: number
    product_category: string
    live_show_count: number
    average_price: number
    sales: number
    sales_volume: number
    id: string
    room_id: string
}

interface IPageInfo {
    page: number
    totalCount: number
    totalPage: number
    size: number
}

export interface IGetAuthorSales {
    message(message: any)
    code: number
    data: IData
}

export type IGetAuthorSalesResponse = AxiosResponse<IGetAuthorSales>

export function getAuthorSales(data): Promise<AxiosResponse<IGetAuthorSales>> {
    return request(`douyin/live/rank/author/sales`, {
        method: 'GET',
        params: {
            ...data
        }
    })
}

export function getPlist(data): Promise<AxiosResponse<IGetAuthorSales>> {
    return request(`http://0.0.0.0:9000/p`, {
        method: 'GET',
        params: {
            ...data
        }
    })
}
