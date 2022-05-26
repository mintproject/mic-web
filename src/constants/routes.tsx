export const DASHBOARD = '/'
export const MODELS = '/models'

//name pages
export const NOTEBOOKS = "notebooks"
export const EXECUTION_SAMPLE = "execution-sample"


export const COMPONENTS_URL = '/components'
export const REPOSITORY_URL = 'repository'
export const REPO_GIT_FORM = `${COMPONENTS_URL}/:id/${REPOSITORY_URL}`
export const ANALYZE_PAGE = `${COMPONENTS_URL}/:id/analyze`
export const EXECUTION_SAMPLE_PAGE = `${COMPONENTS_URL}/:id/${EXECUTION_SAMPLE}`
export const NOTEBOOKS_PAGE = `${COMPONENTS_URL}/:id/notebooks`


export const MODEL_DETAILS = '/models/:modelId'
export const MODEL_DETAILS_VERSION = '/models/:modelId/:versionId'
export const MODEL_NOTEBOOKS = '/models/:modelId/:versionId/notebooks'
export const COMMAND_LINE = '/commandLine'

