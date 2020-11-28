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

export function updateGasPrice(): Promise<AxiosResponse<IGasPrice>> {
    return request('https://ethgasstation.info/api/ethgasAPI.json', {
        method: 'GET'
    })
}
