import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useState } from "react";
import { Redirect } from "react-router-dom";
import React from "react"
import { createComponent } from "../services/api/Component";
import { createContainer } from "../services/api/Container";
import { Component } from "../models/Component";

const CommandLine = () => {
  const handleSubmit = (event: React.FormEvent<EventTarget>) => {
    event.preventDefault();
    const submit = async () => {
      try {
        const component_response = await createComponent(component);
        const component_id : string = component_response.id!
        const image : string = component_response.docker_image!
        const container_response = await createContainer(component_id, image);
        const container_id : string = container_response.id!
        setModelId(component_id);
        setContainerId(container_id);
      } catch (error) {
        console.error(error);
      }
    };
    setLoading(true);
    submit();
    setLoading(false);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setComponent((prevModel) => ({ ...prevModel, [name]: value }));
  };

  const [component, setComponent] = useState<Component>({} as Component);
  const [containerId, setContainerId] = useState<string>("");
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
            value={component?.name}
            id="name"
            name="name"
            label="Name"
            variant="outlined"
            onChange={handleChange}
          />
          <TextField
            fullWidth
            value={component?.docker_image}
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
