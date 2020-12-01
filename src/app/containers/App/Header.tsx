import React from 'react'
import { useTranslation } from 'react-i18next'
import { zeroStringIfNullish } from '../../general/helpers'
import { GeneralDetails } from './type'
import Circle from './Circle'
import './Header.styl'

const Header = (props: { generalDetails: GeneralDetails }): JSX.Element => {
    const { generalDetails } = props
    const [t] = useTranslation()

    return (
        <div className="appHeader">
            <div className="block">
                <div className="blockItem supply">
                    <div className="blockTitle">{t('Your Supply Balance')}</div>
                    <div className="blockNumber">{`$${zeroStringIfNullish(generalDetails.totalSupplyBalance?.toFixed(2), 2)}`}</div>
                </div>
                <Circle percentNum={zeroStringIfNullish(generalDetails.netApy?.times(100).toFixed(2), 2)} />
                <div className="blockItem borrow">
                    <div className="blockTitle">{t('Your Borrow Balance')}</div>
                    <div className="blockNumber">{`$${zeroStringIfNullish(generalDetails.totalBorrowBalance?.toFixed(2), 2)}`}</div>
                </div>
            </div>
            <div className="progress">
                <div className="text">
                    <div className="left">
                        {t('Your Borrow Limit')}:{`(${zeroStringIfNullish(generalDetails.totalBorrowLimitUsedPercent?.toFixed(2), 2)}% Used)`}
                    </div>
                    <div className="right">{`$${zeroStringIfNullish(generalDetails.totalBorrowLimit?.toFixed(2), 2)}`}</div>
                </div>
                <div className="bar">
                    <div style={{ width: `${zeroStringIfNullish(generalDetails.totalBorrowLimitUsedPercent?.toFixed(2), 2)}%` }}></div>
                </div>
            </div>
        </div>
    )
}

export default Header
