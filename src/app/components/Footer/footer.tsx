import * as React from 'react'
import { useTranslation } from 'react-i18next'
import Email from './img/email.svg'
import Twitter from './img/twitter.svg'
import './footer.styl'

const Footer = (): JSX.Element => {
    const [t] = useTranslation()
    return (
        <div className="footer">
            <div className="footer-content">
                <div className="footer-content__item">
                    <div className="title">
                        <img src={require('./img/logo_1.png')} alt="" />
                    </div>
                    <div className="copyright">
                        <p>{t('Decentralized Financial Infrastructure')}</p>
                        <p>© 2020 Amplify Labs, Inc.</p>
                    </div>
                </div>
                <div className="footer-content__item">
                    <div className="title">{t('Contacts')}</div>
                    <div className="contact">
                        <a href="mailto:Contact@ampt.tech" className="item" target="__blank">
                            <img className="email" src={Email} alt="" />
                        </a>
                        <a href="https://twitter.com/AmptDefi" className="item" target="__blank">
                            <img className="twitter" src={Twitter} alt="" />
                        </a>
                    </div>
                </div>
                <div className="footer-content__item">
                    <div className="title">{t('Partners')}</div>
                    <div>
                        <a href="https://www.flovtec.com/" target="__blank">
                            <img className="pyImg" src={require('./img/flovtec.png')} alt="" />
                        </a>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Footer
