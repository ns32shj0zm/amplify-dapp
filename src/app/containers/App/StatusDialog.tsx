import React, { useState, forwardRef, useImperativeHandle } from 'react'
import { Modal } from 'antd'
import classnames from 'classnames'
import sleep from '../../utils/sleep'
import './StatusDialog.styl'

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
            <div className="statusTitle">{params.title}</div>
            <div className={classnames('statsContent', params.type === 'pending' ? `loading ${params.type}` : params.type)}>
                {params.type === 'loading' || params.type === 'pending' ? (
                    <section>
                        <div className="sk-circle-bounce">
                            <div className="sk-child sk-circle-1"></div>
                            <div className="sk-child sk-circle-2"></div>
                            <div className="sk-child sk-circle-3"></div>
                            <div className="sk-child sk-circle-4"></div>
                            <div className="sk-child sk-circle-5"></div>
                            <div className="sk-child sk-circle-6"></div>
                            <div className="sk-child sk-circle-7"></div>
                            <div className="sk-child sk-circle-8"></div>
                            <div className="sk-child sk-circle-9"></div>
                            <div className="sk-child sk-circle-10"></div>
                            <div className="sk-child sk-circle-11"></div>
                            <div className="sk-child sk-circle-12"></div>
                        </div>
                    </section>
                ) : null}
                <div className="statusText">
                    <span>{params.text}</span>
                </div>
            </div>
        </Modal>
    )
})

export default StatusDialog
