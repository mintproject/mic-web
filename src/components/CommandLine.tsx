import { Box, Container, Paper, TextField, Typography } from "@mui/material";
import { LoadingButton } from '@mui/lab';
import SaveIcon from '@mui/icons-material/Save';
import React, { useState } from "react";
import { Redirect } from "react-router-dom";
import { Model } from "../types/mat";
import { MAT_API } from "./environment";

const CommandLine = () => {
  const handleSubmit = async (event: React.FormEvent<EventTarget>) => {
    event.preventDefault();
    const submit = async () => {
      try {
        const response = await fetch(`${MAT_API}/models`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: model?.name,
            type: "docker",
          }),
        });
        const model_response: Model = await response.json();
        const container = await fetch(
          `${MAT_API}/models/${model_response.id}/container`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              image: model?.docker_image,
            }),
          }
        );
        const container_response = await container.json();
        setModelId(model_response.id);
        setContainerId(container_response.id);
      } catch (error) {
        //TODO: show error message
        console.log(error);
      }
    };
    setLoading(true);
    await submit();
    setLoading(false);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setModel((prevModel) => ({ ...prevModel, [name]: value }));
  };

  const [model, setModel] = useState<Model>({name: '', docker_image: 'mintproject/mic-term'} as Model);
  const [containerId, setContainerId] = useState();
  const [modelId, setModelId] = useState<string>();
  const [loading, setLoading] = useState(false);

  return containerId ? (
    <Redirect to={`term/${modelId}/${containerId}`} />
  ) : (
    <Container maxWidth="sm">
      <Paper
        variant="outlined"
        sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}
      >
        <Typography variant="h6" color="inherit" gutterBottom>
          Model
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            value={model?.name}
            id="name"
            name="name"
            label="Name"
            variant="outlined"
            onChange={handleChange}
          />
          <Box sx={{ display: "flex", justifyContent: "space-between", marginTop: 1, alignContent: "middle"}}>
            <span style={{color: "#bbb"}}>
              {loading ? "Staring docker image..." : ""}
            </span>
            <LoadingButton
              type="submit"
              loading={loading}
              loadingPosition="start"
              startIcon={<SaveIcon />}
              variant="contained"
            >
              Save
            </LoadingButton>
          </Box>
        </form>
      </Paper>
    </Container>
  );
};

export default CommandLine;
