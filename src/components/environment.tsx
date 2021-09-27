
const IPYTHON_API : string | undefined = process.env.REACT_APP_IPYTHON_API
const IPYTHON_WS : string | undefined = process.env.REACT_APP_IPYTHON_WS
const MAT_API: string | undefined = process.env.REACT_APP_MAT_API

console.log(IPYTHON_API)
export {
    IPYTHON_API,
    MAT_API,
    IPYTHON_WS
}