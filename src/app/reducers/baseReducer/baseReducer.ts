import produce from 'immer'
import { errorHandle } from '../../utils'
import { eX } from '../../general/helpers'
import { BigNumber } from 'bignumber.js'
import { IGetProposals } from '../../services/baseServer/commonServer'

export enum BASE {
    SET_VIEW_WIDTH = 'SET_VIEW_WIDTH',
    SET_GAS_PRICE = 'SET_GAS_PRICE',
    SET_GLOBAL_INFO = 'SET_GLOBAL_INFO',
    SET_PROPOSALS = 'SET_PROPOSALS'
}

export interface IBaseState {
    viewWidth: number
    gasPrice: BigNumber
    globalInfo: {
        account: any
        library: any
    }
    proposals: Array<IGetProposals>
}

export const baseState: IBaseState = {
    viewWidth: document.body.clientWidth,
    gasPrice: new BigNumber(0),
    globalInfo: {
        account: null,
        library: null
    },
    proposals: [] as Array<IGetProposals>
}

export default {
    [BASE.SET_VIEW_WIDTH]: {
        next: produce((draft: IBaseState, action) => {
            draft.viewWidth = action.payload
        }),
        throw: (state, action) => errorHandle(state, action)
    },
    [BASE.SET_GLOBAL_INFO]: {
        next: produce((draft: IBaseState, action) => {
            draft.globalInfo = action.payload
        }),
        throw: (state, action) => errorHandle(state, action)
    },
    [BASE.SET_GAS_PRICE]: {
        next: produce((draft: IBaseState, action: IAction) => {
            draft.gasPrice = eX(action.payload.data.fast, 8)
        }),
        throw: (state, action) => errorHandle(state, action)
    },
    [BASE.SET_PROPOSALS]: {
        next: produce((draft: IBaseState, action: IAction) => {
            draft.proposals = action.payload.data.results
        }),
        throw: (state, action) => errorHandle(state, action)
    }
}
