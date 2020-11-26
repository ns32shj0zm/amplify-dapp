import React, { useState } from 'react'
import { RouteComponentProps } from 'react-router-dom'
import useSWR, { mutate } from 'swr'
import * as douYinServer from '../../services/baseServer/douYinServer'
import Children from './children'
import * as keys from './key'
import * as resources from '../../resources/swr'

export type IProps = RouteComponentProps

function Login(props: IProps): JSX.Element {
    // const { data, error } = useSWR(keys.common.xxx, () => douYinServer.getAuthorSales({ page: 1 }))
    const { data: testData, mutate: testMutate } = useSWR<{ x: string }>('x2', { initialData: { x: '' } })
    const [page, setPage] = useState(1)
    const { data: testData2, mutate: testMutate2 } = useSWR(['x3', page], (url, p) => douYinServer.getPlist({ p }))
    const { data, mutate: testMutate3 } = useSWR(resources.users({ page }))

    return (
        <div>
            <img src={require('@/assets/images/home_img_bg@3x.png')} alt="" />
            {data ? data.data?.errMsg : 'loading'}
            <div onClick={() => mutate('x2', { ...testData, x: '2222' })}>点击{testData?.x}</div>
            <div onClick={() => testMutate({ ...testData, x: '3333' })}>点击{testData?.x}</div>
            <Children />
            <div onClick={() => setPage(page + 1)}>setPage{page}</div>
        </div>
    )
}

export default Login
