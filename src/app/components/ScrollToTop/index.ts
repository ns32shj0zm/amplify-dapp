import { useEffect } from 'react'
import { RouteComponentProps, withRouter } from 'react-router-dom'

interface IProps extends RouteComponentProps {
    children: JSX.Element
}

const ScrollToTop = (props: IProps): JSX.Element => {
    useEffect(() => {
        window.scrollTo(0, 0)
    }, [window.location.href])

    return props.children
}

export default withRouter(ScrollToTop)
