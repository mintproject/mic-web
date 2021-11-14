import { Paper, Box, TextField, Typography, Button } from "@mui/material";
import { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import { Model, Parameter, Input } from "../types/mat";
import { MAT_API } from "./environment";
import React from "react";
import {
  DatasetSpecification,
  Parameter as ModelCatalogParameter,
  ModelConfiguration,
} from "@mintproject/modelcatalog_client";
import { MicContext } from "../contexts/MicContext";
import InputGrid from "./InputGrid";
import ParameterGrid from "./ParameterGrid";
import { ModelContext } from "../contexts/ModelCatalog";

function replacer(key: string, value: any) {
  console.log(value);
  if (key === "inputs" || key === "parameters" || value === null) {
    return undefined;
  }
  return value;
}

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
          label: parameter.display_name,
          description: parameter.description,
        } as ModelCatalogParameter;
      })
    : ([] as ModelCatalogParameter[]);
};

const convertInputsDataset = (model: Model): DatasetSpecification[] => {
  return model.inputs
    ? model.inputs?.map((input) => {
        return {
          label: input.display_name,
          description: input.description,
        } as DatasetSpecification;
      })
    : ([] as DatasetSpecification[]);
};
const ModelEditor = () => {
  const { model, setModel } = useContext(MicContext);
  const [saving, setSaving] = useState(false);
  //const { saveConfiguration } = useContext(ModelContext);

  const handleSubmit = async (event: React.FormEvent<EventTarget>) => {
    event.preventDefault();
    setSaving(true);
    const response = await micModelPut(model as Model);
    response.ok && setSaving(false);
    let newModelConfiguration: ModelConfiguration = {
      label: [model?.display_name as string],
      description: [model?.description as string],
      hasInput: convertInputsDataset(model as Model),
      hasParameter: convertParameterToModelCatalog(model as Model),
    };
    //saveConfiguration(newModelConfiguration);
  };

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    setModel((prevModel) => ({ ...prevModel, [name]: value }));
  }

  return (
    <div>
      <Typography variant="h6" color="inherit" gutterBottom>
        Tell us about your Model Configuration.
      </Typography>
      <form noValidate autoComplete="off" onSubmit={handleSubmit}>
        <TextField
          fullWidth
          id="display"
          placeholder="Display Name"
          name="name"
          value={model?.name}
          variant="outlined"
          onChange={handleChange}
        />

        <TextField
          fullWidth
          id="description"
          placeholder="Description"
          name="description"
          value={model?.description}
          variant="outlined"
          onChange={handleChange}
        />
        <h3> Inputs </h3>
        {model?.inputs ? <InputGrid  /> : "None"}

        <h3> Parameters </h3>
        {model?.parameters ? <ParameterGrid /> : "None"}

        <Box sx={{ display: "flex", justifyContent: "flex-end", marginTop: 2 }}>
          <Button type="submit" variant="contained">
            {saving ? "Saving" : "Save"}
          </Button>
        </Box>
      </form>
    </div>
  );
};

export default ModelEditor;
