import * as React from 'react'
import { useTranslation } from 'react-i18next'
import Email from './img/email.png'
import Twitter from './img/twitter.svg'
import Medium from './img/medium.svg'
import Reddit from './img/reddit.svg'
import Facebook from './img/facebook.svg'
import Linkedin from './img/linkedin.svg'
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
                        <a href="mailto:contact@ampt.tech" target="__blank" className="item">
                            <img className="email" src={Email} alt="" />
                        </a>
                        <a href="https://www.reddit.com/user/AMPTdefi" target="__blank" className="item">
                            <img src={Reddit} alt="" className="reddit" />
                        </a>
                        <a href="https://medium.com/ampt-defi" target="__blank" className="item">
                            <img src={Medium} alt="" className="medium" />
                        </a>
                        <a href="https://twitter.com/ampt_defi" target="__blank" className="item">
                            <img className="twitter" src={Twitter} alt="" />
                        </a>
                        <a href="https://www.facebook.com/Amplify-Defi-104124308174922" target="__blank" className="item">
                            <img src={Facebook} alt="" className="facebook" />
                        </a>
                        <a href="https://www.linkedin.com/company/amplify-tokenized-solutions-pte-ltd/" target="__blank" className="item">
                            <img src={Linkedin} alt="" className="linkedin" />
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
