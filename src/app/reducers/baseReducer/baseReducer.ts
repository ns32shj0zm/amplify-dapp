import produce from 'immer'
import { errorHandle } from '../../utils'

import { IGetAuthorSales } from '../../services/baseServer/douYinServer'

export enum BASE {
    SET_VIEW_WIDTH = 'SET_VIEW_WIDTH'
}

export interface IBaseState {
    viewWidth: number
    // authorSales: IGetAuthorSales
}

export const baseState: IBaseState = {
    viewWidth: document.body.clientWidth
    // authorSales: {} as IGetAuthorSales
}

export default {
    [BASE.SET_VIEW_WIDTH]: {
        next: produce((draft: IBaseState, action: IAction) => {
            draft.viewWidth = action.payload.data
        }),
        throw: (state, action) => errorHandle(state, action)
    }
}
