import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { Router } from 'react-router'
import zhCN from 'antd/es/locale/zh_CN'
import 'dayjs/locale/zh-cn'
import { ConfigProvider } from 'antd'
import store, { history } from './app/store'
import AppRouter from './app/router'
import 'antd/dist/antd.css';
import './assets/stylus/index.styl'
import './app/utils/i18n'

render(
    <ConfigProvider locale={zhCN}>
        <Provider store={store}>
            <Router history={history}>
                <AppRouter />
            </Router>
        </Provider>
    </ConfigProvider>,
    document.getElementById('root')
)

if (module.hot) {
    module.hot.accept(['./app/router'], () => {
        render(
            <ConfigProvider locale={zhCN}>
                <Provider store={store}>
                    <Router history={history}>
                        <AppRouter />
                    </Router>
                </Provider>
            </ConfigProvider>,
            document.getElementById('root')
        )
    })
}
