import * as React from 'react'
import { Switch } from 'antd'

type IProps = {
    details: any
    handleClick(): void
    handleSwitchClick(): void
}

function SupplyMarketRow(props: IProps): JSX.Element {
    return (
        <tr
            style={{ cursor: 'pointer' }}
            onClick={() => {
                props?.handleClick()
            }}
        >
            <td>
                <img className="rounded-circle" style={{ width: '30px' }} src={`/${props.details.symbol}.png`} alt="" />
            </td>
            <td>
                <h6 className="mb-1">{props.details.symbol}</h6>
            </td>
            <td>
                <h6 className="text-muted">{`${props.details.supplyApy?.times(100).toFixed(2)}%`}</h6>
            </td>
            <td>
                <h6 className="text-muted">{props.details.supplyBalanceInTokenUnit.decimalPlaces(4).toString()}</h6>
            </td>
            <td>
                <h6 className="text-muted">
                    <i
                        className={`fa fa-circle${props.details.walletBalance.decimalPlaces(4).toNumber() <= 0 ? '-o' : ''} text-c-green f-10 m-r-15`}
                    />
                    {props.details.walletBalance.decimalPlaces(4).toString()}
                </h6>
            </td>
            <td>
                <Switch
                    checked={props.details.isEnterMarket}
                    size="small"
                    onClick={(c, e) => {
                        props?.handleSwitchClick()
                        e.stopPropagation()
                    }}
                />
            </td>
        </tr>
    )
}

export default SupplyMarketRow
