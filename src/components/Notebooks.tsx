import React, { useEffect, useState } from "react";
import { Redirect, useParams } from "react-router-dom";
import { IPYTHON_API, MAT_API } from "./environment";
import { parse, stringify } from "yaml";
import {
  Model,
  Parameter,
  Input,
  createParameters,
  createInputs,
} from "../types/mat";
import { CommandLineObject } from "../types/cwl";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import { Paper, Typography } from "@mui/material";
import { ErrorBoundary, useErrorHandler } from "react-error-boundary";

function notEmpty<TValue>(value: TValue | null | undefined): value is TValue {
  return value !== null && value !== undefined;
}

function getParametersCwl(data: CommandLineObject): Parameter[] {
  console.log(data);
  return Object.entries(data.inputs)
    .map(([key, value], index) => {
      if (value?.type !== "File") {
        return {
          name: key,
          prefix: value?.inputBinding.prefix,
          type: value?.type,
        };
      }
      return undefined;
    })
    .filter(notEmpty);
}

function getFilesCwl(data: CommandLineObject): Input[] {
  return Object.entries(data.inputs)
    .map(([key, value], index) => {
      if (value?.type === "File") {
        return {
          name: key,
          display_name: key,
          prefix: value?.inputBinding.prefix,
        };
      }
      return undefined;
    })
    .filter(notEmpty);
}

type NotebooksParams = {
  taskId: string;
};

type NotebookStatus = {
  name: string;
  checked: boolean;
  spec: string;
};

const Notebooks = (props: NotebooksParams | {}) => {
  const [notebooks, setNotebooks] = useState<NotebookStatus[] | undefined>(
    undefined
  );
  const { taskId } = useParams<NotebooksParams>();
  const [option, setOption] = useState<string | undefined>(undefined);
  const [triggerRedirect, setTriggerRedirect] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isParametersPosted, setParametersPosted] = useState(false);
  const [isInputsPosted, setInputsPosted] = useState(false);
  const [modelId, setModelId] = useState("");
  const handleError = useErrorHandler();

  async function setCwlSpec(taskId: string, fileName: string | undefined) {
    if (typeof fileName === "undefined") {
      console.error("filename cannot be undefined");
    } else {
      return fetch(
        `${IPYTHON_API}/specs/${taskId}?spec_file_name=${encodeURIComponent(
          fileName
        )}`
      )
        .then((response) => response.text())
        .then((spec) => {
          const parsed_spec: CommandLineObject = parse(spec);
          const model: Model = {
            name: option ? option : "",
            type: "cwl",
            cwl_spec: parsed_spec,
            docker_image: parsed_spec.hints.DockerRequirement.dockerImageId,
          };
          return model;
        });
    }
  }

  function onValueChange(event: React.ChangeEvent<HTMLInputElement>) {
    setOption(event.target.value);
  }

  function formSubmit(event: React.FormEvent<EventTarget>) {
    event.preventDefault();
    setLoading(true);
    setCwlSpec(taskId, option).then((model) => {
      const url = `${MAT_API}/models`;
      fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(model),
      })
        .then((response) => response.json())
        .then((model: Model) => {
          if (typeof model.cwl_spec !== undefined) {
            const parameters = getParametersCwl(
              model.cwl_spec as CommandLineObject
            );
            const files = getFilesCwl(model.cwl_spec as CommandLineObject);

            const promisesParameters = createParameters(
              model.id as string,
              parameters
            ).map((p) => p.then((response) => response.ok));

            if (promisesParameters.length > 0) {
              promisesParameters
                .reduce((p) => p)
                .then((p) => setInputsPosted(true));
            } else {
              setInputsPosted(true);
            }

            const promisesInputs = createInputs(model.id as string, files).map(
              (p) => p.then((response) => response.ok)
            );

            if (promisesInputs.length > 0) {
              promisesInputs
                .reduce((p) => p)
                .then((p) => setParametersPosted(true));
            } else {
              setParametersPosted(true);
            }
          }
          setModelId(model.id as string);
        });
    });
  }

  useEffect(() => {
    if (isInputsPosted && isParametersPosted && modelId !== "") {
      setTriggerRedirect(true);
    }
  }, [isInputsPosted, isParametersPosted, modelId]);

  useEffect(() => {
    fetch(`${IPYTHON_API}/tasks/${taskId}/specs`)
      .then(
        (response) => response.json(),
        (error) => handleError(error)
      )
      .then((data) => {
        console.log(data);
        data &&
          setNotebooks(
            data.map((d: string) => {
              return { name: d, checked: false };
            })
          );
        setLoading(false);
      });
  }, [taskId]);

  return (
    <ErrorBoundary fallback={<p>Something went wrong</p>}>
      <Container maxWidth="sm">
        <Paper
          variant="outlined"
          sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}
        >
          {triggerRedirect && <Redirect to={`/models/${modelId}/summary`} />}
          <Typography variant="h5" color="inherit">
            Select the notebook to add
          </Typography>
          {loading && (
            <Box sx={{ display: "flex" }}>
              <CircularProgress />
            </Box>
          )}
          <form onSubmit={formSubmit}>
            {notebooks?.map((n) => (
              <div key={n.name} className="radio">
                <label>
                  <input
                    type="radio"
                    value={n.name}
                    onChange={onValueChange}
                    checked={option === n.name}
                  />
                  {n.name}
                  {stringify(n.spec)}
                </label>
              </div>
            ))}
            <button className="btn btn-default" type="submit">
              Submit
            </button>
          </form>
        </Paper>
      </Container>
    </ErrorBoundary>
  );
};

export default Notebooks;
