import storage from '../../utils/storage'
import * as React from 'react'
import { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { Form, Input, message, DatePicker } from 'antd'
import { RouteComponentProps, withRouter, Link } from 'react-router-dom'
import MD5 from 'md5.js'
import basicAction from '../../actions/baseAction'
import './register.styl'
import * as dayjs from 'dayjs'
export type IProps = RouteComponentProps

function useLogin(username, password) {
    const [loading, setLoading] = useState(true)
    const [response, setResponse] = useState({})
    const dispatch = useDispatch()

    useEffect(() => {
        if (username && password) {
            const load = async () => {
                const res = await dispatch(
                    basicAction.getAuthorSales({
                        username,
                        password
                    })
                )
                setLoading(false)
                if ((await res.payload)?.data?.code === -1) {
                    message.destroy()
                    message.error((await res.payload)?.data?.message)
                } else {
                    setResponse(res)
                }
            }
            load()
        }
    }, [username, password])

    return [loading, response]
}

const usePerson = personId => {
    const [loading, setLoading] = useState(true)
    const [person, setPerson] = useState({})
    useEffect(() => {
        setLoading(false)
    }, [personId])
    return [loading, person]
}

const Person = ({ personId }) => {
    const [loading, person] = usePerson(personId)

    if (loading === true) {
        return <p>Loading ...</p>
    }

    return (
        <div>
            <p>You're viewing: {person.name}</p>
            <p>Height: {person.height}</p>
            <p>Mass: {person.mass}</p>
        </div>
    )
}

function Login(props: IProps) {
    const dispatch = useDispatch()
    const [form] = Form.useForm()
    const [show, setShow] = useState('1')
    const [a, setA] = useState({})

    // useLogin(a.username, a.password)

    const onFinish = () => {
        form.validateFields()
            .then(async val => {
                setA(val)
                // try {
                //     const res = await dispatch(basicAction.userLogin({
                //         username: val.username,
                //         password: new MD5().update(val.password).digest('hex')
                //     }))
                //     if ((await res.payload)?.data?.code === -1) {
                //         message.destroy()
                //         message.error((await res.payload)?.data?.message)
                //     }
                //     if (storage.get('token')) {
                //         props.history.push('/')
                //     }
                // } catch (error) {
                //     throw(error)
                // }
            })
            .catch(err => {
                console.log(err)
            })
    }

    return (
        <div className="login">
            <Form className="login-form" form={form}>
                <Form.Item label="Username" name="username" rules={[{ required: true, message: 'Please input your username!' }]}>
                    <Input />
                </Form.Item>
                <Form.Item label="Password" name="password" rules={[{ required: true, message: 'Please input your password!' }]}>
                    <Input.Password />
                </Form.Item>
                <Form.Item label="Date" name="date" rules={[{ required: true, message: 'Please input your password!' }]}>
                    <DatePicker defaultPickerValue={dayjs()} />
                </Form.Item>
                <Form.Item>
                    <div className="btn" onClick={() => onFinish()}>
                        登录
                    </div>
                </Form.Item>
            </Form>
            <Person personId={show} />
            <div>
                Show:
                <button onClick={() => setShow('1')}>Luke</button>
                <button onClick={() => setShow('2')}>C-3PO</button>
            </div>
        </div>
    )
}

export default withRouter(Login)
