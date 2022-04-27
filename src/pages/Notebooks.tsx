import { Box, Button, Container, IconButton, Paper, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import CardGrid from "../components/grids/CardGrid";
import { Component } from "../models/Component";
import { getComponent } from "../services/api/Component";
import SendIcon from "@mui/icons-material/Send";
interface Params {
  id: string;
}

export const Notebooks = (props: any) => {
  const { id } = useParams<Params>();
  console.log(id);
  const [ipython, setipython] = useState(false);
  const [cwl, setcwl] = useState(false);
  const [error, setError] = useState("");
  const [component, setComponent] = useState<Component>();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getComponent(id)
      .then((component) => {
        setComponent(component);
        console.log(component);
      })
      .catch((error) => {
        setError(error.message);
      });
  }, [id]);

  return (
      <Paper
        variant="outlined"
        sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}
      >
      <Typography variant="h4">Notebooks</Typography>
      {component && component.gitRepo && component.gitRepo.notebooks && (
        <CardGrid>
          {component.gitRepo.notebooks.map((notebook) => {
            return (
              <Box p={2}>
                <Typography variant="h6">{notebook.name}</Typography>
                <Button onClick={() => {console.log("test")}}  variant="outlined">
                  Mark as your component
                </Button>
              </Box>
            );
          })}
        </CardGrid>
      )}
      </Paper>
  );
};
export default Notebooks;
