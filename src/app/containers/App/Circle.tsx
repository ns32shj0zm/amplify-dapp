import * as React from 'react'
import { Progress } from 'antd';
import { useTranslation } from 'react-i18next'
import './Circle.styl'

type IProps = {
    percentNum: number
}

function Circle(props: IProps): JSX.Element {
    const [t] = useTranslation()

    return (
        <div className="percentLoop">
            <Progress
                type="circle"
                percent={props.percentNum}
                width={168} 
                showInfo={false} 
                strokeColor={{
                    '0%': '#28d3f9',
                    '100%': '#2494d8',
                }}
            />
            <div className="number">
                <div>
                    <div className="num">{props.percentNum} %</div>
                    <div className="text">{t('Net APR')}</div>
                </div>
            </div>
        </div>
    )
}

export default Circle
