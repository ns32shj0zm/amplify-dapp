import * as React from 'react'
import * as Loadable from 'react-loadable'
import { Spin } from 'antd'

const Loading = (): JSX.Element => {
    return (
        <div className="lt-spin">
            <Spin size="large" tip="加载中..." />
        </div>
    )
}

export default (loader: Promise<any>) => {
    return Loadable({
        loader: () => loader,
        loading: Loading
    })
}
