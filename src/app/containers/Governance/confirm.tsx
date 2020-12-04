import React, { useState, forwardRef, useImperativeHandle, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Modal } from 'antd'
import BigNumber from 'bignumber.js'
import { amptDecimals } from '../../utils/compoundTool'
import './confirm.styl'

interface IProps {
    id: number
    name: any
    description: any
    uri: string
    status: undefined | number
    proposal: Array<any>
    time: string
}

const ConfirmDialog = forwardRef((props, ref) => {
    const [show, setShow] = useState(false)
    const [params, setParams] = useState<IProps>({} as any)
    const [t, i18n] = useTranslation()
    const [key, setKey] = useState('')

    useImperativeHandle(ref, () => ({
        show: (params: IProps) => {
            setParams(params)
            setShow(true)
        },
        hide: async (params: IProps) => {
            setShow(false)
            setParams({} as any)
        }
    }))

    useEffect(() => {
        setKey(i18n.language === 'en_US' ? 'en' : 'zh')
    }, [i18n.language])

    console.log(params)

    return params.id ? (
        <Modal visible={show} onCancel={() => setShow(false)} footer={null} wrapClassName="confirmDialog" centered width={380} maskClosable={false}>
            <div className="confirmTitle">投票确认</div>
            <div className="confirmContent">
                <img src={require('./img/logo.png')} alt="" />
                <div className="title">{params.name ? params.name[key] : null}</div>
                <div className="content">{params.description ? params.description[key] : null}</div>
                <div className="link">
                    <a href={params.uri} target="__blank">
                        在Etherscan上查看
                    </a>
                </div>
                <div className="number">
                    <div className="agree">{+new BigNumber(+params.proposal[5]).dividedBy(new BigNumber(10).pow(amptDecimals))}</div>
                    <div className="icon">VS</div>
                    <div className="against">{+new BigNumber(+params.proposal[6]).dividedBy(new BigNumber(10).pow(amptDecimals))}</div>
                </div>
            </div>
            <div className="confirmBtn">
                <div className="btn agree">赞成</div>
                <div className="btn against">反对</div>
            </div>
        </Modal>
    ) : null
})

export default ConfirmDialog
