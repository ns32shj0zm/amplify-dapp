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

export function getProposals(): Promise<AxiosResponse<IGasPrice>> {
    return {
        code: 0,
        results: [
            {
                id: 1,
                name: { zh: '提案1', en: 'Proposal 1' },
                description: { zh: '这是提案1的介绍', en: 'This is the description of Proposal 1' },
                uri: 'https://rinkeby.etherscan.io/tx/0x12daf04a76c4571b557514725e3e8d6655cca7dddeee5f533aeaa0e33a35661e'
            },
            {
                id: 2,
                name: { zh: '提案2', en: 'Proposal 2' },
                description: { zh: '这是提案2的介绍', en: 'This is the description of Proposal 2' },
                uri: 'https://rinkeby.etherscan.io/tx/0x12daf04a76c4571b557514725e3e8d6655cca7dddeee5f533aeaa0e33a35661e'
            }
        ]
    }
    // return request('http://localhost:3100/api/proposals', {
    //     method: 'GET'
    // })
}
