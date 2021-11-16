import React, { useContext, useEffect, useState } from "react";
import { MicContext } from "../contexts/MicContext";
import { Button, Container, Link, Paper, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import isUrl from "validator/lib/isURL";
import { IPYTHON_API } from "./environment";
import IPythonTerminal from "./IPythonTerminal";
import Notebooks from "./Notebooks";
import { LinearProgress } from "@mui/material";
import { useParams } from "react-router-dom";

const INTERVAL_TIME = 5000; //miliseconds

export enum TASK_STATUS {
  Pending = "PENDING",
  Success = "SUCCESS",
}

enum RENDER {
  Repository = "REPOSITORY",
  Notebook = "NOTEBOOK",
  Summary = "SUMMARY",
}

function logs(id: string) {
  /**
   * Return a webcomponent to show the logs using a websocket
   */
  if (id) {
    return (
      <Box sx={{ width: "100%" }}>
        <LinearProgress />
      </Box>
    );
  }
}

interface Props {
  modelId: string;
  versionId: string;
}

const IPython = () => {
  const [gitRepo, setGitRepo] = useState("");
  const [taskId, setTaskId] = useState("");
  const [taskStatus, setTaskStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | undefined>(
    undefined
  );
  const [errors, setErrors] = useState<string | undefined>(undefined);
  const [renderStatus, setRenderStatus] = useState<RENDER>(RENDER.Repository);
  const {modelId, versionId} = useParams<Props>()
    
  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    /**
     * Handle input change
     */
    const { name, value } = event.target;
    console.log("Setting " + name);
    setGitRepo(value);
  }

  useEffect(() => {
    /**
     * Stop the polling to the API if the task status is SUCCESS
     */
    if (taskStatus === TASK_STATUS.Success) {
      clearInterval(intervalId as NodeJS.Timeout);
      setRenderStatus(RENDER.Notebook);
    }
  }, [taskStatus]);

  useEffect(() => {
    /**
     * Start polling to the API to check the Status
     */
    if (taskId !== "") {
      setIntervalId(
        setInterval(() => {
          fetch(`${IPYTHON_API}/tasks/${taskId}`)
            .then((response) => response.json())
            .then((data) => {
              setTaskStatus(data.task_status);
              return data;
            })
            .catch((error) => {
              console.log(error);
            });
        }, INTERVAL_TIME)
      );
      return () => clearInterval(intervalId as NodeJS.Timeout);
    }
  }, [taskId]);

  const renderRepository = () => {
    return (
      <div>
        <Typography variant="h6" color="inherit">
          Where is your code?
        </Typography>

        <Typography variant="body1" color="inherit">
          Your code must be available in a Git Repository.
        </Typography>
        <Link />
        { !loading &&
          <form noValidate autoComplete="off" onSubmit={handleSubmit}>
            <Box
              sx={{
                width: 500,
                maxWidth: "100%",
                marginBottom: 2,
              }}
            >
              <TextField
                fullWidth
                label="The git url repository"
                id="gitRepo"
                name="gitRepo"
                value={gitRepo}
                onChange={handleChange}
                required
                variant="standard"
                helperText={errors}
              />
            </Box>

            <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
              <Button
                type="submit"
                disabled={loading}
                hidden={loading}
                variant="contained"
              >
                Submit
              </Button>
            </Box>
          </form>
        }
        {logs(taskId)}
      </div>
    );
  };

  const render = () => {
    switch (renderStatus) {
      case RENDER.Repository:
        return renderRepository();
      case RENDER.Notebook:
        return <Notebooks taskId={taskId} modelId={modelId} versionId={versionId} />;
    }
  };

  function handleSubmit(event: React.FormEvent<EventTarget>) {
    event.preventDefault();
    const submit = async () => {
      setLoading(true);
      setErrors(undefined);
      if (isUrl(gitRepo)) {
        try {
          const url = `${IPYTHON_API}/tasks`;
          const response = await fetch(url, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ url: gitRepo }),
          });
          const data = await response.json();
          setTaskId(data.task_id);
        } catch (error) {
          console.log(error);
        }
      } else {
        setErrors("The url is not valid git url");
        setLoading(false);
      }
    };
    submit();
  }
  return (
    <Container component="main" maxWidth="sm" sx={{ mb: 4 }}>
      <Paper
        variant="outlined"
        sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}
      >
        {render()}
      </Paper>
    </Container>
  );
};

export default IPython;
