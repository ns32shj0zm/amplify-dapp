import * as React from 'react'
import { RouteComponentProps } from 'react-router-dom'
import useSWR, { mutate } from 'swr'
import * as douYinServer from '../../services/baseServer/douYinServer'
import * as keys from './key'

function Login(): JSX.Element {
    const { data, error } = useSWR<douYinServer.IGetAuthorSalesResponse>(keys.common.xxx)
    const { data: testData, mutate: testMutate } = useSWR<{ x: string }>('x2', { initialData: { x: '1111' } })

    return (
        <div onClick={() => mutate('x2', { ...testData, x: '4444' })}>
            {data ? data.data?.errMsg : 'loading'}
            {testData.x}
        </div>
    )
}

export default Login
