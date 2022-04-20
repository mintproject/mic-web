import React, { useContext, useEffect, useState, Suspense } from "react";
import { Button, Container, Link, Paper, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { createDagRun, IPYTHON_DAG_ID } from "../services/Airflow";
import { IPYTHON_DAG_CONF } from "../models/AirflowConf";
import { UserContext } from "../contexts/UserContext";

const INTERVAL_TIME = 5000; //miliseconds

export enum TASK_STATUS {
  Pending = "PENDING",
  Success = "SUCCESS",
}


const GitRepo = () => {
  const { user } = useContext(UserContext);
  const [url, setUrl] = useState("");
  const [name, setName] = useState("");
  const [taskId, setTaskId] = useState("");
  const [taskStatus, setTaskStatus] = useState("");
  const [taskMessage, setTaskMessage] = useState("");
  const [error, setError] = useState("");
  
  /**
   * 1. The user enters a URL to a git repository.
   * 2. The user clicks the "Register" button.
   * 3. The backend sends a request to the Airflow API to start a task.
   * 4. The backend sends a request to the Airflow API to get the task status.
   * 5. The backend sends a request to the Airflow API to get the task output.
   * 6. The backend sends a request to the Airflow API to get the task error.
   * 7. If the status is "SUCCESS", the user is redirected to the NotebookSelection page.
   * 8. If the status is "PENDING", print the task output.
   * 9. If the status is "FAILED", print the task error. 
   *  */

  const handleSubmit = async (event: React.FormEvent<EventTarget>) => {
    event.preventDefault();
    const conf : IPYTHON_DAG_CONF = {
      url: url,
      component_name: name
    }
    try {
      const response = await createDagRun(IPYTHON_DAG_ID, conf, user.token!);
    } catch (error) {
      setError("Unable to create dag run on Airflow");
    }

  }


  
  return (
    <Container component="main" maxWidth="sm" sx={{ mb: 4 }}>
      <Paper
        variant="outlined"
        sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}
      >
      <Typography variant="h6" color="inherit">
        Where is your code?
      </Typography>

      {error && ( <Typography variant="body1" color="error"> {error} </Typography>)}

      <Link />
        <Suspense fallback={<p>Loading...</p>}>
        <div>
          <Typography variant="body1" color="inherit">
            Your code must be available in a Git Repository.
          </Typography>
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
                id="name"
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                variant="standard"
              />
              <TextField
                fullWidth
                label="The git url repository"
                id="gitRepo"
                name="gitRepo"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                required
                variant="standard"
              />
            </Box>

            <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
              <Button
                type="submit"
                variant="contained"
              >
                Submit
              </Button>
            </Box>
          </form>
        </div>
        </Suspense>
      </Paper>
    </Container>
  );
};

export default GitRepo;
