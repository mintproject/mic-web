import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useState } from "react";
import { Redirect } from "react-router-dom";
import { Model } from "../types/mat";
import { MAT_API } from "./environment";
import React from "react"

const CommandLine = () => {
  const handleSubmit = (event: React.FormEvent<EventTarget>) => {
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
    submit();
    setLoading(false);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setModel((prevModel) => ({ ...prevModel, [name]: value }));
  };

  const [model, setModel] = useState<Model>();
  const [containerId, setContainerId] = useState();
  const [modelId, setModelId] = useState<string>();
  const [loading, setLoading] = useState(false);
  return containerId ? (
    <Redirect to={`term/${modelId}/${containerId}`} />
  ) : loading ? (
    <p> Loading </p>
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
          <TextField
            fullWidth
            value={model?.docker_image}
            name="docker_image"
            id="docker_image"
            label="Image"
            variant="outlined"
            defaultValue="mintproject/mint-term"
            onChange={handleChange}
          />
          <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
            <Button type="submit" variant="contained">
              Save
            </Button>
          </Box>
        </form>
      </Paper>
    </Container>
  );
};

export default CommandLine;
