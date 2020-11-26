import * as React from 'react'
import classnames from 'classnames'
import Footer from '../Footer'

interface IProps {
    className?: string
    children: React.ReactNode
}

const Layout: React.FC<IProps> = (props: IProps): React.ReactElement => {
    const { className } = props

    return (
        <div className={classnames(className)}>
            {props.children}
            <Footer />
        </div>
    )
}

export default Layout
