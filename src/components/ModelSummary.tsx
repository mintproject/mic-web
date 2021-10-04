import {
  Paper,
  Container,
  Box,
  TextField,
  Typography,
  Button,
} from "@mui/material";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Model, Parameter, Input } from "../types/mat";
import { MAT_API } from "./environment";
import Grid from "@mui/material/Grid";

type ModelParameter = {
  modelId: string;
};

interface InputItemGridProps {
  input: Input;
}

interface ParameterItemGridProps {
  input: Parameter;
}

interface ParameterGridProps {
  model: Model;
}

const InputGrid = (props: ParameterGridProps) => {
  return (
    <Grid container spacing={0}>
      <Grid item xs={2} md={3}>
        <Box>Name</Box>
      </Grid>
      <Grid item xs={2} md={8}>
        <Box>Description</Box>
      </Grid>
      <Grid item xs={4} md={1}>
        <Box></Box>
      </Grid>
      {props.model?.inputs?.map((input) => (
        <InputGridItem input={input} />
      ))}
    </Grid>
  );
};

const ParameterGrid = (props: ParameterGridProps) => {
  return (
    <Grid container spacing={0}>
      <Grid item xs={4} md={3}>
        <Box>Name</Box>
      </Grid>
      <Grid item xs={4} md={6}>
        <Box>Description</Box>
      </Grid>
      <Grid item xs={4} md={2}>
        <Box>Type</Box>
      </Grid>
      <Grid item xs={4} md={1}>
        <Box></Box>
      </Grid>
      {props.model?.parameters?.map((input) => (
        <ParameterGridItem key={input.id} input={input} />
      ))}
    </Grid>
  );
};

const InputGridItem = (props: InputItemGridProps) => {
  return (
    <Grid container>
      <Grid item xs={2} md={3}>
        <Box>{props.input.name}</Box>
      </Grid>
      <Grid item xs={2} md={8}>
        <Box>{props.input.description} </Box>
      </Grid>
      <Grid item xs={1} md={1}>
        <Box>
          <Link to={`/inputs/${props.input.id}`}> Edit </Link>
        </Box>
      </Grid>
    </Grid>
  );
};

const ParameterGridItem = (props: ParameterItemGridProps) => {
  return (
    <Grid container>
      <Grid item xs={2} md={3}>
        <Box>{props.input.name}</Box>
      </Grid>
      <Grid item xs={4} md={6}>
        <Box>{props.input.description}</Box>
      </Grid>
      <Grid item xs={2} md={2}>
        <Box>{props.input.type}</Box>
      </Grid>
      <Grid item xs={1} md={1}>
        <Box>
          <Link to={`/parameters/${props.input.id}`}> Edit </Link>
        </Box>
      </Grid>
    </Grid>
  );
};

const ModelSummary = () => {
  const { modelId } = useParams<ModelParameter>();
  const [model, setModel] = useState<Model>();
  const [isLoading, setLoading] = useState<Boolean>(true);

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    setModel((prevModel) => ({ ...prevModel, [name]: value }));
  }

  function handleSubmit(event: React.FormEvent<EventTarget>) {
    event.preventDefault();
  }

  useEffect(() => {
    fetch(
      `${MAT_API}/models?filter[where][id]=${modelId}&filter[include][]=inputs&filter[include][]=parameters`
    )
      .then((response) => response.json())
      .then((data) => {
        setModel(data[0]);
        setLoading(false);
      });
  }, [modelId]);

  return (
    <Container maxWidth="sm">
      {isLoading && <p>Pending</p>}
      {model && (
        <Paper
          variant="outlined"
          sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}
        >
          <Typography variant="h6" color="inherit" gutterBottom>
            Tell us about your Model
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              id="display"
              placeholder="Display Name"
              name="displayName"
              value={model?.display_name}
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
            <InputGrid model={model as Model} />

            <h3> Parameters </h3>
            <ParameterGrid model={model as Model} />

            <Button variant="contained">Save</Button>
          </form>
        </Paper>
      )}
    </Container>
  );
};

export default ModelSummary;
