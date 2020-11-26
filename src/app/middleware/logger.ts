// import { Middleware } from 'redux'
import storage from '../utils/storage'
import { message } from 'antd'

export const logger /* : Middleware */ = (store, history) => next => action => {
    if (process.env.NODE_ENV === 'production' && action?.payload?.response?.status === 401) {
        if (action.error) {
            console.log(action)
            storage.remove('token')
            message.destroy()
            message.error('权限不足或登录超时')
            history.push('/login')
        }
    }
    return next(action)
}
