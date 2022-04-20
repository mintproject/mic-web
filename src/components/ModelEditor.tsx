import { Paper, Box, TextField, Typography } from "@mui/material";
import { useEffect, useState, useContext } from "react";
import { IPYTHON_API, MAT_API } from "../constants/environment";
import React from "react";

import { MicContext } from "../contexts/MicContext";
import InputGrid from "./grids/InputGrid";
import ParameterGrid from "./grids/ParameterGrid";
import { ModelContext } from "../contexts/ModelCatalog";
import OutputGrid from "./grids/OutputGrid";
import Button from "@mui/material/Button";
import OutputModalNew from "./modals/OutputModalNew";
import { updateComponent } from "../services/api/Component";
import { Component } from "../models/Component";
import { ModelConfiguration } from "@mintproject/modelcatalog_client";
import {
  convertInputsDataset,
  convertParameterToModelCatalog,
} from "../adapters/modelCatalog";

const INTERVAL_TIME = 5000; //miliseconds

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
    try {
      const response = await updateComponent(component as Component);
      const newModelConfiguration: ModelConfiguration = {
        label: [component?.name as string],
        description: [component?.description as string],
        hasInput: convertInputsDataset(component as Component),
        hasParameter: convertParameterToModelCatalog(component as Component),
        hasComponentLocation: [
          `${MAT_API}/models/${component?.id}/cwlspec?filter=%7B%22fields%22%3A%7B%22id%22%3A%20false%7D%7D`,
        ],
      };

      const responseConfiguration = await saveConfiguration(
        newModelConfiguration,
        component?.version_id as string
      );
      setSuccess(true);
    } catch (error) {
      let message;
      setSaving(false);
      setError(true);
      if (error instanceof Error) message = error.message;
      else message = String(error)
      setErrorMessage(message);
    }
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
