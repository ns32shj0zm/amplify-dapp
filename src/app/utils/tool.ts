import { useEffect, useRef } from 'react'

export function sleep(millisecond: number) {
    return new Promise(resolve => {
        setTimeout(() => resolve, millisecond)
    })
}

export async function errorCaptured(asyncFunc) {
    try {
        const res = await asyncFunc()
        return [null, res]
    } catch (error) {
        return [error, null]
    }
}

/*
* example:
const OneSecondTimer = props => {
  const [seconds, setSeconds] = React.useState(0);
  useTimeout(() => {
    setSeconds(seconds + 1);
  }, 1000);

  return <p>{seconds}</p>;
};
*/

export const useTimeout = (callback, delay) => {
    const savedCallback = useRef()

    useEffect(() => {
        savedCallback.current = callback
    }, [callback])

    useEffect(() => {
        if (delay !== null) {
            const id = setTimeout(savedCallback.current, delay)
            return () => clearTimeout(id)
        }
    }, [delay])
}

export const useInterval = (callback, delay) => {
    const savedCallback = useRef()

    useEffect(() => {
        savedCallback.current = callback
    }, [callback])

    useEffect(() => {
        if (delay !== null) {
            const id = setInterval(savedCallback.current, delay)
            return () => clearInterval(id)
        }
    }, [delay])
}
