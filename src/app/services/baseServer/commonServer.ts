import { request } from '../../utils/request'
import { AxiosResponse } from 'axios'

export interface IGasPrice {
    fast: number
    fastest: number
    safeLow: number
    average: number
    block_time: number
    blockNum: number
    speed: number
    safeLowWait: number
    avgWait: number
    fastWait: number
    fastestWait: number
    gasPriceRange: { [key: string]: number }
}

export interface IGetProposals {
    code: number
    results: Result[]
}

export interface Result {
    id: number
    name: Description
    description: Description
    uri: string
}

export interface Description {
    zh: string
    en: string
}

export function updateGasPrice(): Promise<AxiosResponse<IGasPrice>> {
    return request('https://ethgasstation.info/api/ethgasAPI.json', {
        method: 'GET'
    })
}

export function getProposals(): Promise<AxiosResponse<IGetProposals>> {
    return request('/api/proposals', {
        method: 'GET'
    })
}
