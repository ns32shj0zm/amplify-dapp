import * as React from 'react'
import { RouteComponentProps, withRouter, Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { mutate } from 'swr'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import Layout from '../../components/Layout'
import * as baseResource from '../../resources/base'
import baseServer from '../../services/baseServer'
import useRequest from '../../utils/useRequest'
import './login.styl'

function Login(): JSX.Element {
    const [name, setName] = useState<undefined | string>('')
    const [nameError, setNameError] = useState(false)
    const [password, setPassword] = useState<undefined | string>('')
    const [passwordError, setPasswordError] = useState(false)
    // const { data, error } = useSWR('base.login', params => baseServer.login(params))
    const { data, error, mutate: mutate1 } = useRequest(baseResource.login3())

    const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
        const { value } = event.target
        setName(value)
        setNameError(false)
        if (!value) {
            setNameError(true)
        }
    }

    const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
        const { value } = event.target
        setPassword(value)
        setPasswordError(false)
        if (!value) {
            setPasswordError(true)
        }
    }

    const onSubmit = (): void => {
        // if (!name) return setNameError(true)
        // if (!password) return setPasswordError(true)
        console.log(1111)
        // mutate1(baseResource.login2({ name, password }))
        mutate(...baseResource.login2({ name, password }))
        // mutate('base.login', () => baseServer.login({ name, password }))

    }

    console.log(data, error, data.x)

    return (
        <Layout>
            <div className="login">
                <form noValidate autoComplete="off">
                    <div>
                        <TextField label="用户名" value={name} onChange={handleNameChange} error={nameError} />
                    </div>
                    <div>
                        <TextField label="密码" value={password} onChange={handlePasswordChange} error={passwordError} />
                    </div>
                    <Button className="btn" onClick={onSubmit}>
                        登录
                    </Button>
                    <Button className="btn">注册</Button>
                </form>
            </div>
        </Layout>
    )
}

export default withRouter(Login)
