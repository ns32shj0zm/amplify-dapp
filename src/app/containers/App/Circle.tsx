import * as React from 'react'
import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Progress } from 'antd'
import { useTranslation } from 'react-i18next'
import { IRootState } from '../../reducers/RootState'
import './Circle.styl'

type IProps = {
    percentNum: number
}

function Circle(props: IProps): JSX.Element {
    const [t] = useTranslation()
    const { viewWidth } = useSelector((store: IRootState) => store.base)
    const [width, setWidth] = useState(0)

    useEffect(() => {
        setWidth(viewWidth > 1200 ? 168 : 140)
    }, [viewWidth])

    return (
        <div className="percentLoop">
            <div className="main">
                <Progress
                    type="circle"
                    percent={props.percentNum}
                    width={width}
                    showInfo={false}
                    strokeColor={{
                        '0%': '#28d3f9',
                        '100%': '#2494d8'
                    }}
                />
                <div className="number">
                    <div>
                        <div className="num">{props.percentNum} %</div>
                        <div className="text">{t('Net APR')}</div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Circle
