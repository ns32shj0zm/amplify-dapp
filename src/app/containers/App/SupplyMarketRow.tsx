import * as React from 'react'
import { useState } from 'react'
import { withStyles } from '@material-ui/core/styles'
import Switch from '@material-ui/core/Switch'

type IProps = {
    details: any
    handleClick(): void
    handleSwitchClick(): void
}

const StyledSwitch = withStyles({
    switchBase: {
        '&$checked': {
            color: '#40c4ff'
        },
        '&$checked + $track': {
            backgroundColor: '#40c4ff'
        }
    },
    checked: {},
    track: {}
})(Switch)

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
                <h6 className="text-muted">
                    {`${props.details.supplyApy?.times(100).toFixed(2)}%`}
                    {props.details.supplyPctApy?.isGreaterThan(0) ? <div>{`+ ${props.details.supplyPctApy?.times(100).toFixed(2)}% PCT`}</div> : null}
                </h6>
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
                <StyledSwitch
                    checked={props.details.isEnterMarket}
                    onChange={() => {
                        props?.handleSwitchClick()
                    }}
                />
            </td>
        </tr>
    )
}

export default SupplyMarketRow
