import React, { useState, forwardRef, useImperativeHandle, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { Modal, Button } from 'antd'
import BigNumber from 'bignumber.js'
import { useSelector } from 'react-redux'
import { amptDecimals, castVote } from '../../utils/compoundTool'
import StatusDialog from '../App/StatusDialog'
import './confirm.styl'
import { IRootState } from '../../reducers/RootState'

interface IProps {
    id: number
    name: any
    description: any
    uri: string
    status: undefined | number
    proposal: Array<any>
    time: string
    hasVoted: boolean
}

const ConfirmDialog = forwardRef((props, ref) => {
    const [show, setShow] = useState(false)
    const [params, setParams] = useState<IProps>({} as any)
    const [t, i18n] = useTranslation()
    const [key, setKey] = useState('')
    const { globalInfo, gasPrice } = useSelector((store: IRootState) => store.base)
    const StatusDialogRef = useRef<any>(null)

    const handleVote = async (bool): Promise<void> => {
        StatusDialogRef.current.show({
            type: 'loading',
            title: t('Transaction Confirmation'),
            text: t('Please confirm the transaction in your wallet')
        })
        const res = await castVote(globalInfo.library, params.id, bool, () =>
            StatusDialogRef.current.reset({
                type: 'pending',
                title: t('Transaction Confirmation'),
                text: t('Transaction Pending')
            })
        )
        if (res) {
            StatusDialogRef.current.hide({
                type: 'confirm',
                title: t('Transaction Confirmation'),
                text: t('Transaction Confirmed')
            })
        } else {
            StatusDialogRef.current.hide({ type: 'error', title: t('Transaction Error'), text: t('Transaction Error') })
        }
    }

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
        <>
            <Modal
                visible={show}
                onCancel={() => setShow(false)}
                footer={null}
                wrapClassName="confirmDialog"
                centered
                width={380}
                maskClosable={false}
            >
                <div className="confirmTitle">{t('Vote')}</div>
                <div className="confirmContent">
                    <img src={require('./img/logo.png')} alt="" />
                    <div className="title">{params.name ? params.name[key] : null}</div>
                    <div className="content">{params.description ? params.description[key] : null}</div>
                    <div className="link">
                        <a href={params.uri} target="__blank">
                            {t('View on Etherscan')}
                        </a>
                    </div>
                    <div className="number">
                        <div className="agree">{+new BigNumber(+params.proposal[5]).dividedBy(new BigNumber(10).pow(amptDecimals))}</div>
                        <div className="icon">VS</div>
                        <div className="against">{+new BigNumber(+params.proposal[6]).dividedBy(new BigNumber(10).pow(amptDecimals))}</div>
                    </div>
                </div>
                {params.status === 1 && !params.hasVoted ? (
                    <div className="confirmBtn">
                        <Button className="btn agree" onClick={() => handleVote(true)}>
                            {t('Agree')}
                        </Button>
                        <Button className="btn against" onClick={() => handleVote(false)}>
                            {t('Against')}
                        </Button>
                    </div>
                ) : null}
            </Modal>
            <StatusDialog ref={StatusDialogRef} />
        </>
    ) : null
})

export default ConfirmDialog
