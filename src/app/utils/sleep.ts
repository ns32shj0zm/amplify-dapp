function sleep(s) {
    s = s || 0
    s = parseInt(s) * 1000
    const now = +new Date()
    let timer = null
    return new Promise((resolve, reject) => {
        timer = setInterval(() => {
            if (now + s < +new Date()) {
                clearInterval(timer)
                resolve(true)
            }
        }, 10)
    })
}
export default sleep
