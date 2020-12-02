import React, { useState, forwardRef, useImperativeHandle } from 'react'
import { Modal, Input, Button } from 'antd'
import classnames from 'classnames'
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

    useImperativeHandle(ref, () => ({
        show: (params: IProps) => {
            setShow(true)
        },
        hide: async (params: IProps) => {
            setShow(false)
        }
    }))

    return (
        <Modal visible={show} onCancel={() => setShow(false)} footer={null} wrapClassName="voteDialog" centered width={380} maskClosable={false}>
            <div className="voteTitle">委托投票</div>
            <div className="voteContent">
                <div className="title">
                    <div className="text">委托给</div>
                    <div className="switch">
                        <div className={classnames('item', { cur: type === 0 })} onClick={() => setType(0)}>
                            自己
                        </div>
                        <div className={classnames('item', { cur: type === 1 })} onClick={() => setType(1)}>
                            他人
                        </div>
                    </div>
                </div>
                <Input
                    placeholder="输入一个OX地址"
                    value={address}
                    onChange={event => {
                        setAddress(event.target.value)
                    }}
                />
                <Button disabled={!address} className="btn">
                    委托
                </Button>
            </div>
        </Modal>
    )
})

export default VoteDialog
