import * as React from 'react'
import { useSelector } from 'react-redux'
import { RouteComponentProps, withRouter, Link } from 'react-router-dom'
import classnames from 'classnames'
import { useTranslation } from 'react-i18next'
import Layout from '../../components/Layout'
import Header from '../../components/Header'
import { IRootState } from '../../reducers/RootState'
import './home.styl'

type IProps = RouteComponentProps

const imgData = () => {
    return {
        superList: [
            {
                icon: require('./img/CLIPBOARD.png'),
                name: 'Credit Granting',
                text:
                    'AMPLIFY will use its years of experience in the supply chain finance and blockchain industries to establish an on-chain governance agreement.'
            },
            {
                icon: require('./img/icon1.png'),
                name: 'On-chain Financing',
                text: 'AMPLIFY argues that current developments in DeFi highlight the advantages of financial transactions on the chain.'
            },
            {
                icon: require('./img/icon2.png'),
                name: 'Strong Liquidity',
                text: 'Because the global digital asset market is a decentralized financial institution, it creates a vast pool of liquidity.'
            }
        ],
        // B2B2CImg: {
        //   zh: require("./img/B2B2C_zh.png"),
        //   en: require("./img/B2B2C_en.png"),
        // },
        qingsuangImg: {
            zh_CN: require('./img/qingsuang_zh.png'),
            en_US: require('./img/qingsuang_en.png')
        },
        DevelopmentImg: {
            zh_CN: require('./img/Development_zh.png'),
            en_US: require('./img/Development_en.png')
        },
        mDevelopmentImg: {
            zh_CN: require('./img/mDevelopment_zh.png'),
            en_US: require('./img/mDevelopment_en.png')
        }
    }
}

function Home(props: IProps): JSX.Element {
    const { viewWidth } = useSelector((store: IRootState) => store.base)
    const [t, i18n] = useTranslation()
    const data = imgData()

    return (
        <Layout className={classnames('page-home home')}>
            <Header />
            <div className="banner">
                <div className="layou-content banner__content">
                    <div className="content__text">
                        <p className="logo_text">AMPLIFY</p>
                        <p className="logo_text__little">{t('Decentralized Financial Infrastructure')}</p>
                        <p className="logo_text__desc">
                            {t(
                                'AMPLIFY is well connected to traditional financial resources and has rich practical experience in blockchain technology.'
                            )}
                        </p>
                        <p className="logo_text__btn">
                            <a href={`amplify_${i18n.language}.pdf`} target="__blank">
                                {t('Whitepaper')}
                            </a>
                        </p>
                    </div>
                    <img className="img" src={require('./img/bg-top1.png')} alt="" />
                </div>
            </div>
            <div className="home-content">
                <div className="home-div">
                    <h3 className="home-title">
                        <p className="home-title__big">{t('Advantages')}</p>
                        <p className="home-title__little">Advantages of AMPLIFY</p>
                    </h3>
                    <div className="layou-content super-list pdlr">
                        {data.superList.map((item, index) => (
                            <div className="super-list__item" key={index}>
                                <div>
                                    <img src={item.icon} className="img" />
                                </div>
                                <div className="title">{t(item.name)}</div>
                                <div className="text">{t(item.text)}</div>
                            </div>
                        ))}
                    </div>
                    <h3 className="home-title">
                        <p className="home-title__big">{t('B2B2C Network Architecture')}</p>
                        <p className="home-title__little">Decentralized governance of supply chain finance B2B2C infrastructure</p>
                    </h3>
                    <div className="layou-content pdlr">
                        <div className="B2B2C">
                            <img className="B2B2C-img" src={require('./img/b2b2c.png')} alt="" />
                        </div>
                        <div className="qingsuang">
                            <div className="qingsuang-text">
                                <h4>{t('On-chain Financing')}</h4>
                                <div className="text">
                                    {t(
                                        'The significance of blockchain is that there is no need to trust or trust code. To optimize the granting of credit at all levels of financial institutions,  AMPLIFY will use its years of experience in the supply chain finance and blockchain industries to establish an on-chain governance agreement.'
                                    )}
                                </div>
                            </div>
                            <div className="qingsuang-img">
                                <img className="B2B2C-img" src={data.qingsuangImg[i18n.language]} alt="" />
                            </div>
                        </div>
                    </div>
                    <div className="ampt">
                        <div>
                            <h3 className="home-title__big">{t('AMPT Token')}</h3>
                            <div className="text">
                                {t(
                                    'Ampt Token is the core token of AMPLIFY decentralized architecture. Through the governance security provided by economic model, amplify can run safely without trust.'
                                )}
                            </div>
                            <div className="text__btn">
                                <span>{t('Whitepaper')}</span>
                            </div>
                        </div>
                    </div>
                    <h3 className="home-title">
                        <p className="home-title__big">{t('Roadmap')}</p>
                        <p className="home-title__little">Development roadmap</p>
                    </h3>
                    <div className="layou-content pdlr">
                        <img
                            className="B2B2C-img"
                            src={viewWidth > 900 ? data.DevelopmentImg[i18n.language] : data.mDevelopmentImg[i18n.language]}
                            alt=""
                        />
                    </div>
                    <img className="ba-l ba-lr" src={require('./img/Background_6.png')} alt="" />
                    <img className="ba-r ba-lr" src={require('./img/Background_7.png')} alt="" />
                </div>
            </div>
        </Layout>
    )
}

export default withRouter(Home)
