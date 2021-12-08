import { Paper, Box, TextField, Typography } from "@mui/material";
import { useEffect, useState, useContext } from "react";
import Link from "@mui/material/Link";
import { Model, Parameter, Input } from "../types/mat";
import { IPYTHON_API, MAT_API } from "./environment";
import React from "react";
import {
  DatasetSpecification,
  Parameter as ModelCatalogParameter,
  ModelConfiguration,
} from "@mintproject/modelcatalog_client";
import { MicContext } from "../contexts/MicContext";
import InputGrid from "./grids/InputGrid";
import ParameterGrid from "./grids/ParameterGrid";
import { ModelContext } from "../contexts/ModelCatalog";
import Container from "@mui/material/Container";
import OutputGrid from "./grids/OutputGrid";
import Button from "@mui/material/Button";
import OutputModal from "./modals/OutputModal";
import OutputModalNew from "./modals/OutputModalNew";

function replacer(key: string, value: any) {
  console.log(value);
  if (key === "inputs" || key === "parameters" || value === null) {
    return undefined;
  }
  return value;
}

const INTERVAL_TIME = 5000; //miliseconds

const micModelPut = (model: Model) => {
  const url = `${MAT_API}/models/${model.id}`;
  //todo: hack
  const temp = JSON.stringify(model, replacer);
  return fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: temp,
  });
};

const convertParameterToModelCatalog = (
  model: Model
): ModelCatalogParameter[] => {
  return model.parameters
    ? model.parameters?.map((parameter) => {
        return {
          label: [parameter.display_name || parameter.name],
          description: [parameter.description || parameter.name],
          hasDataType: parameter.type ? [parameter.type] : [],
          type: ["Parameter"],
        } as ModelCatalogParameter;
      })
    : ([] as ModelCatalogParameter[]);
};

const convertInputsDataset = (model: Model): DatasetSpecification[] => {
  return model.outputs
    ? model.outputs?.map((input) => {
        return {
          label: [input.display_name || input.name],
          description: [input.description || input.name],
          type: ["DatasetSpecification"],
        } as DatasetSpecification;
      })
    : ([] as DatasetSpecification[]);
};

const convertOutputDataset = (model: Model): DatasetSpecification[] => {
  return model.outputs
    ? model.outputs?.map((item) => {
        return {
          label: [item.display_name || item.name],
          description: [item.description || item.name],
          path_location: [item.match],
        } as DatasetSpecification;
      })
    : ([] as DatasetSpecification[]);
};

const ModelEditor = () => {
  const { component, setComponent } = useContext(MicContext);
  const [saving, setSaving] = useState(false);
  const { saveConfiguration } = useContext(ModelContext);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const handleSubmit = async (event: React.FormEvent<EventTarget>) => {
    event.preventDefault();
    setSaving(true);
    const response = await micModelPut(component as Model);
    response.ok && setSaving(false);
    const newModelConfiguration: ModelConfiguration = {
      label: [component?.name as string],
      description: [component?.description as string],
      hasInput: convertInputsDataset(component as Model),
      hasParameter: convertParameterToModelCatalog(component as Model),
      hasComponentLocation: [
        `${MAT_API}/models/${component?.id}/cwlspec?filter=%7B%22fields%22%3A%7B%22id%22%3A%20false%7D%7D`,
      ],
    };
    const responseConfiguration = await saveConfiguration(
      newModelConfiguration,
      component?.version_id as string
    );
    setSuccess(true);
  };

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    setComponent((prevModel) => ({ ...prevModel, [name]: value }));
    console.log(component);
  }

  return (
    <Paper
      variant="outlined"
      sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}
    >
      {success && <p>Model saved successfully </p>} 
      {!success && (
      <>
        <Typography variant="h6" color="inherit" gutterBottom>
          Tell us about your Model Configuration.
        </Typography>
        <form autoComplete="off" onSubmit={handleSubmit}>
          <TextField
            required
            fullWidth
            id="display"
            placeholder="Display Name"
            name="name"
            value={component?.name}
            variant="outlined"
            onChange={handleChange}
          />

          <TextField
            required
            fullWidth
            id="description"
            placeholder="Description"
            name="description"
            value={component?.description}
            variant="outlined"
            onChange={handleChange}
          />

          <h3> Inputs </h3>
          {component?.inputs ? <InputGrid /> : "None"}

          <h3> Parameters </h3>
          {component?.parameters ? <ParameterGrid /> : "None"}

          <h3> Outputs </h3>
          {component?.outputs && <OutputGrid />}
          {<OutputModalNew id={component?.id as string} />}

          <Box
            sx={{ display: "flex", justifyContent: "flex-end", marginTop: 2 }}
          >
            <Button type="submit" variant="contained">
              {saving ? "Saving" : "Save"}
            </Button>
          </Box>
        </form>
      </>
      )}
    </Paper>
  );
};

export default ModelEditor;
