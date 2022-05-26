import React, { useContext, useEffect, useState, Suspense } from "react";
import {
  Button,
  Container,
  Link,
  Paper,
  Switch,
  Typography,
} from "@mui/material";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import {
  createDagRun,
  getDagRun,
  getXComEntry,
  IPYTHON_DAG_ID,
} from "../../services/Airflow";
import {
  IPYTHON_DAG_CONF,
  IPYTHON_DAG_FINAL_TASK_ID,
} from "../../models/AirflowDag";
import { UserContext } from "../../contexts/UserContext";
import {
  DAG_RESPONSE,
  DAG_STATE,
  XCOM_KEY_DEFAULT,
} from "../../models/Airflow";
import { setInterval } from "timers";
import { Component } from "../../models/Component";
import {
  IPYTHON_DAG_API_RESPONSE,
  IPYTHON_DAG_XCOMM_RESPONSE,
} from "../../models/AirflowDagResponse";
import { patchGitRepo } from "../../services/api/GitRepo";
import { useHistory } from "react-router-dom";
import { COMPONENTS_URL, NOTEBOOKS } from "../../constants/routes";

const INTERVAL_TIME = 5000; //miliseconds

interface Props {
  component: Component;
}

const IPython2Cwl = (props: Props) => {
  const { user } = useContext(UserContext);
  const name = props.component.name;
  const url = props.component.gitRepo ? props.component.gitRepo.url : "";

  const [dag, setDag] = useState<DAG_RESPONSE>({} as DAG_RESPONSE);
  const [error, setError] = useState("");
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout>();
  const history = useHistory();

  const handleDagSuccess = async () => {
    try {
      const response = await getXComEntry(
        dag.dag_id,
        dag.dag_run_id,
        IPYTHON_DAG_FINAL_TASK_ID,
        XCOM_KEY_DEFAULT,
        user.token!
      );
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
        history.push(`${COMPONENTS_URL}/${props.component.id}/${NOTEBOOKS}`);
      }
    } catch (error) {
      setError(`${error}`);
    }
  };

  useEffect(() => {
    /**
     * Start polling to the API to check the Status
     */
    if (
      !intervalId &&
      dag.dag_id &&
      dag.dag_run_id &&
      dag.state === DAG_STATE.queued &&
      !error
    ) {
      setIntervalId(
        setInterval(async () => {
          try {
            const response = await getDagRun(
              dag.dag_id,
              dag.dag_run_id,
              user.token!
            );
            setDag(response);
          } catch (error) {
            setError("Unable to get the status of the dag run");
          }
        }, INTERVAL_TIME)
      );
      return () => clearInterval(intervalId as unknown as NodeJS.Timeout);
    } else if (dag.state === DAG_STATE.success && intervalId) {
      clearInterval(intervalId as NodeJS.Timeout);
      setIntervalId(undefined);
      handleDagSuccess();
    } else if (dag.state === DAG_STATE.failed && intervalId) {
      clearInterval(intervalId as NodeJS.Timeout);
      setIntervalId(undefined);
      setError("Unable to run the dag");
    }
  }, [dag]);

  useEffect(() => {
    if (url) {
      const conf: IPYTHON_DAG_CONF = {
        url: url,
        component_name: name,
      };

      createDagRun(IPYTHON_DAG_ID, conf, user.token!)
        .then((data) => setDag(data))
        .catch((error) => setError(error.message));
    } else {
      setError("Repository is not valid");
    }
  }, []);

  return (
    <Paper>
      {error && (
        <Typography variant="h6" color="error">
          {error}
        </Typography>
      )}
      {dag.dag_id && <p> {dag.state} </p>}
    </Paper>
  );
};

export default IPython2Cwl;
