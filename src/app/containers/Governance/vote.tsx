import React, { useState, forwardRef, useImperativeHandle, useEffect, useRef } from 'react'
import { Modal, Input, Button } from 'antd'
import { useSelector } from 'react-redux'
import classnames from 'classnames'
import { useTranslation } from 'react-i18next'
import { delegate } from '../../utils/compoundTool'
import { IRootState } from '../../reducers/RootState'
import StatusDialog from '../App/StatusDialog'
import './vote.styl'

interface IProps {
    title: string | null
    text: string | null
    type: string | null
}

const VoteDialog = forwardRef((props, ref) => {
    const [show, setShow] = useState(false)
    const [address, setAddress] = useState('')
    const [type, setType] = useState(0)
    const { globalInfo, gasPrice } = useSelector((store: IRootState) => store.base)
    const StatusDialogRef = useRef<any>(null)
    const [t] = useTranslation()

    useImperativeHandle(ref, () => ({
        show: (params: IProps) => {
            setShow(true)
        },
        hide: async (params: IProps) => {
            setShow(false)
        }
    }))

    useEffect(() => {
        if (globalInfo.account) {
            setAddress(globalInfo.account)
        }
    }, [globalInfo, show])

    return (
        <>
            <Modal visible={show} onCancel={() => setShow(false)} footer={null} wrapClassName="voteDialog" centered width={380} maskClosable={false}>
                <div className="voteTitle">{t('Delegate')}</div>
                <div className="voteContent">
                    <div className="title">
                        <div className="text">{t('Delegate To')}</div>
                        <div className="switch">
                            <div
                                className={classnames('item', { cur: type === 0 })}
                                onClick={() => {
                                    setType(0)
                                    if (globalInfo.account) {
                                        setAddress(globalInfo.account)
                                    }
                                }}
                            >
                                {t('Self')}
                            </div>
                            <div
                                className={classnames('item', { cur: type === 1 })}
                                onClick={() => {
                                    setType(1)
                                    setAddress('')
                                }}
                            >
                                {t('Others')}
                            </div>
                        </div>
                    </div>
                    <Input
                        disabled={type === 0}
                        placeholder={t('Please enter the correct Ethereum address')}
                        value={address}
                        onChange={event => {
                            setAddress(event.target.value)
                        }}
                    />
                    <Button
                        disabled={!address}
                        className="btn"
                        onClick={async () => {
                            StatusDialogRef.current.show({
                                type: 'loading',
                                title: t('Transaction Confirmation'),
                                text: t('Please confirm the transaction in your wallet')
                            })
                            const res = await delegate(globalInfo.library, globalInfo.account, gasPrice, () =>
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
                        }}
                    >
                        {t('Delegate')}
                    </Button>
                </div>
            </Modal>
            <StatusDialog ref={StatusDialogRef} />
        </>
    )
})

export default VoteDialog
