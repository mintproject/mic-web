import { Button, Container, Link, Paper, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import IPython2Cwl from "../components/Analyzers/Ipython2cwl";
import CardGrid from "../components/grids/CardGrid";
import { Component } from "../models/Component";
import { getComponent } from "../services/api/Component";
import Notebooks from "./Notebooks";

interface Params {
  id: string;
}

const Analyze = () => {
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
      })
      .catch((error) => {
        setError(error.message);
      });
  }, [id]);

  return (
    <Container maxWidth="md">
      <Paper
        variant="outlined"
        sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}
      >
        <Typography variant="h4">Analyze</Typography>
        <Typography variant="body1" sx={{ my: { xs: 2, md: 3 } }}>
          {" "}
          Model Insertion can analyze your repository using the following tools
        </Typography>
        <CardGrid>
          {[
            <>
              <Typography variant="h6">Papermill</Typography>
              <Typography variant="body2">
                <Link href="https://papermill.readthedocs.io/en/latest/">
                  Papermill
                </Link>{" "}
                is a Python library for running Jupyter Notebooks.
              </Typography>
              <Button variant="contained" color="primary">
                Run
              </Button>
            </>,
            <>
              <Typography variant="h6">Ipython2CWL</Typography>
              <Typography variant="body2">
                <Link href="">Ipython2CWL</Link> is a Python library for
                converting Notebooks to CWL.
              </Typography>
              <Button
                variant="contained"
                color="primary"
                disabled={loading}
                onClick={() => {
                  setLoading(true);
                  setipython(true);
                  setLoading(false);
                }}
              >
                Run
              </Button>
            </>,
          ]}
        </CardGrid>

        {ipython && component && <IPython2Cwl component={component} />}
      </Paper>
    </Container>
  );
};

export default Analyze;
