import * as React from 'react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { RouteComponentProps, withRouter } from 'react-router-dom'
import classnames from 'classnames'
import { Drawer } from 'antd'
import { useWeb3React } from '@web3-react/core'
import { injected } from '../../general/connectors'
import { useEagerConnect, useInactiveListener } from '../../general/hooks'
import { getShortenAddress } from '../../utils/'
import './header.styl'

interface IProps extends RouteComponentProps {
    type?: string[]
    systemName?: string
    children?: React.ReactNode
}

const Login = (): React.ReactElement => {
    const [t] = useTranslation()
    const { account, library, activate, deactivate, active } = useWeb3React()
    const triedEager = useEagerConnect()
    const onConnectClick = (): void => {
        activate(injected)
    }
    useInactiveListener(!triedEager)
    return <div className="login">{active ? <div>{getShortenAddress(account)}</div> : <div onClick={onConnectClick}>{t('Login')}</div>}</div>
}

const Header: React.FunctionComponent<IProps> = (props: IProps): React.ReactElement => {
    const jump = (target: string): void => {
        props.history.push(target)
    }
    const [t, i18n] = useTranslation()
    const changLng = (l: string): void => {
        i18n.changeLanguage(l)
        props.history.replace(`?lng=${l}`)
    }
    const { pathname } = props.history.location
    const [visible, setVisible] = useState(false)

    return (
        <header className="lt-header">
            <div className="main">
                <div className="left">
                    <div className="logo" onClick={() => (window.location.href = 'https://ampt.tech/')}></div>
                </div>
                {/* {props.children} */}
                <div className="nav">
                    <div className={classnames({ cur: pathname === '/' })} onClick={() => jump('/')}>
                        Amplify Lend
                    </div>
                    <div className={classnames({ cur: /governance/gi.test(pathname) })} onClick={() => jump('/governance')}>
                        Governance
                    </div>
                </div>
                <div className="right">
                    <div className="lang">
                        <span className={classnames({ cur: i18n.language === 'zh_CN' })} onClick={() => changLng('zh_CN')}>
                            中文
                        </span>
                        <span>|</span>
                        <span className={classnames({ cur: i18n.language === 'en_US' })} onClick={() => changLng('en_US')}>
                            English
                        </span>
                    </div>
                    <Login />
                </div>
            </div>
            <div className="mobile">
                <div className="logo" onClick={() => jump('/')}></div>
                <div className="right">
                    <div className="lang">
                        <span className={classnames({ cur: i18n.language === 'zh_CN' })} onClick={() => changLng('zh_CN')}>
                            中文
                        </span>
                        <span>|</span>
                        <span className={classnames({ cur: i18n.language === 'en_US' })} onClick={() => changLng('en_US')}>
                            En
                        </span>
                    </div>
                    <div className="icon" onClick={() => setVisible(true)}></div>
                </div>
            </div>
            <Drawer placement="right" closable={false} onClose={() => setVisible(false)} visible={visible} width={150} className="Drawer">
                <Login />
                <div className={classnames('item', { cur: /app/gi.test(pathname) })} onClick={() => jump('/app')}>
                    Amplify Lend
                </div>
                <div className={classnames('item', { cur: /governance/gi.test(pathname) })} onClick={() => jump('/governance')}>
                    Governance
                </div>
            </Drawer>
        </header>
    )
}

export default withRouter(Header)
