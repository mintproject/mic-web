import React, { useContext, useEffect, useState, Suspense, useRef } from "react";
import { Button, Container, Link, Paper, Switch, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { createDagRun, getDagRun, getXComEntry, IPYTHON_DAG_ID } from "../../services/Airflow";
import { IPYTHON_DAG_CONF, IPYTHON_DAG_FINAL_TASK_ID } from "../../models/AirflowDag";
import { UserContext } from "../../contexts/UserContext";
import { DAG_RESPONSE, DAG_STATE, XCOM_KEY_DEFAULT } from "../../models/Airflow";
import { setInterval } from "timers";
import { Component } from "../../models/Component";
import { IPYTHON_DAG_API_RESPONSE, IPYTHON_DAG_XCOMM_RESPONSE } from "../../models/AirflowDagResponse";
import { patchGitRepo } from "../../services/api/GitRepo";
import { useHistory } from "react-router-dom";
import { COMPONENTS_URL, NOTEBOOK_SUFFIX_URL, REPOSITORY_URL } from "../../constants/routes";

const INTERVAL_TIME = 5000; //miliseconds

interface Props {
    component: Component;
}

const IPython2Cwl = (props: Props) => {
    const { user } = useContext(UserContext);
    const name = props.component.name;
    const url = props.component.gitRepo ? props.component.gitRepo.url : "";
    const [repoId, setRepoId] = useState<string>();
    const [dag, setDag] = useState<DAG_RESPONSE>();
    const [error, setError] = useState("");
    const intervalRef = useRef<number | null>(null);
    const history = useHistory();

    const checkStatus = async () => {
        try {
            console.log(dag);
            if (dag && dag.dag_id) {
                const response = await getDagRun(dag.dag_id, dag.dag_run_id, user.token!);
                setDag(response);
                if (response.state === DAG_STATE.success) {
                    stopInterval();
                    handleDagSuccess();
                }
            }
        } catch (error) {
            setError(`${error}`);
        }
    };
    // Start the interval
    // This will be called when the user clicks on the start button
    const startInterval = () => {
        console.log("Starting interval");
        if (intervalRef.current !== null) return;
        intervalRef.current = window.setInterval(() => {
            checkStatus();
        }, 1000);
    };

    // Stop the interval
    // This will be called when the user clicks on the stop button
    const stopInterval = () => {
        console.log("Stopping interval");
        if (intervalRef.current) {
            window.clearInterval(intervalRef.current);
            intervalRef.current = 0;
        }
    };

    const handleDagSuccess = () => {
        const submitNotebooks = async () => {
            try {
                if (dag && dag.dag_id) {
                    const response = await getXComEntry(dag.dag_id, dag.dag_run_id, IPYTHON_DAG_FINAL_TASK_ID, XCOM_KEY_DEFAULT, user.token!);
                    if (props.component.id) {
                        const value = response.value;
                        const dagResponse = JSON.parse(value) as IPYTHON_DAG_XCOMM_RESPONSE;
                        const gitRepo = await patchGitRepo(
                            props.component.id,
                            {
                                dockerImage: `${dagResponse.name}:${dagResponse.tag}`,
                                url: url,
                            },
                            dagResponse.notebooks
                        );
                        setRepoId(gitRepo.id );
                    }
                }
            } catch (error) {
                setError(`${error}`);
            }
        };
        submitNotebooks();
    };

    useEffect(() => {
        if (repoId !== undefined) history.push(`${COMPONENTS_URL}/${props.component.id}/${REPOSITORY_URL}/${repoId}/${NOTEBOOK_SUFFIX_URL}`);
    }, [repoId]);

    useEffect(() => {
        if (dag && dag.state && intervalRef.current === null) {
            startInterval();
        }
    }, [dag]);

    // Use the useEffect hook to cleanup the interval when the component unmounts
    useEffect(() => {
        // here's the cleanup function

        //lowercase the name and remove spaces, not start with separator
        const parameterName = name.toLowerCase().replace(/ /g, "_");
        if (url) {
            const conf: IPYTHON_DAG_CONF = {
                url: url,
                component_name: parameterName,
            };

            createDagRun(IPYTHON_DAG_ID, conf, user.token!)
                .then((data) => {
                    setDag(data);
                })
                .catch((error) => setError(error.message));
        } else {
            setError("Repository is not valid");
        }

        return () => {
            if (intervalRef.current !== null) {
                window.clearInterval(intervalRef.current);
            }
        };
    }, []);

    return (
        <Paper>
            {error && (
                <Typography variant="h6" color="error">
                    {error}
                </Typography>
            )}
            {dag && dag.dag_id && <> {dag.state} </>}
        </Paper>
    );
};

export default IPython2Cwl;
