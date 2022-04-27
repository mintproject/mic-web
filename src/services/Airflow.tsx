import { AIRFLOW_API } from "../constants/environment";
import { IPYTHON_DAG_API_RESPONSE } from "../models/AirflowDagResponse";

export const IPYTHON_DAG_ID = "ipython2mint"

export const createDagRun = async (dag_id: string, conf: any, token: string) => {
    const response = await fetch(`${AIRFLOW_API}/dags/${dag_id}/dagRuns`, {
        method: "POST",
        headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({'conf': conf}),
    });
    if (response.ok) {
        return response.json();
    } else {
        throw new Error(response.statusText);
    }

}

export const getDagRun = async (dag_id: string, dag_run_id: string, token: string) => {
    const response = await fetch(`${AIRFLOW_API}/dags/${dag_id}/dagRuns/${dag_run_id}`, {
        method: "GET",
        headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
        },
    });
    if (response.ok) {
        return response.json();
    } else {
        throw new Error(response.statusText);
    }
}

export const getXComEntry = async (dag_id: string, dag_run_id: string, task_instance_id: string, key: string, token: string) : Promise<IPYTHON_DAG_API_RESPONSE> => {
    const response = await fetch(`${AIRFLOW_API}/dags/${dag_id}/dagRuns/${dag_run_id}/taskInstances/${task_instance_id}/xcomEntries/${key}`, {
        method: "GET",
        headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
        },
    });
    if (response.ok) {
        return response.json();
    } else {
        throw new Error(response.statusText);
    }
}