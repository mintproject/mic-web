import { Button, Container, Link, Paper, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import React, { useEffect, useState } from "react";
import { Redirect } from "react-router-dom";
import isUrl from "validator/lib/isURL";
import { IPYTHON_API } from "./environment";
import IPythonTerminal from "./IPythonTerminal";

const INTERVAL_TIME = 5000; //miliseconds

enum TASK_STATUS {
  Pending = "PENDING",
  Success = "SUCCESS",
}

function logs(id: string) {
  /**
   * Return a webcomponent to show the logs using a websocket
   */
  if (id) {
    return (
      <Container maxWidth="sm">
        <IPythonTerminal taskId={id} />
      </Container>
    );
  }
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
      <Redirect to="/notebooks/" />;
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

  function handleSubmit(event: React.FormEvent<EventTarget>) {
    event.preventDefault();
    setLoading(true);
    setErrors(undefined);
    if (isUrl(gitRepo)) {
      const url = `${IPYTHON_API}/tasks`;
      fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: gitRepo }),
      })
        .then((response) => response.json())
        .then((data) => {
          setTaskId(data.task_id);
          return data
        })
        .catch((error) => {console.log(error)});
    } else {
      setErrors("The url is not valid git url");
      setLoading(false);
    }
  }

  return (
    <Container component="main" maxWidth="sm" sx={{ mb: 4 }}>
      <Paper
        variant="outlined"
        sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}
      >
        <Typography variant="h6" color="inherit">
          Build and launch a Git repository
        </Typography>

        <Typography variant="body1" color="inherit">
          You must prepare your repository for use with BinderHub
        </Typography>
        <Link />
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
              Convert repository
            </Button>
          </Box>
        </form>
      </Paper>
      {logs(taskId)}

      {taskStatus === "SUCCESS" ? <Redirect to={`notebooks/${taskId}`} /> : ""}
    </Container>
  );
};

export default IPython;
