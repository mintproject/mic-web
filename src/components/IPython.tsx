import { Button, Container, Link, Paper, Typography, InputLabel, Select, SelectChangeEvent, MenuItem, TextareaAutosize} from "@mui/material";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import React, { useEffect, useState } from "react";
import { Redirect } from "react-router-dom";
import isUrl from "validator/lib/isURL";
import { IPYTHON_API } from "./environment";
import IPythonTerminal from "./IPythonTerminal";

import { Model, SoftwareVersion, ModelApi, SoftwareVersionApi, ConfigurationParameters, Configuration } from "@mintproject/modelcatalog_client";

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
  const [loadingMC, setLoadingMC] = useState(true);
  const [MCUser, setMCUser] = useState("mint@isi.edu");
  const [modelUrl, setModelUrl] = useState("");
  const [versionUrl, setVersionUrl] = useState("");
  const [allModels, setAllModels] = useState([] as Model[]);
  const [allVersions, setAllVersions] = useState([] as SoftwareVersion[]);
  const [possibleVersions, setPossibleVersions] = useState([] as SoftwareVersion[]);

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

  function handleModelChange(event: SelectChangeEvent<String>) {
    const { name, value } = event.target;
    let val : string = value as string;
    setModelUrl(val);
    console.log("Model set:", value);
    if (isUrl(val) && !loadingMC) {
      let model : Model = allModels.filter((m:Model) => m.id === val)[0];
      setPossibleVersions(allVersions.filter((v:SoftwareVersion) => (model.hasVersion||[]).some((v2) => (v2.id === v.id))));
    }
  }

  function handleVersionChange(event: SelectChangeEvent<String>) {
    const { name, value } = event.target;
    let val : string = value as string;
    setVersionUrl(val);
    console.log("Version set:", value);
  }

  useEffect(() => {
    // Update the document title using the browser API
    if (allModels.length + allVersions.length === 0) {
      setLoadingMC(true);
      let cfg : Configuration = new Configuration({
        basePath: "https://api.models.dev.mint.isi.edu/v1.8.0"
      });
      //if (token) cfg.accessToken = token;
      let mApi = new ModelApi(cfg);
      let vApi = new SoftwareVersionApi(cfg);
      let pModels : Promise<Model[]> = mApi.modelsGet({username: MCUser});
      let pVersions : Promise<SoftwareVersion[]> = vApi.softwareversionsGet({username: MCUser});

      pModels.then(setAllModels);
      pVersions.then(setAllVersions);

      Promise.all([pModels, pVersions])
        .then(()=> {
          setLoadingMC(false);
          /*for (let i = 0; i < allModels.length; i++) {
            let model : Model = allModels[i];
            if (model && model.id) {
              console.log("SET: ", model.id);
              setModelUrl(model.id);
              break;
            }
          }*/
        })
        .catch((error) => {
          console.warn(error);
          setModelUrl("create_new")
        })
    }
  });

  useEffect(() => {
    /**
     * Stop the polling to the API if the task status is SUCCESS
     */
    if (taskStatus === TASK_STATUS.Success) {
      clearInterval(intervalId as NodeJS.Timeout);
      console.log("redirect");
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
        });
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
        <Typography
            variant='h6'
            color='inherit'
        >
            Build and launch a Git repository
        </Typography>

        <Typography
            variant='body1'
            color='inherit'
        >
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
              variant='standard'
              helperText={errors}
            />
          </Box>

          <Box sx={{marginBottom: "10px"}}>
            <InputLabel id="model-select-label">Select a model:</InputLabel>
            <Select
              fullWidth
              labelId="model-select-label"
              id="model-select"
              value={modelUrl}
              onChange={handleModelChange}
            >
              {loadingMC ?
                (<MenuItem value="loading" selected>Loading...</MenuItem>)
                : (allModels.length > 0 && (allModels.map((m:Model) => (
                  <MenuItem value={m.id}>{m.label ? m.label[0] : "no-label"}</MenuItem>
                ))))
              }
              <MenuItem value="create_new" selected={!loadingMC}>- Create new Model -</MenuItem>
            </Select>
            {modelUrl==="create_new" && (
              <Box>
                <TextField
                  style={{margin: "5px 2px"}}
                  fullWidth
                  label="New model name"
                />
                <TextareaAutosize
                  style={{margin: "5px 2px", width: "100%"}}
                  aria-label="Model description"
                  placeholder="Enter a short model description"
                  minRows={3}
                />
                <TextField
                  style={{margin: "5px 2px"}}
                  fullWidth
                  label="Initial model version"
                  placeholder="v1.0.0"
                />
              </Box>
            )}
            {!loadingMC && isUrl(modelUrl) && (possibleVersions.length > 0 ? (
              <Box>
                <InputLabel id="version-select-label">Select a model version:</InputLabel>
                <Select
                  fullWidth
                  labelId="version-select-label"
                  id="version-select"
                  value={versionUrl}
                  onChange={handleVersionChange}
                >
                  {possibleVersions.map((v:SoftwareVersion) => (
                    <MenuItem value={v.id}>{v.label ? v.label[0] : "no-label"}</MenuItem>
                  ))}
                </Select>
              </Box>
            ) : (
                <TextField
                  style={{margin: "5px 2px"}}
                  fullWidth
                  label="New model version"
                  placeholder="v1.0.0"
                />
            ))}
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

      {taskStatus === "SUCCESS" ? (
        <Redirect to={`notebooks/${taskId}`} />
      ) : (
        ''
      )}

    </Container>
  );
};

export default IPython;
