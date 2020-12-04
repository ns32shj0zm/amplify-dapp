import { createAction } from 'redux-actions'
import baseServer from '../../services/baseServer'
import { BASE } from '../../reducers/baseReducer/baseReducer'

export const setViewWidth = data => createAction(BASE.SET_VIEW_WIDTH, () => data)()
export const setGlobalInfo = data => createAction(BASE.SET_GLOBAL_INFO, () => data)()
export const updateGasPrice = () => createAction(BASE.SET_GAS_PRICE, () => baseServer.updateGasPrice())()
export const getProposals = () => createAction(BASE.SET_PROPOSALS, () => baseServer.getProposals())()
