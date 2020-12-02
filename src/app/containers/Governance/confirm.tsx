import React, { useState, forwardRef, useImperativeHandle } from 'react'
import { Modal } from 'antd'
import './confirm.styl'

interface IProps {
    title: string | null
    text: string | null
    type: string | null
}

const ConfirmDialog = forwardRef((props, ref) => {
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
            setShow(false)
        },
        reset: async (params: IProps) => {
            setParams(params)
        }
    }))

    return (
        <Modal visible={show} onCancel={() => setShow(false)} footer={null} wrapClassName="confirmDialog" centered width={380} maskClosable={false}>
            <div className="confirmTitle">投票确认</div>
            <div className="confirmContent">
                <img src={require('./img/logo.png')} alt="" />
                <div className="title">提案：更改基础利率</div>
                <div className="content">这个提案把基础利率从10%改为8%</div>
            </div>
            <div className="confirmBtn">
                <div className="btn agree">赞成</div>
                <div className="btn against">反对</div>
            </div>
        </Modal>
    )
})

export default ConfirmDialog
