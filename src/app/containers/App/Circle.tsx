import * as React from 'react'
import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import './Circle.styl'

type IProps = {
    percentNum: any
}

function Circle(props: IProps): JSX.Element {
    const [t] = useTranslation()
    const [left, setLeft] = useState(0)
    const [right, setRight] = useState(0)
    const loadPercent = (x, y) => {
        const rotate = (x / y) * 360
        let leftTransformerDegree = 0
        let rightTransformerDegree = 0
        if (rotate >= 50) {
            rightTransformerDegree = 180
            leftTransformerDegree = (rotate - 50) * 3.6
        } else {
            rightTransformerDegree = rotate * 3.6
            leftTransformerDegree = 0
        }
        setLeft(leftTransformerDegree)
        setRight(rightTransformerDegree)
    }

    useEffect(() => {
        loadPercent(props.percentNum, 100)
    }, [props.percentNum])

    return (
        <div className="percentLoop">
            <div className="loop-pie-line loop-pie-r">
                <div className="loop-pie-c loop-pie-rm" style={{ WebkitTransform: `rotate(${right}deg)` }}></div>
            </div>
            <div className="loop-pie-line loop-pie-l">
                <div className="loop-pie-c loop-pie-lm" style={{ WebkitTransform: `rotate(${left}deg)` }}></div>
            </div>
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
