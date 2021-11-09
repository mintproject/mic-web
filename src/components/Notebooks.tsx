import React, { useEffect, useState } from "react";
import { IPYTHON_API, MAT_API } from "./environment";
import { parse, stringify } from "yaml";
import {
  Model,
  Parameter,
  Input,
  createParameters,
  createInputs,
  createSpec,
} from "../types/mat";
import { CommandLineObject } from "../types/cwl";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import { Paper, Typography } from "@mui/material";
import ModelSummary from "./ModelSummary";

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

const Notebooks = (props: NotebooksParams) => {
  const [notebooks, setNotebooks] = useState<NotebookStatus[] | undefined>(
    undefined
  );
  const { taskId } = props;
  const [option, setOption] = useState<string | undefined>(undefined);
  const [modelId, setModelId] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState();

  async function setCwlSpec(taskId: string, fileName: string | undefined) {
    if (typeof fileName === "undefined") {
      console.error("filename cannot be undefined");
    } else {
      const response = await fetch(
        `${IPYTHON_API}/specs/${taskId}?spec_file_name=${encodeURIComponent(
          fileName
        )}`
      );
      const spec = await response.text();
      const parsed_spec: CommandLineObject = parse(spec);
      return parsed_spec as CommandLineObject;
    }
  }

  function onValueChange(event: React.ChangeEvent<HTMLInputElement>) {
    setOption(event.target.value);
  }

  function formSubmit(event: React.FormEvent<EventTarget>) {
    event.preventDefault();
    const submitNotebook = async () => {
      setLoading(true);
      const url = `${MAT_API}/models`;
      //Get cwl spec
      const parsed_spec = await setCwlSpec(taskId, option);
      if (parsed_spec !== undefined) {
        //Create model
        const model_request: Model = {
          name: option ? option : "",
          type: "cwl",
          docker_image: parsed_spec?.hints.DockerRequirement.dockerImageId,
        };
        //Submit the model
        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(model_request),
        });
        const model = await response.json();

        //Submit the spec
        try {
          await createSpec(model.id, parsed_spec);
        } catch (error) {
          throw new Error(error);
        }

        //Create parameters
        const parameters =
          typeof model.cwlspec !== undefined
            ? getParametersCwl(parsed_spec)
            : [];
        //Create files
        const files =
          typeof model.cwlspec !== undefined ? getFilesCwl(parsed_spec) : [];
        //Submit parameters and inputs
        await createParameters(model.id, parameters);
        await createInputs(model.id, files);
        setModelId(model.id);
      }
    };

    submitNotebook();
  }

  useEffect(() => {
    const fetchNotebook = async () => {
      try {
        const response = await fetch(`${IPYTHON_API}/tasks/${taskId}/specs`);
        if (!response.ok) throw new Error("Not Found");
        else {
          const data = await response.json();
          setNotebooks(
            data.map((d: string) => {
              return { name: d, checked: false };
            })
          );
        }
        setLoading(false);
      } catch (error) {
        setError(error.message);
      }
    };
    fetchNotebook();
  }, [taskId]);

  const renderNotebooks = () => {
    return (
      <Paper
        variant="outlined"
        sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}
      >
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
    );
  };

  return modelId === undefined ? (
    renderNotebooks()
  ) : (
    <ModelSummary modelId={modelId} />
  );
};

export default Notebooks;
