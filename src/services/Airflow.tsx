import { AIRFLOW_API } from "../constants/environment";

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