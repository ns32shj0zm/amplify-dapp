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
        let rotateRight = 0
        let rotateLeft = 0
        if (rotate < 180) {
            rotateRight = rotate + -45
        } else {
            rotateRight = 135
            rotateLeft = rotate - 180 - 45
            setLeft(rotateLeft)
            // $('#loop-lc').css({
            //     '-webkit-transform': 'rotate(' + rotateLeft + 'deg)'
            // })
        }
        setRight(rotateRight)
        // $('#loop-rc').css({
        //     '-webkit-transform': 'rotate(' + rotateRight + 'deg)'
        // })
    }

    useEffect(() => {
        loadPercent(props.percentNum, 100)
    }, [props.percentNum])

    return (
        <div className="loop-pie">
            <div className="loop-pie-line loop-pie-r">
                <div className="loop-pie-c loop-pie-rm" style={{ '-webkit-transform': 'rotate(' + right + 'deg)' }}></div>
            </div>
            <div className="loop-pie-line loop-pie-l">
                <div className="loop-pie-c loop-pie-lm" style={{ '-webkit-transform': 'rotate(' + left + 'deg)' }}></div>
            </div>
        </div>
        // <div className="percentLoop">
        //     <div className="circle-left">
        //         <div></div>
        //     </div>
        //     <div className="circle-right">
        //         <div></div>
        //     </div>
        //     <div className="number">
        //         <div>
        //             <div className="num">{props.percentNum} %</div>
        //             <div className="text">{t('Net APR')}</div>
        //         </div>
        //     </div>
        // </div>
    )
}

export default Circle
