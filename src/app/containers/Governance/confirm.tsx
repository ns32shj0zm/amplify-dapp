import React, { useState, forwardRef, useImperativeHandle } from 'react'
import { Modal } from 'antd'
import classnames from 'classnames'
import sleep from '../../utils/sleep'
import './confirm.styl'

interface IProps {
    title: string | null
    text: string | null
    type: string | null
}

const StatusDialog = forwardRef((props, ref) => {
    const [show, setShow] = useState(false)
    const [params, setParams] = useState<IProps>({
        title: null,
        text: null,
        type: null
    })

    useImperativeHandle(ref, () => ({
        show: (params: IProps) => {
            setShow(true)
            setParams(params)
        },
        hide: async (params: IProps) => {
            if (params) {
                setParams(params)
                await sleep(3)
            }
            setShow(false)
        },
        reset: async (params: IProps) => {
            setParams(params)
        }
    }))

    return (
        <Modal
            visible={show}
            onCancel={() => setShow(false)}
            footer={null}
            wrapClassName="statusDialog"
            centered
            closable={false}
            width={380}
            maskClosable={false}
        >
            <div className="statusTitle">投票确认</div>
            <div className="confirmDialog">
                <img src={require('./img/logo.png')} alt="" />
                <div>提案：更改基础利率</div>
                <div>这个提案把基础利率从10%改为8%</div>
            </div>
            <div className="confirmBtn">
                <div className="btn">赞成</div>
                <div className="btn">反对</div>
            </div>
        </Modal>
    )
})

export default StatusDialog
