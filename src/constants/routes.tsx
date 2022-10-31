export const DASHBOARD = '/'
export const MODELS = '/models'
export const GIT_REPO_URL = '/git-repos'
export const COMPONENTS_URL = '/components'
export const REPOSITORY_URL = 'repositories'
export const NOTEBOOK_SUFFIX_URL = 'notebooks'
export const REPO_GIT_FORM = `${COMPONENTS_URL}/:componentId/${REPOSITORY_URL}/:repositoryId`
export const ANALYZE_PAGE = `${COMPONENTS_URL}/:id/analyze`
export const NOTEBOOKS_PAGE = `${COMPONENTS_URL}/:componentId/${REPOSITORY_URL}/:repositoryId/${NOTEBOOK_SUFFIX_URL}`


export const MODEL_DETAILS = '/models/:modelId'
export const MODEL_DETAILS_VERSION = '/models/:modelId/:versionId'
export const MODEL_NOTEBOOKS = '/models/:modelId/:versionId/notebooks'
export const COMMAND_LINE = '/commandLine'

