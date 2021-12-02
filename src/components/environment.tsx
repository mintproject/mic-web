
const IPYTHON_API : string | undefined = process.env.REACT_APP_IPYTHON_API
const IPYTHON_WS : string | undefined = process.env.REACT_APP_IPYTHON_WS
const MAT_API: string | undefined = process.env.REACT_APP_MAT_API
const MODEL_CATALOG_API: string = process.env.REACT_APP_MODEL_CATALOG_API || 'https://api.models.mint.isi.edu/v1.8.0'
console.log(IPYTHON_API)
export {
    IPYTHON_API,
    MAT_API,
    IPYTHON_WS,
    MODEL_CATALOG_API
}