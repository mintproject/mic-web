export interface DAG_RESPONSE {
    dag_id: string,
    dag_run_id: string,
    state: string,
    execution_date: string,
    start_date: string,
    end_date: string,
    conf: any,
}

export enum DAG_STATE {
    queued = "queued",
    running = "running",
    success = "success",
    failed = "failed",
    skipped = "skipped",
    up_for_retry = "up_for_retry",
    up_for_reschedule = "up_for_reschedule",
}

export const XCOM_KEY_DEFAULT = "return_value"