import { createAction } from 'redux-actions'
// import baseServer from '../../services/baseServer'
import { BASE } from '../../reducers/baseReducer/baseReducer'
// import { DouYin } from '../../reducers/baseReducer/baseReducer'

export const setViewWidth = data => createAction(BASE.SET_VIEW_WIDTH, () => data)()
// export const getAuthorSales = data => createAction(DouYin.GET_AUTHOR_SALES, () => baseServer.getAuthorSales(data))()
