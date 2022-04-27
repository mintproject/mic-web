import { Notebook } from "./Notebook"

export interface IPYTHON_DAG_XCOMM_RESPONSE {
    name: string
    tag: string
    notebooks: Notebook[]
}

export interface IPYTHON_DAG_API_RESPONSE {
    dag_id: string
    execution_date: string
    key: string
    value: string
    task_id: string
    timestamp: string
}

